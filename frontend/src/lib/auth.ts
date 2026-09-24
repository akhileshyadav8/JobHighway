"use client";

export type ApplicationStatus = "Applied" | "Under Review" | "Interview" | "Offer" | "Rejected";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
  phone?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  currentRole?: string;
  yearsExperience?: string;
  education?: string;
  graduationYear?: string;
  targetCtc?: string;
  preferredLocation?: string;
  targetRole?: string;
  skills?: string[];
  resumeFile?: {
    name: string;
    size: number;
    uploadedAt: string;
    dataUrl?: string;
    fileType?: string;
    status?: string;
    atsScore?: number;
  };
  resumeExtractedNotice?: boolean;
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

const USERS_STORAGE_KEY = "jobhighway_registered_users";
const SESSION_STORAGE_KEY = "jobhighway_current_session";
const APPLIED_STORAGE_PREFIX = "jobhighway_applied_";
const BOOKMARKS_STORAGE_PREFIX = "jobhighway_bookmarks_";
const RESET_TOKENS_STORAGE_KEY = "jobhighway_password_reset_tokens";

export interface PasswordResetTokenRecord {
  token: string;
  email: string;
  expiresAt: number;
  used: boolean;
  createdAt: number;
}

// Strict Admin Credentials
export const ADMIN_EMAIL = "yadavakhil766@gmail.com";
export const ADMIN_PASSWORD = "akhil#55";

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  if (!password || password.length < 8) {
    errors.push("Password must be at least 8 characters.");
  }
  if (password && password.length > 16) {
    errors.push("Password cannot exceed 16 characters.");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Must include at least 1 lowercase letter (a-z).");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Must include at least 1 uppercase letter (A-Z).");
  }
  if (!/\d/.test(password)) {
    errors.push("Must include at least 1 number (0-9).");
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Must include at least 1 special character (e.g. !@#$%^&*).");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return "jp_hash_" + Math.abs(hash).toString(36) + "_" + btoa(password).split("").reverse().join("");
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getStoredUsers(): (User & { passwordHash?: string })[] {
  if (!isBrowser()) return [];
  try {
    let raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      const oldRaw = localStorage.getItem("jobhighway_registered_users");
      if (oldRaw) {
        raw = oldRaw;
        localStorage.setItem(USERS_STORAGE_KEY, oldRaw);
      }
    }
    if (raw) return JSON.parse(raw);
    
    // Seed initial demo candidate & Akhilesh account
    const initialUsers: (User & { passwordHash?: string })[] = [
      {
        id: "admin_founder",
        name: "Akhilesh Yadav",
        email: ADMIN_EMAIL,
        role: "admin",
        createdAt: new Date().toISOString(),
        targetCtc: "₹35,00,000 - ₹50,00,000",
        preferredLocation: "Bengaluru / Remote",
        targetRole: "Lead Data Engineer & Founder",
        skills: ["Python", "PostgreSQL", "Next.js", "Distributed Systems"],
        passwordHash: hashPassword("akhil#55")
      },
      {
        id: "candidate_rahul",
        name: "Rahul Sharma",
        email: "rahul.s@example.com",
        role: "user",
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
        targetCtc: "₹18,00,000 - ₹24,00,000",
        preferredLocation: "Bengaluru / Hybrid",
        targetRole: "Full Stack Engineer",
        skills: ["React", "TypeScript", "Node.js", "Docker"],
        passwordHash: hashPassword("Rahul#123")
      },
      {
        id: "candidate_priya",
        name: "Priya Patel",
        email: "priya.p@example.com",
        role: "user",
        createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
        targetCtc: "₹14,00,000 - ₹20,00,000",
        preferredLocation: "Remote",
        targetRole: "Frontend Developer",
        skills: ["React", "Next.js", "Tailwind CSS", "JavaScript"],
        passwordHash: hashPassword("Priya#123")
      }
    ];

    // Seed sample applied jobs for demo candidates so admin sees realistic live records immediately
    const sampleJobsRahul: AppliedJob[] = [
      {
        id: "app_rahul_1",
        jobId: "1",
        title: "Senior Backend Engineer",
        company: "Postman",
        location: "Bengaluru, India",
        salary: "₹28,00,000 - ₹38,00,000",
        applyUrl: "https://job-boards.greenhouse.io/postman",
        status: "Interview",
        appliedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        notes: "Technical Round 1 scheduled for Friday 3 PM"
      },
      {
        id: "app_rahul_2",
        jobId: "2",
        title: "Software Engineer - Payments",
        company: "Groww",
        location: "Bengaluru, India",
        salary: "₹20,00,000 - ₹30,00,000",
        applyUrl: "https://groww.in",
        status: "Under Review",
        appliedAt: new Date(Date.now() - 3600000 * 36).toISOString(),
        notes: "Resume shortlisted by recruiter"
      }
    ];

    const sampleJobsPriya: AppliedJob[] = [
      {
        id: "app_priya_1",
        jobId: "3",
        title: "Frontend Platform Engineer",
        company: "Thoughtworks",
        location: "Pune, India",
        salary: "₹16,00,000 - ₹22,00,000",
        applyUrl: "https://thoughtworks.com",
        status: "Offer",
        appliedAt: new Date(Date.now() - 3600000 * 60).toISOString(),
        notes: "Offer letter received! Base: 18 LPA + 2L joining bonus"
      }
    ];

    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialUsers));
    localStorage.setItem(APPLIED_STORAGE_PREFIX + "candidate_rahul", JSON.stringify(sampleJobsRahul));
    localStorage.setItem(APPLIED_STORAGE_PREFIX + "candidate_priya", JSON.stringify(sampleJobsPriya));

    return initialUsers;
  } catch {
    return [];
  }
}

