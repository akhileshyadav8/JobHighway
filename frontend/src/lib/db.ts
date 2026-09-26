import { Pool } from 'pg';
import { Job, OverviewStats, Company } from './api';
import { sanitizeJobSkills } from './utils';

let pool: Pool | null = null;

export function getPool(): Pool | null {
  const connStr = process.env.DATABASE_URL || process.env.DATABASE_DIRECT_URL;
  if (!connStr) return null;

  if (!pool) {
    const formattedUrl = connStr.replace('postgresql+asyncpg://', 'postgresql://');
    pool = new Pool({
      connectionString: formattedUrl,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 10000,
      max: 5,
    });
  }
  return pool;
}

function getSafePostedAt(postedAt: any, firstSeenAt: any): string | null {
  if (!postedAt) return null;
  const pDate = new Date(postedAt);
  const now = Date.now();
  // If posted_at is in the future (due to timezone differences or scraper clock skew), fallback to first_seen_at or now
  if (pDate.getTime() > now) {
    if (firstSeenAt) {
      const fDate = new Date(firstSeenAt);
      if (fDate.getTime() <= now) return fDate.toISOString();
    }
    return new Date(now).toISOString();
  }
  return pDate.toISOString();
}


export interface JobFilterParams {
  page?: number;
  pageSize?: number;
  search?: string;
  country?: string;
  state?: string;
  city?: string;
  company?: string;
  jobType?: string;
  workMode?: string;
  experience?: string;
  salary?: string;
  sort?: string;
}

