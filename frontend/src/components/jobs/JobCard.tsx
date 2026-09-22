"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPin, Clock, Bookmark, CheckCircle2, ExternalLink } from "lucide-react";
import { Job } from "@/lib/api";
import { formatSalary, formatRelativeTime, formatDate, sanitizeJobSkills, inferAtsSource } from "@/lib/utils";
import { CountryFlag } from "@/components/ui/CountryFlag";
import { getCurrentUser, markJobApplied, isJobApplied, toggleBookmark, isJobBookmarked, User } from "@/lib/auth";
import { trackEvent } from "@/lib/telemetry";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
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

    window.addEventListener("jobpulse_auth_change", syncState);
    window.addEventListener("jobpulse_applications_change", syncState);
    window.addEventListener("jobpulse_bookmarks_change", syncState);

    return () => {
      window.removeEventListener("jobpulse_auth_change", syncState);
      window.removeEventListener("jobpulse_applications_change", syncState);
      window.removeEventListener("jobpulse_bookmarks_change", syncState);
    };
  }, [job.id]);

  const isAdmin = currentUser?.role === "admin";

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
        location: Array.isArray(job.location) && job.location.length > 0 ? job.location.join(", ") : "Remote",
        salary: formatSalary(job.salary_min, job.salary_max, job.salary_currency, job.salary_period, true),
        applyUrl: job.apply_url || ""
      });
      setApplied(true);
    }
  };

  const handleToggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
      location: Array.isArray(job.location) && job.location.length > 0 ? job.location.join(", ") : "Remote",
      salary: formatSalary(job.salary_min, job.salary_max, job.salary_currency, job.salary_period, true),
      applyUrl: job.apply_url || ""
    });
    setBookmarked(isSaved);
  };

  const handleQuickMarkApplied = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
      location: Array.isArray(job.location) && job.location.length > 0 ? job.location.join(", ") : "Remote",
      salary: formatSalary(job.salary_min, job.salary_max, job.salary_currency, job.salary_period, true),
      applyUrl: job.apply_url || ""
    });
    setApplied(true);
  };

  const displaySkills = sanitizeJobSkills(job.skills_required, job.title, job.description_text);

  const handleJobClick = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("jobpulse_scroll_pos", String(window.scrollY));
    }
  };

  // Experience text
  const expText = job.experience_min === 0
    ? (job.employment_type?.toLowerCase().includes("intern") || job.title.toLowerCase().includes("intern") ? "Intern" : "0–1 Yrs")
    : job.experience_min === 1
    ? `1–${job.experience_max || 3} Yrs`
    : job.experience_min !== null && job.experience_min !== undefined
    ? `${job.experience_min}+ Yrs`
    : null;

  // Location display — safe guard against null/non-array
  const safeLocation = Array.isArray(job.location) ? job.location : [];
  const locationText = safeLocation.length > 0
    ? safeLocation.slice(0, 2).join(", ") + (safeLocation.length > 2 ? ` +${safeLocation.length - 2}` : "")
    : null;


  // Source ATS badge
  const atsSource = inferAtsSource(job.apply_url || job.job_url);

  // Salary display
  const salaryText = formatSalary(job.salary_min, job.salary_max, job.salary_currency, job.salary_period, true);
  const showSalary = salaryText && salaryText !== "Competitive (Disclosed on Application)";

  // Batch information: display only if real meaningful data is present
  const batchText = (job.eligible_batches && Array.isArray(job.eligible_batches) && job.eligible_batches.length > 0)
    ? job.eligible_batches.filter((b: any) => Boolean(b && String(b).trim())).join(", ")
    : null;

  // Closing / Expiry date
  const getClosingDateText = (): string | null => {
    if (!job.deadline) return null;
    const trimmed = String(job.deadline).trim();
    if (!trimmed || trimmed.toLowerCase() === "null" || trimmed.toLowerCase() === "undefined") return null;
    const parsedDate = new Date(trimmed);
    if (!isNaN(parsedDate.getTime()) && parsedDate.getFullYear() > 2000) {
      const formatted = formatDate(trimmed);
      if (formatted) return `Apply by ${formatted}`;
    }
    return `Deadline: ${trimmed}`;
  };
  const closingText = getClosingDateText();

  const postDate = job.posted_at || job.first_seen_at;
  const isNew = Boolean(postDate && (Date.now() - new Date(postDate).getTime() <= 4 * 60 * 60 * 1000) && (Date.now() - new Date(postDate).getTime() >= 0));
  const isRecent = Boolean(postDate && (Date.now() - new Date(postDate).getTime() <= 24 * 60 * 60 * 1000) && (Date.now() - new Date(postDate).getTime() >= 0));

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 hover:border-slate-300 hover:shadow-md transition-all flex flex-col h-full group relative">
      {/* Top Header: Logo + Company + Badges */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Company Logo */}
          {job.company.logo_url ? (
            <div className="w-10 h-10 shrink-0 rounded-lg border border-slate-100 bg-white flex items-center justify-center overflow-hidden p-1 shadow-2xs">
              <Image
                src={job.company.logo_url}
                alt={job.company.name}
                width={36}
                height={36}
                className="w-full h-full object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
          ) : (
            <div className="w-10 h-10 shrink-0 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-center shadow-2xs">
              <span className="text-xs font-bold text-slate-400 uppercase">
                {job.company.name.charAt(0)}
              </span>
            </div>
          )}

          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-700 truncate">
              {job.company.name}
            </p>
            {atsSource && (
              <span className="text-[10px] font-mono text-teal-700 font-medium block">
                via {atsSource}
              </span>
            )}
          </div>
        </div>

        {/* Right header indicators: NEW badge & Bookmarks */}
        <div className="flex items-center gap-1.5 shrink-0">
          {isNew && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider bg-teal-50 text-teal-700 border border-teal-200/70">
              NEW
            </span>
          )}
          {!isAdmin && (
            <button
              onClick={handleToggleBookmark}
              className={`p-1.5 rounded-md hover:bg-slate-100 transition-colors cursor-pointer ${
                bookmarked
                  ? "text-slate-900"
                  : "text-slate-300 hover:text-slate-600"
              }`}
              title={bookmarked ? "Saved job" : "Save job"}
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-current text-slate-900" : ""}`} />
            </button>
          )}
        </div>
      </div>

      {/* Role Title */}
      <div className="mb-2">
        <Link href={`/jobs/${job.slug}`} onClick={handleJobClick}>
          <h3 className="font-bold text-[15px] leading-snug text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-2">
            {job.title}
          </h3>
        </Link>
      </div>

      {/* Location + Meta Line */}
      {(locationText || job.work_mode || job.employment_type || expText) && (
        <div className="flex items-start gap-1.5 text-xs text-slate-500 mb-2.5">
          <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" />
          <span className="line-clamp-1 flex items-center gap-1.5">
            <CountryFlag locations={safeLocation} size="sm" />
            <span>{[locationText, job.work_mode, job.employment_type, expText].filter(Boolean).join(" · ")}</span>
          </span>
        </div>
      )}

      {/* Salary */}
      {showSalary && (
        <p className="text-sm font-bold text-slate-900 mb-2 tracking-tight">
          {salaryText}
        </p>
      )}

      {/* Batch & Closing Date */}
      {(batchText || closingText) && (
        <div className="flex flex-wrap items-center gap-2 text-xs mb-2.5">
          {batchText && (
            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[11px] font-medium border border-slate-200/60">
              Batch: {batchText}
            </span>
          )}
          {closingText && (
            <span className="text-amber-800 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md text-[11px] font-medium">
              {closingText}
            </span>
          )}
        </div>
      )}

      {/* Skills — max 3 visible */}
      {displaySkills && displaySkills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
          {displaySkills.slice(0, 3).map((skill, i) => (
            <span key={i} className="text-[11px] bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md text-slate-600 font-medium">
              {skill}
            </span>
          ))}
          {displaySkills.length > 3 && (
            <span className="text-[11px] text-slate-400 self-center font-medium pl-0.5">
              +{displaySkills.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-slate-100">
        {/* Left: Freshness relative time with pulsing dot */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500" suppressHydrationWarning>
          {isRecent ? (
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-600"></span>
            </span>
          ) : (
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          )}
          <span suppressHydrationWarning>{formatRelativeTime(postDate)}</span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {!isAdmin && (
            <button
              onClick={handleQuickMarkApplied}
              className={`p-1.5 rounded-md hover:bg-slate-100 transition-colors cursor-pointer ${
                applied
                  ? "text-emerald-600"
                  : "text-slate-300 hover:text-emerald-600"
              }`}
              title={applied ? "Tracked as Applied" : "Mark as Applied"}
            >
              <CheckCircle2 className={`w-4 h-4 ${applied ? "fill-emerald-100 text-emerald-600" : ""}`} />
            </button>
          )}

          <Link
            href={`/jobs/${job.slug}`}
            onClick={handleJobClick}
            className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            Details
          </Link>

          {job.apply_url && (
            <a
              href={job.apply_url}
              onClick={handleApplyClick}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-semibold bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
            >
              Apply
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
