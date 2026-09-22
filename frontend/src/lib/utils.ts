import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSalary(
  min: number | null,
  max: number | null,
  currency: string = "INR",
  period: string = "annual",
  showExpectedTag: boolean = false
): string {
  if (!min && !max) return "Competitive (Disclosed on Application)";

  const symbol = currency === "INR" ? "\u20B9" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : "$";

  const formatNumber = (num: number) => {
    if (currency === "INR") {
      if (num >= 10000000) return `${symbol}${(num / 10000000).toFixed(1)} Cr`;
      if (num >= 100000) return `${symbol}${(num / 100000).toFixed(num % 100000 === 0 ? 0 : 1)}L`;
      if (num >= 1000) return `${symbol}${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 1)}K`;
      return `${symbol}${num}`;
    } else {
      if (num >= 1000) return `${symbol}${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 0)}K`;
      return `${symbol}${num}`;
    }
  };

  const suffix = period === "annual" ? (currency === "INR" ? " LPA" : "/yr") : period === "monthly" ? "/mo" : "";

  if (min && max) {
    if (min === max) return `${formatNumber(min)}${suffix}`;
    return `${formatNumber(min)} - ${formatNumber(max)}${suffix}`;
  }

  if (min) return `${formatNumber(min)}+${suffix}`;
  return `Up to ${formatNumber(max!)}${suffix}`;
}

export function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return "";
  try {
    const d = new Date(dateString);
    // If timestamp is in the future (due to timezone differences or clock skew), clamp to "Just now"
    if (d.getTime() >= Date.now()) {
      return "Just now";
    }
    return formatDistanceToNow(d, { addSuffix: true });
  } catch {
    return "";
  }
}

export function formatDate(dateString: string | null): string {
  if (!dateString) return "";
  try {
    return format(new Date(dateString), "dd MMM yyyy");
  } catch {
    return "";
  }
}

export function getWorkModeColor(mode: string): string {
  switch (mode?.toLowerCase()) {
    case "remote":
      return "bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200";
    case "hybrid":
      return "bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200";
    case "onsite":
      return "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200";
    default:
      return "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200";
  }
}

export function getEmploymentTypeColor(type: string): string {
  switch (type?.toLowerCase()) {
    case "fulltime":
    case "full-time":
    case "full time":
      return "bg-green-100 text-green-700 hover:bg-green-200 border-green-200";
    case "internship":
      return "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200";
    case "contract":
      return "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-200";
    case "parttime":
    case "part-time":
    case "part time":
      return "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-indigo-200";
    default:
      return "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200";
  }
}

