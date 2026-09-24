"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Activity, 
  Search, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  RefreshCw,
  Briefcase,
  Users,
  ShieldCheck,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAnalyticsSummary, clearAnalyticsEvents, AnalyticsSummary } from "@/lib/telemetry";
import { getAdminActivityLogs, AdminActivityEvent } from "@/lib/adminData";

export default function AdminActivityLogsPage() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [adminLogs, setAdminLogs] = useState<AdminActivityEvent[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const refreshLogs = () => {
    setSummary(getAnalyticsSummary());
    setAdminLogs(getAdminActivityLogs());
  };

  useEffect(() => {
    refreshLogs();
  }, []);

  const handleClear = () => {
    if (!confirm("Are you sure you want to clear telemetry logs?")) return;
    clearAnalyticsEvents();
    localStorage.removeItem("jobpulse_admin_activity");
    refreshLogs();
    setCurrentPage(1);
  };

  const filteredLogs = adminLogs.filter(log => {
    if (categoryFilter && log.category !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!log.title.toLowerCase().includes(q) && !log.details.toLowerCase().includes(q) && !log.user.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const totalItems = filteredLogs.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const pagedLogs = filteredLogs.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-teal-600" />
            <span>Audit Trail &amp; Activity Log</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time immutable audit trail of operational actions, sync runs, and user modifications.
          </p>
        </div>

        <Button
          onClick={handleClear}
          variant="outline"
          size="sm"
          className="text-xs rounded-xl shadow-2xs gap-1.5 cursor-pointer self-start sm:self-auto font-semibold text-rose-600 border-rose-200 hover:bg-rose-50"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Logs</span>
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search by action title, user, or details..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 outline-none focus:bg-white focus:border-teal-500"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
          className="w-full sm:w-44 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 outline-none focus:bg-white focus:border-teal-500 cursor-pointer"
        >
          <option value="">All Categories</option>
          <option value="sync">ATS Sync</option>
          <option value="job">Job Changes</option>
          <option value="user">User Actions</option>
          <option value="security">Security &amp; Auth</option>
          <option value="system">System Events</option>
        </select>
      </div>

      {/* Activity Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/90 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Event / Action</th>
                <th className="p-3.5">Details</th>
                <th className="p-3.5">Initiator</th>
                <th className="p-3.5 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pagedLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    No activity records found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                pagedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        log.category === "sync" ? "bg-teal-50 text-teal-700 border border-teal-200" :
                        log.category === "job" ? "bg-cyan-50 text-cyan-700 border border-cyan-200" :
                        log.category === "user" ? "bg-purple-50 text-purple-700 border border-purple-200" :
                        log.category === "security" ? "bg-rose-50 text-rose-700 border border-rose-200" :
                        "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}>
                        {log.category === "sync" ? <RefreshCw className="w-2.5 h-2.5" /> :
                         log.category === "job" ? <Briefcase className="w-2.5 h-2.5" /> :
                         log.category === "user" ? <Users className="w-2.5 h-2.5" /> :
                         <ShieldCheck className="w-2.5 h-2.5" />}
                        <span>{log.category}</span>
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-slate-900">
                      {log.title}
                    </td>
                    <td className="p-3.5 text-slate-600 max-w-sm truncate">
                      {log.details}
                    </td>
                    <td className="p-3.5 text-slate-500 font-mono text-[11px]">
                      {log.user}
                    </td>
                    <td className="p-3.5 text-right text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      {log.timestamp}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <span className="font-bold text-slate-800">{totalItems > 0 ? startIndex + 1 : 0}</span> to{" "}
            <span className="font-bold text-slate-800">{Math.min(startIndex + pageSize, totalItems)}</span> of{" "}
            <span className="font-bold text-slate-800">{totalItems}</span> events
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
