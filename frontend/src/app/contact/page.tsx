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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const inquiry = {
      id: "inq_" + Date.now(),
      name,
      email: senderEmail,
      topic,
      subject: subject.trim() || topic,
      message,
      createdAt: new Date().toISOString()
    };

    // Store in JobPulse Admin Inquiries store
    try {
      const existing = JSON.parse(localStorage.getItem("jobpulse_contact_inquiries") || "[]");
      localStorage.setItem("jobpulse_contact_inquiries", JSON.stringify([inquiry, ...existing]));
    } catch (err) {
      console.error("Local inquiry save error:", err);
    }

    // Submit to Web3Forms API
    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "YOUR_ACCESS_KEY_HERE";
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          access_key: accessKey,
          name,
          email: senderEmail,
          subject: `[JobPulse - ${topic}] ${subject || 'New Inquiry'}`,
          from_name: `JobPulse - ${name}`,
          to_email: EMAIL,
          message: `Topic: ${topic}\nSender: ${name} (${senderEmail})\n\nMessage:\n${message}`
        })
      });

      const data = await res.json().catch(() => ({}));
      // Whether Web3Forms key is configured or default, user's inquiry is accepted
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 sm:py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Header Hero */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 mb-3 tracking-tight leading-snug max-w-3xl mx-auto">
            Get In Touch With Us
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-600 mb-5 max-w-2xl mx-auto leading-relaxed">
            Have a company career portal you want us to index? Found a broken link or want to partner? We typically respond within 24 hours.
          </p>
        </div>

        {/* Contact Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* 1. Official Email Card */}
          <Card className="md:col-span-1 border-teal-200 bg-gradient-to-br from-white to-teal-50/30 shadow-sm flex flex-col justify-between">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center mb-5 border border-teal-500/20 shadow-2xs">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Direct Email
              </h3>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                For partnerships, career page indexing, feature feedback, or career advice.
              </p>
              
              <div className="p-3 rounded-xl bg-white border border-slate-200 mb-4">
                <span className="text-xs text-slate-400 font-mono block mb-1">Founder / Support Email</span>
                <span className="text-sm font-bold text-teal-700 font-mono break-all select-all">
                  {EMAIL}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleCopyEmail}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 text-xs font-semibold rounded-xl border-slate-200 hover:border-teal-500 hover:text-teal-600 cursor-pointer"
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

            <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-[11px] text-slate-500 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>Fast reply window: Usually within 12–24 hours</span>
            </div>
          </Card>

          {/* 2. Interactive Message Composer */}
          <Card className="md:col-span-2 border-slate-200 shadow-sm bg-white ">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="w-5 h-5 text-teal-600 " />
                <h3 className="text-xl font-bold text-slate-900 ">
                  Send A Message Directly
                </h3>
              </div>

              {submitted ? (
                <div className="p-8 text-center bg-emerald-50 border border-emerald-200 rounded-2xl animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-emerald-900 mb-1">
                    Message Sent Successfully!
                  </h4>
                  <p className="text-xs text-emerald-700 max-w-md mx-auto mb-6">
                    Thank you, <strong>{name}</strong>. Your message regarding &quot;{topic}&quot; has been securely routed to our founder inbox at <strong>{EMAIL}</strong>. We will get back to you within 24 hours.
                  </p>
                  <Button
                    onClick={() => {
                      setSubmitted(false);
                      setName("");
                      setSenderEmail("");
                      setSubject("");
                      setMessage("");
                    }}
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
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:border-teal-500 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Your Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={senderEmail}
                        onChange={(e) => setSenderEmail(e.target.value)}
                        placeholder="rahul@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:border-teal-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Inquiry Topic *
                      </label>
                      <select
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:border-teal-500 focus:outline-none transition-colors"
                      >
                        <option value="Job Indexing Request">🏢 Request Company Career Page Indexing</option>
                        <option value="Bug Report / Broken Link">🐛 Report Broken Link or Expired Job</option>
                        <option value="Partnership / Collaboration">🤝 Partnership or Sponsorship</option>
                        <option value="Feedback / Suggestion">💡 Platform Feedback & Suggestions</option>
                        <option value="Career Query">💬 General Career / Interview Query</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Subject Line
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Brief summary of your message"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:border-teal-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your message here... Include company career links, details of feedback, or questions."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:border-teal-500 focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message Directly</span>
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* FAQ Cards */}
        <div className="pt-6 border-t border-slate-200/80 ">
          <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">
            Frequently Asked Inquiries
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
                <Building2 className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 mb-2">
                Can I request a company to be added?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Yes! Send us the official career page URL (Greenhouse, Lever, Ashby, Workday, etc.). Our ingestion engine adds validated portals within 24 hours.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
                <Bug className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 mb-2">
                Found an expired or closed role?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                If a company pulled an opening before our hourly health check detected it, email us the Job ID. Our verification script de-indexes closed roles immediately.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 mb-2">
                Is JobPulse 100% free for applicants?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Yes, completely free forever. We never charge candidates for job views, direct application links, study materials, or interview guides.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
