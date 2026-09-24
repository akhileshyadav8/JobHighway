"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MastermindRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin");
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-xs font-semibold text-slate-400">
        Redirecting to Master Admin Console...
      </div>
    </div>
  );
}
