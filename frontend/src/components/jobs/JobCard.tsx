"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Clock, Bookmark, CheckCircle2, ExternalLink, ArrowLeftRight, Briefcase } from "lucide-react";
import { Job } from "@/lib/api";
import { formatSalary, formatRelativeTime, formatDate, sanitizeJobSkills, inferAtsSource } from "@/lib/utils";
import { CountryFlag } from "@/components/ui/CountryFlag";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { getCurrentUser, markJobApplied, isJobApplied, toggleBookmark, isJobBookmarked, recordRecentlyViewedJob, User } from "@/lib/auth";
import { trackEvent } from "@/lib/telemetry";

interface JobCardProps {
  job: Job;
  isCompared?: boolean;
  onToggleCompare?: (job: Job) => void;
  layout?: "grid" | "list";
}

export function JobCard({ job, isCompared, onToggleCompare, layout = "grid" }: JobCardProps) {
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
    try {
      recordRecentlyViewedJob({
        jobId: String(job.id),
        title: job.title,
        company: job.company.name,
        location: safeLocation.join(", "),
        salary: salaryText,
        workMode: job.work_mode,
        slug: job.slug,
        applyUrl: job.apply_url || undefined
      });
    } catch {
      // ignore
    }
  };

  // Experience text
  const expText = job.experience_min === 0
    ? (job.employment_type?.toLowerCase().includes("intern") || job.title.toLowerCase().includes("intern") ? "Intern" : "0–1 Yrs")
    : job.experience_min === 1
    ? `1–${job.experience_max || 3} Yrs`
    : job.experience_min !== null && job.experience_min !== undefined
    ? `${job.experience_min}+ Yrs`
    : "Experience not specified";

  // Location display — safe guard against null/non-array
  const safeLocation = Array.isArray(job.location) ? job.location : [];
  const locationText = safeLocation.length > 0
    ? safeLocation.slice(0, 2).join(", ") + (safeLocation.length > 2 ? ` +${safeLocation.length - 2}` : "")
    : "Remote / Worldwide";

  // Source ATS badge
  const atsSource = inferAtsSource(job.apply_url || job.job_url);

  // Salary display
  const salaryText = formatSalary(job.salary_min, job.salary_max, job.salary_currency, job.salary_period, true);
  const showSalary = salaryText && salaryText !== "Competitive (Disclosed on Application)";

  const postDate = job.posted_at || job.first_seen_at;
  const isNew = Boolean(postDate && (Date.now() - new Date(postDate).getTime() <= 4 * 60 * 60 * 1000) && (Date.now() - new Date(postDate).getTime() >= 0));
  const isRecent = Boolean(postDate && (Date.now() - new Date(postDate).getTime() <= 24 * 60 * 60 * 1000) && (Date.now() - new Date(postDate).getTime() >= 0));

  // ----------------------------------------------------
  // LIST VIEW LAYOUT
  // ----------------------------------------------------
  if (layout === "list") {
    return (
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 hover:border-slate-300 hover:shadow-xs transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 group">
        <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
          <CompanyLogo
            name={job.company.name}
            website={job.company.website}
            slug={job.company.slug}
            logoUrl={job.company.logo_url}
            size="md"
          />

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="text-xs font-semibold text-slate-600 truncate max-w-[180px]">
                {job.company.name}
              </span>
              {atsSource && (
                <span className="text-[10px] font-mono text-teal-700 bg-teal-50/70 border border-teal-200/50 px-1.5 py-0.2 rounded font-medium">
                  via {atsSource}
                </span>
              )}
              {isNew && (
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                  NEW
                </span>
              )}
            </div>

            <Link href={`/jobs/${job.slug}`} onClick={handleJobClick}>
              <h3 className="font-bold text-[15px] sm:text-base leading-snug text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1">
                {job.title}
              </h3>
            </Link>

            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{locationText}</span>
              </span>
              <span>·</span>
              <span>{job.work_mode || "Workplace"}</span>
              <span>·</span>
              <span>{expText}</span>
              <span>·</span>
              <span>{job.employment_type || "Full-time"}</span>
              {showSalary && (
                <>
                  <span>·</span>
                  <span className="font-semibold text-slate-900">{salaryText}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right side: Skills + Actions */}
        <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
          <div className="hidden lg:flex items-center gap-1.5">
            {displaySkills.slice(0, 2).map((skill, i) => (
              <span key={i} className="text-[11px] bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md text-slate-600 font-medium">
                {skill}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500" suppressHydrationWarning>
            {isRecent ? (
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0"></span>
            )}
            <span suppressHydrationWarning>{formatRelativeTime(postDate)}</span>
          </div>

          <div className="flex items-center gap-2">
            {!isAdmin && (
              <button
                onClick={handleToggleBookmark}
                className={`p-1.5 rounded-md hover:bg-slate-100 transition-colors cursor-pointer ${
                  bookmarked ? "text-slate-900" : "text-slate-300 hover:text-slate-600"
                }`}
                title={bookmarked ? "Saved job" : "Save job"}
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-current text-slate-900" : ""}`} />
              </button>
            )}

            <Link
              href={`/jobs/${job.slug}`}
              onClick={handleJobClick}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              Details
            </Link>

            {job.apply_url && (
              <a
                href={job.apply_url}
                onClick={handleApplyClick}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
              >
                <span>Apply Official</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // GRID VIEW CARD LAYOUT (EXACTLY MATCHING IMAGE 1)
  // ----------------------------------------------------
  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 sm:p-4 hover:border-slate-300 hover:shadow-xs transition-all duration-200 flex flex-col h-full group relative">
      {/* Top Header: Logo + Company Name (NEW + Bookmark on right) */}
      <div className="flex items-start justify-between gap-2.5 mb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <CompanyLogo
            name={job.company.name}
            website={job.company.website}
            slug={job.company.slug}
            logoUrl={job.company.logo_url}
            size="sm"
          />

          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-800 truncate">
              {job.company.name}
            </h4>
            {atsSource && (
              <span className="text-[10px] font-mono text-teal-700 font-medium block truncate">
                via {atsSource}
              </span>
            )}
          </div>
        </div>

        {/* Right header indicators: NEW badge & Bookmarks */}
        <div className="flex items-center gap-1 shrink-0">
          {isNew && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/80">
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
              <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? "fill-current text-slate-900" : ""}`} />
            </button>
          )}
        </div>
      </div>

      {/* Role Title */}
      <div className="mb-2">
        <Link href={`/jobs/${job.slug}`} onClick={handleJobClick}>
          <h3 className="font-bold text-base leading-snug text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1">
            {job.title}
          </h3>
        </Link>
      </div>

      {/* Hierarchy Line 1: Location • Work Mode */}
      <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-500 mb-1">
        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="truncate">
          {locationText}
          {job.work_mode ? ` · ${job.work_mode}` : ""}
        </span>
      </div>

      {/* Hierarchy Line 2: Experience • Job Type */}
      <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-500 mb-2.5">
        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="truncate">
          {expText}
          {job.employment_type ? ` · ${job.employment_type}` : " · Full-time"}
        </span>
      </div>

      {/* Salary (if present and meaningful) */}
      {showSalary && (
        <p className="text-xs font-bold text-slate-800 mb-2.5">
          {salaryText}
        </p>
      )}

      {/* Relevant skills / technologies pills */}
      <div className="flex flex-wrap gap-1 mt-auto pt-1 mb-3">
        {displaySkills && displaySkills.length > 0 ? (
          <>
            {displaySkills.slice(0, 3).map((skill, i) => (
              <span key={i} className="text-[10px] bg-slate-50 border border-slate-200/90 px-1.5 py-0.5 rounded text-slate-600 font-medium">
                {skill}
              </span>
            ))}
            {displaySkills.length > 3 && (
              <span className="text-[10px] text-teal-700 bg-teal-50/70 border border-teal-200/50 px-1.5 py-0.5 rounded self-center font-semibold">
                +{displaySkills.length - 3}
              </span>
            )}
          </>
        ) : (
          <span className="text-[10px] text-slate-400 italic">Official ATS Posting</span>
        )}
      </div>

      {/* Card Footer: Status dot + Posted time on left, Details + Apply on right */}
      <div className="flex items-center justify-between gap-1 pt-2.5 border-t border-slate-100 mt-auto">
        <div className="flex items-center gap-1 text-[11px] text-slate-500 whitespace-nowrap shrink-0" suppressHydrationWarning>
          {isRecent ? (
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0"></span>
          )}
          <span suppressHydrationWarning className="text-slate-600 font-medium">
            {formatRelativeTime(postDate)}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {!isAdmin && (
            <button
              onClick={handleQuickMarkApplied}
              className={`p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer hidden sm:flex items-center justify-center ${
                applied ? "text-emerald-600" : "text-slate-300 hover:text-emerald-600"
              }`}
              title={applied ? "Tracked as Applied" : "Mark as Applied"}
            >
              <CheckCircle2 className={`w-[14px] h-[14px] ${applied ? "fill-emerald-100 text-emerald-600" : ""}`} />
            </button>
          )}

          {onToggleCompare && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleCompare(job);
              }}
              className={`p-1 rounded text-xs transition-colors cursor-pointer hidden sm:flex items-center justify-center ${
                isCompared
                  ? "bg-teal-50 border-teal-300 text-teal-700 font-semibold"
                  : "border-slate-200 text-slate-400 hover:text-slate-800 hover:bg-slate-50"
              }`}
              title={isCompared ? "Remove from comparison" : "Compare this job side-by-side"}
            >
              <ArrowLeftRight className="w-[14px] h-[14px]" />
            </button>
          )}

          <Link
            href={`/jobs/${job.slug}`}
            onClick={handleJobClick}
            className="px-2 py-1 text-[11px] font-semibold text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-colors"
          >
            Details
          </Link>

          {job.apply_url && (
            <a
              href={job.apply_url}
              onClick={handleApplyClick}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1 text-[11px] font-semibold bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white rounded transition-colors cursor-pointer inline-flex items-center gap-1 shadow-2xs"
            >
              <span>Apply</span>
              <ExternalLink className="w-3 h-3 shrink-0" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
