"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { BookOpen, Calendar, Clock, ArrowRight, Sparkles, Search, X, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { BLOG_ARTICLES } from "@/lib/blog_articles";

const CATEGORIES = ["All", "Career Strategy", "Interview Prep", "Tech Guide", "Coding", "Resume & ATS"] as const;

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);

  const filteredArticles = useMemo(() => {
    return BLOG_ARTICLES.filter((article) => {
      // Category filter
      if (selectedCategory !== "All" && article.category !== selectedCategory) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = article.title.toLowerCase().includes(q);
        const matchesSummary = article.summary.toLowerCase().includes(q);
        const matchesTag = article.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesSummary && !matchesTag) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  const displayedArticles = useMemo(() => {
    return filteredArticles.slice(0, visibleCount);
  }, [filteredArticles, visibleCount]);

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header Hero */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 mb-3 tracking-tight leading-snug max-w-3xl mx-auto">
            JobPulse Playbook &amp; Career Blog
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-600 mb-5 max-w-2xl mx-auto leading-relaxed">
            Data-backed playbooks on beating ATS parsers, cracking high-paying tech interviews, and landing verified roles worldwide.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="mb-10 space-y-4">
          {/* Search Input */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search interview questions, ATS tips, SQL, DSA..."
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-full text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/30 shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 "
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shadow-2xs ${
                  selectedCategory === cat
                    ? "bg-teal-600 text-white shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 "
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results counter */}
          <div className="text-center text-xs text-slate-500 ">
            Showing <strong>{filteredArticles.length}</strong> {filteredArticles.length === 1 ? "guide" : "guides"}
            {selectedCategory !== "All" && ` in ${selectedCategory}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </div>
        </div>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              No matching guides found
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Try adjusting your search query or switching categories.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="text-xs font-semibold text-teal-600 underline hover:no-underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {displayedArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/blog/${article.slug}`}
                  className="group block h-full focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-3xl"
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-slate-200 group-hover:border-teal-400/80 group-hover:-translate-y-1 flex flex-col justify-between rounded-3xl">
                    <CardContent className="p-7 sm:p-8 flex flex-col h-full">
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                          <span className="font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 ">
                            {article.category}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {article.readTime}
                          </span>
                        </div>

                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-teal-600 transition-colors mb-3 leading-snug">
                          {article.title}
                        </h2>

                        <p className="text-sm text-slate-600 leading-relaxed mb-6 line-clamp-3 font-normal">
                          {article.summary}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto flex-wrap gap-2">
                        <div className="flex gap-1.5 flex-wrap">
                          {article.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <span className="text-xs font-bold text-teal-600 inline-flex items-center gap-1.5 group-hover:translate-x-1.5 transition-transform">
                          Read Guide <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {visibleCount < filteredArticles.length && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setVisibleCount(prev => prev + 6)}
                  className="px-8 py-3.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 inline-flex items-center gap-2"
                >
                  Load More Guides ({filteredArticles.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

