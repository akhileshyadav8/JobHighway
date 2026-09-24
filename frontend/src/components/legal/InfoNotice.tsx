import React from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface InfoNoticeProps {
  icon: LucideIcon;
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
}

export function InfoNotice({
  icon: Icon,
  title,
  description,
  buttonText,
  buttonHref,
}: InfoNoticeProps) {
  return (
    <div className="bg-teal-50/60 border border-teal-100 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-12 sm:mt-14 shadow-2xs">
      <div className="flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-full bg-teal-100/80 text-[#0d9488] flex items-center justify-center shrink-0 mt-0.5">
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-slate-900 leading-tight">
            {title}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      <Link href={buttonHref} className="shrink-0 w-full sm:w-auto">
        <button className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white border border-slate-200 text-teal-700 hover:text-teal-800 hover:border-teal-300 font-semibold text-xs shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer">
          <span>{buttonText}</span>
          <span aria-hidden="true">&rarr;</span>
        </button>
      </Link>
    </div>
  );
}
