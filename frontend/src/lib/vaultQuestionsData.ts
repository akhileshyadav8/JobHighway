import { VaultQuestionItem } from "@/components/prepare/QuestionVaultModal";

export const EXTENDED_BEHAVIORAL_QUESTIONS: VaultQuestionItem[] = [
  {
    id: "beh_5",
    title: "Overcoming a Failure or Missed Project Deadline",
    category: "Behavioral",
    difficulty: "Medium",
    topics: ["Resilience", "Accountability", "Growth Mindset"],
    companies: ["Google", "Amazon", "Microsoft"],
    questionText: "Tell me about a time when a project you were working on failed or missed its delivery deadline. What happened and how did you respond?",
    solutionHint: "Acknowledge what went wrong without passing blame. Explain immediate stakeholder communication, how you helped course-correct, and the post-mortem steps taken to prevent recurrence."
  },
  {
    id: "beh_6",
    title: "Balancing Code Quality with Urgency to Ship",
    category: "Behavioral",
    difficulty: "Medium",
    topics: ["Pragmatism", "Technical Debt", "Trade-offs"],
    companies: ["Meta", "Netflix", "Uber"],
    questionText: "Describe a situation where business urgency forced you to ship code with technical debt. How did you balance speed with system stability?",
    solutionHint: "Describe the trade-off calculation: shipping the MVP on time while logging debt tickets, setting automated alerts, and scheduling a follow-up sprint to refactor."
  },
  {
    id: "beh_7",
    title: "Handling Constructive Criticism on a Pull Request",
    category: "Behavioral",
    difficulty: "Easy",
    topics: ["Collaboration", "Humility", "Code Reviews"],
    companies: ["Amazon", "Adobe", "Stripe"],
    questionText: "Tell me about a time a senior colleague or peer requested major architectural changes on your pull request. How did you react?",
    solutionHint: "Highlight receiving feedback objectively, seeking to understand the architectural reasoning, asking clarifying questions, and treating it as a valuable learning opportunity."
  },
  {
    id: "beh_8",
    title: "Persuading Stakeholders with Data and Evidence",
    category: "Behavioral",
    difficulty: "Hard",
    topics: ["Influence", "Data-Driven Decision Making", "Communication"],
    companies: ["Amazon", "Google", "Meta"],
    questionText: "Give an example of when you had to convince your team or non-technical stakeholders to change direction using data.",
    solutionHint: "Describe the baseline metrics, how you gathered quantitative evidence (benchmarks, logs, user funnel stats), presented the findings clearly, and won consensus."
  },
  {
    id: "beh_9",
    title: "Navigating Unclear Requirements as a Fresher",
    category: "Behavioral",
    difficulty: "Easy",
    topics: ["Initiative", "Communication", "Problem Solving"],
    companies: ["Microsoft", "Cognizant", "TCS", "Infosys"],
    questionText: "What do you do when assigned a task with vague requirements and no clear documentation?",
    solutionHint: "Explain your process: inspect existing codebase tests, write down assumed input/output behaviors, prepare a concise bulleted list of clarifying questions, and confirm with your mentor before building."
  },
  {
    id: "beh_10",
    title: "Managing Multiple Competing Priorities and Deadlines",
    category: "Behavioral",
    difficulty: "Medium",
    topics: ["Time Management", "Prioritization", "Stress Management"],
    companies: ["Amazon", "Salesforce", "Oracle"],
    questionText: "Tell me about a time you had multiple urgent assignments due simultaneously. How did you manage your workload?",
    solutionHint: "Use the Eisenhower matrix or impact vs effort evaluation. Discuss communicating proactively with stakeholders about realistic timelines rather than silently burning out."
  },
  {
    id: "beh_11",
    title: "Championing Diversity and Inclusive Team Collaboration",
    category: "Behavioral",
    difficulty: "Medium",
    topics: ["Culture Fit", "Empathy", "Teamwork"],
    companies: ["Google", "Microsoft", "Adobe"],
    questionText: "Describe an experience working in a team with members from diverse technical or cultural backgrounds. How did you ensure everyone's voice was heard?",
    solutionHint: "Focus on creating an inclusive environment: encouraging quieter teammates during brainstorming, respecting diverse problem-solving methodologies, and finding common goals."
  },
  {
    id: "beh_12",
    title: "Learning a Completely New Tech Stack Under Pressure",
    category: "Behavioral",
    difficulty: "Medium",
    topics: ["Adaptability", "Learning Curve", "Curiosity"],
    companies: ["Meta", "Amazon", "Uber"],
    questionText: "Tell me about a time you were required to deliver a feature using a programming language or framework you had never used before.",
    solutionHint: "Explain your structured learning method: reading official docs, building a toy proof-of-concept, reviewing existing production PRs, and delivering the feature with unit tests."
  }
];

