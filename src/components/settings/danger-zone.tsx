"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Trash2 } from "lucide-react";

export function DangerZone() {
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleDelete() {
    if (confirm !== "DELETE") return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/account", { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to delete account");
      }
      router.push("/login");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
      <h2 className="text-sm font-medium text-destructive">Danger zone</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Permanently delete your account and all associated data. This action
        cannot be undone.
      </p>
      <div className="mt-4 space-y-3">
        <div>
          <label htmlFor="confirm-delete" className="text-xs text-muted-foreground">
            Type <span className="font-mono font-medium text-foreground">DELETE</span> to confirm
          </label>
          <Input
            id="confirm-delete"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="DELETE"
            className="mt-1 max-w-xs"
          />
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
        <Button
          variant="destructive"
          disabled={loading || confirm !== "DELETE"}
          onClick={handleDelete}
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
          Delete account
        </Button>
      </div>
    </div>
  );
}
