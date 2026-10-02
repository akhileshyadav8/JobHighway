"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Play,
  Send,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Code2,
  FileCode,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Terminal,
  Layers,
  Award
} from "lucide-react";
import {
  ALL_CODING_PROBLEMS,
  CodingProblem,
  CodingSubmissionRecord
} from "@/lib/codingProblemsData";
import {
  CodeExecutionReport,
  TestCaseResult
} from "@/lib/codingRunner";
import { getCurrentUser, User } from "@/lib/auth";

interface CodingEnvironmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProblemId?: string;
  selectedRoleId?: string;
  onProblemSolved?: (problemId: string) => void;
}

type Language = "python" | "c" | "cpp" | "java";

const LANGUAGE_LABELS: Record<Language, string> = {
  python: "Python",
  c: "C",
  cpp: "C++",
  java: "Java"
};

const LANGUAGE_EXTENSIONS: Record<Language, string> = {
  python: "py",
  c: "c",
  cpp: "cpp",
  java: "java"
};

export function CodingEnvironmentModal({
  isOpen,
  onClose,
  initialProblemId,
  selectedRoleId,
  onProblemSolved
}: CodingEnvironmentModalProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Problems relevant to the selected role first, then fallback to all
  const filteredProblems = React.useMemo(() => {
    if (!selectedRoleId) return ALL_CODING_PROBLEMS;
    const roleMatched = ALL_CODING_PROBLEMS.filter(p => p.roleIds.includes(selectedRoleId));
    return roleMatched.length > 0 ? roleMatched : ALL_CODING_PROBLEMS;
  }, [selectedRoleId]);

  const [activeProblem, setActiveProblem] = useState<CodingProblem>(() => {
    if (initialProblemId) {
      const found = ALL_CODING_PROBLEMS.find(p => p.id === initialProblemId);
      if (found) return found;
    }
    return filteredProblems[0] || ALL_CODING_PROBLEMS[0];
  });

  const [language, setLanguage] = useState<Language>("python");
  const [code, setCode] = useState<string>(activeProblem.starterCode.python);
  const [isRunning, setIsRunning] = useState(false);
  const [executionReport, setExecutionReport] = useState<CodeExecutionReport | null>(null);
  const [activeTab, setActiveTab] = useState<"description" | "submissions">("description");
  const [activeConsoleTab, setActiveConsoleTab] = useState<"testcases" | "results">("testcases");
  const [selectedTestCaseIdx, setSelectedTestCaseIdx] = useState<number>(0);
  const [submissions, setSubmissions] = useState<CodingSubmissionRecord[]>([]);

  // Load user & submissions
  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    loadSubmissions(user?.id);
  }, []);

  // Update starter code when problem or language changes
  useEffect(() => {
    setCode(activeProblem.starterCode[language]);
    setExecutionReport(null);
    setSelectedTestCaseIdx(0);
  }, [activeProblem, language]);

  // When initialProblemId prop changes
  useEffect(() => {
    if (initialProblemId) {
      const found = ALL_CODING_PROBLEMS.find(p => p.id === initialProblemId);
      if (found) setActiveProblem(found);
    }
  }, [initialProblemId]);

  const loadSubmissions = (userId?: string) => {
    try {
      const key = userId 
        ? `jobhighway_coding_submissions_user_${userId}` 
        : "jobhighway_coding_submissions_guest";
      const raw = localStorage.getItem(key);
      if (raw) {
        setSubmissions(JSON.parse(raw));
      }
    } catch {
      // ignore
    }
  };

  const saveSubmission = (record: CodingSubmissionRecord) => {
    try {
      const key = currentUser?.id 
        ? `jobhighway_coding_submissions_user_${currentUser.id}` 
        : "jobhighway_coding_submissions_guest";
      const updated = [record, ...submissions.slice(0, 49)];
      setSubmissions(updated);
      localStorage.setItem(key, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  if (!isOpen) return null;

  /** Call backend Piston-based execution API */
  const callExecuteAPI = async (runPublicOnly: boolean): Promise<CodeExecutionReport> => {
    const res = await fetch("/api/prepare/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language,
        code,
        problemId: activeProblem.id,
        runPublicOnly
      })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return {
        status: "Runtime Error",
        passedTestCases: 0,
        totalTestCases: activeProblem.testCases.filter(t => runPublicOnly ? !t.isHidden : true).length,
        totalRuntimeMs: 0,
        errorMessage: errData.error || "Code execution service unavailable. Ensure your solution is correct before submitting.",
        results: []
      };
    }

    return res.json();
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setActiveConsoleTab("results");

    try {
      const report = await callExecuteAPI(true);
      setExecutionReport(report);
    } catch {
      setExecutionReport({
        status: "Runtime Error",
        passedTestCases: 0,
        totalTestCases: activeProblem.testCases.filter(t => !t.isHidden).length,
        totalRuntimeMs: 0,
        errorMessage: "Network error: Could not reach execution service. Check your connection.",
        results: []
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitSolution = async () => {
    setIsRunning(true);
    setActiveConsoleTab("results");

    try {
      const report = await callExecuteAPI(false);
      setExecutionReport(report);

      // Save submission record
      const record: CodingSubmissionRecord = {
        id: `sub_${Date.now()}`,
        problemId: activeProblem.id,
        problemTitle: activeProblem.title,
        language,
        code,
        status: report.status,
        passedTestCases: report.passedTestCases,
        totalTestCases: report.totalTestCases,
        runtimeMs: report.totalRuntimeMs,
        submittedAt: new Date().toISOString()
      };
      saveSubmission(record);

      if (report.status === "Accepted" && onProblemSolved) {
        onProblemSolved(activeProblem.id);
      }
    } catch {
      setExecutionReport({
        status: "Runtime Error",
        passedTestCases: 0,
        totalTestCases: activeProblem.testCases.length,
        totalRuntimeMs: 0,
        errorMessage: "Network error: Could not reach execution service. Check your connection.",
        results: []
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleResetCode = () => {
    if (confirm("Reset code back to the initial template?")) {
      setCode(activeProblem.starterCode[language]);
      setExecutionReport(null);
    }
  };

  // Support Tab key indentation inside textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newValue = code.substring(0, start) + "  " + code.substring(end);
      setCode(newValue);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  const publicTestCases = activeProblem.testCases.filter(t => !t.isHidden);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-[1400px] h-[94vh] bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Top Navbar */}
        <div className="px-4 py-3 bg-white border-b border-slate-200 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-600 flex items-center justify-center font-bold">
              <Code2 className="w-5 h-5" />
            </div>
            
            {/* Problem Switcher Dropdown */}
            <div className="relative group">
              <select
                value={activeProblem.id}
                onChange={(e) => {
                  const p = ALL_CODING_PROBLEMS.find(x => x.id === e.target.value);
                  if (p) setActiveProblem(p);
                }}
                className="bg-slate-100 border border-slate-300 text-slate-800 font-bold text-sm rounded-lg px-3 py-1.5 pr-8 appearance-none focus:outline-none focus:border-teal-500 cursor-pointer"
              >
                {ALL_CODING_PROBLEMS.map(prob => (
                  <option key={prob.id} value={prob.id}>
                    {prob.title} ({prob.difficulty})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
              activeProblem.difficulty === "Easy" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
              activeProblem.difficulty === "Medium" ? "bg-amber-50 text-amber-700 border-amber-200" :
              "bg-rose-50 text-rose-700 border-rose-200"
            }`}>
              {activeProblem.difficulty}
            </span>

            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500">
              <span>Tags:</span>
              {activeProblem.topics.map(t => (
                <span key={t} className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs font-semibold">
              {(["python", "c", "cpp", "java"] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    language === lang ? "bg-teal-600 text-white" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {LANGUAGE_LABELS[lang]}
                </button>
              ))}
            </div>

            {/* Run & Submit Buttons */}
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-300 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current text-emerald-500" />
              <span>Run Code</span>
            </button>

            <button
              onClick={handleSubmitSolution}
              disabled={isRunning}
              className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Solution</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors ml-1 cursor-pointer"
              title="Close Coding Workspace"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content Area: Split 2 Columns */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* Left Column: Problem Description & Submissions Tabs */}
          <div className="lg:col-span-5 border-r border-slate-200 flex flex-col overflow-hidden bg-white">
            {/* Tab Header */}
            <div className="flex items-center border-b border-slate-200 px-4 shrink-0 bg-white">
              <button
                onClick={() => setActiveTab("description")}
                className={`py-2.5 px-3 font-semibold text-xs border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
                  activeTab === "description"
                    ? "border-teal-500 text-teal-600"
                    : "border-transparent text-slate-400 hover:text-slate-700"
                }`}
              >
                <FileCode className="w-4 h-4" />
                <span>Description</span>
              </button>
              <button
                onClick={() => setActiveTab("submissions")}
                className={`py-2.5 px-3 font-semibold text-xs border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
                  activeTab === "submissions"
                    ? "border-teal-500 text-teal-600"
                    : "border-transparent text-slate-400 hover:text-slate-700"
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Submissions ({submissions.filter(s => s.problemId === activeProblem.id).length})</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="flex-1 overflow-y-auto p-5 text-sm space-y-5 leading-relaxed text-slate-700">
              {activeTab === "description" ? (
                <>
                  <div>
                    <h2 className="text-xl font-black text-slate-800 mb-2">
                      {activeProblem.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 mb-4 text-xs text-slate-500">
                      <span>Frequently asked at:</span>
                      {activeProblem.companyTags.map(c => (
                        <span key={c} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Description Markdown-style */}
                  <div className="prose max-w-none text-slate-700 whitespace-pre-line text-xs sm:text-sm">
                    {activeProblem.description}
                  </div>

                  {/* Examples */}
                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                      Examples:
                    </span>
                    {activeProblem.examples.map((ex, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono space-y-1">
                        <div><strong className="text-slate-500">Input:</strong> {ex.input}</div>
                        <div><strong className="text-teal-600">Output:</strong> {ex.output}</div>
                        {ex.explanation && (
                          <div className="text-slate-500 font-sans text-[11px] pt-1 border-t border-slate-200">
                            <strong>Explanation:</strong> {ex.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Constraints */}
                  <div className="pt-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                      Constraints:
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-500 font-mono">
                      {activeProblem.constraints.map((c, idx) => (
                        <li key={idx}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                /* Submissions History */
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Your Past Attempts for this Problem:
                  </span>
                  {submissions.filter(s => s.problemId === activeProblem.id).length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-xs">
                      No submissions recorded yet for this challenge. Click <strong>Submit Solution</strong> when you&apos;re ready!
                    </div>
                  ) : (
                    submissions
                      .filter(s => s.problemId === activeProblem.id)
                      .map((sub) => (
                        <div key={sub.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`font-bold ${
                                sub.status === "Accepted" ? "text-emerald-600" : "text-rose-600"
                              }`}>
                                {sub.status}
                              </span>
                              <span className="text-slate-500 font-mono text-[11px]">
                                {sub.passedTestCases}/{sub.totalTestCases} Passed
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {new Date(sub.submittedAt).toLocaleString()} · {sub.language}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-slate-500 font-mono">{sub.runtimeMs}ms</span>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Code Editor & Execution Results Console */}
          <div className="lg:col-span-7 flex flex-col overflow-hidden bg-slate-50">
            
            {/* Editor Action Bar */}
            <div className="px-4 py-2 bg-white border-b border-slate-200 flex items-center justify-between text-xs shrink-0">
              <div className="flex items-center gap-2 text-slate-500 font-mono">
                <Terminal className="w-3.5 h-3.5 text-teal-600" />
                <span>solution.{LANGUAGE_EXTENSIONS[language]}</span>
              </div>
              <button
                onClick={handleResetCode}
                className="text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
                title="Reset code template"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* Code Textarea Editor */}
            <div className="flex-1 relative overflow-hidden bg-white">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                className="w-full h-full p-4 font-mono text-xs sm:text-sm bg-white text-slate-900 resize-none outline-none leading-relaxed border-0 selection:bg-teal-500/30"
                placeholder="// Write your code here..."
              />
            </div>

            {/* Bottom Panel: Test Cases & Execution Results */}
            <div className="h-60 border-t border-slate-200 bg-slate-50 flex flex-col shrink-0">
              
              {/* Console Tabs */}
              <div className="flex items-center justify-between border-b border-slate-200 px-4 bg-white shrink-0">
                <div className="flex items-center">
                  <button
                    onClick={() => setActiveConsoleTab("testcases")}
                    className={`py-2 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                      activeConsoleTab === "testcases"
                        ? "border-teal-500 text-teal-600"
                        : "border-transparent text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    Test Cases ({publicTestCases.length})
                  </button>
                  <button
                    onClick={() => setActiveConsoleTab("results")}
                    className={`py-2 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                      activeConsoleTab === "results"
                        ? "border-teal-500 text-teal-600"
                        : "border-transparent text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    <span>Test Results</span>
                    {executionReport && (
                      <span className={`w-2 h-2 rounded-full ${
                        executionReport.status === "Accepted" ? "bg-emerald-500" : "bg-rose-500"
                      }`} />
                    )}
                  </button>
                </div>

                {executionReport && (
                  <div className="text-[11px] font-mono text-slate-500 flex items-center gap-3">
                    <span>Runtime: <strong className="text-slate-700">{executionReport.totalRuntimeMs}ms</strong></span>
                    <span>Passed: <strong className={executionReport.status === "Accepted" ? "text-emerald-600" : "text-rose-600"}>
                      {executionReport.passedTestCases}/{executionReport.totalTestCases}
                    </strong></span>
                  </div>
                )}
              </div>

              {/* Console Body */}
              <div className="flex-1 overflow-y-auto p-4 text-xs font-mono">
                {activeConsoleTab === "testcases" ? (
                  <div>
                    {/* Test Case Buttons */}
                    <div className="flex items-center gap-2 mb-3">
                      {publicTestCases.map((tc, idx) => (
                        <button
                          key={tc.id}
                          onClick={() => setSelectedTestCaseIdx(idx)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                            selectedTestCaseIdx === idx
                              ? "bg-teal-50 text-teal-700 border border-teal-300"
                              : "bg-white text-slate-500 border border-slate-200 hover:text-slate-700"
                          }`}
                        >
                          Case {idx + 1}
                        </button>
                      ))}
                    </div>

                    {/* Selected Test Case Inputs & Expected */}
                    {publicTestCases[selectedTestCaseIdx] && (
                      <div className="space-y-2 bg-white p-3 rounded-xl border border-slate-200">
                        <div>
                          <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Input:</div>
                          <div className="text-slate-700 font-mono">
                            {JSON.stringify(publicTestCases[selectedTestCaseIdx].input)}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Expected Output:</div>
                          <div className="text-teal-600 font-mono">
                            {JSON.stringify(publicTestCases[selectedTestCaseIdx].expected)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Execution Results Tab */
                  <div>
                    {isRunning ? (
                      <div className="flex items-center gap-3 py-6 justify-center text-slate-500">
                        <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                        <span>Executing test suite...</span>
                      </div>
                    ) : executionReport ? (
                      <div className="space-y-3">
                        {/* Overall Banner */}
                        <div className={`p-3 rounded-xl border flex items-center justify-between ${
                          executionReport.status === "Accepted"
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                            : executionReport.status === "Runtime Error"
                            ? "bg-amber-50 border-amber-200 text-amber-700"
                            : "bg-rose-50 border-rose-200 text-rose-700"
                        }`}>
                          <div className="flex items-center gap-2">
                            {executionReport.status === "Accepted" ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            ) : executionReport.status === "Runtime Error" ? (
                              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                            )}
                            <span className="font-bold text-sm">{executionReport.status}</span>
                            <span className="text-xs opacity-80">
                              ({executionReport.passedTestCases} of {executionReport.totalTestCases} test cases passed)
                            </span>
                          </div>
                          <span className="text-xs font-mono">{executionReport.totalRuntimeMs} ms</span>
                        </div>

                        {/* Error Message if any */}
                        {executionReport.errorMessage && (
                          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-mono whitespace-pre-wrap">
                            {executionReport.errorMessage}
                          </div>
                        )}

                        {/* Detailed Case By Case Breakdown */}
                        <div className="space-y-2">
                          {executionReport.results.map((r, idx) => (
                            <div
                              key={idx}
                              className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                                r.passed 
                                  ? "bg-white border-slate-200 text-slate-700" 
                                  : "bg-rose-50 border-rose-200 text-rose-700"
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                  r.passed ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                                }`}>
                                  {r.passed ? "✓" : "✗"}
                                </span>
                                <span className="font-bold">
                                  Test Case {r.caseNumber} {r.isHidden ? "(Hidden)" : ""}
                                </span>
                                {!r.passed && (
                                  <span className="text-[11px] text-rose-600 font-mono truncate">
                                    Expected: {r.expectedStr} | Got: {r.actualStr}
                                  </span>
                                )}
                              </div>
                              <span className="text-slate-400 font-mono text-[11px] shrink-0">
                                {r.executionTimeMs}ms
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 text-slate-400 text-xs">
                        Click <strong>Run Code</strong> to test against sample cases, or <strong>Submit Solution</strong> to run the full test suite.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