export function getCurrentUser(): User | null {
  if (!isBrowser()) return null;
  try {
    let raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) {
      const oldRaw = localStorage.getItem("jobhighway_current_session");
      if (oldRaw) {
        raw = oldRaw;
        localStorage.setItem(SESSION_STORAGE_KEY, oldRaw);
      }
    }
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// ---------------- Admin Authentication ----------------
// ONLY yadavakhil766@gmail.com with password akhil#55 can log in as Admin
export function loginAdmin(email: string, password?: string): { user?: User; error?: string } {
  if (!isBrowser()) return { error: "Window not defined" };
  const cleanEmail = email.toLowerCase().trim();

  if (cleanEmail !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return { error: "Access Denied: Invalid Admin Email or Password." };
  }

  const users = getStoredUsers();
  let adminUser = users.find(u => u.email.toLowerCase() === ADMIN_EMAIL);
  if (!adminUser) {
    adminUser = {
      id: "admin_founder",
      name: "Akhilesh Yadav",
      email: ADMIN_EMAIL,
      role: "admin",
      createdAt: new Date().toISOString(),
      targetCtc: "₹35,00,000 - ₹50,00,000",
      preferredLocation: "Bengaluru / Remote",
      targetRole: "Lead Data Engineer & Founder",
      skills: ["Python", "PostgreSQL", "Next.js", "Distributed Systems"]
    };
    users.unshift(adminUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } else {
    adminUser.role = "admin";
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }

  const safeAdmin: User = {
    id: adminUser.id,
    name: adminUser.name,
    email: adminUser.email,
    role: "admin",
    createdAt: adminUser.createdAt,
    targetCtc: adminUser.targetCtc,
    preferredLocation: adminUser.preferredLocation,
    targetRole: adminUser.targetRole,
    skills: adminUser.skills
  };

  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(safeAdmin));
  window.dispatchEvent(new Event("jobhighway_auth_change"));
  return { user: safeAdmin };
}

// ---------------- Candidate Authentication ----------------
// Normal login NEVER grants admin privileges!
export function loginUser(email: string, password?: string): { user?: User; error?: string } {
  if (!isBrowser()) return { error: "Window not defined" };
  const cleanEmail = email.toLowerCase().trim();
  if (!cleanEmail) {
    return { error: "Please enter your email address." };
  }
  if (!password) {
    return { error: "Please enter your password." };
  }

  // Prevent administrator account from logging in via candidate portal
  if (cleanEmail === ADMIN_EMAIL) {
    return { error: "This portal is strictly for job candidates. Administrator accounts must authenticate via the administrative console." };
  }

  const users = getStoredUsers();
  const user = users.find(u => u.email.toLowerCase() === cleanEmail);
  
  if (!user) {
    return { error: "Account not found with this email. Please sign up first." };
  }

  // Strictly verify password hash
  if (user.passwordHash) {
    const enteredHash = hashPassword(password);
    if (user.passwordHash !== enteredHash) {
      return { error: "Incorrect password. Please verify or use 'Forgot Password'." };
    }
  } else {
    // If account had no hash yet, enforce strict password validation before saving
    const passValidation = validatePassword(password);
    if (!passValidation.isValid) {
      return { error: passValidation.errors[0] };
    }
    user.passwordHash = hashPassword(password);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }

  const safeUser: User = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role === "admin" && cleanEmail === ADMIN_EMAIL ? "admin" : "user",
    createdAt: user.createdAt,
    targetCtc: user.targetCtc,
    preferredLocation: user.preferredLocation,
    targetRole: user.targetRole,
    skills: user.skills
  };

  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(safeUser));
  window.dispatchEvent(new Event("jobhighway_auth_change"));
  return { user: safeUser };
}

