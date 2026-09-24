"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Building2, 
  Search, 
  ExternalLink, 
  Briefcase, 
  CheckCircle, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAdminCompanies, AdminCompanyItem } from "@/lib/adminData";

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<AdminCompanyItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedAts, setSelectedAts] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Add Company Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCompName, setNewCompName] = useState("");
  const [newCompIndustry, setNewCompIndustry] = useState("");
  const [newCompAts, setNewCompAts] = useState("Greenhouse");
  const [newCompUrl, setNewCompUrl] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setCompanies(getAdminCompanies());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompName.trim()) return;

    const newComp: AdminCompanyItem = {
      id: `comp_${Date.now()}`,
      name: newCompName.trim(),
      slug: newCompName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      industry: newCompIndustry.trim() || "Technology",
      ats: newCompAts,
      activeJobs: 1,
      expiredJobs: 0,
      lastSync: "Just now",
      linkHealth: "100% Verified",
      status: "Active",
      careersUrl: newCompUrl.trim() || `https://${newCompName.toLowerCase().replace(/[^a-z0-9]/g, "")}.com/careers`
    };

    setCompanies(prev => [newComp, ...prev]);
    setIsAddModalOpen(false);
    setNewCompName("");
    setNewCompIndustry("");
    setNewCompUrl("");
    showToast(`Added hiring partner ${newComp.name} with ${newComp.ats} integration.`);
  };

  const filtered = companies.filter(c => {
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

  const uniqueAts = ["Greenhouse", "Lever", "Workday", "Ashby", "SmartRecruiters", "iCIMS", "Taleo", "Official Domains"];

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
            <Building2 className="w-6 h-6 text-indigo-600" />
            <span>Hiring Companies &amp; ATS Endpoints ({companies.length})</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Directory of corporate employers with direct ATS ingest feeds and official career portal mapping.
          </p>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-2xs gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Hiring Partner</span>
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search company name, industry, or domain..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50/50 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-teal-500 focus:outline-none"
          />
        </div>

        <select
          value={selectedAts}
          onChange={(e) => { setSelectedAts(e.target.value); setCurrentPage(1); }}
          className="w-full md:w-44 py-1.5 px-2.5 rounded-lg border border-slate-200 bg-slate-50/50 text-xs text-slate-700 font-medium focus:bg-white focus:border-teal-500 focus:outline-none cursor-pointer"
        >
          <option value="">All ATS Platforms</option>
          {uniqueAts.map(ats => (
            <option key={ats} value={ats}>{ats}</option>
          ))}
        </select>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/90 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Company Name</th>
                <th className="p-3.5">Industry</th>
                <th className="p-3.5">ATS Provider</th>
                <th className="p-3.5">Active Roles</th>
                <th className="p-3.5">Link Health</th>
                <th className="p-3.5">Last Ingested</th>
                <th className="p-3.5 text-right">Portal Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pagedItems.map((comp) => (
                <tr key={comp.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">
                    {comp.name}
                  </td>
                  <td className="p-3.5 text-slate-600">
                    {comp.industry}
                  </td>
                  <td className="p-3.5">
                    <span className="font-mono text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                      {comp.ats}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-slate-700 font-semibold">
                    {comp.activeJobs.toLocaleString()} jobs
                  </td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] border border-emerald-200">
                      <CheckCircle className="w-3 h-3" />
                      <span>{comp.linkHealth}</span>
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                    {comp.lastSync}
                  </td>
                  <td className="p-3.5 text-right">
                    <a
                      href={comp.careersUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-slate-500 hover:text-indigo-600 font-semibold text-[11px]"
                    >
                      <span>Careers</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
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
            <span className="font-bold text-slate-800">{totalItems}</span> companies
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

      {/* Add Company Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-600" />
                <span>Add Hiring Partner</span>
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCompany} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Swiggy"
                  value={newCompName}
                  onChange={(e) => setNewCompName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Industry</label>
                <input
                  type="text"
                  placeholder="e.g. On-demand Food & Quick Commerce"
                  value={newCompIndustry}
                  onChange={(e) => setNewCompIndustry(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">ATS Ingestion System</label>
                <select
                  value={newCompAts}
                  onChange={(e) => setNewCompAts(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-indigo-500 focus:outline-none"
                >
                  {uniqueAts.map(ats => (
                    <option key={ats} value={ats}>{ats}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Career Portal URL</label>
                <input
                  type="url"
                  placeholder="https://careers.swiggy.com"
                  value={newCompUrl}
                  onChange={(e) => setNewCompUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-indigo-500 focus:outline-none font-mono"
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
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl"
                >
                  Save Partner
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
