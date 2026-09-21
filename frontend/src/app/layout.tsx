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
  title: "JobPulse | Real-Time Job Discovery",
  description: "Discover jobs minutes after they're posted. We monitor 1000+ company career pages every 10 minutes. Never miss a fresh opportunity again.",
  icons: {
    icon: [
      { url: '/icon.png' },
      { url: '/logo.png' }
    ],
    apple: [
      { url: '/icon.png' }
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
