"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { KeyRound, Mail, CheckCircle2, AlertCircle, ArrowLeft, ArrowRight, ShieldCheck, Copy, Check } from "lucide-react";
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
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-16 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <Image src="/logo.png" alt="JobPulse" width={36} height={36} className="object-contain" priority />
            <span className="text-xl font-black tracking-tight text-teal-700">JobPulse</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Reset your password
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
            Enter the email address associated with your JobPulse account.
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
              <div className="text-center py-2 space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal-50 border border-teal-200 text-teal-700">
                  <CheckCircle2 className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">
                    Reset Link Generated
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                    A secure password reset link has been prepared for <strong className="text-slate-900">{email}</strong>.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-left text-[11px] text-slate-600 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                    <span>Security Verification Notice:</span>
                  </div>
                  <p className="text-slate-500">
                    Password reset tokens are cryptographically randomized, single-use, and valid for 15 minutes.
                  </p>
                </div>

                {resetToken && (
                  <div className="p-3.5 bg-teal-50/70 border border-teal-200 rounded-lg text-left space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-teal-900">Verification Link:</span>
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 hover:text-teal-900 cursor-pointer"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3 h-3 text-teal-700" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy link</span>
                          </>
                        )}
                      </button>
                    </div>
                    <Link
                      href={`/reset-password?token=${resetToken}`}
                      className="block w-full"
                    >
                      <Button
                        size="sm"
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Open Reset Password Page</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setResetToken(null);
                    }}
                    className="text-xs font-medium text-slate-500 hover:text-slate-800"
                  >
                    Need to enter a different email?
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm focus:border-teal-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{isLoading ? "Generating Link..." : "Send Reset Link"}</span>
                </Button>
              </form>
            )}

            <div className="pt-3 border-t border-slate-100 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-teal-700 font-medium"
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
