"use client";

import { mockJobs, mockCompanies } from "@/lib/mock-data";
import { getAllUsersForAdmin, getAppliedJobs, User, AppliedJob } from "@/lib/auth";
import { getAnalyticsSummary, AnalyticsEvent, AnalyticsSummary } from "@/lib/telemetry";

export interface AtsSourceItem {
  id: string;
  name: string;
  slug: string;
  companiesCount: number;
  jobsCount: number;
  lastSync: string;
  nextSync: string;
  successRate: number;
  status: "Healthy" | "Delayed" | "Failed" | "Warning";
  avgSyncTime: string;
  failedRequests: number;
  brokenLinks: number;
}

export interface SyncLogItem {
  id: string;
  source: string;
  status: "completed" | "failed" | "running" | "scheduled";
  message: string;
  jobsProcessed: number;
  timestamp: string;
  duration: string;
}

export interface LinkHealthItem {
  id: string;
  jobTitle: string;
  company: string;
  url: string;
  httpStatus: number;
  statusText: string;
  statusType: "healthy" | "redirect" | "broken" | "expired";
  lastChecked: string;
  attempts: number;
  ats: string;
}

export interface DataQualityIssue {
  id: string;
  jobTitle: string;
  company: string;
  issueType: "missing_company" | "missing_location" | "missing_salary" | "suspicious_url" | "duplicate_detected" | "missing_description";
  severity: "critical" | "warning" | "info";
  description: string;
  detectedAt: string;
}

export interface AdminAlert {
  id: string;
  category: "CRITICAL" | "WARNING" | "INFO";
  title: string;
  message: string;
  source: string;
  timestamp: string;
  status: "unread" | "read" | "resolved";
}

// Pre-configured ATS Sources based on actual JobPulse supported platforms
export const DEFAULT_ATS_SOURCES: AtsSourceItem[] = [
  {
    id: "greenhouse",
    name: "Greenhouse",
    slug: "greenhouse",
    companiesCount: 423,
    jobsCount: 18420,
    lastSync: "4 min ago",
    nextSync: "in 56 min",
    successRate: 99.8,
    status: "Healthy",
    avgSyncTime: "1m 12s",
    failedRequests: 2,
    brokenLinks: 14
  },
  {
    id: "lever",
    name: "Lever",
    slug: "lever",
    companiesCount: 312,
    jobsCount: 12381,
    lastSync: "8 min ago",
    nextSync: "in 52 min",
    successRate: 99.6,
    status: "Healthy",
    avgSyncTime: "58s",
    failedRequests: 3,
    brokenLinks: 19
  },
  {
    id: "workday",
    name: "Workday",
    slug: "workday",
    companiesCount: 284,
    jobsCount: 8920,
    lastSync: "21 min ago",
    nextSync: "in 39 min",
    successRate: 98.1,
    status: "Delayed",
    avgSyncTime: "2m 45s",
    failedRequests: 18,
    brokenLinks: 42
  },
  {
    id: "ashby",
    name: "Ashby",
    slug: "ashby",
    companiesCount: 146,
    jobsCount: 6421,
    lastSync: "1 hr ago",
    nextSync: "in 0 min",
    successRate: 97.4,
    status: "Warning",
    avgSyncTime: "1m 35s",
    failedRequests: 12,
    brokenLinks: 28
  },
  {
    id: "smartrecruiters",
    name: "SmartRecruiters",
    slug: "smartrecruiters",
    companiesCount: 98,
    jobsCount: 4221,
    lastSync: "2 hrs ago",
    nextSync: "in 10 min",
    successRate: 99.1,
    status: "Healthy",
    avgSyncTime: "1m 05s",
    failedRequests: 4,
    brokenLinks: 8
  },
  {
    id: "icims",
    name: "iCIMS",
    slug: "icims",
    companiesCount: 76,
    jobsCount: 3890,
    lastSync: "2 hrs ago",
    nextSync: "in 14 min",
    successRate: 99.2,
    status: "Healthy",
    avgSyncTime: "1m 40s",
    failedRequests: 5,
    brokenLinks: 12
  },
  {
    id: "taleo",
    name: "Taleo",
    slug: "taleo",
    companiesCount: 62,
    jobsCount: 2814,
    lastSync: "3 hrs ago",
    nextSync: "in 6 min",
    successRate: 97.1,
    status: "Failed",
    avgSyncTime: "3m 10s",
    failedRequests: 24,
    brokenLinks: 59
  },
  {
    id: "official_domains",
    name: "Official Domains",
    slug: "official_domains",
    companiesCount: 1240,
    jobsCount: 6590,
    lastSync: "45 min ago",
    nextSync: "in 15 min",
    successRate: 98.7,
    status: "Healthy",
    avgSyncTime: "2m 15s",
    failedRequests: 11,
    brokenLinks: 31
  }
];

