export interface HrInterviewQuestion {
  id: string;
  question: string;
  category: "General HR" | "Behavioral & Conflict" | "Motivation & Fit" | "Academic & Fresher" | "Role Specific";
  whatEvaluated: string;
  howToStructure: string[];
  fresherAnswer: string;
  experiencedAnswer: string;
  roleAnswers?: {
    [roleId: string]: {
      fresher: string;
      experienced: string;
    };
  };
  whatToAvoid: string[];
  toneGuidance: string;
  followUpQuestions?: string[];
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
  // 1. Tell Me About Yourself
  {
    id: "hr-tell-me-about-yourself",
    question: "Tell me about yourself.",
    category: "General HR",
    whatEvaluated: "Communication clarity, ability to synthesize career trajectory, professional confidence, and immediate alignment with the role.",
    howToStructure: [
      "Present: Recent education/degree, core technical domain, and high-impact capstone project.",
      "Past: How you built your foundational expertise, coursework, and problem-solving practice.",
      "Future: Why this specific role and engineering/data team represents the ideal next step."
    ],
    fresherAnswer: "I recently completed my degree in Computer Science with a strong focus on software engineering, data structures, and web technologies. Throughout college, I developed a passion for writing clean, efficient code and solving algorithmic problems, completing over 200 challenges on LeetCode. For my final year capstone project, I built a full-stack task collaboration web app using React, Node.js, and PostgreSQL, implementing real-time updates with WebSockets and query optimization that sped up response times by 35%. I also interned as a software engineering trainee where I helped refactor API endpoints and wrote unit tests. I am excited about this entry-level role because your engineering team solves high-scale problems, and I am eager to contribute clean code and learn from experienced mentors.",
    experiencedAnswer: "I'm a software engineer with over 3 years of experience building high-throughput backend services and distributed pipelines. At my current company, I lead the core ingestion service that processes over 15 million events daily with 99.98% uptime. Previously, I honed my CS fundamentals and systems design while shipping customer-facing web applications. Outside of daily feature delivery, I focus heavily on query optimization and resilient distributed patterns. I'm excited about this opportunity because your team operates at massive real-time scale, and my background directly maps to the latency challenges you're tackling.",
    roleAnswers: {
      "data-analyst": {
        fresher: "I recently graduated with a degree in Computer Science / Information Systems with a strong focus on data analysis, SQL querying, and business intelligence dashboards. During my degree, I developed a passion for turning messy data into clear business narratives. For my major academic project, I analyzed a retail dataset of 45,000 transactions using Python and Pandas to clean the data, and created an interactive Power BI dashboard tracking monthly recurring revenue, customer churn, and cohort retention. That dashboard helped identify an 18% churn rate in quarterly cohorts. I've also solved 50+ real-world SQL problems on joins, window functions, and aggregations. I'm excited about this Data Analyst position because I want to help your analytics team uncover data-driven insights to improve product decisions.",
        experienced: "I have 3+ years of experience as a Data Analyst bridging raw database tables with executive decision-making. In my previous role, I maintained automated ETL pipelines and built company-wide Tableau dashboards monitoring ARR and customer acquisition funnels. I recently led an A/B test analysis on checkout friction that drove an 8.4% lift in conversions. I'm excited to bring my analytical rigor and stakeholder communication skills to your team."
      },
      "data-scientist": {
        fresher: "I recently graduated with a degree in Data Science and Statistics, with strong hands-on experience in machine learning, exploratory data analysis, and predictive modeling in Python. In my final year project, I built a predictive customer churn model on a dataset of 70,000 customer records. I performed exploratory data analysis, handled class imbalance using SMOTE, and compared Logistic Regression, Random Forest, and XGBoost models, achieving an 86% ROC-AUC score while explaining feature importances with SHAP values. I also interned as a data science trainee where I automated statistical hypothesis testing for product metrics. I'm excited about this role because I want to apply statistical rigor and machine learning to solve real business challenges on your team.",
        experienced: "I have 3+ years of experience as a Data Scientist designing, training, and deploying machine learning models into production. At my last company, I owned our personalized recommendation ranking model, which drove an 11% increase in average order value. I specialize in feature engineering, supervised learning, and offline-to-online evaluation frameworks. I'm eager to bring end-to-end model ownership to your team's recommendation systems."
      },
      "data-engineer": {
        fresher: "I am an engineering graduate passionate about data architecture, distributed data systems, and ETL pipeline engineering. During my studies, I completed coursework in Database Management, Operating Systems, and Distributed Computing. For my capstone project, I built an end-to-end automated data ingestion pipeline using Python, PostgreSQL, and Apache Airflow. The pipeline consumed a public weather and traffic API, performed idempotent data transformations in Pandas and SQL, and loaded structured star-schema tables into a data warehouse with automated data quality checks. I've spent substantial time practicing SQL CTEs, window functions, and query optimization. I am excited about this Associate Data Engineer opportunity to help build reliable data pipelines and scale data infrastructure.",
        experienced: "I bring 3+ years of Data Engineering experience designing scalable batch and streaming pipelines. At my current company, I architected our PySpark pipeline on AWS EMR processing 4TB of daily clickstream events into Snowflake with sub-10 minute latency. I'm excited about your team because of your high data volume and event-driven architecture."
      },
      "software-engineer": {
        fresher: "I recently graduated with a degree in Computer Science where I focused heavily on data structures, algorithms, and full-stack software development. During college, I solved over 250 coding challenges across LeetCode and built several end-to-end applications. For my capstone project, I developed a real-time collaborative task management platform using React, Node.js, and PostgreSQL, implementing WebSockets for live status updates and Redis for query caching, which reduced database reads by 45%. I also contributed to an open-source library, fixing race conditions in asynchronous API dispatchers. I am eager to join your team as an Associate Software Engineer where I can write clean, unit-tested code and learn from seasoned engineers building high-scale systems.",
        experienced: "I'm a software engineer with over 3 years of experience building high-throughput backend services and distributed pipelines. At my current company, I lead the core ingestion service that processes over 15 million events daily with 99.98% uptime. Outside of daily feature delivery, I focus heavily on query optimization and resilient distributed patterns. I'm excited about this opportunity because your team operates at massive real-time scale, and my background directly maps to the latency challenges you're tackling."
      },
      "devops-engineer": {
        fresher: "I recently graduated in Computer Science with a strong passion for cloud infrastructure, Linux systems, containerization, and CI/CD automation. In college, I earned my AWS Certified Cloud Practitioner certification and automated server deployments using Docker and GitHub Actions. For my major project, I containerized a multi-tier web application, built an automated CI/CD pipeline with automated linting and test stages, and deployed it onto an AWS ECS cluster with monitoring via Prometheus and Grafana. I am comfortable with Bash scripting, Linux CLI, and basic Terraform syntax. I am excited to start my DevOps career helping your team improve deployment reliability and observability.",
        experienced: "I have 3+ years of DevOps & Site Reliability experience managing Kubernetes clusters and Infrastructure as Code using Terraform on AWS. I reduced deployment failure rates by 60% by implementing blue-green canary deployments and automated rollback webhooks. I'm eager to bring cloud security and CI/CD maturity to your engineering organization."
      },
      "frontend-developer": {
        fresher: "I am a frontend developer and recent Computer Science graduate passionate about building responsive, accessible, and high-performance user interfaces. I specialize in modern JavaScript, TypeScript, React, and Next.js. During college, I built several responsive web applications, including a mock e-commerce store with client-side state management, responsive CSS Grid layouts, and Lighthouse performance scores above 95. For my final year project, I built a data visualization dashboard using Chart.js and Tailwind CSS that rendered real-time metrics seamlessly across mobile and desktop. I am excited to join your frontend team to translate Figma mockups into clean, accessible code.",
        experienced: "I have 3+ years of experience crafting enterprise frontend applications using React, TypeScript, and Next.js. In my previous role, I led our frontend performance initiative, reducing First Contentful Paint by 42% through code-splitting and asset optimization. I enjoy building reusable design system components and ensuring WCAG AA accessibility compliance."
      },
      "product-manager": {
        fresher: "I graduated with a degree in Engineering and Business, where I specialized in product design, user research, and data-driven feature prioritization. During college, I served as product lead for our university startup incubator project, conducting 35+ customer discovery interviews, defining the MVP product specification, and running sprint planning with our student engineering team. We launched the MVP to 1,200 active student users, tracking retention metrics using Mixpanel and running weekly user feedback surveys. I am eager to begin my career as an Associate Product Manager, supporting feature roadmaps and working closely with engineers and designers.",
        experienced: "I have 3+ years of product management experience launching B2B SaaS features. At my previous company, I owned the onboarding workflow, increasing 30-day user activation from 54% to 68% through iterative hypothesis testing and user journey simplification. I excel at aligning cross-functional teams and translating customer pain points into business outcomes."
      }
    },
    whatToAvoid: [
      "Do NOT recite your entire chronological resume from high school onwards.",
      "Do NOT share personal biographical or family details unrelated to your career.",
      "Do NOT ramble for longer than 90–120 seconds."
    ],
    toneGuidance: "Energetic, structured, professional, and forward-looking.",
    followUpQuestions: [
      "What was the most challenging technical blocker in that project?",
      "Why did you choose this technology stack over the alternatives?",
      "How did you divide responsibilities if you worked in a group?"
    ]
  },

