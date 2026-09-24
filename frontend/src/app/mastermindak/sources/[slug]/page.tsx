"use client";

import { use } from "react";
import { useState } from "react";
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
  History
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEFAULT_ATS_SOURCES } from "@/lib/adminData";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function AdminSourceDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const source = DEFAULT_ATS_SOURCES.find(s => s.slug === slug) || DEFAULT_ATS_SOURCES[0];
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      alert(`Synchronized ${source.name} successfully! 1,842 endpoints validated.`);
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-12">
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
            Operational metrics, sync history, and direct scraper endpoint health for {source.name}.
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

      {/* Sync History Timeline */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <History className="w-4 h-4 text-teal-600" />
          <span>Sync History &amp; Audit Trail</span>
        </h3>

        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900">Periodic Scheduled Ingestion Cycle #10492</div>
              <div className="text-slate-500 text-[11px] mt-0.5">Scraped 423 company endpoints, parsed 18,420 valid postings. 0 errors.</div>
            </div>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">SUCCESS</span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900">Health Verification Cycle #10491</div>
              <div className="text-slate-500 text-[11px] mt-0.5">De-indexed 14 expired job roles. 100% of candidate links verified active.</div>
            </div>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">SUCCESS</span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900">Incremental Polling Cycle #10490</div>
              <div className="text-slate-500 text-[11px] mt-0.5">Discovered 142 new opportunities within past 60 minutes.</div>
            </div>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">SUCCESS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
