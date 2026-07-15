"use client";

import { UrlForm } from "@/components/url-form";
import { ScanConsole } from "@/components/scan-console";
import { ScoreCard } from "@/components/score-card";
import { FindingsSummary } from "@/components/findings-summary";
import { ReportView } from "@/components/report-view";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { useAnalysis } from "@/hooks/use-analysis";

export default function NewAuditPage() {
  const { state, startAnalysis } = useAnalysis();

  const isRunning =
    state.status !== "IDLE" &&
    state.status !== "COMPLETE" &&
    state.status !== "FAILED";

  const findings = state.analysis?.findings;

  return (
    <div className="mx-auto container">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">New audit</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter a URL to run a comprehensive website audit
        </p>
      </div>

      <div className="mb-6">
        <UrlForm onSubmit={startAnalysis} isRunning={isRunning} />
      </div>

      {state.status !== "IDLE" && (
        <div className="mb-6">
          <ScanConsole status={state.status} currentStep={state.currentStep} />
        </div>
      )}

      {state.status === "FAILED" && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
          <div>
            <p className="font-medium text-destructive">Scan failed</p>
            <p className="mt-1 text-muted-foreground">
              {state.errorMessage ||
                "Something went wrong while analyzing this URL."}
            </p>
          </div>
        </div>
      )}

      {findings && (
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              {findings.url}
            </span>
            <Badge variant="outline" className="text-[10px]">
              {new Date(findings.analyzed_at).toLocaleString()}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <ScoreCard
              label="Performance"
              score={
                findings.pagespeed_core_web_vitals?.lighthouse_scores
                  ?.performance ?? null
              }
            />
            <ScoreCard
              label="SEO"
              score={
                findings.pagespeed_core_web_vitals?.lighthouse_scores?.seo ??
                null
              }
            />
            <ScoreCard
              label="Accessibility"
              score={
                findings.pagespeed_core_web_vitals?.lighthouse_scores
                  ?.accessibility ?? null
              }
            />
            <ScoreCard
              label="Best Practices"
              score={
                findings.pagespeed_core_web_vitals?.lighthouse_scores?.[
                  "best-practices"
                ] ?? null
              }
            />
          </div>
        </div>
      )}

      {findings && (
        <div className="mb-6">
          <FindingsSummary findings={findings} />
        </div>
      )}

      {(state.reportText || state.status === "GENERATING_REPORT") && (
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-2">
            <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Report
            </h2>
            {state.status === "GENERATING_REPORT" && (
              <Badge
                variant="outline"
                className="gap-1 text-[10px] text-primary"
              >
                <span className="size-1.5 animate-pulse rounded-full bg-primary" />
                writing
              </Badge>
            )}
          </div>
          <ReportView
            markdown={state.reportText}
            isStreaming={state.status === "GENERATING_REPORT"}
          />
        </div>
      )}
    </div>
  );
}
