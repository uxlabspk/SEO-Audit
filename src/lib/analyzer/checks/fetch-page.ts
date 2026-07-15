import { CONFIG } from "../standards";

export interface FetchPageResult {
  ok: boolean;
  finalUrl: string;
  status: number;
  headers: Headers;
  html: string;
  elapsedSeconds: number;
  error?: string;
}

/**
 * Fetch the page and return response + timing info.
 * Port of Python's fetch_page().
 */
export async function fetchPage(url: string): Promise<FetchPageResult> {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    CONFIG.REQUEST_TIMEOUT_MS
  );
  const start = performance.now();

  try {
    const resp = await fetch(url, {
      headers: { "User-Agent": CONFIG.USER_AGENT },
      redirect: "follow",
      signal: controller.signal,
    });
    const html = await resp.text();
    const elapsedSeconds = (performance.now() - start) / 1000;

    return {
      ok: resp.ok,
      finalUrl: resp.url || url,
      status: resp.status,
      headers: resp.headers,
      html,
      elapsedSeconds,
    };
  } catch (err) {
    return {
      ok: false,
      finalUrl: url,
      status: 0,
      headers: new Headers(),
      html: "",
      elapsedSeconds: (performance.now() - start) / 1000,
      error: err instanceof Error ? err.message : String(err),
    };
  } finally {
    clearTimeout(timeout);
  }
}