  // 2. Why Should We Hire You?
  {
    id: "hr-why-should-we-hire-you",
    question: "Why should we hire you?",
    category: "Motivation & Fit",
    whatEvaluated: "Self-awareness, understanding of the company's pain points, and ability to articulate your unique value proposition.",
    howToStructure: [
      "Highlight 2-3 overlapping superpowers (e.g. foundational rigor + rapid learning curve + disciplined execution).",
      "Give concrete evidence from academic projects, internships, or coding challenges.",
      "Articulate how quickly you will become a net-positive contributor on sprint tasks."
    ],
    fresherAnswer: "You should hire me because I bring strong fundamentals, a disciplined work ethic, and an eagerness to learn your specific codebase rapidly. Unlike someone who only knows theory, I have built complete end-to-end projects with version control, automated tests, and proper documentation. I don't hesitate to ask clarifying questions before writing code, and I take code reviews as learning opportunities. As an entry-level candidate, I come with fresh enthusiasm, zero bad habits, and a commitment to becoming a productive team member from my very first sprint.",
    experiencedAnswer: "You should hire me because I bring a proven track record of converting ambiguous business goals into resilient, production-ready systems quickly. In my last role, when our reporting pipeline struggled with 4x volume growth, I redesigned our partitioning strategy, cutting query costs by 40% and latency by 65%. I combine strong technical fundamentals with a focus on business metrics—meaning I don't just write clean code, I build features that move key KPIs. I can ramp up within two weeks and start delivering value immediately.",
    roleAnswers: {
      "data-analyst": {
        fresher: "You should hire me because I bring a strong foundation in SQL, Excel, and Power BI combined with genuine curiosity about business metrics. Unlike candidates who only know theoretical formulas, I have built real dashboards that answer specific business questions like cohort retention and revenue trends. I take data accuracy very seriously—I always validate schemas, check for nulls, and reconcile totals before presenting numbers. Furthermore, as a fresher, I have a fast learning curve, adapt quickly to your team's BI stack, and am eager to take on data validation and report automation from day one.",
        experienced: "You should hire me because I don't just pull numbers—I translate complex data into executive recommendations that drive revenue and operational efficiency. In my last role, my churn analysis led directly to a 12% reduction in customer drop-off."
      },
      "data-scientist": {
        fresher: "You should hire me because I understand both the mathematics behind ML algorithms and the engineering practicalities of clean data pipelines. I don't treat machine learning like a black box; I focus on feature engineering, rigorous cross-validation to prevent data leakage, and explaining model trade-offs clearly to non-technical stakeholders. I am hungry to learn and excited to support your senior data scientists in exploratory analysis, data prep, and model benchmarking.",
        experienced: "You should hire me because I have shipped ML models from prototype to low-latency production APIs that directly impacted company revenue. I bring expertise in rigorous A/B test analysis, feature stores, and continuous model monitoring."
      },
      "data-engineer": {
        fresher: "You should hire me because I have a solid foundation in SQL, relational and dimensional data modeling (star and snowflake schemas), and Python pipeline scripting. I understand the importance of idempotency, data lineage, and failure recovery in ETL pipelines. In my capstone project, I designed pipelines that handled schema drifts and failed task retries gracefully in Airflow. I am eager to contribute to pipeline monitoring, bug fixes, and data warehousing tasks immediately.",
        experienced: "You should hire me because I have built production data infrastructure handling terabyte-scale streaming and batch data with zero data loss. I know how to optimize Spark jobs, tune database indexes, and architect robust Lakehouses."
      },
      "software-engineer": {
        fresher: "You should hire me because I have built a strong computer science foundation in DSA, OOP, and system design, proven through 250+ solved algorithmic problems and deployed projects with automated tests. I don't just write code that works; I care about edge cases, time-space complexities, and clean modular code that other teammates can read easily. I am proactive, receptive to code review feedback, and eager to ramp up quickly on your codebase to start closing sprint tickets.",
        experienced: "You should hire me because I bring deep experience in distributed systems, asynchronous messaging, and clean architecture. I have repeatedly turned ambiguous requirements into highly reliable microservices under strict latency budgets."
      }
    },
    whatToAvoid: [
      "Do NOT give generic answers like 'I work hard and learn fast' without concrete proof.",
      "Do NOT sound arrogant or disparage other potential candidates."
    ],
    toneGuidance: "Confident, humble, evidence-backed, and solutions-oriented.",
    followUpQuestions: [
      "How do you prioritize learning when faced with an unfamiliar framework?",
      "Tell me about a time you had to adapt quickly to feedback."
    ]
  },

