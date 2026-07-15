import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import type { AnalysisStatus } from "@prisma/client";

interface Analysis {
  id: string;
  url: string;
  status: AnalysisStatus;
  performanceScore: number | null;
  seoScore: number | null;
  accessibilityScore: number | null;
  bestPracticesScore: number | null;
  createdAt: Date;
  completedAt: Date | null;
}

function StatusBadge({ status }: { status: AnalysisStatus }) {
  const variants: Record<
    AnalysisStatus,
    { label: string; className: string }
  > = {
    QUEUED: { label: "Queued", className: "bg-muted text-muted-foreground" },
    FETCHING: {
      label: "Fetching",
      className: "bg-primary/10 text-primary",
    },
    RUNNING_CHECKS: {
      label: "Running",
      className: "bg-primary/10 text-primary",
    },
    GENERATING_REPORT: {
      label: "Generating",
      className: "bg-primary/10 text-primary",
    },
    COMPLETE: {
      label: "Complete",
      className: "bg-success/10 text-success",
    },
    FAILED: {
      label: "Failed",
      className: "bg-destructive/10 text-destructive",
    },
  };

  const { label, className } = variants[status];
  return (
    <Badge variant="secondary" className={`text-xs ${className}`}>
      {label}
    </Badge>
  );
}

function ScoreIndicator({
  label,
  score,
}: {
  label: string;
  score: number | null;
}) {
  if (score === null) return null;
  const color =
    score >= 90 ? "text-success" : score >= 50 ? "text-warning" : "text-destructive";
  return (
    <div className="text-center">
      <div className={`text-lg font-semibold ${color}`}>{score}</div>
      <div className="text-[10px] uppercase text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

export function AnalysisCard({ analysis }: { analysis: Analysis }) {
  const hostname = (() => {
    try {
      return new URL(analysis.url).hostname;
    } catch {
      return analysis.url;
    }
  })();

  return (
    <Link
      href={`/dashboard/analysis/${analysis.id}`}
      className="group block rounded-xl border bg-card p-4 transition-colors hover:border-primary/20 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-medium group-hover:text-primary transition-colors">
              {hostname}
            </h3>
            <ExternalLink className="size-3.5 shrink-0 text-muted-foreground/50" />
          </div>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {analysis.url}
          </p>
        </div>
        <StatusBadge status={analysis.status} />
      </div>
      {analysis.status === "COMPLETE" && (
        <div className="mt-3 flex items-center justify-center gap-4 border-t pt-3">
          <ScoreIndicator
            label="Perf"
            score={analysis.performanceScore}
          />
          <ScoreIndicator label="SEO" score={analysis.seoScore} />
          <ScoreIndicator
            label="A11y"
            score={analysis.accessibilityScore}
          />
          <ScoreIndicator
            label="BP"
            score={analysis.bestPracticesScore}
          />
        </div>
      )}
      <div className="mt-3 text-xs text-muted-foreground">
        {new Date(analysis.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </Link>
  );
}