export function getRatingColor(rating: string | null): string {
  switch (rating?.toLowerCase()) {
    case "excellent":
      return "bg-green-500 text-white";
    case "good":
      return "bg-yellow-500 text-white";
    case "average":
      return "bg-orange-500 text-white";
    case "poor":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
}

const DUMMY_SKILL_SETS = new Set([
  'problem solving,software engineering,system architecture',
  'agile methodologies,software development,teamwork',
  'communication,problem solving,professional skills',
  'communication,software engineering',
  'engineering,technology',
]);

export function sanitizeJobSkills(
  skills: string[] | null | undefined,
  title: string = "",
  description: string = ""
): string[] {
  const normCurrent = Array.isArray(skills)
    ? skills.map(s => s.trim().toLowerCase()).filter(Boolean)
    : [];

  const key = normCurrent.slice().sort().join(',');
  const isGeneric = normCurrent.length === 0 || DUMMY_SKILL_SETS.has(key);

  if (!isGeneric && normCurrent.length >= 2) {
    return skills!;
  }

  const combined = ` ${title} ${description} `.toLowerCase();
  const detected: string[] = [];

  const check = (regex: RegExp, name: string) => {
    if (regex.test(combined) && !detected.includes(name)) {
      detected.push(name);
    }
  };

  // Data & Analytics
  check(/\bpython\b/, 'Python');
  check(/\b(sql|postgres|postgresql|mysql)\b/, 'SQL');
  check(/\btableau\b/, 'Tableau');
  check(/\bpower\s*bi\b/, 'Power BI');
  check(/\bexcel\b/, 'Excel');
  check(/\b(data\s+analysis|analytics)\b/, 'Data Analysis');
  check(/\b(business\s+intelligence|dashboards?)\b/, 'Business Intelligence');
  check(/\bstatistics\b/, 'Statistics');
  check(/\b(machine\s+learning|ml)\b/, 'Machine Learning');
  check(/\b(deep\s+learning|pytorch|tensorflow)\b/, 'PyTorch / ML');
  check(/\b(spark|pyspark|etl|airflow)\b/, 'ETL & Spark');

  // Engineering & Frontend
  check(/\b(react|reactjs)\b/, 'React');
  check(/\btypescript\b/, 'TypeScript');
  check(/\bjavascript\b/, 'JavaScript');
  check(/\bnext\.?js\b/, 'Next.js');
  check(/\b(node\.?js|express)\b/, 'Node.js');
  check(/\bjava\b(?!script)/, 'Java');
  check(/\b(c\+\+|cpp)\b/, 'C++');
  check(/\bc#\b/, 'C#');
  check(/\b(golang|go)\b/, 'Go');
  check(/\b(aws|amazon\s+web\s+services)\b/, 'AWS');
  check(/\b(azure)\b/, 'Azure');
  check(/\b(docker|kubernetes|k8s)\b/, 'Docker / K8s');
  check(/\b(ci[/-]cd|terraform)\b/, 'DevOps');
  check(/\b(rest\s*api|microservices)\b/, 'Microservices');

  // Delivery, Transportation & Logistics
  check(/\b(deliver\s+package|package\s+delivery|parcel|courier|amazon\s+flex)\b/, 'Package Delivery');
  check(/\b(use\s+your\s+vehicle|valid\s+driver|driving\s+license|van|truck)\b/, 'Vehicle Operation');
  check(/\b(route|navigation|gps)\b/, 'Route Navigation');
  check(/\b(cdl|commercial\s+driver|hgv)\b/, 'Commercial Driving');
  check(/\b(cargo|freight|loading|unloading)\b/, 'Freight & Cargo Handling');

  // Warehouse, Hospitality & Trades
  check(/\b(inventory|stocking|replenishment)\b/, 'Inventory Management');
  check(/\b(forklift|pallet\s+jack)\b/, 'Forklift Operation');
  check(/\b(food\s+prep|cooking|cook|meals)\b/, 'Food Preparation');
  check(/\b(culinary|chef|kitchen)\b/, 'Culinary Skills');
  check(/\b(food\s+safety|hygiene|sanitation)\b/, 'Food Safety & Hygiene');

  // Retail, Sales & Healthcare
  check(/\b(customer\s+service|customer\s+experience)\b/, 'Customer Service');
  check(/\b(cash\s+handling|cashier|pos|point\s+of\s+sale)\b/, 'Cash Handling');
  check(/\b(merchandis|planogram)\b/, 'Merchandising');
  check(/\b(patient\s+care|vital\s+signs)\b/, 'Patient Care');
  check(/\b(nursing|rn|cpr|bls)\b/, 'Clinical Care');
  check(/\b(teaching|classroom|curriculum|educator)\b/, 'Teaching & Instruction');

  // QA, Product & Roles
  check(/\b(selenium|cypress|playwright|qa)\b/, 'Test Automation');
  check(/\b(product\s+management|agile|scrum)\b/, 'Product Strategy');
  check(/\b(figma|ui\/ux)\b/, 'UI/UX Design');
  check(/\b(cybersecurity|security)\b/, 'Cybersecurity');
  check(/\b(technical\s+support|troubleshooting)\b/, 'Technical Support');

  // Role fallbacks
  if (detected.length < 3) {
    const t = title.toLowerCase();
    if (/driver|delivery|van|truck|courier|cargo|flex/.test(t)) {
      ['Package Delivery', 'Vehicle Operation', 'Route Navigation', 'Time Management'].forEach(s => {
        if (!detected.includes(s) && detected.length < 4) detected.push(s);
      });
    } else if (/cook|chef|kitchen|culinary|food/.test(t)) {
      ['Food Preparation', 'Food Safety & Hygiene', 'Kitchen Operations'].forEach(s => {
        if (!detected.includes(s) && detected.length < 4) detected.push(s);
      });
    } else if (/warehouse|forklift|stocker|material\s+handler/.test(t)) {
      ['Inventory Management', 'Order Fulfillment', 'Safety Compliance'].forEach(s => {
        if (!detected.includes(s) && detected.length < 4) detected.push(s);
      });
    } else if (/merchandis|retail|cashier|store\s+associate/.test(t)) {
      ['Customer Service', 'Merchandising', 'Cash Handling'].forEach(s => {
        if (!detected.includes(s) && detected.length < 4) detected.push(s);
      });
    } else if (/nurse|patient\s+care|healthcare|dental/.test(t)) {
      ['Patient Care', 'Clinical Support', 'Customer Service'].forEach(s => {
        if (!detected.includes(s) && detected.length < 4) detected.push(s);
      });
    } else if (/teacher|educator|instructor|tutor/.test(t)) {
      ['Teaching & Instruction', 'Curriculum Planning', 'Student Mentoring'].forEach(s => {
        if (!detected.includes(s) && detected.length < 4) detected.push(s);
      });
    } else if (/analyst|business\s+intelligence|data\s+analytics/.test(t)) {
      ['SQL', 'Python', 'Tableau', 'Excel', 'Data Analysis'].forEach(s => {
        if (!detected.includes(s) && detected.length < 4) detected.push(s);
      });
    } else if (/data\s+scientist|machine\s+learning/.test(t)) {
      ['Python', 'Machine Learning', 'SQL', 'Statistics'].forEach(s => {
        if (!detected.includes(s) && detected.length < 4) detected.push(s);
      });
    } else if (/frontend|react|web\s+developer/.test(t)) {
      ['React', 'TypeScript', 'JavaScript', 'HTML/CSS'].forEach(s => {
        if (!detected.includes(s) && detected.length < 4) detected.push(s);
      });
    } else if (/backend|api|server/.test(t)) {
      ['Python', 'Node.js', 'REST APIs', 'SQL', 'Docker'].forEach(s => {
        if (!detected.includes(s) && detected.length < 4) detected.push(s);
      });
    } else if (/devops|sre|cloud|infra/.test(t)) {
      ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux'].forEach(s => {
        if (!detected.includes(s) && detected.length < 4) detected.push(s);
      });
    } else if (/support|it\s+support/.test(t)) {
      ['Technical Support', 'Troubleshooting', 'Linux', 'SQL'].forEach(s => {
        if (!detected.includes(s) && detected.length < 4) detected.push(s);
      });
    } else if (/software|engineer|developer|sde|programmer/.test(t)) {
      ['Software Engineering', 'Problem Solving', 'System Design'].forEach(s => {
        if (!detected.includes(s) && detected.length < 3) detected.push(s);
      });
    } else {
      ['Customer Service', 'Communication', 'Operational Excellence'].forEach(s => {
        if (!detected.includes(s) && detected.length < 3) detected.push(s);
      });
    }
  }

  return detected.slice(0, 5);
}

