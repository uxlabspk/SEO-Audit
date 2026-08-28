import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ScoreCard } from "@/components/score-card";
import { FindingsSummary } from "@/components/findings-summary";
import { ReportView } from "@/components/report-view";

export default async function AnalysisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const analysis = await prisma.analysis.findUnique({
    where: { id },
    include: {
      children: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          url: true,
          status: true,
          performanceScore: true,
          seoScore: true,
          accessibilityScore: true,
          bestPracticesScore: true,
          completedAt: true,
        },
      },
    },
  });

  if (!analysis) notFound();

  const isParent = analysis.children.length > 0;
  const findings = analysis.findings as Record<string, unknown> | null;

  return (
    <div className="mx-auto container">
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="gap-2 mb-4">
            <ArrowLeft className="size-4" />
            Back to dashboard
          </Button>
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {(() => {
                try {
                  return new URL(analysis.url).hostname;
                } catch {
                  return analysis.url;
                }
              })()}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {isParent
                ? `${analysis.children.length} pages audited`
                : analysis.url}
            </p>
          </div>
          <Badge
            variant="secondary"
            className={
              analysis.status === "COMPLETE"
                ? "bg-success/10 text-success"
                : analysis.status === "FAILED"
                  ? "bg-destructive/10 text-destructive"
                  : "bg-primary/10 text-primary"
            }
          >
            {analysis.status}
          </Badge>
        </div>
      </div>

      {/* Parent analysis with children: show page cards */}
      {isParent && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {analysis.children.map((child) => (
            <Link
              key={child.id}
              href={`/dashboard/analysis/${child.id}`}
              className="group block rounded-xl border bg-card p-4 transition-colors hover:border-primary/20 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium group-hover:text-primary transition-colors">
                    {(() => {
                      try {
                        return new URL(child.url).pathname || "/";
                      } catch {
                        return child.url;
                      }
                    })()}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {child.url}
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className={`text-xs ${
                    child.status === "COMPLETE"
                      ? "bg-success/10 text-success"
                      : child.status === "FAILED"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-primary/10 text-primary"
                  }`}
                >
                  {child.status}
                </Badge>
              </div>
              {child.status === "COMPLETE" && (
                <div className="mt-3 flex items-center justify-center gap-4 border-t pt-3">
                  {child.performanceScore != null && (
                    <div className="text-center">
                      <div
                        className={`text-lg font-semibold ${
                          child.performanceScore >= 90
                            ? "text-success"
                            : child.performanceScore >= 50
                              ? "text-warning"
                              : "text-destructive"
                        }`}
                      >
                        {child.performanceScore}
                      </div>
                      <div className="text-[10px] uppercase text-muted-foreground">
                        Perf
                      </div>
                    </div>
                  )}
                  {child.seoScore != null && (
                    <div className="text-center">
                      <div
                        className={`text-lg font-semibold ${
                          child.seoScore >= 90
                            ? "text-success"
                            : child.seoScore >= 50
                              ? "text-warning"
                              : "text-destructive"
                        }`}
                      >
                        {child.seoScore}
                      </div>
                      <div className="text-[10px] uppercase text-muted-foreground">
                        SEO
                      </div>
                    </div>
                  )}
                  {child.accessibilityScore != null && (
                    <div className="text-center">
                      <div
                        className={`text-lg font-semibold ${
                          child.accessibilityScore >= 90
                            ? "text-success"
                            : child.accessibilityScore >= 50
                              ? "text-warning"
                              : "text-destructive"
                        }`}
                      >
                        {child.accessibilityScore}
                      </div>
                      <div className="text-[10px] uppercase text-muted-foreground">
                        A11y
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* Single page analysis: show findings + report */}
      {!isParent && analysis.status === "COMPLETE" && findings && (
        <>
          <div className="mb-6">
            <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <ScoreCard
                label="Performance"
                score={
                  (
                    findings as Record<string, Record<string, Record<string, number>>>
                  ).pagespeed_core_web_vitals?.lighthouse_scores
                    ?.performance ?? null
                }
              />
              <ScoreCard
                label="SEO"
                score={
                  (
                    findings as Record<string, Record<string, Record<string, number>>>
                  ).pagespeed_core_web_vitals?.lighthouse_scores?.seo ?? null
                }
              />
              <ScoreCard
                label="Accessibility"
                score={
                  (
                    findings as Record<string, Record<string, Record<string, number>>>
                  ).pagespeed_core_web_vitals?.lighthouse_scores
                    ?.accessibility ?? null
                }
              />
              <ScoreCard
                label="Best Practices"
                score={
                  (
                    findings as Record<string, Record<string, Record<string, number>>>
                  ).pagespeed_core_web_vitals?.lighthouse_scores?.[
                    "best-practices"
                  ] ?? null
                }
              />
            </div>
          </div>

          <div className="mb-6">
            <FindingsSummary findings={findings as never} />
          </div>
        </>
      )}

      {!isParent && analysis.reportMarkdown && (
        <div className="mb-6">
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Report
          </h2>
          <ReportView markdown={analysis.reportMarkdown} isStreaming={false} />
        </div>
      )}

      {analysis.status === "FAILED" && analysis.errorMessage && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
          <p className="font-medium text-destructive">Error</p>
          <p className="mt-1 text-muted-foreground">
            {analysis.errorMessage}
          </p>
        </div>
      )}
    </div>
  );
}
