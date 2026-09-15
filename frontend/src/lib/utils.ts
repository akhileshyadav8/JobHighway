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
  if (!min && !max) return "₹8 - 16 LPA (Expected CTC)";

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
  const tag = showExpectedTag ? " (Expected CTC)" : "";

  if (min && max) {
    if (min === max) return `${formatNumber(min)}${suffix}${tag}`;
    return `${formatNumber(min)} - ${formatNumber(max)}${suffix}${tag}`;
  }

  if (min) return `${formatNumber(min)}+${suffix}${tag}`;
  return `Up to ${formatNumber(max!)}${suffix}${tag}`;
}

export function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return "";
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
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

  // QA, Product & Roles
  check(/\b(selenium|cypress|playwright|qa)\b/, 'Test Automation');
  check(/\b(product\s+management|agile|scrum)\b/, 'Product Strategy');
  check(/\b(figma|ui\/ux)\b/, 'UI/UX Design');
  check(/\b(cybersecurity|security)\b/, 'Cybersecurity');
  check(/\b(technical\s+support|troubleshooting)\b/, 'Technical Support');

  // Role fallbacks
  if (detected.length < 3) {
    const t = title.toLowerCase();
    if (/analyst|business\s+intelligence|data\s+analytics/.test(t)) {
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
    } else {
      ['Software Development', 'Problem Solving', 'Communication'].forEach(s => {
        if (!detected.includes(s) && detected.length < 3) detected.push(s);
      });
    }
  }

  return detected.slice(0, 5);
}
