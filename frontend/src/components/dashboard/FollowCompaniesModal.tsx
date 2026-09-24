"use client";

import React, { useState, useMemo } from "react";
import { X, Search, Building2, Check, Plus, ExternalLink, Sparkles } from "lucide-react";
import { CompanyLogo } from "@/components/ui/CompanyLogo";

export interface CompanyCandidate {
  id: string;
  name: string;
  slug: string;
  industry?: string;
  location?: string;
  activeJobs?: number;
  logoUrl?: string;
}

const POPULAR_COMPANIES: CompanyCandidate[] = [
  { id: "comp_google", name: "Google", slug: "google", industry: "Tech & Search", location: "Mountain View, CA", activeJobs: 34 },
  { id: "comp_microsoft", name: "Microsoft", slug: "microsoft", industry: "Cloud & Software", location: "Redmond, WA", activeJobs: 28 },
  { id: "comp_amazon", name: "Amazon", slug: "amazon", industry: "E-Commerce & Cloud", location: "Seattle, WA", activeJobs: 42 },
  { id: "comp_netflix", name: "Netflix", slug: "netflix", industry: "Entertainment & Streaming", location: "Los Gatos, CA", activeJobs: 15 },
  { id: "comp_meta", name: "Meta", slug: "meta", industry: "Social & AI", location: "Menlo Park, CA", activeJobs: 22 },
  { id: "comp_adobe", name: "Adobe", slug: "adobe", industry: "Creative Software", location: "San Jose, CA", activeJobs: 19 },
  { id: "comp_apple", name: "Apple", slug: "apple", industry: "Consumer Electronics", location: "Cupertino, CA", activeJobs: 31 },
  { id: "comp_spotify", name: "Spotify", slug: "spotify", industry: "Audio & Streaming", location: "Stockholm / Remote", activeJobs: 14 },
  { id: "comp_uber", name: "Uber", slug: "uber", industry: "Mobility & Tech", location: "San Francisco, CA", activeJobs: 18 },
  { id: "comp_stripe", name: "Stripe", slug: "stripe", industry: "Fintech & Payments", location: "San Francisco, CA", activeJobs: 26 },
  { id: "comp_openai", name: "OpenAI", slug: "openai", industry: "Artificial Intelligence", location: "San Francisco, CA", activeJobs: 16 },
  { id: "comp_airbnb", name: "Airbnb", slug: "airbnb", industry: "Travel & Hospitality", location: "San Francisco, CA", activeJobs: 12 },
  { id: "comp_salesforce", name: "Salesforce", slug: "salesforce", industry: "Enterprise Cloud", location: "San Francisco, CA", activeJobs: 24 },
  { id: "comp_snowflake", name: "Snowflake", slug: "snowflake", industry: "Data Cloud", location: "Bozeman, MT", activeJobs: 11 },
  { id: "comp_datadog", name: "Datadog", slug: "datadog", industry: "Cloud Monitoring", location: "New York, NY", activeJobs: 17 },
  { id: "comp_oracle", name: "Oracle", slug: "oracle", industry: "Enterprise Software", location: "Austin, TX", activeJobs: 29 }
];

export interface FollowCompaniesModalProps {
  isOpen: boolean;
  onClose: () => void;
  followedSlugs: string[];
  onToggleFollow: (company: { id: string; name: string; slug: string }) => void;
}

export function FollowCompaniesModal({
  isOpen,
  onClose,
  followedSlugs = [],
  onToggleFollow
}: FollowCompaniesModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const followedSet = useMemo(() => {
    return new Set(followedSlugs.map((s) => s.toLowerCase()));
  }, [followedSlugs]);

  const filteredCompanies = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return POPULAR_COMPANIES;
    return POPULAR_COMPANIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.industry && c.industry.toLowerCase().includes(q)) ||
        (c.location && c.location.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-xl max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Follow Companies
              </h2>
              <p className="text-xs text-slate-500">
                Stay updated when verified career pages post new job openings.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-5 sm:px-6 pt-4 pb-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search companies by name, industry, or location..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:border-teal-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Company List */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-3 divide-y divide-slate-100">
          {filteredCompanies.length === 0 ? (
            <div className="py-8 text-center">
              <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-600">No companies found matching &quot;{searchQuery}&quot;</p>
              <p className="text-[11px] text-slate-400 mt-1">Try another search keyword</p>
            </div>
          ) : (
            filteredCompanies.map((comp) => {
              const isFollowing = followedSet.has(comp.slug.toLowerCase());

              return (
                <div
                  key={comp.id}
                  className="py-3 flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <CompanyLogo
                      name={comp.name}
                      slug={comp.slug}
                      logoUrl={comp.logoUrl}
                      size="md"
                      className="w-10 h-10 rounded-xl shrink-0 p-1.5"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                          {comp.name}
                        </h4>
                        <span className="text-[10px] font-semibold text-slate-400 shrink-0">
                          {comp.activeJobs} jobs
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {comp.industry} • {comp.location}
                      </p>
                    </div>
                  </div>

                  {/* Toggle Follow Action */}
                  <button
                    type="button"
                    onClick={() => onToggleFollow({ id: comp.id, name: comp.name, slug: comp.slug })}
                    className={`py-1.5 px-3.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                      isFollowing
                        ? "bg-teal-50 text-teal-700 border border-teal-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
                        : "bg-white border border-slate-200 text-slate-700 hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50/40"
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-teal-600 group-hover:hidden" />
                        <span className="group-hover:hidden">Following</span>
                        <span className="hidden group-hover:inline">Unfollow</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Following <strong>{followedSlugs.length}</strong> companies
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs cursor-pointer shadow-2xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
