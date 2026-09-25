import { getCompanies, getOverviewStats } from "@/lib/api";
import { InteractiveCompanies } from "@/components/companies/InteractiveCompanies";

export const dynamic = 'force-dynamic';

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
