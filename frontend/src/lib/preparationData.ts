import { PrepRole, PREP_COMPANIES } from "./prepDataModels";

export * from "./prepDataModels";

// 1. Software Engineer
export const SOFTWARE_ENGINEER_ROLE: PrepRole = {
  id: "software-engineer",
  name: "Software Engineer",
  category: "Engineering",
  badge: "High Demand · SDE 1 / 2",
  tagline: "Algorithms, Distributed Systems, Object-Oriented Design & Scalable Web Services",
  overview: {
    coreSkills: ["Data Structures & Algorithms", "System Design (HLD & LLD)", "OOP & Design Patterns", "Databases (SQL & NoSQL)", "Concurrency & Multi-threading", "APIs & Microservices"],
    recommendedTopics: ["Graph Algorithms & DP", "Low-Level Design (SOLID)", "Database Indexing & Sharding", "Distributed Caching (Redis)", "Message Queues (Kafka)"],
    interviewAreas: ["Live Coding (LeetCode Style)", "Object-Oriented Design (LLD)", "Distributed System Architecture (HLD)", "Behavioral (STAR Method)"],
    assessmentAreas: ["Algorithmic Problem Solving (90 mins)", "Time & Space Complexity Proofs", "Technical MCQs (OS, DBMS, CN)", "Code Debugging"],
    typicalProjects: ["Distributed Key-Value Store", "Real-Time Collaborative Code Editor", "High-Throughput URL Shortener", "Rate Limiter with Token Bucket"],
    estimatedWeeks: "10 – 14 Weeks",
    avgFresherSalary: "₹8L – ₹18L / $85k – $120k",
    avgSeniorSalary: "₹35L – ₹75L / $180k – $280k"
  },
  roadmap: [
    {
      id: "se_step_1",
      stepNumber: 1,
      title: "Programming Foundations & OOP Mastery",
      focus: "Syntax, Memory Management, SOLID Principles & Design Patterns",
      description: "Master a primary language (Java, C++, Python, or Go). Understand pointers, memory allocation, object lifecycles, and design patterns like Factory, Singleton, Strategy, and Observer.",
      difficulty: "Beginner",
      subtopics: ["Language In-depth (Memory & Garbage Collection)", "OOP Principles (Encapsulation, Polymorphism, Inheritance)", "SOLID Design Principles", "Creational & Behavioral Design Patterns"],
      recommendedAction: "Build a modular CLI application applying Factory and Strategy patterns.",
      resourceName: "Refactoring.Guru Design Patterns",
      resourceUrl: "https://refactoring.guru/design-patterns"
    },
    {
      id: "se_step_2",
      stepNumber: 2,
      title: "Data Structures & Algorithmic Problem Solving",
      focus: "Arrays, Trees, Graphs, DP & Space-Time Optimization",
      description: "Solve 200+ curated problems. Master recursion, two pointers, sliding window, binary search, tree traversals (BFS/DFS), Dijkstra, topological sort, and memoization/tabulation.",
      difficulty: "Intermediate",
      subtopics: ["Arrays, Strings & Two Pointers", "Linked Lists, Stacks & Queues", "Binary Trees & BSTs", "Graphs, BFS, DFS & Shortest Path", "Dynamic Programming & Memoization"],
      recommendedAction: "Complete the Striver A2Z DSA Sheet and solve 2 LeetCode mediums daily.",
      resourceName: "Striver's A2Z DSA Sheet",
      resourceUrl: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/"
    },
    {
      id: "se_step_3",
      stepNumber: 3,
      title: "Core Computer Science Fundamentals",
      focus: "Operating Systems, DBMS & Computer Networks",
      description: "Clear mandatory assessment questions on process scheduling, virtual memory, deadlocks, ACID properties, indexing (B-Trees), normalization, and TCP/UDP/HTTP protocols.",
      difficulty: "Intermediate",
      subtopics: ["Process vs Thread & Concurrency", "Paging, Virtual Memory & Deadlocks", "ACID, Transactions & Isolation Levels", "B-Tree Indexes & Query Optimization", "OSI Model, TCP Handshake & DNS"],
      recommendedAction: "Write detailed notes on thread deadlocks and explain how B-Tree indexes speed up lookups.",
      resourceName: "CS50 CS Fundamentals & Gate Notes",
      resourceUrl: "https://www.geeksforgeeks.org/last-minute-notes-operating-systems/"
    },
    {
      id: "se_step_4",
      stepNumber: 4,
      title: "Backend Engineering, Databases & APIs",
      focus: "REST APIs, GraphQL, Relational DBs & Caching",
      description: "Build production-ready backend servers with authentication (JWT, OAuth), database migrations, connection pooling, and in-memory caching with Redis.",
      difficulty: "Intermediate",
      subtopics: ["RESTful API Conventions & Status Codes", "PostgreSQL / MySQL Schema Design", "Redis Caching Strategies (Cache-Aside, Write-Through)", "Database Indexing & Slow Query Optimization", "Authentication & JWT Security"],
      recommendedAction: "Build a secure REST API with Redis caching and PostgreSQL with zero N+1 query bugs.",
      resourceName: "Roadmap.sh Backend Developer",
      resourceUrl: "https://roadmap.sh/backend"
    },
    {
      id: "se_step_5",
      stepNumber: 5,
      title: "High-Level System Design (HLD) & Scalability",
      focus: "Microservices, Load Balancing, Sharding, Message Queues & CDN",
      description: "Learn to architect systems handling millions of daily active users. Understand horizontal scaling, CAP theorem, consistent hashing, Kafka message queues, and database sharding.",
      difficulty: "Advanced",
      subtopics: ["Horizontal vs Vertical Scaling", "Load Balancers & Reverse Proxies (Nginx)", "CAP Theorem & PACELC", "Consistent Hashing & Partitioning", "Message Queues (Kafka / RabbitMQ)", "Distributed Caching & CDN"],
      recommendedAction: "Design a complete architecture diagram for TinyURL or an Uber backend with latency SLA.",
      resourceName: "System Design Primer by Donne Martin",
      resourceUrl: "https://github.com/donnemartin/system-design-primer"
    },
    {
      id: "se_step_6",
      stepNumber: 6,
      title: "Portfolio Projects & Mock Interview Sprints",
      focus: "Full-Stack Deployment, Docker, CI/CD & Behavioral STAR Stories",
      description: "Containerize your projects with Docker, deploy to AWS/GCP, and run mock interviews covering technical live coding, system design, and Amazon Leadership Principles.",
      difficulty: "Advanced",
      subtopics: ["Docker & Containerization", "CI/CD GitHub Actions & Cloud Deploy", "STAR Method for Behavioral Rounds", "Live Whiteboard Mock Interviews"],
      recommendedAction: "Deploy an end-to-end full stack project and do 3 peer mock coding interviews on Pramp.",
      resourceName: "Pramp Free Peer Mock Interviews",
      resourceUrl: "https://www.pramp.com/"
    }
  ],
  skills: {
    mustKnow: [
      "Data Structures & Algorithms",
      "Object-Oriented Programming (Java/C++/Python/Go)",
      "Relational Databases (PostgreSQL / MySQL)",
      "RESTful API Design & JSON",
      "Git & GitHub Version Control",
      "Basic Linux Commands & Shell",
      "Time & Space Complexity Analysis"
    ],
    goodToKnow: [
      "In-Memory Caching (Redis / Memcached)",
      "NoSQL Databases (MongoDB / DynamoDB)",
      "Low-Level Design (SOLID & Clean Architecture)",
      "Docker & Containerization Basics",
      "Unit Testing & Integration Testing (Jest, JUnit, PyTest)",
      "Async Messaging (RabbitMQ / Kafka)"
    ],
    advanced: [
      "Distributed Systems & Microservices",
      "Database Sharding & Read Replicas",
      "Consistent Hashing & Distributed Consensus",
      "High-Throughput Concurrency & Thread Pooling",
      "Kubernetes & Cloud Infrastructure (AWS/GCP)",
      "Observability & APM (Datadog, Prometheus)"
    ],
    toolsAndTech: [
      "Git",
      "Docker",
      "Postman",
      "Redis",
      "PostgreSQL",
      "Kafka",
      "VS Code / IntelliJ",
      "Linux / Bash"
    ]
  },
  interviewRounds: [
    {
      step: "01",
      title: "Online Assessment (OA)",
      focus: "90-minute timed coding + CS Fundamentals",
      description: "2 to 3 algorithmic problems on HackerRank, CodeSignal, or Codility, plus 10–15 multiple choice questions on OS, DBMS, and Networks.",
      tips: [
        "Read all test cases and check constraints before coding.",
        "Check 0, negative, and maximum integer boundary conditions.",
        "Use fast I/O libraries (BufferedReader in Java, sys.stdin in Python)."
      ],
      keyQuestions: [
        "Subarray Sum Equals K (Hash Map)",
        "Minimum Window Substring (Sliding Window)",
        "Find Cycle in Directed Graph"
      ]
    },
    {
      step: "02",
      title: "Technical Coding Round 1",
      focus: "Data Structures & Algorithmic Problem Solving",
      description: "45–60 minute 1-on-1 interview with a senior engineer. You will solve 1 or 2 medium/hard problems on a shared coderpad or Google Docs.",
      tips: [
        "Communicate your approach out loud before typing any code.",
        "Always state the brute force solution first and explain its bottleneck.",
        "Dry-run your code with sample input before saying you're finished."
      ],
      keyQuestions: [
        "Course Schedule II (Topological Sort)",
        "Binary Tree Maximum Path Sum",
        "Trapping Rain Water"
      ]
    },
    {
      step: "03",
      title: "Low-Level Design (LLD) / Machine Coding",
      focus: "Object-Oriented Design, Clean Code & Extensibility",
      description: "Design and implement a working software component in 60–90 minutes with proper classes, interfaces, and design patterns.",
      tips: [
        "Clarify requirements and list the entities in the first 5 minutes.",
        "Apply SOLID principles: keep classes focused and decoupled.",
        "Include unit tests to prove your solution works."
      ],
      keyQuestions: [
        "Design an In-Memory File System",
        "Design Parking Lot System with multiple vehicle types",
        "Implement a Thread-Safe LRU Cache"
      ]
    },
    {
      step: "04",
      title: "High-Level System Design (HLD)",
      focus: "Scalability, Fault Tolerance, Databases & Trade-offs",
      description: "45–60 minute interactive architectural design session with a Principal Engineer or Engineering Manager.",
      tips: [
        "Calculate back-of-the-envelope scale (RPS, storage per year, read vs write ratio).",
        "Draw clear architecture diagrams showing API gateways, microservices, databases, and caches.",
        "Justify every architectural trade-off (e.g. why Redis over Memcached, why Cassandra over Postgres)."
      ],
      keyQuestions: [
        "Design a Distributed Rate Limiter for an API Gateway",
        "Design a URL Shortener like TinyURL with 100M daily writes",
        "Design a Real-Time Collaborative Document Editor like Google Docs"
      ]
    },
    {
      step: "05",
      title: "Behavioral & Cultural Leadership Round",
      focus: "STAR Method, Engineering Ownership, Conflict & Values",
      description: "Conducted by an Engineering Director or Bar Raiser. Evaluates collaboration, handling setbacks, deadline pressure, and ethical alignment.",
      tips: [
        "Frame every answer using Situation, Task, Action, and Result.",
        "Quantify your results with concrete numbers (e.g., improved latency by 35%).",
        "Have 2 thoughtful questions prepared about team culture and engineering roadmap."
      ],
      keyQuestions: [
        "Tell me about a time you had a technical disagreement with a teammate and how you resolved it.",
        "Describe a major bug you caused in production and what post-mortem steps you took.",
        "Tell me about a project where requirements changed midway through development."
      ]
    }
  ],
  assessmentPrep: [
    {
      title: "Algorithmic Speed Coding",
      weightage: "45% of Assessment Score",
      description: "Speed coding tests your ability to translate problem logic into optimal, clean code under a tight 90-minute clock.",
      keyTopics: ["Sliding Window & Hash Maps", "Binary Search on Answer", "Graph Traversals (BFS/DFS)", "Dynamic Programming"],
      sampleQuestion: "Given an array of integers nums and an integer k, return the total number of subarrays whose sum equals to k.",
      preparationTip: "Aim to solve a LeetCode Medium within 20 minutes without relying on an IDE compiler."
    },
    {
      title: "Core CS Fundamentals MCQs",
      weightage: "25% of Assessment Score",
      description: "Multiple choice questions testing theoretical knowledge of Operating Systems, Relational DBMS, and Networking.",
      keyTopics: ["Virtual Memory & Page Faults", "Process Synchronization & Semaphores", "B+ Trees & Indexing", "TCP vs UDP & HTTP/2"],
      sampleQuestion: "What is the difference between Clustered Index and Non-Clustered Index in relational databases?",
      preparationTip: "Review standard CS GATE notes for Operating Systems and DBMS ACID transaction isolation levels."
    },
    {
      title: "Code Debugging & Output Tracing",
      weightage: "15% of Assessment Score",
      description: "Identifying logic errors, race conditions, memory leaks, or predicting complex recursion/pointer output.",
      keyTopics: ["Pointer arithmetic", "Recursive call stacks", "String immutability", "Concurrent modifications"],
      sampleQuestion: "Identify the off-by-one error in this binary search implementation that causes an infinite loop.",
      preparationTip: "Practice tracing variable state step-by-step on paper instead of running code."
    },
    {
      title: "Aptitude & Logical Reasoning",
      weightage: "15% of Assessment Score",
      description: "Quantitative arithmetic, permutations, probability, and pattern recognition used in off-campus hiring screens.",
      keyTopics: ["Time & Work", "Permutation & Probability", "Data Interpretation", "Syllogisms & Number Series"],
      sampleQuestion: "Pipe A can fill a tank in 4 hours, and Pipe B can empty it in 6 hours. If both open, how long to fill?",
      preparationTip: "Solve 50 questions on IndiaBIX; do not spend more than 90 seconds on any single aptitude question."
    }
  ],
  interviewCategories: [
    {
      categoryName: "Data Structures & Algorithms",
      description: "High-frequency coding problems asked in tier-1 product companies.",
      questionCount: 450,
      topicsCovered: ["Arrays", "Graphs", "DP", "Trees", "Heaps", "Binary Search"],
      sampleQuestions: [
        {
          question: "How do you find the lowest common ancestor (LCA) of two nodes in a binary tree?",
          expectedApproach: "Use post-order traversal recursion. If the current node matches either target, return it. If both left and right recursive calls return non-null, current node is the LCA.",
          difficulty: "Medium"
        },
        {
          question: "Explain the difference between Dijkstra's algorithm and Bellman-Ford algorithm.",
          expectedApproach: "Dijkstra is a greedy algorithm with O((V+E)logV) complexity that fails with negative edge weights. Bellman-Ford handles negative weights and detects negative cycles in O(V*E).",
          difficulty: "Medium"
        },
        {
          question: "Given an unsorted array, find the length of the longest consecutive elements sequence in O(n) time.",
          expectedApproach: "Insert all elements into a hash set. Only start counting consecutive elements from numbers x where x-1 is NOT present in the set to guarantee O(n) total lookups.",
          difficulty: "Hard"
        }
      ]
    },
    {
      categoryName: "System Design & Architecture",
      description: "Designing scalable distributed systems that handle millions of requests.",
      questionCount: 50,
      topicsCovered: ["Caching", "Load Balancing", "Sharding", "Microservices", "Event-driven"],
      sampleQuestions: [
        {
          question: "How does consistent hashing solve the re-hashing problem when adding or removing cache servers?",
          expectedApproach: "Consistent hashing maps both servers and keys to a 360-degree ring. When a server is added or removed, only k/N keys need to be remapped on average instead of all keys.",
          difficulty: "Hard"
        },
        {
          question: "What is the difference between Write-Through and Write-Back (Write-Behind) cache?",
          expectedApproach: "Write-through updates both cache and DB simultaneously (higher consistency, slower writes). Write-back writes to cache immediately and flushes to DB asynchronously (faster, risk of data loss).",
          difficulty: "Medium"
        }
      ]
    },
    {
      categoryName: "Object-Oriented Design (LLD)",
      description: "Designing modular, extensible class hierarchies following SOLID principles.",
      questionCount: 35,
      topicsCovered: ["Factory Pattern", "Strategy Pattern", "State Pattern", "Observer Pattern"],
      sampleQuestions: [
        {
          question: "How would you design a parking lot system that supports cars, motorcycles, and trucks with dynamic pricing?",
          expectedApproach: "Define ParkingSpot abstract class with VehicleSize enum. Use Strategy pattern for FeeCalculationStrategy based on duration and vehicle type.",
          difficulty: "Medium"
        }
      ]
    }
  ],
  practiceQuestions: [
    {
      id: "se_pq_1",
      topic: "Data Structures",
      title: "LRU Cache Implementation",
      difficulty: "Medium",
      type: "Coding",
      questionText: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache with O(1) get and put operations.",
      solutionHint: "Combine a Hash Map for O(1) key lookups with a Doubly Linked List to maintain recency order in O(1) time.",
      companyTags: ["Google", "Amazon", "Microsoft", "Meta"]
    },
    {
      id: "se_pq_2",
      topic: "Algorithms",
      title: "Course Schedule II (Topological Sort)",
      difficulty: "Medium",
      type: "Coding",
      questionText: "There are numCourses you have to take, labeled from 0 to numCourses - 1. Return the ordering of courses you should take to finish all courses.",
      solutionHint: "Build an adjacency list and in-degree array. Use Kahn's algorithm with a queue for nodes with 0 in-degree. Detect cycle if processed count < numCourses.",
      companyTags: ["Amazon", "Uber", "Microsoft"]
    },
    {
      id: "se_pq_3",
      topic: "System Design",
      title: "Design a Rate Limiter",
      difficulty: "Hard",
      type: "Architecture",
      questionText: "Design a high-throughput distributed rate limiting service that limits requests to 100 requests per minute per IP address.",
      solutionHint: "Use Redis with the Token Bucket or Sliding Window Log algorithm. Use Lua scripting in Redis to guarantee atomic increment and check operations.",
      companyTags: ["Stripe", "Netflix", "Google"]
    },
    {
      id: "se_pq_4",
      topic: "Databases",
      title: "Explain Database Indexing & B-Trees",
      difficulty: "Medium",
      type: "Conceptual",
      questionText: "Why do relational databases use B-Trees or B+ Trees instead of Binary Search Trees or Hash Tables for table indexing?",
      solutionHint: "B+ trees have high fan-out which minimizes expensive disk I/O seeks, and leaf nodes are linked in a linked list for ultra-fast range queries.",
      companyTags: ["Oracle", "Microsoft", "Amazon"]
    }
  ],
  projects: [
    {
      id: "se_proj_1",
      title: "Distributed Key-Value Store with Raft Consensus",
      difficulty: "Advanced",
      skillsCovered: ["Go / Rust", "Distributed Consensus (Raft)", "gRPC", "WAL (Write-Ahead Logging)", "Leader Election"],
      whatItDemonstrates: "Demonstrates deep understanding of distributed systems failure modes, network partitions, split-brain mitigation, and log replication.",
      recommendedStack: ["Golang", "gRPC", "Protobuf", "Docker"],
      talkingPoints: [
        "Implemented leader election and heartbeat mechanisms using Raft consensus protocol.",
        "Guaranteed linearizable reads and atomic writes across a 5-node cluster.",
        "Simulated network partitions and verified zero split-brain data corruption."
      ]
    },
    {
      id: "se_proj_2",
      title: "High-Throughput URL Shortener with Analytics Pipeline",
      difficulty: "Intermediate",
      skillsCovered: ["Node.js / Go", "Redis Caching", "PostgreSQL Sharding", "Kafka", "Base62 Encoding"],
      whatItDemonstrates: "Demonstrates API optimization, consistent hashing, caching strategies, and handling asynchronous click analytics at scale.",
      recommendedStack: ["Go or Node.js", "Redis", "PostgreSQL", "Kafka", "Docker"],
      talkingPoints: [
        "Used Base62 distributed counter encoding to generate 7-character short codes.",
        "Achieved 99.4% cache hit ratio with Redis Cache-Aside, reducing DB latency from 45ms to 2ms.",
        "Streamed clickstream events into Kafka to calculate real-time geographical analytics."
      ]
    },
    {
      id: "se_proj_3",
      title: "Real-Time Collaborative Code Editor with WebSockets",
      difficulty: "Advanced",
      skillsCovered: ["TypeScript", "WebSockets", "Operational Transformation / CRDTs", "Redis Pub/Sub", "Docker"],
      whatItDemonstrates: "Demonstrates understanding of distributed state synchronization, conflict resolution, real-time messaging, and multi-user concurrency.",
      recommendedStack: ["Next.js", "Node.js", "Socket.io", "Redis Pub/Sub", "Monaco Editor"],
      talkingPoints: [
        "Implemented conflict-free replicated data types (CRDTs) for concurrent multi-user typing.",
        "Used Redis Pub/Sub to scale WebSocket connections horizontally across multiple server instances.",
        "Designed isolated Docker sandbox containers to securely execute user code with CPU/memory limits."
      ]
    }
  ],
  resumeGuidance: {
    targetRole: "Software Development Engineer (SDE)",
    atsKeywords: [
      "Data Structures & Algorithms", "Microservices", "REST APIs", "System Design", "Distributed Systems",
      "PostgreSQL", "Redis", "Kafka", "Docker", "CI/CD", "AWS", "Concurrency", "Unit Testing", "Java", "Python", "Go", "Git"
    ],
    mustHaveSections: [
      "Contact Info & GitHub / LinkedIn / Portfolio",
      "Technical Skills (Languages, Frameworks, Databases, Cloud & Tools)",
      "Work Experience (Impact-driven with metrics)",
      "Technical Projects (with live demo and GitHub repo links)",
      "Education & Relevant Coursework"
    ],
    recommendedProjectTypes: [
      "Distributed backend systems with concurrency handling",
      "Microservice architectures with message queues and caching",
      "Real-time event-driven applications with WebSockets"
    ],
    actionVerbs: ["Architected", "Engineered", "Optimized", "Refactored", "Containerized", "Deployed", "Benchmarked", "Automated"],
    commonMistakes: [
      "Listing technologies you cannot explain in depth during a technical interview.",
      "Describing project features instead of your individual technical implementation and business impact.",
      "Leaving out GitHub repository links or submitting broken deployment links.",
      "Using passive verbs like 'helped with' or 'worked on' instead of 'architected' or 'reduced latency by 40%'."
    ],
    sampleBulletPoints: [
      "Architected a high-throughput order processing service in Go handling 12,000 req/sec with sub-25ms response time.",
      "Optimized slow PostgreSQL queries by adding composite B-Tree indexes, reducing average query execution time from 1.4s to 45ms.",
      "Implemented Redis Cache-Aside pattern, reducing primary database load by 68% during high-traffic flash sales."
    ]
  },
  studySheets: [
    {
      title: "Striver's A2Z DSA Sheet (450+ Problems)",
      category: "Coding & DSA",
      provider: "TakeUForward",
      description: "Structured problem set categorized from basic arrays to advanced graphs and dynamic programming with video walkthroughs.",
      url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/",
      badge: "Flagship"
    },
    {
      title: "System Design Primer by Donne Martin",
      category: "System Design",
      provider: "GitHub Open Source (260k stars)",
      description: "Complete guide to designing scalable distributed systems: load balancers, caching, sharding, and real-world architectures.",
      url: "https://github.com/donnemartin/system-design-primer",
      badge: "Essential"
    },
    {
      title: "LeetCode Top 150 Interview Questions",
      category: "Interview Prep",
      provider: "LeetCode Official",
      description: "The 150 most frequently asked algorithmic interview problems categorized by pattern and data structure.",
      url: "https://leetcode.com/studyplan/top-interview-150/",
      badge: "High Signal"
    }
  ],
  careerPathways: [
    {
      stage: "Fresher / Associate SDE",
      experience: "0 – 1 Years",
      compensation: "₹8L – ₹18L / $85k – $120k",
      focus: "Clean Code & Feature Delivery",
      responsibilities: "Writing clean, unit-tested features, fixing bug backlogs, participating in code reviews, and mastering the team's codebase architecture.",
      requiredSkills: ["DSA", "OOP", "Git", "REST APIs", "Unit Testing", "Debugging"]
    },
    {
      stage: "Mid-Level Engineer (SDE II)",
      experience: "2 – 4 Years",
      compensation: "₹18L – ₹35L / $125k – $165k",
      focus: "Independent Ownership & Subsystem Design",
      responsibilities: "Leading subsystem design, owning production deployments, optimizing slow queries, resolving production incidents, and mentoring interns.",
      requiredSkills: ["System Design", "Microservices", "Redis Caching", "DB Optimization", "CI/CD", "Docker"]
    },
    {
      stage: "Senior SDE (SDE III / Tech Lead)",
      experience: "5 – 8 Years",
      compensation: "₹38L – ₹75L / $180k – $250k",
      focus: "High-Level Architecture & Technical Leadership",
      responsibilities: "Designing resilient distributed systems, driving high-impact technical initiatives, mentoring junior engineers, and setting coding standards.",
      requiredSkills: ["Distributed Architecture", "Capacity Planning", "Kafka", "Cloud Cost Optimization", "Cross-team Leadership"]
    },
    {
      stage: "Staff / Principal Engineer",
      experience: "8+ Years",
      compensation: "₹80L – ₹1.8Cr+ / $270k – $450k+",
      focus: "Org-Wide Strategy & Technology Vision",
      responsibilities: "Defining cross-organization technical strategy, eliminating systemic bottlenecks, shaping multi-year architecture roadmaps, and representing tech leadership.",
      requiredSkills: ["Enterprise Strategy", "Large-Scale Architecture", "Executive Alignment", "Technical Innovation"]
    }
  ]
};

