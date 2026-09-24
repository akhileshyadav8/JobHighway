"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Lock } from "lucide-react";
import Link from "next/link";
import { getCurrentUser, User } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (user && user.role === "admin") {
      setIsAdmin(true);
      setIsAuthChecking(false);
    } else {
      setIsAdmin(false);
      setIsAuthChecking(false);
    }

    const handleAuthChange = () => {
      const u = getCurrentUser();
      setIsAdmin(Boolean(u && u.role === "admin"));
    };

    window.addEventListener("jobpulse_auth_change", handleAuthChange);
    return () => window.removeEventListener("jobpulse_auth_change", handleAuthChange);
  }, []);

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-teal-600">
          <Shield className="w-8 h-8 animate-pulse" />
          <span className="text-xs font-semibold tracking-wide uppercase text-slate-500">
            Verifying Operator Credentials...
          </span>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 py-20 px-4 flex items-center justify-center">
        <Card className="max-w-md w-full text-center p-8 border border-slate-200 bg-white rounded-2xl shadow-md">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Restricted Admin Console
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
            Authentication is required. Only authorized administrators with verified credentials can access this operations portal.
          </p>

          <div className="space-y-3">
            <Link href="/mastermindak/login" className="block w-full">
              <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-sm cursor-pointer">
                Authenticate as Admin
              </Button>
            </Link>
            <Link href="/" className="block w-full">
              <Button variant="outline" className="w-full border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl cursor-pointer text-xs">
                Back to Public Job Board
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}
