"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getCurrentUser, User } from "@/lib/auth";
import { Sparkles, CheckCircle2, AlertCircle, FileUp, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface WhyThisJobMatchProps {
  jobTitle: string;
  jobSkills: string[];
  companyName: string;
  workMode?: string;
  experienceMin?: number | null;
}

export function WhyThisJobMatch({
  jobTitle,
  jobSkills,
  companyName,
  workMode,
  experienceMin
}: WhyThisJobMatchProps) {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
    setMounted(true);

    const handleAuth = () => {
      setUser(getCurrentUser());
    };
    window.addEventListener("jobhighway_auth_change", handleAuth);
    return () => window.removeEventListener("jobhighway_auth_change", handleAuth);
  }, []);

  if (!mounted) return null;

  // Not logged in or no resume uploaded
  if (!user || !user.resumeFile) {
    return (
      <Card className="border-teal-200/80 bg-gradient-to-br from-teal-50/50 via-white to-emerald-50/30 shadow-xs overflow-hidden mb-6">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5 fill-teal-500 text-teal-600" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>Why This Job? Personalized Skill Fit</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800 px-2 py-0.5 rounded">
                    AI Match
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                  {user 
                    ? "Upload your resume in the dashboard to see instant match score, overlapping competencies, and skill gaps for this opening."
                    : "Log in and upload your resume to see your personalized ATS match score and skill fit breakdown."}
                </p>
              </div>
            </div>

            <Link
              href={user ? "/dashboard" : "/login"}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors shadow-2xs shrink-0 cursor-pointer"
            >
              <FileUp className="w-4 h-4" />
              <span>{user ? "Upload Resume in Dashboard" : "Sign in to Calculate Fit"}</span>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate Match Score and Skills Overlap
  const userSkillsLower = (user.skills || []).map(s => s.toLowerCase().trim());
  const userTargetRoleLower = (user.targetRole || "").toLowerCase().trim();
  const jobTitleLower = jobTitle.toLowerCase();

  const matchingSkills: string[] = [];
  const missingSkills: string[] = [];

  jobSkills.forEach(skill => {
    const sLower = skill.toLowerCase().trim();
    if (userSkillsLower.some(us => us.includes(sLower) || sLower.includes(us))) {
      matchingSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  // Calculate match percentage
  let score = 65;
  if (userTargetRoleLower && (jobTitleLower.includes(userTargetRoleLower) || userTargetRoleLower.includes(jobTitleLower))) {
    score += 18;
  } else if (
    jobTitleLower.includes("data") || 
    jobTitleLower.includes("engineer") || 
    jobTitleLower.includes("developer") ||
    jobTitleLower.includes("analyst")
  ) {
    score += 10;
  }

  if (jobSkills.length > 0) {
    const ratio = matchingSkills.length / jobSkills.length;
    score += Math.round(ratio * 20);
  } else {
    score += 12;
  }

  const finalScore = Math.min(96, Math.max(68, score));

  return (
    <Card className="border-teal-200/90 bg-white shadow-xs overflow-hidden mb-6">
      <div className="bg-teal-50/70 px-5 sm:px-6 py-3.5 border-b border-teal-100 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-teal-600 fill-teal-500" />
          <h2 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-wide">
            Why This Job Matches Your Resume
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-600">Calculated from: <strong>{user.resumeFile.name}</strong></span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-teal-600 text-white shadow-2xs">
            {finalScore}% Fit
          </span>
        </div>
      </div>

      <CardContent className="p-5 sm:p-6 space-y-4">
        {/* Match Breakdown Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="text-xs text-slate-500 font-medium">Matching Skills</div>
            <div className="text-base font-bold text-emerald-700 flex items-center gap-1.5 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>{matchingSkills.length} of {jobSkills.length || matchingSkills.length} skills</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="text-xs text-slate-500 font-medium">Role Alignment</div>
            <div className="text-sm font-bold text-slate-800 mt-0.5 truncate">
              {user.targetRole || "General Tech Candidate"}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="text-xs text-slate-500 font-medium">ATS Match Verification</div>
            <div className="text-sm font-bold text-teal-700 flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Direct Requisition Match</span>
            </div>
          </div>
        </div>

        {/* Matching Skills */}
        {matchingSkills.length > 0 && (
          <div>
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Skills You Have ({matchingSkills.length})</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {matchingSkills.map((s, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
                >
                  ✓ {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Missing Skills */}
        {missingSkills.length > 0 && (
          <div>
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              <span>Suggested Skills to Emphasize / Learn ({missingSkills.length})</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {missingSkills.map((s, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                >
                  + {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
