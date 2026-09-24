"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bell, ArrowRight, MoreVertical, Briefcase, Globe, Check } from "lucide-react";

export interface AlertItem {
  id: string;
  role: string;
  location: string;
  newJobsCount: number;
  lastUpdated: string;
  enabled: boolean;
  colorType: "rose" | "amber" | "purple";
}

export interface RecentAlertsSectionProps {
  alerts?: AlertItem[];
  onToggleAlert?: (alertId: string, enabled: boolean) => void;
  onViewAll?: () => void;
}

const DEFAULT_ALERTS: AlertItem[] = [
  {
    id: "alert_ds",
    role: "Data Scientist",
    location: "India • Remote",
    newJobsCount: 12,
    lastUpdated: "Last 1 hour ago",
    enabled: true,
    colorType: "rose"
  },
  {
    id: "alert_ml",
    role: "ML Engineer",
    location: "Worldwide • Remote",
    newJobsCount: 8,
    lastUpdated: "Last 3 hours ago",
    enabled: true,
    colorType: "amber"
  },
  {
    id: "alert_da",
    role: "Data Analyst",
    location: "Germany • On-site",
    newJobsCount: 5,
    lastUpdated: "Last 5 hours ago",
    enabled: true,
    colorType: "purple"
  }
];

export function RecentAlertsSection({
  alerts = DEFAULT_ALERTS,
  onToggleAlert,
  onViewAll
}: RecentAlertsSectionProps) {
  const [alertList, setAlertList] = useState<AlertItem[]>(alerts);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setAlertList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextState = !item.enabled;
          onToggleAlert?.(id, nextState);
          return { ...item, enabled: nextState };
        }
        return item;
      })
    );
  };

  const getIconContainerStyle = (colorType: AlertItem["colorType"]) => {
    switch (colorType) {
      case "rose":
        return "bg-rose-50 text-rose-500 border border-rose-100";
      case "amber":
        return "bg-amber-50 text-amber-500 border border-amber-100";
      case "purple":
        return "bg-purple-50 text-purple-600 border border-purple-100";
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs">
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

        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 group transition-colors cursor-pointer"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* 3 Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        {alertList.map((alert) => (
          <div
            key={alert.id}
            className="flex items-center justify-between p-4 rounded-xl border border-slate-200/90 bg-white hover:border-slate-300 transition-all shadow-2xs relative"
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Alert icon circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getIconContainerStyle(
                  alert.colorType
                )}`}
              >
                <Bell className="w-4 h-4 fill-current" />
              </div>

              {/* Alert title and stats */}
              <div className="min-w-0">
                <h3 className="font-bold text-sm text-slate-900 truncate">
                  {alert.role}
                </h3>
                <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                  {alert.location}
                </p>
                <div className="flex items-center gap-1.5 mt-1 text-[11px]">
                  <span className="font-bold text-slate-800">
                    {alert.newJobsCount} new jobs
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-400 font-medium">
                    {alert.lastUpdated}
                  </span>
                </div>
              </div>
            </div>

            {/* Switch & 3-dots */}
            <div className="flex items-center gap-2 shrink-0 ml-2">
              {/* Interactive Toggle Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={alert.enabled}
                onClick={() => handleToggle(alert.id)}
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
              <button
                type="button"
                onClick={() =>
                  setActiveMenuId(activeMenuId === alert.id ? null : alert.id)
                }
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