export const EXTENDED_SYSTEM_DESIGN_QUESTIONS: VaultQuestionItem[] = [
  {
    id: "sys_4",
    title: "Design a High-Volume Notification System (SMS, Email, Push)",
    category: "System Design",
    difficulty: "Medium",
    topics: ["Message Queues", "Microservices", "Rate Limiting"],
    companies: ["Uber", "Amazon", "Netflix"],
    questionText: "Design a notification service capable of sending 100M notifications per day with prioritization, templating, and rate limiting per user.",
    solutionHint: "Use Kafka or RabbitMQ partitioned by channel. Implement worker pools for APNS/FCM/Twilio with exponential backoff retries. Deduplicate with Redis idempotency keys."
  },
  {
    id: "sys_5",
    title: "Design a Distributed Web Crawler at Web Scale",
    category: "System Design",
    difficulty: "Hard",
    topics: ["Distributed Systems", "DNS Caching", "Storage"],
    companies: ["Google", "Microsoft"],
    questionText: "Design a web crawler that crawls 1 billion web pages per month. Discuss URL frontier prioritization, politeness policies, and duplicate detection.",
    solutionHint: "Use Bloom Filters for duplicate URL detection. Implement a multi-queue URL Frontier (Priority + Politeness queues). Cache DNS records locally to prevent DNS query bottleneck."
  },
  {
    id: "sys_6",
    title: "Design a Real-Time Ride-Matching Service (Uber/Lyft)",
    category: "System Design",
    difficulty: "Hard",
    topics: ["Geospatial Indexing", "WebSockets", "Consistent Hashing"],
    companies: ["Uber", "Google", "Grab"],
    questionText: "Design the location tracking and ride-matching architecture for Uber handling millions of drivers sending GPS pings every 4 seconds.",
    solutionHint: "Use Google S2 Geometry or Uber H3 spatial indexing. Maintain live driver location in Redis memory with geospatial commands (GEOADD/GEORADIUS). Use WebSocket clusters for bidirectional driver pings."
  },
  {
    id: "sys_7",
    title: "Design a Scalable Distributed Cache (Redis Clone)",
    category: "System Design",
    difficulty: "Hard",
    topics: ["Consistent Hashing", "Eviction Policies", "Replication"],
    companies: ["Amazon", "Meta", "Netflix"],
    questionText: "Design a distributed key-value cache that distributes 1TB of data across 20 nodes with sub-5ms read latencies and automatic failover.",
    solutionHint: "Use Consistent Hashing with virtual nodes for uniform data distribution. Support LRU or LFU eviction. Implement Master-Replica with Raft or Gossip protocol for node health checks."
  },
  {
    id: "sys_8",
    title: "Design a Video Streaming Architecture (YouTube/Netflix)",
    category: "System Design",
    difficulty: "Hard",
    topics: ["CDN", "Transcoding Pipeline", "Adaptive Bitrate"],
    companies: ["Netflix", "Google", "Amazon"],
    questionText: "Design the storage, transcoding, and content delivery architecture for a video streaming platform with adaptive bitrate streaming (HLS/DASH).",
    solutionHint: "Upload via S3 multipart. Chunk and transcode video asynchronously using Kafka worker pools into multiple resolutions (1080p, 720p, 480p). Distribute via globally distributed CDNs (Cloudflare/CloudFront)."
  },
  {
    id: "sys_9",
    title: "Design an E-Commerce Flash Sale System (High Concurrency)",
    category: "System Design",
    difficulty: "Hard",
    topics: ["Inventory Locking", "Redis Lua Scripts", "Message Queuing"],
    companies: ["Amazon", "Flipkart", "Alibaba"],
    questionText: "Design a checkout system that handles 100,000 users attempting to buy 1,000 limited inventory items within 5 seconds without overselling.",
    solutionHint: "Pre-warm inventory counts in Redis. Use atomic Lua scripts (DECRBY) to deduct inventory in-memory. Only enqueue confirmed reservations to Kafka for asynchronous payment and DB updates."
  }
];

