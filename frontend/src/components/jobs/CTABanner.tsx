import { Job } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { ShieldCheck, ExternalLink } from "lucide-react";

export function CTABanner({ job }: { job: Job }) {
  if (!job.apply_url) return null;
  
  const timeLeft = job.deadline ? formatDistanceToNow(new Date(job.deadline)) : null;
  const companyDomain = (job as any).official_domain || job.company?.name || "Official Career Portal";

  return (
    <div className="bg-gradient-to-r from-teal-50 via-emerald-50 to-teal-50 border border-teal-200 rounded-2xl p-4 sm:p-6 mb-6 text-center shadow-sm">
      <div className="text-3xl mb-2">🎯</div>
      <h3 className="text-lg sm:text-xl font-bold text-teal-950 mb-1">
        Don&apos;t miss this opportunity!
      </h3>
      {timeLeft && (
        <p className="text-teal-700 text-xs sm:text-sm mb-4 sm:mb-5 font-medium">
          Apply before deadline — approximately {timeLeft} left!
        </p>
      )}

      <div className="flex flex-col items-center gap-3">
        <a
          href={job.apply_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base md:text-lg px-4 sm:px-8 py-3 sm:py-3.5 rounded-xl shadow-md transition-all hover:scale-102 text-center break-words"
        >
          <span>Apply on Official Website ({companyDomain})</span>
          <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
        </a>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 ">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Direct official link on {companyDomain} • Zero third-party data sharing</span>
        </div>
      </div>
    </div>
  );
}
