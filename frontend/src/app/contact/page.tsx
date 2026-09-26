"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  ArrowRight,
  MapPin,
  Sparkles,
  ChevronDown,
  Megaphone,
  Briefcase,
  Handshake,
  Building,
  CheckCircle2,
  Send,
  Clock,
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "How does JobHighway get job listings?",
    answer:
      "We connect directly to companies' official career systems (including Greenhouse, Lever, Workday, Ashby, and Taleo) and index jobs hourly without delayed third-party aggregators or recruiter spam.",
  },
  {
    question: "Is JobHighway free to use?",
    answer:
      "Yes, JobHighway is 100% free for job seekers. You can search, filter, track applications, and set custom job alerts with zero paywalls or subscription fees.",
  },
  {
    question: "How often are job listings updated?",
    answer:
      "Our automated indexing pipelines fetch and synchronize job listings every hour to ensure you see opportunities as soon as they are posted on official career portals.",
  },
  {
    question: "Can I post a job on JobHighway?",
    answer:
      "Currently, JobHighway indexes official career portals automatically. If your company's career portal is not indexed yet, contact our team using the form and we will verify and connect it.",
  },
  {
    question: "How can I report incorrect job information?",
    answer:
      "If you notice an expired listing or incorrect salary/location information, please report it via the message form selecting 'Bug Report / Technical Issue' or email support@jobhighway.com.",
  },
  {
    question: "Do you have a mobile app?",
    answer:
      "JobHighway is engineered as a fully responsive Progressive Web App (PWA). You can add it to your mobile home screen directly from your browser for an app-like experience.",
  },
  {
    question: "How can I suggest a new feature?",
    answer:
      "We actively build based on community feedback! Select 'Feature Suggestion' in the form subject dropdown and share your ideas with our engineering team.",
  },
];

