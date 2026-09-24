"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  RefreshCw, 
  Play, 
  RotateCcw, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Radio,
  Check,
  Zap,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  getAdminAtsSources, 
  executeLiveAtsSync, 
  AtsSourceItem, 
  getSyncLogs, 
  SyncLogItem 
} from "@/lib/adminData";

export default function AdminSyncCenterPage() {
  const [isFullSyncRunning, setIsFullSyncRunning] = useState(false);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [sources, setSources] = useState<AtsSourceItem[]>([]);
  const [syncLogs, setSyncLogs] = useState<SyncLogItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setSources(getAdminAtsSources());
    setSyncLogs(getSyncLogs());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleRunFullSync = async () => {
    setIsFullSyncRunning(true);
    await executeLiveAtsSync("greenhouse");
    await executeLiveAtsSync("lever");
    await executeLiveAtsSync("ashby");
    setIsFullSyncRunning(false);
    setSources(getAdminAtsSources());
    setSyncLogs(getSyncLogs());
    showToast("Full multi-source synchronization completed successfully across active workers.");
  };

  const handleRetrySource = async (id: string, name: string) => {
    setRetryingId(id);
    const res = await executeLiveAtsSync(id);
    setRetryingId(null);
    setSources(getAdminAtsSources());
    setSyncLogs(getSyncLogs());
    showToast(res.message);
  };

  const onlineWorkersCount = sources.filter(s => s.status === "Healthy" || s.status === "Delayed").length;
  const failedQueuesCount = sources.filter(s => s.status === "Failed").length;

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
            <RefreshCw className="w-6 h-6 text-teal-600" />
            <span>Sync Control Center &amp; Pipelines</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Orchestrate crawler workers, manage automated ingestion cycles, and retry failed ATS webhooks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleRunFullSync}
            disabled={isFullSyncRunning}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-2xs gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFullSyncRunning ? "animate-spin" : ""}`} />
            <span>{isFullSyncRunning ? "Synchronizing Pipelines..." : "Run Full Sync"}</span>
          </Button>
        </div>
      </div>

      {/* Sync Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Active Workers</span>
            <Zap className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-teal-600">{onlineWorkersCount} / {sources.length || 8} Online</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Distributed crawler pool</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Last Sync Execution</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-900">{sources[0]?.lastSync || "Just now"}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Active schedule running</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Next Automated Cron</span>
            <Activity className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-900">in 25 min</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Cron: */30 * * * *</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Failed Queues</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600">{failedQueuesCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {failedQueuesCount === 0 ? "Dead-letter queue clean" : "Click retry to recover"}
          </div>
        </div>
      </div>

      {/* Source Sync Control Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">Engine Workers &amp; Source State</h3>
          <span className="text-xs text-slate-400">{sources.length} Ingestion Adapters</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/90 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Source Adapter</th>
                <th className="p-3.5">Polling Cadence</th>
                <th className="p-3.5">Last Ingested</th>
                <th className="p-3.5">Average Duration</th>
                <th className="p-3.5">Worker Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sources.map((src) => {
                const isRetrying = retryingId === src.id;
                return (
                  <tr key={src.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${src.status === "Healthy" ? "bg-emerald-500" : src.status === "Delayed" ? "bg-amber-500" : "bg-rose-500"}`} />
                      <span>{src.name}</span>
                    </td>
                    <td className="p-3.5 text-slate-600 font-mono text-[11px]">
                      Every 60 mins
                    </td>
                    <td className="p-3.5 text-slate-500 font-mono text-[11px]">
                      {src.lastSync}
                    </td>
                    <td className="p-3.5 font-mono text-slate-600">
                      {src.avgSyncTime}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        src.status === "Healthy" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                        src.status === "Delayed" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                        "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}>
                        {src.status === "Healthy" ? "ONLINE & IDLE" : src.status === "Delayed" ? "POLLING BACKOFF" : "ALERT / FAILED"}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isRetrying}
                        onClick={() => handleRetrySource(src.id, src.name)}
                        className="text-xs h-7 rounded-lg border-teal-200 text-teal-700 hover:bg-teal-50"
                      >
                        <RotateCcw className={`w-3 h-3 mr-1 ${isRetrying ? "animate-spin" : ""}`} />
                        <span>{isRetrying ? "Syncing..." : "Sync Now"}</span>
                      </Button>
                      <Link href={`/mastermindak/sources/${src.slug}`}>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs h-7 rounded-lg text-slate-500 hover:text-slate-800"
                        >
                          Config
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sync Execution History Feed */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-600" />
            <span>Worker Sync Activity Feed</span>
          </h3>
          <span className="text-xs text-slate-400">Live stream</span>
        </div>

        <div className="space-y-2.5 text-xs">
          {syncLogs.slice(0, 6).map((log) => (
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
