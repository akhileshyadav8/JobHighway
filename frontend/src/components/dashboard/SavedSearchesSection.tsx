"use client";

import React from "react";
import Link from "next/link";
import { Bookmark, Search, Trash2, ArrowRight, Clock, Filter } from "lucide-react";
import { SavedSearchRecord } from "@/lib/auth";

interface SavedSearchesSectionProps {
  searches: SavedSearchRecord[];
  onDeleteSearch: (searchId: string) => void;
}

export function SavedSearchesSection({
  searches = [],
  onDeleteSearch
}: SavedSearchesSectionProps) {
  const buildSearchUrl = (search: SavedSearchRecord) => {
    const params = new URLSearchParams();
    if (search.query) params.set("q", search.query);
    if (search.country && search.country !== "All") params.set("country", search.country);
    if (search.state && search.state !== "All") params.set("state", search.state);
    if (search.city && search.city !== "All") params.set("city", search.city);
    if (search.company && search.company !== "All") params.set("company", search.company);
    if (search.jobType && search.jobType !== "All") params.set("type", search.jobType);
    if (search.workMode && search.workMode !== "All") params.set("mode", search.workMode);
    if (search.experience && search.experience !== "All") params.set("exp", search.experience);
    const qs = params.toString();
    return qs ? `/?${qs}` : "/";
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-100">
            <Bookmark className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Saved Searches
            </h2>
            <p className="text-xs text-slate-500">
              Your 1-click discovery filters and automated role queries
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="text-xs font-bold text-teal-600 hover:text-teal-700 inline-flex items-center gap-1 transition-colors"
        >
          <span>Find Jobs</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Content */}
      {searches.length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl mt-3.5">
          <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No saved searches yet</p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            When you filter jobs on the Jobs page, click &ldquo;Save this search&rdquo; to pin your custom criteria here for fast 1-click access.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors"
          >
            <span>Explore Jobs Feed</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3.5">
          {searches.map((s) => (
            <div
              key={s.id}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 transition-all flex flex-col justify-between gap-3 shadow-2xs group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-1 group-hover:text-teal-700 transition-colors">
                    {s.name}
                  </h3>
                  <button
                    type="button"
                    onClick={() => onDeleteSearch(s.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer shrink-0"
                    title="Delete saved search"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                  {s.query && (
                    <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-medium">
                      &ldquo;{s.query}&rdquo;
                    </span>
                  )}
                  {s.country && s.country !== "All" && (
                    <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                      {s.country}
                    </span>
                  )}
                  {s.workMode && s.workMode !== "All" && (
                    <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                      {s.workMode}
                    </span>
                  )}
                  {s.experience && s.experience !== "All" && (
                    <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                      {s.experience === "0-1" ? "0–1 Yrs" : `${s.experience} Yrs`}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(s.createdAt).toLocaleDateString()}
                </span>

                <Link
                  href={buildSearchUrl(s)}
                  className="font-bold text-teal-600 hover:text-teal-700 inline-flex items-center gap-1 transition-colors"
                >
                  <span>Run Search</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
