"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Cpu, 
  Database, 
  Radio, 
  Search, 
  CheckCircle, 
  RefreshCw, 
  Activity, 
  Zap, 
  Server
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminSystemHealthPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Cpu className="w-6 h-6 text-teal-600" />
            <span>System Infrastructure &amp; Health</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor real-time latency, PostgreSQL connection pool, and ingestion throughput.
          </p>
        </div>

        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          variant="outline"
          size="sm"
          className="text-xs rounded-xl shadow-2xs gap-1.5 cursor-pointer font-semibold self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>Refresh Metrics</span>
        </Button>
      </div>

      {/* 6 Metric Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>API Gateway</span>
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-xl font-black text-slate-900 mt-1">120 ms</div>
          <div className="text-[10px] text-emerald-600 font-bold mt-0.5">Healthy</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Database</span>
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-xl font-black text-slate-900 mt-1">18 ms</div>
          <div className="text-[10px] text-emerald-600 font-bold mt-0.5">Supabase Pool OK</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Job Pipeline</span>
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-xl font-black text-slate-900 mt-1">98.7%</div>
          <div className="text-[10px] text-emerald-600 font-bold mt-0.5">Ingestion normal</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>ATS Pipeline</span>
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-xl font-black text-slate-900 mt-1">99.2%</div>
          <div className="text-[10px] text-emerald-600 font-bold mt-0.5">8 Adapters active</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Search Latency</span>
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-xl font-black text-slate-900 mt-1">110 ms</div>
          <div className="text-[10px] text-emerald-600 font-bold mt-0.5">Sub-second indexing</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Service Uptime</span>
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-xl font-black text-slate-900 mt-1">99.9%</div>
          <div className="text-[10px] text-slate-400 font-normal mt-0.5">Last 30 days</div>
        </div>
      </div>

      {/* 4 Health Trend Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Panel 1 */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <div className="text-xs text-slate-500 font-semibold">API Requests</div>
          <div className="text-2xl font-black text-slate-900 mt-1">2.4K <span className="text-xs text-slate-400 font-normal">req/min</span></div>
          <div className="h-14 w-full mt-3 flex items-end">
            <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
              <polyline fill="none" stroke="#0d9488" strokeWidth="2" points="0,25 20,20 40,22 60,12 80,15 100,8" />
            </svg>
          </div>
        </div>

        {/* Panel 2 */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <div className="text-xs text-slate-500 font-semibold">Database Latency</div>
          <div className="text-2xl font-black text-slate-900 mt-1">18 <span className="text-xs text-slate-400 font-normal">ms</span></div>
          <div className="h-14 w-full mt-3 flex items-end">
            <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
              <polyline fill="none" stroke="#9333ea" strokeWidth="2" points="0,15 20,18 40,14 60,15 80,17 100,14" />
            </svg>
          </div>
        </div>

        {/* Panel 3 */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <div className="text-xs text-slate-500 font-semibold">Error Rate</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">0.2%</div>
          <div className="h-14 w-full mt-3 flex items-end">
            <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
              <polyline fill="none" stroke="#f43f5e" strokeWidth="2" points="0,28 20,27 40,29 60,26 80,28 100,28" />
            </svg>
          </div>
        </div>

        {/* Panel 4 */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <div className="text-xs text-slate-500 font-semibold">Sync Throughput</div>
          <div className="text-2xl font-black text-slate-900 mt-1">4.0K <span className="text-xs text-slate-400 font-normal">jobs/hr</span></div>
          <div className="h-14 w-full mt-3 flex items-end">
            <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
              <polyline fill="none" stroke="#0284c7" strokeWidth="2" points="0,20 20,18 40,15 60,12 80,10 100,6" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
