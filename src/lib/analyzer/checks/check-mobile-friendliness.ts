import type { CheerioAPI } from "cheerio";
import type { MobileFriendlinessFindings } from "../types";

/**
 * Port of Python's check_mobile_friendliness().
 */
export function checkMobileFriendliness($: CheerioAPI): MobileFriendlinessFindings {
  const viewport = $('meta[name="viewport"]').first();
  const viewportContent = viewport.length ? viewport.attr("content") || "" : "";

  return {
    has_viewport_meta: viewport.length > 0,
    viewport_content: viewportContent,
    likely_responsive: viewportContent.includes("width=device-width"),
  };
}
