"use client";

import Link from "next/link";
import { Search, ArrowLeft, AlertCircle, TrendingUp, Sparkles } from "lucide-react";

export default function AdminSearchAnalyticsPage() {
  const topTitles = [
    { name: "Frontend Developer", count: 482, growth: "+18%" },
    { name: "Data Analyst", count: 395, growth: "+24%" },
    { name: "Software Engineer", count: 340, growth: "+12%" },
    { name: "DevOps Engineer", count: 210, growth: "+8%" },
    { name: "Product Manager", count: 184, growth: "+15%" }
  ];

  const topSkills = [
    { name: "React", count: 620 },
    { name: "Python", count: 580 },
    { name: "PostgreSQL / SQL", count: 490 },
    { name: "AWS", count: 410 },
    { name: "Next.js", count: 350 }
  ];

  const zeroResultSearches = [
    { query: "Rust Systems Engineer Remote", count: 38, category: "Tech Stack Gap", recommendation: "Add Rust tags to scraper dictionary" },
    { query: "Elixir Phoenix Developer", count: 27, category: "Niche Language", recommendation: "Index Elixir official community feeds" },
    { query: "Chief of Staff AI Startup", count: 22, category: "Executive Search", recommendation: "Expand Ashby startup ingestion" },
    { query: "Quantum Algorithm Researcher", count: 15, category: "Deep Tech", recommendation: "Monitor university lab portals" }
  ];

  return (
    <div className="space-y-6 pb-12">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Link href="/admin" className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Search className="w-6 h-6 text-teal-600" />
          <span>Search Analytics &amp; Query Intelligence</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Candidate search queries, skill trends, and zero-result discoveries across the platform.
        </p>
      </div>

      {/* ZERO RESULT SEARCHES (High Priority Callout) */}
      <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <h3 className="font-bold text-sm text-slate-900">Zero-Result Searches (Unmet Candidate Demand)</h3>
          </div>
          <span className="text-xs font-bold text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-full">
            Actionable Ingestion Gaps
          </span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Queries where candidates found zero openings. Use these keywords to target new company ATS adapters and pipeline feeds.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {zeroResultSearches.map((item, idx) => (
            <div key={idx} className="bg-white border border-amber-200/60 rounded-xl p-3 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 font-mono">&ldquo;{item.query}&rdquo;</span>
                <span className="font-semibold text-rose-600 bg-rose-50 px-2 py-0.2 rounded text-[10px]">
                  {item.count} misses
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                Category: <strong>{item.category}</strong> • <em>{item.recommendation}</em>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Searched Queries & Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs">
          <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-teal-600" />
            <span>Top Searched Job Titles</span>
          </h3>
          <div className="space-y-2 text-xs">
            {topTitles.map((t, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50">
                <span className="font-semibold text-slate-800">{t.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-mono">{t.count} queries</span>
                  <span className="text-emerald-600 font-bold text-[10px]">{t.growth}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs">
          <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Top Filtered Skills &amp; Keywords</span>
          </h3>
          <div className="space-y-2 text-xs">
            {topSkills.map((s, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50">
                <span className="font-semibold text-slate-800">{s.name}</span>
                <span className="font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-bold">
                  {s.count} tags
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
