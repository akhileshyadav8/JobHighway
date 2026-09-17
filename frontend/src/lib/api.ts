import { mockJobs, mockCompanies, mockStats, getMockJobBySlug } from './mock-data';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface Job {
  id: number;
  title: string;
  slug: string;
  company: CompanyBrief;
  location: string[];
  department: string | null;
  employment_type: string;
  work_mode: string;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string;
  salary_period: string;
  salary_basis?: string | null;
  is_salary_estimated?: boolean | null;
  experience_min: number | null;
  experience_max: number | null;
  education: string | null;
  eligible_batches: string[] | null;
  min_cgpa: number | null;
  min_percentage: number | null;
  backlog_allowed: boolean | null;
  skills_required: string[];
  skills_preferred: string[] | null;
  job_url: string;
  apply_url: string | null;
  posted_at: string | null;
  deadline: string | null;
  first_seen_at: string;
  last_seen_at: string;
  status: string;
  description_html: string;
  description_text: string;
  selection_process: any | null;
  interview_experience: any | null;
  work_culture_summary: string | null;
  study_materials: any[] | null;
  jobpulse_rating: string | null;
  rating_reason: string | null;
  view_count: number;
  official_domain?: string | null;
}

export interface CompanyBrief {
  id?: number | string;
  name: string;
  slug: string;
  logo_url?: string | null;
  industry?: string | null;
  headquarters?: string | null;
  website?: string | null;
}