  // 3. Why Do You Want to Work in This Role?
  {
    id: "hr-why-this-role",
    question: "Why do you want to work in this specific role?",
    category: "Role Specific",
    whatEvaluated: "Genuine passion for the technical discipline, role clarity, and long-term career intentionality.",
    howToStructure: [
      "Explain the exact trigger that made you passionate about this domain.",
      "Describe what aspects of the day-to-day work energize you (e.g. data wrangling, algorithmic optimization, pipeline resilience).",
      "Explain how this role aligns with your 3-year growth path."
    ],
    fresherAnswer: "I chose this role because I genuinely enjoy the process of breaking down complex problems and turning logical solutions into real software that people use every day. During college, whenever I worked on group assignments, I naturally gravitated toward writing the core backend logic, optimizing database queries, and debugging difficult issues. Finding that a query I refactored runs 5 times faster or that a feature I implemented solves a teammate's roadblock gives me tremendous satisfaction. I want this role because it gives me the opportunity to hone my skills alongside senior engineers and contribute to production-grade software.",
    experiencedAnswer: "I chose this role because it sits at the exact intersection of high technical complexity and tangible business impact. I enjoy tackling non-trivial distributed challenges—like concurrency, caching strategies, and API latency—while mentoring junior developers and driving engineering best practices across the team.",
    roleAnswers: {
      "data-analyst": {
        fresher: "I want to be a Data Analyst because I love discovering the story behind numbers. In college, when we analyzed raw spreadsheets, I found that raw data is useless until someone structures it, identifies patterns, and translates it into actionable business decisions. I enjoy writing clean SQL queries, creating dashboards that anyone can understand at a glance, and helping decision-makers make informed choices rather than guessing. That problem-solving process is what truly excites me every day.",
        experienced: "I chose Data Analytics because of the direct leverage it gives business leaders. Being the person who uncovers why customer retention dropped or which feature drove the highest conversion gives me immense satisfaction."
      },
      "data-scientist": {
        fresher: "I want to be a Data Scientist because I am fascinated by using mathematical models and statistical probability to predict future outcomes from historical patterns. Building a model that can predict customer churn or classify transactions accurately requires combining programming with scientific rigor. I love that data science is never static—there is always a new hypothesis to test, a new feature to engineer, and a deeper pattern to uncover.",
        experienced: "I chose Data Science because of its ability to automate complex decision-making at scale. Designing algorithmic models that learn from user interactions and continuously improve accuracy is both technically fascinating and commercially impactful."
      },
      "data-engineer": {
        fresher: "I want to be a Data Engineer because without reliable data infrastructure, neither data analysts nor machine learning models can function. I love systems-level thinking—designing schemas, building automated pipelines, optimizing SQL queries, and ensuring data reaches consumers cleanly and reliably. I get great satisfaction from knowing the data pipelines I build are robust, scalable, and fail-safe.",
        experienced: "I chose Data Engineering because data reliability and infrastructure scalability are the backbone of modern tech companies. I love building fault-tolerant architectures that handle billions of records seamlessly."
      }
    },
    whatToAvoid: [
      "Never say 'Because it's a trending field with high salaries.'",
      "Never show indifference toward the role's primary responsibilities (e.g. saying you want Data Analyst only as a stepping stone to ML)."
    ],
    toneGuidance: "Passionate, authentic, focused, and purposeful.",
    followUpQuestions: [
      "What is one trend in this domain that you are currently following?",
      "Which tool or language do you enjoy working with the most?"
    ]
  },

