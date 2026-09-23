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
  instacart: "instacart.com"
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
          className={`w-full h-full rounded flex items-center justify-center text-teal-700 bg-teal-50/90 ${fontClasses}`}
        >
          {initial}
        </span>
      )}
    </div>
  );
}
