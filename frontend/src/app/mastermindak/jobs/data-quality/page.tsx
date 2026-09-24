"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle, ArrowLeft, AlertTriangle, AlertCircle, Info, RefreshCw, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auditJobDataQuality, DataHygieneAuditResult, DataQualityIssue } from "@/lib/adminData";

export default function AdminDataQualityPage() {
  const [audit, setAudit] = useState<DataHygieneAuditResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setAudit(auditJobDataQuality());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRunScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const res = auditJobDataQuality();
      setAudit(res);
      setIsScanning(false);
      showToast(`Data hygiene scan finished! Audited ${res.totalAudited.toLocaleString()} job listings.`);
    }, 1200);
  };

  const handleFixIssue = (id: string, issueType: string) => {
    if (!audit) return;
    setAudit({
      ...audit,
      issues: audit.issues.filter(i => i.id !== id),
      overallScore: Math.min(99.9, Number((audit.overallScore + 0.1).toFixed(1)))
    });
    showToast(`Applied schema correction for ${issueType.replace("_", " ")}.`);
  };

  if (!audit) return null;

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/mastermindak/jobs" className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1 font-medium">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to All Jobs
            </Link>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-teal-600" />
            <span>Data Quality &amp; Schema Hygiene</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Identify incomplete fields, unmapped employer entities, and corrupted URLs across the ingestion stream.
          </p>
        </div>

        <Button
          size="sm"
          disabled={isScanning}
          onClick={handleRunScan}
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-2xs gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? "animate-spin" : ""}`} />
          <span>{isScanning ? "Auditing Corpus..." : "Run Data Audit Scan"}</span>
        </Button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Overall Data Hygiene</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{audit.overallScore}%</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Across {audit.totalAudited.toLocaleString()} audited roles</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Missing Compensation</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">{audit.missingSalaryCount} Roles</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Estimated via ML benchmark</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Suspicious Redirections</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600">{audit.suspiciousUrlCount} Detected</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Target link audit queue</div>
        </div>
      </div>

      {/* Issues Queue Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">Active Data Quality Anomalies ({audit.issues.length})</h3>
          <span className="text-xs text-slate-400 font-mono">Real-time Rule Engine</span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {audit.issues.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              Zero active data anomalies detected! All indexed jobs adhere to the schema standards.
            </div>
          ) : (
            audit.issues.map((issue) => (
              <div key={issue.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      issue.severity === "critical" ? "bg-rose-50 text-rose-700 border border-rose-200" :
                      issue.severity === "warning" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                      "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}>
                      {issue.severity.toUpperCase()}
                    </span>
                    <span className="font-bold text-slate-900">{issue.jobTitle}</span>
                    <span className="text-slate-400 font-medium">({issue.company})</span>
                  </div>
                  <div className="text-slate-500 text-[11px]">{issue.description}</div>
                  <div className="text-[10px] text-slate-400 font-mono">Detected: {issue.detectedAt}</div>
                </div>

                <Button
                  size="sm"
                  onClick={() => handleFixIssue(issue.id, issue.issueType)}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-2xs gap-1.5 cursor-pointer self-start sm:self-auto shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Auto-resolve &amp; Heal</span>
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
