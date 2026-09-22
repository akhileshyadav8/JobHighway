import { getJobs, getOverviewStats } from "@/lib/api";
import { InteractiveJobFeed } from "@/components/jobs/InteractiveJobFeed";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [jobsData, stats] = await Promise.all([
    getJobs({ page: '1', limit: '50' }),
    getOverviewStats()
  ]);

  return (
    <InteractiveJobFeed 
      initialJobs={jobsData.items} 
      stats={stats} 
      initialTotal={jobsData.total}
      initialTotalPages={jobsData.total_pages}
    />
  );
}