  // 4. Why Do You Want to Join Our Company?
  {
    id: "hr-why-this-company",
    question: "Why do you want to join our company?",
    category: "Motivation & Fit",
    whatEvaluated: "Depth of company research, genuine enthusiasm, product alignment, and retention potential.",
    howToStructure: [
      "Specific Product/Technology reference: Mention an actual feature, open-source library, or technical initiative.",
      "Culture/Scale alignment: Why their engineering values or business model resonates with you.",
      "Mutual growth: How you will contribute as an entry-level/experienced candidate."
    ],
    fresherAnswer: "I have researched your company thoroughly and am particularly impressed by how your platform has scaled its user base while maintaining exceptional system reliability. I read about how your engineering team migrated to microservices and automated CI/CD pipelines to ship updates seamlessly. Furthermore, speaking with engineers online, I learned that your team fosters a strong culture of code reviews, mentorship, and continuous learning for junior hires. I want to start my career in an environment with high engineering standards where I can contribute to meaningful features and grow into a strong software engineer.",
    experiencedAnswer: "I've been following your engineering blog, particularly the recent write-up on migrating your core payment gateway to an event-driven architecture. The engineering discipline required to process millions of transactions with zero data loss aligns directly with the standards I hold in my own work. Furthermore, your product is solving a real friction point for hundreds of thousands of users daily. I want to build systems where high performance and customer empathy meet, and your team is leading that benchmark in this industry.",
    whatToAvoid: [
      "Never say 'Because you are a top brand' or 'The compensation is high'.",
      "Do NOT give a generic answer that could apply to any random tech company."
    ],
    toneGuidance: "Researched, respectful, authentic, and enthusiastic.",
    followUpQuestions: [
      "Have you tried using our product? What was your initial impression?",
      "What is one feature you think our product could add or improve?"
    ]
  },