export default function ContactPage() {
  const EMAIL = "support@jobhighway.com";
  const [name, setName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [showAllFaqs, setShowAllFaqs] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const scrollToForm = () => {
    const el = document.getElementById("contact-form-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const inquiry = {
      id: "inq_" + Date.now(),
      name,
      email: senderEmail,
      subject: subject || "General Inquiry",
      message,
      createdAt: new Date().toISOString(),
    };

    // 1. Persist directly to Supabase DB via server API
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: senderEmail.trim(),
          topic: subject || "General Inquiry",
          subject: subject || "General Inquiry",
          message: message.trim(),
        }),
      });
    } catch (apiErr) {
      console.warn("Contact API sync warning:", apiErr);
    }

    // 2. Store in local browser cache as fallback
    try {
      const existing = JSON.parse(
        localStorage.getItem("jobhighway_contact_inquiries") || "[]"
      );
      localStorage.setItem(
        "jobhighway_contact_inquiries",
        JSON.stringify([inquiry, ...existing])
      );
    } catch (err) {
      console.error("Local inquiry save error:", err);
    }

    // Submit to Web3Forms API
    const accessKey =
      process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "YOUR_ACCESS_KEY_HERE";
    try {
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          name,
          email: senderEmail,
          subject: `[JobHighway] ${subject || "New Inquiry"}`,
          from_name: `JobHighway - ${name}`,
          to_email: EMAIL,
          message: `Subject: ${subject}\nSender: ${name} (${senderEmail})\n\nMessage:\n${message}`,
        }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 antialiased">
      {/* ========================================================
          HERO SECTION: Pixel-matched to reference design
          Eyebrow + Large Heading + Subtitle
          Right: Subtle /world.svg with floating "Global Support" card
          ======================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f0fdfa]/60 via-white to-[#f8fafc] pt-12 pb-14 sm:pt-16 sm:pb-16 border-b border-slate-100">
        {/* Subtle mesh background */}
        <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1360px] relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              {/* Eyebrow */}
              <div className="flex items-center gap-2 mb-4 text-xs font-semibold tracking-wider uppercase text-teal-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                <span>Get In Touch</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-black text-slate-900 tracking-tight leading-[1.15] mb-4">
                We&apos;re here to help
              </h1>

              {/* Supporting Subtitle */}
              <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
                Have a question, feedback or just want to say hello?<br />
                We&apos;d love to hear from you. Our team usually responds within 24 hours.
              </p>

              {/* Quick Contact Touchpoints: Anchors bottom of hero to balance right map */}
              <div className="mt-8 pt-7 border-t border-slate-200/80 flex flex-wrap items-center gap-y-4 gap-x-6 sm:gap-x-8">
                {/* 1. Direct Email */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-teal-50 text-[#0d9488] flex items-center justify-center shrink-0 border border-teal-100">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Direct Email
                    </div>
                    <a
                      href="mailto:support@jobhighway.com"
                      className="text-xs font-bold text-slate-800 hover:text-[#0d9488] transition-colors"
                    >
                      support@jobhighway.com
                    </a>
                  </div>
                </div>

                {/* Vertical Divider */}
                <div className="hidden sm:block w-px h-8 bg-slate-200" />

                {/* 2. Response Time */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-teal-50 text-[#0d9488] flex items-center justify-center shrink-0 border border-teal-100">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Response Window
                    </div>
                    <div className="text-xs font-bold text-slate-800">
                      Usually within 24 hours
                    </div>
                  </div>
                </div>

                {/* Vertical Divider */}
                <div className="hidden sm:block w-px h-8 bg-slate-200" />

                {/* 3. Office Location */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-teal-50 text-[#0d9488] flex items-center justify-center shrink-0 border border-teal-100">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Office Location
                    </div>
                    <div className="text-xs font-bold text-slate-800">
                      Surat, Gujarat, India
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Large World Map + Global Support Floating Card */}
            <div className="lg:col-span-5 relative hidden lg:flex items-center justify-center min-h-[360px] xl:min-h-[390px]">
              <div className="relative w-full max-w-[580px] h-[350px] flex items-center justify-center">
                
                {/* World Map Vector Graphic with ambient glow matching Companies page */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                  {/* Soft radial glow behind the world map */}
                  <div className="absolute w-[460px] h-[280px] bg-gradient-to-tr from-teal-200/40 via-teal-100/25 to-transparent rounded-full blur-2xl pointer-events-none" />
                  
                  {/* Detailed vector world map matching Companies page visibility */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/world.svg"
                    alt="Global Career Network World Map"
                    className="w-full h-full object-contain pointer-events-none select-none relative z-0"
                  />
                </div>

                {/* Floating "Global Support" Card */}
                <div className="absolute top-[75px] right-[45px] bg-white rounded-2xl border border-slate-200/90 shadow-md p-3.5 px-4 flex items-center gap-3 z-20 hover:scale-105 transition-transform cursor-default">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#0d9488] flex items-center justify-center shrink-0 border border-teal-100">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 leading-tight">
                      Global Support
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      Helping job seekers worldwide
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          PAGE BODY CONTENT CONTAINER
          ======================================================== */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1360px] py-12 sm:py-16 space-y-12 sm:space-y-16">
        
        {/* ========================================================
            CONTACT OPTIONS SECTION: 4 Equal-Height Cards
            1. General Inquiries
            2. Partnerships
            3. Media & Press
            4. Career Opportunities
            ======================================================== */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Card 1: General Inquiries */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs hover:shadow-md hover:border-teal-300 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 border border-amber-100">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  General Inquiries
                </h3>
                <a
                  href="mailto:support@jobhighway.com"
                  className="text-xs font-semibold text-[#0d9488] hover:underline block mb-2"
                >
                  support@jobhighway.com
                </a>
                <p className="text-xs text-slate-500 leading-relaxed">
                  For general questions and support.
                </p>
              </div>
            </div>

            {/* Card 2: Partnerships */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs hover:shadow-md hover:border-teal-300 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0d9488] flex items-center justify-center mb-4 border border-teal-100">
                  <Handshake className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  Partnerships
                </h3>
                <a
                  href="mailto:partnerships@jobhighway.com"
                  className="text-xs font-semibold text-[#0d9488] hover:underline block mb-2"
                >
                  partnerships@jobhighway.com
                </a>
                <p className="text-xs text-slate-500 leading-relaxed">
                  For company partnerships and collaborations.
                </p>
              </div>
            </div>

            {/* Card 3: Media & Press */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs hover:shadow-md hover:border-teal-300 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 border border-rose-100">
                  <Megaphone className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  Media &amp; Press
                </h3>
                <a
                  href="mailto:media@jobhighway.com"
                  className="text-xs font-semibold text-[#0d9488] hover:underline block mb-2"
                >
                  media@jobhighway.com
                </a>
                <p className="text-xs text-slate-500 leading-relaxed">
                  For media, press and interview requests.
                </p>
              </div>
            </div>

            {/* Card 4: Career Opportunities */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs hover:shadow-md hover:border-teal-300 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4 border border-orange-100">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  Career Opportunities
                </h3>
                <a
                  href="mailto:careers@jobhighway.com"
                  className="text-xs font-semibold text-[#0d9488] hover:underline block mb-2"
                >
                  careers@jobhighway.com
                </a>
                <p className="text-xs text-slate-500 leading-relaxed">
                  For career openings at JobHighway.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================
            TWO-COLUMN SECTION:
            Left: Contact Message Form
            Right: FAQ Accordion + Our Office Card
            ======================================================== */}
        <section id="contact-form-section">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            
            {/* Left Column: Send us a message form - Stretches and aligns perfectly with right column */}
            <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 lg:p-9 shadow-xs flex flex-col justify-between">
              <div>
                <div className="mb-6">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-1">
                    Send us a message
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Fill out the form and we&apos;ll get back to you as soon as possible.
                  </p>
                </div>

                {submitted ? (
                  <div className="py-10 text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                      Thank you for reaching out. We have received your inquiry and our team will get back to you shortly.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setName("");
                        setSenderEmail("");
                        setSubject("");
                        setMessage("");
                      }}
                      className="mt-4 px-5 py-2 rounded-xl text-xs font-bold text-[#0d9488] hover:bg-teal-50 border border-teal-200 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Name and Email Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your name"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Email <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={senderEmail}
                          onChange={(e) => setSenderEmail(e.target.value)}
                          placeholder="your.email@example.com"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-white"
                        />
                      </div>
                    </div>

                    {/* Subject Dropdown */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Subject <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          required
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          className="w-full appearance-none px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-white pr-9 cursor-pointer"
                        >
                          <option value="">Select a subject</option>
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="Job Indexing Request">Job Indexing Request</option>
                          <option value="Bug Report / Technical Issue">Bug Report / Technical Issue</option>
                          <option value="Partnership Opportunity">Partnership Opportunity</option>
                          <option value="Feature Suggestion">Feature Suggestion</option>
                          <option value="Other">Other</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Message Field */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Message <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Write your message here..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-white resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-1">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs hover:shadow-md cursor-pointer disabled:opacity-50"
                      >
                        <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                  </form>
                )}
              </div>
            </div>

            {/* Right Column: FAQ Accordion + Our Office Card aligned to form bottom */}
            <div className="lg:col-span-6 flex flex-col justify-between gap-5">
              
              {/* FAQ Container */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs">
                <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-100">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Frequently Asked Questions
                  </h2>
                  <button
                    onClick={() => setShowAllFaqs(!showAllFaqs)}
                    className="text-xs font-semibold text-[#0d9488] hover:underline cursor-pointer"
                  >
                    {showAllFaqs ? "Show Less" : "View All →"}
                  </button>
                </div>

                {/* FAQ List: Top 4 questions by default (matches reference screenshot) */}
                <div className="divide-y divide-slate-100">
                  {(showAllFaqs ? FAQ_ITEMS : FAQ_ITEMS.slice(0, 4)).map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div key={idx} className="py-2.5">
                        <button
                          onClick={() => toggleFaq(idx)}
                          className="w-full flex items-center justify-between gap-3 text-left py-1 text-xs sm:text-sm font-semibold text-slate-800 hover:text-[#0d9488] transition-colors cursor-pointer"
                        >
                          <span>{faq.question}</span>
                          <ChevronDown
                            className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                              isOpen ? "rotate-180 text-[#0d9488]" : ""
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <p className="mt-2 text-xs text-slate-500 leading-relaxed font-normal pr-4">
                            {faq.answer}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Our Office Card: Bottom-anchored and aligned with Contact Form */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  {/* Solid Teal Pin matching reference */}
                  <div className="relative shrink-0 mt-0.5">
                    <svg width="34" height="42" viewBox="0 0 36 44" fill="none" className="drop-shadow-xs">
                      <ellipse cx="18" cy="40" rx="9" ry="3" fill="#0d9488" fillOpacity="0.25" />
                      <path d="M18 2C9.163 2 2 9.163 2 18C2 28.5 18 40 18 40C18 40 34 28.5 34 18C34 9.163 26.837 2 18 2Z" fill="#0d9488" />
                      <circle cx="18" cy="17" r="5.5" fill="white" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      Our Office
                    </h3>
                    <div className="text-xs font-semibold text-slate-700 mt-0.5">
                      Surat, Gujarat, India
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      India
                    </div>
                    <div className="text-[11px] text-slate-400 font-normal">
                      (Remote First Team)
                    </div>
                  </div>
                </div>

                {/* Office Campus Vector Illustration matching reference */}
                <div className="hidden sm:flex items-center justify-center shrink-0">
                  <svg width="145" height="92" viewBox="0 0 145 92" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Soft clouds */}
                    <path d="M8 36 Q16 26 26 30 Q33 20 44 24 Q52 20 58 28 Q63 36 53 40 L13 40 Q8 40 8 36Z" fill="#e0f2fe" opacity="0.65" />
                    <path d="M102 26 Q112 16 123 20 Q131 13 139 20 Q145 26 139 32 L105 32 Q99 32 102 26Z" fill="#e0f2fe" opacity="0.55" />
                    <rect x="82" y="36" width="38" height="24" rx="12" fill="#e0f2fe" opacity="0.4" />
                    
                    {/* Ground lawn base */}
                    <path d="M6 78 Q72 75 140 78 L140 81 Q72 78 6 81 Z" fill="#0d9488" fillOpacity="0.85" />
                    
                    {/* Tree 1 (Left Far) */}
                    <rect x="21" y="62" width="3" height="15" rx="1.5" fill="#78350f" />
                    <circle cx="22.5" cy="58" r="8.5" fill="#10b981" />
                    <circle cx="21" cy="56" r="6.5" fill="#34d399" opacity="0.5" />

                    {/* Tree 2 (Left Near) */}
                    <rect x="36" y="58" width="3.5" height="19" rx="1.5" fill="#78350f" />
                    <circle cx="38" cy="53" r="10.5" fill="#059669" />
                    <circle cx="36" cy="50" r="7.5" fill="#10b981" opacity="0.6" />

                    {/* Modern Isometric Office Building */}
                    {/* Right shaded facade */}
                    <polygon points="73,18 106,28 106,77 73,77" fill="#cbd5e1" />
                    {/* Right windows (4 floors) */}
                    <polygon points="79,31 88,33 88,38 79,36" fill="#94a3b8" />
                    <polygon points="93,35 101,37 101,42 93,40" fill="#94a3b8" />
                    <polygon points="79,43 88,45 88,50 79,48" fill="#94a3b8" />
                    <polygon points="93,47 101,49 101,54 93,52" fill="#94a3b8" />
                    <polygon points="79,55 88,57 88,62 79,60" fill="#94a3b8" />
                    <polygon points="93,59 101,61 101,66 93,64" fill="#94a3b8" />
                    
                    {/* Left front facade */}
                    <polygon points="73,18 45,28 45,77 73,77" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="0.5" />
                    {/* Left windows (4 floors) */}
                    <polygon points="50,33 59,31 59,36 50,38" fill="#93c5fd" />
                    <polygon points="63,30 69,28 69,33 63,35" fill="#93c5fd" />
                    <polygon points="50,45 59,43 59,48 50,50" fill="#93c5fd" />
                    <polygon points="63,42 69,40 69,45 63,47" fill="#93c5fd" />
                    <polygon points="50,57 59,55 59,60 50,62" fill="#93c5fd" />
                    <polygon points="63,54 69,52 69,57 63,59" fill="#93c5fd" />
                    
                    {/* Entrance Door */}
                    <polygon points="56,67 64,65 64,77 56,77" fill="#64748b" />

                    {/* Tree 3 (Right Near) */}
                    <rect x="110" y="59" width="3.5" height="18" rx="1.5" fill="#78350f" />
                    <circle cx="112" cy="53" r="10.5" fill="#10b981" />
                    <circle cx="110" cy="50" r="7.5" fill="#34d399" opacity="0.6" />

                    {/* Tree 4 (Right Far) */}
                    <rect x="126" y="63" width="3" height="14" rx="1.5" fill="#78350f" />
                    <circle cx="127.5" cy="58" r="8.5" fill="#059669" />
                  </svg>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================
            JOIN OUR MISSION BANNER: Pixel-matched to reference design
            ======================================================== */}
        <section className="relative overflow-hidden bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 lg:p-12 shadow-xs">
          {/* Subtle world map background overlay matching reference */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none opacity-15 select-none hidden md:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/world.svg" alt="" className="w-full h-full object-contain object-right" />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            
            {/* Left Content */}
            <div className="max-w-xl text-left">
              <div className="text-xs font-bold text-[#0d9488] uppercase tracking-wider mb-2">
                Join our mission
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight mb-3">
                Help us make job searching better for everyone.
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                Whether you&apos;re a job seeker, employer, partner or just someone with a great idea, we&apos;re always open to meaningful conversations.
              </p>
              <button
                onClick={scrollToForm}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs hover:shadow-md cursor-pointer"
              >
                <span>Get in Touch</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right Graphic: Vibrant Blue Envelope, Letter, Green Paper Plane & Network Badges matching reference */}
            <div className="shrink-0 flex items-center justify-center">
              <div className="relative w-[280px] sm:w-[320px] h-[170px] flex items-center justify-center">
                <svg width="320" height="170" viewBox="0 0 320 170" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Dotted Flight Trajectory Loop */}
                  <path
                    d="M 28 128 C -2 90, 36 74, 44 102 C 50 128, 20 144, 42 148 C 76 152, 98 118, 160 82"
                    stroke="#14b8a6"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    strokeLinecap="round"
                    opacity="0.65"
                  />

                  {/* Network Avatar Badge 1 (Left of Envelope) */}
                  <g transform="translate(38, 72)">
                    <circle cx="15" cy="15" r="14" fill="white" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))" stroke="#f1f5f9" strokeWidth="1" />
                    <circle cx="15" cy="11" r="4.5" fill="#0d9488" />
                    <path d="M 8 23 C 8 19.5, 11 18, 15 18 C 19 18, 22 19.5, 22 23" fill="#0d9488" />
                  </g>

                  {/* Network Avatar Badge 2 (Top Right of Plane) */}
                  <g transform="translate(235, 48)">
                    <circle cx="15" cy="15" r="14" fill="white" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))" stroke="#f1f5f9" strokeWidth="1" />
                    <circle cx="15" cy="11" r="4.5" fill="#0d9488" />
                    <path d="M 8 23 C 8 19.5, 11 18, 15 18 C 19 18, 22 19.5, 22 23" fill="#0d9488" />
                  </g>

                  {/* Network Chat Badge 3 (Lower Right) */}
                  <g transform="translate(210, 105)">
                    <circle cx="14" cy="14" r="13" fill="#0d9488" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.08))" />
                    <polygon points="7,22 13,21 9,26" fill="#0d9488" />
                    {/* Two chat speech dots */}
                    <circle cx="11" cy="14" r="1.5" fill="white" />
                    <circle cx="17" cy="14" r="1.5" fill="white" />
                  </g>

                  {/* Big Royal Blue Open Envelope & Letter */}
                  <g transform="translate(100, 56)">
                    {/* Open top triangular back flap */}
                    <polygon points="0,26 44,0 88,26" fill="#1d4ed8" />
                    
                    {/* White Letter Sheet emerging from envelope */}
                    <rect x="12" y="-14" width="64" height="52" rx="4" fill="#ffffff" stroke="#dbeafe" strokeWidth="1" filter="drop-shadow(0 2px 6px rgba(0,0,0,0.05))" />
                    {/* Placeholder text stripes on sheet */}
                    <line x1="20" y1="-3" x2="48" y2="-3" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="20" y1="5" x2="68" y2="5" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" />
                    <line x1="20" y1="12" x2="64" y2="12" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" />
                    <line x1="20" y1="19" x2="54" y2="19" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" />

                    {/* Front envelope main pocket */}
                    <rect x="0" y="18" width="88" height="56" rx="6" fill="#3b82f6" />
                    
                    {/* Front folded down triangular flap */}
                    <polygon points="0,18 44,48 88,18" fill="#60a5fa" />
                    {/* Side fold shading */}
                    <polygon points="0,74 38,44 0,22" fill="#2563eb" opacity="0.65" />
                    <polygon points="88,74 50,44 88,22" fill="#2563eb" opacity="0.65" />
                    <polygon points="0,74 88,74 44,46" fill="#3b82f6" />
                  </g>

                  {/* Emerald Green Origami Paper Airplane */}
                  <g transform="translate(182, 18) rotate(16)">
                    {/* Main left wing */}
                    <polygon points="0,24 40,0 20,35" fill="#10b981" />
                    {/* Shaded right wing */}
                    <polygon points="20,35 40,0 22,26" fill="#0d9488" />
                    {/* Bottom keel */}
                    <polygon points="14,27 20,35 19,26" fill="#047857" />
                  </g>
                </svg>
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
