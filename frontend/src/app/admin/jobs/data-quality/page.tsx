"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, ArrowLeft, AlertTriangle, AlertCircle, Info, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDataQualityIssues, DataQualityIssue } from "@/lib/adminData";

export default function AdminDataQualityPage() {
  const [issues, setIssues] = useState<DataQualityIssue[]>(getDataQualityIssues());

  const handleFix = (id: string) => {
    setIssues(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/admin/jobs" className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1 font-medium">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to All Jobs
            </Link>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-teal-600" />
            <span>Data Quality &amp; Hygiene</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Identify incomplete fields, unmapped employer entities, and corrupted URLs across the ingestion stream.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => alert("Full schema and data hygiene scan triggered across all 63,000+ jobs!")}
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-2xs gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Run Data Audit Scan</span>
        </Button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Overall Data Hygiene</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">98.4%</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Meets all strict schema standards</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Schema Warnings</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">24 Issues</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Missing salary bounds or fallback tags</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Critical Schema Errors</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600">2 Errors</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Unmapped company entity / broken endpoint</div>
        </div>
      </div>

      {/* Affected Jobs Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">Affected Records Pending Resolution</h3>
          <span className="text-xs text-slate-400">{issues.length} items flagged</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/90 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Severity</th>
                <th className="p-3.5">Job Title</th>
                <th className="p-3.5">Company</th>
                <th className="p-3.5">Issue Description</th>
                <th className="p-3.5">Detected</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {issues.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    All data quality audits passed with 100% compliance.
                  </td>
                </tr>
              ) : (
                issues.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.severity === "critical" ? "bg-rose-50 text-rose-700 border border-rose-200" :
                        item.severity === "warning" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                        "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}>
                        {item.severity.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-slate-900">
                      {item.jobTitle}
                    </td>
                    <td className="p-3.5 font-medium text-slate-700">
                      {item.company}
                    </td>
                    <td className="p-3.5 text-slate-600 max-w-xs">
                      {item.description}
                    </td>
                    <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                      {item.detectedAt}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleFix(item.id)}
                        className="px-2.5 py-1 rounded-lg border border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100 font-semibold text-[11px] transition-colors cursor-pointer"
                      >
                        Auto-Fix &amp; Reindex
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