export interface PaginatedJobResult {
  items: Job[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

function mapRowToJob(row: any): Job {
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
    posted_at: getSafePostedAt(row.posted_at, row.first_seen_at),
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
    jobhighway_rating: row.jobhighway_rating || row.jobpulse_rating || null,
    jobpulse_rating: row.jobpulse_rating || row.jobhighway_rating || null,
    rating_reason: row.rating_reason || null,
    view_count: row.view_count || 1,
  };
}

export async function getLiveJobsPaginated(params: JobFilterParams = {}): Promise<PaginatedJobResult | null> {
  const p = getPool();
  if (!p) return null;

  try {
    const page = Math.max(1, Number(params.page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(params.pageSize) || 50));
    const offset = (page - 1) * pageSize;

    const conditions: string[] = [
      "j.status = 'active'",
      "((j.posted_at IS NOT NULL AND j.posted_at >= NOW() - INTERVAL '30 DAYS') OR (j.posted_at IS NULL AND j.first_seen_at >= NOW() - INTERVAL '30 DAYS'))"
    ];
    const values: any[] = [];
    let paramIdx = 1;

    // 1. Search Query
    if (params.search && params.search.trim()) {
      const term = `%${params.search.trim()}%`;
      conditions.push(`(
        j.title ILIKE $${paramIdx} OR 
        c.name ILIKE $${paramIdx} OR 
        j.description_text ILIKE $${paramIdx} OR 
        j.skills_required::text ILIKE $${paramIdx} OR 
        j.location::text ILIKE $${paramIdx}
      )`);
      values.push(term);
      paramIdx++;
    }

    // 2. Country
    if (params.country && params.country !== 'All') {
      if (params.country === 'Remote') {
        conditions.push(`(j.work_mode ILIKE '%remote%' OR j.location::text ILIKE '%remote%')`);
      } else if (params.country.toLowerCase() === 'india') {
        conditions.push(`(
          j.location::text ~* '\\mIndia\\M' OR 
          j.location::text ILIKE '%bengaluru%' OR 
          j.location::text ILIKE '%bangalore%' OR 
          j.location::text ILIKE '%mumbai%' OR 
          j.location::text ILIKE '%delhi%' OR 
          j.location::text ILIKE '%hyderabad%' OR 
          j.location::text ILIKE '%pune%' OR 
          j.location::text ILIKE '%chennai%' OR 
          j.location::text ILIKE '%noida%' OR 
          j.location::text ILIKE '%gurgaon%' OR 
          j.location::text ILIKE '%gurugram%'
        )`);
      } else if (params.country.toLowerCase() === 'united states' || params.country.toLowerCase() === 'usa') {
        conditions.push(`(
          j.location::text ~* '\\m(United States|USA|US)\\M' OR 
          j.location::text ILIKE '%san francisco%' OR 
          j.location::text ILIKE '%new york%' OR 
          j.location::text ILIKE '%seattle%' OR 
          j.location::text ILIKE '%california%' OR 
          j.location::text ILIKE '%austin%'
        )`);
      } else {
        const cTerm = `%${params.country}%`;
        conditions.push(`j.location::text ILIKE $${paramIdx}`);
        values.push(cTerm);
        paramIdx++;
      }
    }

    // 3. State
    if (params.state && params.state !== 'All') {
      const sTerm = `%${params.state}%`;
      conditions.push(`j.location::text ILIKE $${paramIdx}`);
      values.push(sTerm);
      paramIdx++;
    }

    // 4. City
    if (params.city && params.city !== 'All') {
      const cityLower = params.city.toLowerCase().trim();
      if (cityLower === 'bengaluru' || cityLower === 'bangalore') {
        conditions.push(`(j.location::text ILIKE '%bengaluru%' OR j.location::text ILIKE '%bangalore%' OR j.location::text ILIKE '%blr%')`);
      } else if (cityLower === 'gurgaon' || cityLower === 'gurugram') {
        conditions.push(`(j.location::text ILIKE '%gurgaon%' OR j.location::text ILIKE '%gurugram%')`);
      } else if (cityLower === 'delhi' || cityLower === 'new delhi') {
        conditions.push(`(j.location::text ILIKE '%delhi%' OR j.location::text ILIKE '%ncr%' OR j.location::text ILIKE '%noida%' OR j.location::text ILIKE '%gurgaon%')`);
      } else if (cityLower === 'mumbai' || cityLower === 'bombay') {
        conditions.push(`(j.location::text ILIKE '%mumbai%' OR j.location::text ILIKE '%bombay%' OR j.location::text ILIKE '%thane%')`);
      } else {
        const cityTerm = `%${params.city.trim()}%`;
        conditions.push(`j.location::text ILIKE $${paramIdx}`);
        values.push(cityTerm);
        paramIdx++;
      }
    }

    // 5. Company
    if (params.company && params.company !== 'All') {
      conditions.push(`(c.slug = $${paramIdx} OR c.name ILIKE $${paramIdx})`);
      values.push(params.company);
      paramIdx++;
    }

    // 6. Job Type
    if (params.jobType && params.jobType !== 'All') {
      const jt = `%${params.jobType}%`;
      conditions.push(`j.employment_type ILIKE $${paramIdx}`);
      values.push(jt);
      paramIdx++;
    }

    // 7. Work Mode
    if (params.workMode && params.workMode !== 'All') {
      const wm = `%${params.workMode}%`;
      conditions.push(`(j.work_mode ILIKE $${paramIdx} OR j.location::text ILIKE $${paramIdx})`);
      values.push(wm);
      paramIdx++;
    }

    // 8. Experience Level
    if (params.experience && params.experience !== 'All') {
      if (params.experience === '0-1') {
        conditions.push(`(
          (j.experience_min = 0 OR j.experience_min IS NULL OR j.title ILIKE '%intern%' OR j.title ILIKE '%fresher%' OR j.title ILIKE '%trainee%' OR j.title ILIKE '%graduate%') 
          AND (j.title NOT ILIKE '%senior%' AND j.title NOT ILIKE '%sr.%' AND j.title NOT ILIKE '%lead%' AND j.title NOT ILIKE '%principal%' AND j.title NOT ILIKE '%director%' AND j.title NOT ILIKE '%manager%')
        )`);
      } else if (params.experience === '1-3') {
        conditions.push(`(
          (j.experience_min >= 1 AND j.experience_min <= 3) 
          OR (j.experience_min IS NULL AND (j.title NOT ILIKE '%senior%' AND j.title NOT ILIKE '%sr.%' AND j.title NOT ILIKE '%lead%'))
        )`);
      } else if (params.experience === '3-5') {
        conditions.push(`(j.experience_min >= 3 AND j.experience_min <= 5)`);
      } else if (params.experience === '5+') {
        conditions.push(`(
          j.experience_min >= 5 OR 
          j.title ILIKE '%senior%' OR 
          j.title ILIKE '%sr.%' OR 
          j.title ILIKE '%lead%' OR 
          j.title ILIKE '%principal%' OR 
          j.title ILIKE '%director%'
        )`);
      }
    }

    // 9. Special Fresher + Highest Salary Preset Check
    const isFresherHighestPreset = params.sort === 'fresher_highest_salary';
    if (isFresherHighestPreset && (!params.experience || params.experience === 'All')) {
      conditions.push(`(
        (j.experience_min = 0 OR j.experience_min IS NULL OR j.title ILIKE '%intern%' OR j.title ILIKE '%fresher%' OR j.title ILIKE '%trainee%' OR j.title ILIKE '%graduate%') 
        AND (j.title NOT ILIKE '%senior%' AND j.title NOT ILIKE '%sr.%' AND j.title NOT ILIKE '%lead%' AND j.title NOT ILIKE '%principal%' AND j.title NOT ILIKE '%director%' AND j.title NOT ILIKE '%manager%')
      )`);
    }

    // 10. Salary Range
    if (params.salary && params.salary !== 'All') {
      if (params.salary === 'High Salary') {
        conditions.push(`(
          (j.salary_currency IN ('INR', '₹') AND (j.salary_max >= 1200000 OR j.salary_min >= 1200000)) OR 
          (j.salary_currency NOT IN ('INR', '₹') AND (j.salary_max >= 80000 OR j.salary_min >= 80000))
        )`);
      } else if (params.salary === 'Mid Salary') {
        conditions.push(`(
          (j.salary_currency IN ('INR', '₹') AND (j.salary_max >= 600000 OR j.salary_min >= 600000)) OR 
          (j.salary_currency NOT IN ('INR', '₹') AND (j.salary_max >= 40000 OR j.salary_min >= 40000))
        )`);
      } else if (params.salary === 'Entry Level') {
        conditions.push(`(
          (j.salary_currency IN ('INR', '₹') AND ((j.salary_max > 0 AND j.salary_max < 600000) OR j.experience_min = 0)) OR 
          (j.salary_currency NOT IN ('INR', '₹') AND ((j.salary_max > 0 AND j.salary_max < 40000) OR j.experience_min = 0))
        )`);
      }
    }

    if (params.sort === 'high_salary_newest') {
      conditions.push(`(
        (j.salary_currency IN ('INR', '₹') AND (j.salary_max >= 1200000 OR j.salary_min >= 1200000)) OR 
        (j.salary_currency NOT IN ('INR', '₹') AND (j.salary_max >= 80000 OR j.salary_min >= 80000))
      )`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // 11. Ordering - Deterministic tie-breaker on j.id prevents arbitrary PostgreSQL row shuffling
    let orderClause = 'ORDER BY LEAST(COALESCE(j.posted_at, j.first_seen_at), NOW()) DESC NULLS LAST, j.id DESC';
    if (params.sort === 'oldest') {
      orderClause = 'ORDER BY COALESCE(j.posted_at, j.first_seen_at) ASC NULLS LAST, j.id ASC';
    } else if (params.sort === 'salary_high' || isFresherHighestPreset) {
      orderClause = 'ORDER BY COALESCE(j.salary_max, j.salary_min, 0) DESC, LEAST(COALESCE(j.posted_at, j.first_seen_at), NOW()) DESC NULLS LAST, j.id DESC';
    } else if (params.sort === 'salary_low') {
      orderClause = 'ORDER BY CASE WHEN COALESCE(j.salary_min, j.salary_max, 0) > 0 THEN COALESCE(j.salary_min, j.salary_max, 0) ELSE 999999999 END ASC, LEAST(COALESCE(j.posted_at, j.first_seen_at), NOW()) DESC NULLS LAST, j.id DESC';
    } else if (params.sort === 'high_salary_newest') {
      orderClause = 'ORDER BY LEAST(COALESCE(j.posted_at, j.first_seen_at), NOW()) DESC NULLS LAST, j.id DESC';
    }

    // Count Query - only join companies if c. is referenced in whereClause to save DB compute
    const countSql = whereClause.includes('c.')
      ? `SELECT count(*) FROM jobs j JOIN companies c ON j.company_id = c.id ${whereClause};`
      : `SELECT count(*) FROM jobs j ${whereClause};`;
    const countRes = await p.query(countSql, values);
    const total = Number(countRes.rows[0]?.count || 0);

    // Items Query
    const itemsSql = `
      SELECT 
        j.id, j.title, j.slug, j.department, j.location, j.employment_type, j.work_mode,
        j.salary_min, j.salary_max, j.salary_currency, j.salary_period,
        j.experience_min, j.experience_max, j.education, j.eligible_batches,
        j.min_cgpa, j.min_percentage, j.backlog_allowed, j.skills_required, j.skills_preferred,
        j.job_url, j.apply_url, j.posted_at, j.deadline, j.first_seen_at, j.last_seen_at,
        j.status, '' as description_text, j.jobpulse_rating as jobhighway_rating, j.jobpulse_rating, j.rating_reason, j.view_count,
        c.id as comp_id, c.name as comp_name, c.slug as comp_slug, c.logo_url as comp_logo, c.industry as comp_industry
      FROM jobs j
      JOIN companies c ON j.company_id = c.id
      ${whereClause}
      ${orderClause}
      LIMIT $${paramIdx} OFFSET $${paramIdx + 1};
    `;

    const itemsValues = [...values, pageSize, offset];
    const itemsRes = await p.query(itemsSql, itemsValues);
    const items = itemsRes.rows.map(mapRowToJob);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize) || 1,
    };
  } catch (error) {
    console.error('getLiveJobsPaginated error:', error);
    return null;
  }
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
        j.jobpulse_rating as jobhighway_rating,
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
      AND ((j.posted_at IS NOT NULL AND j.posted_at >= NOW() - INTERVAL '30 DAYS') OR (j.posted_at IS NULL AND j.first_seen_at >= NOW() - INTERVAL '30 DAYS'))
      ORDER BY LEAST(COALESCE(j.posted_at, j.first_seen_at), NOW()) DESC NULLS LAST, j.id DESC
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
      posted_at: getSafePostedAt(row.posted_at, row.first_seen_at),
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
      jobhighway_rating: row.jobhighway_rating || row.jobpulse_rating || null,
      jobpulse_rating: row.jobpulse_rating || row.jobhighway_rating || null,
      rating_reason: row.rating_reason || null,
      view_count: row.view_count || 1,
    }));
  } catch (error) {
    console.error('getLiveJobsFromDb error:', error);
    return null;
  }
}

