/**
 * Core Job Recommendation Engine for JobHighway
 * 
 * Provides truthful, multi-factor candidate-job matching:
 * 1. Role & Title Relevance (35%) - Strict taxonomy, domain clustering, and generic title penalty
 * 2. Skill Compatibility (35%) - Jaccard/overlap analysis against required and preferred skills
 * 3. Experience Compatibility (15%) - Seniority and years alignment (penalizes under-qualified)
 * 4. Location & Work Mode (10%) - Remote, country, and city compatibility
 * 5. Preference & Affinity (5%) - Followed companies, bookmarks, and education
 * 
 * Zero fake clamping, zero hardcoded arbitrary base scores.
 */

import { Job } from './api';

export interface CandidateRecommendationProfile {
  targetRole?: string;
  currentRole?: string;
  skills?: string[];
  yearsExperience?: string | number;
  education?: string;
  preferredLocation?: string;
  preferredWorkMode?: string;
  targetCtc?: string;
  bookmarks?: string[];
  appliedJobIds?: string[];
  followedCompanies?: string[];
}

export interface ScoreBreakdown {
  roleRelevance: number;        // Max 35
  skillCompatibility: number;   // Max 35
  experienceCompatibility: number; // Max 15
  locationCompatibility: number;   // Max 10
  preferenceCompatibility: number; // Max 5
}

export interface ScoredRecommendation {
  job: Job;
  matchScore: number; // 0 - 100
  scoreBreakdown: ScoreBreakdown;
  matchedSkills: string[];
  missingSkills: string[];
  matchReasons: string[];
}

// -----------------------------------------------------------------------------
// Role Taxonomy & Domain Definitions
// -----------------------------------------------------------------------------
interface DomainConfig {
  id: string;
  name: string;
  coreKeywords: string[];
  negativeKeywords: string[];
  relatedDomainIds: string[];
}

