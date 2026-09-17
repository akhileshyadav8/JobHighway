import realJobsJson from './real_jobs.json';

export const mockCompanies = [
  {
    id: 1,
    name: "Postman",
    slug: "postman",
    website: "https://www.postman.com",
    careers_url: "https://job-boards.greenhouse.io/postman",
    logo_url: null,
    industry: "Developer Tools & API",
    headquarters: "Bengaluru, India / San Francisco",
    employee_count_range: "1000-5000",
    description: "Postman is the world's leading API platform, used by more than 30 million developers and 500,000 organizations worldwide to build, test, and collaborate on APIs.",
    active_job_count: 67
  },
  {
    id: 2,
    name: "Groww",
    slug: "groww",
    website: "https://groww.in",
    careers_url: "https://job-boards.eu.greenhouse.io/groww",
    logo_url: null,
    industry: "Fintech & Investing",
    headquarters: "Bengaluru, India",
    employee_count_range: "1000-5000",
    description: "Groww is India's premier investment platform, democratizing wealth creation through stocks, mutual funds, futures, and credit products.",
    active_job_count: 7
  },
  {
    id: 3,
    name: "Cloudflare",
    slug: "cloudflare",
    website: "https://www.cloudflare.com",
    careers_url: "https://boards.greenhouse.io/cloudflare",
    logo_url: null,
    industry: "Cloud & Cybersecurity",
    headquarters: "Bengaluru, India / Global",
    employee_count_range: "10000+",
    description: "Cloudflare is a global cloud platform providing cybersecurity, CDN, DNS, and serverless compute powering a significant portion of the internet.",
    active_job_count: 351
  },
  {
    id: 4,
    name: "GitLab",
    slug: "gitlab",
    website: "https://about.gitlab.com",
    careers_url: "https://job-boards.greenhouse.io/gitlab",
    logo_url: null,
    industry: "DevOps & Cloud",
    headquarters: "Remote (Global)",
    employee_count_range: "1000-5000",
    description: "GitLab is the most comprehensive DevSecOps platform delivered as a single application, pioneer in all-remote engineering culture.",
    active_job_count: 230
  },
  {
    id: 5,
    name: "Stripe",
    slug: "stripe",
    website: "https://stripe.com",
    careers_url: "https://stripe.com/jobs",
    logo_url: null,
    industry: "Financial Infrastructure",
    headquarters: "Bengaluru, India / Global",
    employee_count_range: "5000-10000",
    description: "Stripe builds economic infrastructure for the internet, enabling startups to global enterprises to accept payments and manage transactions.",
    active_job_count: 618
  },
  {
    id: 6,
    name: "MongoDB",
    slug: "mongodb",
    website: "https://www.mongodb.com",
    careers_url: "https://www.mongodb.com/careers",
    logo_url: null,
    industry: "Database & Cloud Software",
    headquarters: "Bengaluru / Gurugram, India",
    employee_count_range: "5000-10000",
    description: "MongoDB empowers innovators to create and modernize applications with the industry's premier developer data platform.",
    active_job_count: 403
  },
  {
    id: 7,
    name: "Druva",
    slug: "druva",
    website: "https://www.druva.com",
    careers_url: "https://www.druva.com/why-druva/explore/careers",
    logo_url: null,
    industry: "Cloud Data Protection",
    headquarters: "Pune, India",
    employee_count_range: "1000-5000",
    description: "Druva enables cyber, data and operational resilience for thousands of businesses globally via its fully managed SaaS platform.",
    active_job_count: 38
  },
  {
    id: 8,
    name: "Thoughtworks",
    slug: "thoughtworks",
    website: "https://www.thoughtworks.com",
    careers_url: "https://www.thoughtworks.com/careers",
    logo_url: null,
    industry: "Technology Consultancy",
    headquarters: "Bengaluru / Pune / Hyderabad",
    employee_count_range: "10000+",
    description: "Thoughtworks is a leading global technology consultancy that integrates strategy, design and software engineering to drive business transformation.",
    active_job_count: 33
  }
];

// Ensure jobs are within last 1 month (30 days) and sorted by posted_at descending
const now = new Date().getTime();
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export const mockJobs = (realJobsJson as any[])
  .filter(j => {
    const postTime = j.posted_at ? new Date(j.posted_at).getTime() : (j.first_seen_at ? new Date(j.first_seen_at).getTime() : 0);
    if (!postTime || isNaN(postTime)) return false;
    return (now - postTime) <= THIRTY_DAYS_MS && postTime <= (now + 86400000);
  })
  .sort((a, b) => {
    const timeA = a.posted_at ? new Date(a.posted_at).getTime() : 0;
    const timeB = b.posted_at ? new Date(b.posted_at).getTime() : 0;
    return timeB - timeA;
  })
  .map(j => ({
    ...j,
    description_html: "",
    description_text: j.description_text ? j.description_text.slice(0, 160) : ""
  }));

export function getMockJobBySlug(slug: string) {
  return (realJobsJson as any[]).find(j => j.slug === slug);
}

export const mockStats = {
  total_jobs: 1746,
  total_companies: 420,
  new_today: 64,
  new_this_hour: 18,
  last_updated: new Date().toISOString()
};
