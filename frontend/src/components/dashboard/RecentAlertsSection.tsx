"use client";

import React, { useState } from "react";
import { Bell, ArrowRight, MoreVertical, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { JobAlertRecord } from "@/lib/auth";

export interface RecentAlertsSectionProps {
  alerts: JobAlertRecord[];
  onToggleAlert?: (alertId: string, enabled: boolean) => void;
  onDeleteAlert?: (alertId: string) => void;
  onCreateAlert?: () => void;
  onViewAll?: () => void;
}

export function RecentAlertsSection({
  alerts = [],
  onToggleAlert,
  onDeleteAlert,
  onCreateAlert,
  onViewAll
}: RecentAlertsSectionProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const getIconContainerStyle = (colorType?: string) => {
    switch (colorType) {
      case "amber":
        return "bg-amber-50 text-amber-500 border border-amber-100";
      case "purple":
        return "bg-purple-50 text-purple-600 border border-purple-100";
      default:
        return "bg-rose-50 text-rose-500 border border-rose-100";
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 lg:p-7 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <Bell className="w-4 h-4" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Recent Job Alerts
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {onCreateAlert && (
            <button
              type="button"
              onClick={onCreateAlert}
              className="text-xs font-semibold text-slate-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Alert</span>
            </button>
          )}

          {alerts.length > 0 && (
            <button
              type="button"
              onClick={onViewAll}
              className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 group transition-colors cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>
      </div>

      {/* Content: Real Alerts or Polished Empty State */}
      {alerts.length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl mt-5">
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-2">
            <Bell className="w-5 h-5" />
          </div>
          <p className="text-sm font-bold text-slate-700">No Job Alerts Configured</p>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Set up personalized alerts for your target roles to receive instant updates as soon as official career requisitions go live.
          </p>
          {onCreateAlert && (
            <button
              type="button"
              onClick={onCreateAlert}
              className="mt-3.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Your First Alert</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          {alerts.slice(0, 3).map((alert) => (
            <div
              key={alert.id}
              className="flex items-center justify-between p-4 rounded-xl border border-slate-200/90 bg-white hover:border-slate-300 transition-all shadow-2xs relative"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Alert icon circle */}
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 ${getIconContainerStyle(
                    alert.colorType
                  )}`}
                >
                  <Bell className="w-4 h-4 fill-current" />
                </div>

                {/* Alert title and stats without clipping */}
                <div className="min-w-0 flex-1 pr-2">
                  <h3 
                    className="font-bold text-sm text-slate-900 truncate"
                    title={alert.role}
                  >
                    {alert.role}
                  </h3>
                  <p 
                    className="text-xs text-slate-500 font-medium truncate mt-0.5"
                    title={`${alert.location} • ${alert.workMode}`}
                  >
                    {alert.location} • {alert.workMode}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 text-[11px]">
                    <span className="font-bold text-slate-800">
                      Active
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-400 font-medium truncate">
                      {alert.lastUpdated || "Live stream"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Switch & 3-dots */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Interactive Toggle Switch */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={alert.enabled}
                  onClick={() => onToggleAlert?.(alert.id, !alert.enabled)}
                  title={alert.enabled ? "Disable alert" : "Enable alert"}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    alert.enabled ? "bg-teal-600" : "bg-slate-200"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      alert.enabled ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>

                {/* 3-dots menu button */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveMenuId(activeMenuId === alert.id ? null : alert.id)
                    }
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {activeMenuId === alert.id && (
                    <div className="absolute right-0 top-7 z-20 w-32 bg-white rounded-lg border border-slate-200 shadow-lg p-1">
                      <button
                        type="button"
                        onClick={() => {
                          onDeleteAlert?.(alert.id);
                          setActiveMenuId(null);
                        }}
                        className="w-full text-left px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Alert</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
