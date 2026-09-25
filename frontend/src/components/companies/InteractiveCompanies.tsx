"use client";

import { useState, useMemo, useEffect } from "react";
import { Company, OverviewStats } from "@/lib/api";
import Link from "next/link";
import { 
  ExternalLink, 
  MapPin, 
  Building2, 
  ShieldCheck, 
  Clock, 
  Users, 
  Briefcase, 
  Globe, 
  ArrowRight, 
  ChevronDown,
  Search,
  ArrowUpDown,
  X,
  Check,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompanyLogo, getCleanDomain, VECTOR_LOGOS } from "@/components/ui/CompanyLogo";
import { getCurrentUser, getFollowedCompanies, toggleFollowCompany, User } from "@/lib/auth";

interface InteractiveCompaniesProps {
  initialCompanies: Company[];
  initialStats?: OverviewStats | null;
  initialSearch?: string;
}

const COMPANIES_PER_PAGE = 12;

export function InteractiveCompanies({ initialCompanies, initialStats, initialSearch }: InteractiveCompaniesProps) {
  const [search, setSearch] = useState(initialSearch || "");
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedSize, setSelectedSize] = useState("All");
  const [sortBy, setSortBy] = useState("newest"); // "newest", "openings", "name"
  const [currentPage, setCurrentPage] = useState(1);
  const [jumpPageInput, setJumpPageInput] = useState("");
  const [followedSlugs, setFollowedSlugs] = useState<string[]>([]);

  useEffect(() => {
    if (initialSearch !== undefined) {
      setSearch(initialSearch);
      setCurrentPage(1);
    }
  }, [initialSearch]);

  useEffect(() => {
    const handleOmnisearchCompany = (e: any) => {
      if (e.detail?.query) {
        setSearch(e.detail.query);
        setCurrentPage(1);
      }
    };
    window.addEventListener("jobhighway_omnisearch_company", handleOmnisearchCompany);
    return () => window.removeEventListener("jobhighway_omnisearch_company", handleOmnisearchCompany);
  }, []);

  // Sync followed companies state
  useEffect(() => {
    const cur = getCurrentUser();
    if (cur) {
      const list = getFollowedCompanies(cur.id);
      setFollowedSlugs(list.map(c => c.slug.toLowerCase()));
    } else {
      setFollowedSlugs([]);
    }

    const handleSync = () => {
      const user = getCurrentUser();
      if (user) {
        const list = getFollowedCompanies(user.id);
        setFollowedSlugs(list.map(c => c.slug.toLowerCase()));
      } else {
        setFollowedSlugs([]);
      }
    };

    window.addEventListener("jobhighway_following_change", handleSync);
    window.addEventListener("jobhighway_auth_change", handleSync);
    return () => {
      window.removeEventListener("jobhighway_following_change", handleSync);
      window.removeEventListener("jobhighway_auth_change", handleSync);
    };
  }, []);

  const handleToggleFollow = (comp: Company) => {
    const user = getCurrentUser();
    if (!user) {
      window.location.href = "/login?redirect=/companies";
      return;
    }
    toggleFollowCompany(user.id, {
      id: String(comp.id),
      name: comp.name,
      slug: comp.slug
    });
    const list = getFollowedCompanies(user.id);
    setFollowedSlugs(list.map(c => c.slug.toLowerCase()));
  };

  const totalCompaniesCount = initialStats?.total_companies || initialCompanies.length || 17578;

  // Extract unique industries for filter dropdown
  const industries = useMemo(() => {
    const set = new Set<string>();
    initialCompanies.forEach(c => {
      if (c.industry && c.industry.trim()) set.add(c.industry.trim());
    });
    return Array.from(set).sort();
  }, [initialCompanies]);

  // Extract unique countries / primary locations
  const countries = useMemo(() => {
    const set = new Set<string>();
    initialCompanies.forEach(c => {
      if (c.headquarters && c.headquarters.trim()) {
        const parts = c.headquarters.split(",");
        const lastPart = parts[parts.length - 1].trim();
        if (lastPart && lastPart.length > 1) {
          set.add(lastPart);
        }
      }
    });
    return Array.from(set).sort();
  }, [initialCompanies]);

  const filtered = useMemo(() => {
    let list = initialCompanies;

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        c => c.name.toLowerCase().includes(q) || 
             (c.industry || "").toLowerCase().includes(q) || 
             (c.headquarters || "").toLowerCase().includes(q) ||
             (c.website || "").toLowerCase().includes(q)
      );
    }

    // Industry filter
    if (selectedIndustry !== "All") {
      list = list.filter(c => (c.industry || "").toLowerCase() === selectedIndustry.toLowerCase());
    }

    // Country filter
    if (selectedCountry !== "All") {
      list = list.filter(c => (c.headquarters || "").toLowerCase().includes(selectedCountry.toLowerCase()));
    }

    // Size filter
    if (selectedSize !== "All") {
      if (selectedSize === "10k+") {
        list = list.filter(c => (c.employee_count_range || "").includes("10k") || (c.employee_count_range || "").includes("10K"));
      } else if (selectedSize === "1k-10k") {
        list = list.filter(c => (c.employee_count_range || "").includes("1k") || (c.employee_count_range || "").includes("5k"));
      } else if (selectedSize === "<1k") {
        list = list.filter(c => !((c.employee_count_range || "").includes("10k")) && !((c.employee_count_range || "").includes("10K")));
      }
    }

    // Sorting
    return [...list].sort((a, b) => {
      if (sortBy === "openings") return (b.active_job_count || 0) - (a.active_job_count || 0);
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "newest") return b.id - a.id;
      return 0;
    });
  }, [initialCompanies, search, selectedIndustry, selectedCountry, selectedSize, sortBy]);

  const totalPages = Math.ceil(filtered.length / COMPANIES_PER_PAGE) || 1;

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedIndustry, selectedCountry, selectedSize, sortBy]);

  const displayedCompanies = useMemo(() => {
    const start = (currentPage - 1) * COMPANIES_PER_PAGE;
    return filtered.slice(start, start + COMPANIES_PER_PAGE);
  }, [filtered, currentPage]);

  const handlePageChange = (targetPage: number) => {
    if (targetPage < 1 || targetPage > totalPages || targetPage === currentPage) return;
    setCurrentPage(targetPage);
    const gridEl = document.getElementById("companies-results-grid");
    if (gridEl) {
      gridEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleJumpPage = () => {
    const p = parseInt(jumpPageInput, 10);
    if (!isNaN(p) && p >= 1 && p <= totalPages) {
      handlePageChange(p);
      setJumpPageInput("");
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Handwriting font for playful annotations matching the reference design */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap');
        .font-handwriting {
          font-family: 'Caveat', cursive, 'Patrick Hand', 'Comic Sans MS', sans-serif;
        }
      `}} />

      {/* ========================================================
          HERO SECTION: Pixel-matched to Reference Image (media_1790186014554.png)
          Container max-width matches Jobs page (1440px)
          ======================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/40 via-white to-slate-50 pt-10 pb-8 sm:pt-14 sm:pb-10">
        {/* Subtle mesh & ambient light */}
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />
        <div className="absolute top-0 right-1/4 -translate-y-12 w-96 h-96 bg-teal-200/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-10 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />

        {/* max-w-[1440px] px-4 sm:px-6 lg:px-8 matches Jobs page, Navbar, and Footer */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1440px] relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-5 flex flex-col items-start text-left">
              {/* Eyebrow */}
              <div className="flex items-center gap-2 mb-4 text-xs font-semibold tracking-wider uppercase text-teal-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Verified Direct ATS Companies</span>
              </div>

              {/* Main Heading without underline under 'actually hiring.' */}
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-black text-slate-900 tracking-tight leading-[1.15] mb-4">
                Discover companies<br className="hidden sm:inline" />
                {" "}that are <span className="text-teal-600 font-black">actually hiring.</span>
              </h1>

              {/* Supporting Text */}
              <p className="text-sm sm:text-base text-slate-600 mb-6 max-w-xl leading-relaxed">
                Explore verified companies and discover fresh opportunities directly from official career portals. Follow your favorite companies and never miss a new opportunity.
              </p>

              {/* 3 Metric Badges side-by-side (clean circular icons, matching reference image) */}
              <div className="flex items-center flex-wrap gap-5 sm:gap-7 pt-1">
                {/* 1. Verified Companies */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100/80">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      {totalCompaniesCount.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      Verified Companies
                    </div>
                  </div>
                </div>

                {/* 2. Active Openings */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 border border-teal-100/80">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      {initialStats?.total_jobs ? `${Number(initialStats.total_jobs).toLocaleString()}+` : "55,484+"}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      Active Openings
                    </div>
                  </div>
                </div>

                {/* 3. Countries */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100/80">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      150+
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      Countries
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual Column: Professional World Network Globe + 6 Floating Logos + 3 Badges + Annotation */}
            <div className="lg:col-span-7 relative hidden sm:flex items-center justify-end min-h-[410px]">
              <div className="relative w-full max-w-[780px] h-[410px] flex items-center">
                
                {/* Authentic MapSVG Vector World Map Backdrop with soft ambient glow */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[510px] h-[336px] pointer-events-none flex items-center justify-center">
                  {/* Soft radial glow behind the world map */}
                  <div className="absolute w-[440px] h-[300px] bg-radial from-teal-200/40 via-teal-100/20 to-transparent rounded-full blur-2xl pointer-events-none" />
                  
                  {/* Detailed 256-country blank vector world map (from MapSVG) with crisp white borders */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="/world.svg" 
                    alt="Global Hiring Network World Map"
                    className="w-full h-full object-contain pointer-events-none select-none relative z-0" 
                  />
                </div>


                {/* 6 Floating Company Logos (Sized containers using user's exact SVGs) */}
                {/* 1. Google (Top Center - square tile for official "G" logo) */}
                <div 
                  className="absolute top-3 left-[206px] w-[60px] h-[60px] rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center p-2.5 hover:scale-110 hover:shadow-lg transition-all duration-300 z-10"
                  title="Google"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logos/google.svg" alt="Google logo" className="w-full h-full object-contain pointer-events-none select-none" />
                </div>

                {/* 2. Microsoft (Mid Left) */}
                <div 
                  className="absolute top-[115px] left-[24px] w-[60px] h-[60px] rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center p-2.5 hover:scale-110 hover:shadow-lg transition-all duration-300 z-10"
                  title="Microsoft"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logos/microsoft.svg" alt="Microsoft logo" className="w-full h-full object-contain pointer-events-none select-none" />
                </div>

                {/* 3. Amazon (Center, prominent) */}
                <div 
                  className="absolute top-[138px] left-[202px] w-[68px] h-[68px] rounded-2xl bg-white shadow-lg border border-slate-100 flex items-center justify-center p-2.5 hover:scale-110 hover:shadow-xl transition-all duration-300 z-10"
                  title="Amazon"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logos/amazon.svg" alt="Amazon logo" className="w-full h-full object-contain pointer-events-none select-none" />
                </div>

                {/* 4. Apple (Bottom Center) */}
                <div 
                  className="absolute bottom-3 left-[165px] w-[60px] h-[60px] rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center p-2.5 hover:scale-110 hover:shadow-lg transition-all duration-300 z-10"
                  title="Apple"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logos/apple.svg" alt="Apple logo" className="w-full h-full object-contain pointer-events-none select-none" />
                </div>

                {/* 5. Meta (Top Right of Globe - enlarged container & lowercase /logos/meta.svg for Linux/Vercel) */}
                <div 
                  className="absolute top-[56px] left-[328px] w-16 h-16 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center p-2 hover:scale-110 hover:shadow-lg transition-all duration-300 z-10"
                  title="Meta"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logos/meta.svg" alt="Meta logo" className="w-full h-full object-contain pointer-events-none select-none" />
                </div>

                {/* 6. Netflix (Bottom Right of Globe) */}
                <div 
                  className="absolute bottom-9 left-[332px] w-[60px] h-[60px] rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center p-2.5 hover:scale-110 hover:shadow-lg transition-all duration-300 z-10"
                  title="Netflix"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logos/netflix.svg" alt="Netflix logo" className="w-full h-full object-contain pointer-events-none select-none" />
                </div>

                {/* 3 Stacked Feature Badges (Starts at 445px -> 67px safe margin from Meta/Netflix!) */}
                <div className="absolute left-[445px] top-[48px] flex flex-col gap-2.5 z-10 w-[195px]">
                  <div className="bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-xl p-2.5 shadow-2xs flex items-center gap-2.5 hover:border-emerald-300 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 leading-tight">Official Sources</p>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">Company career portals only</p>
                    </div>
                  </div>

                  <div className="bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-xl p-2.5 shadow-2xs flex items-center gap-2.5 hover:border-sky-300 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 leading-tight">Updated Hourly</p>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">Fresh company data</p>
                    </div>
                  </div>

                  <div className="bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-xl p-2.5 shadow-2xs flex items-center gap-2.5 hover:border-indigo-300 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 leading-tight">Global Coverage</p>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">Companies from 150+ countries</p>
                    </div>
                  </div>
                </div>

                {/* Right Annotation: "Top companies hiring worldwide" (Starts at 655px -> completely free space!) */}
                <div className="absolute left-[655px] top-[40px] flex flex-col items-center select-none z-20 pointer-events-none">
                  <span className="font-handwriting text-teal-800 text-sm font-bold -rotate-6 tracking-wide leading-tight text-center whitespace-nowrap">
                    Top companies<br />hiring worldwide
                  </span>
                  <svg width="42" height="42" viewBox="0 0 42 42" fill="none" className="text-teal-600 mt-1 -ml-3">
                    <path d="M26 4C26 14 18 28 6 30" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M12 24L5 30L9 38" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          SEARCH BAR, FILTERS & 3-COLUMN CARDS GRID
          Matches Jobs Page width (max-w-[1440px])
          ======================================================== */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1440px] pt-4 pb-12">
        
        {/* Centered Medium-Width Search Bar with Substantial Search Button */}
        <div className="max-w-3xl mx-auto mb-6 w-full px-2 sm:px-0">
          <div className="relative flex items-center bg-white border border-slate-200/90 rounded-2xl shadow-xs hover:border-slate-300 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20 transition-all p-1.5 sm:p-2 min-h-[58px]">
            <Search className="w-5 h-5 text-slate-400 ml-3.5 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const gridEl = document.getElementById("companies-results-grid");
                  if (gridEl) gridEl.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
              placeholder="Search companies by name, domain, or location..."
              className="w-full bg-transparent px-3.5 py-2 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors mr-2 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => {
                const gridEl = document.getElementById("companies-results-grid");
                if (gridEl) gridEl.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold px-7 sm:px-8 h-11 sm:h-12 rounded-xl flex items-center gap-2 text-sm sm:text-base shadow-xs transition-all shrink-0 cursor-pointer"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* Single-Row Filter Controls (Centered, 4 in one row on desktop; All Countries (Worldwide) fully visible) */}
        <div className="max-w-[960px] mx-auto flex items-center justify-center gap-3 md:gap-3.5 flex-wrap md:flex-nowrap mb-6 w-full px-2 sm:px-0">
          {/* Country Filter - wider flex allocation so '(Worldwide)' is never clipped */}
          <div className="relative flex-[1.3] min-w-[220px]">
            <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full h-11 appearance-none bg-white border border-slate-200/90 rounded-xl pl-8 pr-7 text-xs sm:text-[13px] font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:border-teal-500 cursor-pointer shadow-2xs transition-colors"
            >
              <option value="All">All Countries (Worldwide)</option>
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Industry Filter */}
          <div className="relative flex-1 min-w-[150px]">
            <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full h-11 appearance-none bg-white border border-slate-200/90 rounded-xl pl-8 pr-7 text-xs sm:text-[13px] font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:border-teal-500 cursor-pointer shadow-2xs transition-colors"
            >
              <option value="All">All Industries</option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Company Size Filter */}
          <div className="relative flex-[1.1] min-w-[165px]">
            <Users className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full h-11 appearance-none bg-white border border-slate-200/90 rounded-xl pl-8 pr-7 text-xs sm:text-[13px] font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:border-teal-500 cursor-pointer shadow-2xs transition-colors"
            >
              <option value="All">All Company Sizes</option>
              <option value="10k+">10K+ employees</option>
              <option value="1k-10k">1K–10K employees</option>
              <option value="<1k">Under 1K employees</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sort Filter */}
          <div className="relative flex-[0.95] min-w-[145px]">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full h-11 appearance-none bg-white border border-slate-200/90 rounded-xl pl-8 pr-7 text-xs sm:text-[13px] font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:border-teal-500 cursor-pointer shadow-2xs transition-colors"
            >
              <option value="newest">Newest First</option>
              <option value="openings">Most Openings</option>
              <option value="name">Company Name (A–Z)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Dynamic Company Counter on Left, directly above the 3-column card grid */}
        <div className="text-xs sm:text-sm font-semibold text-slate-700 mb-4">
          {filtered.length.toLocaleString()} companies
        </div>

        {/* ========================================================
            COMPANIES GRID: STRICTLY 3 columns on desktop, 2 on tablet, 1 on mobile
            ======================================================== */}
        <div id="companies-results-grid" className="scroll-mt-24">
          {filtered.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedCompanies.map((company) => (
                  <div
                    key={company.id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 hover:border-teal-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group relative"
                  >
                    <div>
                      {/* Top Header: Logo, Name, Domain & Featured Tag */}
                      <div className="flex items-start justify-between gap-3 mb-3.5">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <CompanyLogo
                            name={company.name}
                            website={company.website}
                            slug={company.slug}
                            logoUrl={company.logo_url}
                            size="md"
                          />
                          <div className="min-w-0">
                            <Link href={`/companies/${company.slug}`} className="group/link block">
                              <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover/link:text-teal-600 transition-colors truncate">
                                {company.name}
                              </h2>
                            </Link>
                            <span className="text-xs text-slate-400 font-medium truncate block mt-0.5">
                              {getCleanDomain(company.website, company.slug, company.name) || (company.industry || "Official ATS")}
                            </span>
                          </div>
                        </div>

                        {(() => {
                          const isFollowed = followedSlugs.includes(company.slug.toLowerCase());
                          return (
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleToggleFollow(company)}
                                className={`text-xs font-bold px-2.5 py-0.5 rounded-full transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
                                  isFollowed
                                    ? "bg-teal-50 text-teal-700 border border-teal-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 group/fbtn"
                                    : "bg-white border border-slate-200 text-slate-600 hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50/50"
                                }`}
                              >
                                {isFollowed ? (
                                  <>
                                    <Check className="w-3 h-3 text-teal-600 group-hover/fbtn:hidden" />
                                    <span className="group-hover/fbtn:hidden">Following</span>
                                    <span className="hidden group-hover/fbtn:inline">Unfollow</span>
                                  </>
                                ) : (
                                  <>
                                    <Plus className="w-3 h-3" />
                                    <span>Follow</span>
                                  </>
                                )}
                              </button>

                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-semibold px-2.5 py-0.5 rounded-full shrink-0">
                                Featured
                              </span>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Description: 2-line clamp */}
                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 min-h-[2.5rem] leading-relaxed mb-4">
                        {company.description || `${company.name} is hiring verified talent directly on official career portals.`}
                      </p>

                      {/* Metadata Row: Location & Employees */}
                      <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mb-5">
                        <div className="flex items-center gap-1.5 shrink-0">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate max-w-[140px] sm:max-w-[160px]">
                            {company.headquarters || 'Worldwide / Remote'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>{company.employee_count_range || '1K+'} employees</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom CTA Row */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                      <Link 
                        href={`/jobs?company=${encodeURIComponent(company.slug)}`}
                        className="inline-flex items-center text-teal-600 hover:text-teal-700 font-semibold text-xs sm:text-sm group-hover:translate-x-0.5 transition-transform"
                      >
                        <span>View {company.active_job_count?.toLocaleString() || "Verified"} Openings</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Link>

                      {company.website && (
                        <a 
                          href={company.website.startsWith("http") ? company.website : `https://${company.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-slate-600 text-xs flex items-center gap-1 transition-colors"
                          title={`Visit ${company.name} official site`}
                        >
                          <span>Website</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* ========================================================
                  PAGINATION BAR: Clean, Numbered, Responsive
                  ======================================================== */}
              {totalPages > 1 && (
                <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                  <div className="text-xs sm:text-sm text-slate-500 font-medium">
                    Showing <strong className="text-slate-900 font-bold">{((currentPage - 1) * COMPANIES_PER_PAGE) + 1}</strong>–<strong className="text-slate-900 font-bold">{Math.min(currentPage * COMPANIES_PER_PAGE, filtered.length)}</strong> of <strong className="text-slate-900 font-bold">{filtered.length.toLocaleString()}</strong> companies (Page {currentPage} of {totalPages})
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage <= 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="rounded-xl text-xs font-semibold px-3 h-8 cursor-pointer border-slate-200 hover:bg-slate-50 disabled:opacity-40"
                    >
                      ← Previous
                    </Button>

                    {getPageNumbers().map((p, idx) => (
                      typeof p === "number" ? (
                        <Button
                          key={idx}
                          variant={p === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(p)}
                          className={`w-8 h-8 p-0 rounded-full text-xs font-bold cursor-pointer transition-all ${
                            p === currentPage
                              ? "bg-teal-600 hover:bg-teal-700 text-white shadow-xs border-teal-600"
                              : "text-slate-700 border-transparent hover:bg-slate-100 hover:text-teal-600 bg-transparent"
                          }`}
                        >
                          {p}
                        </Button>
                      ) : (
                        <span key={idx} className="px-1 text-slate-400 text-xs font-bold">...</span>
                      )
                    ))}

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage >= totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="rounded-xl text-xs font-semibold px-3 h-8 cursor-pointer border-slate-200 hover:bg-slate-50 disabled:opacity-40"
                    >
                      Next →
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500 font-medium">Go to:</span>
                    <input
                      type="number"
                      min={1}
                      max={totalPages}
                      value={jumpPageInput}
                      onChange={(e) => setJumpPageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleJumpPage();
                      }}
                      placeholder={String(currentPage)}
                      className="w-14 px-2 py-1 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 text-center text-xs outline-none focus:border-teal-500 focus:bg-white"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleJumpPage}
                      className="text-xs h-7 px-3 rounded-lg cursor-pointer border-slate-200 hover:bg-slate-50"
                    >
                      Go
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs max-w-xl mx-auto">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">No companies found</h3>
              <p className="text-sm text-slate-500 mb-4">
                No company matches your search {search ? `"${search}"` : ""} or selected filters.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setSelectedIndustry("All");
                  setSelectedCountry("All");
                  setSelectedSize("All");
                }}
                className="rounded-xl text-xs font-semibold cursor-pointer"
              >
                Reset All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