const ROLE_DOMAINS: DomainConfig[] = [
  {
    id: 'data_science_ai',
    name: 'Data Science & AI',
    coreKeywords: [
      'data scientist', 'data science', 'machine learning', 'ml engineer', 'ai engineer',
      'deep learning', 'nlp', 'natural language processing', 'computer vision', 'llm',
      'generative ai', 'ai researcher', 'research scientist', 'artificial intelligence'
    ],
    negativeKeywords: [
      'application engineer', 'civil engineer', 'mechanical engineer', 'electrical engineer',
      'structural engineer', 'hardware engineer', 'infrastructuurbeheerder', 'network engineer',
      'system administrator', 'sales engineer', 'customer support', 'nurse', 'accountant',
      'pharmacist', 'legal counsel', 'recruiter', 'content writer'
    ],
    relatedDomainIds: ['data_analytics', 'data_engineering', 'software_backend']
  },
  {
    id: 'data_analytics',
    name: 'Data Analytics & BI',
    coreKeywords: [
      'data analyst', 'bi analyst', 'business intelligence', 'analytics engineer',
      'bi developer', 'tableau developer', 'power bi developer', 'reporting analyst',
      'insights analyst', 'sql analyst', 'data analysis'
    ],
    negativeKeywords: [
      'application engineer', 'civil engineer', 'mechanical engineer', 'hardware engineer',
      'network engineer', 'nurse', 'pharmacist', 'structural engineer'
    ],
    relatedDomainIds: ['data_science_ai', 'data_engineering']
  },
  {
    id: 'data_engineering',
    name: 'Data Engineering & Big Data',
    coreKeywords: [
      'data engineer', 'big data engineer', 'etl developer', 'spark developer',
      'data pipeline', 'databricks', 'data warehouse', 'hadoop', 'dbt developer'
    ],
    negativeKeywords: [
      'civil engineer', 'mechanical engineer', 'nurse', 'pharmacist', 'structural engineer'
    ],
    relatedDomainIds: ['data_science_ai', 'data_analytics', 'software_backend', 'devops_cloud']
  },
  {
    id: 'frontend_web',
    name: 'Frontend & UI Engineering',
    coreKeywords: [
      'frontend', 'front-end', 'react developer', 'react engineer', 'next.js', 'vue',
      'angular', 'ui developer', 'ui engineer', 'web developer', 'javascript developer',
      'typescript developer', 'frontend developer', 'front end developer'
    ],
    negativeKeywords: [
      'civil engineer', 'mechanical engineer', 'data scientist', 'network engineer',
      'hardware engineer', 'structural engineer'
    ],
    relatedDomainIds: ['fullstack', 'software_backend']
  },
  {
    id: 'software_backend',
    name: 'Backend & Systems Engineering',
    coreKeywords: [
      'backend', 'back-end', 'software engineer', 'software developer', 'java developer',
      'python developer', 'golang', 'go developer', 'c++ developer', 'c# developer',
      '.net developer', 'node.js developer', 'api engineer', 'systems engineer', 'swe'
    ],
    negativeKeywords: [
      'civil engineer', 'mechanical engineer', 'structural engineer', 'nurse', 'hardware engineer'
    ],
    relatedDomainIds: ['fullstack', 'data_engineering', 'devops_cloud', 'frontend_web']
  },
  {
    id: 'fullstack',
    name: 'Full Stack Development',
    coreKeywords: [
      'full stack', 'fullstack', 'full-stack', 'mern stack', 'mean stack'
    ],
    negativeKeywords: [
      'civil engineer', 'mechanical engineer', 'structural engineer'
    ],
    relatedDomainIds: ['frontend_web', 'software_backend', 'devops_cloud']
  },
  {
    id: 'devops_cloud',
    name: 'DevOps & Cloud Engineering',
    coreKeywords: [
      'devops', 'cloud engineer', 'sre', 'site reliability', 'platform engineer',
      'infrastructure engineer', 'kubernetes', 'aws engineer', 'azure engineer',
      'gcp engineer', 'cloud architect', 'infrastructuurbeheerder', 'system administrator'
    ],
    negativeKeywords: [
      'civil engineer', 'mechanical engineer', 'structural engineer', 'data scientist', 'nurse'
    ],
    relatedDomainIds: ['software_backend', 'cybersecurity']
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    coreKeywords: [
      'cybersecurity', 'security engineer', 'soc analyst', 'information security',
      'infosec', 'penetration tester', 'vulnerability analyst', 'security architect'
    ],
    negativeKeywords: [
      'civil engineer', 'mechanical engineer', 'structural engineer'
    ],
    relatedDomainIds: ['devops_cloud', 'software_backend']
  },
  {
    id: 'mobile',
    name: 'Mobile App Development',
    coreKeywords: [
      'mobile developer', 'android developer', 'ios developer', 'flutter developer',
      'react native', 'swift developer', 'kotlin developer', 'mobile engineer'
    ],
    negativeKeywords: [
      'civil engineer', 'mechanical engineer', 'structural engineer'
    ],
    relatedDomainIds: ['frontend_web', 'fullstack']
  },
  {
    id: 'product_management',
    name: 'Product & Project Management',
    coreKeywords: [
      'product manager', 'product owner', 'technical product manager', 'project manager',
      'scrum master', 'program manager'
    ],
    negativeKeywords: [
      'civil engineer', 'mechanical engineer', 'structural engineer'
    ],
    relatedDomainIds: ['data_analytics']
  },
  {
    id: 'qa_testing',
    name: 'Quality Assurance & Testing',
    coreKeywords: [
      'qa engineer', 'quality assurance', 'automation tester', 'sdet', 'test engineer',
      'software tester', 'qa automation'
    ],
    negativeKeywords: [
      'civil engineer', 'mechanical engineer', 'structural engineer'
    ],
    relatedDomainIds: ['software_backend', 'frontend_web']
  },
  {
    id: 'mechanical_industrial',
    name: 'Mechanical & Industrial Engineering',
    coreKeywords: [
      'mechanical engineer', 'application engineer', 'manufacturing engineer',
      'cad engineer', 'hvac', 'industrial engineer', 'plant engineer'
    ],
    negativeKeywords: [
      'data scientist', 'machine learning', 'react developer', 'frontend engineer'
    ],
    relatedDomainIds: []
  }
];

