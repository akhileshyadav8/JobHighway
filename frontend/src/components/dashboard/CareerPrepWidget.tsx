"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  GraduationCap, 
  ArrowRight, 
  CheckCircle2, 
  BookOpen, 
  Target, 
  Compass, 
  Sparkles,
  ExternalLink
} from "lucide-react";
import { ALL_PREPARATION_ROLES, PrepRole } from "@/lib/preparationData";

interface CareerPrepWidgetProps {
  targetRole?: string;
  userId?: string;
}

export function CareerPrepWidget({ targetRole = "Software Engineer", userId }: CareerPrepWidgetProps) {
  // Find matching prep role object
  const activeRole: PrepRole = React.useMemo(() => {
    const roleLower = targetRole.toLowerCase();
    const found = ALL_PREPARATION_ROLES.find(
      r => r.name.toLowerCase() === roleLower || 
           roleLower.includes(r.name.toLowerCase()) || 
           r.name.toLowerCase().includes(roleLower)
    );
    return found || ALL_PREPARATION_ROLES[0];
  }, [targetRole]);

  // Load progress from localStorage
  const [completedStepsCount, setCompletedStepsCount] = useState(0);
  const [completedSkillsCount, setCompletedSkillsCount] = useState(0);

  useEffect(() => {
    try {
      const userPrefix = userId ? `user_${userId}_` : "guest_";
      const key = `jobhighway_prep_${userPrefix}${activeRole.id}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        setCompletedStepsCount(Array.isArray(parsed.completedSteps) ? parsed.completedSteps.length : 0);
        setCompletedSkillsCount(Array.isArray(parsed.completedSkills) ? parsed.completedSkills.length : 0);
      } else {
        // Default preview values if not started yet
        setCompletedStepsCount(2);
        setCompletedSkillsCount(4);
      }
    } catch {
      setCompletedStepsCount(2);
      setCompletedSkillsCount(4);
    }
  }, [userId, activeRole.id]);

  const totalSteps = activeRole.roadmap.length || 6;
  const roadmapPercent = Math.min(100, Math.round((completedStepsCount / totalSteps) * 100));

  // Determine next milestone
  const nextMilestone = activeRole.roadmap[completedStepsCount] || activeRole.roadmap[0];

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3.5 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center shrink-0">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 leading-tight">Career Preparation</h3>
            <p className="text-[11px] text-slate-500">Tailored to your target role</p>
          </div>
        </div>

        <Link
          href={`/prepare?role=${activeRole.id}`}
          className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 group"
        >
          <span>Full Hub</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Target Role & Readiness Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-semibold text-slate-800 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-teal-600" />
            <span>{activeRole.name}</span>
          </span>
          <span className="font-bold text-teal-700 font-mono text-[11px]">
            {roadmapPercent}% Readiness
          </span>
        </div>

        {/* Progress Track */}
        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${Math.max(10, roadmapPercent)}%` }}
          />
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-2.5 mb-4 text-xs">
        <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-100">
          <div className="text-[11px] text-slate-500 mb-0.5">Roadmap Steps</div>
          <div className="font-bold text-slate-900 text-sm">
            {completedStepsCount} <span className="text-slate-400 font-normal text-xs">/ {totalSteps} done</span>
          </div>
        </div>
        <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-100">
          <div className="text-[11px] text-slate-500 mb-0.5">Key Skills</div>
          <div className="font-bold text-slate-900 text-sm">
            {completedSkillsCount} <span className="text-slate-400 font-normal text-xs">verified</span>
          </div>
        </div>
      </div>

      {/* Next Recommended Topic */}
      {nextMilestone && (
        <div className="bg-teal-50/50 border border-teal-100/80 rounded-xl p-3 mb-4">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-teal-800 uppercase tracking-wider mb-1">
            <Compass className="w-3 h-3 text-teal-600" />
            <span>Next Recommended Milestone</span>
          </div>
          <p className="text-xs font-semibold text-slate-800 line-clamp-1">
            {nextMilestone.title}
          </p>
          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
            {nextMilestone.description}
          </p>
        </div>
      )}

      {/* CTA Button */}
      <Link
        href={`/prepare?role=${activeRole.id}`}
        className="w-full py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs group"
      >
        <BookOpen className="w-3.5 h-3.5" />
        <span>Continue Role Preparation</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
}
