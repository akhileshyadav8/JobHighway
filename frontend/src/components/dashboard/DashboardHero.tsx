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
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs">
      {/* Subtle World Map / Global Geography Pattern */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.15] overflow-hidden" 
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1000 320"
          className="w-full h-full object-cover text-teal-600 fill-current"
          preserveAspectRatio="xMidYMid slice"
        >
          <g opacity="0.85">
            {/* North America */}
            <circle cx="160" cy="90" r="1.5" /><circle cx="170" cy="85" r="2" /><circle cx="180" cy="95" r="1.5" />
            <circle cx="190" cy="110" r="2" /><circle cx="210" cy="100" r="2.5" /><circle cx="225" cy="115" r="2" />
            <circle cx="240" cy="130" r="2" /><circle cx="255" cy="140" r="1.5" /><circle cx="230" cy="150" r="2" />
            <circle cx="210" cy="140" r="2" /><circle cx="190" cy="130" r="1.5" /><circle cx="175" cy="115" r="2" />
            
            {/* South America */}
            <circle cx="280" cy="200" r="2" /><circle cx="295" cy="215" r="2.5" /><circle cx="310" cy="235" r="2" />
            <circle cx="305" cy="260" r="2" /><circle cx="290" cy="280" r="1.5" /><circle cx="280" cy="250" r="2" />

            {/* Europe */}
            <circle cx="510" cy="90" r="2" /><circle cx="525" cy="80" r="2" /><circle cx="540" cy="95" r="2.5" />
            <circle cx="530" cy="110" r="2" /><circle cx="515" cy="120" r="1.5" /><circle cx="500" cy="105" r="2" />

            {/* Africa */}
            <circle cx="520" cy="160" r="2" /><circle cx="540" cy="180" r="2.5" /><circle cx="550" cy="210" r="2" />
            <circle cx="560" cy="240" r="2" /><circle cx="535" cy="230" r="1.5" /><circle cx="515" cy="195" r="2" />

            {/* Asia */}
            <circle cx="660" cy="85" r="2" /><circle cx="690" cy="95" r="2.5" /><circle cx="720" cy="110" r="2" />
            <circle cx="750" cy="130" r="2.5" /><circle cx="730" cy="150" r="2" /><circle cx="700" cy="140" r="2" />
            <circle cx="675" cy="125" r="2" /><circle cx="650" cy="110" r="2" />

            {/* India / South Asia */}
            <circle cx="680" cy="165" r="2.8" /><circle cx="695" cy="175" r="2.5" /><circle cx="710" cy="185" r="2" />
            
            {/* East Asia & Japan */}
            <circle cx="790" cy="115" r="2" /><circle cx="810" cy="130" r="2" /><circle cx="820" cy="150" r="1.5" />

            {/* Australia */}
            <circle cx="820" cy="240" r="2" /><circle cx="845" cy="255" r="2.5" /><circle cx="860" cy="270" r="2" />
            <circle cx="830" cy="275" r="1.5" />

            {/* Network Connections */}
            <path d="M225,115 Q367,50 540,95" fill="none" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3,3" opacity="0.6" />
            <path d="M540,95 Q610,130 680,165" fill="none" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3,3" opacity="0.6" />
            <path d="M680,165 Q750,200 845,255" fill="none" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3,3" opacity="0.6" />
            <path d="M225,115 Q250,160 295,215" fill="none" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3,3" opacity="0.5" />
          </g>
        </svg>
      </div>

      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        {/* Left: User Welcome Block */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-100/90 text-teal-800 font-extrabold text-xl sm:text-2xl flex items-center justify-center shrink-0 border-2 border-white shadow-2xs">
            {userInitials || "U"}
          </div>
          <div>
            <div className="text-xs sm:text-sm font-medium text-slate-500">
              {getGreeting()}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>{userName}</span>
              <span className="inline-block animate-wiggle">👋</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Discover new opportunities and keep moving towards your goals.
            </p>
          </div>
        </div>

        {/* Right: 4 Real Stat Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4 shrink-0">
          {/* Stat 1: New Jobs */}
          <div className="flex items-center gap-3 p-2 sm:p-2.5 rounded-xl whitespace-nowrap">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 fill-emerald-600/20" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {stats.newJobsSinceVisit}
              </div>
              <div className="text-[11px] text-slate-500 font-medium leading-tight">
                <div>New jobs</div>
                <div className="text-slate-400 text-[10px]">since your last visit</div>
              </div>
            </div>
          </div>

          {/* Stat 2: New Companies */}
          <div className="flex items-center gap-3 p-2 sm:p-2.5 rounded-xl whitespace-nowrap">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {stats.newFollowedCompanies}
              </div>
              <div className="text-[11px] text-slate-500 font-medium leading-tight">
                <div>New companies</div>
                <div className="text-slate-400 text-[10px]">in your followed list</div>
              </div>
            </div>
          </div>

          {/* Stat 3: Matching Jobs */}
          <div className="flex items-center gap-3 p-2 sm:p-2.5 rounded-xl whitespace-nowrap">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {stats.matchingJobs}
              </div>
              <div className="text-[11px] text-slate-500 font-medium leading-tight">
                <div>Jobs matching</div>
                <div className="text-slate-400 text-[10px]">your profile</div>
              </div>
            </div>
          </div>

          {/* Stat 4: Total Opportunities */}
          <div className="flex items-center gap-3 p-2 sm:p-2.5 rounded-xl whitespace-nowrap">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {stats.totalOpportunities}
              </div>
              <div className="text-[11px] text-slate-500 font-medium leading-tight">
                <div>Total active</div>
                <div className="text-slate-400 text-[10px]">opportunities</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
