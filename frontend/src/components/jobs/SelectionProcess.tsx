import { Card, CardContent } from "@/components/ui/card";

export function SelectionProcess({ process }: { process: any }) {
  if (!process || !process.rounds) return null;
  
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h2 className="text-lg font-bold flex items-center gap-2 mb-4 uppercase">
          🏆 SELECTION PROCESS
        </h2>
        <div className="space-y-4">
          {process.rounds.map((r: any, i: number) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                  {i + 1}
                </div>
                {i < process.rounds.length - 1 && <div className="w-0.5 h-full bg-slate-200 mt-2"></div>}
              </div>
              <div className="pb-6">
                <h3 className="font-bold mb-1">{r.name}</h3>
                <p className="text-slate-600 text-sm">{r.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