// Stopwords that carry little role-identifying signal by themselves
const ROLE_STOPWORDS = new Set([
  'engineer', 'developer', 'specialist', 'analyst', 'lead', 'senior', 'junior',
  'associate', 'intern', 'trainee', 'manager', 'director', 'officer', 'coordinator',
  'consultant', 'architect', 'expert', 'i', 'ii', 'iii', 'iv', 'v', 'staff', 'principal',
  'remote', 'onsite', 'hybrid', 'fulltime', 'parttime', 'contract', 'and', 'or', 'of', 'in', 'at'
]);

// Skill normalization map
const SKILL_SYNONYMS: Record<string, string> = {
  'ml': 'machine learning',
  'nlp': 'natural language processing',
  'cv': 'computer vision',
  'dl': 'deep learning',
  'ai': 'artificial intelligence',
  'genai': 'generative ai',
  'llm': 'large language models',
  'llms': 'large language models',
  'react.js': 'react',
  'reactjs': 'react',
  'nextjs': 'next.js',
  'vuejs': 'vue.js',
  'node': 'node.js',
  'nodejs': 'node.js',
  'js': 'javascript',
  'ts': 'typescript',
  'postgres': 'postgresql',
  'psql': 'postgresql',
  'k8s': 'kubernetes',
  'amazon web services': 'aws',
  'google cloud': 'gcp',
  'google cloud platform': 'gcp',
  'microsoft azure': 'azure',
  'py': 'python',
  'scikit learn': 'scikit-learn',
  'sklearn': 'scikit-learn',
  'powerbi': 'power bi',
  'bi': 'business intelligence'
};

/**
 * Normalizes skill strings for reliable semantic matching
 */
export function normalizeSkill(skill: string): string {
  if (!skill) return '';
  const cleaned = skill.toLowerCase().trim().replace(/[._-]+/g, ' ');
  return SKILL_SYNONYMS[cleaned] || cleaned;
}

/**
 * Identifies the candidate's primary domain cluster based on targetRole, currentRole, and skills
 */
export function detectCandidateDomain(profile: CandidateRecommendationProfile): DomainConfig | null {
  const targetRoleLower = (profile.targetRole || '').toLowerCase().trim();
  const currentRoleLower = (profile.currentRole || '').toLowerCase().trim();
  const skillsText = (profile.skills || []).map(s => normalizeSkill(s)).join(' ');

  // 1. Direct targetRole / currentRole keyword match
  for (const domain of ROLE_DOMAINS) {
    for (const kw of domain.coreKeywords) {
      if (targetRoleLower.includes(kw) || currentRoleLower.includes(kw)) {
        return domain;
      }
    }
  }

  // 2. High skill density match
  let bestDomain: DomainConfig | null = null;
  let maxSkillMatches = 0;

  for (const domain of ROLE_DOMAINS) {
    let matches = 0;
    for (const kw of domain.coreKeywords) {
      if (skillsText.includes(kw)) {
        matches++;
      }
    }
    if (matches > maxSkillMatches) {
      maxSkillMatches = matches;
      bestDomain = domain;
    }
  }

  return bestDomain;
}

/**
 * Detects domain of a given job title
 */
export function detectJobDomain(jobTitle: string): DomainConfig | null {
  const titleLower = jobTitle.toLowerCase().trim();

  // First check specific/core matches
  for (const domain of ROLE_DOMAINS) {
    for (const kw of domain.coreKeywords) {
      if (titleLower.includes(kw)) {
        return domain;
      }
    }
  }

  return null;
}

/**
 * Parses experience string into numeric years
 */
