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
  title: "JobHighway | Pathways to Professional Success — Hourly Official ATS Jobs",
  description: "JobHighway indexes jobs directly from 19,000+ official company ATS career portals every hour — delivering verified opportunities days before generic job aggregators. Zero recruiter spam.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
