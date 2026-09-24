"use client";

import { useState } from "react";
import Link from "next/link";
import { RefreshCw, Play, Pause, RotateCcw, CheckCircle, Clock, AlertCircle, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEFAULT_ATS_SOURCES } from "@/lib/adminData";

export default function AdminSyncCenterPage() {
  const [isFullSyncRunning, setIsFullSyncRunning] = useState(false);
  const [sources, setSources] = useState(DEFAULT_ATS_SOURCES);

  const handleRunFullSync = () => {
    setIsFullSyncRunning(true);
    setTimeout(() => {
      setIsFullSyncRunning(false);
      alert("Full multi-source synchronization completed successfully! 63,721 records reconciled.");
    }, 2000);
  };

  const handleRetrySource = (name: string) => {
    setSources(prev => prev.map(s => s.name === name ? { ...s, status: "Healthy" as const, lastSync: "just now" } : s));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <RefreshCw className="w-6 h-6 text-teal-600" />
            <span>Sync Control Center</span>
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
            <span>{isFullSyncRunning ? "Synchronizing Pipeline..." : "Run Full Sync"}</span>
          </Button>
        </div>
      </div>

      {/* Sync Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <div className="text-xs text-slate-500 font-semibold mb-1">Active Workers</div>
          <div className="text-2xl font-black text-teal-600">8 / 8 Online</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Distributed crawler pool</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <div className="text-xs text-slate-500 font-semibold mb-1">Last Full Cycle</div>
          <div className="text-2xl font-black text-slate-900">12 min ago</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">All nodes healthy</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <div className="text-xs text-slate-500 font-semibold mb-1">Next Scheduled</div>
          <div className="text-2xl font-black text-slate-900">in 18 min</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Cron: */30 * * * *</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <div className="text-xs text-slate-500 font-semibold mb-1">Failed Jobs In Queue</div>
          <div className="text-2xl font-black text-amber-600">0</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Dead-letter queue empty</div>
        </div>
      </div>

      {/* Source Sync Control Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">Engine Workers &amp; Source State</h3>
          <span className="text-xs text-slate-400">8 Ingestion Adapters</span>
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
              {sources.map((src) => (
                <tr key={src.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">
                    {src.name}
                  </td>
                  <td className="p-3.5 text-slate-500 font-mono text-[11px]">
                    Every 30 mins
                  </td>
                  <td className="p-3.5 text-slate-600 font-mono text-[11px]">
                    {src.lastSync}
                  </td>
                  <td className="p-3.5 text-slate-600 font-mono text-[11px]">
                    {src.avgSyncTime}
                  </td>
                  <td className="p-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      src.status === "Healthy" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                      src.status === "Delayed" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                      "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        src.status === "Healthy" ? "bg-emerald-500" :
                        src.status === "Delayed" ? "bg-amber-500" : "bg-rose-500"
                      }`} />
                      <span>{src.status}</span>
                    </span>
                  </td>
                  <td className="p-3.5 text-right space-x-1.5">
                    <button
                      onClick={() => handleRetrySource(src.name)}
                      className="px-2.5 py-1 rounded-lg border border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100 font-semibold text-[11px] transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Sync Now</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