  // 5. Greatest Strengths
  {
    id: "hr-strengths",
    question: "What are your greatest strengths?",
    category: "General HR",
    whatEvaluated: "Self-awareness, technical strengths supported by concrete evidence, and operational discipline.",
    howToStructure: [
      "Primary technical superpower with verifiable proof.",
      "Collaboration / adaptability strength that helps the team.",
      "Problem-solving resilience under blockers or debugging."
    ],
    fresherAnswer: "My greatest strength is my problem-solving persistence and quick learning curve. When I encounter a bug or an unfamiliar framework, I don't give up; I systematically read the documentation, examine error stack traces, and isolate variables until I find the root cause. For example, during my capstone project, when our database was locking during simultaneous student logins, I dug into transaction isolation levels and added connection pooling, eliminating the issue completely. My second strength is clear communication—I always keep teammates updated on my progress and document my code thoroughly so others can build upon it easily.",
    experiencedAnswer: "My primary strength is root-cause diagnosis and systems optimization under pressure. When our team faced recurring database lock timeouts during peak traffic, I profiled our transaction isolation levels and refactored our hot-path queries, eliminating incidents entirely. My second key strength is technical empathy—I take pride in writing self-documenting code, thorough API contracts, and onboarding docs so teammates can ship faster without friction.",
    whatToAvoid: [
      "Listing 10 adjectives without any context or metrics.",
      "Claiming perfection in areas irrelevant to the job."
    ],
    toneGuidance: "Grounded, objective, and backed by verifiable examples.",
    followUpQuestions: [
      "Can you give an example of how your team benefited from that strength?",
      "How do you maintain that discipline when deadlines are tight?"
    ]
  },

