import type { CheerioAPI } from "cheerio";
import type { SeoFindings } from "../types";

/**
 * Basic on-page SEO checks.
 * Port of Python's check_seo().
 */
export function checkSeo($: CheerioAPI): SeoFindings {
  const titleText = $("title").first().text().trim() || null;

  const metaDesc = $('meta[name="description"]').first();
  const descText = metaDesc.length
    ? (metaDesc.attr("content") || "").trim() || null
    : null;

  const h1s = $("h1");
  const h1Texts: string[] = [];
  h1s.each((i, el) => {
    if (i < 5) h1Texts.push($(el).text().trim());
  });

  const canonical = $('link[rel="canonical"]').length > 0;

  const robotsMeta = $('meta[name="robots"]').first();
  const robotsContent = robotsMeta.length
    ? robotsMeta.attr("content") || ""
    : null;

  const viewport = $('meta[name="viewport"]').length > 0;

  const ogTags = $('meta[property^="og:"]');

  return {
    title: {
      present: Boolean(titleText),
      text: titleText,
      length: titleText ? titleText.length : 0,
      ok_length: Boolean(titleText) && titleText!.length >= 10 && titleText!.length <= 60,
    },
    meta_description: {
      present: Boolean(descText),
      text: descText,
      length: descText ? descText.length : 0,
      ok_length: Boolean(descText) && descText!.length >= 50 && descText!.length <= 160,
    },
    h1: {
      count: h1s.length,
      texts: h1Texts,
      ok: h1s.length === 1,
    },
    canonical: { present: canonical },
    robots_meta: {
      present: Boolean(robotsMeta.length),
      content: robotsContent,
      blocks_indexing:
        Boolean(robotsMeta.length) &&
        (robotsContent || "").toLowerCase().includes("noindex"),
    },
    viewport_meta: { present: viewport },
    open_graph: { count: ogTags.length, present: ogTags.length > 0 },
  };
}