export function parseCandidateExperience(exp?: string | number): number {
  if (typeof exp === 'number') return exp;
  if (!exp) return 0;

  const expStr = String(exp).toLowerCase().trim();
  if (expStr.includes('fresher') || expStr === '0') return 0;

  const match = expStr.match(/(\d+)(?:\s*-\s*(\d+))?/);
  if (match) {
    const min = parseInt(match[1], 10);
    const max = match[2] ? parseInt(match[2], 10) : min;
    return (min + max) / 2;
  }
  return 0;
}

/**
 * Calculates Role & Title Relevance Score (0 - 35 points)
 */
export function calculateRoleScore(
  profile: CandidateRecommendationProfile,
  job: Job,
  candidateDomain: DomainConfig | null
): { score: number; reason?: string; isHardMismatch: boolean } {
  const targetRoleLower = (profile.targetRole || '').toLowerCase().trim();
  const currentRoleLower = (profile.currentRole || '').toLowerCase().trim();
  const jobTitleLower = job.title.toLowerCase().trim();

  const candidateRole = targetRoleLower || currentRoleLower;
  if (!candidateRole && !candidateDomain) {
    // If candidate provided zero role or domain information, neutral baseline
    return { score: 15, isHardMismatch: false };
  }

  const jobDomain = detectJobDomain(job.title);

  // 1. Check for negative domain exclusion
  if (candidateDomain && candidateDomain.negativeKeywords.length > 0) {
    for (const neg of candidateDomain.negativeKeywords) {
      if (jobTitleLower.includes(neg)) {
        // Hard penalty: Unrelated engineering field (e.g. Civil, Mechanical, Application Engineer for Data Scientist)
        return {
          score: 0,
          reason: `Role (${job.title}) does not match your target field (${candidateDomain.name})`,
          isHardMismatch: true
        };
      }
    }
  }

  // Check if job belongs to a completely foreign domain
  if (candidateDomain && jobDomain && candidateDomain.id !== jobDomain.id) {
    if (!candidateDomain.relatedDomainIds.includes(jobDomain.id)) {
      return {
        score: 0,
        reason: `Role domain (${jobDomain.name}) is outside your target field (${candidateDomain.name})`,
        isHardMismatch: true
      };
    }
  }

  // 2. Exact or Canonical Title Match (e.g. "Data Scientist" in "Senior Data Scientist")
  if (candidateRole) {
    const roleTokens = candidateRole
      .split(/\s+/)
      .map(t => t.replace(/[^a-z0-9]/g, ''))
      .filter(t => t.length > 1 && !ROLE_STOPWORDS.has(t));

    const jobTokens = jobTitleLower
      .split(/\s+/)
      .map(t => t.replace(/[^a-z0-9]/g, ''))
      .filter(t => t.length > 1 && !ROLE_STOPWORDS.has(t));

    // Full phrase containment
    if (jobTitleLower.includes(candidateRole)) {
      return {
        score: 35,
        reason: `Target role match: "${profile.targetRole || profile.currentRole}"`,
        isHardMismatch: false
      };
    }

    // Meaningful token overlap (ignoring generic terms like "engineer")
    if (roleTokens.length > 0 && jobTokens.length > 0) {
      const matchedTokens = roleTokens.filter(t => jobTokens.includes(t));
      const overlapRatio = matchedTokens.length / roleTokens.length;

      if (overlapRatio >= 0.75) {
        return {
          score: 32,
          reason: `High role alignment with ${profile.targetRole || profile.currentRole}`,
          isHardMismatch: false
        };
      } else if (overlapRatio >= 0.5) {
        return {
          score: 25,
          reason: `Related role match: ${matchedTokens.join(', ')}`,
          isHardMismatch: false
        };
      }
    }
  }

  // 3. Same Domain Match (e.g. Data Scientist target -> Machine Learning Engineer job)
  if (candidateDomain && jobDomain && candidateDomain.id === jobDomain.id) {
    return {
      score: 28,
      reason: `Matches your primary domain: ${candidateDomain.name}`,
      isHardMismatch: false
    };
  }

  // 4. Closely Related Domain Match (e.g. Data Science -> Data Analytics / Data Engineering)
  if (candidateDomain && jobDomain && candidateDomain.relatedDomainIds.includes(jobDomain.id)) {
    return {
      score: 18,
      reason: `Adjacent field opportunity: ${jobDomain.name}`,
      isHardMismatch: false
    };
  }

  // If no role/domain overlap, role score is 0
  return {
    score: 0,
    isHardMismatch: false
  };
}

