import { Card, CardContent } from "@/components/ui/card";
import { Job } from "@/lib/api";

export function EligibilityCriteria({ job }: { job: Job }) {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h2 className="text-lg font-bold flex items-center gap-2 mb-4 uppercase">
          📋 ELIGIBILITY CRITERIA
        </h2>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 ">
          {job.education && <li><strong>Education:</strong> {job.education}</li>}
          {job.eligible_batches && <li><strong>Batches:</strong> {job.eligible_batches.join(', ')}</li>}
          {(job.min_cgpa || job.min_percentage) && (
            <li><strong>Score:</strong> Minimum {job.min_cgpa ? `${job.min_cgpa} CGPA` : `${job.min_percentage}%`}</li>
          )}
          {job.backlog_allowed !== null && <li><strong>Backlogs:</strong> {job.backlog_allowed ? 'Allowed' : 'Not Allowed'}</li>}
        </ul>
      </CardContent>
    </Card>
  );
}
