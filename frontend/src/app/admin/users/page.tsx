"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Users, 
  Search, 
  Download, 
  Trash2, 
  Eye, 
  X, 
  ChevronLeft, 
  ChevronRight,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllUsersForAdmin, adminDeleteUser, getAppliedJobs, User, AppliedJob } from "@/lib/auth";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Selected Candidate modal
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userApplications, setUserApplications] = useState<AppliedJob[]>([]);

  const refreshUsers = () => {
    setUsers(getAllUsersForAdmin());
  };

  useEffect(() => {
    refreshUsers();
  }, []);

  const handleOpenUser = (u: User) => {
    setSelectedUser(u);
    setUserApplications(getAppliedJobs(u.id));
  };

  const handleDeleteUser = (id: string) => {
    if (confirm("Are you sure you want to remove this user account?")) {
      adminDeleteUser(id);
      refreshUsers();
      if (selectedUser?.id === id) setSelectedUser(null);
    }
  };

  const filtered = users.filter(u => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const pagedUsers = filtered.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-teal-600" />
            <span>Registered Users</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            View and manage all registered candidate and operator user accounts.
          </p>
        </div>

        <Button
          onClick={() => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(users, null, 2));
            const dlAnchor = document.createElement("a");
            dlAnchor.setAttribute("href", dataStr);
            dlAnchor.setAttribute("download", "jobpulse_users.json");
            dlAnchor.click();
          }}
          variant="outline"
          size="sm"
          className="text-xs rounded-xl shadow-2xs gap-1.5 cursor-pointer self-start sm:self-auto font-semibold"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Users</span>
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search by name or email..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 outline-none focus:bg-white focus:border-teal-500"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 outline-none focus:bg-white focus:border-teal-500"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/90 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Name</th>
                <th className="p-3.5">Email</th>
                <th className="p-3.5">Joined</th>
                <th className="p-3.5">Target Role</th>
                <th className="p-3.5">Applications</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pagedUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No registered users match your query.
                  </td>
                </tr>
              ) : (
                pagedUsers.map((u) => {
                  const apps = getAppliedJobs(u.id);
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                        <span>{u.name}</span>
                        {u.role === "admin" && (
                          <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
                            Founder
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-slate-600 font-mono text-[11px]">
                        {u.email}
                      </td>
                      <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3.5 text-slate-600 font-medium">
                        {u.targetRole || "Software Engineer"}
                      </td>
                      <td className="p-3.5">
                        <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          {apps.length} applied
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Active</span>
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-1.5">
                        <button
                          onClick={() => handleOpenUser(u)}
                          className="px-2.5 py-1 rounded-lg border border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100 font-semibold text-[11px] transition-colors cursor-pointer"
                        >
                          View
                        </button>
                        {u.id !== "admin_founder" && (
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Delete user"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-3.5 bg-slate-50/50 border-t border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-900">{totalItems === 0 ? 0 : startIndex + 1}</strong> to{" "}
            <strong className="text-slate-900">{Math.min(startIndex + pageSize, totalItems)}</strong> of{" "}
            <strong className="text-slate-900">{totalItems}</strong> users
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 font-semibold text-slate-800">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Candidate Inspector Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-xl w-full p-6 space-y-4 animate-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">{selectedUser.name}</h3>
                <p className="text-xs text-slate-400">{selectedUser.email}</p>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl">
                <div>
                  <span className="text-slate-400 block text-[11px]">Target Role</span>
                  <span className="font-semibold text-slate-800">{selectedUser.targetRole || "Software Engineer"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Target CTC</span>
                  <span className="font-semibold text-emerald-600">{selectedUser.targetCtc || "Flexible"}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-xs text-slate-900 mb-2">Tracked Applications ({userApplications.length})</h4>
                {userApplications.length === 0 ? (
                  <p className="text-slate-400 text-xs py-3 text-center">No applications marked yet.</p>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {userApplications.map(app => (
                      <div key={app.id} className="p-2.5 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-slate-800">{app.title}</div>
                          <div className="text-[11px] text-slate-500">{app.company} • {app.location}</div>
                        </div>
                        <span className="font-semibold px-2 py-0.5 rounded text-[10px] bg-teal-50 text-teal-700">
                          {app.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <Button size="sm" variant="outline" onClick={() => setSelectedUser(null)} className="text-xs">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
