"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, ArrowLeft, GitMerge, Check, EyeOff, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DuplicatePair {
  id: string;
  title: string;
  company: string;
  location: string;
  ats: string;
  similarity: number;
  primaryUrl: string;
  secondaryUrl: string;
  detectedAt: string;
}

const SAMPLE_DUPLICATES: DuplicatePair[] = [
  {
    id: "dup_1",
    title: "Senior Full Stack Software Engineer",
    company: "Postman",
    location: "Bengaluru, India / Hybrid",
    ats: "Greenhouse",
    similarity: 98,
    primaryUrl: "https://job-boards.greenhouse.io/postman/jobs/52011",
    secondaryUrl: "https://boards.greenhouse.io/postman/jobs/52011?gh_jid=52011",
    detectedAt: "35 mins ago"
  },
  {
    id: "dup_2",
    title: "Data Analyst - Product Intelligence",
    company: "Groww",
    location: "Bengaluru, India",
    ats: "Greenhouse",
    similarity: 94,
    primaryUrl: "https://job-boards.eu.greenhouse.io/groww/jobs/41092",
    secondaryUrl: "https://groww.in/careers/data-analyst-41092",
    detectedAt: "1 hour ago"
  },
  {
    id: "dup_3",
    title: "Cloud Infrastructure Engineer",
    company: "Cloudflare",
    location: "Remote (India)",
    ats: "Greenhouse",
    similarity: 91,
    primaryUrl: "https://boards.greenhouse.io/cloudflare/jobs/88392",
    secondaryUrl: "https://cloudflare.com/jobs/cloud-infra-88392",
    detectedAt: "3 hours ago"
  }
];

export default function AdminDuplicatesPage() {
  const [duplicates, setDuplicates] = useState<DuplicatePair[]>(SAMPLE_DUPLICATES);

  const handleResolve = (id: string) => {
    setDuplicates(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div className="space-y-5 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/mastermindak/jobs" className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1 font-medium">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to All Jobs
            </Link>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Copy className="w-5 h-5 text-indigo-600" />
            <span>Duplicate Detection</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Identify and deduplicate multiple URLs referring to identical employer roles across aggregators.
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/90 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Job Title</th>
                <th className="p-3.5">Company</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5">ATS</th>
                <th className="p-3.5">Similarity</th>
                <th className="p-3.5">URLs</th>
                <th className="p-3.5 text-right">Resolution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {duplicates.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No duplicate job postings pending resolution.
                  </td>
                </tr>
              ) : (
                duplicates.map((dup) => (
                  <tr key={dup.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">
                      {dup.title}
                    </td>
                    <td className="p-3.5 font-medium text-slate-700">
                      {dup.company}
                    </td>
                    <td className="p-3.5 text-slate-500">
                      {dup.location}
                    </td>
                    <td className="p-3.5">
                      <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {dup.ats}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full text-[10px]">
                        {dup.similarity}% Match
                      </span>
                    </td>
                    <td className="p-3.5 space-y-1">
                      <div className="flex items-center gap-1 text-[11px] text-teal-600 hover:underline">
                        <ExternalLink className="w-3 h-3 shrink-0" />
                        <a href={dup.primaryUrl} target="_blank" rel="noreferrer" className="truncate max-w-[140px]">
                          Primary ATS Endpoint
                        </a>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 hover:underline">
                        <ExternalLink className="w-3 h-3 shrink-0" />
                        <a href={dup.secondaryUrl} target="_blank" rel="noreferrer" className="truncate max-w-[140px]">
                          Duplicate Link
                        </a>
                      </div>
                    </td>
                    <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => handleResolve(dup.id)}
                        className="px-2.5 py-1 rounded-lg border border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100 font-semibold text-[11px] transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <GitMerge className="w-3 h-3" />
                        <span>Merge</span>
                      </button>
                      <button
                        onClick={() => handleResolve(dup.id)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-[11px] transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <Check className="w-3 h-3 text-slate-400" />
                        <span>Keep Both</span>
                      </button>
                      <button
                        onClick={() => handleResolve(dup.id)}
                        className="px-2 py-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        title="Ignore"
                      >
                        <EyeOff className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
