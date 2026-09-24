"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Copy, ArrowLeft, GitMerge, Check, EyeOff, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { detectJobDuplicates, resolveDuplicate, DuplicateCluster } from "@/lib/adminData";

export default function AdminDuplicatesPage() {
  const [duplicates, setDuplicates] = useState<DuplicateCluster[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setDuplicates(detectJobDuplicates());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleMerge = (id: string, title: string) => {
    resolveDuplicate(id, "merge");
    setDuplicates(detectJobDuplicates());
    showToast(`Merged duplicate URLs for "${title}". Secondary endpoint de-indexed.`);
  };

  const handleDismiss = (id: string, title: string) => {
    resolveDuplicate(id, "dismiss");
    setDuplicates(detectJobDuplicates());
    showToast(`Marked "${title}" as verified distinct posting.`);
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
            <Copy className="w-5 h-5 text-indigo-600" />
            <span>Duplicate Detection ({duplicates.length})</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Identify and deduplicate multiple URLs referring to identical employer roles across aggregators.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {duplicates.length === 0 ? (
          <div className="bg-white border border-slate-200/90 rounded-xl p-12 text-center text-slate-400 shadow-2xs">
            <Check className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <div className="font-bold text-slate-800 text-sm">Corpus Fully Deduplicated</div>
            <div className="text-xs text-slate-400 mt-0.5">No unresolved duplicate clusters detected across active listings.</div>
          </div>
        ) : (
          duplicates.map((dup) => (
            <div key={dup.id} className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <span>{dup.title}</span>
                    <span className="bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full text-[10px]">
                      {dup.similarity}% Similarity Match
                    </span>
                  </h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Company: <span className="font-semibold text-slate-800">{dup.company}</span> • ATS: <span className="font-semibold text-slate-800">{dup.ats}</span> • {dup.location}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <Button
                    size="sm"
                    onClick={() => handleMerge(dup.id, dup.title)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-2xs gap-1.5 cursor-pointer"
                  >
                    <GitMerge className="w-3.5 h-3.5" />
                    <span>Merge &amp; De-duplicate</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDismiss(dup.id, dup.title)}
                    className="text-xs rounded-xl text-slate-600 hover:bg-slate-50"
                  >
                    <EyeOff className="w-3.5 h-3.5 mr-1" />
                    <span>Keep Both</span>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* Primary URL */}
                <div className="p-3 rounded-lg border border-emerald-100 bg-emerald-50/30">
                  <div className="text-[11px] font-bold text-emerald-800 mb-1 flex items-center justify-between">
                    <span>Primary Canonical Posting (Retained)</span>
                    <span className="font-mono text-[10px]">HTTP 200 OK</span>
                  </div>
                  <a
                    href={dup.primaryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-600 hover:text-teal-600 font-mono text-[11px] break-all flex items-center gap-1"
                  >
                    <span>{dup.primaryUrl}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>

                {/* Secondary Duplicate URL */}
                <div className="p-3 rounded-lg border border-amber-100 bg-amber-50/30">
                  <div className="text-[11px] font-bold text-amber-800 mb-1 flex items-center justify-between">
                    <span>Secondary Duplicate URL (De-indexed on Merge)</span>
                    <span className="font-mono text-[10px]">Alias</span>
                  </div>
                  <a
                    href={dup.secondaryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-600 hover:text-teal-600 font-mono text-[11px] break-all flex items-center gap-1"
                  >
                    <span>{dup.secondaryUrl}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
