import { Metadata } from "next";
import Link from "next/link";
import { Lock, ArrowLeft, Eye, Shield, Server, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Privacy Policy | JobPulse",
  description: "Learn how JobPulse handles data and safeguards job seeker privacy.",
};

export default function PrivacyPage() {
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
          <Lock className="w-8 h-8" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Legal & Compliance
          </span>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
            Privacy Policy
          </h1>
        </div>
      </div>

      <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
        Last updated: September 2026
      </p>

      <div className="space-y-8">
        <section className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Eye className="w-5 h-5 text-teal-500" />
            1. Information We Collect
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-3">
            JobPulse is built with privacy by default. We do not require you to create an account, register your email, or upload sensitive documents just to browse verified job openings.
          </p>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300 list-disc list-inside">
            <li><strong>Local Preferences:</strong> We use your browser&apos;s local storage to preserve your theme preference (Light/Dark mode) and recent search filter preferences.</li>
            <li><strong>Anonymous Analytics:</strong> Basic, aggregated telemetry on popular search queries to improve indexing quality, without identifying individual users.</li>
          </ul>
        </section>

        <section className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Server className="w-5 h-5 text-teal-500" />
            2. Third-Party Employer ATS Portals
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            When you select &ldquo;Apply Official&rdquo;, you are routed directly to third-party applicant tracking systems (such as Workday, Greenhouse, Lever, etc.). Any resumes, contact info, or interview responses submitted there are governed exclusively by that specific employer&apos;s privacy notice. JobPulse does not store or process your job application submissions.
          </p>
        </section>

        <section className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-teal-500" />
            3. Data Security
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            We enforce modern SSL/TLS encryption across all JobPulse endpoints. Our data aggregation pipelines read only publicly indexed, authorized corporate career portals to ensure you get authentic information without tracking cookies.
          </p>
        </section>

        <section className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-500" />
            4. Contact Us
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            If you have questions or concerns regarding our privacy practices, you can contact the JobPulse engineering team via our official GitHub repository or community channels.
          </p>
        </section>
      </div>
    </div>
  );
}
