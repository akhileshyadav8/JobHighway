import { getJobs, getOverviewStats } from "@/lib/api";
import { InteractiveJobFeed } from "@/components/jobs/InteractiveJobFeed";

export const dynamic = 'force-dynamic';

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; search?: string }>;
}) {
  const resolved = searchParams ? await searchParams : {};
  const query = (resolved?.q || resolved?.search || "").trim();

  const jobParams: Record<string, string> = { page: '1', limit: '50' };
  if (query) {
    jobParams.search = query;
  }

  const [jobsData, stats] = await Promise.all([
    getJobs(jobParams),
    getOverviewStats()
  ]);

  return (
    <InteractiveJobFeed 
      initialJobs={jobsData.items} 
      stats={stats} 
      initialTotal={jobsData.total}
      initialTotalPages={jobsData.total_pages}
      initialQuery={query}
    />
  );
}