export function registerUser(name: string, email: string, password?: string): { user?: User; error?: string } {
  if (!isBrowser()) return { error: "Window not defined" };
  const cleanEmail = email.toLowerCase().trim();
  if (!cleanEmail || !cleanEmail.includes("@")) {
    return { error: "Please enter a valid email address." };
  }

  if (!password) {
    return { error: "Password is required." };
  }

  // Strict Password Criteria Check
  const passValidation = validatePassword(password);
  if (!passValidation.isValid) {
    return { error: passValidation.errors[0] };
  }

  const users = getStoredUsers();
  const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    return { error: "An account with this email already exists. Please sign in or reset your password." };
  }

  const newUser: User & { passwordHash: string } = {
    id: "usr_" + Date.now(),
    name: name.trim() || cleanEmail.split("@")[0],
    email: cleanEmail,
    role: "user", // ALWAYS user
    createdAt: new Date().toISOString(),
    passwordHash: hashPassword(password)
  };

  users.push(newUser);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

  const safeUser: User = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: "user",
    createdAt: newUser.createdAt
  };

  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(safeUser));
  window.dispatchEvent(new Event("jobhighway_auth_change"));
  return { user: safeUser };
}

function generateSecureToken(): string {
  if (typeof window !== "undefined" && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint8Array(24);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, "0")).join("");
  }
  return "jp_tok_" + Math.random().toString(36).substring(2) + "_" + Date.now().toString(36);
}

