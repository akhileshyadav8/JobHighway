import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-12 text-slate-500">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1440px]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-3 group">
              <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                <Image
                  src="/logo.png"
                  alt="JobPulse Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-2xl font-black tracking-tight text-teal-700 group-hover:opacity-90 transition-opacity">
                JobPulse
              </span>
            </Link>
            <p className="text-sm max-w-sm mb-4 leading-relaxed text-slate-600">
              JobPulse indexes official ATS career portals regularly so you can discover and apply to jobs early, directly at the source.
            </p>
          </div>
          
          <div>
            <h3 className="text-slate-900 font-semibold mb-4 text-sm">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/" className="hover:text-teal-700 transition-colors">Browse Jobs</Link></li>
              <li><Link href="/companies" className="hover:text-teal-700 transition-colors">Verified Companies</Link></li>
              <li><Link href="/about" className="hover:text-teal-700 transition-colors">About Us</Link></li>
              <li><Link href="/blog" className="hover:text-teal-700 transition-colors">Career Blog</Link></li>
              <li><Link href="/contact" className="hover:text-teal-700 transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-slate-900 font-semibold mb-4 text-sm">Legal & Trust</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/ats-policy" className="hover:text-teal-700 transition-colors">Direct ATS Policy</Link></li>
              <li><Link href="/privacy" className="hover:text-teal-700 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-teal-700 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-200 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} JobPulse. All rights reserved.</p>
          <p className="mt-2 md:mt-0">100% Direct Official Links</p>
        </div>
      </div>
    </footer>
  );
}
