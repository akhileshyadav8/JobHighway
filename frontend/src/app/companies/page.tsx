import { getCompanies, getOverviewStats } from "@/lib/api";
import { InteractiveCompanies } from "@/components/companies/InteractiveCompanies";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Top Hiring Companies & Direct ATS Portals",
  description: "Explore 19,000+ top technology companies actively hiring. Access official career portals and direct ATS requisitions with verified hiring data.",
  alternates: {
    canonical: "/companies",
  },
};

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; search?: string }>;
}) {
  const resolved = searchParams ? await searchParams : {};
  const initialSearch = (resolved?.q || resolved?.search || "").trim();

  const [data, stats] = await Promise.all([
    getCompanies(),
    getOverviewStats().catch(() => null),
  ]);

  return (
    <InteractiveCompanies 
      initialCompanies={data.items} 
      initialStats={stats} 
      initialSearch={initialSearch}
    />
  );
}
