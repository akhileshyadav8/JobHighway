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
  FileText,
  Shield,
  UserCheck,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllUsersForAdmin, adminDeleteUser, getAppliedJobs, User, AppliedJob } from "@/lib/auth";
import { logAdminActivity } from "@/lib/adminData";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenUser = (u: User) => {
    setSelectedUser(u);
    setUserApplications(getAppliedJobs(u.id));
  };

  const handleDeleteUser = (id: string, name: string) => {
    if (confirm(`Are you sure you want to permanently remove user account "${name}"?`)) {
      adminDeleteUser(id);
      refreshUsers();
      if (selectedUser?.id === id) setSelectedUser(null);
      logAdminActivity("User Account Deleted", `Admin removed user: ${name}`, "security");
      showToast(`User ${name} removed.`);
    }
  };

  const handleToggleRole = (u: User) => {
    const newRole = u.role === "admin" ? "candidate" : "admin";
    try {
      const raw = localStorage.getItem("jobpulse_users");
      if (raw) {
        const list = JSON.parse(raw);
        const updated = list.map((item: any) => item.id === u.id ? { ...item, role: newRole } : item);
        localStorage.setItem("jobpulse_users", JSON.stringify(updated));
      }
      refreshUsers();
      logAdminActivity("User Role Updated", `Changed ${u.name}'s role to ${newRole}`, "security");
      showToast(`Updated ${u.name}'s role to ${newRole}.`);
    } catch {}
  };

  const filtered = users.filter(u => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
    }
    if (roleFilter && u.role !== roleFilter) return false;
    return true;
  });

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const pagedUsers = filtered.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-teal-600" />
            <span>Registered Users &amp; Roles ({users.length})</span>
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
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 outline-none focus:bg-white focus:border-teal-500 cursor-pointer"
            >
              <option value="">All Roles</option>
              <option value="admin">Administrators</option>
              <option value="candidate">Candidates</option>
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
                <th className="p-3.5">Account Role</th>
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
                          <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                            Admin
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
                        <button
                          onClick={() => handleToggleRole(u)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border cursor-pointer ${
                            u.role === "admin" 
                              ? "bg-teal-50 text-teal-700 border-teal-200" 
                              : "bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                          title="Click to toggle role"
                        >
                          {u.role === "admin" ? "ADMIN" : "CANDIDATE"}
                        </button>
                      </td>
                      <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => handleOpenUser(u)}
                          className="px-2.5 py-1 rounded-lg border border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100 font-semibold text-[11px] transition-colors cursor-pointer"
                        >
                          View
                        </button>
                        {u.id !== "admin_founder" && (
                          <button
                            onClick={() => handleDeleteUser(u.id, u.name)}
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
        <div className="p-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <span className="font-bold text-slate-800">{totalItems > 0 ? startIndex + 1 : 0}</span> to{" "}
            <span className="font-bold text-slate-800">{Math.min(startIndex + pageSize, totalItems)}</span> of{" "}
            <span className="font-bold text-slate-800">{totalItems}</span> users
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="text-xs h-8 px-2.5 rounded-lg"
            >
              <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Prev
            </Button>
            <span className="text-xs px-2 font-medium">Page {currentPage} of {totalPages}</span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="text-xs h-8 px-2.5 rounded-lg"
            >
              Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* User Details Drawer Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 font-extrabold flex items-center justify-center text-sm border border-teal-200">
                  {selectedUser.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">{selectedUser.name}</h3>
                  <div className="text-xs text-slate-500 font-mono">{selectedUser.email}</div>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block mb-0.5">Role Designation</span>
                  <span className="font-bold text-slate-800 uppercase">{selectedUser.role}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Target Work Mode</span>
                  <span className="font-bold text-slate-800">{selectedUser.preferredLocation || "Any / Remote"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Account Created</span>
                  <span className="font-mono text-slate-700">{new Date(selectedUser.createdAt).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Total Tracked Jobs</span>
                  <span className="font-bold text-teal-700">{userApplications.length} applied</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-900 mb-2 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-teal-600" />
                  <span>Submitted Applications</span>
                </h4>
                {userApplications.length === 0 ? (
                  <div className="p-4 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    No applications submitted yet by this candidate.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {userApplications.map(app => (
                      <div key={app.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-slate-900">{app.title}</div>
                          <div className="text-slate-500 text-[11px]">{app.company} • Applied on {new Date(app.appliedAt).toLocaleDateString()}</div>
                        </div>
                        <span className="font-bold text-[10px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded border border-teal-200">
                          {app.status || "APPLIED"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
