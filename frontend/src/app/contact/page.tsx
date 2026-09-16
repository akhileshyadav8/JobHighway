"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Mail, 
  Copy, 
  Check, 
  Send, 
  MessageSquare, 
  Building2, 
  Bug, 
  Sparkles, 
  Clock, 
  ShieldCheck,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactPage() {
  const EMAIL = "yadavakhil766@gmail.com";
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [topic, setTopic] = useState("Job Indexing Request");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSubject = encodeURIComponent(`[JobPulse - ${topic}] ${subject || 'Inquiry'}`);
    const finalBody = encodeURIComponent(
      `Hello Akhilesh,\n\nName: ${name}\nEmail: ${senderEmail}\nTopic: ${topic}\n\nMessage:\n${message}\n\n---\nSent via JobPulse Contact Portal`
    );
    // Trigger mail client with populated content
    window.location.href = `mailto:${EMAIL}?subject=${finalSubject}&body=${finalBody}`;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 sm:py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Header Hero */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "5s" }} />
            Direct Communication & Support
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4 leading-tight">
            Get In Touch With Us
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Have a company career portal you want us to index? Found a broken link or want to partner? We typically respond within 24 hours.
          </p>
        </div>

        {/* Contact Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* 1. Official Email Card */}
          <Card className="md:col-span-1 border-teal-200 dark:border-teal-900/60 bg-gradient-to-br from-white to-teal-50/30 dark:from-slate-900 dark:to-teal-950/20 shadow-sm flex flex-col justify-between">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-5 border border-teal-500/20 shadow-2xs">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                Direct Email
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                For partnerships, career page indexing, feature feedback, or career advice.
              </p>
              
              <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 mb-4">
                <span className="text-xs text-slate-400 font-mono block mb-1">Founder / Support Email</span>
                <span className="text-sm font-bold text-teal-700 dark:text-teal-300 font-mono break-all select-all">
                  {EMAIL}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleCopyEmail}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 text-xs font-semibold rounded-xl border-slate-200 dark:border-slate-800 hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Email Address</span>
                    </>
                  )}
                </Button>

                <a
                  href={`mailto:${EMAIL}?subject=[JobPulse Inquiry]`}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-xs transition-all cursor-pointer"
                >
                  <span>Open In Email App</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </CardContent>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
              <span>Fast reply window: Usually within 12–24 hours</span>
            </div>
          </Card>

          {/* 2. Interactive Message Composer */}
          <Card className="md:col-span-2 border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Send A Message Directly
                </h3>
              </div>

              {submitted ? (
                <div className="p-8 text-center bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-emerald-900 dark:text-emerald-200 mb-1">
                    Email Client Launched!
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 max-w-md mx-auto mb-6">
                    Your email program was opened with your message pre-formatted. If it didn&apos;t launch automatically, you can always write directly to <strong>{EMAIL}</strong>.
                  </p>
                  <Button
                    onClick={() => setSubmitted(false)}
                    variant="outline"
                    className="text-xs font-semibold rounded-xl cursor-pointer"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:border-teal-500 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Your Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={senderEmail}
                        onChange={(e) => setSenderEmail(e.target.value)}
                        placeholder="rahul@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:border-teal-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Inquiry Topic *
                      </label>
                      <select
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:border-teal-500 focus:outline-none transition-colors"
                      >
                        <option value="Job Indexing Request">🏢 Request Company Career Page Indexing</option>
                        <option value="Bug Report / Broken Link">🐛 Report Broken Link or Expired Job</option>
                        <option value="Partnership / Collaboration">🤝 Partnership or Sponsorship</option>
                        <option value="Feedback / Suggestion">💡 Platform Feedback & Suggestions</option>
                        <option value="Career Query">💬 General Career / Interview Query</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Subject Line
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Brief summary of your message"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:border-teal-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your message here... Include company career links, details of feedback, or questions."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:border-teal-500 focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message via Email</span>
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* FAQ Cards */}
        <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 text-center">
            Frequently Asked Inquiries
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
              <div className="w-9 h-9 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3">
                <Building2 className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
                Can I request a company to be added?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Yes! Send us the official career page URL (Greenhouse, Lever, Ashby, Workday, etc.). Our ingestion engine adds validated portals within 24 hours.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
              <div className="w-9 h-9 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
                <Bug className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
                Found an expired or closed role?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                If a company pulled an opening before our hourly health check detected it, email us the Job ID. Our verification script de-indexes closed roles immediately.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
                Is JobPulse 100% free for applicants?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Yes, completely free forever. We never charge candidates for job views, direct application links, study materials, or interview guides.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