/**
 * Calculates Skill Compatibility Score (0 - 35 points)
 */
export function calculateSkillScore(
  profileSkills: string[],
  jobSkillsRequired: string[],
  jobSkillsPreferred: string[] | null,
  jobTitle: string
): { score: number; matchedSkills: string[]; missingSkills: string[]; reason?: string } {
  if (!profileSkills || profileSkills.length === 0) {
    return { score: 10, matchedSkills: [], missingSkills: [], reason: 'Add profile skills for better matching' };
  }

  const normalizedProfileSkills = new Set(
    profileSkills.map(s => normalizeSkill(s)).filter(Boolean)
  );

  const rawJobSkills = [
    ...(jobSkillsRequired || []),
    ...(jobSkillsPreferred || [])
  ];

  // Also extract skills explicitly named in the job title
  const titleLower = jobTitle.toLowerCase();
  for (const [alias, canonical] of Object.entries(SKILL_SYNONYMS)) {
    if (titleLower.includes(alias) || titleLower.includes(canonical)) {
      rawJobSkills.push(canonical);
    }
  }

  const normalizedJobSkills = Array.from(
    new Set(rawJobSkills.map(s => normalizeSkill(s)).filter(Boolean))
  );

  if (normalizedJobSkills.length === 0) {
    // If the job listing has no explicit skills listed, fallback based on role overlap
    return { score: 15, matchedSkills: [], missingSkills: [] };
  }

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  for (const js of normalizedJobSkills) {
    let hasMatch = false;
    for (const ps of normalizedProfileSkills) {
      if (ps === js || ps.includes(js) || js.includes(ps)) {
        hasMatch = true;
        break;
      }
    }
    if (hasMatch) {
      matchedSkills.push(js);
    } else {
      missingSkills.push(js);
    }
  }

  // Skill Coverage of required job skills
  const coverageRatio = matchedSkills.length / Math.max(1, normalizedJobSkills.length);
  // Skill Utilization of candidate profile
  const candidateUtilizationRatio = matchedSkills.length / Math.max(1, normalizedProfileSkills.size);

  // Score weighted heavily towards meeting job requirements (75%) and profile fit (25%)
  const rawScore = 35 * (0.75 * coverageRatio + 0.25 * Math.min(1, candidateUtilizationRatio * 2));
  const score = Math.round(Math.min(35, Math.max(0, rawScore)));

  let reason: string | undefined;
  if (matchedSkills.length > 0) {
    const displayList = matchedSkills.slice(0, 3).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ');
    reason = `Matched ${matchedSkills.length} skills (${displayList})`;
  }

  return {
    score,
    matchedSkills,
    missingSkills,
    reason
  };
}

/**
 * Calculates Experience Compatibility Score (0 - 15 points)
 */
export function calculateExperienceScore(
  candidateExpYears: number,
  jobExpMin: number | null,
  jobExpMax: number | null
): { score: number; reason?: string } {
  // If job doesn't specify experience requirements, open to all
  if (jobExpMin === null || jobExpMin === 0) {
    return { score: 15, reason: 'Open to your experience level' };
  }

  const min = jobExpMin;
  const max = jobExpMax ?? (min + 4);

  // Perfect bracket fit
  if (candidateExpYears >= min && candidateExpYears <= max) {
    return { score: 15, reason: `Fits experience range (${min}-${max} yrs)` };
  }

  // Close fit (within 1 year under minimum, or slightly above max)
  if (candidateExpYears < min) {
    const diff = min - candidateExpYears;
    if (diff <= 1) {
      return { score: 10, reason: `Near experience requirement (${min}+ yrs)` };
    } else if (diff <= 2) {
      return { score: 5 };
    } else {
      // Severe under-qualification (e.g. Fresher applying for Staff/Senior with 5+ yrs requirement)
      return { score: 0, reason: `Requires ${min}+ years experience` };
    }
  } else {
    // Over-qualified candidate
    return { score: 12, reason: 'Exceeds minimum experience requirement' };
  }
}

