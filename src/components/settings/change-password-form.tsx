"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react";

export function ChangePasswordForm() {
  const [current, setCurrent] = useState("");
  const [newPw, setNewPw] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSaved(false);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: current, newPassword: newPw }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (typeof body.error === "object" && body.error !== null) {
          setErrors(body.error);
        } else {
          setErrors({ form: body.error || "Failed to change password" });
        }
        return;
      }
      setSaved(true);
      setCurrent("");
      setNewPw("");
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setErrors({ form: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border bg-card p-6">
      <h2 className="text-sm font-medium">Change password</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Update your password to keep your account secure.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label htmlFor="current-pw" className="text-xs text-muted-foreground">
            Current password
          </label>
          <div className="relative mt-1">
            <Input
              id="current-pw"
              type={showCurrent ? "text" : "password"}
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="mt-1 text-xs text-destructive">{errors.currentPassword}</p>
          )}
        </div>
        <div>
          <label htmlFor="new-pw" className="text-xs text-muted-foreground">
            New password
          </label>
          <div className="relative mt-1">
            <Input
              id="new-pw"
              type={showNew ? "text" : "password"}
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="mt-1 text-xs text-destructive">{errors.newPassword}</p>
          )}
        </div>
        {errors.form && <p className="text-xs text-destructive">{errors.form}</p>}
        <div className="flex items-center gap-2">
          <Button type="submit" disabled={loading || !current || !newPw}>
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : saved ? (
              <CheckCircle2 className="size-4" />
            ) : null}
            {saved ? "Updated" : "Change password"}
          </Button>
        </div>
      </form>
    </div>
  );
}
