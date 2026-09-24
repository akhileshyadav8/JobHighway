"use client";

import React from "react";
import Link from "next/link";
import { Building2, ArrowRight, Bell, Check, Plus, ExternalLink } from "lucide-react";
import { CompanyLogo } from "@/components/ui/CompanyLogo";

export interface FollowedCompanyDisplayItem {
  id: string;
  name: string;
  slug: string;
  newJobsCount?: number;
  isFollowing?: boolean;
}

export interface FollowedCompaniesSectionProps {
  companies: FollowedCompanyDisplayItem[];
  onToggleFollow?: (company: FollowedCompanyDisplayItem) => void;
  onOpenFollowModal?: () => void;
}

export function FollowedCompaniesSection({
  companies = [],
  onToggleFollow,
  onOpenFollowModal
}: FollowedCompaniesSectionProps) {
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-4.5 lg:p-5 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <Building2 className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Followed Companies
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenFollowModal}
            className="text-xs font-semibold text-slate-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Follow Companies</span>
          </button>

          <Link
            href="/companies"
            className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 group transition-colors cursor-pointer shrink-0"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Content: Real Followed Companies or Polished Empty State */}
      {companies.length === 0 ? (
        <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-xl mt-3.5">
          <div className="w-9 h-9 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-2">
            <Building2 className="w-4 h-4" />
          </div>
          <p className="text-sm font-bold text-slate-700">No Followed Companies Yet</p>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Follow tech employers to monitor their official ATS postings as soon as they open.
          </p>
          <div className="mt-3 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={onOpenFollowModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Follow Verified Companies</span>
            </button>
            <Link
              href="/companies"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
            >
              <span>Explore Directory</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 mt-3.5">
          {companies.slice(0, 8).map((comp) => (
            <div
              key={comp.id}
              className="flex flex-col justify-between p-3 sm:p-3.5 rounded-xl border border-slate-200/90 bg-white hover:border-teal-400 hover:shadow-xs transition-all group min-w-0"
            >
              <div>
                {/* Top row: Single clean Logo, Company Name, Bell */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <CompanyLogo
                      name={comp.name}
                      slug={comp.slug}
                      size="md"
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl shrink-0 p-1.5"
                    />

                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/jobs?company=${encodeURIComponent(comp.slug)}`}
                        className="font-bold text-xs sm:text-sm text-slate-900 hover:text-teal-700 transition-colors truncate block"
                        title={comp.name}
                      >
                        {comp.name}
                      </Link>
                      <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                        {comp.newJobsCount !== undefined ? `${comp.newJobsCount} new jobs` : "Active postings"}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/jobs?company=${encodeURIComponent(comp.slug)}`}
                    className="p-1 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-slate-50 transition-colors shrink-0"
                    title={`View jobs at ${comp.name}`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Bottom Interactive Following / Unfollow Button */}
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onToggleFollow?.(comp)}
                  className="w-full py-1 px-2.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer bg-teal-50 text-teal-700 border border-teal-200/80 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 group/btn"
                >
                  <Check className="w-3 h-3 text-teal-600 group-hover/btn:hidden" />
                  <span className="group-hover/btn:hidden">Following</span>
                  <span className="hidden group-hover/btn:inline">Unfollow</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Live Sync Status Strip to balance section height */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[11px] font-medium text-slate-600">
            Official ATS stream active: hourly synchronization with employer job boards
          </span>
        </div>
        <button
          type="button"
          onClick={onOpenFollowModal}
          className="text-[11px] font-bold text-teal-600 hover:text-teal-700 hover:underline cursor-pointer"
        >
          + Add more companies to watch
        </button>
      </div>
    </div>
  );
}
