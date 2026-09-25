import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Career Guides, ATS Strategies & Tech Hiring Insights",
  description: "Comprehensive guides on cracking tech hiring, ATS optimization (Greenhouse, Lever, Workday), interview preparation roadmaps, and salary negotiation strategies.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "JobHighway Career Guides & ATS Insights",
    description: "In-depth playbooks for software engineers, data scientists, and analysts on navigating modern tech recruitment.",
    url: "https://jobhighway.vercel.app/blog",
    siteName: "JobHighway",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
