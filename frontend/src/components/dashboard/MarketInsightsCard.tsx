"use client";

import React from "react";
import Link from "next/link";
import { BarChart3, ArrowRight } from "lucide-react";

export interface MarketInsightsCardProps {
  onViewFullInsights?: () => void;
}

export function MarketInsightsCard({ onViewFullInsights }: MarketInsightsCardProps) {
  const topCountries = [
    { country: "United States", percentage: 32 },
    { country: "India", percentage: 18 },
    { country: "Germany", percentage: 9 },
    { country: "United Kingdom", percentage: 8 },
    { country: "Canada", percentage: 7 },
  ];

  const inDemandSkills = [
    { skill: "Python", percentage: 42 },
    { skill: "SQL", percentage: 36 },
    { skill: "Machine Learning", percentage: 28 },
    { skill: "Data Analysis", percentage: 24 },
    { skill: "AWS", percentage: 22 },
  ];

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <BarChart3 className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Job Market Insights
          </h2>
        </div>

        <button
          type="button"
          onClick={onViewFullInsights}
          className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 group transition-colors cursor-pointer"
        >
          <span>View Full Insights</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* 2-Column Insights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
        {/* Left Sub-column: Top Hiring Countries */}
        <div>
          <h3 className="text-xs font-bold text-slate-800 mb-2.5">
            Top Hiring Countries
          </h3>
          <div className="space-y-2">
            {topCountries.map((item) => (
              <div key={item.country} className="flex items-center justify-between gap-2 text-xs">
                <span className="text-slate-500 truncate min-w-[85px]">
                  {item.country}
                </span>
                <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-slate-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage * 2}%` }}
                  />
                </div>
                <span className="text-[11px] font-semibold text-slate-700 w-7 text-right">
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sub-column: In-Demand Skills */}
        <div>
          <h3 className="text-xs font-bold text-slate-800 mb-2.5">
            In-Demand Skills
          </h3>
          <div className="space-y-2">
            {inDemandSkills.map((item) => (
              <div key={item.skill} className="flex items-center justify-between gap-2 text-xs">
                <span className="text-slate-500 truncate min-w-[95px]">
                  {item.skill}
                </span>
                <div className="flex-1 bg-teal-50 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-teal-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage * 1.8}%` }}
                  />
                </div>
                <span className="text-[11px] font-semibold text-teal-700 w-7 text-right">
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
