import nodemailer from "nodemailer";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return value.toLowerCase() === "true";
}

function getTransportConfig() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? "587");
  const secure = parseBoolean(process.env.SMTP_SECURE, port === 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return null;

  return {
    host,
    port,
    secure,
    auth: { user, pass },
  };
}

// ponytail: retry on transient DNS/connectivity failures
export async function sendEmail(
  { to, subject, html }: SendEmailOptions,
  retries = 3
): Promise<boolean> {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const config = getTransportConfig();

  if (!from || !config) {
    console.warn("Email service is not configured. Skipping email send.");
    return false;
  }

  const transporter = nodemailer.createTransport(config);

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await transporter.sendMail({ from, to, subject, html });
      return true;
    } catch (err) {
      if (attempt === retries) {
        console.error("Email send failed after retries:", err);
        return false;
      }
      await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }

  return false;
}

export function buildVerifyEmailLink(token: string, email?: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const url = new URL(base);
  url.pathname = "/verify-email";
  url.searchParams.set("token", token);
  if (email) url.searchParams.set("email", email);
  return url.toString();
}

export function buildResetPasswordLink(token: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${base}/reset-password?token=${encodeURIComponent(token)}`;
}

export function verificationEmailHtml(url: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      <div style="max-width:480px;margin:40px auto;background:#ffffff;border-radius:12px;border:1px solid #e4e4e7;overflow:hidden;">
        <div style="background:#16a34a;padding:32px;text-align:center;">
          <div style="display:inline-flex;align-items:center;justify-content:center;width:48px;height:48px;background:rgba(255,255,255,0.2);border-radius:10px;margin-bottom:12px;">
            <span style="color:#ffffff;font-family:monospace;font-size:20px;font-weight:bold;">P</span>
          </div>
          <h1 style="color:#ffffff;font-size:20px;margin:0;">Verify your email</h1>
        </div>
        <div style="padding:32px;">
          <p style="color:#27272a;font-size:15px;line-height:1.6;margin:0 0 20px;">
            Thanks for signing up for Probe. Click the button below to verify your email address and get started.
          </p>
          <a href="${url}" style="display:inline-block;background:#16a34a;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;padding:12px 32px;border-radius:8px;">
            Verify email address
          </a>
          <p style="color:#a1a1aa;font-size:13px;line-height:1.6;margin:24px 0 0;">
            This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function passwordResetEmailHtml(url: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      <div style="max-width:480px;margin:40px auto;background:#ffffff;border-radius:12px;border:1px solid #e4e4e7;overflow:hidden;">
        <div style="background:#16a34a;padding:32px;text-align:center;">
          <div style="display:inline-flex;align-items:center;justify-content:center;width:48px;height:48px;background:rgba(255,255,255,0.2);border-radius:10px;margin-bottom:12px;">
            <span style="color:#ffffff;font-family:monospace;font-size:20px;font-weight:bold;">P</span>
          </div>
          <h1 style="color:#ffffff;font-size:20px;margin:0;">Reset your password</h1>
        </div>
        <div style="padding:32px;">
          <p style="color:#27272a;font-size:15px;line-height:1.6;margin:0 0 20px;">
            We received a request to reset your password. Click the button below to set a new one.
          </p>
          <a href="${url}" style="display:inline-block;background:#16a34a;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;padding:12px 32px;border-radius:8px;">
            Reset password
          </a>
          <p style="color:#a1a1aa;font-size:13px;line-height:1.6;margin:24px 0 0;">
            This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
