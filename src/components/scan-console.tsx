"use client";

import { cn } from "@/lib/utils";
import type { AnalysisStatus } from "@/lib/analyzer/types";
import { Loader2 } from "lucide-react";

interface ScanConsoleProps {
  status: AnalysisStatus | "IDLE";
  currentStep: string | null;
}

const CHECK_STAGES = [
  { key: "fetch", label: "Fetching page", match: /^fetching/i },
  { key: "ssl", label: "SSL / TLS", match: /ssl/i },
  { key: "security", label: "Security headers", match: /security headers/i },
  { key: "seo", label: "SEO signals", match: /seo signals/i },
  { key: "a11y", label: "Accessibility", match: /accessibility/i },
  { key: "perf", label: "Performance signals", match: /performance signals/i },
  { key: "mobile", label: "Mobile friendliness", match: /mobile friendliness/i },
  { key: "links", label: "Internal links", match: /internal links/i },
  { key: "pagespeed", label: "Core Web Vitals (PageSpeed)", match: /core web vitals/i },
  { key: "report", label: "Generating AI report", match: /ai report/i },
];

type StageState = "pending" | "active" | "done";

export function ScanConsole({ status, currentStep }: ScanConsoleProps) {
  if (status === "IDLE") return null;

  const activeIndex = currentStep
    ? CHECK_STAGES.findIndex((s) => s.match.test(currentStep))
    : status === "GENERATING_REPORT"
      ? CHECK_STAGES.length - 1
      : -1;

  const getState = (i: number): StageState => {
    if (status === "COMPLETE") return "done";
    if (status === "FAILED") return i < activeIndex ? "done" : "pending";
    if (activeIndex === -1) return i === 0 ? "active" : "pending";
    if (i < activeIndex) return "done";
    if (i === activeIndex) return "active";
    return "pending";
  };

  return (
    <div className="rounded-lg border border-border bg-card/60 font-mono text-sm">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5 text-xs text-muted-foreground">
        <span className="flex gap-1.5">
          <span className="size-2 rounded-full bg-destructive/70" />
          <span className="size-2 rounded-full bg-warning/70" />
          <span className="size-2 rounded-full bg-success/70" />
        </span>
        <span className="ml-1">scan.log</span>
      </div>
      <div className="flex flex-col gap-2 p-4">
        {CHECK_STAGES.map((stage, i) => {
          const s = getState(i);
          return (
            <div
              key={stage.key}
              className={cn(
                "flex items-center gap-3 transition-opacity duration-300",
                s === "pending" && "opacity-35"
              )}
            >
              <span className="flex w-4 shrink-0 items-center justify-center">
                {s === "done" && (
                  <span className="text-success">✓</span>
                )}
                {s === "active" && (
                  <Loader2 className="size-3.5 animate-spin text-primary" />
                )}
                {s === "pending" && (
                  <span className="text-muted-foreground">·</span>
                )}
              </span>
              <span
                className={cn(
                  s === "active" && "text-foreground",
                  s === "done" && "text-muted-foreground",
                  s === "pending" && "text-muted-foreground"
                )}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
        {status === "FAILED" && (
          <div className="mt-2 flex items-center gap-3 border-t border-border pt-3 text-destructive">
            <span className="w-4 shrink-0 text-center">✗</span>
            <span>Scan failed</span>
          </div>
        )}
      </div>
    </div>
  );
}
