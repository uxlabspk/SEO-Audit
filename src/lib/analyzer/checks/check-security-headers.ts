import type { SecurityHeaders } from "../types";

/**
 * Check for important security-related HTTP headers.
 * Port of Python's check_security_headers().
 */
export function checkSecurityHeaders(headers: Headers): SecurityHeaders {
  const h = (name: string) => headers.has(name.toLowerCase());

  const checks: Record<string, boolean> = {
    "Strict-Transport-Security": h("strict-transport-security"),
    "Content-Security-Policy": h("content-security-policy"),
    "X-Content-Type-Options": h("x-content-type-options"),
    "X-Frame-Options": h("x-frame-options") || h("content-security-policy"),
    "Referrer-Policy": h("referrer-policy"),
    "Permissions-Policy": h("permissions-policy"),
  };

  const missing = Object.entries(checks)
    .filter(([, present]) => !present)
    .map(([key]) => key);

  const present = Object.fromEntries(
    Object.entries(checks).filter(([, present]) => present)
  );

  return { present, missing };
}
