import { prisma } from "@/lib/prisma";
import { runAllChecks, AnalysisFetchError } from "./run-checks";
import { generateReport } from "./generate-report";
import type { Findings } from "./types";

/**
 * Runs the full analysis + AI report pipeline for a given Analysis row and
 * persists progress/results to Postgres as it goes. This is the Next.js
 * equivalent of the Python script's main(): fetch -> run checks -> save
 * findings -> generate report -> save report.
 *
 * Any caller (API route, cron job, queue worker) can invoke this; it does
 * not depend on the HTTP request/response lifecycle, so it's safe to run
 * detached from a request handler.
 */
export async function processAnalysis(analysisId: string): Promise<void> {
  const analysis = await prisma.analysis.findUnique({
    where: { id: analysisId },
  });
  if (!analysis) throw new Error(`Analysis ${analysisId} not found`);

  try {
    await prisma.analysis.update({
      where: { id: analysisId },
      data: { status: "FETCHING", statusStep: "Starting analysis..." },
    });

    const findings: Findings = await runAllChecks(analysis.url, async (step) => {
      await prisma.analysis.update({
        where: { id: analysisId },
        data: { status: "RUNNING_CHECKS", statusStep: step },
      });
    });

    const scores = findings.pagespeed_core_web_vitals?.lighthouse_scores;

    await prisma.analysis.update({
      where: { id: analysisId },
      data: {
        findings: findings as unknown as object,
        performanceScore: scores?.performance ?? null,
        seoScore: scores?.seo ?? null,
        accessibilityScore: scores?.accessibility ?? null,
        bestPracticesScore: scores?.["best-practices"] ?? null,
        status: "GENERATING_REPORT",
        statusStep: "Generating AI report...",
      },
    });

    let reportBuffer = "";
    let lastFlush = Date.now();

    await generateReport(findings, async (chunkText) => {
      reportBuffer += chunkText;
      // Throttle DB writes to every ~500ms instead of on every token.
      if (Date.now() - lastFlush > 500) {
        lastFlush = Date.now();
        try {
          await prisma.analysis.update({
            where: { id: analysisId },
            data: { reportMarkdown: reportBuffer },
          });
        } catch (e) {
          console.error("Failed to flush report chunk:", e);
        }
      }
    });

    await prisma.analysis.update({
      where: { id: analysisId },
      data: {
        reportMarkdown: reportBuffer,
        status: "COMPLETE",
        statusStep: null,
        completedAt: new Date(),
      },
    });
  } catch (err) {
    const message =
      err instanceof AnalysisFetchError
        ? `Could not fetch page: ${err.message}`
        : err instanceof Error
          ? err.message
          : String(err);

    await prisma.analysis.update({
      where: { id: analysisId },
      data: { status: "FAILED", errorMessage: message },
    });
  }
}
