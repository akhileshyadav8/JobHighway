"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PieChart, ArrowLeft, Briefcase, MapPin, Radio, Building2 } from "lucide-react";
import { JobActivityChart } from "@/components/admin/AdminCharts";
import { getAdminAtsSources, getAdminJobs } from "@/lib/adminData";

export default function AdminJobAnalyticsPage() {
  const [atsBreakdown, setAtsBreakdown] = useState<{ name: string; count: number; percent: number }[]>([]);
  const [locationBreakdown, setLocationBreakdown] = useState<{ city: string; count: number }[]>([]);

  useEffect(() => {
    const sources = getAdminAtsSources();
    const totalJobs = sources.reduce((sum, s) => sum + s.jobsCount, 0) || 1;
    setAtsBreakdown(sources.map(s => ({
      name: s.name,
      count: s.jobsCount,
      percent: Math.round((s.jobsCount / totalJobs) * 100)
    })));

    const jobs = getAdminJobs();
    const cityMap: Record<string, number> = {};
    jobs.forEach(j => {
      const loc = j.location || "Remote";
      const key = loc.includes("Bengaluru") || loc.includes("Bangalore") ? "Bengaluru, Karnataka" :
                  loc.includes("Hyderabad") ? "Hyderabad, Telangana" :
                  loc.includes("Pune") ? "Pune, Maharashtra" :
                  loc.includes("Delhi") || loc.includes("Noida") || loc.includes("Gurugram") ? "Delhi NCR (Gurugram / Noida)" :
                  loc.includes("Remote") ? "Remote (India / Global)" :
                  "Other Regional Metros";
      cityMap[key] = (cityMap[key] || 0) + 1;
    });

    setLocationBreakdown(Object.entries(cityMap).map(([city, count]) => ({ city, count })).sort((a, b) => b.count - a.count));
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Link href="/mastermindak" className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <PieChart className="w-6 h-6 text-teal-600" />
          <span>Job Corpus &amp; Ingestion Analytics</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Distribution metrics across ATS systems, geographic locations, and job classifications.
        </p>
      </div>

      {/* 14 Day Activity Chart */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs">
        <h3 className="font-bold text-sm text-slate-900 mb-1">14-Day Job Ingestion Trajectory</h3>
        <p className="text-[11px] text-slate-400 mb-4">Volume of roles published, marked expired, or refreshed with updated JD text</p>
        <JobActivityChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* ATS Breakdown */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs">
          <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
            <Radio className="w-4 h-4 text-teal-600" />
            <span>Jobs by ATS Provider</span>
          </h3>
          <div className="space-y-3">
            {atsBreakdown.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-800">{item.name}</span>
                  <span className="font-mono text-slate-500">{item.count.toLocaleString()} ({item.percent}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-teal-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.max(item.percent, 3)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Location Breakdown */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs">
          <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-indigo-600" />
            <span>Top Geographic Hubs</span>
          </h3>
          <div className="space-y-3">
            {locationBreakdown.map((loc) => (
              <div key={loc.city} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 text-xs">
                <span className="font-semibold text-slate-800">{loc.city}</span>
                <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                  {loc.count.toLocaleString()} jobs
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
