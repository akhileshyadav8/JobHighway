"use client";

import React from "react";
import Link from "next/link";
import { Building2, ArrowRight, Bell, Check, ExternalLink } from "lucide-react";
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
}

export function FollowedCompaniesSection({
  companies = [],
  onToggleFollow
}: FollowedCompaniesSectionProps) {
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 lg:p-7 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Followed Companies
          </h2>
        </div>

        <Link
          href="/companies"
          className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 group transition-colors cursor-pointer"
        >
          <span>View All Companies</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Content: Real Followed Companies or Polished Empty State */}
      {companies.length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl mt-5">
          <div className="w-10 h-10 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-2">
            <Building2 className="w-5 h-5" />
          </div>
          <p className="text-sm font-bold text-slate-700">No Followed Companies Yet</p>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Follow your preferred tech companies and employers to monitor their official ATS postings as soon as they open.
          </p>
          <Link
            href="/companies"
            className="mt-3.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <span>Explore Verified Companies</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          {companies.slice(0, 4).map((comp) => (
            <div
              key={comp.id}
              className="flex flex-col justify-between p-4 rounded-xl border border-slate-200/90 bg-white hover:border-teal-400 hover:shadow-sm transition-all group"
            >
              <div>
                {/* Top row: Logo, Company Name, Bell */}
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                      <CompanyLogo
                        name={comp.name}
                        slug={comp.slug}
                        size="sm"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 
                        className="font-bold text-sm text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1"
                        title={comp.name}
                      >
                        {comp.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                        {comp.newJobsCount ? `${comp.newJobsCount} open roles` : "Verified Official"}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    title="Alert Notifications Active"
                    className="p-1 text-slate-400 hover:text-teal-600 transition-colors cursor-pointer shrink-0"
                  >
                    <Bell className="w-4 h-4 fill-slate-300" />
                  </button>
                </div>
              </div>

              {/* Bottom button: Following Pill */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onToggleFollow?.(comp)}
                  className="w-full py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-emerald-50 text-emerald-700 border border-emerald-200/70 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 group/btn"
                >
                  <Check className="w-3.5 h-3.5 stroke-[2.5] group-hover/btn:hidden" />
                  <span className="group-hover/btn:hidden">Following</span>
                  <span className="hidden group-hover/btn:inline">Unfollow</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
