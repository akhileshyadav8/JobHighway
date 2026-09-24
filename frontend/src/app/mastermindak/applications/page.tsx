"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllUsersForAdmin, getAppliedJobs } from "@/lib/auth";
import { getAdminApplications, updateApplicationStatus, CandidateApplication } from "@/lib/adminData";
import { ApplicationFunnelChart } from "@/components/admin/AdminCharts";

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<CandidateApplication[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const pageSize = 8;

  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = () => {
    const list = getAdminApplications();
    setApplications(list);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleStatusChange = (id: string, newStatus: CandidateApplication["status"]) => {
    updateApplicationStatus(id, newStatus);
    loadApps();
    showToast(`Updated candidate status to "${newStatus}".`);
  };

  const totalApps = applications.length;
  const appliedCount = applications.filter(a => a.status === "Applied").length;
  const reviewingCount = applications.filter(a => a.status === "Reviewing").length;
  const interviewCount = applications.filter(a => a.status === "Interview").length;
  const offerCount = applications.filter(a => a.status === "Offer").length;
  const rejectedCount = applications.filter(a => a.status === "Rejected").length;

  const filtered = applications.filter(a => {
    if (statusFilter && a.status !== statusFilter) return false;
    return true;
  });

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const pagedItems = filtered.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-6 pb-12">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-purple-600" />
            <span>Candidate Application Tracker &amp; Pipeline</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor real-time recruitment funnels and status transitions across candidate applications.
          </p>
        </div>

        <Button
          onClick={() => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(applications, null, 2));
            const dlAnchor = document.createElement("a");
            dlAnchor.setAttribute("href", dataStr);
            dlAnchor.setAttribute("download", "jobhighway_applications.json");
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
          <div className="text-[11px] text-slate-400 font-semibold">Total Tracked</div>
          <div className="text-2xl font-black text-slate-900 mt-0.5">{totalApps}</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
          <div className="text-[11px] text-teal-600 font-semibold">Applied</div>
          <div className="text-2xl font-black text-teal-700 mt-0.5">{appliedCount}</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
          <div className="text-[11px] text-cyan-600 font-semibold">Under Review</div>
          <div className="text-2xl font-black text-cyan-700 mt-0.5">{reviewingCount}</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
          <div className="text-[11px] text-purple-600 font-semibold">Interviews</div>
          <div className="text-2xl font-black text-purple-700 mt-0.5">{interviewCount}</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
          <div className="text-[11px] text-emerald-600 font-semibold">Offers Extended</div>
          <div className="text-2xl font-black text-emerald-700 mt-0.5">{offerCount}</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
          <div className="text-[11px] text-rose-500 font-semibold">Archived / Rejected</div>
          <div className="text-2xl font-black text-rose-600 mt-0.5">{rejectedCount}</div>
        </div>
      </div>

      {/* Funnel Visualisation */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs">
        <h3 className="font-bold text-sm text-slate-900 mb-3">Recruitment Funnel Velocity</h3>
        <ApplicationFunnelChart />
      </div>

      {/* Applications Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">Applicant Submissions</h3>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="text-xs border border-slate-200 bg-slate-50 py-1 px-2.5 rounded-lg font-medium cursor-pointer"
          >
            <option value="">All Stages</option>
            <option value="Applied">Applied</option>
            <option value="Reviewing">Reviewing</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/90 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Candidate</th>
                <th className="p-3.5">Target Role</th>
                <th className="p-3.5">Hiring Employer</th>
                <th className="p-3.5">Match Score</th>
                <th className="p-3.5">Applied Date</th>
                <th className="p-3.5">Recruitment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pagedItems.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900">{app.candidateName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{app.candidateEmail}</div>
                  </td>
                  <td className="p-3.5 font-semibold text-slate-800">
                    {app.jobTitle}
                  </td>
                  <td className="p-3.5 text-slate-600">
                    {app.company}
                  </td>
                  <td className="p-3.5">
                    <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded text-[11px] border border-teal-100">
                      {app.matchScore}% Match
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                    {app.appliedAt}
                  </td>
                  <td className="p-3.5">
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value as any)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border cursor-pointer outline-none ${
                        app.status === "Offer" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        app.status === "Interview" ? "bg-purple-50 text-purple-700 border-purple-200" :
                        app.status === "Reviewing" ? "bg-cyan-50 text-cyan-700 border-cyan-200" :
                        app.status === "Applied" ? "bg-teal-50 text-teal-700 border-teal-200" :
                        "bg-rose-50 text-rose-700 border-rose-200"
                      }`}
                    >
                      <option value="Applied">Applied</option>
                      <option value="Reviewing">Reviewing</option>
                      <option value="Interview">Interview</option>
                      <option value="Offer">Offer</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <span className="font-bold text-slate-800">{totalItems > 0 ? startIndex + 1 : 0}</span> to{" "}
            <span className="font-bold text-slate-800">{Math.min(startIndex + pageSize, totalItems)}</span> of{" "}
            <span className="font-bold text-slate-800">{totalItems}</span> applications
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="text-xs h-8 px-2.5 rounded-lg"
            >
              <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Prev
            </Button>
            <span className="text-xs px-2 font-medium">Page {currentPage} of {totalPages}</span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="text-xs h-8 px-2.5 rounded-lg"
            >
              Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
