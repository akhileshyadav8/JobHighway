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
          HERO SECTION: High Impact, Clean White, Refined Canvas
          ======================================================== */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200/80 pt-8 pb-10 sm:pt-12 sm:pb-12">
        {/* Soft, subtle radial ambient glow restricted behind the right graphic */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[520px] h-[380px] bg-gradient-to-bl from-teal-100/40 via-emerald-50/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center mb-8">
            {/* Left Content */}
            <div className="lg:col-span-6 xl:col-span-5 flex flex-col items-start text-left">
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>VERIFIED COMPANIES</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] xl:text-[46px] font-black text-slate-900 tracking-tight leading-[1.12] mb-4">
                Discover companies<br />
                that are{" "}
                <span className="text-teal-600">
                  actually hiring.
                </span>
              </h1>

              {/* Supporting Text */}
              <p className="text-sm sm:text-base text-slate-600 mb-6 max-w-lg leading-relaxed">
                Explore verified companies and discover fresh opportunities directly from official career portals. Follow your favorite companies and never miss a new opportunity.
              </p>

              {/* 3 Metric Badges */}
              <div className="grid grid-cols-3 gap-3 sm:gap-3.5 w-full max-w-lg">
                <div className="bg-white border border-slate-200/80 rounded-2xl p-3 sm:p-3.5 flex items-center gap-3 shadow-2xs hover:border-slate-300 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-teal-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-base sm:text-lg font-black text-slate-900 truncate">
                      {totalCompaniesCount.toLocaleString()}
                    </div>
                    <div className="text-[11px] sm:text-xs font-medium text-slate-500 truncate">
                      Verified Companies
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-2xl p-3 sm:p-3.5 flex items-center gap-3 shadow-2xs hover:border-slate-300 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5 text-teal-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-base sm:text-lg font-black text-slate-900 truncate">
                      {initialStats?.total_jobs ? `${Number(initialStats.total_jobs).toLocaleString()}+` : "1.2M+"}
                    </div>
                    <div className="text-[11px] sm:text-xs font-medium text-slate-500 truncate">
                      Active Openings
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-2xl p-3 sm:p-3.5 flex items-center gap-3 shadow-2xs hover:border-slate-300 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5 text-sky-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-base sm:text-lg font-black text-slate-900 truncate">
                      150+
                    </div>
                    <div className="text-[11px] sm:text-xs font-medium text-slate-500 truncate">
                      Countries
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual Canvas: Globe Orbit, 6 Company Logo Cards, Annotations & 3 Feature Cards */}
            <div className="lg:col-span-6 xl:col-span-7 relative hidden md:flex items-center justify-end min-h-[350px]">
              <div className="w-full max-w-[650px] h-[340px] relative select-none">
                
                {/* Globe Network Mesh & Orbit Rings */}
                <div className="absolute left-4 top-4 w-[380px] h-[300px] pointer-events-none flex items-center justify-center">
                  <div className="w-56 h-56 rounded-full bg-teal-100/35 blur-2xl" />
                  <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 380 300" fill="none">
                    <ellipse cx="190" cy="150" rx="140" ry="105" stroke="#0d9488" strokeWidth="1" strokeDasharray="4 4" />
                    <ellipse cx="190" cy="150" rx="85" ry="65" stroke="#0d9488" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="80" y1="120" x2="190" y2="40" stroke="#14b8a6" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />
                    <line x1="190" y1="40" x2="300" y2="65" stroke="#14b8a6" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />
                    <line x1="80" y1="120" x2="200" y2="135" stroke="#14b8a6" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />
                    <line x1="200" y1="135" x2="300" y2="65" stroke="#14b8a6" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />
                    <line x1="200" y1="135" x2="310" y2="190" stroke="#14b8a6" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />
                    <line x1="150" y1="240" x2="200" y2="135" stroke="#14b8a6" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />
                    <circle cx="120" cy="80" r="2.5" fill="#0d9488" opacity="0.5" />
                    <circle cx="260" cy="85" r="2" fill="#0d9488" opacity="0.5" />
                    <circle cx="130" cy="200" r="2" fill="#0d9488" opacity="0.5" />
                    <circle cx="270" cy="210" r="2.5" fill="#0d9488" opacity="0.5" />
                  </svg>
                </div>

                {/* Hand-drawn annotation: "Top companies hiring worldwide" */}
                <div className="absolute top-2 left-6 z-20 pointer-events-none">
                  <p className="font-serif italic text-teal-800 text-xs sm:text-[13px] leading-tight select-none">
                    Top companies<br />
                    hiring worldwide
                  </p>
                  <svg width="34" height="28" viewBox="0 0 34 28" fill="none" className="text-teal-600 mt-0.5 ml-4">
                    <path d="M4 4C8 16 16 22 26 20M26 20L20 17M26 20L23 25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                {/* Floating Company Logos with dedicated high-res vector marks */}
                {/* 1. Google (Top Center) */}
                <div 
                  className="absolute z-10 w-13 h-13 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center p-2.5 hover:scale-110 transition-transform duration-300 cursor-pointer"
                  style={{ top: "16px", left: "190px" }}
                  title="Google"
                >
                  <svg viewBox="0 0 24 24" className="w-7 h-7">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.12z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.26 21.36 7.33 24 12 24z" />
                    <path fill="#FBBC05" d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.13z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z" />
                  </svg>
                </div>

                {/* 2. Microsoft (Left Center) */}
                <div 
                  className="absolute z-10 w-13 h-13 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center p-2.5 hover:scale-110 transition-transform duration-300 cursor-pointer"
                  style={{ top: "100px", left: "60px" }}
                  title="Microsoft"
                >
                  <svg viewBox="0 0 23 23" className="w-6 h-6">
                    <path fill="#f35325" d="M1 1h10v10H1z"/>
                    <path fill="#81bc06" d="M12 1h10v10H12z"/>
                    <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                    <path fill="#ffba08" d="M12 12h10v10H12z"/>
                  </svg>
                </div>

                {/* 3. Amazon (Middle Center) */}
                <div 
                  className="absolute z-10 w-14 h-14 rounded-2xl bg-white shadow-lg border border-slate-100 flex items-center justify-center p-2.5 hover:scale-110 transition-transform duration-300 cursor-pointer"
                  style={{ top: "108px", left: "190px" }}
                  title="Amazon"
                >
                  <svg viewBox="0 0 24 24" className="w-7 h-7">
                    <path fill="#000000" d="M13.9 14.8c-.8.7-2.1 1.1-3.3 1.1-2.5 0-4-1.6-4-4.2 0-3 2-4.8 5-4.8 1 0 1.9.2 2.3.4v-.8c0-1.4-.9-2.1-2.4-2.1-.9 0-1.8.3-2.6.7-.2.1-.4 0-.5-.2l-.4-.7c-.1-.2 0-.4.2-.6 1-.6 2.3-.9 3.6-.9 2.5 0 4.1 1.3 4.1 3.8v5.8c0 .8.2 1.2.5 1.7.2.2.1.5-.1.7l-.8.7c-.2.2-.5.1-.6-.1-.3-.6-.5-1.1-.5-1.6zm-1.8-1.5c1 0 1.8-.4 1.8-1.6v-1.6c-.4-.2-1.1-.3-1.8-.3-1.7 0-2.8.9-2.8 2.6 0 1.3.8 1.9 2.2 1.9z" />
                    <path fill="#FF9900" d="M21.7 18.2c-2.8 2-6.8 3.1-10.4 3.1-4.9 0-9.4-1.9-12.8-5.1-.3-.3-.1-.7.3-.5 3.7 2.1 8.2 3.4 12.8 3.4 3.2 0 6.8-.8 9.7-2.4.5-.3.9.2.4.5z" />
                    <path fill="#FF9900" d="M22.8 17c-.3-.4-2.1-.2-3.2.1-.3.1-.4-.2-.1-.4 1.7-1.2 3.7-.4 3.9-.1.3.4.1 2.3-1.4 3.7-.3.2-.5.1-.4-.2.4-.9 1.5-2.7 1.2-3.1z" />
                  </svg>
                </div>

                {/* 4. Apple (Bottom Center) */}
                <div 
                  className="absolute z-10 w-13 h-13 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center p-2.5 hover:scale-110 transition-transform duration-300 cursor-pointer"
                  style={{ top: "215px", left: "135px" }}
                  title="Apple"
                >
                  <svg viewBox="0 0 24 24" className="w-7 h-7 fill-slate-900">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 1.01-2.87-.96.04-2.12.64-2.79 1.43-.59.68-1.1 1.74-1.03 2.8 1.07.08 2.18-.58 2.81-1.36z"/>
                  </svg>
                </div>

                {/* 5. Meta (Upper Right) */}
                <div 
                  className="absolute z-10 w-13 h-13 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center p-2.5 hover:scale-110 transition-transform duration-300 cursor-pointer"
                  style={{ top: "42px", left: "305px" }}
                  title="Meta"
                >
                  <svg viewBox="0 0 24 24" className="w-7 h-7 fill-[#0668E1]">
                    <path d="M16.924 3.003c-2.373.01-4.39 1.428-5.32 2.827-1.004-1.488-3.08-2.842-5.462-2.827C2.756 3.018 0 5.753 0 9.771c0 4.743 3.738 8.87 8.324 10.99 1.15.53 2.427.818 3.722.818 1.264 0 2.51-.277 3.633-.789 4.63-2.109 8.32-6.26 8.32-11.02 0-4.017-2.756-6.752-6.075-6.767zm-5.405 13.91c-.89.406-1.88.625-2.875.625-3.375 0-6.107-3.04-6.107-6.772 0-2.678 1.76-4.57 4.06-4.582 1.83-.01 3.493 1.34 4.195 3.328l.727 3.4zm1.962 0l.728-3.4c.702-1.988 2.364-3.338 4.194-3.328 2.3.012 4.06 1.904 4.06 4.582 0 3.732-2.732 6.772-6.107 6.772-.995 0-1.985-.22-2.875-.626z"/>
                  </svg>
                </div>

                {/* 6. Netflix (Lower Right) */}
                <div 
                  className="absolute z-10 w-13 h-13 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center p-2.5 hover:scale-110 transition-transform duration-300 cursor-pointer"
                  style={{ top: "155px", left: "315px" }}
                  title="Netflix"
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6">
                    <path fill="#B81D24" d="M4 0h4v23.5C6.7 23.8 5.3 24 4 24V0z"/>
                    <path fill="#B81D24" d="M16 0h4v24c-1.3 0-2.7-.2-4-.5V0z"/>
                    <path fill="#E50914" d="M4 0h4.1l7.9 23.5c-1.3.3-2.7.5-4 .5L4 0z"/>
                  </svg>
                </div>

                {/* Hand-drawn annotation: "Verified from official career portals" (top right) */}
                <div className="absolute top-0 right-3 z-20 pointer-events-none flex items-start gap-1">
                  <svg width="28" height="26" viewBox="0 0 28 26" fill="none" className="text-teal-600 mt-1 shrink-0 -rotate-12">
                    <path d="M4 20C10 8 18 4 24 8M24 8L18 6M24 8L21 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p className="font-serif italic text-teal-800 text-xs sm:text-[13px] leading-tight select-none pt-0.5">
                    Verified from<br />
                    official career portals
                  </p>
                </div>

                {/* 3 Trust Badges Stacked on Right (Unclipped & Crisp) */}
                <div className="absolute right-0 top-14 flex flex-col gap-2.5 z-10 w-[215px]">
                  <div className="bg-white border border-slate-200/90 rounded-xl p-2.5 shadow-2xs flex items-center gap-2.5 hover:border-emerald-300 transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 leading-tight">Official Sources</p>
                      <p className="text-[11px] text-slate-500 whitespace-nowrap">Company career portals only</p>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200/90 rounded-xl p-2.5 shadow-2xs flex items-center gap-2.5 hover:border-sky-300 transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 leading-tight">Updated Hourly</p>
                      <p className="text-[11px] text-slate-500 whitespace-nowrap">Fresh company data</p>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200/90 rounded-xl p-2.5 shadow-2xs flex items-center gap-2.5 hover:border-purple-300 transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 leading-tight">Global Coverage</p>
                      <p className="text-[11px] text-slate-500 whitespace-nowrap">Companies from 150+ countries</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* ========================================================
              STANDARDIZED SEARCH BAR (Full Container Width)
              ======================================================== */}
          <div className="w-full mb-3.5">
            <SearchBar
              value={search}
              onChange={setSearch}
              onSearch={() => {
                const gridEl = document.getElementById("companies-results-grid");
                if (gridEl) gridEl.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              placeholder="Search companies by name, domain, or location..."
              className="w-full shadow-xs"
            />
          </div>

          {/* ========================================================
              SINGLE-ROW FILTER TOOLBAR: Country, Industry, Size, Sort + Count
              ======================================================== */}
          <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-slate-600 pt-0.5">
            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
              {/* Country Filter */}
              <div className="relative">
                <div className="flex items-center bg-white border border-slate-200/90 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-300 shadow-2xs transition-colors">
                  <Globe className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0 pointer-events-none" />
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="appearance-none bg-transparent pr-6 focus:outline-none cursor-pointer text-slate-700 font-medium"
                  >
                    <option value="All">All Countries (Worldwide)</option>
                    {countries.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Industry Filter */}
              <div className="relative">
                <div className="flex items-center bg-white border border-slate-200/90 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-300 shadow-2xs transition-colors">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0 pointer-events-none" />
                  <select
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                    className="appearance-none bg-transparent pr-6 focus:outline-none cursor-pointer text-slate-700 font-medium"
                  >
                    <option value="All">All Industries</option>
                    {industries.map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Company Size Filter */}
              <div className="relative">
                <div className="flex items-center bg-white border border-slate-200/90 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-300 shadow-2xs transition-colors">
                  <Users className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0 pointer-events-none" />
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="appearance-none bg-transparent pr-6 focus:outline-none cursor-pointer text-slate-700 font-medium"
                  >
                    <option value="All">All Company Sizes</option>
                    <option value="10k+">10K+ employees</option>
                    <option value="1k-10k">1K–10K employees</option>
                    <option value="<1k">Under 1K employees</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Sort Filter */}
              <div className="relative">
                <div className="flex items-center bg-white border border-slate-200/90 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-300 shadow-2xs transition-colors">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0 pointer-events-none" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-transparent pr-6 focus:outline-none cursor-pointer text-slate-700 font-medium"
                  >
                    <option value="openings">Most Openings</option>
                    <option value="newest">Newest First</option>
                    <option value="name">Company Name (A–Z)</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Right Aligned Matching Count */}
            <div className="text-xs font-medium text-slate-500 shrink-0 self-end md:self-center">
              <span className="font-bold text-slate-900">{filtered.length.toLocaleString()}</span> companies
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          COMPANIES GRID: STRICTLY 3 columns on desktop, 2 on tablet, 1 on mobile
          ======================================================== */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8 sm:py-10">
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
                              {getCleanDomain(company.website, company.slug, company.name) || "official website"}
                            </span>
                          </div>
                        </div>

                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[11px] font-semibold px-2.5 py-0.5 rounded-full shrink-0">
                          Featured
                        </span>
                      </div>

                      {/* Description: 2-line clamp */}
                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 h-10 leading-relaxed mb-4">
                        {company.description || `${company.name} is hiring verified talent directly on official career portals.`}
                      </p>

                      {/* Metadata Row: Location & Employees with vertical divider */}
                      <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 mb-5">
                        <div className="flex items-center gap-1.5 shrink-0">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[150px] sm:max-w-[170px]">
                            {company.headquarters || 'Worldwide / Remote'}
                          </span>
                        </div>
                        {company.employee_count_range && (
                          <>
                            <span className="text-slate-300">|</span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{company.employee_count_range} employees</span>
                            </div>
                          </>
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
                <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
                  <div className="text-xs sm:text-sm text-slate-500 font-medium">
                    Showing <strong className="text-slate-900 font-bold">{((currentPage - 1) * COMPANIES_PER_PAGE) + 1}</strong>–<strong className="text-slate-900 font-bold">{Math.min(currentPage * COMPANIES_PER_PAGE, filtered.length)}</strong> of <strong className="text-slate-900 font-bold">{filtered.length.toLocaleString()}</strong> companies (Page {currentPage} of {totalPages.toLocaleString()})
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage <= 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="rounded-xl text-xs font-semibold px-3.5 h-8.5 cursor-pointer border-slate-200 hover:bg-slate-50 disabled:opacity-40"
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
                          className={`w-8.5 h-8.5 p-0 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                            p === currentPage
                              ? "bg-teal-600 hover:bg-teal-700 text-white shadow-xs border-teal-600"
                              : "text-slate-700 border-slate-200 hover:border-teal-500 hover:text-teal-600 bg-white"
                          }`}
                        >
                          {p}
                        </Button>
                      ) : (
                        <span key={idx} className="px-1 text-slate-400 text-xs font-bold select-none">...</span>
                      )
                    ))}

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage >= totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="rounded-xl text-xs font-semibold px-3.5 h-8.5 cursor-pointer border-slate-200 hover:bg-slate-50 disabled:opacity-40"
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
                      className="text-xs h-7.5 px-3 rounded-lg cursor-pointer border-slate-200 hover:bg-slate-50"
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
