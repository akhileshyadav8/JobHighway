"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, 
  Plus, 
  ExternalLink, 
  Filter, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Trash2, 
  RefreshCw,
  MoreVertical,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockJobs, mockCompanies } from "@/lib/mock-data";
import { detectAtsPlatform } from "@/lib/adminData";

interface JobRow {
  id: string | number;
  title: string;
  slug: string;
  company: string;
  location: string;
  ats: string;
  posted: string;
  status: "Active" | "Expired" | "Broken";
  applyUrl: string;
}

export default function AdminJobsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "active" | "expired" | "broken">("all");
  const [search, setSearch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedAts, setSelectedAts] = useState("");
  const [selectedWorkMode, setSelectedWorkMode] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  
  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Add Job Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState("");
  const [newJobCompany, setNewJobCompany] = useState("");
  const [newJobLocation, setNewJobLocation] = useState("");
  const [newJobUrl, setNewJobUrl] = useState("");

  // Map mockJobs into unified list
  const allJobsData: JobRow[] = mockJobs.map((j, idx) => {
    let status: JobRow["status"] = "Active";
    if (idx % 15 === 0) status = "Expired";
    else if (idx % 27 === 0) status = "Broken";

    return {
      id: j.id || `job_${idx}`,
      title: j.title,
      slug: j.slug,
      company: j.company?.name || "JobPulse Partner",
      location: Array.isArray(j.location) ? j.location.join(", ") : (j.location || "Remote"),
      ats: detectAtsPlatform(j.apply_url || j.job_url),
      posted: `${(idx % 12) + 1} days ago`,
      status,
      applyUrl: j.apply_url || j.job_url || "#"
    };
  });

  // Filter logic
  const filtered = allJobsData.filter((job) => {
    if (activeTab === "active" && job.status !== "Active") return false;
    if (activeTab === "expired" && job.status !== "Expired") return false;
    if (activeTab === "broken" && job.status !== "Broken") return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const match = job.title.toLowerCase().includes(q) || job.company.toLowerCase().includes(q) || job.location.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (selectedCompany && job.company !== selectedCompany) return false;
    if (selectedAts && job.ats !== selectedAts) return false;
    if (selectedStatus && job.status !== selectedStatus) return false;

    return true;
  });

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const pagedJobs = filtered.slice(startIndex, startIndex + pageSize);

  const toggleSelectAll = () => {
    if (selectedIds.length === pagedJobs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pagedJobs.map(j => String(j.id)));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleClearFilters = () => {
    setSearch("");
    setSelectedCompany("");
    setSelectedAts("");
    setSelectedWorkMode("");
    setSelectedStatus("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            All Job Postings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage, verify, and monitor all job postings across integrated ATS sources.
          </p>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-2xs gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Job (Manual)</span>
        </Button>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/90 overflow-x-auto pb-0">
        <button
          onClick={() => { setActiveTab("all"); setCurrentPage(1); }}
          className={`pb-3 text-xs font-semibold px-3 transition-colors cursor-pointer border-b-2 -mb-px flex items-center gap-2 ${
            activeTab === "all"
              ? "border-teal-600 text-teal-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>All Jobs</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-600">
            63,657
          </span>
        </button>

        <button
          onClick={() => { setActiveTab("active"); setCurrentPage(1); }}
          className={`pb-3 text-xs font-semibold px-3 transition-colors cursor-pointer border-b-2 -mb-px flex items-center gap-2 ${
            activeTab === "active"
              ? "border-teal-600 text-teal-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>Active</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-700">
            58,421
          </span>
        </button>

        <button
          onClick={() => { setActiveTab("expired"); setCurrentPage(1); }}
          className={`pb-3 text-xs font-semibold px-3 transition-colors cursor-pointer border-b-2 -mb-px flex items-center gap-2 ${
            activeTab === "expired"
              ? "border-teal-600 text-teal-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>Expired</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-50 text-amber-700">
            4,892
          </span>
        </button>

        <button
          onClick={() => { setActiveTab("broken"); setCurrentPage(1); }}
          className={`pb-3 text-xs font-semibold px-3 transition-colors cursor-pointer border-b-2 -mb-px flex items-center gap-2 ${
            activeTab === "broken"
              ? "border-teal-600 text-teal-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>Broken</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-50 text-rose-700">
            182
          </span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {/* Search */}
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search by title, company, or keyword..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 outline-none focus:bg-white focus:border-teal-500"
            />
          </div>

          {/* Company filter */}
          <div>
            <select
              value={selectedCompany}
              onChange={(e) => { setSelectedCompany(e.target.value); setCurrentPage(1); }}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 outline-none focus:bg-white focus:border-teal-500"
            >
              <option value="">All Companies</option>
              {mockCompanies.map(c => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* ATS Source filter */}
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
              <option value="SmartRecruiters">SmartRecruiters</option>
              <option value="Official Domains">Official Domains</option>
            </select>
          </div>

          {/* Status filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 outline-none focus:bg-white focus:border-teal-500"
            >
              <option value="">Status</option>
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
              <option value="Broken">Broken</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-center">
            <button
              onClick={handleClearFilters}
              className="w-full py-1.5 px-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/90 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={pagedJobs.length > 0 && selectedIds.length === pagedJobs.length}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                  />
                </th>
                <th className="p-3.5">Title</th>
                <th className="p-3.5">Company</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5">ATS</th>
                <th className="p-3.5">Posted</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pagedJobs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No job postings found matching your filters.
                  </td>
                </tr>
              ) : (
                pagedJobs.map((job) => {
                  const isSelected = selectedIds.includes(String(job.id));
                  return (
                    <tr key={job.id} className={`hover:bg-slate-50/70 transition-colors ${isSelected ? "bg-teal-50/30" : ""}`}>
                      <td className="p-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(String(job.id))}
                          className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                        />
                      </td>
                      <td className="p-3.5">
                        <Link 
                          href={`/jobs/${job.slug}`}
                          target="_blank"
                          className="font-bold text-slate-900 hover:text-teal-600 transition-colors"
                        >
                          {job.title}
                        </Link>
                      </td>
                      <td className="p-3.5 font-medium text-slate-700">
                        {job.company}
                      </td>
                      <td className="p-3.5 text-slate-500 truncate max-w-[150px]">
                        {job.location}
                      </td>
                      <td className="p-3.5">
                        <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          {job.ats}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-500 font-mono text-[11px]">
                        {job.posted}
                      </td>
                      <td className="p-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          job.status === "Active" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                          job.status === "Expired" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                          "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            job.status === "Active" ? "bg-emerald-500" :
                            job.status === "Expired" ? "bg-amber-500" :
                            "bg-rose-500"
                          }`} />
                          <span>{job.status}</span>
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <Link
                          href={`/jobs/${job.slug}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 hover:text-teal-600 hover:border-teal-300 font-semibold text-[11px] transition-colors"
                        >
                          <span>View</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-3.5 bg-slate-50/50 border-t border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-900">{totalItems === 0 ? 0 : startIndex + 1}</strong> to{" "}
            <strong className="text-slate-900">{Math.min(startIndex + pageSize, totalItems)}</strong> of{" "}
            <strong className="text-slate-900">{totalItems.toLocaleString()}</strong> jobs
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

      {/* Manual Add Job Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Add Job (Manual Ingestion)</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Job Title</label>
                <input
                  type="text"
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  placeholder="e.g. Senior Backend Engineer"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Company Name</label>
                <input
                  type="text"
                  value={newJobCompany}
                  onChange={(e) => setNewJobCompany(e.target.value)}
                  placeholder="e.g. Postman"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Location</label>
                <input
                  type="text"
                  value={newJobLocation}
                  onChange={(e) => setNewJobLocation(e.target.value)}
                  placeholder="e.g. Bengaluru, India / Remote"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Direct Official Apply URL</label>
                <input
                  type="url"
                  value={newJobUrl}
                  onChange={(e) => setNewJobUrl(e.target.value)}
                  placeholder="https://job-boards.greenhouse.io/..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-teal-500 font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  alert("Job manually indexed into real-time pipeline!");
                  setIsAddModalOpen(false);
                }}
                className="text-xs bg-teal-600 hover:bg-teal-700 text-white font-semibold"
              >
                Save &amp; Index Job
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
