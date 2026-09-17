import { getJobs, getOverviewStats } from "@/lib/api";
import { InteractiveJobFeed } from "@/components/jobs/InteractiveJobFeed";

export const revalidate = 60; // Revalidate in background every 60s while serving instant cached RSC to client routers

export default async function Home() {
  const [jobsData, stats] = await Promise.all([
    getJobs({ page: '1', limit: '30' }),
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

