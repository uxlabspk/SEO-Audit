import { AnalysisCard } from "./analysis-card";

interface Analysis {
  id: string;
  url: string;
  status: "QUEUED" | "FETCHING" | "RUNNING_CHECKS" | "GENERATING_REPORT" | "COMPLETE" | "FAILED";
  performanceScore: number | null;
  seoScore: number | null;
  accessibilityScore: number | null;
  bestPracticesScore: number | null;
  createdAt: Date;
  completedAt: Date | null;
}

export function AnalysisList({ analyses }: { analyses: Analysis[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {analyses.map((analysis) => (
        <AnalysisCard key={analysis.id} analysis={analysis} />
      ))}
    </div>
  );
}
