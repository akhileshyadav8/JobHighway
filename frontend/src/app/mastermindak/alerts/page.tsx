"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, ArrowLeft, AlertCircle, AlertTriangle, Info, CheckCircle2, Trash2, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSystemAlerts, updateAlertStatus, clearAlert, createAdminAlert, AdminAlert } from "@/lib/adminData";

export default function AdminAlertsPage() {
  const [alerts, setAlerts] = useState<AdminAlert[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setAlerts(getSystemAlerts());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleResolve = (id: string, title: string) => {
    updateAlertStatus(id, "resolved");
    setAlerts(getSystemAlerts());
    showToast(`Marked alert "${title}" as resolved.`);
  };

  const handleClear = (id: string) => {
    clearAlert(id);
    setAlerts(getSystemAlerts());
    showToast("Alert removed.");
  };

  const handleCreateTestAlert = () => {
    createAdminAlert({
      category: "WARNING",
      title: "Manual Test Alert",
      message: "Admin triggered manual diagnostic notification to verify telemetry and webhook pipeline.",
      source: "Admin Console"
    });
    setAlerts(getSystemAlerts());
    showToast("Generated test diagnostic alert.");
  };

  const unreadCount = alerts.filter(a => a.status === "unread").length;

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/mastermindak" className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1 font-medium">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </Link>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-rose-500" />
            <span>Operations &amp; Security Alerts ({unreadCount} Unread)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time alerts triggered by crawler anomalies, rate limits, broken link thresholds, and database events.
          </p>
        </div>

        <Button
          size="sm"
          onClick={handleCreateTestAlert}
          variant="outline"
          className="text-xs rounded-xl border-slate-300 gap-1.5 self-start sm:self-auto font-semibold"
        >
          <Plus className="w-3.5 h-3.5 text-teal-600" />
          <span>Trigger Test Alert</span>
        </Button>
      </div>

      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="bg-white border border-slate-200/90 rounded-xl p-12 text-center text-slate-400 shadow-2xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <div className="font-bold text-slate-800 text-sm">All Alert Queues Clear</div>
            <div className="text-xs text-slate-400 mt-0.5">No critical issues or crawler warnings detected.</div>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs ${
                alert.status === "resolved"
                  ? "bg-slate-50/60 border-slate-200/60 opacity-60"
                  : alert.category === "CRITICAL"
                  ? "bg-rose-50/40 border-rose-200/80"
                  : alert.category === "WARNING"
                  ? "bg-amber-50/40 border-amber-200/80"
                  : "bg-blue-50/40 border-blue-200/80"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  {alert.category === "CRITICAL" ? (
                    <AlertCircle className="w-5 h-5 text-rose-500" />
                  ) : alert.category === "WARNING" ? (
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                  ) : (
                    <Info className="w-5 h-5 text-blue-500" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">{alert.title}</span>
                    <span className={`px-2 py-0.2 rounded text-[9px] font-extrabold uppercase ${
                      alert.category === "CRITICAL" ? "bg-rose-100 text-rose-700" :
                      alert.category === "WARNING" ? "bg-amber-100 text-amber-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {alert.category}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">{alert.message}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-1">
                    Source: {alert.source} • {alert.timestamp}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                {alert.status !== "resolved" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleResolve(alert.id, alert.title)}
                    className="text-xs h-7 rounded-lg border-slate-300 text-slate-700 hover:bg-white"
                  >
                    Resolve
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleClear(alert.id)}
                  className="text-xs h-7 rounded-lg text-slate-400 hover:text-rose-600"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
