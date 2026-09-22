"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Lock, ArrowRight, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { loginAdmin, getCurrentUser, ADMIN_EMAIL } from "@/lib/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (user && user.role === "admin") {
      router.push("/admin");
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const res = loginAdmin(email, password);
    if (res.user && res.user.role === "admin") {
      router.push("/admin");
    } else {
      setError(res.error || "Access Denied: Only authorized administrators may enter.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 flex items-center justify-center relative overflow-hidden">
      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <img src="/logo.png" alt="JobPulse" className="w-10 h-10 object-contain" />
            <span className="text-2xl font-black tracking-tight text-teal-700">JobPulse</span>
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            JobPulse Admin Login
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Founder &amp; Master Administrator authentication portal.
          </p>
        </div>

        {/* Card */}
        <Card className="border border-slate-200 shadow-md bg-white rounded-2xl overflow-hidden">
          <CardContent className="p-7 sm:p-8 space-y-6">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Administrator Username / Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@jobpulse.io"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:border-teal-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Master Password *
                  </label>
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:border-teal-500 focus:outline-none transition-colors"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Lock className="w-4 h-4" />
                <span>{isLoading ? "Verifying Credentials..." : "Authenticate as Admin"}</span>
              </Button>
            </form>

            <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
              Looking for regular candidate login?{" "}
              <Link href="/login" className="font-bold text-teal-600 hover:underline">
                Candidate Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
