"use client";

import { useState } from "react";
import Link from "next/link";
import { KeyRound, CheckCircle2, AlertCircle, ArrowLeft, ArrowRight, ShieldCheck, Copy, Check, Globe } from "lucide-react";
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
    <div className="relative min-h-[calc(100vh-4rem)] bg-gradient-to-b from-[#f0fdfa]/40 via-white to-[#f8fafc] py-10 sm:py-14 md:py-16 px-4 sm:px-6 lg:px-8 flex items-center overflow-hidden">
      {/* Subtle background mesh matching Blog & Contact heroes */}
      <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_70%_60%_at_60%_50%,#000_70%,transparent_100%)]" />

      <div className="container mx-auto max-w-[1360px] relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
          
          {/* ========================================================
              LEFT SIDE: Forgot Password Content & Card (40–45% area)
              ======================================================== */}
          <div className="w-full max-w-[500px] mx-auto lg:mx-0 lg:col-span-5">
            {/* Brand Logo & Header */}
            <div className="text-left mb-6">
              <Link href="/" className="inline-flex items-center gap-2.5 mb-3.5 group">
                <img src="/logo.png" alt="JobPulse" className="w-10 h-10 object-contain" />
                <span className="text-2xl font-black tracking-tight text-teal-700">JobPulse</span>
              </Link>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Forgot Password
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-normal">
                Enter your email address to receive a secure password reset link.
              </p>
            </div>

            {/* Main Form Card (490-520px proportional width) */}
            <Card className="border border-slate-200/90 shadow-sm bg-white rounded-2xl overflow-hidden">
              <CardContent className="p-7 sm:p-8 space-y-5">
                {error && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
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
                      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
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
                            className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <span>Open Reset Password Page</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                      </div>
                    )}

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-500 flex items-start gap-2">
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
                        className="inline-flex items-center gap-1.5 font-bold text-teal-700 hover:underline"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back to Sign In</span>
                      </Link>
                    </div>
                  </div>
                ) : (
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

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>{isLoading ? "Generating link..." : "Send Reset Link"}</span>
                    </Button>
                  </form>
                )}

                {!submitted && (
                  <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
                    Remember your password?{" "}
                    <Link href="/login" className="font-bold text-teal-700 hover:underline">
                      Sign In
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ========================================================
              RIGHT SIDE: Large Clearly Visible World Map + Floating Badges
              ======================================================== */}
          <div className="lg:col-span-7 relative hidden lg:flex items-center justify-center min-h-[460px] xl:min-h-[520px]">
            <div className="relative w-full max-w-[760px] h-[480px] xl:h-[520px] flex items-center justify-center">
              
              {/* World Map Vector Graphic with soft ambient cyan/teal radial glow */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                <div className="absolute w-[560px] h-[360px] bg-gradient-to-tr from-teal-200/50 via-teal-100/30 to-transparent rounded-full blur-3xl pointer-events-none" />
                
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/world.svg"
                  alt="Global Career Network World Map"
                  className="w-full h-full object-contain pointer-events-none select-none relative z-0"
                />
              </div>

              {/* Floating Decorative Badge 1: Instant Security Token */}
              <div className="absolute top-[65px] right-[40px] bg-white rounded-2xl border border-slate-200/90 shadow-md p-3.5 px-4 flex items-center gap-3 z-20 hover:scale-105 transition-transform cursor-default">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#0d9488] flex items-center justify-center shrink-0 border border-teal-100">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    Encrypted Token Recovery
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    15-minute single-use security
                  </div>
                </div>
              </div>

              {/* Floating Decorative Badge 2: Global Career Network */}
              <div className="absolute bottom-[65px] left-[35px] bg-white rounded-2xl border border-slate-200/90 shadow-md p-3.5 px-4 flex items-center gap-3 z-20 hover:scale-105 transition-transform cursor-default">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    Official ATS Network
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    100% direct official portals
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
