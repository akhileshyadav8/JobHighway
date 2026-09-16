import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 py-12 text-slate-500 dark:text-slate-400 transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1440px]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-3 group">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-2xs border border-slate-200/90 dark:border-slate-800/90 bg-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                <Image
                  src="/logo.png"
                  alt="JobPulse Logo"
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-600 dark:from-teal-400 dark:via-cyan-400 dark:to-teal-300 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
                JobPulse
              </span>
            </Link>
            <p className="text-sm max-w-sm mb-4 leading-relaxed text-slate-600 dark:text-slate-400">
              World&apos;s Fastest Official Job Engine. We index official career portals within 1–2 hours of posting — beating standard aggregators by days with zero recruiter spam.
            </p>
          </div>
          
          <div>
            <h3 className="text-slate-900 dark:text-slate-100 font-semibold mb-4 text-sm">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/" className="hover:text-teal-600 dark:hover:text-white transition-colors">Browse Jobs</Link></li>
              <li><Link href="/companies" className="hover:text-teal-600 dark:hover:text-white transition-colors">Verified Companies</Link></li>
              <li><Link href="/about" className="hover:text-teal-600 dark:hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/blog" className="hover:text-teal-600 dark:hover:text-white transition-colors">Career Blog</Link></li>
              <li><Link href="/contact" className="hover:text-teal-600 dark:hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-slate-900 dark:text-slate-100 font-semibold mb-4 text-sm">Legal & Trust</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/ats-policy" className="hover:text-teal-600 dark:hover:text-white transition-colors">Direct ATS Policy</Link></li>
              <li><Link href="/privacy" className="hover:text-teal-600 dark:hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-teal-600 dark:hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-200/80 dark:border-slate-800/80 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} JobPulse. All rights reserved.</p>
          <p className="mt-2 md:mt-0">100% Direct Official Links</p>
        </div>
      </div>
    </footer>
  );
}
