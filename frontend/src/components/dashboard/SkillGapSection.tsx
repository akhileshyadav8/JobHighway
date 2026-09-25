"use client";

import React, { useState, useEffect } from "react";
import { BarChart3, ArrowRight, Target, Search, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

export interface SkillGapSectionProps {
  targetRole: string;
  userSkills: string[];
  onTargetRoleChange?: (newRole: string) => void;
  onViewDetailedAnalysis?: () => void;
}

// Comprehensive industry standard skills matrix across major domains
const COMMON_ROLE_SKILLS: Record<string, string[]> = {
  // Data Science, AI & ML
  "Data Scientist": ["Python", "SQL", "Machine Learning", "Statistics", "Pandas", "AWS", "Spark", "Docker", "MLOps"],
  "Machine Learning Engineer": ["Python", "Deep Learning", "PyTorch", "Kubernetes", "AWS", "Docker", "MLOps", "CI/CD"],
  "ML Engineer": ["Python", "Deep Learning", "PyTorch", "Kubernetes", "AWS", "Docker", "MLOps", "CI/CD"],
  "AI Engineer": ["Python", "PyTorch", "LLMs", "LangChain", "Generative AI", "Transformers", "Docker", "FastAPI"],
  "Data Analyst": ["SQL", "Power BI", "Excel", "Data Visualization", "Tableau", "Python", "Business Intelligence"],
  "Data Engineer": ["Python", "SQL", "Apache Spark", "Airflow", "Kafka", "PostgreSQL", "AWS", "Snowflake", "Docker"],
  "BI Developer": ["SQL", "Power BI", "Tableau", "Data Warehousing", "ETL", "Excel", "Data Modeling"],

  // Software & Web Engineering
  "Full Stack Engineer": ["React", "TypeScript", "Node.js", "PostgreSQL", "Next.js", "Docker", "Tailwind CSS", "Redis"],
  "Frontend Developer": ["React", "TypeScript", "JavaScript", "HTML", "CSS", "Next.js", "Tailwind CSS", "REST APIs"],
  "Backend Engineer": ["Python", "PostgreSQL", "Node.js", "Docker", "System Design", "Redis", "Kafka", "AWS", "REST APIs"],
  "Software Engineer": ["Python", "Java", "Data Structures", "System Design", "Git", "SQL", "Docker", "REST APIs"],
  "Mobile Developer": ["React Native", "TypeScript", "Mobile Architecture", "REST APIs", "Git", "Swift", "Kotlin"],
  "iOS Developer": ["Swift", "iOS SDK", "Xcode", "UIKit", "SwiftUI", "REST APIs", "Git", "System Design"],
  "Android Developer": ["Kotlin", "Android SDK", "Java", "Jetpack Compose", "REST APIs", "Git", "Coroutines"],

  // Cloud, DevOps & Security
  "DevOps Engineer": ["Docker", "Kubernetes", "AWS", "CI/CD", "Terraform", "Linux", "Git", "GitHub Actions"],
  "Cloud Architect": ["AWS", "Azure", "GCP", "Kubernetes", "Terraform", "System Design", "Microservices", "Security"],
  "Cloud Engineer": ["AWS", "Docker", "Linux", "Terraform", "Python", "Kubernetes", "Networking"],
  "Site Reliability Engineer (SRE)": ["Kubernetes", "Docker", "Linux", "Go", "Python", "Prometheus", "CI/CD", "AWS"],
  "Cybersecurity Analyst": ["Network Security", "Linux", "SIEM", "Python", "Penetration Testing", "OWASP", "Firewalls"],

  // Product & Management
  "Product Manager": ["Product Strategy", "User Research", "Agile", "Roadmap Planning", "Data Analytics", "Jira", "SQL"],
  "QA Automation Engineer": ["Selenium", "Cypress", "Python", "Test Automation", "CI/CD", "Git", "Jira", "Postman"]
};

// Popular quick selection pills
const POPULAR_SUGGESTIONS = [
  "Data Scientist",
  "ML Engineer",
  "Full Stack Engineer",
  "Data Analyst",
  "DevOps Engineer",
  "Backend Engineer"
];

/**
 * Resolves required industry skills for ANY custom role.
 * Uses exact match, partial dictionary match, or intelligent keyword tokenization.
 */
function resolveSkillsForRole(roleName: string): string[] {
  const trimmed = roleName.trim();
  if (!trimmed) return COMMON_ROLE_SKILLS["Data Scientist"];

  // 1. Direct dictionary match
  if (COMMON_ROLE_SKILLS[trimmed]) {
    return COMMON_ROLE_SKILLS[trimmed];
  }

  // 2. Case-insensitive dictionary match
  const lower = trimmed.toLowerCase();
  for (const [key, skills] of Object.entries(COMMON_ROLE_SKILLS)) {
    if (key.toLowerCase() === lower || lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return skills;
    }
  }

  // 3. Dynamic keyword-based domain mapping for custom roles
  const skillsSet = new Set<string>();

  if (lower.includes("ai") || lower.includes("ml") || lower.includes("learning") || lower.includes("intelligence")) {
    ["Python", "PyTorch", "Machine Learning", "Deep Learning", "LLMs", "MLOps", "Docker"].forEach(s => skillsSet.add(s));
  }
  if (lower.includes("data") && (lower.includes("analyst") || lower.includes("bi") || lower.includes("business"))) {
    ["SQL", "Power BI", "Excel", "Tableau", "Python", "Data Visualization", "Business Intelligence"].forEach(s => skillsSet.add(s));
  }
  if (lower.includes("data") && (lower.includes("eng") || lower.includes("pipeline") || lower.includes("warehouse"))) {
    ["Python", "SQL", "Apache Spark", "Airflow", "Kafka", "PostgreSQL", "AWS"].forEach(s => skillsSet.add(s));
  }
  if (lower.includes("cloud") || lower.includes("devops") || lower.includes("infra") || lower.includes("platform") || lower.includes("sre")) {
    ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD", "Linux", "Git"].forEach(s => skillsSet.add(s));
  }
  if (lower.includes("security") || lower.includes("cyber")) {
    ["Network Security", "Linux", "SIEM", "Python", "Penetration Testing", "OWASP"].forEach(s => skillsSet.add(s));
  }
  if (lower.includes("front") || lower.includes("ui") || lower.includes("react") || lower.includes("web")) {
    ["React", "TypeScript", "JavaScript", "Next.js", "Tailwind CSS", "HTML", "CSS", "REST APIs"].forEach(s => skillsSet.add(s));
  }
  if (lower.includes("back") || lower.includes("api") || lower.includes("microservice")) {
    ["Python", "Node.js", "PostgreSQL", "Docker", "System Design", "Redis", "REST APIs"].forEach(s => skillsSet.add(s));
  }
  if (lower.includes("mobile") || lower.includes("ios") || lower.includes("android") || lower.includes("flutter")) {
    ["React Native", "Swift", "Kotlin", "Mobile Architecture", "REST APIs", "Git"].forEach(s => skillsSet.add(s));
  }
  if (lower.includes("product") || lower.includes("manager") || lower.includes("program")) {
    ["Product Strategy", "User Research", "Agile", "Roadmap Planning", "Data Analytics", "Jira"].forEach(s => skillsSet.add(s));
  }
  if (lower.includes("qa") || lower.includes("test")) {
    ["Selenium", "Cypress", "Python", "Test Automation", "CI/CD", "Jira", "Postman"].forEach(s => skillsSet.add(s));
  }

  // If matched domain keywords
  if (skillsSet.size >= 4) {
    return Array.from(skillsSet);
  }

  // General engineering baseline for arbitrary roles
  return ["Python", "SQL", "Git", "System Design", "Cloud Basics", "Problem Solving", "REST APIs", "Docker"];
}

export function SkillGapSection({
  targetRole = "Data Scientist",
  userSkills = [],
  onTargetRoleChange,
  onViewDetailedAnalysis
}: SkillGapSectionProps) {
  const [selectedRole, setSelectedRole] = useState(targetRole || "Data Scientist");
  const [inputRole, setInputRole] = useState(targetRole || "Data Scientist");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (targetRole) {
      setSelectedRole(targetRole);
      setInputRole(targetRole);
    }
  }, [targetRole]);

  const handleApplyRole = (roleToApply: string) => {
    const trimmed = roleToApply.trim();
    if (!trimmed) return;
    setSelectedRole(trimmed);
    setInputRole(trimmed);
    setIsEditing(false);
    onTargetRoleChange?.(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleApplyRole(inputRole);
    }
  };

  // Dynamic skills derived from dictionary or smart keyword mapper
  const roleRequiredSkills = resolveSkillsForRole(selectedRole);
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
    <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-4.5 lg:p-5 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Skill Gap Analysis
              </h2>
              <p className="text-[11px] text-slate-500">
                Analyze your profile readiness for any role
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onViewDetailedAnalysis}
            className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 group transition-colors cursor-pointer shrink-0"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Interactive Custom Role Input Field */}
        <div className="mt-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-teal-600" />
              Target Job Role:
            </span>
            <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200/60 truncate max-w-[180px]">
              {selectedRole}
            </span>
          </div>

          {/* Text Box for Custom Role */}
          <div className="flex items-center gap-1.5">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inputRole}
                onChange={(e) => {
                  setInputRole(e.target.value);
                  setIsEditing(true);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Type any role (e.g. Cloud Architect, AI Specialist)..."
                className="w-full pl-8 pr-3 py-1.5 text-xs font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-all placeholder:text-slate-400"
              />
            </div>
            <button
              type="button"
              onClick={() => handleApplyRole(inputRole)}
              className="px-3 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors cursor-pointer shrink-0 shadow-2xs"
            >
              Analyze
            </button>
          </div>

          {/* Quick Popular Suggestions */}
          <div className="flex flex-wrap items-center gap-1 pt-0.5">
            <span className="text-[10px] text-slate-400 font-semibold mr-0.5">Suggestions:</span>
            {POPULAR_SUGGESTIONS.map((sug) => (
              <button
                key={sug}
                type="button"
                onClick={() => handleApplyRole(sug)}
                className={`text-[10px] px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                  selectedRole.toLowerCase() === sug.toLowerCase()
                    ? "bg-teal-600 text-white border-teal-600 font-bold"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200 font-medium"
                }`}
              >
                {sug}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Match Bar */}
        <div className="mt-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Readiness Match
            </span>
            <span className="font-extrabold text-teal-700 text-sm">
              {matchScore}%
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-teal-500 h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${matchScore}%` }}
            />
          </div>
        </div>

        {/* Matched Skills Chips */}
        {matchedSkills.length > 0 && (
          <div className="mt-3.5 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 mb-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Acquired Skills ({matchedSkills.length})</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {matchedSkills.map((skill) => (
                <span
                  key={skill}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Missing Skills Chips */}
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1 text-[11px] font-bold text-rose-700 mb-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
            <span>Missing Skills to Learn ({missingSkills.length})</span>
          </div>

          {missingSkills.length === 0 ? (
            <p className="text-xs font-semibold text-emerald-600">
              Outstanding! You meet all core requirements for {selectedRole}. 🎉
            </p>
          ) : (
            <div className="flex flex-wrap gap-1">
              {missingSkills.map((skill) => (
                <span
                  key={skill}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200/70"
                >
                  +{skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
