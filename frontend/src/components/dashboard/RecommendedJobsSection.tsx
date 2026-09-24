"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, MapPin, Bookmark, ExternalLink } from "lucide-react";
import { CompanyLogo } from "@/components/ui/CompanyLogo";

export interface RecommendedJobItem {
  id: string | number;
  title: string;
  company: string;
  companySlug?: string;
  companyLogo?: string | null;
  matchScore: number;
  location: string;
  workMode: string;
  skills: string[];
  extraSkillsCount?: number;
  postedTime: string;
  applyUrl: string;
  isBookmarked?: boolean;
}

export interface RecommendedJobsSectionProps {
  jobs?: RecommendedJobItem[];
  onToggleBookmark?: (job: RecommendedJobItem) => void;
  onViewDetails?: (job: RecommendedJobItem) => void;
  onApply?: (job: RecommendedJobItem) => void;
}

const DEFAULT_RECOMMENDED_JOBS: RecommendedJobItem[] = [
  {
    id: "rec_google_ds",
    title: "Data Scientist",
    company: "Google",
    companySlug: "google",
    matchScore: 94,
    location: "Bengaluru, India",
    workMode: "Hybrid",
    skills: ["Python", "Machine Learning", "SQL"],
    extraSkillsCount: 3,
    postedTime: "Posted 12 minutes ago",
    applyUrl: "https://careers.google.com/jobs/results/?q=Data%20Scientist"
  },
  {
    id: "rec_msft_ml",
    title: "ML Engineer",
    company: "Microsoft",
    companySlug: "microsoft",
    matchScore: 91,
    location: "Hyderabad, India",
    workMode: "Remote",
    skills: ["Python", "Deep Learning", "AWS"],
    extraSkillsCount: 2,
    postedTime: "Posted 28 minutes ago",
    applyUrl: "https://careers.microsoft.com/us/en/search-results?keywords=ML%20Engineer"
  },
  {
    id: "rec_adobe_da",
    title: "Data Analyst",
    company: "Adobe",
    companySlug: "adobe",
    matchScore: 87,
    location: "Noida, India",
    workMode: "On-site",
    skills: ["SQL", "Power BI", "Analytics"],
    extraSkillsCount: 2,
    postedTime: "Posted 1 hour ago",
    applyUrl: "https://adobe.wd5.myworkdayjobs.com/en-US/external_experienced"
  }
];

export function RecommendedJobsSection({
  jobs = DEFAULT_RECOMMENDED_JOBS,
  onToggleBookmark,
  onViewDetails,
  onApply
}: RecommendedJobsSectionProps) {
  const displayJobs = jobs && jobs.length > 0 ? jobs : DEFAULT_RECOMMENDED_JOBS;

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4 fill-amber-400 text-amber-500" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Recommended Jobs for You
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Based on your profile, skills and preferences
            </p>
          </div>
        </div>

        <Link
          href="/jobs"
          className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 group transition-colors cursor-pointer"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* 3-Column Job Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4.5 mt-5">
        {displayJobs.map((job) => (
          <div
            key={job.id}
            className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-4.5 transition-all duration-200 hover:border-teal-400 hover:shadow-sm group"
          >
            <div>
              {/* Top Row: Logo, Title, Match Pill */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                    <CompanyLogo
                      name={job.company}
                      slug={job.companySlug}
                      logoUrl={job.companyLogo}
                      size="sm"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-slate-900 truncate group-hover:text-teal-700 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium truncate">
                      {job.company}
                    </p>
                  </div>
                </div>

                <span className="shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  {job.matchScore}% Match
                </span>
              </div>

              {/* Location & Workmode */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-3 font-medium">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">
                  {job.location} • {job.workMode}
                </span>
              </div>

              {/* Skill Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                  >
                    {skill}
                  </span>
                ))}
                {job.extraSkillsCount && job.extraSkillsCount > 0 && (
                  <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500">
                    +{job.extraSkillsCount}
                  </span>
                )}
              </div>
            </div>

            {/* Footer row: posted time and action buttons */}
            <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
              <div className="text-[11px] text-slate-400 font-medium">
                {job.postedTime}
              </div>

              <div className="flex items-center gap-2">
                {/* Bookmark Button */}
                <button
                  type="button"
                  onClick={() => onToggleBookmark?.(job)}
                  title={job.isBookmarked ? "Remove Bookmark" : "Save Job"}
                  className={`p-2 rounded-lg border transition-colors cursor-pointer shrink-0 ${
                    job.isBookmarked
                      ? "border-teal-500 bg-teal-50 text-teal-600"
                      : "border-slate-200 bg-white text-slate-400 hover:text-teal-600 hover:border-slate-300"
                  }`}
                >
                  <Bookmark
                    className={`w-3.5 h-3.5 ${job.isBookmarked ? "fill-teal-600 text-teal-600" : ""}`}
                  />
                </button>

                {/* View Details Button */}
                <button
                  type="button"
                  onClick={() => onViewDetails?.(job)}
                  className="flex-1 py-1.5 px-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer text-center"
                >
                  View Details
                </button>

                {/* Apply Button */}
                <button
                  type="button"
                  onClick={() => onApply?.(job)}
                  className="py-1.5 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Apply</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