export interface Company {
  id: number;
  name: string;
  slug: string;
  website: string;
  careers_url: string | null;
  logo_url: string | null;
  industry: string | null;
  headquarters: string | null;
  employee_count_range: string | null;
  description: string | null;
  active_job_count: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface OverviewStats {
  total_jobs: number;
  total_companies: number;
  new_today: number;
  new_this_hour: number;
  last_updated: string;
}

import { 
  getLiveJobsFromDb, 
  getLiveJobsPaginated,
  getLiveStatsFromDb, 
  getLiveJobBySlugFromDb,
  getLiveCompaniesFromDb,
  getLiveCompanyBySlugFromDb,
  getLiveCompanyJobsFromDb
} from './db';

export async function getJobs(params?: Record<string, string>): Promise<PaginatedResponse<Job>> {
  // 1. Try Live Supabase Database directly on server
  if (typeof window === 'undefined') {
    try {
      const page = params?.page ? parseInt(params.page, 10) : 1;
      const pageSize = params?.pageSize || params?.limit ? parseInt(params.pageSize || params.limit || '30', 10) : 30;
      const paginatedRes = await getLiveJobsPaginated({
        page,
        pageSize,
        search: params?.search,
        country: params?.country,
        state: params?.state,
        city: params?.city,
        company: params?.company,
        jobType: params?.jobType || params?.type,
        workMode: params?.workMode,
        experience: params?.experience,
        salary: params?.salary,
        sort: params?.sort,
      });
      if (paginatedRes && paginatedRes.items.length > 0) {
        return {
          items: paginatedRes.items,
          total: paginatedRes.total,
          page: paginatedRes.page,
          page_size: paginatedRes.pageSize,
          total_pages: paginatedRes.totalPages
        };
      }
    } catch (e) {
      console.warn('Server direct DB query failed, falling back:', e);
    }
  }

  // 2. Try API_BASE if configured
  try {
    const query = params ? new URLSearchParams(params).toString() : '';
    const res = await fetch(`${API_BASE}/jobs${query ? `?${query}` : ''}`, { next: { revalidate: 30 } });
    if (res.ok) {
      return res.json();
    }
  } catch (error) {
    // ignore and fallback
  }

  // 3. Fallback to mockJobs (real_jobs.json)
  return {
    items: mockJobs,
    total: mockJobs.length,
    page: 1,
    page_size: 10,
    total_pages: 1
  };
}

export async function getJobBySlug(slug: string): Promise<Job> {
  // 1. Try Live Supabase Database directly on server
  if (typeof window === 'undefined') {
    try {
      const liveJob = await getLiveJobBySlugFromDb(slug);
      if (liveJob) return liveJob;
    } catch (e) {
      console.warn('Server direct DB getJobBySlug failed:', e);
    }
  }

  // 2. Try API_BASE if configured
  try {
    const res = await fetch(`${API_BASE}/jobs/${slug}`, { next: { revalidate: 60 } });
    if (res.ok) return res.json();
  } catch (error) {
    // fallback
  }

  // 3. Fallback to mock data
  const job = getMockJobBySlug(slug);
  if (!job) throw new Error('Job not found in mock data either');
  return job;
}

export async function getRecentJobs(minutes: number = 60): Promise<Job[]> {
  try {
    const res = await fetch(`${API_BASE}/jobs/recent?minutes=${minutes}`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch recent jobs');
    return res.json();
  } catch (error) {
    console.warn('API getRecentJobs failed, using mock data');
    return mockJobs.slice(0, 3);
  }
}

export async function getCompanies(params?: Record<string, string>): Promise<PaginatedResponse<Company>> {
  if (typeof window === 'undefined') {
    try {
      const liveCompanies = await getLiveCompaniesFromDb();
      if (liveCompanies && liveCompanies.length > 0) {
        return {
          items: liveCompanies,
          total: liveCompanies.length,
          page: 1,
          page_size: liveCompanies.length,
          total_pages: 1
        };
      }
    } catch (e) {
      console.warn('Server direct DB getCompanies failed:', e);
    }
  }

  try {
    const query = params ? new URLSearchParams(params).toString() : '';
    const res = await fetch(`${API_BASE}/companies${query ? `?${query}` : ''}`, { next: { revalidate: 60 } });
    if (res.ok) return res.json();
  } catch (error) {
    // fallback
  }

  return {
    items: mockCompanies,
    total: mockCompanies.length,
    page: 1,
    page_size: 10,
    total_pages: 1
  };
}

export async function getCompanyBySlug(slug: string): Promise<Company> {
  if (typeof window === 'undefined') {
    try {
      const liveComp = await getLiveCompanyBySlugFromDb(slug);
      if (liveComp) return liveComp;
    } catch (e) {
      console.warn('Server direct DB getCompanyBySlug failed:', e);
    }
  }

  try {
    const res = await fetch(`${API_BASE}/companies/${slug}`, { next: { revalidate: 60 } });
    if (res.ok) return res.json();
  } catch (error) {
    // fallback
  }

  const company = mockCompanies.find(c => c.slug === slug);
  if (!company) throw new Error('Company not found');
  return company;
}

export async function getCompanyJobs(slug: string): Promise<PaginatedResponse<Job>> {
  if (typeof window === 'undefined') {
    try {
      const liveJobs = await getLiveCompanyJobsFromDb(slug);
      if (liveJobs && liveJobs.length > 0) {
        return {
          items: liveJobs,
          total: liveJobs.length,
          page: 1,
          page_size: liveJobs.length,
          total_pages: 1
        };
      }
    } catch (e) {
      console.warn('Server direct DB getCompanyJobs failed:', e);
    }
  }

  try {
    const res = await fetch(`${API_BASE}/companies/${slug}/jobs`, { next: { revalidate: 60 } });
    if (res.ok) return res.json();
  } catch (error) {
    // fallback
  }

  const jobs = mockJobs.filter(j => j.company.slug === slug);
  return {
    items: jobs,
    total: jobs.length,
    page: 1,
    page_size: 10,
    total_pages: 1
  };
}

export async function getOverviewStats(): Promise<OverviewStats> {
  if (typeof window === 'undefined') {
    try {
      const liveStats = await getLiveStatsFromDb();
      if (liveStats) return liveStats;
    } catch (e) {
      console.warn('Server direct stats DB query failed:', e);
    }
  }

  try {
    const res = await fetch(`${API_BASE}/stats/overview`, { next: { revalidate: 60 } });
    if (res.ok) return res.json();
  } catch (error) {
    // fallback
  }
  return mockStats;
}
