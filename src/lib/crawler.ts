import * as cheerio from "cheerio";

const CRAWL_CONFIG = {
  MAX_PAGES: 50,
  MAX_DEPTH: 3,
  REQUEST_TIMEOUT_MS: 10_000,
  DELAY_MS: 300,
  USER_AGENT: "Mozilla/5.0 (compatible; SiteAnalyzerBot/1.0)",
};

export interface CrawlResult {
  urls: string[];
  errors: string[];
}

export async function crawlSite(
  startUrl: string,
  onProgress?: (step: string) => void | Promise<void>
): Promise<CrawlResult> {
  const base = new URL(startUrl);
  const origin = base.origin;

  const visited = new Set<string>();
  const queue: { url: string; depth: number }[] = [{ url: startUrl, depth: 0 }];
  const urls: string[] = [];
  const errors: string[] = [];

  while (queue.length > 0 && urls.length < CRAWL_CONFIG.MAX_PAGES) {
    const { url, depth } = queue.shift()!;
    const normalized = normalizeUrl(url);

    if (visited.has(normalized)) continue;
    if (depth > CRAWL_CONFIG.MAX_DEPTH) continue;
    if (!isSameOrigin(normalized, origin)) continue;

    visited.add(normalized);

    await onProgress?.(`Crawling page ${urls.length + 1}: ${normalized}`);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(
        () => controller.abort(),
        CRAWL_CONFIG.REQUEST_TIMEOUT_MS
      );

      const resp = await fetch(normalized, {
        headers: {
          "User-Agent": CRAWL_CONFIG.USER_AGENT,
          Accept: "text/html",
        },
        redirect: "follow",
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!resp.ok) continue;

      const contentType = resp.headers.get("content-type") || "";
      if (!contentType.includes("text/html")) continue;

      const html = await resp.text();
      const $ = cheerio.load(html);

      // Respect noindex
      if ($('meta[name="robots"][content*="noindex"]').length) continue;

      urls.push(normalized);

      // Extract links for further crawling
      if (depth < CRAWL_CONFIG.MAX_DEPTH) {
        $('a[href]').each((_, el) => {
          const href = $(el).attr("href");
          if (!href) return;

          try {
            const absolute = new URL(href, normalized).toString();
            const norm = normalizeUrl(absolute);
            if (!visited.has(norm) && isSameOrigin(norm, origin)) {
              queue.push({ url: norm, depth: depth + 1 });
            }
          } catch {
            // invalid URL, skip
          }
        });
      }

      // Polite delay
      if (queue.length > 0) {
        await sleep(CRAWL_CONFIG.DELAY_MS);
      }
    } catch (err) {
      errors.push(`${normalized}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return { urls, errors };
}

function normalizeUrl(raw: string): string {
  try {
    const url = new URL(raw);
    url.hash = "";
    // Remove trailing slash for consistency
    const path = url.pathname.replace(/\/+$/, "") || "/";
    // Skip common non-page extensions
    const ext = path.split(".").pop()?.toLowerCase();
    const skipExts = ["jpg", "jpeg", "png", "gif", "svg", "webp", "ico", "css", "js", "json", "xml", "pdf", "zip"];
    if (ext && skipExts.includes(ext)) {
      return ""; // will be filtered
    }
    url.pathname = path;
    return url.toString();
  } catch {
    return raw;
  }
}

function isSameOrigin(url: string, origin: string): boolean {
  try {
    return new URL(url).origin === origin;
  } catch {
    return false;
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
