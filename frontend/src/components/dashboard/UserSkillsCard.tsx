"use client";

import React, { useState } from "react";
import { Sparkles, Plus, X, Check } from "lucide-react";

export interface UserSkillsCardProps {
  skills?: string[];
  onAddSkill?: (skill: string) => void;
  onRemoveSkill?: (skill: string) => void;
  onManageSkills?: () => void;
}

const DEFAULT_SKILLS = [
  "Python",
  "SQL",
  "Machine Learning",
  "Data Analysis",
  "Power BI",
  "NLP",
  "Deep Learning",
  "Pandas"
];

export function UserSkillsCard({
  skills = DEFAULT_SKILLS,
  onAddSkill,
  onRemoveSkill,
  onManageSkills
}: UserSkillsCardProps) {
  const [skillList, setSkillList] = useState<string[]>(skills);
  const [isAdding, setIsAdding] = useState(false);
  const [newSkillText, setNewSkillText] = useState("");
  const [isManaging, setIsManaging] = useState(false);

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newSkillText.trim();
    if (trimmed && !skillList.includes(trimmed)) {
      const updated = [...skillList, trimmed];
      setSkillList(updated);
      onAddSkill?.(trimmed);
      setNewSkillText("");
      setIsAdding(false);
    }
  };

  const handleRemove = (skillToRemove: string) => {
    const updated = skillList.filter((s) => s !== skillToRemove);
    setSkillList(updated);
    onRemoveSkill?.(skillToRemove);
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 fill-amber-400 text-amber-500" />
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Your Skills
          </h2>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsManaging(!isManaging);
            onManageSkills?.();
          }}
          className="text-xs font-bold text-teal-600 hover:text-teal-700 transition-colors cursor-pointer"
        >
          {isManaging ? "Done" : "Manage"}
        </button>
      </div>

      {/* Skill Pills Flow */}
      <div className="flex flex-wrap items-center gap-2 py-4">
        {skillList.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-100 hover:bg-sky-100/70 transition-colors"
          >
            <span>{skill}</span>
            {isManaging && (
              <button
                type="button"
                onClick={() => handleRemove(skill)}
                className="text-sky-400 hover:text-rose-600 cursor-pointer"
                title={`Remove ${skill}`}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </span>
        ))}

        {/* Inline Add Skill Input or Button */}
        {isAdding ? (
          <form onSubmit={handleAddNew} className="inline-flex items-center gap-1.5">
            <input
              type="text"
              autoFocus
              value={newSkillText}
              onChange={(e) => setNewSkillText(e.target.value)}
              placeholder="Skill name..."
              className="px-2.5 py-1 rounded-full text-xs border border-teal-500 bg-white text-slate-900 focus:outline-none w-28"
            />
            <button
              type="submit"
              className="p-1 rounded-full bg-teal-600 text-white hover:bg-teal-700 cursor-pointer"
              title="Add"
            >
              <Check className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="p-1 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer"
              title="Cancel"
            >
              <X className="w-3 h-3" />
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-slate-600 border border-dashed border-slate-300 hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50/50 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Skill</span>
          </button>
        )}
      </div>
    </div>
  );
}
