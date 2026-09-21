import { Card, CardContent } from "@/components/ui/card";

export function InterviewExperience({ experience }: { experience: string | null }) {
  if (!experience) return null;
  return (
    <Card className="mb-6" id="interview-experience">
      <CardContent className="p-6">
        <h2 className="text-lg font-bold flex items-center gap-2 mb-4 uppercase">
          🎯 INTERVIEW EXPERIENCE
        </h2>
        <div className="text-slate-700 leading-relaxed whitespace-pre-line">
          {experience}
        </div>
      </CardContent>
    </Card>
  );
}
