"use client";

import React from "react";
import { ArrowRight, UserCheck } from "lucide-react";

export interface ProfileCompletionCardProps {
  percentage?: number;
  onEditProfile?: () => void;
  onViewProfile?: () => void;
}

export function ProfileCompletionCard({
  percentage = 70,
  onEditProfile,
  onViewProfile
}: ProfileCompletionCardProps) {
  // SVG Circle Calculations
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h2 className="text-base font-bold text-slate-900 tracking-tight">
          Profile Completion
        </h2>
        <button
          type="button"
          onClick={onViewProfile || onEditProfile}
          className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 group transition-colors cursor-pointer"
        >
          <span>View Profile</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Circular Progress Gauge & Explanation */}
      <div className="flex items-center gap-4 py-4">
        {/* SVG Circular Progress Ring */}
        <div className="relative w-18 h-18 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 72 72">
            {/* Background track */}
            <circle
              cx="36"
              cy="36"
              r={radius}
              className="text-slate-100 stroke-current"
              strokeWidth="6"
              fill="transparent"
            />
            {/* Animated Progress Arc */}
            <circle
              cx="36"
              cy="36"
              r={radius}
              className="text-teal-600 stroke-current transition-all duration-1000 ease-out"
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-extrabold text-slate-900 tracking-tight">
              {percentage}%
            </span>
          </div>
        </div>

        {/* Text prompt */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Complete your profile to get better job recommendations.
          </p>
        </div>
      </div>

      {/* Edit Profile Action Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onEditProfile}
          className="w-full py-2 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>Edit Profile</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
