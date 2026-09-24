"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyRound, CheckCircle2, AlertCircle, ArrowLeft, Globe, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { verifyPasswordResetToken, resetPasswordWithToken } from "@/lib/auth";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenError, setTokenError] = useState("");
  const [accountEmail, setAccountEmail] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validate token on initial render
  useEffect(() => {
    if (!token) {
      setVerifying(false);
      setTokenValid(false);
      setTokenError("Missing password reset token. Please request a new reset link.");
      return;
    }

    const verification = verifyPasswordResetToken(token);
    setVerifying(false);
    if (verification.valid) {
      setTokenValid(true);
      setAccountEmail(verification.email || "");
    } else {
      setTokenValid(false);
      setTokenError(verification.error || "This reset token is invalid or has expired.");
    }
  }, [token]);

  // Live password validation checklist
  const pwChecks = {
    length: newPassword.length >= 8 && newPassword.length <= 16,
    upper: /[A-Z]/.test(newPassword),
    lower: /[a-z]/.test(newPassword),
    number: /\d/.test(newPassword),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword),
  };
  const isAllValid = Object.values(pwChecks).every(Boolean);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isAllValid) {
      setError("Password does not meet all required security criteria.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    const res = resetPasswordWithToken(token, newPassword);
    setIsLoading(false);

    if (res.success) {
      setSuccess(true);
    } else {
      setError(res.error || "Failed to reset password. The link may have expired.");
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-gradient-to-b from-[#f0fdfa]/40 via-white to-[#f8fafc] py-10 sm:py-14 md:py-16 px-4 sm:px-6 lg:px-8 flex items-center overflow-hidden">
      {/* Subtle background mesh matching Blog & Contact heroes */}
      <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_70%_60%_at_60%_50%,#000_70%,transparent_100%)]" />

      <div className="container mx-auto max-w-[1360px] relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
          
          {/* ========================================================
              LEFT SIDE: Reset Password Content & Card (40–45% area)
              ======================================================== */}
          <div className="w-full max-w-[500px] mx-auto lg:mx-0 lg:col-span-5">
            {/* Brand Logo & Header */}
            <div className="text-left mb-6">
              <Link href="/" className="inline-flex items-center gap-2.5 mb-3.5 group">
                <img src="/logo.png" alt="JobPulse" className="w-10 h-10 object-contain" />
                <span className="text-2xl font-black tracking-tight text-teal-700">JobPulse</span>
              </Link>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Create New Password
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-normal">
                {accountEmail
                  ? `Setting new password for ${accountEmail}`
                  : "Enter a secure new password for your JobPulse account."}
              </p>
            </div>

            {/* Main Form Card (490-520px proportional width) */}
            <Card className="border border-slate-200/90 shadow-sm bg-white rounded-2xl overflow-hidden">
              <CardContent className="p-7 sm:p-8 space-y-5">
                {verifying ? (
                  <div className="text-center py-8 space-y-3">
                    <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs text-slate-500 font-medium">Verifying reset authorization link...</p>
                  </div>
                ) : !tokenValid ? (
                  <div className="space-y-4 text-center">
                    <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-rose-50 border border-rose-100 text-rose-600 mx-auto">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                        Invalid or Expired Link
                      </h2>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {tokenError || "This password reset token is invalid or has expired."}
                      </p>
                    </div>
                    <div className="pt-2">
                      <Link href="/forgot-password" className="block w-full">
                        <Button className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-xs transition-colors cursor-pointer">
                          Request New Reset Link
                        </Button>
                      </Link>
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
                ) : success ? (
                  <div className="space-y-4 text-center">
                    <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 mx-auto">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                        Password Updated Successfully
                      </h2>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Your password has been changed. You can now sign in with your new credentials.
                      </p>
                    </div>
                    <div className="pt-2">
                      <Button
                        onClick={() => router.push("/login")}
                        className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-xs transition-colors cursor-pointer"
                      >
                        Proceed to Sign In
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                        <span>{error}</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        New Password (8–16 Characters)
                      </label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Create secure password"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition-colors shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition-colors shadow-2xs"
                      />
                    </div>

                    {/* Password Criteria Checklist */}
                    {newPassword.length > 0 && (
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] space-y-1">
                        <div className={`flex items-center gap-1.5 ${pwChecks.length ? "text-emerald-600 font-medium" : "text-slate-400"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${pwChecks.length ? "bg-emerald-500" : "bg-slate-300"}`} />
                          <span>8 to 16 characters</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${pwChecks.upper ? "text-emerald-600 font-medium" : "text-slate-400"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${pwChecks.upper ? "bg-emerald-500" : "bg-slate-300"}`} />
                          <span>At least 1 uppercase letter (A–Z)</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${pwChecks.lower ? "text-emerald-600 font-medium" : "text-slate-400"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${pwChecks.lower ? "bg-emerald-500" : "bg-slate-300"}`} />
                          <span>At least 1 lowercase letter (a–z)</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${pwChecks.number ? "text-emerald-600 font-medium" : "text-slate-400"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${pwChecks.number ? "bg-emerald-500" : "bg-slate-300"}`} />
                          <span>At least 1 number (0–9)</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${pwChecks.special ? "text-emerald-600 font-medium" : "text-slate-400"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${pwChecks.special ? "bg-emerald-500" : "bg-slate-300"}`} />
                          <span>At least 1 special character (!@#$%^&*)</span>
                        </div>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isLoading || !isAllValid}
                      className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>{isLoading ? "Updating password..." : "Update Password"}</span>
                    </Button>
                  </form>
                )}

                <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 font-bold text-teal-700 hover:underline"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Sign In</span>
                  </Link>
                </div>
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

              {/* Floating Decorative Badge 1 */}
              <div className="absolute top-[65px] right-[40px] bg-white rounded-2xl border border-slate-200/90 shadow-md p-3.5 px-4 flex items-center gap-3 z-20 hover:scale-105 transition-transform cursor-default">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#0d9488] flex items-center justify-center shrink-0 border border-teal-100">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    Secure Account Access
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    SHA-256 salted credentials
                  </div>
                </div>
              </div>

              {/* Floating Decorative Badge 2 */}
              <div className="absolute bottom-[65px] left-[35px] bg-white rounded-2xl border border-slate-200/90 shadow-md p-3.5 px-4 flex items-center gap-3 z-20 hover:scale-105 transition-transform cursor-default">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    Worldwide Coverage
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    Jobs across 150+ countries
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
