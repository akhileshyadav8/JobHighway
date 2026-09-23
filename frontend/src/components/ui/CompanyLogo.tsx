"use client";

import React, { useState } from "react";

interface CompanyLogoProps {
  name: string;
  website?: string | null;
  slug?: string | null;
  logoUrl?: string | null;
  domain?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const KNOWN_DOMAINS: Record<string, string> = {
  google: "google.com",
  microsoft: "microsoft.com",
  amazon: "amazon.com",
  apple: "apple.com",
  meta: "meta.com",
  facebook: "meta.com",
  netflix: "netflix.com",
  stripe: "stripe.com",
  openai: "openai.com",
  adobe: "adobe.com",
  airbnb: "airbnb.com",
  uber: "uber.com",
  spotify: "spotify.com",
  salesforce: "salesforce.com",
  atlassian: "atlassian.com",
  bytedance: "bytedance.com",
  oracle: "oracle.com",
  cisco: "cisco.com",
  ibm: "ibm.com",
  nvidia: "nvidia.com",
  intel: "intel.com",
  twitter: "x.com",
  x: "x.com",
  linkedin: "linkedin.com",
  shopify: "shopify.com",
  dropbox: "dropbox.com",
  slack: "slack.com",
  zoom: "zoom.us",
  github: "github.com",
  gitlab: "gitlab.com",
  datadog: "datadoghq.com",
  snowflake: "snowflake.com",
  palantir: "palantir.com",
  coinbase: "coinbase.com",
  robinhood: "robinhood.com",
  square: "squareup.com",
  block: "block.xyz",
  pinterest: "pinterest.com",
  snap: "snap.com",
  lyft: "lyft.com",
  doordash: "doordash.com",
  instacart: "instacart.com",
  adecco: "adecco.com",
  superprof: "superprof.com",
  domestiko: "domestiko.com"
};

const COLOR_MAP: Record<string, string> = {
  A: "bg-rose-50 text-rose-700",
  B: "bg-blue-50 text-blue-700",
  C: "bg-indigo-50 text-indigo-700",
  D: "bg-purple-50 text-purple-700",
  E: "bg-emerald-50 text-emerald-700",
  F: "bg-teal-50 text-teal-700",
  G: "bg-sky-50 text-sky-700",
  H: "bg-cyan-50 text-cyan-700",
  I: "bg-violet-50 text-violet-700",
  J: "bg-amber-50 text-amber-700",
  K: "bg-orange-50 text-orange-700",
  L: "bg-pink-50 text-pink-700",
  M: "bg-red-50 text-red-700",
  N: "bg-fuchsia-50 text-fuchsia-700",
  O: "bg-blue-50 text-blue-700",
  P: "bg-emerald-50 text-emerald-700",
  Q: "bg-teal-50 text-teal-700",
  R: "bg-rose-50 text-rose-700",
  S: "bg-emerald-50 text-emerald-700",
  T: "bg-sky-50 text-sky-700",
  U: "bg-indigo-50 text-indigo-700",
  V: "bg-purple-50 text-purple-700",
  W: "bg-teal-50 text-teal-700",
  X: "bg-slate-100 text-slate-800",
  Y: "bg-amber-50 text-amber-700",
  Z: "bg-blue-50 text-blue-700",
};

export const VECTOR_LOGOS: Record<string, React.ReactNode> = {
  google: (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  ),
  microsoft: (
    <svg viewBox="0 0 72 72" className="w-full h-full">
      <rect fill="#F25022" width="34.2" height="34.2"/>
      <rect x="37.8" fill="#7FBA00" width="34.2" height="34.2"/>
      <rect y="37.8" fill="#00A4EF" width="34.2" height="34.2"/>
      <rect x="37.8" y="37.8" fill="#FFB900" width="34.2" height="34.2"/>
    </svg>
  ),
  amazon: (
    <svg viewBox="0 0 256 260" className="w-full h-full">
      <path d="m150.7 108.1c0 13.1.3 24.1-6.3 35.8-5.4 9.5-13.9 15.3-23.3 15.3-13 0-20.5-9.9-20.5-24.4 0-28.8 25.8-34 50.1-34zm34 82.2c-2.2 2-5.5 2.1-8 .8-11.2-9.3-13.2-13.6-19.4-22.5-18.5 18.9-31.6 24.5-55.6 24.5-28.4 0-50.5-17.5-50.5-52.6 0-27.4 14.9-46 36-55.1 18.3-8.1 43.9-9.5 63.4-11.7v-4.4c0-8 .6-17.5-4.1-24.4-4.1-6.2-12-8.8-18.9-8.8-12.9 0-24.3 6.6-27.1 20.3-.6 3-2.8 6-5.8 6.2l-32.7-3.5c-2.8-.6-5.8-2.8-5-7.1 7.5-39.7 43.4-51.6 75.4-51.6 16.4 0 37.9 4.4 50.8 16.8 16.4 15.3 14.8 35.8 14.8 58v52.6c0 15.8 6.5 22.7 12.7 31.3 2.2 3 2.7 6.7-.1 9-6.9 5.7-19.1 16.4-25.9 22.4l-.1-.1z" fill="#111827"/>
      <path d="m221.5 210.3c-105.2 50.1-170.5 8.2-212.4-17.3-2.6-1.6-7 .4-3.2 4.8 13.9 16.9 59.6 57.6 119.2 57.6 59.6 0 95.1-32.5 99.5-38.2 4.4-5.6 1.3-8.7-3.1-6.9zm29.6-16.3c-2.8-3.7-17.2-4.4-26.2-3.3-9.1 1.1-22.6 6.6-21.5 9.9.6 1.2 1.8.7 8.1.1 6.2-.6 23.7-2.8 27.3 1.9 3.7 4.8-5.6 27.6-7.3 31.3-1.6 3.7.6 4.6 3.7 2.2 3-2.5 8.5-8.8 12.1-17.8 3.6-9 5.9-21.6 3.8-24.3z" fill="#FF9900"/>
    </svg>
  ),
  apple: (
    <svg viewBox="0 0 170 170" className="w-full h-full" fill="#000000">
      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.69-7.85-11.97-14.42-6.42-9.78-11.16-20.98-14.23-33.6-3.07-12.63-4.61-24.3-4.61-35.02 0-18.15 4.61-32.96 13.83-44.42 9.22-11.47 20.89-17.38 35.02-17.75 5.09 0 10.66 1.3 16.71 3.91 6.05 2.61 10.01 4 11.89 4.16 1.57-.16 5.67-1.58 12.3-4.27 6.63-2.69 12.44-3.9 17.43-3.62 13.06.66 23.83 5.48 32.32 14.46-11.36 6.87-16.92 16.5-16.71 28.89.21 9.87 4.09 18.25 11.64 25.13 7.55 6.88 16.48 10.74 26.8 11.58-2.28 6.94-5.22 14.19-8.81 21.75zM119.22 31.84c0-7.39 2.66-14.36 7.97-20.92 5.31-6.55 11.91-10.42 19.8-11.61.11 1.09.16 2.06.16 2.92 0 7.39-2.77 14.47-8.31 21.25-5.54 6.78-12.38 10.66-20.52 11.64-.22-1.08-.32-2.17-.32-3.28z"/>
    </svg>
  ),
  meta: (
    <svg viewBox="0 0 260 191" className="w-full h-full">
      <defs>
        <linearGradient id="metaGrad1" x1="61" y1="117" x2="259" y2="127" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0064e1" offset="0"/>
          <stop stopColor="#0064e1" offset="0.4"/>
          <stop stopColor="#0073ee" offset="0.83"/>
          <stop stopColor="#0082fb" offset="1"/>
        </linearGradient>
        <linearGradient id="metaGrad2" x1="45" y1="139" x2="45" y2="66" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0082fb" offset="0"/>
          <stop stopColor="#0064e0" offset="1"/>
        </linearGradient>
      </defs>
      <path fill="#0081fb" d="m31.06 125.96c0 10.98 2.41 19.41 5.56 24.51 4.13 6.68 10.29 9.51 16.57 9.51 8.1 0 15.51-2.01 29.79-21.76 11.44-15.83 24.92-38.05 33.99-51.98l15.36-23.6c10.67-16.39 23.02-34.61 37.18-46.96 11.56-10.08 24.03-15.68 36.58-15.68 21.07 0 41.14 12.21 56.5 35.11 16.81 25.08 24.97 56.67 24.97 89.27 0 19.38-3.82 33.62-10.32 44.87-6.28 10.88-18.52 21.75-39.11 21.75l0-31.02c17.63 0 22.03-16.2 22.03-34.74 0-26.42-6.16-55.74-19.73-76.69-9.63-14.86-22.11-23.94-35.84-23.94-14.85 0-26.8 11.2-40.23 31.17-7.14 10.61-14.47 23.54-22.7 38.13l-9.06 16.05c-18.2 32.27-22.81 39.62-31.91 51.75-15.95 21.24-29.57 29.29-47.5 29.29-21.27 0-34.72-9.21-43.05-23.09-6.8-11.31-10.14-26.15-10.14-43.06z"/>
      <path fill="url(#metaGrad1)" d="m24.49 37.3c14.24-21.95 34.79-37.3 58.36-37.3 13.65 0 27.22 4.04 41.39 15.61 15.5 12.65 32.02 33.48 52.63 67.81l7.39 12.32c17.84 29.72 27.99 45.01 33.93 52.22 7.64 9.26 12.99 12.02 19.94 12.02 17.63 0 22.03-16.2 22.03-34.74l27.4-.86c0 19.38-3.82 33.62-10.32 44.87-6.28 10.88-18.52 21.75-39.11 21.75-12.8 0-24.14-2.78-36.68-14.61-9.64-9.08-20.91-25.21-29.58-39.71l-25.79-43.08c-12.94-21.62-24.81-37.74-31.68-45.04-7.39-7.85-16.89-17.33-32.05-17.33-12.27 0-22.69 8.61-31.41 21.78z"/>
      <path fill="url(#metaGrad2)" d="m82.35 31.23c-12.27 0-22.69 8.61-31.41 21.78-12.33 18.61-19.88 46.33-19.88 72.95 0 10.98 2.41 19.41 5.56 24.51l-26.48 17.44c-6.8-11.31-10.14-26.15-10.14-43.06 0-30.75 8.44-62.8 24.49-87.55 14.24-21.95 34.79-37.3 58.36-37.3z"/>
    </svg>
  ),
  netflix: (
    <svg viewBox="0 0 551.1 1000" className="w-full h-full">
      <defs>
        <linearGradient id="nLeft" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#b1060f"/>
          <stop offset="60%" stopColor="#7b010c"/>
          <stop offset="100%" stopColor="#b1060f" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="nRight" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#b1060f"/>
          <stop offset="60%" stopColor="#7b010c"/>
          <stop offset="100%" stopColor="#b1060f" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path fill="#e50914" d="M0 0h198v984C133 990 75 988 0 1002V0z"/>
      <path fill="#e50914" d="M353 0h198v1000c-74-8-149-17-205-17l7-983z"/>
      <path fill="url(#nLeft)" d="M0 0h198v984C133 990 75 988 0 1002V0z"/>
      <path fill="url(#nRight)" d="M353 0h198v1000c-74-8-149-17-205-17l7-983z"/>
      <path fill="#e50914" d="M0 0c5 11 346 982 346 982 56 0 131 9 205 17L197 0H0z"/>
    </svg>
  ),
  stripe: (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="#635BFF">
      <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C17.652.822 15.114.28 12.441.28c-6.274 0-10.42 3.27-10.42 8.784 0 6.932 9.548 5.834 9.548 8.832 0 1.037-.923 1.547-2.316 1.547-2.617 0-5.617-1.195-7.553-2.267l-.922 5.568c2.203 1.054 5.342 1.636 8.356 1.636 6.577 0 10.742-3.13 10.742-8.794 0-7.397-9.873-6.208-9.873-8.832z"/>
    </svg>
  ),
  openai: (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="#10A37F">
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 8.737a4.485 4.485 0 0 1 2.366-1.973V12.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 8.737zm16.597 3.855l-5.833-3.387L15.119 8a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.674 8.105v-5.642a.79.79 0 0 0-.409-.662zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 10.06V7.728a.08.08 0 0 1 .033-.062l4.84-2.796a4.5 4.5 0 0 1 6.668 4.844zM8.308 12.61l3.39-1.956 3.39 1.956v3.913l-3.39 1.956-3.39-1.956z"/>
    </svg>
  ),
  adobe: (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="#FA0F00">
      <path d="M13.966 22h10.034v-22h-10.034l-5.017 11.874 5.017 10.126zm-3.932 0h-10.034v-22h10.034l5.017 11.874-5.017 10.126zm2.017-14.773l4.757 11.23h-3.666l-1.391-3.416h-3.268l-1.391 3.416h-3.666l4.757-11.23h3.868z"/>
    </svg>
  )
};

export function getCleanDomain(rawDomainOrUrl?: string | null, slug?: string | null, name?: string | null): string {
  // Check known map first by slug or lowercase name
  if (slug && KNOWN_DOMAINS[slug.toLowerCase()]) {
    return KNOWN_DOMAINS[slug.toLowerCase()];
  }
  if (name) {
    const simplified = name.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (KNOWN_DOMAINS[simplified]) return KNOWN_DOMAINS[simplified];
  }

  const target = rawDomainOrUrl || "";
  if (!target) {
    if (slug) return `${slug.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`;
    return "";
  }

  try {
    const trimmed = target.trim();
    const withProtocol = trimmed.startsWith("http://") || trimmed.startsWith("https://") 
      ? trimmed 
      : `https://${trimmed}`;
    const parsed = new URL(withProtocol);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return target.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0].split("?")[0];
  }
}

