"use client";

import { useEffect } from "react";
import { recordRecentlyViewedJob } from "@/lib/auth";

interface RecordRecentlyViewedProps {
  jobId: string | number;
  title: string;
  company: string;
  location: string;
  salary?: string;
  workMode?: string;
  slug?: string;
  applyUrl?: string;
}

export function RecordRecentlyViewed({
  jobId,
  title,
  company,
  location,
  salary,
  workMode,
  slug,
  applyUrl
}: RecordRecentlyViewedProps) {
  useEffect(() => {
    try {
      recordRecentlyViewedJob({
        jobId: String(jobId),
        title,
        company,
        location,
        salary,
        workMode,
        slug,
        applyUrl
      });
    } catch {
      // ignore
    }
  }, [jobId, title, company, location, salary, workMode, slug, applyUrl]);

  return null;
}
