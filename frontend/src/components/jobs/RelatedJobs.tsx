import { Card, CardContent } from "@/components/ui/card";
import { Job, getRecentJobs } from "@/lib/api";
import Link from "next/link";
import { Building2 } from "lucide-react";

export async function RelatedJobs({ currentJob }: { currentJob: Job }) {
  const jobs = await getRecentJobs();
  const related = jobs.filter(j => j.id !== currentJob.id).slice(0, 4);
  
  if (related.length === 0) return null;

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h2 className="text-lg font-bold flex items-center gap-2 mb-4 uppercase">
          🔍 MORE OPPORTUNITIES
        </h2>
        <div className="space-y-4">
          {related.map(job => (
            <div key={job.id} className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 last:border-0 last:pb-0">
              <div>
                <Link href={`/jobs/${job.slug}`} className="font-bold hover:text-teal-600 dark:hover:text-teal-400 block mb-1">
                  {job.title}
                </Link>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {job.company.name}</span>
                  <span>•</span>
                  <span>{job.location[0]}</span>
                </div>
              </div>
              <Link href={`/jobs/${job.slug}`} className="text-teal-600 dark:text-teal-400 text-sm font-medium hover:underline whitespace-nowrap">
                View →
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