let cachedOverviewStats: { data: OverviewStats; expiresAt: number } | null = null;

export async function getLiveStatsFromDb(): Promise<OverviewStats | null> {
  const now = Date.now();
  if (cachedOverviewStats && cachedOverviewStats.expiresAt > now) {
    return cachedOverviewStats.data;
  }

  const p = getPool();
  if (!p) return null;

  try {
    const res = await p.query(`
      SELECT 
        (SELECT count(*) FROM jobs WHERE status = 'active' AND ((posted_at IS NOT NULL AND posted_at >= NOW() - INTERVAL '30 DAYS') OR (posted_at IS NULL AND first_seen_at >= NOW() - INTERVAL '30 DAYS'))) as total_jobs,
        (SELECT count(DISTINCT company_id) FROM jobs WHERE status = 'active' AND ((posted_at IS NOT NULL AND posted_at >= NOW() - INTERVAL '30 DAYS') OR (posted_at IS NULL AND first_seen_at >= NOW() - INTERVAL '30 DAYS'))) as total_companies,
        (SELECT count(*) FROM jobs WHERE status = 'active' AND posted_at >= NOW() - INTERVAL '24 HOURS') as new_today,
        (SELECT count(*) FROM jobs WHERE status = 'active' AND posted_at >= NOW() - INTERVAL '1 HOUR') as new_this_hour;
    `);
    const row = res.rows[0];
    const stats: OverviewStats = {
      total_jobs: Number(row?.total_jobs || 0),
      total_companies: Number(row?.total_companies || 0),
      new_today: Number(row?.new_today || 0),
      new_this_hour: Number(row?.new_this_hour || 0),
      last_updated: new Date().toISOString(),
    };
    cachedOverviewStats = {
      data: stats,
      expiresAt: now + 60000, // Cache for 60 seconds
    };
    return stats;
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
        j.jobpulse_rating as jobhighway_rating,
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
      posted_at: getSafePostedAt(row.posted_at, row.first_seen_at),
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
      jobhighway_rating: row.jobhighway_rating || row.jobpulse_rating || null,
      jobpulse_rating: row.jobpulse_rating || row.jobhighway_rating || null,
      rating_reason: row.rating_reason || null,
      view_count: row.view_count || 1,
    };
  } catch (error) {
    console.error('getLiveJobBySlugFromDb error:', error);
    return null;
  }
}

