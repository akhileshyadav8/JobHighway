import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Globe,
  Clock,
  Users,
  CheckCircle2,
  Sparkles,
  Search,
  ExternalLink,
  ShieldCheck,
  Send,
  FileText,
  User,
} from "lucide-react";
import type { Metadata } from "next";
import { getOverviewStats } from "@/lib/api";

export const metadata: Metadata = {
  title: "About | JobHighway",
  description:
    "Learn how JobHighway indexes jobs directly from companies' official career systems, delivering fresh opportunities without delayed third-party aggregation.",
};

export default async function AboutPage() {
  const stats = await getOverviewStats().catch(() => null);

  const activeJobsDisplay = stats?.total_jobs
    ? `${Number(stats.total_jobs).toLocaleString()}+`
    : "61,000+";

  const verifiedCompaniesDisplay = stats?.total_companies
    ? `${Number(stats.total_companies).toLocaleString()}+`
    : "19,000+";

  const countriesDisplay = "150+";
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 antialiased">
      {/* ========================================================
          HERO SECTION: Pixel-matched to reference design
          Eyebrow + Large Headline + Subtitle + CTA
          Right: Subtle /world.svg with 5 company logo markers & orbit lines
          ======================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f0fdfa]/60 via-white to-[#f8fafc] pt-12 pb-14 sm:pt-16 sm:pb-18 border-b border-slate-100">
        {/* Subtle mesh background */}
        <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1360px] relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
                <span>ABOUT JOBHIGHWAY</span>
              </div>

              {/* Large Main Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-black text-slate-900 tracking-tight leading-[1.15] mb-4">
                Jobs should reach you<br />
                while they&apos;re <span className="text-[#0d9488]">still fresh.</span>
              </h1>

              {/* Paragraph */}
              <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed mb-8">
                JobHighway helps you discover real job openings directly from companies&apos; official career systems, so you can find the right opportunities without relying on delayed or duplicate listings.
              </p>

              {/* Primary CTA Button */}
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0d9488] hover:bg-[#0f766e] text-white text-sm font-semibold transition-all shadow-xs hover:shadow-md cursor-pointer"
              >
                <span>Explore Jobs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right Column: World Map + Floating Company Logos & Orbit Lines */}
            <div className="lg:col-span-6 relative hidden sm:flex items-center justify-center min-h-[380px] lg:min-h-[420px]">
              <div className="relative w-full max-w-[620px] h-[380px] flex items-center justify-center">
                
                {/* World Map Vector Backdrop with soft ambient glow matching Companies page */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  {/* Soft radial glow behind the world map */}
                  <div className="absolute w-[500px] h-[320px] bg-gradient-to-tr from-teal-200/40 via-teal-100/25 to-transparent rounded-full blur-2xl pointer-events-none" />
                  
                  {/* Detailed vector world map matching Companies page visibility */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/world.svg"
                    alt="Global Career Network World Map"
                    className="w-full h-full object-contain pointer-events-none select-none relative z-0"
                  />
                </div>

                {/* Subtle Dashed Orbital Lines */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none z-10"
                  viewBox="0 0 620 380"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="310"
                    cy="190"
                    r="140"
                    stroke="#0d9488"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    strokeOpacity="0.4"
                  />
                  <path
                    d="M 130 190 Q 310 40 480 130"
                    stroke="#0d9488"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    strokeOpacity="0.35"
                  />
                  <path
                    d="M 190 290 Q 360 340 500 240"
                    stroke="#0d9488"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    strokeOpacity="0.35"
                  />
                </svg>

                {/* 1. Google (Top Center) */}
                <div
                  className="absolute top-[24px] left-[280px] w-14 h-14 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center p-2.5 z-20 hover:scale-110 hover:shadow-lg transition-all cursor-pointer"
                  title="Google"
                >
                  <img
                    src="/logos/google.svg"
                    alt="Google"
                    className="w-full h-full object-contain pointer-events-none select-none"
                  />
                </div>

                {/* 2. Microsoft (Mid Left) */}
                <div
                  className="absolute top-[160px] left-[100px] w-14 h-14 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center p-2.5 z-20 hover:scale-110 hover:shadow-lg transition-all cursor-pointer"
                  title="Microsoft"
                >
                  <img
                    src="/logos/microsoft.svg"
                    alt="Microsoft"
                    className="w-full h-full object-contain pointer-events-none select-none"
                  />
                </div>

                {/* 3. Meta (Mid Right) */}
                <div
                  className="absolute top-[108px] left-[450px] w-14 h-14 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center p-2.5 z-20 hover:scale-110 hover:shadow-lg transition-all cursor-pointer"
                  title="Meta"
                >
                  <img
                    src="/logos/meta.svg"
                    alt="Meta"
                    className="w-full h-full object-contain pointer-events-none select-none"
                  />
                </div>

                {/* 4. Apple (Bottom Center/Left) */}
                <div
                  className="absolute bottom-[44px] left-[270px] w-14 h-14 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center p-2.5 z-20 hover:scale-110 hover:shadow-lg transition-all cursor-pointer"
                  title="Apple"
                >
                  <img
                    src="/logos/apple.svg"
                    alt="Apple"
                    className="w-full h-full object-contain pointer-events-none select-none"
                  />
                </div>

                {/* 5. Netflix (Bottom Right) */}
                <div
                  className="absolute bottom-[75px] left-[440px] w-14 h-14 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center p-2.5 z-20 hover:scale-110 hover:shadow-lg transition-all cursor-pointer"
                  title="Netflix"
                >
                  <img
                    src="/logos/netflix.svg"
                    alt="Netflix"
                    className="w-full h-full object-contain pointer-events-none select-none"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* 3 Simple Statistics directly below Hero */}
          <div className="pt-12 sm:pt-14 mt-10 border-t border-slate-200/80">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              
              {/* Stat 1: Active Job Openings */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#0d9488] shrink-0">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                    {activeJobsDisplay}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-500 font-medium">
                    Active Job Openings
                  </div>
                </div>
              </div>

              {/* Stat 2: Verified Companies */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#0d9488] shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                    {verifiedCompaniesDisplay}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-500 font-medium">
                    Verified Companies
                  </div>
                </div>
              </div>

              {/* Stat 3: Countries */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#0d9488] shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                    {countriesDisplay}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-500 font-medium">
                    Countries
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          PAGE BODY CONTENT CONTAINER
          ======================================================== */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1360px] py-14 sm:py-18 space-y-16 sm:space-y-20">
        
        {/* ========================================================
            THE PROBLEM SECTION
            Two-column layout: Professional Image + Problem Description
            ======================================================== */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            
            {/* Left Column: Professional Workspace Visual */}
            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-sm aspect-[4/3] group">
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80"
                  alt="Modern tech workspace"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Right Column: Problem Statement */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <div className="text-xs font-bold text-[#0d9488] uppercase tracking-wider mb-2">
                The Problem
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-5">
                Most opportunities are discovered too late.
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                <p>
                  Most job seekers find openings after they&apos;re already flooded with applications. By the time a job appears on popular job boards, it may already have hundreds of candidates ahead of you.
                </p>
                <p>
                  JobHighway is built to solve this by connecting directly to companies&apos; official career portals, so you can see new openings as soon as they go live.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================
            OUR MISSION SECTION
            Container card + 2x2 supporting points
            ======================================================== */}
        <section className="bg-gradient-to-r from-teal-50/40 via-white to-teal-50/20 rounded-3xl border border-teal-100/90 p-8 sm:p-12 lg:p-14 shadow-2xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Mission Description */}
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold tracking-wider mb-3 shadow-2xs">
                <span>Our Mission</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-slate-900 tracking-tight leading-snug mb-4">
                A faster, cleaner and more reliable way to discover opportunities.
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                We believe job seekers should have direct access to real opportunities. Our mission is to build a transparent, up-to-date and global job platform that helps talented people find the right roles at the right time.
              </p>
            </div>

            {/* Right Column: 2x2 Clean Feature Cards */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              
              {/* Point 1: Real & Official Sources */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0d9488] flex items-center justify-center shrink-0 border border-teal-100/80">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug mb-1">
                    Real &amp; Official Sources
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Jobs fetched directly from company career pages
                  </p>
                </div>
              </div>

              {/* Point 2: Updated Frequently */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0d9488] flex items-center justify-center shrink-0 border border-teal-100/80">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug mb-1">
                    Updated Frequently
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Fresh job listings with hourly sync
                  </p>
                </div>
              </div>

              {/* Point 3: Global Coverage */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0d9488] flex items-center justify-center shrink-0 border border-teal-100/80">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug mb-1">
                    Global Coverage
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Opportunities from 150+ countries
                  </p>
                </div>
              </div>

              {/* Point 4: Focused on Job Seekers */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0d9488] flex items-center justify-center shrink-0 border border-teal-100/80">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug mb-1">
                    Focused on Job Seekers
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Clean, simple and ad-free experience
                  </p>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================
            HOW JOBHIGHWAY WORKS SECTION
            Horizontal 4-step pipeline: 01, 02, 03, 04 with icons
            ======================================================== */}
        <section>
          <div className="mb-8 sm:mb-10 text-left">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
              How JobHighway Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              From company posting to your screen.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 01 */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs relative flex flex-col justify-between hover:border-teal-300 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-teal-50 text-[#0d9488] flex items-center justify-center border border-teal-100/80">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    01
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Company Publishes
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  A company adds a new job on its official career system.
                </p>
              </div>
            </div>

            {/* Step 02 */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs relative flex flex-col justify-between hover:border-teal-300 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-teal-50 text-[#0d9488] flex items-center justify-center border border-teal-100/80">
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    02
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  JobHighway Detects
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Our smart system fetches and updates the listing.
                </p>
              </div>
            </div>

            {/* Step 03 */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs relative flex flex-col justify-between hover:border-teal-300 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-teal-50 text-[#0d9488] flex items-center justify-center border border-teal-100/80">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    03
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  We Organize
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Clean and structured job information.
                </p>
              </div>
            </div>

            {/* Step 04 */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs relative flex flex-col justify-between hover:border-teal-300 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-teal-50 text-[#0d9488] flex items-center justify-center border border-teal-100/80">
                    <Send className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    04
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  You Apply Directly
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  You apply on the company&apos;s official career page.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================
            MORE THAN A JOB LINK SECTION
            Checklist points + search card preview illustration
            ======================================================== */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 lg:p-12 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Heading & Subtitle */}
            <div className="lg:col-span-5">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-3">
                More than a job link.
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We surface complete, reliable and structured information so you can make better decisions.
              </p>
            </div>

            {/* Center Column: Checklist */}
            <div className="lg:col-span-4 space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Official source with direct application</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Detailed role and company information</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Fresh and verified listings</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Global opportunities</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 font-bold text-slate-900">
                <CheckCircle2 className="w-4 h-4 text-[#0d9488] shrink-0" />
                <span>Free for all job seekers</span>
              </div>
            </div>

            {/* Right Column: Layered Search & Verified Candidate Card Illustration matching reference */}
            <div className="lg:col-span-3 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[240px] sm:max-w-[260px]">
                {/* Back Layer Card (Offset slightly to top-right) */}
                <div className="absolute -top-3 -right-3 w-full h-full bg-slate-100/80 rounded-2xl border border-slate-200/60 pointer-events-none shadow-2xs" />
                
                {/* Front Main Card */}
                <div className="relative bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm space-y-3.5">
                  {/* Top Item: User Avatar Profile + 2 Text Bars */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100/80">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="w-24 h-2.5 bg-slate-200/90 rounded-full" />
                      <div className="w-14 h-2 bg-slate-200/70 rounded-full" />
                    </div>
                  </div>

                  {/* Bottom Item: Solid Teal Search Icon + 3 Content Lines */}
                  <div className="flex items-center gap-3 pt-0.5">
                    <div className="w-11 h-11 rounded-full bg-[#0d9488] text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Search className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="w-28 h-2 bg-slate-200 rounded-full" />
                      <div className="w-32 h-2 bg-slate-200 rounded-full" />
                      <div className="w-16 h-2 bg-slate-200 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================
            FINAL CALL TO ACTION
            ======================================================== */}
        <section className="text-center py-6">
          <div className="max-w-2xl mx-auto space-y-4">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Find the opening. Understand the role.<br />
              Apply at the source.
            </h3>
            <div>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#0d9488] hover:bg-[#0f766e] text-white text-sm font-semibold transition-all shadow-xs hover:shadow-md cursor-pointer"
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
