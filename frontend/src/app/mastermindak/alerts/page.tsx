"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, ArrowLeft, CheckCircle, AlertTriangle, AlertCircle, Info, Trash2 } from "lucide-react";
import { getSystemAlerts, AdminAlert } from "@/lib/adminData";

export default function AdminAlertsPage() {
  const [alerts, setAlerts] = useState<AdminAlert[]>(getSystemAlerts());

  const handleMarkRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: "read" } : a));
  };

  const handleResolve = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: "resolved" } : a));
  };

  const handleClear = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Link href="/mastermindak" className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Bell className="w-6 h-6 text-rose-500" />
          <span>Operations &amp; Security Alerts</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time alerts triggered by crawler anomalies, rate limits, broken link thresholds, and database events.
        </p>
      </div>

      <div className="space-y-3">
        {alerts.map((alt) => (
          <div
            key={alt.id}
            className={`bg-white border rounded-xl p-4 shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              alt.status === "unread" ? "border-teal-400/80 bg-teal-50/20" : "border-slate-200/90"
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                alt.category === "CRITICAL" ? "bg-rose-50 text-rose-600 border border-rose-200" :
                alt.category === "WARNING" ? "bg-amber-50 text-amber-600 border border-amber-200" :
                "bg-blue-50 text-blue-600 border border-blue-200"
              }`}>
                {alt.category === "CRITICAL" ? <AlertCircle className="w-4 h-4" /> :
                 alt.category === "WARNING" ? <AlertTriangle className="w-4 h-4" /> :
                 <Info className="w-4 h-4" />}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    alt.category === "CRITICAL" ? "bg-rose-100 text-rose-700" :
                    alt.category === "WARNING" ? "bg-amber-100 text-amber-700" :
                    "bg-teal-100 text-teal-700"
                  }`}>
                    {alt.category}
                  </span>
                  <span className="font-bold text-sm text-slate-900">{alt.title}</span>
                  <span className="text-[11px] text-slate-400 font-mono">({alt.timestamp})</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{alt.message}</p>
                <div className="text-[11px] text-slate-400 mt-1">Source: <span className="font-mono text-slate-600">{alt.source}</span></div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              {alt.status === "unread" && (
                <button
                  onClick={() => handleMarkRead(alt.id)}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Mark Read
                </button>
              )}
              {alt.status !== "resolved" ? (
                <button
                  onClick={() => handleResolve(alt.id)}
                  className="px-2.5 py-1 text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 rounded-lg transition-colors cursor-pointer"
                >
                  Resolve
                </button>
              ) : (
                <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                  Resolved
                </span>
              )}
              <button
                onClick={() => handleClear(alt.id)}
                className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                title="Dismiss"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
