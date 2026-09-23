"use client";

import React, { useState } from "react";

interface CountryFlagProps {
  locations?: string[] | string | null;
  countryCode?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

// Infer 2-letter ISO country code from location strings
export function inferCountryCode(locations?: string[] | string | null): string {
  if (!locations) return "";
  const locArr = Array.isArray(locations) ? locations : [locations];
  if (locArr.length === 0) return "";
  const text = locArr.join(" ").toLowerCase();

  if (/\b(india|bengaluru|bangalore|blr|pune|hyderabad|mumbai|delhi|noida|gurgaon|gurugram|chennai|kolkata|ahmedabad|karnataka|maharashtra|tamil\s*nadu|telangana|andhra|gujarat|rajasthan|kerala|lucknow|chandigarh)\b/.test(text)) return "in";
  if (/\b(united\s*states|usa|u\.s\.?|san\s*francisco|new\s*york|nyc|seattle|austin|chicago|boston|los\s*angeles|california|texas|washington|colorado|denver|atlanta|silicon\s*valley|sunnyvale|menlo\s*park|palo\s*alto|mountain\s*view|us\s*remote|remote\s*us)\b/.test(text)) return "us";
  if (/\b(united\s*kingdom|uk|u\.k\.?|london|manchester|edinburgh|bristol|birmingham|glasgow|leeds|liverpool)\b/.test(text)) return "gb";
  if (/\b(germany|deutschland|berlin|munich|münchen|frankfurt|hamburg|cologne|stuttgart|düsseldorf|karlsruhe)\b/.test(text)) return "de";
  if (/\b(canada|toronto|vancouver|montreal|ottawa|calgary|waterloo|quebec)\b/.test(text)) return "ca";
  if (/\b(australia|sydney|melbourne|brisbane|perth|canberra|adelaide)\b/.test(text)) return "au";
  if (/\b(singapore|sg\b)/.test(text)) return "sg";
  if (/\b(ireland|dublin|cork|galway|limerick)\b/.test(text)) return "ie";
  if (/\b(france|paris|lyon|marseille|toulouse|nice|nantes|bordeaux)\b/.test(text)) return "fr";
  if (/\b(japan|tokyo|osaka|kyoto|yokohama)\b/.test(text)) return "jp";
  if (/\b(netherlands|amsterdam|rotterdam|utrecht|eindhoven|hague)\b/.test(text)) return "nl";
  if (/\b(united\s*arab\s*emirates|uae|dubai|abu\s*dhabi)\b/.test(text)) return "ae";
  if (/\b(switzerland|zurich|geneva|basel|lausanne|bern)\b/.test(text)) return "ch";
  if (/\b(sweden|stockholm|gothenburg|malmo)\b/.test(text)) return "se";
  if (/\b(poland|warsaw|krakow|wroclaw|gdansk|poznan)\b/.test(text)) return "pl";
  if (/\b(spain|madrid|barcelona|valencia|seville|malaga)\b/.test(text)) return "es";
  if (/\b(italy|milan|rome|turin|florence|bologna)\b/.test(text)) return "it";
  if (/\b(brazil|são\s*paulo|sao\s*paulo|rio\s*de\s*janeiro)\b/.test(text)) return "br";
  if (/\b(mexico|mexico\s*city|guadalajara|monterrey)\b/.test(text)) return "mx";
  if (/\b(remote|worldwide|global|anywhere)\b/.test(text)) return "global";
  return "";
}

const COUNTRY_NAMES: Record<string, string> = {
  in: "India",
  us: "United States",
  gb: "United Kingdom",
  de: "Germany",
  ca: "Canada",
  au: "Australia",
  sg: "Singapore",
  ie: "Ireland",
  fr: "France",
  jp: "Japan",
  nl: "Netherlands",
  ae: "United Arab Emirates",
  ch: "Switzerland",
  se: "Sweden",
  pl: "Poland",
  es: "Spain",
  it: "Italy",
  br: "Brazil",
  mx: "Mexico",
  global: "Worldwide / Remote",
};

export function CountryFlag({ locations, countryCode, className = "", size = "sm" }: CountryFlagProps) {
  const [imgError, setImgError] = useState(false);
  const code = (countryCode || inferCountryCode(locations)).toLowerCase();

  if (!code) return null;

  const sizeDimensions = {
    sm: { width: 16, height: 12 },
    md: { width: 20, height: 15 },
    lg: { width: 24, height: 18 },
  }[size];

  if (code === "global" || code === "all" || code === "remote") {
    return (
      <span
        title="Worldwide / Remote"
        className={`inline-flex items-center justify-center shrink-0 ${className}`}
        aria-label="Worldwide / Remote"
      >
        <svg
          width={sizeDimensions.width}
          height={sizeDimensions.height}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-teal-600 inline-block align-middle"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      </span>
    );
  }

  const countryName = COUNTRY_NAMES[code] || code.toUpperCase();

  if (imgError) {
    return (
      <span
        title={countryName}
        className={`inline-block text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-1 py-0.5 rounded shrink-0 uppercase align-middle ${className}`}
      >
        {code.toUpperCase()}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center shrink-0 align-middle ${className}`}
      title={countryName}
    >
      <img
        src={`https://flagcdn.com/w40/${code}.png`}
        srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
        width={sizeDimensions.width}
        height={sizeDimensions.height}
        alt={countryName}
        loading="lazy"
        onError={() => setImgError(true)}
        className="rounded-[2px] shadow-2xs border border-slate-200/60 object-cover inline-block align-middle"
        style={{ width: `${sizeDimensions.width}px`, height: `${sizeDimensions.height}px` }}
      />
    </span>
  );
}
