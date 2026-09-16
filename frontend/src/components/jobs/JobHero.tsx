import { MapPin, Calendar, Building2 } from "lucide-react";
import { Job } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { formatSalary, getEmploymentTypeColor, getWorkModeColor, formatDate } from "@/lib/utils";

export function JobHero({ job }: { job: Job }) {
  return (
    <div className="rounded-xl overflow-hidden mb-6 bg-gradient-to-br from-slate-900 via-teal-950 to-cyan-900 text-white shadow-lg">
      <div className="p-6 md:p-8">
        <div className="text-sm text-teal-100/70 mb-6">
          Home &gt; Jobs &gt; {job.title}
        </div>
        
        <div className="flex items-center gap-2 bg-white/10 w-max px-3 py-1.5 rounded-full mb-4 backdrop-blur-sm border border-white/10">
          <Building2 className="w-4 h-4 text-teal-300" />
          <span className="font-medium">{job.company.name}</span>
        </div>
        
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
          {job.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <Badge className="bg-green-500 hover:bg-green-600 text-white border-none text-sm px-3 py-1">
            {job.employment_type}
          </Badge>
          <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-none text-sm px-3 py-1">
            {job.work_mode}
          </Badge>
          <Badge className="bg-teal-500/30 text-teal-200 border border-teal-400/40 text-sm px-3 py-1 font-semibold">
            🎓 Batch: {job.eligible_batches && job.eligible_batches.length > 0 ? job.eligible_batches.join(', ') : 'Any Batch'}
          </Badge>
          {job.apply_url && (
            <a
              href={job.apply_url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center justify-center px-5 py-2 text-sm font-bold rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-lg hover:shadow-teal-500/30 transition-all cursor-pointer"
            >
              Apply on Company Site ↗
            </a>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="text-2xl">💰</div>
            <div>
              <div className="text-xs text-teal-100/70 uppercase tracking-wider">Expected CTC / Salary</div>
              <div className="font-semibold">{formatSalary(job.salary_min, job.salary_max, job.salary_currency, job.salary_period, true)}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-xl bg-white/10 p-2 rounded-full"><MapPin className="w-5 h-5" /></div>
            <div>
              <div className="text-xs text-teal-100/70 uppercase tracking-wider">Location</div>
              <div className="font-semibold line-clamp-1">{job.location.join(', ')}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-xl bg-white/10 p-2 rounded-full"><Calendar className="w-5 h-5" /></div>
            <div>
              <div className="text-xs text-teal-100/70 uppercase tracking-wider">Deadline</div>
              <div className="font-semibold">{job.deadline ? formatDate(job.deadline) : '🔥 Apply ASAP (Rolling Hiring)'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
