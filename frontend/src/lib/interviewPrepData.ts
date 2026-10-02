export interface HrInterviewQuestion {
  id: string;
  question: string;
  category: "General HR" | "Behavioral & Conflict" | "Motivation & Fit";
  whatEvaluated: string;
  howToStructure: string[];
  sampleAnswer: string;
  whatToAvoid: string[];
  toneGuidance: string;
}

export interface InterviewEtiquetteItem {
  topic: string;
  category: "Body Language & Posture" | "Communication & Tone" | "Handling Unknowns" | "Virtual & In-Person Protocol";
  guidance: string;
  doList: string[];
  dontList: string[];
}

export interface CommonMistakeItem {
  mistake: string;
  impact: string;
  howToFix: string;
}

export const COMMON_HR_QUESTIONS: HrInterviewQuestion[] = [
  {
    id: "hr-tell-me-about-yourself",
    question: "Tell me about yourself.",
    category: "General HR",
    whatEvaluated: "Communication clarity, ability to synthesize career trajectory, professional confidence, and immediate alignment with the role.",
    howToStructure: [
      "Present: Current role, major technical domain, and high-impact recent achievement.",
      "Past: Brief background on how you built your foundational expertise and engineering rigor.",
      "Future: Why this specific team and challenge represents the natural next chapter in your career."
    ],
    sampleAnswer: "I'm a software engineer with over 3 years of experience building high-throughput backend services and data pipelines. Currently at my company, I lead the core ingestion service that processes over 15 million events daily with 99.98% uptime. Previously, I honed my CS fundamentals and systems design while shipping customer-facing web applications. Outside of daily feature delivery, I focus heavily on query optimization and resilient distributed patterns. I'm excited about this opportunity at your team because you operate at massive real-time scale, and my background in low-latency systems directly maps to the latency challenges you're tackling.",
    whatToAvoid: [
      "Do NOT recite your entire chronological resume from high school onwards.",
      "Do NOT share personal biographical or family details unrelated to your career.",
      "Do NOT ramble for longer than 90–120 seconds."
    ],
    toneGuidance: "Energetic, structured, executive-level concise, and forward-looking."
  },
  {
    id: "hr-why-should-we-hire-you",
    question: "Why should we hire you?",
    category: "Motivation & Fit",
    whatEvaluated: "Self-awareness, understanding of the company's pain points, and ability to articulate your unique value proposition.",
    howToStructure: [
      "Highlight 2-3 overlapping superpowers (e.g. technical depth + execution speed + business sense).",
      "Give concrete evidence of past execution under similar constraints.",
      "Connect your personal drive to how quickly you will become a net-positive contributor."
    ],
    sampleAnswer: "You should hire me because I bring a proven track record of converting ambiguous business goals into resilient, production-ready systems quickly. In my last role, when our reporting pipeline struggled with 4x volume growth, I redesigned our partitioning strategy, cutting query costs by 40% and latency by 65%. I combine strong technical fundamentals with a focus on business metrics—meaning I don't just write clean code, I build features that move key KPIs. I can ramp up within two weeks and start delivering value to your sprint commitments immediately.",
    whatToAvoid: [
      "Do NOT give generic answers like 'I work hard and learn fast' without proof.",
      "Do NOT sound arrogant or disparage other potential candidates."
    ],
    toneGuidance: "Confident, data-driven, humble, and results-oriented."
  },
  {
    id: "hr-why-this-company",
    question: "Why do you want to join our company?",
    category: "Motivation & Fit",
    whatEvaluated: "Genuine interest, depth of company research, understanding of their product/market, and long-term retention potential.",
    howToStructure: [
      "Specific Product/Technology reference: Mention an actual feature, technical blog post, or engineering challenge.",
      "Culture/Scale alignment: Why their mission resonates with your values.",
      "Mutual growth: How you will contribute to their current growth phase."
    ],
    sampleAnswer: "I've been following your engineering blog, particularly the recent write-up on migrating your core payment gateway to an event-driven architecture. The engineering discipline required to process millions of transactions with zero data loss aligns directly with the standards I hold in my own work. Furthermore, your product is solving a real friction point for hundreds of thousands of users daily. I want to build systems where high performance and customer empathy meet, and your team is leading that benchmark in this industry.",
    whatToAvoid: [
      "Never say 'Because you are a top brand' or 'The compensation is high'.",
      "Do NOT give an answer that could apply to any other company."
    ],
    toneGuidance: "Authentic, researched, respectful, and enthusiastic."
  },
  {
    id: "hr-strengths",
    question: "What are your greatest strengths?",
    category: "General HR",
    whatEvaluated: "Self-awareness, technical strengths supported by concrete examples, and operational discipline.",
    howToStructure: [
      "Primary technical superpower with measurable proof.",
      "Collaboration / leadership strength that elevates team velocity.",
      "Resilience when debugging or facing tight deadlines."
    ],
    sampleAnswer: "My primary strength is root-cause diagnosis and systems optimization under pressure. When our team faced recurring database lock timeouts during peak traffic, I profiled our transaction isolation levels and refactored our hot-path queries, eliminating incidents entirely. My second key strength is technical empathy—I take pride in writing self-documenting code, thorough API contracts, and onboarding docs so teammates can ship faster without friction.",
    whatToAvoid: [
      "Listing 10 adjectives without any context or metrics.",
      "Claiming perfection in areas irrelevant to the job."
    ],
    toneGuidance: "Grounded, objective, and backed by verifiable outcomes."
  },
  {
    id: "hr-weakness",
    question: "What is your greatest weakness?",
    category: "General HR",
    whatEvaluated: "Honesty, self-awareness, willingness to accept feedback, and continuous improvement mechanisms.",
    howToStructure: [
      "State a genuine professional area of improvement (not a disguised humblebrag).",
      "Explain the exact trigger or context where it manifested.",
      "Detail the concrete mitigation strategies and tools you actively use to overcome it."
    ],
    sampleAnswer: "Early in my career, I had a tendency to dive straight into implementation before documenting edge cases or soliciting early design feedback from teammates, which once led to a sprint refactor. Recognizing this, I instituted a personal rule: for any feature touching shared services, I write a 1-page design RFC with architecture diagrams and API contracts before writing code. This shift has not only improved my code quality but has saved our team significant review cycles.",
    whatToAvoid: [
      "Never say 'I am a perfectionist' or 'I work too hard'.",
      "Never state a fatal flaw for the role (e.g. 'I hate working with people' or 'I miss deadlines')."
    ],
    toneGuidance: "Candid, proactive, growth-minded, and self-regulated."
  },
  {
    id: "hr-5-years",
    question: "Where do you see yourself in 5 years?",
    category: "Motivation & Fit",
    whatEvaluated: "Career trajectory, ambition, commitment to the discipline, and realistic expectations.",
    howToStructure: [
      "Deepening domain mastery and architecture ownership (Senior/Staff level impact).",
      "Mentoring junior engineers and driving engineering best practices.",
      "Expanding cross-functional ownership across product and engineering."
    ],
    sampleAnswer: "Over the next 5 years, I see myself growing into a technical leader who owns critical architectural decisions and drives system scalability. In the immediate 1-2 years, my focus is delivering exceptional depth in this role, mastering your codebase and domain. By year 3 to 5, I aim to lead architectural RFCs, mentor incoming engineers, and bridge technical roadmap planning with product strategy.",
    whatToAvoid: [
      "Saying 'I want to be your boss' or 'I want to start my own company next year'.",
      "Saying 'I don't know, I take things day by day'."
    ],
    toneGuidance: "Ambitious, committed, steady, and team-aligned."
  },
  {
    id: "hr-conflict",
    question: "Tell me about a conflict or disagreement with a teammate and how you handled it.",
    category: "Behavioral & Conflict",
    whatEvaluated: "Emotional intelligence, de-escalation skills, collaboration, and objective decision-making.",
    howToStructure: [
      "Situation: The specific technical or architectural disagreement (keep it objective, no personal attacks).",
      "Task: The shared team goal that needed to be achieved.",
      "Action: How you separated personalities from data, ran benchmarks, or found compromise.",
      "Result: The positive outcome for the system and the strengthened relationship."
    ],
    sampleAnswer: "During a major service redesign, a senior peer advocated for MongoDB for flexibility, while I proposed PostgreSQL with JSONB because 80% of our queries required strict ACID relational consistency. Instead of debating theoretically, I proposed a timeboxed 2-day spike. We wrote benchmark scripts simulating our write volume and read query patterns. The benchmarks revealed that PostgreSQL with appropriate indexes handled our analytical reporting with 3x lower memory overhead. We reviewed the data together, agreed on Postgres, and shipped on time. Most importantly, our mutual respect grew because we made the decision based on customer data rather than seniority.",
    whatToAvoid: [
      "Blaming the other person or portraying them as incompetent.",
      "Claiming you have never had a disagreement in your career."
    ],
    toneGuidance: "Professional, mature, diplomatic, and data-centric."
  },
  {
    id: "hr-failure",
    question: "Tell me about a time you failed or made a mistake.",
    category: "Behavioral & Conflict",
    whatEvaluated: "Accountability, blameless post-mortem mindset, and learning under failure.",
    howToStructure: [
      "Situation: What went wrong and your direct responsibility in the incident.",
      "Immediate Action: How you prioritized customer impact mitigation and rollbacks.",
      "Root Cause & Long-term Fix: What guardrails, tests, or CI checks you added to ensure it never happens again."
    ],
    sampleAnswer: "Last year, I deployed a database migration that accidentally caused a lock contention on our users table, resulting in 8 minutes of elevated 504 errors on our checkout endpoint. I immediately initiated a rollback with our on-call engineer and restored service. In the blameless post-mortem, I took full responsibility for not testing the migration against a shadow copy of production data with live query volume. To permanently resolve this, I authored a migration checklist, introduced automated lock timeout safeguards, and instituted zero-downtime column addition patterns across our team repository.",
    whatToAvoid: [
      "Deflecting blame onto DevOps, QA, or junior teammates.",
      "Downplaying the severity or hiding the mistake."
    ],
    toneGuidance: "Humble, completely accountable, solution-focused, and resilient."
  },
  {
    id: "hr-proud-project",
    question: "Describe a project you are particularly proud of.",
    category: "General HR",
    whatEvaluated: "Technical ownership, complexity handling, collaboration, and metric-driven impact.",
    howToStructure: [
      "Context & Problem: The high-stakes business or technical bottleneck.",
      "Your Ownership: Specific architecture and code modules you designed.",
      "Quantitative Results: Performance speedup, cost savings, or user adoption."
    ],
    sampleAnswer: "I led the development of our automated invoice reconciliation engine. Previously, our finance team manually reconciled 40,000 monthly transactions, leading to 3 days of delay at month-end close. I architected an asynchronous event-driven pipeline using message queues and idempotent workers that matched transactions against bank ledger webhooks with fuzzy matching logic. The system reduced end-of-month reconciliation time from 72 hours to under 15 minutes, with a 99.9% automated match rate. Seeing our finance team regain hundreds of hours every quarter was tremendously gratifying.",
    whatToAvoid: [
      "Claiming full credit for work done by a 10-person team.",
      "Focusing only on code without mentioning the business value."
    ],
    toneGuidance: "Passionate, articulate, humble, and outcome-oriented."
  }
];

