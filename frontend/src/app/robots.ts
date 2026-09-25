import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://jobhighway.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/mastermindak",
          "/mastermindak/*",
          "/api/*",
          "/auth/*",
          "/dashboard",
          "/dashboard/*",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/mastermindak",
          "/mastermindak/*",
          "/api/*",
          "/auth/*",
          "/dashboard",
          "/dashboard/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
