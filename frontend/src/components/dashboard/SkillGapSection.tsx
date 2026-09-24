"use client";

import React, { useState } from "react";
import { BarChart3, ArrowRight, Target, ChevronDown } from "lucide-react";

export interface SkillGapData {
  role: string;
  matchScore: number;
  missingSkills: string[];
}

export interface SkillGapSectionProps {
  initialData?: SkillGapData;
  onViewDetailedAnalysis?: () => void;
}

const ROLE_OPTIONS: Record<string, SkillGapData> = {
  "Data Scientist": {
    role: "Data Scientist",
    matchScore: 70,
    missingSkills: ["AWS", "Spark", "Docker", "MLOps"]
  },
  "ML Engineer": {
    role: "ML Engineer",
    matchScore: 65,
    missingSkills: ["Kubernetes", "PyTorch", "MLflow", "CUDA"]
  },
  "Data Analyst": {
    role: "Data Analyst",
    matchScore: 85,
    missingSkills: ["Tableau", "Looker", "BigQuery"]
  },
  "Full Stack Engineer": {
    role: "Full Stack Engineer",
    matchScore: 78,
    missingSkills: ["GraphQL", "Redis", "Kafka"]
  }
};

export function SkillGapSection({
  initialData = ROLE_OPTIONS["Data Scientist"],
  onViewDetailedAnalysis
}: SkillGapSectionProps) {
  const [selectedRole, setSelectedRole] = useState(initialData.role);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const currentData = ROLE_OPTIONS[selectedRole] || initialData;

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <BarChart3 className="w-4 h-4" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Skill Gap Analysis
          </h2>
        </div>

        <button
          type="button"
          onClick={onViewDetailedAnalysis}
          className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 group transition-colors cursor-pointer"
        >
          <span>View Detailed Analysis</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Target Role Row */}
      <div className="mt-4 flex items-center justify-between relative">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-emerald-600" />
          <span className="font-bold text-sm text-slate-900">
            {currentData.role}
          </span>
        </div>

        {/* Target Role Dropdown Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="py-1 px-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Target Role</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-8 z-30 w-44 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
              {Object.keys(ROLE_OPTIONS).map((roleKey) => (
                <button
                  key={roleKey}
                  type="button"
                  onClick={() => {
                    setSelectedRole(roleKey);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    selectedRole === roleKey
                      ? "bg-teal-50 text-teal-700 font-bold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {roleKey}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Progress Match Bar */}
      <div className="mt-4 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">Your Match</span>
          <span className="font-bold text-teal-700">{currentData.matchScore}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-teal-500 h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${currentData.matchScore}%` }}
          />
        </div>
      </div>

      {/* Missing Skills */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-800 mr-1">
          Top Missing Skills
        </span>
        {currentData.missingSkills.map((skill) => (
          <span
            key={skill}
            className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-100"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
