import { getJobs, getOverviewStats } from "@/lib/api";
import { InteractiveJobFeed } from "@/components/jobs/InteractiveJobFeed";

export const dynamic = 'force-dynamic';
export const revalidate = 0; // 0-second delay: fresh live jobs on every visit/refresh

export default async function Home() {
  const [jobsData, stats] = await Promise.all([
    getJobs(),
    getOverviewStats()
  ]);

  return (
    <InteractiveJobFeed initialJobs={jobsData.items} stats={stats} />
  );
}
