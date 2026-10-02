"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Layers,
  Code2,
  Database,
  Award,
  Users,
  Search,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  BarChart3,
  TrendingUp,
  ChevronRight,
  Filter,
  Check
} from "lucide-react";
import { ALL_PREPARATION_ROLES, PrepRole } from "@/lib/preparationData";
import { ALL_CODING_PROBLEMS, CodingProblem } from "@/lib/codingProblemsData";
import { ALL_SQL_PROBLEMS, SqlProblem } from "@/lib/sqlProblemsData";
import { ALL_QUIZZES, QuizTest, QuizAttemptRecord } from "@/lib/quizData";
import { getStoredUsers, User } from "@/lib/auth";

export default function AdminPreparePage() {
  const [activeTab, setActiveTab] = useState<"roles" | "coding" | "sql" | "quizzes" | "candidates">("roles");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<PrepRole>(ALL_PREPARATION_ROLES[0]);

  // Load candidate quiz history & registered users
  const [candidates, setCandidates] = useState<User[]>([]);
  const [allAttempts, setAllAttempts] = useState<QuizAttemptRecord[]>([]);

  useEffect(() => {
    try {
      const users = getStoredUsers();
      setCandidates(users);

      // Collect all quiz attempts across candidate keys in localStorage
      const attemptsList: QuizAttemptRecord[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("jobhighway_quiz_history_")) {
          const raw = localStorage.getItem(key);
          if (raw) {
            try {
              const list = JSON.parse(raw);
              if (Array.isArray(list)) {
                attemptsList.push(...list);
              }
            } catch {}
          }
        }
      }
      setAllAttempts(attemptsList);
    } catch {}
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-teal-600 font-bold text-xs uppercase tracking-wider mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>Content &amp; Candidate Management</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Career Preparation Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage role-specific roadmaps, coding question bank, SQL schemas, mock quizzes, and candidate performance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/prepare"
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
          >
            <span>Open Candidate View</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Supported Roles</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{ALL_PREPARATION_ROLES.length}</div>
          <div className="text-[11px] text-teal-600 font-semibold mt-1">100% Role-Specific</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Coding Challenges</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{ALL_CODING_PROBLEMS.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">Python, C, C++, Java</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">SQL Sandbox Problems</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{ALL_SQL_PROBLEMS.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">Multi-Dialect Sandbox</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Mock Test Quizzes</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{ALL_QUIZZES.length}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">100+ Question Pools</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto text-xs font-semibold">
        {[
          { id: "roles", label: `Job Roles & Roadmaps (${ALL_PREPARATION_ROLES.length})`, icon: Layers },
          { id: "coding", label: `Coding Bank (${ALL_CODING_PROBLEMS.length})`, icon: Code2 },
          { id: "sql", label: `SQL Bank (${ALL_SQL_PROBLEMS.length})`, icon: Database },
          { id: "quizzes", label: `Mock Tests (${ALL_QUIZZES.length})`, icon: Award },
          { id: "candidates", label: `Candidate Activity (${allAttempts.length} attempts)`, icon: Users }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-colors cursor-pointer shrink-0 ${
                isActive
                  ? "bg-teal-600 text-white font-bold shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ROLES & ROADMAPS */}
      {activeTab === "roles" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Roles List */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-2 mb-2">Available Roles</h3>
            {ALL_PREPARATION_ROLES.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRole(r)}
                className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedRole.id === r.id
                    ? "bg-teal-50/50 border-teal-500 ring-1 ring-teal-500/20 shadow-2xs"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div>
                  <div className="font-bold text-xs text-slate-900">{r.name}</div>
                  <div className="text-[10px] text-slate-500">{r.overview.estimatedWeeks} · {r.roadmap.length} Steps</div>
                </div>
                <ChevronRight className={`w-4 h-4 ${selectedRole.id === r.id ? "text-teal-600" : "text-slate-300"}`} />
              </button>
            ))}
          </div>

          {/* Selected Role Detail */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                  {selectedRole.category}
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-1">{selectedRole.name}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{selectedRole.tagline}</p>
              </div>
              <div className="text-right text-xs">
                <div className="text-slate-400">Fresher / Senior CTC</div>
                <div className="font-bold text-slate-800">{selectedRole.overview.avgFresherSalary}</div>
              </div>
            </div>

            {/* Roadmap Steps */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">Roadmap Curriculum ({selectedRole.roadmap.length} Steps)</h4>
              <div className="space-y-2">
                {selectedRole.roadmap.map((s) => (
                  <div key={s.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                      <span>Step {s.stepNumber}: {s.title}</span>
                      <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {s.difficulty}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] mb-2">{s.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {s.subtopics.map((sub, sIdx) => (
                        <span key={sIdx} className="text-[10px] px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ATS Keywords */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">ATS Keywords ({selectedRole.resumeGuidance.atsKeywords.length})</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedRole.resumeGuidance.atsKeywords.map((kw, idx) => (
                  <span key={idx} className="px-2 py-1 bg-slate-100 rounded text-xs font-semibold text-slate-700">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CODING BANK */}
      {activeTab === "coding" && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Coding Question Bank</h3>
            <span className="text-xs text-slate-500 font-mono">{ALL_CODING_PROBLEMS.length} problems loaded</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Difficulty</th>
                  <th className="px-4 py-3">Topics</th>
                  <th className="px-4 py-3">Company Tags</th>
                  <th className="px-4 py-3">Test Cases</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ALL_CODING_PROBLEMS.map((prob) => (
                  <tr key={prob.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-900">{prob.title}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        prob.difficulty === "Easy"
                          ? "bg-emerald-50 text-emerald-700"
                          : prob.difficulty === "Medium"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-rose-50 text-rose-700"
                      }`}>
                        {prob.difficulty}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{prob.topics.join(", ")}</td>
                    <td className="px-4 py-3 text-slate-500">{prob.companyTags.join(", ")}</td>
                    <td className="px-4 py-3 font-mono text-slate-700">{prob.testCases.length} (hidden: {prob.testCases.filter(t => t.isHidden).length})</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SQL BANK */}
      {activeTab === "sql" && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">SQL Practice Question Bank</h3>
            <span className="text-xs text-slate-500 font-mono">{ALL_SQL_PROBLEMS.length} schemas loaded</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Difficulty</th>
                  <th className="px-4 py-3">Tables</th>
                  <th className="px-4 py-3">Companies</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ALL_SQL_PROBLEMS.map((sql) => (
                  <tr key={sql.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-900">{sql.title}</td>
                    <td className="px-4 py-3 text-teal-700 font-semibold">{sql.category}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        sql.difficulty === "Easy" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                      }`}>
                        {sql.difficulty}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-600">{sql.schemas.map(s => s.tableName).join(", ")}</td>
                    <td className="px-4 py-3 text-slate-500">{sql.companyTags.join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: QUIZZES */}
      {activeTab === "quizzes" && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Mock Test Assessment Pools</h3>
            <span className="text-xs text-slate-500 font-mono">{ALL_QUIZZES.length} assessment sets</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Questions In Pool</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3">Passing %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ALL_QUIZZES.map((quiz) => (
                  <tr key={quiz.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-900">{quiz.title}</td>
                    <td className="px-4 py-3 font-mono text-slate-600">{quiz.roleId}</td>
                    <td className="px-4 py-3 text-slate-500">{quiz.category}</td>
                    <td className="px-4 py-3 font-bold text-teal-700 font-mono">{quiz.questions.length}</td>
                    <td className="px-4 py-3 text-slate-600">{quiz.durationMinutes} min</td>
                    <td className="px-4 py-3 font-bold text-slate-800">{quiz.passingScorePercent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: CANDIDATE ACTIVITY */}
      {activeTab === "candidates" && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Recent Candidate Mock Test Attempts</h3>
                <p className="text-xs text-slate-500">Live score records, accuracy, time spent, and weak topic diagnostics.</p>
              </div>
              <span className="text-xs text-slate-500 font-mono">{allAttempts.length} total attempts</span>
            </div>

            {allAttempts.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No mock test attempts recorded yet. As candidates take mock tests, their scores, accuracy, and topic performance will appear here.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Quiz Title</th>
                      <th className="px-4 py-3">Score</th>
                      <th className="px-4 py-3">Accuracy</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Time Spent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {allAttempts.map((att) => (
                      <tr key={att.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-slate-500">{new Date(att.completedAt).toLocaleString()}</td>
                        <td className="px-4 py-3 font-bold text-slate-900 font-sans">{att.quizTitle}</td>
                        <td className="px-4 py-3 font-bold">{att.score} / {att.totalQuestions}</td>
                        <td className="px-4 py-3">{att.percentage}%</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            att.passed ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                          }`}>
                            {att.passed ? "PASSED" : "FAILED"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500">{Math.round(att.timeSpentSeconds / 60)} min {att.timeSpentSeconds % 60}s</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