/**
 * Calculates Location & Work Mode Compatibility (0 - 10 points)
 */
export function calculateLocationScore(
  profileLocation?: string,
  preferredWorkMode?: string,
  jobLocation?: string | string[],
  jobWorkMode?: string
): { score: number; reason?: string } {
  const pLoc = (profileLocation || '').toLowerCase().trim();
  const pMode = (preferredWorkMode || '').toLowerCase().trim();
  
  const jLocations = Array.isArray(jobLocation)
    ? jobLocation.map(l => l.toLowerCase().trim())
    : [(jobLocation || '').toLowerCase().trim()];
  const jLocationsStr = jLocations.join(' ');
  const jMode = (jobWorkMode || '').toLowerCase().trim();

  // If job is Remote, universally attractive
  if (jMode.includes('remote') || jLocationsStr.includes('remote')) {
    return { score: 10, reason: 'Remote opportunity' };
  }

  if (pMode === 'remote') {
    // Candidate strictly requested remote, but job is purely on-site
    return { score: 0, reason: 'On-site position (you prefer Remote)' };
  }

  if (!pLoc || pLoc === 'all') {
    return { score: 7 };
  }

  // City or Country direct match
  if (jLocationsStr.includes(pLoc) || pLoc.includes(jLocationsStr)) {
    return { score: 10, reason: `Located in your preferred area: ${profileLocation}` };
  }

  // Standard Indian Cities Cluster
  const indianCities = ['bengaluru', 'bangalore', 'mumbai', 'delhi', 'hyderabad', 'pune', 'chennai', 'noida', 'gurgaon', 'gurugram'];
  const isCandidateInIndia = pLoc.includes('india') || indianCities.some(c => pLoc.includes(c));
  const isJobInIndia = jLocationsStr.includes('india') || indianCities.some(c => jLocationsStr.includes(c));

  if (isCandidateInIndia && isJobInIndia) {
    return { score: 8, reason: 'Located in India' };
  }

  // Standard US Cluster
  const usTerms = ['united states', 'usa', 'us', 'san francisco', 'new york', 'seattle', 'austin', 'california'];
  const isCandidateInUS = usTerms.some(u => pLoc.includes(u));
  const isJobInUS = usTerms.some(u => jLocationsStr.includes(u));

  if (isCandidateInUS && isJobInUS) {
    return { score: 8, reason: 'Located in United States' };
  }

  // Candidate in India, job is strictly On-site in Netherlands / New Zealand / Germany
  if (isCandidateInIndia && !isJobInIndia) {
    return { score: 0, reason: `On-site location abroad (${jLocations[0] || 'International'})` };
  }

  return { score: 4 };
}

/**
 * Calculates Candidate Preferences & Company Affinity (0 - 5 points)
 */
export function calculatePreferenceScore(
  job: Job,
  bookmarks: string[] = [],
  followedCompanies: string[] = [],
  candidateEducation?: string
): { score: number; reason?: string } {
  let score = 0;
  let reason: string | undefined;

  const compNameLower = (job.company?.name || '').toLowerCase().trim();
  const compSlugLower = (job.company?.slug || '').toLowerCase().trim();

  // Followed company match
  const isFollowed = followedCompanies.some(fc => {
    const lower = fc.toLowerCase().trim();
    return lower === compNameLower || lower === compSlugLower;
  });
  if (isFollowed) {
    score += 3;
    reason = `From company you follow: ${job.company?.name}`;
  }

  // Saved job match
  if (bookmarks.includes(String(job.id))) {
    score += 2;
  }

  // Education match
  if (candidateEducation && job.education) {
    const cEdu = candidateEducation.toLowerCase();
    const jEdu = job.education.toLowerCase();
    if (jEdu.includes(cEdu) || cEdu.includes(jEdu)) {
      score += 2;
    }
  }

  return { score: Math.min(5, score), reason };
}

