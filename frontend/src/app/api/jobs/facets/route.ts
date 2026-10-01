import { NextRequest, NextResponse } from 'next/server';
import { getLiveJobFacets, JobFilterParams } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const params: JobFilterParams = {
    search: searchParams.get('search') || undefined,
    country: searchParams.get('country') || undefined,
    state: searchParams.get('state') || undefined,
    city: searchParams.get('city') || undefined,
    company: searchParams.get('company') || undefined,
    jobType: searchParams.get('jobType') || searchParams.get('type') || undefined,
    workMode: searchParams.get('workMode') || undefined,
    experience: searchParams.get('experience') || undefined,
    salary: searchParams.get('salary') || undefined,
    fresh: searchParams.get('fresh') === 'true' || searchParams.get('fresh') === '1' ? true : undefined,
  };

  try {
    const facets = await getLiveJobFacets(params);
    if (facets) {
      return NextResponse.json(facets, {
        headers: {
          // Cache for 30 seconds at the edge — facets don't need to be real-time
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        },
      });
    }
  } catch (error) {
    console.error('/api/jobs/facets error:', error);
  }

  // Fallback: return null so the frontend falls back to global stats
  return NextResponse.json(null, { status: 503 });
}
