"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyRound, Mail, Lock, CheckCircle2, AlertCircle, ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { resetUserPassword, validatePassword } from "@/lib/auth";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Live password validation checklist
  const hasMinLen = newPassword.length >= 8 && newPassword.length <= 16;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword);
  const isAllValid = hasMinLen && hasUpper && hasLower && hasNumber && hasSpecial;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your registered email address.");
      return;
    }

    if (!isAllValid) {
      setError("Password does not meet the security criteria.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    const res = resetUserPassword(email, newPassword);
    if (res.success) {
      setSuccess(true);
      setIsLoading(false);
    } else {
      setError(res.error || "Failed to reset password. Please check your email address.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 flex items-center justify-center transition-colors">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-600 mb-4 shadow-sm">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Reset Your Password
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Enter your registered email and choose a strong new password.
          </p>
        </div>

        {/* Card */}
        <Card className="border-slate-200 shadow-xl bg-white rounded-3xl overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            {success ? (
              <div className="text-center py-6 space-y-4">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 ">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 ">
                  Password Reset Successfully!
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Your password has been updated securely. You can now sign in using your new credentials.
                </p>
                <div className="pt-4">
                  <Button
                    onClick={() => router.push("/login")}
                    className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs py-3 rounded-xl cursor-pointer"
                  >
                    Proceed to Sign In
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Email input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Registered Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. rahul.s@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-teal-500 transition-colors"
                    />
                  </div>
                </div>

                {/* New Password input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    New Password (8–16 Characters)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Create strong password..."
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-teal-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Confirm New Password input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <ShieldCheck className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password..."
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-teal-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Password Criteria Checklist */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] space-y-1.5">
                  <div className="font-semibold text-slate-700 mb-1">
                    Password Requirements:
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasMinLen ? "text-emerald-600 " : "text-slate-400"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${hasMinLen ? "bg-emerald-500" : "bg-slate-300 "}`} />
                    <span>8 to 16 characters in length</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasUpper ? "text-emerald-600 " : "text-slate-400"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${hasUpper ? "bg-emerald-500" : "bg-slate-300 "}`} />
                    <span>At least 1 uppercase letter (A–Z)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasLower ? "text-emerald-600 " : "text-slate-400"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${hasLower ? "bg-emerald-500" : "bg-slate-300 "}`} />
                    <span>At least 1 lowercase letter (a–z)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasNumber ? "text-emerald-600 " : "text-slate-400"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${hasNumber ? "bg-emerald-500" : "bg-slate-300 "}`} />
                    <span>At least 1 number (0–9)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasSpecial ? "text-emerald-600 " : "text-slate-400"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${hasSpecial ? "bg-emerald-500" : "bg-slate-300 "}`} />
                    <span>At least 1 special character (!@#$%^&*)</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !isAllValid}
                  className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs py-3 rounded-xl shadow-md shadow-teal-600/20 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? "Updating Password..." : "Reset & Save Password"}
                </Button>
              </form>
            )}

            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-teal-600 font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
