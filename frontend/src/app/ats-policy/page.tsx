import { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, CheckCircle2, ArrowLeft, Building2, Zap, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Direct ATS Policy | JobPulse",
  description: "Learn about JobPulse's strict Direct ATS and Zero-Scam Verification guarantee.",
};

export default function AtsPolicyPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
            <ArrowLeft className="w-4 h-4" /> Back to Jobs
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-xl">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Trust & Transparency
          </span>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
            Direct ATS & Zero-Scam Policy
          </h1>
        </div>
      </div>

      <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
        At JobPulse, our mission is to eliminate ghost postings, commission-hungry recruitment middlemen, and fraudulent listings. Every single opportunity featured on JobPulse is directly routed to the hiring company's verified Applicant Tracking System (ATS).
      </p>

      <div className="space-y-8">
        <section className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-teal-500" />
            1. 100% Direct Official Application Links
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
            When you click &ldquo;Apply Official&rdquo; on any JobPulse listing, you are routed directly to the employer's genuine ATS portal. We support and integrate with enterprise career engines including:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {["Workday", "Greenhouse", "Lever", "SmartRecruiters", "Ashby", "Taleo", "iCIMS", "Official Domains"].map((ats) => (
              <div key={ats} className="py-2.5 px-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60">
                {ats}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-teal-500" />
            2. Continuous Automated Health & Link Verification
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-3">
            Our automated crawlers sync job portals every 10–15 minutes. If a role is closed, unlisted, or expired by the corporate talent team, our verification pipeline automatically de-indexes or marks it inactive to prevent wasted applications.
          </p>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300 list-disc list-inside">
            <li>Zero dead-ends or 404 broken application links.</li>
            <li>No fake generated roles or synthetic AI-hallucinated job postings.</li>
            <li>Direct extraction of authentic JD requirements, locations, and hiring criteria.</li>
          </ul>
        </section>

        <section className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-teal-500" />
            3. Zero Middlemen & Anti-Spam Guarantee
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-3">
            JobPulse does not sell your contact details to recruiters, third-party marketing firms, or shady &ldquo;placement training&rdquo; agencies. We do not place ad paywalls in front of application links, nor do we require upfront fees.
          </p>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            Your resume and candidate information go directly into the employer's HR pipeline without any intermediate interception.
          </p>
        </section>

        <div className="bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 rounded-2xl p-6 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
          <div className="text-sm text-slate-700 dark:text-slate-300">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Notice a suspicious or dead link?</h3>
            <p>
              If you ever find an expired opening or incorrect redirect, our monitoring team reviews automated reports daily. Contact our team or inspect the job slug directly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
