"use client";

import React, { useState } from "react";
import { BarChart3, ArrowRight, Target, ChevronDown } from "lucide-react";

export interface SkillGapSectionProps {
  targetRole: string;
  userSkills: string[];
  onTargetRoleChange?: (newRole: string) => void;
  onViewDetailedAnalysis?: () => void;
}

const COMMON_ROLE_SKILLS: Record<string, string[]> = {
  "Data Scientist": ["Python", "SQL", "Machine Learning", "Statistics", "Pandas", "AWS", "Spark", "Docker", "MLOps"],
  "ML Engineer": ["Python", "Deep Learning", "PyTorch", "Kubernetes", "AWS", "Docker", "MLOps", "CI/CD"],
  "Data Analyst": ["SQL", "Power BI", "Excel", "Data Visualization", "Tableau", "Python", "Business Intelligence"],
  "Full Stack Engineer": ["React", "TypeScript", "Node.js", "PostgreSQL", "Next.js", "Docker", "Tailwind CSS", "Redis"],
  "Frontend Developer": ["React", "TypeScript", "JavaScript", "HTML/CSS", "Next.js", "Tailwind CSS", "REST APIs"],
  "Backend Engineer": ["Python", "PostgreSQL", "Node.js", "Docker", "Distributed Systems", "Redis", "Kafka", "AWS"]
};

export function SkillGapSection({
  targetRole = "Data Scientist",
  userSkills = [],
  onTargetRoleChange,
  onViewDetailedAnalysis
}: SkillGapSectionProps) {
  const [selectedRole, setSelectedRole] = useState(targetRole || "Data Scientist");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Dynamic calculation based on real user skills
  const roleRequiredSkills = COMMON_ROLE_SKILLS[selectedRole] || COMMON_ROLE_SKILLS["Data Scientist"];
  const userSkillsLower = userSkills.map((s) => s.toLowerCase().trim());

  const matchedSkills = roleRequiredSkills.filter((s) =>
    userSkillsLower.includes(s.toLowerCase().trim())
  );

  const missingSkills = roleRequiredSkills.filter(
    (s) => !userSkillsLower.includes(s.toLowerCase().trim())
  );

  const matchScore = roleRequiredSkills.length > 0
    ? Math.min(100, Math.round((matchedSkills.length / roleRequiredSkills.length) * 100))
    : 0;

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 lg:p-7 shadow-xs flex flex-col justify-between">
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
            {selectedRole}
          </span>
        </div>

        {/* Target Role Dropdown Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="py-1 px-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Change Role</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-8 z-30 w-48 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
              {Object.keys(COMMON_ROLE_SKILLS).map((roleKey) => (
                <button
                  key={roleKey}
                  type="button"
                  onClick={() => {
                    setSelectedRole(roleKey);
                    onTargetRoleChange?.(roleKey);
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
          <span className="font-bold text-teal-700">{matchScore}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-teal-500 h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${matchScore}%` }}
          />
        </div>
      </div>

      {/* Missing Skills */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-800 mr-1">
          Top Missing Skills
        </span>
        {missingSkills.length === 0 ? (
          <span className="text-xs font-medium text-emerald-600">
            All core skills acquired! 🎉
          </span>
        ) : (
          missingSkills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-100"
            >
              {skill}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
