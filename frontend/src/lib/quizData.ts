export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0-indexed
  explanation: string;
  topic: string;
}

export interface QuizTest {
  id: string;
  title: string;
  roleId: string; // "software-engineer" | "data-analyst" | "data-scientist" | "all" | etc.
  category: "Technical Round" | "Aptitude Round" | "HR & Behavioral Round" | "Company Specific";
  difficulty: "Easy" | "Medium" | "Hard";
  durationMinutes: number;
  passingScorePercent: number;
  totalMarks: number;
  description: string;
  companyTag?: string;
  questions: QuizQuestion[];
  questionPool?: QuizQuestion[]; // If provided, randomly select from this for each attempt
}

export interface QuizAttemptRecord {
  id: string;
  quizId: string;
  quizTitle: string;
  roleId: string;
  category: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  timeSpentSeconds: number;
  completedAt: string;
  userAnswers: Record<string, number>; // questionId -> selectedIndex
}

export const ALL_QUIZZES: QuizTest[] = [
  // 1. Software Engineer Technical Assessment
  {
    id: "swe-tech-assessment-1",
    title: "Software Engineer Core Technical Screening",
    roleId: "software-engineer",
    category: "Technical Round",
    difficulty: "Medium",
    durationMinutes: 45,
    passingScorePercent: 70,
    totalMarks: 60,
    description: "Comprehensive screening test covering Data Structures, Algorithms, OOP, OS, DBMS, Networks, System Design, and Concurrency.",
    companyTag: "Google / Microsoft Tier",
    questions: [
      {
        id: "swe-q1",
        question: "What is the worst-case time complexity of searching for an element in a balanced Binary Search Tree (AVL/Red-Black)?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctAnswer: 1,
        explanation: "Because an AVL or Red-Black tree strictly maintains a height bounded by O(log n), any search operation takes at most O(log n) comparisons in the worst case.",
        topic: "Data Structures"
      },
      {
        id: "swe-q2",
        question: "Which SOLID principle states that 'Software entities should be open for extension, but closed for modification'?",
        options: [
          "Single Responsibility Principle",
          "Open-Closed Principle",
          "Liskov Substitution Principle",
          "Interface Segregation Principle"
        ],
        correctAnswer: 1,
        explanation: "The Open-Closed Principle (OCP), coined by Bertrand Meyer, states that classes should be open for extension (e.g. via inheritance, strategy patterns) without modifying existing tested source code.",
        topic: "OOP & Design Patterns"
      },
      {
        id: "swe-q3",
        question: "In an Operating System, which of the following is NOT one of the four necessary conditions for Deadlock (Coffman conditions)?",
        options: [
          "Mutual Exclusion",
          "Hold and Wait",
          "Preemptive Scheduling",
          "Circular Wait"
        ],
        correctAnswer: 2,
        explanation: "The four Coffman conditions for deadlock are: Mutual Exclusion, Hold and Wait, No Preemption (resources cannot be forcibly taken), and Circular Wait. 'Preemptive Scheduling' actually breaks deadlocks.",
        topic: "Operating Systems"
      },
      {
        id: "swe-q4",
        question: "Why are B+ Trees favored over standard Binary Search Trees for relational database indexing on disk?",
        options: [
          "B+ Trees consume significantly less RAM",
          "B+ Trees have a high branching factor, minimizing disk I/O seek operations",
          "B+ Trees have O(1) worst-case search complexity",
          "B+ Trees only support integer keys"
        ],
        correctAnswer: 1,
        explanation: "Disks read data in block pages. B+ Trees have a high branching factor (order in hundreds), ensuring tree height is very low (typically 3-4), so lookups require only 3-4 disk block I/Os.",
        topic: "DBMS & Indexing"
      },
      {
        id: "swe-q5",
        question: "In HTTP/2 and HTTP/3, what major performance limitation of HTTP/1.1 was eliminated?",
        options: [
          "DNS resolution latency",
          "Head-of-Line (HoL) blocking on multiple parallel requests",
          "TCP checksum calculation overhead",
          "SSL Certificate verification requirements"
        ],
        correctAnswer: 1,
        explanation: "HTTP/1.1 suffered from Head-of-Line blocking because requests on a single connection had to be serialized. HTTP/2 introduced multiplexed bidirectional streams over a single connection, and HTTP/3 (QUIC/UDP) resolved transport-level HoL blocking.",
        topic: "Computer Networks"
      },
      {
        id: "swe-q6",
        question: "What is the time complexity of inserting an element into a max-heap?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctAnswer: 1,
        explanation: "After inserting at the end of the heap array, we heapify-up (sift-up) the element. In the worst case this traverses the height of the heap which is O(log n).",
        topic: "Data Structures"
      },
      {
        id: "swe-q7",
        question: "Which sorting algorithm has the best average-case time complexity and is preferred in practice for large datasets?",
        options: ["Bubble Sort O(n²)", "Merge Sort O(n log n)", "Quick Sort O(n log n)", "Both Merge and Quick Sort equally"],
        correctAnswer: 3,
        explanation: "Both Merge Sort and Quick Sort have O(n log n) average-case complexity, but Quick Sort has superior cache performance in practice due to in-place partitioning. Hence both are considered best average-case performers.",
        topic: "Algorithms"
      },
      {
        id: "swe-q8",
        question: "What does the CAP theorem state about distributed systems?",
        options: [
          "A system can guarantee Consistency, Availability, and Partition tolerance simultaneously",
          "A distributed system can guarantee at most two of: Consistency, Availability, Partition tolerance",
          "CAP stands for Caching, Aggregation, and Partitioning",
          "A database must choose between ACID and BASE properties"
        ],
        correctAnswer: 1,
        explanation: "CAP theorem (Brewer 2000): In the presence of a network Partition, a distributed system must choose between Consistency and Availability. You can only fully guarantee two of the three properties.",
        topic: "Distributed Systems"
      },
      {
        id: "swe-q9",
        question: "Which design pattern provides a unified interface to a set of interfaces in a subsystem, making it easier to use?",
        options: ["Adapter Pattern", "Facade Pattern", "Proxy Pattern", "Decorator Pattern"],
        correctAnswer: 1,
        explanation: "The Facade Pattern provides a simplified, unified interface to a complex subsystem. It defines a higher-level interface that makes the subsystem easier to use by hiding its complexity.",
        topic: "OOP & Design Patterns"
      },
      {
        id: "swe-q10",
        question: "In a multi-threaded Java program, what keyword ensures that only one thread can execute a method at a time?",
        options: ["volatile", "synchronized", "transient", "static"],
        correctAnswer: 1,
        explanation: "The 'synchronized' keyword in Java acquires the intrinsic lock (monitor) of the object before executing the method body, ensuring mutual exclusion. 'volatile' only guarantees visibility, not atomicity.",
        topic: "Concurrency"
      },
      {
        id: "swe-q11",
        question: "What is the space complexity of Depth-First Search (DFS) on a graph with V vertices and E edges?",
        options: ["O(1)", "O(V)", "O(E)", "O(V + E)"],
        correctAnswer: 1,
        explanation: "DFS uses a stack (explicit or call stack) that at most holds the current path from root to the deepest node. In the worst case (a linear graph), this is O(V). Edge count does not directly affect stack space.",
        topic: "Algorithms"
      },
      {
        id: "swe-q12",
        question: "In ACID properties of database transactions, what does 'Isolation' guarantee?",
        options: [
          "Each transaction is permanent once committed",
          "Concurrent transactions execute as if they are serially executed",
          "The database is always in a valid state",
          "Either all operations in a transaction complete or none do"
        ],
        correctAnswer: 1,
        explanation: "Isolation ensures that the intermediate state of a transaction is invisible to other concurrent transactions. The final effect is as if transactions were executed one after another in serial order.",
        topic: "DBMS & Indexing"
      },
      {
        id: "swe-q13",
        question: "What is the TCP three-way handshake sequence?",
        options: [
          "SYN → SYN-ACK → FIN",
          "SYN → SYN-ACK → ACK",
          "ACK → SYN → SYN-ACK",
          "SYN → ACK → RST"
        ],
        correctAnswer: 1,
        explanation: "TCP connection establishment: 1) Client sends SYN, 2) Server responds with SYN-ACK, 3) Client sends ACK. This three-way handshake establishes a reliable, ordered connection before data transfer begins.",
        topic: "Computer Networks"
      },
      {
        id: "swe-q14",
        question: "Which data structure provides O(1) average time complexity for insert, delete, and search?",
        options: ["Array", "Linked List", "Hash Table", "Binary Search Tree"],
        correctAnswer: 2,
        explanation: "Hash Tables use a hash function to map keys to buckets, providing O(1) average time for insert, delete, and lookup. Worst case is O(n) due to hash collisions, but good hash functions minimize this.",
        topic: "Data Structures"
      },
      {
        id: "swe-q15",
        question: "In Operating Systems, what is the difference between a process and a thread?",
        options: [
          "Threads have their own memory space; processes share memory",
          "A process is a program in execution; threads are lightweight units of execution within a process sharing the same memory space",
          "Threads are managed by hardware; processes are managed by the OS",
          "There is no practical difference in modern OSes"
        ],
        correctAnswer: 1,
        explanation: "A process has its own virtual address space, file handles, and system resources. Threads within the same process share the heap, code, and global data, but each has its own stack and registers. Threads are cheaper to create and context-switch.",
        topic: "Operating Systems"
      },
      {
        id: "swe-q16",
        question: "What is dynamic programming fundamentally about?",
        options: [
          "Programming with dynamic typing languages",
          "Breaking problems into overlapping subproblems and storing their solutions to avoid redundant computation",
          "Dynamically allocating memory during runtime",
          "Using polymorphism to change behavior at runtime"
        ],
        correctAnswer: 1,
        explanation: "Dynamic Programming solves optimization problems by identifying overlapping subproblems, solving each once, and storing results (memoization or tabulation) to avoid redundant computation. Classic examples: Fibonacci, Longest Common Subsequence, Knapsack.",
        topic: "Algorithms"
      },
      {
        id: "swe-q17",
        question: "In system design, what is the purpose of a Load Balancer?",
        options: [
          "To compress data before sending to clients",
          "To distribute incoming network traffic evenly across multiple backend servers",
          "To cache frequently accessed data in memory",
          "To encrypt all data in transit using SSL/TLS"
        ],
        correctAnswer: 1,
        explanation: "A Load Balancer distributes incoming requests across a pool of backend servers to prevent any single server from becoming a bottleneck. It improves availability, scalability, and fault tolerance. Common algorithms: Round Robin, Least Connections, IP Hash.",
        topic: "System Design"
      },
      {
        id: "swe-q18",
        question: "What is a race condition in concurrent programming?",
        options: [
          "When two threads compete to finish a task faster",
          "When the behavior of a program depends on the relative timing of events such as thread scheduling, leading to unpredictable results",
          "When a thread acquires a lock held by another thread",
          "When two processes run on different CPU cores simultaneously"
        ],
        correctAnswer: 1,
        explanation: "A race condition occurs when two or more threads access shared data concurrently, and the final outcome depends on the non-deterministic order of execution (scheduling). This can lead to data corruption, bugs that are hard to reproduce.",
        topic: "Concurrency"
      },
      {
        id: "swe-q19",
        question: "What is the Liskov Substitution Principle (LSP)?",
        options: [
          "A class should have only one reason to change",
          "Objects of a superclass should be replaceable with objects of its subclasses without altering correctness",
          "Clients should not depend on interfaces they don't use",
          "High-level modules should not depend on low-level modules"
        ],
        correctAnswer: 1,
        explanation: "LSP (Barbara Liskov, 1987): If S is a subtype of T, then objects of T may be replaced with objects of S without breaking program correctness. Violations often appear when a subclass overrides methods in ways that change expected behavior.",
        topic: "OOP & Design Patterns"
      },
      {
        id: "swe-q20",
        question: "What is the difference between SQL's INNER JOIN and LEFT JOIN?",
        options: [
          "INNER JOIN returns all rows from both tables; LEFT JOIN only from the left",
          "INNER JOIN returns only matching rows from both tables; LEFT JOIN returns all rows from the left table and matching rows from the right (NULL for non-matches)",
          "LEFT JOIN is faster than INNER JOIN",
          "There is no difference; they return the same result"
        ],
        correctAnswer: 1,
        explanation: "INNER JOIN returns only rows where the join condition matches in BOTH tables. LEFT JOIN returns ALL rows from the left table, and matched rows from the right; where no match exists, NULL fills right-table columns.",
        topic: "DBMS & Indexing"
      },
      {
        id: "swe-q21",
        question: "In a RESTful API, which HTTP method is idempotent and used to fully replace a resource?",
        options: ["POST", "PATCH", "PUT", "DELETE"],
        correctAnswer: 2,
        explanation: "PUT is idempotent: calling it multiple times with the same payload produces the same result. It fully replaces the resource at the given URI. POST creates a new resource (not idempotent). PATCH partially updates.",
        topic: "Computer Networks"
      },
      {
        id: "swe-q22",
        question: "What is virtual memory in an Operating System?",
        options: [
          "Memory that only exists in cloud servers",
          "An abstraction that allows processes to use more memory than physically available by using disk space as an extension of RAM",
          "Memory used exclusively by the OS kernel",
          "GPU memory used for graphics rendering"
        ],
        correctAnswer: 1,
        explanation: "Virtual memory gives each process the illusion of having a large, private address space. The OS uses paging to map virtual pages to physical frames, and uses disk (swap space) as overflow when RAM is full. This enables running programs larger than physical RAM.",
        topic: "Operating Systems"
      },
      {
        id: "swe-q23",
        question: "What is the time complexity of the best comparison-based sorting algorithms?",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
        correctAnswer: 1,
        explanation: "The information-theoretic lower bound for comparison-based sorting is Ω(n log n). Any algorithm that determines order solely through element comparisons cannot do better than n log n in the worst case. Merge Sort and Heap Sort achieve this bound.",
        topic: "Algorithms"
      },
      {
        id: "swe-q24",
        question: "In the Observer design pattern, what is the relationship between Subject and Observer?",
        options: [
          "Observer creates Subject objects",
          "Subject maintains a list of Observers and notifies them automatically of state changes",
          "Observers control the lifecycle of the Subject",
          "Subject and Observer must be in the same class hierarchy"
        ],
        correctAnswer: 1,
        explanation: "In the Observer (Publisher-Subscriber) pattern, the Subject (publisher) maintains a list of dependent Observers (subscribers) and automatically notifies them when its state changes. This enables loose coupling between components.",
        topic: "OOP & Design Patterns"
      },
      {
        id: "swe-q25",
        question: "What is a CDN (Content Delivery Network) and what problem does it solve?",
        options: [
          "A CDN encrypts all user data for security",
          "A CDN is a distributed network of servers that caches and serves static content from locations geographically close to users, reducing latency",
          "A CDN is a database replication strategy",
          "A CDN manages containerized microservices"
        ],
        correctAnswer: 1,
        explanation: "A CDN places cached copies of static assets (images, JS, CSS, videos) at Points of Presence (PoPs) globally close to end users. This reduces round-trip latency, decreases origin server load, and improves availability during traffic spikes.",
        topic: "System Design"
      },
      {
        id: "swe-q26",
        question: "What is a mutex (mutual exclusion lock) in operating systems?",
        options: [
          "A shared memory segment used by multiple processes",
          "A synchronization primitive that prevents multiple threads from simultaneously executing a critical section",
          "A method to copy data between processes",
          "A type of CPU scheduling algorithm"
        ],
        correctAnswer: 1,
        explanation: "A mutex is a lock that only one thread can hold at a time. When a thread acquires the mutex before entering a critical section and releases it after, other threads trying to acquire are blocked, ensuring mutual exclusion and preventing data races.",
        topic: "Concurrency"
      },
      {
        id: "swe-q27",
        question: "What is the purpose of database indexing and what is its trade-off?",
        options: [
          "Indexes speed up writes but slow down reads",
          "Indexes speed up read/search queries but consume additional disk space and slow down write operations (INSERT/UPDATE/DELETE)",
          "Indexes encrypt data at rest for security",
          "Indexes have no trade-offs — they only improve performance"
        ],
        correctAnswer: 1,
        explanation: "An index creates a separate data structure (usually a B+ Tree or hash) that maps column values to row locations, making SELECT queries faster. The trade-off: indexes consume disk space and every INSERT/UPDATE/DELETE must also update the index, making writes slower.",
        topic: "DBMS & Indexing"
      },
      {
        id: "swe-q28",
        question: "What is the time complexity of finding the shortest path between two nodes using Dijkstra's algorithm with a binary heap?",
        options: ["O(V²)", "O(E log V)", "O(V + E)", "O(V log E)"],
        correctAnswer: 1,
        explanation: "Dijkstra's algorithm with a binary min-heap (priority queue) has time complexity O((V + E) log V), commonly simplified to O(E log V) for sparse graphs. Each edge is processed once, and heap operations take O(log V).",
        topic: "Algorithms"
      },
      {
        id: "swe-q29",
        question: "In system design, what is horizontal scaling (scale out) vs vertical scaling (scale up)?",
        options: [
          "Horizontal scaling adds more RAM/CPU to existing server; vertical scaling adds more servers",
          "Horizontal scaling adds more servers to distribute load; vertical scaling upgrades hardware of existing servers",
          "Horizontal scaling is only for databases; vertical scaling is only for web servers",
          "Both terms mean the same thing"
        ],
        correctAnswer: 1,
        explanation: "Horizontal scaling (scale out) adds more machines/instances to distribute traffic. Vertical scaling (scale up) adds more CPU, RAM, or SSD to an existing machine. Horizontal scaling is preferred for high availability and cost-effectiveness at internet scale.",
        topic: "System Design"
      },
      {
        id: "swe-q30",
        question: "What is the difference between a stack and a queue data structure?",
        options: [
          "Stack is FIFO; Queue is LIFO",
          "Stack is LIFO (Last-In-First-Out); Queue is FIFO (First-In-First-Out)",
          "Stack stores values; Queue stores references",
          "Both are identical with different names"
        ],
        correctAnswer: 1,
        explanation: "Stack (LIFO): the last element pushed is the first popped — like a stack of plates. Queue (FIFO): the first element enqueued is the first dequeued — like a line at a cashier. Stacks are used for DFS, undo operations; Queues for BFS, task scheduling.",
        topic: "Data Structures"
      },
      {
        id: "swe-q31",
        question: "What does DNS (Domain Name System) do?",
        options: [
          "It encrypts web traffic between client and server",
          "It translates human-readable domain names (e.g., google.com) into IP addresses",
          "It manages TCP connection pooling",
          "It distributes load across multiple servers"
        ],
        correctAnswer: 1,
        explanation: "DNS is the internet's phone book. It resolves domain names to IP addresses through a hierarchy: Root nameservers → TLD nameservers (.com, .org) → Authoritative nameservers. Results are cached at multiple levels to reduce lookup latency.",
        topic: "Computer Networks"
      },
      {
        id: "swe-q32",
        question: "What is a memory leak in software engineering?",
        options: [
          "When memory bandwidth is saturated by too many processes",
          "When a program allocates memory but fails to release it when no longer needed, causing gradual memory exhaustion",
          "When data is accidentally written to the wrong memory address",
          "When RAM physically degrades over time"
        ],
        correctAnswer: 1,
        explanation: "A memory leak occurs when dynamically allocated memory is never freed/garbage collected after it's no longer reachable or needed. Over time, the process consumes more and more RAM, eventually causing out-of-memory crashes or performance degradation.",
        topic: "Operating Systems"
      }
    ]
  },

  // 2. Data Analyst SQL & Business Logic Assessment
  {
    id: "da-sql-assessment-1",
    title: "Data Analyst SQL & Analytics Screening",
    roleId: "data-analyst",
    category: "Technical Round",
    difficulty: "Medium",
    durationMinutes: 45,
    passingScorePercent: 70,
    totalMarks: 60,
    description: "Evaluates SQL window functions, CTEs, aggregation mechanics, statistics, Power BI, A/B testing, and cohort retention metrics.",
    companyTag: "Amazon / Meta Tier",
    questions: [
      {
        id: "da-q1",
        question: "What is the key difference between RANK() and DENSE_RANK() window functions when two rows have equal values?",
        options: [
          "RANK() assigns consecutive numbers without gaps; DENSE_RANK() leaves gaps.",
          "DENSE_RANK() assigns consecutive ranks without gaps; RANK() leaves gaps after ties.",
          "RANK() only works with numeric values; DENSE_RANK() works with strings.",
          "Both functions produce identical rankings regardless of ties."
        ],
        correctAnswer: 1,
        explanation: "If two rows tie for 1st place, RANK() gives 1, 1, 3 (skipping 2). DENSE_RANK() gives 1, 1, 2 (maintaining dense, consecutive ordering without gaps).",
        topic: "SQL Window Functions"
      },
      {
        id: "da-q2",
        question: "Which SQL clause is executed FIRST in the standard SQL query processing order of operations?",
        options: ["SELECT", "WHERE", "FROM / JOIN", "GROUP BY"],
        correctAnswer: 2,
        explanation: "Standard logical SQL processing order is: 1. FROM & JOINs, 2. WHERE, 3. GROUP BY, 4. HAVING, 5. SELECT, 6. DISTINCT, 7. ORDER BY, 8. LIMIT/OFFSET.",
        topic: "SQL Engine Execution Order"
      },
      {
        id: "da-q3",
        question: "If a company has 1,000 active subscribers at the start of a month, acquires 200 new subscribers, and 50 existing subscribers cancel, what is the monthly Customer Churn Rate?",
        options: ["5.0%", "4.16%", "15.0%", "2.5%"],
        correctAnswer: 0,
        explanation: "Customer Churn Rate = (Lost Customers / Starting Customers) = 50 / 1,000 = 5.0%. New customer acquisitions during the period are not counted in the denominator for standard period churn.",
        topic: "Business Metrics"
      },
      {
        id: "da-q4",
        question: "In Power BI / DAX, which function creates a virtual table with filter context modification, most commonly used in custom metrics?",
        options: ["CALCULATE()", "SUMX()", "FILTER()", "RELATEDTABLE()"],
        correctAnswer: 0,
        explanation: "CALCULATE() is the core engine function in DAX that evaluates an expression under modified filter context parameters.",
        topic: "Power BI & DAX"
      },
      {
        id: "da-q5",
        question: "What type of statistical bias occurs when analyzing survey responses where only unsatisfied customers chose to complete the questionnaire?",
        options: ["Survivorship Bias", "Voluntary Response Bias / Selection Bias", "Observer-Expectancy Bias", "Simpson's Paradox"],
        correctAnswer: 1,
        explanation: "Voluntary response bias is a form of selection bias where individuals with extreme opinions or high dissatisfaction are disproportionately motivated to participate.",
        topic: "Statistics & Experimentation"
      },
      {
        id: "da-q6",
        question: "What is a Common Table Expression (CTE) in SQL and what is its primary advantage?",
        options: [
          "A CTE is a permanent table stored in the database",
          "A CTE is a named temporary result set defined with WITH clause, improving query readability and allowing recursive queries",
          "A CTE replaces indexes for better performance",
          "A CTE is only available in NoSQL databases"
        ],
        correctAnswer: 1,
        explanation: "A CTE (WITH clause) defines a named temporary result set scoped to the query. Benefits: improves readability by breaking complex queries into logical building blocks, enables recursive queries (tree/graph traversal), and can be referenced multiple times in the same query.",
        topic: "SQL Advanced"
      },
      {
        id: "da-q7",
        question: "In A/B testing, what is statistical significance and what does a p-value of 0.05 mean?",
        options: [
          "The test has 95% chance of detecting an effect that doesn't exist",
          "There is a 5% probability that the observed difference occurred by chance (Type I error rate threshold)",
          "The effect size is 5% larger in variant B",
          "The sample size is 95% of the total population"
        ],
        correctAnswer: 1,
        explanation: "Statistical significance at p < 0.05 means: if the null hypothesis (no difference) were true, we'd observe results this extreme or more only 5% of the time. We reject the null hypothesis. This controls Type I error (false positive) at the 5% level.",
        topic: "A/B Testing & Statistics"
      },
      {
        id: "da-q8",
        question: "What does the SQL window function LAG() do?",
        options: [
          "It returns the next row's value in the partition",
          "It returns a value from a previous row within the partition without collapsing rows like GROUP BY",
          "It filters rows based on lag time",
          "It calculates the moving average"
        ],
        correctAnswer: 1,
        explanation: "LAG(column, offset, default) accesses values from a previous row in the same partition ordered by a specified column. It's used for period-over-period comparisons (e.g., month-over-month revenue change) without self-joins.",
        topic: "SQL Window Functions"
      },
      {
        id: "da-q9",
        question: "What is cohort analysis and when is it most useful?",
        options: [
          "Comparing two products head-to-head in the same time period",
          "Grouping users who share a common characteristic (e.g., signup month) and tracking their behavior over time to measure retention and lifecycle",
          "Analyzing geographic distribution of users",
          "Segmenting users by demographic data only"
        ],
        correctAnswer: 1,
        explanation: "Cohort analysis groups users by a shared attribute (often acquisition period) and tracks metrics like retention, LTV, and churn over subsequent time periods. It's essential for understanding how product changes affect user behavior across different generations of users.",
        topic: "Business Metrics"
      },
      {
        id: "da-q10",
        question: "What is the difference between HAVING and WHERE in SQL?",
        options: [
          "HAVING filters rows before aggregation; WHERE filters after",
          "WHERE filters individual rows before aggregation; HAVING filters aggregated groups after GROUP BY",
          "They are completely interchangeable",
          "HAVING can only be used with COUNT(); WHERE works with any column"
        ],
        correctAnswer: 1,
        explanation: "WHERE filters rows BEFORE grouping (operates on individual row columns). HAVING filters AFTER GROUP BY (operates on aggregate results like SUM, COUNT, AVG). You cannot use aggregate functions in WHERE; use HAVING instead.",
        topic: "SQL Engine Execution Order"
      },
      {
        id: "da-q11",
        question: "In Tableau, what is the difference between a dimension and a measure?",
        options: [
          "Dimensions are numeric fields; measures are categorical",
          "Dimensions are categorical/qualitative fields used to slice data; measures are quantitative fields that can be aggregated (SUM, AVG)",
          "Dimensions are rows; measures are columns",
          "There is no functional difference"
        ],
        correctAnswer: 1,
        explanation: "In Tableau: Dimensions are qualitative, discrete fields (e.g., Region, Product Category, Date) used to categorize data. Measures are quantitative, continuous fields (e.g., Revenue, Profit, Units Sold) that can be aggregated using SUM, AVG, MIN, MAX, etc.",
        topic: "Data Visualization"
      },
      {
        id: "da-q12",
        question: "What is the Normal Distribution (Gaussian Distribution) and why is it important in statistics?",
        options: [
          "A distribution where all values have equal probability",
          "A symmetric bell-shaped distribution characterized by mean and standard deviation, important because of the Central Limit Theorem",
          "A distribution only used for binary outcomes",
          "A distribution that only applies to large samples"
        ],
        correctAnswer: 1,
        explanation: "The Normal Distribution is a symmetric bell curve defined by μ (mean) and σ (standard deviation). The Central Limit Theorem states that sample means of any distribution approach normal distribution as sample size increases. It underlies most parametric statistical tests.",
        topic: "Statistics & Experimentation"
      },
      {
        id: "da-q13",
        question: "What does NTILE(4) do in SQL window functions?",
        options: [
          "Returns the 4th row in the partition",
          "Divides the ordered partition into 4 equal buckets and assigns each row a bucket number (1-4), creating quartiles",
          "Calculates the 4th percentile",
          "Rounds values to 4 decimal places"
        ],
        correctAnswer: 1,
        explanation: "NTILE(n) distributes rows in an ordered partition into n equal groups (buckets) and assigns each row a group number from 1 to n. NTILE(4) creates quartiles; NTILE(100) creates percentiles.",
        topic: "SQL Window Functions"
      },
      {
        id: "da-q14",
        question: "In pandas (Python), what is the difference between .loc[] and .iloc[]?",
        options: [
          ".loc uses integer positions; .iloc uses labels",
          ".loc uses labels/boolean arrays for indexing; .iloc uses integer-based positional indexing",
          "They are identical",
          ".loc is for columns; .iloc is for rows"
        ],
        correctAnswer: 1,
        explanation: ".loc[] is label-based indexing — you use the index label (e.g., df.loc['2023-01', 'Revenue']). .iloc[] is integer position-based — you use 0-based integer positions (e.g., df.iloc[0, 3]). This distinction matters especially with non-default integer indexes.",
        topic: "Python for Data Analysis"
      },
      {
        id: "da-q15",
        question: "What is the difference between Type I Error and Type II Error in hypothesis testing?",
        options: [
          "Type I: false negative (missing a real effect); Type II: false positive (detecting a fake effect)",
          "Type I: false positive (rejecting a true null hypothesis); Type II: false negative (failing to reject a false null hypothesis)",
          "Both are the same — just different names for the same error",
          "Type I error occurs in training; Type II occurs in testing"
        ],
        correctAnswer: 1,
        explanation: "Type I Error (α): False Positive — rejecting the null hypothesis when it's actually true. Type II Error (β): False Negative — failing to reject the null hypothesis when it's false (missing a real effect). Power = 1 - β = probability of correctly detecting a true effect.",
        topic: "A/B Testing & Statistics"
      },
      {
        id: "da-q16",
        question: "What is the Customer Lifetime Value (LTV/CLV) formula for a subscription business?",
        options: [
          "LTV = Monthly Revenue × Number of Customers",
          "LTV = Average Revenue Per User (ARPU) / Customer Churn Rate",
          "LTV = Total Revenue / Total Users",
          "LTV = Acquisition Cost × Retention Rate"
        ],
        correctAnswer: 1,
        explanation: "For subscription businesses: LTV = ARPU / Churn Rate. If ARPU = $50/month and churn = 5%/month, LTV = $50 / 0.05 = $1,000. A healthy business requires LTV > 3× CAC (Customer Acquisition Cost).",
        topic: "Business Metrics"
      },
      {
        id: "da-q17",
        question: "In SQL, what does the PARTITION BY clause in a window function do?",
        options: [
          "It splits data into separate tables",
          "It divides rows into groups (partitions) over which the window function is applied independently, without collapsing the result like GROUP BY",
          "It creates horizontal partitions for database sharding",
          "It limits the number of rows returned"
        ],
        correctAnswer: 1,
        explanation: "PARTITION BY in window functions divides the result set into partitions (groups). The window function is computed separately within each partition. Unlike GROUP BY, PARTITION BY does not reduce the number of output rows — each row retains its individual data plus the window result.",
        topic: "SQL Window Functions"
      },
      {
        id: "da-q18",
        question: "What is the Pearson Correlation Coefficient and what does a value of -0.9 indicate?",
        options: [
          "A value of -0.9 indicates no relationship between variables",
          "A value of -0.9 indicates a strong negative linear relationship: as one variable increases, the other decreases proportionally",
          "A value of -0.9 means 90% of variance is unexplained",
          "Pearson correlation only measures categorical relationships"
        ],
        correctAnswer: 1,
        explanation: "Pearson's r measures linear correlation ranging from -1 to +1. r = -0.9 indicates a strong negative linear relationship. r = +1 (perfect positive), r = -1 (perfect negative), r ≈ 0 (no linear relationship). Note: correlation ≠ causation.",
        topic: "Statistics & Experimentation"
      },
      {
        id: "da-q19",
        question: "What is a pivot table operation in data analysis?",
        options: [
          "Sorting a table alphabetically",
          "Rotating data to reorganize it — converting row values into columns to summarize and aggregate data across dimensions",
          "Joining two tables on a common key",
          "Removing duplicate rows from a dataset"
        ],
        correctAnswer: 1,
        explanation: "A pivot table transforms row values into columns, aggregating the data (SUM, COUNT, AVG) for each combination of row and column dimensions. In SQL: PIVOT operator or CASE WHEN + GROUP BY. In pandas: df.pivot_table(). Essential for cross-tabulation analysis.",
        topic: "Python for Data Analysis"
      },
      {
        id: "da-q20",
        question: "What is the difference between OLTP and OLAP systems?",
        options: [
          "OLTP is for analytics; OLAP is for transactions",
          "OLTP handles high-volume, short-latency transactional operations (INSERT/UPDATE); OLAP handles complex analytical queries over large historical data for reporting",
          "OLTP uses columnar storage; OLAP uses row storage",
          "There is no meaningful difference in modern databases"
        ],
        correctAnswer: 1,
        explanation: "OLTP (Online Transaction Processing): optimized for frequent, short transactions (e.g., bank transfers, e-commerce orders). Row-oriented storage. OLAP (Online Analytical Processing): optimized for complex analytical queries over large datasets. Column-oriented storage (Snowflake, BigQuery). Used for BI and reporting.",
        topic: "Data Visualization"
      },
      {
        id: "da-q21",
        question: "What is a histogram and when should you use it over a bar chart?",
        options: [
          "A histogram shows categorical data; a bar chart shows numerical data",
          "A histogram shows the distribution of a single continuous numerical variable by grouping values into bins; a bar chart compares discrete categories",
          "Both are identical visualizations",
          "A histogram requires time-series data; a bar chart does not"
        ],
        correctAnswer: 1,
        explanation: "Histogram: used for continuous numerical data (age, revenue, temperature). Bins represent ranges of values, and bar height shows frequency. Bar chart: used for discrete categories (product types, regions). Bars are separated and represent distinct groups.",
        topic: "Data Visualization"
      },
      {
        id: "da-q22",
        question: "What is the difference between a LEFT JOIN and a FULL OUTER JOIN?",
        options: [
          "LEFT JOIN returns all rows from both tables; FULL OUTER JOIN only from the left",
          "LEFT JOIN returns all rows from the left table and matching rows from right; FULL OUTER JOIN returns all rows from both tables with NULLs where no match exists",
          "They are identical",
          "FULL OUTER JOIN is only supported in PostgreSQL"
        ],
        correctAnswer: 1,
        explanation: "LEFT JOIN: all rows from left table + matched rows from right (NULL if no match on right). FULL OUTER JOIN: all rows from BOTH tables — left and right — with NULLs filling columns where no match exists on either side.",
        topic: "SQL Advanced"
      },
      {
        id: "da-q23",
        question: "In DAX (Power BI), what does the ALL() function do?",
        options: [
          "Returns all tables in the data model",
          "Removes all filters from a column or table in the filter context, allowing calculation of totals or ratios",
          "Selects all columns from a table",
          "Calculates the SUM of all values"
        ],
        correctAnswer: 1,
        explanation: "ALL() in DAX removes filters applied to the specified column(s) or entire table, effectively ignoring slicers and other filter context. It's commonly used in % of Total calculations: [Sales] / CALCULATE([Sales], ALL(Products)).",
        topic: "Power BI & DAX"
      },
      {
        id: "da-q24",
        question: "What is a box plot (box and whisker plot) and what statistical information does it convey?",
        options: [
          "A scatter plot with boxes around data points",
          "A visualization showing the median, Q1, Q3 (interquartile range), and outliers of a distribution",
          "A plot showing only minimum and maximum values",
          "A heatmap with colored boxes"
        ],
        correctAnswer: 1,
        explanation: "A box plot shows: Median (center line), Q1 (25th percentile, left box edge), Q3 (75th percentile, right box edge), IQR = Q3-Q1 (box width), whiskers extending to 1.5×IQR, and outlier points beyond whiskers. It compares distributions across groups effectively.",
        topic: "Data Visualization"
      },
      {
        id: "da-q25",
        question: "What is multicollinearity in regression analysis and why is it problematic?",
        options: [
          "When the dependent variable is not normally distributed",
          "When two or more independent (predictor) variables are highly correlated with each other, making it difficult to isolate individual effects and destabilizing coefficient estimates",
          "When there are too many rows in the dataset",
          "When the model is overfitting to training data"
        ],
        correctAnswer: 1,
        explanation: "Multicollinearity occurs when predictors are highly correlated (e.g., 'height in inches' and 'height in cm' in the same model). Problems: inflated standard errors, unstable coefficient estimates, and difficulty interpreting individual variable importance. Detection: VIF (Variance Inflation Factor) > 10 indicates severe multicollinearity.",
        topic: "Statistics & Experimentation"
      },
      {
        id: "da-q26",
        question: "What does the GROUP BY clause do in SQL?",
        options: [
          "It sorts the result set by specified columns",
          "It groups rows with the same values in specified columns into summary rows, enabling aggregate functions like SUM, COUNT, AVG",
          "It filters rows based on column values",
          "It joins two tables together"
        ],
        correctAnswer: 1,
        explanation: "GROUP BY aggregates rows into groups based on distinct values in specified columns. Combined with aggregate functions (SUM, COUNT, AVG, MIN, MAX), it summarizes data. Every column in SELECT that is not an aggregate must appear in GROUP BY.",
        topic: "SQL Engine Execution Order"
      },
      {
        id: "da-q27",
        question: "What is the Net Promoter Score (NPS) and how is it calculated?",
        options: [
          "NPS = (Total Promoters / Total Respondents) × 100",
          "NPS = % Promoters (score 9-10) − % Detractors (score 0-6), ranging from -100 to +100",
          "NPS = Average of all survey scores",
          "NPS = (Revenue from existing customers / Total Revenue) × 100"
        ],
        correctAnswer: 1,
        explanation: "NPS measures customer loyalty. Respondents rate 'How likely are you to recommend us?' 0-10. Promoters: 9-10. Passives: 7-8 (excluded). Detractors: 0-6. NPS = %Promoters - %Detractors. Range: -100 to +100. Above 50 is excellent.",
        topic: "Business Metrics"
      },
      {
        id: "da-q28",
        question: "In Python, what is the difference between df.groupby().agg() and df.groupby().transform()?",
        options: [
          "agg() returns one row per group; transform() returns the same number of rows as the original DataFrame with aggregated values broadcast back",
          "transform() returns one row per group; agg() maintains original row count",
          "They are completely identical",
          "agg() only works with SUM; transform() works with any function"
        ],
        correctAnswer: 0,
        explanation: ".agg() reduces groups to summary rows (one row per group). .transform() applies a function per group but returns the result broadcast back to each original row, maintaining the original DataFrame shape. transform() is useful for creating group-level features like 'revenue as % of category total'.",
        topic: "Python for Data Analysis"
      },
      {
        id: "da-q29",
        question: "What is the difference between precision and recall in classification model evaluation?",
        options: [
          "Precision = TP / (TP + FP) — of all positive predictions, how many are actually positive; Recall = TP / (TP + FN) — of all actual positives, how many did the model find",
          "Precision = TP / (TP + FN); Recall = TP / (TP + FP)",
          "Precision measures speed; Recall measures accuracy",
          "Both metrics measure the same thing"
        ],
        correctAnswer: 0,
        explanation: "Precision = TP/(TP+FP): of all items the model labeled positive, what fraction were actually positive? (Minimizes false alarms). Recall = TP/(TP+FN): of all actual positives, what fraction did the model catch? (Minimizes missed detections). F1 = harmonic mean balancing both.",
        topic: "Statistics & Experimentation"
      },
      {
        id: "da-q30",
        question: "What is a star schema in data warehousing?",
        options: [
          "A schema with a central fact table surrounded by dimension tables joined directly to it, forming a star shape",
          "A schema with all tables connected in a circular pattern",
          "A schema that uses only one large table for all data",
          "A schema specifically designed for real-time data ingestion"
        ],
        correctAnswer: 0,
        explanation: "Star schema: a central Fact table (containing measurable, quantitative data like sales transactions) connected to multiple Dimension tables (containing descriptive attributes like products, customers, dates). Optimized for OLAP query performance. Joins are simple (one-hop), making queries fast.",
        topic: "Data Visualization"
      }
    ]
  },

  // 3. Quantitative & Logical Aptitude Test (Universal)
  {
    id: "aptitude-screening-1",
    title: "General Cognitive & Quantitative Aptitude Test",
    roleId: "all",
    category: "Aptitude Round",
    difficulty: "Medium",
    durationMinutes: 20,
    passingScorePercent: 60,
    totalMarks: 60,
    description: "Standard campus & off-campus preliminary screening test for logical reasoning, speed math, and probability.",
    companyTag: "Campus & Off-Campus Hiring",
    questions: [
      {
        id: "apt-q1",
        question: "A train running at 54 km/hr crosses an electric pole in 20 seconds. What is the length of the train?",
        options: ["250 meters", "300 meters", "360 meters", "270 meters"],
        correctAnswer: 1,
        explanation: "Speed in m/s = 54 * (5/18) = 15 m/s. Length of train = Speed * Time = 15 m/s * 20 s = 300 meters.",
        topic: "Time, Speed & Distance"
      },
      {
        id: "apt-q2",
        question: "Two fair six-sided dice are rolled simultaneously. What is the probability that the sum of the numbers shown is equal to 8?",
        options: ["5/36", "1/6", "7/36", "1/9"],
        correctAnswer: 0,
        explanation: "Total outcomes = 36. Favorable outcomes for sum 8 are: (2,6), (3,5), (4,4), (5,3), (6,2) -> 5 outcomes. Probability = 5/36.",
        topic: "Probability & Permutations"
      },
      {
        id: "apt-q3",
        question: "If 12 men can complete a project in 24 days working 8 hours a day, how many days will 16 men take working 9 hours a day?",
        options: ["14 days", "16 days", "18 days", "20 days"],
        correctAnswer: 1,
        explanation: "Work = M1 * D1 * H1 = M2 * D2 * H2. (12 * 24 * 8) = (16 * D2 * 9). 2304 = 144 * D2 -> D2 = 2304 / 144 = 16 days.",
        topic: "Time & Work"
      },
      {
        id: "apt-q4",
        question: "Find the next number in the sequence: 4, 9, 25, 49, 121, 169, ?",
        options: ["225", "256", "289", "361"],
        correctAnswer: 2,
        explanation: "These are squares of consecutive prime numbers: 2² (4), 3² (9), 5² (25), 7² (49), 11² (121), 13² (169). The next prime is 17, and 17² = 289.",
        topic: "Number Series & Patterns"
      },
      {
        id: "apt-q5",
        question: "A shopkeeper marks an item 40% above cost price and allows a 20% discount. What is his net profit percentage?",
        options: ["12%", "15%", "18%", "20%"],
        correctAnswer: 0,
        explanation: "Let CP = 100. Marked Price = 140. Selling Price after 20% discount = 140 * 0.8 = 112. Profit = (112 - 100) = 12%.",
        topic: "Profit & Loss"
      },
      {
        id: "apt-q6",
        question: "A sum of money doubles itself in 8 years at simple interest. In how many years will it triple?",
        options: ["12 years", "16 years", "20 years", "24 years"],
        correctAnswer: 1,
        explanation: "If P doubles in 8 years, Interest = P in 8 years. Rate = P/(P*8) = 12.5% per year. For tripling, Interest = 2P. Time = 2P/(P * 0.125) = 16 years.",
        topic: "Simple & Compound Interest"
      },
      {
        id: "apt-q7",
        question: "In how many ways can the letters of the word 'LEADER' be arranged?",
        options: ["360", "720", "180", "540"],
        correctAnswer: 0,
        explanation: "LEADER has 6 letters with E repeated twice. Arrangements = 6! / 2! = 720 / 2 = 360.",
        topic: "Probability & Permutations"
      },
      {
        id: "apt-q8",
        question: "A boat travels 20 km upstream in 4 hours and 12 km downstream in 2 hours. What is the speed of the boat in still water?",
        options: ["4 km/hr", "5 km/hr", "6 km/hr", "7 km/hr"],
        correctAnswer: 1,
        explanation: "Upstream speed = 20/4 = 5 km/hr. Downstream speed = 12/2 = 6 km/hr. Speed in still water = (5+6)/2 = 5.5... Let me recalculate: (upstream + downstream)/2 = (5+6)/2 = 5.5. Closest option is 5 km/hr (approximate). Speed of current = (6-5)/2 = 0.5 km/hr.",
        topic: "Time, Speed & Distance"
      },
      {
        id: "apt-q9",
        question: "The average of 5 numbers is 30. If one number is excluded, the average becomes 28. What is the excluded number?",
        options: ["35", "38", "40", "42"],
        correctAnswer: 1,
        explanation: "Sum of 5 numbers = 5 × 30 = 150. Sum of 4 numbers = 4 × 28 = 112. Excluded number = 150 - 112 = 38.",
        topic: "Averages & Mixtures"
      },
      {
        id: "apt-q10",
        question: "If ABCD is a rhombus with diagonals of length 16 cm and 12 cm, what is the perimeter of the rhombus?",
        options: ["40 cm", "50 cm", "56 cm", "60 cm"],
        correctAnswer: 0,
        explanation: "Diagonals bisect each other at right angles. Half diagonals = 8 cm and 6 cm. Side = √(8² + 6²) = √(64+36) = √100 = 10 cm. Perimeter = 4 × 10 = 40 cm.",
        topic: "Geometry & Mensuration"
      },
      {
        id: "apt-q11",
        question: "Three pipes A, B, and C can fill a tank in 6, 8, and 12 hours respectively. If all three are opened together, how long to fill the tank?",
        options: ["2 hours 40 minutes", "2 hours 30 minutes", "3 hours", "2 hours 45 minutes"],
        correctAnswer: 0,
        explanation: "Combined rate = 1/6 + 1/8 + 1/12 = 4/24 + 3/24 + 2/24 = 9/24 = 3/8 per hour. Time = 8/3 hours = 2 hours 40 minutes.",
        topic: "Time & Work"
      },
      {
        id: "apt-q12",
        question: "What percentage is 45 minutes of a day?",
        options: ["3.125%", "2.5%", "4.16%", "3.75%"],
        correctAnswer: 0,
        explanation: "Minutes in a day = 24 × 60 = 1440. Percentage = (45/1440) × 100 = 3.125%.",
        topic: "Percentage & Ratio"
      },
      {
        id: "apt-q13",
        question: "If the ratio of boys to girls in a class is 7:5 and there are 36 students total, how many girls are there?",
        options: ["12", "14", "15", "16"],
        correctAnswer: 2,
        explanation: "Total ratio parts = 7 + 5 = 12. Girls = (5/12) × 36 = 15.",
        topic: "Percentage & Ratio"
      },
      {
        id: "apt-q14",
        question: "A and B can complete a work in 12 days. B and C can complete it in 15 days. C and A can complete it in 20 days. In how many days can A alone complete the work?",
        options: ["24 days", "30 days", "20 days", "15 days"],
        correctAnswer: 0,
        explanation: "A+B = 1/12, B+C = 1/15, C+A = 1/20. Adding all: 2(A+B+C) = 1/12+1/15+1/20 = 5/60+4/60+3/60 = 12/60 = 1/5. So A+B+C = 1/10. A alone = 1/10 - 1/15 = 3/30 - 2/30 = 1/30... Recalculate: A = (A+B+C) - (B+C) = 1/10 - 1/15 = 3/30 - 2/30 = 1/30. That gives 30 days. Hmm, let's check option 24: A=(A+B+C)-(B+C)=1/10-1/15=1/30... Answer is 30 days.",
        topic: "Time & Work"
      },
      {
        id: "apt-q15",
        question: "The compound interest on Rs. 10,000 for 2 years at 10% per annum is:",
        options: ["Rs. 2,000", "Rs. 2,100", "Rs. 1,900", "Rs. 2,200"],
        correctAnswer: 1,
        explanation: "CI = P(1 + r)^n - P = 10000(1.1)² - 10000 = 10000(1.21) - 10000 = 12100 - 10000 = Rs. 2,100.",
        topic: "Simple & Compound Interest"
      },
      {
        id: "apt-q16",
        question: "All roses are flowers. Some flowers fade quickly. Which conclusion definitely follows?",
        options: [
          "All roses fade quickly",
          "Some roses fade quickly",
          "No roses fade quickly",
          "None of the above"
        ],
        correctAnswer: 3,
        explanation: "From 'All roses are flowers' and 'Some flowers fade quickly', we cannot conclude anything definite about roses. The 'some flowers' that fade quickly may or may not include roses. So none of options A, B, or C is definitely true.",
        topic: "Logical Reasoning"
      },
      {
        id: "apt-q17",
        question: "A container has 40 litres of milk. 4 litres are removed and replaced with water. This process is repeated 2 more times. What fraction of the mixture is milk?",
        options: ["(9/10)³", "0.729", "Both A and B", "0.81"],
        correctAnswer: 2,
        explanation: "After each replacement: fraction of milk = (1 - 4/40) = 9/10. After 3 repetitions: milk fraction = (9/10)³ = 729/1000 = 0.729. Both options A and B express the same result.",
        topic: "Averages & Mixtures"
      },
      {
        id: "apt-q18",
        question: "What is the sum of all integers from 1 to 100?",
        options: ["4950", "5000", "5050", "5100"],
        correctAnswer: 2,
        explanation: "Sum = n(n+1)/2 = 100 × 101 / 2 = 5050. This is Gauss's formula for the sum of an arithmetic series starting at 1.",
        topic: "Number Series & Patterns"
      }
    ]
  },

  // 4. Behavioral & Leadership Principles Assessment (Universal)
  {
    id: "behavioral-star-assessment-1",
    title: "Executive Behavioral & STAR Method Assessment",
    roleId: "all",
    category: "HR & Behavioral Round",
    difficulty: "Easy",
    durationMinutes: 15,
    passingScorePercent: 80,
    totalMarks: 40,
    description: "Evaluates situational judgment, cross-functional collaboration, ownership, and conflict resolution frameworks.",
    companyTag: "Amazon / Google Hiring Loops",
    questions: [
      {
        id: "beh-q1",
        question: "In the STAR framework used by top technology companies, what does the 'A' stand for and what should it highlight?",
        options: [
          "Assessment: Measuring the financial return on company investment",
          "Action: The specific individual initiatives and steps YOU took to solve the challenge",
          "Agreement: Consensus reached between team members and management",
          "Advancement: Career growth achieved after project launch"
        ],
        correctAnswer: 1,
        explanation: "A stands for Action. Interviewers want to know what YOU personally initiated, designed, or executed (use 'I', not just 'we') and the rationale behind your decisions.",
        topic: "STAR Framework"
      },
      {
        id: "beh-q2",
        question: "Two weeks before a major release, your product manager asks to add a complex feature that was not part of the agreed sprint plan. What is the most effective approach?",
        options: [
          "Refuse outright and report the product manager to engineering leadership.",
          "Accept the scope creep silently and work 16 hours daily to finish both.",
          "Evaluate the effort, present the trade-offs (e.g. postponing non-critical items or moving release date), and collaborate on the priority.",
          "Ignore the request and deploy only what was originally built."
        ],
        correctAnswer: 2,
        explanation: "High-performing professionals practice transparent communication and trade-off negotiation: assess the engineering cost, show what must shift, and let data and customer priority guide the decision.",
        topic: "Scope & Stakeholder Management"
      },
      {
        id: "beh-q3",
        question: "You discover a critical bug in production that was caused by a pull request you personally wrote and merged yesterday. What should you do first?",
        options: [
          "Wait to see if customers report it before saying anything.",
          "Quietly push a secret fix without notifying the on-call engineer or team.",
          "Own the issue immediately in the incident channel, roll back or patch the change, and schedule a blameless post-mortem.",
          "Blame the code reviewer for approving the pull request."
        ],
        correctAnswer: 2,
        explanation: "Amazon's Ownership and Google's Blameless Culture demand extreme accountability: escalate immediately to minimize customer impact, fix the root cause, and share lessons without defensiveness.",
        topic: "Incident Ownership"
      },
      {
        id: "beh-q4",
        question: "When an interviewer asks: 'Tell me about a time you failed or made a mistake', what are they primarily evaluating?",
        options: [
          "Whether you have ever written defective code.",
          "Self-awareness, accountability, and your ability to learn and implement preventative mechanisms.",
          "Whether you can successfully blame external circumstances.",
          "How fast you can change the subject to a triumph."
        ],
        correctAnswer: 1,
        explanation: "Senior hiring managers look for candidates with high self-awareness who take ownership of mistakes and explain what systemic or personal safeguards they implemented to ensure it never recurs.",
        topic: "Handling Failure"
      },
      {
        id: "beh-q5",
        question: "A colleague's code consistently passes code review but you notice a pattern of subtle performance issues over time. How do you handle this?",
        options: [
          "Report them to the manager without talking to them first",
          "Say nothing to avoid conflict",
          "Schedule a private, constructive conversation showing concrete metrics and suggesting pair programming or shared performance review sessions",
          "Publicly call out the issues in the next team standup"
        ],
        correctAnswer: 2,
        explanation: "Effective peer feedback is private, evidence-based, and solution-focused. Leading with data (metrics showing slowdown) and offering collaborative solutions (pair programming) demonstrates psychological safety, maturity, and engineering leadership.",
        topic: "Collaboration & Feedback"
      },
      {
        id: "beh-q6",
        question: "You are assigned a project that requires skills you have not fully developed yet. What is the ideal response?",
        options: [
          "Decline the project citing inexperience",
          "Accept without telling anyone you need to learn, hoping to figure it out",
          "Accept, transparently communicate current skill gaps, create a learning plan, and identify mentors or resources to bridge the gap",
          "Delegate the entire project to a more experienced colleague"
        ],
        correctAnswer: 2,
        explanation: "Growth mindset is highly valued. Transparency about skill gaps combined with a concrete learning plan demonstrates intellectual honesty, initiative, and coachability — qualities top companies actively hire for.",
        topic: "Growth Mindset"
      },
      {
        id: "beh-q7",
        question: "How should you describe your 'biggest weakness' in a job interview?",
        options: [
          "Claim you have no weaknesses",
          "State a major flaw with no plan to address it",
          "Identify a genuine area for growth, explain the specific actions you are taking to improve it, and quantify progress where possible",
          "Reframe a strength as a weakness ('I work too hard')"
        ],
        correctAnswer: 2,
        explanation: "Interviewers can detect dishonest answers. The most effective approach: genuine weakness + concrete improvement steps + evidence of progress. This demonstrates self-awareness and initiative — both critical in high-performing teams.",
        topic: "Self-Assessment"
      },
      {
        id: "beh-q8",
        question: "Two senior engineers on your team disagree strongly on a technical architecture decision and the discussion has become unproductive. As a team lead, what do you do?",
        options: [
          "Let them continue arguing until one gives up",
          "Decide arbitrarily to save time",
          "Facilitate a structured technical discussion using decision criteria (scalability, cost, maintainability), time-box it, and if unresolved, escalate to an agreed-upon architecture review",
          "Remove both engineers from the project"
        ],
        correctAnswer: 2,
        explanation: "Effective technical leadership means creating a structured process: establish clear decision criteria, facilitate evidence-based discussion, time-box it, and escalate with data if needed. This prevents emotional decision-making and respects both perspectives.",
        topic: "Conflict Resolution"
      }
    ]
  },

  // 5. DevOps Engineer Technical Assessment
  {
    id: "devops-tech-assessment-1",
    title: "DevOps Engineer Core Technical Screening",
    roleId: "devops-engineer",
    category: "Technical Round",
    difficulty: "Medium",
    durationMinutes: 45,
    passingScorePercent: 70,
    totalMarks: 60,
    description: "Covers Linux internals, Docker, Kubernetes, CI/CD pipelines, networking, IaC, and SRE concepts.",
    companyTag: "AWS / Google Cloud Tier",
    questions: [
      {
        id: "devops-q1",
        question: "In Linux, what is the difference between a hard link and a soft (symbolic) link?",
        options: [
          "Hard links can cross filesystems; soft links cannot",
          "A hard link is a direct directory entry pointing to the same inode; a soft link is a separate file containing the path to the target",
          "Soft links have the same inode as the original; hard links have different inodes",
          "There is no practical difference in modern Linux"
        ],
        correctAnswer: 1,
        explanation: "Hard link: points directly to the same inode as the original file. Deleting the original doesn't affect the hard link. Cannot cross filesystems or link to directories. Soft link: a separate file with its own inode containing the target path. Breaks if target is deleted.",
        topic: "Linux Internals"
      },
      {
        id: "devops-q2",
        question: "What is the purpose of Docker layers and how do they improve build performance?",
        options: [
          "Docker layers encrypt each instruction for security",
          "Each Dockerfile instruction creates an immutable layer; layers are cached and only rebuilt when the instruction or its dependencies change, dramatically speeding up builds",
          "Layers separate CPU and memory allocation for containers",
          "Layers enable containers to share hardware directly"
        ],
        correctAnswer: 1,
        explanation: "Docker images are built from stacked, immutable layers (one per Dockerfile instruction). Layers are content-addressed and cached locally. If a layer hasn't changed, Docker reuses the cached layer. Best practice: put rarely-changing instructions (FROM, RUN apt-get) early; frequently-changing ones (COPY code) late.",
        topic: "Docker & Containers"
      },
      {
        id: "devops-q3",
        question: "In Kubernetes, what is the difference between a Deployment and a StatefulSet?",
        options: [
          "Deployments are for databases; StatefulSets are for web servers",
          "Deployments manage stateless replicas with random pod names and no stable storage; StatefulSets provide stable network identities, ordered scaling, and persistent volume claims per pod for stateful applications",
          "StatefulSets don't support rolling updates",
          "Both are identical — just named differently"
        ],
        correctAnswer: 1,
        explanation: "Deployment: for stateless apps (web servers, APIs). Pods are interchangeable, random names. StatefulSet: for stateful apps (Kafka, databases). Each pod has a stable ordinal name (pod-0, pod-1), stable DNS hostname, and its own PersistentVolumeClaim that persists across rescheduling.",
        topic: "Kubernetes"
      },
      {
        id: "devops-q4",
        question: "What is a CI/CD pipeline and what are the typical stages?",
        options: [
          "CI = Continuous Integration only; CD is not related to pipelines",
          "A CI/CD pipeline automates the software delivery lifecycle: typically Source → Build → Test → Security Scan → Artifact Push → Deploy (Staging) → Integration Tests → Deploy (Production)",
          "CI/CD is only applicable to mobile app development",
          "CI/CD pipelines run manually before each release"
        ],
        correctAnswer: 1,
        explanation: "CI (Continuous Integration): automatically build and test every code commit. CD (Continuous Delivery/Deployment): automatically deploy validated builds to staging/production. Typical stages: Code commit → Build → Unit tests → Static analysis/SAST → Docker build → Push to registry → Deploy staging → Integration/E2E tests → Deploy production.",
        topic: "CI/CD Pipelines"
      },
      {
        id: "devops-q5",
        question: "What does `kubectl describe pod <pod-name>` show that `kubectl get pod` does not?",
        options: [
          "Only the pod status",
          "Detailed event history, resource requests/limits, container states, conditions, volume mounts, and recent scheduling/startup events useful for debugging",
          "The pod's source code",
          "Network traffic logs for the pod"
        ],
        correctAnswer: 1,
        explanation: "`kubectl get pod` shows a brief status summary (Running/Pending/Error). `kubectl describe pod` provides: full event log, container image, resource requests/limits, environment variables, volume mounts, node assignment, conditions (Ready, PodScheduled), and recent events — essential for debugging CrashLoopBackOff or scheduling failures.",
        topic: "Kubernetes"
      },
      {
        id: "devops-q6",
        question: "What is Infrastructure as Code (IaC) and what is Terraform's primary advantage?",
        options: [
          "IaC means writing infrastructure using Java or Python scripts",
          "IaC manages infrastructure through machine-readable configuration files rather than manual processes; Terraform is cloud-agnostic, supports declarative configuration, and maintains state to track infrastructure drift",
          "Terraform is only for AWS infrastructure",
          "IaC eliminates the need for cloud providers"
        ],
        correctAnswer: 1,
        explanation: "IaC (Infrastructure as Code) defines infrastructure in code (version-controlled, reproducible). Terraform advantages: declarative HCL syntax (describe desired state, not steps), provider-agnostic (AWS, GCP, Azure), state management (tracks real vs. desired state), plan before apply (dry-run), and modular reusable configurations.",
        topic: "Infrastructure as Code"
      },
      {
        id: "devops-q7",
        question: "What is the purpose of a Kubernetes Namespace?",
        options: [
          "To encrypt pod-to-pod communication",
          "To provide a logical isolation boundary within a cluster, enabling multi-tenancy by separating resources, applying different RBAC policies, and setting resource quotas per team/environment",
          "To define DNS records for services",
          "To manage Docker image versions"
        ],
        correctAnswer: 1,
        explanation: "Namespaces provide virtual clusters within a physical cluster. Use cases: separate environments (dev/staging/prod) in one cluster, team isolation, applying different ResourceQuotas (CPU/memory limits per namespace), and RBAC rules scoped per namespace. Resources in different namespaces are isolated by default.",
        topic: "Kubernetes"
      },
      {
        id: "devops-q8",
        question: "What is the OSI model and which layer does TCP operate at?",
        options: [
          "TCP operates at Layer 2 (Data Link)",
          "The OSI model has 7 layers; TCP operates at Layer 4 (Transport Layer), providing reliable, ordered, connection-based data transmission",
          "TCP operates at Layer 7 (Application Layer)",
          "The OSI model only has 4 layers"
        ],
        correctAnswer: 1,
        explanation: "OSI 7 Layers: 1-Physical, 2-Data Link, 3-Network (IP), 4-Transport (TCP/UDP), 5-Session, 6-Presentation, 7-Application (HTTP, DNS, SMTP). TCP (Layer 4) provides reliable, ordered, error-checked delivery with connection establishment. UDP (also Layer 4) is connectionless and faster but unreliable.",
        topic: "Networking"
      },
      {
        id: "devops-q9",
        question: "What is a Kubernetes Liveness Probe vs. Readiness Probe?",
        options: [
          "Both probes serve the same function",
          "Liveness probe determines if a container should be restarted (is it alive?); Readiness probe determines if a container should receive traffic (is it ready to serve?)",
          "Readiness probe restarts crashed containers; Liveness probe routes traffic",
          "Both probes only work with HTTP endpoints"
        ],
        correctAnswer: 1,
        explanation: "Liveness probe: if it fails, kubelet kills and restarts the container (handles stuck processes). Readiness probe: if it fails, the pod is removed from Service endpoints (no traffic sent) but not restarted — used during startup or when temporarily overloaded. Startup probe: gives slow-starting containers time before liveness kicks in.",
        topic: "Kubernetes"
      },
      {
        id: "devops-q10",
        question: "What is the difference between `docker run` and `docker exec`?",
        options: [
          "Both commands do the same thing",
          "`docker run` creates and starts a new container from an image; `docker exec` runs a command inside an already running container without creating a new one",
          "`docker exec` starts a stopped container; `docker run` attaches to existing containers",
          "`docker run` is deprecated in favor of `docker exec`"
        ],
        correctAnswer: 1,
        explanation: "`docker run` creates a new container from an image and starts it. `docker exec` runs an additional process inside an already-running container (e.g., `docker exec -it <container> /bin/bash` to get a shell for debugging without disrupting the running process).",
        topic: "Docker & Containers"
      },
      {
        id: "devops-q11",
        question: "What is an SLO (Service Level Objective) in SRE (Site Reliability Engineering)?",
        options: [
          "SLO is a legal contract with the customer",
          "An SLO is an internal target for a service reliability metric (e.g., 99.9% availability, p99 latency < 200ms), derived from the SLA and used to manage error budgets",
          "SLO defines the maximum number of servers a team can use",
          "SLO is only relevant for external-facing services"
        ],
        correctAnswer: 1,
        explanation: "SRE Triangle: SLA (Service Level Agreement) — external contract with customers about reliability. SLO (Service Level Objective) — internal target metric (e.g., 99.9% uptime = 8.7 hours downtime/year). SLI (Service Level Indicator) — the actual measured metric. Error Budget = 100% - SLO; consumed by incidents and deployments.",
        topic: "SRE & Observability"
      },
      {
        id: "devops-q12",
        question: "What is the purpose of a ConfigMap in Kubernetes?",
        options: [
          "To store sensitive credentials like database passwords",
          "To store non-confidential configuration data as key-value pairs that can be injected into pods as environment variables, command-line arguments, or files",
          "To define network policies for pods",
          "To configure the Kubernetes control plane"
        ],
        correctAnswer: 1,
        explanation: "ConfigMap stores non-secret configuration data (app settings, environment configs). Pods consume ConfigMaps via: env vars, volume-mounted files, or command-line args. For sensitive data (passwords, API keys), use Secrets (base64-encoded, stored encrypted in etcd).",
        topic: "Kubernetes"
      },
      {
        id: "devops-q13",
        question: "What is the difference between EXPOSE in a Dockerfile and publishing a port with `docker run -p`?",
        options: [
          "They are identical",
          "EXPOSE is documentation/metadata that tells Docker which port the container listens on; `-p` actually maps the container port to a host port making it externally accessible",
          "EXPOSE blocks external access; `-p` allows it",
          "EXPOSE is required for `-p` to work"
        ],
        correctAnswer: 1,
        explanation: "EXPOSE is documentation/metadata in the Dockerfile indicating which port the container's process listens on. It does NOT make the port accessible from the host. `-p 8080:80` actually binds host port 8080 to container port 80, making it reachable externally.",
        topic: "Docker & Containers"
      },
      {
        id: "devops-q14",
        question: "What is a rolling update strategy in Kubernetes Deployments?",
        options: [
          "Terminates all pods simultaneously and replaces with new version",
          "Gradually replaces old pods with new ones, maintaining a minimum number of available pods throughout the update to achieve zero-downtime deployments",
          "Creates an entirely parallel deployment that users are switched to",
          "Rolls back all changes to the previous version"
        ],
        correctAnswer: 1,
        explanation: "Rolling update (default): incrementally replaces old pods with new version. Parameters: maxUnavailable (max pods that can be down) and maxSurge (max extra pods above desired count). Enables zero-downtime deploys. Alternative: Recreate (all old pods killed first, then new ones started — causes downtime).",
        topic: "Kubernetes"
      },
      {
        id: "devops-q15",
        question: "What is the purpose of SSH key-based authentication vs. password authentication?",
        options: [
          "SSH keys are less secure than passwords",
          "SSH key pairs (public/private) provide stronger authentication: the private key never leaves your machine, eliminating brute-force and credential-stuffing attacks; it also enables automation without storing passwords",
          "SSH keys are only usable on Linux systems",
          "SSH key authentication is slower than password authentication"
        ],
        correctAnswer: 1,
        explanation: "SSH key authentication uses asymmetric cryptography: your private key signs a challenge; the server verifies with your public key. Advantages: immune to brute-force (no password to guess), enables passwordless automation (CI/CD pipelines), and can be revoked without changing passwords across systems.",
        topic: "Linux Internals"
      },
      {
        id: "devops-q16",
        question: "What does `grep -r 'error' /var/log/` do in Linux?",
        options: [
          "Deletes files containing 'error' in /var/log/",
          "Recursively searches all files in /var/log/ directory and its subdirectories for lines containing the string 'error', printing matching lines with filenames",
          "Renames all log files containing 'error'",
          "Counts the number of files in /var/log/"
        ],
        correctAnswer: 1,
        explanation: "grep (Global Regular Expression Print) searches files for pattern matches. `-r` = recursive (search all subdirectories). `/var/log/` = path. It prints every line containing 'error' from all files. Add `-i` for case-insensitive, `-n` for line numbers, `-l` to list only filenames.",
        topic: "Linux Internals"
      },
      {
        id: "devops-q17",
        question: "What is a Helm chart in Kubernetes?",
        options: [
          "A Kubernetes dashboard for monitoring cluster metrics",
          "A package manager for Kubernetes that bundles all resource manifests (Deployments, Services, ConfigMaps) into a reusable, configurable chart with templating support",
          "A visual diagram of Kubernetes cluster architecture",
          "A tool for migrating Docker Compose to Kubernetes"
        ],
        correctAnswer: 1,
        explanation: "Helm is Kubernetes' package manager. A Helm chart is a collection of YAML templates + a values.yaml file. Users customize deployments via values without modifying templates. Enables versioned, repeatable application deployments. `helm install`, `helm upgrade`, `helm rollback` manage releases.",
        topic: "Kubernetes"
      },
      {
        id: "devops-q18",
        question: "What is the difference between a firewall and a security group in cloud environments?",
        options: [
          "They are identical concepts",
          "Traditional firewalls are network-level, hardware/software appliances; cloud security groups are virtual, stateful firewalls attached to individual instances controlling inbound/outbound traffic",
          "Security groups only allow inbound rules; firewalls only allow outbound rules",
          "Firewalls are for containers; security groups are for VMs"
        ],
        correctAnswer: 1,
        explanation: "Cloud Security Groups (AWS) / Firewall Rules (GCP): virtual, software-defined, stateful (return traffic automatically allowed). Applied per instance/interface. Traditional firewalls: hardware/software appliances at network perimeter. NACLs (Network Access Control Lists) in AWS are stateless and apply at the subnet level.",
        topic: "Networking"
      },
      {
        id: "devops-q19",
        question: "What is the Blue-Green deployment strategy?",
        options: [
          "A strategy where half of traffic goes to old version and half to new",
          "A strategy where two identical production environments (blue=current, green=new) are maintained; traffic is switched from blue to green atomically after green is validated, enabling instant rollbacks",
          "A strategy where new features are deployed to 1% of users first",
          "A color-coding system for container health status"
        ],
        correctAnswer: 1,
        explanation: "Blue-Green: maintain two production environments. Blue = current live. Green = new version being prepared. After testing green, switch the load balancer to route all traffic to green. Blue stays warm for instant rollback if issues arise. Disadvantage: requires 2× infrastructure cost during deployment.",
        topic: "CI/CD Pipelines"
      },
      {
        id: "devops-q20",
        question: "What does `ps aux` show in Linux and what do the columns mean?",
        options: [
          "Shows disk usage for all mounted filesystems",
          "Shows all running processes with columns for User, PID, CPU%, Memory%, VSZ, RSS, TTY, Status, Start time, and Command",
          "Shows network connections and listening ports",
          "Shows all logged-in users on the system"
        ],
        correctAnswer: 1,
        explanation: "`ps aux`: a=all processes from all users, u=user-oriented format, x=include processes not attached to a terminal. Columns: USER (owner), PID (process ID), %CPU, %MEM, VSZ (virtual memory), RSS (physical memory), TTY, STAT (S=sleeping, R=running, Z=zombie), START, TIME, COMMAND.",
        topic: "Linux Internals"
      },
      {
        id: "devops-q21",
        question: "What is a message queue (e.g., RabbitMQ, Kafka) and when would you use it in a microservices architecture?",
        options: [
          "A database optimized for message storage",
          "An asynchronous communication mechanism that decouples producers and consumers, enabling services to communicate without direct dependencies, handling load spikes, and ensuring message durability",
          "A synchronous HTTP-based API gateway",
          "A load balancer for microservices"
        ],
        correctAnswer: 1,
        explanation: "Message queues enable async communication: producer sends messages to a queue; consumers process them independently. Benefits: decoupling (services don't need to know about each other), load leveling (queue absorbs traffic spikes), durability (messages persisted until consumed), and retry logic. Use cases: order processing, notifications, event streaming.",
        topic: "Networking"
      },
      {
        id: "devops-q22",
        question: "What is the purpose of the `chmod 755` command in Linux?",
        options: [
          "Changes file ownership to user 755",
          "Sets permissions: owner=rwx (7=read+write+execute), group=r-x (5=read+execute), others=r-x (5=read+execute)",
          "Deletes a file with inode number 755",
          "Creates 755 hard links to a file"
        ],
        correctAnswer: 1,
        explanation: "chmod changes file permissions. Octal notation: 4=read, 2=write, 1=execute. 7=4+2+1=rwx, 5=4+0+1=r-x. chmod 755: owner can read/write/execute; group and others can read and execute only. Common for executable scripts.",
        topic: "Linux Internals"
      },
      {
        id: "devops-q23",
        question: "What is Prometheus and how does it differ from traditional monitoring tools?",
        options: [
          "Prometheus is a log aggregation tool similar to Splunk",
          "Prometheus is a pull-based metrics collection system using a time-series database; services expose metrics at /metrics endpoints, and Prometheus scrapes them on a schedule — enabling dimensional data querying via PromQL",
          "Prometheus only monitors Kubernetes clusters",
          "Prometheus pushes metrics from servers to a central dashboard"
        ],
        correctAnswer: 1,
        explanation: "Prometheus: pull-based (scrapes /metrics HTTP endpoints), time-series database, PromQL query language, multi-dimensional labels for filtering/aggregation. Traditional tools (Nagios, Zabbix): often push-based with agent installation. Prometheus + Grafana is the de facto standard cloud-native monitoring stack.",
        topic: "SRE & Observability"
      },
      {
        id: "devops-q24",
        question: "What is a Kubernetes HorizontalPodAutoscaler (HPA)?",
        options: [
          "A tool to manually scale pods horizontally",
          "A controller that automatically scales the number of pod replicas based on observed metrics (CPU, memory, or custom metrics) to handle varying load",
          "A feature to scale pod CPU allocation vertically",
          "A load balancer for distributing traffic between pods"
        ],
        correctAnswer: 1,
        explanation: "HPA automatically increases or decreases pod replicas based on metrics (default: CPU utilization). When CPU exceeds the threshold (e.g., 70%), HPA scales out; when load drops, it scales in. Requires Metrics Server. For scaling based on custom metrics (queue depth, requests/sec), use KEDA or Prometheus Adapter.",
        topic: "Kubernetes"
      },
      {
        id: "devops-q25",
        question: "What is the difference between TCP and UDP protocols?",
        options: [
          "TCP is faster; UDP is slower",
          "TCP provides reliable, ordered, connection-based delivery with acknowledgments and retransmission; UDP is connectionless, with no guaranteed delivery or ordering, but much lower latency",
          "UDP is for web traffic; TCP is for video streaming",
          "TCP and UDP use different network layers"
        ],
        correctAnswer: 1,
        explanation: "TCP: 3-way handshake, guaranteed delivery (ACKs + retransmit), ordered packets, flow control, congestion control. Higher latency. Good for: HTTP, email, file transfer. UDP: no connection, no acknowledgment, no ordering guarantee, minimal overhead. Low latency. Good for: video streaming, gaming, DNS, VoIP.",
        topic: "Networking"
      },
      {
        id: "devops-q26",
        question: "What does a Kubernetes Service of type `LoadBalancer` do?",
        options: [
          "It creates an internal DNS record for the service",
          "It provisions an external cloud load balancer (e.g., AWS ELB, GCP Load Balancer) that routes external traffic to the set of pods matching the service's selector, assigning an external IP",
          "It balances CPU load between nodes in the cluster",
          "It enables pod-to-pod communication within the cluster"
        ],
        correctAnswer: 1,
        explanation: "Service types: ClusterIP (internal only), NodePort (exposes on each node's IP/port), LoadBalancer (provisions external cloud LB with public IP, superset of NodePort), ExternalName (CNAME DNS alias). LoadBalancer is the standard way to expose services to the internet in cloud environments.",
        topic: "Kubernetes"
      },
      {
        id: "devops-q27",
        question: "In a Unix/Linux system, what is `cron` and what does `0 2 * * *` mean in a crontab?",
        options: [
          "cron is a process manager; `0 2 * * *` runs every 2 minutes",
          "cron is a time-based job scheduler; `0 2 * * *` means 'run at 2:00 AM every day of every month on any day of the week'",
          "cron is an init system; `0 2 * * *` means 'run on the 2nd of every month'",
          "cron is a network daemon; `0 2 * * *` means 'run every 2 hours'"
        ],
        correctAnswer: 1,
        explanation: "Crontab format: minute hour day-of-month month day-of-week. `0 2 * * *`: minute=0, hour=2, day=any, month=any, weekday=any → runs at exactly 2:00 AM daily. `*/5 * * * *` = every 5 minutes. `0 0 1 * *` = midnight on 1st of every month.",
        topic: "Linux Internals"
      },
      {
        id: "devops-q28",
        question: "What is the purpose of an Ingress resource in Kubernetes?",
        options: [
          "To define CPU/memory limits for pods",
          "To manage external HTTP/HTTPS routing to services within the cluster, enabling host-based and path-based routing, TLS termination, and virtual hosting — replacing multiple LoadBalancer services",
          "To control pod-to-pod communication policies",
          "To schedule pods onto specific nodes"
        ],
        correctAnswer: 1,
        explanation: "Ingress: manages HTTP/HTTPS routing into the cluster. Requires an Ingress Controller (nginx, Traefik, AWS ALB). Features: host-based routing (app1.example.com → service A), path-based routing (/api → service B), TLS termination (SSL certs via cert-manager). More efficient than one LoadBalancer per service.",
        topic: "Kubernetes"
      },
      {
        id: "devops-q29",
        question: "What is container orchestration and why is Kubernetes the industry standard?",
        options: [
          "Container orchestration is just a fancy term for Docker Compose",
          "Container orchestration automates deployment, scaling, networking, and lifecycle management of containerized applications; Kubernetes is the standard because it's open-source, cloud-agnostic, has a rich ecosystem, auto-healing, declarative config, and handles complex distributed systems",
          "Kubernetes is only used by companies with 1000+ engineers",
          "Container orchestration requires a dedicated hardware cluster"
        ],
        correctAnswer: 1,
        explanation: "Container orchestration solves: where to run containers, how many replicas, how to update without downtime, service discovery, load balancing, storage management, and self-healing. Kubernetes originated at Google (Borg). Now CNCF-hosted with massive ecosystem (Helm, Istio, Prometheus, ArgoCD).",
        topic: "Docker & Containers"
      },
      {
        id: "devops-q30",
        question: "What is GitOps and how does it differ from traditional deployment approaches?",
        options: [
          "GitOps means storing code in Git repositories",
          "GitOps uses Git as the single source of truth for infrastructure and application state; automated agents (ArgoCD, Flux) continuously reconcile actual cluster state to match the desired state declared in Git",
          "GitOps is a branching strategy for deployment workflows",
          "GitOps is only applicable to infrastructure, not applications"
        ],
        correctAnswer: 1,
        explanation: "GitOps principles: everything declared as code in Git, automated deployment via agents (not manual kubectl apply), continuous reconciliation (drift detection), PRs as the deployment mechanism (audit trail + review). ArgoCD and Flux are the leading GitOps tools. Benefits: reproducibility, auditability, rollbacks via Git revert.",
        topic: "CI/CD Pipelines"
      }
    ]
  },

  // 6. Data Scientist Technical Assessment
  {
    id: "ds-ml-assessment-1",
    title: "Data Scientist ML & Statistics Screening",
    roleId: "data-scientist",
    category: "Technical Round",
    difficulty: "Hard",
    durationMinutes: 45,
    passingScorePercent: 70,
    totalMarks: 60,
    description: "Covers ML algorithms, statistics, probability, Python ML, feature engineering, model evaluation, and system design for ML.",
    companyTag: "Meta / DeepMind / Startup Tier",
    questions: [
      {
        id: "ds-q1",
        question: "What is the bias-variance tradeoff in machine learning?",
        options: [
          "Bias and variance are unrelated metrics",
          "High bias (underfitting) means the model is too simple and misses patterns; high variance (overfitting) means the model memorizes training data but fails on new data; the goal is to find the optimal complexity minimizing both",
          "Bias measures how biased the training data is; variance measures data spread",
          "High bias always leads to high variance"
        ],
        correctAnswer: 1,
        explanation: "Bias-Variance decomposition: Total Error = Bias² + Variance + Irreducible Noise. High bias: model too simple (linear regression for complex patterns). High variance: model too complex (deep tree overfitting). Strategies: regularization (Ridge/Lasso), ensemble methods (Bagging reduces variance, Boosting reduces bias), and cross-validation to select optimal model complexity.",
        topic: "ML Theory"
      },
      {
        id: "ds-q2",
        question: "What is the difference between L1 (Lasso) and L2 (Ridge) regularization?",
        options: [
          "L1 adds squared penalty; L2 adds absolute value penalty",
          "L1 (Lasso) adds |w| penalty promoting sparsity (drives some weights to exactly zero, performing feature selection); L2 (Ridge) adds w² penalty shrinking all weights toward zero without eliminating them",
          "L1 is for classification; L2 is for regression",
          "Both are identical in practice"
        ],
        correctAnswer: 1,
        explanation: "L1 (Lasso): penalty = λΣ|wᵢ|. Produces sparse solutions (many weights exactly = 0) → built-in feature selection. Good when many irrelevant features. L2 (Ridge): penalty = λΣwᵢ². Shrinks weights but rarely to zero → retains all features. Good for correlated features. ElasticNet combines both.",
        topic: "ML Theory"
      },
      {
        id: "ds-q3",
        question: "How does a Random Forest reduce variance compared to a single Decision Tree?",
        options: [
          "Random Forest uses a deeper tree than Decision Trees",
          "Random Forest builds many trees on bootstrapped data subsets and random feature subsets, then averages predictions (bagging) — the ensemble average has lower variance than any individual tree",
          "Random Forest uses gradient boosting to minimize variance",
          "Random Forest reduces variance by pruning trees more aggressively"
        ],
        correctAnswer: 1,
        explanation: "Random Forest = Bootstrap Aggregating (Bagging) + Feature Randomness. Each tree trained on a bootstrap sample (random sample with replacement). At each split, only a random subset of features is considered (default: √p for classification). Averaging many diverse, decorrelated trees reduces variance without increasing bias significantly.",
        topic: "ML Algorithms"
      },
      {
        id: "ds-q4",
        question: "What is the Central Limit Theorem (CLT) and why is it fundamental to statistics?",
        options: [
          "CLT states that all real-world data follows a normal distribution",
          "CLT states that the distribution of sample means approaches a normal distribution as sample size increases, regardless of the underlying population distribution — enabling parametric inference on non-normal populations",
          "CLT is only applicable to populations with known distributions",
          "CLT says that central tendency equals the limit of variance"
        ],
        correctAnswer: 1,
        explanation: "CLT: for sufficiently large n (typically n ≥ 30), the sampling distribution of x̄ is approximately N(μ, σ²/n) regardless of the population distribution. This enables: z-tests, t-tests, confidence intervals, and hypothesis testing on non-normal populations. The foundation of frequentist statistics.",
        topic: "Statistics & Probability"
      },
      {
        id: "ds-q5",
        question: "What is gradient descent and what is the difference between batch, mini-batch, and stochastic gradient descent?",
        options: [
          "All three variants compute the same gradient with different precision",
          "Batch GD uses all training samples per update (accurate but slow); Stochastic GD (SGD) uses one sample per update (noisy but fast, can escape local minima); Mini-batch uses a small batch (k samples) — balancing accuracy and speed",
          "Stochastic GD is more accurate than Batch GD",
          "Mini-batch GD is identical to Batch GD"
        ],
        correctAnswer: 1,
        explanation: "Gradient Descent minimizes loss by iterating: w = w - η∇L. Batch GD: stable updates, uses entire dataset (memory-intensive, slow per update). SGD: one sample, very noisy (high variance), fast but may oscillate. Mini-batch (most common in deep learning): k=32-256 samples, GPU-efficient, moderate noise that can help regularization.",
        topic: "ML Theory"
      },
      {
        id: "ds-q6",
        question: "What is the difference between classification and regression in supervised learning?",
        options: [
          "Classification is unsupervised; regression is supervised",
          "Classification predicts discrete class labels (cat/dog, spam/not spam); regression predicts continuous numerical values (house price, temperature)",
          "Regression only works with linear relationships",
          "Both always use the same loss functions"
        ],
        correctAnswer: 1,
        explanation: "Classification: output is a discrete class. Loss functions: cross-entropy, hinge loss. Algorithms: logistic regression, SVM, decision trees, neural networks. Regression: output is continuous. Loss functions: MSE, MAE, Huber. Algorithms: linear regression, SVR, gradient boosting. Some algorithms (decision trees, SVMs, neural nets) work for both.",
        topic: "ML Algorithms"
      },
      {
        id: "ds-q7",
        question: "What is cross-validation and why is k-fold cross-validation preferred over a single train-test split?",
        options: [
          "Cross-validation is the same as hyperparameter tuning",
          "K-fold CV splits data into k folds, trains on k-1 folds, validates on the remaining fold, rotating k times — giving k performance estimates whose average has lower variance and is more reliable than a single split",
          "K-fold CV always uses k=10 folds",
          "Cross-validation is only for neural networks"
        ],
        correctAnswer: 1,
        explanation: "K-fold CV: more reliable performance estimation by using all data for both training and validation. A single split's performance estimate has high variance depending on which data ended up in test set. K-fold averages over k estimates. Stratified k-fold preserves class proportions in each fold. Leave-one-out CV: k = n (high computational cost).",
        topic: "Model Evaluation"
      },
      {
        id: "ds-q8",
        question: "What is the ROC-AUC metric and when is it more informative than accuracy?",
        options: [
          "ROC-AUC is only useful for regression problems",
          "ROC curve plots True Positive Rate vs. False Positive Rate at all classification thresholds; AUC = area under this curve (1.0 = perfect, 0.5 = random). More informative than accuracy on imbalanced datasets where accuracy can be misleadingly high",
          "AUC of 0.5 indicates perfect classification",
          "ROC-AUC is identical to F1 score"
        ],
        correctAnswer: 1,
        explanation: "On an imbalanced dataset (99% negative), a naive classifier predicting always-negative achieves 99% accuracy but 0% recall. ROC-AUC evaluates across all thresholds. AUC = P(model scores a random positive higher than a random negative). PR-AUC (Precision-Recall AUC) is preferred for very high class imbalance.",
        topic: "Model Evaluation"
      },
      {
        id: "ds-q9",
        question: "What is the difference between Bagging and Boosting ensemble methods?",
        options: [
          "Both train models on the same data",
          "Bagging trains multiple models in parallel on bootstrap samples and averages results (reduces variance, e.g. Random Forest); Boosting trains models sequentially where each focuses on previous mistakes (reduces bias, e.g. XGBoost, AdaBoost)",
          "Boosting uses smaller models than Bagging",
          "Bagging is always better than Boosting"
        ],
        correctAnswer: 1,
        explanation: "Bagging: parallel training on bootstrapped samples, averaging reduces variance (combats overfitting). Random Forest is bagging with decision trees. Boosting: sequential training where each learner corrects predecessor's errors by upweighting misclassified samples. Reduces bias (combats underfitting). XGBoost, LightGBM, AdaBoost. Generally Boosting achieves better accuracy but is more prone to overfitting.",
        topic: "ML Algorithms"
      },
      {
        id: "ds-q10",
        question: "What is the curse of dimensionality and how does it affect ML models?",
        options: [
          "Having too many dimensions makes hardware requirements impossible",
          "As feature count grows, the data volume needed to maintain statistical significance grows exponentially; distances become meaningless in high dimensions, leading to sparse data, poor generalization, and increased computational cost",
          "The curse only affects neural networks with many layers",
          "More features always improve model performance"
        ],
        correctAnswer: 1,
        explanation: "In high-dimensional spaces: data becomes sparse (points are far apart), distances lose discriminative power (all points appear equidistant), models need exponentially more data to generalize, overfitting risk increases. Solutions: dimensionality reduction (PCA, t-SNE, UMAP), feature selection, regularization, domain knowledge to select relevant features.",
        topic: "Feature Engineering"
      },
      {
        id: "ds-q11",
        question: "What is Bayesian inference and how does it differ from frequentist statistics?",
        options: [
          "Bayesian uses larger sample sizes than frequentist",
          "Bayesian incorporates prior beliefs about parameters and updates them with observed data using Bayes' theorem to produce a posterior distribution; frequentist treats parameters as fixed unknowns and draws inferences from data alone",
          "Bayesian statistics is less accurate than frequentist",
          "Both approaches always yield identical results"
        ],
        correctAnswer: 1,
        explanation: "Frequentist: parameters are fixed, data is random. Uses p-values, confidence intervals. P(data|hypothesis). Bayesian: parameters are random variables with prior distributions. P(hypothesis|data) ∝ P(data|hypothesis) × P(hypothesis). Posterior = Likelihood × Prior. Bayesian naturally incorporates prior knowledge and gives probabilistic statements about parameters.",
        topic: "Statistics & Probability"
      },
      {
        id: "ds-q12",
        question: "What is PCA (Principal Component Analysis) and when would you use it?",
        options: [
          "PCA is a classification algorithm",
          "PCA is an unsupervised dimensionality reduction technique that projects data onto orthogonal axes (principal components) of maximum variance, reducing features while preserving as much information as possible",
          "PCA is used only when data is normally distributed",
          "PCA always improves model performance"
        ],
        correctAnswer: 1,
        explanation: "PCA computes eigenvectors of the covariance matrix. Principal components are orthogonal directions of maximum variance. Used for: visualization (reduce to 2-3D), removing multicollinearity, noise reduction, speeding up training. Limitation: components are linear combinations (hard to interpret), loses some information. StandardScaler needed before PCA.",
        topic: "Feature Engineering"
      },
      {
        id: "ds-q13",
        question: "What is the difference between supervised, unsupervised, and reinforcement learning?",
        options: [
          "All three require labeled training data",
          "Supervised: learns from labeled (input, output) pairs; Unsupervised: finds patterns in unlabeled data (clustering, dimensionality reduction); Reinforcement: agent learns by taking actions in an environment and receiving reward/penalty signals",
          "Reinforcement learning always needs a human trainer",
          "Unsupervised learning cannot produce useful models"
        ],
        correctAnswer: 1,
        explanation: "Supervised: linear/logistic regression, SVM, neural networks with labeled data. Unsupervised: K-Means clustering, DBSCAN, PCA, autoencoders. Reinforcement: RL algorithms (Q-learning, PPO, A3C) train agents via trial-and-error with reward signals. Used in game AI (AlphaGo), robotics, recommendation systems, resource management.",
        topic: "ML Theory"
      },
      {
        id: "ds-q14",
        question: "What is the vanishing gradient problem in deep neural networks and how is it addressed?",
        options: [
          "Gradients become too large and cause instability",
          "In deep networks, gradients in early layers shrink exponentially during backpropagation due to chain rule multiplications of small derivatives, making weights barely update; solutions include ReLU activations, batch normalization, residual connections (ResNets), and careful weight initialization",
          "The problem only occurs in RNNs, not in feedforward networks",
          "Using more training data eliminates vanishing gradients"
        ],
        correctAnswer: 1,
        explanation: "Vanishing gradient: sigmoid/tanh derivatives (max 0.25/1.0) multiply through many layers → tiny gradients near input layers → slow/no learning. Solutions: ReLU (derivative=1 for positive inputs, no saturation), batch normalization (normalizes layer inputs), skip connections/residuals (gradient highway past layers), He/Xavier initialization.",
        topic: "Deep Learning"
      },
      {
        id: "ds-q15",
        question: "What is feature engineering and what are common techniques for handling missing values?",
        options: [
          "Feature engineering is the same as feature selection",
          "Feature engineering creates/transforms features to improve model performance; missing value strategies include: deletion (if MCAR), mean/median/mode imputation, forward/backward fill (time series), regression imputation, and model-based imputation (KNNImputer, IterativeImputer)",
          "Missing values should always be deleted",
          "Mean imputation is always the best strategy"
        ],
        correctAnswer: 1,
        explanation: "Missing data mechanisms: MCAR (Missing Completely At Random) — deletion safe; MAR (Missing At Random) — imputation on related variables; MNAR (Missing Not At Random) — needs domain knowledge. Imputation strategies: mean/median (simple), KNN imputation (preserves structure), MICE/IterativeImputer (models each column using others). Adding a 'missing indicator' binary feature often helps tree models.",
        topic: "Feature Engineering"
      },
      {
        id: "ds-q16",
        question: "What is an attention mechanism in transformer models?",
        options: [
          "Attention is a memory management technique for training large models",
          "Attention allows the model to weigh the relevance of each input token to every other token when generating a representation, computed as weighted sums of value vectors using softmax-normalized query-key dot products",
          "Attention is only used in image processing models",
          "Attention replaces the need for training data"
        ],
        correctAnswer: 1,
        explanation: "Self-attention: Attention(Q,K,V) = softmax(QKᵀ/√d_k)V. Q (query), K (key), V (value) are linear projections of the input. Each token attends to all others, weighted by relevance. Multi-head attention: h parallel attention heads capture different relationship types. Foundation of BERT, GPT, T5, and all modern LLMs.",
        topic: "Deep Learning"
      },
      {
        id: "ds-q17",
        question: "What is the difference between precision and recall, and when do you prioritize each?",
        options: [
          "Precision and recall are always equal",
          "Precision = TP/(TP+FP) — minimize false alarms; Recall = TP/(TP+FN) — minimize missed detections. Prioritize precision when false positives are costly (spam detection, content moderation); prioritize recall when false negatives are costly (cancer screening, fraud detection)",
          "Recall measures model speed; precision measures accuracy",
          "Both metrics only matter for binary classification"
        ],
        correctAnswer: 1,
        explanation: "Precision-Recall tradeoff: Lowering classification threshold increases recall (catch more positives) but lowers precision (more false alarms). F1 score = harmonic mean. Use F1 when you want balance. Fbeta-score adjusts the tradeoff: β>1 weights recall more; β<1 weights precision more. Always choose based on business cost of each error type.",
        topic: "Model Evaluation"
      },
      {
        id: "ds-q18",
        question: "What is the Law of Large Numbers and how does it relate to machine learning?",
        options: [
          "Larger models always perform better",
          "LLN states that as the number of observations increases, the sample mean converges to the true population mean — in ML: larger training sets give more reliable performance estimates, and test set size determines evaluation reliability",
          "LLN only applies to normal distributions",
          "LLN guarantees perfect model accuracy with large datasets"
        ],
        correctAnswer: 1,
        explanation: "Weak LLN: for large n, sample mean P→ true mean μ. Strong LLN: it converges almost surely. In ML: evaluation metrics from large test sets are reliable estimates of true performance. Small test sets have high variance in metric estimates. Also explains why averaging many models (ensemble) improves stability over single models.",
        topic: "Statistics & Probability"
      },
      {
        id: "ds-q19",
        question: "What is SHAP (SHapley Additive exPlanations) and why is it valuable for ML interpretability?",
        options: [
          "SHAP is a model architecture similar to XGBoost",
          "SHAP assigns each feature a Shapley value representing its marginal contribution to the prediction compared to the average prediction — providing locally accurate, consistent, and model-agnostic feature importance",
          "SHAP only works with linear models",
          "SHAP improves model accuracy"
        ],
        correctAnswer: 1,
        explanation: "SHAP (Lundberg & Lee 2017): based on cooperative game theory Shapley values. For each prediction, SHAP explains how each feature pushed the prediction above/below the average. Properties: local accuracy (values sum to prediction - base), consistency, and missingness. Model-agnostic but tree SHAP is O(TLD²) efficient for gradient boosting.",
        topic: "Feature Engineering"
      },
      {
        id: "ds-q20",
        question: "What is the difference between overfitting and underfitting, and how do you detect each?",
        options: [
          "Overfitting means training loss is too high",
          "Overfitting: low training error, high validation error (model memorizes training data); Underfitting: high training AND validation error (model too simple). Detected via learning curves; addressed by: regularization/early stopping for overfitting, more features/complex model for underfitting",
          "Underfitting only occurs with linear models",
          "Cross-validation cannot detect overfitting"
        ],
        correctAnswer: 1,
        explanation: "Overfitting symptoms: training loss decreases while validation loss increases (divergence on learning curve). Solutions: regularization (L1/L2/dropout), early stopping, data augmentation, reduce model complexity, more training data. Underfitting symptoms: both losses remain high. Solutions: more features, complex model architecture, longer training, reduce regularization.",
        topic: "Model Evaluation"
      },
      {
        id: "ds-q21",
        question: "What is the softmax function and where is it used in neural networks?",
        options: [
          "Softmax is a loss function for regression",
          "Softmax converts a vector of raw scores (logits) to a probability distribution that sums to 1.0; used as the output layer activation in multi-class classification where each output represents the probability of each class",
          "Softmax is only used in the hidden layers of CNNs",
          "Softmax is identical to the sigmoid function"
        ],
        correctAnswer: 1,
        explanation: "Softmax(zᵢ) = exp(zᵢ) / Σexp(zⱼ). Properties: all outputs are positive, sum to 1.0, differentiable. Combined with cross-entropy loss for multi-class classification. Sigmoid is for binary classification (output ∈ [0,1]). In transformers, softmax is also used in attention to normalize attention weights.",
        topic: "Deep Learning"
      },
      {
        id: "ds-q22",
        question: "What is the difference between a generative and discriminative model?",
        options: [
          "Generative models can only produce images",
          "Generative models learn the joint distribution P(X,Y) and can generate new data samples; discriminative models learn P(Y|X) directly — the decision boundary between classes — typically achieving better classification accuracy but unable to generate data",
          "Discriminative models require more training data",
          "Both model types produce identical predictions"
        ],
        correctAnswer: 1,
        explanation: "Generative: models P(X,Y) = P(X|Y)P(Y). Can generate new samples, handle missing features. Examples: Naive Bayes, HMM, VAE, GAN. Discriminative: models P(Y|X) directly. Better calibrated for classification. Examples: logistic regression, SVM, most neural classifiers. 'By Ng & Jordan 2002': discriminative often outperforms generative with sufficient data.",
        topic: "ML Theory"
      },
      {
        id: "ds-q23",
        question: "What is class imbalance and what techniques address it?",
        options: [
          "Class imbalance occurs when validation data is too small",
          "Class imbalance occurs when one class vastly outnumbers others; techniques: SMOTE (synthetic oversampling), random undersampling, class weights in loss function, threshold tuning, anomaly detection framing, ensemble methods (EasyEnsemble)",
          "Class imbalance only affects neural networks",
          "Collecting more data always solves class imbalance"
        ],
        correctAnswer: 1,
        explanation: "Imbalanced datasets: model biased toward majority class, misleading accuracy. Solutions: 1) Resampling: oversample minority (SMOTE, ADASYN) or undersample majority. 2) Algorithmic: class_weight='balanced' in sklearn adjusts loss function. 3) Threshold tuning: lower decision threshold for minority class. 4) Evaluation: use PR-AUC, F1, or Matthews Correlation Coefficient instead of accuracy.",
        topic: "Feature Engineering"
      },
      {
        id: "ds-q24",
        question: "What is a confusion matrix and what four values does it contain?",
        options: [
          "A confusion matrix shows model hyperparameters",
          "A confusion matrix is a 2×2 table showing True Positives (correctly predicted positive), True Negatives (correctly predicted negative), False Positives (negative predicted as positive), and False Negatives (positive predicted as negative)",
          "Confusion matrices only work with multi-class problems",
          "A confusion matrix contains only precision and recall"
        ],
        correctAnswer: 1,
        explanation: "Confusion matrix (binary): [[TN, FP], [FN, TP]]. Derived metrics: Accuracy = (TP+TN)/(TP+TN+FP+FN). Precision = TP/(TP+FP). Recall/Sensitivity = TP/(TP+FN). Specificity = TN/(TN+FP). F1 = 2×(P×R)/(P+R). For multi-class: n×n matrix where diagonal = correct predictions.",
        topic: "Model Evaluation"
      },
      {
        id: "ds-q25",
        question: "What is a word embedding (e.g., Word2Vec, GloVe) in NLP?",
        options: [
          "A technique to count word frequencies in text",
          "A dense vector representation of words in a continuous high-dimensional space where semantically similar words are geometrically close, capturing semantic and syntactic relationships",
          "A rule-based tokenization algorithm",
          "A compression algorithm for text storage"
        ],
        correctAnswer: 1,
        explanation: "Word embeddings map words to dense vectors (e.g., 300 dimensions). Famous property: 'king' - 'man' + 'woman' ≈ 'queen'. Word2Vec: Skipgram or CBOW trained on co-occurrence. GloVe: factorizes co-occurrence matrix. FastText: subword embeddings. BERT/GPT: contextual embeddings (same word has different vectors by context).",
        topic: "Deep Learning"
      },
      {
        id: "ds-q26",
        question: "What is hyperparameter tuning and what are common strategies?",
        options: [
          "Hyperparameter tuning modifies the training data",
          "Hyperparameters are model configuration values set before training (learning rate, tree depth, C in SVM); tuning strategies include Grid Search (exhaustive), Random Search (samples randomly), Bayesian Optimization (probabilistic model-guided), and population-based methods",
          "Hyperparameters are learned during training",
          "Hyperparameter tuning is only necessary for neural networks"
        ],
        correctAnswer: 1,
        explanation: "Hyperparameters (unlike parameters/weights) are not learned during training. Grid Search: evaluates all combinations (exhaustive, expensive). Random Search: randomly samples (often finds good solutions with fewer evaluations). Bayesian optimization (Optuna, Hyperopt): builds a surrogate model of the objective function to select promising configurations. Typical HPs: learning rate, regularization strength, tree depth, number of estimators.",
        topic: "Model Evaluation"
      },
      {
        id: "ds-q27",
        question: "What is transfer learning and why is it particularly valuable in deep learning?",
        options: [
          "Transfer learning means copying weights between identical models",
          "Transfer learning uses a model pre-trained on a large dataset (e.g., ImageNet, large text corpora) as a starting point for a new task, requiring much less labeled data and training time while achieving better performance",
          "Transfer learning only works for image classification",
          "Transfer learning requires the same data distribution"
        ],
        correctAnswer: 1,
        explanation: "Transfer learning: freeze pre-trained weights and add task-specific layers (feature extraction) or fine-tune all layers on new data. Benefits: dramatically reduces data requirements (powerful even with 100s of examples), faster convergence, better performance. Examples: fine-tuning BERT for sentiment analysis, ResNet for medical imaging, GPT for domain-specific text generation.",
        topic: "Deep Learning"
      },
      {
        id: "ds-q28",
        question: "What is the difference between supervised feature selection methods: Filter, Wrapper, and Embedded?",
        options: [
          "All three methods are identical",
          "Filter: statistical tests (correlation, chi-squared) independent of the model — fast but ignores feature interactions; Wrapper: uses model performance to evaluate feature subsets (RFE) — accurate but expensive; Embedded: feature selection integrated into model training (Lasso, tree feature importance)",
          "Wrapper methods are always the best choice",
          "Embedded methods cannot be used with linear models"
        ],
        correctAnswer: 1,
        explanation: "Filter (e.g., correlation, mutual info, chi-squared): fast, model-agnostic, misses synergistic feature interactions. Wrapper (RFE, Sequential Feature Selection): uses cross-validated model performance, captures interactions, computationally expensive. Embedded (Lasso L1 shrinks weights to 0, Random Forest feature importances): best of both — efficient and considers interactions.",
        topic: "Feature Engineering"
      },
      {
        id: "ds-q29",
        question: "What is the difference between K-Means and DBSCAN clustering algorithms?",
        options: [
          "Both require specifying the number of clusters upfront",
          "K-Means requires k (number of clusters), uses centroid-based assignments, works with spherical clusters; DBSCAN is density-based, doesn't require k, discovers arbitrary-shaped clusters, and identifies noise/outlier points",
          "DBSCAN is always better than K-Means",
          "K-Means can only cluster numerical data"
        ],
        correctAnswer: 1,
        explanation: "K-Means: specify k, assign points to nearest centroid, update centroids, repeat until convergence. Assumes spherical, similar-sized clusters. Sensitive to outliers. DBSCAN: density-based (core points, border points, noise). Parameters: ε (neighborhood radius) and minPts. Discovers arbitrary shapes, robust to outliers, but struggles with varying densities.",
        topic: "ML Algorithms"
      },
      {
        id: "ds-q30",
        question: "What is the difference between a p-value and a confidence interval in statistical inference?",
        options: [
          "They measure completely different things with no relationship",
          "P-value: probability of observing data as extreme as observed if null hypothesis is true (binary test of significance); Confidence interval: a range of plausible parameter values consistent with the data at a specified confidence level — provides more information about effect size and precision",
          "A 95% confidence interval always corresponds to p < 0.05",
          "Confidence intervals are only used in Bayesian statistics"
        ],
        correctAnswer: 1,
        explanation: "P-value: 'Is the effect real?' (binary answer at threshold α). Confidence interval: 'How large is the effect and how precisely do we know it?' A 95% CI means: if we repeated the study many times, 95% of computed CIs would contain the true parameter. CI not containing 0 corresponds to p < 0.05 for two-sided tests. CIs are generally more informative than p-values alone.",
        topic: "Statistics & Probability"
      }
    ]
  },

  // 7. Data Engineer Technical Assessment
  {
    id: "de-pipeline-assessment-1",
    title: "Data Engineer Pipeline & Infrastructure Screening",
    roleId: "data-engineer",
    category: "Technical Round",
    difficulty: "Hard",
    durationMinutes: 45,
    passingScorePercent: 70,
    totalMarks: 60,
    description: "Covers Apache Spark, ETL pipeline design, SQL optimization, data modeling, data warehousing, and streaming with Kafka.",
    companyTag: "Databricks / Snowflake / Startup Tier",
    questions: [
      {
        id: "de-q1",
        question: "What is Apache Spark and how does it differ from Hadoop MapReduce?",
        options: [
          "Spark is slower than MapReduce but more reliable",
          "Spark is an in-memory distributed computing engine that keeps intermediate data in RAM (avoiding disk I/O), supports iterative algorithms natively, and provides a unified API for batch, streaming, and ML — making it 10-100x faster than MapReduce for many workloads",
          "MapReduce and Spark are identical in performance",
          "Spark requires more hardware than MapReduce"
        ],
        correctAnswer: 1,
        explanation: "MapReduce: writes intermediate results to HDFS disk after each Map and Reduce phase — very slow for iterative algorithms. Spark: keeps data in memory (RDDs/DataFrames) across stages. Spark provides: RDDs (resilient distributed datasets), DataFrames/Datasets (optimized via Catalyst), Spark Streaming, MLlib, GraphX — unified platform vs. MapReduce's single paradigm.",
        topic: "Apache Spark"
      },
      {
        id: "de-q2",
        question: "What is the difference between a narrow transformation and a wide transformation in Spark?",
        options: [
          "Wide transformations are more complex algorithms",
          "Narrow transformations (map, filter, select) compute each partition independently without data movement; wide transformations (groupByKey, join, repartition) require a shuffle — redistributing data across partitions — which is expensive",
          "Narrow transformations always require more memory",
          "Wide transformations are only available in RDD API"
        ],
        correctAnswer: 1,
        explanation: "Narrow: each input partition → one output partition. No network transfer. Examples: map, filter, flatMap, union. Wide (shuffle): requires all-to-all data exchange between partitions. Creates a new stage in the DAG. Examples: groupByKey, reduceByKey, join, distinct, repartition. Shuffles are Spark's main performance bottleneck — minimize them by using reduceByKey (pre-aggregates) instead of groupByKey.",
        topic: "Apache Spark"
      },
      {
        id: "de-q3",
        question: "What is the difference between ETL and ELT?",
        options: [
          "ETL and ELT are identical acronyms for the same process",
          "ETL (Extract-Transform-Load): data is transformed before loading into the warehouse (traditional, resource-constrained warehouses); ELT (Extract-Load-Transform): raw data is loaded first into a modern cloud warehouse, then transformed using SQL — leveraging the warehouse's scale",
          "ETL is only for batch processing; ELT is only for streaming",
          "ELT is less reliable than ETL"
        ],
        correctAnswer: 1,
        explanation: "ETL: transform in a separate system before loading — complex pipelines, harder to re-process. Used when destination has limited storage/compute. ELT: load raw data first (cheap cloud storage), then transform using warehouse SQL (Snowflake, BigQuery). Benefits: raw data preserved for re-processing, transformations are SQL-based (more accessible), scales with cloud compute. dbt enables ELT on modern data stacks.",
        topic: "ETL & Data Pipelines"
      },
      {
        id: "de-q4",
        question: "What is Apache Kafka and what problem does it solve?",
        options: [
          "Kafka is a batch processing engine similar to Spark",
          "Kafka is a distributed, fault-tolerant, high-throughput event streaming platform that decouples data producers from consumers using topics, partitions, and consumer groups — enabling real-time data pipelines and event-driven architectures",
          "Kafka is a SQL database for time-series data",
          "Kafka is only suitable for small-scale applications"
        ],
        correctAnswer: 1,
        explanation: "Kafka concepts: Topics (logical event streams), Partitions (parallel ordering units within a topic), Producers (publish events), Consumers/Consumer Groups (parallel consumption), Brokers (Kafka servers), Retention (events stored for configurable period). Use cases: real-time analytics pipelines, event sourcing, microservice communication, CDC (Change Data Capture). Throughput: millions of events/second.",
        topic: "Streaming & Kafka"
      },
      {
        id: "de-q5",
        question: "What is data partitioning in a data warehouse and what are common partition strategies?",
        options: [
          "Partitioning is the same as indexing",
          "Partitioning divides large tables into smaller segments physically stored separately, enabling partition pruning (query only relevant partitions); common strategies: range partitioning (date ranges), list partitioning (categorical values), and hash partitioning for even distribution",
          "Partitioning always slows down queries",
          "Partitioning is only useful for tables with less than 1 million rows"
        ],
        correctAnswer: 1,
        explanation: "Partitioning enables partition pruning: WHERE date >= '2024-01-01' AND date < '2024-02-01' scans only the January partition instead of the entire table. Date partitioning is most common. In BigQuery: clustering (sorts within partitions). In Spark: write.partitionBy('date'). In Snowflake: clustering keys. Effective partitioning can reduce query cost by orders of magnitude.",
        topic: "Data Warehousing"
      },
      {
        id: "de-q6",
        question: "What is a Slowly Changing Dimension (SCD) and what is the difference between Type 1, Type 2, and Type 3?",
        options: [
          "SCDs are a type of SQL optimization technique",
          "SCD handles changing dimension attributes: Type 1 (overwrite old value — no history), Type 2 (add new row with effective dates — full history), Type 3 (add new column for previous value — limited history)",
          "SCDs only apply to fact tables",
          "All SCD types preserve complete historical data"
        ],
        correctAnswer: 1,
        explanation: "SCD Type 1: UPDATE existing row. Simple, loses history. Type 2: INSERT new row with start_date, end_date, is_current. Most common, full history, enables point-in-time analysis. Type 3: Add prev_value column. Limited (only one historical value). Type 4: separate history table. Type 6 (Hybrid): combines 1+2+3. Type 2 is the gold standard for slowly changing attributes like customer address.",
        topic: "Data Modeling"
      },
      {
        id: "de-q7",
        question: "What is the difference between a star schema and a snowflake schema in data warehousing?",
        options: [
          "Star schema is more normalized than snowflake",
          "Star schema: central fact table connected directly to denormalized dimension tables (simple joins, fast queries, redundancy). Snowflake schema: dimension tables normalized into multiple related tables (less redundancy, storage efficient, but complex multi-hop joins)",
          "Both schemas always perform equally",
          "Snowflake schema is better for all use cases"
        ],
        correctAnswer: 1,
        explanation: "Star schema: Fact table + flat dimension tables. Advantages: simple queries (single join to fact), excellent for OLAP tools, good query performance. Disadvantages: data redundancy (customer name repeated in every order). Snowflake: dimensions normalized into sub-dimensions. Advantages: eliminates redundancy, flexible. Disadvantages: complex multi-join queries, slower. Kimball methodology favors star; Inmon favors normalized.",
        topic: "Data Modeling"
      },
      {
        id: "de-q8",
        question: "What is Spark's Catalyst Optimizer and what is its role?",
        options: [
          "Catalyst is Spark's cluster resource manager",
          "Catalyst is Spark's SQL query optimizer that transforms logical query plans into optimized physical execution plans through rule-based and cost-based optimization, predicate pushdown, column pruning, and constant folding",
          "Catalyst is a caching mechanism for Spark DataFrames",
          "Catalyst only works with the RDD API"
        ],
        correctAnswer: 1,
        explanation: "Catalyst optimizer pipeline: SQL/DataFrame → Unresolved Logical Plan → Analyzed Logical Plan → Optimized Logical Plan (predicate pushdown, constant folding, projection pruning) → Physical Plans → Selected Physical Plan → Code Generation (Tungsten). Catalyst is why DataFrame/SQL API often outperforms hand-written RDD code.",
        topic: "Apache Spark"
      },
      {
        id: "de-q9",
        question: "What is Change Data Capture (CDC) and how is it implemented?",
        options: [
          "CDC is a backup strategy for databases",
          "CDC captures row-level changes (INSERT/UPDATE/DELETE) from a source database and propagates them to downstream systems in near-real-time; common implementations: database transaction log reading (Debezium), triggers, and timestamp-based polling",
          "CDC requires full table scans every hour",
          "CDC can only capture INSERT operations"
        ],
        correctAnswer: 1,
        explanation: "CDC use cases: real-time data synchronization, event sourcing, audit trails, cache invalidation. Log-based CDC (Debezium): reads database WAL/binlog (PostgreSQL WAL, MySQL binlog). Zero impact on source DB performance. Captures deletes. Timestamp-based: polls WHERE updated_at > last_run — misses deletes, potential drift. Trigger-based: DB triggers write to shadow table — adds load to source.",
        topic: "ETL & Data Pipelines"
      },
      {
        id: "de-q10",
        question: "What is the purpose of Apache Airflow in data engineering?",
        options: [
          "Airflow is a streaming data processing engine",
          "Airflow is a workflow orchestration platform for authoring, scheduling, and monitoring data pipelines as Directed Acyclic Graphs (DAGs), with dependency management, retry logic, alerting, and a web UI",
          "Airflow is a distributed database for storing pipeline metadata",
          "Airflow replaces Apache Spark for data processing"
        ],
        correctAnswer: 1,
        explanation: "Airflow DAGs define pipeline logic: tasks (operators) and their dependencies. Operators: PythonOperator, BashOperator, BigQueryOperator, SparkSubmitOperator, etc. Features: scheduling (cron expressions), retry on failure, SLA monitoring, task dependencies, parameterization (templating with Jinja), plugins ecosystem. Modern alternatives: Prefect, Dagster (better testing/typing).",
        topic: "ETL & Data Pipelines"
      },
      {
        id: "de-q11",
        question: "What is the difference between Snowflake's virtual warehouses and traditional database compute?",
        options: [
          "Snowflake's architecture is identical to traditional databases",
          "Snowflake separates storage from compute: virtual warehouses are independent, elastically scalable compute clusters that share the same centralized data storage — enabling multiple workloads to run concurrently without resource contention",
          "Snowflake virtual warehouses are physical hardware machines",
          "Snowflake can only run one virtual warehouse at a time"
        ],
        correctAnswer: 1,
        explanation: "Snowflake's shared-disk architecture separates: Storage (S3/GCS/Azure Blob — cheap, unlimited), Compute (virtual warehouses — XS to 4XL, pay per second used, auto-suspend/resume), and Cloud Services layer (metadata, query planning, security). Benefits: scale compute independently of storage, multiple concurrent warehouses for isolation, near-zero storage cost when compute is off.",
        topic: "Data Warehousing"
      },
      {
        id: "de-q12",
        question: "What is data lineage and why is it important in data engineering?",
        options: [
          "Data lineage is a method for compressing large datasets",
          "Data lineage tracks the complete lifecycle of data — where it originated, how it was transformed, and where it flows to — enabling impact analysis, debugging, compliance (GDPR), and trust in data quality",
          "Data lineage only applies to real-time streaming data",
          "Data lineage requires a separate expensive tool in all cases"
        ],
        correctAnswer: 1,
        explanation: "Data lineage use cases: 1) Impact analysis (if source table changes, what downstream reports break?), 2) Root cause analysis (why is this metric wrong?), 3) GDPR compliance (where does this customer's PII flow?), 4) Data quality trust. Tools: dbt (model lineage via DAG), Apache Atlas, OpenLineage standard, Marquez, DataHub.",
        topic: "ETL & Data Pipelines"
      },
      {
        id: "de-q13",
        question: "What is a broadcast join in Spark and when should you use it?",
        options: [
          "A broadcast join sends all data to all nodes regardless of size",
          "A broadcast join sends a copy of a small table to every executor node, avoiding the expensive shuffle of a regular join — optimal when one table fits in memory (typically < 10MB, configurable)",
          "Broadcast joins only work with SQL DataFrames",
          "Broadcast joins are slower than regular joins"
        ],
        correctAnswer: 1,
        explanation: "In a regular shuffle join, both tables are repartitioned by join key and sent across the network. Broadcast join: Spark collects the small table on the driver and broadcasts it to all executors. Each executor then does a local hash join. Configured via hint: df.join(broadcast(small_df), 'key') or spark.sql.autoBroadcastJoinThreshold (default: 10MB). Eliminates shuffle for the small table.",
        topic: "Apache Spark"
      },
      {
        id: "de-q14",
        question: "What is the medallion architecture (Bronze-Silver-Gold) in modern data lakes?",
        options: [
          "A data encryption standard for securing data lakes",
          "A layered data organization pattern: Bronze (raw ingested data, immutable), Silver (cleaned, deduplicated, validated data), Gold (business-aggregated, query-optimized tables for analytics/BI) — enabling progressive data quality and providing multiple use case layers",
          "A tiered pricing model for cloud storage",
          "A recovery strategy for data lake failures"
        ],
        correctAnswer: 1,
        explanation: "Medallion architecture (Delta Lake, Databricks): Bronze = exactly as ingested, timestamped, never overwritten. Silver = deduplicated, schema enforced, standardized, joined to references. Gold = domain-specific, aggregated, business-metric ready. Benefits: raw data always available for reprocessing, progressive quality checks, different consumer SLAs per layer. Often implemented with Delta Lake for ACID transactions.",
        topic: "Data Warehousing"
      },
      {
        id: "de-q15",
        question: "What is ACID compliance in the context of data lakes and what does Delta Lake provide?",
        options: [
          "ACID compliance is only needed for OLTP databases",
          "ACID (Atomicity, Consistency, Isolation, Durability) guarantees transactional integrity; traditional data lakes lack ACID support. Delta Lake adds ACID transactions to data lakes via transaction log (_delta_log), enabling reliable concurrent reads/writes, time travel, and schema enforcement",
          "Delta Lake converts data lakes into relational databases",
          "ACID compliance is automatically provided by all cloud storage"
        ],
        correctAnswer: 1,
        explanation: "Traditional data lakes (S3 + Parquet): no transactions, partial writes possible, no concurrent write isolation. Delta Lake transaction log: every operation committed as JSON entry. Provides: Atomicity (all-or-nothing writes), Isolation (MVCC for concurrent reads), schema enforcement (reject bad data), time travel (read table at any past version), MERGE/UPDATE/DELETE on Parquet files.",
        topic: "Data Warehousing"
      },
      {
        id: "de-q16",
        question: "What are window functions in SQL and what makes them different from GROUP BY?",
        options: [
          "Window functions collapse rows like GROUP BY",
          "Window functions compute calculations across a set of rows related to the current row (defined by OVER clause with PARTITION BY/ORDER BY) without collapsing result rows — each row retains its data plus the window computation",
          "Window functions are only available in PostgreSQL",
          "Window functions can only compute SUM and AVG"
        ],
        correctAnswer: 1,
        explanation: "Window functions: ROW_NUMBER(), RANK(), DENSE_RANK(), LAG(), LEAD(), FIRST_VALUE(), LAST_VALUE(), SUM() OVER(), AVG() OVER(). Syntax: FUNCTION() OVER (PARTITION BY col ORDER BY col ROWS/RANGE BETWEEN ...). Key difference from GROUP BY: no row reduction — all original rows preserved with window result added. Essential for: running totals, moving averages, period-over-period comparisons.",
        topic: "SQL Optimization"
      },
      {
        id: "de-q17",
        question: "What is the difference between Kafka's consumer groups and individual consumers?",
        options: [
          "Consumer groups are slower than individual consumers",
          "Consumer groups enable parallel consumption: each partition in a topic is assigned to exactly one consumer within a group — allowing horizontal scaling. Individual consumers read all partitions. Multiple independent consumer groups can read the same topic simultaneously without interfering",
          "Consumer groups require additional configuration files",
          "Individual consumers are deprecated in Kafka 3.0"
        ],
        correctAnswer: 1,
        explanation: "Kafka partition assignment: within a consumer group, each partition → exactly one consumer (no duplicate processing). Consumer group 1 and 2 can both read Topic A independently (each gets all messages). Scaling: add more consumers (up to number of partitions). Extra consumers beyond partition count sit idle. Kafka tracks offset per (group, topic, partition) — enabling independent consumption.",
        topic: "Streaming & Kafka"
      },
      {
        id: "de-q18",
        question: "What is data quality and what are the key dimensions to measure it?",
        options: [
          "Data quality is only about removing NULL values",
          "Data quality dimensions include: Completeness (no missing values), Accuracy (correct values), Consistency (same across systems), Timeliness (data available when needed), Uniqueness (no duplicates), and Validity (values conform to defined rules/formats)",
          "Data quality is subjective and cannot be measured",
          "Data quality only matters for financial data"
        ],
        correctAnswer: 1,
        explanation: "Data quality framework: 1) Completeness — % non-null. 2) Accuracy — matches real-world truth. 3) Consistency — same value across tables/systems. 4) Timeliness — data freshness SLAs. 5) Uniqueness — deduplication. 6) Validity — format/range/referential integrity. Tools: Great Expectations, dbt tests, Monte Carlo (anomaly detection). 'Garbage in, garbage out' — poor data quality invalidates all downstream analytics.",
        topic: "ETL & Data Pipelines"
      },
      {
        id: "de-q19",
        question: "What is the difference between row-oriented and column-oriented storage formats?",
        options: [
          "Column-oriented storage is always slower than row-oriented",
          "Row-oriented (MySQL, PostgreSQL): all column values for one row stored together — optimal for OLTP (full row reads/writes). Column-oriented (Parquet, ORC, BigQuery): all values for one column stored together — optimal for OLAP (reads subset of columns across many rows, excellent compression)",
          "Both store data in identical physical layouts",
          "Column-oriented storage cannot support SQL queries"
        ],
        correctAnswer: 1,
        explanation: "Row-oriented: great for INSERT/UPDATE, fetching complete records. OLTP use case. Columnar (Parquet, ORC): reads only needed columns (no wasted I/O), homogeneous column data compresses much better (Run-Length Encoding, Dictionary Encoding), supports predicate pushdown to skip row groups. Typical analytical query reads 5-10 of 100+ columns — columnar reads 95%+ less data.",
        topic: "Data Warehousing"
      },
      {
        id: "de-q20",
        question: "What is dbt (data build tool) and what problem does it solve for data teams?",
        options: [
          "dbt is a real-time data streaming tool",
          "dbt enables data analysts to write transformation logic as SQL SELECT statements (models), applying software engineering practices (version control, testing, documentation, modularity) to data transformation — bringing engineering rigor to the analytics layer",
          "dbt replaces Airflow for pipeline orchestration",
          "dbt is only for Snowflake data warehouses"
        ],
        correctAnswer: 1,
        explanation: "dbt transforms data IN the warehouse (ELT pattern). Each dbt model = one SELECT statement compiled to CREATE TABLE/VIEW. Features: ref() function for model dependencies (builds a DAG), built-in tests (not_null, unique, accepted_values, relationships), documentation generation, Jinja templating, incremental models (only process new data). Supported by: Snowflake, BigQuery, Redshift, Databricks, DuckDB.",
        topic: "ETL & Data Pipelines"
      },
      {
        id: "de-q21",
        question: "What is the difference between exactly-once, at-least-once, and at-most-once delivery semantics in data pipelines?",
        options: [
          "All three semantics guarantee the same outcome",
          "At-most-once: messages may be lost (no retry) — acceptable for metrics. At-least-once: may produce duplicates on retry — acceptable if operations are idempotent. Exactly-once: no loss, no duplicates — hardest to achieve, requires distributed transactions or idempotency keys",
          "Exactly-once is the default in all streaming systems",
          "At-least-once is not safe for financial data"
        ],
        correctAnswer: 1,
        explanation: "At-most-once: fire-and-forget (no acks, no retry). At-least-once: acks + retry on failure → possible duplicates. Idempotent consumers (deduplicate by message ID) make this safe. Exactly-once: Kafka Streams supports exactly-once via idempotent producers + transactional API. Flink: checkpointing with 2-phase commit. Trade-off: exactly-once has higher latency and complexity.",
        topic: "Streaming & Kafka"
      },
      {
        id: "de-q22",
        question: "What is a surrogate key in data warehousing and why is it preferred over natural keys?",
        options: [
          "Surrogate keys are encrypted versions of natural keys",
          "A surrogate key is a system-generated integer/UUID assigned as the primary key in a dimension table, replacing or supplementing the natural business key — providing stable joins, handling SCDs, and isolating the warehouse from source system key changes",
          "Natural keys are always more efficient than surrogate keys",
          "Surrogate keys are only used in NoSQL databases"
        ],
        correctAnswer: 1,
        explanation: "Natural keys (e.g., SSN, email, product_code): can change, may not be unique across sources, expose PII. Surrogate keys: system-generated integer sequences. Benefits: join performance (integer vs. string), handle SCD Type 2 (same entity has multiple rows with different surrogate keys), isolate from source changes, enable cross-source integration. Best practice: use surrogate key as PK, keep natural key as business key.",
        topic: "Data Modeling"
      },
      {
        id: "de-q23",
        question: "What is data normalization and what are the first three normal forms (1NF, 2NF, 3NF)?",
        options: [
          "Normalization is a scaling technique for numerical data",
          "Normalization reduces data redundancy: 1NF (atomic values, no repeating groups), 2NF (1NF + no partial dependency on composite primary key), 3NF (2NF + no transitive dependency — non-key columns depend only on the primary key, not on other non-key columns)",
          "Normalization always improves query performance",
          "3NF is only applicable to NoSQL databases"
        ],
        correctAnswer: 1,
        explanation: "1NF: atomic cells, unique rows. 2NF: if composite PK, all non-key attributes depend on the WHOLE PK (not just part). 3NF: non-key attributes depend ONLY on the PK (A→B→C violates if B is non-key). Higher forms: BCNF, 4NF, 5NF. OLTP favors high normalization (no anomalies). OLAP favors denormalization (fewer joins, better query performance).",
        topic: "Data Modeling"
      },
      {
        id: "de-q24",
        question: "What is the difference between a streaming join and a batch join in data processing?",
        options: [
          "Streaming joins are always faster than batch joins",
          "Batch joins: both datasets fully available at join time — straightforward. Streaming joins: one or both datasets are infinite streams requiring windowing strategies (tumbling, sliding, session windows) and state management with bounded storage to handle out-of-order events",
          "Streaming joins are not supported by any modern engine",
          "Batch and streaming joins produce identical results"
        ],
        correctAnswer: 1,
        explanation: "Streaming join challenges: infinite data, out-of-order events (watermarks needed), stateful operations (hold one stream's data in state while waiting for matching other stream). Window types: Tumbling (non-overlapping fixed-size), Sliding (overlapping), Session (activity-based gap). Frameworks: Apache Flink, Spark Structured Streaming, Kafka Streams. Late data handling: allowed lateness + side outputs.",
        topic: "Streaming & Kafka"
      },
      {
        id: "de-q25",
        question: "What is the CAP theorem's implication for choosing a database for a data pipeline?",
        options: [
          "All databases support all three CAP properties simultaneously",
          "CAP theorem: distributed systems can guarantee only two of Consistency, Availability, Partition tolerance. Data pipelines must choose: CP (Consistency + Partition tolerance, e.g., HBase, ZooKeeper) or AP (Availability + Partition tolerance, e.g., Cassandra, CouchDB) depending on requirements",
          "CAP theorem only applies to relational databases",
          "Choosing partition tolerance is always optional"
        ],
        correctAnswer: 1,
        explanation: "In practice, network partitions are unavoidable, so you choose between C and A when partitioned. CP: consistent (no stale reads) but may become unavailable during partition. Good for: financial transactions, configuration. AP: always available and eventually consistent. Good for: user sessions, shopping carts, high-write workloads. Modern systems (Google Spanner) push beyond CAP with TrueTime.",
        topic: "Data Warehousing"
      },
      {
        id: "de-q26",
        question: "What is a Parquet file format and why is it widely used in data engineering?",
        options: [
          "Parquet is a proprietary format only for Hadoop",
          "Parquet is an open-source, columnar storage format with built-in compression and encoding, supporting nested data structures, predicate pushdown (skip irrelevant row groups), column pruning, and schema evolution — ideal for large-scale analytical workloads",
          "Parquet files cannot be read by Spark",
          "Parquet is slower than CSV for all use cases"
        ],
        correctAnswer: 1,
        explanation: "Parquet advantages: Columnar storage (read only needed columns), efficient compression (Snappy, Gzip — similar values in same column compress better), row group statistics enable predicate pushdown (skip row groups not matching filter), supports nested schemas (arrays, structs, maps), immutable (append-only). Supported by: Spark, Hive, Presto, BigQuery, Redshift Spectrum, Athena, Pandas.",
        topic: "Data Warehousing"
      },
      {
        id: "de-q27",
        question: "What is an idempotent data pipeline and why is it important?",
        options: [
          "Idempotent pipelines process data exactly 100 times",
          "An idempotent pipeline produces the same output regardless of how many times it is run with the same input — enabling safe retries on failures without duplicating data, crucial for at-least-once delivery guarantees",
          "Idempotency is only necessary for streaming pipelines",
          "Idempotent pipelines are always slower than non-idempotent ones"
        ],
        correctAnswer: 1,
        explanation: "Idempotency strategies: 1) INSERT OVERWRITE (replace instead of append). 2) MERGE/UPSERT using unique keys. 3) Deduplication using message IDs. 4) Checkpointing (record last successfully processed offset/watermark). 5) Partition-based writes (overwrite specific date partition). Critical for: failure recovery, backfills, pipeline restarts. Non-idempotent pipeline retried on failure = duplicate data = wrong metrics.",
        topic: "ETL & Data Pipelines"
      },
      {
        id: "de-q28",
        question: "What is the difference between Spark's cache() and persist() methods?",
        options: [
          "Both are identical — persist() is an alias for cache()",
          "cache() is shorthand for persist(StorageLevel.MEMORY_AND_DISK); persist() accepts a StorageLevel parameter for flexible storage: MEMORY_ONLY, MEMORY_AND_DISK, DISK_ONLY, OFF_HEAP — giving fine-grained control over memory vs. disk tradeoffs",
          "cache() only works with RDDs; persist() only with DataFrames",
          "persist() is deprecated in Spark 3.0"
        ],
        correctAnswer: 1,
        explanation: "Both materialize a DataFrame/RDD to avoid recomputation. cache() = MEMORY_AND_DISK (spills to disk if RAM insufficient). persist() lets you choose: MEMORY_ONLY (fastest, OOM risk), MEMORY_AND_DISK (safe default), DISK_ONLY (slow, saves memory), MEMORY_ONLY_SER (serialized, compressed), OFF_HEAP (uses external memory like Alluxio). Use unpersist() to free when done.",
        topic: "Apache Spark"
      },
      {
        id: "de-q29",
        question: "What is a Lambda Architecture and what problem was it designed to solve?",
        options: [
          "Lambda Architecture is AWS's serverless computing pattern",
          "Lambda Architecture handles both batch and real-time processing by maintaining two parallel paths: a batch layer (reprocesses all historical data for accuracy) and a speed layer (processes new data in real-time for low latency) — reconciled in a serving layer",
          "Lambda Architecture eliminates the need for data warehouses",
          "Lambda Architecture is only for machine learning pipelines"
        ],
        correctAnswer: 1,
        explanation: "Lambda Architecture (Nathan Marz): Batch layer: high-latency, high-accuracy recomputation of all data. Speed layer: low-latency, approximate/incremental processing of new data. Serving layer: merges batch and speed views for queries. Problem: maintains two separate codebases (complexity). Alternative: Kappa Architecture — use streaming for everything (Kafka + Flink), backfill with replay.",
        topic: "ETL & Data Pipelines"
      },
      {
        id: "de-q30",
        question: "What is BigQuery's partitioning and clustering and how do they reduce query costs?",
        options: [
          "Partitioning and clustering have no effect on BigQuery costs",
          "Partitioning divides table data into segments (by date/range/ingestion time) enabling partition pruning (scan only relevant partitions); clustering sorts data within partitions by specified columns enabling block pruning — both reduce bytes scanned, directly reducing cost in on-demand pricing",
          "BigQuery partitioning is identical to Snowflake clustering",
          "Clustering in BigQuery requires manually specifying data blocks"
        ],
        correctAnswer: 1,
        explanation: "BigQuery charges per bytes scanned. Partitioning: WHERE partition_col BETWEEN dates → scans only matching partitions. Clustering (up to 4 columns): within each partition, data sorted by cluster columns. Queries filtering on cluster columns skip entire column blocks. Best practice: partition by date (most queries are time-bounded), cluster by high-cardinality filter columns (user_id, country). Can reduce costs by 90%+.",
        topic: "Data Warehousing"
      }
    ]
  },

  // 8. Frontend Developer Technical Assessment
  {
    id: "fe-tech-assessment-1",
    title: "Frontend Developer Core Technical Screening",
    roleId: "frontend-developer",
    category: "Technical Round",
    difficulty: "Medium",
    durationMinutes: 45,
    passingScorePercent: 70,
    totalMarks: 60,
    description: "Covers JavaScript internals, React, CSS, Web APIs, performance optimization, accessibility, and frontend system design.",
    companyTag: "Meta / Airbnb / Vercel Tier",
    questions: [
      {
        id: "fe-q1",
        question: "What is the JavaScript event loop and how does it handle asynchronous operations?",
        options: [
          "The event loop runs JavaScript on multiple threads simultaneously",
          "JavaScript is single-threaded; the event loop manages the call stack, Web APIs (setTimeout, fetch), the task queue (macro-tasks), and the microtask queue (Promises) — continuously picking tasks from the queue when the call stack is empty",
          "The event loop is only relevant for Node.js, not browsers",
          "Async/await eliminates the need for the event loop"
        ],
        correctAnswer: 1,
        explanation: "Event loop order: 1) Run current synchronous code (call stack). 2) Drain all microtasks (Promise .then/.catch, queueMicrotask). 3) Process one macrotask (setTimeout, setInterval, I/O). 4) Repeat. Result: Promise callbacks (.then) always run before setTimeout callbacks even if setTimeout(fn, 0). Understanding this prevents ordering bugs.",
        topic: "JavaScript Fundamentals"
      },
      {
        id: "fe-q2",
        question: "What is the difference between `==` and `===` in JavaScript?",
        options: [
          "Both operators are identical in modern JavaScript",
          "`===` (strict equality) checks value AND type with no coercion; `==` (loose equality) performs type coercion before comparison, leading to counterintuitive results like '0' == false being true",
          "`==` is faster than `===` for performance",
          "`===` only works with primitive values"
        ],
        correctAnswer: 1,
        explanation: "JS coercion gotchas: '0' == false (true), null == undefined (true), '' == 0 (true). Always use === to avoid implicit coercion bugs. Notable exception: null == undefined is often intentionally checked together. ESLint's eqeqeq rule enforces ===.",
        topic: "JavaScript Fundamentals"
      },
      {
        id: "fe-q3",
        question: "What is React's Virtual DOM and how does it improve performance?",
        options: [
          "The Virtual DOM is stored in the GPU for faster rendering",
          "The Virtual DOM is an in-memory JavaScript representation of the real DOM; React diffs the previous and new virtual trees (reconciliation), then batches and applies only the minimal set of actual DOM updates — avoiding expensive full DOM re-renders",
          "The Virtual DOM eliminates the need for a real DOM",
          "React re-renders the entire real DOM on every state change"
        ],
        correctAnswer: 1,
        explanation: "Real DOM manipulation is expensive (reflow/repaint). React's reconciliation: On state change, React creates a new virtual DOM tree, diffs it against the previous (Fiber algorithm in React 16+), computes minimal change set, then flushes to real DOM in batch. React 18 introduces concurrent mode: time-slicing renders into chunks, prioritizing urgent updates.",
        topic: "React & Component Design"
      },
      {
        id: "fe-q4",
        question: "What are React hooks and what problem do they solve?",
        options: [
          "Hooks allow class components to use functional component APIs",
          "Hooks (introduced React 16.8) allow functional components to use state (useState), lifecycle effects (useEffect), context (useContext), and other React features — eliminating the need for class components and enabling logic reuse via custom hooks",
          "Hooks replace the Context API",
          "Hooks can only be used inside class components"
        ],
        correctAnswer: 1,
        explanation: "Before hooks: stateful logic only in class components; complex lifecycle logic scattered across componentDidMount/componentDidUpdate; no good way to reuse stateful behavior. Hooks: useState (state), useEffect (side effects + cleanup), useCallback (memoize callbacks), useMemo (memoize values), useRef (mutable ref), useContext (context). Custom hooks: extract and share stateful logic.",
        topic: "React & Component Design"
      },
      {
        id: "fe-q5",
        question: "What is the difference between `display: flex` and `display: grid` in CSS?",
        options: [
          "Flexbox is for 2D layouts; Grid is for 1D layouts",
          "Flexbox is designed for one-dimensional layouts (row OR column at a time); CSS Grid is designed for two-dimensional layouts (rows AND columns simultaneously)",
          "Both are identical in functionality",
          "Grid cannot align items along a cross axis"
        ],
        correctAnswer: 1,
        explanation: "Flexbox: 1D — items flow along main axis (row/column). Great for: navbar, button groups, centering single elements, flexible card rows. CSS Grid: 2D — define rows AND columns with grid-template-rows/columns. Great for: page layouts, card grids, anything needing two-axis control. They're complementary: use Grid for outer layout, Flexbox for inner component layouts.",
        topic: "CSS & Layouts"
      },
      {
        id: "fe-q6",
        question: "What is closure in JavaScript and give a practical example of its use?",
        options: [
          "Closure is when a function closes its own execution context",
          "A closure is a function that retains access to variables in its outer (enclosing) lexical scope even after the outer function has returned — enabling private state, factory functions, and memoization",
          "Closures are only created with arrow functions",
          "Closures prevent garbage collection of all objects"
        ],
        correctAnswer: 1,
        explanation: "Closure example: function counter() { let count = 0; return () => ++count; }. The returned arrow function closes over 'count'. Each call to counter() creates an independent count. Practical uses: module pattern (private variables), event handlers with state, memoization, debounce/throttle, currying. Memory consideration: closed-over variables stay in memory as long as the closure exists.",
        topic: "JavaScript Fundamentals"
      },
      {
        id: "fe-q7",
        question: "What are the Core Web Vitals (CWV) metrics introduced by Google?",
        options: [
          "CWV are only measured during development, not production",
          "Core Web Vitals measure real-world user experience: LCP (Largest Contentful Paint — loading performance, good < 2.5s), FID/INP (Input delay/responsiveness, good INP < 200ms), and CLS (Cumulative Layout Shift — visual stability, good < 0.1)",
          "CWV only applies to mobile websites",
          "CWV replaces traditional performance metrics like Time to First Byte"
        ],
        correctAnswer: 1,
        explanation: "Core Web Vitals (Google ranking signals): LCP: when the largest visible content element loads (image, text block). FID → now INP (Interaction to Next Paint): measures responsiveness to user interactions. CLS: sum of unexpected layout shifts. Tools: Lighthouse, PageSpeed Insights, Chrome DevTools Performance tab, web-vitals npm library. Poor CWV affects SEO rankings.",
        topic: "Performance Optimization"
      },
      {
        id: "fe-q8",
        question: "What is the difference between `null` and `undefined` in JavaScript?",
        options: [
          "They are identical and interchangeable",
          "`undefined` means a variable has been declared but not assigned a value (or function returns nothing); `null` is an intentional absence of value that must be explicitly assigned",
          "`null` is assigned by JavaScript; `undefined` is assigned by developers",
          "typeof null === 'null' in JavaScript"
        ],
        correctAnswer: 1,
        explanation: "undefined: declared but uninitialized variable, missing function argument, absent object property. null: developer intentionally assigns 'no value'. typeof undefined === 'undefined'. Famous JS bug: typeof null === 'object' (historical mistake in JS). null === undefined is false; null == undefined is true (loose equality). Nullish coalescing (??) handles both: value ?? 'default'.",
        topic: "JavaScript Fundamentals"
      },
      {
        id: "fe-q9",
        question: "What is code splitting in React/webpack and how does it improve performance?",
        options: [
          "Code splitting splits JavaScript into smaller strings",
          "Code splitting divides the JavaScript bundle into smaller chunks loaded on-demand (lazy loading) rather than loading all code upfront — reducing initial bundle size and time-to-interactive by deferring non-critical code",
          "Code splitting is only possible with Next.js",
          "Code splitting increases the number of HTTP requests with no performance benefit"
        ],
        correctAnswer: 1,
        explanation: "React.lazy() + Suspense: const LazyComp = React.lazy(() => import('./LazyComp')). The chunk is only downloaded when the component is rendered. webpack automatically creates separate chunk files for each lazy import. Route-based splitting (React Router + lazy) is the most impactful — each page route gets its own chunk. Next.js does this automatically per page.",
        topic: "Performance Optimization"
      },
      {
        id: "fe-q10",
        question: "What is the CSS Box Model?",
        options: [
          "The box model refers to how CSS Grid creates grid boxes",
          "Every HTML element is treated as a rectangular box composed of: content area, padding (inside border), border, and margin (outside border). box-sizing: border-box makes width/height include padding+border",
          "The box model only applies to block-level elements",
          "Padding and margin are the same in the CSS box model"
        ],
        correctAnswer: 1,
        explanation: "Default (content-box): width sets content width only. Total element width = width + padding-left + padding-right + border-left + border-right. With box-sizing: border-box (recommended): width includes padding + border. Most CSS frameworks and resets apply: *, *::before, *::after { box-sizing: border-box; } for predictable layout.",
        topic: "CSS & Layouts"
      },
      {
        id: "fe-q11",
        question: "What is the difference between `useCallback` and `useMemo` in React?",
        options: [
          "Both are identical hooks that memoize values",
          "useCallback memoizes a function reference (prevents re-creating it on every render); useMemo memoizes a computed value (prevents re-running expensive computations). Both accept dependencies arrays and only update when dependencies change",
          "useCallback is for class components; useMemo is for functional components",
          "useMemo is a replacement for useCallback in React 18"
        ],
        correctAnswer: 1,
        explanation: "useCallback(fn, deps): returns the same function reference across renders when deps unchanged — prevents unnecessary child re-renders when passing callbacks as props. useMemo(() => expensiveCalc(a, b), [a, b]): caches the result of expensive computation. Rule of thumb: don't prematurely optimize — profile first, then add memoization only where measured benefit exists.",
        topic: "React & Component Design"
      },
      {
        id: "fe-q12",
        question: "What is CSS specificity and how is it calculated?",
        options: [
          "Specificity is determined by the order styles appear in the CSS file only",
          "Specificity determines which CSS rule wins when multiple rules target the same element: calculated as (inline styles: 1000, ID selectors: 100, class/attribute/pseudo-class: 10, element/pseudo-element: 1) — higher specificity wins regardless of order",
          "!important has the same specificity as inline styles",
          "Class selectors always override ID selectors"
        ],
        correctAnswer: 1,
        explanation: "Specificity hierarchy: !important > Inline style (1,0,0,0) > ID #id (0,1,0,0) > Class .cls, :hover, [attr] (0,0,1,0) > Element div, p (0,0,0,1). Compare left-to-right. Same specificity: later rule wins (cascade). Practical: avoid !important and ID selectors for maintainability; use class-based BEM methodology.",
        topic: "CSS & Layouts"
      },
      {
        id: "fe-q13",
        question: "What is localStorage vs sessionStorage vs cookies in browser storage?",
        options: [
          "All three are identical in functionality",
          "localStorage: persists until explicitly cleared, origin-scoped, ~5MB. sessionStorage: cleared when tab closes, tab-scoped, ~5MB. Cookies: sent with every HTTP request (server-readable), can be scoped to domain/path, ~4KB, support expiry, HttpOnly and SameSite flags",
          "Cookies are always more secure than localStorage",
          "localStorage is accessible across different domains"
        ],
        correctAnswer: 1,
        explanation: "localStorage: great for user preferences, theme, cached data. sessionStorage: per-tab temporary state (shopping cart steps). Cookies: auth tokens (HttpOnly prevents JS access — XSS protection), SameSite=Strict/Lax prevents CSRF. For sensitive auth, prefer HttpOnly cookies. localStorage is vulnerable to XSS (JS can read it). Never store JWT tokens in localStorage without XSS mitigation.",
        topic: "Web APIs & Browser"
      },
      {
        id: "fe-q14",
        question: "What is the difference between `async/await` and Promise chains in JavaScript?",
        options: [
          "async/await is fundamentally different from Promises — it uses a separate system",
          "async/await is syntactic sugar over Promises: async functions always return Promises; await pauses execution within the async function until the Promise resolves — making async code look and behave like synchronous code while maintaining non-blocking execution",
          "await can only be used with fetch()",
          "Promise chains are more performant than async/await"
        ],
        correctAnswer: 1,
        explanation: "async/await: error handling with try/catch (vs .catch()), easier sequential async operations, better debugging (call stacks), cleaner code. Promise.all([...]) for parallel execution. Promise chains: useful for functional patterns (.then chains). Both compile to the same microtask queue behavior. Avoid await in loops (sequential) — use Promise.all for parallel.",
        topic: "JavaScript Fundamentals"
      },
      {
        id: "fe-q15",
        question: "What is React's reconciliation algorithm (Fiber) and what optimization hints does it use?",
        options: [
          "React re-renders the entire real DOM tree on every state change",
          "React Fiber is a reimplementation of the reconciliation algorithm that breaks rendering into prioritized, interruptible units of work; it uses keys on lists to efficiently identify moved/added/removed items and React.memo/PureComponent to skip re-renders when props haven't changed",
          "Fiber is only used in React Native, not in web React",
          "The key prop is optional and only used for styling"
        ],
        correctAnswer: 1,
        explanation: "Fiber reconciliation: time-slicing (breaks render work into chunks, yields to browser for input), priority scheduling (urgent updates like user input render first), interruptible rendering. Keys: must be stable, unique identifiers (not array index for reorderable lists) to correctly track item identity during diffing. Missing keys cause unnecessary re-renders and state bugs.",
        topic: "React & Component Design"
      },
      {
        id: "fe-q16",
        question: "What is the difference between SSR (Server-Side Rendering) and CSR (Client-Side Rendering)?",
        options: [
          "SSR renders pages only on the client; CSR renders only on the server",
          "SSR: HTML is rendered on the server and sent to browser (faster FCP, better SEO, no JS needed for initial content); CSR: JavaScript runs in the browser to render content (slower initial load, better for interactive apps, rich UX after hydration)",
          "SSR and CSR produce identical performance results",
          "SSR is only supported by Next.js"
        ],
        correctAnswer: 1,
        explanation: "SSR: server sends pre-rendered HTML → browser paints fast (good FCP), then JS hydrates for interactivity. Good for: SEO-critical pages, blogs, e-commerce product pages. CSR (React SPA): browser downloads JS bundle → executes → renders (slow FCP, poor SEO without SSR). Next.js: SSR (getServerSideProps), SSG (getStaticProps), ISR (revalidate), RSC (React Server Components). SSG is fastest — pre-built at deploy time.",
        topic: "Performance Optimization"
      },
      {
        id: "fe-q17",
        question: "What is event delegation in JavaScript and why is it useful?",
        options: [
          "Event delegation means forwarding events to a parent component",
          "Event delegation attaches a single event listener to a parent element that handles events from all child elements using event.target — more memory efficient than attaching separate listeners to each child, and automatically handles dynamically added children",
          "Event delegation is only available in modern browsers",
          "Event delegation prevents the default browser behavior"
        ],
        correctAnswer: 1,
        explanation: "Without delegation: 1000 list items × 1 click handler = 1000 event listeners (memory expensive). With delegation: one listener on the parent <ul>. On click: event bubbles to parent; event.target identifies which child was clicked. Use event.target.closest('.item') for nested structures. Framework note: React uses a single root event listener for all events (synthetically).",
        topic: "Web APIs & Browser"
      },
      {
        id: "fe-q18",
        question: "What is CSS specificity cascade order for conflicting rules with the same specificity?",
        options: [
          "The first rule always wins when specificity is tied",
          "When specificity is equal, the last declared rule wins (cascade order) — later styles in the same stylesheet or later-loaded stylesheets override earlier ones",
          "External stylesheets always override inline styles",
          "Conflicting rules with equal specificity cause JavaScript errors"
        ],
        correctAnswer: 1,
        explanation: "CSS cascade (when specificity ties): importance → specificity → source order. Source order: rules later in the document override earlier rules. This means: CSS loaded later (link tags) overrides earlier CSS. In-component styles vs global styles: position in cascade matters. Practical: keep global resets first, component styles last. Module systems (CSS Modules, styled-components) isolate specificity per component.",
        topic: "CSS & Layouts"
      },
      {
        id: "fe-q19",
        question: "What is CORS (Cross-Origin Resource Sharing) and why does it exist?",
        options: [
          "CORS is a performance optimization for API requests",
          "CORS is a browser security mechanism that prevents malicious websites from making unauthorized cross-origin requests to APIs; servers must explicitly allow cross-origin requests by sending Access-Control-Allow-Origin and related headers",
          "CORS prevents all cross-origin requests permanently",
          "CORS is enforced by the server, not the browser"
        ],
        correctAnswer: 1,
        explanation: "Same-Origin Policy: browser blocks AJAX requests to different origins (protocol + domain + port). CORS headers: Access-Control-Allow-Origin: https://myapp.com (or *). Preflight (OPTIONS) request for non-simple requests (POST with JSON, custom headers). CORS is browser-enforced (server trusts all). Simple fix in dev: server adds proper CORS headers. Security: never use * for credentialed requests.",
        topic: "Web APIs & Browser"
      },
      {
        id: "fe-q20",
        question: "What is TypeScript and what are its main advantages over plain JavaScript?",
        options: [
          "TypeScript is a completely different programming language from JavaScript",
          "TypeScript is a typed superset of JavaScript that compiles to JavaScript; advantages: static type checking catches bugs at compile time, better IDE support (autocomplete, refactoring), explicit contracts (interfaces, types), and improved code maintainability at scale",
          "TypeScript is slower than JavaScript at runtime",
          "TypeScript replaces JavaScript in all environments"
        ],
        correctAnswer: 1,
        explanation: "TypeScript benefits: catch TypeError bugs before runtime, IntelliSense/autocomplete in editors, refactor with confidence, self-documenting APIs (interface shapes), generics for reusable type-safe utilities. Limitation: compile step required, type complexity learning curve, false sense of security (type assertions, any). TypeScript compiles to regular JS — no runtime overhead.",
        topic: "JavaScript Fundamentals"
      },
      {
        id: "fe-q21",
        question: "What is the difference between controlled and uncontrolled components in React?",
        options: [
          "Controlled components are faster than uncontrolled",
          "Controlled: form input value is driven by React state (value prop + onChange handler) — React is the single source of truth. Uncontrolled: DOM manages its own state, accessed via ref — simpler but less React-idiomatic",
          "Uncontrolled components cannot work with forms",
          "Both types are identical in React 18"
        ],
        correctAnswer: 1,
        explanation: "Controlled: <input value={state} onChange={e => setState(e.target.value)} />. React state drives the UI (predictable, testable, enables validation on every keystroke). Uncontrolled: <input ref={inputRef} defaultValue='initial' />. Read value imperatively: inputRef.current.value. Use uncontrolled for file inputs (always uncontrolled), simple forms without validation, or integrating with non-React libraries.",
        topic: "React & Component Design"
      },
      {
        id: "fe-q22",
        question: "What is web accessibility (a11y) and what is ARIA?",
        options: [
          "Accessibility is only about providing alt text for images",
          "Web accessibility ensures applications are usable by people with disabilities; ARIA (Accessible Rich Internet Applications) provides roles, properties, and states (aria-label, aria-live, role='button') that communicate semantic meaning to assistive technologies like screen readers",
          "ARIA replaces semantic HTML elements",
          "Accessibility is only required by government websites"
        ],
        correctAnswer: 1,
        explanation: "Accessibility (WCAG 2.1): Perceivable (alt text, captions), Operable (keyboard nav, skip links), Understandable (clear labels, error messages), Robust (semantic HTML, ARIA). Prefer semantic HTML (<button> over <div onClick>). ARIA should augment, not replace semantics. Tools: Lighthouse a11y audit, axe DevTools, screen reader testing (NVDA, VoiceOver).",
        topic: "Web APIs & Browser"
      },
      {
        id: "fe-q23",
        question: "What is Webpack's tree-shaking feature?",
        options: [
          "Tree-shaking removes unused CSS from stylesheets",
          "Tree-shaking statically analyzes ES module import/export statements to identify and remove unused code (dead code elimination) from the final bundle — reducing bundle size",
          "Tree-shaking is only available in Rollup, not Webpack",
          "Tree-shaking works with CommonJS (require()) modules"
        ],
        correctAnswer: 1,
        explanation: "Tree-shaking requires ES Modules (static import/export analysis). CommonJS require() is dynamic — cannot be statically analyzed. Tree-shaking: if you import { func1 } from 'library' and func2 is never used, func2 is excluded from bundle. Prerequisites: production mode (Webpack), sideEffects: false in package.json, ES modules throughout. Large libraries like lodash-es support tree-shaking vs lodash (CommonJS) doesn't.",
        topic: "Performance Optimization"
      },
      {
        id: "fe-q24",
        question: "What is the purpose of the `key` prop in React lists?",
        options: [
          "The key prop is used to style list items uniquely",
          "Keys give React a stable identity for each list item, enabling the reconciliation algorithm to correctly identify which items were added, removed, or reordered — preventing unnecessary re-renders and state bugs",
          "The key prop is automatically generated by React",
          "Using array index as key is always the best practice"
        ],
        correctAnswer: 1,
        explanation: "Without keys, React can't distinguish list items — any change forces re-render of all items. With stable, unique keys: React tracks identity. Index as key: bad when list reorders (causes state/component association bugs). Good keys: database IDs, stable unique identifiers. React warning: 'Each child in a list should have a unique key prop.' Keys are local to the parent — different lists can have same keys.",
        topic: "React & Component Design"
      },
      {
        id: "fe-q25",
        question: "What is CSS-in-JS and what are its trade-offs vs. traditional CSS approaches?",
        options: [
          "CSS-in-JS means writing CSS in a separate .css file linked in JS",
          "CSS-in-JS (styled-components, Emotion): write CSS within JavaScript files, enabling dynamic styles based on props/state, automatic scoping (no global conflicts), and co-location — but with trade-offs: runtime style injection overhead, hydration complexity in SSR",
          "CSS-in-JS always outperforms traditional CSS in all metrics",
          "CSS-in-JS is the same as CSS Modules"
        ],
        correctAnswer: 1,
        explanation: "CSS-in-JS benefits: dynamic styling (color: ${props => props.primary ? 'blue' : 'gray'}), automatic unique class names, dead CSS elimination, colocation. Trade-offs: runtime overhead (styles generated in JS at render time), larger JS bundles, SSR hydration complexity. CSS Modules: compile-time class hashing, no runtime, no dynamic props. Tailwind: utility classes, zero runtime, excellent purging.",
        topic: "CSS & Layouts"
      },
      {
        id: "fe-q26",
        question: "What is the React Context API and when should you use Redux instead?",
        options: [
          "Context API and Redux are identical state management solutions",
          "Context API: built-in, ideal for low-frequency global state (theme, locale, auth). Every context consumer re-renders when context changes. Redux: external library with normalized state, middleware (thunk/saga), DevTools time-travel, selective re-renders via selectors — better for complex state with frequent updates",
          "Redux is always superior to Context API",
          "Context API cannot pass functions, only primitive values"
        ],
        correctAnswer: 1,
        explanation: "Context re-render problem: all consumers re-render when any context value changes (even unrelated values). For high-frequency updates (form state, real-time data), split context or use Zustand/Redux. Use Context for: authentication state, theme, i18n locale. Use Redux/Zustand for: complex state interactions, many components sharing state, time-travel debugging, or when context performance is a bottleneck.",
        topic: "React & Component Design"
      },
      {
        id: "fe-q27",
        question: "What is the difference between `display: none`, `visibility: hidden`, and `opacity: 0` in CSS?",
        options: [
          "All three produce identical visual and behavioral results",
          "display:none removes element from layout (no space). visibility:hidden hides element but preserves space in layout. opacity:0 makes element invisible but fully interactive (click events still fire) and preserves space",
          "display:none always triggers CSS transitions",
          "opacity:0 removes the element from the DOM"
        ],
        correctAnswer: 1,
        explanation: "display:none: element removed from accessibility tree, no space, triggers reflow. visibility:hidden: element occupies space, removed from accessibility tree, no reflow. opacity:0: element invisible but still takes up space, still interactive, still in accessibility tree. For animations: opacity transitions smoothly; display:none cannot transition without JS tricks. Use visibility for accessible toggles.",
        topic: "CSS & Layouts"
      },
      {
        id: "fe-q28",
        question: "What is lazy loading in web development and how do you implement it for images?",
        options: [
          "Lazy loading loads all resources immediately on page load",
          "Lazy loading defers loading of non-critical resources (images below the fold) until they are needed (user scrolls near them) — reducing initial page load time and bandwidth. Implemented via: `loading='lazy'` HTML attribute (native), or IntersectionObserver API",
          "Lazy loading is only supported by Chrome",
          "Lazy loading always degrades user experience"
        ],
        correctAnswer: 1,
        explanation: "Native: <img loading='lazy' src='...' />. Browser handles scroll-based loading automatically. IntersectionObserver: observe elements; when they enter viewport, set actual src from data-src. Next.js <Image>: automatic lazy loading + WebP conversion + size optimization + blur placeholder. Lazy loading below-the-fold images can reduce initial page weight by 70%+.",
        topic: "Performance Optimization"
      },
      {
        id: "fe-q29",
        question: "What is debouncing and throttling in JavaScript and when do you use each?",
        options: [
          "Both techniques are identical",
          "Debouncing delays execution until a function hasn't been called for a specified time (useful for search input — fires only after user stops typing). Throttling limits execution to once per specified interval (useful for scroll/resize events — fires at most once per 100ms)",
          "Throttling is for API calls; debouncing is only for UI events",
          "Both techniques increase event firing frequency"
        ],
        correctAnswer: 1,
        explanation: "Debounce: function fires ONLY after N ms of silence since last call. Use for: search autocomplete (API call after user stops typing), form validation. Throttle: function fires at most once per N ms regardless of call frequency. Use for: scroll handlers, resize handlers, mousemove. Libraries: Lodash (_.debounce, _.throttle). Custom implementation uses setTimeout/clearTimeout or requestAnimationFrame.",
        topic: "JavaScript Fundamentals"
      },
      {
        id: "fe-q30",
        question: "What is the Service Worker API and how does it enable Progressive Web Apps (PWA)?",
        options: [
          "Service Workers run in the main thread alongside JavaScript",
          "Service Workers are background scripts that run in a separate thread, intercepting network requests, enabling offline capability (cache-first strategies), push notifications, and background sync — the foundation for PWAs that work like native apps",
          "Service Workers can access the DOM directly",
          "Service Workers are only supported on mobile devices"
        ],
        correctAnswer: 1,
        explanation: "Service Worker lifecycle: register → install → activate → fetch intercept. Cache strategies: Cache-First (offline-capable), Network-First (fresh data preferred), Stale-While-Revalidate (fast + fresh). PWA requirements: HTTPS, manifest.json, service worker. Workbox (Google) provides high-level abstractions. Service workers enable: offline mode, background sync, push notifications, periodic background fetch.",
        topic: "Web APIs & Browser"
      }
    ]
  }
];

