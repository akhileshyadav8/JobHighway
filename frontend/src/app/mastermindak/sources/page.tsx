"use client";

import { useState, useEffect } from "react";
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
  Activity,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  getAdminAtsSources, 
  executeLiveAtsSync, 
  AtsSourceItem,
  getSyncLogs,
  SyncLogItem
} from "@/lib/adminData";

export default function AdminSourcesPage() {
  const [sources, setSources] = useState<AtsSourceItem[]>([]);
  const [syncLogs, setSyncLogs] = useState<SyncLogItem[]>([]);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setSources(getAdminAtsSources());
    setSyncLogs(getSyncLogs());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const totalSources = sources.length;
  const healthyCount = sources.filter(s => s.status === "Healthy").length;
  const delayedCount = sources.filter(s => s.status === "Delayed").length;
  const failedCount = sources.filter(s => s.status === "Failed" || s.status === "Warning").length;

  const handleRunSync = async (id: string, name: string) => {
    setSyncingId(id);
    const result = await executeLiveAtsSync(id);
    setSyncingId(null);
    setSources(getAdminAtsSources());
    setSyncLogs(getSyncLogs());
    showToast(result.message);
  };

  const handleRunAllSyncs = async () => {
    setSyncingId("all");
    const result = await executeLiveAtsSync("greenhouse");
    await executeLiveAtsSync("lever");
    await executeLiveAtsSync("ashby");
    setSyncingId(null);
    setSources(getAdminAtsSources());
    setSyncLogs(getSyncLogs());
    showToast("Successfully orchestrated multi-source ingestion across active pipelines.");
  };

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
            <Radio className="w-6 h-6 text-teal-600" />
            <span>ATS Sources &amp; Ingestion Engines</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor real-time health, latency, and execute live scraping pipelines across supported ATS endpoints.
          </p>
        </div>

        <Button
          onClick={handleRunAllSyncs}
          disabled={syncingId !== null}
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
          <div className="text-[11px] text-slate-400 mt-0.5">Ingestion protocols</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Healthy</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{healthyCount}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">99%+ uptime</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Delayed</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">{delayedCount}</div>
          <div className="text-[11px] text-amber-600 font-semibold mt-0.5">Rate-limit backoff</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Failed / Alert</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600">{failedCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Needs re-synchronization</div>
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
                <th className="p-3.5">Jobs Ingested</th>
                <th className="p-3.5">Last Sync</th>
                <th className="p-3.5">Avg Response</th>
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
                        href={`/mastermindak/sources/${src.slug}`}
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
                    <td className="p-3.5 text-slate-500 font-mono text-[11px]">
                      {src.avgSyncTime}
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
                        onClick={() => handleRunSync(src.id, src.name)}
                        disabled={isSyncing}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100 font-semibold text-[11px] transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Play className={`w-3 h-3 ${isSyncing ? "animate-spin" : ""}`} />
                        <span>{isSyncing ? "Syncing..." : "Run"}</span>
                      </button>
                      <Link
                        href={`/mastermindak/sources/${src.slug}`}
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
          <Link href="/mastermindak/activity" className="text-xs font-semibold text-teal-600 hover:underline">
            View All Logs
          </Link>
        </div>

        <div className="space-y-2.5 text-xs">
          {syncLogs.slice(0, 4).map((log) => (
            <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full shrink-0 ${log.status === "completed" ? "bg-emerald-500" : "bg-rose-500"}`} />
                <div>
                  <span className="font-bold text-slate-800">{log.source}</span>
                  <span className="text-slate-500 ml-2">{log.message}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-slate-400 text-[11px] font-mono">
                <span>{log.duration}</span>
                <span>{log.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
