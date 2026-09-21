import { NextRequest, NextResponse } from 'next/server';
import { getLiveJobsPaginated, getLiveJobsFromDb, JobFilterParams } from '@/lib/db';
import { mockJobs } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || searchParams.get('pageSize') || '50', 10);
  const since = searchParams.get('since');

  const filterParams: JobFilterParams = {
    page,
    pageSize: limit,
    search: searchParams.get('search') || undefined,
    country: searchParams.get('country') || undefined,
    state: searchParams.get('state') || undefined,
    city: searchParams.get('city') || undefined,
    company: searchParams.get('company') || undefined,
    jobType: searchParams.get('jobType') || searchParams.get('type') || undefined,
    workMode: searchParams.get('workMode') || undefined,
    experience: searchParams.get('experience') || undefined,
    salary: searchParams.get('salary') || undefined,
    sort: searchParams.get('sort') || undefined,
  };

  try {
    // If polling for newly incoming jobs since a timestamp
    if (since) {
      const liveJobs = await getLiveJobsFromDb(50);
      if (liveJobs && liveJobs.length > 0) {
        const sinceTime = new Date(since).getTime();
        const newJobs = liveJobs.filter(j => {
          const postTime = j.posted_at ? new Date(j.posted_at).getTime() : 0;
          return postTime > sinceTime;
        });
        return NextResponse.json({
          items: newJobs,
          total: newJobs.length,
          is_live_db: true,
        });
      }
    }

    // Full Paginated Query
    const paginatedRes = await getLiveJobsPaginated(filterParams);
    if (paginatedRes) {
      return NextResponse.json({
        items: paginatedRes.items,
        total: paginatedRes.total,
        page: paginatedRes.page,
        pageSize: paginatedRes.pageSize,
        totalPages: paginatedRes.totalPages,
        is_live_db: true,
      });
    }
  } catch (error) {
    console.warn('Live DB paginated query failed in /api/jobs, falling back to cached jobs:', error);
  }

  // Fallback to mockJobs (derived from real_jobs.json)
  let filtered = [...mockJobs];
  if (filterParams.search) {
    const q = filterParams.search.toLowerCase();
    filtered = filtered.filter(j => 
      j.title.toLowerCase().includes(q) || 
      j.company.name.toLowerCase().includes(q) ||
      (j.description_text && j.description_text.toLowerCase().includes(q))
    );
  }
  if (filterParams.country && filterParams.country !== 'All') {
    if (filterParams.country === 'Remote') {
      filtered = filtered.filter(j => j.work_mode.toLowerCase().includes('remote'));
    } else {
      const c = filterParams.country.toLowerCase();
      filtered = filtered.filter(j => j.location.some((l: string) => l.toLowerCase().includes(c)));
    }
  }
  if (filterParams.state && filterParams.state !== 'All') {
    const s = filterParams.state.toLowerCase();
    filtered = filtered.filter(j => j.location.some((l: string) => l.toLowerCase().includes(s)));
  }
  if (filterParams.city && filterParams.city !== 'All') {
    const cityLower = filterParams.city.toLowerCase();
    filtered = filtered.filter(j => j.location.some((l: string) => {
      const loc = l.toLowerCase();
      if (cityLower === 'bengaluru' || cityLower === 'bangalore') {
        return loc.includes('bengaluru') || loc.includes('bangalore') || loc.includes('blr');
      }
      if (cityLower === 'delhi' || cityLower === 'new delhi') {
        return loc.includes('delhi') || loc.includes('noida') || loc.includes('gurgaon') || loc.includes('gurugram');
      }
      if (cityLower === 'mumbai' || cityLower === 'bombay') {
        return loc.includes('mumbai') || loc.includes('bombay') || loc.includes('thane');
      }
      return loc.includes(cityLower);
    }));
  }
  if (filterParams.company && filterParams.company !== 'All') {
    filtered = filtered.filter(j => j.company.slug === filterParams.company || j.company.name.toLowerCase() === filterParams.company?.toLowerCase());
  }
  if (filterParams.jobType && filterParams.jobType !== 'All') {
    const jt = filterParams.jobType.toLowerCase();
    filtered = filtered.filter(j => (j.employment_type || '').toLowerCase().includes(jt) || j.title.toLowerCase().includes(jt));
  }
  if (filterParams.workMode && filterParams.workMode !== 'All') {
    const wm = filterParams.workMode.toLowerCase();
    filtered = filtered.filter(j => (j.work_mode || '').toLowerCase().includes(wm) || j.location.some((l: string) => l.toLowerCase().includes(wm)));
  }
  if (filterParams.experience && filterParams.experience !== 'All') {
    if (filterParams.experience === '0-1') {
      filtered = filtered.filter(j => (j.experience_min === 0 || j.experience_min === null || /intern|fresher|graduate/i.test(j.title)));
    } else if (filterParams.experience === '1-3') {
      filtered = filtered.filter(j => (j.experience_min !== null && j.experience_min >= 1 && j.experience_min <= 3));
    } else if (filterParams.experience === '3-5') {
      filtered = filtered.filter(j => (j.experience_min !== null && j.experience_min >= 3 && j.experience_min <= 5));
    } else if (filterParams.experience === '5+') {
      filtered = filtered.filter(j => (j.experience_min !== null && j.experience_min >= 5) || /senior|lead|principal|director/i.test(j.title));
    }
  }

  const offset = (page - 1) * limit;
  const pagedItems = filtered.slice(offset, offset + limit);

  return NextResponse.json({
    items: pagedItems,
    total: filtered.length,
    page,
    pageSize: limit,
    totalPages: Math.ceil(filtered.length / limit) || 1,
    is_live_db: false,
  });
}