// 2. Data Scientist
export const DATA_SCIENTIST_ROLE: PrepRole = {
  id: "data-scientist",
  name: "Data Scientist",
  category: "Data & AI",
  badge: "AI & Analytics · High Impact",
  tagline: "Statistical Modeling, Machine Learning Algorithms, A/B Testing & Business Experimentation",
  overview: {
    coreSkills: ["Python (NumPy, Pandas, Scikit-Learn)", "Applied Statistics & Probability", "Machine Learning (Supervised/Unsupervised)", "SQL & Feature Engineering", "A/B Testing & Causal Inference", "Deep Learning Foundations (PyTorch)"],
    recommendedTopics: ["Hypothesis Testing & p-values", "Gradient Boosting (XGBoost/LightGBM)", "Class Imbalance Techniques", "Model Evaluation Metrics (ROC-AUC, F1, PR Curves)", "ML System Design & Feature Stores"],
    interviewAreas: ["Machine Learning Theory & Math", "Applied Modeling & Experimentation", "A/B Testing & Product Metrics", "Live Coding (Python / SQL)", "Business Case Studies"],
    assessmentAreas: ["SQL Querying & Aggregation (60 mins)", "Python Data Wrangling & Modeling", "Statistical MCQs & Probability", "Machine Learning Knowledge"],
    typicalProjects: ["E-commerce Customer Churn Predictor", "Credit Card Fraud Detection with SMOTE", "Multi-Touch Attribution Model", "Product Recommendation Engine"],
    estimatedWeeks: "12 – 16 Weeks",
    avgFresherSalary: "₹9L – ₹19L / $90k – $125k",
    avgSeniorSalary: "₹36L – ₹78L / $185k – $290k"
  },
  roadmap: [
    {
      id: "ds_step_1",
      stepNumber: 1,
      title: "Mathematical Foundations & Python Mastery",
      focus: "Linear Algebra, Calculus, Probability & Vectorized Python",
      description: "Master NumPy and Pandas for data manipulation. Understand matrix multiplications, eigenvalues, partial derivatives, and probability distributions (Normal, Binomial, Poisson).",
      difficulty: "Beginner",
      subtopics: ["Matrix Operations & Eigenvectors", "Probability Distributions & Bayes Theorem", "Vectorized Python with NumPy", "Data Cleaning & Wrangling with Pandas"],
      recommendedAction: "Build a custom implementation of Linear Regression using only NumPy matrix operations.",
      resourceName: "Khan Academy Multivariable Calculus & Linear Algebra",
      resourceUrl: "https://www.khanacademy.org/math/linear-algebra"
    },
    {
      id: "ds_step_2",
      stepNumber: 2,
      title: "Inferential Statistics & Hypothesis Testing",
      focus: "Z-Tests, T-Tests, ANOVA, Chi-Square & Confidence Intervals",
      description: "Learn how to formulate null and alternative hypotheses, calculate p-values, perform power analysis, and avoid p-hacking in commercial experiments.",
      difficulty: "Intermediate",
      subtopics: ["Central Limit Theorem & Sampling Error", "T-tests, Z-tests & Chi-Square Tests", "ANOVA & Multiple Comparison Corrections", "Confidence Intervals & Sample Size Calculation"],
      recommendedAction: "Perform a simulated hypothesis test on a marketing campaign dataset in Python.",
      resourceName: "StatQuest with Josh Starmer",
      resourceUrl: "https://statquest.org/"
    },
    {
      id: "ds_step_3",
      stepNumber: 3,
      title: "Advanced SQL & Feature Engineering",
      focus: "Window Functions, Aggregations, Imputation & Encoding",
      description: "Extract complex training datasets using recursive SQL CTEs. Master feature engineering: one-hot encoding, target encoding, outlier handling, and scaling.",
      difficulty: "Intermediate",
      subtopics: ["SQL Window Functions (ROW_NUMBER, DENSE_RANK, LAG, LEAD)", "Complex Joins, Self-Joins & Aggregations", "Handling Missing Data & Outlier Detection", "Categorical Encodings & Scaling Methods"],
      recommendedAction: "Complete the LeetCode Top SQL 50 study plan with 100% test pass rate.",
      resourceName: "LeetCode Top SQL 50",
      resourceUrl: "https://leetcode.com/studyplan/top-sql-50/"
    },
    {
      id: "ds_step_4",
      stepNumber: 4,
      title: "Classical Machine Learning Algorithms",
      focus: "Supervised & Unsupervised Modeling, Scikit-Learn & Math",
      description: "Deep dive into decision trees, Random Forests, Gradient Boosted Trees (XGBoost, LightGBM), SVMs, K-Means clustering, and PCA dimensionality reduction.",
      difficulty: "Intermediate",
      subtopics: ["Linear & Logistic Regression (Loss Functions, Regularization)", "Decision Trees & Ensemble Methods (Random Forest, XGBoost)", "Clustering (K-Means, DBSCAN) & Dimensionality Reduction (PCA)", "Hyperparameter Tuning (GridSearch, Optuna)"],
      recommendedAction: "Train an XGBoost model on a tabular churn dataset and optimize using Optuna.",
      resourceName: "Hands-On Machine Learning (Aurélien Géron)",
      resourceUrl: "https://github.com/ageron/handson-ml3"
    },
    {
      id: "ds_step_5",
      stepNumber: 5,
      title: "A/B Testing, Experimentation & Causal Inference",
      focus: "Experiment Design, Guardrail Metrics, Sample Size & Pitfalls",
      description: "Design real-world A/B tests for product features. Learn sample ratio mismatch (SRM), variance reduction (CUPED), network interference, and difference-in-differences.",
      difficulty: "Advanced",
      subtopics: ["Randomization Units & User Bucketing", "Minimum Detectable Effect (MDE) & Power Analysis", "Variance Reduction Techniques (CUPED)", "Detecting Sample Ratio Mismatch (SRM)", "Quasi-experiments & Difference-in-Differences"],
      recommendedAction: "Write an end-to-end experiment design document for an e-commerce checkout redesign.",
      resourceName: "Trustworthy Online Controlled Experiments (Kohavi et al.)",
      resourceUrl: "https://experimentguide.com/"
    },
    {
      id: "ds_step_6",
      stepNumber: 6,
      title: "ML System Design, Production MLOps & Case Studies",
      focus: "Feature Stores, Model Serving, Drift Detection & Real-World Case Studies",
      description: "Architect production ML systems. Learn batch vs real-time prediction, latency vs accuracy trade-offs, model drift monitoring, and presentation of findings to leadership.",
      difficulty: "Advanced",
      subtopics: ["Batch vs Online Inference Architecture", "Feature Stores (Feast) & Model Registries (MLflow)", "Concept Drift & Data Drift Detection", "Business Case Studies & Metric Translation"],
      recommendedAction: "Design a complete architecture for a personalized content recommendation engine.",
      resourceName: "Designing Machine Learning Systems by Chip Huyen",
      resourceUrl: "https://chiphuyen.com/book-mlsys/"
    }
  ],
  skills: {
    mustKnow: [
      "Python (Pandas, NumPy, Scikit-Learn)",
      "Advanced SQL (Window Functions, Aggregations)",
      "Applied Statistics & Probability",
      "Hypothesis Testing & p-value Analysis",
      "Supervised ML (Regression, Random Forest, XGBoost)",
      "Model Evaluation (ROC-AUC, Precision, Recall, F1)",
      "Data Visualization (Matplotlib, Seaborn)"
    ],
    goodToKnow: [
      "A/B Testing & Experimentation Frameworks",
      "Feature Engineering & Outlier Treatment",
      "Unsupervised Learning (K-Means, PCA, t-SNE)",
      "Hyperparameter Optimization (Optuna)",
      "Time Series Forecasting (ARIMA, Prophet)",
      "Git & Collaborative Data Science"
    ],
    advanced: [
      "Deep Learning (PyTorch, Neural Networks)",
      "Natural Language Processing (Transformers, Hugging Face)",
      "MLOps & Model Tracking (MLflow, Feast)",
      "Causal Inference & Quasi-experiments",
      "ML System Design & High-Throughput Serving",
      "LLM Prompt Engineering & RAG Systems"
    ],
    toolsAndTech: [
      "Python",
      "SQL",
      "Jupyter Notebooks",
      "Scikit-Learn",
      "XGBoost / LightGBM",
      "PyTorch",
      "MLflow",
      "Tableau / Power BI"
    ]
  },
  interviewRounds: [
    {
      step: "01",
      title: "Online Assessment (OA)",
      focus: "SQL Querying + Python Data Manipulation + Stats",
      description: "Timed 75–90 minute test on HackerRank or Codility covering complex SQL queries, NumPy/Pandas array manipulation, and statistics concepts.",
      tips: [
        "Expect at least one SQL question with self-joins or cumulative sums.",
        "Ensure your Python code handles NaN values and empty dataframes gracefully.",
        "Brush up on basic Bayes theorem and probability distributions."
      ],
      keyQuestions: [
        "Calculate 30-day rolling customer churn rate using SQL",
        "Implement K-Means clustering algorithm from scratch in Python",
        "Calculate sample size required for an A/B test with 80% power"
      ]
    },
    {
      step: "02",
      title: "Technical Screen: Coding & Data Analysis",
      focus: "Live Coding in Python & SQL with Data Wrangling",
      description: "45–60 minute interactive screen where you analyze a raw dataset, write SQL queries, compute aggregations, and engineer features live.",
      tips: [
        "Talk through your exploratory data analysis steps before writing modeling code.",
        "Check distributions for skewness and explain why you apply log-transforms.",
        "State why you select specific evaluation metrics (e.g. why PR-AUC over ROC-AUC for imbalanced data)."
      ],
      keyQuestions: [
        "Given transactions data, write SQL to find fraudulent repeat buyers",
        "Perform feature engineering on timestamp data for a churn model",
        "Explain when Precision is more important than Recall with a concrete example"
      ]
    },
    {
      step: "03",
      title: "Machine Learning Deep Dive & Theory",
      focus: "Mathematical Foundations & Algorithm Mechanics",
      description: "1-hour deep dive into algorithm mechanics, math derivations, loss functions, overfitting mitigation, and trade-offs.",
      tips: [
        "Be ready to write out the mathematical cost function for logistic regression.",
        "Explain how Gradient Boosting minimizes the pseudo-residuals of the loss function.",
        "Know the exact mathematical difference between L1 (Lasso) and L2 (Ridge) regularization."
      ],
      keyQuestions: [
        "Why does L1 regularization cause sparsity while L2 shrinks weights uniformly?",
        "How does XGBoost handle missing values during tree splitting?",
        "Explain how the ROC curve is constructed and what AUC represents physically."
      ]
    },
    {
      step: "04",
      title: "A/B Testing & Business Case Study",
      focus: "Experiment Design, Product Metrics & Business Impact",
      description: "You will be given a realistic product scenario (e.g. 'We changed our homepage layout. How do you evaluate success?').",
      tips: [
        "Define Primary Metric, Secondary Metric, and Guardrail Metrics first.",
        "Discuss Sample Ratio Mismatch (SRM) checks before looking at p-values.",
        "Explain how network effects or seasonal variations could bias results."
      ],
      keyQuestions: [
        "Design an experiment to evaluate an AI recommendation carousel on Netflix/YouTube",
        "A 2-week A/B test shows statistically significant revenue increase, but user complaints rose 12%. What is your recommendation?",
        "How do you handle multiple testing problem (Bonferroni correction vs FDR)?"
      ]
    },
    {
      step: "05",
      title: "Behavioral & Stakeholder Alignment",
      focus: "Cross-Functional Collaboration & Translating Data to Action",
      description: "Evaluates how you communicate complex probabilistic results to non-technical product managers, executives, and engineering peers.",
      tips: [
        "Never use mathematical jargon when explaining results to executive stakeholders.",
        "Share an example where data disproved a popular executive intuition.",
        "Focus on business impact: conversion rate, revenue saved, retention improved."
      ],
      keyQuestions: [
        "Tell me about a time an executive wanted to ship a feature despite an inconclusive A/B test.",
        "Describe a data science project that failed to deliver expected business value and what you learned.",
        "How do you prioritize between 5 different data science requests from different teams?"
      ]
    }
  ],
  assessmentPrep: [
    {
      title: "Applied SQL Queries & Aggregations",
      weightage: "40% of Assessment Score",
      description: "Writing complex multi-table SQL queries, window functions, and time-based metrics without syntax errors.",
      keyTopics: ["Window Functions (LAG, LEAD, DENSE_RANK)", "Date Arithmetic & Cohort Retention", "Self Joins & CTEs", "Aggregation with HAVING"],
      sampleQuestion: "Write a SQL query to find the top 5 customers with the highest spending in each country during Q3 2026.",
      preparationTip: "Practice writing queries directly on LeetCode Database section; aim for medium-level queries in under 12 minutes."
    },
    {
      title: "Statistical Inference & Probability",
      weightage: "30% of Assessment Score",
      description: "Theoretical and numerical questions covering probability, Bayes theorem, distributions, and hypothesis tests.",
      keyTopics: ["Normal, Binomial & Poisson Distributions", "Central Limit Theorem", "p-values & Type I/II Errors", "Bayes Rule & Conditional Probability"],
      sampleQuestion: "A disease affects 1 in 1000 people. A test is 99% accurate. If someone tests positive, what is the probability they actually have it?",
      preparationTip: "Master Bayes theorem formulas and understand why base rate fallacy occurs in diagnostic tests."
    },
    {
      title: "Python Data Science Coding",
      weightage: "20% of Assessment Score",
      description: "Writing clean Pandas, NumPy, or Python code to manipulate data structures, compute statistical metrics, or clean strings.",
      keyTopics: ["Pandas groupby and transform", "NumPy array broadcasting", "List comprehensions & dictionaries", "Handling missing values"],
      sampleQuestion: "Write a function to normalize a dataset and replace all missing values with column medians without using Scikit-Learn.",
      preparationTip: "Familiarize yourself with Pandas `.loc`, `.iloc`, `.apply()`, and `.transform()` methods."
    },
    {
      title: "Machine Learning Principles",
      weightage: "10% of Assessment Score",
      description: "Conceptual questions on overfitting, validation strategies, cross-validation, and metrics.",
      keyTopics: ["Bias-Variance Trade-off", "K-Fold Cross-Validation", "Evaluation Metrics (ROC, PR, F1)", "Feature Scaling"],
      sampleQuestion: "Why is accuracy a misleading metric for credit card fraud detection with 99.8% legitimate transactions?",
      preparationTip: "Always recommend Precision, Recall, and PR-AUC when discussing severely skewed class distributions."
    }
  ],
  interviewCategories: [
    {
      categoryName: "Machine Learning Algorithms & Math",
      description: "Theoretical and applied questions on supervised and unsupervised modeling.",
      questionCount: 65,
      topicsCovered: ["Regression", "Decision Trees", "Ensembles", "Clustering", "Loss Functions"],
      sampleQuestions: [
        {
          question: "Explain the mathematical difference between Bagging and Boosting.",
          expectedApproach: "Bagging (Random Forest) trains independent models in parallel on bootstrapped samples to reduce variance. Boosting (XGBoost) trains models sequentially where each model corrects previous errors to reduce bias.",
          difficulty: "Medium"
        },
        {
          question: "How do you detect and handle multicollinearity in linear models?",
          expectedApproach: "Use Variance Inflation Factor (VIF > 5 or 10 indicates high multicollinearity), correlation heatmaps, or apply L2 regularization (Ridge) or PCA.",
          difficulty: "Medium"
        }
      ]
    },
    {
      categoryName: "A/B Testing & Product Experimentation",
      description: "End-to-end experiment design, metric tracking, and causal interpretation.",
      questionCount: 45,
      topicsCovered: ["Sample Size", "p-values", "SRM", "CUPED", "Guardrails"],
      sampleQuestions: [
        {
          question: "What is Sample Ratio Mismatch (SRM) and how do you detect it in an A/B test?",
          expectedApproach: "SRM occurs when the observed ratio of users in control vs treatment differs from the designed assignment ratio. Detect using a Chi-Square goodness-of-fit test. If p < 0.001, investigate user drop-off or routing bugs before reading results.",
          difficulty: "Hard"
        }
      ]
    },
    {
      categoryName: "Applied SQL & Data Wrangling",
      description: "Complex database queries asked during live technical interview screens.",
      questionCount: 80,
      topicsCovered: ["Window Functions", "Cohorts", "CTEs", "Rolling Averages"],
      sampleQuestions: [
        {
          question: "How do you calculate Day-1, Day-7, and Day-30 user retention in SQL?",
          expectedApproach: "Use a CTE to find each user's signup date, join user activity log on user_id, calculate date difference in days, and aggregate with conditional SUM(CASE WHEN diff = 1 THEN 1 END) / COUNT(DISTINCT user_id).",
          difficulty: "Medium"
        }
      ]
    }
  ],
  practiceQuestions: [
    {
      id: "ds_pq_1",
      topic: "Machine Learning",
      title: "Handling Extreme Class Imbalance",
      difficulty: "Medium",
      type: "Conceptual",
      questionText: "You are building a fraud detection model where only 0.1% of transactions are fraudulent. How do you design training and evaluation?",
      solutionHint: "Use cost-sensitive learning (class weights) or SMOTE oversampling. NEVER use accuracy; evaluate with PR-AUC, F1-Score, and set the classification threshold based on false-positive business cost.",
      companyTags: ["Stripe", "PayPal", "Amazon"]
    },
    {
      id: "ds_pq_2",
      topic: "Statistics",
      title: "Calculating A/B Test Sample Size",
      difficulty: "Medium",
      type: "Conceptual",
      questionText: "What parameters determine the minimum sample size needed for an A/B test, and what happens if you stop the test early?",
      solutionHint: "Determined by baseline conversion rate, minimum detectable effect (MDE), significance level (alpha = 0.05), and statistical power (1-beta = 0.80). Stopping early causes false positives (p-hacking / peeking problem).",
      companyTags: ["Meta", "Google", "Netflix"]
    },
    {
      id: "ds_pq_3",
      topic: "SQL",
      title: "7-Day Rolling Active User Calculation",
      difficulty: "Medium",
      type: "SQL",
      questionText: "Given a table of user logins with user_id and login_date, write a SQL query to compute the number of unique active users over the preceding 7-day rolling window for each day.",
      solutionHint: "Use a self-join or cross join on calendar dates where activity_date BETWEEN date - INTERVAL '6 DAYS' AND date, then COUNT(DISTINCT user_id).",
      companyTags: ["Uber", "Google", "Airbnb"]
    }
  ],
  projects: [
    {
      id: "ds_proj_1",
      title: "End-to-End Customer Churn Prediction with SHAP Interpretability",
      difficulty: "Intermediate",
      skillsCovered: ["Python", "XGBoost", "Feature Engineering", "SHAP Values", "Streamlit"],
      whatItDemonstrates: "Demonstrates ability to prepare real-world tabular data, address class imbalance, train tree ensembles, and explain feature importance to non-technical stakeholders.",
      recommendedStack: ["Python", "Pandas", "Scikit-Learn", "XGBoost", "SHAP", "Streamlit"],
      talkingPoints: [
        "Engineered 18 behavioral features including payment velocity and support ticket frequency.",
        "Trained an XGBoost classifier achieving 0.88 ROC-AUC and 0.74 F1-score with threshold tuning.",
        "Used TreeSHAP to reveal that users with >2 billing complaints had 4.8x higher churn likelihood."
      ]
    },
    {
      id: "ds_proj_2",
      title: "Real-Time Credit Card Fraud Detection Pipeline",
      difficulty: "Advanced",
      skillsCovered: ["Python", "Isolation Forests / Autoencoders", "Imbalanced-Learn (SMOTE)", "FastAPI", "Docker"],
      whatItDemonstrates: "Demonstrates production modeling with extreme class imbalance, anomaly detection, low-latency API serving, and latency profiling.",
      recommendedStack: ["Python", "LightGBM", "PyTorch", "FastAPI", "Docker"],
      talkingPoints: [
        "Handled 0.17% class imbalance using cost-sensitive learning and focal loss.",
        "Deployed the trained model behind a sub-20ms FastAPI microservice with automated health checks.",
        "Achieved a 94.2% recall rate while keeping false positive rate under 1.8%."
      ]
    }
  ],
  resumeGuidance: {
    targetRole: "Data Scientist",
    atsKeywords: [
      "Python", "SQL", "Machine Learning", "Scikit-Learn", "Pandas", "NumPy", "XGBoost", "A/B Testing",
      "Hypothesis Testing", "Statistics", "Deep Learning", "PyTorch", "Feature Engineering", "Predictive Modeling", "Tableau", "Git"
    ],
    mustHaveSections: [
      "Contact Info & GitHub / Kaggle / Portfolio",
      "Technical Skills (Languages, ML Frameworks, Databases, Statistical Techniques)",
      "Work Experience (Emphasize quantified model impact)",
      "Applied ML Projects (with code links and live demos)",
      "Education (Degree, coursework in Math / Statistics / CS)"
    ],
    recommendedProjectTypes: [
      "Predictive modeling on tabular business datasets with SHAP explanations",
      "Rigorous A/B test simulation with power analysis and sample ratio checks",
      "End-to-end ML model deployed with a live web API"
    ],
    actionVerbs: ["Developed", "Engineered", "Modeled", "Evaluated", "Analyzed", "Optimized", "Formulated", "Hypothesized"],
    commonMistakes: [
      "Claiming high accuracy on imbalanced datasets without reporting Precision, Recall, and PR-AUC.",
      "Listing algorithms without understanding mathematical optimization loss functions.",
      "Forgetting to mention business metrics (e.g. churn reduced, revenue uplift) tied to model performance."
    ],
    sampleBulletPoints: [
      "Developed a customer churn prediction model using LightGBM on 4.2M records, improving identification of at-risk users by 32%.",
      "Designed and executed 14 statistical A/B tests with sample size power calculations, driving a 4.8% lift in checkout conversion.",
      "Engineered automated feature extraction pipeline in SQL & Python, reducing model training data preparation time by 65%."
    ]
  },
  studySheets: [
    {
      title: "StatQuest Illustrated Machine Learning Notes",
      category: "ML Foundations",
      provider: "Josh Starmer / StatQuest",
      description: "Visual, step-by-step breakdowns of decision trees, logistic regression, neural networks, and PCA.",
      url: "https://statquest.org/",
      badge: "High Recommended"
    },
    {
      title: "LeetCode Top SQL 50 Study Plan",
      category: "SQL & Databases",
      provider: "LeetCode Official",
      description: "Curated 50 SQL problems covering joins, window functions, aggregations, and subqueries asked in interviews.",
      url: "https://leetcode.com/studyplan/top-sql-50/",
      badge: "Must Solve"
    },
    {
      title: "Designing Machine Learning Systems Guide",
      category: "ML System Design",
      provider: "Chip Huyen (Stanford)",
      description: "Comprehensive guide on building reliable, maintainable machine learning systems in production.",
      url: "https://chiphuyen.com/book-mlsys/",
      badge: "Architecture"
    }
  ],
  careerPathways: [
    {
      stage: "Associate Data Scientist",
      experience: "0 – 2 Years",
      compensation: "₹9L – ₹19L / $90k – $125k",
      focus: "Data Wrangling & Baseline Modeling",
      responsibilities: "Cleaning tabular datasets, running exploratory data analysis, building baseline ML models, and writing SQL queries for team dashboards.",
      requiredSkills: ["Python", "SQL", "Pandas", "Scikit-Learn", "Basic Stats", "Git"]
    },
    {
      stage: "Data Scientist (Level II)",
      experience: "2 – 5 Years",
      compensation: "₹20L – ₹38L / $130k – $170k",
      focus: "End-to-End Modeling & Experimentation",
      responsibilities: "Designing feature pipelines, tuning tree ensembles, running A/B tests, and translating ambiguous business problems into mathematical objectives.",
      requiredSkills: ["XGBoost", "A/B Testing", "Feature Engineering", "SHAP", "Hypothesis Testing", "Docker"]
    },
    {
      stage: "Senior / Lead Data Scientist",
      experience: "5 – 8 Years",
      compensation: "₹40L – ₹78L / $180k – $260k",
      focus: "ML Architecture & Strategy",
      responsibilities: "Mentoring junior scientists, architecting production ML pipelines, defining experimentation standards across teams, and advising executive product decisions.",
      requiredSkills: ["ML System Design", "MLOps", "Causal Inference", "Deep Learning", "Executive Communication"]
    },
    {
      stage: "Principal Data Scientist",
      experience: "8+ Years",
      compensation: "₹85L – ₹1.9Cr+ / $270k – $420k+",
      focus: "AI Strategy & Company-Wide Innovation",
      responsibilities: "Spearheading novel AI capabilities, establishing enterprise data governance, evaluating frontier foundation models, and setting company technical roadmap.",
      requiredSkills: ["AI Enterprise Strategy", "Novel Architecture", "Multi-team Leadership", "Frontier AI Research"]
    }
  ]
};

