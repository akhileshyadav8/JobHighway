import realJobsJson from './real_jobs.json';

export const mockCompanies = [
  {
    id: 101,
    name: "Google",
    slug: "google",
    website: "https://google.com",
    careers_url: "https://careers.google.com",
    logo_url: "/logos/google.svg",
    industry: "Tech",
    headquarters: "Mountain View, United States",
    employee_count_range: "10,001+",
    description: "Build for everyone. Google's mission is to organize the world's information and make it universally accessible and useful.",
    active_job_count: 1248
  },
  {
    id: 102,
    name: "Microsoft",
    slug: "microsoft",
    website: "https://microsoft.com",
    careers_url: "https://careers.microsoft.com",
    logo_url: "/logos/microsoft.svg",
    industry: "Tech",
    headquarters: "Redmond, United States",
    employee_count_range: "10,001+",
    description: "Empowering every person and every organization to achieve more through technology.",
    active_job_count: 982
  },
  {
    id: 103,
    name: "Amazon",
    slug: "amazon",
    website: "https://amazon.com",
    careers_url: "https://amazon.jobs",
    logo_url: "/logos/amazon.svg",
    industry: "E-commerce",
    headquarters: "Seattle, United States",
    employee_count_range: "10,001+",
    description: "To be Earth's most customer-centric company, where people can find and discover anything they might want to buy online.",
    active_job_count: 1562
  },
  {
    id: 104,
    name: "Meta",
    slug: "meta",
    website: "https://about.meta.com",
    careers_url: "https://metacareers.com",
    logo_url: "/logos/meta.svg",
    industry: "Tech",
    headquarters: "Menlo Park, United States",
    employee_count_range: "10,001+",
    description: "Build the next evolution of human connection and the technologies that make it possible.",
    active_job_count: 843
  },
  {
    id: 105,
    name: "Netflix",
    slug: "netflix",
    website: "https://netflix.com",
    careers_url: "https://jobs.netflix.com",
    logo_url: "/logos/netflix.svg",
    industry: "Tech",
    headquarters: "Los Gatos, United States",
    employee_count_range: "5,001–10,000",
    description: "Entertain the world with amazing stories while building a more inclusive and connected global community.",
    active_job_count: 421
  },
  {
    id: 106,
    name: "Apple",
    slug: "apple",
    website: "https://apple.com",
    careers_url: "https://jobs.apple.com",
    logo_url: "/logos/apple.svg",
    industry: "Consumer Electronics",
    headquarters: "Cupertino, United States",
    employee_count_range: "10,001+",
    description: "Making the best products on earth and leaving the world better than we found it.",
    active_job_count: 612
  },
  {
    id: 107,
    name: "Adobe",
    slug: "adobe",
    website: "https://adobe.com",
    careers_url: "https://adobe.wd5.myworkdayjobs.com",
    logo_url: null,
    industry: "Software",
    headquarters: "San Jose, United States",
    employee_count_range: "10,001+",
    description: "Changing the world through digital experiences that empower everyone.",
    active_job_count: 398
  },
  {
    id: 108,
    name: "Spotify",
    slug: "spotify",
    website: "https://spotify.com",
    careers_url: "https://lifeatspotify.com",
    logo_url: null,
    industry: "Tech",
    headquarters: "Stockholm, Sweden",
    employee_count_range: "5,001–10,000",
    description: "Unlock the potential of human creativity — by giving a million creative artists the opportunity to live off their art.",
    active_job_count: 286
  },
  {
    id: 109,
    name: "Tesla",
    slug: "tesla",
    website: "https://tesla.com",
    careers_url: "https://tesla.com/careers",
    logo_url: null,
    industry: "Automotive",
    headquarters: "Austin, United States",
    employee_count_range: "10,001+",
    description: "Accelerating the world's transition to sustainable energy.",
    active_job_count: 514
  },
  {
    id: 110,
    name: "Airbnb",
    slug: "airbnb",
    website: "https://airbnb.com",
    careers_url: "https://careers.airbnb.com",
    logo_url: null,
    industry: "Hospitality",
    headquarters: "San Francisco, United States",
    employee_count_range: "5,001–10,000",
    description: "Create a world where anyone can belong anywhere.",
    active_job_count: 312
  },
  {
    id: 111,
    name: "Salesforce",
    slug: "salesforce",
    website: "https://salesforce.com",
    careers_url: "https://salesforce.com/careers",
    logo_url: null,
    industry: "Software",
    headquarters: "San Francisco, United States",
    employee_count_range: "10,001+",
    description: "We bring companies and customers together on the world's #1 CRM.",
    active_job_count: 467
  },
  {
    id: 112,
    name: "Uber",
    slug: "uber",
    website: "https://uber.com",
    careers_url: "https://uber.com/careers",
    logo_url: null,
    industry: "Transportation",
    headquarters: "San Francisco, United States",
    employee_count_range: "10,001+",
    description: "We reimagine the way the world moves for the better.",
    active_job_count: 389
  },
  {
    id: 1,
    name: "Postman",
    slug: "postman",
    website: "https://www.postman.com",
    careers_url: "https://job-boards.greenhouse.io/postman",
    logo_url: null,
    industry: "Developer Tools & API",
    headquarters: "Bengaluru, India / San Francisco",
    employee_count_range: "1,000–5,000",
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
    employee_count_range: "1,000–5,000",
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
    employee_count_range: "10,001+",
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
    employee_count_range: "1,000–5,000",
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
    employee_count_range: "5,001–10,000",
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
    employee_count_range: "5,001–10,000",
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
    employee_count_range: "1,000–5,000",
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
    employee_count_range: "10,001+",
    description: "Thoughtworks is a leading global technology consultancy that integrates strategy, design and software engineering to drive business transformation.",
    active_job_count: 33
  }
];

// Ensure jobs are within 14 days and sorted by posted_at descending
const now = new Date().getTime();
const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;

export const mockJobs = (realJobsJson as any[])
  .filter(j => {
    const postTime = j.posted_at ? new Date(j.posted_at).getTime() : (j.first_seen_at ? new Date(j.first_seen_at).getTime() : 0);
    if (!postTime || isNaN(postTime)) return false;
    return (now - postTime) <= FOURTEEN_DAYS_MS && postTime <= (now + 86400000);
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
