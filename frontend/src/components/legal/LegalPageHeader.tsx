import React from "react";
import type { LucideIcon } from "lucide-react";

interface LegalPageHeaderProps {
  icon: LucideIcon;
  category: string;
  title: string;
  lastUpdated?: string;
  description: string;
}

export function LegalPageHeader({
  icon: Icon,
  category,
  title,
  lastUpdated,
  description,
}: LegalPageHeaderProps) {
  return (
    <div className="mb-10 sm:mb-12">
      {/* Icon Badge & Title Row */}
      <div className="flex items-start gap-4 mb-3 sm:mb-4">
        <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100/80 text-[#0d9488] flex items-center justify-center shrink-0 shadow-2xs">
          <Icon className="w-6 h-6 stroke-[2.2]" />
        </div>
        <div>
          <div className="text-xs font-bold text-teal-700 uppercase tracking-widest font-mono">
            {category}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-[42px] font-black text-slate-900 tracking-tight leading-tight mt-1">
            {title}
          </h1>
        </div>
      </div>

      {/* Metadata */}
      {lastUpdated && (
        <div className="text-xs font-medium text-slate-400 mb-4">
          Last updated: {lastUpdated}
        </div>
      )}

      {/* Introductory Paragraph */}
      <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed max-w-3xl pb-8 border-b border-slate-200/80 font-normal">
        {description}
      </p>
    </div>
  );
}