export const INTERVIEW_ETIQUETTE_GUIDE: InterviewEtiquetteItem[] = [
  {
    topic: "Body Language & Posture",
    category: "Body Language & Posture",
    guidance: "Non-verbal cues set the emotional tone within the first 30 seconds. Strong posture communicates competence, calm, and focus.",
    doList: [
      "Sit upright with your shoulders relaxed and back against the chair; lean forward slightly (5-10 degrees) when listening.",
      "Keep hands visible on the desk or lap; use open-palm hand gestures to emphasize points.",
      "Maintain consistent eye contact (look directly into the webcam during virtual interviews, not down at your screen)."
    ],
    dontList: [
      "Never slouch, lean back excessively, or cross your arms defensively.",
      "Avoid nervous fidgeting: tapping pens, swinging in rotating chairs, or touching your face repeatedly.",
      "Don't stare continuously without blinking; natural facial expressions show active listening."
    ]
  },
  {
    topic: "Speaking Pace & Vocal Tone",
    category: "Communication & Tone",
    guidance: "Nervous candidates naturally speak 30% faster than normal. Controlled pacing conveys senior-level composure.",
    doList: [
      "Deliberately slow down your speaking cadence by 15-20% compared to casual conversation.",
      "Use intentional pauses (1-2 seconds) between sentences rather than filler words ('um', 'like', 'you know').",
      "Vary your vocal inflection so your explanation sounds engaging and conversational rather than robotic."
    ],
    dontList: [
      "Never speak in a monotone pitch.",
      "Don't trail off at the end of sentences with uptalk (raising pitch like asking a question).",
      "Never interrupt the interviewer while they are asking or clarifying a question."
    ]
  },
  {
    topic: "Handling Questions You Don't Know",
    category: "Handling Unknowns",
    guidance: "Interviewers deliberately ask questions beyond your current knowledge boundary to evaluate how you reason in unfamiliar situations.",
    doList: [
      "Acknowledge the boundary transparently: 'I haven't worked with that specific tool directly in production, but based on my knowledge of distributed caches, here is how I would reason about it...'",
      "Think out loud: break the problem into first principles and explain your mental model.",
      "Ask calibrating questions: 'Is our priority here read throughput or strong data consistency?'"
    ],
    dontList: [
      "Never pretend to know an API, algorithm, or metric when you do not; experienced interviewers see right through bluffing.",
      "Never freeze or say 'I don't know' without attempting a principled problem-solving approach."
    ]
  },
  {
    topic: "Online vs In-Person Protocol",
    category: "Virtual & In-Person Protocol",
    guidance: "High technical competence can be masked by poor audio or visual setup. Treat virtual setups with the same rigor as in-person executive meetings.",
    doList: [
      "Camera at eye level: elevate your laptop on a stand so you aren't looking down.",
      "Lighting: ensure primary light source is in FRONT of you, never behind you (avoid silhouettes).",
      "Audio: use a dedicated headset or directional microphone; test levels 15 minutes before call.",
      "In-person: arrive 10-15 minutes early, bring 2 printed copies of your resume, and offer a firm handshake with a warm smile."
    ],
    dontList: [
      "Never conduct an interview from an unmade bed or noisy coffee shop.",
      "Never keep notifications or browser alert sounds active on your machine during screen-share."
    ]
  }
];

