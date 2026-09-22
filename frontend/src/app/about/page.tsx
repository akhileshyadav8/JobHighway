import Link from "next/link";
import { ArrowRight, ArrowDown } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | JobPulse",
  description: "Learn how JobPulse indexes jobs directly from companies' official career systems, delivering fresh opportunities without delayed third-party aggregation.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-10 sm:pt-14 md:pt-18 pb-20 sm:pb-28">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        
        {/* =======================================================
            SECTION 1 — INTRO (Asymmetric 2-Column)
        ======================================================= */}
        <section className="mb-14 sm:mb-18">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
            <div className="lg:col-span-7">
              <div className="text-[11px] font-mono font-bold tracking-widest text-teal-700 uppercase mb-3">
                About JobPulse
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Jobs should reach you while they&apos;re still fresh.
              </h1>
            </div>
            <div className="lg:col-span-5 lg:pt-8 flex flex-col items-start">
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
                JobPulse helps candidates discover job openings directly from companies&apos; official career systems, so they can find real opportunities without relying entirely on delayed or duplicated third-party listings.
              </p>
              <Link 
                href="/" 
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors group"
              >
                <span>Explore jobs</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>

        <hr className="border-slate-200 mb-14 sm:mb-18" />

        {/* =======================================================
            SECTION 1.5 — THE PROBLEM (Timing)
        ======================================================= */}
        <section className="mb-14 sm:mb-18">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
            <div className="lg:col-span-5">
              <div className="text-[11px] font-mono font-bold tracking-widest text-slate-500 uppercase mb-3">
                The Problem
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Most openings are discovered too late.
              </h2>
            </div>
            <div className="lg:col-span-7 lg:pt-6 space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              <p>
                Most job seekers discover openings after they&apos;ve already accumulated dozens of applications. By the time a job appears on a popular job board, it may already have hundreds of candidates ahead of you.
              </p>
              <p>
                The first 24–48 hours after a job is posted are when you have the highest chance of being noticed. Applications submitted early tend to get more attention from recruiters before the volume picks up.
              </p>
              <p>
                JobPulse is built around this idea — connecting directly to the systems where companies post first, so you can find opportunities before they spread widely.
              </p>
            </div>
          </div>
        </section>

        {/* =======================================================
            SECTION 2 — THE IDEA (Start with the Source)
        ======================================================= */}
        <section className="mb-14 sm:mb-18">
          <div className="max-w-3xl mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
              Start with the source.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Instead of building another directory of job links, JobPulse starts with the places where companies actually publish their openings.
            </p>
          </div>

          {/* Clean typographic flow diagram */}
          <div className="py-6 px-4 sm:px-6 bg-white border border-slate-200/90 rounded-2xl">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 md:gap-2">
              <div className="flex-1 text-center md:text-left py-2 px-3">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">Origin</span>
                <span className="font-bold text-slate-900 text-sm sm:text-base">Company</span>
              </div>

              <div className="text-slate-300 flex justify-center items-center">
                <ArrowRight className="w-4 h-4 hidden md:block" />
                <ArrowDown className="w-4 h-4 block md:hidden" />
              </div>

              <div className="flex-1 text-center md:text-left py-2 px-3">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">Host</span>
                <span className="font-bold text-slate-900 text-sm sm:text-base">Official Career System</span>
              </div>

              <div className="text-slate-300 flex justify-center items-center">
                <ArrowRight className="w-4 h-4 hidden md:block" />
                <ArrowDown className="w-4 h-4 block md:hidden" />
              </div>

              <div className="flex-1 text-center md:text-left py-2 px-3">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-teal-600 block mb-0.5">Discovery</span>
                <span className="font-bold text-teal-700 text-sm sm:text-base">JobPulse</span>
              </div>

              <div className="text-slate-300 flex justify-center items-center">
                <ArrowRight className="w-4 h-4 hidden md:block" />
                <ArrowDown className="w-4 h-4 block md:hidden" />
              </div>

              <div className="flex-1 text-center md:text-left py-2 px-3">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">Destination</span>
                <span className="font-bold text-slate-900 text-sm sm:text-base">Candidate</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-[11px] text-slate-400 font-mono">
              <span>Supported source ecosystems:</span>
              <span className="text-slate-500 font-medium">Greenhouse · Lever · Ashby · Workday</span>
            </div>
          </div>
        </section>

        <hr className="border-slate-200 mb-14 sm:mb-18" />

        {/* =======================================================
            SECTION 3 — HOW IT WORKS (4-Stage Pipeline)
        ======================================================= */}
        <section className="mb-14 sm:mb-18">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-8 sm:mb-10">
            From company posting to your screen.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="border-t border-slate-200 pt-5">
              <span className="text-xs font-mono font-bold text-teal-700 block mb-2">01</span>
              <h3 className="font-bold text-slate-900 text-base mb-2">
                Company publishes
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                A company publishes an opening on its official career system.
              </p>
            </div>

            {/* Step 2 */}
            <div className="border-t border-slate-200 pt-5">
              <span className="text-xs font-mono font-bold text-teal-700 block mb-2">02</span>
              <h3 className="font-bold text-slate-900 text-base mb-2">
                JobPulse detects
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Supported sources are checked and new or updated postings are collected.
              </p>
            </div>

            {/* Step 3 */}
            <div className="border-t border-slate-200 pt-5">
              <span className="text-xs font-mono font-bold text-teal-700 block mb-2">03</span>
              <h3 className="font-bold text-slate-900 text-base mb-2">
                JobPulse structures
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Relevant information is organized into a consistent job listing.
              </p>
            </div>

            {/* Step 4 */}
            <div className="border-t border-slate-200 pt-5">
              <span className="text-xs font-mono font-bold text-teal-700 block mb-2">04</span>
              <h3 className="font-bold text-slate-900 text-base mb-2">
                You apply directly
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                The application link takes you to the employer&apos;s official application flow.
              </p>
            </div>
          </div>
        </section>

        <hr className="border-slate-200 mb-14 sm:mb-18" />

        {/* =======================================================
            SECTION 4 — WHAT YOU GET (Clean 2-Column List)
        ======================================================= */}
        <section className="mb-14 sm:mb-18">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-8">
            More than a job link.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            {/* Left Column */}
            <div className="md:col-span-5">
              <div className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Core Listing Context
              </div>
              <ul className="divide-y divide-slate-200 border-y border-slate-200 text-sm">
                <li className="py-3 font-semibold text-slate-900 flex items-center justify-between">
                  <span>Official source</span>
                  <span className="text-xs font-normal text-slate-400">Direct ATS domain</span>
                </li>
                <li className="py-3 font-semibold text-slate-900 flex items-center justify-between">
                  <span>Direct application</span>
                  <span className="text-xs font-normal text-slate-400">No intermediaries</span>
                </li>
                <li className="py-3 font-semibold text-slate-900 flex items-center justify-between">
                  <span>Freshness information</span>
                  <span className="text-xs font-normal text-slate-400">Published timestamp</span>
                </li>
                <li className="py-3 font-semibold text-slate-900 flex items-center justify-between">
                  <span>Company details</span>
                  <span className="text-xs font-normal text-slate-400">Verified employer profile</span>
                </li>
              </ul>
            </div>

            {/* Right Column */}
            <div className="md:col-span-7">
              <div className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Role &amp; Preparation Details (when available)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 divide-y sm:divide-y-0 divide-slate-200 border-y sm:border-y-0 border-slate-200 text-sm">
                <ul className="divide-y divide-slate-200 sm:border-y sm:border-slate-200">
                  <li className="py-3 text-slate-700">Location</li>
                  <li className="py-3 text-slate-700">Work mode</li>
                  <li className="py-3 text-slate-700">Salary when available</li>
                  <li className="py-3 text-slate-700">Experience requirements</li>
                </ul>
                <ul className="divide-y divide-slate-200 sm:border-y sm:border-slate-200">
                  <li className="py-3 text-slate-700">Interview preparation</li>
                  <li className="py-3 text-slate-700">Selection rounds</li>
                  <li className="py-3 text-slate-700">Batch eligibility when available</li>
                  <li className="py-3 text-slate-700">Study resources</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-slate-200 mb-14 sm:mb-18" />

        {/* =======================================================
            SECTION 5 — FRESHNESS (Product Interface Timeline)
        ======================================================= */}
        <section className="mb-14 sm:mb-18">
          <div className="max-w-3xl mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
              Freshness is part of the product.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              JobPulse is designed around the idea that timing matters. Supported company sources are checked regularly so active openings can reach the discovery feed without depending on long aggregation cycles.
            </p>
          </div>

          {/* Minimal Product Timeline Ribbon */}
          <div className="py-6 px-5 sm:px-8 bg-white border border-slate-200/90 rounded-2xl">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-5">
              Lifecycle Progression
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 sm:gap-2 relative">
              {/* Node 1 */}
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2 mb-2 w-full">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300 shrink-0" />
                  <span className="h-px bg-slate-200 flex-1 hidden sm:block" />
                </div>
                <span className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wide">Posted</span>
                <span className="text-[11px] text-slate-500 mt-0.5">On employer ATS</span>
              </div>

              {/* Node 2 */}
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2 mb-2 w-full">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0" />
                  <span className="h-px bg-slate-200 flex-1 hidden sm:block" />
                </div>
                <span className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wide">Detected</span>
                <span className="text-[11px] text-slate-500 mt-0.5">Feed check</span>
              </div>

              {/* Node 3 */}
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2 mb-2 w-full">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500 shrink-0" />
                  <span className="h-px bg-slate-200 flex-1 hidden sm:block" />
                </div>
                <span className="text-xs font-mono font-bold text-teal-700 uppercase tracking-wide">Structured</span>
                <span className="text-[11px] text-slate-500 mt-0.5">Fields organized</span>
              </div>

              {/* Node 4 */}
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2 mb-2 w-full">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-600 shrink-0" />
                  <span className="h-px bg-slate-200 flex-1 hidden sm:block" />
                </div>
                <span className="text-xs font-mono font-bold text-teal-700 uppercase tracking-wide">Discovered</span>
                <span className="text-[11px] text-slate-500 mt-0.5">Live on JobPulse</span>
              </div>

              {/* Node 5 */}
              <div className="flex flex-col items-start col-span-2 sm:col-span-1">
                <div className="flex items-center gap-2 mb-2 w-full">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
                </div>
                <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wide">Apply</span>
                <span className="text-[11px] text-slate-500 mt-0.5">Direct to employer</span>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-slate-200 mb-14 sm:mb-18" />

        {/* =======================================================
            SECTION 6 — WHY THIS MATTERS (Less searching. More applying.)
        ======================================================= */}
        <section className="mb-14 sm:mb-18">
          <div className="max-w-3xl mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
              Less searching. More applying.
            </h2>
            <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
              <p>
                Job hunting often means checking company career pages, job boards, search engines and application portals separately.
              </p>
              <p>
                JobPulse brings discovery into one place while keeping the final application connected to the employer.
              </p>
            </div>
          </div>

          {/* Minimal Visual Comparison (No Red/Green cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Before */}
            <div className="py-5 px-6 bg-white border border-slate-200/90 rounded-2xl">
              <div className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Before
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-slate-600">
                <span>Search</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                <span>Open multiple sites</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                <span>Check whether listing is active</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                <span>Find application page</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                <span className="text-slate-900 font-semibold">Apply</span>
              </div>
            </div>

            {/* With JobPulse */}
            <div className="py-5 px-6 bg-white border border-teal-200/90 rounded-2xl">
              <div className="text-xs font-mono font-semibold uppercase tracking-wider text-teal-700 mb-3">
                With JobPulse
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-slate-800">
                <span>Search</span>
                <ArrowRight className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                <span>Discover</span>
                <ArrowRight className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                <span>Review</span>
                <ArrowRight className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                <span className="text-teal-700 font-bold">Apply officially</span>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-slate-200 mb-14 sm:mb-18" />

        {/* =======================================================
            SECTION 7 — CLOSING (Editorial Statement & Normal CTA)
        ======================================================= */}
        <section className="text-center sm:text-left py-4">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
              Find the opening. Understand the role. Apply at the source.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mb-6">
              Explore the latest jobs on JobPulse.
            </p>
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-all shadow-xs"
              >
                <span>Browse Jobs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
