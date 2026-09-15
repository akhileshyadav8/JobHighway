import { notFound } from "next/navigation";
import { getJobBySlug } from "@/lib/api";
import { JobHero } from "@/components/jobs/JobHero";
import { RatingBadge } from "@/components/jobs/RatingBadge";
import { SalaryInsights } from "@/components/jobs/SalaryInsights";
import { CTABanner } from "@/components/jobs/CTABanner";
import { SkillBadge } from "@/components/jobs/SkillBadge";
import { InterviewExperience } from "@/components/jobs/InterviewExperience";
import { WorkCulture } from "@/components/jobs/WorkCulture";
import { StudyMaterials } from "@/components/jobs/StudyMaterials";
import { EligibilityCriteria } from "@/components/jobs/EligibilityCriteria";
import { SelectionProcess } from "@/components/jobs/SelectionProcess";
import { ShareButtons } from "@/components/jobs/ShareButtons";
import { RelatedJobs } from "@/components/jobs/RelatedJobs";
import { QuickInfo } from "@/components/jobs/QuickInfo";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Users } from "lucide-react";
import Link from "next/link";
import { sanitizeJobSkills } from "@/lib/utils";

export const revalidate = 60;

export default async function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let job;
  try {
    job = await getJobBySlug(slug);
  } catch (error) {
    notFound();
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Section 1: Hero */}
        <JobHero job={job} />

        {/* Section 2: Rating */}
        <RatingBadge rating={job.jobpulse_rating} reason={job.rating_reason} />

        {/* Section 3: Salary Insights */}
        <SalaryInsights job={job} />

        {/* Section 4: Explore More (Nav Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 p-3 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <a href="#work-culture" className="font-bold text-lg hover:text-purple-600 block">📋 Work Culture</a>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Employee Reviews</p>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-3 rounded-xl">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <a href="#interview-experience" className="font-bold text-lg hover:text-blue-600 block">🎯 Interview Exp</a>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Real Experiences</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section 5: CTA Banner */}
        <CTABanner job={job} />

        {/* Section 6: Skills Required */}
        {(() => {
          const displaySkills = sanitizeJobSkills(job.skills_required, job.title, job.description_text);
          return displaySkills && displaySkills.length > 0 ? (
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-lg font-bold flex items-center gap-2 mb-4 uppercase">
                  🛠 SKILLS REQUIRED
                </h2>
                <div className="flex flex-wrap gap-2">
                  {displaySkills.map((skill, i) => (
                    <SkillBadge key={i} name={skill} index={i} />
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : null;
        })()}

        {/* Section 7: Interview Experience */}
        <InterviewExperience experience={job.interview_experience} />

        {/* Section 8: Work Culture */}
        <WorkCulture culture={job.work_culture_summary} />

        {/* Section 9: CTA Banner Repeat */}
        <CTABanner job={job} />

        {/* Section 10: Study Materials */}
        <StudyMaterials materials={job.study_materials} />

        {/* Section 11: Eligibility Criteria */}
        <EligibilityCriteria job={job} />

        {/* Section 12: Selection Process */}
        <SelectionProcess process={job.selection_process} />

        {/* Section 13: Share This Job */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4 uppercase">
              📤 SHARE THIS JOB
            </h2>
            <ShareButtons jobTitle={job.title} jobUrl={`/jobs/${job.slug}`} />
          </CardContent>
        </Card>

        {/* Section 14: Related Jobs */}
        <RelatedJobs currentJob={job} />

        {/* Section 15: Quick Info */}
        <QuickInfo job={job} />

        {/* Section 16: Disclaimer */}
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-xl p-6 text-sm text-amber-800 dark:text-amber-200/80 leading-relaxed mb-8">
          <strong>⚠️ Disclaimer:</strong> This listing is indexed from public sources and may include AI-generated details such as salary, interview, work culture, eligibility, and study materials. These details may be inaccurate or outdated. Company names and trademarks belong to their respective owners, and JobPulse is not affiliated with or endorsed by the hiring company or linked third-party sites. Always verify all details on the official company website before applying. We never charge any fee for job applications.
        </div>
      </div>
    </div>
  );
}
