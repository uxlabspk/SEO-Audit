"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Loader2, Upload, X } from "lucide-react";

interface AvatarUploadProps {
  avatar: string | null;
  name: string | null;
  email: string;
  onUpdated: (avatar: string | null) => void;
}

export function AvatarUpload({
  avatar,
  name,
  email,
  onUpdated,
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be under 2MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleUpload() {
    if (!preview) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: preview }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to upload");
      }
      onUpdated(preview);
      setPreview(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove() {
    setLoading(true);
    try {
      await fetch("/api/auth/avatar", { method: "DELETE" });
      onUpdated(null);
      setPreview(null);
    } finally {
      setLoading(false);
    }
  }

  const current = preview || avatar;

  return (
    <div className="flex items-center gap-4">
      <UserAvatar avatar={current} name={name} email={email} size={64} />
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={loading}
          >
            <Upload className="size-4" />
            {preview ? "Change" : "Upload"}
          </Button>
          {preview && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPreview(null)}
              disabled={loading}
            >
              Cancel
            </Button>
          )}
          {avatar && !preview && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              disabled={loading}
            >
              <X className="size-4" />
              Remove
            </Button>
          )}
        </div>
        {preview && (
          <Button
            type="button"
            size="sm"
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            Save avatar
          </Button>
        )}
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    </div>
  );
}
