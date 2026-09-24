"use client";

import React from "react";
import { X, ExternalLink, MapPin, Briefcase, DollarSign, Clock, ShieldCheck, Bookmark } from "lucide-react";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { RecommendedJobItem } from "./RecommendedJobsSection";

export interface JobDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: RecommendedJobItem | null;
  onToggleBookmark?: (job: RecommendedJobItem) => void;
  onApplyOfficial?: (job: RecommendedJobItem) => void;
}

export function JobDetailModal({
  isOpen,
  onClose,
  job,
  onToggleBookmark,
  onApplyOfficial
}: JobDetailModalProps) {
  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-7 relative overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 pb-5 border-b border-slate-100">
          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2 shrink-0">
            <CompanyLogo
              name={job.company}
              slug={job.companySlug}
              logoUrl={job.companyLogo}
              size="md"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="min-w-0 pr-8">
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                {job.title}
              </h2>
              <span className="shrink-0 text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                {job.matchScore}% Match
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-600 mt-0.5">
              {job.company}
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-2 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {job.location} ({job.workMode})
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {job.postedTime}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-teal-600 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                Official ATS Direct Requisition
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="py-5 space-y-4 overflow-y-auto flex-1">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Required Skills &amp; Competencies
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-lg bg-teal-50 text-teal-700 border border-teal-100 text-xs font-semibold"
                >
                  {skill}
                </span>
              ))}
              {job.extraSkillsCount && (
                <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">
                  +{job.extraSkillsCount} more relevant skills
                </span>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Requisition Summary
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We detected this opening directly through the official career API of {job.company}.
              Applying via JobPulse redirects you straight to their official greenhouse/lever/workday portal with zero recruiter intermediation or ghost listings.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onToggleBookmark?.(job)}
            className="py-2 px-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Bookmark className={`w-3.5 h-3.5 ${job.isBookmarked ? "fill-teal-600 text-teal-600" : ""}`} />
            <span>{job.isBookmarked ? "Saved in Wishlist" : "Save Job"}</span>
          </button>

          <a
            href={job.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onApplyOfficial?.(job)}
            className="py-2.5 px-5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <span>Apply on Official Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
