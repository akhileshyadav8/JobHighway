"use client";

import React from "react";
import Link from "next/link";
import { X, ArrowRight, Check, ExternalLink, ShieldCheck, MapPin, Briefcase, GraduationCap, DollarSign, Bookmark, ArrowLeftRight } from "lucide-react";
import { Job } from "@/lib/api";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { formatSalary, sanitizeJobSkills, inferAtsSource } from "@/lib/utils";

interface JobComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobs: [Job, Job] | Job[];
  onRemoveJob?: (jobId: number) => void;
}

export function JobComparisonModal({
  isOpen,
  onClose,
  jobs,
  onRemoveJob
}: JobComparisonModalProps) {
  if (!isOpen || !jobs || jobs.length === 0) return null;

  const jobA = jobs[0];
  const jobB = jobs[1];

  const getJobMeta = (job: Job | undefined) => {
    if (!job) return null;
    const skills = sanitizeJobSkills(job.skills_required, job.title, job.description_text);
    const salary = formatSalary(job.salary_min, job.salary_max, job.salary_currency, job.salary_period, true);
    const ats = inferAtsSource(job.apply_url || job.job_url);
    const exp = job.experience_min === 0 
      ? "0-1 Yrs (Fresher Friendly)" 
      : job.experience_min !== null 
      ? `${job.experience_min}+ Yrs` 
      : "Not specified";
    const loc = Array.isArray(job.location) && job.location.length > 0 
      ? job.location.join(", ") 
      : "Remote / Multiple";

    return { skills, salary, ats, exp, loc };
  };

  const metaA = getJobMeta(jobA);
  const metaB = getJobMeta(jobB);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[92vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Side-by-Side Job Comparison
              </h2>
              <p className="text-xs text-slate-500">
                Compare verified requisitions, compensation, work mode, and requirements
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-200">
            {/* Job A */}
            {jobA && metaA && (
              <div className="space-y-4 pt-2 md:pt-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <CompanyLogo
                      name={jobA.company.name}
                      slug={jobA.company.slug}
                      logoUrl={jobA.company.logo_url}
                      size="md"
                    />
                    <div>
                      <span className="text-xs font-semibold text-slate-500">{jobA.company.name}</span>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {jobA.title}
                      </h3>
                    </div>
                  </div>
                  {onRemoveJob && (
                    <button
                      onClick={() => onRemoveJob(jobA.id)}
                      className="text-xs text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Remove from comparison"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Work Mode</span>
                    <span className="font-semibold text-slate-800">{jobA.work_mode || "Not specified"}</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Location</span>
                    <span className="font-semibold text-slate-800 line-clamp-1 max-w-[200px] text-right">{metaA.loc}</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Experience</span>
                    <span className="font-semibold text-slate-800">{metaA.exp}</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Compensation</span>
                    <span className="font-bold text-slate-900">{metaA.salary || "Disclosed on Apply"}</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">ATS Source</span>
                    <span className="font-semibold text-teal-700 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {metaA.ats || "Direct Official ATS"}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                      Required Skills
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {metaA.skills.slice(0, 6).map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-700 font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <Link
                    href={`/jobs/${jobA.slug}`}
                    className="flex-1 text-center py-2 px-3 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    View Details
                  </Link>
                  {jobA.apply_url && (
                    <a
                      href={jobA.apply_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center py-2 px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition-colors inline-flex items-center justify-center gap-1"
                    >
                      <span>Apply Official</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Job B */}
            {jobB && metaB ? (
              <div className="space-y-4 pt-4 md:pt-0 md:pl-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <CompanyLogo
                      name={jobB.company.name}
                      slug={jobB.company.slug}
                      logoUrl={jobB.company.logo_url}
                      size="md"
                    />
                    <div>
                      <span className="text-xs font-semibold text-slate-500">{jobB.company.name}</span>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {jobB.title}
                      </h3>
                    </div>
                  </div>
                  {onRemoveJob && (
                    <button
                      onClick={() => onRemoveJob(jobB.id)}
                      className="text-xs text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Remove from comparison"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Work Mode</span>
                    <span className="font-semibold text-slate-800">{jobB.work_mode || "Not specified"}</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Location</span>
                    <span className="font-semibold text-slate-800 line-clamp-1 max-w-[200px] text-right">{metaB.loc}</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Experience</span>
                    <span className="font-semibold text-slate-800">{metaB.exp}</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Compensation</span>
                    <span className="font-bold text-slate-900">{metaB.salary || "Disclosed on Apply"}</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">ATS Source</span>
                    <span className="font-semibold text-teal-700 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {metaB.ats || "Direct Official ATS"}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                      Required Skills
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {metaB.skills.slice(0, 6).map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-700 font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <Link
                    href={`/jobs/${jobB.slug}`}
                    className="flex-1 text-center py-2 px-3 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    View Details
                  </Link>
                  {jobB.apply_url && (
                    <a
                      href={jobB.apply_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center py-2 px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition-colors inline-flex items-center justify-center gap-1"
                    >
                      <span>Apply Official</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-xl text-center md:ml-6">
                <ArrowLeftRight className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-sm font-semibold text-slate-700">Select a second job</p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Click &ldquo;Compare&rdquo; on any other job card in the feed to compare them side-by-side.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            100% verified official ATS data without recruiter markup
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-200/60 font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
