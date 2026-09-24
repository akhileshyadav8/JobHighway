"use client";

import { use } from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Radio, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  Building2, 
  Briefcase, 
  Clock, 
  Activity,
  History,
  Check,
  Play,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  getAdminAtsSources, 
  executeLiveAtsSync, 
  AtsSourceItem, 
  getSyncLogs, 
  SyncLogItem 
} from "@/lib/adminData";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const ATS_COMPANIES_CATALOG: Record<string, { name: string; slug: string; url: string }[]> = {
  greenhouse: [
    { name: "Cloudflare", slug: "cloudflare", url: "https://boards.greenhouse.io/cloudflare" },
    { name: "Postman", slug: "postman", url: "https://job-boards.greenhouse.io/postman" },
    { name: "Groww", slug: "groww", url: "https://job-boards.eu.greenhouse.io/groww" },
    { name: "GitLab", slug: "gitlab", url: "https://job-boards.greenhouse.io/gitlab" },
    { name: "Stripe", slug: "stripe", url: "https://stripe.com/jobs" },
    { name: "MongoDB", slug: "mongodb", url: "https://boards.greenhouse.io/mongodb" }
  ],
  lever: [
    { name: "Spotify", slug: "spotify", url: "https://jobs.lever.co/spotify" },
    { name: "Atlassian", slug: "atlassian", url: "https://jobs.lever.co/atlassian" },
    { name: "Kraken", slug: "kraken", url: "https://jobs.lever.co/kraken" }
  ],
  ashby: [
    { name: "Linear", slug: "linear", url: "https://jobs.ashbyhq.com/linear" },
    { name: "Ramp", slug: "ramp", url: "https://jobs.ashbyhq.com/ramp" },
    { name: "Replit", slug: "replit", url: "https://jobs.ashbyhq.com/replit" },
    { name: "Sentry", slug: "sentry", url: "https://jobs.ashbyhq.com/sentry" }
  ],
  workday: [
    { name: "Target", slug: "target", url: "https://target.wd5.myworkdayjobs.com/targetcareers" },
    { name: "Walmart", slug: "walmart", url: "https://walmart.wd5.myworkdayjobs.com/walmartcareers" }
  ],
  smartrecruiters: [
    { name: "Visa", slug: "visa", url: "https://jobs.smartrecruiters.com/Visa" },
    { name: "IKEA", slug: "ikea", url: "https://jobs.smartrecruiters.com/IKEA" }
  ],
  icims: [
    { name: "Microsoft", slug: "microsoft", url: "https://careers.microsoft.com" },
    { name: "FedEx", slug: "fedex", url: "https://careers.fedex.com" }
  ],
  taleo: [
    { name: "Oracle", slug: "oracle", url: "https://oracle.taleo.net/careersection" },
    { name: "Boeing", slug: "boeing", url: "https://boeing.taleo.net" }
  ],
  official_domains: [
    { name: "Google", slug: "google", url: "https://careers.google.com" },
    { name: "Apple", slug: "apple", url: "https://jobs.apple.com" }
  ]
};

