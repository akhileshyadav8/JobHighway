"use client";

import React, { useState, useMemo } from "react";
import {
  X,
  Search,
  BookOpen,
  Filter,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Code2,
  Database,
  Building2,
  Award,
  Zap,
  Layers,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { PrepRole, PREP_COMPANIES, PracticeQuestion } from "@/lib/preparationData";
import { ALL_CODING_PROBLEMS } from "@/lib/codingProblemsData";
import { ALL_SQL_PROBLEMS } from "@/lib/sqlProblemsData";

export interface VaultQuestionItem {
  id: string;
  title: string;
  category: "DSA" | "System Design" | "SQL" | "Aptitude" | "Behavioral" | "Company Specific";
  difficulty: "Easy" | "Medium" | "Hard";
  topics: string[];
  companies: string[];
  questionText: string;
  solutionHint: string;
  codeProblemId?: string;
  sqlProblemId?: string;
}

interface QuestionVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRole: PrepRole;
  initialCategory?: string;
  onOpenCodingProblem?: (problemId?: string) => void;
  onOpenSqlProblem?: (problemId?: string) => void;
  onOpenQuizTest?: (quizId?: string) => void;
}

export function QuestionVaultModal({
  isOpen,
  onClose,
  selectedRole,
  initialCategory = "All",
  onOpenCodingProblem,
  onOpenSqlProblem,
  onOpenQuizTest
}: QuestionVaultModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [selectedCompany, setSelectedCompany] = useState<string>("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Sync category whenever modal opens or initialCategory changes
  React.useEffect(() => {
    if (isOpen) {
      setSelectedCategory(initialCategory);
    }
  }, [isOpen, initialCategory]);

  // Solved state from localStorage
  const [solvedIds, setSolvedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem("jobhighway_vault_solved_questions");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const toggleSolved = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSolvedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem("jobhighway_vault_solved_questions", JSON.stringify(Array.from(next)));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Compile full master vault combining Role Questions, Coding Challenges, and Company Questions
  const allVaultQuestions: VaultQuestionItem[] = useMemo(() => {
    const list: VaultQuestionItem[] = [];

    // 1. Role practice questions
    selectedRole.practiceQuestions.forEach(q => {
      let cat: VaultQuestionItem["category"] = "DSA";
      if (q.type === "SQL") cat = "SQL";
      else if (q.type === "Architecture") cat = "System Design";
      else if (q.type === "Case Study") cat = "Behavioral";

      list.push({
        id: `role_${q.id}`,
        title: q.title,
        category: cat,
        difficulty: q.difficulty,
        topics: [q.topic],
        companies: q.companyTags,
        questionText: q.questionText,
        solutionHint: q.solutionHint,
        codeProblemId: q.type === "Coding" ? q.id : undefined,
        sqlProblemId: q.type === "SQL" ? q.id : undefined
      });
    });

    // 2. Coding problems (DSA: Python, Java, C, C++)
    ALL_CODING_PROBLEMS.forEach(cp => {
      list.push({
        id: `coding_${cp.id}`,
        title: cp.title,
        category: "DSA",
        difficulty: cp.difficulty,
        topics: cp.topics,
        companies: cp.companyTags,
        questionText: cp.description,
        solutionHint: `Function signature: ${cp.functionName}(). Constraints: ${cp.constraints.join("; ")}`,
        codeProblemId: cp.id
      });
    });

    // 2b. SQL Practice Problems (Interactive Database Queries)
    ALL_SQL_PROBLEMS.forEach(sp => {
      list.push({
        id: `sql_${sp.id}`,
        title: sp.title,
        category: "SQL",
        difficulty: sp.difficulty,
        topics: [sp.category, ...sp.companyTags],
        companies: sp.companyTags,
        questionText: sp.description,
        solutionHint: `Topic: ${sp.category}. Tables: ${sp.schemas.map(s => s.tableName).join(", ")}.`,
        sqlProblemId: sp.id
      });
    });

    // 3. Behavioral STAR questions
    const behavioralMaster: VaultQuestionItem[] = [
      {
        id: "beh_1",
        title: "Disagreement with Engineering Lead / Product Manager",
        category: "Behavioral",
        difficulty: "Medium",
        topics: ["Conflict Resolution", "Communication", "Leadership"],
        companies: ["Amazon", "Google", "Microsoft", "Meta"],
        questionText: "Tell me about a time you had a strong technical disagreement with your manager or team lead. How did you handle it, and what was the resolution?",
        solutionHint: "Use STAR (Situation, Task, Action, Result). State the technical data you gathered, focus on business goals rather than ego, and explain how you committed to the final decision."
      },
      {
        id: "beh_2",
        title: "Tackling a Critical Production Incident (P0/P1 Outage)",
        category: "Behavioral",
        difficulty: "Hard",
        topics: ["Incident Management", "Ownership", "Resilience"],
        companies: ["Amazon", "Netflix", "Google", "Meta"],
        questionText: "Describe a high-severity production outage or bug that you introduced or had to resolve under extreme time pressure. What did you do?",
        solutionHint: "Focus on root cause analysis (RCA), blameless post-mortem, immediate mitigation before permanent fix, and what automated guardrails you put in place."
      },
      {
        id: "beh_3",
        title: "Delivering Under Tight Deadlines with Scope Ambiguity",
        category: "Behavioral",
        difficulty: "Medium",
        topics: ["Prioritization", "Agile Execution", "Trade-offs"],
        companies: ["Meta", "Adobe", "Microsoft"],
        questionText: "Tell me about a project where specifications were vague and the deadline was aggressive. How did you prioritize deliverables?",
        solutionHint: "Highlight customer-backwards thinking, MVP definition, proactive communication with stakeholders, and iterative milestones."
      },
      {
        id: "beh_4",
        title: "Mentoring a Struggling Team Member",
        category: "Behavioral",
        difficulty: "Medium",
        topics: ["Mentorship", "Team Leadership", "Empathy"],
        companies: ["Google", "Microsoft", "Adobe"],
        questionText: "Describe a time when you helped a peer or junior colleague who was struggling to meet project expectations.",
        solutionHint: "Show empathy, diagnosis of blocker (tooling, context, domain), pairing sessions, and celebrating their eventual independent delivery."
      }
    ];
    list.push(...behavioralMaster);

    // 4. System Design Questions
    const systemDesignMaster: VaultQuestionItem[] = [
      {
        id: "sys_1",
        title: "Design a High-Throughput Distributed Rate Limiter",
        category: "System Design",
        difficulty: "Medium",
        topics: ["Distributed Systems", "Caching", "Concurrency"],
        companies: ["Google", "Amazon", "Meta", "Netflix"],
        questionText: "Design an API Rate Limiter that handles 100,000 requests per second across multiple data centers. Discuss Token Bucket vs Leaky Bucket vs Sliding Window Counter.",
        solutionHint: "Use Redis with Lua scripts for atomic increments. Implement sliding window logs or token buckets. Discuss local in-memory caching vs centralized Redis cluster."
      },
      {
        id: "sys_2",
        title: "Design a Global URL Shortener (TinyURL)",
        category: "System Design",
        difficulty: "Easy",
        topics: ["Hashing", "Database Sharding", "Caching"],
        companies: ["Microsoft", "Amazon", "Adobe"],
        questionText: "Design a scalable URL shortening service capable of handling 500M new URLs per month and 100:1 read-to-write ratio.",
        solutionHint: "Base62 encoding of 64-bit integer IDs. Use Cassandra or DynamoDB for key-value lookups. Add Redis CDN caching for popular URLs. 301 vs 302 redirect trade-offs."
      },
      {
        id: "sys_3",
        title: "Design a Real-Time Collaborative Document Editor (Google Docs)",
        category: "System Design",
        difficulty: "Hard",
        topics: ["CRDT", "Operational Transformation", "WebSockets"],
        companies: ["Google", "Microsoft", "Meta"],
        questionText: "Design the synchronization engine for a real-time collaborative document editor like Google Docs with offline support.",
        solutionHint: "Explain Operational Transformation (OT) vs Conflict-free Replicated Data Types (CRDTs). Long-polling vs WebSockets. Event sourcing with Kafka."
      }
    ];
    list.push(...systemDesignMaster);

    // 5. Aptitude & Reasoning questions
    const aptitudeMaster: VaultQuestionItem[] = [
      {
        id: "apt_1",
        title: "Permutations & Combinations in Distributed Networks",
        category: "Aptitude",
        difficulty: "Medium",
        topics: ["Combinatorics", "Probability", "Quantitative"],
        companies: ["Adobe", "Microsoft", "Amazon"],
        questionText: "In how many ways can 6 microservices be connected in a peer-to-peer mesh network such that every service can communicate with every other service directly?",
        solutionHint: "Formula: n*(n-1)/2 = 6*5/2 = 15 bidirectional links."
      },
      {
        id: "apt_2",
        title: "Work, Time & Server Processing Capacity",
        category: "Aptitude",
        difficulty: "Easy",
        topics: ["Work & Time", "Algebra", "Throughput"],
        companies: ["Amazon", "Adobe", "Cognizant"],
        questionText: "Server A can process 1,200 batch jobs in 4 hours. Server B can process 1,200 batch jobs in 6 hours. Working together, how many hours will both servers take to finish 3,000 jobs?",
        solutionHint: "Rate A = 300 jobs/hr. Rate B = 200 jobs/hr. Combined rate = 500 jobs/hr. Time for 3,000 jobs = 3000 / 500 = 6 hours."
      }
    ];
    list.push(...aptitudeMaster);

    // 6. Company specific real questions from PREP_COMPANIES
    PREP_COMPANIES.forEach(comp => {
      Object.entries(comp.roleQuestions).forEach(([rId, details]) => {
        details.frequentlyAsked.forEach((faq, fIdx) => {
          list.push({
            id: `comp_${comp.id}_${rId}_${fIdx}`,
            title: faq,
            category: "Company Specific",
            difficulty: "Medium",
            topics: details.focusAreas,
            companies: [comp.name],
            questionText: `Asked in ${comp.name} interview loops for ${rId.replace("-", " ")} candidates. Focus areas: ${details.focusAreas.join(", ")}.`,
            solutionHint: details.insiderTip
          });
        });
      });
    });

    return list;
  }, [selectedRole]);

  // Filtered Questions
  const filteredList = useMemo(() => {
    return allVaultQuestions.filter(q => {
      const matchSearch = searchTerm === "" || 
        q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.topics.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
        q.companies.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCat = selectedCategory === "All" || q.category === selectedCategory;
      const matchDiff = selectedDifficulty === "All" || q.difficulty === selectedDifficulty;
      const matchComp = selectedCompany === "All" || q.companies.some(c => c.toLowerCase() === selectedCompany.toLowerCase());

      return matchSearch && matchCat && matchDiff && matchComp;
    });
  }, [allVaultQuestions, searchTerm, selectedCategory, selectedDifficulty, selectedCompany]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-slate-900">
                  Question Vault &amp; Practice Drills
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                  {filteredList.length} Questions
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Curated interview bank for <strong className="text-slate-800">{selectedRole.name}</strong> and top tech employers
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-4 border-b border-slate-200 bg-white space-y-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search questions by keyword, topic, or company (e.g. Dynamic Programming, Google, STAR...)"
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-teal-500 focus:bg-white"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: "All", label: "All Topics" },
                { id: "DSA", label: "DSA & Coding" },
                { id: "System Design", label: "System Design" },
                { id: "SQL", label: "SQL & DB" },
                { id: "Aptitude", label: "Aptitude" },
                { id: "Behavioral", label: "Behavioral" },
                { id: "Company Specific", label: "Company Vault" }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                    selectedCategory === cat.id
                      ? "bg-teal-600 text-white shadow-2xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Difficulty & Company Dropdowns */}
            <div className="flex items-center gap-2">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold outline-none cursor-pointer"
              >
                <option value="All">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold outline-none cursor-pointer"
              >
                <option value="All">All Companies</option>
                <option value="Google">Google</option>
                <option value="Amazon">Amazon</option>
                <option value="Microsoft">Microsoft</option>
                <option value="Meta">Meta</option>
                <option value="Netflix">Netflix</option>
                <option value="Adobe">Adobe</option>
              </select>
            </div>
          </div>
        </div>

        {/* Question List Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-slate-50/50">
          {filteredList.length === 0 ? (
            <div className="text-center py-16 text-slate-500 space-y-2">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="font-bold text-sm text-slate-700">No questions matched your criteria</div>
              <div className="text-xs text-slate-500">Try adjusting your search query or reset the filters.</div>
            </div>
          ) : (
            filteredList.map((item) => {
              const isExpanded = expandedId === item.id;
              const isSolved = solvedIds.has(item.id);

              return (
                <div
                  key={item.id}
                  className={`bg-white border rounded-xl p-4 transition-all shadow-2xs ${
                    isSolved 
                      ? "border-emerald-200 bg-emerald-50/20" 
                      : "border-slate-200 hover:border-teal-300"
                  }`}
                >
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="flex items-start justify-between gap-3 cursor-pointer"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Solved Checkbox */}
                      <button
                        onClick={(e) => toggleSolved(item.id, e)}
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors cursor-pointer ${
                          isSolved
                            ? "bg-emerald-500 text-white"
                            : "border-2 border-slate-300 hover:border-teal-500"
                        }`}
                        title={isSolved ? "Mark unsolved" : "Mark solved"}
                      >
                        {isSolved && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={`text-[10px] font-bold px-2 py-0.2 rounded ${
                            item.difficulty === "Easy" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                            item.difficulty === "Medium" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                            "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}>
                            {item.difficulty}
                          </span>

                          <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-slate-100 text-slate-700">
                            {item.category}
                          </span>

                          {item.companies.map(c => (
                            <span key={c} className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-teal-50 text-teal-800 border border-teal-200/60">
                              {c}
                            </span>
                          ))}
                        </div>

                        <h4 className={`text-sm font-bold leading-snug ${
                          isSolved ? "text-emerald-950 line-through decoration-emerald-500/50" : "text-slate-900"
                        }`}>
                          {item.title}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* DSA Coding Action */}
                      {(item.codeProblemId || item.category === "DSA") && onOpenCodingProblem && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                            onOpenCodingProblem(item.codeProblemId);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                          title="Open DSA Coding Sandbox (Python, Java, C, C++)"
                        >
                          <Code2 className="w-3 h-3" />
                          <span>Solve (DSA)</span>
                        </button>
                      )}

                      {/* SQL Database Action */}
                      {(item.sqlProblemId || item.category === "SQL") && onOpenSqlProblem && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                            onOpenSqlProblem(item.sqlProblemId);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                          title="Open SQL Sandbox (MySQL, PostgreSQL, SQL Server)"
                        >
                          <Database className="w-3 h-3" />
                          <span>Solve (SQL)</span>
                        </button>
                      )}

                      <button className="text-slate-400 hover:text-slate-600">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Detail */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-slate-100 text-xs space-y-3 animate-in fade-in-50 duration-100">
                      <div>
                        <strong className="text-slate-700 block mb-1">Problem Statement:</strong>
                        <p className="text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          {item.questionText}
                        </p>
                      </div>

                      <div className="p-3 bg-teal-50/70 rounded-lg border border-teal-200/80 text-teal-900">
                        <strong className="block mb-1">💡 Expected Approach &amp; Solution Strategy:</strong>
                        <p className="text-slate-700 leading-relaxed font-sans">{item.solutionHint}</p>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                          <span>Topics:</span>
                          {item.topics.map(t => (
                            <span key={t} className="font-semibold text-slate-700">#{t}</span>
                          ))}
                        </div>

                        {(item.codeProblemId || item.category === "DSA") && onOpenCodingProblem && (
                          <button
                            onClick={() => {
                              onClose();
                              onOpenCodingProblem(item.codeProblemId);
                            }}
                            className="text-teal-700 font-bold hover:underline inline-flex items-center gap-1"
                          >
                            <span>Open DSA Sandbox (Python, Java, C, C++)</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}

                        {(item.sqlProblemId || item.category === "SQL") && onOpenSqlProblem && (
                          <button
                            onClick={() => {
                              onClose();
                              onOpenSqlProblem(item.sqlProblemId);
                            }}
                            className="text-teal-700 font-bold hover:underline inline-flex items-center gap-1"
                          >
                            <span>Open SQL Sandbox (MySQL, PostgreSQL, SQL Server)</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Solved <strong>{solvedIds.size}</strong> questions in your vault
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold cursor-pointer"
          >
            Close Vault
          </button>
        </div>

      </div>
    </div>
  );
}
