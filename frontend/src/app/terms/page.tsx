import { Metadata } from "next";
import Link from "next/link";
import { Scale, ArrowLeft, CheckCircle2, ShieldAlert, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Terms of Service | JobPulse",
  description: "Read JobPulse's Terms of Service and user agreement.",
};

export default function TermsPage() {
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
          <Scale className="w-8 h-8" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Agreements & Rules
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Terms of Service
          </h1>
        </div>
      </div>

      <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
        Last updated: September 2026
      </p>

      <div className="space-y-8">
        <section className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-teal-500" />
            1. Acceptance of Terms
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            By accessing or using JobPulse, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may discontinue use of the service.
          </p>
        </section>

        <section className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Globe className="w-5 h-5 text-teal-500" />
            2. Platform Purpose & Aggregation
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-3">
            JobPulse is an automated real-time discovery engine. We aggregate and link to verified openings published directly on public career portals by hiring organizations.
          </p>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            JobPulse is not an employer, recruitment agency, or hiring entity. All employment agreements and interview communications occur solely between the candidate and the hiring company.
          </p>
        </section>

        <section className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-teal-500" />
            3. Disclaimer of Warranties
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            While our ingestion pipeline continuously syncs every 10–15 minutes to guarantee real, up-to-date data, job availability is controlled by the respective employers and may change without notice. JobPulse provides its discovery engine &ldquo;as is&rdquo; without warranties of any kind.
          </p>
        </section>
      </div>
    </div>
  );
}
