'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Briefcase, Building2, BookOpen, Info, Mail, User as UserIcon, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { getCurrentUser, User } from '@/lib/auth';

export function Navbar() {
  const pathname = usePathname();
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
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/75 dark:supports-[backdrop-filter]:bg-slate-950/75 transition-colors">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-[1440px]">
        {/* Logo and Tagline */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-2xs border border-slate-200/90 dark:border-slate-800/90 bg-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
              <Image
                src="/logo.png"
                alt="JobPulse Logo"
                width={40}
                height={40}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-600 dark:from-teal-400 dark:via-cyan-400 dark:to-teal-300 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
              JobPulse
            </span>
          </Link>
          <span className="hidden md:inline-block text-xs font-medium text-slate-500 dark:text-slate-400 border-l border-slate-200 dark:border-slate-800 pl-3">
            Official ATS Stream • Synced Every 1–2 Hours
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navItems.map((item) => {
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
                  item.isActive
                    ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/70 dark:text-teal-300 font-semibold shadow-xs border border-teal-200/60 dark:border-teal-800/60'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/50'
                }`}
              >
                {item.isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                )}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <div className="hidden sm:flex items-center gap-2">
              {user.role === "admin" && (
                <Link href="/admin">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs font-bold border-teal-300 dark:border-teal-800 text-teal-700 dark:text-teal-300 rounded-xl hover:bg-teal-50 dark:hover:bg-teal-950/40 cursor-pointer"
                  >
                    <Shield className="w-3.5 h-3.5 mr-1" />
                    Admin
                  </Button>
                </Link>
              )}

              <Link href="/dashboard">
                <Button
                  size="sm"
                  className="text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white rounded-xl shadow-xs cursor-pointer flex items-center gap-2"
                >
                  <div className="w-5 h-5 rounded-full bg-teal-700 text-white flex items-center justify-center text-[11px] font-black">
                    {user.name.charAt(0)}
                  </div>
                  <span className="max-w-[110px] truncate">{user.name.split(" ")[0]}</span>
                </Button>
              </Link>
            </div>
          ) : (
            <Link href="/login" className="hidden sm:inline-block">
              <Button
                variant="outline"
                size="sm"
                className="text-xs font-bold rounded-xl border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400 cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5 mr-1.5" />
                Sign In
              </Button>
            </Link>
          )}

          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 px-4 pt-3 pb-5 space-y-1.5 animate-in slide-in-from-top-2 duration-200 shadow-xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  item.isActive
                    ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 font-semibold border border-teal-500/20'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${item.isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.isActive && (
                  <span className="ml-auto text-xs bg-teal-500/20 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded-full font-bold">
                    Active
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold bg-teal-600 text-white shadow-xs"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>{user.name}&apos;s Dashboard</span>
                </Link>
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold border border-teal-300 dark:border-teal-800 text-teal-700 dark:text-teal-300"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin Operations Console</span>
                  </Link>
                )}
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-center border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-center bg-teal-600 text-white shadow-xs"
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
