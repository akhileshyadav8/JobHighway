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
  ChevronRight,
  ShieldCheck,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  getAdminJobs, 
  addAdminJob, 
  updateAdminJobStatus, 
  deleteAdminJob, 
  bulkDeleteAdminJobs, 
  AdminJobItem,
  detectAtsPlatform
} from "@/lib/adminData";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<AdminJobItem[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "expired" | "broken">("all");
  const [search, setSearch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedAts, setSelectedAts] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  
  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Add Job Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState("");
  const [newJobCompany, setNewJobCompany] = useState("");
  const [newJobLocation, setNewJobLocation] = useState("");
  const [newJobUrl, setNewJobUrl] = useState("");
  const [newJobSalary, setNewJobSalary] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setJobs(getAdminJobs());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle.trim() || !newJobCompany.trim()) {
      alert("Please provide at least a Job Title and Company name.");
      return;
    }

    const created = addAdminJob({
      title: newJobTitle.trim(),
      company: newJobCompany.trim(),
      location: newJobLocation.trim() || "Remote, India",
      applyUrl: newJobUrl.trim() || "https://jobpulse.io",
      salary: newJobSalary.trim() || "Competitive (Benchmark)",
      status: "Active"
    });

    setJobs(getAdminJobs());
    setIsAddModalOpen(false);
    setNewJobTitle("");
    setNewJobCompany("");
    setNewJobLocation("");
    setNewJobUrl("");
    setNewJobSalary("");
    showToast(`Successfully added "${created.title}" at ${created.company}`);
  };

  const handleStatusChange = (id: string | number, newStatus: AdminJobItem["status"]) => {
    updateAdminJobStatus(id, newStatus);
    setJobs(getAdminJobs());
    showToast(`Updated status to ${newStatus}`);
  };

  const handleDelete = (id: string | number) => {
    if (confirm("Are you sure you want to permanently delete this job listing?")) {
      deleteAdminJob(id);
      setSelectedIds(prev => prev.filter(x => x !== String(id)));
      setJobs(getAdminJobs());
      showToast("Job removed from catalog.");
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedIds.length} selected job postings?`)) {
      bulkDeleteAdminJobs(selectedIds);
      setSelectedIds([]);
      setJobs(getAdminJobs());
      showToast(`Purged ${selectedIds.length} job postings.`);
    }
  };

  // Dynamic counts
  const allCount = jobs.length;
  const activeCount = jobs.filter(j => j.status === "Active").length;
  const expiredCount = jobs.filter(j => j.status === "Expired").length;
  const brokenCount = jobs.filter(j => j.status === "Broken").length;

  // Companies & ATS options for dropdown
  const uniqueCompanies = Array.from(new Set(jobs.map(j => j.company))).slice(0, 30);
  const uniqueAts = ["Greenhouse", "Lever", "Workday", "Ashby", "SmartRecruiters", "iCIMS", "Taleo", "Official Domains"];

  // Filter logic
  const filtered = jobs.filter((job) => {
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
    setSelectedStatus("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

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

        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <Button
              onClick={handleBulkDelete}
              variant="outline"
              className="border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold rounded-xl gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected ({selectedIds.length})</span>
            </Button>
          )}

          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-2xs gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Job (Manual)</span>
          </Button>
        </div>
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
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-600 font-bold">
            {allCount.toLocaleString()}
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
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-700 font-bold">
            {activeCount.toLocaleString()}
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
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-50 text-amber-700 font-bold">
            {expiredCount.toLocaleString()}
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
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-50 text-rose-700 font-bold">
            {brokenCount.toLocaleString()}
          </span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by job title, company name, or location..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50/50 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-teal-500 focus:outline-none transition-all"
            />
            {search && (
              <button 
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Company Filter Dropdown */}
          <select
            value={selectedCompany}
            onChange={(e) => { setSelectedCompany(e.target.value); setCurrentPage(1); }}
            className="w-full md:w-44 py-1.5 px-2.5 rounded-lg border border-slate-200 bg-slate-50/50 text-xs text-slate-700 font-medium focus:bg-white focus:border-teal-500 focus:outline-none cursor-pointer"
          >
            <option value="">All Companies</option>
            {uniqueCompanies.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* ATS Source Dropdown */}
          <select
            value={selectedAts}
            onChange={(e) => { setSelectedAts(e.target.value); setCurrentPage(1); }}
            className="w-full md:w-40 py-1.5 px-2.5 rounded-lg border border-slate-200 bg-slate-50/50 text-xs text-slate-700 font-medium focus:bg-white focus:border-teal-500 focus:outline-none cursor-pointer"
          >
            <option value="">All ATS Sources</option>
            {uniqueAts.map(ats => (
              <option key={ats} value={ats}>{ats}</option>
            ))}
          </select>

          {/* Clear Filters */}
          {(search || selectedCompany || selectedAts || selectedStatus) && (
            <button
              onClick={handleClearFilters}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 whitespace-nowrap cursor-pointer px-2"
            >
              Reset
            </button>
          )}

        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/90 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3 w-8">
                  <input
                    type="checkbox"
                    checked={pagedJobs.length > 0 && selectedIds.length === pagedJobs.length}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                  />
                </th>
                <th className="p-3">Job Title &amp; Role</th>
                <th className="p-3">Company</th>
                <th className="p-3">Location</th>
                <th className="p-3">ATS Source</th>
                <th className="p-3">Posted</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pagedJobs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No job postings found matching the selected filters.
                  </td>
                </tr>
              ) : (
                pagedJobs.map((job) => {
                  const isSelected = selectedIds.includes(String(job.id));
                  return (
                    <tr 
                      key={job.id} 
                      className={`hover:bg-slate-50/70 transition-colors ${isSelected ? "bg-teal-50/30" : ""}`}
                    >
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(String(job.id))}
                          className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                        />
                      </td>
                      <td className="p-3 max-w-[260px]">
                        <div className="font-bold text-slate-900 truncate">
                          {job.title}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono truncate">
                          {job.salary || "Competitive Compensation"}
                        </div>
                      </td>
                      <td className="p-3 font-semibold text-slate-700 whitespace-nowrap">
                        {job.company}
                      </td>
                      <td className="p-3 text-slate-500 max-w-[160px] truncate">
                        {job.location}
                      </td>
                      <td className="p-3">
                        <span className="font-mono text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                          {job.ats}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                        {job.posted}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <select
                          value={job.status}
                          onChange={(e) => handleStatusChange(job.id, e.target.value as any)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border cursor-pointer outline-none ${
                            job.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                            job.status === "Expired" ? "bg-amber-50 text-amber-700 border-amber-200" :
                            "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          <option value="Active">Active</option>
                          <option value="Expired">Expired</option>
                          <option value="Broken">Broken</option>
                        </select>
                      </td>
                      <td className="p-3 text-right whitespace-nowrap space-x-1.5">
                        <a
                          href={job.applyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex p-1.5 text-slate-400 hover:text-teal-600 rounded-lg hover:bg-slate-100 transition-colors"
                          title="View Live ATS Post"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="inline-flex p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing <span className="font-bold text-slate-800">{totalItems > 0 ? startIndex + 1 : 0}</span> to{" "}
            <span className="font-bold text-slate-800">{Math.min(startIndex + pageSize, totalItems)}</span> of{" "}
            <span className="font-bold text-slate-800">{totalItems.toLocaleString()}</span> jobs
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
            <span className="text-xs px-2 font-medium">
              Page {currentPage} of {totalPages}
            </span>
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

      {/* Add Job Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-teal-600" />
                <span>Add Job Posting (Direct Ingestion)</span>
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Backend Engineer (Distributed Systems)"
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Razorpay"
                    value={newJobCompany}
                    onChange={(e) => setNewJobCompany(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Bengaluru, India (Hybrid)"
                    value={newJobLocation}
                    onChange={(e) => setNewJobLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Direct ATS Apply URL</label>
                <input
                  type="url"
                  placeholder="https://boards.greenhouse.io/company/jobs/12345"
                  value={newJobUrl}
                  onChange={(e) => setNewJobUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-teal-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Salary Range (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. INR 25.0L - 35.0L"
                  value={newJobSalary}
                  onChange={(e) => setNewJobSalary(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-xs rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl"
                >
                  Publish to Catalog
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