export function getStoredResetTokens(): PasswordResetTokenRecord[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(RESET_TOKENS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function requestPasswordReset(email: string): { success: boolean; message: string; token?: string } {
  if (!isBrowser()) return { success: false, message: "Window not defined" };
  const cleanEmail = email.toLowerCase().trim();
  if (!cleanEmail || !cleanEmail.includes("@")) {
    return { success: false, message: "Please provide a valid email address." };
  }

  // Generic anti-enumeration response
  const genericMessage = "If an account exists for this email, a password reset link has been sent.";

  const users = getStoredUsers();
  const user = users.find(u => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    // Avoid revealing account presence
    return { success: true, message: genericMessage };
  }

  const tokens = getStoredResetTokens();
  // Rate-limiting check: max 1 reset request every 30s per email
  const recentToken = tokens.find(t => t.email.toLowerCase() === cleanEmail && (Date.now() - t.createdAt) < 30000);
  if (recentToken && !recentToken.used) {
    return {
      success: true,
      message: genericMessage,
      token: recentToken.token
    };
  }

  // Invalidate any existing unused tokens for this account
  for (const t of tokens) {
    if (t.email.toLowerCase() === cleanEmail && !t.used) {
      t.used = true;
    }
  }

  const token = generateSecureToken();
  const newRecord: PasswordResetTokenRecord = {
    token,
    email: cleanEmail,
    expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes validity
    used: false,
    createdAt: Date.now()
  };

  tokens.unshift(newRecord);
  if (tokens.length > 100) tokens.length = 100;
  localStorage.setItem(RESET_TOKENS_STORAGE_KEY, JSON.stringify(tokens));

  return {
    success: true,
    message: genericMessage,
    token
  };
}

export function verifyPasswordResetToken(token: string): { valid: boolean; email?: string; error?: string } {
  if (!isBrowser()) return { valid: false, error: "Window not defined" };
  if (!token || typeof token !== "string" || !token.trim()) {
    return { valid: false, error: "No reset token provided. Please request a new password reset link." };
  }

  const cleanToken = token.trim();
  const tokens = getStoredResetTokens();
  const record = tokens.find(t => t.token === cleanToken);

  if (!record) {
    return { valid: false, error: "Invalid or unrecognized reset token. Please request a new password reset link." };
  }

  if (record.used) {
    return { valid: false, error: "This password reset link has already been used. For your security, reset links are single-use." };
  }

  if (Date.now() > record.expiresAt) {
    return { valid: false, error: "This password reset link has expired. For your security, reset links are valid for 15 minutes." };
  }

  return { valid: true, email: record.email };
}

export function resetPasswordWithToken(token: string, newPassword: string): { success: boolean; error?: string } {
  if (!isBrowser()) return { success: false, error: "Window not defined" };

  const verification = verifyPasswordResetToken(token);
  if (!verification.valid || !verification.email) {
    return { success: false, error: verification.error || "Invalid or expired reset token." };
  }

  const passValidation = validatePassword(newPassword);
  if (!passValidation.isValid) {
    return { success: false, error: passValidation.errors[0] };
  }

  const users = getStoredUsers();
  const userIndex = users.findIndex(u => u.email.toLowerCase() === verification.email!.toLowerCase());
  if (userIndex === -1) {
    return { success: false, error: "The account associated with this reset link no longer exists." };
  }

  users[userIndex].passwordHash = hashPassword(newPassword);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

  // Invalidate token immediately
  const tokens = getStoredResetTokens();
  const tokenRecord = tokens.find(t => t.token === token.trim());
  if (tokenRecord) {
    tokenRecord.used = true;
    localStorage.setItem(RESET_TOKENS_STORAGE_KEY, JSON.stringify(tokens));
  }

  return { success: true };
}

export function resetUserPassword(email: string, newPassword: string): { success: boolean; error?: string } {
  if (!isBrowser()) return { success: false, error: "Window not defined" };
  const cleanEmail = email.toLowerCase().trim();
  if (!cleanEmail) {
    return { success: false, error: "Please enter your email address." };
  }

  const passValidation = validatePassword(newPassword);
  if (!passValidation.isValid) {
    return { success: false, error: passValidation.errors[0] };
  }

  const users = getStoredUsers();
  const userIndex = users.findIndex(u => u.email.toLowerCase() === cleanEmail);
  if (userIndex === -1) {
    return { success: false, error: "No registered account found with this email." };
  }

  users[userIndex].passwordHash = hashPassword(newPassword);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

  return { success: true };
}

export function logoutUser(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(SESSION_STORAGE_KEY);
  window.dispatchEvent(new Event("jobhighway_auth_change"));
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
    window.dispatchEvent(new Event("jobhighway_auth_change"));
  }

  return updated;
}

// ---------------- Applied Jobs Management ----------------

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
  window.dispatchEvent(new Event("jobhighway_applications_change"));
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
    window.dispatchEvent(new Event("jobhighway_applications_change"));
  }
  return current;
}

export function removeAppliedJob(userId: string, jobIdOrAppId: string): AppliedJob[] {
  if (!isBrowser() || !userId) return [];
  const current = getAppliedJobs(userId).filter(j => j.id !== jobIdOrAppId && j.jobId !== jobIdOrAppId);
  localStorage.setItem(APPLIED_STORAGE_PREFIX + userId, JSON.stringify(current));
  window.dispatchEvent(new Event("jobhighway_applications_change"));
  return current;
}

export function isJobApplied(userId: string, jobId: string): boolean {
  if (!isBrowser() || !userId) return false;
  const list = getAppliedJobs(userId);
  return list.some(j => j.jobId === jobId);
}

// ---------------- Bookmarks / Wishlist ----------------

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
  window.dispatchEvent(new Event("jobhighway_bookmarks_change"));
  return isSaved;
}

export function isJobBookmarked(userId: string, jobId: string): boolean {
  if (!isBrowser() || !userId) return false;
  const list = getBookmarks(userId);
  return list.some(b => b.jobId === jobId);
}

// ---------------- Admin Methods ----------------

export function getAllUsersForAdmin(): User[] {
  return getStoredUsers();
}

