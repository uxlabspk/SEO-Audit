"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, Globe } from "lucide-react";

interface UrlFormProps {
  onSubmit: (url: string, fullAudit: boolean) => void;
  isRunning: boolean;
}

export function UrlForm({ onSubmit, isRunning }: UrlFormProps) {
  const [url, setUrl] = useState("");
  const [fullAudit, setFullAudit] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!url.trim() || isRunning) return;
        onSubmit(url.trim(), fullAudit);
      }}
      className="flex w-full flex-col gap-3"
    >
      <div className="flex w-full flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 font-mono text-sm text-muted-foreground">
            $
          </span>
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="example.com"
            disabled={isRunning}
            className="h-12 rounded-md border-border bg-secondary/40 pl-7 font-mono text-sm placeholder:text-muted-foreground/60"
            autoFocus
          />
        </div>
        <Button
          type="submit"
          disabled={isRunning || !url.trim()}
          size="lg"
          className="h-12 gap-2 px-6 font-medium"
        >
          {isRunning ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Scanning
            </>
          ) : (
            <>
              Run audit
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </div>
      <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer select-none">
        <input
          type="checkbox"
          checked={fullAudit}
          onChange={(e) => setFullAudit(e.target.checked)}
          disabled={isRunning}
          className="size-4 rounded border-border accent-primary"
        />
        <Globe className="size-3.5" />
        Full website audit — crawl entire site and audit all pages
      </label>
    </form>
  );
}
