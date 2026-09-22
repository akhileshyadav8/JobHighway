import { notFound } from "next/navigation";
import { getJobBySlug } from "@/lib/api";
import { JobHero } from "@/components/jobs/JobHero";
import { CTABanner } from "@/components/jobs/CTABanner";
import { SkillBadge } from "@/components/jobs/SkillBadge";
import { ShareButtons } from "@/components/jobs/ShareButtons";
import { RelatedJobs } from "@/components/jobs/RelatedJobs";
import { QuickInfo } from "@/components/jobs/QuickInfo";
import { Card, CardContent } from "@/components/ui/card";
import { sanitizeJobSkills, formatSalary, cleanHtmlDescription, inferAtsSource, formatDate } from "@/lib/utils";
import { CountryFlag } from "@/components/ui/CountryFlag";
import {
  Building2,
  MapPin,
  Briefcase,
  GraduationCap,
  Laptop,
  Clock,
  Coins,
  ExternalLink,
  ShieldCheck,
  FileText,
  CalendarDays,
  RefreshCw,
  Info
} from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let job;
  try {
    job = await getJobBySlug(slug);
  } catch (error) {
    notFound();
  }

  const safeLocation = Array.isArray(job.location) ? job.location : [];
  const displaySkills = sanitizeJobSkills(job.skills_required, job.title, job.description_text);
  const hasBatch = job.eligible_batches && Array.isArray(job.eligible_batches) && job.eligible_batches.length > 0;
  const batchesText = hasBatch
    ? job.eligible_batches!.join(', ')
    : null;
  const cleanedDescription = cleanHtmlDescription(job.description_html, job.description_text);
  const atsSource = inferAtsSource(job.apply_url || job.job_url);

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Section 1: Hero */}
        <JobHero job={job} />

        {/* Section 2: Key Job Highlights Grid */}
        <Card className="mb-6 border-slate-200 shadow-sm overflow-hidden">
          <CardContent className="p-6">
            <h2 className="text-base font-bold flex items-center gap-2 mb-4 uppercase tracking-wide text-slate-900">
              <ShieldCheck className="w-5 h-5 text-teal-600" />
              <span>Job Highlights &amp; Eligibility</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-teal-100 text-teal-700 shrink-0 mt-0.5">
                  <Laptop className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500">Work Mode</div>
                  <div className="text-sm font-bold text-slate-900">{job.work_mode || 'Not specified'}</div>
                </div>
              </div>

              {/* Batch — only when data exists */}
              {hasBatch && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700 shrink-0 mt-0.5">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500">Eligible Batch</div>
                    <div className="text-sm font-bold text-slate-900">{batchesText}</div>
                  </div>
                </div>
              )}

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500">Expected Compensation</div>
                  <div className="text-sm font-bold text-slate-900">
                    {formatSalary(job.salary_min, job.salary_max, job.salary_currency, job.salary_period, true)}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-100 text-amber-700 shrink-0 mt-0.5">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500">Employment Type</div>
                  <div className="text-sm font-bold text-slate-900">{job.employment_type || 'Not specified'}</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-sky-100 text-sky-700 shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500">Experience</div>
                  <div className="text-sm font-bold text-slate-900">
                    {job.experience_min === 0
                      ? (job.employment_type?.toLowerCase().includes('intern') || job.title.toLowerCase().includes('intern')
                          ? '0 Years (Internship / Fresher Friendly)'
                          : '0 - 1 Years (Fresher Friendly)')
                      : job.experience_min !== null
                      ? `${job.experience_min} - ${job.experience_max || job.experience_min + 3} Years`
                      : 'Not specified'}
                  </div>
                </div>
              </div>

              {safeLocation.length > 0 && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-rose-100 text-rose-700 shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500">Location</div>
                    <div className="text-sm font-bold text-slate-900 line-clamp-1 flex items-center gap-1.5">
                      <CountryFlag locations={safeLocation} size="sm" />
                      <span>{safeLocation.join(', ')}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Skills Required */}
        {displaySkills && displaySkills.length > 0 && (
          <Card className="mb-6 border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-base font-bold flex items-center gap-2 mb-4 uppercase tracking-wide text-slate-900">
                <span>🛠 Skills &amp; Tech Stack</span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {displaySkills.map((skill, i) => (
                  <SkillBadge key={i} name={skill} index={i} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Section 4: Full Job Description */}
        <Card className="mb-6 border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-transparent p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2 uppercase tracking-wide text-slate-900">
              <FileText className="w-5 h-5 text-teal-600" />
              <span>Official Job Description &amp; Role Overview</span>
            </h2>
            <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
              Verified Official Posting
            </span>
          </div>
          <CardContent className="p-6 md:p-8">
            {cleanedDescription ? (
              <div
                className="prose max-w-none text-slate-800 leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: cleanedDescription }}
              />
            ) : (
              <p className="text-slate-500 italic">
                Please visit the official company hiring page using the button below for the full role description and submission instructions.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Section 5: Company Overview */}
        <Card className="mb-6 border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-base font-bold flex items-center gap-2 mb-4 uppercase tracking-wide text-slate-900">
              <Building2 className="w-5 h-5 text-teal-600" />
              <span>About {job.company.name}</span>
            </h2>
            <div className="space-y-3 text-sm text-slate-600">
              {job.company.industry && (
                <div>
                  <strong className="text-slate-800">Industry:</strong> {job.company.industry}
                </div>
              )}
              {job.company.headquarters && (
                <div>
                  <strong className="text-slate-800">Headquarters:</strong> {job.company.headquarters}
                </div>
              )}
              {(job as any).official_domain && (
                <div className="flex items-center gap-1.5 pt-1">
                  <strong className="text-slate-800">Website:</strong>
                  <a
                    href={`https://${(job as any).official_domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-600 hover:underline flex items-center gap-1"
                  >
                    {(job as any).official_domain}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
              {job.company.website && !(job as any).official_domain && (
                <div className="flex items-center gap-1.5 pt-1">
                  <strong className="text-slate-800">Website:</strong>
                  <a
                    href={job.company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-600 hover:underline flex items-center gap-1"
                  >
                    {job.company.website.replace(/^https?:\/\//, '')}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Section 6: CTA Banner */}
        <CTABanner job={job} />

        {/* Section 7: Job Metadata */}
        <Card className="mb-6 border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-base font-bold flex items-center gap-2 mb-4 uppercase tracking-wide text-slate-900">
              <Info className="w-5 h-5 text-teal-600" />
              <span>Listing Details</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-600">
              {job.posted_at && (
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>
                    <strong className="text-slate-800">Posted:</strong> {formatDate(job.posted_at)}
                  </span>
                </div>
              )}
              {job.last_seen_at && (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>
                    <strong className="text-slate-800">Last synced:</strong> {formatDate(job.last_seen_at)}
                  </span>
                </div>
              )}
              {atsSource && (
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>
                    <strong className="text-slate-800">Source:</strong> {atsSource}
                  </span>
                </div>
              )}
              {job.apply_url && (
                <div className="flex items-center gap-2 col-span-full">
                  <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>
                    <strong className="text-slate-800">Application URL:</strong>{" "}
                    <a
                      href={job.apply_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:underline break-all"
                    >
                      {job.apply_url.length > 60 ? job.apply_url.slice(0, 60) + '…' : job.apply_url}
                    </a>
                  </span>
                </div>
              )}
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100">
              <a
                href={`mailto:jobpulse.report@gmail.com?subject=Report Incorrect Info: ${encodeURIComponent(job.title)} at ${encodeURIComponent(job.company.name)}&body=Job URL: ${encodeURIComponent(`${typeof window !== 'undefined' ? window.location.href : ''}`)}`}
                className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
              >
                Report incorrect information →
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Section 8: Share This Job */}
        <Card className="mb-6 border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-base font-bold flex items-center gap-2 mb-4 uppercase tracking-wide text-slate-900">
              <span>📤 Share This Job</span>
            </h2>
            <ShareButtons jobTitle={job.title} jobUrl={`/jobs/${job.slug}`} />
          </CardContent>
        </Card>

        {/* Section 9: Related Jobs */}
        <RelatedJobs currentJob={job} />

        {/* Section 10: Quick Info */}
        <QuickInfo job={job} />

        {/* Disclaimer */}
        <div className="bg-slate-100 border border-slate-200 rounded-xl p-5 text-xs text-slate-600 leading-relaxed mb-8">
          <strong>Official Requisition Notice:</strong> JobPulse indexes verified career requisitions directly from employer applicant tracking systems (ATS) and official public career boards. All trademarks and company names are property of their respective owners. JobPulse does not charge any application or recruitment fees. Always apply through the verified official link provided above.
        </div>
      </div>
    </div>
  );
}
