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
  metrics: ApplicationTrackerMetrics;
  onViewAll?: () => void;
  onFilterStatus?: (status: string) => void;
}

export function ApplicationTrackerCard({
  metrics,
  onViewAll,
  onFilterStatus
}: ApplicationTrackerCardProps) {
  const statusItems = [
    {
      id: "saved",
      label: "Saved",
      count: metrics?.saved ?? 0,
      icon: Bookmark,
      iconStyle: "bg-emerald-50 text-emerald-600 border-emerald-100",
      cardStyle: "hover:border-emerald-300"
    },
    {
      id: "applied",
      label: "Applied",
      count: metrics?.applied ?? 0,
      icon: Send,
      iconStyle: "bg-sky-50 text-sky-600 border-sky-100",
      cardStyle: "hover:border-sky-300"
    },
    {
      id: "interview",
      label: "Interview",
      count: metrics?.interview ?? 0,
      icon: Users,
      iconStyle: "bg-purple-50 text-purple-600 border-purple-100",
      cardStyle: "hover:border-purple-300"
    },
    {
      id: "offer",
      label: "Offer",
      count: metrics?.offer ?? 0,
      icon: Award,
      iconStyle: "bg-emerald-50 text-emerald-600 border-emerald-100",
      cardStyle: "hover:border-emerald-300"
    },
    {
      id: "rejected",
      label: "Rejected",
      count: metrics?.rejected ?? 0,
      icon: XCircle,
      iconStyle: "bg-rose-50 text-rose-500 border-rose-100",
      cardStyle: "hover:border-rose-300"
    }
  ];

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between">
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

      {/* 5-Item Status Grid without clipping */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2 mt-4">
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
              className={`flex flex-col items-center justify-center py-2 px-1 sm:p-2 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white transition-all shadow-2xs cursor-pointer text-center group ${item.cardStyle}`}
            >
              <div
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg border flex items-center justify-center mb-1 transition-transform group-hover:scale-105 ${item.iconStyle}`}
              >
                <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 block leading-none">
                {item.label}
              </span>
              <span className="text-sm sm:text-base md:text-lg font-black text-slate-900 mt-1 leading-none">
                {item.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