  // 6. Greatest Weakness (Fresher-Safe)
  {
    id: "hr-weakness",
    question: "What is your greatest weakness?",
    category: "General HR",
    whatEvaluated: "Honesty, self-awareness, willingness to accept feedback, and continuous improvement mechanisms.",
    howToStructure: [
      "State a genuine professional area of growth (not a disguised boast like 'I work too hard').",
      "Explain the exact context where you noticed it.",
      "Detail the concrete steps, routines, or tools you actively use to overcome it."
    ],
    fresherAnswer: "As a fresher, my biggest area for improvement used to be asking for help too late when stuck on a technical roadblock. In my early college projects, I would spend days trying to solve a bug entirely on my own because I didn't want to bother my teammates. I realized that while independence is good, spinning my wheels slows down the entire project. Now, I follow a strict 45-minute rule: when stuck, I research thoroughly and document what I've tried. If I still haven't found a solution, I reach out to a senior teammate or mentor with my findings. This has made me much more efficient while still respecting everyone's time.",
    experiencedAnswer: "Early in my career, I had a tendency to dive straight into implementation before documenting edge cases or soliciting early design feedback from teammates, which once led to a sprint refactor. Recognizing this, I instituted a personal rule: for any feature touching shared services, I write a 1-page design RFC with architecture diagrams and API contracts before writing code. This shift has not only improved my code quality but has saved our team significant review cycles.",
    whatToAvoid: [
      "Never say 'I am a perfectionist' or 'I work too hard' (interviewers consider these canned and dishonest).",
      "Never state a fatal flaw for the role (e.g. 'I hate writing SQL' or 'I struggle with deadlines')."
    ],
    toneGuidance: "Humble, honest, reflective, and proactive about self-improvement.",
    followUpQuestions: [
      "What feedback did your professors or internship manager give you on your last review?",
      "How do you handle constructive criticism when someone requests changes on your pull request?"
    ]
  },

  // 7. Favorite Academic / Capstone Project
  {
    id: "hr-favorite-project",
    question: "Describe your favorite project and your specific contribution.",
    category: "Academic & Fresher",
    whatEvaluated: "Technical ownership, complexity handling, problem formulation, and outcome orientation.",
    howToStructure: [
      "Problem Statement: What problem did the project solve and why was it interesting?",
      "Architecture & Stack: What technologies did you choose and why?",
      "Your Ownership: What specific modules, APIs, or queries did you personally write?",
      "Quantifiable Results: Latency, accuracy, user feedback, or key learnings."
    ],
    fresherAnswer: "My favorite project was an automated student attendance and event portal that our team built for university clubs. Previously, attendance was manually recorded on clipboards, resulting in frequent errors and delayed records. We built a responsive web application with React on the frontend and Node.js with PostgreSQL on the backend. My specific responsibility was designing the relational database schema, implementing JWT authentication, and writing the REST API endpoints. When we tested simultaneous event check-ins with 200 users, I added database indexing on student roll numbers and event IDs, reducing check-in verification time from 1.8 seconds to under 120ms. Seeing 4 university clubs adopt it for their annual festival was immensely rewarding.",
    experiencedAnswer: "I led the development of our automated invoice reconciliation engine. Previously, our finance team manually reconciled 40,000 monthly transactions, leading to 3 days of delay at month-end close. I architected an asynchronous event-driven pipeline using message queues and idempotent workers that matched transactions against bank ledger webhooks with fuzzy matching logic. The system reduced end-of-month reconciliation time from 72 hours to under 15 minutes, with a 99.9% automated match rate.",
    whatToAvoid: [
      "Claiming you did 100% of the work if it was a group project.",
      "Describing only the UI and forgetting to mention data flow, architecture, or database design.",
      "Not knowing the details of code written in the project."
    ],
    toneGuidance: "Enthusiastic, technically articulate, ownership-driven, and clear.",
    followUpQuestions: [
      "If you had another month to work on that project, what would you improve?",
      "How did you test your system for edge cases?"
    ]
  },

