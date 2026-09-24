"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  HeartPulse, 
  Search, 
  ExternalLink, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle, 
  Clock,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLinkHealthRecords, LinkHealthItem } from "@/lib/adminData";

export default function AdminLinkHealthPage() {
  const [records, setRecords] = useState<LinkHealthItem[]>(getLinkHealthRecords());
  const [search, setSearch] = useState("");
  const [selectedStatusType, setSelectedStatusType] = useState<string>("");
  const [selectedHttpStatus, setSelectedHttpStatus] = useState<string>("");
  const [selectedAts, setSelectedAts] = useState<string>("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handleRecheck = (id: string) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, lastChecked: "just now", attempts: 1 } : r));
  };

  const handleDeactivate = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  const filtered = records.filter(item => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match = item.jobTitle.toLowerCase().includes(q) || item.company.toLowerCase().includes(q) || item.url.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (selectedStatusType && item.statusType !== selectedStatusType) return false;
    if (selectedHttpStatus && String(item.httpStatus) !== selectedHttpStatus) return false;
    if (selectedAts && item.ats !== selectedAts) return false;
    return true;
  });

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const pagedItems = filtered.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <HeartPulse className="w-6 h-6 text-teal-600" />
            <span>Link Health &amp; Verification</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor job link health, broken URLs, redirects and expired postings.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => alert("Verification crawler launched across all indexed URLs!")}
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-2xs gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Verify All Endpoints</span>
        </Button>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Healthy Links</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600">61,420</div>
          <div className="text-[11px] text-slate-400 mt-0.5">HTTP 200 OK endpoints</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Broken Links</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600">182</div>
          <div className="text-[11px] text-rose-500 font-medium mt-0.5">Flagged for remediation</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Redirected</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">93</div>
          <div className="text-[11px] text-slate-400 mt-0.5">HTTP 301/302 redirects</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Expired Jobs</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-indigo-600">2,055</div>
          <div className="text-[11px] text-slate-400 mt-0.5">De-indexed automatically</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search by job title, company, or URL..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 outline-none focus:bg-white focus:border-teal-500"
            />
          </div>

          <div>
            <select
              value={selectedStatusType}
              onChange={(e) => { setSelectedStatusType(e.target.value); setCurrentPage(1); }}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 outline-none focus:bg-white focus:border-teal-500"
            >
              <option value="">All Status Types</option>
              <option value="healthy">Healthy</option>
              <option value="broken">Broken (404/403/500)</option>
              <option value="redirect">Redirect (301)</option>
              <option value="expired">Expired (410)</option>
            </select>
          </div>

          <div>
            <select
              value={selectedAts}
              onChange={(e) => { setSelectedAts(e.target.value); setCurrentPage(1); }}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 outline-none focus:bg-white focus:border-teal-500"
            >
              <option value="">ATS Source</option>
              <option value="Greenhouse">Greenhouse</option>
              <option value="Lever">Lever</option>
              <option value="Workday">Workday</option>
              <option value="Ashby">Ashby</option>
              <option value="Official Domains">Official Domains</option>
            </select>
          </div>

          <div className="flex items-center">
            <button
              onClick={() => { setSearch(""); setSelectedStatusType(""); setSelectedAts(""); setCurrentPage(1); }}
              className="w-full py-1.5 px-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Main Health Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/90 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Job Title</th>
                <th className="p-3.5">Company</th>
                <th className="p-3.5">URL</th>
                <th className="p-3.5">HTTP Status</th>
                <th className="p-3.5">Last Checked</th>
                <th className="p-3.5">Attempts</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pagedItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No broken or flagged links found. All endpoints responding OK.
                  </td>
                </tr>
              ) : (
                pagedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">
                      {item.jobTitle}
                    </td>
                    <td className="p-3.5 font-medium text-slate-700">
                      {item.company}
                    </td>
                    <td className="p-3.5">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-teal-600 hover:underline"
                        title={item.url}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span className="font-mono text-[11px] truncate max-w-[120px]">{item.ats}</span>
                      </a>
                    </td>
                    <td className="p-3.5">
                      <span className={`inline-flex items-center gap-1 font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                        item.httpStatus === 200 ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                        item.httpStatus === 301 ? "bg-amber-50 text-amber-700 border border-amber-200" :
                        "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}>
                        <span>{item.httpStatus}</span>
                        <span className="text-[10px] font-sans font-medium text-slate-500">({item.statusText})</span>
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                      {item.lastChecked}
                    </td>
                    <td className="p-3.5 text-slate-600 font-mono text-[11px]">
                      {item.attempts}
                    </td>
                    <td className="p-3.5 text-right space-x-1.5">
                      <button
                        onClick={() => handleRecheck(item.id)}
                        className="px-2.5 py-1 rounded-lg border border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100 font-semibold text-[11px] transition-colors cursor-pointer"
                      >
                        Recheck
                      </button>
                      {item.statusType === "broken" && (
                        <button
                          onClick={() => handleDeactivate(item.id)}
                          className="px-2.5 py-1 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold text-[11px] transition-colors cursor-pointer"
                        >
                          Deactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-3.5 bg-slate-50/50 border-t border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-900">{totalItems === 0 ? 0 : startIndex + 1}</strong> to{" "}
            <strong className="text-slate-900">{Math.min(startIndex + pageSize, totalItems)}</strong> of{" "}
            <strong className="text-slate-900">{totalItems}</strong> verified records
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 font-semibold text-slate-800">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
