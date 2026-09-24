"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Building2, 
  Search, 
  ExternalLink, 
  Briefcase, 
  CheckCircle, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { mockCompanies } from "@/lib/mock-data";

export default function AdminCompaniesPage() {
  const [search, setSearch] = useState("");
  const [selectedAts, setSelectedAts] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const companiesList = mockCompanies.map((c, i) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    industry: c.industry,
    ats: i === 0 || i === 1 || i === 2 || i === 3 ? "Greenhouse" : i === 4 ? "Lever" : "Official Domains",
    activeJobs: c.active_job_count || (i * 15 + 12),
    expiredJobs: Math.floor((c.active_job_count || 10) * 0.15),
    lastSync: `${(i % 5) * 8 + 4} min ago`,
    linkHealth: i === 6 ? "Warning" : "100% Verified",
    status: "Active",
    careersUrl: c.careers_url || c.website || "#"
  }));

  const filtered = companiesList.filter(c => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!c.name.toLowerCase().includes(q) && !c.industry.toLowerCase().includes(q)) return false;
    }
    if (selectedAts && c.ats !== selectedAts) return false;
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
            <Building2 className="w-6 h-6 text-indigo-600" />
            <span>Hiring Companies &amp; ATS Endpoints</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Directory of 20,712 verified corporate hiring entities synchronized into JobPulse.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search companies by name or industry..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 outline-none focus:bg-white focus:border-teal-500"
            />
          </div>

          <div>
            <select
              value={selectedAts}
              onChange={(e) => { setSelectedAts(e.target.value); setCurrentPage(1); }}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 outline-none focus:bg-white focus:border-teal-500"
            >
              <option value="">All ATS Platforms</option>
              <option value="Greenhouse">Greenhouse</option>
              <option value="Lever">Lever</option>
              <option value="Official Domains">Official Domains</option>
            </select>
          </div>
        </div>
      </div>

      {/* Companies Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/90 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Company</th>
                <th className="p-3.5">Industry</th>
                <th className="p-3.5">ATS Provider</th>
                <th className="p-3.5">Active Jobs</th>
                <th className="p-3.5">Expired Jobs</th>
                <th className="p-3.5">Last Sync</th>
                <th className="p-3.5">Link Health</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pagedItems.map((comp) => (
                <tr key={comp.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3.5">
                    <Link
                      href={`/companies/${comp.slug}`}
                      target="_blank"
                      className="font-bold text-slate-900 hover:text-teal-600 transition-colors"
                    >
                      {comp.name}
                    </Link>
                  </td>
                  <td className="p-3.5 text-slate-500">
                    {comp.industry}
                  </td>
                  <td className="p-3.5">
                    <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {comp.ats}
                    </span>
                  </td>
                  <td className="p-3.5 font-bold text-teal-700">
                    {comp.activeJobs.toLocaleString()}
                  </td>
                  <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                    {comp.expiredJobs}
                  </td>
                  <td className="p-3.5 text-slate-500 font-mono text-[11px]">
                    {comp.lastSync}
                  </td>
                  <td className="p-3.5">
                    <span className={`inline-flex items-center gap-1 font-semibold text-[11px] ${
                      comp.linkHealth === "Warning" ? "text-amber-600" : "text-emerald-600"
                    }`}>
                      {comp.linkHealth === "Warning" ? (
                        <AlertTriangle className="w-3.5 h-3.5" />
                      ) : (
                        <CheckCircle className="w-3.5 h-3.5" />
                      )}
                      <span>{comp.linkHealth}</span>
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <a
                      href={comp.careersUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 hover:text-teal-600 hover:border-teal-300 font-semibold text-[11px] transition-colors"
                    >
                      <span>Careers Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-3.5 bg-slate-50/50 border-t border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-900">{totalItems === 0 ? 0 : startIndex + 1}</strong> to{" "}
            <strong className="text-slate-900">{Math.min(startIndex + pageSize, totalItems)}</strong> of{" "}
            <strong className="text-slate-900">{totalItems}</strong> companies
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
