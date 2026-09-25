"use client";

import React from "react";
import Link from "next/link";
import { History, ExternalLink, MapPin, Trash2, ArrowRight, Clock, ShieldCheck, Briefcase } from "lucide-react";
import { RecentlyViewedJobRecord } from "@/lib/auth";

interface RecentlyViewedJobsSectionProps {
  jobs: RecentlyViewedJobRecord[];
  onClearHistory: () => void;
}

export function RecentlyViewedJobsSection({
  jobs = [],
  onClearHistory
}: RecentlyViewedJobsSectionProps) {
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-100">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Recently Viewed Jobs
            </h2>
            <p className="text-xs text-slate-500">
              Openings you inspected in your recent browsing sessions
            </p>
          </div>
        </div>

        {jobs.length > 0 && (
          <button
            type="button"
            onClick={onClearHistory}
            className="text-xs font-medium text-slate-400 hover:text-rose-600 transition-colors cursor-pointer flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Content */}
      {jobs.length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl mt-3.5">
          <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No recently viewed jobs</p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            As you discover and inspect job openings, they will automatically appear here so you never lose track of a role.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors"
          >
            <span>Browse Jobs</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 mt-3.5">
          {jobs.slice(0, 6).map((job) => (
            <div
              key={job.jobId}
              className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col justify-between gap-3 shadow-2xs group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-xs font-semibold text-slate-500 truncate">
                    {job.company}
                  </span>
                  {job.workMode && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                      {job.workMode}
                    </span>
                  )}
                </div>

                <Link
                  href={job.slug ? `/jobs/${job.slug}` : `/jobs`}
                  className="font-bold text-sm text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-2 leading-snug"
                >
                  {job.title}
                </Link>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{job.location}</span>
                </div>

                {job.salary && (
                  <p className="text-xs font-bold text-slate-800 mt-1.5">
                    {job.salary}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <Link
                  href={job.slug ? `/jobs/${job.slug}` : `/jobs`}
                  className="font-semibold text-teal-600 hover:text-teal-700 inline-flex items-center gap-1"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>

                {job.applyUrl && (
                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1"
                  >
                    <span>Official ATS</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
