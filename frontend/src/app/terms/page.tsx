import { Metadata } from "next";
import { Scale, HelpCircle } from "lucide-react";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { LegalPageHeader } from "@/components/legal/LegalPageHeader";
import { LegalSection } from "@/components/legal/LegalSection";
import { InfoNotice } from "@/components/legal/InfoNotice";

export const metadata: Metadata = {
  title: "Terms of Service | JobPulse",
  description: "Read JobPulse's Terms of Service, user agreement, and platform policies.",
};

export default function TermsPage() {
  return (
    <LegalPageLayout>
      <LegalPageHeader
        icon={Scale}
        category="Agreements & Rules"
        title="Terms of Service"
        lastUpdated="September 2026"
        description="These Terms of Service govern your access to and use of JobPulse. By using our platform, you agree to comply with these terms."
      />

      <div className="space-y-2">
        <LegalSection number="01" title="Acceptance of Terms">
          <p>
            By accessing or using JobPulse, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may discontinue use of the service.
          </p>
        </LegalSection>

        <LegalSection number="02" title="Platform Purpose & Aggregation">
          <p>
            JobPulse is an automated real-time discovery engine. We aggregate and link to verified job openings published directly on public career portals by hiring organizations.
          </p>
          <p>
            JobPulse is not an employer, recruitment agency, or hiring entity. All employment agreements and interview communications occur solely between the candidate and the hiring company.
          </p>
        </LegalSection>

        <LegalSection number="03" title="User Responsibilities">
          <p>
            You agree to use JobPulse only for lawful purposes and in accordance with these terms. You must not attempt to misuse, scrape, or disrupt our systems, or submit false or misleading information.
          </p>
        </LegalSection>

        <LegalSection number="04" title="Intellectual Property">
          <p>
            All content, branding, design, and technology on JobPulse (excluding third-party job listings) are the intellectual property of JobPulse. You may not copy, reproduce, or distribute any part of the platform without prior written permission.
          </p>
        </LegalSection>

        <LegalSection number="05" title="Limitation of Liability">
          <p>
            JobPulse is provided &ldquo;as is&rdquo; without warranties of any kind. We are not responsible for the accuracy, availability, or completeness of third-party job postings or employer practices.
          </p>
        </LegalSection>
      </div>

      <InfoNotice
        icon={HelpCircle}
        title="Questions about these terms?"
        description="If you have any questions or concerns, feel free to contact our team."
        buttonText="Contact Us"
        buttonHref="/contact"
      />
    </LegalPageLayout>
  );
}
