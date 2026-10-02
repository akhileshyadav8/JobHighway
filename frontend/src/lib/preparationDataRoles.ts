import { PrepRole } from "./prepDataModels";

// 8. Backend Developer
export const BACKEND_DEVELOPER_ROLE: PrepRole = {
  id: "backend-developer",
  name: "Backend Developer",
  category: "Engineering",
  badge: "High Demand · APIs & Microservices",
  tagline: "High-Throughput APIs, Distributed Caching, Database Indexing & Cloud Architectures",
  overview: {
    coreSkills: ["REST APIs & gRPC", "Relational & NoSQL Databases", "Redis Caching", "Message Brokers (Kafka/RabbitMQ)", "Concurrency & Thread Safety", "Microservices Architecture"],
    recommendedTopics: ["Database Sharding & Replication", "Distributed Transactions & 2PC", "Idempotency & Rate Limiting", "OAuth2 & JWT Auth", "Connection Pooling"],
    interviewAreas: ["API Design & Schema Architecture", "Database Query Optimization", "System Design (HLD & LLD)", "Concurrency & Thread Safety"],
    assessmentAreas: ["Backend Speed Coding (45m)", "SQL Query Tuning", "System Architecture MCQs", "Debugging Concurrency Bugs"],
    typicalProjects: ["High-Throughput Payments Webhook Ingestion Engine", "Distributed Task Scheduler (Celery/BullMQ clone)", "Real-time Notification Service with Kafka & WebSockets"],
    estimatedWeeks: "10 – 12 Weeks",
    avgFresherSalary: "₹7L – ₹16L / $80k – $115k",
    avgSeniorSalary: "₹30L – ₹65L / $160k – $250k"
  },
  roadmap: [
    {
      id: "be_step_1",
      stepNumber: 1,
      title: "Backend Language Mastery & Concurrency",
      focus: "Node.js, Go, Python, or Java with Async/Threading models",
      description: "Deep dive into event loop mechanics, thread pools, memory leaks, and concurrency primitives (mutexes, semaphores, channels).",
      difficulty: "Beginner",
      subtopics: ["Event Loop vs Multithreading", "Memory Allocation & Garbage Collection", "Error Handling & Graceful Shutdown", "Logging & Structured JSON Logs"],
      recommendedAction: "Build a multi-worker CLI task processor with graceful SIGTERM termination.",
      resourceName: "Node.js / Go Concurrency Guide",
      resourceUrl: "https://roadmap.sh/backend"
    },
    {
      id: "be_step_2",
      stepNumber: 2,
      title: "Data Structures & Algorithmic Problem Solving for Backend Systems",
      focus: "Time & Space Optimization, Hash Tables, Trees, Graphs, Heaps & Dynamic Programming",
      description: "Master DSA for backend engineering technical screens. Solve 150+ problems focusing on algorithmic efficiency, hash maps, heaps (priority queues for schedulers), graphs (dependency graphs), and LRU cache implementations.",
      difficulty: "Intermediate",
      subtopics: ["Hash Tables & Collision Resolution", "Heaps & Priority Queues (Task Scheduling)", "Graphs (BFS/DFS, Topological Sort for Build Systems)", "Dynamic Programming & Memoization", "LRU Cache Design & Big-O Complexity Proofs"],
      recommendedAction: "Solve 100+ LeetCode problems focusing on arrays, strings, hash maps, heaps, and graphs.",
      resourceName: "NeetCode 150 - Backend Engineering Roadmap",
      resourceUrl: "https://neetcode.io/practice"
    },
    {
      id: "be_step_3",
      stepNumber: 3,
      title: "Databases, Indexing & Query Tuning",
      focus: "PostgreSQL, MySQL, Connection Pooling & Sharding",
      description: "Master ACID isolation levels, write-ahead logs (WAL), B-Tree indexing, composite indexes, query EXPLAIN plans, and connection pool sizing.",
      difficulty: "Intermediate",
      subtopics: ["ACID Isolation Levels & Phantom Reads", "B-Tree vs Hash vs GIN Indexes", "EXPLAIN ANALYZE & Query Optimization", "Connection Pooling (PgBouncer)"],
      recommendedAction: "Optimize a query on a 5-million row table reducing execution time from 2.4s to 4ms.",
      resourceName: "Use The Index, Luke!",
      resourceUrl: "https://use-the-index-luke.com/"
    },
    {
      id: "be_step_4",
      stepNumber: 4,
      title: "Caching & In-Memory Stores",
      focus: "Redis, Memcached, Cache Invalidation & Consistency",
      description: "Implement cache-aside, write-through, and write-back caching. Master Redis data structures (Hashes, Sorted Sets, HyperLogLog, Streams) and eviction policies.",
      difficulty: "Intermediate",
      subtopics: ["Cache-Aside Pattern & Thundering Herd", "Redis Data Structures & Lua Scripts", "Cache Invalidation Strategies", "Distributed Locks (Redlock)"],
      recommendedAction: "Implement a sliding-window rate limiter using Redis sorted sets.",
      resourceName: "Redis University",
      resourceUrl: "https://university.redis.com/"
    },
    {
      id: "be_step_5",
      stepNumber: 5,
      title: "Message Brokers & Asynchronous Processing",
      focus: "Kafka, RabbitMQ, Event-Driven Architectures",
      description: "Design fault-tolerant event-driven pipelines. Master consumer groups, partition keys, dead-letter queues (DLQ), and at-least-once delivery semantics.",
      difficulty: "Advanced",
      subtopics: ["Kafka Partitions, Offsets & Consumer Groups", "RabbitMQ Exchanges & Queues", "Dead-Letter Queues & Exponential Backoff", "Idempotent Consumer Processing"],
      recommendedAction: "Build an order processing pipeline with Kafka and retry topics for payment failures.",
      resourceName: "Confluent Kafka Tutorials",
      resourceUrl: "https://developer.confluent.io/"
    },
    {
      id: "be_step_6",
      stepNumber: 6,
      title: "API Security, Auth & Microservices Architecture",
      focus: "OAuth2, JWT, API Gateway, Service Mesh & Observability",
      description: "Implement zero-trust API security, rate limiting, distributed tracing with OpenTelemetry, and containerized deployment with Docker.",
      difficulty: "Advanced",
      subtopics: ["JWT Signatures, Refresh Tokens & Revocation", "API Gateway Patterns & Rate Limiting", "Distributed Tracing (OpenTelemetry)", "Docker & Kubernetes Deployment"],
      recommendedAction: "Deploy a microservice cluster with centralized API gateway and Prometheus monitoring.",
      resourceName: "Microservices.io Architecture Patterns",
      resourceUrl: "https://microservices.io/"
    }
  ],
  skills: {
    mustKnow: ["RESTful API Conventions", "PostgreSQL / MySQL", "Redis Caching", "Docker", "Git", "JWT / Auth Security"],
    goodToKnow: ["Apache Kafka / RabbitMQ", "GraphQL & gRPC", "MongoDB / DynamoDB", "CI/CD Pipelines", "Linux CLI"],
    advanced: ["Database Sharding & Replication", "Distributed Tracing & APM", "Kubernetes", "High-Throughput Concurrency"],
    toolsAndTech: ["PostgreSQL", "Redis", "Kafka", "Docker", "Postman", "Git", "VS Code", "Prometheus"]
  },
  interviewRounds: [
    {
      step: "01",
      title: "Online Assessment (OA)",
      focus: "DSA + Database Query Problem",
      description: "Timed coding screen with 2 algorithmic questions plus 1 complex SQL scenario.",
      tips: ["Check time complexity proofs", "Dry-run edge cases (nulls, empty lists)"],
      keyQuestions: ["LRU Cache Implementation", "Department Top Earners SQL"]
    },
    {
      step: "02",
      title: "Backend Technical Interview",
      focus: "API Design, Concurrency & Data Modeling",
      description: "Deep dive into database normalization, indexes, race conditions, and error recovery.",
      tips: ["Explain trade-offs between relational and document stores", "Address N+1 query problems proactively"],
      keyQuestions: ["How to handle race conditions in banking transactions?", "Design an idempotent payment webhook"]
    },
    {
      step: "03",
      title: "System Design & Architecture",
      focus: "Scalability, Caching, Sharding & Queues",
      description: "Design a high-scale system (e.g. Uber backend, TinyURL, or Twitter Feed).",
      tips: ["Perform back-of-the-envelope estimations", "Structure diagrams cleanly: Clients -> CDN -> Gateway -> Services -> Cache/DB"],
      keyQuestions: ["Design a distributed rate limiter", "Design a notification service with priority delivery"]
    }
  ],
  assessmentPrep: [
    {
      title: "API & Data Modeling",
      weightage: "40% of Assessment",
      description: "Evaluating clean REST API design, HTTP status codes, schema normalization, and foreign keys.",
      keyTopics: ["REST Conventions", "Relational Schema Normalization", "Indexing Strategies"],
      sampleQuestion: "Design the database schema and REST endpoints for an enterprise booking engine.",
      preparationTip: "Always follow 3rd Normal Form for schemas unless denormalization is justified for read performance."
    }
  ],
  interviewCategories: [
    {
      categoryName: "Backend Architecture",
      description: "Core distributed systems and backend engineering questions.",
      questionCount: 80,
      topicsCovered: ["Caching", "Message Queues", "Databases", "APIs"],
      sampleQuestions: [
        {
          question: "How do you guarantee exactly-once message delivery in an event-driven system?",
          expectedApproach: "Combine at-least-once transport delivery with an idempotent consumer using a unique idempotency key checked atomically in a distributed datastore.",
          difficulty: "Hard"
        }
      ]
    }
  ],
  practiceQuestions: [
    {
      id: "be_pq_1",
      topic: "System Design",
      title: "Idempotent Payment API",
      difficulty: "Medium",
      type: "Architecture",
      questionText: "Design an API endpoint for credit card charges that guarantees a customer is never billed twice even if their browser retries the request 5 times.",
      solutionHint: "Require an Idempotency-Key header. Store transaction state in Redis with SETNX and short TTL before querying payment gateway.",
      companyTags: ["Stripe", "PayPal", "Amazon"]
    }
  ],
  projects: [
    {
      id: "be_proj_1",
      title: "High-Throughput Payment Webhook Engine",
      difficulty: "Advanced",
      skillsCovered: ["Node.js / Go", "Redis", "Kafka", "PostgreSQL", "Docker"],
      whatItDemonstrates: "Demonstrates asynchronous ingestion, fault tolerance, dead-letter queues, and handling spikes of 20,000 webhooks per second.",
      recommendedStack: ["Go or Node.js", "Redis", "Apache Kafka", "PostgreSQL"],
      talkingPoints: [
        "Separated ingestion API from worker processing via Kafka message broker.",
        "Implemented exponential backoff with jitter and dead-letter queues.",
        "Guaranteed zero dropped events during sudden upstream spikes."
      ]
    }
  ],
  resumeGuidance: {
    targetRole: "Backend Engineer / Node.js / Go / Java",
    atsKeywords: ["REST API", "Microservices", "PostgreSQL", "Redis", "Kafka", "Docker", "CI/CD", "System Design", "Concurrency", "OAuth2", "gRPC"],
    mustHaveSections: ["Technical Skills", "Work Experience", "Backend Projects", "Education"],
    recommendedProjectTypes: ["High-Throughput Ingestion Engine", "Distributed Rate Limiter", "Real-Time Chat/Notification Engine"],
    actionVerbs: ["Architected", "Optimized", "Engineered", "Scaled", "Reduced", "Containerized"],
    commonMistakes: ["Listing frontend frameworks instead of backend databases", "Missing latency or throughput metrics"],
    sampleBulletPoints: [
      "Engineered high-throughput REST APIs handling 15M daily requests with p99 response times below 45ms.",
      "Optimized PostgreSQL schema and composite indexes, reducing slow database query latency by 78%."
    ]
  },
  studySheets: [
    {
      title: "Roadmap.sh Backend Developer",
      category: "Curriculum",
      provider: "Roadmap.sh",
      description: "Definitive step-by-step roadmap to modern backend development.",
      url: "https://roadmap.sh/backend"
    }
  ],
  careerPathways: [
    { stage: "Junior Backend Developer", experience: "0 – 2 Years", compensation: "₹6L – ₹14L / $75k – $110k", focus: "API Implementation & DB queries", responsibilities: "Building CRUD endpoints, writing SQL queries, unit testing.", requiredSkills: ["Node.js/Go", "PostgreSQL", "Docker"] },
    { stage: "Senior Backend Engineer", experience: "3 – 6 Years", compensation: "₹18L – ₹40L / $130k – $180k", focus: "Architecture & Scale", responsibilities: "Designing microservices, caching strategies, queue pipelines.", requiredSkills: ["Microservices", "Kafka", "Distributed Systems"] },
    { stage: "Staff / Principal Backend Engineer", experience: "7+ Years", compensation: "₹45L – ₹1Cr+ / $190k – $300k+", focus: "Enterprise Strategy & Reliability", responsibilities: "Company-wide data architecture, reliability engineering, cross-team technical leadership.", requiredSkills: ["Enterprise Architecture", "High Availability", "Strategic Roadmaps"] }
  ]
};

