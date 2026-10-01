const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const connStr = process.env.DATABASE_URL || 'postgresql://postgres.difdvbmniyhlltmdzngg:MyJobPulse%402026%23@aws-0-ap-south-1.pooler.supabase.com:6543/postgres';

async function main() {
  const pool = new Pool({
    connectionString: connStr.replace('postgresql+asyncpg://', 'postgresql://'),
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });

  const client = await pool.connect();
  console.log('[+] Connected to Supabase PostgreSQL!');

  try {
    const jsonPath = path.resolve(__dirname, '../frontend/src/lib/real_jobs.json');
    console.log(`[*] Reading real_jobs.json from: ${jsonPath}`);
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const jobs = JSON.parse(rawData);
    console.log(`[*] Total jobs in JSON: ${jobs.length}`);

    // 1. Fetch existing companies
    const compRes = await client.query('SELECT id, slug, name FROM companies');
    const companyMap = new Map();
    compRes.rows.forEach(c => companyMap.set(c.slug, c.id));
    console.log(`[*] Existing companies in DB: ${companyMap.size}`);

    // 2. Insert missing companies
    let newCompanies = 0;
    for (const j of jobs) {
      if (!j.company) continue;
      const compSlug = j.company.slug || j.company.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      if (!companyMap.has(compSlug)) {
        try {
          const insertRes = await client.query(`
            INSERT INTO companies (name, slug, website, logo_url, industry, headquarters, ats_type, employee_count_range, is_active)
            VALUES ($1, $2, $3, $4, $5, $6, 'ats', '1–50', true)
            ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
            RETURNING id
          `, [
            j.company.name,
            compSlug,
            j.company.website || null,
            j.company.logo_url || null,
            j.company.industry || 'Technology',
            j.company.headquarters || null
          ]);
          companyMap.set(compSlug, insertRes.rows[0].id);
          newCompanies++;
        } catch (cErr) {
          // ignore duplicate race
        }
      }
    }
    console.log(`[+] Added ${newCompanies} new companies.`);

    // 3. Batch insert / upsert jobs
    let added = 0;
    let updated = 0;
    console.log('[*] Inserting / updating jobs in Supabase...');

    for (let i = 0; i < jobs.length; i++) {
      const j = jobs[i];
      const compSlug = j.company?.slug || j.company?.name?.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const companyId = companyMap.get(compSlug);
      if (!companyId) continue;

      const slug = j.slug || `job-${j.id || Math.random().toString(36).substring(2, 9)}`;
      const locationJson = JSON.stringify(Array.isArray(j.location) ? j.location : (j.location ? [j.location] : []));
      const skillsJson = JSON.stringify(Array.isArray(j.skills_required) ? j.skills_required : []);
      const postedAt = j.posted_at ? new Date(j.posted_at).toISOString() : new Date().toISOString();
      const firstSeenAt = j.first_seen_at ? new Date(j.first_seen_at).toISOString() : postedAt;

      try {
        const res = await client.query(`
          INSERT INTO jobs (
            company_id, external_id, title, slug, description_html, description_text,
            location, department, employment_type, work_mode, salary_min, salary_max,
            salary_currency, salary_period, experience_min, experience_max, education,
            skills_required, job_url, apply_url, posted_at, first_seen_at, last_seen_at,
            status, view_count, created_at, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6,
            $7::json, $8, $9, $10, $11, $12,
            $13, $14, $15, $16, $17,
            $18::json, $19, $20, $21, $22, NOW(),
            'active', 1, NOW(), NOW()
          )
          ON CONFLICT (slug) DO UPDATE SET
            posted_at = EXCLUDED.posted_at,
            status = 'active',
            last_seen_at = NOW(),
            updated_at = NOW()
        `, [
          companyId,
          String(j.id || ''),
          j.title,
          slug,
          j.description_html || '',
          j.description_text || '',
          locationJson,
          j.department || null,
          j.employment_type || 'Full-time',
          j.work_mode || 'Hybrid',
          j.salary_min || null,
          j.salary_max || null,
          j.salary_currency || 'USD',
          j.salary_period || 'annual',
          j.experience_min || null,
          j.experience_max || null,
          j.education || null,
          skillsJson,
          j.job_url || '#',
          j.apply_url || j.job_url || '#',
          postedAt,
          firstSeenAt
        ]);

        added++;
        if (added % 500 === 0) {
          console.log(`    ...processed ${added} / ${jobs.length} jobs`);
        }
      } catch (jErr) {
        // console.warn('Job insert error:', jErr.message);
      }
    }

    console.log(`[+] Finished syncing ${added} jobs to Supabase!`);

    // 4. Purge jobs older than 14 days to preserve Supabase free tier storage (<500MB)
    console.log('[*] Purging jobs older than 14 days to preserve Supabase free tier storage (<500MB)...');
    const purgeRes = await client.query(`
      DELETE FROM jobs 
      WHERE (posted_at IS NOT NULL AND posted_at < NOW() - INTERVAL '14 DAYS') 
         OR (posted_at IS NULL AND first_seen_at < NOW() - INTERVAL '14 DAYS');
    `);
    console.log(`[+] Purged ${purgeRes.rowCount || 0} stale jobs.`);

    // 5. Verify new max posted_at & count
    const finalStats = await client.query('SELECT count(*), max(posted_at), min(posted_at) FROM jobs WHERE status = \'active\'');
    console.log('[+] Final Supabase Jobs Stats:', finalStats.rows[0]);

  } catch (err) {
    console.error('[-] Sync failed:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
