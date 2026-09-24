"use client";

import React, { useState } from "react";
import { X, Bell, Plus, CheckCircle2 } from "lucide-react";
import { JobAlertRecord } from "@/lib/auth";

export interface CreateAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAlert: (alert: Omit<JobAlertRecord, "id" | "createdAt">) => void;
}

export function CreateAlertModal({
  isOpen,
  onClose,
  onSaveAlert
}: CreateAlertModalProps) {
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [workMode, setWorkMode] = useState("Remote");
  const [colorType, setColorType] = useState<"rose" | "amber" | "purple">("rose");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role.trim()) return;

    onSaveAlert({
      role: role.trim(),
      location: location.trim() || "Worldwide",
      workMode,
      enabled: true,
      colorType
    });

    setRole("");
    setLocation("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 relative overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 border border-amber-200/60 flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Create Job Alert
            </h2>
            <p className="text-xs text-slate-500">
              Receive updates for fresh career portal requisitions.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Target Role / Job Title *
            </label>
            <input
              type="text"
              required
              autoFocus
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Data Scientist, Backend Engineer"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Target Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Bengaluru, India or Worldwide"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Work Mode
              </label>
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:border-teal-500 focus:outline-none bg-white cursor-pointer"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
                <option value="Any">Any</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Badge Color
              </label>
              <select
                value={colorType}
                onChange={(e) => setColorType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:border-teal-500 focus:outline-none bg-white cursor-pointer"
              >
                <option value="rose">Red / Urgent</option>
                <option value="amber">Amber / Normal</option>
                <option value="purple">Purple / Specialized</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Save Alert</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