  // 8. Handling Unknowns
  {
    id: "hr-dont-know",
    question: "What do you do when an interviewer asks you a question you don't know the answer to?",
    category: "Academic & Fresher",
    whatEvaluated: "Integrity, composure under pressure, first-principles problem-solving, and communication transparency.",
    howToStructure: [
      "Acknowledge the boundary transparently without bluffing.",
      "State what related concepts you DO know that might apply.",
      "Walk through your thought process out loud to show how you would investigate it."
    ],
    fresherAnswer: "If I don't know the exact answer, I believe in being completely honest rather than trying to bluff. I would say: 'I haven't worked with that specific tool or algorithm directly yet, but based on my understanding of similar concepts, here is how I would reason about it.' Then I break the problem down from first principles, talk through my assumptions out loud, and explain how I would approach finding the solution. Finally, I would mention how I would verify it—such as checking official documentation or benchmarking the performance.",
    experiencedAnswer: "I acknowledge the knowledge boundary transparently, state my assumptions, and draw parallels from adjacent production technologies I have used. I think out loud so the interviewer can evaluate my mental model, and I ask calibrating questions to confirm constraints.",
    whatToAvoid: [
      "Never pretend to know something you don't; experienced interviewers will immediately spot bluffing.",
      "Never just say 'I don't know' and fall silent."
    ],
    toneGuidance: "Calm, transparent, analytical, and curious.",
    followUpQuestions: [
      "How do you approach learning a completely new programming language or framework?"
    ]
  },

  // 9. Where Do You See Yourself in 3–5 Years?
  {
    id: "hr-future-goals",
    question: "Where do you see yourself in 3–5 years?",
    category: "Motivation & Fit",
    whatEvaluated: "Career ambition, stability, realistic progression, and alignment with company opportunities.",
    howToStructure: [
      "Years 1–2: Master the team's tech stack, deliver reliable features independently, and earn trust.",
      "Years 3–5: Deepen domain expertise, take ownership of complex subsystems, and mentor incoming freshers."
    ],
    fresherAnswer: "In the first 1 to 2 years, my priority is to master your team's tech stack and development workflows, consistently shipping high-quality, well-tested code while becoming an independent contributor. Over 3 to 5 years, I see myself taking end-to-end ownership of larger architectural modules, contributing to low-level design decisions, and mentoring new junior engineers joining the team. My ultimate goal is to become a trusted, go-to engineer who solves challenging problems and elevates team velocity.",
    experiencedAnswer: "In 3 to 5 years, I see myself evolving into a Staff-level technical lead who shapes architecture across multiple squads, drives engineering standards, and mentors mid-level engineers to expand team capacity.",
    whatToAvoid: [
      "Saying 'I want to be a manager' if you are interviewing for an engineering track.",
      "Saying 'I want to start my own company in two years' (signals flight risk)."
    ],
    toneGuidance: "Grounded, ambitious, committed, and realistic.",
    followUpQuestions: [
      "What technical skills do you most want to develop this year?"
    ]
  },

  // 10. Questions for the Interviewer
  {
    id: "hr-questions-for-interviewer",
    question: "Do you have any questions for us?",
    category: "Academic & Fresher",
    whatEvaluated: "Curiosity, preparation, understanding of engineering culture, and engagement.",
    howToStructure: [
      "Ask about day-to-day engineering practices and onboarding.",
      "Ask about team culture, mentorship, and sprint cycles.",
      "Ask about the interviewer's own experience on the team."
    ],
    fresherAnswer: "Yes, thank you! I have three questions:\n1. 'What does the onboarding process look like for a fresher joining this team, and what would success look like in the first 90 days?'\n2. 'How does the team handle code reviews and knowledge sharing between senior engineers and junior developers?'\n3. 'What is currently the most exciting or challenging technical problem your engineering squad is working on?'",
    experiencedAnswer: "Yes, I'd love to learn more about:\n1. 'What are the biggest architectural bottlenecks your team anticipates as your user base doubles this year?'\n2. 'How does engineering leadership balance technical debt remediation with product feature delivery in sprint planning?'",
    whatToAvoid: [
      "Never say 'No, I don't have any questions' (signals lack of interest).",
      "Do NOT ask about vacation days, bonuses, or promotions in the first technical round."
    ],
    toneGuidance: "Curious, thoughtful, respectful, and eager to learn."
  }
];

