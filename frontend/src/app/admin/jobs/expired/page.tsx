"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, RefreshCw, CheckCircle, Trash2, ExternalLink, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockJobs } from "@/lib/mock-data";
import { detectAtsPlatform } from "@/lib/adminData";

export default function AdminExpiredJobsPage() {
  const [expiredJobs, setExpiredJobs] = useState(() => 
    mockJobs.slice(0, 15).map((j, i) => ({
      id: j.id || `exp_${i}`,
      title: j.title,
      company: j.company?.name || "Partner Company",
      ats: detectAtsPlatform(j.apply_url || j.job_url),
      expiredDate: `${(i % 10) + 1} days ago`,
      lastVerified: `${i * 3 + 2} hours ago`,
      url: j.apply_url || j.job_url || "#"
    }))
  );

  const handleReactivate = (id: string | number) => {
    setExpiredJobs(prev => prev.filter(j => j.id !== id));
  };

  const handleRemove = (id: string | number) => {
    setExpiredJobs(prev => prev.filter(j => j.id !== id));
  };

  return (
    <div className="space-y-5 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/admin/jobs" className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1 font-medium">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to All Jobs
            </Link>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <span>Expired Job Postings</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit and re-verify roles that have closed or been unlisted by employer career portals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => alert("Verification pipeline started for all expired listings!")}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-2xs gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Recheck All Expired</span>
          </Button>
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/90 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Job Title</th>
                <th className="p-3.5">Company</th>
                <th className="p-3.5">ATS Source</th>
                <th className="p-3.5">Expired On</th>
                <th className="p-3.5">Last Verified</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expiredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">
                    {job.title}
                  </td>
                  <td className="p-3.5 font-medium text-slate-700">
                    {job.company}
                  </td>
                  <td className="p-3.5">
                    <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {job.ats}
                    </span>
                  </td>
                  <td className="p-3.5 text-rose-600 font-medium font-mono text-[11px]">
                    {job.expiredDate}
                  </td>
                  <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                    {job.lastVerified}
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    <button
                      onClick={() => handleReactivate(job.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100 font-semibold text-[11px] transition-colors cursor-pointer"
                    >
                      <CheckCircle className="w-3 h-3" />
                      <span>Reactivate</span>
                    </button>
                    <button
                      onClick={() => handleRemove(job.id)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 transition-colors cursor-pointer"
                      title="Permanently remove"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
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