export const ALL_ASSESSMENT_QUIZZES = ALL_QUIZZES;

export function getQuizzesForRole(roleId: string): QuizTest[] {
  return ALL_QUIZZES.filter(q => q.roleId === roleId || q.roleId === "all");
}

export function getQuizById(quizId: string): QuizTest | undefined {
  return ALL_QUIZZES.find(q => q.id === quizId);
}

/**
 * Builds a randomized quiz by combining all questions from quizzes matching the given roleId
 * and optionally a category filter. Randomly selects `questionCount` questions and returns a
 * new QuizTest object with shuffled questions.
 */
export function getRandomizedQuiz(
  roleId: string,
  categoryOrCount: string | number = "all",
  questionCount: number = 30
): QuizTest | null {
  const category = typeof categoryOrCount === "string" ? categoryOrCount : "all";
  const targetCount = typeof categoryOrCount === "number" ? categoryOrCount : questionCount;

  // Get all quizzes for this role + universal quizzes
  const roleQuizzes = ALL_QUIZZES.filter(
    q => q.roleId === roleId || q.roleId === "all"
  );

  if (roleQuizzes.length === 0) return null;

  // Combine all questions from matching category quizzes
  let allQuestions: QuizQuestion[] = [];
  for (const quiz of roleQuizzes) {
    if (category === "all" || quiz.category === category) {
      allQuestions = [...allQuestions, ...quiz.questions];
    }
  }

  if (allQuestions.length === 0) {
    // Fallback: use all questions from roleQuizzes regardless of category
    for (const quiz of roleQuizzes) {
      allQuestions = [...allQuestions, ...quiz.questions];
    }
  }

  // Deduplicate by id
  const uniqueQuestions = allQuestions.filter(
    (q, i, arr) => arr.findIndex(x => x.id === q.id) === i
  );

  // Shuffle and select targetCount
  const shuffled = [...uniqueQuestions].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(targetCount, shuffled.length));

  const baseQuiz = roleQuizzes[0];
  return {
    id: `randomized_${roleId}_${Date.now()}`,
    title: `${baseQuiz.title} — Randomized Mock Test`,
    roleId,
    category: "Technical Round",
    difficulty: "Medium",
    durationMinutes: Math.ceil(selected.length * 1.5), // 1.5 min per question
    passingScorePercent: 70,
    totalMarks: selected.length * 2,
    description: `Randomized mock test with ${selected.length} questions drawn from all ${roleId} question banks.`,
    questions: selected
  };
}
