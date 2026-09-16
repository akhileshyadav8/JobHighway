"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Clock, Briefcase, GraduationCap, Building2, Calendar, Bookmark, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Job } from "@/lib/api";
import { formatSalary, formatRelativeTime, formatDate, getWorkModeColor, getEmploymentTypeColor, sanitizeJobSkills } from "@/lib/utils";
import { getCurrentUser, markJobApplied, isJobApplied, toggleBookmark, isJobBookmarked } from "@/lib/auth";
import { trackEvent } from "@/lib/telemetry";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const router = useRouter();
  const [applied, setApplied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const stringJobId = String(job.id);
    const user = getCurrentUser();
    if (user) {
      setApplied(isJobApplied(user.id, stringJobId));
      setBookmarked(isJobBookmarked(user.id, stringJobId));
    }
    const syncState = () => {
      const u = getCurrentUser();
      if (u) {
        setApplied(isJobApplied(u.id, stringJobId));
        setBookmarked(isJobBookmarked(u.id, stringJobId));
      }
    };
    window.addEventListener("jobpulse_applications_change", syncState);
    window.addEventListener("jobpulse_bookmarks_change", syncState);
    return () => {
      window.removeEventListener("jobpulse_applications_change", syncState);
      window.removeEventListener("jobpulse_bookmarks_change", syncState);
    };
  }, [job.id]);

  const handleApplyClick = () => {
    trackEvent("apply_click", {
      jobId: String(job.id),
      title: job.title,
      company: job.company.name
    });
    const user = getCurrentUser();
    if (user) {
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

  const isFresherRole = job.experience_min === 0 || 
    job.employment_type?.toLowerCase().includes("intern") || 
    job.title.toLowerCase().includes("intern") ||
    job.title.toLowerCase().includes("trainee") ||
    job.title.toLowerCase().includes("graduate") ||
    job.title.toLowerCase().includes("fresher");

  const isSeniorRole = (job.experience_min !== null && job.experience_min >= 5) || 
    /\b(senior|sr\.?|lead|principal|director|head|manager)\b/i.test(job.title);

  const expBadgeText = job.experience_min === 0
    ? (job.employment_type?.toLowerCase().includes("intern") || job.title.toLowerCase().includes("intern") ? "🎓 Fresher / Intern" : "🎯 0–1 Yrs (Fresher)")
    : job.experience_min === 1
    ? `💼 1–${job.experience_max || 3} Yrs`
    : job.experience_min !== null
    ? `💼 ${job.experience_min}+ Yrs`
    : isFresherRole
    ? "🎯 0–1 Yrs (Fresher)"
    : "🎯 Fresher Friendly";

  return (
    <Card className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/90 hover:border-teal-400/80 dark:hover:border-teal-600/70 shadow-xs hover:shadow-xl hover:shadow-slate-200/60 dark:hover:shadow-teal-950/20 transition-all duration-200 rounded-2xl flex flex-col h-full overflow-hidden group">
      <CardContent className="p-5 flex-1">
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-3.5 items-center">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/60 dark:to-cyan-950/40 border border-teal-200/70 dark:border-teal-800/60 flex items-center justify-center text-teal-700 dark:text-teal-300 font-bold text-lg flex-shrink-0 shadow-2xs">
              {job.company.name.charAt(0)}
            </div>
            <div>
              <Link href={`/jobs/${job.slug}`} onClick={handleJobClick} className="group/title">
                <h3 className="font-bold text-base md:text-lg line-clamp-2 text-slate-900 dark:text-slate-100 group-hover/title:text-teal-600 dark:group-hover/title:text-teal-400 transition-colors leading-snug">
                  {job.title}
                </h3>
              </Link>
              <div className="flex items-center text-slate-600 dark:text-slate-400 text-xs md:text-sm font-medium mt-0.5">
                <Building2 className="w-3.5 h-3.5 mr-1 text-slate-400" />
                <span className="line-clamp-1">{job.company.name}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3.5">
          {job.location.slice(0, 2).map((loc, i) => (
            <div key={i} className="flex items-center text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 px-2 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-700/60">
              <MapPin className="w-3 h-3 mr-1 text-slate-400 shrink-0" />
              <span className="truncate max-w-[180px]">{loc}</span>
            </div>
          ))}
          {job.location.length > 2 && (
            <span className="text-xs text-slate-400 dark:text-slate-500 self-center">
              +{job.location.length - 2} more
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3.5">
          <Badge 
            title={job.salary_basis || "Based on verified hiring records and role market benchmarks"}
            className="bg-emerald-50 text-emerald-800 border-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/80 font-semibold shadow-2xs flex items-center gap-1 cursor-help text-xs"
          >
            <span>💰 {formatSalary(job.salary_min, job.salary_max, job.salary_currency, job.salary_period, true)}</span>
          </Badge>
          <Badge className={`${getEmploymentTypeColor(job.employment_type)} text-xs`}>
            {job.employment_type}
          </Badge>
          <Badge className={`${getWorkModeColor(job.work_mode)} text-xs`}>
            {job.work_mode}
          </Badge>
          <Badge className={`${
            isFresherRole
              ? "bg-teal-50 text-teal-800 border-teal-200/80 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800/80 font-semibold"
              : isSeniorRole
              ? "bg-purple-50 text-purple-800 border-purple-200/80 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800/80 font-semibold"
              : "bg-blue-50 text-blue-800 border-blue-200/80 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800/80 font-medium"
          } text-xs shadow-2xs flex items-center gap-1`}>
            <span>{expBadgeText}</span>
          </Badge>
        </div>

        <div className="flex items-center gap-1.5 mb-3 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-800/40 px-2.5 py-1 rounded-lg border border-slate-200/60 dark:border-slate-800/60 w-fit">
          <GraduationCap className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span>Batch: {job.eligible_batches && job.eligible_batches.length > 0 ? job.eligible_batches.join(', ') : 'Any Batch'}</span>
        </div>

        {job.deadline ? (
          <div className="flex items-center gap-1.5 mb-4 text-xs font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800/60 w-fit">
            <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Deadline: {formatDate(job.deadline)}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 mb-4 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/60 w-fit">
            <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>🔥 Apply ASAP (Rolling Hiring)</span>
          </div>
        )}

        {displaySkills && displaySkills.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto pt-2 border-t border-slate-100 dark:border-slate-800/60">
            {displaySkills.slice(0, 3).map((skill, i) => (
              <span key={i} className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-slate-600 dark:text-slate-300 font-medium">
                {skill}
              </span>
            ))}
            {displaySkills.length > 3 && (
              <span className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md text-slate-500 dark:text-slate-400 font-medium">
                +{displaySkills.length - 3}
              </span>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-3.5 mt-auto flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40">
        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400" suppressHydrationWarning>
          <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
          <span suppressHydrationWarning>{formatRelativeTime(job.posted_at || job.first_seen_at)}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleToggleBookmark}
            className={`p-2 rounded-lg border transition-all cursor-pointer ${
              bookmarked
                ? "bg-teal-50 dark:bg-teal-950/60 border-teal-300 dark:border-teal-800 text-teal-600 dark:text-teal-400"
                : "border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            }`}
            title={bookmarked ? "Saved in Wishlist" : "Save to Wishlist"}
          >
            <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? "fill-current" : ""}`} />
          </button>

          <button
            onClick={handleQuickMarkApplied}
            className={`p-2 rounded-lg border transition-all cursor-pointer ${
              applied
                ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400"
                : "border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-emerald-600"
            }`}
            title={applied ? "Tracked as Applied" : "Mark as Applied in Dashboard"}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${applied ? "fill-current text-white dark:text-slate-900 bg-emerald-500 rounded-full" : ""}`} />
          </button>

          <Link
            href={`/jobs/${job.slug}`}
            onClick={handleJobClick}
            className="inline-flex items-center justify-center px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-all"
          >
            Details
          </Link>

          {job.apply_url && (
            <a
              href={job.apply_url}
              onClick={handleApplyClick}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-3.5 py-2 text-xs font-bold rounded-lg bg-teal-600 hover:bg-teal-500 text-white shadow-xs hover:shadow-md active:scale-95 transition-all cursor-pointer"
            >
              Apply
            </a>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
