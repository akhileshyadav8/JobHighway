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
  BarChart2,
  Award,
  Clock,
  RotateCcw
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
  const [testAttempts, setTestAttempts] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<{
    totalAttempts: number;
    passedAttempts: number;
    averagePercentage: number;
    bestScore: number;
    latestScore: number;
    weakestTopics: any[];
  }>({
    totalAttempts: 0,
    passedAttempts: 0,
    averagePercentage: 0,
    bestScore: 0,
    latestScore: 0,
    weakestTopics: []
  });

  useEffect(() => {
    const loadPrepProgress = () => {
      try {
        const userPrefix = userId ? `user_${userId}_` : "guest_";
        const key = `jobhighway_prep_${userPrefix}${activeRole.id}`;
        const saved = localStorage.getItem(key);
        if (saved) {
          const parsed = JSON.parse(saved);
          setCompletedStepsCount(Array.isArray(parsed.completedSteps) ? parsed.completedSteps.length : 0);
          setCompletedSkillsCount(Array.isArray(parsed.completedSkills) ? parsed.completedSkills.length : 0);
        } else {
          setCompletedStepsCount(0);
          setCompletedSkillsCount(0);
        }

        // Load quiz attempts from localStorage
        const quizKey = `jobhighway_quiz_history_${userPrefix}`;
        const savedQuizzes = localStorage.getItem(quizKey);
        if (savedQuizzes) {
          const parsedQuizzes = JSON.parse(savedQuizzes);
          setTestAttempts(parsedQuizzes);
          if (parsedQuizzes.length > 0) {
            const total = parsedQuizzes.length;
            const passed = parsedQuizzes.filter((q: any) => q.passed).length;
            const avg = Math.round(parsedQuizzes.reduce((s: number, q: any) => s + (q.percentage || 0), 0) / total);
            const best = parsedQuizzes.reduce((m: number, q: any) => Math.max(m, q.percentage || 0), 0);
            setAnalytics(prev => ({
              ...prev,
              totalAttempts: total,
              passedAttempts: passed,
              averagePercentage: avg,
              bestScore: best,
              latestScore: parsedQuizzes[0].percentage
            }));
          }
        }

        // Also fetch server-side attempts
        fetch(`/api/prepare/attempts?userId=${userId || "guest"}&limit=10`)
          .then(res => res.json())
          .then(data => {
            if (data?.analytics && data.analytics.totalAttempts > 0) {
              setAnalytics(data.analytics);
              if (data.attempts && data.attempts.length > 0) {
                setTestAttempts(data.attempts);
              }
            }
          })
          .catch(() => {});
      } catch {
        setCompletedStepsCount(0);
        setCompletedSkillsCount(0);
      }
    };

    loadPrepProgress();
    window.addEventListener("storage", loadPrepProgress);
    window.addEventListener("jobhighway_prep_progress_updated", loadPrepProgress);

    return () => {
      window.removeEventListener("storage", loadPrepProgress);
      window.removeEventListener("jobhighway_prep_progress_updated", loadPrepProgress);
    };
  }, [userId, activeRole.id]);

  const totalSteps = activeRole.roadmap.length || 6;
  const roadmapPercent = Math.min(100, Math.round((completedStepsCount / totalSteps) * 100));
  const nextMilestone = activeRole.roadmap[completedStepsCount] || activeRole.roadmap[0];

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center shrink-0">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 leading-tight">Career Preparation &amp; Assessment</h3>
            <p className="text-[11px] text-slate-500">Tailored to {activeRole.name}</p>
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
      <div>
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
            style={{ width: `${roadmapPercent}%` }}
          />
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-100">
          <div className="text-[10px] text-slate-500 mb-0.5 uppercase tracking-wider">Roadmap</div>
          <div className="font-bold text-slate-900 text-sm">
            {completedStepsCount} <span className="text-slate-400 font-normal text-xs">/ {totalSteps}</span>
          </div>
        </div>
        <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-100">
          <div className="text-[10px] text-slate-500 mb-0.5 uppercase tracking-wider">Mock Tests</div>
          <div className="font-bold text-slate-900 text-sm">
            {analytics.totalAttempts} <span className="text-slate-400 font-normal text-xs">taken</span>
          </div>
        </div>
        <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-100">
          <div className="text-[10px] text-slate-500 mb-0.5 uppercase tracking-wider">Avg Accuracy</div>
          <div className="font-bold text-teal-700 text-sm font-mono">
            {analytics.totalAttempts > 0 ? `${analytics.averagePercentage}%` : "—"}
          </div>
        </div>
        <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-100">
          <div className="text-[10px] text-slate-500 mb-0.5 uppercase tracking-wider">Best Score</div>
          <div className="font-bold text-emerald-700 text-sm font-mono">
            {analytics.totalAttempts > 0 ? `${analytics.bestScore}%` : "—"}
          </div>
        </div>
      </div>

      {/* Mock Test Score Progression Chart if attempts exist */}
      {testAttempts.length > 0 && (
        <div className="bg-slate-50/90 rounded-xl p-3 border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-teal-600" />
              <span>Assessment Progression</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Latest: {analytics.latestScore}%</span>
          </div>

          {/* Mini score progression bars */}
          <div className="flex items-end gap-1.5 h-12 pt-1">
            {testAttempts.slice(0, 8).reverse().map((att, idx) => {
              const heightPct = Math.max(15, att.percentage || 10);
              const isPassed = att.passed;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                  <div className="w-full bg-slate-200 rounded-t-sm h-full flex items-end overflow-hidden">
                    <div
                      className={`w-full rounded-t-sm transition-all ${
                        isPassed ? "bg-teal-500 group-hover:bg-teal-600" : "bg-amber-400 group-hover:bg-amber-500"
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[9px] font-mono text-slate-400">
                    {att.percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Next Milestone */}
      {nextMilestone && (
        <div className="bg-teal-50/40 border border-teal-100 rounded-xl p-3">
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

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <Link
          href={`/prepare/mock-test?role=${activeRole.id}&category=all`}
          className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs group"
        >
          <Award className="w-3.5 h-3.5 text-teal-400" />
          <span>Take Mock Test</span>
        </Link>
        <Link
          href={`/prepare?role=${activeRole.id}`}
          className="py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs group"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Prepare Hub</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
