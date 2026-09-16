"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, ArrowRight, Sparkles, Shield, User as UserIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { loginUser, getCurrentUser } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email.trim()) {
      setError("Please enter your email address.");
      setIsLoading(false);
      return;
    }

    const res = loginUser(email, password);
    if (res.user) {
      if (res.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } else {
      setError(res.error || "Failed to sign in");
      setIsLoading(false);
    }
  };

  const handleQuickDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    const res = loginUser(demoEmail);
    if (res.user?.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Candidate & Admin Portal
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Sign In to JobPulse
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            Track your applied jobs, bookmark high-paying roles, and manage career preferences.
          </p>
        </div>

        {/* Card */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
          <CardContent className="p-7 sm:p-8 space-y-6">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:border-teal-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <span className="text-[11px] text-slate-400">Optional for demo access</span>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:border-teal-500 focus:outline-none transition-colors"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>{isLoading ? "Signing in..." : "Continue to Dashboard"}</span>
              </Button>
            </form>

            {/* Quick Demo Switchers */}
            <div className="pt-5 border-t border-slate-100 dark:border-slate-800/80">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-3">
                1-Click Quick Demo Access
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleQuickDemo("demo@jobpulse.io")}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-teal-500 hover:bg-teal-50/40 dark:hover:bg-teal-950/20 text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400">
                    <UserIcon className="w-3.5 h-3.5" />
                    <span>Candidate</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Applied Jobs Tracker</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemo("yadavakhil766@gmail.com")}
                  className="p-2.5 rounded-xl border border-teal-200/80 dark:border-teal-900/60 bg-teal-50/20 dark:bg-teal-950/20 hover:border-teal-500 text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-teal-700 dark:text-teal-300">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Founder Admin</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Telemetry & Users</div>
                </button>
              </div>
            </div>

            <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2">
              New to JobPulse?{" "}
              <Link href="/register" className="font-bold text-teal-600 dark:text-teal-400 hover:underline">
                Create Free Account
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
