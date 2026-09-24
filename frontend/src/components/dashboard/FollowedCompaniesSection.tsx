"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Building2, ArrowRight, Bell, Check } from "lucide-react";
import { CompanyLogo } from "@/components/ui/CompanyLogo";

export interface FollowedCompanyItem {
  id: string;
  name: string;
  slug: string;
  newJobsCount: number;
  isFollowing: boolean;
  bellActive?: boolean;
}

export interface FollowedCompaniesSectionProps {
  companies?: FollowedCompanyItem[];
  onToggleFollow?: (companyId: string, isFollowing: boolean) => void;
}

const DEFAULT_FOLLOWED_COMPANIES: FollowedCompanyItem[] = [
  {
    id: "comp_google",
    name: "Google",
    slug: "google",
    newJobsCount: 4,
    isFollowing: true,
    bellActive: true
  },
  {
    id: "comp_microsoft",
    name: "Microsoft",
    slug: "microsoft",
    newJobsCount: 2,
    isFollowing: true,
    bellActive: true
  },
  {
    id: "comp_amazon",
    name: "Amazon",
    slug: "amazon",
    newJobsCount: 3,
    isFollowing: true,
    bellActive: true
  },
  {
    id: "comp_netflix",
    name: "Netflix",
    slug: "netflix",
    newJobsCount: 1,
    isFollowing: true,
    bellActive: true
  }
];

export function FollowedCompaniesSection({
  companies = DEFAULT_FOLLOWED_COMPANIES,
  onToggleFollow
}: FollowedCompaniesSectionProps) {
  const [list, setList] = useState<FollowedCompanyItem[]>(companies);

  const handleToggle = (id: string) => {
    setList((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const next = !c.isFollowing;
          onToggleFollow?.(id, next);
          return { ...c, isFollowing: next };
        }
        return c;
      })
    );
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs">
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
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* 4 Company Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
        {list.map((comp) => (
          <div
            key={comp.id}
            className="flex flex-col justify-between p-4.5 rounded-xl border border-slate-200/90 bg-white hover:border-teal-400 hover:shadow-sm transition-all group"
          >
            <div>
              {/* Top row: Logo, Company Name, Bell */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                    <CompanyLogo
                      name={comp.name}
                      slug={comp.slug}
                      size="sm"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-slate-900 truncate group-hover:text-teal-700 transition-colors">
                      {comp.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                      {comp.newJobsCount} new jobs
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  title="Company Alert Notifications"
                  className="p-1 text-slate-400 hover:text-teal-600 transition-colors cursor-pointer shrink-0"
                >
                  <Bell className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bottom button: Following Pill */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleToggle(comp.id)}
                className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  comp.isFollowing
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200/70 hover:bg-emerald-100/60"
                    : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {comp.isFollowing && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                <span>{comp.isFollowing ? "Following" : "+ Follow"}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
