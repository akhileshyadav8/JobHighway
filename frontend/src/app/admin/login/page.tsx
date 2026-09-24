"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { loginAdmin, getCurrentUser } from "@/lib/auth";

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
    <div className="relative min-h-[calc(100vh-4rem)] bg-slate-50 py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 flex items-center overflow-hidden">
      {/* Subtle world map silhouette on the right side from existing JobPulse assets */}
      <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-1/2 max-w-2xl h-[560px] pointer-events-none opacity-[0.07]">
        <img
          src="/world.svg"
          alt=""
          className="w-full h-full object-contain object-right"
          aria-hidden="true"
        />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Form / Card */}
          <div className="w-full max-w-md mx-auto lg:mx-0 lg:col-span-6 xl:col-span-5">
            {/* Header */}
            <div className="text-center lg:text-left mb-6">
              <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
                <img src="/logo.png" alt="JobPulse" className="w-10 h-10 object-contain" />
                <span className="text-2xl font-black tracking-tight text-teal-700">JobPulse</span>
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Admin Sign In
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
                Founder &amp; platform administrator authentication portal.
              </p>
            </div>

            {/* Card */}
            <Card className="border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
              <CardContent className="p-6 sm:p-7 space-y-5">
                {error && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Administrator Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@jobpulse.io"
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm focus:border-slate-400 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Master Password
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter administrator password"
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm focus:border-slate-400 focus:outline-none transition-colors"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <Shield className="w-4 h-4" />
                    <span>{isLoading ? "Verifying..." : "Authenticate as Admin"}</span>
                  </Button>
                </form>

                <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
                  Looking for regular candidate login?{" "}
                  <Link href="/login" className="font-semibold text-teal-700 hover:underline">
                    Candidate Sign In
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Clean whitespace */}
          <div className="hidden lg:block lg:col-span-6 xl:col-span-7" />
        </div>
      </div>
    </div>
  );
}
