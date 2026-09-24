"use client";

import { useState } from "react";
import Link from "next/link";
import { KeyRound, CheckCircle2, AlertCircle, ArrowLeft, ArrowRight, ShieldCheck, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { requestPasswordReset } from "@/lib/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setError("Please enter a valid registered email address.");
      return;
    }

    setIsLoading(true);

    try {
      const res = requestPasswordReset(cleanEmail);
      if (res.success) {
        setSubmitted(true);
        setResetToken(res.token || null);
      } else {
        setError(res.message || "Unable to process password reset request.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (!resetToken) return;
    const url = `${window.location.origin}/reset-password?token=${resetToken}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
                Forgot Password
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
                Enter your email address to receive a secure password reset link.
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

                {submitted ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 mx-auto mb-3">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                        Reset Link Generated
                      </h2>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        A secure password reset link has been prepared for <strong className="text-slate-800">{email}</strong>.
                      </p>
                    </div>

                    {resetToken && (
                      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-700">Verification Link</span>
                          <button
                            type="button"
                            onClick={handleCopyLink}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 hover:text-teal-800 cursor-pointer"
                          >
                            {copied ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-600">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy link</span>
                              </>
                            )}
                          </button>
                        </div>
                        <Link href={`/reset-password?token=${resetToken}`} className="block w-full">
                          <Button
                            className="w-full py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <span>Open Reset Password Page</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                      </div>
                    )}

                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 text-[11px] text-slate-500 flex items-start gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
                      <span>Password reset tokens are single-use and valid for 15 minutes.</span>
                    </div>

                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setSubmitted(false);
                          setResetToken(null);
                        }}
                        className="text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
                      >
                        Need to enter a different email?
                      </button>
                    </div>

                    <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
                      <Link
                        href="/login"
                        className="inline-flex items-center gap-1.5 font-semibold text-teal-700 hover:underline"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back to Sign In</span>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm focus:border-slate-400 focus:outline-none transition-colors"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>{isLoading ? "Generating link..." : "Send Reset Link"}</span>
                    </Button>
                  </form>
                )}

                {!submitted && (
                  <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
                    Remember your password?{" "}
                    <Link href="/login" className="font-semibold text-teal-700 hover:underline">
                      Sign In
                    </Link>
                  </div>
                )}
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
