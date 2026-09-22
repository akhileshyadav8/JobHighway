"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UserPlus, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { registerUser, getCurrentUser } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
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

  // Password Criteria Checks
  const pwChecks = {
    length: password.length >= 8 && password.length <= 16,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };
  const isPasswordValid = Object.values(pwChecks).every(Boolean);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim()) {
      setError("Please fill in both name and email.");
      return;
    }

    if (!isPasswordValid) {
      setError("Password does not meet all required security criteria.");
      return;
    }

    setIsLoading(true);

    try {
      const res = registerUser(name, email, password);
      if (res.user) {
        router.push("/dashboard");
      } else {
        setError(res.error || "Registration failed. Please try again.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <Image src="/logo.png" alt="JobPulse" width={36} height={36} className="object-contain" priority />
            <span className="text-xl font-black tracking-tight text-teal-700">JobPulse</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Create Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
            Organize your job applications, track interview stages, and manage your profile.
          </p>
        </div>

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
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Akhilesh Yadav"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm focus:border-teal-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm focus:border-teal-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password * (8–16 Characters)
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create secure password"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm focus:border-teal-500 focus:outline-none transition-colors"
                />

                {/* Password Criteria Checklist */}
                {password.length > 0 && (
                  <div className="mt-2.5 p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-[11px] space-y-1">
                    <div className={`flex items-center gap-1.5 ${pwChecks.length ? "text-emerald-600" : "text-slate-400"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${pwChecks.length ? "bg-emerald-500" : "bg-slate-300"}`} />
                      <span>8 to 16 characters</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${pwChecks.upper ? "text-emerald-600" : "text-slate-400"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${pwChecks.upper ? "bg-emerald-500" : "bg-slate-300"}`} />
                      <span>At least 1 uppercase letter (A–Z)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${pwChecks.lower ? "text-emerald-600" : "text-slate-400"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${pwChecks.lower ? "bg-emerald-500" : "bg-slate-300"}`} />
                      <span>At least 1 lowercase letter (a–z)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${pwChecks.number ? "text-emerald-600" : "text-slate-400"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${pwChecks.number ? "bg-emerald-500" : "bg-slate-300"}`} />
                      <span>At least 1 number (0–9)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${pwChecks.special ? "text-emerald-600" : "text-slate-400"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${pwChecks.special ? "bg-emerald-500" : "bg-slate-300"}`} />
                      <span>At least 1 special character (!@#$%^&*)</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1.5 text-xs text-slate-500 pt-1">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Track unlimited job applications across 5,000+ companies</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Zero spam, private storage, never sold to recruiters</span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <UserPlus className="w-4 h-4" />
                <span>{isLoading ? "Creating Account..." : "Create Account"}</span>
              </Button>
            </form>

            <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-teal-700 hover:underline">
                Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
