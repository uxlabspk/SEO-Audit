import tls from "node:tls";
import type { SslInfo } from "../types";
import { CONFIG } from "../standards";

/**
 * Check SSL certificate validity and expiry.
 * Port of Python's check_ssl(). Uses Node's `tls` module directly since
 * fetch() does not expose certificate details. Server-side only.
 */
export function checkSsl(url: string): Promise<SslInfo> {
  const parsed = new URL(url);

  if (parsed.protocol !== "https:") {
    return Promise.resolve({
      has_ssl: false,
      note: "Site is not served over HTTPS",
    });
  }

  const hostname = parsed.hostname;
  const port = parsed.port ? Number(parsed.port) : 443;

  return new Promise((resolve) => {
    const socket = tls.connect(
      {
        host: hostname,
        port,
        servername: hostname,
        timeout: CONFIG.REQUEST_TIMEOUT_MS,
      },
      () => {
        try {
          const cert = socket.getPeerCertificate();
          const notAfter = cert.valid_to; // e.g. "Jan  1 00:00:00 2027 GMT"
          const expiry = new Date(notAfter);
          const daysLeft = Math.floor(
            (expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          );

          resolve({
            has_ssl: true,
            expires: expiry.toISOString(),
            days_until_expiry: daysLeft,
            issuer: cert.issuer as unknown as Record<string, string>,
          });
        } catch (e) {
          resolve({
            has_ssl: false,
            error: e instanceof Error ? e.message : String(e),
          });
        } finally {
          socket.end();
        }
      }
    );

    socket.on("error", (err) => {
      resolve({ has_ssl: false, error: err.message });
    });

    socket.on("timeout", () => {
      socket.destroy();
      resolve({ has_ssl: false, error: "SSL connection timed out" });
    });
  });
}
