import { Metadata } from "next";
import { Lock, Laptop, BarChart3 } from "lucide-react";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { LegalPageHeader } from "@/components/legal/LegalPageHeader";
import { LegalSection } from "@/components/legal/LegalSection";
import { InfoNotice } from "@/components/legal/InfoNotice";

export const metadata: Metadata = {
  title: "Privacy Policy | JobPulse",
  description: "Learn how JobPulse handles data and safeguards candidate privacy.",
};

export default function PrivacyPage() {
  return (
    <LegalPageLayout>
      <LegalPageHeader
        icon={Lock}
        category="Legal & Compliance"
        title="Privacy Policy"
        lastUpdated="September 2026"
        description="This Privacy Policy explains what information we collect, how we use it, and how we protect your data when you use JobPulse."
      />

      <div className="space-y-2">
        <LegalSection number="01" title="Information We Collect">
          <p>
            JobPulse is built with privacy by default. We do not require you to create an account, register your email, or upload sensitive documents just to browse verified job openings.
          </p>

          {/* Subcards for Local Preferences & Anonymous Analytics */}
          <div className="space-y-3 pt-1">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#0d9488] flex items-center justify-center shrink-0 border border-teal-100 mt-0.5">
                <Laptop className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 leading-tight">
                  Local Preferences
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  We use your browser&apos;s local storage to preserve your theme preference (Light/Dark mode) and recent search filters.
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#0d9488] flex items-center justify-center shrink-0 border border-teal-100 mt-0.5">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 leading-tight">
                  Anonymous Analytics
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  We collect basic, aggregated telemetry on popular search queries to improve indexing quality, without identifying individual users.
                </p>
              </div>
            </div>
          </div>
        </LegalSection>

        <LegalSection number="02" title="How We Use Information">
          <p>
            The limited information we collect is used to:
          </p>
          <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside pt-1 pl-1">
            <li>Keep your experience personalized (theme, filters, etc.)</li>
            <li>Improve search relevance and indexing quality</li>
            <li>Monitor platform health and prevent abuse</li>
          </ul>
        </LegalSection>

        <LegalSection number="03" title="Third-Party Services">
          <p>
            When you select &ldquo;Apply Official&rdquo;, you are routed directly to third-party applicant tracking systems (e.g., Workday, Greenhouse, Lever). Any resumes, contact information, or interview responses submitted there are governed by that employer&apos;s privacy notice. JobPulse does not store or process your job application submissions.
          </p>
        </LegalSection>

        <LegalSection number="04" title="Data Security">
          <p>
            We enforce modern SSL/TLS encryption across all JobPulse endpoints. Our data aggregation pipelines read only publicly indexed information from official career portals to ensure you get authentic job data without tracking cookies.
          </p>
        </LegalSection>
      </div>

      <InfoNotice
        icon={Lock}
        title="Your privacy matters"
        description="If you have any questions about this policy or how we handle data, please contact us."
        buttonText="Contact Us"
        buttonHref="/contact"
      />
    </LegalPageLayout>
  );
}
