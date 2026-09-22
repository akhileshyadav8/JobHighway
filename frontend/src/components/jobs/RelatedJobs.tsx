import { Job, getRecentJobs } from "@/lib/api";
import Link from "next/link";
import { Building2, MapPin, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { inferAtsSource } from "@/lib/utils";

export async function RelatedJobs({ currentJob }: { currentJob: Job }) {
  let jobs: Job[] = [];
  try {
    jobs = await getRecentJobs();
  } catch {
    return null;
  }

  // Prefer same company, then same title keywords
  const titleKeywords = currentJob.title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  
  const related = jobs
    .filter(j => j.id !== currentJob.id)
    .sort((a, b) => {
      const aSameCompany = a.company.id === currentJob.company.id ? 2 : 0;
      const bSameCompany = b.company.id === currentJob.company.id ? 2 : 0;
      const aTitleMatch = titleKeywords.some(k => a.title.toLowerCase().includes(k)) ? 1 : 0;
      const bTitleMatch = titleKeywords.some(k => b.title.toLowerCase().includes(k)) ? 1 : 0;
      return (bSameCompany + bTitleMatch) - (aSameCompany + aTitleMatch);
    })
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <Card className="mb-6 border-slate-200 shadow-sm">
      <CardContent className="p-6">
        <h2 className="text-base font-bold flex items-center gap-2 mb-4 uppercase tracking-wide text-slate-900">
          <span>🔍 More Opportunities</span>
        </h2>
        <div className="space-y-3">
          {related.map(job => {
            const safeLocation = Array.isArray(job.location) ? job.location : [];
            const atsSource = inferAtsSource(job.apply_url || job.job_url);
            return (
              <div key={job.id} className="flex items-start justify-between gap-3 border border-slate-100 rounded-lg p-3 hover:border-slate-200 hover:bg-slate-50/50 transition-all">
                <div className="min-w-0 flex-1">
                  <Link href={`/jobs/${job.slug}`} className="font-semibold text-sm text-slate-900 hover:text-teal-600 line-clamp-1 block transition-colors">
                    {job.title}
                  </Link>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {job.company.name}
                    </span>
                    {safeLocation.length > 0 && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {safeLocation[0]}
                      </span>
                    )}
                    {atsSource && (
                      <span className="text-teal-600">via {atsSource}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Link
                    href={`/jobs/${job.slug}`}
                    className="px-2 py-1 text-xs font-medium text-slate-600 border border-slate-200 rounded hover:bg-slate-100 transition-colors"
                  >
                    Details
                  </Link>
                  {job.apply_url && (
                    <a
                      href={job.apply_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded transition-colors flex items-center gap-1"
                    >
                      Apply
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
