import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug, getAllArticles } from "@/lib/blog_articles";
import { ArrowLeft, Clock, Calendar, Sparkles, CheckCircle2, Lightbulb, Briefcase, ArrowRight, Share2, Tag, BookOpen, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) {
    return { title: "Article Not Found | JobPulse" };
  }
  return {
    title: `${article.title} | JobPulse Blog`,
    description: article.summary,
  };
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const allArticles = getAllArticles();
  const relatedArticles = allArticles.filter(a => a.slug !== article.slug).slice(0, 2);

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Guides</span>
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 ">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Career Resource</span>
          </div>
        </div>

        {/* Article Header */}
        <header className="mb-10 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-sm">
          <div className="flex flex-wrap items-center gap-3 text-xs mb-4">
            <span className="font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 ">
              {article.category}
            </span>
            <span className="flex items-center gap-1 text-slate-500 ">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime}
            </span>
            <span className="text-slate-300 ">•</span>
            <span className="flex items-center gap-1 text-slate-500 ">
              <Calendar className="w-3.5 h-3.5" />
              {article.date}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 mb-3 tracking-tight leading-snug">
            {article.title}
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed mb-6 font-medium">
            {article.summary}
          </p>

          <div className="flex items-center justify-between pt-6 border-t border-slate-100 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-2xs">
                {article.author.name.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 ">
                  {article.author.name}
                </div>
                <div className="text-xs text-slate-500 ">
                  {article.author.role}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* Key Takeaways Box */}
        {article.keyTakeaways && article.keyTakeaways.length > 0 && (
          <div className="mb-10 bg-gradient-to-br from-teal-50/80 via-emerald-50/50 to-teal-50/30 p-6 sm:p-8 rounded-2xl border border-teal-200/80 shadow-xs">
            <div className="flex items-center gap-2 text-teal-800 font-bold text-base mb-4">
              <Sparkles className="w-5 h-5 text-teal-600 " />
              <span>Key Takeaways at a Glance</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {article.keyTakeaways.map((takeaway, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 ">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">{takeaway}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Article Body Sections */}
        <main className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/90 shadow-sm space-y-10 mb-12">
          {article.sections.map((section, idx) => (
            <section key={idx} className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>{section.heading}</span>
              </h2>

              <div className="space-y-3 text-slate-700 text-sm sm:text-base leading-relaxed">
                {section.content.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>

              {/* Code Snippet Box if available */}
              {section.codeSnippet && (
                <div className="my-4 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner">
                  <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-400 font-mono">
                    <span className="uppercase">{section.codeSnippet.language}</span>
                    <span>Standard Interview Syntax</span>
                  </div>
                  <pre className="p-4 text-xs sm:text-sm font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                    <code>{section.codeSnippet.code}</code>
                  </pre>
                </div>
              )}

              {/* Pro Tips Box if available */}
              {section.tips && section.tips.length > 0 && (
                <div className="bg-amber-50/70 border border-amber-200/80 p-4 sm:p-5 rounded-xl space-y-2 my-4">
                  <div className="flex items-center gap-2 text-amber-800 font-semibold text-xs sm:text-sm">
                    <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Pro Candidate Insights</span>
                  </div>
                  <ul className="space-y-1.5 pl-6 list-disc text-xs sm:text-sm text-slate-700 ">
                    {section.tips.map((tip, tIdx) => (
                      <li key={tIdx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          ))}
        </main>

        {/* Curated External Resources & Practice Platforms */}
        {article.resources && article.resources.length > 0 && (
          <section className="mb-14 bg-white rounded-3xl p-8 sm:p-10 border border-teal-200/80 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 ">
                Curated Practice Platforms & External Resources
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">
              Official reference sheets, simulators, and live practice environments to master this playbook.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {article.resources.map((res, i) => (
                <a
                  key={i}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-4 rounded-2xl bg-slate-50 hover:bg-teal-50/50 border border-slate-200 hover:border-teal-300 transition-all hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-100/70 px-2.5 py-0.5 rounded-full border border-teal-200/50 ">
                      {res.category.replace("_", " ")}
                    </span>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 group-hover:text-teal-600 transition-colors mb-1">
                    {res.title}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {res.description}
                  </p>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Contextual Jobs CTA Banner */}
        {article.relatedJobsQuery && (
          <div className="mb-14 p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-teal-800/40">
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-400 bg-teal-900/60 px-3 py-1 rounded-full border border-teal-700/50">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Real-Time Job Openings</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold">
                Ready to apply this playbook?
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm max-w-lg">
                Explore thousands of verified {article.relatedJobsQuery} roles posted directly on official company portals within the last 30 days.
              </p>
            </div>
            <Link href={`/?q=${encodeURIComponent(article.relatedJobsQuery)}`}>
              <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold px-6 shadow-md shrink-0">
                View {article.relatedJobsQuery} Jobs <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 ">
                More Essential Guides
              </h3>
              <Link href="/blog" className="text-xs font-semibold text-teal-600 hover:underline">
                View All Guides →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedArticles.map((rel) => (
                <Link key={rel.id} href={`/blog/${rel.slug}`} className="block group">
                  <Card className="h-full border-slate-200 hover:border-teal-400 transition-all hover:shadow-md ">
                    <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span className="font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
                            {rel.category}
                          </span>
                          <span>{rel.readTime}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 group-hover:text-teal-600 transition-colors text-base leading-snug">
                          {rel.title}
                        </h4>
                        <p className="text-xs text-slate-600 line-clamp-2">
                          {rel.summary}
                        </p>
                      </div>
                      <div className="text-xs font-bold text-teal-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform pt-2 border-t border-slate-100 ">
                        Read Guide <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