export async function getLiveCompaniesFromDb(): Promise<Company[] | null> {
  const p = getPool();
  if (!p) return null;

  try {
    const query = `
      SELECT 
        c.id, 
        c.name, 
        c.slug, 
        c.website, 
        c.careers_url, 
        c.logo_url, 
        c.industry, 
        c.headquarters, 
        c.employee_count_range, 
        c.description,
        count(j.id) as active_job_count
      FROM companies c
      JOIN jobs j ON j.company_id = c.id
      WHERE j.status = 'active'
      AND (j.posted_at >= NOW() - INTERVAL '30 DAYS' OR j.first_seen_at >= NOW() - INTERVAL '30 DAYS')
      GROUP BY c.id
      HAVING count(j.id) > 0
      ORDER BY active_job_count DESC;
    `;
    const res = await p.query(query);
    if (!res.rows || res.rows.length === 0) return null;

    return res.rows.map(row => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      website: row.website || '',
      careers_url: row.careers_url || null,
      logo_url: row.logo_url || null,
      industry: row.industry || 'Technology',
      headquarters: row.headquarters || null,
      employee_count_range: row.employee_count_range || null,
      description: row.description || `${row.name} is actively hiring verified talent worldwide on official career portals.`,
      active_job_count: Number(row.active_job_count || 0)
    }));
  } catch (error) {
    console.error('getLiveCompaniesFromDb error:', error);
    return null;
  }
}

