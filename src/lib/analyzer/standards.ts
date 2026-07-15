import type { StandardsReference } from "./types";

// Current standards (as of mid-2026), used to grade the report.
// Keep this updated periodically -- these are the numbers that make the
// report defensible to a paying client.
export const STANDARDS: StandardsReference = {
  core_web_vitals: {
    LCP: {
      good: 2.5,
      poor: 4.0,
      unit: "seconds",
      note: "Largest Contentful Paint. Google: 'good' UX = LCP within 2.5s.",
    },
    INP: {
      good: 200,
      poor: 500,
      unit: "milliseconds",
      note: "Interaction to Next Paint. Replaced FID in March 2024. Google: 'good' UX = INP under 200ms.",
    },
    CLS: {
      good: 0.1,
      poor: 0.25,
      unit: "score",
      note: "Cumulative Layout Shift. Google: 'good' UX = CLS under 0.1.",
    },
    measured_as:
      "75th percentile of real-user page loads (Google's own pass/fail bar)",
  },
  seo: {
    title_length: { min: 10, max: 60, unit: "characters" },
    meta_description_length: { min: 50, max: 160, unit: "characters" },
    h1_count: { ideal: 1 },
  },
};

export const CONFIG = {
  REQUEST_TIMEOUT_MS: 15_000,
  USER_AGENT: "Mozilla/5.0 (compatible; SiteAnalyzerBot/1.0)",
  MAX_LINKS_TO_CHECK: 25,
  PAGESPEED_API_URL:
    "https://www.googleapis.com/pagespeedonline/v5/runPagespeed",
  USE_PAGESPEED: process.env.USE_PAGESPEED !== "false",
  PAGESPEED_API_KEY: process.env.PAGESPEED_API_KEY || "",
};
