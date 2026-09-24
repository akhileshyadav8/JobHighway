"use client";

import React, { useState } from "react";
import { 
  X, 
  Bell, 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  MapPin, 
  Briefcase, 
  CheckCircle2, 
  Clock 
} from "lucide-react";
import { JobAlertRecord } from "@/lib/auth";

export interface AllAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: JobAlertRecord[];
  onToggleAlert: (alertId: string, enabled: boolean) => void;
  onEditAlert: (alert: JobAlertRecord) => void;
  onDeleteAlert: (alertId: string) => void;
  onCreateNewAlert: () => void;
}

export function AllAlertsModal({
  isOpen,
  onClose,
  alerts = [],
  onToggleAlert,
  onEditAlert,
  onDeleteAlert,
  onCreateNewAlert
}: AllAlertsModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const filteredAlerts = alerts.filter((alert) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      alert.role.toLowerCase().includes(q) ||
      alert.location.toLowerCase().includes(q) ||
      alert.workMode.toLowerCase().includes(q)
    );
  });

  const getIconContainerStyle = (colorType?: string) => {
    switch (colorType) {
      case "amber":
        return "bg-amber-50 text-amber-600 border border-amber-200/80";
      case "purple":
        return "bg-purple-50 text-purple-600 border border-purple-200/80";
      default:
        return "bg-rose-50 text-rose-500 border border-rose-200/80";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in-50 duration-200">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Bell className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Your Job Alerts ({alerts.length})
              </h2>
              <p className="text-xs text-slate-500">
                Manage your active career alerts and instant notification preferences
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onCreateNewAlert();
              }}
              className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Alert</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {alerts.length > 0 && (
          <div className="px-5 pt-4 pb-2 border-b border-slate-100">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search alerts by title, city, or work mode..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>
        )}

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-2xl">
              <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-2">
                <Bell className="w-5 h-5" />
              </div>
              <p className="text-sm font-bold text-slate-800">
                {alerts.length === 0 ? "No Job Alerts Created" : "No Matching Alerts"}
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {alerts.length === 0
                  ? "Create personalized role alerts to receive instant notifications when new jobs go live."
                  : "Try clearing your search query to see all your active alerts."}
              </p>
              {alerts.length === 0 && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onCreateNewAlert();
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Your First Alert</span>
                </button>
              )}
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-slate-200/90 bg-white hover:border-slate-300 transition-all shadow-2xs gap-3"
              >
                {/* Left Info */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${getIconContainerStyle(
                      alert.colorType
                    )}`}
                  >
                    <Bell className="w-4 h-4 fill-current" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-900 truncate">
                        {alert.role}
                      </h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          alert.enabled
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                      >
                        {alert.enabled ? "Active" : "Paused"}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{alert.location}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3 h-3 text-slate-400" />
                        <span>{alert.workMode}</span>
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>{alert.lastUpdated || "Live sync"}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Controls */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Toggle switch */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={alert.enabled}
                    onClick={() => onToggleAlert(alert.id, !alert.enabled)}
                    title={alert.enabled ? "Pause alert" : "Activate alert"}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      alert.enabled ? "bg-teal-600" : "bg-slate-200"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        alert.enabled ? "translate-x-4" : "translate-x-0.5"
                      } mt-0.5`}
                    />
                  </button>

                  {/* Edit button */}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onEditAlert(alert);
                    }}
                    title="Edit alert"
                    className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => onDeleteAlert(alert.id)}
                    title="Delete alert"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>Alerts sync every hour with official company ATS feeds</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-200 hover:bg-white text-slate-700 font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
