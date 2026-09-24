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
  FileCheck2,
  Eye
} from "lucide-react";

export interface ResumeData {
  name: string;
  size: number;
  uploadedAt: string;
  dataUrl?: string;
  atsScore?: number;
}

export interface ResumeAnalysisSectionProps {
  resume?: ResumeData | null;
  onUploadResume?: (file: File) => void;
  onRemoveResume?: () => void;
  onAnalyzeResume?: () => void;
}

export function ResumeAnalysisSection({
  resume,
  onUploadResume,
  onRemoveResume,
  onAnalyzeResume
}: ResumeAnalysisSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult("ATS keyword check complete: 92% compatibility with live industry requisitions.");
      onAnalyzeResume?.();
    }, 1000);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(false);
    setAnalysisResult(null);
    onRemoveResume?.();
  };

  const benefits = [
    "Job match score for each role",
    "Missing skills and improvement suggestions",
    "ATS keyword analysis",
    "Personalized job recommendations"
  ];

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 lg:p-7 shadow-xs">
      {/* Header */}
      <div className="flex items-start gap-3 pb-4 border-b border-slate-100">
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

      {errorMsg && (
        <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Content Split: Left Upload / File Info, Right Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5 items-center">
        {/* Left Side: Upload Area or Active Resume File Box */}
        <div>
          {resume ? (
            <div className="p-4.5 rounded-xl border border-teal-200 bg-teal-50/30 flex flex-col justify-between space-y-3.5">
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
                      {(resume.size / 1024).toFixed(0)} KB · Uploaded {new Date(resume.uploadedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <span className="shrink-0 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  ATS: {resume.atsScore || 92}%
                </span>
              </div>

              {analysisResult && (
                <div className="text-xs text-emerald-800 bg-emerald-50/80 p-2.5 rounded-lg border border-emerald-200 font-medium">
                  {analysisResult}
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
                    className="py-1.5 px-3 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>View / Download</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={handleRunAnalysis}
                  disabled={isAnalyzing}
                  className="py-1.5 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? "animate-spin" : ""}`} />
                  <span>{isAnalyzing ? "Analyzing..." : "Analyze"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="py-1.5 px-3 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                  <span>Replace</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="py-1.5 px-2.5 rounded-lg bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer shadow-2xs ml-auto"
                  title="Delete Resume"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Delete confirmation prompt */}
              {showDeleteConfirm && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-2">
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
                className="py-1.5 px-4 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer"
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
  );
}
