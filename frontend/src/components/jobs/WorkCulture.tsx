import { Card, CardContent } from "@/components/ui/card";

export function WorkCulture({ culture }: { culture: string | null }) {
  if (!culture) return null;
  return (
    <Card className="mb-6" id="work-culture">
      <CardContent className="p-6">
        <h2 className="text-lg font-bold flex items-center gap-2 mb-4 uppercase">
          🏢 WORK CULTURE
        </h2>
        <div className="text-slate-700 leading-relaxed whitespace-pre-line">
          {culture}
        </div>
      </CardContent>
    </Card>
  );
}