// 3. Data Analyst
export const DATA_ANALYST_ROLE: PrepRole = {
  id: "data-analyst",
  name: "Data Analyst",
  category: "Data & AI",
  badge: "High Placement · Business Critical",
  tagline: "SQL Mastery, Power BI / Tableau Dashboards, Business Metrics & Decision Analytics",
  overview: {
    coreSkills: ["Advanced SQL (Joins, CTEs, Window Functions)", "Power BI / Tableau Dashboarding", "Excel & Financial Modeling", "Python / R for Exploratory Analysis", "Business Metrics (CAC, LTV, Churn, ROI)", "Executive Storytelling & Presentation"],
    recommendedTopics: ["Cohort Retention & Churn Analysis", "DAX Formulas & Data Modeling", "Funnel Optimization", "Data Cleaning & Anomaly Detection", "Metric Tree Formulation"],
    interviewAreas: ["Live SQL Screen", "Business Case Studies & Scenarios", "Dashboard Critique & Design", "Problem Solving & Analytical Thinking", "Stakeholder Communication"],
    assessmentAreas: ["SQL Querying (50 mins)", "Excel Modeling & Pivot Tables", "Business Acumen & Case Interpretation", "Aptitude & Data Interpretation"],
    typicalProjects: ["SaaS Customer Retention & Churn Dashboard", "E-commerce Sales & Marketing Attribution Analysis", "Supply Chain Inventory Optimization Tracker", "Fintech Fraud Analytics Dashboard"],
    estimatedWeeks: "8 – 12 Weeks",
    avgFresherSalary: "₹5L – ₹12L / $65k – $95k",
    avgSeniorSalary: "₹24L – ₹48L / $140k – $200k"
  },
  roadmap: [
    {
      id: "da_step_1",
      stepNumber: 1,
      title: "Advanced Excel & Financial Modeling",
      focus: "XLOOKUP, INDEX/MATCH, Dynamic Arrays & Pivot Tables",
      description: "Master enterprise Excel. Learn nested formulas, conditional aggregations (SUMIFS, COUNTIFS), pivot charts, scenario planning, and financial statement modeling.",
      difficulty: "Beginner",
      subtopics: ["XLOOKUP, INDEX/MATCH & Lookup Formulas", "Multi-condition Aggregations (SUMIFS/COUNTIFS)", "Pivot Tables, Slicers & Calculated Fields", "Data Validation & Conditional Formatting"],
      recommendedAction: "Build a dynamic financial dashboard in Excel using only formulas and pivot slicers.",
      resourceName: "Excel Exposure Free Masterclass",
      resourceUrl: "https://excelexposure.com/"
    },
    {
      id: "da_step_2",
      stepNumber: 2,
      title: "SQL Mastery: From Basics to Window Functions",
      focus: "Multi-table Joins, CTEs, Window Functions & Subqueries",
      description: "The core skill of every Data Analyst. Master ranking (ROW_NUMBER, DENSE_RANK), lead/lag analysis, rolling moving averages, cumulative sums, and self-joins.",
      difficulty: "Intermediate",
      subtopics: ["SELECT, WHERE, GROUP BY & HAVING", "INNER, LEFT, RIGHT, FULL & CROSS Joins", "Common Table Expressions (WITH clauses)", "Window Functions (ROW_NUMBER, RANK, LAG, LEAD)", "Cumulative Sums & Moving Averages"],
      recommendedAction: "Solve all 50 questions in LeetCode Top SQL 50 study plan.",
      resourceName: "Mode Analytics SQL Tutorial for Data Analysis",
      resourceUrl: "https://mode.com/sql-tutorial/"
    },
    {
      id: "da_step_3",
      stepNumber: 3,
      title: "Data Visualization & BI Tools (Power BI / Tableau)",
      focus: "Star Schema Modeling, DAX Measures & Executive Dashboards",
      description: "Design clean, interactive business intelligence dashboards. Understand dimensional modeling (Fact vs Dimension tables), DAX calculations, and visual storytelling.",
      difficulty: "Intermediate",
      subtopics: ["Dimensional Data Modeling (Star & Snowflake Schema)", "DAX Measures (CALCULATE, RELATED, FILTER, ALL)", "Visual Hierarchy, Color Palettes & Layout", "Row-Level Security & Workspace Publishing"],
      recommendedAction: "Build a 3-page interactive Power BI dashboard on customer acquisition cost and lifetime value.",
      resourceName: "Microsoft Power BI Guided Learning",
      resourceUrl: "https://learn.microsoft.com/en-us/training/powerplatform/power-bi"
    },
    {
      id: "da_step_4",
      stepNumber: 4,
      title: "Exploratory Data Analysis with Python",
      focus: "Pandas, NumPy, Matplotlib & Automated Reporting",
      description: "Use Python to automate repetitive data cleaning, merge disparate CSV/Excel files, detect anomalies, and generate automated PDF/HTML reports.",
      difficulty: "Intermediate",
      subtopics: ["Data Ingestion & Cleaning in Pandas", "Handling Missing Values & Format Inconsistencies", "Exploratory Data Visualizations (Seaborn)", "Automating CSV/Excel Workflows with Scripts"],
      recommendedAction: "Write a Python script that ingests 12 monthly sales reports and outputs an executive summary table.",
      resourceName: "Kaggle Micro-courses: Pandas & Data Visualization",
      resourceUrl: "https://www.kaggle.com/learn/pandas"
    },
    {
      id: "da_step_5",
      stepNumber: 5,
      title: "Business Metrics & Domain-Specific KPIs",
      focus: "SaaS, E-commerce, Marketing & Financial Unit Economics",
      description: "Learn how businesses make money. Master Customer Acquisition Cost (CAC), Lifetime Value (LTV), Monthly Recurring Revenue (MRR), Churn Rate, and Return on Ad Spend (ROAS).",
      difficulty: "Intermediate",
      subtopics: ["SaaS Metrics (ARR, MRR, Churn, NRR, LTV:CAC)", "E-Commerce Metrics (AOV, Conversion Rate, Cart Abandonment)", "Marketing Funnels & Multi-Touch Attribution", "Root Cause Analysis when Metrics Drop"],
      recommendedAction: "Document a complete metric tree for an Uber or Airbnb business model.",
      resourceName: "Reforge Product & Growth Metrics Guide",
      resourceUrl: "https://www.reforge.com/blog"
    },
    {
      id: "da_step_6",
      stepNumber: 6,
      title: "Business Case Studies & Interview Presentation",
      focus: "Root-Cause Triage, Executive Summaries & Live SQL Screening",
      description: "Prepare for live interview scenario questions. Learn the MECE framework to diagnose metric drops and present clear recommendations to leadership.",
      difficulty: "Advanced",
      subtopics: ["Diagnosing Metric Drops (Root Cause Tree)", "MECE Framework for Structured Thinking", "Live SQL Screen Coding under Pressure", "Executive Summary Writing"],
      recommendedAction: "Practice diagnosing a 15% revenue drop scenario with a mock peer interviewer.",
      resourceName: "Interview Query Data Analyst Practice",
      resourceUrl: "https://www.interviewquery.com/"
    }
  ],
  skills: {
    mustKnow: [
      "Advanced SQL (Window Functions, CTEs, Joins)",
      "Microsoft Excel (Pivot Tables, XLOOKUP, Modeling)",
      "Business Intelligence Tool (Power BI or Tableau)",
      "Descriptive Statistics (Mean, Median, Std Dev, Percentiles)",
      "Data Cleaning & Transformation",
      "Key Business Metrics (CAC, LTV, Churn, ARR)",
      "Visual Data Storytelling"
    ],
    goodToKnow: [
      "Python for Data Analysis (Pandas, NumPy)",
      "Data Modeling (Star Schema, Fact & Dimension tables)",
      "DAX / Power Query M Language",
      "Git & Version Control for Analytics",
      "Google BigQuery / Snowflake Basics",
      "Cohort Retention Analysis"
    ],
    advanced: [
      "A/B Testing & Statistical Significance for Analysts",
      "Predictive Analytics & Forecasting (Regression)",
      "Data Governance & Quality Monitoring",
      "dbt (data build tool) for Analytics Engineering",
      "Executive Storytelling for C-Suite Leadership",
      "Automated ETL Pipelines with Airflow / Python"
    ],
    toolsAndTech: [
      "SQL",
      "Power BI",
      "Tableau",
      "Microsoft Excel",
      "Python / Pandas",
      "PostgreSQL",
      "Snowflake",
      "Google Sheets"
    ]
  },
  interviewRounds: [
    {
      step: "01",
      title: "SQL & Aptitude Assessment",
      focus: "60-minute Online Test on HackerRank / TestGorilla",
      description: "Covers 3–4 live SQL problems (joins, window functions, aggregations) and 15 multiple-choice questions on business metrics and chart interpretation.",
      tips: [
        "Pay special attention to NULL values in aggregate functions (COUNT(col) vs COUNT(*)).",
        "Use CTEs to structure complex multi-step queries cleanly.",
        "Check column aliases to match exact expected assessment output schemas."
      ],
      keyQuestions: [
        "Find the top 3 highest spending customers in each department",
        "Calculate month-over-month growth rate in new customer acquisitions",
        "Identify customers who purchased in January but made 0 purchases in February"
      ]
    },
    {
      step: "02",
      title: "Technical SQL Screen",
      focus: "45-minute Live Interactive SQL Coding",
      description: "Conducted by a Senior Data Analyst. You will share your screen and write queries live against a relational database schema.",
      tips: [
        "Explain your logic before writing SQL code.",
        "Ask clarifying questions: 'Can a user have multiple orders on the same day?'",
        "Format your SQL cleanly with uppercase keywords and indented clauses."
      ],
      keyQuestions: [
        "Write a query to calculate customer cohort retention for 3 months post-signup",
        "Explain the difference between WHERE and HAVING with a concrete query example",
        "How do you handle duplicate rows in an unindexed transaction table?"
      ]
    },
    {
      step: "03",
      title: "Business Case Study & Dashboard Critique",
      focus: "Take-home or Live Presentation on Business Insights",
      description: "You will be given a sample dataset (e.g. 5,000 sales transactions) and asked to find actionable insights, design a dashboard, and present findings.",
      tips: [
        "Do not just show charts—explain what business decisions the CEO should make based on them.",
        "Highlight risks, data limitations, and missing information you would request.",
        "Keep slides visual: big KPI numbers, simple charts, and 3 key recommendations."
      ],
      keyQuestions: [
        "Our marketing acquisition cost spiked by 25% last month while revenue stayed flat. How do you investigate?",
        "Walk me through a dashboard you built and how it changed a stakeholder's decision.",
        "How would you measure the cannibalization effect of launching a discounted subscription tier?"
      ]
    },
    {
      step: "04",
      title: "Behavioral & Stakeholder Management",
      focus: "Communication, Pushback, Priorities & Collaboration",
      description: "Conducted by the Analytics Manager or Business Partner. Evaluates how you manage conflicting deadlines and communicate with non-technical business leaders.",
      tips: [
        "Describe a time you discovered an error in an executive report and how you handled it transparently.",
        "Show how you say 'no' or negotiate deadlines when stakeholders demand urgent ad-hoc requests.",
        "Emphasize your focus on business impact rather than just building dashboards."
      ],
      keyQuestions: [
        "Tell me about a time a stakeholder asked for data to support a flawed assumption. How did you handle it?",
        "How do you prioritize between a critical executive request and an ongoing core project?",
        "Describe how you explain a complex SQL metric calculation to a non-technical sales director."
      ]
    }
  ],
  assessmentPrep: [
    {
      title: "SQL Querying & Data Extraction",
      weightage: "50% of Assessment Score",
      description: "Testing relational schema navigation, window functions, grouping, and subqueries.",
      keyTopics: ["Multi-Table Joins (Inner, Left, Full)", "Window Functions (RANK, DENSE_RANK, LAG, LEAD)", "Aggregations with HAVING", "Date Formatting & Interval Arithmetic"],
      sampleQuestion: "Write a SQL query to calculate the percentage of users who made a repeat purchase within 14 days of their first order.",
      preparationTip: "Practice formatting queries with CTEs (Common Table Expressions) for clarity and maintainability."
    },
    {
      title: "Business Mathematics & Metrics",
      weightage: "25% of Assessment Score",
      description: "Calculating unit economics, growth rates, conversion rates, and financial ROI.",
      keyTopics: ["Percentage Change & Compound Growth", "CAC, LTV & Churn Formulas", "Profit Margins & Break-even Analysis", "Funnel Conversion Rates"],
      sampleQuestion: "If marketing spent $50,000 to acquire 2,000 customers, and each customer generates $15/month with 5% monthly churn, what is the LTV:CAC ratio?",
      preparationTip: "Memorize LTV formula: LTV = (ARPU * Gross Margin) / Churn Rate."
    },
    {
      title: "Chart & Data Interpretation",
      weightage: "15% of Assessment Score",
      description: "Interpreting trends, anomalies, and relationships from scatter plots, bar charts, and funnel diagrams.",
      keyTopics: ["Trend Lines & Seasonality", "Outlier Identification", "Misleading Axes & Distortions", "Correlation vs Causation"],
      sampleQuestion: "Identify whether the seasonal spike in Q4 sales was driven by higher order volume or higher average order value.",
      preparationTip: "Always check axes scaling and baseline zero before drawing conclusions from charts."
    },
    {
      title: "Analytical Reasoning & Problem Solving",
      weightage: "10% of Assessment Score",
      description: "Logical deduction, structured root-cause analysis, and eliminating impossible causes.",
      keyTopics: ["MECE Framework", "Root Cause Analysis", "Deductive Logic", "Scenario Evaluation"],
      sampleQuestion: "Website traffic remained steady, but checkout conversion dropped 18% in the Safari browser. What is the most likely root cause?",
      preparationTip: "Break problems down by user segment, browser/device, geography, and recent code deployments."
    }
  ],
  interviewCategories: [
    {
      categoryName: "Core SQL & Data Modeling",
      description: "Real-world queries on transactional schemas asked in data analyst interviews.",
      questionCount: 110,
      topicsCovered: ["Window Functions", "Self Joins", "CTEs", "Rolling Sums", "Deduplication"],
      sampleQuestions: [
        {
          question: "How do you find the second highest salary in a table using SQL without using LIMIT?",
          expectedApproach: "Use DENSE_RANK() OVER (ORDER BY salary DESC) as a subquery or CTE, then filter WHERE rank = 2. Alternatively, use MAX(salary) WHERE salary < (SELECT MAX(salary) FROM employees).",
          difficulty: "Easy"
        },
        {
          question: "What is the difference between UNION and UNION ALL?",
          expectedApproach: "UNION performs a distinct sort to eliminate duplicate rows across result sets (slower). UNION ALL concatenates all rows directly without checking for duplicates (faster).",
          difficulty: "Easy"
        }
      ]
    },
    {
      categoryName: "Business Metrics & Diagnostic Case Studies",
      description: "Scenario-based case questions evaluating how you investigate metric anomalies.",
      questionCount: 55,
      topicsCovered: ["Root Cause Analysis", "Funnel Metrics", "SaaS Economics", "A/B Testing"],
      sampleQuestions: [
        {
          question: "Our Daily Active Users (DAU) dropped by 10% yesterday. Walk me through your triage process.",
          expectedApproach: "1) Verify data integrity & pipeline lag. 2) Check if drop is external (holiday, internet outage) or internal (app release bug). 3) Segment by platform (iOS, Android, Web), country, and user age (new vs existing). 4) Check feature-specific usage.",
          difficulty: "Medium"
        }
      ]
    },
    {
      categoryName: "Data Visualization & Dashboard Design",
      description: "Best practices in BI tool design, data modeling, and executive storytelling.",
      questionCount: 40,
      topicsCovered: ["Power BI", "Tableau", "Star Schema", "DAX", "Visual Storytelling"],
      sampleQuestions: [
        {
          question: "What is the difference between a Fact Table and a Dimension Table in dimensional modeling?",
          expectedApproach: "A Fact Table contains quantitative numeric measurements (e.g. order amount, quantity) and foreign keys. A Dimension Table contains descriptive attributes (e.g. customer name, product category, date) used for filtering and slicing.",
          difficulty: "Easy"
        }
      ]
    }
  ],
  practiceQuestions: [
    {
      id: "da_pq_1",
      topic: "SQL",
      title: "Month-over-Month Revenue Growth",
      difficulty: "Medium",
      type: "SQL",
      questionText: "Write a SQL query that calculates the total monthly revenue and the month-over-month (MoM) revenue growth percentage for the year 2026.",
      solutionHint: "Use DATE_TRUNC('month', order_date), SUM(revenue), and the LAG() window function to retrieve the previous month's revenue, then calculate (current - prev) / prev * 100.",
      companyTags: ["Amazon", "Uber", "Flipkart"]
    },
    {
      id: "da_pq_2",
      topic: "Business Case",
      title: "E-Commerce Cart Abandonment Spike",
      difficulty: "Medium",
      type: "Case Study",
      questionText: "Cart abandonment rate jumped from 62% to 78% over the past weekend. How would you investigate and what data points would you analyze?",
      solutionHint: "Segment by device type, payment gateway failure rates, shipping cost changes, promo code error logs, and page load latency on the checkout step.",
      companyTags: ["Shopify", "Walmart", "Target"]
    },
    {
      id: "da_pq_3",
      topic: "Excel / Modeling",
      title: "Cohort Retention Rate Matrix",
      difficulty: "Medium",
      type: "Conceptual",
      questionText: "How do you construct a cohort retention analysis in SQL or Excel, and why is it superior to looking at aggregate monthly active users?",
      solutionHint: "Group users by signup month (cohort) and calculate the percentage of each cohort returning in Month 1, Month 2, Month 3. It isolates product improvements from top-of-funnel marketing acquisition volume.",
      companyTags: ["Spotify", "Netflix", "Groww"]
    }
  ],
  projects: [
    {
      id: "da_proj_1",
      title: "Interactive SaaS Customer Retention & Executive Dashboard (Power BI)",
      difficulty: "Intermediate",
      skillsCovered: ["Power BI", "DAX", "SQL", "Star Schema Modeling", "Cohort Analysis"],
      whatItDemonstrates: "Demonstrates ability to model complex relational data, write advanced DAX measures, and design clean executive dashboards.",
      recommendedStack: ["Power BI", "SQL", "PostgreSQL", "Excel"],
      talkingPoints: [
        "Engineered a Star Schema data model connecting 150k subscription events with customer dimension tables.",
        "Authored 25+ dynamic DAX measures for ARR, MRR, Logo Churn, and Net Revenue Retention (NRR).",
        "Created a dynamic cohort heatmap identifying that customers acquired via organic search had 22% higher 6-month retention."
      ]
    },
    {
      id: "da_proj_2",
      title: "E-Commerce Marketing Channel Attribution & ROAS Analysis (SQL & Python)",
      difficulty: "Intermediate",
      skillsCovered: ["SQL (Window Functions)", "Python", "Seaborn", "Funnel Analytics", "Attribution Modeling"],
      whatItDemonstrates: "Demonstrates multi-touch attribution analysis, customer journey mapping, and translating data into marketing budget allocation recommendations.",
      recommendedStack: ["PostgreSQL", "Python", "Pandas", "Matplotlib", "Tableau"],
      talkingPoints: [
        "Analyzed 350,000 multi-touch customer touchpoints comparing First-Touch vs Last-Touch vs Linear Attribution models.",
        "Discovered that Paid Search was over-credited by 34% while Email Retargeting drove 48% of repeat conversion value.",
        "Delivered data-driven recommendations that reallocated $120k in quarterly ad spend, boosting overall blended ROAS by 18%."
      ]
    }
  ],
  resumeGuidance: {
    targetRole: "Data Analyst / Business Intelligence Analyst",
    atsKeywords: [
      "SQL", "Power BI", "Tableau", "Excel", "Data Visualization", "Data Modeling", "DAX", "Business Intelligence",
      "Cohort Analysis", "KPI Tracking", "Python", "Pandas", "Reporting", "ETL", "Dashboards", "Root Cause Analysis"
    ],
    mustHaveSections: [
      "Contact Info & LinkedIn / GitHub / Tableau Public Portfolio",
      "Core Skills (SQL, BI Tools, Excel, Metrics, Statistical Techniques)",
      "Work Experience (Quantified business insights & decisions enabled)",
      "Featured Projects (with links to Tableau Public or GitHub repos)",
      "Education"
    ],
    recommendedProjectTypes: [
      "Live interactive Power BI or Tableau Public dashboard on business metrics",
      "SQL repository showcasing complex window functions, CTEs, and cohort analysis",
      "Python data cleaning and automated reporting script"
    ],
    actionVerbs: ["Analyzed", "Visualized", "Automated", "Identified", "Engineered", "Synthesized", "Delivered", "Forecasted"],
    commonMistakes: [
      "Listing tools without linking to public dashboard samples or GitHub queries.",
      "Saying 'built a dashboard' without mentioning who used it and what business decision it guided.",
      "Leaving out key business acronyms like CAC, LTV, ROI, and MoM growth."
    ],
    sampleBulletPoints: [
      "Built an automated executive Power BI dashboard tracking $4.2M in annual recurring revenue across 12 product lines, saving 15 manual reporting hours weekly.",
      "Wrote complex SQL queries utilizing window functions and CTEs to identify a $45,000 billing leak in inactive customer accounts.",
      "Analyzed customer churn trends across 80,000 accounts, identifying that users without onboarding walkthroughs churned at 2.4x higher rates."
    ]
  },
  studySheets: [
    {
      title: "LeetCode Top SQL 50 Study Plan",
      category: "SQL",
      provider: "LeetCode Official",
      description: "Essential collection of SQL interview problems covering joins, window functions, aggregations, and subqueries.",
      url: "https://leetcode.com/studyplan/top-sql-50/",
      badge: "Must Master"
    },
    {
      title: "Mode Analytics SQL & Business Analytics Guide",
      category: "Analytics & SQL",
      provider: "Mode Analytics",
      description: "Real-world business analytics exercises, schema design, and cohort retention query patterns.",
      url: "https://mode.com/sql-tutorial/",
      badge: "Real World"
    },
    {
      title: "Microsoft Power BI DAX & Modeling Patterns",
      category: "BI & Dashboarding",
      provider: "DAX Guide (SQLBI)",
      description: "Complete formula reference and best practices for writing efficient DAX calculations in Power BI.",
      url: "https://dax.guide/",
      badge: "Comprehensive"
    }
  ],
  careerPathways: [
    {
      stage: "Junior / Associate Data Analyst",
      experience: "0 – 2 Years",
      compensation: "₹5L – ₹12L / $65k – $95k",
      focus: "Ad-hoc SQL Queries & Dashboard Maintenance",
      responsibilities: "Writing SQL queries to extract data, maintaining team dashboards in Power BI/Tableau, updating weekly reports, and validating data accuracy.",
      requiredSkills: ["SQL", "Excel", "Power BI / Tableau", "Basic Stats", "Data Validation"]
    },
    {
      stage: "Data Analyst (Mid-Level)",
      experience: "2 – 5 Years",
      compensation: "₹13L – ₹25L / $100k – $140k",
      focus: "Independent Analysis & Strategic Recommendations",
      responsibilities: "Leading end-to-end analytics initiatives, designing dimensional data models, conducting cohort and churn studies, and translating data into actionable business advice.",
      requiredSkills: ["Advanced SQL", "DAX", "Star Schema", "Cohort Analysis", "Business Metrics", "Python"]
    },
    {
      stage: "Senior / Lead Data Analyst",
      experience: "5 – 8 Years",
      compensation: "₹26L – ₹52L / $145k – $210k",
      focus: "Analytics Strategy & Cross-Team Leadership",
      responsibilities: "Defining company metric standards, partnering directly with C-suite and Product Directors, establishing data governance, and mentoring junior analysts.",
      requiredSkills: ["Metric Tree Strategy", "dbt", "Data Governance", "Executive Presentation", "Mentorship"]
    },
    {
      stage: "Principal Analyst / Analytics Director",
      experience: "8+ Years",
      compensation: "₹55L – ₹1.2Cr+ / $215k – $320k+",
      focus: "Enterprise Intelligence & Commercial Strategy",
      responsibilities: "Leading the centralized analytics organization, driving data culture across business units, and advising C-level leaders on corporate mergers and growth bets.",
      requiredSkills: ["Enterprise BI Architecture", "Executive Strategy", "Organizational Leadership", "Budget Planning"]
    }
  ]
};

