"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Clock, Bookmark, CheckCircle2 } from "lucide-react";
import { Job } from "@/lib/api";
import { formatSalary, formatRelativeTime, formatDate, sanitizeJobSkills } from "@/lib/utils";
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
    // Only candidates track applications; admins are admin-only
    if (user && user.role !== "admin") {
      markJobApplied(user.id, {
        jobId: String(job.id),
        title: job.title,
        company: job.company.name,
        location: job.location.join(", ") || "Remote",
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
      location: job.location.join(", ") || "Remote",
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
      location: job.location.join(", ") || "Remote",
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

  // Location display
  const locationText = job.location && job.location.length > 0
    ? job.location.slice(0, 2).join(", ") + (job.location.length > 2 ? ` +${job.location.length - 2}` : "")
    : null;

  // Salary display
  const salaryText = formatSalary(job.salary_min, job.salary_max, job.salary_currency, job.salary_period, true);

  // Batch information: display only if real meaningful data is present
  const batchText = (job.eligible_batches && Array.isArray(job.eligible_batches) && job.eligible_batches.length > 0)
    ? job.eligible_batches.filter(b => Boolean(b && String(b).trim())).join(", ")
    : null;

  // Closing / Expiry date information:
  // If actual date present -> "Apply by [Date]"
  // If non-date deadline message present -> display message
  // If NO deadline present -> do NOT display "ASAP" or anything
  const getClosingDateText = (): string | null => {
    if (!job.deadline) return null;
    const trimmed = String(job.deadline).trim();
    if (!trimmed || trimmed.toLowerCase() === "null" || trimmed.toLowerCase() === "undefined") {
      return null;
    }
    const parsedDate = new Date(trimmed);
    if (!isNaN(parsedDate.getTime()) && parsedDate.getFullYear() > 2000) {
      const formatted = formatDate(trimmed);
      if (formatted) return `Apply by ${formatted}`;
    }
    // Return explicit non-date deadline message if present
    return `Deadline: ${trimmed}`;
  };
  const closingText = getClosingDateText();

  // Metadata line parts
  const metaParts: string[] = [];
  if (locationText) metaParts.push(locationText);
  if (job.work_mode) metaParts.push(job.work_mode);
  if (job.employment_type) metaParts.push(job.employment_type);
  if (expText) metaParts.push(expText);

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors flex flex-col h-full">
      {/* Title + Company */}
      <div className="mb-2">
        <Link href={`/jobs/${job.slug}`} onClick={handleJobClick}>
          <h3 className="font-semibold text-[15px] leading-snug text-slate-900 hover:text-teal-700 transition-colors line-clamp-2">
            {job.title}
          </h3>
        </Link>
        <p className="text-sm font-medium text-slate-600 mt-0.5">
          {job.company.name}
        </p>
      </div>

      {/* Metadata line */}
      {metaParts.length > 0 && (
        <div className="flex items-start gap-1 text-xs text-slate-500 mb-2">
          <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" />
          <span className="line-clamp-1">{metaParts.join(" · ")}</span>
        </div>
      )}

      {/* Salary */}
      {salaryText && salaryText !== "Not Disclosed" && (
        <p className="text-sm font-semibold text-slate-900 mb-2">
          {salaryText}
        </p>
      )}

      {/* Batch & Closing Date (Restored) */}
      {(batchText || closingText) && (
        <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
          {batchText && (
            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
              Batch: {batchText}
            </span>
          )}
          {closingText && (
            <span className="text-amber-800 text-[11px] font-medium">
              {closingText}
            </span>
          )}
        </div>
      )}

      {/* Skills */}
      {displaySkills && displaySkills.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-auto pt-2">
          {displaySkills.slice(0, 4).map((skill, i) => (
            <span key={i} className="text-[11px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
              {skill}
            </span>
          ))}
          {displaySkills.length > 4 && (
            <span className="text-[11px] text-slate-400 self-center">
              +{displaySkills.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
        <span className="flex items-center gap-1 text-xs text-slate-400" suppressHydrationWarning>
          <Clock className="w-3 h-3" />
          <span suppressHydrationWarning>{formatRelativeTime(job.posted_at || job.first_seen_at)}</span>
        </span>

        <div className="flex items-center gap-1.5">
          {!isAdmin && (
            <>
              <button
                onClick={handleToggleBookmark}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  bookmarked
                    ? "text-slate-900"
                    : "text-slate-400 hover:text-slate-600"
                }`}
                title={bookmarked ? "Saved" : "Save"}
              >
                <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? "fill-current text-slate-900" : ""}`} />
              </button>

              <button
                onClick={handleQuickMarkApplied}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  applied
                    ? "text-emerald-600"
                    : "text-slate-400 hover:text-emerald-600"
                }`}
                title={applied ? "Tracked as Applied" : "Mark as Applied"}
              >
                <CheckCircle2 className={`w-3.5 h-3.5 ${applied ? "fill-emerald-100" : ""}`} />
              </button>
            </>
          )}

          <Link
            href={`/jobs/${job.slug}`}
            onClick={handleJobClick}
            className="px-2.5 py-1 text-xs font-medium text-slate-700 border border-slate-200 rounded hover:bg-slate-50 transition-colors"
          >
            Details
          </Link>

          {job.apply_url && (
            <a
              href={job.apply_url}
              onClick={handleApplyClick}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded transition-colors cursor-pointer"
            >
              Apply
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
