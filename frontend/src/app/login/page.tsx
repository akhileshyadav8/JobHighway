"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, AlertCircle, Globe, ShieldCheck } from "lucide-react";
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
      if (user.role === "admin") {
        router.push("/mastermindak");
      } else {
        router.push("/dashboard");
      }
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email.trim()) {
      setError("Please enter your registered email address.");
      setIsLoading(false);
      return;
    }

    const res = loginUser(email, password);
    if (res.user) {
      if (res.user.role === "admin") {
        router.push("/mastermindak");
      } else {
        router.push("/dashboard");
      }
    } else {
      setError(res.error || "Failed to sign in. Please verify your credentials.");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-gradient-to-b from-[#f0fdfa]/40 via-white to-[#f8fafc] py-10 sm:py-14 md:py-16 px-4 sm:px-6 lg:px-8 flex items-center overflow-hidden">
      {/* Subtle background mesh matching Blog & Contact heroes */}
      <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_70%_60%_at_60%_50%,#000_70%,transparent_100%)]" />

      <div className="container mx-auto max-w-[1360px] relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
          
          {/* ========================================================
              LEFT SIDE: Sign In Content & Card (40–45% of content area)
              ======================================================== */}
          <div className="w-full max-w-[500px] mx-auto lg:mx-0 lg:col-span-5">
            {/* Brand Logo & Header */}
            <div className="text-left mb-6">
              <Link href="/" className="inline-flex items-center gap-2.5 mb-3.5 group">
                <img src="/logo.png" alt="JobHighway" className="w-10 h-10 object-contain" />
                <span className="text-2xl font-black tracking-tight text-teal-700">JobHighway</span>
              </Link>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Sign In
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-normal">
                Enter your email and password to access your account.
              </p>
            </div>

            {/* Main Sign In Card (490-520px proportional width) */}
            <Card className="border border-slate-200/90 shadow-sm bg-white rounded-2xl overflow-hidden">
              <CardContent className="p-7 sm:p-8 space-y-5">
                {error && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition-colors shadow-2xs"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-700">
                        Password
                      </label>
                      <Link
                        href="/forgot-password"
                        className="text-xs text-teal-700 hover:text-teal-800 hover:underline font-semibold"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition-colors shadow-2xs"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{isLoading ? "Signing in..." : "Sign In"}</span>
                  </Button>
                </form>

                <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
                  New to JobHighway?{" "}
                  <Link href="/register" className="font-bold text-teal-700 hover:underline">
                    Create Free Account
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ========================================================
              RIGHT SIDE: Large Clearly Visible World Map + Floating Badges
              Occupies large portion of right half, matching Blog & Contact
              ======================================================== */}
          <div className="lg:col-span-7 relative hidden lg:flex items-center justify-center min-h-[460px] xl:min-h-[520px]">
            <div className="relative w-full max-w-[760px] h-[480px] xl:h-[520px] flex items-center justify-center">
              
              {/* World Map Vector Graphic with soft ambient cyan/teal radial glow */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                {/* Soft radial glow behind the world map */}
                <div className="absolute w-[560px] h-[360px] bg-gradient-to-tr from-teal-200/50 via-teal-100/30 to-transparent rounded-full blur-3xl pointer-events-none" />
                
                {/* Authentic 256-country blank vector world map from /world.svg (crisp white borders, light teal fill) */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/world.svg"
                  alt="Global Career Network World Map"
                  className="w-full h-full object-contain pointer-events-none select-none relative z-0"
                />
              </div>

              {/* Floating Decorative Badge 1: Official ATS Network */}
              <div className="absolute top-[65px] right-[40px] bg-white rounded-2xl border border-slate-200/90 shadow-md p-3.5 px-4 flex items-center gap-3 z-20 hover:scale-105 transition-transform cursor-default">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#0d9488] flex items-center justify-center shrink-0 border border-teal-100">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    Official ATS Network
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    1,000+ career systems synced
                  </div>
                </div>
              </div>

              {/* Floating Decorative Badge 2: Direct Career Links */}
              <div className="absolute bottom-[65px] left-[35px] bg-white rounded-2xl border border-slate-200/90 shadow-md p-3.5 px-4 flex items-center gap-3 z-20 hover:scale-105 transition-transform cursor-default">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    Direct Career Links
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    100% free official applications
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
