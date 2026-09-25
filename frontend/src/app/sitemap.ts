import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/blog_articles";
import { getPool } from "@/lib/db";

export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://jobhighway.vercel.app";
  const now = new Date();

  // Core static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "always",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/companies`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/prepare`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/ats-policy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Blog articles
  const blogArticles = getAllArticles();
  const blogRoutes: MetadataRoute.Sitemap = blogArticles.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: new Date(article.date || now),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Dynamic jobs and companies from Database
  const dynamicRoutes: MetadataRoute.Sitemap = [];
  try {
    const pool = getPool();
    if (pool) {
      // Fetch top 1000 recent active jobs
      const jobsResult = await pool.query(`
        SELECT slug, updated_at, posted_at 
        FROM jobs 
        WHERE (status = 'active' OR status IS NULL) AND slug IS NOT NULL AND slug != ''
        ORDER BY posted_at DESC NULLS LAST 
        LIMIT 1000
      `);

      for (const row of jobsResult.rows) {
        dynamicRoutes.push({
          url: `${baseUrl}/jobs/${row.slug}`,
          lastModified: new Date(row.updated_at || row.posted_at || now),
          changeFrequency: "daily" as const,
          priority: 0.75,
        });
      }

      // Fetch active companies
      const companiesResult = await pool.query(`
        SELECT slug, updated_at 
        FROM companies 
        WHERE slug IS NOT NULL AND slug != ''
        ORDER BY name ASC 
        LIMIT 500
      `);

      for (const row of companiesResult.rows) {
        dynamicRoutes.push({
          url: `${baseUrl}/companies/${row.slug}`,
          lastModified: new Date(row.updated_at || now),
          changeFrequency: "weekly" as const,
          priority: 0.7,
        });
      }
    }
  } catch (err) {
    console.error("Failed to query dynamic sitemap items:", err);
  }

  return [...staticRoutes, ...blogRoutes, ...dynamicRoutes];
}
