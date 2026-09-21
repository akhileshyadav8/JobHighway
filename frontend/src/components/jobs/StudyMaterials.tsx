import { BookOpen, ExternalLink, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StudyMaterialItem {
  title: string;
  description: string;
  url: string;
}

export function StudyMaterials({ materials }: { materials: StudyMaterialItem[] | null }) {
  // Default verified study materials if empty
  const defaultMaterials: StudyMaterialItem[] = [
    {
      title: "Striver's A2Z DSA Sheet (TakeUForward)",
      description: "The most widely recommended step-by-step DSA preparation roadmap for coding assessments and technical rounds.",
      url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/"
    },
    {
      title: "LeetCode Top SQL 50 Study Plan",
      description: "Official curated SQL challenges covering joins, aggregations, window functions, and subqueries.",
      url: "https://leetcode.com/studyplan/top-sql-50/"
    },
    {
      title: "IndiaBIX Quantitative Aptitude & Reasoning",
      description: "Essential practice problems for clearing online assessment (Round 1) aptitude tests.",
      url: "https://www.indiabix.com/aptitude/questions-and-answers/"
    },
    {
      title: "GeeksforGeeks SDE Interview Experience Archive",
      description: "Authentic candidate interview transcripts, coding rounds, and technical questions asked in product companies.",
      url: "https://www.geeksforgeeks.org/must-do-coding-questions-for-companies-like-amazon-microsoft-adobe/"
    }
  ];

  const list = (materials && materials.length > 0) ? materials : defaultMaterials;

  return (
    <Card className="mb-6 shadow-sm border-slate-200 ">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2 uppercase tracking-wide text-slate-900 ">
            📚 FREE STUDY MATERIALS ({list.length})
          </h2>
          <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            100% Free
          </span>
        </div>
        
        <div className="grid gap-4">
          {list.map((m, i) => {
            const resourceUrl = m.url && m.url !== "#" ? m.url : "https://takeuforward.org/";
            return (
              <div 
                key={i} 
                className="border border-slate-200 rounded-xl p-4 flex gap-4 items-start bg-slate-50/50 hover:bg-slate-50 transition-colors"
              >
                <div className="bg-teal-100 text-teal-700 p-3 rounded-xl flex-shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-base text-slate-900 mb-1">
                    {m.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-3 leading-relaxed">
                    {m.description}
                  </p>
                  <a 
                    href={resourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1.5 text-teal-600 font-semibold hover:text-teal-700 text-sm hover:underline"
                  >
                    <span>Open Resource</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
