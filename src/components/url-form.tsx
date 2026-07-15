"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";

interface UrlFormProps {
  onSubmit: (url: string) => void;
  isRunning: boolean;
}

export function UrlForm({ onSubmit, isRunning }: UrlFormProps) {
  const [url, setUrl] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!url.trim() || isRunning) return;
        onSubmit(url.trim());
      }}
      className="flex w-full flex-col gap-3 sm:flex-row"
    >
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
    </form>
  );
}
