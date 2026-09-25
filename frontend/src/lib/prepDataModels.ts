export interface RoadmapStep {
  id: string;
  stepNumber: number;
  title: string;
  focus: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  subtopics: string[];
  recommendedAction: string;
  resourceName?: string;
  resourceUrl?: string;
}

export interface InterviewRound {
  step: string;
  title: string;
  focus: string;
  description: string;
  tips: string[];
  keyQuestions: string[];
}

export interface AssessmentSection {
  title: string;
  weightage: string;
  description: string;
  keyTopics: string[];
  sampleQuestion: string;
  preparationTip: string;
}

export interface InterviewCategory {
  categoryName: string;
  description: string;
  questionCount: number;
  topicsCovered: string[];
  sampleQuestions: {
    question: string;
    expectedApproach: string;
    difficulty: "Easy" | "Medium" | "Hard";
  }[];
}

export interface PracticeQuestion {
  id: string;
  topic: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  type: "Coding" | "SQL" | "Conceptual" | "Case Study" | "Architecture";
  questionText: string;
  solutionHint: string;
  companyTags: string[];
}

export interface PrepProject {
  id: string;
  title: string;
  difficulty: "Intermediate" | "Advanced";
  skillsCovered: string[];
  whatItDemonstrates: string;
  recommendedStack: string[];
  talkingPoints: string[];
}

export interface ResumeGuidance {
  targetRole: string;
  atsKeywords: string[];
  mustHaveSections: string[];
  recommendedProjectTypes: string[];
  actionVerbs: string[];
  commonMistakes: string[];
  sampleBulletPoints: string[];
}

export interface StudySheetItem {
  title: string;
  category: string;
  provider: string;
  description: string;
  url: string;
  badge?: string;
}

export interface CareerPathwayLevel {
  stage: string;
  experience: string;
  compensation: string;
  focus: string;
  responsibilities: string;
  requiredSkills: string[];
}

export interface PrepRole {
  id: string;
  name: string;
  category: "Engineering" | "Data & AI" | "Product & Design" | "Security & Ops" | "Business";
  badge: string;
  tagline: string;
  overview: {
    coreSkills: string[];
    recommendedTopics: string[];
    interviewAreas: string[];
    assessmentAreas: string[];
    typicalProjects: string[];
    estimatedWeeks: string;
    avgFresherSalary: string;
    avgSeniorSalary: string;
  };
  roadmap: RoadmapStep[];
  skills: {
    mustKnow: string[];
    goodToKnow: string[];
    advanced: string[];
    toolsAndTech: string[];
  };
  interviewRounds: InterviewRound[];
  assessmentPrep: AssessmentSection[];
  interviewCategories: InterviewCategory[];
  practiceQuestions: PracticeQuestion[];
  projects: PrepProject[];
  resumeGuidance: ResumeGuidance;
  studySheets: StudySheetItem[];
  careerPathways: CareerPathwayLevel[];
}

export interface CompanyPrepItem {
  id: string;
  name: string;
  logo: string;
  totalQuestions: number;
  atsUsed: string;
  hiringPhilosophy: string;
  roleQuestions: Record<string, {
    rounds: string[];
    focusAreas: string[];
    frequentlyAsked: string[];
    insiderTip: string;
  }>;
}