// 9. Machine Learning Engineer
export const ML_ENGINEER_ROLE: PrepRole = {
  id: "ml-engineer",
  name: "Machine Learning Engineer",
  category: "Data & AI",
  badge: "AI Frontier · PyTorch & MLOps",
  tagline: "Model Training, Transformer Architectures, MLOps Pipelines & High-Throughput Inference",
  overview: {
    coreSkills: ["Python & PyTorch / TensorFlow", "Data Preprocessing & Feature Engineering", "Model Evaluation & Loss Functions", "Transformer & LLM Architectures", "MLOps & Model Serving", "Docker & Triton / FastAPI"],
    recommendedTopics: ["Distributed Training (DDP / FSDP)", "Quantization & Model Pruning (LoRA / QLoRA)", "Vector Databases & Embeddings (FAISS / Pinecone)", "Feature Stores (Feast)", "Model Monitoring & Drift Detection"],
    interviewAreas: ["ML Coding & Algorithms", "ML System Design", "Model Evaluation & Diagnostics", "MLOps & Deployment"],
    assessmentAreas: ["Python / NumPy Algorithmic Coding", "Machine Learning Theory MCQs", "Feature Engineering Case Study"],
    typicalProjects: ["RAG Pipeline with Local LLM & Vector Search", "End-to-End Recommendation Engine with Two-Tower Architecture", "Computer Vision Defect Detection Pipeline"],
    estimatedWeeks: "12 – 16 Weeks",
    avgFresherSalary: "₹9L – ₹20L / $95k – $130k",
    avgSeniorSalary: "₹35L – ₹80L / $180k – $300k"
  },
  roadmap: [
    {
      id: "mle_step_1",
      stepNumber: 1,
      title: "Mathematical Foundations & Python Mastery",
      focus: "Linear Algebra, Calculus, Probability & NumPy",
      description: "Matrix operations, eigenvalues, gradient descent proofs, multivariate probability distributions, and vectorized NumPy programming.",
      difficulty: "Beginner",
      subtopics: ["Matrix Decompositions (SVD, PCA)", "Gradient Descent & Backpropagation", "Probability Distributions & Bayes Rule", "Vectorized Array Operations in NumPy"],
      recommendedAction: "Implement linear regression and a 2-layer neural network from scratch in pure NumPy.",
      resourceName: "Mathematics for Machine Learning",
      resourceUrl: "https://mml-book.github.io/"
    },
    {
      id: "mle_step_2",
      stepNumber: 2,
      title: "Data Structures & Algorithmic Problem Solving for ML Systems",
      focus: "Hash Maps, Heaps, Priority Queues, Binary Search & Graph BFS/DFS in Python",
      description: "Master DSA patterns essential for ML coding rounds: priority queues/heaps for Top-K candidate retrieval and K-Nearest Neighbors, hash maps for inverted indices, binary search for threshold tuning, and tree/graph traversals for computational graphs.",
      difficulty: "Intermediate",
      subtopics: ["Heaps & Priority Queues (Top-K Items & KNN)", "Hash Maps & Inverted Indices for Search", "Binary Search on Value Spaces (Quantiles & Percentiles)", "Graph Traversal (BFS/DFS for Computation DAGs)", "Dynamic Programming & Optimization Logic"],
      recommendedAction: "Solve 60+ algorithmic problems in Python focusing on heaps, hash maps, sorting, and graphs.",
      resourceName: "LeetCode Algorithms for Machine Learning",
      resourceUrl: "https://leetcode.com/problemset/all/"
    },
    {
      id: "mle_step_3",
      stepNumber: 3,
      title: "Core Machine Learning & Deep Learning",
      focus: "Scikit-Learn, PyTorch, CNNs, RNNs & Transformers",
      description: "Master tree models (XGBoost, LightGBM), deep neural networks in PyTorch, loss functions (Cross-Entropy, Triplet Loss), and the Transformer self-attention mechanism.",
      difficulty: "Intermediate",
      subtopics: ["Ensemble Methods (XGBoost, Random Forests)", "PyTorch Tensors, Autograd & DataLoader", "Self-Attention & Transformer Architecture", "Regularization (Dropout, Weight Decay, Batch Normalization)"],
      recommendedAction: "Train a text classification Transformer using PyTorch and Hugging Face Transformers.",
      resourceName: "PyTorch Deep Learning Tutorials",
      resourceUrl: "https://pytorch.org/tutorials/"
    },
    {
      id: "mle_step_4",
      stepNumber: 4,
      title: "MLOps, Model Serving & Deployment",
      focus: "FastAPI, Triton Server, Docker & CI/CD for ML",
      description: "Package models for low-latency production inference. Master batching, ONNX Runtime conversion, Docker containerization, and monitoring for data/concept drift.",
      difficulty: "Intermediate",
      subtopics: ["Model Serialization (ONNX, TorchScript)", "FastAPI / Triton High-Throughput Serving", "Docker & Kubernetes for ML Workloads", "Data Drift & Concept Drift Monitoring (Evidently AI)"],
      recommendedAction: "Deploy an ONNX-optimized model behind a FastAPI endpoint with sub-20ms inference latency.",
      resourceName: "Made With ML MLOps Course",
      resourceUrl: "https://madewithml.com/"
    },
    {
      id: "mle_step_5",
      stepNumber: 5,
      title: "LLMs, RAG & Vector Search Architectures",
      focus: "Embeddings, Vector Databases, Fine-Tuning (LoRA)",
      description: "Build modern generative AI workflows. Master vector embeddings, semantic search, Retrieval-Augmented Generation (RAG), and parameter-efficient fine-tuning (PEFT/LoRA).",
      difficulty: "Advanced",
      subtopics: ["Vector Embeddings (OpenAI / HuggingFace)", "Vector Indexing (HNSW, IVFFlat in FAISS/Pinecone)", "RAG Chunking, Hybrid Search & Reranking", "Fine-Tuning LLMs with LoRA & Unsloth"],
      recommendedAction: "Build a production RAG application with document chunking, hybrid BM25 + vector search, and reranking.",
      resourceName: "Hugging Face LLM Course",
      resourceUrl: "https://huggingface.co/learn"
    },
    {
      id: "mle_step_6",
      stepNumber: 6,
      title: "Machine Learning System Design",
      focus: "Two-Tower Recommenders, Search Ranking, Fraud Detection",
      description: "Architect end-to-end ML systems handling millions of users. Master candidate retrieval, ranking models, feature stores, and continuous online training.",
      difficulty: "Advanced",
      subtopics: ["Candidate Generation & Two-Tower DNNs", "Real-Time Feature Stores (Feast)", "Offline vs Online Evaluation (A/B Testing)", "Cold Start & Feedback Loops Mitigation"],
      recommendedAction: "Draw a full end-to-end system design for YouTube recommendation or Instagram Explore feed.",
      resourceName: "Designing Machine Learning Systems by Chip Huyen",
      resourceUrl: "https://chiphuyen.com/"
    }
  ],
  skills: {
    mustKnow: ["Python & NumPy/Pandas", "PyTorch / TensorFlow", "Scikit-Learn", "Docker", "Model Evaluation (ROC, F1, Loss)", "Git"],
    goodToKnow: ["Hugging Face Transformers", "FastAPI / Model Serving", "Vector Databases (FAISS/Pinecone)", "MLflow / Weights & Biases", "ONNX"],
    advanced: ["Distributed Training (DDP/FSDP)", "LoRA Fine-Tuning", "Triton Inference Server", "ML System Design"],
    toolsAndTech: ["Python", "PyTorch", "Hugging Face", "Docker", "FastAPI", "MLflow", "FAISS", "Linux"]
  },
  interviewRounds: [
    {
      step: "01",
      title: "Coding & Python Algorithms",
      focus: "NumPy Vectorization, Matrix Math & DSA",
      description: "60-minute coding interview implementing algorithmic functions and vectorized data transformations.",
      tips: ["Avoid Python for-loops where vectorized NumPy operations can be used", "State memory and FLOP complexity"],
      keyQuestions: ["Implement Self-Attention in PyTorch", "Implement K-Means Clustering from scratch"]
    },
    {
      step: "02",
      title: "ML Theory & Diagnostics",
      focus: "Loss Functions, Optimization & Model Selection",
      description: "Deep dive into model convergence, bias-variance trade-offs, regularization, and diagnosing underfitting/overfitting.",
      tips: ["Be ready to write down formulas on a whiteboard", "Explain trade-offs between precision, recall, and AUC-ROC"],
      keyQuestions: ["Explain how Adam optimizer differs from SGD with momentum", "How do you detect and fix vanishing gradients in deep networks?"]
    },
    {
      step: "03",
      title: "ML System Design",
      focus: "End-to-End Architecture, Scalability & Serving SLA",
      description: "Architecting a production ML system (e.g., Feed Ranking, Search Engine, Fraud Detection).",
      tips: ["Address both offline training pipeline and online low-latency inference path", "Define SLA, latency budgets, and fallback heuristics"],
      keyQuestions: ["Design a News Feed Ranking System", "Design a Video Recommendation System like TikTok"]
    }
  ],
  assessmentPrep: [
    {
      title: "Applied ML Modeling",
      weightage: "45% of Assessment",
      description: "Feature extraction, cross-validation, hyperparameter optimization, and choosing appropriate metric criteria.",
      keyTopics: ["Feature Engineering", "Ensemble Methods", "Overfitting Prevention"],
      sampleQuestion: "Given a dataset of financial transactions with 99.8% non-fraud cases, how do you train and evaluate a model?",
      preparationTip: "Use PR-AUC (Precision-Recall AUC) instead of standard ROC-AUC when evaluating extreme class imbalances."
    }
  ],
  interviewCategories: [
    {
      categoryName: "ML Architecture",
      description: "Large-scale machine learning systems and serving architecture.",
      questionCount: 65,
      topicsCovered: ["Recommenders", "RAG", "MLOps", "Transformers"],
      sampleQuestions: [
        {
          question: "How does LoRA (Low-Rank Adaptation) reduce the memory footprint of fine-tuning large language models?",
          expectedApproach: "LoRA decomposes weight update matrix delta W into two low-rank matrices A and B (rank r << d), freezing original weights and reducing trainable parameters by up to 99%.",
          difficulty: "Hard"
        }
      ]
    }
  ],
  practiceQuestions: [
    {
      id: "mle_pq_1",
      topic: "Deep Learning",
      title: "Scaled Dot-Product Attention",
      difficulty: "Medium",
      type: "Coding",
      questionText: "Write a PyTorch function to compute Scaled Dot-Product Attention: Attention(Q, K, V) = softmax(Q * K^T / sqrt(d_k)) * V.",
      solutionHint: "Multiply Q and K.transpose(-2, -1), divide by sqrt(d_k), apply torch.softmax along last dimension, and multiply with V.",
      companyTags: ["Google", "Meta", "OpenAI"]
    }
  ],
  projects: [
    {
      id: "mle_proj_1",
      title: "Enterprise RAG System with Semantic Search & Reranking",
      difficulty: "Advanced",
      skillsCovered: ["Python", "PyTorch", "Hugging Face", "FAISS", "FastAPI", "Docker"],
      whatItDemonstrates: "Demonstrates vector search optimization, chunking strategies, hybrid BM25 + dense retrieval, and sub-100ms response times.",
      recommendedStack: ["Python", "FastAPI", "Qdrant / FAISS", "Hugging Face", "Docker"],
      talkingPoints: [
        "Implemented recursive chunking with 15% overlap to preserve semantic context across boundaries.",
        "Integrated cross-encoder reranker, improving context relevance score from 0.71 to 0.93.",
        "Containerized with Docker and optimized tensor inference with ONNX Runtime."
      ]
    }
  ],
  resumeGuidance: {
    targetRole: "Machine Learning Engineer / MLOps",
    atsKeywords: ["PyTorch", "TensorFlow", "Transformers", "MLOps", "Model Serving", "Docker", "Python", "Vector Databases", "LLMs", "RAG", "FastAPI", "Kubernetes"],
    mustHaveSections: ["Technical Skills (Frameworks, Languages, Tools)", "ML Projects & GitHub Links", "Experience", "Education"],
    recommendedProjectTypes: ["End-to-End RAG System", "Recommendation Engine", "Computer Vision Pipeline"],
    actionVerbs: ["Trained", "Fine-Tuned", "Deployed", "Optimized", "Engineered", "Reduced"],
    commonMistakes: ["Focusing only on Jupyter notebooks with no production deployment or Docker experience", "Omitting latency and accuracy metrics"],
    sampleBulletPoints: [
      "Trained and deployed a Transformer model via FastAPI and Docker, serving 8M daily predictions with p95 latency under 25ms.",
      "Optimized model inference with ONNX Runtime and INT8 quantization, reducing GPU memory footprint by 62%."
    ]
  },
  studySheets: [
    {
      title: "Made With ML MLOps",
      category: "MLOps",
      provider: "Made With ML",
      description: "Production-ready machine learning guide from development to deployment.",
      url: "https://madewithml.com/"
    }
  ],
  careerPathways: [
    { stage: "Junior ML Engineer", experience: "0 – 2 Years", compensation: "₹8L – ₹16L / $90k – $120k", focus: "Data Pipelines & Model Training", responsibilities: "Data cleaning, feature extraction, training baseline models, writing tests.", requiredSkills: ["Python", "Scikit-Learn", "PyTorch"] },
    { stage: "Senior ML Engineer", experience: "3 – 6 Years", compensation: "₹22L – ₹50L / $150k – $220k", focus: "Architecture & MLOps", responsibilities: "Designing production inference pipelines, fine-tuning LLMs, model monitoring.", requiredSkills: ["MLOps", "Transformers", "Kubernetes", "System Design"] },
    { stage: "Staff / Lead ML Engineer", experience: "7+ Years", compensation: "₹55L – ₹1.2Cr+ / $230k – $350k+", focus: "AI Strategy & Research Translation", responsibilities: "Setting technical AI roadmap, optimizing large-scale distributed training clusters, cross-functional AI leadership.", requiredSkills: ["Distributed Training", "AI Strategy", "Executive Alignment"] }
  ]
};

