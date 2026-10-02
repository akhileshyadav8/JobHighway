import { Pool } from 'pg';
import { Job, OverviewStats, Company } from './api';
import { sanitizeJobSkills } from './utils';
import { CandidateRecommendationProfile, detectCandidateDomain } from './recommendationEngine';

let pool: Pool | null = null;

export function getPool(): Pool | null {
  const connStr = process.env.DATABASE_URL || process.env.DATABASE_DIRECT_URL;
  if (!connStr) return null;

  if (!pool) {
    const formattedUrl = connStr.replace('postgresql+asyncpg://', 'postgresql://');
    pool = new Pool({
      connectionString: formattedUrl,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 15000,
      idleTimeoutMillis: 30000,
      max: 10,
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
  fresh?: boolean | string;
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

export function getCountryConditionSql(country: string): { condition: string; paramVal?: string } | null {
  if (!country || country === 'All') return null;
  const c = country.trim().toLowerCase();

  if (c === 'remote') {
    return { condition: `(j.work_mode ILIKE '%remote%' OR j.location::text ILIKE '%remote%')` };
  }
  if (c === 'india') {
    return {
      condition: `(
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
      )`
    };
  }
  if (c === 'united states' || c === 'usa' || c === 'us') {
    return {
      condition: `(
        j.location::text ~* '\\m(United States|USA|US)\\M' OR 
        j.location::text ILIKE '%san francisco%' OR 
        j.location::text ILIKE '%new york%' OR 
        j.location::text ILIKE '%seattle%' OR 
        j.location::text ILIKE '%california%' OR 
        j.location::text ILIKE '%austin%'
      )`
    };
  }
  if (c === 'united kingdom' || c === 'uk' || c === 'great britain' || c === 'england') {
    return {
      condition: `(j.location::text ILIKE '%united kingdom%' OR j.location::text ILIKE '%london%' OR j.location::text ILIKE '%manchester%' OR j.location::text ILIKE '%edinburgh%' OR j.location::text ILIKE '%birmingham%' OR j.location::text ~* '\\m(UK|England|Scotland|Wales)\\M')`
    };
  }
  if (c === 'germany' || c === 'deutschland') {
    return {
      condition: `(j.location::text ILIKE '%germany%' OR j.location::text ILIKE '%berlin%' OR j.location::text ILIKE '%munich%' OR j.location::text ILIKE '%münchen%' OR j.location::text ILIKE '%frankfurt%' OR j.location::text ILIKE '%hamburg%' OR j.location::text ILIKE '%deutschland%')`
    };
  }
  if (c === 'canada') {
    return {
      condition: `(j.location::text ILIKE '%canada%' OR j.location::text ILIKE '%toronto%' OR j.location::text ILIKE '%vancouver%' OR j.location::text ILIKE '%montreal%' OR j.location::text ILIKE '%ottawa%')`
    };
  }
  if (c === 'australia') {
    return {
      condition: `(j.location::text ILIKE '%australia%' OR j.location::text ILIKE '%sydney%' OR j.location::text ILIKE '%melbourne%' OR j.location::text ILIKE '%brisbane%')`
    };
  }
  if (c === 'singapore') {
    return {
      condition: `(j.location::text ILIKE '%singapore%')`
    };
  }
  if (c === 'netherlands' || c === 'nederland' || c === 'holland') {
    return {
      condition: `(j.location::text ILIKE '%netherlands%' OR j.location::text ILIKE '%amsterdam%' OR j.location::text ILIKE '%rotterdam%')`
    };
  }
  if (c === 'france') {
    return {
      condition: `(j.location::text ILIKE '%france%' OR j.location::text ILIKE '%paris%' OR j.location::text ILIKE '%lyon%')`
    };
  }
  if (c === 'brazil' || c === 'brasil') {
    return {
      condition: `(j.location::text ILIKE '%brazil%' OR j.location::text ILIKE '%brasil%' OR j.location::text ILIKE '%são paulo%' OR j.location::text ILIKE '%sao paulo%')`
    };
  }
  if (c === 'italy' || c === 'italia') {
    return {
      condition: `(j.location::text ILIKE '%italy%' OR j.location::text ILIKE '%italia%' OR j.location::text ILIKE '%milan%' OR j.location::text ILIKE '%rome%')`
    };
  }
  if (c === 'spain' || c === 'españa') {
    return {
      condition: `(j.location::text ILIKE '%spain%' OR j.location::text ILIKE '%españa%' OR j.location::text ILIKE '%madrid%' OR j.location::text ILIKE '%barcelona%')`
    };
  }
  if (c === 'switzerland' || c === 'schweiz') {
    return {
      condition: `(j.location::text ILIKE '%switzerland%' OR j.location::text ILIKE '%schweiz%' OR j.location::text ILIKE '%zurich%' OR j.location::text ILIKE '%geneva%')`
    };
  }
  if (c === 'poland' || c === 'polska') {
    return {
      condition: `(j.location::text ILIKE '%poland%' OR j.location::text ILIKE '%polska%' OR j.location::text ILIKE '%warsaw%')`
    };
  }
  if (c === 'ireland') {
    return {
      condition: `(j.location::text ILIKE '%ireland%' OR j.location::text ILIKE '%dublin%')`
    };
  }
  return { condition: `j.location::text ILIKE $PARAM`, paramVal: `%${country}%` };
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
      "((j.posted_at IS NOT NULL AND j.posted_at >= NOW() - INTERVAL '14 DAYS') OR (j.posted_at IS NULL AND j.first_seen_at >= NOW() - INTERVAL '14 DAYS'))"
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

    // 2. Country (Canonical city/country alias matching matching stats & facets)
    if (params.country && params.country !== 'All') {
      const cCond = getCountryConditionSql(params.country);
      if (cCond) {
        if (cCond.paramVal) {
          conditions.push(cCond.condition.replace('$PARAM', `$${paramIdx}`));
          values.push(cCond.paramVal);
          paramIdx++;
        } else {
          conditions.push(cCond.condition);
        }
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

    // 6. Fresh (<24h) Filter
    if (params.fresh === true || params.fresh === 'true' || params.fresh === '1') {
      conditions.push("(j.posted_at >= NOW() - INTERVAL '24 HOURS' OR (j.posted_at IS NULL AND j.first_seen_at >= NOW() - INTERVAL '24 HOURS'))");
    }

    // 7. Job Type (Normalized matching for Full-time, Part-time, Contract, Internship)
    if (params.jobType && params.jobType !== 'All') {
      const jtRaw = params.jobType.toLowerCase().replace(/[-_]/g, ' ').trim();
      if (jtRaw.includes('full')) {
        conditions.push(`(j.employment_type ILIKE '%full%' OR j.title ILIKE '%full-time%' OR j.title ILIKE '%full time%')`);
      } else if (jtRaw.includes('part')) {
        conditions.push(`(j.employment_type ILIKE '%part%' OR j.title ILIKE '%part-time%' OR j.title ILIKE '%part time%')`);
      } else if (jtRaw.includes('intern')) {
        conditions.push(`(j.employment_type ILIKE '%intern%' OR j.title ILIKE '%intern%')`);
      } else if (jtRaw.includes('contract')) {
        conditions.push(`(j.employment_type ILIKE '%contract%' OR j.title ILIKE '%contract%')`);
      } else {
        const jt = `%${params.jobType}%`;
        conditions.push(`(j.employment_type ILIKE $${paramIdx} OR j.title ILIKE $${paramIdx})`);
        values.push(jt);
        paramIdx++;
      }
    }

    // 8. Work Mode (Normalized matching: On-site / In-Office, Remote, Hybrid)
    if (params.workMode && params.workMode !== 'All') {
      const wmRaw = params.workMode.toLowerCase().replace(/[-_]/g, '').trim();
      if (wmRaw.includes('onsite') || wmRaw.includes('inoffice') || wmRaw.includes('office')) {
        conditions.push(`(
          j.work_mode IN ('In-Office', 'On-site', 'Onsite', 'Office') 
          OR j.work_mode ILIKE '%office%' 
          OR j.work_mode ILIKE '%onsite%' 
          OR j.location::text ILIKE '%in-office%' 
          OR j.location::text ILIKE '%on-site%'
        )`);
      } else if (wmRaw.includes('remote')) {
        conditions.push(`(j.work_mode ILIKE '%remote%' OR j.location::text ILIKE '%remote%')`);
      } else if (wmRaw.includes('hybrid')) {
        conditions.push(`(j.work_mode ILIKE '%hybrid%' OR j.location::text ILIKE '%hybrid%')`);
      } else {
        const wm = `%${params.workMode}%`;
        conditions.push(`(j.work_mode ILIKE $${paramIdx} OR j.location::text ILIKE $${paramIdx})`);
        values.push(wm);
        paramIdx++;
      }
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
      AND ((j.posted_at IS NOT NULL AND j.posted_at >= NOW() - INTERVAL '14 DAYS') OR (j.posted_at IS NULL AND j.first_seen_at >= NOW() - INTERVAL '14 DAYS'))
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
        (SELECT count(*) FROM jobs WHERE status = 'active' AND ((posted_at IS NOT NULL AND posted_at >= NOW() - INTERVAL '14 DAYS') OR (posted_at IS NULL AND first_seen_at >= NOW() - INTERVAL '14 DAYS'))) as total_jobs,
        (SELECT count(DISTINCT company_id) FROM jobs WHERE status = 'active' AND ((posted_at IS NOT NULL AND posted_at >= NOW() - INTERVAL '14 DAYS') OR (posted_at IS NULL AND first_seen_at >= NOW() - INTERVAL '14 DAYS'))) as total_companies,
        (SELECT count(*) FROM jobs WHERE status = 'active' AND posted_at >= NOW() - INTERVAL '24 HOURS') as new_today,
        (SELECT count(*) FROM jobs WHERE status = 'active' AND posted_at >= NOW() - INTERVAL '1 HOUR') as new_this_hour,
        (SELECT count(*) FROM jobs WHERE status = 'active' AND posted_at >= NOW() - INTERVAL '7 DAYS') as new_7d,
        (SELECT count(*) FROM jobs WHERE status = 'expired' OR ((posted_at IS NOT NULL AND posted_at < NOW() - INTERVAL '14 DAYS') OR (posted_at IS NULL AND first_seen_at < NOW() - INTERVAL '14 DAYS'))) as expired_jobs,
        (SELECT count(*) FROM jobs WHERE status = 'active' AND ((posted_at IS NOT NULL AND posted_at >= NOW() - INTERVAL '14 DAYS') OR (posted_at IS NULL AND first_seen_at >= NOW() - INTERVAL '14 DAYS')) AND (employment_type ILIKE '%full%' OR title ILIKE '%full-time%' OR title ILIKE '%full time%')) as count_full_time,
        (SELECT count(*) FROM jobs WHERE status = 'active' AND ((posted_at IS NOT NULL AND posted_at >= NOW() - INTERVAL '14 DAYS') OR (posted_at IS NULL AND first_seen_at >= NOW() - INTERVAL '14 DAYS')) AND (employment_type ILIKE '%part%' OR title ILIKE '%part-time%' OR title ILIKE '%part time%')) as count_part_time,
        (SELECT count(*) FROM jobs WHERE status = 'active' AND ((posted_at IS NOT NULL AND posted_at >= NOW() - INTERVAL '14 DAYS') OR (posted_at IS NULL AND first_seen_at >= NOW() - INTERVAL '14 DAYS')) AND (employment_type ILIKE '%contract%' OR title ILIKE '%contract%')) as count_contract,
        (SELECT count(*) FROM jobs WHERE status = 'active' AND ((posted_at IS NOT NULL AND posted_at >= NOW() - INTERVAL '14 DAYS') OR (posted_at IS NULL AND first_seen_at >= NOW() - INTERVAL '14 DAYS')) AND (employment_type ILIKE '%intern%' OR title ILIKE '%intern%')) as count_internship,
        (SELECT count(*) FROM jobs WHERE status = 'active' AND ((posted_at IS NOT NULL AND posted_at >= NOW() - INTERVAL '14 DAYS') OR (posted_at IS NULL AND first_seen_at >= NOW() - INTERVAL '14 DAYS')) AND (work_mode IN ('In-Office', 'On-site', 'Onsite', 'Office') OR work_mode ILIKE '%office%' OR work_mode ILIKE '%onsite%' OR location::text ILIKE '%in-office%' OR location::text ILIKE '%on-site%')) as count_onsite,
        (SELECT count(*) FROM jobs WHERE status = 'active' AND ((posted_at IS NOT NULL AND posted_at >= NOW() - INTERVAL '14 DAYS') OR (posted_at IS NULL AND first_seen_at >= NOW() - INTERVAL '14 DAYS')) AND (work_mode ILIKE '%remote%' OR location::text ILIKE '%remote%')) as count_remote,
        (SELECT count(*) FROM jobs WHERE status = 'active' AND ((posted_at IS NOT NULL AND posted_at >= NOW() - INTERVAL '14 DAYS') OR (posted_at IS NULL AND first_seen_at >= NOW() - INTERVAL '14 DAYS')) AND (work_mode ILIKE '%hybrid%' OR location::text ILIKE '%hybrid%')) as count_hybrid,
        (SELECT count(*) FROM jobs WHERE status = 'active' AND ((posted_at IS NOT NULL AND posted_at >= NOW() - INTERVAL '14 DAYS') OR (posted_at IS NULL AND first_seen_at >= NOW() - INTERVAL '14 DAYS')) AND ${getCountryConditionSql('usa')!.condition.replace(/j\./g, '')}) as count_us,
        (SELECT count(*) FROM jobs WHERE status = 'active' AND ((posted_at IS NOT NULL AND posted_at >= NOW() - INTERVAL '14 DAYS') OR (posted_at IS NULL AND first_seen_at >= NOW() - INTERVAL '14 DAYS')) AND ${getCountryConditionSql('india')!.condition.replace(/j\./g, '')}) as count_india,
        (SELECT count(*) FROM jobs WHERE status = 'active' AND ((posted_at IS NOT NULL AND posted_at >= NOW() - INTERVAL '14 DAYS') OR (posted_at IS NULL AND first_seen_at >= NOW() - INTERVAL '14 DAYS')) AND ${getCountryConditionSql('canada')!.condition.replace(/j\./g, '')}) as count_canada,
        (SELECT count(*) FROM jobs WHERE status = 'active' AND ((posted_at IS NOT NULL AND posted_at >= NOW() - INTERVAL '14 DAYS') OR (posted_at IS NULL AND first_seen_at >= NOW() - INTERVAL '14 DAYS')) AND ${getCountryConditionSql('uk')!.condition.replace(/j\./g, '')}) as count_uk,
        (SELECT count(*) FROM jobs WHERE status = 'active' AND ((posted_at IS NOT NULL AND posted_at >= NOW() - INTERVAL '14 DAYS') OR (posted_at IS NULL AND first_seen_at >= NOW() - INTERVAL '14 DAYS')) AND ${getCountryConditionSql('germany')!.condition.replace(/j\./g, '')}) as count_germany,
        (SELECT count(*) FROM jobs WHERE status = 'active' AND ((posted_at IS NOT NULL AND posted_at >= NOW() - INTERVAL '14 DAYS') OR (posted_at IS NULL AND first_seen_at >= NOW() - INTERVAL '14 DAYS')) AND ${getCountryConditionSql('australia')!.condition.replace(/j\./g, '')}) as count_australia,
        (SELECT count(*) FROM jobs WHERE status = 'active' AND ((posted_at IS NOT NULL AND posted_at >= NOW() - INTERVAL '14 DAYS') OR (posted_at IS NULL AND first_seen_at >= NOW() - INTERVAL '14 DAYS')) AND ${getCountryConditionSql('singapore')!.condition.replace(/j\./g, '')}) as count_singapore,
        (SELECT count(*) FROM jobs WHERE status = 'active' AND ((posted_at IS NOT NULL AND posted_at >= NOW() - INTERVAL '14 DAYS') OR (posted_at IS NULL AND first_seen_at >= NOW() - INTERVAL '14 DAYS')) AND ${getCountryConditionSql('netherlands')!.condition.replace(/j\./g, '')}) as count_netherlands,
        (SELECT count(*) FROM jobs WHERE status = 'active' AND ((posted_at IS NOT NULL AND posted_at >= NOW() - INTERVAL '14 DAYS') OR (posted_at IS NULL AND first_seen_at >= NOW() - INTERVAL '14 DAYS')) AND ${getCountryConditionSql('france')!.condition.replace(/j\./g, '')}) as count_france;
    `);
    const row = res.rows[0];
    const stats: OverviewStats = {
      total_jobs: Number(row?.total_jobs || 0),
      total_companies: Number(row?.total_companies || 0),
      new_today: Number(row?.new_today || 0),
      new_this_hour: Number(row?.new_this_hour || 0),
      new_7d: Number(row?.new_7d || 0),
      expired_jobs: Number(row?.expired_jobs || 0),
      filter_counts: {
        full_time: Number(row?.count_full_time || 0),
        part_time: Number(row?.count_part_time || 0),
        contract: Number(row?.count_contract || 0),
        internship: Number(row?.count_internship || 0),
        onsite: Number(row?.count_onsite || 0),
        remote: Number(row?.count_remote || 0),
        hybrid: Number(row?.count_hybrid || 0),
        us: Number(row?.count_us || 0),
        india: Number(row?.count_india || 0),
        canada: Number(row?.count_canada || 0),
        uk: Number(row?.count_uk || 0),
        germany: Number(row?.count_germany || 0),
        australia: Number(row?.count_australia || 0),
        singapore: Number(row?.count_singapore || 0),
        netherlands: Number(row?.count_netherlands || 0),
        france: Number(row?.count_france || 0),
      },
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

// JobFacets type (same shape as JobFacets in api.ts — kept in sync manually to avoid circular import)
type JobFacets = {
  total: number;
  total_no_country: number;
  full_time: number; part_time: number; contract: number; internship: number;
  onsite: number; remote: number; hybrid: number;
  us: number; india: number; canada: number; uk: number; germany: number;
  australia: number; singapore: number; netherlands: number; france: number;
};

/**
 * Builds the 14-day base WHERE conditions + any active filter conditions (same logic as getLiveJobsPaginated)
 * but EXCLUDES a specific dimension so we can count that dimension cross-tabulated.
 * Returns { whereClause, values } ready to use in SQL.
 */
function buildFacetConditions(
  params: JobFilterParams,
  excludeDimension?: 'country' | 'jobType' | 'workMode'
): { conditions: string[]; values: any[]; paramIdx: number } {
  const conditions: string[] = [
    "j.status = 'active'",
    "((j.posted_at IS NOT NULL AND j.posted_at >= NOW() - INTERVAL '14 DAYS') OR (j.posted_at IS NULL AND j.first_seen_at >= NOW() - INTERVAL '14 DAYS'))"
  ];
  const values: any[] = [];
  let paramIdx = 1;

  // Search
  if (params.search && params.search.trim()) {
    const term = `%${params.search.trim()}%`;
    conditions.push(`(j.title ILIKE $${paramIdx} OR j.description_text ILIKE $${paramIdx} OR j.skills_required::text ILIKE $${paramIdx} OR j.location::text ILIKE $${paramIdx})`);
    values.push(term);
    paramIdx++;
  }

  // Country (excluded when counting country facets)
  if (excludeDimension !== 'country' && params.country && params.country !== 'All') {
    const cCond = getCountryConditionSql(params.country);
    if (cCond) {
      if (cCond.paramVal) {
        conditions.push(cCond.condition.replace('$PARAM', `$${paramIdx}`));
        values.push(cCond.paramVal);
        paramIdx++;
      } else {
        conditions.push(cCond.condition);
      }
    }
  }

  // Job Type (excluded when counting job type facets)
  if (excludeDimension !== 'jobType' && params.jobType && params.jobType !== 'All') {
    const jtRaw = params.jobType.toLowerCase().replace(/[-_]/g, ' ').trim();
    if (jtRaw.includes('full')) {
      conditions.push(`(j.employment_type ILIKE '%full%' OR j.title ILIKE '%full-time%' OR j.title ILIKE '%full time%')`);
    } else if (jtRaw.includes('part')) {
      conditions.push(`(j.employment_type ILIKE '%part%' OR j.title ILIKE '%part-time%' OR j.title ILIKE '%part time%')`);
    } else if (jtRaw.includes('intern')) {
      conditions.push(`(j.employment_type ILIKE '%intern%' OR j.title ILIKE '%intern%')`);
    } else if (jtRaw.includes('contract')) {
      conditions.push(`(j.employment_type ILIKE '%contract%' OR j.title ILIKE '%contract%')`);
    } else {
      const jt = `%${params.jobType}%`;
      conditions.push(`(j.employment_type ILIKE $${paramIdx} OR j.title ILIKE $${paramIdx})`);
      values.push(jt);
      paramIdx++;
    }
  }

  // Work Mode (excluded when counting work mode facets)
  if (excludeDimension !== 'workMode' && params.workMode && params.workMode !== 'All') {
    const wmRaw = params.workMode.toLowerCase().replace(/[-_]/g, '').trim();
    if (wmRaw.includes('onsite') || wmRaw.includes('inoffice') || wmRaw.includes('office')) {
      conditions.push(`(j.work_mode IN ('In-Office', 'On-site', 'Onsite', 'Office') OR j.work_mode ILIKE '%office%' OR j.work_mode ILIKE '%onsite%' OR j.location::text ILIKE '%in-office%' OR j.location::text ILIKE '%on-site%')`);
    } else if (wmRaw.includes('remote')) {
      conditions.push(`(j.work_mode ILIKE '%remote%' OR j.location::text ILIKE '%remote%')`);
    } else if (wmRaw.includes('hybrid')) {
      conditions.push(`(j.work_mode ILIKE '%hybrid%' OR j.location::text ILIKE '%hybrid%')`);
    } else {
      const wm = `%${params.workMode}%`;
      conditions.push(`(j.work_mode ILIKE $${paramIdx} OR j.location::text ILIKE $${paramIdx})`);
      values.push(wm);
      paramIdx++;
    }
  }

  // Fresh filter
  if (params.fresh === true || params.fresh === 'true' || params.fresh === '1') {
    conditions.push("(j.posted_at >= NOW() - INTERVAL '24 HOURS' OR (j.posted_at IS NULL AND j.first_seen_at >= NOW() - INTERVAL '24 HOURS'))");
  }

  // Experience
  if (params.experience && params.experience !== 'All') {
    if (params.experience === '0-1') {
      conditions.push(`((j.experience_min = 0 OR j.experience_min IS NULL OR j.title ILIKE '%intern%' OR j.title ILIKE '%fresher%' OR j.title ILIKE '%trainee%' OR j.title ILIKE '%graduate%') AND (j.title NOT ILIKE '%senior%' AND j.title NOT ILIKE '%sr.%' AND j.title NOT ILIKE '%lead%' AND j.title NOT ILIKE '%principal%' AND j.title NOT ILIKE '%director%' AND j.title NOT ILIKE '%manager%'))`);
    } else if (params.experience === '1-3') {
      conditions.push(`(j.experience_min >= 1 AND j.experience_min <= 3)`);
    } else if (params.experience === '3-5') {
      conditions.push(`(j.experience_min >= 3 AND j.experience_min <= 5)`);
    } else if (params.experience === '5+') {
      conditions.push(`(j.experience_min >= 5 OR j.title ILIKE '%senior%' OR j.title ILIKE '%sr.%' OR j.title ILIKE '%lead%' OR j.title ILIKE '%principal%' OR j.title ILIKE '%director%')`);
    }
  }

  return { conditions, values, paramIdx };
}

export async function getLiveJobFacets(params: JobFilterParams = {}): Promise<JobFacets | null> {
  const p = getPool();
  if (!p) return null;

  try {
    // Base context: all active filters combined (for the total count)
    const baseCtx = buildFacetConditions(params);
    const baseWhere = `WHERE ${baseCtx.conditions.join(' AND ')}`;

    // Context without country filter — for counting country facets
    const ctxNoCountry = buildFacetConditions(params, 'country');
    const whereNoCountry = `WHERE ${ctxNoCountry.conditions.join(' AND ')}`;

    // Context without jobType filter — for counting jobType facets
    const ctxNoJobType = buildFacetConditions(params, 'jobType');
    const whereNoJobType = `WHERE ${ctxNoJobType.conditions.join(' AND ')}`;

    // Context without workMode filter — for counting workMode facets
    const ctxNoWorkMode = buildFacetConditions(params, 'workMode');
    const whereNoWorkMode = `WHERE ${ctxNoWorkMode.conditions.join(' AND ')}`;

    // Run all counts in a single SQL statement using inline subqueries per filtered context.
    // IMPORTANT: Each subquery uses its own parameter set — we embed each WHERE clause
    // using separate queries to avoid paramIdx collision across different CTEs.
    // We batch them into 4 DB calls (one per dimension context) and combine results.

    const [totalRes, jobTypeRes, workModeRes, countryRes] = await Promise.all([
      // 1. Total count under full filter
      p.query(`SELECT count(*)::int as total FROM jobs j ${baseWhere}`, baseCtx.values),

      // 2. Job Type counts (with country + workMode + experience applied, but NOT jobType)
      p.query(`
        SELECT
          count(*) FILTER (WHERE j.employment_type ILIKE '%full%' OR j.title ILIKE '%full-time%' OR j.title ILIKE '%full time%')::int as full_time,
          count(*) FILTER (WHERE j.employment_type ILIKE '%part%' OR j.title ILIKE '%part-time%' OR j.title ILIKE '%part time%')::int as part_time,
          count(*) FILTER (WHERE j.employment_type ILIKE '%contract%' OR j.title ILIKE '%contract%')::int as contract,
          count(*) FILTER (WHERE j.employment_type ILIKE '%intern%' OR j.title ILIKE '%intern%')::int as internship
        FROM jobs j ${whereNoJobType}
      `, ctxNoJobType.values),

      // 3. Work Mode counts (with country + jobType + experience applied, but NOT workMode)
      p.query(`
        SELECT
          count(*) FILTER (WHERE j.work_mode IN ('In-Office', 'On-site', 'Onsite', 'Office') OR j.work_mode ILIKE '%office%' OR j.work_mode ILIKE '%onsite%' OR j.location::text ILIKE '%in-office%' OR j.location::text ILIKE '%on-site%')::int as onsite,
          count(*) FILTER (WHERE j.work_mode ILIKE '%remote%' OR j.location::text ILIKE '%remote%')::int as remote,
          count(*) FILTER (WHERE j.work_mode ILIKE '%hybrid%' OR j.location::text ILIKE '%hybrid%')::int as hybrid
        FROM jobs j ${whereNoWorkMode}
      `, ctxNoWorkMode.values),

      // 4. Country counts (with jobType + workMode + experience applied, but NOT country)
      p.query(`
        SELECT
          count(*)::int as total_no_country,
          count(*) FILTER (WHERE ${getCountryConditionSql('usa')!.condition})::int as us,
          count(*) FILTER (WHERE ${getCountryConditionSql('india')!.condition})::int as india,
          count(*) FILTER (WHERE ${getCountryConditionSql('canada')!.condition})::int as canada,
          count(*) FILTER (WHERE ${getCountryConditionSql('uk')!.condition})::int as uk,
          count(*) FILTER (WHERE ${getCountryConditionSql('germany')!.condition})::int as germany,
          count(*) FILTER (WHERE ${getCountryConditionSql('australia')!.condition})::int as australia,
          count(*) FILTER (WHERE ${getCountryConditionSql('singapore')!.condition})::int as singapore,
          count(*) FILTER (WHERE ${getCountryConditionSql('netherlands')!.condition})::int as netherlands,
          count(*) FILTER (WHERE ${getCountryConditionSql('france')!.condition})::int as france
        FROM jobs j ${whereNoCountry}
      `, ctxNoCountry.values),
    ]);

    const tr = totalRes.rows[0];
    const jtr = jobTypeRes.rows[0];
    const wmr = workModeRes.rows[0];
    const cr = countryRes.rows[0];

    return {
      total: Number(tr?.total || 0),
      total_no_country: Number(cr?.total_no_country || 0),
      full_time: Number(jtr?.full_time || 0),
      part_time: Number(jtr?.part_time || 0),
      contract: Number(jtr?.contract || 0),
      internship: Number(jtr?.internship || 0),
      onsite: Number(wmr?.onsite || 0),
      remote: Number(wmr?.remote || 0),
      hybrid: Number(wmr?.hybrid || 0),
      us: Number(cr?.us || 0),
      india: Number(cr?.india || 0),
      canada: Number(cr?.canada || 0),
      uk: Number(cr?.uk || 0),
      germany: Number(cr?.germany || 0),
      australia: Number(cr?.australia || 0),
      singapore: Number(cr?.singapore || 0),
      netherlands: Number(cr?.netherlands || 0),
      france: Number(cr?.france || 0),
    };
  } catch (error) {
    console.error('getLiveJobFacets error:', error);
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
        count(j.id) as active_job_count,
        count(CASE WHEN j.work_mode ILIKE '%remote%' OR j.location::text ILIKE '%remote%' THEN 1 END) as remote_job_count,
        count(CASE WHEN j.employment_type ILIKE '%intern%' OR j.title ILIKE '%intern%' THEN 1 END) as internship_job_count,
        count(CASE WHEN (j.experience_min = 0 OR j.experience_min IS NULL OR j.title ILIKE '%intern%' OR j.title ILIKE '%fresher%' OR j.title ILIKE '%trainee%' OR j.title ILIKE '%graduate%') AND (j.title NOT ILIKE '%senior%' AND j.title NOT ILIKE '%sr.%' AND j.title NOT ILIKE '%lead%') THEN 1 END) as fresher_job_count
      FROM companies c
      JOIN jobs j ON j.company_id = c.id
      WHERE j.status = 'active'
      AND ((j.posted_at IS NOT NULL AND j.posted_at >= NOW() - INTERVAL '14 DAYS') OR (j.posted_at IS NULL AND j.first_seen_at >= NOW() - INTERVAL '14 DAYS'))
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
      employee_count_range: row.employee_count_range || '1–50',
      description: row.description || `${row.name} is actively hiring verified talent worldwide on official career portals.`,
      active_job_count: Number(row.active_job_count || 0),
      remote_job_count: Number(row.remote_job_count || 0),
      internship_job_count: Number(row.internship_job_count || 0),
      fresher_job_count: Number(row.fresher_job_count || 0),
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
      LEFT JOIN jobs j ON j.company_id = c.id AND j.status = 'active' AND (j.posted_at >= NOW() - INTERVAL '14 DAYS' OR j.first_seen_at >= NOW() - INTERVAL '14 DAYS')
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
      AND ((j.posted_at IS NOT NULL AND j.posted_at >= NOW() - INTERVAL '14 DAYS') OR (j.posted_at IS NULL AND j.first_seen_at >= NOW() - INTERVAL '14 DAYS'))
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

export async function getCandidateRecommendationPool(
  profile: CandidateRecommendationProfile,
  limit: number = 150
): Promise<Job[]> {
  const p = getPool();
  if (!p) return [];

  try {
    const candidateDomain = detectCandidateDomain(profile);
    const conditions: string[] = ["j.status = 'active'"];
    const values: any[] = [];
    let paramIdx = 1;

    // Filter by freshness (active in last 45 days)
    conditions.push("((j.posted_at IS NOT NULL AND j.posted_at >= NOW() - INTERVAL '45 DAYS') OR (j.posted_at IS NULL AND j.first_seen_at >= NOW() - INTERVAL '45 DAYS'))");

    // Build role/domain/skill targeting conditions
    const matchOrClauses: string[] = [];

    // 1. Direct Target Role
    if (profile.targetRole && profile.targetRole.trim().length > 1) {
      matchOrClauses.push(`j.title ILIKE $${paramIdx}`);
      values.push(`%${profile.targetRole.trim()}%`);
      paramIdx++;
    }

    // 2. Candidate Current Role
    if (profile.currentRole && profile.currentRole.trim().length > 1) {
      matchOrClauses.push(`j.title ILIKE $${paramIdx}`);
      values.push(`%${profile.currentRole.trim()}%`);
      paramIdx++;
    }

    // 3. Domain Core Keywords
    if (candidateDomain && candidateDomain.coreKeywords.length > 0) {
      const topKeywords = candidateDomain.coreKeywords.slice(0, 5);
      for (const kw of topKeywords) {
        matchOrClauses.push(`j.title ILIKE $${paramIdx}`);
        values.push(`%${kw}%`);
        paramIdx++;
      }
    }

    // 4. Candidate Skills Overlap
    if (profile.skills && profile.skills.length > 0) {
      const topSkills = profile.skills.slice(0, 8);
      for (const sk of topSkills) {
        const cleaned = sk.trim();
        if (cleaned.length > 1) {
          matchOrClauses.push(`j.skills_required::text ILIKE $${paramIdx}`);
          values.push(`%${cleaned}%`);
          paramIdx++;
        }
      }
    }

    if (matchOrClauses.length > 0) {
      conditions.push(`(${matchOrClauses.join(' OR ')})`);
    }

    // 5. Exclude negative keywords if domain has them
    if (candidateDomain && candidateDomain.negativeKeywords.length > 0) {
      for (const neg of candidateDomain.negativeKeywords.slice(0, 8)) {
        conditions.push(`j.title NOT ILIKE $${paramIdx}`);
        values.push(`%${neg}%`);
        paramIdx++;
      }
    }

    // 6. Location preference affinity
    if (profile.preferredLocation && profile.preferredLocation.trim().length > 1) {
      const pLoc = profile.preferredLocation.toLowerCase().trim();
      if (pLoc.includes('india')) {
        conditions.push(`(
          j.work_mode ILIKE '%remote%' OR 
          j.location::text ILIKE '%remote%' OR
          j.location::text ILIKE '%india%' OR
          j.location::text ILIKE '%bengaluru%' OR
          j.location::text ILIKE '%bangalore%' OR
          j.location::text ILIKE '%mumbai%' OR
          j.location::text ILIKE '%delhi%' OR
          j.location::text ILIKE '%hyderabad%' OR
          j.location::text ILIKE '%pune%' OR
          j.location::text ILIKE '%noida%' OR
          j.location::text ILIKE '%gurgaon%' OR
          j.location::text ILIKE '%chennai%'
        )`);
      } else if (pLoc.includes('remote')) {
        conditions.push(`(j.work_mode ILIKE '%remote%' OR j.location::text ILIKE '%remote%')`);
      }
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

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
      ${whereClause}
      ORDER BY LEAST(COALESCE(j.posted_at, j.first_seen_at), NOW()) DESC NULLS LAST, j.id DESC
      LIMIT $${paramIdx};
    `;

    values.push(limit);

    const res = await p.query(query, values);
    if (!res.rows || res.rows.length === 0) {
      // If candidate-specific filtered pool was empty (e.g. very rare skill combinations),
      // retrieve a broader active pool
      const fallbackQuery = `
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
        WHERE j.status = 'active'
        ORDER BY LEAST(COALESCE(j.posted_at, j.first_seen_at), NOW()) DESC NULLS LAST, j.id DESC
        LIMIT $1;
      `;
      const fallbackRes = await p.query(fallbackQuery, [limit]);
      return (fallbackRes.rows || []).map(mapRowToJob);
    }

    return res.rows.map(mapRowToJob);
  } catch (error) {
    console.error('getCandidateRecommendationPool error:', error);
    return [];
  }
}
