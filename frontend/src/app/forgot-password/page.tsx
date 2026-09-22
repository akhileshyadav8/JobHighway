"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  KeyRound,
  Mail,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Loader2,
  Lock,
  Eye,
  EyeOff,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { resetUserPassword, validatePassword } from "@/lib/auth";

type Step = "email" | "otp" | "password" | "success";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");

  // Step 1: Email State
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // Step 2: OTP State
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendAttempts, setResendAttempts] = useState(0);
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [emailWarning, setEmailWarning] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Step 3: New Password State
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  // Countdown timer for Resend OTP
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Live password validation checklist
  const pwChecks = {
    length: newPassword.length >= 8 && newPassword.length <= 16,
    upper: /[A-Z]/.test(newPassword),
    lower: /[a-z]/.test(newPassword),
    number: /\d/.test(newPassword),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword),
  };
  const isPasswordValid = Object.values(pwChecks).every(Boolean);

  // --- Step 1: Send OTP ---
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setEmailError("Please enter a valid registered email address.");
      return;
    }

    setIsSendingOtp(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });
      const data = await res.json();

      if (!res.ok) {
        setEmailError(data.error || "Failed to send reset code. Please try again.");
        return;
      }

      if (data.devOtp) {
        setDevOtp(data.devOtp);
      }
      if (data.emailWarning) {
        setEmailWarning(data.emailWarning);
      }
      setStep("otp");
      setResendCooldown(60);
      setOtp(["", "", "", "", "", ""]);
      setOtpError("");
    } catch {
      setEmailError("Network error. Please check your connection and try again.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  // --- Step 2: Handle OTP Input ---
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setOtpError("");

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) otpRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      otpRefs.current[5]?.focus();
    }
    e.preventDefault();
  };

  const handleVerifyOtp = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      setOtpError("Please enter all 6 digits of the code.");
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError("");
    try {
      const res = await fetch("/api/auth/forgot-password/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: code }),
      });
      const data = await res.json();

      if (!res.ok) {
        setOtpError(data.error || "Invalid or expired verification code.");
        return;
      }

      setResetToken(data.resetToken || null);
      setStep("password");
    } catch {
      setOtpError("Network error while verifying code. Please try again.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || resendAttempts >= 3) return;
    try {
      const res = await fetch("/api/auth/forgot-password/resend-otp", {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        setOtpError(data.error || "Failed to resend code.");
        return;
      }

      if (data.devOtp) setDevOtp(data.devOtp);
      if (data.emailWarning) setEmailWarning(data.emailWarning);
      setResendAttempts((a) => a + 1);
      setResendCooldown(60);
      setOtp(["", "", "", "", "", ""]);
      setOtpError("");
      setOtpSuccess(data.emailWarning ? "New verification code generated." : "New verification code dispatched to your email.");
      setTimeout(() => setOtpSuccess(""), 4000);
      otpRefs.current[0]?.focus();
    } catch {
      setOtpError("Network error. Please try again.");
    }
  };

  // --- Step 3: Set New Password ---
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (!isPasswordValid) {
      setPasswordError("Password does not meet all required security criteria.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setIsResettingPassword(true);
    try {
      const res = await fetch("/api/auth/forgot-password/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newPassword,
          resetToken: resetToken || undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setPasswordError(data.error || "Failed to update password. Please try again.");
        return;
      }

      // Synchronize client-side registered users storage
      const targetEmail = data.email || email.trim().toLowerCase();
      resetUserPassword(targetEmail, newPassword);

      setStep("success");
    } catch {
      setPasswordError("Network error while resetting password. Please try again.");
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-16 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <img src="/logo.png" alt="JobPulse" className="w-10 h-10 object-contain" />
            <span className="text-2xl font-black tracking-tight text-teal-700 group-hover:opacity-90 transition-opacity">
              JobPulse
            </span>
          </Link>

          {step === "email" && (
            <>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Reset your password
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
                Enter your email address to receive a secure 6-digit OTP code.
              </p>
            </>
          )}

          {step === "otp" && (
            <>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Enter Verification Code
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
                We sent a 6-digit verification code to{" "}
                <strong className="text-slate-800">{email}</strong>
              </p>
              {emailWarning ? (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 text-left">
                  <div className="font-bold flex items-center gap-1.5 mb-1 text-amber-800">
                    <span>⚠️ Resend Sandbox Notice:</span>
                  </div>
                  <p className="text-[12px] leading-relaxed mb-2 text-amber-800">{emailWarning}</p>
                  {devOtp && (
                    <div className="bg-amber-100/90 p-2 rounded border border-amber-300">
                      <span className="text-[11px] text-amber-900 block font-medium">Use this verification code:</span>
                      <span className="font-mono text-lg font-black text-teal-800 tracking-widest">{devOtp}</span>
                    </div>
                  )}
                </div>
              ) : devOtp ? (
                <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 text-left">
                  <div className="font-bold flex items-center gap-1.5 mb-0.5">
                    <span>⚡ Development Mode:</span>
                  </div>
                  <span>Your OTP is <strong className="font-mono text-sm tracking-wider text-amber-950">{devOtp}</strong></span>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    (In production with RESEND_API_KEY set, this code is sent to your email)
                  </p>
                </div>
              ) : null}
            </>
          )}

          {step === "password" && (
            <>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Create New Password
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
                Setting new secure password for{" "}
                <strong className="text-slate-800">{email}</strong>
              </p>
            </>
          )}
        </div>

        {/* Form Card */}
        <Card className="border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
          <CardContent className="p-6 sm:p-7 space-y-5">
            {/* STEP 1: Enter Email */}
            {step === "email" && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                {emailError && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{emailError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-600 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                    <span>Protected Account Recovery</span>
                  </div>
                  <p className="text-slate-500">
                    We will send a one-time 6-digit verification code directly to your email address. Codes expire after 10 minutes.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isSendingOtp || !email.trim()}
                  className="w-full py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSendingOtp ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Code...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>Send Verification Code</span>
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* STEP 2: Enter OTP */}
            {step === "otp" && (
              <div className="space-y-5">
                {otpError && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{otpError}</span>
                  </div>
                )}
                {otpSuccess && (
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{otpSuccess}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-3 text-center">
                    Enter 6-Digit Verification Code
                  </label>
                  <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          otpRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-11 h-14 text-center text-xl font-bold border border-slate-200 rounded-lg bg-white text-slate-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-colors"
                      />
                    ))}
                  </div>
                  <p className="text-[11px] text-center text-slate-400 mt-2 font-medium">
                    {resendCooldown > 0 ? (
                      <span>Code expires in <strong className="text-teal-700 font-semibold">{resendCooldown}s</strong></span>
                    ) : (
                      <span className="text-rose-600 font-semibold">Code expired (1 min limit). Click &quot;Resend Code&quot; below.</span>
                    )}
                  </p>
                </div>

                <Button
                  onClick={handleVerifyOtp}
                  disabled={isVerifyingOtp || otp.join("").length !== 6}
                  className="w-full py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isVerifyingOtp ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying Code...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify Code &amp; Continue</span>
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("email");
                      setOtp(["", "", "", "", "", ""]);
                      setOtpError("");
                    }}
                    className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Change email</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendCooldown > 0 || resendAttempts >= 3}
                    className="flex items-center gap-1 text-teal-600 hover:text-teal-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>
                      {resendCooldown > 0
                        ? `Resend in ${resendCooldown}s`
                        : resendAttempts >= 3
                        ? "Max resends reached"
                        : "Resend code"}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Set New Password */}
            {step === "password" && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                {passwordError && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{passwordError}</span>
                  </div>
                )}

                {/* New Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    New Password (8–16 Characters)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Create secure password"
                      className="w-full pl-10 pr-10 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <ShieldCheck className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className={`w-full pl-10 pr-10 py-2 rounded-lg border bg-white text-slate-900 text-sm outline-none transition-colors ${
                        confirmPassword.length > 0 && newPassword !== confirmPassword
                          ? "border-rose-300 focus:border-rose-400 focus:ring-1 focus:ring-rose-300"
                          : "border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPassword.length > 0 && newPassword !== confirmPassword && (
                    <p className="text-[11px] text-rose-500 mt-1">Passwords do not match</p>
                  )}
                </div>

                {/* Password Criteria Checklist */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-[11px] space-y-1">
                  {[
                    { key: "length", label: "8 to 16 characters" },
                    { key: "upper", label: "At least 1 uppercase letter (A–Z)" },
                    { key: "lower", label: "At least 1 lowercase letter (a–z)" },
                    { key: "number", label: "At least 1 number (0–9)" },
                    { key: "special", label: "At least 1 special character (!@#$%^&*)" },
                  ].map(({ key, label }) => (
                    <div
                      key={key}
                      className={`flex items-center gap-1.5 ${
                        pwChecks[key as keyof typeof pwChecks] ? "text-emerald-600 font-medium" : "text-slate-400"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          pwChecks[key as keyof typeof pwChecks] ? "bg-emerald-500" : "bg-slate-300"
                        }`}
                      />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>

                <Button
                  type="submit"
                  disabled={isResettingPassword || !isPasswordValid || newPassword !== confirmPassword}
                  className="w-full py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isResettingPassword ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>Set New Password</span>
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* STEP 4: Success Message */}
            {step === "success" && (
              <div className="text-center py-4 space-y-4">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-slate-900">
                    Password Reset Complete!
                  </h3>
                  <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                    Your password has been securely updated. You can now sign in to your JobPulse account with your new credentials.
                  </p>
                </div>

                <div className="pt-2">
                  <Button
                    onClick={() => router.push("/login")}
                    className="w-full py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Bottom Link to Login */}
            {step !== "success" && (
              <div className="pt-3 border-t border-slate-100 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-teal-700 font-medium transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
