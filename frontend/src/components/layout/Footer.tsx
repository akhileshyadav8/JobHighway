import Link from "next/link";
import Image from "next/image";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-slate-200/90 bg-white text-slate-500 overflow-hidden">
      {/* Subtle decorative glow & pattern on bottom-right (as shown in reference design) */}
      <div className="absolute right-0 bottom-0 w-96 h-96 bg-gradient-to-tl from-teal-50/70 via-emerald-50/20 to-transparent pointer-events-none rounded-full blur-2xl" />
      <div className="absolute -right-10 -bottom-10 w-72 h-72 opacity-25 pointer-events-none">
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-teal-400">
          <circle cx="150" cy="150" r="140" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="150" cy="150" r="100" stroke="currentColor" strokeWidth="1" opacity="0.6" />
          <circle cx="150" cy="150" r="60" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1440px] pt-12 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 mb-10">
          {/* Col 1: Brand & Tagline */}
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
            <p className="text-xs sm:text-sm max-w-sm mb-4 leading-relaxed text-slate-600 font-normal">
              World&apos;s Fastest Official Job Engine. We index official career portals within 1–2 hours of posting — beating standard aggregators by days with zero recruiter spam.
            </p>
          </div>
          
          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-slate-900 font-bold mb-3.5 text-xs sm:text-sm tracking-tight">Quick Links</h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/" className="text-slate-600 hover:text-teal-700 transition-colors inline-block py-0.5">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link href="/companies" className="text-slate-600 hover:text-teal-700 transition-colors inline-block py-0.5">
                  Verified Companies
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-600 hover:text-teal-700 transition-colors inline-block py-0.5">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-slate-600 hover:text-teal-700 transition-colors inline-block py-0.5">
                  Career Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-600 hover:text-teal-700 transition-colors inline-block py-0.5">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Col 3: Legal & Trust */}
          <div>
            <h3 className="text-slate-900 font-bold mb-3.5 text-xs sm:text-sm tracking-tight">Legal & Trust</h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/ats-policy" className="text-slate-600 hover:text-teal-700 transition-colors inline-block py-0.5">
                  Direct ATS Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-slate-600 hover:text-teal-700 transition-colors inline-block py-0.5">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-600 hover:text-teal-700 transition-colors inline-block py-0.5">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Copyright & Guarantee */}
        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2 font-normal">
          <p>© {currentYear} JobPulse. All rights reserved.</p>
          <p className="text-slate-500 font-medium">100% Direct Official Links</p>
        </div>
      </div>
    </footer>
  );
}
