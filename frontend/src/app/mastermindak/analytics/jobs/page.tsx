"use client";

import Link from "next/link";
import { PieChart, ArrowLeft, Briefcase, MapPin, Radio, Building2 } from "lucide-react";
import { JobActivityChart } from "@/components/admin/AdminCharts";

export default function AdminJobAnalyticsPage() {
  const atsBreakdown = [
    { name: "Greenhouse", count: 18420, percent: 29 },
    { name: "Lever", count: 12381, percent: 19 },
    { name: "Workday", count: 8920, percent: 14 },
    { name: "Official Domains", count: 6590, percent: 10 },
    { name: "Ashby", count: 6421, percent: 10 },
    { name: "SmartRecruiters", count: 4221, percent: 7 },
    { name: "iCIMS", count: 3890, percent: 6 },
    { name: "Taleo", count: 2814, percent: 5 }
  ];

  const locationBreakdown = [
    { city: "Bengaluru, Karnataka", count: 18940 },
    { city: "Hyderabad, Telangana", count: 11420 },
    { city: "Remote (India)", count: 9850 },
    { city: "Pune, Maharashtra", count: 7210 },
    { city: "Delhi NCR (Gurugram / Noida)", count: 6940 }
  ];

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
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>{item.name}</span>
                  <span className="font-mono text-slate-500">{item.count.toLocaleString()} ({item.percent}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-teal-600 h-full rounded-full" style={{ width: `${item.percent}%` }} />
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
          <div className="space-y-2.5 text-xs">
            {locationBreakdown.map((loc) => (
              <div key={loc.city} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50">
                <span className="font-semibold text-slate-800">{loc.city}</span>
                <span className="font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-bold">
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