export const EXTENDED_APTITUDE_QUESTIONS: VaultQuestionItem[] = [
  {
    id: "apt_3",
    title: "Probability of Hash Collisions (Birthday Paradox)",
    category: "Aptitude",
    difficulty: "Medium",
    topics: ["Probability", "Hashing", "Quantitative"],
    companies: ["Google", "Amazon", "Microsoft"],
    questionText: "If a hash function produces 365 possible distinct hash values, how many items need to be inserted for the probability of at least one collision to exceed 50%?",
    solutionHint: "Based on the Birthday Paradox: n ≈ 1.177 * sqrt(365) ≈ 23 items. This illustrates why hash table capacities must be sized well beyond the expected number of entries."
  },
  {
    id: "apt_4",
    title: "Data Interpretation: Server Latency vs Throughput Graph",
    category: "Aptitude",
    difficulty: "Easy",
    topics: ["Data Interpretation", "Systems Thinking", "Ratios"],
    companies: ["Amazon", "Cognizant", "TCS"],
    questionText: "A service processes 500 RPS at 20ms average latency. When traffic doubles to 1,000 RPS, latency spikes to 80ms. By what factor did total thread occupancy increase?",
    solutionHint: "Little's Law: Concurrent requests L = λ * W. Initially: 500 * 0.02s = 10 threads. Under load: 1000 * 0.08s = 80 threads. Occupancy increased by 80 / 10 = 8x factor."
  },
  {
    id: "apt_5",
    title: "Speed, Distance & Network Packet Round-Trip Time",
    category: "Aptitude",
    difficulty: "Easy",
    topics: ["Time, Speed & Distance", "Networking Basics"],
    companies: ["Adobe", "Cisco", "Infosys"],
    questionText: "A fiber-optic light pulse travels at 200,000 km/s. If the distance between two cloud data centers is 4,000 km, what is the minimum theoretical physical propagation RTT?",
    solutionHint: "One-way propagation time = 4,000 km / 200,000 km/s = 0.02s = 20ms. Round-trip propagation time (RTT) = 20ms * 2 = 40ms."
  },
  {
    id: "apt_6",
    title: "Logical Deductions & Syllogisms for Test Automation",
    category: "Aptitude",
    difficulty: "Medium",
    topics: ["Logical Reasoning", "Syllogisms", "Boolean Logic"],
    companies: ["TCS", "Wipro", "Cognizant", "Accenture"],
    questionText: "All microservices that use Redis require in-memory caching. Some microservices that use Redis have database replicas. Does it follow that all microservices with database replicas use in-memory caching?",
    solutionHint: "No. 'Some A are B' and 'All A are C' only proves that some microservices with database replicas use in-memory caching, not all."
  },
  {
    id: "apt_7",
    title: "Profit, Loss & Cloud Infrastructure Cost Optimization",
    category: "Aptitude",
    difficulty: "Easy",
    topics: ["Commercial Math", "Cloud Economics", "Percentages"],
    companies: ["Amazon", "Deloitte", "EY"],
    questionText: "A SaaS company spends $12,000/month on on-demand cloud servers. By purchasing 3-year Reserved Instances, they receive a 45% discount. How much do they save annually?",
    solutionHint: "Annual on-demand cost = $12,000 * 12 = $144,000. Annual savings with 45% discount = $144,000 * 0.45 = $64,800."
  }
];
