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
  ArrowUpDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/SearchBar";
import { CompanyLogo, getCleanDomain } from "@/components/ui/CompanyLogo";

interface InteractiveCompaniesProps {
  initialCompanies: Company[];
  initialStats?: OverviewStats | null;
}

const COMPANIES_PER_PAGE = 12;

export function InteractiveCompanies({ initialCompanies, initialStats }: InteractiveCompaniesProps) {
  const [search, setSearch] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedSize, setSelectedSize] = useState("All");
  const [sortBy, setSortBy] = useState("openings"); // "openings", "name", "newest"
  const [currentPage, setCurrentPage] = useState(1);
  const [jumpPageInput, setJumpPageInput] = useState("");

  const totalCompaniesCount = initialStats?.total_companies || initialCompanies.length || 17584;

  // Extract top 6 companies from real data for the hero dynamic floating logos
  const heroCompanies = useMemo(() => {
    return initialCompanies.slice(0, 6);
  }, [initialCompanies]);

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
      {/* ========================================================
          HERO SECTION: High Impact, Refined, Matching Reference
          ======================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/40 via-white to-slate-50 border-b border-slate-200/80 pt-8 pb-8 sm:pt-12 sm:pb-10">
        {/* Subtle, faint dotted grid pattern matching reference screenshot */}
        <div className="absolute inset-0 pointer-events-none opacity-15 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_35%,#000_50%,transparent_100%)]" />
        <div className="absolute top-0 right-1/4 -translate-y-12 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-10 w-72 h-72 bg-emerald-200/15 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center mb-8">
            {/* Left Content (cols 6 on desktop) */}
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-4 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>VERIFIED COMPANIES</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-black text-slate-900 tracking-tight leading-[1.15] mb-4">
                Discover companies that are{" "}
                <span className="text-teal-600">
                  actually hiring
                </span>.
              </h1>

              {/* Supporting Text */}
              <p className="text-sm sm:text-base text-slate-600 mb-7 max-w-lg leading-relaxed">
                Explore verified companies and discover fresh opportunities directly from official career portals. Follow your favorite companies and never miss a new opportunity.
              </p>

              {/* 3 Metric Badges: responsive, no text truncation */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl">
                <div className="bg-white/90 backdrop-blur-xs border border-slate-200/80 rounded-2xl p-3 sm:p-3.5 flex items-center gap-3 shadow-2xs hover:border-slate-300 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100/80 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-teal-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      {totalCompaniesCount.toLocaleString()}
                    </div>
                    <div className="text-xs font-medium text-slate-500 whitespace-nowrap">
                      Verified Companies
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-xs border border-slate-200/80 rounded-2xl p-3 sm:p-3.5 flex items-center gap-3 shadow-2xs hover:border-slate-300 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100/80 flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5 text-teal-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      {initialStats?.total_jobs ? `${Number(initialStats.total_jobs).toLocaleString()}+` : "1.2M+"}
                    </div>
                    <div className="text-xs font-medium text-slate-500 whitespace-nowrap">
                      Active Openings
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-xs border border-slate-200/80 rounded-2xl p-3 sm:p-3.5 flex items-center gap-3 shadow-2xs hover:border-slate-300 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100/80 flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5 text-teal-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      150+
                    </div>
                    <div className="text-xs font-medium text-slate-500 whitespace-nowrap">
                      Countries
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual: Stylized Wireframe Globe with Dynamic Floating Logos and Trust Card */}
            <div className="lg:col-span-6 relative hidden lg:flex items-center justify-end min-h-[350px]">
              {/* Annotation 1 (top-left of globe): "Top companies hiring worldwide" with cursive arrow */}
              <div className="absolute top-2 left-0 z-20 pointer-events-none flex items-center gap-1.5 text-teal-800 font-serif italic text-xs">
                <span className="whitespace-nowrap">Top companies hiring worldwide</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-teal-600 shrink-0">
                  <path d="M4 8C8 14 14 16 18 14M18 14L15 11M18 14L17 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* Center Globe & Floating Logos Box */}
              <div className="relative w-[330px] h-[330px] flex items-center justify-center shrink-0 mr-4">
                {/* Radial ambient glow */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-56 h-56 rounded-full bg-teal-100/60 blur-2xl" />
                </div>

                {/* Stylized 3D Wireframe Globe */}
                <svg className="w-64 h-64 opacity-35 text-teal-600 pointer-events-none" viewBox="0 0 200 200" fill="none">
                  <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" />
                  <ellipse cx="100" cy="100" rx="90" ry="30" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                  <ellipse cx="100" cy="100" rx="90" ry="60" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="10" y1="100" x2="190" y2="100" stroke="currentColor" strokeWidth="1.2" />
                  <ellipse cx="100" cy="100" rx="30" ry="90" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                  <ellipse cx="100" cy="100" rx="60" ry="90" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="100" y1="10" x2="100" y2="190" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="100" cy="40" r="2.5" fill="#0d9488" />
                  <circle cx="140" cy="70" r="2" fill="#0d9488" />
                  <circle cx="160" cy="100" r="2.5" fill="#0d9488" />
                  <circle cx="130" cy="140" r="2" fill="#0d9488" />
                  <circle cx="70" cy="140" r="2" fill="#0d9488" />
                  <circle cx="40" cy="100" r="2.5" fill="#0d9488" />
                  <circle cx="60" cy="70" r="2" fill="#0d9488" />
                </svg>

                {/* 6 Real Floating Company Logo Badges dynamically mapped around the Globe */}
                {heroCompanies[0] && (
                  <div
                    className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-12 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center p-2 hover:scale-110 transition-transform duration-200 z-10"
                    title={heroCompanies[0].name}
                  >
                    <CompanyLogo
                      name={heroCompanies[0].name}
                      slug={heroCompanies[0].slug}
                      website={heroCompanies[0].website}
                      logoUrl={heroCompanies[0].logo_url}
                      size="sm"
                    />
                  </div>
                )}

                {heroCompanies[1] && (
                  <div
                    className="absolute top-10 right-2 w-12 h-12 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center p-2 hover:scale-110 transition-transform duration-200 z-10"
                    title={heroCompanies[1].name}
                  >
                    <CompanyLogo
                      name={heroCompanies[1].name}
                      slug={heroCompanies[1].slug}
                      website={heroCompanies[1].website}
                      logoUrl={heroCompanies[1].logo_url}
                      size="sm"
                    />
                  </div>
                )}

                {heroCompanies[2] && (
                  <div
                    className="absolute top-32 right-0 w-13 h-13 rounded-2xl bg-white shadow-lg border border-slate-100 flex items-center justify-center p-2 hover:scale-110 transition-transform duration-200 z-10"
                    title={heroCompanies[2].name}
                  >
                    <CompanyLogo
                      name={heroCompanies[2].name}
                      slug={heroCompanies[2].slug}
                      website={heroCompanies[2].website}
                      logoUrl={heroCompanies[2].logo_url}
                      size="sm"
                    />
                  </div>
                )}

                {heroCompanies[3] && (
                  <div
                    className="absolute bottom-6 right-6 w-12 h-12 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center p-2 hover:scale-110 transition-transform duration-200 z-10"
                    title={heroCompanies[3].name}
                  >
                    <CompanyLogo
                      name={heroCompanies[3].name}
                      slug={heroCompanies[3].slug}
                      website={heroCompanies[3].website}
                      logoUrl={heroCompanies[3].logo_url}
                      size="sm"
                    />
                  </div>
                )}

                {heroCompanies[4] && (
                  <div
                    className="absolute bottom-2 left-1/3 -translate-x-1/2 w-12 h-12 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center p-2 hover:scale-110 transition-transform duration-200 z-10"
                    title={heroCompanies[4].name}
                  >
                    <CompanyLogo
                      name={heroCompanies[4].name}
                      slug={heroCompanies[4].slug}
                      website={heroCompanies[4].website}
                      logoUrl={heroCompanies[4].logo_url}
                      size="sm"
                    />
                  </div>
                )}

                {heroCompanies[5] && (
                  <div
                    className="absolute top-24 left-1 w-12 h-12 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center p-2 hover:scale-110 transition-transform duration-200 z-10"
                    title={heroCompanies[5].name}
                  >
                    <CompanyLogo
                      name={heroCompanies[5].name}
                      slug={heroCompanies[5].slug}
                      website={heroCompanies[5].website}
                      logoUrl={heroCompanies[5].logo_url}
                      size="sm"
                    />
                  </div>
                )}
              </div>

              {/* Right Side: Annotation 2 & 3 Trust Badges Stack (spacious, zero truncation) */}
              <div className="flex flex-col items-end shrink-0 relative">
                {/* Annotation 2: "Verified from official career portals" with arrow */}
                <div className="pointer-events-none flex items-center gap-1.5 text-teal-800 font-serif italic text-xs mb-2">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-teal-600 -rotate-45 shrink-0">
                    <path d="M4 16C10 8 16 6 20 10M20 10L16 6M20 10L18 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="whitespace-nowrap">Verified from official career portals</span>
                </div>

                {/* 3 Trust Badges Stacked (w-[215px] to prevent truncation) */}
                <div className="flex flex-col gap-2.5 z-10 w-[215px]">
                  <div className="bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-xl p-2.5 sm:p-3 shadow-xs flex items-center gap-2.5 hover:border-emerald-300 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 leading-tight">Official Sources</p>
                      <p className="text-[11px] text-slate-500 leading-tight whitespace-nowrap">Company career portals only</p>
                    </div>
                  </div>

                  <div className="bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-xl p-2.5 sm:p-3 shadow-xs flex items-center gap-2.5 hover:border-teal-300 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 leading-tight">Updated Hourly</p>
                      <p className="text-[11px] text-slate-500 leading-tight whitespace-nowrap">Fresh company data</p>
                    </div>
                  </div>

                  <div className="bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-xl p-2.5 sm:p-3 shadow-xs flex items-center gap-2.5 hover:border-sky-300 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 leading-tight">Global Coverage</p>
                      <p className="text-[11px] text-slate-500 leading-tight whitespace-nowrap">Companies from 150+ countries</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              STANDARDIZED SEARCH BAR
              ======================================================== */}
          <div className="max-w-4xl mx-auto mb-4">
            <SearchBar
              value={search}
              onChange={setSearch}
              onSearch={() => {
                const gridEl = document.getElementById("companies-results-grid");
                if (gridEl) gridEl.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              placeholder="Search companies by name, domain, or location..."
              className="w-full"
            />
          </div>

          {/* ========================================================
              FILTER & SORT ROW: Unified Single Row with Icons
              ======================================================== */}
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs pt-1">
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              {/* Country Filter */}
              <div className="relative flex items-center bg-white border border-slate-200/90 rounded-xl px-2.5 py-1.5 hover:border-slate-300 focus-within:border-teal-500 shadow-2xs">
                <Globe className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0 pointer-events-none" />
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="appearance-none bg-transparent pr-5 text-xs font-medium text-slate-700 outline-none cursor-pointer"
                >
                  <option value="All">All Countries (Worldwide)</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
              </div>

              {/* Industry Filter */}
              <div className="relative flex items-center bg-white border border-slate-200/90 rounded-xl px-2.5 py-1.5 hover:border-slate-300 focus-within:border-teal-500 shadow-2xs">
                <Building2 className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0 pointer-events-none" />
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="appearance-none bg-transparent pr-5 text-xs font-medium text-slate-700 outline-none cursor-pointer"
                >
                  <option value="All">All Industries</option>
                  {industries.map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
              </div>

              {/* Company Size Filter */}
              <div className="relative flex items-center bg-white border border-slate-200/90 rounded-xl px-2.5 py-1.5 hover:border-slate-300 focus-within:border-teal-500 shadow-2xs">
                <Users className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0 pointer-events-none" />
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="appearance-none bg-transparent pr-5 text-xs font-medium text-slate-700 outline-none cursor-pointer"
                >
                  <option value="All">All Company Sizes</option>
                  <option value="10k+">10K+ employees</option>
                  <option value="1k-10k">1K–10K employees</option>
                  <option value="<1k">Under 1K employees</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
              </div>

              {/* Sort Filter */}
              <div className="relative flex items-center bg-white border border-slate-200/90 rounded-xl px-2.5 py-1.5 hover:border-slate-300 focus-within:border-teal-500 shadow-2xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0 pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-transparent pr-5 text-xs font-medium text-slate-700 outline-none cursor-pointer"
                >
                  <option value="openings">Most Openings</option>
                  <option value="newest">Newest First</option>
                  <option value="name">Company Name (A–Z)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
              </div>
            </div>

            {/* Matching Count */}
            <div className="font-medium text-slate-500 text-xs shrink-0 self-center md:self-auto text-right">
              <strong className="text-slate-900 font-bold">{filtered.length.toLocaleString()}</strong> companies
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          COMPANIES GRID: STRICTLY 3 columns on desktop, 2 on tablet, 1 on mobile
          ======================================================== */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-10">
        <div id="companies-results-grid" className="scroll-mt-24">
          {filtered.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedCompanies.map((company) => {
                  const cleanDesc = company.description && !company.description.includes("is actively hiring verified talent")
                    ? company.description
                    : `Official career portal with verified openings in ${company.industry || "Technology"} & related departments.`;

                  const cleanDomain = getCleanDomain(company.website, company.slug, company.name);

                  return (
                    <div
                      key={company.id}
                      className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 hover:border-slate-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group relative"
                    >
                      <div>
                        {/* Top Header: Logo, Name, Domain & Featured Tag */}
                        <div className="flex items-start justify-between gap-3 mb-3.5">
                          <div className="flex items-center gap-3 min-w-0">
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
                              <span className="text-xs text-slate-400 font-medium truncate block">
                                {cleanDomain || (company.industry || "Official ATS")}
                              </span>
                            </div>
                          </div>

                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-100/90 text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0">
                            Featured
                          </span>
                        </div>

                        {/* Description: 2-line clamp */}
                        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 h-10 leading-relaxed mb-4">
                          {cleanDesc}
                        </p>

                        {/* Metadata Row: Location & Employees */}
                        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mb-5">
                          {company.headquarters ? (
                            <div className="flex items-center gap-1.5 shrink-0">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              <span className="truncate max-w-[140px] sm:max-w-[160px]">
                                {company.headquarters}
                              </span>
                            </div>
                          ) : null}
                          {company.employee_count_range ? (
                            <div className="flex items-center gap-1.5 shrink-0">
                              <Users className="w-3.5 h-3.5 text-slate-400" />
                              <span>{company.employee_count_range} employees</span>
                            </div>
                          ) : null}
                          {!company.headquarters && !company.employee_count_range ? (
                            <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
                              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                              <span>Official ATS Verified</span>
                            </div>
                          ) : null}
                        </div>
                      </div>

                      {/* Bottom CTA Row */}
                      <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                        <Link 
                          href={`/jobs?company=${encodeURIComponent(company.slug)}`}
                          className="inline-flex items-center text-teal-600 hover:text-teal-700 font-semibold text-xs sm:text-sm group-hover:translate-x-0.5 transition-all"
                        >
                          <span>View {company.active_job_count.toLocaleString()} Openings</span>
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
                  );
                })}
              </div>

              {/* ========================================================
                  PAGINATION BAR: Clean, Numbered, Responsive
                  ======================================================== */}
              {totalPages > 1 && (
                <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
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
                          className={`w-8 h-8 p-0 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                            p === currentPage
                              ? "bg-teal-600 hover:bg-teal-700 text-white shadow-xs border-teal-600"
                              : "text-slate-700 border-slate-200 hover:border-teal-500 hover:text-teal-600 bg-white"
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
