import { Metadata } from "next";
import { ShieldCheck, Check, Globe } from "lucide-react";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { LegalPageHeader } from "@/components/legal/LegalPageHeader";
import { LegalSection } from "@/components/legal/LegalSection";
import { InfoNotice } from "@/components/legal/InfoNotice";

export const metadata: Metadata = {
  title: "Direct ATS & Zero-Scam Policy | JobHighway",
  description: "Learn about JobHighway's strict Direct ATS and Zero-Scam Verification guarantee.",
};

const ATS_PLATFORMS = [
  {
    name: "Workday",
    icon: (
      <div className="w-5 h-5 rounded-full bg-[#0051C6] text-white flex items-center justify-center font-bold text-[10px] shadow-2xs">
        W
      </div>
    ),
  },
  {
    name: "Greenhouse",
    icon: (
      <div className="w-5 h-5 rounded-full bg-[#00B259] text-white flex items-center justify-center shadow-2xs">
        <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
          <circle cx="9" cy="9" r="3.5" />
          <circle cx="15" cy="15" r="3.5" />
        </svg>
      </div>
    ),
  },
  {
    name: "Lever",
    icon: (
      <div className="w-5 h-5 rounded-full bg-[#111827] text-white flex items-center justify-center font-bold text-[10px] shadow-2xs">
        <svg viewBox="0 0 24 24" className="w-3 h-3 stroke-current stroke-[3] fill-none">
          <line x1="6" y1="18" x2="18" y2="6" />
          <circle cx="7" cy="17" r="1.5" fill="currentColor" />
        </svg>
      </div>
    ),
  },
  {
    name: "SmartRecruiters",
    icon: (
      <div className="w-5 h-5 rounded-full bg-[#00A368] text-white flex items-center justify-center font-bold text-[10px] shadow-2xs">
        S
      </div>
    ),
  },
  {
    name: "Ashby",
    icon: (
      <div className="w-5 h-5 rounded-full bg-[#7C3AED] text-white flex items-center justify-center font-bold text-[10px] shadow-2xs">
        A
      </div>
    ),
  },
  {
    name: "Taleo",
    icon: (
      <div className="w-5 h-5 rounded-full bg-[#EA580C] text-white flex items-center justify-center font-bold text-[10px] shadow-2xs">
        <svg viewBox="0 0 24 24" className="w-3 h-3 stroke-current stroke-[3]">
          <line x1="12" y1="4" x2="12" y2="20" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="6.34" y1="6.34" x2="17.66" y2="17.66" />
          <line x1="6.34" y1="17.66" x2="17.66" y2="6.34" />
        </svg>
      </div>
    ),
  },
  {
    name: "iCIMS",
    icon: (
      <div className="w-5 h-5 rounded-full bg-[#0284C7] text-white flex items-center justify-center font-bold text-[10px] shadow-2xs">
        i
      </div>
    ),
  },
  {
    name: "Official Domains",
    icon: (
      <div className="w-5 h-5 rounded-full bg-[#0D9488] text-white flex items-center justify-center shadow-2xs">
        <Globe className="w-3 h-3 text-white" />
      </div>
    ),
  },
];

export default function AtsPolicyPage() {
  return (
    <LegalPageLayout>
      <LegalPageHeader
        icon={ShieldCheck}
        category="Trust & Transparency"
        title="Direct ATS & Zero-Scam Policy"
        description="At JobHighway, our mission is to eliminate ghost postings, commission-hungry recruitment middlemen, and fraudulent listings. Every single opportunity featured on JobHighway is directly routed to the hiring company's verified Applicant Tracking System (ATS)."
      />

      <div className="space-y-2">
        <LegalSection number="01" title="100% Direct Official Application Links">
          <p>
            When you click &ldquo;Apply Official&rdquo; on any JobHighway listing, you are routed directly to the employer&apos;s genuine ATS portal. We support and integrate with enterprise career engines including:
          </p>

          {/* 8 ATS Platform Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
            {ATS_PLATFORMS.map((platform) => (
              <div
                key={platform.name}
                className="bg-white border border-slate-200/90 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 shadow-2xs hover:border-slate-300 transition-colors"
              >
                {platform.icon}
                <span className="font-semibold text-xs text-slate-800 tracking-tight">
                  {platform.name}
                </span>
              </div>
            ))}
          </div>
        </LegalSection>

        <LegalSection number="02" title="Continuous Automated Health & Link Verification">
          <p>
            Our automated crawlers sync job portals every 10–15 minutes. If a role is closed, unlisted, or expired by the employer, our verification pipeline automatically de-indexes or marks it inactive to prevent wasted applications.
          </p>

          {/* Checkmark Features */}
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center gap-2.5 text-sm text-slate-600 font-normal">
              <div className="w-4 h-4 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span>Zero dead-ends or 404 broken application links</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-slate-600 font-normal">
              <div className="w-4 h-4 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span>No fake generated roles or synthetic AI-hallucinated job postings</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-slate-600 font-normal">
              <div className="w-4 h-4 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span>Direct extraction of authentic JD requirements, locations, and hiring criteria</span>
            </div>
          </div>
        </LegalSection>

        <LegalSection number="03" title="Zero Middlemen & No Spam">
          <p>
            JobHighway does not sell your contact details to recruiters, third-party marketing firms, or shady &ldquo;placement training&rdquo; agencies. We do not place ads or paywalls in front of application links, nor do we require upfront fees. Your resume and candidate information go directly into the employer&apos;s HR pipeline without any intermediate interception.
          </p>
        </LegalSection>
      </div>

      <InfoNotice
        icon={ShieldCheck}
        title="Found a suspicious or dead link?"
        description="If you ever find an expired opening or incorrect redirect, our monitoring team reviews automated reports daily. Contact our team or inspect the job slug directly."
        buttonText="Report Issue"
        buttonHref="/contact?topic=Suspicious%20or%20Dead%20Link"
      />
    </LegalPageLayout>
  );
}
