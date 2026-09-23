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
      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.88c2.27-2.09 3.665-5.17 3.665-9.09z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.1C3.27 21.44 7.35 24 12 24z" />
      <path fill="#FBBC05" d="M5.28 14.32c-.25-.72-.38-1.49-.38-2.32s.13-1.6.38-2.32V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.1z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.56 1.25 6.58l4.03 3.1c.95-2.83 3.6-4.93 6.72-4.93z" />
    </svg>
  ),
  microsoft: (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <rect x="1" y="1" width="10.5" height="10.5" fill="#F25022" rx="0.5" />
      <rect x="12.5" y="1" width="10.5" height="10.5" fill="#7FBA00" rx="0.5" />
      <rect x="1" y="12.5" width="10.5" height="10.5" fill="#00A4EF" rx="0.5" />
      <rect x="12.5" y="12.5" width="10.5" height="10.5" fill="#FFB900" rx="0.5" />
    </svg>
  ),
  amazon: (
    <svg viewBox="0 0 28 24" className="w-full h-full" fill="none">
      <path d="M14.2 12.4c-.6.5-1.4.8-2.3.8-1.8 0-2.8-1-2.8-2.7 0-2.1 1.6-3.1 4.4-3.1.7 0 1.2.1 1.5.1v.9c-.3-.1-.7-.1-1.2-.1-1.7 0-2.8.6-2.8 1.8 0 1 .6 1.6 1.7 1.6.8 0 1.4-.4 1.8-.9v1.6zm-2.8-7.9c2.7 0 4.4 1.3 4.4 4.1v4.3c0 .6 0 1.2.1 1.7h-1.7c-.1-.3-.1-.7-.1-1-.5.7-1.4 1.2-2.5 1.2-1.9 0-3.3-1.3-3.3-3.1 0-2.1 1.5-3.2 4-3.2.7 0 1.3.1 1.8.2v-.7c0-1.6-1-2.4-2.6-2.4-1.1 0-2.2.4-2.9.9l-.6-1.5c1-.6 2.4-1 3.7-1z" fill="#111827" />
      <path d="M5.5 17.5c4.5 3.2 11.2 3.4 16.5.3.3-.2.6.2.3.5-4.8 3.5-11.8 3.3-16.5-.4-.3-.2 0-.5.4-.4z" fill="#FF9900" />
      <path d="M22.8 16.8c-.3.4-1.4.7-2.1.8-.3 0-.4-.3-.2-.5 1-1 2.2-1.7 2.6-1.4.3.3.1 1.6-.3 2.1z" fill="#FF9900" />
    </svg>
  ),
  apple: (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="#111827">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.65 1.35-.58.67-1.09 1.74-.95 2.77.99.08 2.06-.52 2.68-1.27z"/>
    </svg>
  ),
  meta: (
    <svg viewBox="0 0 28 20" className="w-full h-full" fill="none">
      <path d="M7 4C3.13 4 0 7.13 0 11C0 14.87 3.13 18 7 18C10.15 18 12.8 15.93 13.68 13.06L14 12L14.32 13.06C15.2 15.93 17.85 18 21 18C24.87 18 28 14.87 28 11C28 7.13 24.87 4 21 4C17.85 4 15.2 6.07 14.32 8.94L14 10L13.68 8.94C12.8 6.07 10.15 4 7 4Z" stroke="#0081FB" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  netflix: (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="#E50914">
      <path d="M5.398 0v24c1.196-.27 2.417-.504 3.656-.696V0H5.398zm9.546 0v17.484c1.239-.12 2.464-.204 3.656-.252V0h-3.656zm-4.773 0l4.82 23.016c-1.127.132-2.265.288-3.41.468L6.82 5.04V0h3.351z"/>
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

  // If a known official vector logo exists, use it directly for crisp presentation
  if (VECTOR_LOGOS[lookupKey]) {
    return (
      <div
        className={`shrink-0 bg-white border border-slate-200/90 shadow-2xs flex items-center justify-center overflow-hidden transition-all group-hover:border-slate-300 ${sizeClasses} ${className}`}
        title={name}
      >
        <div className="w-full h-full flex items-center justify-center">
          {VECTOR_LOGOS[lookupKey]}
        </div>
      </div>
    );
  }

  const logoSrc = (!imgError && logoUrl)
    ? logoUrl
    : (!imgError && cleanDomain)
    ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(cleanDomain)}&sz=128`
    : null;

  return (
    <div
      className={`shrink-0 bg-white border border-slate-200/90 shadow-2xs flex items-center justify-center overflow-hidden transition-all group-hover:border-slate-300 ${sizeClasses} ${className}`}
    >
      {logoSrc ? (
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
