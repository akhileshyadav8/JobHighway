"use client";

import { useState, useEffect } from "react";
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
  ChevronRight,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLinkHealthRecords, probeUrlHealth, LinkHealthItem } from "@/lib/adminData";

export default function AdminLinkHealthPage() {
  const [records, setRecords] = useState<LinkHealthItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedStatusType, setSelectedStatusType] = useState<string>("");
  const [selectedAts, setSelectedAts] = useState<string>("");
  const [probingId, setProbingId] = useState<string | null>(null);
  const [isScanningAll, setIsScanningAll] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    setRecords(getLinkHealthRecords());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRecheck = async (id: string, url: string) => {
    setProbingId(id);
    const probe = await probeUrlHealth(url);
    setProbingId(null);

    setRecords(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          httpStatus: probe.httpStatus,
          statusText: probe.statusText,
          statusType: probe.statusType,
          lastChecked: "Just now",
          attempts: 1
        };
      }
      return r;
    }));

    showToast(`Probed ${url}: HTTP ${probe.httpStatus} (${probe.statusText}) in ${probe.durationMs}ms`);
  };

  const handleDeactivate = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
    showToast("De-indexed broken URL listing from search engine.");
  };

  const handleScanAll = async () => {
    setIsScanningAll(true);
    const updated = [...records];
    for (let i = 0; i < Math.min(updated.length, 6); i++) {
      const p = await probeUrlHealth(updated[i].url);
      updated[i] = {
        ...updated[i],
        httpStatus: p.httpStatus,
        statusText: p.statusText,
        statusType: p.statusType,
        lastChecked: "Just now"
      };
    }
    setRecords(updated);
    setIsScanningAll(false);
    showToast("Automated link probe completed across active ATS destinations.");
  };

  const healthyCount = records.filter(r => r.statusType === "healthy").length;
  const brokenCount = records.filter(r => r.statusType === "broken").length;
  const redirectCount = records.filter(r => r.statusType === "redirect").length;
  const expiredCount = records.filter(r => r.statusType === "expired").length;

  const filtered = records.filter(item => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match = item.jobTitle.toLowerCase().includes(q) || item.company.toLowerCase().includes(q) || item.url.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (selectedStatusType && item.statusType !== selectedStatusType) return false;
    if (selectedAts && item.ats !== selectedAts) return false;
    return true;
  });

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const pagedItems = filtered.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
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
            <HeartPulse className="w-6 h-6 text-rose-500" />
            <span>Link Health &amp; Endpoint Monitor</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated crawler for detecting broken destination links, 404s, and unauthorized redirections.
          </p>
        </div>

        <Button
          size="sm"
          disabled={isScanningAll}
          onClick={handleScanAll}
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-2xs gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isScanningAll ? "animate-spin" : ""}`} />
          <span>{isScanningAll ? "Probing Endpoints..." : "Probe All URLs"}</span>
        </Button>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Healthy (HTTP 200)</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{healthyCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Direct ATS reachable</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Broken (404 / 500)</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600">{brokenCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Scheduled for purge</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Redirects (301)</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">{redirectCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Auto-updated target</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Expired (410)</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-700">{expiredCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Unlisted positions</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by job title, company, or target URL..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50/50 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-teal-500 focus:outline-none"
          />
        </div>

        <select
          value={selectedStatusType}
          onChange={(e) => { setSelectedStatusType(e.target.value); setCurrentPage(1); }}
          className="w-full md:w-44 py-1.5 px-2.5 rounded-lg border border-slate-200 bg-slate-50/50 text-xs text-slate-700 font-medium focus:bg-white focus:border-teal-500 focus:outline-none cursor-pointer"
        >
          <option value="">All Health Statuses</option>
          <option value="healthy">Healthy (200 OK)</option>
          <option value="broken">Broken (404 / Error)</option>
          <option value="redirect">Redirect (301)</option>
          <option value="expired">Expired (410)</option>
        </select>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/90 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Job Title &amp; Company</th>
                <th className="p-3.5">Destination URL</th>
                <th className="p-3.5">HTTP Code</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Last Checked</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pagedItems.map((item) => {
                const isProbing = probingId === item.id;
                return (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 max-w-[240px]">
                      <div className="font-bold text-slate-900 truncate">{item.jobTitle}</div>
                      <div className="text-[11px] text-slate-500">{item.company} • {item.ats}</div>
                    </td>
                    <td className="p-3.5 max-w-[260px]">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 hover:text-teal-600 font-mono text-[11px] truncate block"
                      >
                        {item.url}
                      </a>
                    </td>
                    <td className="p-3.5 font-mono text-[11px] font-bold">
                      {item.httpStatus}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.statusType === "healthy" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                        item.statusType === "redirect" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                        item.statusType === "expired" ? "bg-slate-100 text-slate-700 border border-slate-200" :
                        "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}>
                        {item.statusText.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                      {item.lastChecked}
                    </td>
                    <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isProbing}
                        onClick={() => handleRecheck(item.id, item.url)}
                        className="text-xs h-7 rounded-lg border-teal-200 text-teal-700 hover:bg-teal-50"
                      >
                        <RefreshCw className={`w-3 h-3 mr-1 ${isProbing ? "animate-spin" : ""}`} />
                        <span>{isProbing ? "Probing..." : "Recheck"}</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeactivate(item.id)}
                        className="text-xs h-7 rounded-lg text-rose-600 hover:bg-rose-50"
                      >
                        Deactivate
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <span className="font-bold text-slate-800">{startIndex + 1}</span> to{" "}
            <span className="font-bold text-slate-800">{Math.min(startIndex + pageSize, totalItems)}</span> of{" "}
            <span className="font-bold text-slate-800">{totalItems}</span> links
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
