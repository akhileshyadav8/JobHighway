"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, Search, Trash2, ArrowLeft, Send, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InquiryItem {
  id: string;
  name: string;
  email: string;
  topic: string;
  subject: string;
  message: string;
  createdAt: string;
  status?: "New" | "Open" | "In Progress" | "Resolved";
}

const DEFAULT_INQUIRIES: InquiryItem[] = [
  {
    id: "inq_1",
    name: "Aman Verma",
    email: "aman.verma@techcorp.in",
    topic: "Partnership & ATS Integration",
    subject: "Integrating our custom Lever enterprise portal",
    message: "Hello JobHighway team, we want to ensure our direct engineering openings are indexed directly without third-party scrapers. How can we verify our careers domain?",
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
    status: "New"
  },
  {
    id: "inq_2",
    name: "Sneha Reddy",
    email: "sneha.reddy@gmail.com",
    topic: "Candidate Feedback",
    subject: "Zero-scam guarantee experience was great!",
    message: "Just wanted to share that applying directly on Greenhouse via JobHighway was seamless and eliminated spam recruiter emails. Thank you!",
    createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    status: "Resolved"
  },
  {
    id: "inq_3",
    name: "Rohit Malhotra",
    email: "rohit.m@consulting.com",
    topic: "Suspicious or Dead Link",
    subject: "Dead URL on Taleo listing",
    message: "The application link for senior data engineer at global consulting returned a 404. Can your automated crawlers inspect it?",
    createdAt: new Date(Date.now() - 8 * 3600000).toISOString(),
    status: "In Progress"
  }
];

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("jobhighway_contact_inquiries");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setInquiries(parsed.map(i => ({ ...i, status: i.status || "New" })));
          setSelectedInquiry(parsed[0]);
          return;
        }
      }
    } catch {}
    setInquiries(DEFAULT_INQUIRIES);
    setSelectedInquiry(DEFAULT_INQUIRIES[0]);
  }, []);

  const handleDelete = (id: string) => {
    const next = inquiries.filter(i => i.id !== id);
    setInquiries(next);
    localStorage.setItem("jobhighway_contact_inquiries", JSON.stringify(next));
    if (selectedInquiry?.id === id) {
      setSelectedInquiry(next[0] || null);
    }
  };

  const handleUpdateStatus = (id: string, status: InquiryItem["status"]) => {
    const next = inquiries.map(i => i.id === id ? { ...i, status } : i);
    setInquiries(next);
    localStorage.setItem("jobhighway_contact_inquiries", JSON.stringify(next));
    if (selectedInquiry?.id === id) {
      setSelectedInquiry(prev => prev ? { ...prev, status } : null);
    }
  };

  const filtered = inquiries.filter(i => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return i.name.toLowerCase().includes(q) || i.email.toLowerCase().includes(q) || i.subject.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 pb-12">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Link href="/mastermindak" className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Mail className="w-6 h-6 text-teal-600" />
          <span>Contact Inquiries &amp; Support Inbox</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Review incoming candidate feedback, bug reports, and hiring partner outreach submissions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left List */}
        <div className="md:col-span-1 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search messages..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200/90 rounded-xl text-xs text-slate-800 outline-none focus:border-teal-500"
            />
          </div>

          <div className="space-y-2">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedInquiry(item)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedInquiry?.id === item.id
                    ? "border-teal-500 bg-teal-50/40 shadow-xs"
                    : "border-slate-200/90 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-bold text-teal-700">{item.topic}</span>
                  <span className="text-slate-400 font-mono">{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="font-bold text-xs text-slate-900 truncate">
                  {item.subject}
                </div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">
                  {item.name} ({item.email})
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Reader */}
        <div className="md:col-span-2">
          {selectedInquiry ? (
            <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-2xs space-y-4">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-teal-700 bg-teal-50 border border-teal-100 px-2.5 py-0.5 rounded-md">
                    {selectedInquiry.topic}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 mt-2">
                    {selectedInquiry.subject}
                  </h2>
                </div>

                <button
                  onClick={() => handleDelete(selectedInquiry.id)}
                  className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl text-xs space-y-1">
                <div className="text-slate-600">
                  From: <strong className="text-slate-900">{selectedInquiry.name}</strong>
                </div>
                <div className="text-slate-600">
                  Email: <strong className="text-teal-700 font-mono">{selectedInquiry.email}</strong>
                </div>
                <div className="text-slate-400 text-[11px]">
                  Timestamp: {new Date(selectedInquiry.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="py-2 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                {selectedInquiry.message}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Status:</span>
                  <select
                    value={selectedInquiry.status || "New"}
                    onChange={(e) => handleUpdateStatus(selectedInquiry.id, e.target.value as any)}
                    className="px-2 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 outline-none"
                  >
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <a
                  href={`mailto:${selectedInquiry.email}?subject=Re: ${encodeURIComponent(selectedInquiry.subject)}`}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs inline-flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-400">
              <Mail className="w-8 h-8 text-slate-300 mb-2" />
              <span>Select an inquiry from the inbox to read full details.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