// 10. QA Engineer / Automation Test Engineer
export const QA_ENGINEER_ROLE: PrepRole = {
  id: "qa-engineer",
  name: "QA Engineer",
  category: "Engineering",
  badge: "High Demand · Automation & Quality",
  tagline: "Test Automation Frameworks, API Testing, Performance Benchmarking & CI/CD Pipelines",
  overview: {
    coreSkills: ["Selenium / Playwright / Cypress", "API Testing (Postman & REST Assured)", "Performance Testing (JMeter / k6)", "Test Strategy & Test Plan Design", "CI/CD Pipeline Integration", "Defect Lifecycle & JIRA"],
    recommendedTopics: ["Page Object Model (POM)", "Behavior-Driven Development (Cucumber / Gherkin)", "SQL for Database Verification", "Mobile Automation (Appium)", "Security Testing (OWASP ZAP)"],
    interviewAreas: ["Automation Framework Architecture", "Scenario Edge Cases & Boundary Testing", "API Testing & Mocking", "Coding / Scripting in Python/Java/TS"],
    assessmentAreas: ["Test Case Design & Boundary Analysis", "Selenium / Playwright Coding Challenge", "API Status & Payload Verification"],
    typicalProjects: ["End-to-End Web Automation Framework with Playwright & TypeScript", "Automated API Regression Suite with REST Assured & Allure Reports", "Distributed Load Testing Framework with k6"],
    estimatedWeeks: "8 – 10 Weeks",
    avgFresherSalary: "₹5L – ₹12L / $65k – $95k",
    avgSeniorSalary: "₹20L – ₹45L / $120k – $180k"
  },
  roadmap: [
    {
      id: "qa_step_1",
      stepNumber: 1,
      title: "Testing Fundamentals & Test Design Techniques",
      focus: "Black-box techniques, Boundary Value Analysis, Equivalence Partitioning",
      description: "Master testing methodologies: functional, smoke, regression, boundary value analysis, state transition testing, and defect tracking in JIRA.",
      difficulty: "Beginner",
      subtopics: ["Boundary Value Analysis & Equivalence Class", "Test Plan & Test Case Documentation", "Severity vs Priority in Bug Reporting", "Agile Testing & Sprint Cycles"],
      recommendedAction: "Write comprehensive test cases with boundary scenarios for an e-commerce checkout workflow.",
      resourceName: "Guru99 QA Fundamentals",
      resourceUrl: "https://www.guru99.com/software-testing.html"
    },
    {
      id: "qa_step_2",
      stepNumber: 2,
      title: "Programming Foundations for Automation",
      focus: "Java, Python, or TypeScript & OOP concepts",
      description: "Master clean code, OOP principles (Inheritance, Polymorphism), collections, file I/O, JSON parsing, and unit testing runners (JUnit / TestNG / PyTest).",
      difficulty: "Beginner",
      subtopics: ["Object-Oriented Design for Frameworks", "Collections & HashMaps for Test Data", "Exception Handling in Test Scripts", "TestNG / PyTest Annotations & Assertions"],
      recommendedAction: "Build a modular test runner that reads test data dynamically from JSON / Excel files.",
      resourceName: "Test Automation University",
      resourceUrl: "https://testautomationu.applitools.com/"
    },
    {
      id: "qa_step_3",
      stepNumber: 3,
      title: "Data Structures & Algorithmic Problem Solving for SDETs",
      focus: "String Algorithms, Arrays, HashMaps, Two Pointers, Stacks & Matrix Traversals in Java / Python / TS",
      description: "Master DSA problems routinely asked in SDET and Test Automation coding rounds: string parsing (valid parentheses, anagrams), array search/sort, HashMaps for test verification, stacks for bracket validation, and two-pointer algorithms.",
      difficulty: "Intermediate",
      subtopics: ["String Manipulation & Pattern Searching", "Arrays, Two Pointers & Binary Search", "HashMaps & Frequency Tables for Test Verification", "Stacks & Queues (Parentheses Validation, Queue Buffers)", "Recursion & Matrix Grid Traversal Basics"],
      recommendedAction: "Solve 50+ LeetCode problems (Strings, Arrays, HashMaps, Stacks) in your chosen automation language.",
      resourceName: "LeetCode 75 for SDET / Test Engineers",
      resourceUrl: "https://leetcode.com/studyplan/leetcode-75/"
    },
    {
      id: "qa_step_4",
      stepNumber: 4,
      title: "UI Automation Frameworks (Playwright / Selenium)",
      focus: "Page Object Model (POM), Locator Strategies, Parallel Execution",
      description: "Build robust automation frameworks from scratch. Master explicit waits, shadow DOM locators, handling iframes, intercepting network requests, and generating HTML reports.",
      difficulty: "Intermediate",
      subtopics: ["Page Object Model & Component Modularity", "Reliable Locator Strategies (CSS, XPath, ARIA)", "Handling Dynamic Waits & AJAX Requests", "Parallel Test Execution with Docker Grid"],
      recommendedAction: "Build an end-to-end regression suite with Playwright and GitHub Actions reporting.",
      resourceName: "Playwright Official Docs",
      resourceUrl: "https://playwright.dev/"
    },
    {
      id: "qa_step_5",
      stepNumber: 5,
      title: "API Testing & Contract Testing",
      focus: "Postman, REST Assured, JSON Schema Validation, Mocking",
      description: "Automate REST API testing. Validate status codes, response headers, JSON payloads against schemas, authentication flows (Bearer token / OAuth), and mock service dependencies with WireMock.",
      difficulty: "Intermediate",
      subtopics: ["REST Assured / Requests Automation", "JSON Schema Validation", "Authentication & Session Token Reuse", "API Mocking with WireMock"],
      recommendedAction: "Automate an end-to-end API test suite covering positive, negative, and edge-case response codes.",
      resourceName: "REST Assured Guide",
      resourceUrl: "https://rest-assured.io/"
    },
    {
      id: "qa_step_6",
      stepNumber: 6,
      title: "Performance, Load Testing & CI/CD Pipelines",
      focus: "JMeter, k6, GitHub Actions, Jenkins, Docker",
      description: "Simulate high user concurrency. Understand throughput (RPS), p95/p99 response latency, ramp-up schedules, and integrate automated regression suites into CI/CD deployment pipelines.",
      difficulty: "Advanced",
      subtopics: ["Load & Stress Testing with k6 / JMeter", "Analyzing Latency Percentiles (p90, p95, p99)", "Integrating Tests in GitHub Actions CI", "Test Reporting (Allure, ExtentReports)"],
      recommendedAction: "Create a k6 load test script testing 1,000 concurrent virtual users with automated threshold gates.",
      resourceName: "k6 Documentation",
      resourceUrl: "https://k6.io/docs/"
    }
  ],
  skills: {
    mustKnow: ["Selenium / Playwright", "API Testing (Postman)", "Test Case Design & Boundary Analysis", "Java / Python / TypeScript", "Git", "JIRA"],
    goodToKnow: ["REST Assured / PyTest", "Page Object Model (POM)", "CI/CD GitHub Actions", "SQL for Database Verification", "Docker"],
    advanced: ["Performance Testing (k6 / JMeter)", "Security Testing (OWASP ZAP)", "Custom Automation Framework Architecture"],
    toolsAndTech: ["Playwright", "Selenium", "Postman", "k6", "JMeter", "Git", "Docker", "JIRA"]
  },
  interviewRounds: [
    {
      step: "01",
      title: "Test Case Design & Bug Scenarios",
      focus: "Equivalence Partitioning & Boundary Testing",
      description: "Evaluating your ability to think through obscure edge cases for complex business workflows.",
      tips: ["Think of network dropouts, concurrent clicks, boundary integers, and special character inputs", "Always structure answers into Functional, Non-Functional, Security, and UI"],
      keyQuestions: ["How would you test an ATM withdrawal feature?", "Write test cases for a file upload component"]
    },
    {
      step: "02",
      title: "Automation Coding Screen",
      focus: "Scripting, Locators & Framework Design",
      description: "Live coding in Java, Python, or TypeScript automating a browser journey or API endpoint.",
      tips: ["Never use hardcoded Thread.sleep() — always use dynamic explicit waits", "Follow Page Object Model structure"],
      keyQuestions: ["Automate login and cart checkout with explicit waits", "Write a REST Assured test validating JSON schema"]
    }
  ],
  assessmentPrep: [
    {
      title: "Test Automation Strategy",
      weightage: "45% of Assessment",
      description: "Framework architecture, maintainability, CI/CD triggering, and test data management.",
      keyTopics: ["Page Object Model", "Wait Mechanisms", "API Status Codes"],
      sampleQuestion: "How do you minimize test flakiness in large UI automation suites running in CI/CD?",
      preparationTip: "Focus on explicit condition-based waits, network idle triggers, and test isolation with clean state teardowns."
    }
  ],
  interviewCategories: [
    {
      categoryName: "Quality Assurance",
      description: "Core automation framework and testing methodology questions.",
      questionCount: 60,
      topicsCovered: ["Playwright", "Selenium", "APIs", "Performance"],
      sampleQuestions: [
        {
          question: "What is the difference between Smoke Testing and Sanity Testing?",
          expectedApproach: "Smoke testing verifies critical high-level build stability before deep testing. Sanity testing is targeted verification of specific bug fixes or minor code changes after build.",
          difficulty: "Easy"
        }
      ]
    }
  ],
  practiceQuestions: [
    {
      id: "qa_pq_1",
      topic: "Automation",
      title: "Robust Element Waiting Strategy",
      difficulty: "Medium",
      type: "Conceptual",
      questionText: "Why is implicit wait discouraged when combined with explicit waits in automation frameworks?",
      solutionHint: "Mixing implicit and explicit waits causes indeterminate wait times in WebDriver, leading to unpredictable test timeouts and execution flakiness.",
      companyTags: ["Amazon", "TCS", "Accenture"]
    }
  ],
  projects: [
    {
      id: "qa_proj_1",
      title: "Enterprise Playwright + TypeScript Automation Framework",
      difficulty: "Intermediate",
      skillsCovered: ["TypeScript", "Playwright", "GitHub Actions", "Allure Reports", "Docker"],
      whatItDemonstrates: "Demonstrates robust Page Object Model architecture, parallel execution across Chrome/Firefox/WebKit, and auto-generated HTML test reports.",
      recommendedStack: ["TypeScript", "Playwright", "Allure", "GitHub Actions"],
      talkingPoints: [
        "Implemented Page Object Model with reusable utility components.",
        "Integrated test execution into GitHub Actions with automated video and trace captures on test failures.",
        "Achieved 100% reliable execution with zero flaky test failures across 150 test scenarios."
      ]
    }
  ],
  resumeGuidance: {
    targetRole: "QA Automation Engineer / SDET",
    atsKeywords: ["Playwright", "Selenium", "API Testing", "Postman", "REST Assured", "TestNG", "PyTest", "CI/CD", "JMeter", "k6", "Page Object Model", "Git", "JIRA"],
    mustHaveSections: ["Automation Skills (Tools & Frameworks)", "Work Experience with Impact", "Automation Projects", "Education"],
    recommendedProjectTypes: ["Playwright Automation Framework", "REST Assured API Test Suite", "k6 Performance Benchmark Suite"],
    actionVerbs: ["Automated", "Engineered", "Reduced", "Identified", "Integrated", "Validated"],
    commonMistakes: ["Focusing only on manual testing without showing coding / automation expertise", "Omitting test coverage percentages"],
    sampleBulletPoints: [
      "Engineered automated UI and API regression test suites with Playwright, reducing regression cycle time from 18 hours to 25 minutes.",
      "Identified 45+ critical bugs prior to production releases through comprehensive boundary value testing and automated sanity gates."
    ]
  },
  studySheets: [
    {
      title: "Test Automation University",
      category: "Free Courses",
      provider: "TAU",
      description: "Free industry-standard courses on Selenium, Playwright, API testing, and DevOps.",
      url: "https://testautomationu.applitools.com/"
    }
  ],
  careerPathways: [
    { stage: "Junior QA Engineer", experience: "0 – 2 Years", compensation: "₹4.5L – ₹9L / $60k – $85k", focus: "Manual Testing & Basic Scripts", responsibilities: "Writing test cases, executing regression passes, basic Selenium / Postman scripts.", requiredSkills: ["Manual Testing", "Postman", "Basic Python/Java"] },
    { stage: "SDET / Senior QA Engineer", experience: "3 – 6 Years", compensation: "₹14L – ₹28L / $105k – $150k", focus: "Framework Design & CI/CD", responsibilities: "Building custom automation frameworks, API automation, CI/CD pipeline integration.", requiredSkills: ["Playwright", "REST Assured", "CI/CD", "Performance Testing"] },
    { stage: "Lead SDET / QA Architect", experience: "7+ Years", compensation: "₹32L – ₹65L / $160k – $220k", focus: "Enterprise Quality Strategy", responsibilities: "Company-wide quality standards, performance test strategy, test infrastructure governance.", requiredSkills: ["Quality Architecture", "Enterprise CI/CD", "Technical Leadership"] }
  ]
};