export async function getLiveCompanyBySlugFromDb(slug: string): Promise<Company | null> {
  const p = getPool();
  if (!p) return null;

  try {
    const query = `
      SELECT 
        c.id, 
        c.name, 
        c.slug, 
        c.website, 
        c.careers_url, 
        c.logo_url, 
        c.industry, 
        c.headquarters, 
        c.employee_count_range, 
        c.description,
        count(j.id) as active_job_count
      FROM companies c
      LEFT JOIN jobs j ON j.company_id = c.id AND j.status = 'active' AND (j.posted_at >= NOW() - INTERVAL '30 DAYS' OR j.first_seen_at >= NOW() - INTERVAL '30 DAYS')
      WHERE c.slug = $1 OR lower(c.name) = lower($1)
      GROUP BY c.id
      LIMIT 1;
    `;
    const res = await p.query(query, [slug]);
    if (!res.rows || res.rows.length === 0) return null;
    const row = res.rows[0];

    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      website: row.website || '',
      careers_url: row.careers_url || null,
      logo_url: row.logo_url || null,
      industry: row.industry || 'Technology',
      headquarters: row.headquarters || null,
      employee_count_range: row.employee_count_range || null,
      description: row.description || `${row.name} is actively hiring verified talent worldwide on official career portals.`,
      active_job_count: Number(row.active_job_count || 0)
    };
  } catch (error) {
    console.error('getLiveCompanyBySlugFromDb error:', error);
    return null;
  }
}

export async function getLiveCompanyJobsFromDb(slug: string): Promise<Job[] | null> {
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
        '' as description_text,
        j.jobpulse_rating as jobhighway_rating,
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
      WHERE (c.slug = $1 OR lower(c.name) = lower($1))
      AND j.status = 'active'
      AND ((j.posted_at IS NOT NULL AND j.posted_at >= NOW() - INTERVAL '30 DAYS') OR (j.posted_at IS NULL AND j.first_seen_at >= NOW() - INTERVAL '30 DAYS'))
      ORDER BY LEAST(COALESCE(j.posted_at, j.first_seen_at), NOW()) DESC NULLS LAST;
    `;
    const res = await p.query(query, [slug]);
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
      posted_at: getSafePostedAt(row.posted_at, row.first_seen_at),
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
      jobhighway_rating: row.jobhighway_rating || row.jobpulse_rating || null,
      jobpulse_rating: row.jobpulse_rating || row.jobhighway_rating || null,
      rating_reason: row.rating_reason || null,
      view_count: row.view_count || 1,
    }));
  } catch (error) {
    console.error('getLiveCompanyJobsFromDb error:', error);
    return null;
  }
}
