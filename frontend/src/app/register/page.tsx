"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, Sparkles, Check, AlertCircle } from "lucide-react";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!name.trim() || !email.trim()) {
      setError("Please fill in both name and email.");
      setIsLoading(false);
      return;
    }

    const res = registerUser(name, email, password);
    if (res.user) {
      router.push("/dashboard");
    } else {
      setError(res.error || "Registration failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-600 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            100% Free Forever
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Create Candidate Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Organize job applications, track interview stages, and unlock personalized alerts.
          </p>
        </div>

        <Card className="border-slate-200 shadow-xl bg-white rounded-3xl overflow-hidden">
          <CardContent className="p-7 sm:p-8 space-y-6">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:border-teal-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="priya@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:border-teal-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password * (8–16 Characters)
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create secure password"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:border-teal-500 focus:outline-none transition-colors"
                />

                {/* Password Criteria Checklist */}
                {password.length > 0 && (
                  <div className="mt-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] space-y-1">
                    <div className={`flex items-center gap-1.5 ${password.length >= 8 && password.length <= 16 ? "text-emerald-600 " : "text-slate-400"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${password.length >= 8 && password.length <= 16 ? "bg-emerald-500" : "bg-slate-300 "}`} />
                      <span>8 to 16 characters</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${/[A-Z]/.test(password) ? "text-emerald-600 " : "text-slate-400"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(password) ? "bg-emerald-500" : "bg-slate-300 "}`} />
                      <span>At least 1 uppercase letter (A–Z)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${/[a-z]/.test(password) ? "text-emerald-600 " : "text-slate-400"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(password) ? "bg-emerald-500" : "bg-slate-300 "}`} />
                      <span>At least 1 lowercase letter (a–z)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${/\d/.test(password) ? "text-emerald-600 " : "text-slate-400"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${/\d/.test(password) ? "bg-emerald-500" : "bg-slate-300 "}`} />
                      <span>At least 1 number (0–9)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? "text-emerald-600 " : "text-slate-400"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? "bg-emerald-500" : "bg-slate-300 "}`} />
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
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <UserPlus className="w-4 h-4" />
                <span>{isLoading ? "Creating Account..." : "Create Account & Go to Dashboard"}</span>
              </Button>
            </form>

            <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100 ">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-teal-600 hover:underline">
                Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
