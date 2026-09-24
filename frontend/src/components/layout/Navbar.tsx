'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Briefcase, Building2, BookOpen, Info, Mail, User as UserIcon, Shield, LogOut, ChevronDown, LayoutDashboard, Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCurrentUser, logoutUser, User } from '@/lib/auth';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Sync auth state
  useEffect(() => {
    setUser(getCurrentUser());
    const handleAuthChange = () => {
      setUser(getCurrentUser());
    };
    window.addEventListener("jobpulse_auth_change", handleAuthChange);
    return () => window.removeEventListener("jobpulse_auth_change", handleAuthChange);
  }, []);

  // Close mobile menu whenever route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    router.push("/login");
  };

  const navItems = [
    {
      label: 'Jobs',
      href: '/',
      icon: Briefcase,
      isActive: pathname === '/' || pathname === '/jobs',
    },
    {
      label: 'Companies',
      href: '/companies',
      icon: Building2,
      isActive: pathname.startsWith('/companies'),
    },
    ...(user && user.role !== "admin" ? [{
      label: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      isActive: pathname.startsWith('/dashboard'),
    }] : []),
    {
      label: 'Blog',
      href: '/blog',
      icon: BookOpen,
      isActive: pathname.startsWith('/blog'),
    },
    {
      label: 'About',
      href: '/about',
      icon: Info,
      isActive: pathname.startsWith('/about'),
    },
    {
      label: 'Contact',
      href: '/contact',
      icon: Mail,
      isActive: pathname.startsWith('/contact'),
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-[1440px]">
        {/* Logo and Tagline */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center shrink-0">
              <Image
                src="/logo.png"
                alt="JobPulse Logo"
                width={44}
                height={44}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-teal-700 group-hover:opacity-90 transition-opacity">
              JobPulse
            </span>
          </Link>
          <span className="hidden md:inline-block text-xs font-medium text-slate-500 border-l border-slate-200 pl-3">
            Official ATS Stream • Synced Hourly
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center h-full gap-6 lg:gap-8">
          {navItems.map((item) => {
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`h-full flex items-center text-sm transition-colors relative border-b-2 ${
                  item.isActive
                    ? 'border-teal-600 text-teal-800 font-semibold'
                    : 'border-transparent text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          {/* Quick Search bar in navbar */}
          <div className="hidden lg:flex items-center relative w-52 xl:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search jobs, companies, or skills..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const val = (e.target as HTMLInputElement).value.trim();
                  if (val) router.push(`/jobs?search=${encodeURIComponent(val)}`);
                }
              }}
              className="w-full pl-8 pr-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-teal-500 focus:outline-none transition-all"
            />
          </div>

          {user ? (
            <div className="hidden sm:flex items-center gap-2">
              {user.role === "admin" ? (
                <>
                  <Link href="/mastermindak">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs font-semibold rounded-md border-slate-300 text-slate-800 hover:bg-slate-50 cursor-pointer"
                    >
                      <Shield className="w-3.5 h-3.5 mr-1.5 text-teal-600" />
                      Admin Console
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-xs font-medium text-slate-600 hover:text-slate-900 rounded-md cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  {/* Notification Bell */}
                  <button
                    type="button"
                    className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                    title="1 New Notification"
                  >
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      1
                    </span>
                  </button>

                  {/* Candidate Avatar */}
                  <Link href="/dashboard" className="flex items-center gap-1.5 p-1 rounded-full hover:bg-slate-100 transition-colors group cursor-pointer" title="Dashboard">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-teal-800 border border-emerald-200 font-extrabold text-xs flex items-center justify-center shadow-2xs transition-colors">
                      {user.name ? user.name.split(" ").map(n => n[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() : "AK"}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          ) : (
            <Link href="/login" className="hidden sm:inline-flex items-center">
              <span className="text-xs font-semibold text-slate-700 hover:text-teal-700 px-3 py-1.5 rounded-md border border-slate-300 hover:border-slate-400 bg-white transition-colors cursor-pointer shadow-2xs">
                Sign In
              </span>
            </Link>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-700 hover:bg-slate-100"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 text-sm transition-colors border-l-2 ${
                  item.isActive
                    ? 'border-teal-600 text-teal-800 font-semibold pl-2.5'
                    : 'border-transparent text-slate-700 hover:text-slate-900 font-medium'
                }`}
              >
                <Icon className={`w-4 h-4 ${item.isActive ? 'text-teal-700' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-3 mt-3 border-t border-slate-100 space-y-2">
            {user ? (
              user.role === "admin" ? (
                <>
                  <Link
                    href="/mastermindak"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-semibold border border-slate-300 text-slate-800"
                  >
                    <Shield className="w-4 h-4 text-teal-600" />
                    <span>Admin Console</span>
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium text-rose-600 hover:bg-rose-50 text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-semibold bg-teal-600 text-white"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>{user.name}&apos;s Dashboard</span>
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50 text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              )
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-md text-xs font-semibold text-center border border-slate-300 text-slate-700"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-md text-xs font-semibold text-center bg-teal-600 text-white"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