export const COMMON_INTERVIEW_MISTAKES: CommonMistakeItem[] = [
  {
    mistake: "Jumping into Code / SQL Before Clarifying Requirements",
    impact: "Signals lack of senior engineering discipline; often results in solving the wrong problem or missing crucial edge cases.",
    howToFix: "Always spend the first 3-5 minutes clarifying constraints: input bounds, nullability, expected scale, time vs memory trade-offs, and edge cases."
  },
  {
    mistake: "Silent Coding (Working in Your Head)",
    impact: "The interviewer cannot grade your thought process; if you make a mistake, they cannot provide timely course-correction hints.",
    howToFix: "Narrate your thought process out loud continuously: 'I am currently considering a two-pointer approach because the array is sorted, which would give us O(n) time...'"
  },
  {
    mistake: "Rambling Without Structure",
    impact: "Dilutes your key points and frustrates the interviewer who has a tight 45-minute agenda.",
    howToFix: "Use the STAR framework (Situation, Task, Action, Result) for behavioral questions, and Top-Down structure for system design and architecture."
  },
  {
    mistake: "Negative Talk About Past Employers or Teammates",
    impact: "Immediate red flag for culture fit; interviewers assume you will speak the same way about their team in the future.",
    howToFix: "Frame past frustrations as engineering challenges or learning moments focused on constructive architectural decisions."
  },
  {
    mistake: "Saying 'We' Exclusively Instead of 'I'",
    impact: "Leaves the interviewer unsure what portion of the project you personally designed, built, and executed.",
    howToFix: "Use 'Our team was tasked with X, and my specific ownership was designing the ingestion pipeline and database schema Y.'"
  }
];