// 4. Data Engineer
export const DATA_ENGINEER_ROLE: PrepRole = {
  id: "data-engineer",
  name: "Data Engineer",
  category: "Engineering",
  badge: "High Salary · Infrastructure",
  tagline: "Big Data Pipelines, Distributed Processing (Spark), Warehouses (Snowflake) & Streaming (Kafka)",
  overview: {
    coreSkills: ["Distributed Computing (Apache Spark / PySpark)", "Advanced SQL & Dimensional Modeling", "Python / Scala Scripting", "Data Warehousing (Snowflake / BigQuery / Redshift)", "Orchestration (Apache Airflow)", "Event Streaming (Apache Kafka / Flink)"],
    recommendedTopics: ["Partitioning, Clustering & Sharding", "Data Lakehouse (Delta Lake / Iceberg)", "Data Pipeline Idempotency & Backfilling", "Slowly Changing Dimensions (SCD Type 2)", "Data Quality Testing & Great Expectations"],
    interviewAreas: ["SQL & Dimensional Data Modeling", "Distributed Data Processing with Spark", "Pipeline Architecture & Reliability", "Streaming vs Batch Systems", "System Design for Big Data"],
    assessmentAreas: ["Complex SQL & Aggregations (60 mins)", "Python / PySpark Coding", "Data Modeling Scenarios", "Distributed Systems MCQs"],
    typicalProjects: ["Real-Time Clickstream Pipeline with Kafka & Flink", "Automated Petabyte Lakehouse with Spark & Delta Lake", "Scalable Batch ELT Framework with dbt & Airflow", "Data Quality & Anomaly Detection Engine"],
    estimatedWeeks: "12 – 16 Weeks",
    avgFresherSalary: "₹9L – ₹20L / $90k – $130k",
    avgSeniorSalary: "₹38L – ₹80L / $190k – $300k"
  },
  roadmap: [
    {
      id: "de_step_1",
      stepNumber: 1,
      title: "Python, Linux & Relational Data Engineering",
      focus: "Python Scripting, Bash, Git & Advanced PostgreSQL",
      description: "Master Linux shell, cron jobs, file systems, and Python object-oriented scripting. Write production database migrations and bulk data loaders using psycopg2 and SQLAlchemy.",
      difficulty: "Beginner",
      subtopics: ["Linux Shell & Automated Bash Scripting", "Python File I/O, Generators & Iterators", "PostgreSQL Indexing, Vacuuming & EXPLAIN ANALYZE", "Database Connection Pooling & Batch Inserts"],
      recommendedAction: "Build a Python script that ingests 500MB of CSVs into PostgreSQL with chunked batch loading.",
      resourceName: "Data Engineering Zoomcamp by DataTalksClub",
      resourceUrl: "https://github.com/DataTalksClub/data-engineering-zoomcamp"
    },
    {
      id: "de_step_2",
      stepNumber: 2,
      title: "Data Modeling & Cloud Data Warehousing",
      focus: "Star Schema, Snowflake, BigQuery & SCD Type 2",
      description: "Master Kimball dimensional modeling (Facts, Dimensions, Conformed Dimensions, Grain). Learn Snowflake micro-partitioning, clustering keys, zero-copy cloning, and time travel.",
      difficulty: "Intermediate",
      subtopics: ["Kimball Dimensional Modeling (Star vs Snowflake)", "Slowly Changing Dimensions (SCD Type 1, 2, 3)", "Snowflake Architecture & Micro-partitioning", "BigQuery Partitioning & Clustering Best Practices"],
      recommendedAction: "Design a complete dimensional model for an e-commerce platform with SCD Type 2 customer history.",
      resourceName: "The Data Warehouse Toolkit by Ralph Kimball",
      resourceUrl: "https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/books/data-warehouse-toolkit/"
    },
    {
      id: "de_step_3",
      stepNumber: 3,
      title: "Distributed Data Processing with Apache Spark",
      focus: "PySpark, DataFrames, Memory Management & Skew Handling",
      description: "Master distributed computing. Understand DAG execution, lazy evaluation, wide vs narrow transformations, shuffles, broadcast joins, and resolving data skew bottlenecks.",
      difficulty: "Intermediate",
      subtopics: ["Spark Architecture (Driver, Executors, Tasks, Slots)", "Narrow vs Wide Transformations & Shuffling", "Broadcast Hash Joins vs Sort-Merge Joins", "Managing Memory, Garbage Collection & Data Skew"],
      recommendedAction: "Process a 10GB dataset with PySpark, optimize shuffles, and save results in Parquet format.",
      resourceName: "Spark: The Definitive Guide by Bill Chambers & Matei Zaharia",
      resourceUrl: "https://github.com/databricks/Spark-The-Definitive-Guide"
    },
    {
      id: "de_step_4",
      stepNumber: 4,
      title: "Workflow Orchestration & Modern Data Stack (dbt + Airflow)",
      focus: "Apache Airflow DAGs, dbt Transformations & Idempotency",
      description: "Build reliable, idempotent data pipelines. Write Python Airflow DAGs with retries and SLAs. Use dbt to write modular, tested, version-controlled SQL transformations.",
      difficulty: "Intermediate",
      subtopics: ["Airflow DAG Construction, Sensors & Operators", "Pipeline Idempotency & Backfill Automation", "dbt Models, Tests, Snapshots & Documentation", "Data Quality Frameworks (Great Expectations)"],
      recommendedAction: "Create an Airflow DAG orchestrating dbt models with automatic Slack failure alerts.",
      resourceName: "Astronomer Airflow Guides",
      resourceUrl: "https://www.astronomer.io/docs/"
    },
    {
      id: "de_step_5",
      stepNumber: 5,
      title: "Real-Time Streaming Systems (Kafka & Flink)",
      focus: "Event Streaming, Pub/Sub, Exactly-Once Semantics & Windowing",
      description: "Build sub-second event ingestion systems with Apache Kafka. Learn topic partitions, consumer groups, offsets, compaction, and streaming stateful windowing with Apache Flink.",
      difficulty: "Advanced",
      subtopics: ["Kafka Architecture (Brokers, Topics, Partitions, Replicas)", "Consumer Groups, Offsets & Rebalancing", "Exactly-Once Processing Semantics (EOS)", "Stateful Streaming & Tumbling/Sliding Windows with Flink"],
      recommendedAction: "Set up a local Kafka cluster with Docker, produce simulated user events, and consume into a warehouse.",
      resourceName: "Confluent Kafka Tutorials",
      resourceUrl: "https://developer.confluent.io/tutorials/"
    },
    {
      id: "de_step_6",
      stepNumber: 6,
      title: "Modern Lakehouse Architectures & System Design",
      focus: "Delta Lake, Apache Iceberg, Cost Optimization & Security",
      description: "Architect petabyte-scale lakehouses. Master ACID transactions on object storage with Apache Iceberg/Delta Lake, cloud compute cost optimization, and GDPR compliance.",
      difficulty: "Advanced",
      subtopics: ["Table Formats (Apache Iceberg vs Delta Lake vs Hudi)", "Cloud Storage Cost Optimization (S3 Tiering, Compaction)", "Data Governance, RBAC & GDPR Right to be Forgotten", "Big Data System Design Interview Prep"],
      recommendedAction: "Design a complete data platform for a ride-sharing service handling 50k events/sec.",
      resourceName: "Awesome Data Engineering Guides",
      resourceUrl: "https://github.com/igorbarinov/awesome-data-engineering"
    }
  ],
  skills: {
    mustKnow: [
      "Advanced SQL (Complex Queries, Optimization)",
      "Python / PySpark",
      "Data Modeling (Star Schema, Fact/Dimension tables)",
      "Cloud Data Warehousing (Snowflake / BigQuery / Redshift)",
      "Workflow Orchestration (Apache Airflow)",
      "Parquet / Columnar File Formats",
      "Git & Linux Command Line"
    ],
    goodToKnow: [
      "Apache Spark Optimization & Tuning",
      "dbt (data build tool)",
      "Apache Kafka Event Streaming",
      "Docker & Cloud Basics (AWS S3, IAM, EMR)",
      "CI/CD for Data Pipelines",
      "Data Quality Testing (Great Expectations)"
    ],
    advanced: [
      "Modern Table Formats (Apache Iceberg / Delta Lake)",
      "Real-Time Stream Processing (Apache Flink)",
      "Data Lakehouse Architecture",
      "Distributed Query Engines (Trino / Presto)",
      "Data Mesh & Domain-Driven Data Architecture",
      "Infrastructure as Code (Terraform) for Data"
    ],
    toolsAndTech: [
      "Python",
      "Apache Spark",
      "Apache Kafka",
      "Snowflake",
      "Apache Airflow",
      "dbt",
      "PostgreSQL",
      "AWS / GCP"
    ]
  },
  interviewRounds: [
    {
      step: "01",
      title: "SQL & Python Assessment",
      focus: "75-minute Data Engineering Coding Challenge",
      description: "Covers complex SQL data transformation queries and Python data pipeline algorithms (handling JSON parsing, deduplication, and schema validation).",
      tips: [
        "Write idempotent logic that handles duplicate incoming events.",
        "Demonstrate memory efficiency when processing large files (use generators instead of loading whole file).",
        "Explain query plans using EXPLAIN ANALYZE."
      ],
      keyQuestions: [
        "Write SQL to implement Slowly Changing Dimension (SCD Type 2) tracking",
        "Parse nested semi-structured JSON clickstream data in Python efficiently",
        "Implement a memory-efficient deduplication pipeline for 10M records"
      ]
    },
    {
      step: "02",
      title: "Data Modeling & Warehouse Architecture",
      focus: "60-minute Dimensional Modeling Session",
      description: "You will be given a business scenario (e.g. food delivery or airline reservations) and asked to design a complete star schema data model.",
      tips: [
        "Clearly define the grain of every fact table before writing column lists.",
        "Distinguish between additive, semi-additive, and non-additive facts.",
        "Address how you handle late-arriving dimensions and schema evolution."
      ],
      keyQuestions: [
        "Design a dimensional model for an online rideshare service like Uber",
        "How do you handle currency conversions across multiple countries in a fact table?",
        "Explain when you would denormalize a dimension table in Snowflake or BigQuery"
      ]
    },
    {
      step: "03",
      title: "Distributed Systems & Spark Deep Dive",
      focus: "Apache Spark Internals, Memory Management & Skew",
      description: "Technical interview assessing your understanding of distributed computing, partition strategies, shuffle operations, and Spark job optimization.",
      tips: [
        "Explain what triggers a shuffle and why broadcast joins eliminate shuffles.",
        "Describe how to identify data skew in the Spark UI and solve it with salting.",
        "Know the difference between cache() and persist() storage levels."
      ],
      keyQuestions: [
        "A Spark job is hanging at 99% completion on the last task. What is the root cause and how do you fix it?",
        "Explain how Spark memory is divided between storage and execution",
        "How do you choose the optimal partition count for a 500GB dataset?"
      ]
    },
    {
      step: "04",
      title: "Big Data System Design",
      focus: "End-to-End Pipeline Architecture & Scale",
      description: "Design a complete data platform to ingest, process, store, and serve analytics for billions of daily events with high availability and low latency.",
      tips: [
        "Clarify SLA requirements: what needs to be sub-second real-time vs batch hourly?",
        "Design for fault tolerance: show dead-letter queues, checkpointing, and replay capability.",
        "Address data governance, privacy compliance (GDPR), and cloud storage costs."
      ],
      keyQuestions: [
        "Design a real-time fraud monitoring pipeline for a payment gateway handling 20,000 TPS",
        "Design a petabyte-scale data lakehouse architecture for IoT sensor telemetry",
        "How would you migrate a legacy Hadoop cluster to Snowflake and S3 with zero data loss?"
      ]
    },
    {
      step: "05",
      title: "Behavioral & Operational Reliability",
      focus: "Production Incidents, SLA Management & Cross-Team Collaboration",
      description: "Evaluates how you handle pipeline outages, communicate with upstream software engineering teams when schemas break, and prioritize technical debt.",
      tips: [
        "Share an authentic story of a broken pipeline and how you introduced automated testing to prevent it.",
        "Explain how you manage schema drift caused by upstream backend developers.",
        "Demonstrate passion for data quality, documentation, and operational excellence."
      ],
      keyQuestions: [
        "Tell me about a time a data pipeline silently produced corrupted data and how you resolved it.",
        "How do you ensure upstream engineering teams don't break data pipelines with unannounced schema changes?",
        "Describe a situation where you optimized cloud compute infrastructure to save substantial costs."
      ]
    }
  ],
  assessmentPrep: [
    {
      title: "Advanced SQL & Data Transformation",
      weightage: "45% of Assessment Score",
      description: "Complex multi-table queries, analytical window functions, and deduplication logic under timed conditions.",
      keyTopics: ["Window Functions & Partitions", "SCD Type 2 Logic", "Date Interval Computations", "Hierarchical / Recursive CTEs"],
      sampleQuestion: "Write a SQL query that transforms raw clickstream sessions into continuous session durations with a 30-minute inactivity cutoff.",
      preparationTip: "Focus on window functions with conditional partitions and window frames (ROWS BETWEEN)."
    },
    {
      title: "Python Data Processing & Pipelines",
      weightage: "30% of Assessment Score",
      description: "Python scripting for file ingestion, JSON parsing, API data extraction, and memory-efficient data structures.",
      keyTopics: ["Generators & Iterators", "JSON parsing & error handling", "Multiprocessing & Threading", "Writing modular ETL functions"],
      sampleQuestion: "Write a generator function in Python that reads a 5GB file line-by-line and filters records without exceeding 50MB RAM.",
      preparationTip: "Use `yield` and chunked reading (`pd.read_csv(chunksize=10000)`) to demonstrate memory awareness."
    },
    {
      title: "Data Modeling & Architecture Concepts",
      weightage: "25% of Assessment Score",
      description: "Theoretical understanding of data warehousing, distributed storage, and pipeline patterns.",
      keyTopics: ["Star vs Snowflake Schema", "Columnar vs Row-oriented Storage", "ACID vs BASE", "Idempotency & Deduplication"],
      sampleQuestion: "Explain why Parquet files with snappy compression outperform CSV files in cloud data lakes by 10x.",
      preparationTip: "Review columnar storage benefits: projection pushdown, predicate pushdown, and compression ratio."
    }
  ],
  interviewCategories: [
    {
      categoryName: "Dimensional Modeling & Data Architecture",
      description: "Designing scalable schemas for analytics and reporting.",
      questionCount: 75,
      topicsCovered: ["Star Schema", "SCD Types", "Fact Tables", "Snowflake", "BigQuery"],
      sampleQuestions: [
        {
          question: "Explain the difference between Slowly Changing Dimension Type 1, Type 2, and Type 3.",
          expectedApproach: "Type 1 overwrites old values (no history). Type 2 creates a new row with effective start/end dates and is_current flag (full historical preservation). Type 3 adds a new column for previous_value (limited history).",
          difficulty: "Medium"
        }
      ]
    },
    {
      categoryName: "Distributed Processing & Apache Spark",
      description: "Mastery of distributed compute engines and query optimization.",
      questionCount: 60,
      topicsCovered: ["Spark Architecture", "Shuffling", "Data Skew", "Broadcast Joins", "Memory"],
      sampleQuestions: [
        {
          question: "What is data skew in Apache Spark and how do you resolve it during a join?",
          expectedApproach: "Data skew occurs when uneven key distribution causes one executor to process significantly more data than others. Fix it using key salting (adding random prefix), broadcast hash joins for small tables, or adaptive query execution (AQE).",
          difficulty: "Hard"
        }
      ]
    },
    {
      categoryName: "Pipeline Orchestration & Streaming",
      description: "Building resilient pipelines with Kafka, Airflow, and Flink.",
      questionCount: 50,
      topicsCovered: ["Airflow", "Kafka", "Flink", "Idempotency", "Backfilling"],
      sampleQuestions: [
        {
          question: "How do you achieve exactly-once processing semantics in a streaming data pipeline?",
          expectedApproach: "Requires 3 components: 1) Replayable source (Kafka with consumer offsets), 2) Fault-tolerant stateful processing engine (Flink with checkpointing), and 3) Idempotent or two-phase commit sink to destination storage.",
          difficulty: "Hard"
        }
      ]
    }
  ],
  practiceQuestions: [
    {
      id: "de_pq_1",
      topic: "Distributed Systems",
      title: "Spark Data Skew Salting Technique",
      difficulty: "Hard",
      type: "Conceptual",
      questionText: "Explain how 'salting' solves data skew in a distributed join when 80% of rows share the same join key.",
      solutionHint: "Append a random integer from 0 to N-1 to the join key of the skewed table, and replicate the corresponding lookup table rows across all N possible keys, scattering the skewed key across multiple executors.",
      companyTags: ["Meta", "Netflix", "Uber"]
    },
    {
      id: "de_pq_2",
      topic: "Data Modeling",
      title: "Implementing SCD Type 2 with SQL",
      difficulty: "Medium",
      type: "SQL",
      questionText: "Write a SQL merge statement or procedure to update an existing customer dimension table when an address changes, creating a new version with start/end dates.",
      solutionHint: "Use SQL MERGE or a two-step CTE: 1) Update existing row setting valid_to = CURRENT_DATE and is_current = FALSE, 2) INSERT new row with new address, valid_from = CURRENT_DATE, valid_to = '9999-12-31', is_current = TRUE.",
      companyTags: ["Snowflake", "Amazon", "Capital One"]
    },
    {
      id: "de_pq_3",
      topic: "Streaming",
      title: "Kafka Consumer Rebalancing & Consumer Lag",
      difficulty: "Medium",
      type: "Architecture",
      questionText: "What causes Kafka consumer lag to accumulate, and how do you scale consumer groups without causing rebalance storms?",
      solutionHint: "Lag occurs when message ingestion rate exceeds consumer processing throughput. Scale by adding consumers up to the partition count, increase batch fetching, use cooperative sticky assignors, and avoid long-running blocking operations in message polling loops.",
      companyTags: ["LinkedIn", "Stripe", "DoorDash"]
    }
  ],
  projects: [
    {
      id: "de_proj_1",
      title: "Real-Time Financial Fraud Streaming Pipeline with Kafka & Apache Spark",
      difficulty: "Advanced",
      skillsCovered: ["Apache Kafka", "PySpark Streaming", "Docker", "PostgreSQL", "Grafana"],
      whatItDemonstrates: "Demonstrates event streaming, distributed stateful processing, low-latency aggregations, and resilient database sink writing.",
      recommendedStack: ["Kafka", "PySpark", "Docker", "PostgreSQL", "Grafana"],
      talkingPoints: [
        "Architected an event ingestion pipeline processing 25,000 transactions/sec using a 3-broker Kafka cluster.",
        "Implemented structured streaming in Spark with watermarking to handle 10-minute late-arriving events.",
        "Delivered aggregated fraud risk scores to operational dashboards with sub-3 second end-to-end latency."
      ]
    },
    {
      id: "de_proj_2",
      title: "Automated Petabyte Lakehouse Pipeline with Airflow, dbt & Snowflake",
      difficulty: "Advanced",
      skillsCovered: ["Apache Airflow", "dbt", "Snowflake", "AWS S3", "Great Expectations"],
      whatItDemonstrates: "Demonstrates modern data stack orchestration, modular SQL transformations, data quality testing, and pipeline idempotency.",
      recommendedStack: ["Airflow", "dbt", "Snowflake", "AWS S3", "GitHub Actions"],
      talkingPoints: [
        "Orchestrated 40+ daily ETL models in Airflow with automated backfills and retry policies.",
        "Implemented automated data testing using Great Expectations, preventing corrupt customer data from reaching production BI dashboards.",
        "Optimized Snowflake warehouse query costs by 38% through clustering key alignment and auto-suspend tuning."
      ]
    }
  ],
  resumeGuidance: {
    targetRole: "Data Engineer / Big Data Engineer",
    atsKeywords: [
      "Apache Spark", "PySpark", "SQL", "Python", "Data Warehousing", "Snowflake", "BigQuery", "Apache Kafka",
      "Apache Airflow", "dbt", "ETL Pipelines", "Data Modeling", "Star Schema", "Delta Lake", "Iceberg", "Docker", "AWS", "Databricks"
    ],
    mustHaveSections: [
      "Contact Info & GitHub Portfolio",
      "Technical Skills (Languages, Distributed Systems, Warehouses, Orchestration, Cloud)",
      "Work Experience (Emphasize data volume, latency reduction, cost savings)",
      "Featured Data Engineering Projects (with architecture diagrams in README)",
      "Education"
    ],
    recommendedProjectTypes: [
      "Distributed batch processing pipeline with Spark and columnar Parquet",
      "Real-time event streaming pipeline with Kafka and Docker",
      "End-to-end ELT framework with dbt, Airflow, and a cloud warehouse"
    ],
    actionVerbs: ["Architected", "Engineered", "Optimized", "Ingested", "Orchestrated", "Migrated", "Streamlined", "Scaled"],
    commonMistakes: [
      "Focusing only on basic SQL without showcasing distributed tools (Spark/Kafka).",
      "Listing tools without describing pipeline reliability, idempotency, or monitoring.",
      "Omitting scale metrics (e.g. mention 'processed 50M rows/day' instead of just 'built a pipeline')."
    ],
    sampleBulletPoints: [
      "Architected a scalable PySpark ingestion pipeline processing 45 million daily records into Snowflake, reducing latency by 72%.",
      "Engineered an automated Airflow DAG with dbt transformations and Great Expectations data quality gates, eliminating 99% of schema drift incidents.",
      "Optimized cloud storage and compute costs across AWS EMR and Snowflake, resulting in $65,000 annual cloud infrastructure savings."
    ]
  },
  studySheets: [
    {
      title: "Data Engineering Zoomcamp Playbook",
      category: "Data Engineering",
      provider: "DataTalksClub",
      description: "Free complete curriculum covering Docker, Terraform, GCP, Airflow, Spark, dbt, and Kafka.",
      url: "https://github.com/DataTalksClub/data-engineering-zoomcamp",
      badge: "Community Gold"
    },
    {
      title: "Awesome Big Data & Data Engineering Archive",
      category: "Big Data",
      provider: "GitHub Curated",
      description: "Comprehensive repository of open-source frameworks, distributed storage engines, and architectural patterns.",
      url: "https://github.com/igorbarinov/awesome-data-engineering",
      badge: "Reference"
    },
    {
      title: "Snowflake Architecture & Query Optimization Guide",
      category: "Data Warehousing",
      provider: "Snowflake Official",
      description: "Official guide to micro-partitioning, caching layers, clustering keys, and cost optimization.",
      url: "https://docs.snowflake.com/en/user-guide-overview",
      badge: "Official"
    }
  ],
  careerPathways: [
    {
      stage: "Associate Data Engineer",
      experience: "0 – 2 Years",
      compensation: "₹9L – ₹20L / $90k – $130k",
      focus: "Writing SQL Pipelines & Bug Fixes",
      responsibilities: "Writing and maintaining data ingestion scripts, building SQL models in dbt, monitoring Airflow DAG runs, and resolving pipeline failures.",
      requiredSkills: ["SQL", "Python", "Airflow Basics", "Git", "Relational DBs", "Linux"]
    },
    {
      stage: "Data Engineer (Level II)",
      experience: "2 – 5 Years",
      compensation: "₹22L – ₹42L / $135k – $180k",
      focus: "Distributed Compute & Warehouse Architecture",
      responsibilities: "Optimizing Spark jobs, designing star schemas in Snowflake, building real-time Kafka streams, and maintaining high pipeline availability SLAs.",
      requiredSkills: ["Apache Spark", "Snowflake / BigQuery", "Kafka", "dbt", "Data Modeling", "Docker"]
    },
    {
      stage: "Senior / Lead Data Engineer",
      experience: "5 – 8 Years",
      compensation: "₹45L – ₹80L / $190k – $280k",
      focus: "Data Platform Architecture & Scalability",
      responsibilities: "Architecting the central cloud lakehouse platform, reducing cloud compute expenditures, setting data quality standards, and mentoring junior engineers.",
      requiredSkills: ["Lakehouse Architecture (Iceberg/Delta)", "Stream Processing (Flink)", "Cloud Cost Optimization", "Cross-team Leadership"]
    },
    {
      stage: "Principal Data Architect / Director",
      experience: "8+ Years",
      compensation: "₹85L – ₹2.1Cr+ / $290k – $450k+",
      focus: "Enterprise Data Strategy & Governance",
      responsibilities: "Defining the enterprise data mesh strategy, evaluating bleeding-edge storage architectures, and ensuring regulatory compliance (GDPR/HIPAA).",
      requiredSkills: ["Enterprise Architecture", "Data Mesh", "Executive Alignment", "Multi-petabyte Scaling"]
    }
  ]
};

