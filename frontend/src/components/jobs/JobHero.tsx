import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar, Building2, ExternalLink } from "lucide-react";
import { Job } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { formatSalary, formatDate, inferAtsSource } from "@/lib/utils";

export function JobHero({ job }: { job: Job }) {
  const safeLocation = Array.isArray(job.location) ? job.location : [];
  const atsSource = inferAtsSource(job.apply_url || job.job_url);
  const applyLabel = atsSource ? `Apply on ${atsSource}` : "Apply on Company Site";

  // Only show batch if actually populated
  const hasBatch = job.eligible_batches && Array.isArray(job.eligible_batches) && job.eligible_batches.length > 0;

  return (
    <div className="rounded-xl overflow-hidden mb-6 bg-gradient-to-br from-slate-900 via-teal-950 to-cyan-900 text-white shadow-lg">
      <div className="p-5 sm:p-6 md:p-8">
        {/* Breadcrumb */}
        <div className="text-sm text-teal-100/70 mb-4 sm:mb-6 flex items-center gap-1 flex-wrap">
          <Link href="/" className="hover:text-teal-200 transition-colors">Home</Link>
          <span className="text-teal-100/40">›</span>
          <Link href="/" className="hover:text-teal-200 transition-colors">Jobs</Link>
          <span className="text-teal-100/40">›</span>
          <span className="line-clamp-1 text-teal-100/80">{job.title}</span>
        </div>

        {/* Company info row */}
        <div className="flex items-center gap-3 mb-4">
          {job.company.logo_url ? (
            <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 overflow-hidden shrink-0 flex items-center justify-center backdrop-blur-sm">
              <Image
                src={job.company.logo_url}
                alt={job.company.name}
                width={40}
                height={40}
                className="w-full h-full object-contain p-1"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 shrink-0 flex items-center justify-center backdrop-blur-sm">
              <Building2 className="w-5 h-5 text-teal-300" />
            </div>
          )}
          <div>
            <span className="font-semibold text-white">{job.company.name}</span>
            {atsSource && (
              <span className="ml-2 text-xs text-teal-300/80 font-medium">· via {atsSource}</span>
            )}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black mb-3 tracking-tight leading-snug break-words">
          {job.title}
        </h1>

        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mb-6 sm:mb-8">
          {job.employment_type && (
            <Badge className="bg-green-500 hover:bg-green-600 text-white border-none text-xs sm:text-sm px-2.5 sm:px-3 py-1">
              {job.employment_type}
            </Badge>
          )}
          {job.work_mode && (
            <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-none text-xs sm:text-sm px-2.5 sm:px-3 py-1">
              {job.work_mode}
            </Badge>
          )}
          {/* Batch — only show if data exists */}
          {hasBatch && (
            <Badge className="bg-teal-500/30 text-teal-200 border border-teal-400/40 text-xs sm:text-sm px-2.5 sm:px-3 py-1 font-semibold">
              🎓 Batch: {job.eligible_batches!.join(', ')}
            </Badge>
          )}

          {/* Apply button */}
          {job.apply_url && (
            <a
              href={job.apply_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto sm:ml-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-lg hover:shadow-teal-500/30 transition-all cursor-pointer"
            >
              {applyLabel}
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Bottom stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-6 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="text-2xl">💰</div>
            <div>
              <div className="text-xs text-teal-100/70 uppercase tracking-wider">Expected Salary</div>
              <div className="font-semibold">{formatSalary(job.salary_min, job.salary_max, job.salary_currency, job.salary_period, true)}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xl bg-white/10 p-2 rounded-full"><MapPin className="w-5 h-5" /></div>
            <div>
              <div className="text-xs text-teal-100/70 uppercase tracking-wider">Location</div>
              <div className="font-semibold line-clamp-1">
                {safeLocation.length > 0 ? safeLocation.join(', ') : 'Not specified'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xl bg-white/10 p-2 rounded-full"><Calendar className="w-5 h-5" /></div>
            <div>
              <div className="text-xs text-teal-100/70 uppercase tracking-wider">Deadline</div>
              <div className="font-semibold">
                {job.deadline ? formatDate(job.deadline) : 'Open (No deadline specified)'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