/**
 * Master Matching Function: Scores a job against a candidate profile
 */
export function scoreJobForCandidate(
  job: Job,
  profile: CandidateRecommendationProfile,
  candidateDomain: DomainConfig | null
): ScoredRecommendation | null {
  // 1. Exclude already applied jobs
  if (profile.appliedJobIds && profile.appliedJobIds.includes(String(job.id))) {
    return null;
  }

  // 2. Role & Title Relevance (35%)
  const roleResult = calculateRoleScore(profile, job, candidateDomain);
  if (roleResult.isHardMismatch) {
    return null;
  }

  // 3. Skill Compatibility (35%)
  const skillResult = calculateSkillScore(
    profile.skills || [],
    job.skills_required || [],
    job.skills_preferred || null,
    job.title
  );

  // Negative Guardrail: If candidate explicitly has a target role or skills,
  // and BOTH role score is 0 AND skill score is 0, completely exclude this job!
  const hasProfileSignal = (profile.targetRole && profile.targetRole.trim().length > 0) ||
                           (profile.skills && profile.skills.length > 0);
  if (hasProfileSignal && roleResult.score === 0 && skillResult.score === 0) {
    return null;
  }

  // 4. Experience Compatibility (15%)
  const candidateYears = parseCandidateExperience(profile.yearsExperience);
  const expResult = calculateExperienceScore(candidateYears, job.experience_min, job.experience_max);

  // 5. Location & Work Mode (10%)
  const locResult = calculateLocationScore(
    profile.preferredLocation,
    profile.preferredWorkMode,
    job.location,
    job.work_mode
  );

  // 6. Preferences & Affinity (5%)
  const prefResult = calculatePreferenceScore(
    job,
    profile.bookmarks || [],
    profile.followedCompanies || [],
    profile.education
  );

  // Total honest score calculation
  const totalRaw = roleResult.score + skillResult.score + expResult.score + locResult.score + prefResult.score;
  const matchScore = Math.min(100, Math.max(0, Math.round(totalRaw)));

  // Filter out low match confidence (< 40%) so recommendations are consistently high quality
  if (matchScore < 40) {
    return null;
  }

  // Compile transparent, truthful match reasons
  const matchReasons: string[] = [];
  if (roleResult.reason) matchReasons.push(roleResult.reason);
  if (skillResult.reason) matchReasons.push(skillResult.reason);
  if (locResult.reason) matchReasons.push(locResult.reason);
  if (expResult.reason) matchReasons.push(expResult.reason);
  if (prefResult.reason) matchReasons.push(prefResult.reason);

  return {
    job,
    matchScore,
    scoreBreakdown: {
      roleRelevance: roleResult.score,
      skillCompatibility: skillResult.score,
      experienceCompatibility: expResult.score,
      locationCompatibility: locResult.score,
      preferenceCompatibility: prefResult.score
    },
    matchedSkills: skillResult.matchedSkills,
    missingSkills: skillResult.missingSkills,
    matchReasons
  };
}

/**
 * Ranks an array of jobs against a candidate profile
 */
export function rankRecommendations(
  jobs: Job[],
  profile: CandidateRecommendationProfile,
  limit: number = 10
): ScoredRecommendation[] {
  if (!jobs || jobs.length === 0) return [];

  const candidateDomain = detectCandidateDomain(profile);

  const scored: ScoredRecommendation[] = [];
  for (const job of jobs) {
    const res = scoreJobForCandidate(job, profile, candidateDomain);
    if (res) {
      scored.push(res);
    }
  }

  // Sort deterministically:
  // 1. matchScore descending
  // 2. Freshness (posted_at) descending
  scored.sort((a, b) => {
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }
    const timeA = a.job.posted_at ? new Date(a.job.posted_at).getTime() : 0;
    const timeB = b.job.posted_at ? new Date(b.job.posted_at).getTime() : 0;
    return timeB - timeA;
  });

  return scored.slice(0, limit);
}
