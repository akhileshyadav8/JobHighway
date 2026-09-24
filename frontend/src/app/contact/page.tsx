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
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "How does JobPulse get job listings?",
    answer:
      "We connect directly to companies' official career systems (including Greenhouse, Lever, Workday, Ashby, and Taleo) and index jobs hourly without delayed third-party aggregators or recruiter spam.",
  },
  {
    question: "Is JobPulse free to use?",
    answer:
      "Yes, JobPulse is 100% free for job seekers. You can search, filter, track applications, and set custom job alerts with zero paywalls or subscription fees.",
  },
  {
    question: "How often are job listings updated?",
    answer:
      "Our automated indexing pipelines fetch and synchronize job listings every hour to ensure you see opportunities as soon as they are posted on official career portals.",
  },
  {
    question: "Can I post a job on JobPulse?",
    answer:
      "Currently, JobPulse indexes official career portals automatically. If your company's career portal is not indexed yet, contact our team using the form and we will verify and connect it.",
  },
  {
    question: "How can I report incorrect job information?",
    answer:
      "If you notice an expired listing or incorrect salary/location information, please report it via the message form selecting 'Bug Report / Technical Issue' or email support@jobpulse.com.",
  },
  {
    question: "Do you have a mobile app?",
    answer:
      "JobPulse is engineered as a fully responsive Progressive Web App (PWA). You can add it to your mobile home screen directly from your browser for an app-like experience.",
  },
  {
    question: "How can I suggest a new feature?",
    answer:
      "We actively build based on community feedback! Select 'Feature Suggestion' in the form subject dropdown and share your ideas with our engineering team.",
  },
];

export default function ContactPage() {
  const EMAIL = "support@jobpulse.com";
  const [name, setName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

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

    // Store in JobPulse Admin Inquiries store
    try {
      const existing = JSON.parse(
        localStorage.getItem("jobpulse_contact_inquiries") || "[]"
      );
      localStorage.setItem(
        "jobpulse_contact_inquiries",
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
          subject: `[JobPulse] ${subject || "New Inquiry"}`,
          from_name: `JobPulse - ${name}`,
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
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
                <span>GET IN TOUCH</span>
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
            </div>

            {/* Right Column: World Map + Global Support Floating Card */}
            <div className="lg:col-span-5 relative hidden lg:flex items-center justify-center min-h-[260px]">
              <div className="relative w-full max-w-[480px] h-[260px]">
                
                {/* World Map Vector Graphic */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-40">
                  <img
                    src="/world.svg"
                    alt="Global Career Network World Map"
                    className="w-full h-full object-contain filter drop-shadow-sm"
                  />
                </div>

                {/* Floating "Global Support" Card */}
                <div className="absolute top-[68px] right-[40px] bg-white rounded-2xl border border-slate-200/90 shadow-md p-3.5 px-4 flex items-center gap-3 z-20 hover:scale-105 transition-transform">
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
                  href="mailto:support@jobpulse.com"
                  className="text-xs font-semibold text-[#0d9488] hover:underline block mb-2"
                >
                  support@jobpulse.com
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
                  href="mailto:partnerships@jobpulse.com"
                  className="text-xs font-semibold text-[#0d9488] hover:underline block mb-2"
                >
                  partnerships@jobpulse.com
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
                  href="mailto:media@jobpulse.com"
                  className="text-xs font-semibold text-[#0d9488] hover:underline block mb-2"
                >
                  media@jobpulse.com
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
                  href="mailto:careers@jobpulse.com"
                  className="text-xs font-semibold text-[#0d9488] hover:underline block mb-2"
                >
                  careers@jobpulse.com
                </a>
                <p className="text-xs text-slate-500 leading-relaxed">
                  For career openings at JobPulse.
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Send us a message form */}
            <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 lg:p-10 shadow-xs">
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
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your message here..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-white resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div>
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

            {/* Right Column: FAQ Accordion + Our Office Card */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* FAQ Container */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Frequently Asked Questions
                  </h2>
                  <span className="text-xs font-semibold text-[#0d9488] hover:underline cursor-pointer">
                    View All →
                  </span>
                </div>

                {/* FAQ List */}
                <div className="divide-y divide-slate-100">
                  {FAQ_ITEMS.map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div key={idx} className="py-3">
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

              {/* Our Office Card */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0d9488] flex items-center justify-center shrink-0 border border-teal-100">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      Our Office
                    </h3>
                    <div className="text-xs text-slate-600 font-medium">
                      Chandigarh, India
                    </div>
                    <div className="text-[11px] text-slate-400 font-normal">
                      (Remote First Team)
                    </div>
                  </div>
                </div>

                {/* Subtle Office Vector Graphic */}
                <div className="hidden sm:flex items-center justify-center w-24 h-16 bg-slate-50 rounded-2xl border border-slate-100/90 text-teal-600">
                  <Building className="w-8 h-8 opacity-75" />
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================
            JOIN OUR MISSION BANNER
            Pixel-matched to reference design
            ======================================================== */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 lg:p-12 shadow-xs">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            
            {/* Left Content */}
            <div className="max-w-2xl text-left">
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
                <span>Get In Touch</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right Graphic: Clean Mail Envelope & Paper Airplane Visual */}
            <div className="shrink-0 flex items-center justify-center">
              <div className="relative w-36 h-28 bg-gradient-to-br from-sky-50 via-teal-50/40 to-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-center shadow-2xs">
                <div className="w-16 h-12 bg-sky-500 rounded-lg shadow-md flex items-center justify-center text-white relative">
                  <Mail className="w-7 h-7" />
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#0d9488] text-white flex items-center justify-center shadow-sm">
                    <Send className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
