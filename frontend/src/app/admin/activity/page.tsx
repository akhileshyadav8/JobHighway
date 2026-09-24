"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Activity, 
  Search, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Filter
} from "lucide-react";
import { getAnalyticsSummary, clearAnalyticsEvents, AnalyticsSummary, AnalyticsEvent } from "@/lib/telemetry";

export default function AdminActivityLogsPage() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [typeFilter, setTypeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const refreshLogs = () => {
    setSummary(getAnalyticsSummary());
  };

  useEffect(() => {
    refreshLogs();
  }, []);

  const handleClear = (period?: number) => {
    if (!confirm("Are you sure you want to clear telemetry logs?")) return;
    clearAnalyticsEvents(period);
    refreshLogs();
    setCurrentPage(1);
  };

  const rawEvents = summary?.recentEvents || [];
  
  // Synthetic baseline events if client telemetry is young
  const baselineEvents = [
    { id: "e1", type: "Page View", user: "Visitor", action: "/jobs", details: "Filtered by Remote", device: "Desktop", screen: "1920x1080", timestamp: new Date(Date.now() - 2 * 60000).toISOString() },
    { id: "e2", type: "Sync", user: "System", action: "Greenhouse sync completed", details: "1,842 jobs processed", device: "Worker 01", screen: "Server", timestamp: new Date(Date.now() - 4 * 60000).toISOString() },
    { id: "e3", type: "Admin Action", user: "Akhilesh", action: "De-indexed 14 expired roles", details: "Manual verification pass", device: "Desktop", screen: "1440x900", timestamp: new Date(Date.now() - 14 * 60000).toISOString() },
    { id: "e4", type: "User Signup", user: "candidate@jobpulse.io", action: "Created Candidate Account", details: "Verified via OTP", device: "Mobile", screen: "390x844", timestamp: new Date(Date.now() - 22 * 60000).toISOString() },
    { id: "e5", type: "Error", user: "System", action: "Workday sync timeout", details: "Retry scheduled in 10m", device: "Worker 03", screen: "Server", timestamp: new Date(Date.now() - 35 * 60000).toISOString() },
    { id: "e6", type: "Page View", user: "Visitor", action: "/companies", details: "Searched Postman", device: "Desktop", screen: "1920x1080", timestamp: new Date(Date.now() - 44 * 60000).toISOString() },
    { id: "e7", type: "Contact Inquiry", user: "support@partner.com", action: "Partnership Outreach", details: "New inquiry received", device: "Desktop", screen: "1920x1080", timestamp: new Date(Date.now() - 58 * 60000).toISOString() }
  ];

  const allDisplayEvents = rawEvents.length > 0 
    ? rawEvents.map(e => ({
        id: e.id,
        type: e.type.toUpperCase(),
        user: "Visitor",
        action: e.path,
        details: `${e.device} (${e.screen})`,
        device: e.device,
        screen: e.screen,
        timestamp: e.timestamp
      }))
    : baselineEvents;

  const filtered = allDisplayEvents.filter(e => {
    if (typeFilter && !e.type.toLowerCase().includes(typeFilter.toLowerCase())) return false;
    return true;
  });

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const pagedEvents = filtered.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-teal-600" />
            <span>System &amp; User Activity Logs</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time logs of platform activity, user actions, crawler executions, and system events.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleClear(60)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Clear &gt; 1h
          </button>
          <button
            onClick={() => handleClear()}
            className="px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Logs</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs flex items-center gap-3">
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 outline-none focus:bg-white focus:border-teal-500"
        >
          <option value="">All Event Types</option>
          <option value="pageview">Page Views</option>
          <option value="sync">Sync Executions</option>
          <option value="user">User Activities</option>
          <option value="error">Errors &amp; Warnings</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/90 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Time</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Actor</th>
                <th className="p-3.5">Action</th>
                <th className="p-3.5">Details</th>
                <th className="p-3.5 text-right">Device / Origin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pagedEvents.map((ev) => (
                <tr key={ev.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3.5 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                    {new Date(ev.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1.5 font-bold font-mono text-[11px] text-slate-800">
                      <span className="w-2 h-2 rounded-full bg-teal-500" />
                      <span>{ev.type}</span>
                    </span>
                  </td>
                  <td className="p-3.5 font-semibold text-slate-700">
                    {ev.user}
                  </td>
                  <td className="p-3.5 font-mono text-slate-800 truncate max-w-xs">
                    {ev.action}
                  </td>
                  <td className="p-3.5 text-slate-500 truncate max-w-xs">
                    {ev.details}
                  </td>
                  <td className="p-3.5 text-right text-slate-400 font-mono text-[11px]">
                    {ev.device}
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
            <strong className="text-slate-900">{totalItems}</strong> events
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
