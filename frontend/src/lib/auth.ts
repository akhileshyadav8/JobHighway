"use client";

export type ApplicationStatus = "Applied" | "Under Review" | "Interview" | "Offer" | "Rejected";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
  targetCtc?: string;
  preferredLocation?: string;
  targetRole?: string;
  skills?: string[];
}

export interface AppliedJob {
  id: string;
  jobId: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  applyUrl: string;
  status: ApplicationStatus;
  appliedAt: string;
  notes?: string;
}

export interface BookmarkItem {
  jobId: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  applyUrl: string;
  savedAt: string;
}

const USERS_STORAGE_KEY = "jobpulse_registered_users";
const SESSION_STORAGE_KEY = "jobpulse_current_session";
const APPLIED_STORAGE_PREFIX = "jobpulse_applied_";
const BOOKMARKS_STORAGE_PREFIX = "jobpulse_bookmarks_";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function getStoredUsers(): (User & { passwordHash?: string })[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    
    const initialUsers: (User & { passwordHash?: string })[] = [
      {
        id: "admin_founder",
        name: "Akhilesh Yadav",
        email: "yadavakhil766@gmail.com",
        role: "admin",
        createdAt: new Date().toISOString(),
        targetCtc: "₹35,00,000 - ₹50,00,000",
        preferredLocation: "Bengaluru / Remote",
        targetRole: "Lead Data Engineer & Founder",
        skills: ["Python", "PostgreSQL", "Next.js", "Distributed Systems"]
      },
      {
        id: "demo_user_1",
        name: "Demo Candidate",
        email: "demo@jobpulse.io",
        role: "user",
        createdAt: new Date().toISOString(),
        targetCtc: "₹18,00,000 - ₹25,00,000",
        preferredLocation: "Remote / Hybrid",
        targetRole: "Full Stack Engineer",
        skills: ["React", "TypeScript", "Node.js", "Docker"]
      }
    ];
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialUsers));
    return initialUsers;
  } catch {
    return [];
  }
}

export function getCurrentUser(): User | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function loginUser(email: string, password?: string): { user?: User; error?: string } {
  if (!isBrowser()) return { error: "Window not defined" };
  const cleanEmail = email.toLowerCase().trim();
  const users = getStoredUsers();
  
  let user = users.find(u => u.email.toLowerCase() === cleanEmail);
  
  if (!user) {
    const isAdmin = cleanEmail === "yadavakhil766@gmail.com" || cleanEmail.includes("admin");
    user = {
      id: "usr_" + Date.now(),
      name: cleanEmail.split("@")[0].replace(".", " ").replace(/\b\w/g, l => l.toUpperCase()),
      email: cleanEmail,
      role: isAdmin ? "admin" : "user",
      createdAt: new Date().toISOString()
    };
    users.push(user);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }

  const safeUser: User = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    targetCtc: user.targetCtc,
    preferredLocation: user.preferredLocation,
    targetRole: user.targetRole,
    skills: user.skills
  };
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(safeUser));
  window.dispatchEvent(new Event("jobpulse_auth_change"));
  return { user: safeUser };
}

export function registerUser(name: string, email: string, password?: string): { user?: User; error?: string } {
  if (!isBrowser()) return { error: "Window not defined" };
  const cleanEmail = email.toLowerCase().trim();
  const users = getStoredUsers();

  const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    return loginUser(cleanEmail, password);
  }

  const isAdmin = cleanEmail === "yadavakhil766@gmail.com" || cleanEmail.includes("admin");
  const newUser: User = {
    id: "usr_" + Date.now(),
    name: name.trim() || cleanEmail.split("@")[0],
    email: cleanEmail,
    role: isAdmin ? "admin" : "user",
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newUser));
  window.dispatchEvent(new Event("jobpulse_auth_change"));
  return { user: newUser };
}

export function logoutUser(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(SESSION_STORAGE_KEY);
  window.dispatchEvent(new Event("jobpulse_auth_change"));
}

export function updateUserProfile(userId: string, updates: Partial<User>): User | null {
  if (!isBrowser()) return null;
  const users = getStoredUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index === -1) return null;

  const updated: User = { ...users[index], ...updates };
  users[index] = updated;
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

  const current = getCurrentUser();
  if (current && current.id === userId) {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("jobpulse_auth_change"));
  }

  return updated;
}

