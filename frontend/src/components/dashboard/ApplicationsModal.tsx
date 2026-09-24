"use client";

import React, { useState } from "react";
import { 
  X, 
  CheckCircle2, 
  Bookmark, 
  Trash2, 
  ExternalLink, 
  MapPin, 
  Filter, 
  Briefcase,
  Clock
} from "lucide-react";
import { AppliedJob, BookmarkItem, ApplicationStatus } from "@/lib/auth";

export interface ApplicationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "applied" | "saved";
  appliedJobs: AppliedJob[];
  bookmarks: BookmarkItem[];
  onStatusChange: (appliedId: string, status: ApplicationStatus) => void;
  onDeleteApplied: (appliedId: string) => void;
  onRemoveBookmark: (bookmark: BookmarkItem) => void;
}

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; color: string; bg: string; border: string }> = {
  "Applied": {
    label: "Applied",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200"
  },
  "Under Review": {
    label: "Under Review",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200"
  },
  "Interview": {
    label: "Interviewing",
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200"
  },
  "Offer": {
    label: "Offer Received 🎉",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200"
  },
  "Rejected": {
    label: "Archived / Rejected",
    color: "text-slate-600",
    bg: "bg-slate-100",
    border: "border-slate-200"
  }
};

export function ApplicationsModal({
  isOpen,
  onClose,
  defaultTab = "applied",
  appliedJobs,
  bookmarks,
  onStatusChange,
  onDeleteApplied,
  onRemoveBookmark
}: ApplicationsModalProps) {
  const [activeTab, setActiveTab] = useState<"applied" | "saved">(defaultTab);
  const [statusFilter, setStatusFilter] = useState<string>("All");

  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

  if (!isOpen) return null;

  const filteredApplied = appliedJobs.filter((job) => {
    if (statusFilter === "All") return true;
    return job.status === statusFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 relative overflow-hidden">
        {/* Modal Top Bar */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab("applied")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "applied"
                  ? "bg-teal-600 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Applied Jobs ({appliedJobs.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("saved")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "saved"
                  ? "bg-teal-600 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Saved Wishlist ({bookmarks.length})</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === "applied" && (
            <div className="space-y-4">
              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 flex-wrap pb-2 border-b border-slate-100">
                <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Filter:
                </span>
                {["All", "Applied", "Under Review", "Interview", "Offer", "Rejected"].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                      statusFilter === status
                        ? "bg-teal-600 text-white shadow-xs"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              {filteredApplied.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-xl">
                  <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700">No applications found</p>
                  <p className="text-xs text-slate-400 mt-1">
                    When you apply to jobs on JobPulse, they will be tracked here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredApplied.map((job) => (
                    <div
                      key={job.id}
                      className="p-4.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900 truncate">
                            {job.title}
                          </h4>
                          <span
                            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                              STATUS_CONFIG[job.status]?.bg || "bg-slate-100"
                            } ${STATUS_CONFIG[job.status]?.color || "text-slate-700"} ${
                              STATUS_CONFIG[job.status]?.border || "border-slate-200"
                            }`}
                          >
                            {STATUS_CONFIG[job.status]?.label || job.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                          <span className="font-medium text-slate-700">{job.company}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {job.location}
                          </span>
                        </div>
                        {job.notes && (
                          <p className="text-xs text-slate-500 italic mt-1.5">
                            Note: {job.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                        {/* Status Select */}
                        <select
                          value={job.status}
                          onChange={(e) =>
                            onStatusChange(job.id, e.target.value as ApplicationStatus)
                          }
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
                        >
                          <option value="Applied">Applied</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Interview">Interview</option>
                          <option value="Offer">Offer</option>
                          <option value="Rejected">Rejected</option>
                        </select>

                        {/* Apply Link */}
                        <a
                          href={job.applyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
                          title="Open ATS requisition"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>

                        {/* Delete Application */}
                        <button
                          type="button"
                          onClick={() => onDeleteApplied(job.id)}
                          className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer"
                          title="Remove application"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "saved" && (
            <div className="space-y-3">
              {bookmarks.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-xl">
                  <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700">No saved roles yet</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Bookmark interesting jobs to review and apply to later.
                  </p>
                </div>
              ) : (
                bookmarks.map((b) => (
                  <div
                    key={b.jobId}
                    className="p-4.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs"
                  >
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-slate-900 truncate">
                        {b.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <span className="font-medium text-slate-700">{b.company}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {b.location}
                        </span>
                        {b.salary && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-600 font-semibold">{b.salary}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={b.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-1.5 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                      >
                        <span>Apply</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <button
                        type="button"
                        onClick={() => onRemoveBookmark(b)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Remove Bookmark"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