export default function AdminSourceDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const [sources, setSources] = useState<AtsSourceItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [testingSlug, setTestingSlug] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [syncLogs, setSyncLogs] = useState<SyncLogItem[]>([]);

  useEffect(() => {
    setSources(getAdminAtsSources());
    setSyncLogs(getSyncLogs().filter(l => l.source.toLowerCase() === slug.toLowerCase()));
  }, [slug]);

  const source = sources.find(s => s.slug === slug) || sources[0] || {
    id: slug,
    name: slug.toUpperCase(),
    slug,
    companiesCount: 423,
    jobsCount: 18420,
    lastSync: "4 min ago",
    nextSync: "in 56 min",
    successRate: 99.8,
    status: "Healthy" as const,
    avgSyncTime: "1m 12s",
    failedRequests: 0,
    brokenLinks: 12
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSync = async () => {
    setIsSyncing(true);
    const result = await executeLiveAtsSync(slug);
    setIsSyncing(false);
    setSources(getAdminAtsSources());
    setSyncLogs(getSyncLogs().filter(l => l.source.toLowerCase() === slug.toLowerCase()));
    showToast(result.message);
  };

  const handleTestCompany = async (companySlug: string) => {
    setTestingSlug(companySlug);
    const result = await executeLiveAtsSync(slug, companySlug);
    setTestingSlug(null);
    setSources(getAdminAtsSources());
    showToast(`Tested ${companySlug}: ${result.message}`);
  };

  const endpoints = ATS_COMPANIES_CATALOG[slug] || ATS_COMPANIES_CATALOG.greenhouse;

  return (
    <div className="space-y-6 pb-12">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/mastermindak/sources" className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1 font-medium">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to ATS Sources
            </Link>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Radio className="w-6 h-6 text-teal-600" />
            <span>{source.name} Integration Engine</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational metrics, live scraper execution, and verified career endpoints for {source.name}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleSync}
            disabled={isSyncing}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-2xs gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
            <span>{isSyncing ? "Ingesting..." : "Run Sync Now"}</span>
          </Button>
          <Link href="/mastermindak/sync">
            <Button variant="outline" size="sm" className="text-xs rounded-xl">
              View Sync Logs
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <div className="text-xs text-slate-500 font-semibold mb-1">Active Synced Jobs</div>
          <div className="text-2xl font-black text-slate-900">{source.jobsCount.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">100% Direct verified</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <div className="text-xs text-slate-500 font-semibold mb-1">Hiring Companies</div>
          <div className="text-2xl font-black text-slate-900">{source.companiesCount.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400 mt-1">Verified career endpoints</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <div className="text-xs text-slate-500 font-semibold mb-1">Pipeline Success Rate</div>
          <div className="text-2xl font-black text-teal-600">{source.successRate}%</div>
          <div className="text-[11px] text-slate-400 mt-1">Avg latency: {source.avgSyncTime}</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <div className="text-xs text-slate-500 font-semibold mb-1">Broken Links</div>
          <div className="text-2xl font-black text-rose-600">{source.brokenLinks}</div>
          <div className="text-[11px] text-slate-400 mt-1">Failed requests: {source.failedRequests}</div>
        </div>
      </div>

      {/* Verified Endpoints List */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-teal-600" />
            <span>Integrated Employer Endpoints for {source.name}</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">{endpoints.length} Active Endpoints</span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {endpoints.map((ep) => {
            const isTesting = testingSlug === ep.slug;
            return (
              <div key={ep.slug} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span>{ep.name}</span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                      slug: {ep.slug}
                    </span>
                  </div>
                  <a 
                    href={ep.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-slate-400 hover:text-teal-600 font-mono text-[11px] flex items-center gap-1 mt-0.5"
                  >
                    <span>{ep.url}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  disabled={isTesting}
                  onClick={() => handleTestCompany(ep.slug)}
                  className="text-xs rounded-xl h-8 gap-1.5 border-teal-200 text-teal-700 hover:bg-teal-50"
                >
                  <Play className={`w-3 h-3 ${isTesting ? "animate-spin" : ""}`} />
                  <span>{isTesting ? "Fetching..." : "Test Fetch"}</span>
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sync History Timeline */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <History className="w-4 h-4 text-teal-600" />
          <span>Execution History &amp; Audit Trail</span>
        </h3>

        <div className="space-y-3 text-xs">
          {syncLogs.length > 0 ? (
            syncLogs.map((log) => (
              <div key={log.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">{log.source} Ingestion Event</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">{log.message}</div>
                </div>
                <div className="text-right">
                  <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${log.status === "completed" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                    {log.status.toUpperCase()}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1">{log.timestamp}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-slate-400">
              No recent sync executions recorded for {source.name}. Click &quot;Run Sync Now&quot; above to initiate live ingestion.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
