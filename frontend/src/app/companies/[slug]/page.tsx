import { notFound } from "next/navigation";
import { getCompanyBySlug, getCompanyJobs } from "@/lib/api";
import { JobCard } from "@/components/jobs/JobCard";
import { ExternalLink, MapPin, Users, Building2, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

export const revalidate = 60;

export default async function CompanyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let company;
  let jobsData;
  try {
    company = await getCompanyBySlug(slug);
    jobsData = await getCompanyJobs(slug);
  } catch (error) {
    notFound();
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
      {/* Company Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-16 pb-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-700 dark:text-teal-400 font-bold text-4xl md:text-5xl flex-shrink-0 shadow-sm">
              {company.name.charAt(0)}
            </div>
            
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight leading-snug">{company.name}</h1>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 mb-5 max-w-2xl leading-relaxed">
                {company.description}
              </p>
              
              <div className="flex flex-wrap gap-4 md:gap-6 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" />
                  {company.industry || 'Various Industries'}
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {company.headquarters || 'Multiple Locations'}
                </div>
                {company.employee_count_range && (
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    {company.employee_count_range} Employees
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col gap-3 w-full md:w-auto mt-4 md:mt-0">
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors w-full md:w-auto"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit Website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Jobs Section */}
      <div className="container mx-auto px-4 max-w-5xl py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            Open Positions ({jobsData.total})
          </h2>
        </div>

        {jobsData.items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobsData.items.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No active jobs</h3>
            <p className="text-slate-500">This company currently doesn't have any open positions on JobPulse.</p>
          </div>
        )}
      </div>
    </div>
  );
}
