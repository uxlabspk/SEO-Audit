import * as cheerio from "cheerio";
import type { Findings } from "./types";
import { STANDARDS, CONFIG } from "./standards";
import { fetchPage } from "./checks/fetch-page";
import { checkSsl } from "./checks/check-ssl";
import { checkSecurityHeaders } from "./checks/check-security-headers";
import { checkSeo } from "./checks/check-seo";
import { checkAccessibility } from "./checks/check-accessibility";
import { checkPerformance } from "./checks/check-performance";
import { checkBrokenLinks } from "./checks/check-broken-links";
import { checkPagespeed } from "./checks/check-pagespeed";
import { checkMobileFriendliness } from "./checks/check-mobile-friendliness";

export type ProgressCallback = (step: string) => void | Promise<void>;

export class AnalysisFetchError extends Error {}

/**
 * Run every automated check against a URL and assemble the findings object.
 * Port of Python's run_all_checks(). Designed to be called from an API
 * route or background job; report progress via onProgress so the caller
 * can persist/stream status updates.
 */
export async function runAllChecks(
  rawUrl: string,
  onProgress: ProgressCallback = () => {}
): Promise<Findings> {
  await onProgress(`Fetching ${rawUrl} ...`);
  const page = await fetchPage(rawUrl);
  if (page.error || !page.html) {
    throw new AnalysisFetchError(
      page.error || `Could not fetch page (status ${page.status})`
    );
  }

  const $ = cheerio.load(page.html);

  await onProgress("Checking SSL/TLS ...");
  const ssl = await checkSsl(page.finalUrl);

  await onProgress("Checking security headers ...");
  const security = checkSecurityHeaders(page.headers);

  await onProgress("Checking SEO signals ...");
  const seo = checkSeo($);

  await onProgress("Checking accessibility ...");
  const a11y = checkAccessibility($);

  await onProgress("Checking performance signals ...");
  const perf = checkPerformance(page.headers, page.html, page.elapsedSeconds, $);

  await onProgress("Checking mobile friendliness ...");
  const mobile = checkMobileFriendliness($);

  await onProgress(`Checking internal links (up to ${CONFIG.MAX_LINKS_TO_CHECK}) ...`);
  const links = await checkBrokenLinks($, page.finalUrl);

  let pagespeed = null;
  if (CONFIG.USE_PAGESPEED) {
    await onProgress(
      "Fetching real Core Web Vitals from Google PageSpeed Insights (may take 15-30s) ..."
    );
    pagespeed = await checkPagespeed(page.finalUrl, "mobile");
  }

  const findings: Findings = {
    url: page.finalUrl,
    status_code: page.status,
    analyzed_at: new Date().toISOString(),
    standards_reference: STANDARDS,
    ssl,
    security_headers: security,
    seo,
    accessibility: a11y,
    performance: perf,
    pagespeed_core_web_vitals: pagespeed,
    mobile_friendliness: mobile,
    links,
  };

  return findings;
}
