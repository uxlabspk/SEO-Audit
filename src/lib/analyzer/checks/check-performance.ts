import type { CheerioAPI } from "cheerio";
import type { PerformanceFindings } from "../types";

/**
 * Basic performance signals from a plain HTTP fetch (no browser rendering).
 * Port of Python's check_performance().
 */
export function checkPerformance(
  headers: Headers,
  html: string,
  elapsedSeconds: number,
  $: CheerioAPI
): PerformanceFindings {
  const pageSizeKb = Math.round((new TextEncoder().encode(html).length / 1024) * 10) / 10;

  const compression = headers.get("content-encoding");
  const cacheControl = headers.get("cache-control");

  const scripts = $("script[src]");
  const stylesheets = $('link[rel="stylesheet"]');
  const inlineScripts = $("script:not([src])");
  const images = $("img");

  // render-blocking check: scripts in <head> without async/defer
  const head = $("head");
  let blockingScripts = 0;
  if (head.length) {
    head.find("script[src]").each((_, el) => {
      const $el = $(el);
      if ($el.attr("async") === undefined && $el.attr("defer") === undefined) {
        blockingScripts++;
      }
    });
  }

  // images without width/height (causes layout shift)
  let imgsNoDimensions = 0;
  images.each((_, el) => {
    const $el = $(el);
    if (!($el.attr("width") && $el.attr("height"))) imgsNoDimensions++;
  });

  // lazy loading usage
  let lazyImages = 0;
  images.each((_, el) => {
    if ($(el).attr("loading") === "lazy") lazyImages++;
  });

  return {
    response_time_seconds: Math.round(elapsedSeconds * 1000) / 1000,
    page_size_kb: pageSizeKb,
    compression: { enabled: Boolean(compression), type: compression },
    caching: { present: Boolean(cacheControl), value: cacheControl },
    resource_counts: {
      external_scripts: scripts.length,
      inline_scripts: inlineScripts.length,
      stylesheets: stylesheets.length,
      images: images.length,
    },
    render_blocking_scripts_in_head: blockingScripts,
    images_missing_dimensions: imgsNoDimensions,
    images_using_lazy_load: lazyImages,
  };
}
