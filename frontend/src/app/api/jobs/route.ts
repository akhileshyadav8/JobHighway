import { NextRequest, NextResponse } from 'next/server';
import { getLiveJobsFromDb } from '@/lib/db';
import { mockJobs } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '200000', 10);
  const since = searchParams.get('since');

  try {
    const liveJobs = await getLiveJobsFromDb(limit);

    if (liveJobs && liveJobs.length > 0) {
      if (since) {
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

      return NextResponse.json({
        items: liveJobs,
        total: liveJobs.length,
        is_live_db: true,
      });
    }
  } catch (error) {
    console.warn('Live DB query failed in /api/jobs, falling back to cached jobs:', error);
  }

  // Fallback to mockJobs (derived from real_jobs.json)
  if (since) {
    const sinceTime = new Date(since).getTime();
    const newJobs = mockJobs.filter(j => {
      const postTime = j.posted_at ? new Date(j.posted_at).getTime() : 0;
      return postTime > sinceTime;
    });
    return NextResponse.json({
      items: newJobs,
      total: newJobs.length,
      is_live_db: false,
    });
  }

  return NextResponse.json({
    items: mockJobs.slice(0, limit),
    total: mockJobs.length,
    is_live_db: false,
  });
}
