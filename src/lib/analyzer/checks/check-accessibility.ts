import type { CheerioAPI } from "cheerio";
import type { AccessibilityFindings } from "../types";

/**
 * Basic accessibility checks.
 * Port of Python's check_accessibility().
 */
export function checkAccessibility($: CheerioAPI): AccessibilityFindings {
  const imgs = $("img");
  const imgsMissingAlt: string[] = [];
  imgs.each((_, el) => {
    const $el = $(el);
    if (!$el.attr("alt")) {
      imgsMissingAlt.push($el.attr("src") || "unknown");
    }
  });

  const htmlTag = $("html").first();
  const hasLang = Boolean(htmlTag.length && htmlTag.attr("lang"));

  // heading order sanity check
  const headings: number[] = [];
  for (let level = 1; level <= 6; level++) {
    $(`h${level}`).each(() => {
      headings.push(level);
    });
  }
  let skipped = false;
  for (let i = 1; i < headings.length; i++) {
    if (headings[i] - headings[i - 1] > 1) {
      skipped = true;
      break;
    }
  }

  // form inputs without labels
  const inputs = $("input");
  let unlabeled = 0;
  inputs.each((_, el) => {
    const $el = $(el);
    const inputId = $el.attr("id");
    const inputType = $el.attr("type") || "text";
    if (["hidden", "submit", "button"].includes(inputType)) return;
    const hasLabel = Boolean(
      inputId && $(`label[for="${inputId}"]`).length > 0
    );
    const hasAria = Boolean($el.attr("aria-label") || $el.attr("aria-labelledby"));
    if (!hasLabel && !hasAria) unlabeled++;
  });

  // links with no discernible text
  const links = $("a");
  let emptyLinks = 0;
  links.each((_, el) => {
    const $el = $(el);
    if (!$el.text().trim() && !$el.attr("aria-label")) emptyLinks++;
  });

  return {
    images: {
      total: imgs.length,
      missing_alt: imgsMissingAlt.length,
      examples_missing_alt: imgsMissingAlt.slice(0, 10),
    },
    lang_attribute: { present: hasLang },
    heading_order: { skips_levels: skipped, sequence: headings.slice(0, 20) },
    form_inputs: { total: inputs.length, unlabeled },
    links: { total: links.length, empty_text_links: emptyLinks },
  };
}