// 11. Full Stack Developer
export const FULL_STACK_DEVELOPER_ROLE: PrepRole = {
  id: "fullstack-developer",
  name: "Full Stack Developer",
  category: "Engineering",
  badge: "High Demand · React, Node & Cloud",
  tagline: "End-to-End Web Applications, REST/GraphQL APIs, Databases, System Architecture & DevOps",
  overview: {
    coreSkills: ["Frontend (React, Next.js, TypeScript)", "Backend (Node.js/Go/Python/Java)", "Data Structures & Algorithms", "Databases (PostgreSQL, MongoDB)", "Caching (Redis) & Message Queues", "Full-Stack System Design (HLD & LLD)", "Docker, CI/CD & Cloud Deployment"],
    recommendedTopics: ["React Server Components (RSC)", "API Gateway & Microservices", "Database Indexing & Normalization", "WebSocket Real-time Communication", "Containerization & Cloud Infrastructure"],
    interviewAreas: ["Full-Stack Machine Coding (60-90m)", "DSA & Algorithmic Problem Solving", "System Design & Architecture", "Database & API Schema Design"],
    assessmentAreas: ["Algorithmic Coding (LeetCode style)", "Frontend Machine Coding Sprint", "Backend API Construction", "Core CS & Database MCQs"],
    typicalProjects: ["Collaborative Real-time Workspace (Notion/Slack clone)", "Multi-Tenant E-Commerce Platform with Stripe", "High-Throughput Analytics Dashboard with WebSockets"],
    estimatedWeeks: "10 – 14 Weeks",
    avgFresherSalary: "₹7L – ₹16L / $80k – $115k",
    avgSeniorSalary: "₹32L – ₹70L / $170k – $260k"
  },
  roadmap: [
    {
      id: "fs_step_1",
      stepNumber: 1,
      title: "Programming Foundations, Web Architecture & Protocols",
      focus: "TypeScript / JavaScript, HTTP/HTTPS, Event Loop & Clean Code",
      description: "Master modern programming fundamentals, asynchronous code execution, event loops, RESTful conventions, HTTP headers, cookies, and CORS security.",
      difficulty: "Beginner",
      subtopics: ["Async Programming, Promises & Event Loop", "HTTP Methods, Status Codes, Headers & CORS", "Clean Code & SOLID Design Principles", "Git Branching & GitHub Collaboration"],
      recommendedAction: "Build a modular CLI application demonstrating async execution and OOP design patterns.",
      resourceName: "MDN Web Development Documentation",
      resourceUrl: "https://developer.mozilla.org/"
    },
    {
      id: "fs_step_2",
      stepNumber: 2,
      title: "Data Structures & Algorithmic Problem Solving",
      focus: "Arrays, Strings, Hash Tables, Trees, Graphs, DP & Space-Time Optimization",
      description: "Master core algorithms and data structures required in full-stack technical rounds. Solve 150+ problems covering two pointers, sliding window, hash maps, binary search, tree traversals, graphs, and recursion in JavaScript/TypeScript or Python/Java.",
      difficulty: "Intermediate",
      subtopics: ["Arrays, Strings & Two Pointers", "Hash Tables & Fast Lookup Sets", "Stacks, Queues & Recursion", "Trees & Graph Traversals (BFS/DFS)", "Dynamic Programming & Complexity Proofs"],
      recommendedAction: "Complete the NeetCode 150 or LeetCode 75 problem sets.",
      resourceName: "NeetCode 150 Practice Roadmap",
      resourceUrl: "https://neetcode.io/roadmap"
    },
    {
      id: "fs_step_3",
      stepNumber: 3,
      title: "Frontend Engineering (React, Next.js & TypeScript)",
      focus: "React Hooks, Server Components, State Management & Tailwind CSS",
      description: "Build reactive, accessible, high-performance user interfaces. Master React component lifecycles, custom hooks, Next.js App Router (SSR/SSG), Zustand state management, and Tailwind layouts.",
      difficulty: "Intermediate",
      subtopics: ["React Component Lifecycle & Custom Hooks", "Next.js App Router & Server Components (RSC)", "Client & Server State (Zustand, React Query)", "Responsive Design with Tailwind CSS & Flex/Grid"],
      recommendedAction: "Build an interactive dashboard with data filtering, infinite scrolling, and dark mode.",
      resourceName: "React Official Docs (react.dev)",
      resourceUrl: "https://react.dev/"
    },
    {
      id: "fs_step_4",
      stepNumber: 4,
      title: "Backend Engineering, REST/GraphQL APIs & Microservices",
      focus: "Node.js / Express / NestJS / Go, Authentication & Middleware",
      description: "Architect scalable backend services. Master RESTful API conventions, GraphQL schemas, JWT/OAuth2 authentication, rate limiting, and input validation with Zod.",
      difficulty: "Intermediate",
      subtopics: ["REST & GraphQL API Architecture", "JWT, OAuth2 & Cookie Security", "Middleware, Error Handling & Logging", "WebSockets for Real-time Two-way Communication"],
      recommendedAction: "Build a production-grade authentication and user management API with rate limiting.",
      resourceName: "Roadmap.sh Backend Developer",
      resourceUrl: "https://roadmap.sh/backend"
    },
    {
      id: "fs_step_5",
      stepNumber: 5,
      title: "Databases, Indexing, Caching (Redis) & Data Modeling",
      focus: "PostgreSQL, MongoDB, Prisma/TypeORM, Redis Caching & Transactions",
      description: "Master relational schema design, indexing, foreign keys, transactions, and NoSQL document modeling. Implement cache-aside patterns and session management with Redis.",
      difficulty: "Intermediate",
      subtopics: ["Relational Schema Design & Normalization", "B-Tree Indexes & Slow Query Optimization", "ACID Transactions & Row Locking", "In-Memory Caching Strategies with Redis"],
      recommendedAction: "Design an e-commerce schema with order transactions, inventory locks, and Redis caching.",
      resourceName: "Use The Index, Luke!",
      resourceUrl: "https://use-the-index-luke.com/"
    },
    {
      id: "fs_step_6",
      stepNumber: 6,
      title: "Full-Stack System Design (HLD & LLD) & Scalability",
      focus: "Microservices, Load Balancing, CDN, Message Queues & Distributed Caching",
      description: "Learn to design scalable web architectures handling millions of daily requests. Master horizontal scaling, reverse proxies, Kafka/RabbitMQ message queues, and CDN caching.",
      difficulty: "Advanced",
      subtopics: ["Horizontal Scaling & Load Balancing (Nginx)", "Distributed Caching (Redis) & CDN Edge", "Event-Driven Asynchronous Queues (Kafka/RabbitMQ)", "Microservices vs Modular Monolith Trade-offs"],
      recommendedAction: "Design the end-to-end architecture of a URL shortener or collaborative document editor.",
      resourceName: "System Design Primer by Donne Martin",
      resourceUrl: "https://github.com/donnemartin/system-design-primer"
    },
    {
      id: "fs_step_7",
      stepNumber: 7,
      title: "DevOps, CI/CD, Docker & Cloud Deployment",
      focus: "Docker Containerization, GitHub Actions CI/CD, AWS/Vercel & Monitoring",
      description: "Containerize full-stack applications with Docker, set up automated CI/CD deployment pipelines, host on AWS/GCP or Vercel, and monitor application health and performance.",
      difficulty: "Advanced",
      subtopics: ["Multi-Stage Dockerfiles for Frontend & Backend", "GitHub Actions CI/CD Pipelines", "Cloud Deployment (AWS ECS/EC2, Vercel)", "Logging, Monitoring & Error Tracking (Sentry)"],
      recommendedAction: "Deploy an end-to-end full-stack app with Docker Compose and automated GitHub Actions CI/CD.",
      resourceName: "Docker & GitHub Actions Docs",
      resourceUrl: "https://docs.github.com/en/actions"
    }
  ],
  skills: {
    mustKnow: [
      "JavaScript / TypeScript",
      "React.js & Next.js",
      "Node.js or Python/Go",
      "Data Structures & Algorithms",
      "PostgreSQL / MySQL",
      "RESTful APIs & JSON",
      "Git & GitHub",
      "HTML5 & Tailwind CSS"
    ],
    goodToKnow: [
      "Redis Caching",
      "MongoDB / NoSQL",
      "Docker & Containerization",
      "WebSockets / Real-Time Data",
      "GraphQL",
      "Unit & Integration Testing (Jest, Playwright)"
    ],
    advanced: [
      "Full-Stack System Design",
      "Microservices Architecture",
      "Message Queues (Kafka / RabbitMQ)",
      "CI/CD Pipelines",
      "Cloud Infrastructure (AWS/GCP)"
    ],
    toolsAndTech: [
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "Redis",
      "Docker",
      "Git",
      "Tailwind CSS",
      "Postman"
    ]
  },
  interviewRounds: [
    {
      step: "01",
      title: "Online Assessment (OA)",
      focus: "Timed DSA Coding Screen + Core CS",
      description: "2 algorithmic problems (arrays, strings, hash maps) plus MCQs on web technologies, databases, and JavaScript.",
      tips: ["Check constraints before coding", "Handle empty inputs, zeroes, and boundary values"],
      keyQuestions: ["Two Sum / Group Anagrams", "Longest Substring Without Repeating Characters"]
    },
    {
      step: "02",
      title: "Machine Coding / Live Coding Round",
      focus: "End-to-End Feature Implementation",
      description: "60 to 90 minute live coding round building a full-stack feature (e.g. comment feed with pagination or shopping cart API).",
      tips: ["Start with clean schema and API contract", "Keep components modular and type-safe"],
      keyQuestions: ["Build a live search component with debounce", "Implement an authenticated CRUD API"]
    },
    {
      step: "03",
      title: "Full-Stack System Design",
      focus: "Architecture, Data Flow & Scalability",
      description: "Architect a large-scale web application discussing frontend state, caching, backend microservices, and database scaling.",
      tips: ["Clarify functional and non-functional requirements first", "Discuss latency, throughput, and consistency trade-offs"],
      keyQuestions: ["Design Twitter / X feed architecture", "Design a Real-Time Collaborative Canvas"]
    },
    {
      step: "04",
      title: "Behavioral & Engineering Culture",
      focus: "STAR Method, Ownership & Teamwork",
      description: "Discussion on past projects, code review practices, handling production incidents, and career ambitions.",
      tips: ["Use STAR format", "Highlight trade-offs and lessons learned from past bugs"],
      keyQuestions: ["Tell me about a complex bug you solved", "How do you handle disagreement with a tech lead?"]
    }
  ],
  assessmentPrep: [
    {
      title: "Algorithmic & Full-Stack Coding",
      weightage: "45% of Assessment",
      description: "Evaluating algorithmic efficiency, API contract design, and modular state management.",
      keyTopics: ["Data Structures & Big-O", "REST API Construction", "Component State & Hooks"],
      sampleQuestion: "Implement an autocomplete search input with debounced API queries and keyboard navigation.",
      preparationTip: "Write clean modular code and always validate inputs and handle loading/error states."
    }
  ],
  interviewCategories: [
    {
      categoryName: "Algorithmic Problem Solving",
      description: "Data structures, algorithms, and complexity optimization.",
      questionCount: 80,
      topicsCovered: ["Arrays", "Strings", "Hash Tables", "Trees", "Graphs", "DP"],
      sampleQuestions: [
        {
          question: "How does a Hash Map achieve average O(1) time complexity for insertions and lookups?",
          expectedApproach: "Explain hash functions, bucket indexing, collision resolution (chaining vs open addressing), and load factor resizing.",
          difficulty: "Medium"
        }
      ]
    },
    {
      categoryName: "Full-Stack Web Architecture",
      description: "Frontend-to-backend communication, state, and API protocols.",
      questionCount: 65,
      topicsCovered: ["React Server Components", "REST vs GraphQL", "Authentication", "WebSockets"],
      sampleQuestions: [
        {
          question: "What is the key difference between Server-Side Rendering (SSR) and React Server Components (RSC)?",
          expectedApproach: "SSR produces HTML on the server and hydrates full JS on the client. RSC executes on the server and returns a component tree stream without sending component JavaScript to the client bundle.",
          difficulty: "Hard"
        }
      ]
    }
  ],
  practiceQuestions: [
    {
      id: "fs_pq_1",
      topic: "System Design",
      title: "Rate Limiter Implementation",
      difficulty: "Medium",
      type: "Coding",
      questionText: "How would you design and implement an API rate limiter allowing 100 requests per minute per IP address in a distributed environment?",
      solutionHint: "Use Redis with a Sliding Window Log or Token Bucket algorithm using atomic Lua scripts or multi/exec pipelines to prevent race conditions.",
      companyTags: ["Google", "Amazon", "Uber"]
    }
  ],
  projects: [
    {
      id: "fs_proj_1",
      title: "Real-Time Collaborative Workspace Platform",
      difficulty: "Advanced",
      skillsCovered: ["Next.js", "TypeScript", "Node.js", "WebSockets", "PostgreSQL", "Redis", "Docker"],
      whatItDemonstrates: "Demonstrates full-stack fluency: real-time multi-user synchronisation, optimistic UI updates, relational data modeling, and containerized deployment.",
      recommendedStack: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL", "Prisma", "Redis", "Docker"],
      talkingPoints: [
        "Architected real-time collaboration using WebSockets and Redis pub/sub for sub-50ms message propagation.",
        "Implemented database schema with PostgreSQL and Prisma with optimized indexes, eliminating slow query bottlenecks.",
        "Containerized frontend and backend services using Docker Compose for seamless development and deployment."
      ]
    }
  ],
  resumeGuidance: {
    targetRole: "Full Stack Developer / Software Engineer",
    atsKeywords: ["React", "Next.js", "TypeScript", "Node.js", "JavaScript", "PostgreSQL", "MongoDB", "REST APIs", "GraphQL", "Redis", "Docker", "Git", "Tailwind CSS", "System Design", "CI/CD"],
    mustHaveSections: ["Full-Stack Technical Skills", "Production Web Projects", "Work Experience", "Education & Certifications"],
    recommendedProjectTypes: ["Next.js + Node.js Full-Stack Web App", "Real-time Collaboration / Messaging Platform", "E-Commerce Microservices Engine"],
    actionVerbs: ["Architected", "Engineered", "Developed", "Optimized", "Integrated", "Deployed"],
    commonMistakes: ["Listing only frontend tutorials without full-stack database integrations", "Omitting live demo and GitHub repository links"],
    sampleBulletPoints: [
      "Engineered an end-to-end full-stack web application with Next.js App Router, TypeScript, and Node.js, supporting 5,000+ monthly active users.",
      "Optimized PostgreSQL queries with composite indexing and Redis caching, reducing average API response latency from 450ms to 65ms."
    ]
  },
  studySheets: [
    {
      title: "Full-Stack Development Roadmap",
      category: "Roadmap",
      provider: "roadmap.sh",
      description: "Interactive visual guides and learning paths for modern frontend and backend development.",
      url: "https://roadmap.sh/full-stack"
    }
  ],
  careerPathways: [
    { stage: "Junior Full Stack Developer", experience: "0 – 2 Years", compensation: "₹6L – ₹12L / $75k – $100k", focus: "Component Building & REST Endpoints", responsibilities: "Building frontend features, implementing CRUD API endpoints, writing unit tests, and debugging web issues.", requiredSkills: ["JavaScript / TypeScript", "React", "Node.js", "SQL Basics", "Git"] },
    { stage: "Full Stack Engineer", experience: "2 – 5 Years", compensation: "₹16L – ₹32L / $115k – $155k", focus: "Full-Stack Feature Ownership & Database Architecture", responsibilities: "Architecting end-to-end application features, schema design, caching strategies, and mentoring interns.", requiredSkills: ["Next.js", "PostgreSQL", "Redis", "Docker", "API Architecture"] },
    { stage: "Senior Full Stack Engineer / Tech Lead", experience: "5+ Years", compensation: "₹35L – ₹70L+ / $170k – $260k+", focus: "Distributed System Architecture & Technical Leadership", responsibilities: "Owning full-stack architecture, driving engineering best practices, leading system scalability, and cross-functional leadership.", requiredSkills: ["System Design", "Microservices", "Cloud Infrastructure", "Engineering Leadership"] }
  ]
};

export const SUPPLEMENTARY_ROLES: PrepRole[] = [
  BACKEND_DEVELOPER_ROLE,
  ML_ENGINEER_ROLE,
  QA_ENGINEER_ROLE,
  FULL_STACK_DEVELOPER_ROLE
];
