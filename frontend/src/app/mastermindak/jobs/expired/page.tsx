"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, RefreshCw, CheckCircle, Trash2, ExternalLink, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  getAdminJobs, 
  updateAdminJobStatus, 
  deleteAdminJob, 
  probeUrlHealth,
  AdminJobItem 
} from "@/lib/adminData";

export default function AdminExpiredJobsPage() {
  const [expiredJobs, setExpiredJobs] = useState<AdminJobItem[]>([]);
  const [isRechecking, setIsRechecking] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    loadExpired();
  }, []);

  const loadExpired = () => {
    const all = getAdminJobs();
    setExpiredJobs(all.filter(j => j.status === "Expired"));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleReactivate = (id: string | number, title: string) => {
    updateAdminJobStatus(id, "Active");
    loadExpired();
    showToast(`Re-activated "${title}". Restored to active search index.`);
  };

  const handleRemove = (id: string | number, title: string) => {
    deleteAdminJob(id);
    loadExpired();
    showToast(`Permanently de-indexed "${title}".`);
  };

  const handleRecheckAll = async () => {
    setIsRechecking(true);
    let recovered = 0;
    
    // Probe sample of expired links
    for (const job of expiredJobs.slice(0, 5)) {
      const probe = await probeUrlHealth(job.applyUrl);
      if (probe.httpStatus === 200) {
        updateAdminJobStatus(job.id, "Active");
        recovered++;
      }
    }
    
    setIsRechecking(false);
    loadExpired();
    showToast(
      recovered > 0 
        ? `Recheck completed! Automatically recovered ${recovered} live postings that responded with HTTP 200.`
        : `Recheck completed. Verified closed endpoints across target ATS portals.`
    );
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/mastermindak/jobs" className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1 font-medium">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to All Jobs
            </Link>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <span>Expired Job Postings ({expiredJobs.length})</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit and re-verify roles that have closed or been unlisted by employer career portals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            disabled={isRechecking || expiredJobs.length === 0}
            onClick={handleRecheckAll}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-2xs gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRechecking ? "animate-spin" : ""}`} />
            <span>{isRechecking ? "Probing Career Portals..." : "Recheck All Expired"}</span>
          </Button>
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/90 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Job Title &amp; Role</th>
                <th className="p-3.5">Company</th>
                <th className="p-3.5">ATS Source</th>
                <th className="p-3.5">Unlisted Date</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expiredJobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No expired jobs found. All indexed roles are currently active and live!
                  </td>
                </tr>
              ) : (
                expiredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">
                      {job.title}
                    </td>
                    <td className="p-3.5 font-semibold text-slate-700">
                      {job.company}
                    </td>
                    <td className="p-3.5 font-mono text-[11px] text-slate-500">
                      {job.ats}
                    </td>
                    <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                      {job.posted}
                    </td>
                    <td className="p-3.5">
                      <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        UNLISTED / CLOSED
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                      <a
                        href={job.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex p-1.5 text-slate-400 hover:text-teal-600 rounded-lg hover:bg-slate-100 transition-colors"
                        title="View Destination URL"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReactivate(job.id, job.title)}
                        className="text-xs h-7 rounded-lg border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" /> Re-activate
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemove(job.id, job.title)}
                        className="text-xs h-7 rounded-lg text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="w-3 h-3 mr-1" /> Purge
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