export const INTERVIEW_ETIQUETTE_GUIDE: InterviewEtiquetteItem[] = [
  {
    topic: "Body Language & Posture",
    category: "Body Language & Posture",
    guidance: "Non-verbal cues establish perception within the first 30 seconds. Upright posture communicates composure, alertness, and confidence.",
    doList: [
      "Sit upright with your shoulders relaxed and back against the chair; lean forward slightly (5-10 degrees) when listening actively.",
      "Keep hands visible on the desk or lap; use open-palm hand gestures to emphasize points when explaining code or architecture.",
      "Maintain consistent eye contact. Look directly into the webcam during virtual interviews, not down at your screen."
    ],
    dontList: [
      "Never slouch, lean back excessively, or cross your arms defensively.",
      "Avoid nervous fidgeting: tapping pens, swinging in rotating chairs, or touching your face repeatedly.",
      "Don't stare continuously without blinking; natural warm smiles and facial expressions show comfort."
    ]
  },
  {
    topic: "Speaking Pace & Vocal Tone",
    category: "Communication & Tone",
    guidance: "Nervous candidates naturally speak 30% faster than normal. Controlled pacing conveys senior-level composure.",
    doList: [
      "Deliberately slow down your speaking cadence by 15-20% compared to casual conversation.",
      "Use intentional pauses (1-2 seconds) between sentences rather than filler words ('um', 'like', 'you know').",
      "Vary your vocal inflection so your explanation sounds engaging and conversational rather than like a recited script."
    ],
    dontList: [
      "Never speak in a flat monotone pitch.",
      "Don't trail off at the end of sentences with uptalk (raising pitch like asking an uncertain question).",
      "Never interrupt the interviewer while they are asking or clarifying a question."
    ]
  },
  {
    topic: "Handling Questions You Don't Know",
    category: "Handling Unknowns",
    guidance: "Interviewers deliberately ask questions beyond your current knowledge boundary to evaluate how you reason in unfamiliar situations.",
    doList: [
      "Acknowledge the boundary transparently: 'I haven't worked with that specific tool directly yet, but based on my understanding of database indexes, here is how I would reason about it...'",
      "Think out loud: break the problem into first principles and explain your mental model step-by-step.",
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
      "Camera at eye level: elevate your laptop on a stand so you aren't looking down at the camera.",
      "Lighting: ensure your primary light source is in FRONT of you, never behind you (avoid silhouettes).",
      "Audio: use a dedicated headset or directional microphone; test levels 15 minutes before the call.",
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
    impact: "Signals lack of engineering discipline; often results in solving the wrong problem or missing crucial edge cases.",
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
    mistake: "Negative Talk About Past Professors, Peers or Employers",
    impact: "Immediate red flag for culture fit; interviewers assume you will speak the same way about their team in the future.",
    howToFix: "Frame past frustrations as engineering challenges or learning moments focused on constructive architectural decisions."
  },
  {
    mistake: "Saying 'We' Exclusively Instead of 'I'",
    impact: "Leaves the interviewer unsure what portion of the project you personally designed, built, and executed.",
    howToFix: "Use 'Our team was tasked with X, and my specific ownership was designing the ingestion pipeline and database schema Y.'"
  }
];

/**
 * Returns role-tailored and experience-level tailored sample answer
 */
export function getInterviewAnswer(
  q: HrInterviewQuestion,
  roleId: string = "software-engineer",
  level: "fresher" | "experienced" = "fresher"
): string {
  if (q.roleAnswers && q.roleAnswers[roleId]) {
    return level === "fresher"
      ? q.roleAnswers[roleId].fresher
      : q.roleAnswers[roleId].experienced;
  }
  return level === "fresher" ? q.fresherAnswer : q.experiencedAnswer;
}
