"use client";

import { useState, useMemo, useEffect } from "react";
import { Company, OverviewStats } from "@/lib/api";
import Link from "next/link";
import { 
  Search, 
  ExternalLink, 
  MapPin, 
  Building2, 
  X, 
  ShieldCheck, 
  Clock, 
  Users, 
  Briefcase, 
  Globe, 
  ArrowRight, 
  Zap,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface InteractiveCompaniesProps {
  initialCompanies: Company[];
  initialStats?: OverviewStats | null;
}

const COMPANIES_PER_PAGE = 12;

function getCleanDomain(websiteOrSlug?: string | null): string {
  if (!websiteOrSlug) return "";
  try {
    const raw = websiteOrSlug.trim();
    const withProtocol = raw.startsWith("http") ? raw : `https://${raw}`;
    const parsed = new URL(withProtocol);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return (websiteOrSlug || "").replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
  }
}

function CompanyLogo({ company }: { company: Company }) {
  const [imgError, setImgError] = useState(false);
  const domain = getCleanDomain(company.website || company.slug);
  
  // Prefer logo_url if provided, otherwise high-res favicon based on official company domain
  const logoSrc = (!imgError && company.logo_url)
    ? company.logo_url
    : (!imgError && domain)
    ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`
    : null;

  const initial = (company.name || "C").charAt(0).toUpperCase();

  return (
    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-center p-2 shrink-0 group-hover:border-slate-300 transition-colors overflow-hidden">
      {logoSrc ? (
        <img
          src={logoSrc}
          alt={`${company.name} logo`}
          className="w-full h-full object-contain"
          onError={() => setImgError(true)}
          loading="lazy"
        />
      ) : (
        <span className="text-base font-black text-teal-700 bg-teal-50 w-full h-full rounded-lg flex items-center justify-center">
          {initial}
        </span>
      )}
    </div>
  );
}

export function InteractiveCompanies({ initialCompanies, initialStats }: InteractiveCompaniesProps) {
  const [search, setSearch] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [sortBy, setSortBy] = useState("openings"); // "openings", "name", "newest"
  const [currentPage, setCurrentPage] = useState(1);
  const [jumpPageInput, setJumpPageInput] = useState("");

  const totalCompaniesCount = initialStats?.total_companies || initialCompanies.length || 17584;

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

    // Sorting
    return [...list].sort((a, b) => {
      if (sortBy === "openings") return (b.active_job_count || 0) - (a.active_job_count || 0);
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "newest") return b.id - a.id;
      return 0;
    });
  }, [initialCompanies, search, selectedIndustry, selectedCountry, sortBy]);

  const totalPages = Math.ceil(filtered.length / COMPANIES_PER_PAGE) || 1;

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedIndustry, selectedCountry, sortBy]);

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
          HERO SECTION: High Impact, Compact, SaaS/ATS Aesthetic
          ======================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/50 via-white to-slate-50 border-b border-slate-200/80 pt-10 pb-12 sm:pt-14 sm:pb-16">
        {/* Subtle mesh background grid & ambient light */}
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />
        <div className="absolute top-0 right-1/4 -translate-y-12 w-96 h-96 bg-teal-200/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-10 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-10">
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-4 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>VERIFIED COMPANIES • OFFICIAL CAREER PORTALS</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-black text-slate-900 tracking-tight leading-[1.15] mb-4">
                Discover companies that are{" "}
                <span className="text-teal-600 underline decoration-teal-300 decoration-wavy decoration-2 underline-offset-4">
                  actually hiring
                </span>.
              </h1>

              {/* Supporting Text */}
              <p className="text-sm sm:text-base text-slate-600 mb-7 max-w-xl leading-relaxed">
                Explore {totalCompaniesCount.toLocaleString()} official career portals with verified openings posted in the last 30 days. Follow your favorite companies and never miss a new opportunity.
              </p>

              {/* 3 Metric Badges */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-lg">
                <div className="bg-white/80 backdrop-blur-xs border border-slate-200/80 rounded-2xl p-3 sm:p-3.5 flex items-center gap-3 shadow-2xs hover:border-slate-300 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm sm:text-base font-black text-slate-900 truncate">
                      {totalCompaniesCount.toLocaleString()}
                    </div>
                    <div className="text-[11px] sm:text-xs font-medium text-slate-500 truncate">
                      Verified Companies
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xs border border-slate-200/80 rounded-2xl p-3 sm:p-3.5 flex items-center gap-3 shadow-2xs hover:border-slate-300 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5 text-teal-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm sm:text-base font-black text-slate-900 truncate">
                      {initialStats?.total_jobs ? `${Number(initialStats.total_jobs).toLocaleString()}+` : "1.2M+"}
                    </div>
                    <div className="text-[11px] sm:text-xs font-medium text-slate-500 truncate">
                      Active Openings
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xs border border-slate-200/80 rounded-2xl p-3 sm:p-3.5 flex items-center gap-3 shadow-2xs hover:border-slate-300 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5 text-sky-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm sm:text-base font-black text-slate-900 truncate">
                      Global
                    </div>
                    <div className="text-[11px] sm:text-xs font-medium text-slate-500 truncate">
                      150+ Countries
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual: Art-directed Floating Network & Trust Indicators */}
            <div className="lg:col-span-5 relative hidden sm:flex items-center justify-center min-h-[340px]">
              {/* Radial Network Glow / Mesh */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-72 h-72 rounded-full bg-teal-100/50 blur-2xl" />
                <svg className="w-full h-full max-w-[420px] max-h-[320px] opacity-35" viewBox="0 0 400 300" fill="none">
                  <circle cx="200" cy="150" r="110" stroke="#0d9488" strokeWidth="1" strokeDasharray="4 4" />
                  <circle cx="200" cy="150" r="60" stroke="#0d9488" strokeWidth="1" strokeDasharray="2 2" />
                  <line x1="80" y1="90" x2="200" y2="150" stroke="#99f6e4" strokeWidth="1.2" />
                  <line x1="320" y1="90" x2="200" y2="150" stroke="#99f6e4" strokeWidth="1.2" />
                  <line x1="200" y1="150" x2="110" y2="240" stroke="#99f6e4" strokeWidth="1.2" />
                  <line x1="200" y1="150" x2="290" y2="230" stroke="#99f6e4" strokeWidth="1.2" />
                </svg>
              </div>

              {/* Floating Company Logos */}
              <div className="absolute top-4 left-24 w-12 h-12 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center p-2.5 hover:scale-110 transition-transform duration-300">
                <img src="https://www.google.com/s2/favicons?domain=google.com&sz=128" alt="Google" className="w-full h-full object-contain" />
              </div>

              <div className="absolute top-20 left-4 w-12 h-12 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center p-2.5 hover:scale-110 transition-transform duration-300">
                <img src="https://www.google.com/s2/favicons?domain=microsoft.com&sz=128" alt="Microsoft" className="w-full h-full object-contain" />
              </div>

              <div className="absolute top-24 left-36 w-14 h-14 rounded-2xl bg-white shadow-lg border border-slate-100 flex items-center justify-center p-2.5 hover:scale-110 transition-transform duration-300">
                <img src="https://www.google.com/s2/favicons?domain=amazon.com&sz=128" alt="Amazon" className="w-full h-full object-contain" />
              </div>

              <div className="absolute bottom-10 left-12 w-12 h-12 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center p-2.5 hover:scale-110 transition-transform duration-300">
                <img src="https://www.google.com/s2/favicons?domain=apple.com&sz=128" alt="Apple" className="w-full h-full object-contain" />
              </div>

              <div className="absolute top-10 right-28 w-12 h-12 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center p-2.5 hover:scale-110 transition-transform duration-300">
                <img src="https://www.google.com/s2/favicons?domain=meta.com&sz=128" alt="Meta" className="w-full h-full object-contain" />
              </div>

              <div className="absolute top-32 right-20 w-12 h-12 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center p-2.5 hover:scale-110 transition-transform duration-300">
                <img src="https://www.google.com/s2/favicons?domain=netflix.com&sz=128" alt="Netflix" className="w-full h-full object-contain" />
              </div>

              {/* 3 Trust Badges Stacked on Right */}
              <div className="absolute right-0 top-2 flex flex-col gap-2.5 z-10 max-w-[195px]">
                <div className="bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-xl p-2.5 shadow-xs flex items-center gap-2.5 hover:border-emerald-300 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 leading-tight">Verified Sources</p>
                    <p className="text-[10px] text-slate-500 truncate">Official career portals only</p>
                  </div>
                </div>

                <div className="bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-xl p-2.5 shadow-xs flex items-center gap-2.5 hover:border-sky-300 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 leading-tight">Updated Hourly</p>
                    <p className="text-[10px] text-slate-500 truncate">Fresh company data</p>
                  </div>
                </div>

                <div className="bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-xl p-2.5 shadow-xs flex items-center gap-2.5 hover:border-purple-300 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 leading-tight">Global Coverage</p>
                    <p className="text-[10px] text-slate-500 truncate">Companies from 150+ countries</p>
                  </div>
                </div>
              </div>

              {/* Floating speech pill at bottom right */}
              <div className="absolute bottom-2 right-4 bg-emerald-50/95 border border-emerald-200/80 rounded-xl px-3 py-2 flex items-center gap-2 shadow-2xs z-10">
                <Zap className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <div className="text-[11px] leading-tight">
                  <span className="font-semibold text-emerald-900">Real openings. </span>
                  <span className="text-emerald-700">Direct from company career pages.</span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              SEARCH BAR: Premium Floating Style
              ======================================================== */}
          <div className="max-w-4xl mx-auto mb-4">
            <div className="relative flex items-center bg-white rounded-2xl shadow-sm border border-slate-200/90 p-1.5 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20 transition-all">
              <Search className="w-5 h-5 text-slate-400 ml-3.5 shrink-0 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search companies by name, domain, or industry..."
                className="w-full px-3.5 py-2.5 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 bg-transparent outline-none"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg mr-1 transition-colors cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => {
                  const gridEl = document.getElementById("companies-results-grid");
                  if (gridEl) gridEl.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors shrink-0 shadow-2xs cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>
          </div>

          {/* Secondary Filter & Sort Row */}
          <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 pt-1">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Country Filter */}
              <div className="relative">
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="appearance-none bg-white border border-slate-200/90 rounded-xl px-3 py-1.5 pr-7 text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:border-teal-500 cursor-pointer shadow-2xs"
                >
                  <option value="All">All Countries (Worldwide)</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Industry Filter */}
              <div className="relative">
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="appearance-none bg-white border border-slate-200/90 rounded-xl px-3 py-1.5 pr-7 text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:border-teal-500 cursor-pointer shadow-2xs"
                >
                  <option value="All">All Industries</option>
                  {industries.map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Sort Filter */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-slate-200/90 rounded-xl px-3 py-1.5 pr-7 text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:border-teal-500 cursor-pointer shadow-2xs"
                >
                  <option value="openings">Most Openings</option>
                  <option value="name">Company Name (A–Z)</option>
                  <option value="newest">Newest First</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Matching Count */}
            <div className="font-semibold text-slate-500">
              <span className="text-slate-900">{filtered.length.toLocaleString()}</span> companies
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          COMPANIES GRID: 3-column desktop, 2-column tablet, 1-col mobile
          ======================================================== */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-10">
        <div id="companies-results-grid" className="scroll-mt-24">
          {filtered.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedCompanies.map((company) => (
                  <div
                    key={company.id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 hover:border-slate-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group relative"
                  >
                    <div>
                      {/* Top Header: Logo, Name, Domain & Featured Tag */}
                      <div className="flex items-start justify-between gap-3 mb-3.5">
                        <div className="flex items-center gap-3 min-w-0">
                          <CompanyLogo company={company} />
                          <div className="min-w-0">
                            <Link href={`/companies/${company.slug}`} className="group/link block">
                              <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover/link:text-teal-600 transition-colors truncate">
                                {company.name}
                              </h2>
                            </Link>
                            <span className="text-xs text-slate-400 font-medium truncate block">
                              {getCleanDomain(company.website || company.slug) || (company.industry || "Official ATS")}
                            </span>
                          </div>
                        </div>

                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-100/90 text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0">
                          {company.active_job_count > 0 ? "Featured" : "Verified"}
                        </span>
                      </div>

                      {/* Description: 2-line clamp */}
                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 h-10 leading-relaxed mb-4">
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
                        {company.employee_count_range && (
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            <span>{company.employee_count_range} employees</span>
                          </div>
                        )}
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
                ))}
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
