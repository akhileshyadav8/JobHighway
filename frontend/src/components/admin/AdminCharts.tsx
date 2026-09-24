"use client";

import React, { useState } from "react";

// -------------------------------------------------------------
// 1. Job Activity Stacked Bar Chart (Last 14 Days)
// -------------------------------------------------------------
interface JobActivityDataPoint {
  date: string;
  added: number;
  expired: number;
  updated: number;
}

const DEFAULT_JOB_ACTIVITY: JobActivityDataPoint[] = [
  { date: "Sep 10", added: 120, expired: 25, updated: 45 },
  { date: "Sep 11", added: 185, expired: 30, updated: 60 },
  { date: "Sep 12", added: 240, expired: 40, updated: 70 },
  { date: "Sep 13", added: 160, expired: 20, updated: 35 },
  { date: "Sep 14", added: 310, expired: 55, updated: 85 },
  { date: "Sep 15", added: 280, expired: 45, updated: 90 },
  { date: "Sep 16", added: 220, expired: 35, updated: 75 },
  { date: "Sep 17", added: 390, expired: 60, updated: 110 },
  { date: "Sep 18", added: 420, expired: 70, updated: 130 },
  { date: "Sep 19", added: 340, expired: 50, updated: 95 },
  { date: "Sep 20", added: 480, expired: 80, updated: 140 },
  { date: "Sep 21", added: 510, expired: 90, updated: 160 },
  { date: "Sep 22", added: 460, expired: 75, updated: 135 },
  { date: "Sep 23", added: 530, expired: 85, updated: 170 }
];

export function JobActivityChart({ data = DEFAULT_JOB_ACTIVITY }: { data?: JobActivityDataPoint[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxTotal = Math.max(...data.map(d => d.added + d.expired + d.updated), 800);
  const chartHeight = 160;

  return (
    <div className="w-full">
      {/* Legend */}
      <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 mb-4">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#0d9488]" />
          <span>Added</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#f43f5e]" />
          <span>Expired</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#0284c7]" />
          <span>Updated</span>
        </div>
      </div>

      {/* Bar Grid */}
      <div className="relative h-44 flex items-end justify-between gap-1 pt-6 px-1 border-b border-slate-200">
        {data.map((item, idx) => {
          const addedHeight = (item.added / maxTotal) * chartHeight;
          const expiredHeight = (item.expired / maxTotal) * chartHeight;
          const updatedHeight = (item.updated / maxTotal) * chartHeight;
          const isHovered = hoveredIndex === idx;

          return (
            <div
              key={item.date}
              className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute -top-12 z-20 bg-slate-900 text-white text-[10px] rounded-lg px-2.5 py-1 shadow-lg pointer-events-none whitespace-nowrap">
                  <span className="font-bold">{item.date}</span>: +{item.added} Added, {item.expired} Expired
                </div>
              )}

              {/* Stacked bars */}
              <div className="w-full max-w-[18px] rounded-t-xs flex flex-col justify-end overflow-hidden transition-all duration-150 group-hover:brightness-95">
                <div style={{ height: `${updatedHeight}px` }} className="w-full bg-[#0284c7]" />
                <div style={{ height: `${expiredHeight}px` }} className="w-full bg-[#f43f5e]" />
                <div style={{ height: `${addedHeight}px` }} className="w-full bg-[#0d9488]" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Date Labels */}
      <div className="flex justify-between text-[10px] text-slate-400 mt-2 px-1 font-mono">
        <span>{data[0]?.date}</span>
        <span>{data[Math.floor(data.length / 2)]?.date}</span>
        <span>{data[data.length - 1]?.date}</span>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 2. User Activity Multi-Line Chart (Last 14 Days)
// -------------------------------------------------------------
interface UserActivityPoint {
  date: string;
  newUsers: number;
  pageViews: number;
}

const DEFAULT_USER_ACTIVITY: UserActivityPoint[] = [
  { date: "Sep 10", newUsers: 12, pageViews: 180 },
  { date: "Sep 11", newUsers: 18, pageViews: 240 },
  { date: "Sep 12", newUsers: 24, pageViews: 320 },
  { date: "Sep 13", newUsers: 15, pageViews: 210 },
  { date: "Sep 14", newUsers: 35, pageViews: 410 },
  { date: "Sep 15", newUsers: 42, pageViews: 480 },
  { date: "Sep 16", newUsers: 30, pageViews: 390 },
  { date: "Sep 17", newUsers: 55, pageViews: 590 },
  { date: "Sep 18", newUsers: 60, pageViews: 640 },
  { date: "Sep 19", newUsers: 48, pageViews: 520 },
  { date: "Sep 20", newUsers: 72, pageViews: 710 },
  { date: "Sep 21", newUsers: 85, pageViews: 830 },
  { date: "Sep 22", newUsers: 78, pageViews: 790 },
  { date: "Sep 23", newUsers: 94, pageViews: 920 }
];

export function UserActivityChart({ data = DEFAULT_USER_ACTIVITY }: { data?: UserActivityPoint[] }) {
  const width = 500;
  const height = 160;
  const padding = 20;

  const maxViews = Math.max(...data.map(d => d.pageViews), 1000);
  const maxUsers = Math.max(...data.map(d => d.newUsers), 100);

  const getPoints = (accessor: (d: UserActivityPoint) => number, maxVal: number) => {
    return data.map((d, i) => {
      const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
      const y = height - padding - (accessor(d) / maxVal) * (height - 2 * padding);
      return `${x},${y}`;
    }).join(" ");
  };

  const viewsPoints = getPoints(d => d.pageViews, maxViews);
  const usersPoints = getPoints(d => d.newUsers, maxUsers);

  return (
    <div className="w-full">
      {/* Legend */}
      <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 mb-4">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" />
          <span>Page Views</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0d9488]" />
          <span>New Users</span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="h-44 w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          {/* Subtle Gridlines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#f1f5f9" strokeWidth="1" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#f1f5f9" strokeWidth="1" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e2e8f0" strokeWidth="1" />

          {/* Page Views Line */}
          <polyline
            fill="none"
            stroke="#0284c7"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={viewsPoints}
          />

          {/* New Users Line */}
          <polyline
            fill="none"
            stroke="#0d9488"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={usersPoints}
          />
        </svg>
      </div>

      {/* Date Labels */}
      <div className="flex justify-between text-[10px] text-slate-400 mt-2 px-1 font-mono">
        <span>{data[0]?.date}</span>
        <span>{data[Math.floor(data.length / 2)]?.date}</span>
        <span>{data[data.length - 1]?.date}</span>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 3. Application Funnel Chart
// -------------------------------------------------------------
interface FunnelStage {
  label: string;
  count: number;
  percentage: number;
  color: string;
}

export function ApplicationFunnelChart({ stages }: { stages?: FunnelStage[] }) {
  const defaultStages: FunnelStage[] = [
    { label: "Applied", count: 6, percentage: 60, color: "bg-teal-600" },
    { label: "Screening", count: 2, percentage: 20, color: "bg-cyan-600" },
    { label: "Interview", count: 1, percentage: 10, color: "bg-purple-600" },
    { label: "Offer", count: 1, percentage: 10, color: "bg-emerald-600" },
    { label: "Accepted", count: 1, percentage: 10, color: "bg-blue-600" }
  ];

  const currentStages = stages || defaultStages;

  return (
    <div className="space-y-3">
      {currentStages.map((stage) => (
        <div key={stage.label} className="space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>{stage.label}</span>
            <span className="font-mono text-slate-500">
              {stage.count} ({stage.percentage}%)
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${stage.color}`}
              style={{ width: `${Math.max(stage.percentage, 8)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
