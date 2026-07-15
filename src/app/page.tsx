"use client";

import { useAnalysis } from "@/hooks/use-analysis";
import { UrlForm } from "@/components/url-form";
import { ScanConsole } from "@/components/scan-console";
import { ScoreCard } from "@/components/score-card";
import { FindingsSummary } from "@/components/findings-summary";
import { ReportView } from "@/components/report-view";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";


export default function Home() {
  const { state, startAnalysis } = useAnalysis();

  const isRunning =
    state.status !== "IDLE" &&
    state.status !== "COMPLETE" &&
    state.status !== "FAILED";

  const findings = state.analysis?.findings;

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        {/* Header */}
        <div className="mb-12">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded bg-primary/15 font-mono text-xs font-bold text-primary">
              P
            </div>
            <span className="font-mono text-sm font-medium tracking-tight">
              Probe
            </span>
          </div>
          <h1 className="mb-3 text-3xl font-medium tracking-tight sm:text-4xl">
            Point it at a URL.
            <br />
            <span className="text-muted-foreground">Get the audit and the fix list.</span>
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            Runs real checks against Core Web Vitals, SEO, accessibility, and
            security — then an AI writes the client-ready report with
            prioritized, specific fixes.
          </p>
        </div>

        {/* URL form */}
        <div className="mb-8">
          <UrlForm onSubmit={startAnalysis} isRunning={isRunning} />
        </div>

        {/* Scan console */}
        {state.status !== "IDLE" && (
          <div className="mb-8">
            <ScanConsole status={state.status} currentStep={state.currentStep} />
          </div>
        )}

        {/* Error state */}
        {state.status === "FAILED" && (
          <div className="mb-8 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
            <div>
              <p className="font-medium text-destructive">Scan failed</p>
              <p className="mt-1 text-muted-foreground">
                {state.errorMessage || "Something went wrong while analyzing this URL."}
              </p>
            </div>
          </div>
        )}

        {/* Scores */}
        {findings && (
          <div className="mb-8">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
                {findings.url}
              </span>
              <Badge variant="outline" className="font-mono text-[10px]">
                {new Date(findings.analyzed_at).toLocaleString()}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <ScoreCard
                label="Performance"
                score={findings.pagespeed_core_web_vitals?.lighthouse_scores?.performance ?? null}
              />
              <ScoreCard
                label="SEO"
                score={findings.pagespeed_core_web_vitals?.lighthouse_scores?.seo ?? null}
              />
              <ScoreCard
                label="Accessibility"
                score={findings.pagespeed_core_web_vitals?.lighthouse_scores?.accessibility ?? null}
              />
              <ScoreCard
                label="Best Practices"
                score={findings.pagespeed_core_web_vitals?.lighthouse_scores?.["best-practices"] ?? null}
              />
            </div>
          </div>
        )}

        {/* Findings breakdown */}
        {findings && (
          <div className="mb-8">
            <FindingsSummary findings={findings} />
          </div>
        )}

        {/* AI Report */}
        {(state.reportText || state.status === "GENERATING_REPORT") && (
          <div className="mb-8">
            <div className="mb-3 flex items-center gap-2">
              <h2 className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
                Report
              </h2>
              {state.status === "GENERATING_REPORT" && (
                <Badge variant="outline" className="gap-1 font-mono text-[10px] text-primary">
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
    </main>
  );
}