export const PREP_COMPANIES: CompanyPrepItem[] = [
  {
    id: "google",
    name: "Google",
    logo: "https://www.google.com/favicon.ico",
    totalQuestions: 120,
    atsUsed: "Greenhouse / Internal ATS",
    hiringPhilosophy: "Focus on Googleyness, algorithmic complexity, distributed systems scalability, and clean modular code.",
    roleQuestions: {
      "software-engineer": {
        rounds: ["Phone Screen (45m DSA)", "Coding 1 (Graphs/DP)", "Coding 2 (Trees/Recursion)", "System Design (Scalability)", "Googliness & Leadership"],
        focusAreas: ["Time/Space Complexity", "Binary Trees & Graphs", "Dynamic Programming", "Low Latency Caching"],
        frequentlyAsked: ["Word Ladder II", "Median of Two Sorted Arrays", "Design a Distributed Rate Limiter", "LRU Cache Implementation"],
        insiderTip: "Always clarify constraints and state the brute force complexity before jumping to code."
      },
      "data-scientist": {
        rounds: ["Technical Screen (Python/SQL)", "Machine Learning Theory", "Applied Modeling & Experimentation", "Product Metrics & A/B Testing", "Behavioral"],
        focusAreas: ["Hypothesis Testing", "A/B Test Design", "Regression & Tree-based Models", "Evaluation Metrics (ROC, AUC)"],
        frequentlyAsked: ["How would you measure the success of YouTube Shorts recommendation?", "Explain bias-variance trade-off mathematically", "How to handle extreme class imbalance in ad click prediction?"],
        insiderTip: "Google values experimental rigor and understanding why an algorithm works over just library calls."
      },
      "data-analyst": {
        rounds: ["SQL Live Coding", "Business Sense & Metric Definition", "Data Visualization & Insights", "Behavioral / Problem Solving"],
        focusAreas: ["Complex Window Functions", "Self Joins & CTEs", "Cohort Analysis", "Retention & Funnel Metrics"],
        frequentlyAsked: ["Calculate 7-day rolling active users from activity logs", "How would you identify cannibalization between Google Search and Google Discover?", "Design an executive dashboard for Google Cloud churn"],
        insiderTip: "Structure your business answers with MECE (Mutually Exclusive, Collectively Exhaustive) frameworks."
      },
      "data-engineer": {
        rounds: ["SQL & Data Modeling", "Distributed Computing (Spark/MapReduce)", "Pipeline Design & Idempotency", "System Architecture & Storage", "Behavioral"],
        focusAreas: ["Partitioning & Sharding", "Late-arriving Data", "SCD Type 2", "Data Quality & Reconciliation"],
        frequentlyAsked: ["Design an ETL pipeline to ingest 10B events daily into BigQuery", "Explain data skew handling in Spark joins", "How would you handle backfilling 6 months of historical data with zero downtime?"],
        insiderTip: "Focus on idempotency, backfilling mechanisms, and storage cost trade-offs."
      },
      "product-manager": {
        rounds: ["Product Sense & Design", "Product Strategy", "Analytical & Metrics", "Technical Fluency", "Googliness & Leadership"],
        focusAreas: ["First-principles Thinking", "TAM & Market Sizing", "Metric Tree Hierarchy", "Technical Architecture Trade-offs"],
        frequentlyAsked: ["Design an automated luggage tracking product for Google Maps", "Google Photos storage is full—how do you monetize without losing DAUs?", "How does Google Search indexing work under the hood?"],
        insiderTip: "Start with user segments and their pain points before proposing features. Never jump to solutions."
      }
    }
  },
  {
    id: "microsoft",
    name: "Microsoft",
    logo: "https://www.microsoft.com/favicon.ico",
    totalQuestions: 100,
    atsUsed: "Internal Career Portal",
    hiringPhilosophy: "Strong emphasis on Growth Mindset, solid engineering fundamentals, object-oriented design, and customer empathy.",
    roleQuestions: {
      "software-engineer": {
        rounds: ["Codility Assessment", "Technical 1 (Strings/Arrays/Recursion)", "Technical 2 (Trees/Linked Lists)", "System Design (Azure scale)", "AA / Hiring Manager Round"],
        focusAreas: ["OOP & Design Patterns", "Data Structures", "Multithreading & Concurrency", "Cloud Services"],
        frequentlyAsked: ["Serialize and Deserialize a Binary Tree", "Design an In-Memory File System", "Reverse Nodes in k-Group", "Implement Thread-safe Singleton"],
        insiderTip: "Write production-ready code with proper error handling and clean variable naming."
      },
      "data-scientist": {
        rounds: ["Online Assessment", "Coding & Data Manipulation (Python)", "Machine Learning & Algorithms", "Business Case & Scenario", "Manager Round"],
        focusAreas: ["Gradient Boosting (XGBoost/LightGBM)", "Feature Engineering", "A/B Testing", "Azure ML"],
        frequentlyAsked: ["Explain how LightGBM differs from XGBoost", "How would you predict Teams meeting drop-off rate?", "Design a customer churn model for Office 365 enterprise"],
        insiderTip: "Tie machine learning metrics directly to business ROI and customer retention."
      },
      "data-analyst": {
        rounds: ["SQL Assessment", "Excel / Power BI Case", "Business Analytics & Problem Solving", "Behavioral"],
        focusAreas: ["SQL Joins & Aggregations", "Power BI DAX", "Financial Modeling", "Executive Storytelling"],
        frequentlyAsked: ["Write SQL to find top 3 products by revenue in each category per month", "How would you calculate ARR and MRR for subscription services?", "A key business KPI dropped 15% yesterday. How do you triage?"],
        insiderTip: "Microsoft interviewers love structured root-cause analysis when metrics drop."
      },
      "data-engineer": {
        rounds: ["Coding & Algorithms", "SQL & Relational/NoSQL Modeling", "Big Data Architecture", "Azure Data Factory & Synapse", "Managerial"],
        focusAreas: ["Azure Event Hubs / Kafka", "Delta Lake / Parquet", "Data Warehousing", "ETL Reliability"],
        frequentlyAsked: ["Design a real-time telemetry pipeline for Windows operating system error reporting", "Explain partitioning vs clustering in Azure Synapse / Snowflake", "How do you detect schema drift?"],
        insiderTip: "Emphasize data governance, privacy compliance (GDPR), and schema evolution."
      },
      "product-manager": {
        rounds: ["Product Design", "Strategy & Execution", "Analytical Problem Solving", "Partner & Growth Mindset"],
        focusAreas: ["Enterprise B2B vs Consumer", "Customer Empathy", "Telemetry & KPIs", "Platform Extensibility"],
        frequentlyAsked: ["How would you improve Microsoft Teams for remote classrooms?", "Design a generative AI feature for Outlook", "Xbox subscription growth has plateaued in Tier-2 markets. What do you do?"],
        insiderTip: "Show genuine empathy for both enterprise administrators and end users."
      }
    }
  },
  {
    id: "amazon",
    name: "Amazon",
    logo: "https://www.amazon.com/favicon.ico",
    totalQuestions: 150,
    atsUsed: "Internal iCIMS / Amazon Jobs",
    hiringPhilosophy: "Driven strictly by the 16 Leadership Principles (Customer Obsession, Ownership, Bias for Action, Dive Deep). Every question maps to an LP.",
    roleQuestions: {
      "software-engineer": {
        rounds: ["OA (Debugging + 2 Coding + Work Simulation)", "Technical 1 (Coding + 2 LPs)", "Technical 2 (Coding + 2 LPs)", "System Design (AWS architecture + 2 LPs)", "Bar Raiser (Deep dive + 2 LPs)"],
        focusAreas: ["Leadership Principles (STAR method)", "BFS/DFS", "Dynamic Programming", "Object-Oriented Design", "AWS Scalability"],
        frequentlyAsked: ["Design Amazon Locker System (LLD)", "Course Schedule II", "Trapping Rain Water", "Design Amazon Prime Day Checkout System"],
        insiderTip: "Every answer MUST use the STAR method (Situation, Task, Action, Result) with quantifiable business impact."
      },
      "data-scientist": {
        rounds: ["OA (ML & Coding)", "Technical Coding (Python/SQL)", "Machine Learning & Deep Dive", "Science Bar Raiser", "Hiring Manager"],
        focusAreas: ["Forecasting & Time Series", "Customer Lifetime Value", "Recommender Systems", "STAR Behavioral"],
        frequentlyAsked: ["How would you forecast inventory demand for perishable groceries on Amazon Fresh?", "Explain the mathematical formulation of Collaborative Filtering", "Tell me about a time you made a decision with incomplete data."],
        insiderTip: "Have 2 detailed STAR stories ready for each of Customer Obsession, Ownership, and Invent & Simplify."
      },
      "data-analyst": {
        rounds: ["SQL & Business Simulation Assessment", "Technical SQL Live Screen", "Data Interpretation & Business Case", "Bar Raiser Interview"],
        focusAreas: ["Advanced SQL", "Cohort Retention", "Logistics & Supply Chain Metrics", "Leadership Principles"],
        frequentlyAsked: ["Write SQL to identify fraud in refund requests across overlapping accounts", "Warehouse shipping delays increased by 8% in the Midwest. Walk me through your investigation.", "Tell me about a time you used data to push back against a senior leader."],
        insiderTip: "Focus on Dive Deep: show how you peel back layers of data until the true root cause is identified."
      },
      "data-engineer": {
        rounds: ["SQL & Python Coding", "Data Modeling & Redshift Architecture", "ETL & Streaming Architecture", "Bar Raiser (Scaling & Reliability)"],
        focusAreas: ["AWS Redshift & EMR", "Kafka & Kinesis", "Data Lake Architecture (S3)", "Data Catalog & Governance"],
        frequentlyAsked: ["Design an end-to-end data pipeline to process 1M clickstream events per second", "Explain distribution keys and sort keys in Redshift", "Tell me about a time your data pipeline failed in production and how you recovered."],
        insiderTip: "Highlight fault tolerance, automatic retry queues, dead-letter queues, and monitoring."
      },
      "product-manager": {
        rounds: ["Writing Sample (PR/FAQ Document)", "Customer Obsession & Design", "Strategy & Metrics", "Technical Fluency", "Bar Raiser"],
        focusAreas: ["Working Backwards from Customer", "PR/FAQ Writing", "Operational Metrics", "High-judgment Decisions"],
        frequentlyAsked: ["Write a 1-page PR/FAQ for a 1-hour drone delivery service", "Amazon wants to launch an EV charging network. Build the business case.", "Tell me about a time you had to say NO to an important feature request."],
        insiderTip: "Master the 'Working Backwards' document structure (Press Release + FAQ)."
      }
    }
  },
  {
    id: "netflix",
    name: "Netflix",
    logo: "https://www.netflix.com/favicon.ico",
    totalQuestions: 85,
    atsUsed: "Lever ATS",
    hiringPhilosophy: "Freedom & Responsibility culture. Looks for senior-level autonomy, high ownership, and deep distributed systems mastery.",
    roleQuestions: {
      "software-engineer": {
        rounds: ["Recruiter Screen", "Technical Screen (Deep Systems)", "Onsite 1 (Coding & Concurrency)", "Onsite 2 (Microservices & Caching)", "Onsite 3 (Culture & Context not Control)"],
        focusAreas: ["Microservices Resiliency", "Chaos Engineering", "gRPC & Concurrency", "Culture Memo Alignment"],
        frequentlyAsked: ["Design a video streaming platform with adaptive bitrate streaming", "Implement a distributed rate limiter that handles 500k RPS", "How does Netflix handle regional AWS outages?"],
        insiderTip: "Read the Netflix Culture Memo thoroughly. They hire senior talent who thrive with minimal supervision."
      },
      "data-scientist": {
        rounds: ["Technical Deep Dive", "Algorithms & Recommendation Systems", "Product Analytics & A/B Testing", "Culture & Values"],
        focusAreas: ["Multi-Armed Bandits", "Personalized Ranking", "Artwork Personalization", "Causal Inference"],
        frequentlyAsked: ["How would you personalize movie thumbnails for individual viewers?", "Explain how multi-armed bandits improve on traditional A/B testing in streaming", "How do you evaluate video recommendation novelty vs relevance?"],
        insiderTip: "Netflix pioneered bandit algorithms for artwork personalization—study their tech blog posts."
      },
      "data-analyst": {
        rounds: ["SQL & Analytics Screen", "Content Performance Case Study", "Experimentation & Retention Analysis", "Culture Alignment"],
        focusAreas: ["Churn Modeling", "Content ROI", "Streaming Quality of Experience (QoE) Metrics", "High Autonomy"],
        frequentlyAsked: ["How would you determine if a $100M original series was a commercial success?", "Analyze the trade-off between buffering rate and user abandonment", "How do you present contrarian findings to creative executives?"],
        insiderTip: "Show confidence in interpreting ambiguous data where there is no textbook answer."
      },
      "data-engineer": {
        rounds: ["Distributed Systems Screen", "Iceberg & Spark Architecture", "Streaming Infrastructure (Flink/Kafka)", "Culture & Leadership"],
        focusAreas: ["Apache Iceberg", "Apache Spark & Flink", "Data Mesh", "Self-serve Analytics"],
        frequentlyAsked: ["How would you migrate a petabyte-scale data warehouse from Hive to Apache Iceberg?", "Design real-time analytics for video playback errors across 250M devices", "Explain exact-once semantics in streaming."],
        insiderTip: "Netflix created and heavily contributes to Apache Iceberg. Familiarize yourself with modern open data formats."
      },
      "product-manager": {
        rounds: ["Product Strategy", "Consumer Experience", "Algorithms & Machine Learning Product Sense", "Culture Fit"],
        focusAreas: ["Engagement & Retention", "Sub-product Monetization (Ad Tier)", "Global Localization", "High Ownership"],
        frequentlyAsked: ["How would you design the ad-supported tier experience without damaging subscriber retention?", "Should Netflix add interactive gaming to the main TV interface?", "How would you measure the success of non-English content in the US?"],
        insiderTip: "Emphasize customer joy and long-term retention rather than short-term clicks."
      }
    }
  },
  {
    id: "meta",
    name: "Meta",
    logo: "https://www.meta.com/favicon.ico",
    totalQuestions: 125,
    atsUsed: "Internal Career Portal",
    hiringPhilosophy: "Move Fast, Focus on Long-Term Impact, and Live in the Future. Extremely fast-paced technical coding and large-scale infrastructure.",
    roleQuestions: {
      "software-engineer": {
        rounds: ["Screen (2 DSA Problems in 45m)", "Coding 1 (2 LeetCode Medium/Hard in 45m)", "Coding 2 (2 LeetCode Medium/Hard in 45m)", "System Design (Instagram/WhatsApp scale)", "Behavioral (Impact & Speed)"],
        focusAreas: ["High-speed Bug-free Coding", "Graph Traversal", "System Design for Billions of Users", "Pragmatic Engineering"],
        frequentlyAsked: ["Lowest Common Ancestor in Binary Tree", "Merge Intervals", "Design Instagram Feed (Fan-out on write vs read)", "Design WhatsApp Message Delivery System"],
        insiderTip: "You must solve 2 medium problems in 45 minutes with working, optimal code. Speed is critical."
      },
      "data-scientist": {
        rounds: ["Product Analytics Screen", "Applied Statistics & Probability", "Machine Learning Coding", "Product Architecture & Metrics", "Behavioral"],
        focusAreas: ["Network Effects", "Engagement Metrics (DAU/MAU)", "Recommendation Feeds", "Experimentation at Scale"],
        frequentlyAsked: ["How would you detect coordinate inauthentic behavior on Facebook Groups?", "Instagram comments dropped by 4%. How do you diagnose and fix?", "Design a feed ranking algorithm balancing creator diversity and viewer dwell time."],
        insiderTip: "Always tie statistical tests to user engagement and network health."
      },
      "data-analyst": {
        rounds: ["SQL Screen (Rapid queries)", "Product Case Study (Meta family of apps)", "Metric Evaluation & Funnels", "Behavioral"],
        focusAreas: ["Fast SQL Coding", "Funnel Conversion", "Cannibalization Analysis", "Creator Monetization"],
        frequentlyAsked: ["Write SQL to calculate user retention rate by registration cohort for week 1 through week 8", "Should Meta introduce a dislike button? What metrics would you track?", "How do you measure Instagram Reels cannibalization of Stories?"],
        insiderTip: "Be prepared to write clean SQL live while explaining your logic without pausing."
      },
      "data-engineer": {
        rounds: ["Python & Algorithms", "SQL & Dimensional Modeling", "Pipeline & Distributed Data Processing", "Behavioral (Impact & Scale)"],
        focusAreas: ["Presto / Trino", "Hive / Spark Optimization", "Data Freshness SLA", "Petabyte Scaling"],
        frequentlyAsked: ["Design a pipeline to aggregate daily ad impressions across 3 billion accounts with sub-hour SLA", "Optimize a Presto query running out of memory during a huge table join", "How do you guarantee exactly-once event processing?"],
        insiderTip: "Focus on memory management, query optimization, and cost-effective compute."
      },
      "product-manager": {
        rounds: ["Product Sense (45m)", "Product Execution (45m)", "Leadership & Drive (45m)"],
        focusAreas: ["Product Sense & User Need", "Goal Setting & North Star Metrics", "Prioritization & Trade-offs", "Meta Product Ecosystem"],
        frequentlyAsked: ["How would you improve Facebook Marketplace for local communities?", "Set goals and primary metrics for Instagram Threads", "You find a bug that increases user engagement but violates privacy guidelines. What do you do?"],
        insiderTip: "Structure your Execution interview strictly: Goal -> North Star Metric -> Guardrail Metrics -> Trade-offs."
      }
    }
  },
  {
    id: "adobe",
    name: "Adobe",
    logo: "https://www.adobe.com/favicon.ico",
    totalQuestions: 90,
    atsUsed: "Workday ATS",
    hiringPhilosophy: "Creativity, technical precision, computer graphics, cloud microservices, and creative AI (Firefly).",
    roleQuestions: {
      "software-engineer": {
        rounds: ["Online Assessment", "Technical 1 (Core DSA & C++/Java)", "Technical 2 (System Design & Memory)", "Technical 3 (OOP & Architecture)", "HR / Manager"],
        focusAreas: ["Memory Management", "C++ / Java", "Computational Geometry & Graphs", "Cloud APIs"],
        frequentlyAsked: ["Implement an Undo/Redo mechanism for a canvas editor", "Detect cycle in a directed graph", "Design a collaborative cloud document syncing service like Figma / Adobe XD"],
        insiderTip: "Focus on object-oriented patterns (Command Pattern, Observer Pattern) commonly used in creative software."
      },
      "data-scientist": {
        rounds: ["Technical Screen", "Computer Vision & Generative AI", "Statistical Modeling", "Business Case & Scenario"],
        focusAreas: ["Generative Models (Diffusion)", "Computer Vision", "Creative Asset Tagging", "User Churn"],
        frequentlyAsked: ["How does Latent Diffusion work in Adobe Firefly?", "Evaluate image similarity between user upload and stock asset library", "Predict subscription renewal for Creative Cloud individual users"],
        insiderTip: "Understanding multimodal embeddings (CLIP) and generative AI evaluation gives you a huge advantage."
      },
      "data-analyst": {
        rounds: ["SQL Coding", "Business Intelligence & Visualization", "SaaS Metrics & Churn Analysis", "Behavioral"],
        focusAreas: ["SaaS Unit Economics", "LTV:CAC Ratio", "Cohort Analytics", "Product Analytics"],
        frequentlyAsked: ["Calculate Net Revenue Retention (NRR) from raw subscription transaction tables", "Analyze user drop-off in Photoshop web trial onboarding", "Design a dashboard for enterprise license utilization"],
        insiderTip: "Be crystal clear on SaaS subscription lifecycle terms (ARR, MRR, expansion, contraction, churn)."
      },
      "data-engineer": {
        rounds: ["SQL & Python Coding", "Big Data & Storage Systems", "Streaming & Event Ingestion", "Managerial"],
        focusAreas: ["Event Ingestion", "Storage Optimization", "Data Privacy & Compliance", "Cloud Data Lake"],
        frequentlyAsked: ["Design a pipeline to ingest user interaction events from Adobe Creative Cloud apps worldwide", "How to manage petabytes of image assets with tiered cloud storage?", "Implement data anonymization for telemetry data"],
        insiderTip: "Discuss balancing cloud storage cost with fast query retrieval for telemetry analysis."
      },
      "product-manager": {
        rounds: ["Product Design", "Creative Workflow & User Empathy", "Monetization & SaaS Strategy", "Executive Fit"],
        focusAreas: ["Creative Professional Workflows", "Generative AI Integration", "Freemium to Paid Conversion", "Design Systems"],
        frequentlyAsked: ["How would you integrate generative AI into Premiere Pro without disrupting professional editors?", "Design a mobile-first vector illustration app for non-designers", "How to price Adobe Firefly credits for enterprise teams?"],
        insiderTip: "Show deep appreciation for the creative user experience and non-destructive editing workflows."
      }
    }
  }
];
