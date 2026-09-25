"use client";

import React, { useState, useEffect } from "react";
import { BarChart3, ArrowRight, Target, Search, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

export interface SkillGapSectionProps {
  targetRole: string;
  userSkills: string[];
  onTargetRoleChange?: (newRole: string) => void;
  onViewDetailedAnalysis?: () => void;
}

// Comprehensive industry standard skills matrix across ALL business and tech domains
const COMMON_ROLE_SKILLS: Record<string, string[]> = {
  // Sales, Business Development & Account Management
  "Sales Executive": [
    "B2B Sales", "Lead Generation", "CRM (Salesforce/HubSpot)", "Negotiation", 
    "Client Relationship Management", "Closing Deals", "Cold Outreach", "Pipeline Management", "Sales Pitching"
  ],
  "Business Development Executive": [
    "B2B Sales", "Lead Generation", "Client Acquisition", "Cold Outreach", 
    "Negotiation", "CRM", "Market Research", "Contract Closing"
  ],
  "Account Executive": [
    "Enterprise Sales", "CRM", "Client Retention", "Solution Selling", 
    "Contract Negotiation", "Demo Presentations", "Revenue Growth", "Pipeline Management"
  ],
  "Sales Manager": [
    "Sales Strategy", "Team Leadership", "Revenue Forecasting", "CRM Management", 
    "Key Account Management", "Negotiation", "Sales Coaching", "Quota Setting"
  ],

  // Marketing, Growth & Content
  "Digital Marketing Specialist": [
    "SEO", "Google Analytics", "Social Media Marketing", "Performance Marketing", 
    "Meta Ads", "Content Marketing", "PPC Campaigns", "Email Marketing"
  ],
  "Content Writer": [
    "Content Strategy", "SEO Copywriting", "Blog Writing", "Storytelling", 
    "Proofreading", "WordPress", "Content Research", "Social Media Copy"
  ],
  "SEO Specialist": [
    "Technical SEO", "Keyword Research", "On-Page Optimization", "Google Search Console", 
    "Ahrefs/SEMrush", "Link Building", "Web Analytics", "Content Optimization"
  ],
  "Marketing Manager": [
    "Marketing Strategy", "Brand Management", "Budget Allocation", "Campaign Analytics", 
    "Performance Marketing", "Team Leadership", "Market Research", "Public Relations"
  ],

  // Human Resources & Talent Acquisition
  "HR Manager": [
    "Talent Acquisition", "Employee Relations", "HR Policies", "Labor Compliance", 
    "Performance Management", "Payroll Management", "HRIS", "Onboarding"
  ],
  "Technical Recruiter": [
    "Tech Talent Sourcing", "Boolean Search", "Candidate Screening", "ATS (Greenhouse/Lever)", 
    "Salary Negotiation", "Interview Scheduling", "LinkedIn Recruiter", "Job Offer Management"
  ],
  "HR Generalist": [
    "Employee Onboarding", "HR Administration", "Policy Implementation", "Employee Engagement", 
    "Benefits Administration", "Grievance Handling", "HRIS Records", "Compliance"
  ],

  // Finance, Banking & Accounting
  "Financial Analyst": [
    "Financial Modeling", "Advanced Excel", "Valuation", "Financial Statements", 
    "Forecasting", "Variance Analysis", "Power BI", "Data Interpretation"
  ],
  "Accountant": [
    "General Ledger", "Taxation & GST", "Balance Sheet", "Tally / QuickBooks", 
    "Bank Reconciliation", "Auditing", "Accounts Payable/Receivable", "Statutory Compliance"
  ],

  // Design, Creative & UI/UX
  "UI/UX Designer": [
    "Figma", "Wireframing & Prototyping", "User Research", "Usability Testing", 
    "Design Systems", "Visual Design", "Information Architecture", "Interaction Design"
  ],
  "Graphic Designer": [
    "Adobe Photoshop", "Adobe Illustrator", "Brand Identity", "Typography", 
    "Visual Communication", "Figma", "Digital Illustration", "Print Design"
  ],

  // Operations, Supply Chain & Customer Success
  "Operations Manager": [
    "Process Optimization", "Supply Chain Management", "Vendor Negotiation", "Inventory Control", 
    "KPI & SLA Management", "Cross-Functional Leadership", "Resource Planning", "Quality Assurance"
  ],
  "Customer Success Manager": [
    "Client Retention", "Zendesk", "Customer Onboarding", "Churn Prevention", 
    "Account Health Monitoring", "Upselling & Renewals", "Relationship Management", "Customer Advocacy"
  ],
  "Customer Support Executive": [
    "Active Listening", "Problem Resolution", "Zendesk / Freshdesk", "Customer Communication", 
    "Ticket Escalation", "SLA Adherence", "Empathy & Patience", "Product Troubleshooting"
  ],

  // Product & Project Management
  "Product Manager": [
    "Product Strategy", "User Research", "Agile & Scrum", "Roadmap Planning", 
    "JIRA", "Data Analytics", "Feature Prioritization", "Stakeholder Management"
  ],
  "Project Manager": [
    "Project Planning", "Risk Management", "Budget Allocation", "Agile / PMP", 
    "Stakeholder Communication", "Resource Management", "Timeline Tracking", "Jira/Asana"
  ],

  // Data Science, AI & ML
  "Data Scientist": [
    "Python", "SQL", "Machine Learning", "Statistics", "Pandas", 
    "Scikit-Learn", "AWS", "Spark", "Docker", "MLOps"
  ],
  "Machine Learning Engineer": [
    "Python", "Deep Learning", "PyTorch", "Kubernetes", "AWS", 
    "Docker", "MLOps", "CI/CD", "Model Deployment"
  ],
  "ML Engineer": [
    "Python", "Deep Learning", "PyTorch", "Kubernetes", "AWS", 
    "Docker", "MLOps", "CI/CD", "Model Deployment"
  ],
  "AI Engineer": [
    "Python", "PyTorch", "LLMs", "LangChain", "Generative AI", 
    "Transformers", "Docker", "FastAPI", "Prompt Engineering"
  ],
  "Data Analyst": [
    "SQL", "Power BI", "Excel", "Data Visualization", "Tableau", 
    "Python", "Business Intelligence", "Statistical Analysis"
  ],
  "Data Engineer": [
    "Python", "SQL", "Apache Spark", "Airflow", "Kafka", 
    "PostgreSQL", "AWS", "Snowflake", "ETL Pipelines"
  ],
  "BI Developer": [
    "SQL", "Power BI", "Tableau", "Data Warehousing", "ETL", 
    "Excel", "Data Modeling", "DAX Formulas"
  ],

  // Software & Web Engineering
  "Full Stack Engineer": [
    "React", "TypeScript", "Node.js", "PostgreSQL", "Next.js", 
    "Docker", "Tailwind CSS", "Redis", "REST APIs"
  ],
  "Frontend Developer": [
    "React", "TypeScript", "JavaScript", "HTML", "CSS", 
    "Next.js", "Tailwind CSS", "REST APIs", "State Management"
  ],
  "Backend Engineer": [
    "Python", "PostgreSQL", "Node.js", "Docker", "System Design", 
    "Redis", "Kafka", "AWS", "REST APIs", "Microservices"
  ],
  "Software Engineer": [
    "Python", "Java", "Data Structures", "System Design", "Git", 
    "SQL", "Docker", "REST APIs", "Problem Solving"
  ],
  "Mobile Developer": [
    "React Native", "TypeScript", "Mobile Architecture", "REST APIs", 
    "Git", "Swift", "Kotlin", "App Store Publishing"
  ],
  "iOS Developer": [
    "Swift", "iOS SDK", "Xcode", "UIKit", "SwiftUI", 
    "REST APIs", "Git", "Core Data", "System Design"
  ],
  "Android Developer": [
    "Kotlin", "Android SDK", "Java", "Jetpack Compose", "REST APIs", 
    "Git", "Coroutines", "Room Database"
  ],

  // Cloud, DevOps & Security
  "DevOps Engineer": [
    "Docker", "Kubernetes", "AWS", "CI/CD", "Terraform", 
    "Linux", "Git", "GitHub Actions", "Monitoring"
  ],
  "Cloud Architect": [
    "AWS", "Azure", "GCP", "Kubernetes", "Terraform", 
    "System Design", "Microservices", "Cloud Security", "Cost Optimization"
  ],
  "Cloud Engineer": [
    "AWS", "Docker", "Linux", "Terraform", "Python", 
    "Kubernetes", "Networking", "IAM Policies"
  ],
  "Site Reliability Engineer (SRE)": [
    "Kubernetes", "Docker", "Linux", "Go", "Python", 
    "Prometheus", "CI/CD", "AWS", "Incident Management"
  ],
  "Cybersecurity Analyst": [
    "Network Security", "Linux", "SIEM", "Python", "Penetration Testing", 
    "OWASP", "Firewalls", "Incident Response", "Vulnerability Assessment"
  ],
  "QA Automation Engineer": [
    "Selenium", "Cypress", "Python", "Test Automation", "CI/CD", 
    "Git", "Jira", "Postman", "API Testing"
  ]
};

// Popular quick selection pills across tech and non-tech
const POPULAR_SUGGESTIONS = [
  "Sales Executive",
  "Data Scientist",
  "Full Stack Engineer",
  "Digital Marketing Specialist",
  "UI/UX Designer",
  "Product Manager",
  "HR Manager",
  "DevOps Engineer"
];

/**
 * Resolves required industry skills for ANY role on earth.
 * Uses exact match, partial dictionary match, or smart domain-specific classifier.
 */
function resolveSkillsForRole(roleName: string): string[] {
  const trimmed = roleName.trim();
  if (!trimmed) return COMMON_ROLE_SKILLS["Data Scientist"];

  // 1. Direct dictionary match
  if (COMMON_ROLE_SKILLS[trimmed]) {
    return COMMON_ROLE_SKILLS[trimmed];
  }

  // 2. Case-insensitive dictionary match
  const lower = trimmed.toLowerCase();
  for (const [key, skills] of Object.entries(COMMON_ROLE_SKILLS)) {
    if (key.toLowerCase() === lower || lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return skills;
    }
  }

  // 3. Domain-specific keyword classifier across all industries
  // -----------------------------------------------------------------
  // A. Sales, Business Development & Deals
  if (
    lower.includes("sale") || 
    lower.includes("bdr") || 
    lower.includes("sdr") || 
    lower.includes("account exec") || 
    lower.includes("business dev") || 
    lower.includes("revenue") || 
    lower.includes("telecall") || 
    lower.includes("closing") || 
    lower.includes("lead gen")
  ) {
    return [
      "B2B Sales", "Lead Generation", "CRM (Salesforce/HubSpot)", "Negotiation", 
      "Client Relationship Management", "Closing Deals", "Cold Outreach", "Pipeline Management", "Sales Pitching"
    ];
  }

  // B. Marketing, Growth, SEO & Content
  if (
    lower.includes("market") || 
    lower.includes("seo") || 
    lower.includes("sem") || 
    lower.includes("content") || 
    lower.includes("copy") || 
    lower.includes("brand") || 
    lower.includes("social") || 
    lower.includes("advertis") || 
    lower.includes("growth")
  ) {
    return [
      "SEO", "Google Analytics", "Social Media Marketing", "Performance Marketing", 
      "Content Strategy", "PPC Campaigns", "Email Marketing", "Copywriting", "Market Research"
    ];
  }

  // C. Human Resources, Talent & Recruiting
  if (
    lower.includes("hr") || 
    lower.includes("human resource") || 
    lower.includes("talent") || 
    lower.includes("recruit") || 
    lower.includes("people") || 
    lower.includes("hiring") || 
    lower.includes("payroll")
  ) {
    return [
      "Talent Acquisition", "Technical Recruiting", "HR Policies", "Candidate Screening", 
      "HRIS & ATS", "Employee Engagement", "Performance Management", "Onboarding", "Labor Laws"
    ];
  }

  // D. Finance, Accounting, Audit & Banking
  if (
    lower.includes("financ") || 
    lower.includes("account") || 
    lower.includes("tax") || 
    lower.includes("audit") || 
    lower.includes("bank") || 
    lower.includes("invest") || 
    lower.includes("wealth") || 
    lower.includes("ca") ||
    lower.includes("billing")
  ) {
    return [
      "Financial Modeling", "Accounting Principles", "Advanced Excel", "Financial Statement Analysis", 
      "Budgeting & Forecasting", "Taxation & GST", "Auditing", "ERP (SAP/Tally)", "Cash Flow Management"
    ];
  }

  // E. Design, Creative & UI/UX
  if (
    lower.includes("design") || 
    lower.includes("ui") || 
    lower.includes("ux") || 
    lower.includes("figma") || 
    lower.includes("graphic") || 
    lower.includes("illustrat") || 
    lower.includes("visual") || 
    lower.includes("artist") || 
    lower.includes("animat")
  ) {
    return [
      "Figma", "UI/UX Design", "Wireframing & Prototyping", "User Research", 
      "Adobe Creative Suite", "Visual Hierarchy", "Design Systems", "Interaction Design", "Typography"
    ];
  }

  // F. Customer Support, Customer Success & CX
  if (
    lower.includes("support") || 
    lower.includes("customer") || 
    lower.includes("client serv") || 
    lower.includes("csm") || 
    lower.includes("cx") || 
    lower.includes("helpdesk")
  ) {
    return [
      "Customer Retention", "Zendesk / Intercom", "Problem Resolution", "Active Listening", 
      "Client Onboarding", "Escalation Handling", "SLA Management", "Customer Empathy", "CRM"
    ];
  }

  // G. Operations, Supply Chain & Logistics
  if (
    lower.includes("op") || 
    lower.includes("logist") || 
    lower.includes("supply") || 
    lower.includes("chain") || 
    lower.includes("procure") || 
    lower.includes("warehouse")
  ) {
    return [
      "Supply Chain Management", "Process Optimization", "Logistics Planning", "Inventory Management", 
      "Vendor Negotiation", "ERP Systems", "KPI & SLA Tracking", "Operations Strategy"
    ];
  }

  // H. Healthcare, Medical & Pharma
  if (
    lower.includes("health") || 
    lower.includes("medic") || 
    lower.includes("pharma") || 
    lower.includes("clinic") || 
    lower.includes("nurs")
  ) {
    return [
      "Clinical Knowledge", "Patient Care", "Healthcare Compliance", "Medical Terminology", 
      "Pharmacology", "Data Recording", "Health & Safety Standards", "Patient Communication"
    ];
  }

  // I. Legal, Law & Compliance
  if (
    lower.includes("law") || 
    lower.includes("legal") || 
    lower.includes("complian") || 
    lower.includes("counsel")
  ) {
    return [
      "Contract Negotiation", "Corporate Law", "Regulatory Compliance", "Legal Drafting", 
      "Risk Assessment", "Due Diligence", "Intellectual Property", "Litigation Support"
    ];
  }

  // J. Education, Teaching & Training
  if (
    lower.includes("teach") || 
    lower.includes("educat") || 
    lower.includes("train") || 
    lower.includes("tutor") || 
    lower.includes("professor") || 
    lower.includes("instructor")
  ) {
    return [
      "Curriculum Development", "Classroom Instruction", "Student Assessment", "Public Speaking", 
      "Instructional Design", "E-Learning Tools", "Mentoring", "Subject Matter Expertise"
    ];
  }

  // K. Product & Project Management
  if (
    lower.includes("product") || 
    lower.includes("project") || 
    lower.includes("scrum") || 
    lower.includes("agile") || 
    lower.includes("program")
  ) {
    return [
      "Product Strategy", "User Research", "Agile & Scrum", "Roadmap Planning", 
      "JIRA", "Data Analytics", "Feature Prioritization", "Stakeholder Management"
    ];
  }

  // L. AI, ML, Data Science & Analytics
  if (lower.includes("ai") || lower.includes("ml") || lower.includes("learning") || lower.includes("intelligence")) {
    return ["Python", "PyTorch", "Machine Learning", "Deep Learning", "LLMs", "MLOps", "Docker", "Model Deployment"];
  }
  if (lower.includes("data") && (lower.includes("analyst") || lower.includes("bi") || lower.includes("business"))) {
    return ["SQL", "Power BI", "Excel", "Tableau", "Python", "Data Visualization", "Business Intelligence"];
  }
  if (lower.includes("data") && (lower.includes("eng") || lower.includes("pipeline") || lower.includes("warehouse"))) {
    return ["Python", "SQL", "Apache Spark", "Airflow", "Kafka", "PostgreSQL", "AWS", "Snowflake"];
  }

  // M. Cloud, DevOps & Infrastructure
  if (lower.includes("cloud") || lower.includes("devops") || lower.includes("infra") || lower.includes("platform") || lower.includes("sre")) {
    return ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD", "Linux", "Git", "Monitoring"];
  }

  // N. Cybersecurity
  if (lower.includes("security") || lower.includes("cyber") || lower.includes("infosec")) {
    return ["Network Security", "Linux", "SIEM", "Python", "Penetration Testing", "OWASP", "Firewalls"];
  }

  // O. Web, Mobile & Software Development
  if (lower.includes("front") || lower.includes("react") || lower.includes("angular") || lower.includes("vue")) {
    return ["React", "TypeScript", "JavaScript", "Next.js", "Tailwind CSS", "HTML", "CSS", "REST APIs"];
  }
  if (lower.includes("back") || lower.includes("api") || lower.includes("microservice")) {
    return ["Python", "Node.js", "PostgreSQL", "Docker", "System Design", "Redis", "REST APIs"];
  }
  if (lower.includes("mobile") || lower.includes("ios") || lower.includes("android") || lower.includes("flutter")) {
    return ["React Native", "Swift", "Kotlin", "Mobile Architecture", "REST APIs", "Git", "App Store Publishing"];
  }
  if (lower.includes("qa") || lower.includes("test")) {
    return ["Selenium", "Cypress", "Python", "Test Automation", "CI/CD", "Jira", "Postman"];
  }

  // P. Cross-Industry Management & Leadership (e.g. "Branch Manager", "Executive", "Director")
  if (lower.includes("manager") || lower.includes("director") || lower.includes("lead") || lower.includes("consultant")) {
    return [
      "Strategic Planning", "Stakeholder Management", "Team Leadership", "Budgeting", 
      "KPI & OKR Tracking", "Process Improvement", "Executive Communication", "Decision Making"
    ];
  }

  // Q. Universal Workplace Competencies for arbitrary terms
  return [
    "Effective Communication", "Problem Solving", "Time Management", "Project Coordination", 
    "Research & Analysis", "Teamwork & Collaboration", "Documentation", "Client Relations"
  ];
}

export function SkillGapSection({
  targetRole = "Data Scientist",
  userSkills = [],
  onTargetRoleChange,
  onViewDetailedAnalysis
}: SkillGapSectionProps) {
  const [selectedRole, setSelectedRole] = useState(targetRole || "Data Scientist");
  const [inputRole, setInputRole] = useState(targetRole || "Data Scientist");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (targetRole) {
      setSelectedRole(targetRole);
      setInputRole(targetRole);
    }
  }, [targetRole]);

  const handleApplyRole = (roleToApply: string) => {
    const trimmed = roleToApply.trim();
    if (!trimmed) return;
    setSelectedRole(trimmed);
    setInputRole(trimmed);
    setIsEditing(false);
    onTargetRoleChange?.(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleApplyRole(inputRole);
    }
  };

  // Dynamic skills derived from dictionary or smart domain classifier
  const roleRequiredSkills = resolveSkillsForRole(selectedRole);
  const userSkillsLower = userSkills.map((s) => s.toLowerCase().trim());

  const matchedSkills = roleRequiredSkills.filter((s) =>
    userSkillsLower.includes(s.toLowerCase().trim())
  );

  const missingSkills = roleRequiredSkills.filter(
    (s) => !userSkillsLower.includes(s.toLowerCase().trim())
  );

  const matchScore = roleRequiredSkills.length > 0
    ? Math.min(100, Math.round((matchedSkills.length / roleRequiredSkills.length) * 100))
    : 0;

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-4.5 lg:p-5 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Skill Gap Analysis
              </h2>
              <p className="text-[11px] text-slate-500">
                Analyze your profile readiness for any role
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onViewDetailedAnalysis}
            className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 group transition-colors cursor-pointer shrink-0"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Interactive Custom Role Input Field */}
        <div className="mt-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-teal-600" />
              Target Job Role:
            </span>
            <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200/60 truncate max-w-[180px]">
              {selectedRole}
            </span>
          </div>

          {/* Text Box for Custom Role */}
          <div className="flex items-center gap-1.5">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inputRole}
                onChange={(e) => {
                  setInputRole(e.target.value);
                  setIsEditing(true);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Type any role (e.g. Sales Executive, Cloud Architect)..."
                className="w-full pl-8 pr-3 py-1.5 text-xs font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-all placeholder:text-slate-400"
              />
            </div>
            <button
              type="button"
              onClick={() => handleApplyRole(inputRole)}
              className="px-3 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors cursor-pointer shrink-0 shadow-2xs"
            >
              Analyze
            </button>
          </div>

          {/* Quick Popular Suggestions */}
          <div className="flex flex-wrap items-center gap-1 pt-0.5">
            <span className="text-[10px] text-slate-400 font-semibold mr-0.5">Popular:</span>
            {POPULAR_SUGGESTIONS.map((sug) => (
              <button
                key={sug}
                type="button"
                onClick={() => handleApplyRole(sug)}
                className={`text-[10px] px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                  selectedRole.toLowerCase() === sug.toLowerCase()
                    ? "bg-teal-600 text-white border-teal-600 font-bold"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200 font-medium"
                }`}
              >
                {sug}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Match Bar */}
        <div className="mt-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Readiness Match
            </span>
            <span className="font-extrabold text-teal-700 text-sm">
              {matchScore}%
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-teal-500 h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${matchScore}%` }}
            />
          </div>
        </div>

        {/* Matched Skills Chips */}
        {matchedSkills.length > 0 && (
          <div className="mt-3.5 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 mb-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Acquired Skills ({matchedSkills.length})</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {matchedSkills.map((skill) => (
                <span
                  key={skill}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Missing Skills Chips */}
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1 text-[11px] font-bold text-rose-700 mb-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
            <span>Missing Skills to Learn ({missingSkills.length})</span>
          </div>

          {missingSkills.length === 0 ? (
            <p className="text-xs font-semibold text-emerald-600">
              Outstanding! You meet all core requirements for {selectedRole}. 🎉
            </p>
          ) : (
            <div className="flex flex-wrap gap-1">
              {missingSkills.map((skill) => (
                <span
                  key={skill}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200/70"
                >
                  +{skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
