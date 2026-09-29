"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Mail,
  Search,
  Trash2,
  ArrowLeft,
  Send,
  CheckCircle,
  Clock,
  Bell,
  MessageSquare,
  User as UserIcon,
  ExternalLink,
  ChevronRight,
  AlertCircle
} from "lucide-react";
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

interface UserThread {
  email: string;
  name: string;
  messages: InquiryItem[];
  latestMessage: InquiryItem;
  hasNew: boolean;
  newCount: number;
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
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadInquiries() {
      try {
        const res = await fetch("/api/contact");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.inquiries) && data.inquiries.length > 0) {
            setInquiries(data.inquiries);
            setSelectedEmail(data.inquiries[0].email.toLowerCase().trim());
            return;
          }
        }
      } catch (err) {
        console.warn("Could not fetch remote inquiries, trying local storage", err);
      }

      try {
        const raw = localStorage.getItem("jobhighway_contact_inquiries");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const formatted = parsed.map((i: any) => ({ ...i, status: i.status || "New" }));
            setInquiries(formatted);
            setSelectedEmail(formatted[0].email.toLowerCase().trim());
            return;
          }
        }
      } catch {}

      setInquiries(DEFAULT_INQUIRIES);
      setSelectedEmail(DEFAULT_INQUIRIES[0].email.toLowerCase().trim());
    }

    loadInquiries();
  }, []);

  // Group inquiries by user email
  const threads: UserThread[] = useMemo(() => {
    const map = new Map<string, InquiryItem[]>();
    for (const item of inquiries) {
      const key = (item.email || "anonymous").toLowerCase().trim();
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(item);
    }

    const result: UserThread[] = [];
    for (const [email, msgs] of map.entries()) {
      // Sort messages: newest first
      msgs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      const latestMessage = msgs[0];
      const newCount = msgs.filter(m => (m.status || "New") === "New").length;
      result.push({
        email,
        name: latestMessage.name || email.split("@")[0],
        messages: msgs,
        latestMessage,
        hasNew: newCount > 0,
        newCount
      });
    }

    // Sort threads: threads with new messages first, then by latest message date
    result.sort((a, b) => {
      if (a.hasNew && !b.hasNew) return -1;
      if (!a.hasNew && b.hasNew) return 1;
      return new Date(b.latestMessage.createdAt).getTime() - new Date(a.latestMessage.createdAt).getTime();
    });

    return result;
  }, [inquiries]);

  // Keep a selected thread
  const activeThread = useMemo(() => {
    if (!selectedEmail && threads.length > 0) return threads[0];
    return threads.find(t => t.email === selectedEmail) || threads[0] || null;
  }, [threads, selectedEmail]);

  const handleDeleteSingleMessage = async (id: string) => {
    const next = inquiries.filter(i => i.id !== id);
    setInquiries(next);
    localStorage.setItem("jobhighway_contact_inquiries", JSON.stringify(next));
    try {
      await fetch(`/api/contact?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    } catch {}
  };

  const handleDeleteThread = async (email: string) => {
    if (!confirm(`Delete all ${activeThread?.messages.length || 0} messages from ${email}?`)) return;
    const next = inquiries.filter(i => i.email.toLowerCase().trim() !== email.toLowerCase().trim());
    setInquiries(next);
    localStorage.setItem("jobhighway_contact_inquiries", JSON.stringify(next));
    try {
      await fetch(`/api/contact?email=${encodeURIComponent(email)}`, { method: "DELETE" });
    } catch {}

    const remainingThreads = threads.filter(t => t.email !== email);
    if (remainingThreads.length > 0) {
      setSelectedEmail(remainingThreads[0].email);
    } else {
      setSelectedEmail(null);
    }
  };

  const handleUpdateStatus = async (id: string, status: InquiryItem["status"]) => {
    const next = inquiries.map(i => i.id === id ? { ...i, status } : i);
    setInquiries(next);
    localStorage.setItem("jobhighway_contact_inquiries", JSON.stringify(next));
    try {
      await fetch("/api/contact", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });
    } catch {}
  };

  const handleMarkAllResolved = async (msgs: InquiryItem[]) => {
    const ids = msgs.map(m => m.id);
    const next = inquiries.map(i => ids.includes(i.id) ? { ...i, status: "Resolved" as const } : i);
    setInquiries(next);
    localStorage.setItem("jobhighway_contact_inquiries", JSON.stringify(next));
    for (const id of ids) {
      try {
        await fetch("/api/contact", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status: "Resolved" })
        });
      } catch {}
    }
  };

  const filteredThreads = threads.filter(t => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.email.toLowerCase().includes(q) ||
      t.messages.some(m => m.subject.toLowerCase().includes(q) || m.message.toLowerCase().includes(q) || m.topic.toLowerCase().includes(q))
    );
  });

  const totalNewMessages = inquiries.filter(i => (i.status || "New") === "New").length;

  return (
    <div className="space-y-6 pb-12">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Link href="/mastermindak" className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <Mail className="w-6 h-6 text-teal-600" />
              <span>Contact Inquiries &amp; Support Inbox</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Grouped user message threads, candidate bug reports, and partner submissions.
            </p>
          </div>

          {totalNewMessages > 0 && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>{totalNewMessages} New unaddressed message{totalNewMessages > 1 ? "s" : ""}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Grouped User Threads */}
        <div className="lg:col-span-5 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by user, email, or message..."
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs text-slate-800 outline-none focus:border-teal-500 transition-colors shadow-2xs"
            />
          </div>

          <div className="space-y-2">
            {filteredThreads.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-xl border border-slate-200">
                No inquiry threads found matching &ldquo;{search}&rdquo;.
              </div>
            ) : (
              filteredThreads.map((thread) => {
                const isSelected = activeThread?.email === thread.email;
                return (
                  <div
                    key={thread.email}
                    onClick={() => setSelectedEmail(thread.email)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                      isSelected
                        ? "border-teal-500 bg-teal-50/40 shadow-xs"
                        : "border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-2xs"
                    }`}
                  >
                    {/* Header Row: User Name + Message count + New Badge */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 font-bold text-[10px] flex items-center justify-center shrink-0 uppercase">
                          {thread.name.charAt(0)}
                        </div>
                        <span className="font-bold text-xs text-slate-900 truncate">
                          {thread.name}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded-md shrink-0">
                          {thread.messages.length} msg{thread.messages.length > 1 ? "s" : ""}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {thread.hasNew && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            {thread.newCount} NEW
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(thread.latestMessage.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="text-[11px] font-medium text-teal-700 truncate font-mono mb-1">
                      {thread.email}
                    </div>

                    {/* Latest topic / subject preview */}
                    <div className="flex items-center gap-1.5 mt-1.5 pt-1.5 border-t border-slate-100 text-[11px]">
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold text-teal-700 bg-teal-50 border border-teal-100 shrink-0">
                        {thread.latestMessage.topic}
                      </span>
                      <span className="text-slate-600 truncate font-medium">
                        {thread.latestMessage.subject}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: User Thread Reader with Conversation History */}
        <div className="lg:col-span-7">
          {activeThread ? (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-6">
              {/* User Overview Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-teal-600 text-white font-black text-base flex items-center justify-center shrink-0 shadow-xs uppercase">
                    {activeThread.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-black text-slate-900 leading-snug">
                        {activeThread.name}
                      </h2>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        {activeThread.messages.length} total message{activeThread.messages.length > 1 ? "s" : ""}
                      </span>
                      {activeThread.hasNew && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {activeThread.newCount} New
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-mono text-teal-700 mt-0.5">
                      {activeThread.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {activeThread.hasNew && (
                    <button
                      onClick={() => handleMarkAllResolved(activeThread.messages)}
                      className="px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 hover:bg-teal-100 rounded-xl transition-colors cursor-pointer"
                    >
                      Mark All Resolved
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteThread(activeThread.email)}
                    className="p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-rose-200"
                    title="Delete entire conversation thread"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <a
                    href={`mailto:${activeThread.email}?subject=Re: Your JobHighway Support Inquiry`}
                    className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Reply via Email</span>
                  </a>
                </div>
              </div>

              {/* Thread Messages Stack (Chronological) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <span>Message History ({activeThread.messages.length})</span>
                  <span className="text-[11px] font-normal lowercase text-slate-400">newest first</span>
                </div>

                <div className="space-y-3.5">
                  {activeThread.messages.map((msg, index) => {
                    const isNew = (msg.status || "New") === "New";
                    return (
                      <div
                        key={msg.id}
                        className={`rounded-2xl border p-4 sm:p-5 transition-all space-y-3 ${
                          isNew
                            ? "bg-emerald-50/30 border-emerald-200/80 shadow-xs"
                            : "bg-slate-50/60 border-slate-200/80"
                        }`}
                      >
                        {/* Message Top Meta */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-200/60">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-slate-900">
                              #{activeThread.messages.length - index} · {msg.subject}
                            </span>
                            <span className="text-[10px] font-semibold text-teal-700 bg-white border border-teal-200/80 px-2 py-0.5 rounded-md">
                              {msg.topic}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-400 font-mono">
                              {new Date(msg.createdAt).toLocaleString()}
                            </span>
                            <button
                              onClick={() => handleDeleteSingleMessage(msg.id)}
                              className="text-slate-400 hover:text-rose-500 p-1 rounded transition-colors cursor-pointer"
                              title="Delete this message"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Message Content */}
                        <p className="text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                          {msg.message}
                        </p>

                        {/* Status Bar */}
                        <div className="pt-2 border-t border-slate-200/50 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500 font-medium">Status:</span>
                            <select
                              value={msg.status || "New"}
                              onChange={(e) => handleUpdateStatus(msg.id, e.target.value as any)}
                              className={`px-2.5 py-1 rounded-lg border text-xs font-semibold outline-none cursor-pointer ${
                                (msg.status || "New") === "New"
                                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                                  : msg.status === "In Progress"
                                  ? "bg-amber-50 border-amber-200 text-amber-800"
                                  : "bg-slate-100 border-slate-200 text-slate-700"
                              }`}
                            >
                              <option value="New">New</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Resolved">Resolved</option>
                            </select>
                          </div>

                          <a
                            href={`mailto:${activeThread.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                            className="text-[11px] text-teal-700 hover:text-teal-800 font-semibold inline-flex items-center gap-1 hover:underline"
                          >
                            <span>Reply to this</span>
                            <ChevronRight className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-72 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-400">
              <Mail className="w-10 h-10 text-slate-300 mb-2.5" />
              <span className="text-slate-600 font-medium">No contact inquiries in inbox.</span>
              <span className="text-[11px] mt-1 text-slate-400">Incoming inquiries from candidate contact forms will appear here.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
