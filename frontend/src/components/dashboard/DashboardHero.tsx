"use client";

import React from "react";
import { Zap, Building2, Target, Globe } from "lucide-react";

export interface DashboardHeroProps {
  userName: string;
  userInitials: string;
  stats: {
    newJobsSinceVisit: number;
    newFollowedCompanies: number;
    matchingJobs: number;
    totalOpportunities: string | number;
  };
}

export function DashboardHero({
  userName,
  userInitials,
  stats
}: DashboardHeroProps) {

  // Dynamic greeting based on hour of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning,";
    if (hour < 18) return "Good afternoon,";
    return "Good evening,";
  };

  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-gradient-to-r from-teal-50/30 via-white to-slate-50 p-5 sm:p-6 lg:p-7 shadow-xs">
      {/* ========================================================
          DECORATIVE BACKGROUND LAYERS (Identical to /companies)
          1. Subtle dotted atmosphere
          2. Soft ambient radial glow
          3. Exact MapSVG /world.svg asset from /companies page
          ======================================================== */}
      
      {/* 1. Subtle dotted grid atmosphere matching Companies hero */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_75%_65%_at_65%_50%,#000_70%,transparent_100%)] select-none z-0" 
        aria-hidden="true" 
      />

      {/* 2. Soft ambient radial teal glows matching Companies page */}
      <div 
        className="pointer-events-none absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-64 bg-teal-200/25 rounded-full blur-3xl select-none z-0" 
        aria-hidden="true" 
      />

      {/* 3. Authentic World Map from /companies (reusing /world.svg with soft edge blending) */}
      <div 
        className="pointer-events-none absolute right-0 sm:right-4 lg:right-10 top-1/2 -translate-y-1/2 w-[520px] sm:w-[620px] lg:w-[720px] xl:w-[780px] h-[92%] max-h-[340px] flex items-center justify-end select-none z-0"
        aria-hidden="true"
      >
        {/* Soft radial glow behind the world map */}
        <div className="absolute w-[440px] h-[280px] bg-radial from-teal-200/35 via-teal-100/15 to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* Detailed 256-country blank vector world map (exact same asset as /companies) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/world.svg"
          alt="Global Opportunities World Map"
          className="w-full h-full object-contain pointer-events-none select-none relative z-0 opacity-80"
          style={{
            maskImage: "linear-gradient(to left, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 100%)"
          }}
        />
      </div>

      {/* ========================================================
          HERO CONTENT LAYER (Above the map with relative z-10)
          ======================================================== */}
      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-5 sm:gap-6">
        {/* Left: User Welcome Block */}
        <div className="flex items-center gap-3.5 sm:gap-4.5">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#c7f2e4] text-[#0f5b49] font-black text-xl sm:text-2xl flex items-center justify-center shrink-0 border-2 border-white shadow-2xs">
            {userInitials || "AK"}
          </div>
          <div>
            <div className="text-xs sm:text-sm font-medium text-slate-500">
              {getGreeting()}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>{userName}</span>
              <span className="inline-block animate-wiggle">👋</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-md">
              Discover new opportunities and keep moving towards your goals.
            </p>
          </div>
        </div>

        {/* Right: 4 Real White Floating Stat Sub-cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 shrink-0">
          {/* Sub-card 1: New Jobs */}
          <div className="bg-white/95 backdrop-blur-xs rounded-xl sm:rounded-2xl p-2.5 sm:p-3 shadow-2xs border border-slate-200/90 flex items-center gap-2.5 transition-all hover:shadow-xs hover:border-slate-300">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 fill-emerald-600/30" />
            </div>
            <div className="min-w-0">
              <div className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                {stats.newJobsSinceVisit}
              </div>
              <div className="text-[10px] sm:text-[11px] font-semibold text-slate-700 leading-tight truncate">
                New jobs
              </div>
              <div className="text-[9px] sm:text-[10px] text-slate-400 leading-tight truncate">
                since your last visit
              </div>
            </div>
          </div>

          {/* Sub-card 2: New Companies */}
          <div className="bg-white/95 backdrop-blur-xs rounded-xl sm:rounded-2xl p-2.5 sm:p-3 shadow-2xs border border-slate-200/90 flex items-center gap-2.5 transition-all hover:shadow-xs hover:border-slate-300">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                {stats.newFollowedCompanies}
              </div>
              <div className="text-[10px] sm:text-[11px] font-semibold text-slate-700 leading-tight truncate">
                Companies
              </div>
              <div className="text-[9px] sm:text-[10px] text-slate-400 leading-tight truncate">
                in your followed list
              </div>
            </div>
          </div>

          {/* Sub-card 3: Matching Jobs */}
          <div className="bg-white/95 backdrop-blur-xs rounded-xl sm:rounded-2xl p-2.5 sm:p-3 shadow-2xs border border-slate-200/90 flex items-center gap-2.5 transition-all hover:shadow-xs hover:border-slate-300">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-rose-50 text-rose-500 border border-rose-100 flex items-center justify-center shrink-0">
              <Target className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                {stats.matchingJobs}
              </div>
              <div className="text-[10px] sm:text-[11px] font-semibold text-slate-700 leading-tight truncate">
                Jobs matching
              </div>
              <div className="text-[9px] sm:text-[10px] text-slate-400 leading-tight truncate">
                your profile
              </div>
            </div>
          </div>

          {/* Sub-card 4: Total Opportunities */}
          <div className="bg-white/95 backdrop-blur-xs rounded-xl sm:rounded-2xl p-2.5 sm:p-3 shadow-2xs border border-slate-200/90 flex items-center gap-2.5 transition-all hover:shadow-xs hover:border-slate-300">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center shrink-0">
              <Globe className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                {stats.totalOpportunities}
              </div>
              <div className="text-[10px] sm:text-[11px] font-semibold text-slate-700 leading-tight truncate">
                Total active
              </div>
              <div className="text-[9px] sm:text-[10px] text-slate-400 leading-tight truncate">
                opportunities
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
