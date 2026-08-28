"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2 } from "lucide-react";

interface ProfileFormProps {
  name: string | null;
  email: string;
}

export function ProfileForm({ name, email }: ProfileFormProps) {
  const [value, setValue] = useState(name || "");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: value.trim() }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          typeof body.error === "string" ? body.error : "Failed to update"
        );
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border bg-card p-6">
      <h2 className="text-sm font-medium">Profile</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Your profile information visible to you.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label className="text-xs text-muted-foreground">Email</label>
          <p className="text-sm">{email}</p>
        </div>
        <div>
          <label htmlFor="name" className="text-xs text-muted-foreground">
            Name
          </label>
          <Input
            id="name"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Your name"
            className="mt-1"
          />
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
        <div className="flex items-center gap-2">
          <Button type="submit" disabled={loading || value === (name || "")}>
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : saved ? (
              <CheckCircle2 className="size-4" />
            ) : null}
            {saved ? "Saved" : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
