"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Play,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Database,
  Table,
  Layers,
  Sparkles,
  ChevronDown,
  Terminal,
  RotateCcw,
  Check,
  Send
} from "lucide-react";
import { ALL_SQL_PROBLEMS, SqlProblem } from "@/lib/sqlProblemsData";

interface SqlEnvironmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProblemId?: string;
  onProblemSolved?: (problemId: string) => void;
}

export function SqlEnvironmentModal({
  isOpen,
  onClose,
  initialProblemId,
  onProblemSolved
}: SqlEnvironmentModalProps) {
  const [activeProblem, setActiveProblem] = useState<SqlProblem>(() => {
    if (initialProblemId) {
      const found = ALL_SQL_PROBLEMS.find((p) => p.id === initialProblemId);
      if (found) return found;
    }
    return ALL_SQL_PROBLEMS[0];
  });

  const [dialect, setDialect] = useState<"mysql" | "postgresql" | "sqlserver">("mysql");
  const [query, setQuery] = useState<string>(activeProblem.starterCode.mysql);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "schema" | "expected">("description");
  const [activeConsoleTab, setActiveConsoleTab] = useState<"output" | "expected">("output");

  const [result, setResult] = useState<{
    status?: string;
    columns?: string[];
    rows?: any[][];
    expectedColumns?: string[];
    expectedRows?: any[][];
    errorMessage?: string;
    executionTimeMs?: number;
  } | null>(null);

  useEffect(() => {
    setQuery(activeProblem.starterCode[dialect]);
    setResult(null);
  }, [activeProblem, dialect]);

  useEffect(() => {
    if (initialProblemId) {
      const found = ALL_SQL_PROBLEMS.find((p) => p.id === initialProblemId);
      if (found) setActiveProblem(found);
    }
  }, [initialProblemId]);

  if (!isOpen) return null;

  const handleExecuteQuery = async (isSubmit: boolean = false) => {
    setIsRunning(true);
    try {
      const res = await fetch("/api/prepare/execute-sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId: activeProblem.id,
          query,
          dialect,
          isSubmit: Boolean(isSubmit)
        })
      });
      const data = await res.json();
      setResult(data);

      if (isSubmit && data.status === "Accepted" && onProblemSolved) {
        onProblemSolved(activeProblem.id);
      }
    } catch (e: any) {
      setResult({
        status: "Runtime Error",
        errorMessage: e.message || "Failed to execute SQL query"
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleResetQuery = () => {
    setQuery(activeProblem.starterCode[dialect]);
    setResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-[1360px] h-[92vh] bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Top Navbar */}
        <div className="px-5 py-3.5 bg-white border-b border-slate-200 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <Database className="w-4 h-4" />
            </div>

            {/* Problem Switcher */}
            <div className="relative">
              <select
                value={activeProblem.id}
                onChange={(e) => {
                  const p = ALL_SQL_PROBLEMS.find((x) => x.id === e.target.value);
                  if (p) setActiveProblem(p);
                }}
                className="bg-slate-50 border border-slate-200 text-slate-900 font-bold text-xs sm:text-sm rounded-xl px-3 py-1.5 pr-8 appearance-none focus:outline-none focus:border-teal-500 cursor-pointer"
              >
                {ALL_SQL_PROBLEMS.map((prob) => (
                  <option key={prob.id} value={prob.id}>
                    {prob.title} ({prob.difficulty})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                activeProblem.difficulty === "Easy"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : activeProblem.difficulty === "Medium"
                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                  : "bg-rose-50 text-rose-700 border border-rose-200"
              }`}
            >
              {activeProblem.difficulty}
            </span>

            <span className="hidden md:inline-block text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              {activeProblem.category}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Dialect Selector */}
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setDialect("mysql")}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  dialect === "mysql" ? "bg-white text-teal-700 shadow-2xs font-bold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                MySQL
              </button>
              <button
                onClick={() => setDialect("postgresql")}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  dialect === "postgresql" ? "bg-white text-teal-700 shadow-2xs font-bold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                PostgreSQL
              </button>
              <button
                onClick={() => setDialect("sqlserver")}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  dialect === "sqlserver" ? "bg-white text-teal-700 shadow-2xs font-bold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                SQL Server
              </button>
            </div>

            {/* Run & Submit */}
            <button
              onClick={() => handleExecuteQuery(false)}
              disabled={isRunning}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 text-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Query</span>
            </button>

            <button
              onClick={() => handleExecuteQuery(true)}
              disabled={isRunning}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-1.5 rounded-xl flex items-center gap-1.5 text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Solution</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Grid: Left Panel (Description/Schema), Right Panel (Editor + Result Table) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* Left Column: Problem Tabs */}
          <div className="lg:col-span-5 border-r border-slate-200 flex flex-col bg-white overflow-hidden">
            <div className="flex items-center border-b border-slate-200 px-4 py-2 gap-2 text-xs font-semibold">
              <button
                onClick={() => setActiveTab("description")}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeTab === "description" ? "bg-teal-50 text-teal-700 font-bold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Problem Description
              </button>
              <button
                onClick={() => setActiveTab("schema")}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeTab === "schema" ? "bg-teal-50 text-teal-700 font-bold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Database Schema ({activeProblem.schemas.length})
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              {activeTab === "description" && (
                <>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">{activeProblem.title}</h3>
                    <div className="whitespace-pre-line text-slate-600 leading-relaxed font-sans">
                      {activeProblem.description}
                    </div>
                  </div>

                  {/* Schema Summary */}
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                      <Table className="w-3.5 h-3.5 text-teal-600" />
                      <span>Available Tables:</span>
                    </h4>
                    <div className="space-y-3">
                      {activeProblem.schemas.map((s) => (
                        <div key={s.tableName} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <div className="font-mono font-bold text-teal-800 text-xs mb-1.5">{s.tableName}</div>
                          <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-600 font-mono">
                            {s.columns.map((c) => (
                              <div key={c.name} className="truncate">
                                • {c.name} <span className="text-slate-400">({c.type})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeTab === "schema" && (
                <div className="space-y-6">
                  {activeProblem.schemas.map((s) => (
                    <div key={s.tableName} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-slate-900 text-xs">Table: {s.tableName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{s.sampleRows.length} sample rows</span>
                      </div>
                      <div className="overflow-x-auto border border-slate-200 rounded-xl">
                        <table className="w-full text-left text-[11px]">
                          <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                            <tr>
                              {s.columns.map((col) => (
                                <th key={col.name} className="px-3 py-2 font-mono">
                                  {col.name} <span className="text-[10px] font-normal text-slate-400">({col.type})</span>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-mono">
                            {s.sampleRows.map((r, rIdx) => (
                              <tr key={rIdx} className="hover:bg-slate-50/50">
                                {s.columns.map((col) => (
                                  <td key={col.name} className="px-3 py-1.5 text-slate-700">
                                    {String(r[col.name] ?? "NULL")}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: SQL Editor (top) + Results / Execution View (bottom) */}
          <div className="lg:col-span-7 flex flex-col bg-slate-50 overflow-hidden">
            
            {/* Editor Toolbar */}
            <div className="px-4 py-2 bg-white border-b border-slate-200 flex items-center justify-between text-xs">
              <span className="font-mono text-slate-500 font-medium">query.{dialect}.sql</span>
              <button
                onClick={handleResetQuery}
                className="text-slate-500 hover:text-slate-800 flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Starter Query</span>
              </button>
            </div>

            {/* SQL Code Input */}
            <div className="h-[46%] bg-white p-3">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Write your SQL SELECT query here..."
                spellCheck={false}
                className="w-full h-full p-3 font-mono text-xs text-slate-900 bg-slate-50/50 border border-slate-200 rounded-xl resize-none outline-none focus:border-teal-500 focus:bg-white leading-relaxed"
              />
            </div>

            {/* Results Console */}
            <div className="flex-1 bg-white border-t border-slate-200 flex flex-col overflow-hidden">
              {/* Console Tabs */}
              <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-slate-500" />
                    Execution Output
                  </span>

                  {result?.status && (
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                        result.status === "Accepted"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : result.status === "Success"
                          ? "bg-teal-50 text-teal-700 border border-teal-200"
                          : result.status === "Wrong Answer"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {result.status === "Success" ? "Query Executed" : result.status}
                    </span>
                  )}
                </div>

                {result?.executionTimeMs !== undefined && (
                  <span className="text-[10px] font-mono text-slate-400">
                    Runtime: {result.executionTimeMs}ms
                  </span>
                )}
              </div>

              {/* Console Content */}
              <div className="flex-1 overflow-auto p-4 text-xs">
                {isRunning ? (
                  <div className="h-full flex items-center justify-center gap-2 text-slate-500">
                    <div className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                    <span>Executing SQL query against test database...</span>
                  </div>
                ) : !result ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center">
                    <Database className="w-8 h-8 text-slate-300 mb-2" />
                    <p className="font-medium text-slate-500">No query executed yet.</p>
                    <p className="text-[11px] text-slate-400">Click &ldquo;Run Query&rdquo; to explore or &ldquo;Submit Solution&rdquo; to test against expected answer.</p>
                  </div>
                ) : (result.errorMessage || (result as any).error) ? (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 font-mono text-xs whitespace-pre-wrap">
                    ⚠️ {result.errorMessage || (result as any).error}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Your Query Output Table */}
                    <div>
                      <div className="font-semibold text-slate-700 text-xs mb-2">
                        Query Result ({result.rows?.length ?? 0} rows):
                      </div>
                      {result.rows && result.rows.length > 0 ? (
                        <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-48">
                          <table className="w-full text-left text-[11px] font-mono">
                            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 sticky top-0">
                              <tr>
                                {result.columns?.map((c, idx) => (
                                  <th key={idx} className="px-3 py-2">
                                    {c}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {result.rows.map((row, rIdx) => (
                                <tr key={rIdx} className="hover:bg-slate-50">
                                  {row.map((val: any, cIdx: number) => (
                                    <td key={cIdx} className="px-3 py-1.5 text-slate-800">
                                      {String(val ?? "NULL")}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 font-mono">
                          Empty set (0 rows returned)
                        </div>
                      )}
                    </div>

                    {/* If Wrong Answer, show expected table */}
                    {result.status === "Wrong Answer" && result.expectedRows && (
                      <div className="pt-2 border-t border-slate-100">
                        <div className="font-semibold text-rose-700 text-xs mb-2">
                          Expected Output ({result.expectedRows.length} rows):
                        </div>
                        <div className="overflow-x-auto border border-rose-200 bg-rose-50/20 rounded-xl max-h-44">
                          <table className="w-full text-left text-[11px] font-mono">
                            <thead className="bg-rose-50 text-rose-900 font-bold border-b border-rose-200 sticky top-0">
                              <tr>
                                {result.expectedColumns?.map((c, idx) => (
                                  <th key={idx} className="px-3 py-2">
                                    {c}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-rose-100">
                              {result.expectedRows.map((row, rIdx) => (
                                <tr key={rIdx}>
                                  {row.map((val: any, cIdx: number) => (
                                    <td key={cIdx} className="px-3 py-1.5 text-slate-800">
                                      {String(val ?? "NULL")}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
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
