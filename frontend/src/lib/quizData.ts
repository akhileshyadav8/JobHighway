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
  roleId: string; // "software-engineer" | "data-analyst" | "data-scientist" | "all"
  category: "Technical Round" | "Aptitude Round" | "HR & Behavioral Round" | "Company Specific";
  difficulty: "Easy" | "Medium" | "Hard";
  durationMinutes: number;
  passingScorePercent: number;
  totalMarks: number;
  description: string;
  companyTag?: string;
  questions: QuizQuestion[];
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
    durationMinutes: 15,
    passingScorePercent: 70,
    totalMarks: 50,
    description: "Standard screening test covering Data Structures, OOP, OS processes, and Database indexing.",
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
    durationMinutes: 15,
    passingScorePercent: 70,
    totalMarks: 50,
    description: "Evaluates SQL window functions, CTEs, aggregation mechanics, and cohort retention metrics.",
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
    durationMinutes: 12,
    passingScorePercent: 60,
    totalMarks: 50,
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
        explanation: "These are squares of consecutive prime numbers: 2^2 (4), 3^2 (9), 5^2 (25), 7^2 (49), 11^2 (121), 13^2 (169). The next prime is 17, and 17^2 = 289.",
        topic: "Number Series & Patterns"
      },
      {
        id: "apt-q5",
        question: "A shopkeeper marks an item 40% above cost price and allows a 20% discount. What is his net profit percentage?",
        options: ["12%", "15%", "18%", "20%"],
        correctAnswer: 0,
        explanation: "Let CP = 100. Marked Price = 140. Selling Price after 20% discount = 140 * 0.8 = 112. Profit = (112 - 100) = 12%.",
        topic: "Profit & Loss"
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
    durationMinutes: 10,
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
