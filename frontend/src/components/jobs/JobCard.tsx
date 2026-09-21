"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bookmark, CheckCircle2 } from "lucide-react";
import { Job } from "@/lib/api";
import { formatSalary, formatRelativeTime, formatDate, sanitizeJobSkills } from "@/lib/utils";
import { getCurrentUser, markJobApplied, isJobApplied, toggleBookmark, isJobBookmarked, User } from "@/lib/auth";
import { trackEvent } from "@/lib/telemetry";

interface JobCardProps {
  job: Job;
}

// Freshness dot indicator from posted_at / first_seen_at
function getFreshness(dateStr: string | null | undefined): { label: string; dotClass: string } | null {
  if (!dateStr) return null;
  const diffMs = Date.now() - new Date(dateStr).getTime();
  if (isNaN(diffMs) || diffMs < 0) return null;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMin < 60)    return { label: diffMin <= 1 ? "just now" : `${diffMin} min ago`, dotClass: "bg-emerald-500" };
  if (diffHours < 24)  return { label: `${diffHours}h ago`, dotClass: "bg-emerald-400" };
  if (diffDays <= 3)   return { label: `${diffDays}d ago`, dotClass: "bg-amber-400" };
  return { label: formatRelativeTime(dateStr) || "", dotClass: "bg-slate-300" };
}

const SENIOR_TITLE_REGEX = /\b(senior|sr\.?|lead|staff|principal|director|head of|vp|manager|architect|partner)\b/i;

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
  const expMin = job.experience_min;
  const expMax = job.experience_max;
  const isIntern =
    job.employment_type?.toLowerCase().includes("intern") ||
    job.title.toLowerCase().includes("intern");

  const expText = expMin === 0
    ? (isIntern ? "Intern" : "0–1 Yrs")
    : expMin === 1
    ? `1–${expMax || 3} Yrs`
    : expMin !== null && expMin !== undefined
    ? `${expMin}+ Yrs`
    : null;

  // Fresher Friendly: only when data actually qualifies
  const isFresherFriendly =
    !SENIOR_TITLE_REGEX.test(job.title) &&
    (expMin === 0 || expMin === null || expMin === undefined) &&
    (expMax === null || expMax === undefined || expMax <= 2);

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

  // Freshness indicator
  const freshness = getFreshness(job.posted_at || job.first_seen_at);

  // Metadata line parts (location · mode · type — no exp, shown separately)
  const metaParts: string[] = [];
  if (locationText) metaParts.push(locationText);
  if (job.work_mode) metaParts.push(job.work_mode);
  if (job.employment_type) metaParts.push(job.employment_type);

  return (
    <article className="bg-white border border-slate-200 rounded-md px-4 py-3.5 hover:border-slate-300 hover:shadow-xs transition-all group">

      {/* Row 1: Title + bookmark/applied actions */}
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link href={`/jobs/${job.slug}`} onClick={handleJobClick} className="min-w-0">
              <h3 className="font-semibold text-[15px] leading-snug text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1">
                {job.title}
              </h3>
            </Link>
            {isFresherFriendly && (
              <span className="shrink-0 text-[10px] font-semibold text-teal-700 border border-teal-200 bg-teal-50 px-1.5 py-px rounded-sm leading-tight">
                Fresher Friendly
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-0.5 font-medium">{job.company.name}</p>
        </div>

        {/* Bookmark + Mark Applied — top-right */}
        <div className="flex items-center gap-1 shrink-0 mt-0.5">
          {!isAdmin && (
            <>
              <button
                onClick={handleToggleBookmark}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  bookmarked ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
                }`}
                title={bookmarked ? "Saved" : "Save"}
              >
                <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? "fill-current text-slate-900" : ""}`} />
              </button>

              <button
                onClick={handleQuickMarkApplied}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  applied ? "text-emerald-600" : "text-slate-400 hover:text-emerald-600"
                }`}
                title={applied ? "Tracked as Applied" : "Mark as Applied"}
              >
                <CheckCircle2 className={`w-3.5 h-3.5 ${applied ? "fill-emerald-100" : ""}`} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Row 2: Location · Mode · Type */}
      {metaParts.length > 0 && (
        <p className="mt-1.5 text-xs text-slate-500 line-clamp-1">
          {metaParts.join(" · ")}
        </p>
      )}

      {/* Row 3: Salary (if available) */}
      {salaryText && salaryText !== "Not Disclosed" && (
        <p className="mt-1 text-sm font-semibold text-slate-800">{salaryText}</p>
      )}

      {/* Row 4: Experience · Batch · Deadline */}
      {(expText || batchText || closingText) && (
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
          {expText && (
            <span className="text-slate-500">
              <span className="font-medium text-slate-700">{expText}</span> exp
            </span>
          )}
          {batchText && (
            <span className="bg-slate-100 text-slate-600 px-1.5 py-px rounded font-medium">
              Batch {batchText}
            </span>
          )}
          {closingText && (
            <span className="text-amber-700 font-medium">{closingText}</span>
          )}
        </div>
      )}

      {/* Row 5: Skills */}
      {displaySkills && displaySkills.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {displaySkills.slice(0, 5).map((skill, i) => (
            <span key={i} className="text-[11px] bg-slate-50 border border-slate-200 px-1.5 py-px rounded text-slate-600">
              {skill}
            </span>
          ))}
          {displaySkills.length > 5 && (
            <span className="text-[11px] text-slate-400 self-center">+{displaySkills.length - 5}</span>
          )}
        </div>
      )}

      {/* Row 6: Footer — freshness dot + CTA buttons */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-xs text-slate-400" suppressHydrationWarning>
          {freshness && (
            <span className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${freshness.dotClass}`} />
          )}
          <span suppressHydrationWarning>{freshness?.label || ""}</span>
        </span>

        <div className="flex items-center gap-1.5">
          <Link
            href={`/jobs/${job.slug}`}
            onClick={handleJobClick}
            className="px-2.5 py-1 text-xs font-medium text-slate-600 border border-slate-200 rounded hover:bg-slate-50 transition-colors"
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
    </article>
  );
}
