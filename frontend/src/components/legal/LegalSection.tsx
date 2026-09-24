import React from "react";

interface LegalSectionProps {
  number: string;
  title: string;
  children: React.ReactNode;
}

export function LegalSection({ number, title, children }: LegalSectionProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 pt-10 first:pt-2 border-b border-slate-200/70 pb-10 last:border-b-0">
      {/* Number Badge */}
      <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100/80 text-teal-700 font-bold text-sm flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
        {number}
      </div>

      {/* Main Section Content */}
      <div className="flex-1 min-w-0 space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
          {title}
        </h2>
        <div className="text-sm sm:text-[15px] text-slate-600 leading-relaxed font-normal space-y-3">
          {children}
        </div>
      </div>
    </div>
  );
}
