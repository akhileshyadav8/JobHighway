import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { NavigationProgressBar } from "@/components/layout/NavigationProgressBar";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://jobhighway.vercel.app"),
  title: {
    default: "JobHighway | Pathways to Professional Success — Official ATS Job Discovery",
    template: "%s | JobHighway",
  },
  description: "JobHighway indexes 67,000+ verified tech jobs directly from 19,000+ official company ATS career portals (Workday, Greenhouse, Lever, Ashby, SmartRecruiters) every hour. Zero recruiter spam, direct company applications.",
  keywords: [
    "direct ATS jobs",
    "software engineer jobs",
    "data scientist jobs",
    "data analyst jobs",
    "greenhouse jobs",
    "lever jobs",
    "ashby jobs",
    "workday tech jobs",
    "off campus hiring 2026",
    "fresher software engineer jobs",
    "remote tech jobs",
    "tech interview preparation",
    "system design interview questions",
    "career preparation",
    "resume scanner",
    "skill gap analysis"
  ],
  authors: [{ name: "JobHighway", url: "https://jobhighway.vercel.app" }],
  creator: "JobHighway",
  publisher: "JobHighway",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "JobHighway | Direct Official ATS Tech Job Search Engine",
    description: "Browse 67,000+ verified active jobs synced directly from official company applicant tracking systems every hour. 100% direct company links with zero middlemen.",
    url: "https://jobhighway.vercel.app",
    siteName: "JobHighway",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "JobHighway — Direct ATS Job Discovery & Career Preparation Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JobHighway | Direct Official ATS Tech Job Search Engine",
    description: "Direct ATS tech jobs, role-based career interview prep, and instant resume skill matching. Updated hourly.",
    images: ["/og-image.png"],
    creator: "@jobhighway",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico?v=2' },
      { url: '/icon.png?v=2', type: 'image/png' },
      { url: '/logo.png?v=2', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-icon.png?v=2' }
    ],
  },
};

const jsonLdWebsite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "JobHighway",
  "url": "https://jobhighway.vercel.app",
  "description": "Pathways to Professional Success — Hourly Official ATS Job Discovery",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://jobhighway.vercel.app/jobs?search={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

const jsonLdOrg = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "JobHighway",
  "url": "https://jobhighway.vercel.app",
  "logo": "https://jobhighway.vercel.app/logo.png",
  "sameAs": [
    "https://github.com/akhileshyadav8/JobHighway"
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-slate-50 text-slate-900 flex flex-col`}>
        <Suspense fallback={null}>
          <NavigationProgressBar />
        </Suspense>
        <Navbar />
        <main className="flex-1 animate-in fade-in-50 duration-200">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
