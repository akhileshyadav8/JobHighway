"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Radio, 
  RefreshCw, 
  ExternalLink, 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle, 
  Play, 
  Clock,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEFAULT_ATS_SOURCES, AtsSourceItem } from "@/lib/adminData";

export default function AdminSourcesPage() {
  const [sources, setSources] = useState<AtsSourceItem[]>(DEFAULT_ATS_SOURCES);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const totalSources = sources.length;
  const healthyCount = sources.filter(s => s.status === "Healthy").length;
  const delayedCount = sources.filter(s => s.status === "Delayed").length;
  const failedCount = sources.filter(s => s.status === "Failed" || s.status === "Warning").length;

  const handleRunSync = (id: string) => {
    setSyncingId(id);
    setTimeout(() => {
      setSyncingId(null);
      setSources(prev => prev.map(s => s.id === id ? { ...s, lastSync: "just now", status: "Healthy" } : s));
    }, 1500);
  };

  const handleRunAllSyncs = () => {
    setSyncingId("all");
    setTimeout(() => {
      setSyncingId(null);
      setSources(prev => prev.map(s => ({ ...s, lastSync: "just now", status: "Healthy" })));
    }, 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Radio className="w-6 h-6 text-teal-600" />
            <span>ATS Sources</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor the health and performance of all integrated ATS sources and direct ingestion engines.
          </p>
        </div>

        <Button
          onClick={handleRunAllSyncs}
          disabled={syncingId === "all"}
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-2xs gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncingId === "all" ? "animate-spin" : ""}`} />
          <span>{syncingId === "all" ? "Syncing All Sources..." : "Run All Syncs"}</span>
        </Button>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Total Sources</span>
            <Radio className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalSources}</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Healthy</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{healthyCount}</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Delayed</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">{delayedCount}</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Failed / Alert</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600">{failedCount}</div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/90 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Source</th>
                <th className="p-3.5">Companies</th>
                <th className="p-3.5">Jobs</th>
                <th className="p-3.5">Last Sync</th>
                <th className="p-3.5">Next Sync</th>
                <th className="p-3.5">Success Rate</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sources.map((src) => {
                const isSyncing = syncingId === src.id;
                return (
                  <tr key={src.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5">
                      <Link 
                        href={`/admin/sources/${src.slug}`}
                        className="font-bold text-slate-900 hover:text-teal-600 transition-colors"
                      >
                        {src.name}
                      </Link>
                    </td>
                    <td className="p-3.5 font-medium text-slate-700">
                      {src.companiesCount.toLocaleString()}
                    </td>
                    <td className="p-3.5 font-mono text-slate-600">
                      {src.jobsCount.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-slate-500 font-mono text-[11px]">
                      {src.lastSync}
                    </td>
                    <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                      {src.nextSync}
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-slate-800">
                        {src.successRate}%
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        src.status === "Healthy" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                        src.status === "Delayed" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                        src.status === "Warning" ? "bg-orange-50 text-orange-700 border border-orange-200" :
                        "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          src.status === "Healthy" ? "bg-emerald-500" :
                          src.status === "Delayed" ? "bg-amber-500" :
                          src.status === "Warning" ? "bg-orange-500" :
                          "bg-rose-500"
                        }`} />
                        <span>{src.status}</span>
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-1.5">
                      <button
                        onClick={() => handleRunSync(src.id)}
                        disabled={isSyncing}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100 font-semibold text-[11px] transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Play className={`w-3 h-3 ${isSyncing ? "animate-spin" : ""}`} />
                        <span>{isSyncing ? "Syncing..." : "Run"}</span>
                      </button>
                      <Link
                        href={`/admin/sources/${src.slug}`}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-[11px] transition-colors"
                      >
                        <span>Details</span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sync Activity (Live) Container */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-600" />
            <span>Sync Activity (Live Execution Feed)</span>
          </h3>
          <Link href="/admin/activity" className="text-xs font-semibold text-teal-600 hover:underline">
            View All Logs
          </Link>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <div>
                <span className="font-bold text-slate-900">Greenhouse sync completed</span>
                <span className="text-slate-500 ml-2">1,842 jobs processed</span>
              </div>
            </div>
            <span className="text-slate-400 font-mono text-[11px]">4 min ago</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <div>
                <span className="font-bold text-slate-900">Lever sync completed</span>
                <span className="text-slate-500 ml-2">982 jobs processed</span>
              </div>
            </div>
            <span className="text-slate-400 font-mono text-[11px]">8 min ago</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
              <div>
                <span className="font-bold text-slate-900">Workday sync running</span>
                <span className="text-slate-500 ml-2">Crawling candidate endpoints...</span>
              </div>
            </div>
            <span className="text-slate-400 font-mono text-[11px]">21 min ago</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
              <div>
                <span className="font-bold text-slate-900">Ashby sync timeout warning</span>
                <span className="text-slate-500 ml-2">Connection timeout on node ashby-in-01</span>
              </div>
            </div>
            <span className="text-slate-400 font-mono text-[11px]">43 min ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
