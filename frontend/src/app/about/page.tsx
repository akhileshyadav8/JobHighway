import Link from "next/link";
import { Zap, ShieldCheck, Clock, Building2, Target, CheckCircle2, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-600 text-xs font-bold uppercase tracking-wider mb-4">
            About JobPulse
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 mb-3 tracking-tight leading-snug max-w-3xl mx-auto">
            World&apos;s Real-Time Official Job Discovery Engine
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-600 mb-5 max-w-2xl mx-auto leading-relaxed">
            We built JobPulse because traditional job boards post openings days or weeks after companies publish them — by which time hundreds of applications have already flooded in and the position is closed.
          </p>
        </div>

        {/* Problem vs Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card className="border-rose-200 bg-rose-50/40 shadow-sm">
            <CardContent className="p-8">
              <div className="text-rose-600 font-bold text-lg mb-3 flex items-center gap-2">
                <span>❌ The Old Way (Standard Job Boards)</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-700 ">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 mt-0.5">•</span>
                  <span>Jobs listed 1–3 weeks late through third-party crawlers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 mt-0.5">•</span>
                  <span>Applications redirect through dubious third-party referral hubs or expired forms.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 mt-0.5">•</span>
                  <span>Fake openings, recruitment agency spam, and paid scam listings.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 mt-0.5">•</span>
                  <span>No clear interview preparation, batch eligibility, or study resources.</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-teal-200 bg-teal-50/40 shadow-sm">
            <CardContent className="p-8">
              <div className="text-teal-700 font-bold text-lg mb-3 flex items-center gap-2">
                <span>⚡ The JobPulse Way (Official ATS First)</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-700 ">
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-0.5">•</span>
                  <span>Monitors companies&apos; <strong>official ATS portals</strong> (Greenhouse, Lever, Ashby, Workday) every 5–15 mins.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-0.5">•</span>
                  <span>100% direct official career links — you apply straight on the employer&apos;s portal.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-0.5">•</span>
                  <span>Strict freshness window: only active postings from the last 1 month.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-0.5">•</span>
                  <span>Free curated interview roadmaps, selection rounds, and study sheets right on each listing.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* How It Works Section */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-900 mb-10">
            How The Discovery Pipeline Works
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xl mb-4">
                1
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">ATS Ingestion</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connectors hook into official APIs and public JSON feeds from Greenhouse, Lever, Ashby, and Workday.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold text-xl mb-4">
                2
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">Change Detection</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every 5–15 minutes, SHA256 hashes detect newly published roles and salary changes in real-time.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xl mb-4">
                3
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">AI Extraction</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Extracts required skills, experience levels, batch eligibility (2024–2026), and compensation bands.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl mb-4">
                4
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">Instant Publish</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Postings are published immediately with verified official apply links and free study materials.
              </p>
            </div>
          </div>
        </div>

        {/* Free Guarantee Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 text-center shadow-xl mb-12">
          <ShieldCheck className="w-14 h-14 text-teal-400 mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold mb-3">100% Free For All Candidates</h2>
          <p className="text-slate-300 max-w-xl mx-auto mb-8 text-sm md:text-base leading-relaxed">
            JobPulse never charges candidates for job applications, referrals, or study materials. We strictly redirect candidates directly to the official hiring company&apos;s verified career portal.
          </p>
          <Link href="/">
            <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold px-8">
              Explore Live Openings <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
