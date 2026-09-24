"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyRound, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
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
                Create New Password
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
                {accountEmail
                  ? `Setting new password for ${accountEmail}`
                  : "Enter a secure new password for your JobPulse account."}
              </p>
            </div>

            {/* Card */}
            <Card className="border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
              <CardContent className="p-6 sm:p-7 space-y-5">
                {verifying ? (
                  <div className="text-center py-8 space-y-3">
                    <div className="w-7 h-7 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
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
                        <Button className="w-full py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-colors cursor-pointer">
                          Request New Reset Link
                        </Button>
                      </Link>
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
                        className="w-full py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-colors cursor-pointer"
                      >
                        Proceed to Sign In
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        New Password (8–16 Characters)
                      </label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Create secure password"
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm focus:border-slate-400 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm focus:border-slate-400 focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Password Criteria Checklist */}
                    {newPassword.length > 0 && (
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-[11px] space-y-1">
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
                      className="w-full py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>{isLoading ? "Updating password..." : "Update Password"}</span>
                    </Button>
                  </form>
                )}

                <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 font-semibold text-teal-700 hover:underline"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Sign In</span>
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex items-center justify-center">
          <div className="w-7 h-7 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
