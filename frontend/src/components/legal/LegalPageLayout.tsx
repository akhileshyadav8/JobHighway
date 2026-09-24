import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import React from "react";

interface LegalPageLayoutProps {
  children: React.ReactNode;
}

export function LegalPageLayout({ children }: LegalPageLayoutProps) {
  return (
    <div className="relative min-h-screen bg-[#f8fafc] text-slate-800 antialiased overflow-hidden">
      {/* Subtle World Map Silhouette in Top-Right Background matching reference */}
      <div className="absolute right-0 top-0 w-full max-w-2xl h-[420px] pointer-events-none select-none overflow-hidden opacity-60">
        <div className="absolute -top-10 -right-10 w-[550px] h-[350px] bg-gradient-to-bl from-teal-200/35 via-teal-100/15 to-transparent rounded-full blur-3xl pointer-events-none" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/world.svg"
          alt=""
          className="w-full h-full object-contain object-right-top pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* Main Legal Content Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[960px] pt-8 sm:pt-10 pb-16 sm:pb-24 relative z-10">
        {/* Back to Jobs Link */}
        <div className="mb-8 sm:mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to Jobs</span>
          </Link>
        </div>

        {children}
      </div>
    </div>
  );
}
