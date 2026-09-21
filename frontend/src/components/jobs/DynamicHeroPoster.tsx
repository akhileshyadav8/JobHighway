"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Job } from "@/lib/api";
import { 
  Radio, 
  MapPin, 
  ExternalLink, 
  CheckCircle2, 
  ShieldCheck,
  ChevronRight,
  Zap
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface DynamicHeroPosterProps {
  jobs: Job[];
  onSelectJob?: (job: Job) => void;
}

export function DynamicHeroPoster({ jobs, onSelectJob }: DynamicHeroPosterProps) {
  // Take top 5 freshest jobs with valid titles
  const streamJobs = (jobs || []).filter(j => j && j.title).slice(0, 5);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-cycle through the jobs every 4 seconds unless hovered
  useEffect(() => {
    if (streamJobs.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % streamJobs.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [streamJobs.length, isPaused]);

  if (streamJobs.length === 0) {
    return null;
  }

  const currentJob = streamJobs[activeIndex] || streamJobs[0];
  const companyName = currentJob.company?.name || "Verified Tech Company";
  const locationText = Array.isArray(currentJob.location) && currentJob.location.length > 0
    ? currentJob.location.slice(0, 2).join(", ")
    : "Multiple Locations / Remote";

  // Calculate freshness
  let freshnessText = "Recently posted";
  if (currentJob.posted_at) {
    try {
      freshnessText = `${formatDistanceToNow(new Date(currentJob.posted_at))} ago`;
    } catch {
      freshnessText = "Freshly indexed";
    }
  }

  return (
    <div 
      className="relative w-full rounded-2xl border border-teal-200/90 bg-gradient-to-br from-teal-50/70 via-white to-emerald-50/40 p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Subtle background radar circles */}
      <div className="absolute -top-12 -right-12 w-44 h-44 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-2 mb-3.5 relative z-10">
        <div className="inline-flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-xs font-black tracking-wider uppercase text-teal-800 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
            Live ATS Radar
          </span>
        </div>

        {/* Indicators and Stream pill */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            {activeIndex + 1} of {streamJobs.length}
          </span>
          <div className="flex gap-1">
            {streamJobs.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  idx === activeIndex ? "w-5 bg-teal-600" : "w-1.5 bg-slate-200 hover:bg-slate-300"
                }`}
                title={`View opportunity ${idx + 1}`}
                aria-label={`Opportunity ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Active Featured Opportunity Card */}
      <div className="relative z-10 bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/80 shadow-2xs transition-all duration-300">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Company Monogram Avatar */}
            <div className="w-9 h-9 rounded-lg bg-teal-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-2xs">
              {companyName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-800 truncate">{companyName}</span>
                <span title="Verified ATS Source" className="inline-flex">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                </span>
              </div>
              <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{freshnessText}</span>
              </div>
            </div>
          </div>

          <span className="text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200/80 px-2 py-0.5 rounded-md uppercase shrink-0">
            {currentJob.work_mode || "Full-time"}
          </span>
        </div>

        {/* Job Title */}
        <Link
          href={`/jobs/${currentJob.slug}`}
          className="block text-sm sm:text-base font-bold text-slate-900 hover:text-teal-600 transition-colors line-clamp-1 mb-2 tracking-tight"
        >
          {currentJob.title}
        </Link>

        {/* Key Metadata Badges */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mb-3 font-medium">
          <span className="inline-flex items-center gap-1 truncate max-w-[190px]">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{locationText}</span>
          </span>

          {currentJob.eligible_batches && currentJob.eligible_batches.length > 0 && (
            <span className="text-teal-700 font-semibold text-[11px] bg-teal-50/80 px-1.5 py-0.5 rounded">
              Batch: {currentJob.eligible_batches.join(", ")}
            </span>
          )}
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <Link
            href={`/jobs/${currentJob.slug}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors shadow-2xs"
          >
            <span>View Opportunity</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>

          {currentJob.apply_url && (
            <a
              href={currentJob.apply_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors border border-slate-200"
              title="Apply directly on company portal"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Up Next Ticker (Queue Preview) */}
      <div className="mt-3 relative z-10">
        <div className="text-[11px] font-semibold text-slate-500 mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1 text-slate-600">
            <Zap className="w-3 h-3 text-amber-500 fill-amber-400" />
            Streaming Live Ingestion
          </span>
          <span className="text-[10px] text-teal-700 font-bold">100% Direct Portals</span>
        </div>

        <div className="space-y-1.5">
          {streamJobs
            .filter((_, idx) => idx !== activeIndex)
            .slice(0, 2)
            .map((job) => (
              <button
                key={job.id || job.slug}
                onClick={() => {
                  const targetIdx = streamJobs.findIndex(j => j.slug === job.slug);
                  if (targetIdx !== -1) setActiveIndex(targetIdx);
                }}
                className="w-full text-left flex items-center justify-between gap-2 p-2 rounded-lg bg-white/70 hover:bg-white border border-slate-200/60 hover:border-teal-300 transition-all text-xs cursor-pointer group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-5 h-5 rounded bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 group-hover:bg-teal-50 group-hover:text-teal-700">
                    {(job.company?.name || "J").charAt(0)}
                  </span>
                  <span className="font-semibold text-slate-800 truncate group-hover:text-teal-700">
                    {job.title}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                  {job.company?.name}
                </span>
              </button>
            ))}
        </div>
      </div>

      {/* Footer Verified Connectors */}
      <div className="mt-3 pt-2.5 border-t border-teal-200/50 flex items-center justify-between text-[10px] text-slate-500 relative z-10 flex-wrap gap-1">
        <div className="flex items-center gap-1.5 text-teal-800 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <span>Verified ATS Connectors:</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
          <span className="bg-white/80 px-1.5 py-0.5 rounded border border-slate-200/60">Greenhouse</span>
          <span className="bg-white/80 px-1.5 py-0.5 rounded border border-slate-200/60">Lever</span>
          <span className="bg-white/80 px-1.5 py-0.5 rounded border border-slate-200/60">Workday</span>
          <span className="bg-white/80 px-1.5 py-0.5 rounded border border-slate-200/60">Ashby</span>
        </div>
      </div>
    </div>
  );
}
