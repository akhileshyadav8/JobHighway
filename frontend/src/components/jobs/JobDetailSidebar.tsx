"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ExternalLink,
  Bookmark,
  CheckCircle2,
  Building2,
  MapPin,
  Laptop,
  Briefcase,
  GraduationCap,
  Coins,
  ShieldCheck,
  CalendarDays,
  RefreshCw,
  Share2,
  AlertCircle
} from "lucide-react";
import { Job } from "@/lib/api";
import { formatSalary, formatDate, inferAtsSource } from "@/lib/utils";
import { CountryFlag } from "@/components/ui/CountryFlag";
import { getCurrentUser, markJobApplied, isJobApplied, toggleBookmark, isJobBookmarked, User } from "@/lib/auth";
import { trackEvent } from "@/lib/telemetry";
import { ShareButtons } from "@/components/jobs/ShareButtons";

interface JobDetailSidebarProps {
  job: Job;
}

export function JobDetailSidebar({ job }: JobDetailSidebarProps) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [applied, setApplied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const stringJobId = String(job.id);
    const user = getCurrentUser();
    setCurrentUser(user);

    if (user && user.role !== "admin") {
      setApplied(isJobApplied(user.id, stringJobId));
      setBookmarked(isJobBookmarked(user.id, stringJobId));
    }

    const syncState = () => {
      const u = getCurrentUser();
      setCurrentUser(u);
      if (u && u.role !== "admin") {
        setApplied(isJobApplied(u.id, stringJobId));
        setBookmarked(isJobBookmarked(u.id, stringJobId));
      }
    };

    window.addEventListener("jobhighway_auth_change", syncState);
    window.addEventListener("jobhighway_applications_change", syncState);
    window.addEventListener("jobhighway_bookmarks_change", syncState);

    return () => {
      window.removeEventListener("jobhighway_auth_change", syncState);
      window.removeEventListener("jobhighway_applications_change", syncState);
      window.removeEventListener("jobhighway_bookmarks_change", syncState);
    };
  }, [job.id]);

  const isAdmin = currentUser?.role === "admin";
  const safeLocation = Array.isArray(job.location) ? job.location : [];
  const atsSource = inferAtsSource(job.apply_url || job.job_url);
  const applyLabel = atsSource ? `Apply on ${atsSource} ↗` : "Apply on Official Site ↗";
  const hasBatch = job.eligible_batches && Array.isArray(job.eligible_batches) && job.eligible_batches.length > 0;
  const batchesText = hasBatch ? job.eligible_batches!.join(", ") : null;

  const handleApplyClick = () => {
    trackEvent("apply_click", {
      jobId: String(job.id),
      title: job.title,
      company: job.company.name
    });

    const user = getCurrentUser();
    if (user && user.role !== "admin") {
      markJobApplied(user.id, {
        jobId: String(job.id),
        title: job.title,
        company: job.company.name,
        location: safeLocation.length > 0 ? safeLocation.join(", ") : "Remote",
        salary: formatSalary(job.salary_min, job.salary_max, job.salary_currency, job.salary_period, true),
        applyUrl: job.apply_url || ""
      });
      setApplied(true);
    }
  };

  const handleToggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    const user = getCurrentUser();
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role === "admin") return;

    const isSaved = toggleBookmark(user.id, {
      jobId: String(job.id),
      title: job.title,
      company: job.company.name,
      location: safeLocation.length > 0 ? safeLocation.join(", ") : "Remote",
      salary: formatSalary(job.salary_min, job.salary_max, job.salary_currency, job.salary_period, true),
      applyUrl: job.apply_url || ""
    });
    setBookmarked(isSaved);
  };

  const handleToggleApplied = (e: React.MouseEvent) => {
    e.preventDefault();
    const user = getCurrentUser();
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role === "admin") return;

    markJobApplied(user.id, {
      jobId: String(job.id),
      title: job.title,
      company: job.company.name,
      location: safeLocation.length > 0 ? safeLocation.join(", ") : "Remote",
      salary: formatSalary(job.salary_min, job.salary_max, job.salary_currency, job.salary_period, true),
      applyUrl: job.apply_url || ""
    });
    setApplied(true);
  };

  return (
    <aside className="sticky top-20 space-y-5">
      {/* Primary Action Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3">
          Direct Application
        </h3>

        {job.apply_url ? (
          <a
            href={job.apply_url}
            onClick={handleApplyClick}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-sm sm:text-base rounded-xl transition-all shadow-md hover:shadow-teal-600/20 cursor-pointer text-center"
          >
            <span>{applyLabel}</span>
          </a>
        ) : (
          <div className="p-3 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
            Official application link not provided for this requisition.
          </div>
        )}

        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
          {!isAdmin && (
            <>
              <button
                onClick={handleToggleBookmark}
                className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                  bookmarked
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? "fill-current" : ""}`} />
                <span>{bookmarked ? "Saved" : "Save Job"}</span>
              </button>

              <button
                onClick={handleToggleApplied}
                className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                  applied
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <CheckCircle2 className={`w-3.5 h-3.5 ${applied ? "fill-emerald-200 text-emerald-700" : ""}`} />
                <span>{applied ? "Applied" : "Mark Applied"}</span>
              </button>
            </>
          )}
        </div>

        <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <span>Direct official link • Zero third-party fees</span>
        </div>
      </div>

      {/* Quick Overview Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-4">
          Quick Overview
        </h3>

        <div className="space-y-3.5 text-xs">
          <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              Company
            </span>
            <span className="font-semibold text-slate-900 text-right">{job.company.name}</span>
          </div>

          <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
            <span className="text-slate-500 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Location
            </span>
            <span className="font-semibold text-slate-900 text-right flex items-center gap-1.5">
              <CountryFlag locations={safeLocation} size="sm" />
              <span>{safeLocation.length > 0 ? safeLocation.slice(0, 2).join(", ") : "Remote / Unspecified"}</span>
            </span>
          </div>

          <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-slate-400" />
              Work Mode
            </span>
            <span className="font-semibold text-slate-900 text-right">{job.work_mode || "Not specified"}</span>
          </div>

          <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              Employment
            </span>
            <span className="font-semibold text-slate-900 text-right">{job.employment_type || "Not specified"}</span>
          </div>

          <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-slate-400" />
              Compensation
            </span>
            <span className="font-semibold text-slate-900 text-right">
              {formatSalary(job.salary_min, job.salary_max, job.salary_currency, job.salary_period, true)}
            </span>
          </div>

          {hasBatch && (
            <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                Eligible Batch
              </span>
              <span className="font-semibold text-slate-900 text-right">{batchesText}</span>
            </div>
          )}

          {atsSource && (
            <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                Source ATS
              </span>
              <span className="font-mono font-semibold text-teal-700 text-right">{atsSource}</span>
            </div>
          )}

          {job.posted_at && (
            <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                Posted
              </span>
              <span className="font-medium text-slate-700 text-right">{formatDate(job.posted_at)}</span>
            </div>
          )}

          {job.last_seen_at && (
            <div className="flex items-start justify-between gap-2">
              <span className="text-slate-500 flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                Last Synced
              </span>
              <span className="font-medium text-slate-700 text-right">{formatDate(job.last_seen_at)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Share Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <Share2 className="w-3.5 h-3.5 text-slate-400" />
          <span>Share Requisition</span>
        </h3>
        <ShareButtons jobTitle={job.title} jobUrl={`/jobs/${job.slug}`} />
      </div>

      {/* Report issue link */}
      <div className="text-center px-2">
        <a
          href={`mailto:jobhighway.report@gmail.com?subject=Report Listing: ${encodeURIComponent(job.title)} at ${encodeURIComponent(job.company.name)}&body=Job Slug: ${encodeURIComponent(job.slug)}`}
          className="text-xs text-slate-400 hover:text-slate-600 transition-colors inline-flex items-center gap-1"
        >
          <AlertCircle className="w-3 h-3" />
          <span>Report incorrect information</span>
        </a>
      </div>
    </aside>
  );
}
