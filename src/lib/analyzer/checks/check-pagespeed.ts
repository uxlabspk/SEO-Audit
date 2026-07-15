import type { PageSpeedResult } from "../types";
import { CONFIG } from "../standards";

// Minimal shape of the raw PageSpeed Insights API response we read from.
// The full response has many more fields; we only type what we consume.
interface PageSpeedApiResponse {
  loadingExperience?: {
    metrics?: Record<
      string,
      { percentile: number; category: string }
    >;
    overall_category?: string;
  };
  lighthouseResult?: {
    categories?: Record<string, { score: number | null }>;
    audits?: Record<string, { displayValue?: string }>;
  };
}

/**
 * Pull real Core Web Vitals + Lighthouse scores from Google's PageSpeed
 * Insights API. This is the same data Google itself uses to judge page
 * experience, so it's the most credible number in the whole report.
 * Port of Python's check_pagespeed().
 */
export async function checkPagespeed(
  url: string,
  strategy: "mobile" | "desktop" = "mobile"
): Promise<PageSpeedResult> {
  const params = new URLSearchParams({ url, strategy });
  params.append("category", "PERFORMANCE");
  params.append("category", "SEO");
  params.append("category", "ACCESSIBILITY");
  params.append("category", "BEST_PRACTICES");
  if (CONFIG.PAGESPEED_API_KEY) {
    params.set("key", CONFIG.PAGESPEED_API_KEY);
  }

  let data: PageSpeedApiResponse;
  try {
    const resp = await fetch(`${CONFIG.PAGESPEED_API_URL}?${params.toString()}`, {
      signal: AbortSignal.timeout(60_000),
    });
    if (!resp.ok) {
      const text = await resp.text();
      return {
        available: false,
        error: `HTTP ${resp.status}: ${text.slice(0, 200)}`,
      };
    }
    data = await resp.json();
  } catch (e) {
    return {
      available: false,
      error: e instanceof Error ? e.message : String(e),
    };
  }

  const result: PageSpeedResult = { available: true, strategy };

  // Field data (real user CrUX data) -- the numbers Google actually ranks on
  const loadingExp = data.loadingExperience || {};
  const metrics = loadingExp.metrics || {};
  if (Object.keys(metrics).length > 0) {
    const field: PageSpeedResult["field_data_real_users"] = {};

    const lcp = metrics.LARGEST_CONTENTFUL_PAINT_MS;
    if (lcp) {
      field.LCP_seconds = Math.round((lcp.percentile / 1000) * 100) / 100;
      field.LCP_category = lcp.category;
    }
    const inp = metrics.INTERACTION_TO_NEXT_PAINT;
    if (inp) {
      field.INP_ms = inp.percentile;
      field.INP_category = inp.category;
    }
    const cls = metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE;
    if (cls) {
      field.CLS = Math.round((cls.percentile / 100) * 1000) / 1000;
      field.CLS_category = cls.category;
    }
    result.field_data_real_users = field;
    result.overall_category = loadingExp.overall_category;
  } else {
    result.field_data_real_users = null;
    result.note =
      "No real-user field data available (site may have low traffic in Chrome UX Report)";
  }

  // Lab data (Lighthouse simulated scores) -- fallback/supplement when field data is missing
  const lighthouse = data.lighthouseResult || {};
  const categories = lighthouse.categories || {};
  result.lighthouse_scores = Object.fromEntries(
    Object.entries(categories).map(([name, cat]) => [
      name,
      cat?.score != null ? Math.round(cat.score * 100) : null,
    ])
  );

  const audits = lighthouse.audits || {};
  const labMetrics: Record<string, string> = {};
  const auditMap: [string, string][] = [
    ["largest-contentful-paint", "LCP"],
    ["cumulative-layout-shift", "CLS"],
    ["total-blocking-time", "TBT_ms"],
    ["speed-index", "speed_index"],
    ["interactive", "time_to_interactive"],
  ];
  for (const [key, label] of auditMap) {
    const audit = audits[key];
    if (audit?.displayValue) {
      labMetrics[label] = audit.displayValue;
    }
  }
  result.lighthouse_lab_metrics = labMetrics;

  return result;
}
