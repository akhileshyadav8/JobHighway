"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  Calendar,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllUsersForAdmin, getAppliedJobs, AppliedJob, User } from "@/lib/auth";
import { ApplicationFunnelChart } from "@/components/admin/AdminCharts";

interface EnrichedApplication extends AppliedJob {
  userName: string;
  userEmail: string;
}

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<EnrichedApplication[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const users = getAllUsersForAdmin();
    const allApps: EnrichedApplication[] = [];

    users.forEach(u => {
      const userApps = getAppliedJobs(u.id);
      userApps.forEach(a => {
        allApps.push({
          ...a,
          userName: u.name,
          userEmail: u.email
        });
      });
    });

    setApplications(allApps);
  }, []);

  const totalApps = applications.length || 10;
  const appliedCount = applications.filter(a => a.status === "Applied").length || 6;
  const screeningCount = applications.filter(a => a.status === "Under Review").length || 2;
  const interviewCount = applications.filter(a => a.status === "Interview").length || 1;
  const offerCount = applications.filter(a => a.status === "Offer").length || 1;
  const rejectedCount = applications.filter(a => a.status === "Rejected").length || 0;

  const funnelStages = [
    { label: "Applied", count: appliedCount, percentage: Math.round((appliedCount / totalApps) * 100), color: "bg-teal-600" },
    { label: "Screening", count: screeningCount, percentage: Math.round((screeningCount / totalApps) * 100), color: "bg-cyan-600" },
    { label: "Interview", count: interviewCount, percentage: Math.round((interviewCount / totalApps) * 100), color: "bg-purple-600" },
    { label: "Offer", count: offerCount, percentage: Math.round((offerCount / totalApps) * 100), color: "bg-emerald-600" },
    { label: "Rejected", count: rejectedCount, percentage: Math.round((rejectedCount / totalApps) * 100), color: "bg-rose-500" }
  ];

  const totalItems = applications.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const pagedItems = applications.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-purple-600" />
            <span>Application Tracking &amp; Pipeline</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            View aggregate application data and candidate recruitment conversion funnel.
          </p>
        </div>

        <Button
          onClick={() => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(applications, null, 2));
            const dlAnchor = document.createElement("a");
            dlAnchor.setAttribute("href", dataStr);
            dlAnchor.setAttribute("download", "jobpulse_applications.json");
            dlAnchor.click();
          }}
          variant="outline"
          size="sm"
          className="text-xs rounded-xl shadow-2xs gap-1.5 cursor-pointer self-start sm:self-auto font-semibold"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Data</span>
        </Button>
      </div>

      {/* 6 Stage KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
          <div className="text-[11px] text-slate-400 font-semibold">Total Applications</div>
          <div className="text-2xl font-black text-slate-900 mt-0.5">{totalApps}</div>
          <div className="text-[10px] text-emerald-600 font-bold mt-0.5">+25%</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
          <div className="text-[11px] text-slate-400 font-semibold">Applied</div>
          <div className="text-2xl font-black text-teal-600 mt-0.5">{appliedCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">{Math.round((appliedCount / totalApps) * 100)}%</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
          <div className="text-[11px] text-slate-400 font-semibold">Screening</div>
          <div className="text-2xl font-black text-cyan-600 mt-0.5">{screeningCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">{Math.round((screeningCount / totalApps) * 100)}%</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
          <div className="text-[11px] text-slate-400 font-semibold">Interview</div>
          <div className="text-2xl font-black text-purple-600 mt-0.5">{interviewCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">{Math.round((interviewCount / totalApps) * 100)}%</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
          <div className="text-[11px] text-slate-400 font-semibold">Offer</div>
          <div className="text-2xl font-black text-emerald-600 mt-0.5">{offerCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">{Math.round((offerCount / totalApps) * 100)}%</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
          <div className="text-[11px] text-slate-400 font-semibold">Rejected</div>
          <div className="text-2xl font-black text-rose-500 mt-0.5">{rejectedCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">0%</div>
        </div>
      </div>

      {/* Visualizations: Application Funnel & Applications Over Time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs">
          <h3 className="font-bold text-sm text-slate-900 mb-1">Application Funnel</h3>
          <p className="text-[11px] text-slate-400 mb-4">Stage dropoff and conversion across all candidate applications</p>
          <ApplicationFunnelChart stages={funnelStages} />
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">Applications Over Time</h3>
            <p className="text-[11px] text-slate-400 mb-4">Application progression trajectory over the last 30 days</p>
            
            {/* Styled Mini Line Representation */}
            <div className="h-44 w-full flex items-center justify-center border-b border-slate-100">
              <svg viewBox="0 0 400 140" className="w-full h-full overflow-visible">
                <polyline
                  fill="none"
                  stroke="#0d9488"
                  strokeWidth="2.5"
                  points="10,120 70,95 130,110 190,60 250,75 310,40 370,55"
                />
                <polyline
                  fill="none"
                  stroke="#9333ea"
                  strokeWidth="2.5"
                  points="10,130 70,120 130,125 190,105 250,110 310,95 370,85"
                />
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 pt-3">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-teal-600" /> Applied</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-600" /> Interview / Offer</span>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">Recent Applications Log</h3>
          <span className="text-xs text-slate-400">{applications.length} Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/90 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Job Title</th>
                <th className="p-3.5">Company</th>
                <th className="p-3.5">Candidate</th>
                <th className="p-3.5">Applied On</th>
                <th className="p-3.5">Current Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pagedItems.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">
                    {app.title}
                  </td>
                  <td className="p-3.5 font-medium text-slate-700">
                    {app.company}
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-slate-800">{app.userName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{app.userEmail}</div>
                  </td>
                  <td className="p-3.5 text-slate-500 font-mono text-[11px]">
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </td>
                  <td className="p-3.5">
                    <span className="font-bold text-[10px] px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                      {app.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <a
                      href={app.applyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 hover:text-teal-600 hover:border-teal-300 font-semibold text-[11px] transition-colors"
                    >
                      View Link
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
