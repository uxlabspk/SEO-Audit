"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Mail,
  Loader2,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";

export function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const success = searchParams.get("success") === "true";
  const error = searchParams.get("error");

  async function handleResend() {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-verification", {
        method: "POST",
      });
      if (res.ok) {
        setSent(true);
      }
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="size-8 text-success" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Email verified
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your email has been verified. You now have full access to all features.
        </p>
        <Link href="/dashboard" className="mt-6 block">
          <Button className="w-full">Go to dashboard</Button>
        </Link>
      </div>
    );
  }

  if (error) {
    const errorMessage =
      error === "missing-token"
        ? "No verification token provided."
        : error === "invalid-token"
          ? "This verification link is invalid or has expired."
          : "Something went wrong. Please try again.";

    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="size-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Verification failed
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{errorMessage}</p>
        <div className="mt-6 space-y-3">
          <Button onClick={handleResend} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Resend verification email"
            )}
          </Button>
          <Link href="/login">
            <Button variant="ghost" className="w-full gap-2">
              <ArrowLeft className="size-4" />
              Back to sign in
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10">
        <Mail className="size-8 text-primary" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">
        Check your email
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        We&apos;ve sent a verification link to your email address. Click the
        link to verify your account.
      </p>

      {sent && (
        <div className="mt-4 rounded-lg border bg-success/5 p-3 text-sm text-success">
          Verification email sent successfully.
        </div>
      )}

      <div className="mt-6 space-y-3">
        <Button onClick={handleResend} disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Resend verification email"
          )}
        </Button>
        <Link href="/login">
          <Button variant="ghost" className="w-full gap-2">
            <ArrowLeft className="size-4" />
            Back to sign in
          </Button>
        </Link>
      </div>
    </div>
  );
}
