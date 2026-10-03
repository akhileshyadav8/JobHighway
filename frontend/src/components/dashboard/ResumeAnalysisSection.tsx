"use client";

import React, { useRef, useState } from "react";
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  Download, 
  Trash2, 
  Sparkles, 
  RefreshCw, 
  AlertCircle,
  FileCheck2
} from "lucide-react";

import { ResumeAnalysisResult } from "@/lib/resumeAnalysisService";

export interface ResumeData {
  name: string;
  size: number;
  uploadedAt: string;
  dataUrl?: string;
  fileType?: string;
  status?: string;
  atsScore?: number;
}

export interface ResumeAnalysisSectionProps {
  resume?: ResumeData | null;
  analysis?: ResumeAnalysisResult | null;
  isAnalyzing?: boolean;
  targetRole?: string;
  onUploadResume?: (file: File) => void;
  onRemoveResume?: () => void;
  onAnalyzeResume?: () => void;
  onRefreshAnalysis?: () => void;
  className?: string;
}

export function ResumeAnalysisSection({
  resume,
  analysis,
  isAnalyzing = false,
  targetRole,
  onUploadResume,
  onRemoveResume,
  onAnalyzeResume,
  onRefreshAnalysis,
  className = ""
}: ResumeAnalysisSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [localAnalyzing, setLocalAnalyzing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showKeywordsDetails, setShowKeywordsDetails] = useState(true);

  const effectiveAnalyzing = isAnalyzing || localAnalyzing;
  const currentScore = analysis ? analysis.atsScore : (resume?.atsScore || 0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg("");
    const file = e.target.files?.[0];
    if (!file) return;

    validateAndUpload(file);
  };

  const validateAndUpload = (file: File) => {
    const validExtensions = [".pdf", ".doc", ".docx"];
    const fileExt = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

    if (!validExtensions.includes(fileExt) && file.type !== "application/pdf") {
      setErrorMsg("Please upload a PDF, DOC, or DOCX document.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("File size exceeds 5MB limit. Please upload a smaller file.");
      return;
    }

    onUploadResume?.(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    setErrorMsg("");

    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndUpload(file);
    }
  };

  const handleRunAnalysis = async () => {
    setLocalAnalyzing(true);
    try {
      if (onRefreshAnalysis) {
        await onRefreshAnalysis();
      } else if (onAnalyzeResume) {
        await onAnalyzeResume();
      }
    } finally {
      setLocalAnalyzing(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(false);
    onRemoveResume?.();
  };

  const benefits = [
    "Job match score for each role",
    "Missing skills and improvement suggestions",
    "ATS keyword analysis",
    "Personalized job recommendations"
  ];

  return (
    <div className={`rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-4.5 lg:p-5 shadow-xs flex flex-col justify-between h-full ${className}`}>
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 mt-0.5">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Resume Analysis
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload your resume to get AI-powered insights and improve your job matches.
              </p>
            </div>
          </div>

          {analysis && (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200/70 shrink-0">
              {analysis.targetRole.name}
            </span>
          )}
        </div>

        {errorMsg && (
          <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Main Content Split: Left Upload / File Info, Right Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 mt-5 items-start">
          {/* Left Side: Upload Area or Active Resume File Box */}
          <div>
            {resume ? (
              <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/30 flex flex-col justify-between space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                      <FileCheck2 className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div 
                        className="font-bold text-sm text-slate-900 line-clamp-1"
                        title={resume.name}
                      >
                        {resume.name}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                        {(resume.size / 1024).toFixed(0)} KB · {resume.fileType || "PDF"} · {new Date(resume.uploadedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <span className={`shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-bold border whitespace-nowrap ${
                    currentScore >= 70
                      ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                      : currentScore >= 40
                      ? "bg-amber-100 text-amber-800 border-amber-300"
                      : "bg-rose-100 text-rose-800 border-rose-300"
                  }`}>
                    ATS: {currentScore}%
                  </span>
                </div>

                {/* Analysis result summary bar */}
                {analysis && (
                  <div className="text-xs text-slate-700 bg-white/90 p-3 rounded-xl border border-teal-200/80 space-y-1.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">
                        {analysis.targetRole.name} Compatibility
                      </span>
                      <span className="font-mono text-[11px] text-teal-700 font-bold">
                        {analysis.totalMatchedKeywords}/{analysis.totalRequiredKeywords} Keywords
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-teal-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${analysis.atsScore}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                      <span>Matches official ATS requisitions</span>
                      <span>{new Date(analysis.analysisTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons for Uploaded Resume */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-teal-100">
                  {resume.dataUrl && (
                    <a
                      href={resume.dataUrl}
                      download={resume.name}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-1.5 px-2.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>View</span>
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={handleRunAnalysis}
                    disabled={effectiveAnalyzing}
                    className="py-1.5 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs whitespace-nowrap disabled:opacity-50"
                    title="Re-read resume and run fresh keyword match"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${effectiveAnalyzing ? "animate-spin" : ""}`} />
                    <span>{effectiveAnalyzing ? "Re-analyzing..." : "Re-analyze"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={effectiveAnalyzing}
                    className="py-1.5 px-2.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs whitespace-nowrap disabled:opacity-50"
                    title="Replace with another file"
                  >
                    <Upload className="w-3.5 h-3.5 text-slate-400" />
                    <span>Replace</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="py-1.5 px-2 rounded-lg bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer shadow-2xs ml-auto"
                    title="Delete Resume"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Delete confirmation prompt */}
                {showDeleteConfirm && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-2 mt-2">
                    <p className="font-semibold">Are you sure you want to delete your stored resume?</p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
                      >
                        Yes, Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-2.5 py-1 rounded bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                  dragOver
                    ? "border-teal-500 bg-teal-50/50"
                    : "border-slate-200 bg-slate-50/50 hover:border-teal-300"
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-2">
                  <Upload className="w-4 h-4 text-slate-600" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 mb-0.5">
                  Upload Your Resume
                </h3>
                <p className="text-[11px] text-slate-400 mb-3">
                  PDF, DOC or DOCX (Max 5MB)
                </p>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="py-1.5 px-4 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer whitespace-nowrap"
                >
                  Upload Resume
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Right Side: What You'll Get Checklist */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 mb-2">
              What you&apos;ll get:
            </h4>
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-600 font-medium leading-tight">
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