// 5. Product Manager
export const PRODUCT_MANAGER_ROLE: PrepRole = {
  id: "product-manager",
  name: "Product Manager",
  category: "Product & Design",
  badge: "High Leadership · Business & Tech",
  tagline: "Product Sense, Customer Discovery, Go-to-Market Strategy, Metrics & Cross-Functional Execution",
  overview: {
    coreSkills: ["Product Sense & User Need Identification", "Product Strategy & Vision Formulation", "Metrics, Analytics & A/B Testing", "Technical Fluency & System Architecture Literacy", "Market Sizing & Estimation", "Stakeholder Leadership & Prioritization"],
    recommendedTopics: ["First-Principles Thinking & User Persona Mapping", "North Star Metric & Guardrail Formulations", "RICE Prioritization Framework", "Guesstimates & TAM Calculations", "PRD (Product Requirements Document) Writing"],
    interviewAreas: ["Product Sense & Design Interview (45 mins)", "Product Strategy & Competitive Moats", "Analytical & Execution (Metric drops, trade-offs)", "Technical Literacy & Feasibility", "Behavioral Leadership & Conflict Management"],
    assessmentAreas: ["Product Case Study Assignment (Take-home)", "Product Critique & Wireframe Flow", "Metrics Tree Definition", "Guesstimate Problem Solving"],
    typicalProjects: ["0-to-1 Marketplace Product Strategy Document", "Feature Redesign PRD with Metric Tree & A/B Test Plan", "Growth & Retention Strategy for Subscription Product", "AI-Powered Customer Support Automation PRD"],
    estimatedWeeks: "8 – 12 Weeks",
    avgFresherSalary: "₹10L – ₹22L / $95k – $135k",
    avgSeniorSalary: "₹40L – ₹85L / $200k – $320k"
  },
  roadmap: [
    {
      id: "pm_step_1",
      stepNumber: 1,
      title: "Product Fundamentals & User Discovery",
      focus: "User Empathy, Problem Definition & Jobs-to-be-Done (JTBD)",
      description: "Learn to separate customer problems from feature solutions. Master customer interviewing, persona generation, and the Jobs-to-be-Done framework.",
      difficulty: "Beginner",
      subtopics: ["Customer Interviewing Techniques", "Jobs-to-be-Done (JTBD) Framework", "User Persona & Journey Mapping", "Identifying Unmet Customer Needs"],
      recommendedAction: "Interview 3 users of an everyday app (e.g. Swiggy or Uber) and document their unarticulated friction points.",
      resourceName: "The Mom Test by Rob Fitzpatrick",
      resourceUrl: "https://www.momtestbook.com/"
    },
    {
      id: "pm_step_2",
      stepNumber: 2,
      title: "Product Sense & Design Interview Frameworks",
      focus: "CIRCLES Method, Wireframing & Feature Prioritization",
      description: "Master the classic Product Sense interview structure. Learn the CIRCLES method to systematically design products from user segments to trade-offs.",
      difficulty: "Intermediate",
      subtopics: ["CIRCLES Method Framework", "Identifying Target User Segments", "Brainstorming Creative, High-Impact Solutions", "Prioritization Frameworks (RICE, Kano Model)"],
      recommendedAction: "Write out a complete answer to 'Design an alarm clock for the blind' using the CIRCLES method.",
      resourceName: "Decode and Conquer by Lewis C. Lin",
      resourceUrl: "https://www.lewis-lin.com/decode-and-conquer"
    },
    {
      id: "pm_step_3",
      stepNumber: 3,
      title: "Product Analytics, Metrics & Experimentation",
      focus: "North Star Metrics, Metric Trees, A/B Testing & Funnel Drops",
      description: "Define the right success metrics for products. Learn how to structure metric trees (Engagement, Retention, Monetization), diagnose metric drops, and design A/B tests.",
      difficulty: "Intermediate",
      subtopics: ["North Star Metric Definition", "Building Metric Trees & Input/Output Metrics", "A/B Testing Best Practices & Statistical Power", "Diagnosing Metric Drops (Root Cause Tree)"],
      recommendedAction: "Build a complete metric tree for Spotify, defining North Star and 5 supporting input metrics.",
      resourceName: "Reforge Product Metrics & Retention Series",
      resourceUrl: "https://www.reforge.com/blog/retention-engagement"
    },
    {
      id: "pm_step_4",
      stepNumber: 4,
      title: "Product Strategy, Market Sizing & Competitive Moats",
      focus: "TAM Estimation, Network Effects, 7 Powers & Go-to-Market",
      description: "Think like a CEO. Understand competitive advantages (7 Powers), calculate Total Addressable Market (TAM), and craft 3-year product roadmaps.",
      difficulty: "Intermediate",
      subtopics: ["Market Sizing Guesstimates (Top-Down & Bottom-Up)", "Hamilton Helmer's 7 Powers (Network Effects, Switching Costs)", "Pricing & Packaging Strategies", "Go-To-Market (GTM) Launch Strategy"],
      recommendedAction: "Estimate the market size of EV charging stations in India or the United States.",
      resourceName: "7 Powers: The Foundations of Business Strategy",
      resourceUrl: "https://7powers.com/"
    },
    {
      id: "pm_step_5",
      stepNumber: 5,
      title: "Technical Fluency for Product Managers",
      focus: "System Architecture, APIs, Latency & Engineering Trade-offs",
      description: "Speak the language of software engineers. Understand APIs, caching, databases, client-server models, machine learning capabilities, and technical debt trade-offs.",
      difficulty: "Intermediate",
      subtopics: ["APIs, Webhooks & Client-Server Architecture", "Databases (SQL vs NoSQL) & Caching Trade-offs", "ML Capabilities: Recommendation Systems & LLMs", "Managing Technical Debt vs Feature Velocity"],
      recommendedAction: "Explain how an Uber dispatch algorithm works technically from ride request to driver matching.",
      resourceName: "Swipe to Unlock: A Primer on Technology",
      resourceUrl: "https://www.swipetounlock.com/"
    },
    {
      id: "pm_step_6",
      stepNumber: 6,
      title: "PRD Writing, Leadership & Mock Interviews",
      focus: "Writing Crisp PRDs, Cross-Functional Leadership & Mock Practice",
      description: "Write executive-ready Product Requirement Documents. Master stakeholder management, saying no with data, and run 10+ live mock product interviews.",
      difficulty: "Advanced",
      subtopics: ["Writing Amazon-Style PR/FAQ Documents", "Cross-Functional Influence Without Authority", "Handling Executive Pushback & Disagreements", "Live Peer Mock Interviews on StellarPeers / Exponent"],
      recommendedAction: "Write a 2-page PR/FAQ document for a new AI feature in Google Workspace or Slack.",
      resourceName: "Exponent Product Manager Interview Course",
      resourceUrl: "https://www.tryexponent.com/courses/pm"
    }
  ],
  skills: {
    mustKnow: [
      "Product Sense & User Problem Identification",
      "CIRCLES Method for Product Design",
      "Metrics Definition (North Star, Funnels, Retention)",
      "A/B Testing & Experimentation Logic",
      "Prioritization Frameworks (RICE, MoSCoW)",
      "Writing PRDs and User Stories",
      "Stakeholder Communication & Influence Without Authority"
    ],
    goodToKnow: [
      "Market Sizing & Guesstimate Calculations",
      "Technical Fluency (APIs, Databases, Cloud)",
      "Figma Wireframing & Prototyping Basics",
      "SQL for Self-Service Product Analytics",
      "Competitive Strategy & Business Moats",
      "Pricing & Monetization Models"
    ],
    advanced: [
      "AI & Machine Learning Product Sense (LLMs, Agents)",
      "Platform Product Management & Developer APIs",
      "Executive Storytelling & Board Presentations",
      "0-to-1 Venture Incubation Strategy",
      "Global Localization & Regulatory Compliance",
      "Mergers & Acquisitions Product Integration"
    ],
    toolsAndTech: [
      "Figma",
      "Notion / Coda",
      "Jira / Linear",
      "Mixpanel / Amplitude",
      "SQL",
      "Google Analytics",
      "Whimsical / Miro",
      "Productboard"
    ]
  },
  interviewRounds: [
    {
      step: "01",
      title: "Recruiter & Initial Fit Screen",
      focus: "Resume Review, PM Philosophy & Communication",
      description: "30-minute conversation with a senior product recruiter discussing your past product impact, why PM, and why this specific company.",
      tips: [
        "Clearly explain 1 flagship feature you shipped and its quantifiable metric outcome.",
        "Articulate why you are excited about this company's product challenges specifically.",
        "Demonstrate high energy, concise speech, and structured thinking."
      ],
      keyQuestions: [
        "Tell me about yourself and walk me through your favorite product you've shipped.",
        "What is your favorite product and how would you improve it?",
        "Why do you want to be a Product Manager at this company?"
      ]
    },
    {
      step: "02",
      title: "Product Sense & Design Interview",
      focus: "45-minute Interactive Product Design Challenge",
      description: "The cornerstone PM interview. You will design a product for a specific user segment or solve a creative product challenge live.",
      tips: [
        "Follow the CIRCLES method: Clarify context -> Identify users -> Report needs -> Cut through prioritization -> List solutions -> Evaluate trade-offs -> Summarize.",
        "Never jump directly to features; spend the first 15 minutes deeply on user personas and pain points.",
        "Think bold and creative: offer 3 solutions (1 incremental, 1 innovative, 1 moonshot)."
      ],
      keyQuestions: [
        "Design an autonomous luggage delivery system for airports",
        "Design a language learning app for elderly users with arthritis",
        "How would you improve Google Maps for daily transit commuters?"
      ]
    },
    {
      step: "03",
      title: "Product Execution & Analytical Interview",
      focus: "Metrics, A/B Testing, Trade-offs & Root Cause Analysis",
      description: "Tests your analytical rigor, ability to set goals, track metrics, and diagnose metric drops under ambiguity.",
      tips: [
        "Structure metric trees clearly: North Star Metric -> Input Drivers -> Counter/Guardrail Metrics.",
        "When diagnosing metric drops, use MECE root-cause analysis (External vs Internal, Tech vs User).",
        "Always evaluate trade-offs: what do we lose by optimizing this metric?"
      ],
      keyQuestions: [
        "Instagram Stories completion rate dropped by 8% week-over-week. How do you investigate?",
        "Define the primary success and guardrail metrics for Airbnb Experiences",
        "You are launching dark mode on WhatsApp. What are your launch criteria and metrics?"
      ]
    },
    {
      step: "04",
      title: "Product Strategy & Technical Fluency",
      focus: "Market Sizing, Competitive Moats & Engineering Collaboration",
      description: "45-minute interview testing business strategy, long-term defensibility, and technical collaboration with engineering teams.",
      tips: [
        "Use market sizing frameworks: identify population -> target segment -> frequency -> price.",
        "Discuss switching costs, two-sided network effects, and brand moats.",
        "Demonstrate technical empathy: respect engineering constraints and technical debt."
      ],
      keyQuestions: [
        "Should Amazon build a physical brick-and-mortar luxury department store? Why or why not?",
        "Estimate the total annual market size for commercial drone deliveries in the US",
        "How would you explain the difference between synchronous and asynchronous APIs to a client?"
      ]
    },
    {
      step: "05",
      title: "Leadership, Values & Executive Behavioral",
      focus: "Cross-Functional Influence, Conflict & Prioritization",
      description: "Conducted by a VP of Product or CPO. Evaluates executive presence, culture fit, overcoming leadership conflict, and high-judgment decision making.",
      tips: [
        "Show extreme ownership: take blame for team failures, give credit to engineers for successes.",
        "Use the STAR method with clear emphasis on how you persuaded cross-functional partners without direct authority.",
        "Demonstrate resilience in navigating organizational ambiguity."
      ],
      keyQuestions: [
        "Tell me about a time you had to kill a project that a senior executive championed.",
        "Describe a major conflict between engineering and design on your team. How did you resolve it?",
        "How do you say NO to important sales requests to protect product roadmap integrity?"
      ]
    }
  ],
  assessmentPrep: [
    {
      title: "Product Sense & Solution Design",
      weightage: "40% of Assessment Score",
      description: "Ability to take an ambiguous problem and design a customer-obsessed solution with clear trade-offs.",
      keyTopics: ["User Persona Segmentation", "Pain Point Prioritization", "Feature Brainstorming", "Trade-off Evaluation"],
      sampleQuestion: "Design a remote collaboration tool specifically for kindergarten teachers and young children.",
      preparationTip: "Always list user segments first and state explicit criteria for choosing which segment to target."
    },
    {
      title: "Product Analytics & Metric Trees",
      weightage: "30% of Assessment Score",
      description: "Setting North Star metrics, input metrics, guardrails, and diagnosing sudden metric anomalies.",
      keyTopics: ["North Star Metric Definition", "Guardrail & Counter Metrics", "Metric Drop Triage", "A/B Testing Frameworks"],
      sampleQuestion: "You notice that average session duration increased by 15%, but 30-day user retention fell by 6%. How do you interpret this?",
      preparationTip: "Remember that higher session duration can indicate friction (users struggling to find what they want) rather than satisfaction."
    },
    {
      title: "Market Sizing & Estimation",
      weightage: "15% of Assessment Score",
      description: "Back-of-the-envelope estimation of market sizes, revenue opportunities, and capacity using structured top-down or bottom-up math.",
      keyTopics: ["TAM / SAM / SOM Calculations", "Population & Household Sizing", "Frequency & Unit Price Assumptions", "Sanity Checking Estimates"],
      sampleQuestion: "Estimate how many passenger flights take off from all airports in India on a typical weekday.",
      preparationTip: "Always round numbers cleanly (e.g. assume 1.4B population in India, 4 people per household) and state all assumptions clearly."
    },
    {
      title: "Prioritization & Trade-off Judgment",
      weightage: "15% of Assessment Score",
      description: "Balancing short-term revenue against long-term user trust, user experience against technical complexity.",
      keyTopics: ["RICE Scoring (Reach, Impact, Confidence, Effort)", "Short-term vs Long-term Trade-offs", "Tech Debt vs Features", "Strategic Fit"],
      sampleQuestion: "A feature requested by your largest enterprise customer would generate $2M in ARR, but break clean architecture for all other users. What do you do?",
      preparationTip: "Never give a simplistic binary answer; propose phased compromises, custom plugins, or enterprise API extensions."
    }
  ],
  interviewCategories: [
    {
      categoryName: "Product Sense & User Design",
      description: "Classic design questions testing user empathy and structured solution generation.",
      questionCount: 45,
      topicsCovered: ["CIRCLES Method", "0-to-1 Products", "Feature Improvements", "Persona Mapping"],
      sampleQuestions: [
        {
          question: "How would you design a digital library experience for blind and visually impaired readers?",
          expectedApproach: "Identify user segments (totally blind, low vision, elderly). Focus on audio-first navigation, haptic feedback, voice commands, and seamless screen reader integration. Prioritize MVP features and address accessibility trade-offs.",
          difficulty: "Medium"
        }
      ]
    },
    {
      categoryName: "Product Execution & Metrics",
      description: "Analytical questions on goal setting, metric trees, and diagnosing metric crashes.",
      questionCount: 40,
      topicsCovered: ["North Star Metrics", "Metric Drops", "A/B Testing", "Funnels"],
      sampleQuestions: [
        {
          question: "Uber rides completed dropped by 12% in San Francisco yesterday. How do you diagnose the issue?",
          expectedApproach: "1) Check internal data telemetry pipeline. 2) Segment by rider side vs driver side (did driver supply drop, or rider demand?). 3) Check external factors: weather, major sporting event, competitor promotion, app crash on latest release.",
          difficulty: "Medium"
        }
      ]
    },
    {
      categoryName: "Product Strategy & Market Sizing",
      description: "Evaluating business defensibility, expansion into new markets, and GTM.",
      questionCount: 30,
      topicsCovered: ["TAM Estimation", "Competitive Moats", "Pricing", "Build vs Buy"],
      sampleQuestions: [
        {
          question: "Estimate the market size of on-demand dog walking services in New York City.",
          expectedApproach: "NYC population (~8.5M) -> households (~3.5M) -> dog ownership rate (~15% = ~525k dogs) -> target segment needing walkers (~20% = ~105k dogs) -> walks per week (3x) * cost per walk ($20) * 52 weeks = ~$327M/year.",
          difficulty: "Medium"
        }
      ]
    }
  ],
  practiceQuestions: [
    {
      id: "pm_pq_1",
      topic: "Product Sense",
      title: "Improve LinkedIn for College Students",
      difficulty: "Medium",
      type: "Case Study",
      questionText: "College students often feel intimidated by LinkedIn's corporate atmosphere and lack professional experience to showcase. How would you redesign LinkedIn for them?",
      solutionHint: "Segment students into freshers, graduating seniors, and technical students. Focus on project portfolios, peer study networks, verified hackathon achievements, and entry-level internship discovery instead of traditional corporate resumes.",
      companyTags: ["LinkedIn", "Microsoft", "Meta"]
    },
    {
      id: "pm_pq_2",
      topic: "Metrics & Execution",
      title: "Define Metrics for Uber Eats Delivery Time",
      difficulty: "Medium",
      type: "Case Study",
      questionText: "What metrics would you track to improve delivery speed on Uber Eats without hurting restaurant quality or courier safety?",
      solutionHint: "Deconstruct total delivery time into: 1) Order confirmation time, 2) Kitchen prep time, 3) Driver transit to restaurant, 4) Pickup wait time, and 5) Final mile transit. Use Courier Safety incidents and Food Temperature ratings as counter guardrails.",
      companyTags: ["Uber", "DoorDash", "Swiggy"]
    },
    {
      id: "pm_pq_3",
      topic: "Strategy",
      title: "Should Netflix Offer Free Ad-Supported Tier in Emerging Markets?",
      difficulty: "Hard",
      type: "Case Study",
      questionText: "Evaluate whether Netflix should launch a 100% free ad-supported tier in India and Southeast Asia to compete with YouTube and local streaming apps.",
      solutionHint: "Weigh brand prestige and subscription cannibalization against ad CPM market maturity, content licensing costs, and massive top-of-funnel customer acquisition for eventual paid conversion.",
      companyTags: ["Netflix", "Amazon", "Disney"]
    }
  ],
  projects: [
    {
      id: "pm_proj_1",
      title: "Comprehensive PRD: AI-Powered Smart Job Application Tracker for JobHighway",
      difficulty: "Intermediate",
      skillsCovered: ["PRD Writing", "User Journey Mapping", "Metric Tree Formulation", "A/B Testing Plan", "Figma Wireframes"],
      whatItDemonstrates: "Demonstrates ability to identify candidate pain points in job hunting, craft a comprehensive PRD with clear user stories, success metrics, and engineering feasibility specifications.",
      recommendedStack: ["Notion / Coda", "Figma", "Miro", "Amplitude"],
      talkingPoints: [
        "Conducted 12 customer interviews uncovering that 68% of candidates lose track of follow-up dates across ATS portals.",
        "Authored a 6-page PRD defining the automated parsing of confirmation emails and intelligent status update reminders.",
        "Defined North Star Metric (Weekly Active Job Hunters) and guardrail metric (Email permission unsubscribe rate < 0.5%)."
      ]
    },
    {
      id: "pm_proj_2",
      title: "Go-to-Market & Product Strategy for B2B Direct ATS Hiring Platform",
      difficulty: "Advanced",
      skillsCovered: ["TAM Sizing", "Competitive Moats", "Pricing & Unit Economics", "Customer Discovery", "GTM Launch"],
      whatItDemonstrates: "Demonstrates strategic business acumen, market sizing, competitive differentiation against legacy job aggregators (Indeed/LinkedIn), and pricing strategy.",
      recommendedStack: ["Excel Financial Modeling", "Pitch Deck", "Notion Strategy Memo"],
      talkingPoints: [
        "Estimated a $4.8B Total Addressable Market for verified direct-to-ATS candidate sourcing in high-growth tech.",
        "Formulated a dual-sided value proposition cutting recruiter spam by 100% while increasing verified applicant conversion by 42%.",
        "Structured tiered pricing model incorporating pay-per-verified-application and enterprise unlimited subscriptions."
      ]
    }
  ],
  resumeGuidance: {
    targetRole: "Product Manager (Associate PM / PM / Senior PM)",
    atsKeywords: [
      "Product Strategy", "Product Sense", "Product Discovery", "PRD", "User Stories", "A/B Testing", "North Star Metric",
      "RICE Prioritization", "Agile", "Scrum", "Customer Journey", "Figma", "SQL", "Amplitude", "Mixpanel", "Go-to-Market", "Jira"
    ],
    mustHaveSections: [
      "Contact Info & Portfolio / LinkedIn / Notion Case Studies",
      "Core Product Competencies (Discovery, Strategy, Metrics, Execution, Technical Fluency)",
      "Work Experience (Strictly formatted with metric outcomes: DAU, conversion, revenue)",
      "Featured Product Case Studies (links to public PRD or Notion documents)",
      "Education"
    ],
    recommendedProjectTypes: [
      "Public Notion Product Requirement Document (PRD) with wireframes and metric trees",
      "Comprehensive product teardown analyzing a major app's onboarding or monetization",
      "0-to-1 product strategy deck evaluating market size and competitive moats"
    ],
    actionVerbs: ["Spearheaded", "Launched", "Prioritized", "Iterated", "Architected", "Increased", "Reduced", "Orchestrated"],
    commonMistakes: [
      "Listing feature delivery dates without stating the quantitative metric impact on customers or revenue.",
      "Writing like a project manager (focusing on timelines and meetings) rather than a product manager (focusing on user value and business ROI).",
      "Lacking publicly accessible PRD or case study links."
    ],
    sampleBulletPoints: [
      "Spearheaded redesign of the mobile onboarding funnel, increasing 30-day user activation rate by 24% and generating $340k incremental ARR.",
      "Authored 8 comprehensive PRDs and prioritized feature backlog using RICE framework, reducing sprint cycle planning time by 30%.",
      "Designed and executed 18 statistical A/B tests on checkout pricing flow, identifying a dynamic bundling strategy that increased average order value by 14%."
    ]
  },
  studySheets: [
    {
      title: "Exponent Product Manager Interview Bible",
      category: "Interview Prep",
      provider: "TryExponent",
      description: "Structured walkthroughs of product design, analytical execution, strategy, and technical PM interview questions.",
      url: "https://www.tryexponent.com/courses/pm",
      badge: "Industry Gold"
    },
    {
      title: "Reforge Retention & Engagement Deep Dive",
      category: "Product Analytics",
      provider: "Reforge / Brian Balfour",
      description: "The definitive guide to product retention curves, engagement loops, and metric tree construction.",
      url: "https://www.reforge.com/blog",
      badge: "Advanced Strategy"
    },
    {
      title: "Lewis C. Lin CIRCLES Method Cheat Sheet",
      category: "Frameworks",
      provider: "Lewis C. Lin Official",
      description: "Quick reference guide for mastering the CIRCLES method in product design interviews.",
      url: "https://www.lewis-lin.com/",
      badge: "Framework"
    }
  ],
  careerPathways: [
    {
      stage: "Associate Product Manager (APM)",
      experience: "0 – 2 Years",
      compensation: "₹10L – ₹22L / $95k – $135k",
      focus: "Feature Execution & Backlog Management",
      responsibilities: "Writing user stories, coordinating daily standups with engineering and design, analyzing product analytics in Amplitude, and shipping discrete features.",
      requiredSkills: ["User Stories", "Jira", "Analytics (Mixpanel/Amplitude)", "Customer Interviews", "Agile"]
    },
    {
      stage: "Product Manager (Mid-Level)",
      experience: "2 – 5 Years",
      compensation: "₹22L – ₹42L / $140k – $190k",
      focus: "Product Area Ownership & Metric Growth",
      responsibilities: "Owning a complete product pillar (e.g. Onboarding, Checkout, or Growth), defining quarterly OKRs, leading A/B experimentation, and crafting 1-year roadmaps.",
      requiredSkills: ["Product Sense", "PRD Writing", "A/B Testing", "RICE Prioritization", "Stakeholder Leadership"]
    },
    {
      stage: "Senior Product Manager (SPM)",
      experience: "5 – 8 Years",
      compensation: "₹45L – ₹85L / $200k – $280k",
      focus: "Multi-Product Strategy & Mentorship",
      responsibilities: "Leading multi-product initiatives across cross-functional engineering pods, mentoring APMs, defining business unit strategy, and presenting to executive leadership.",
      requiredSkills: ["Product Strategy", "TAM Sizing", "Executive Alignment", "Cross-team Influence", "GTM Strategy"]
    },
    {
      stage: "Group PM / Director of Product / VP",
      experience: "8+ Years",
      compensation: "₹90L – ₹2.5Cr+ / $290k – $480k+",
      focus: "P&L Ownership, Org Design & Vision",
      responsibilities: "Managing product manager organizations, owning high-level P&L revenue outcomes, setting multi-year corporate strategy, and evaluating M&A opportunities.",
      requiredSkills: ["Org Leadership", "P&L Management", "C-Suite Influence", "Strategic Innovation"]
    }
  ]
};

