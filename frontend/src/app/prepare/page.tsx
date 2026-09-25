import React, { Suspense } from "react";
import { Metadata } from "next";
import { CareerPrepHub } from "@/components/prepare/CareerPrepHub";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Career Preparation Hub & Role Roadmaps",
  description: "Dynamic role-based interview roadmaps, curated study sheets, practice questions, and company guides for Software Engineers, Data Scientists, Data Analysts, Data Engineers, Product Managers, and tech professionals.",
  alternates: {
    canonical: "/prepare",
  },
};

export default async function PreparePage({
  searchParams,
}: {
  searchParams?: Promise<{ role?: string }>;
}) {
  const resolved = searchParams ? await searchParams : {};
  const initialRole = resolved?.role;

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="w-8 h-8 rounded-full border-2 border-teal-600 border-t-transparent animate-spin" />
      </div>
    }>
      <CareerPrepHub initialRoleId={initialRole} />
    </Suspense>
  );
}
