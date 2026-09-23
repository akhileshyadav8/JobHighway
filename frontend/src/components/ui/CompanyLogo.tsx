"use client";

import { useState } from "react";

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

  const logoSrc = (!imgError && logoUrl)
    ? logoUrl
    : (!imgError && cleanDomain)
    ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(cleanDomain)}&sz=128`
    : null;

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
