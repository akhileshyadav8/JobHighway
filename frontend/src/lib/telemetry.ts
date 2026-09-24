"use client";

import { mockJobs } from "@/lib/mock-data";

export type EventType = "pageview" | "apply_click" | "search" | "job_view" | "bookmark";

export interface AnalyticsEvent {
  id: string;
  type: EventType;
  path: string;
  device: "Mobile" | "Desktop" | "Tablet";
  screen: string;
  timestamp: string;
  meta?: Record<string, any>;
}

export interface AnalyticsSummary {
  totalPageviews: number;
  uniqueVisitors: number;
  totalApplyClicks: number;
  totalSearches: number;
  totalActiveJobs: number;
  deviceBreakdown: { mobile: number; desktop: number; tablet: number };
  topPages: { path: string; count: number }[];
  recentEvents: AnalyticsEvent[];
}

const ANALYTICS_KEY = "jobhighway_analytics_events";
const VISITOR_ID_KEY = "jobhighway_visitor_id";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function getVisitorId(): string {
  if (!isBrowser()) return "srv_visitor";
  let id = localStorage.getItem(VISITOR_ID_KEY);
  if (!id) {
    id = "vis_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now().toString(36);
    localStorage.setItem(VISITOR_ID_KEY, id);
  }
  return id;
}

function detectDevice(): "Mobile" | "Desktop" | "Tablet" {
  if (!isBrowser()) return "Desktop";
  const w = window.innerWidth;
  const ua = navigator.userAgent.toLowerCase();
  if (/ipad|tablet|(android(?!.*mobile))/.test(ua) || (w >= 768 && w <= 1024)) {
    return "Tablet";
  }
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/.test(ua) || w < 768) {
    return "Mobile";
  }
  return "Desktop";
}

export function trackEvent(type: EventType, meta?: Record<string, any>): void {
  if (!isBrowser()) return;
  try {
    const raw = localStorage.getItem(ANALYTICS_KEY);
    const events: AnalyticsEvent[] = raw ? JSON.parse(raw) : [];

    const newEvent: AnalyticsEvent = {
      id: "ev_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      type,
      path: window.location.pathname + window.location.search,
      device: detectDevice(),
      screen: `${window.innerWidth}x${window.innerHeight}`,
      timestamp: new Date().toISOString(),
      meta: {
        ...meta,
        visitorId: getVisitorId()
      }
    };

    // Keep max 500 events to manage client storage
    events.unshift(newEvent);
    if (events.length > 500) {
      events.length = 500;
    }

    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(events));
  } catch (err) {
    console.debug("Telemetry track error:", err);
  }
}

export function getAnalyticsSummary(): AnalyticsSummary {
  const dynamicActiveJobs = mockJobs ? mockJobs.length : 0;

  if (!isBrowser()) {
    return {
      totalPageviews: 0,
      uniqueVisitors: 0,
      totalApplyClicks: 0,
      totalSearches: 0,
      totalActiveJobs: dynamicActiveJobs,
      deviceBreakdown: { mobile: 0, desktop: 0, tablet: 0 },
      topPages: [],
      recentEvents: []
    };
  }

  try {
    const raw = localStorage.getItem(ANALYTICS_KEY);
    const events: AnalyticsEvent[] = raw ? JSON.parse(raw) : [];

    let pageviews = 0;
    let applyClicks = 0;
    let searches = 0;
    const visitorsSet = new Set<string>();
    const deviceCounts = { mobile: 0, desktop: 0, tablet: 0 };
    const pageCounts: Record<string, number> = {};

    for (const ev of events) {
      if (ev.type === "pageview") pageviews++;
      if (ev.type === "apply_click") applyClicks++;
      if (ev.type === "search") searches++;

      if (ev.meta?.visitorId) {
        visitorsSet.add(ev.meta.visitorId);
      }

      if (ev.device === "Mobile") deviceCounts.mobile++;
      else if (ev.device === "Tablet") deviceCounts.tablet++;
      else deviceCounts.desktop++;

      const basePath = ev.path.split("?")[0] || "/";
      pageCounts[basePath] = (pageCounts[basePath] || 0) + 1;
    }

    // Top pages list
    const topPages = Object.entries(pageCounts)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // If fresh browser session with no history yet, ensure current page is registered
    const currentUniqueVisitors = Math.max(visitorsSet.size, 1);
    const currentPageviews = Math.max(pageviews, 1);

    return {
      totalPageviews: currentPageviews,
      uniqueVisitors: currentUniqueVisitors,
      totalApplyClicks: applyClicks,
      totalSearches: searches,
      totalActiveJobs: dynamicActiveJobs,
      deviceBreakdown: {
        desktop: deviceCounts.desktop,
        mobile: deviceCounts.mobile,
        tablet: deviceCounts.tablet
      },
      topPages,
      recentEvents: events
    };
  } catch {
    return {
      totalPageviews: 1,
      uniqueVisitors: 1,
      totalApplyClicks: 0,
      totalSearches: 0,
      totalActiveJobs: dynamicActiveJobs,
      deviceBreakdown: { mobile: 0, desktop: 1, tablet: 0 },
      topPages: [{ path: "/", count: 1 }],
      recentEvents: []
    };
  }
}

export function clearAnalyticsEvents(olderThanMinutes?: number): void {
  if (!isBrowser()) return;
  try {
    if (!olderThanMinutes || olderThanMinutes <= 0) {
      localStorage.removeItem(ANALYTICS_KEY);
    } else {
      const raw = localStorage.getItem(ANALYTICS_KEY);
      const events: AnalyticsEvent[] = raw ? JSON.parse(raw) : [];
      const cutoff = Date.now() - (olderThanMinutes * 60 * 1000);
      const kept = events.filter(ev => {
        const evTime = new Date(ev.timestamp).getTime();
        return evTime >= cutoff;
      });
      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(kept));
    }
    window.dispatchEvent(new Event("jobhighway_analytics_update"));
  } catch (err) {
    console.debug("Error clearing analytics events:", err);
  }
}