// Map of all supported roles
export const PREPARATION_ROLES_MAP: Record<string, PrepRole> = {
  "software-engineer": SOFTWARE_ENGINEER_ROLE,
  "data-scientist": DATA_SCIENTIST_ROLE,
  "data-analyst": DATA_ANALYST_ROLE,
  "data-engineer": DATA_ENGINEER_ROLE,
  "product-manager": PRODUCT_MANAGER_ROLE
};

export const ALL_PREPARATION_ROLES: PrepRole[] = [
  SOFTWARE_ENGINEER_ROLE,
  DATA_ANALYST_ROLE,
  DATA_SCIENTIST_ROLE,
  DATA_ENGINEER_ROLE,
  PRODUCT_MANAGER_ROLE
];

// Helper to look up a role with smart fuzzy fallback
export function getPrepRoleById(roleId?: string | null): PrepRole {
  if (!roleId) return SOFTWARE_ENGINEER_ROLE;
  
  const cleanId = roleId.toLowerCase().trim().replace(/\s+/g, "-");
  
  if (PREPARATION_ROLES_MAP[cleanId]) {
    return PREPARATION_ROLES_MAP[cleanId];
  }
  
  // Fuzzy match aliases
  if (cleanId.includes("data") && cleanId.includes("scien")) return DATA_SCIENTIST_ROLE;
  if (cleanId.includes("data") && cleanId.includes("analy")) return DATA_ANALYST_ROLE;
  if (cleanId.includes("data") && cleanId.includes("engin")) return DATA_ENGINEER_ROLE;
  if (cleanId.includes("product") && cleanId.includes("manage")) return PRODUCT_MANAGER_ROLE;
  if (cleanId.includes("software") || cleanId.includes("sde") || cleanId.includes("develop") || cleanId.includes("engineer")) return SOFTWARE_ENGINEER_ROLE;
  if (cleanId.includes("ai") || cleanId.includes("ml") || cleanId.includes("machine")) return DATA_SCIENTIST_ROLE;
  if (cleanId.includes("bi") || cleanId.includes("business-intel")) return DATA_ANALYST_ROLE;
  if (cleanId.includes("pm") || cleanId.includes("product")) return PRODUCT_MANAGER_ROLE;

  return SOFTWARE_ENGINEER_ROLE;
}
