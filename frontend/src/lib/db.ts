import { Pool } from 'pg';
import { Job, OverviewStats } from './api';
import { sanitizeJobSkills } from './utils';

let pool: Pool | null = null;

function getPool(): Pool | null {
  const connStr = process.env.DATABASE_URL || process.env.DATABASE_DIRECT_URL;
  if (!connStr) return null;

  if (!pool) {
    const formattedUrl = connStr.replace('postgresql+asyncpg://', 'postgresql://');
    pool = new Pool({
      connectionString: formattedUrl,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 20000,
      max: 10,
    });
  }
  return pool;
}

export async function getLiveJobsFromDb(limit?: number): Promise<Job[] | null> {
  const p = getPool();
  if (!p) return null;

  try {
    const hasLimit = typeof limit === 'number' && limit > 0;
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
        '' as description_text,
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
      ${hasLimit ? 'LIMIT $1' : ''};
    `;
    const res = hasLimit ? await p.query(query, [limit]) : await p.query(query);
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
      skills_required: sanitizeJobSkills(row.skills_required, row.title, row.description_text),
      skills_preferred: Array.isArray(row.skills_preferred) ? row.skills_preferred : null,
      job_url: row.job_url || '#',
      apply_url: row.apply_url || row.job_url || '#',
      posted_at: row.posted_at ? new Date(row.posted_at).toISOString() : null,
      deadline: row.deadline ? new Date(row.deadline).toISOString() : null,
      first_seen_at: row.first_seen_at ? new Date(row.first_seen_at).toISOString() : new Date().toISOString(),
      last_seen_at: row.last_seen_at ? new Date(row.last_seen_at).toISOString() : new Date().toISOString(),
      status: row.status || 'active',
      description_html: '',
      description_text: row.description_text || '',
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
    const res = await p.query(`
      SELECT 
        (SELECT count(*) FROM jobs WHERE status = 'active') as total_jobs,
        (SELECT count(*) FROM companies WHERE is_active = true) as total_companies,
        (SELECT count(*) FROM jobs WHERE status = 'active' AND posted_at >= NOW() - INTERVAL '24 HOURS') as new_today,
        (SELECT count(*) FROM jobs WHERE status = 'active' AND posted_at >= NOW() - INTERVAL '1 HOUR') as new_this_hour;
    `);
    const row = res.rows[0];
    return {
      total_jobs: Number(row?.total_jobs || 0),
      total_companies: Number(row?.total_companies || 0),
      new_today: Number(row?.new_today || 0),
      new_this_hour: Number(row?.new_this_hour || 0),
      last_updated: new Date().toISOString(),
    };
  } catch (error) {
    console.error('getLiveStatsFromDb error:', error);
    return null;
  }
}

export async function getLiveJobBySlugFromDb(slug: string): Promise<Job | null> {
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
        j.description_html,
        j.description_text,
        j.jobpulse_rating,
        j.rating_reason,
        j.view_count,
        c.id as comp_id,
        c.name as comp_name,
        c.slug as comp_slug,
        c.logo_url as comp_logo,
        c.industry as comp_industry,
        c.headquarters as comp_hq,
        c.website as comp_website
      FROM jobs j
      JOIN companies c ON j.company_id = c.id
      WHERE j.slug = $1
      LIMIT 1;
    `;
    const res = await p.query(query, [slug]);
    if (!res.rows || res.rows.length === 0) return null;
    const row = res.rows[0];

    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      company: {
        id: row.comp_id,
        name: row.comp_name,
        slug: row.comp_slug,
        logo_url: row.comp_logo || null,
        industry: row.comp_industry || null,
        headquarters: row.comp_hq || null,
        website: row.comp_website || null,
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
      skills_required: sanitizeJobSkills(row.skills_required, row.title, row.description_text),
      skills_preferred: Array.isArray(row.skills_preferred) ? row.skills_preferred : null,
      job_url: row.job_url || '#',
      apply_url: row.apply_url || row.job_url || '#',
      posted_at: row.posted_at ? new Date(row.posted_at).toISOString() : null,
      deadline: row.deadline ? new Date(row.deadline).toISOString() : null,
      first_seen_at: row.first_seen_at ? new Date(row.first_seen_at).toISOString() : new Date().toISOString(),
      last_seen_at: row.last_seen_at ? new Date(row.last_seen_at).toISOString() : new Date().toISOString(),
      status: row.status || 'active',
      description_html: row.description_html || '',
      description_text: row.description_text || '',
      selection_process: null,
      interview_experience: null,
      work_culture_summary: null,
      study_materials: null,
      jobpulse_rating: row.jobpulse_rating || null,
      rating_reason: row.rating_reason || null,
      view_count: row.view_count || 1,
    };
  } catch (error) {
    console.error('getLiveJobBySlugFromDb error:', error);
    return null;
  }
}