// Helper to determine ATS platform from job url
export function detectAtsPlatform(url: string = ""): string {
  const u = url.toLowerCase();
  if (u.includes("greenhouse")) return "Greenhouse";
  if (u.includes("lever")) return "Lever";
  if (u.includes("workday") || u.includes("myworkdayjobs")) return "Workday";
  if (u.includes("ashby")) return "Ashby";
  if (u.includes("smartrecruiters")) return "SmartRecruiters";
  if (u.includes("icims")) return "iCIMS";
  if (u.includes("taleo")) return "Taleo";
  return "Official Domains";
}

// Generate link health records from jobs
export function getLinkHealthRecords(): LinkHealthItem[] {
  const sampleJobs = mockJobs.slice(0, 30);
  return sampleJobs.map((j, idx) => {
    const isBroken = idx === 0 || idx === 3 || idx === 7 || idx === 12;
    const isRedirect = idx === 1 || idx === 5 || idx === 11;
    const isExpired = idx === 2 || idx === 8;

    let httpStatus = 200;
    let statusText = "OK";
    let statusType: LinkHealthItem["statusType"] = "healthy";

    if (isBroken) {
      httpStatus = idx === 0 ? 404 : idx === 3 ? 403 : idx === 7 ? 500 : 404;
      statusText = httpStatus === 404 ? "Not Found" : httpStatus === 403 ? "Forbidden" : "Server Error";
      statusType = "broken";
    } else if (isRedirect) {
      httpStatus = 301;
      statusText = "Moved Permanently";
      statusType = "redirect";
    } else if (isExpired) {
      httpStatus = 410;
      statusText = "Expired / Removed";
      statusType = "expired";
    }

    return {
      id: `lh_${j.id || idx}`,
      jobTitle: j.title,
      company: j.company?.name || "Verified Hiring Partner",
      url: j.apply_url || j.job_url || "https://jobpulse.io",
      httpStatus,
      statusText,
      statusType,
      lastChecked: `${Math.floor(idx * 0.8) + 1} hours ago`,
      attempts: isBroken ? 3 : 1,
      ats: detectAtsPlatform(j.apply_url || j.job_url)
    };
  });
}

// Generate data quality records
export function getDataQualityIssues(): DataQualityIssue[] {
  return [
    {
      id: "dq_1",
      jobTitle: "Senior Frontend Engineer",
      company: "Unknown Corp (Pending Verification)",
      issueType: "missing_company",
      severity: "critical",
      description: "Company entity ID is unmapped in the corporate directory.",
      detectedAt: "10 mins ago"
    },
    {
      id: "dq_2",
      jobTitle: "Fullstack Python Developer",
      company: "Groww",
      issueType: "missing_location",
      severity: "warning",
      description: "Location array is empty; defaulting to Remote fallback.",
      detectedAt: "25 mins ago"
    },
    {
      id: "dq_3",
      jobTitle: "Data Analyst - Product Operations",
      company: "Postman",
      issueType: "missing_salary",
      severity: "info",
      description: "No compensation bounds stated in original JD text.",
      detectedAt: "1 hour ago"
    },
    {
      id: "dq_4",
      jobTitle: "Cloud Solutions Architect",
      company: "Cloudflare",
      issueType: "duplicate_detected",
      severity: "warning",
      description: "98% lexical match with external_id cf_sol_arch_2026.",
      detectedAt: "2 hours ago"
    },
    {
      id: "dq_5",
      jobTitle: "Lead DevOps Specialist",
      company: "MongoDB",
      issueType: "suspicious_url",
      severity: "critical",
      description: "Redirect loop detected on target ATS destination endpoint.",
      detectedAt: "3 hours ago"
    }
  ];
}

// Generate system alerts
export function getSystemAlerts(): AdminAlert[] {
  return [
    {
      id: "alt_1",
      category: "CRITICAL",
      title: "Taleo Crawler Failure",
      message: "API endpoint returned HTTP 503 for 3 consecutive sync cycles.",
      source: "Taleo Ingestion Pipeline",
      timestamp: "18 mins ago",
      status: "unread"
    },
    {
      id: "alt_2",
      category: "WARNING",
      title: "Workday Polling Delay",
      message: "Workday rate-limiter threshold reached (429 Too Many Requests). Sync backoff applied.",
      source: "Workday Adapter",
      timestamp: "45 mins ago",
      status: "unread"
    },
    {
      id: "alt_3",
      category: "WARNING",
      title: "Broken Link Spike Detected",
      message: "18 links reported 404 in the last 2 hours across financial sector postings.",
      source: "Link Health Monitor",
      timestamp: "2 hours ago",
      status: "read"
    },
    {
      id: "alt_4",
      category: "INFO",
      title: "Greenhouse Full Sync Completed",
      message: "Successfully synchronized 18,420 jobs across 423 company endpoints.",
      source: "Greenhouse Engine",
      timestamp: "4 mins ago",
      status: "read"
    },
    {
      id: "alt_5",
      category: "INFO",
      title: "Telemetry Storage Optimization",
      message: "Automated cleanup archived 2,400 expired visitor telemetry points.",
      source: "Database Maintenance",
      timestamp: "5 hours ago",
      status: "resolved"
    }
  ];
}
