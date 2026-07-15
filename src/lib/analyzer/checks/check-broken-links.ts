import type { CheerioAPI } from "cheerio";
import type { BrokenLinksFindings } from "../types";
import { CONFIG } from "../standards";

/**
 * Sample-check internal links for broken status codes.
 * Port of Python's check_broken_links().
 */
export async function checkBrokenLinks(
  $: CheerioAPI,
  baseUrl: string
): Promise<BrokenLinksFindings> {
  const baseDomain = new URL(baseUrl).hostname;
  const internalLinks = new Set<string>();

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;
    try {
      const fullUrl = new URL(href, baseUrl).toString();
      const u = new URL(fullUrl);
      if (u.hostname === baseDomain && fullUrl.startsWith("http")) {
        internalLinks.add(fullUrl);
      }
    } catch {
      // invalid URL, skip
    }
  });

  const toCheck = Array.from(internalLinks).slice(0, CONFIG.MAX_LINKS_TO_CHECK);
  const checked: { url: string; status: number | null }[] = [];
  const broken: { url: string; status: number | null }[] = [];

  // Check links concurrently but capped, to keep this reasonably fast.
  const results = await Promise.all(
    toCheck.map(async (link) => {
      let status: number | null = null;
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        let resp: Response;
        try {
          resp = await fetch(link, {
            method: "HEAD",
            headers: { "User-Agent": CONFIG.USER_AGENT },
            redirect: "follow",
            signal: controller.signal,
          });
          status = resp.status;
          // some servers don't support HEAD properly
          if (status >= 400) {
            const getResp = await fetch(link, {
              method: "GET",
              headers: { "User-Agent": CONFIG.USER_AGENT },
              redirect: "follow",
              signal: controller.signal,
            });
            status = getResp.status;
          }
        } finally {
          clearTimeout(timeout);
        }
      } catch {
        status = null;
      }
      return { url: link, status };
    })
  );

  for (const result of results) {
    checked.push(result);
    if (result.status === null || result.status >= 400) {
      broken.push(result);
    }
  }

  return {
    total_internal_links_found: internalLinks.size,
    checked_count: checked.length,
    broken_count: broken.length,
    broken_links: broken,
  };
}
