import { Pool } from 'pg';
import { Job, OverviewStats } from './api';

let pool: Pool | null = null;

function getPool(): Pool | null {
  const connStr = process.env.DATABASE_URL || process.env.DATABASE_DIRECT_URL;
  if (!connStr) return null;

  if (!pool) {
    const formattedUrl = connStr.replace('postgresql+asyncpg://', 'postgresql://');
    pool = new Pool({
      connectionString: formattedUrl,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000,
      max: 10,
    });
  }
  return pool;
}

export async function getLiveJobsFromDb(limit: number = 200000): Promise<Job[] | null> {
  const p = getPool();
  if (!p) return null;

  try {
    const query = `
      SELECT 
        j.id,
        j.title,
        j.slug,
        j.department,
        j.location,
        j.employment_type,
        j.work_mode,
        j.salary_min,
        j.salary_max,
        j.salary_currency,
        j.salary_period,
        j.experience_min,
        j.experience_max,
        j.education,
        j.eligible_batches,
        j.min_cgpa,
        j.min_percentage,
        j.backlog_allowed,
        j.skills_required,
        j.skills_preferred,
        j.job_url,
        j.apply_url,
        j.posted_at,
        j.deadline,
        j.first_seen_at,
        j.last_seen_at,
        j.status,
        j.description_text,
        j.jobpulse_rating,
        j.rating_reason,
        j.view_count,
        c.id as comp_id,
        c.name as comp_name,
        c.slug as comp_slug,
        c.logo_url as comp_logo,
        c.industry as comp_industry
      FROM jobs j
      JOIN companies c ON j.company_id = c.id
      WHERE j.status = 'active'
      ORDER BY j.posted_at DESC NULLS LAST
      LIMIT $1;
    `;
    const res = await p.query(query, [limit]);
    if (!res.rows || res.rows.length === 0) return null;

    return res.rows.map(row => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      company: {
        id: row.comp_id,
        name: row.comp_name,
        slug: row.comp_slug,
        logo_url: row.comp_logo || null,
        industry: row.comp_industry || null,
      },
      location: Array.isArray(row.location) ? row.location : typeof row.location === 'string' ? [row.location] : [],
      department: row.department || null,
      employment_type: row.employment_type || 'Full-time',
      work_mode: row.work_mode || 'In-Office',
      salary_min: row.salary_min ? Number(row.salary_min) : null,
      salary_max: row.salary_max ? Number(row.salary_max) : null,
      salary_currency: row.salary_currency || 'USD',
      salary_period: row.salary_period || 'annual',
      salary_basis: null,
      is_salary_estimated: false,
      experience_min: row.experience_min ? Number(row.experience_min) : null,
      experience_max: row.experience_max ? Number(row.experience_max) : null,
      education: row.education || null,
      eligible_batches: Array.isArray(row.eligible_batches) ? row.eligible_batches : null,
      min_cgpa: row.min_cgpa ? Number(row.min_cgpa) : null,
      min_percentage: row.min_percentage ? Number(row.min_percentage) : null,
      backlog_allowed: row.backlog_allowed ?? null,
      skills_required: Array.isArray(row.skills_required) ? row.skills_required : [],
      skills_preferred: Array.isArray(row.skills_preferred) ? row.skills_preferred : null,
      job_url: row.job_url || '#',
      apply_url: row.apply_url || row.job_url || '#',
      posted_at: row.posted_at ? new Date(row.posted_at).toISOString() : null,
      deadline: row.deadline ? new Date(row.deadline).toISOString() : null,
      first_seen_at: row.first_seen_at ? new Date(row.first_seen_at).toISOString() : new Date().toISOString(),
      last_seen_at: row.last_seen_at ? new Date(row.last_seen_at).toISOString() : new Date().toISOString(),
      status: row.status || 'active',
      description_html: '',
      description_text: row.description_text ? row.description_text.slice(0, 180) : '',
      selection_process: null,
      interview_experience: null,
      work_culture_summary: null,
      study_materials: null,
      jobpulse_rating: row.jobpulse_rating || null,
      rating_reason: row.rating_reason || null,
      view_count: row.view_count || 1,
    }));
  } catch (error) {
    console.error('getLiveJobsFromDb error:', error);
    return null;
  }
}

export async function getLiveStatsFromDb(): Promise<OverviewStats | null> {
  const p = getPool();
  if (!p) return null;

  try {
    const totalJobsRes = await p.query("SELECT count(*) FROM jobs WHERE status = 'active';");
    const totalCompsRes = await p.query("SELECT count(*) FROM companies WHERE is_active = true;");
    const newTodayRes = await p.query("SELECT count(*) FROM jobs WHERE posted_at >= NOW() - INTERVAL '24 HOURS';");
    const newThisHourRes = await p.query("SELECT count(*) FROM jobs WHERE posted_at >= NOW() - INTERVAL '1 HOUR';");

    return {
      total_jobs: Number(totalJobsRes.rows[0]?.count || 0),
      total_companies: Number(totalCompsRes.rows[0]?.count || 0),
      new_today: Number(newTodayRes.rows[0]?.count || 0),
      new_this_hour: Number(newThisHourRes.rows[0]?.count || 0),
      last_updated: new Date().toISOString(),
    };
  } catch (error) {
    console.error('getLiveStatsFromDb error:', error);
    return null;
  }
}