export function getAppliedJobs(userId: string): AppliedJob[] {
  if (!isBrowser() || !userId) return [];
  try {
    const raw = localStorage.getItem(APPLIED_STORAGE_PREFIX + userId);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function markJobApplied(
  userId: string,
  job: {
    jobId: string;
    title: string;
    company: string;
    location: string;
    salary?: string;
    applyUrl: string;
  },
  status: ApplicationStatus = "Applied",
  notes?: string
): AppliedJob[] {
  if (!isBrowser() || !userId) return [];
  const current = getAppliedJobs(userId);
  const existingIndex = current.findIndex(j => j.jobId === job.jobId);

  if (existingIndex >= 0) {
    current[existingIndex].status = status;
    if (notes !== undefined) current[existingIndex].notes = notes;
  } else {
    current.unshift({
      id: "app_" + Date.now(),
      jobId: job.jobId,
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      applyUrl: job.applyUrl,
      status,
      appliedAt: new Date().toISOString(),
      notes: notes || ""
    });
  }

  localStorage.setItem(APPLIED_STORAGE_PREFIX + userId, JSON.stringify(current));
  window.dispatchEvent(new Event("jobpulse_applications_change"));
  return current;
}

export function updateAppliedStatus(
  userId: string,
  jobIdOrAppId: string,
  status: ApplicationStatus,
  notes?: string
): AppliedJob[] {
  if (!isBrowser() || !userId) return [];
  const current = getAppliedJobs(userId);
  const item = current.find(j => j.id === jobIdOrAppId || j.jobId === jobIdOrAppId);
  if (item) {
    item.status = status;
    if (notes !== undefined) item.notes = notes;
    localStorage.setItem(APPLIED_STORAGE_PREFIX + userId, JSON.stringify(current));
    window.dispatchEvent(new Event("jobpulse_applications_change"));
  }
  return current;
}

export function removeAppliedJob(userId: string, jobIdOrAppId: string): AppliedJob[] {
  if (!isBrowser() || !userId) return [];
  const current = getAppliedJobs(userId).filter(j => j.id !== jobIdOrAppId && j.jobId !== jobIdOrAppId);
  localStorage.setItem(APPLIED_STORAGE_PREFIX + userId, JSON.stringify(current));
  window.dispatchEvent(new Event("jobpulse_applications_change"));
  return current;
}

export function isJobApplied(userId: string, jobId: string): boolean {
  if (!isBrowser() || !userId) return false;
  const list = getAppliedJobs(userId);
  return list.some(j => j.jobId === jobId);
}

export function getBookmarks(userId: string): BookmarkItem[] {
  if (!isBrowser() || !userId) return [];
  try {
    const raw = localStorage.getItem(BOOKMARKS_STORAGE_PREFIX + userId);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleBookmark(
  userId: string,
  job: {
    jobId: string;
    title: string;
    company: string;
    location: string;
    salary?: string;
    applyUrl: string;
  }
): boolean {
  if (!isBrowser() || !userId) return false;
  const current = getBookmarks(userId);
  const index = current.findIndex(b => b.jobId === job.jobId);
  let isSaved = false;

  if (index >= 0) {
    current.splice(index, 1);
    isSaved = false;
  } else {
    current.unshift({
      ...job,
      savedAt: new Date().toISOString()
    });
    isSaved = true;
  }

  localStorage.setItem(BOOKMARKS_STORAGE_PREFIX + userId, JSON.stringify(current));
  window.dispatchEvent(new Event("jobpulse_bookmarks_change"));
  return isSaved;
}

export function isJobBookmarked(userId: string, jobId: string): boolean {
  if (!isBrowser() || !userId) return false;
  const list = getBookmarks(userId);
  return list.some(b => b.jobId === jobId);
}

export function getAllUsersForAdmin(): User[] {
  return getStoredUsers();
}

export function adminDeleteUser(userId: string): void {
  if (!isBrowser()) return;
  const users = getStoredUsers().filter(u => u.id !== userId);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}
