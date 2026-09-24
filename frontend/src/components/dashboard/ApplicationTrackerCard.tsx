"use client";

import React from "react";
import { 
  ClipboardList, 
  ArrowRight, 
  Bookmark, 
  Send, 
  Users, 
  Award, 
  XCircle 
} from "lucide-react";

export interface ApplicationTrackerMetrics {
  saved: number;
  applied: number;
  interview: number;
  offer: number;
  rejected: number;
}

export interface ApplicationTrackerCardProps {
  metrics?: ApplicationTrackerMetrics;
  onViewAll?: () => void;
  onFilterStatus?: (status: string) => void;
}

const DEFAULT_METRICS: ApplicationTrackerMetrics = {
  saved: 12,
  applied: 8,
  interview: 3,
  offer: 1,
  rejected: 4
};

export function ApplicationTrackerCard({
  metrics = DEFAULT_METRICS,
  onViewAll,
  onFilterStatus
}: ApplicationTrackerCardProps) {
  const statusItems = [
    {
      id: "saved",
      label: "Saved",
      count: metrics.saved,
      icon: Bookmark,
      iconStyle: "bg-emerald-50 text-emerald-600 border-emerald-100",
      cardStyle: "hover:border-emerald-300"
    },
    {
      id: "applied",
      label: "Applied",
      count: metrics.applied,
      icon: Send,
      iconStyle: "bg-sky-50 text-sky-600 border-sky-100",
      cardStyle: "hover:border-sky-300"
    },
    {
      id: "interview",
      label: "Interview",
      count: metrics.interview,
      icon: Users,
      iconStyle: "bg-purple-50 text-purple-600 border-purple-100",
      cardStyle: "hover:border-purple-300"
    },
    {
      id: "offer",
      label: "Offer",
      count: metrics.offer,
      icon: Award,
      iconStyle: "bg-emerald-50 text-emerald-600 border-emerald-100",
      cardStyle: "hover:border-emerald-300"
    },
    {
      id: "rejected",
      label: "Rejected",
      count: metrics.rejected,
      icon: XCircle,
      iconStyle: "bg-rose-50 text-rose-500 border-rose-100",
      cardStyle: "hover:border-rose-300"
    }
  ];

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <ClipboardList className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Application Tracker
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

      {/* 5-Item Status Grid */}
      <div className="grid grid-cols-5 gap-2 sm:gap-2.5 mt-4">
        {statusItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (onFilterStatus) onFilterStatus(item.id);
                else if (onViewAll) onViewAll();
              }}
              className={`flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white transition-all shadow-2xs cursor-pointer text-center group ${item.cardStyle}`}
            >
              <div
                className={`w-7 h-7 rounded-lg border flex items-center justify-center mb-1.5 transition-transform group-hover:scale-105 ${item.iconStyle}`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-medium text-slate-500 truncate w-full">
                {item.label}
              </span>
              <span className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                {item.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
