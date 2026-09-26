"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminExpiredJobsRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Expired jobs are auto-purged from the database and catalog permanently
    router.replace("/mastermindak/jobs");
  }, [router]);

  return (
    <div className="p-8 text-center text-slate-500 text-sm">
      Expired jobs have been purged from the catalog. Redirecting to All Jobs...
    </div>
  );
}
