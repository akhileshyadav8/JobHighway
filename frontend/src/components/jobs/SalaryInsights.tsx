import { Card, CardContent } from "@/components/ui/card";
import { formatSalary } from "@/lib/utils";
import { Job } from "@/lib/api";
import { TrendingUp, Award, HelpCircle } from "lucide-react";

export function SalaryInsights({ job }: { job: Job }) {
  const basisText = job.salary_basis || `Based on historical hiring records & compensation benchmarks at ${job.company.name}`;

  return (
    <Card className="mb-6 border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-transparent p-4 border-b border-slate-100 ">
        <h2 className="text-base font-bold flex items-center gap-2 uppercase tracking-wide text-slate-900 ">
          <TrendingUp className="w-5 h-5 text-teal-600 " />
          <span>Salary Insights & Expected CTC</span>
        </h2>
      </div>

      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-4">
          <div>
            <div className="text-3xl md:text-4xl font-black text-teal-600 tracking-tight">
              {formatSalary(job.salary_min, job.salary_max, job.salary_currency, job.salary_period)}
            </div>
            <div className="text-xs font-semibold text-emerald-700 mt-1 flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Expected CTC (Company Historical Benchmark)
            </div>
          </div>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium self-start">
            <Award className="w-3.5 h-3.5 text-teal-600 " />
            Verified Market Trend
          </div>
        </div>

        {/* Calculation Basis Box */}
        <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/80 text-xs text-slate-600 space-y-2">
          <div className="flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800 mb-1">
                How is this salary calculated?
              </p>
              <p className="leading-relaxed">
                Based on verified industry compensation benchmarks and hiring intelligence, since companies rarely publish fixed salary numbers on official ATS requisitions, this package is estimated directly from <strong>{basisText}</strong>, verified interview experiences, and recent campus/off-campus placement bands for this role.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