export function adminDeleteUser(userId: string): void {
  if (!isBrowser()) return;
  const users = getStoredUsers().filter(u => u.id !== userId);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

// Return all jobs applied across any specific user for Admin inspection
export function getUserApplicationsForAdmin(userId: string): AppliedJob[] {
  return getAppliedJobs(userId);
}

// ---------------- Followed Companies ----------------
export interface FollowedCompanyRecord {
  id: string;
  name: string;
  slug: string;
  followedAt: string;
}

const FOLLOWED_COMPANIES_PREFIX = "jobhighway_followed_companies_";

export function getFollowedCompanies(userId: string): FollowedCompanyRecord[] {
  if (!isBrowser() || !userId) return [];
  try {
    const raw = localStorage.getItem(FOLLOWED_COMPANIES_PREFIX + userId);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleFollowCompany(
  userId: string,
  company: { id: string | number; name: string; slug: string }
): boolean {
  if (!isBrowser() || !userId) return false;
  const current = getFollowedCompanies(userId);
  const companySlug = company.slug.toLowerCase().trim();
  const index = current.findIndex(c => c.slug.toLowerCase().trim() === companySlug || c.id === String(company.id));
  let isFollowing = false;

  if (index >= 0) {
    current.splice(index, 1);
    isFollowing = false;
  } else {
    current.unshift({
      id: String(company.id),
      name: company.name,
      slug: company.slug,
      followedAt: new Date().toISOString()
    });
    isFollowing = true;
  }

  localStorage.setItem(FOLLOWED_COMPANIES_PREFIX + userId, JSON.stringify(current));
  window.dispatchEvent(new Event("jobhighway_following_change"));
  return isFollowing;
}

export function isCompanyFollowed(userId: string, companySlugOrId: string): boolean {
  if (!isBrowser() || !userId) return false;
  const list = getFollowedCompanies(userId);
  const target = companySlugOrId.toLowerCase().trim();
  return list.some(c => c.slug.toLowerCase().trim() === target || c.id === companySlugOrId);
}

// ---------------- Job Alerts ----------------
export interface JobAlertRecord {
  id: string;
  role: string;
  location: string;
  workMode: string;
  enabled: boolean;
  createdAt: string;
  lastUpdated?: string;
  colorType?: "rose" | "amber" | "purple";
}

const JOB_ALERTS_PREFIX = "jobhighway_job_alerts_";

export function getJobAlerts(userId: string): JobAlertRecord[] {
  if (!isBrowser() || !userId) return [];
  try {
    const raw = localStorage.getItem(JOB_ALERTS_PREFIX + userId);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveJobAlert(
  userId: string, 
  alert: Omit<JobAlertRecord, "id" | "createdAt"> & { id?: string; createdAt?: string }
): JobAlertRecord[] {
  if (!isBrowser() || !userId) return [];
  const current = getJobAlerts(userId);

  // If editing an existing alert
  if (alert.id) {
    const index = current.findIndex(a => a.id === alert.id);
    if (index !== -1) {
      current[index] = {
        ...current[index],
        role: alert.role,
        location: alert.location,
        workMode: alert.workMode || current[index].workMode,
        colorType: alert.colorType || current[index].colorType,
        enabled: alert.enabled !== undefined ? alert.enabled : current[index].enabled,
        lastUpdated: "Edited just now"
      };
      localStorage.setItem(JOB_ALERTS_PREFIX + userId, JSON.stringify(current));
      window.dispatchEvent(new Event("jobhighway_alerts_change"));
      return current;
    }
  }

  // Creating a new alert
  const newAlert: JobAlertRecord = {
    id: alert.id || "alert_" + Date.now(),
    role: alert.role,
    location: alert.location,
    workMode: alert.workMode || "Remote",
    enabled: alert.enabled ?? true,
    createdAt: new Date().toISOString(),
    lastUpdated: "Just now",
    colorType: alert.colorType || "rose"
  };

  current.unshift(newAlert);
  localStorage.setItem(JOB_ALERTS_PREFIX + userId, JSON.stringify(current));
  window.dispatchEvent(new Event("jobhighway_alerts_change"));
  return current;
}

export function toggleJobAlert(userId: string, alertId: string, enabled: boolean): JobAlertRecord[] {
  if (!isBrowser() || !userId) return [];
  const current = getJobAlerts(userId);
  const item = current.find(a => a.id === alertId);
  if (item) {
    item.enabled = enabled;
    localStorage.setItem(JOB_ALERTS_PREFIX + userId, JSON.stringify(current));
    window.dispatchEvent(new Event("jobhighway_alerts_change"));
  }
  return current;
}

export function deleteJobAlert(userId: string, alertId: string): JobAlertRecord[] {
  if (!isBrowser() || !userId) return [];
  const current = getJobAlerts(userId).filter(a => a.id !== alertId);
  localStorage.setItem(JOB_ALERTS_PREFIX + userId, JSON.stringify(current));
  window.dispatchEvent(new Event("jobhighway_alerts_change"));
  return current;
}

