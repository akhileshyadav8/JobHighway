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
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-teal-100/80 bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-emerald-50/60 p-5 sm:p-6 lg:p-7 shadow-xs">
      {/* High-Fidelity Dotted World Map Background Pattern */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.28] overflow-hidden select-none" 
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1000 360"
          className="w-full h-full object-cover text-teal-600 fill-teal-600"
          preserveAspectRatio="xMidYMid slice"
        >
          <g>
            {/* North America Dotted Cluster */}
            <circle cx="90" cy="70" r="2" /><circle cx="105" cy="65" r="2.2" /><circle cx="120" cy="60" r="2" /><circle cx="135" cy="55" r="2.5" />
            <circle cx="80" cy="85" r="2.2" /><circle cx="95" cy="80" r="2.5" /><circle cx="110" cy="78" r="2.5" /><circle cx="125" cy="75" r="2.8" /><circle cx="140" cy="70" r="2.2" /><circle cx="155" cy="68" r="2" />
            <circle cx="100" cy="95" r="2.5" /><circle cx="115" cy="92" r="2.8" /><circle cx="130" cy="90" r="3" /><circle cx="145" cy="88" r="2.8" /><circle cx="160" cy="85" r="2.5" /><circle cx="175" cy="80" r="2" />
            <circle cx="110" cy="110" r="2.5" /><circle cx="125" cy="108" r="3" /><circle cx="140" cy="105" r="3" /><circle cx="155" cy="102" r="3" /><circle cx="170" cy="100" r="2.8" /><circle cx="185" cy="95" r="2.2" />
            <circle cx="120" cy="125" r="2.2" /><circle cx="135" cy="122" r="2.8" /><circle cx="150" cy="120" r="3" /><circle cx="165" cy="118" r="2.8" /><circle cx="180" cy="115" r="2.5" /><circle cx="195" cy="110" r="2" />
            <circle cx="130" cy="140" r="2" /><circle cx="145" cy="138" r="2.5" /><circle cx="160" cy="135" r="2.8" /><circle cx="175" cy="132" r="2.5" /><circle cx="190" cy="130" r="2" />
            <circle cx="155" cy="152" r="2" /><circle cx="170" cy="150" r="2.2" /><circle cx="185" cy="145" r="2" />
            <circle cx="175" cy="165" r="2" /><circle cx="185" cy="162" r="1.8" />
            
            {/* South America Dotted Cluster */}
            <circle cx="210" cy="185" r="2.2" /><circle cx="225" cy="180" r="2.5" /><circle cx="240" cy="185" r="2.2" />
            <circle cx="220" cy="200" r="2.5" /><circle cx="235" cy="198" r="2.8" /><circle cx="250" cy="200" r="2.5" /><circle cx="265" cy="205" r="2.2" />
            <circle cx="225" cy="215" r="2.8" /><circle cx="240" cy="215" r="3" /><circle cx="255" cy="218" r="2.8" /><circle cx="270" cy="222" r="2.5" />
            <circle cx="230" cy="230" r="2.5" /><circle cx="245" cy="232" r="3" /><circle cx="260" cy="235" r="2.8" /><circle cx="275" cy="240" r="2.2" />
            <circle cx="235" cy="245" r="2.2" /><circle cx="250" cy="248" r="2.8" /><circle cx="265" cy="252" r="2.5" />
            <circle cx="240" cy="260" r="2" /><circle cx="255" cy="265" r="2.5" /><circle cx="265" cy="270" r="2" />
            <circle cx="245" cy="275" r="2" /><circle cx="255" cy="282" r="1.8" />
            <circle cx="250" cy="295" r="1.6" />

            {/* Europe Dotted Cluster */}
            <circle cx="460" cy="70" r="2" /><circle cx="475" cy="65" r="2.2" /><circle cx="490" cy="68" r="2" /><circle cx="505" cy="62" r="2.5" />
            <circle cx="455" cy="85" r="2.2" /><circle cx="470" cy="82" r="2.8" /><circle cx="485" cy="80" r="3" /><circle cx="500" cy="78" r="2.8" /><circle cx="515" cy="75" r="2.5" /><circle cx="530" cy="72" r="2.2" />
            <circle cx="465" cy="100" r="2.5" /><circle cx="480" cy="98" r="3" /><circle cx="495" cy="95" r="3" /><circle cx="510" cy="92" r="2.8" /><circle cx="525" cy="90" r="2.5" />
            <circle cx="475" cy="115" r="2.2" /><circle cx="490" cy="112" r="2.8" /><circle cx="505" cy="110" r="2.8" /><circle cx="520" cy="108" r="2.5" />

            {/* Africa Dotted Cluster */}
            <circle cx="475" cy="135" r="2.2" /><circle cx="490" cy="132" r="2.5" /><circle cx="505" cy="130" r="2.8" /><circle cx="520" cy="128" r="2.5" />
            <circle cx="470" cy="150" r="2.5" /><circle cx="485" cy="148" r="2.8" /><circle cx="500" cy="145" r="3" /><circle cx="515" cy="142" r="3" /><circle cx="530" cy="145" r="2.5" />
            <circle cx="475" cy="165" r="2.8" /><circle cx="490" cy="165" r="3" /><circle cx="505" cy="162" r="3.2" /><circle cx="520" cy="160" r="3" /><circle cx="535" cy="162" r="2.8" /><circle cx="550" cy="168" r="2.2" />
            <circle cx="485" cy="180" r="2.5" /><circle cx="500" cy="182" r="3" /><circle cx="515" cy="180" r="3" /><circle cx="530" cy="182" r="2.8" /><circle cx="545" cy="185" r="2.5" />
            <circle cx="495" cy="195" r="2.5" /><circle cx="510" cy="198" r="2.8" /><circle cx="525" cy="200" r="2.8" /><circle cx="540" cy="202" r="2.2" />
            <circle cx="505" cy="210" r="2.2" /><circle cx="520" cy="215" r="2.5" /><circle cx="535" cy="218" r="2" />
            <circle cx="515" cy="225" r="2" /><circle cx="525" cy="230" r="2.2" /><circle cx="535" cy="235" r="1.8" />
            <circle cx="525" cy="245" r="1.8" />

            {/* Asia & Russia Dotted Cluster */}
            <circle cx="550" cy="65" r="2" /><circle cx="570" cy="62" r="2.5" /><circle cx="590" cy="60" r="2.5" /><circle cx="610" cy="58" r="2.8" /><circle cx="630" cy="62" r="2.5" /><circle cx="650" cy="60" r="2.2" /><circle cx="670" cy="65" r="2" />
            <circle cx="545" cy="80" r="2.5" /><circle cx="565" cy="78" r="2.8" /><circle cx="585" cy="75" r="3" /><circle cx="605" cy="72" r="3" /><circle cx="625" cy="75" r="3" /><circle cx="645" cy="75" r="2.8" /><circle cx="665" cy="78" r="2.5" /><circle cx="685" cy="80" r="2" />
            <circle cx="555" cy="95" r="2.8" /><circle cx="575" cy="92" r="3" /><circle cx="595" cy="90" r="3.2" /><circle cx="615" cy="88" r="3.2" /><circle cx="635" cy="90" r="3" /><circle cx="655" cy="92" r="2.8" /><circle cx="675" cy="95" r="2.5" />
            <circle cx="570" cy="110" r="2.8" /><circle cx="590" cy="108" r="3.2" /><circle cx="610" cy="105" r="3.2" /><circle cx="630" cy="105" r="3" /><circle cx="650" cy="108" r="2.8" /><circle cx="670" cy="112" r="2.5" /><circle cx="690" cy="115" r="2" />
            <circle cx="580" cy="125" r="3" /><circle cx="600" cy="122" r="3.2" /><circle cx="620" cy="120" r="3.2" /><circle cx="640" cy="122" r="3" /><circle cx="660" cy="125" r="2.8" /><circle cx="680" cy="128" r="2.5" />
            
            {/* India & South Asia */}
            <circle cx="625" cy="140" r="3" /><circle cx="640" cy="138" r="3.5" /><circle cx="655" cy="140" r="3.2" />
            <circle cx="635" cy="155" r="3.2" /><circle cx="645" cy="155" r="3.5" /><circle cx="655" cy="158" r="3" />
            <circle cx="640" cy="170" r="3" /><circle cx="648" cy="172" r="3.2" />
            <circle cx="645" cy="185" r="2.5" />

            {/* East Asia & Japan */}
            <circle cx="705" cy="90" r="2" /><circle cx="720" cy="95" r="2.2" /><circle cx="735" cy="100" r="2" />
            <circle cx="700" cy="110" r="2.5" /><circle cx="715" cy="115" r="2.8" /><circle cx="730" cy="120" r="2.5" /><circle cx="745" cy="125" r="2" />
            <circle cx="695" cy="130" r="2.5" /><circle cx="710" cy="135" r="2.8" /><circle cx="725" cy="140" r="2.2" />
            
            {/* Southeast Asia */}
            <circle cx="675" cy="165" r="2.2" /><circle cx="690" cy="170" r="2.5" /><circle cx="705" cy="175" r="2.2" /><circle cx="720" cy="180" r="2" />
            <circle cx="685" cy="190" r="2" /><circle cx="700" cy="195" r="2.2" /><circle cx="715" cy="200" r="2" />

            {/* Australia & Oceania */}
            <circle cx="770" cy="225" r="2.2" /><circle cx="790" cy="220" r="2.5" /><circle cx="810" cy="225" r="2.2" />
            <circle cx="760" cy="240" r="2.5" /><circle cx="780" cy="238" r="3" /><circle cx="800" cy="238" r="3" /><circle cx="820" cy="242" r="2.5" />
            <circle cx="765" cy="255" r="2.5" /><circle cx="785" cy="255" r="3" /><circle cx="805" cy="255" r="3" /><circle cx="825" cy="258" r="2.2" />
            <circle cx="775" cy="270" r="2.2" /><circle cx="795" cy="270" r="2.8" /><circle cx="815" cy="272" r="2.5" />
            <circle cx="790" cy="285" r="2" /><circle cx="805" cy="288" r="2.2" />
            <circle cx="840" cy="285" r="1.8" /><circle cx="850" cy="295" r="2" />

            {/* Global Connecting Curves */}
            <path d="M150,120 Q330,30 495,95" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" opacity="0.45" />
            <path d="M495,95 Q570,120 645,155" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" opacity="0.45" />
            <path d="M645,155 Q710,195 785,255" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" opacity="0.45" />
            <path d="M150,120 Q190,170 235,215" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" opacity="0.35" />
            <path d="M495,95 Q510,140 500,182" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" opacity="0.35" />
          </g>
        </svg>
      </div>

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

        {/* Right: 4 Real White Floating Stat Sub-cards matching Image 4 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 shrink-0">
          {/* Sub-card 1: New Jobs */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-3 shadow-2xs border border-slate-200/90 flex items-center gap-2.5 transition-all hover:shadow-xs hover:border-slate-300">
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
          <div className="bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-3 shadow-2xs border border-slate-200/90 flex items-center gap-2.5 transition-all hover:shadow-xs hover:border-slate-300">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                {stats.newFollowedCompanies}
              </div>
              <div className="text-[10px] sm:text-[11px] font-semibold text-slate-700 leading-tight truncate">
                New companies
              </div>
              <div className="text-[9px] sm:text-[10px] text-slate-400 leading-tight truncate">
                in your followed list
              </div>
            </div>
          </div>

          {/* Sub-card 3: Matching Jobs */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-3 shadow-2xs border border-slate-200/90 flex items-center gap-2.5 transition-all hover:shadow-xs hover:border-slate-300">
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
          <div className="bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-3 shadow-2xs border border-slate-200/90 flex items-center gap-2.5 transition-all hover:shadow-xs hover:border-slate-300">
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
