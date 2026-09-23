import { getCompanies, getOverviewStats } from "@/lib/api";
import { InteractiveCompanies } from "@/components/companies/InteractiveCompanies";

export const revalidate = 60;

export default async function CompaniesPage() {
  const [data, stats] = await Promise.all([
    getCompanies(),
    getOverviewStats().catch(() => null),
  ]);

  return <InteractiveCompanies initialCompanies={data.items} initialStats={stats} />;
}
