"use client";

import React from "react";
import { X, Crown, CheckCircle2, Zap, Bell, FileSearch } from "lucide-react";

export interface UpgradeProModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpgradeProModal({ isOpen, onClose }: UpgradeProModalProps) {
  if (!isOpen) return null;

  const proFeatures = [
    {
      title: "Real-Time ATS Webhooks",
      desc: "Instant SMS & WhatsApp alerts within 2 minutes of requisition publishing."
    },
    {
      title: "AI Resume Tailoring",
      desc: "Auto-tune keywords and bullet points for 95%+ ATS scanner pass rates."
    },
    {
      title: "Recruiter Radar & Direct Stream",
      desc: "Bypass standard applicant queues with direct hiring team outreach."
    },
    {
      title: "Deep Compensation Benchmark",
      desc: "Exact verified salary ranges and equity packages across tier-1 tech firms."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-7 relative overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-500 border border-amber-200/60 flex items-center justify-center shrink-0">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              JobHighway Pro Membership
            </h2>
            <p className="text-xs text-slate-500">
              Supercharge your job search with AI matching &amp; priority speed.
            </p>
          </div>
        </div>

        <div className="space-y-3.5 my-5">
          {proFeatures.map((f) => (
            <div key={f.title} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">{f.title}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              alert("Thank you for your interest! JobHighway Pro upgrade will activate soon.");
              onClose();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Crown className="w-4 h-4" />
            <span>Unlock Pro Access — ₹999 / quarter</span>
          </button>
        </div>
      </div>
    </div>
  );
}