export function cleanHtmlDescription(rawHtml?: string | null, rawText?: string | null): string {
  let content = (rawHtml || rawText || "").trim();
  if (!content) return "";

  // Decode HTML entities if escaped (&lt;h2&gt; -> <h2>, etc.)
  for (let i = 0; i < 3; i++) {
    if (
      content.includes('&lt;') ||
      content.includes('&gt;') ||
      content.includes('&quot;') ||
      content.includes('&#39;') ||
      content.includes('&amp;') ||
      content.includes('&nbsp;')
    ) {
      content = content
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&#x27;/g, "'")
        .replace(/&#x2F;/g, '/')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&');
    } else {
      break;
    }
  }

  // If content does not contain HTML markup, format plain text into clean paragraphs
  if (!/<[a-z][\s\S]*>/i.test(content)) {
    return content
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(Boolean)
      .map(p => `<p class="mb-4">${p.replace(/\n/g, '<br/>')}</p>`)
      .join('');
  }

  return content;
}

/**
 * Infers a country flag emoji from a job's location array.
 * Returns the most specific match found, or empty string if unknown.
 */
export function getCountryFlag(locations: string[]): string {
  if (!locations || locations.length === 0) return '';
  const text = locations.join(' ').toLowerCase();

  if (/\b(india|bengaluru|bangalore|blr|pune|hyderabad|mumbai|delhi|noida|gurgaon|gurugram|chennai|kolkata|ahmedabad|karnataka|maharashtra|tamil\s*nadu|telangana|andhra|gujarat|rajasthan|kerala|lucknow|chandigarh)\b/.test(text)) return '🇮🇳';
  if (/\b(united\s*states|usa|u\.s\.?|san\s*francisco|new\s*york|nyc|seattle|austin|chicago|boston|los\s*angeles|california|texas|washington|colorado|denver|atlanta|silicon\s*valley|sunnyvale|menlo\s*park|palo\s*alto|mountain\s*view|us\s*remote|remote\s*us)\b/.test(text)) return '🇺🇸';
  if (/\b(united\s*kingdom|uk|u\.k\.?|london|manchester|edinburgh|bristol|birmingham|glasgow|leeds|liverpool)\b/.test(text)) return '🇬🇧';
  if (/\b(germany|deutschland|berlin|munich|münchen|frankfurt|hamburg|cologne|stuttgart|düsseldorf|karlsruhe)\b/.test(text)) return '🇩🇪';
  if (/\b(canada|toronto|vancouver|montreal|ottawa|calgary|waterloo|quebec)\b/.test(text)) return '🇨🇦';
  if (/\b(australia|sydney|melbourne|brisbane|perth|canberra|adelaide)\b/.test(text)) return '🇦🇺';
  if (/\b(singapore|sg\b)/.test(text)) return '🇸🇬';
  if (/\b(ireland|dublin|cork|galway|limerick)\b/.test(text)) return '🇮🇪';
  if (/\b(france|paris|lyon|marseille|toulouse|nice|nantes|bordeaux)\b/.test(text)) return '🇫🇷';
  if (/\b(japan|tokyo|osaka|kyoto|yokohama)\b/.test(text)) return '🇯🇵';
  if (/\b(netherlands|amsterdam|rotterdam|utrecht|eindhoven|hague)\b/.test(text)) return '🇳🇱';
  if (/\b(united\s*arab\s*emirates|uae|dubai|abu\s*dhabi)\b/.test(text)) return '🇦🇪';
  if (/\b(switzerland|zurich|geneva|basel|lausanne|bern)\b/.test(text)) return '🇨🇭';
  if (/\b(sweden|stockholm|gothenburg|malmo)\b/.test(text)) return '🇸🇪';
  if (/\b(poland|warsaw|krakow|wroclaw|gdansk|poznan)\b/.test(text)) return '🇵🇱';
  if (/\b(spain|madrid|barcelona|valencia|seville|malaga)\b/.test(text)) return '🇪🇸';
  if (/\b(italy|milan|rome|turin|florence|bologna)\b/.test(text)) return '🇮🇹';
  if (/\b(brazil|são\s*paulo|sao\s*paulo|rio\s*de\s*janeiro)\b/.test(text)) return '🇧🇷';
  if (/\b(mexico|mexico\s*city|guadalajara|monterrey)\b/.test(text)) return '🇲🇽';
  if (/\b(remote|worldwide|global|anywhere)\b/.test(text)) return '🌍';
  return '';
}

/**
 * Infers the ATS/source name from a job URL domain.
 * Returns a short human-readable source name or empty string.
 */
export function inferAtsSource(url?: string | null): string {
  if (!url) return '';
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    if (hostname.includes('greenhouse.io')) return 'Greenhouse';
    if (hostname.includes('lever.co')) return 'Lever';
    if (hostname.includes('ashbyhq.com')) return 'Ashby';
    if (hostname.includes('myworkdayjobs.com') || hostname.includes('workday.com')) return 'Workday';
    if (hostname.includes('smartrecruiters.com')) return 'SmartRecruiters';
    if (hostname.includes('workable.com')) return 'Workable';
    if (hostname.includes('teamtailor.com')) return 'Teamtailor';
    if (hostname.includes('jobvite.com')) return 'Jobvite';
    if (hostname.includes('icims.com')) return 'iCIMS';
    if (hostname.includes('taleo.net') || hostname.includes('oraclecloud.com')) return 'Oracle Taleo';
    if (hostname.includes('successfactors.com') || hostname.includes('sap.com')) return 'SAP SuccessFactors';
    if (hostname.includes('linkedin.com')) return 'LinkedIn';
    if (hostname.includes('indeed.com')) return 'Indeed';
    if (hostname.includes('naukri.com')) return 'Naukri';
    return '';
  } catch {
    return '';
  }
}
