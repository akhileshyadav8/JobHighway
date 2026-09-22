"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, Check, AlertCircle, ArrowLeft, RefreshCw, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { registerUser, getCurrentUser } from "@/lib/auth";

type Step = "form" | "otp";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("form");

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // OTP state
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendAttempts, setResendAttempts] = useState(0);
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const cooldownRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    const user = getCurrentUser();
    if (user) router.push("/dashboard");
  }, [router]);

  // Cooldown countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Password validation
  const pwChecks = {
    length: password.length >= 8 && password.length <= 16,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };
  const passwordValid = Object.values(pwChecks).every(Boolean);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setFormError("Please fill in all fields.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormError("Please enter a valid email address.");
      return;
    }
    if (!passwordValid) {
      setFormError("Password does not meet all requirements.");
      return;
    }
    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Registration failed. Please try again.");
        return;
      }
      // Development: show OTP inline
      if (data.devOtp) setDevOtp(data.devOtp);
      setStep("otp");
      setResendCooldown(60);
    } catch {
      setFormError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
      setOtpError("Please enter all 6 digits.");
      return;
    }
    setIsVerifying(true);
    setOtpError("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setOtpError(data.error || "Invalid OTP. Please try again.");
        return;
      }
      // Register user in localStorage
      const regRes = registerUser(data.user.name, data.user.email, data.user.password);
      if (regRes.user) {
        router.push("/dashboard");
      } else {
        setOtpError(regRes.error || "Account setup failed. Please try again.");
      }
    } catch {
      setOtpError("Network error. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || resendAttempts >= 3) return;
    try {
      const res = await fetch("/api/auth/resend-otp", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setOtpError(data.error || "Failed to resend OTP.");
        return;
      }
      if (data.devOtp) setDevOtp(data.devOtp);
      setResendAttempts(a => a + 1);
      setResendCooldown(60);
      setOtp(["", "", "", "", "", ""]);
      setOtpError("");
      setOtpSuccess("New OTP sent to your email.");
      setTimeout(() => setOtpSuccess(""), 4000);
      otpRefs.current[0]?.focus();
    } catch {
      setOtpError("Network error. Please try again.");
    }
  };

  if (step === "otp") {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-teal-50 border border-teal-200 rounded-2xl mb-3">
              <span className="text-2xl">📧</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Check your email
            </h1>
            <p className="text-sm text-slate-500 mt-1.5">
              We sent a 6-digit code to{" "}
              <strong className="text-slate-700">{email}</strong>
            </p>
            {devOtp && (
              <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                <strong>Dev mode — your OTP: {devOtp}</strong>
                <br />Add RESEND_API_KEY to .env to send real emails.
              </div>
            )}
          </div>

          <Card className="border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
            <CardContent className="p-6 sm:p-7 space-y-5">
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
                  Enter the 6-digit code
                </label>
                <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { otpRefs.current[index] = el; }}
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
                <p className="text-[11px] text-center text-slate-400 mt-2">
                  Code expires in 10 minutes
                </p>
              </div>

              <Button
                onClick={handleVerifyOtp}
                disabled={isVerifying || otp.join("").length !== 6}
                className="w-full py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify &amp; Create Account</span>
                  </>
                )}
              </Button>

              <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
                <button
                  onClick={() => setStep("form")}
                  className="flex items-center gap-1 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
                <button
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || resendAttempts >= 3}
                  className="flex items-center gap-1 text-teal-600 hover:text-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  {resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : resendAttempts >= 3
                    ? "Max resends reached"
                    : "Resend code"}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Create Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
            Organize your job applications, track interview stages, and manage your profile.
          </p>
        </div>

        <Card className="border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
          <CardContent className="p-6 sm:p-7 space-y-5">
            {formError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
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
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-colors"
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
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password * (8–16 characters)
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a secure password"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-colors"
                />
                {password.length > 0 && (
                  <div className="mt-2.5 p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-[11px] space-y-1">
                    {[
                      { key: "length", label: "8 to 16 characters" },
                      { key: "upper", label: "At least 1 uppercase letter (A–Z)" },
                      { key: "lower", label: "At least 1 lowercase letter (a–z)" },
                      { key: "number", label: "At least 1 number (0–9)" },
                      { key: "special", label: "At least 1 special character (!@#$%)" },
                    ].map(({ key, label }) => (
                      <div key={key} className={`flex items-center gap-1.5 ${pwChecks[key as keyof typeof pwChecks] ? "text-emerald-600" : "text-slate-400"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${pwChecks[key as keyof typeof pwChecks] ? "bg-emerald-500" : "bg-slate-300"}`} />
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className={`w-full px-3.5 py-2 rounded-lg border bg-white text-slate-900 text-sm outline-none transition-colors ${
                    confirmPassword.length > 0 && password !== confirmPassword
                      ? "border-rose-300 focus:border-rose-400 focus:ring-1 focus:ring-rose-300"
                      : "border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  }`}
                />
                {confirmPassword.length > 0 && password !== confirmPassword && (
                  <p className="text-[11px] text-rose-500 mt-1">Passwords do not match</p>
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
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending code...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Continue — Verify Email</span>
                  </>
                )}
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