const LOCAL_PUBLIC_LOGOS: Record<string, string> = {
  google: "/logos/google.svg",
  microsoft: "/logos/microsoft.svg",
  amazon: "/logos/amazon.svg",
  apple: "/logos/apple.svg",
  meta: "/logos/meta.svg",
  facebook: "/logos/meta.svg",
  netflix: "/logos/netflix.svg",
};

export function CompanyLogo({
  name,
  website,
  slug,
  logoUrl,
  domain,
  size = "md",
  className = "",
}: CompanyLogoProps) {
  const [imgError, setImgError] = useState(false);

  const cleanDomain = getCleanDomain(domain || website, slug, name);
  const lookupKey = (slug || name || "").toLowerCase().replace(/[^a-z0-9]/g, "");

  const initial = (name || "C").charAt(0).toUpperCase();
  const avatarColors = COLOR_MAP[initial] || "bg-teal-50 text-teal-700";

  const sizeClasses = {
    sm: "w-9 h-9 rounded-lg p-1.5",
    md: "w-11 h-11 rounded-xl p-2",
    lg: "w-12 h-12 rounded-xl p-2.5",
  }[size];

  const fontClasses = {
    sm: "text-xs font-bold",
    md: "text-sm font-black",
    lg: "text-base font-black",
  }[size];

  const logoSrc = (!imgError && LOCAL_PUBLIC_LOGOS[lookupKey])
    ? LOCAL_PUBLIC_LOGOS[lookupKey]
    : (!imgError && logoUrl)
    ? logoUrl
    : (!imgError && cleanDomain)
    ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(cleanDomain)}&sz=128`
    : null;

  return (
    <div
      className={`shrink-0 bg-white border border-slate-200/90 shadow-2xs flex items-center justify-center overflow-hidden transition-all group-hover:border-slate-300 ${sizeClasses} ${className}`}
      title={name}
    >
      {logoSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoSrc}
          alt={`${name} logo`}
          className="w-full h-full object-contain"
          onError={() => setImgError(true)}
          loading="lazy"
        />
      ) : (
        <span
          className={`w-full h-full rounded flex items-center justify-center font-bold ${avatarColors} ${fontClasses}`}
        >
          {initial}
        </span>
      )}
    </div>
  );
}
