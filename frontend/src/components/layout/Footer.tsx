import Link from "next/link";
import Image from "next/image";
import { Building2, Briefcase, Globe, Clock, ShieldCheck, ArrowUpRight } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white text-slate-500 relative z-20">
      {/* Top Trust Metrics & Guarantee Bar (as highlighted in modern platform design) */}
      <div className="border-b border-slate-100 bg-slate-50/70 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1440px]">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Left Brand Summary */}
            <div className="flex items-center gap-3 text-left">
              <div className="relative w-8 h-8 shrink-0">
                <Image
                  src="/logo.png"
                  alt="JobPulse Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-xs text-slate-600 max-w-md leading-relaxed">
                JobPulse indexes official company career portals regularly so you can discover and apply to jobs early, directly at the source.
              </p>
            </div>

            {/* Middle Live Trust Metrics */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold text-slate-800">17,584+</span>
                  <span className="text-slate-500 ml-1">Verified Companies</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Briefcase className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold text-slate-800">1.2M+</span>
                  <span className="text-slate-500 ml-1">Active Openings</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Globe className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold text-slate-800">150+</span>
                  <span className="text-slate-500 ml-1">Countries</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold text-slate-800">Updated Hourly</span>
                  <span className="text-slate-400 text-[10px] ml-1">Fresh. Accurate.</span>
                </div>
              </div>
            </div>

            {/* Right Sketch / Note */}
            <div className="hidden xl:flex items-center gap-2 text-teal-700 text-xs font-medium italic">
              <svg className="w-6 h-5 text-teal-500 -rotate-12" viewBox="0 0 32 24" fill="none">
                <path d="M4 18C12 6 22 4 28 8M28 8L22 4M28 8L26 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Same jobs, fresher opportunities.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Navigation Links */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1440px] py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 mb-10">
          {/* Col 1: Brand & Direct ATS Guarantee */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-3 group">
              <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
                <Image
                  src="/logo.png"
                  alt="JobPulse Logo"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-teal-700 group-hover:opacity-90 transition-opacity">
                JobPulse
              </span>
            </Link>
            <p className="text-sm max-w-sm mb-4 leading-relaxed text-slate-600">
              The direct-from-source hiring engine. Zero third-party recruiter spam, zero stale job aggregator listings.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-100/80 text-teal-800 text-xs font-medium">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Direct ingestion from Greenhouse, Lever, Ashby & Workday</span>
            </div>
          </div>
          
          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-slate-900 font-bold mb-4 text-sm tracking-tight">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-slate-600 hover:text-teal-700 transition-colors inline-flex items-center gap-1">
                  <span>Browse Jobs</span>
                </Link>
              </li>
              <li>
                <Link href="/companies" className="text-slate-600 hover:text-teal-700 transition-colors inline-flex items-center gap-1">
                  <span>Verified Companies</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-600 hover:text-teal-700 transition-colors inline-flex items-center gap-1">
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-slate-600 hover:text-teal-700 transition-colors inline-flex items-center gap-1">
                  <span>Career Blog</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-600 hover:text-teal-700 transition-colors inline-flex items-center gap-1">
                  <span>Contact Us</span>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Col 3: Legal & Trust */}
          <div>
            <h3 className="text-slate-900 font-bold mb-4 text-sm tracking-tight">Legal & Trust</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/ats-policy" className="text-slate-600 hover:text-teal-700 transition-colors inline-flex items-center gap-1">
                  <span>Direct ATS Policy</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-slate-600 hover:text-teal-700 transition-colors inline-flex items-center gap-1">
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-600 hover:text-teal-700 transition-colors inline-flex items-center gap-1">
                  <span>Terms of Service</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Copyright & Guarantee */}
        <div className="border-t border-slate-200 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {currentYear} JobPulse. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-600 font-medium">100% Direct Official Links</span>
            <span>•</span>
            <span>Zero Aggregator Middlemen</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
