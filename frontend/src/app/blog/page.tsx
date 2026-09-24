"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import {
  Search,
  X,
  Clock,
  Calendar,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Star,
  FileText,
  Briefcase,
  GraduationCap,
  BarChart3,
  Sparkles,
  Compass,
  Target,
  Cpu,
  Code2,
  Building2,
  Globe,
  Mail,
  CheckCircle2,
  Share2,
} from "lucide-react";
import { BLOG_ARTICLES, BlogArticle } from "@/lib/blog_articles";

// Categories matching reference design
const CATEGORIES = [
  { id: "All", label: "All Articles", icon: null },
  { id: "Career Strategy", label: "Career Strategy", icon: Compass },
  { id: "Interview Prep", label: "Interview Prep", icon: Target },
  { id: "Tech Guide", label: "Tech Guide", icon: Cpu },
  { id: "Coding", label: "Coding", icon: Code2 },
  { id: "Resume & ATS", label: "Resume & ATS", icon: FileText },
  { id: "Company Guides", label: "Company Guides", icon: Building2 },
  { id: "Remote Work", label: "Remote Work", icon: Globe },
] as const;

const ARTICLES_PER_PAGE = 6;

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "readTime">("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "success">("idle");

  const categoriesContainerRef = useRef<HTMLDivElement>(null);

  // Featured article is the flagship playbook (id: "1" or slug: "crack-off-campus-hiring-2026")
  const featuredArticle = useMemo(() => {
    return (
      BLOG_ARTICLES.find((a) => a.slug === "crack-off-campus-hiring-2026") ||
      BLOG_ARTICLES[0]
    );
  }, []);

  // Filter and sort articles for the Latest Articles grid
  const filteredArticles = useMemo(() => {
    let list = BLOG_ARTICLES.filter((article) => {
      // Category filter
      if (selectedCategory !== "All" && article.category !== selectedCategory) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = article.title.toLowerCase().includes(q);
        const matchesSummary = article.summary.toLowerCase().includes(q);
        const matchesTag = article.tags.some((t) => t.toLowerCase().includes(q));
        const matchesAuthor = article.author.name.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSummary && !matchesTag && !matchesAuthor) {
          return false;
        }
      }
      return true;
    });

    // Sorting
    if (sortBy === "oldest") {
      list = [...list].reverse();
    } else if (sortBy === "readTime") {
      list = [...list].sort(
        (a, b) => parseInt(a.readTime) - parseInt(b.readTime)
      );
    }

    return list;
  }, [selectedCategory, searchQuery, sortBy]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE));
  const displayedArticles = useMemo(() => {
    const start = (currentPage - 1) * ARTICLES_PER_PAGE;
    return filteredArticles.slice(start, start + ARTICLES_PER_PAGE);
  }, [filteredArticles, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    const gridEl = document.getElementById("articles-section");
    if (gridEl) {
      gridEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Dynamic pagination numbers based on actual count of pages
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | string)[] = [];
    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }
    return pages;
  };

  const scrollCategoriesRight = () => {
    if (categoriesContainerRef.current) {
      categoriesContainerRef.current.scrollBy({ left: 160, behavior: "smooth" });
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim() && newsletterEmail.includes("@")) {
      setNewsletterStatus("success");
      setNewsletterEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 antialiased">
      {/* ========================================================
          HERO SECTION: Pixel-matched to reference design
          Eyebrow badge + Headline + Subtitle + Search Input
          Right side: Subtle /world.svg with connected floating nodes
          ======================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f0fdfa]/60 via-white to-[#f8fafc] pt-12 pb-14 sm:pt-16 sm:pb-16 border-b border-slate-100">
        {/* Subtle mesh pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1360px] relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Hero Content */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold tracking-wider mb-4 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>LEARN • GROW • GET HIRED</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-black text-slate-900 tracking-tight leading-[1.18] mb-4">
                JobPulse Playbook &amp;{" "}
                <span className="text-[#0d9488]">Career Blog</span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed mb-8">
                Data-backed playbooks on beating ATS, cracking high-paying tech interviews, and landing verified roles worldwide.
              </p>

              {/* Canonical Search Input with embedded solid teal Search button */}
              <div className="relative w-full max-w-xl flex items-center bg-white rounded-full border border-slate-200 shadow-sm hover:border-slate-300 focus-within:ring-2 focus-within:ring-teal-500/30 focus-within:border-teal-500 transition-all p-1.5">
                <Search className="w-5 h-5 text-slate-400 ml-3.5 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search articles, e.g. 'ATS tips', 'SQL interview', 'resume format'..."
                  className="w-full px-3 py-2 text-sm text-slate-900 placeholder-slate-400 bg-transparent outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-slate-400 hover:text-slate-600 p-1 mr-1"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => {
                    const gridEl = document.getElementById("articles-section");
                    if (gridEl) gridEl.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-6 py-2.5 bg-[#0d9488] hover:bg-[#0f766e] text-white text-sm font-semibold rounded-full transition-all shadow-xs shrink-0 cursor-pointer"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Right Column: Large World Map + Connected Floating Node Badges */}
            <div className="lg:col-span-5 relative hidden lg:flex items-center justify-center min-h-[380px] xl:min-h-[410px]">
              <div className="relative w-full max-w-[620px] h-[370px] flex items-center justify-center">
                
                {/* Vector World Map Background with ambient glow matching Companies page */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                  {/* Soft radial glow behind the world map */}
                  <div className="absolute w-[500px] h-[320px] bg-gradient-to-tr from-teal-200/40 via-teal-100/25 to-transparent rounded-full blur-2xl pointer-events-none" />
                  
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/world.svg"
                    alt="World Map"
                    className="w-full h-full object-contain pointer-events-none select-none relative z-0"
                  />
                </div>

                {/* SVG Connecting Dashed Network Arcs matching reference design */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none z-10"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="networkGradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#0d9488" stopOpacity="0.3" />
                      <stop offset="40%" stopColor="#0d9488" stopOpacity="0.75" />
                      <stop offset="80%" stopColor="#0d9488" stopOpacity="0.65" />
                      <stop offset="100%" stopColor="#0d9488" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>

                  {/* Left incoming airway trail */}
                  <path
                    d="M 8 36 Q 14 38, 22 44"
                    stroke="url(#networkGradient)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />

                  {/* Upper Pathway: Document (22, 44) -> Briefcase (52, 28) -> Graduation Cap (78, 58) */}
                  <path
                    d="M 22 44 Q 36 24, 52 28 Q 66 32, 78 58"
                    stroke="url(#networkGradient)"
                    strokeWidth="1.75"
                    strokeDasharray="4 4"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />

                  {/* Lower Pathway: Document (22, 44) -> Bar Chart (38, 56) -> Graduation Cap (78, 58) */}
                  <path
                    d="M 22 44 Q 28 52, 38 56 Q 58 64, 78 58"
                    stroke="url(#networkGradient)"
                    strokeWidth="1.75"
                    strokeDasharray="4 4"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />

                  {/* Right outgoing trail */}
                  <path
                    d="M 78 58 Q 86 64, 94 66"
                    stroke="url(#networkGradient)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>

                {/* Card 1: Left - Document Badge (Resume & ATS) */}
                <div
                  style={{ left: "22%", top: "44%" }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-white shadow-md border border-slate-100/90 flex items-center justify-center z-20 hover:scale-110 transition-transform cursor-pointer group"
                  title="ATS Resume Guidelines"
                >
                  <FileText className="w-5 h-5 text-emerald-600 transition-transform group-hover:scale-110" />
                </div>

                {/* Card 2: Upper Center - Teal Briefcase Badge (Official Jobs) */}
                <div
                  style={{ left: "52%", top: "28%" }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-[#0d9488] shadow-lg border-2 border-white flex items-center justify-center z-20 hover:scale-110 transition-transform cursor-pointer group"
                  title="Official Career Portals"
                >
                  <Briefcase className="w-5 h-5 text-white transition-transform group-hover:scale-110" />
                </div>

                {/* Card 3: Lower Center - Bar Chart Badge (Salary Trends) */}
                <div
                  style={{ left: "38%", top: "56%" }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-white shadow-md border border-slate-100/90 flex items-center justify-center z-20 hover:scale-110 transition-transform cursor-pointer group"
                  title="Live Tech Salary Trends"
                >
                  <BarChart3 className="w-5 h-5 text-teal-600 transition-transform group-hover:scale-110" />
                </div>

                {/* Card 4: Right - Graduation Cap Badge (Campus to Corporate) */}
                <div
                  style={{ left: "78%", top: "58%" }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white shadow-md border border-slate-100/90 flex items-center justify-center z-20 hover:scale-110 transition-transform cursor-pointer group"
                  title="Campus to Corporate Playbook"
                >
                  <GraduationCap className="w-6 h-6 text-sky-600 transition-transform group-hover:scale-110" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          CATEGORY NAVIGATION PILLS
          Horizontal scrollable pills + right scroll arrow button
          ======================================================== */}
      <section className="bg-white border-b border-slate-200/80 sticky top-16 z-30 shadow-2xs">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1360px]">
          <div className="flex items-center justify-between py-3.5 gap-4">
            
            {/* Scrollable Pills Row */}
            <div
              ref={categoriesContainerRef}
              className="flex items-center gap-2.5 overflow-x-auto no-scrollbar scroll-smooth py-0.5"
            >
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setCurrentPage(1);
                    }}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#e6fcf8] text-[#0d9488] border border-teal-200 shadow-2xs font-bold"
                        : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200"
                    }`}
                  >
                    {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#0d9488]" : "text-slate-400"}`} />}
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Right Scroll Arrow Button */}
            <button
              onClick={scrollCategoriesRight}
              className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 shrink-0 shadow-2xs transition-colors cursor-pointer"
              title="Scroll categories"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          MAIN CONTENT CONTAINER
          ======================================================== */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1360px] py-10 sm:py-12 space-y-12 sm:space-y-14">
        
        {/* ========================================================
            FEATURED ARTICLE: Prominent Highlight Card
            ======================================================== */}
        <section>
          {/* Section Header */}
          <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  Featured Article
                </h2>
                <p className="text-xs text-slate-500">
                  Our top pick to help you in your career journey
                </p>
              </div>
            </div>

            <Link
              href={`/blog/${featuredArticle.slug}`}
              className="text-xs sm:text-sm font-semibold text-[#0d9488] hover:text-[#0f766e] inline-flex items-center gap-1 group transition-colors"
            >
              <span>View All Featured</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Featured Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              
              {/* Left Column: Text & Meta Details */}
              <div className="lg:col-span-6 p-7 sm:p-9 lg:p-10 flex flex-col justify-between h-full">
                <div>
                  {/* Category & Read Time Row */}
                  <div className="flex items-center gap-3 text-xs mb-4">
                    <span className="font-bold uppercase tracking-wider text-[#0d9488] bg-[#e6fcf8] px-3 py-1 rounded-full border border-teal-200/80 inline-flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-[#0d9488]" />
                      {featuredArticle.category}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {featuredArticle.readTime}
                    </span>
                  </div>

                  {/* Headline Title */}
                  <h3 className="text-xl sm:text-2xl lg:text-[28px] font-black text-slate-900 mb-3.5 tracking-tight leading-snug hover:text-[#0d9488] transition-colors">
                    <Link href={`/blog/${featuredArticle.slug}`}>
                      {featuredArticle.title}
                    </Link>
                  </h3>

                  {/* Summary */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                    {featuredArticle.summary}
                  </p>
                </div>

                {/* Author Info */}
                <div className="pt-6 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    {featuredArticle.author.avatar ? (
                      <img
                        src={featuredArticle.author.avatar}
                        alt={featuredArticle.author.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-2xs"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#0d9488] text-white flex items-center justify-center font-bold text-sm shadow-2xs">
                        {featuredArticle.author.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-bold text-slate-900 leading-tight">
                        {featuredArticle.author.name}
                      </div>
                      <div className="text-xs text-slate-500 font-medium">
                        September 24, 2026
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/blog/${featuredArticle.slug}`}
                    className="inline-flex lg:hidden items-center gap-1.5 px-4 py-2 rounded-full bg-[#0d9488] text-white text-xs font-semibold hover:bg-[#0f766e] transition-colors"
                  >
                    Read Guide <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Visual Mockup with Screen & CTA */}
              <div className="lg:col-span-6 p-4 sm:p-6 lg:p-8 bg-slate-50/50 flex items-center justify-center">
                <div className="relative w-full aspect-[16/10] max-h-[340px] rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm group">
                  {/* Background Desk Imagery */}
                  <img
                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80"
                    alt="Off-Campus Hiring Playbook Setup"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Modern Sleek Monitor Graphic Overlay matching Reference */}
                  <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center p-6">
                    <div className="w-full max-w-sm bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl p-5 border border-slate-700/80 shadow-2xl text-white">
                      {/* Top Header */}
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-700/80">
                        <div className="text-xs font-black tracking-wider uppercase text-teal-400">
                          OFF-CAMPUS HIRING 2026
                        </div>
                        <div className="flex gap-1">
                          <span className="w-2 h-2 rounded-full bg-rose-500" />
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        </div>
                      </div>

                      {/* Checklist */}
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2 text-slate-200 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                          <span>Resume Formatting (1-Page ATS Standard)</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-200 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                          <span>ATS Tips &amp; Keyword Placement</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-200 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                          <span>Interview Framework &amp; System Design</span>
                        </div>
                        <div className="flex items-center gap-2 text-emerald-400 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Get Hired (Direct Portal Routing)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Overlaid CTA Button at Bottom-Right */}
                  <Link
                    href={`/blog/${featuredArticle.slug}`}
                    className="absolute bottom-4 right-4 z-20 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-bold shadow-lg transition-all hover:scale-105 active:scale-95"
                  >
                    <span>Read Full Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================
            LATEST ARTICLES SECTION
            Header + Sort Controls + 3-Column Responsive Grid + Pagination
            ======================================================== */}
        <section id="articles-section" className="scroll-mt-24">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  Latest Articles
                </h2>
                <p className="text-xs text-slate-500">
                  Explore the latest tips, guides and insights from the JobPulse team
                </p>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                Sort by:
              </span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none bg-white border border-slate-200 rounded-xl px-3.5 py-1.5 pr-8 text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 cursor-pointer shadow-2xs"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="readTime">Shortest Read</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* 3-Column Articles Grid */}
          {displayedArticles.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
              <FileText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 mb-1">
                No matching guides found
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Try searching for different keywords or select a different category.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="text-xs font-semibold text-[#0d9488] hover:underline"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {displayedArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/blog/${article.slug}`}
                  className="group flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-lg hover:border-teal-300/80 transition-all duration-300 overflow-hidden"
                >
                  {/* Thumbnail Image Container */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                    <img
                      src={article.thumbnail || "/dsa-roadmap.jpg"}
                      alt={article.title}
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.src.endsWith("/dsa-roadmap.jpg")) {
                          target.src = "/dsa-roadmap.jpg";
                        }
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Card Content Body */}
                  <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
                    <div>
                      {/* Category & Read Time Row */}
                      <div className="flex items-center justify-between text-xs mb-3">
                        <span className="font-bold uppercase tracking-wider text-[#0d9488] bg-[#e6fcf8] px-2.5 py-0.5 rounded-full border border-teal-200/60 text-[11px]">
                          {article.category}
                        </span>
                        <span className="flex items-center gap-1 text-slate-400 font-medium text-[11px]">
                          <Clock className="w-3 h-3" />
                          {article.readTime}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0d9488] transition-colors leading-snug mb-2 line-clamp-2">
                        {article.title}
                      </h3>

                      {/* Summary Excerpt */}
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4 font-normal">
                        {article.summary}
                      </p>

                      {/* Tags */}
                      <div className="flex items-center gap-1.5 flex-wrap mb-4">
                        {article.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[11px] font-medium bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-100"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer: Author & Link */}
                    <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2.5">
                        {article.author.avatar ? (
                          <img
                            src={article.author.avatar}
                            alt={article.author.name}
                            className="w-7 h-7 rounded-full object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px]">
                            {article.author.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="text-xs font-bold text-slate-900 leading-tight">
                            {article.author.name}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {article.date}
                          </div>
                        </div>
                      </div>

                      <span className="text-xs font-bold text-[#0d9488] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Read Guide <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* ========================================================
              INTERACTIVE PAGINATION CONTROLS
              Dynamic based on actual cards count (no fake numbers)
              ======================================================== */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-10 pb-2">
              {/* Previous Page Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs cursor-pointer"
                title="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Dynamic Page Numbers & Ellipses */}
              {getPageNumbers().map((item, idx) => {
                if (typeof item === "string") {
                  return (
                    <span key={`ellipsis-${idx}`} className="text-slate-400 text-xs px-1 select-none">
                      ...
                    </span>
                  );
                }
                const isActive = currentPage === item;
                return (
                  <button
                    key={item}
                    onClick={() => handlePageChange(item)}
                    className={`w-8 h-8 rounded-full text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#0d9488] text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}

              {/* Next Page Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs cursor-pointer"
                title="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </section>

        {/* ========================================================
            NEWSLETTER SUBSCRIPTION BANNER
            Pixel-matched to reference screenshot
            ======================================================== */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10">
            {/* Left: Icon + Heading + Subtitle */}
            <div className="flex items-start sm:items-center gap-4 text-left w-full lg:w-auto">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 text-indigo-600 shadow-2xs">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  Get the best career content, straight to your inbox
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl">
                  Join thousands of job seekers who get weekly career tips, interview prep guides and latest job market insights.
                </p>
              </div>
            </div>

            {/* Right: Email Input + Subscribe Button */}
            <div className="w-full lg:w-auto shrink-0">
              {newsletterStatus === "success" ? (
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>You're subscribed! Check your inbox for updates.</span>
                </div>
              ) : (
                <form
                  onSubmit={handleNewsletterSubmit}
                  className="flex items-center flex-wrap sm:flex-nowrap gap-2.5 w-full sm:w-[420px]"
                >
                  <div className="relative flex-1 w-full">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Enter your email address..."
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs shrink-0 cursor-pointer text-center"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
