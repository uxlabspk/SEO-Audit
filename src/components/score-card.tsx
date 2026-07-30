import { cn } from "@/lib/utils";

interface ScoreCardProps {
  label: string;
  score: number | null;
}

function scoreColor(score: number | null) {
  if (score === null) return "text-muted-foreground";
  if (score >= 90) return "text-success";
  if (score >= 50) return "text-warning";
  return "text-destructive";
}

function scoreRingVar(score: number | null) {
  if (score === null) return "var(--muted-foreground)";
  if (score >= 90) return "var(--success)";
  if (score >= 50) return "var(--warning)";
  return "var(--destructive)";
}

export function ScoreCard({ label, score }: ScoreCardProps) {
  const pct = score ?? 0;
  const circumference = 2 * Math.PI * 26;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card/60 px-4 py-5">
      <div className="relative flex size-16 items-center justify-center">
        <svg viewBox="0 0 60 60" className="size-16 -rotate-90">
          <circle
            cx="30"
            cy="30"
            r="26"
            fill="none"
            stroke="var(--muted)"
            strokeWidth="4"
          />
          {score !== null && (
            <circle
              cx="30"
              cy="30"
              r="26"
              fill="none"
              stroke={scoreRingVar(score)}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-700"
            />
          )}
        </svg>
        <span className={cn("absolute font-mono text-base font-semibold", scoreColor(score))}>
          {score ?? "—"}
        </span>
      </div>
      <span className="text-center text-xs font-medium text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
