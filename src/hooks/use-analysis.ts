"use client";

import { useCallback, useRef, useState } from "react";
import type { AnalysisRecord, AnalysisStatus } from "@/lib/analyzer/types";

export interface ScanState {
  analysisId: string | null;
  status: AnalysisStatus | "IDLE";
  currentStep: string | null;
  reportText: string;
  analysis: AnalysisRecord | null;
  errorMessage: string | null;
}

const INITIAL_STATE: ScanState = {
  analysisId: null,
  status: "IDLE",
  currentStep: null,
  reportText: "",
  analysis: null,
  errorMessage: null,
};

export function useAnalysis() {
  const [state, setState] = useState<ScanState>(INITIAL_STATE);
  const eventSourceRef = useRef<EventSource | null>(null);

  const reset = useCallback(() => {
    eventSourceRef.current?.close();
    setState(INITIAL_STATE);
  }, []);

  const startAnalysis = useCallback(async (url: string) => {
    eventSourceRef.current?.close();
    setState({ ...INITIAL_STATE, status: "QUEUED" });

    let id: string;
    try {
      const resp = await fetch("/api/analyses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!resp.ok) {
        const body = await resp.json().catch(() => ({}));
        throw new Error(body.error || `Request failed (${resp.status})`);
      }
      const data = await resp.json();
      id = data.id;
    } catch (err) {
      setState((prev) => ({
        ...prev,
        status: "FAILED",
        errorMessage: err instanceof Error ? err.message : String(err),
      }));
      return;
    }

    setState((prev) => ({ ...prev, analysisId: id }));

    const es = new EventSource(`/api/analyses/${id}/stream`);
    eventSourceRef.current = es;

    es.addEventListener("status", (e) => {
      const data = JSON.parse(e.data);
      setState((prev) => ({
        ...prev,
        status: data.status,
        currentStep: data.step,
      }));
    });

    es.addEventListener("report_chunk", (e) => {
      const data = JSON.parse(e.data);
      setState((prev) => ({ ...prev, reportText: prev.reportText + data.text }));
    });

    es.addEventListener("done", (e) => {
      const data = JSON.parse(e.data);
      setState((prev) => ({
        ...prev,
        status: "COMPLETE",
        analysis: data.analysis,
        reportText: data.analysis.reportMarkdown || prev.reportText,
      }));
      es.close();
    });

    es.addEventListener("failed", (e) => {
      const data = JSON.parse(e.data);
      setState((prev) => ({
        ...prev,
        status: "FAILED",
        errorMessage: data.message || "Analysis failed",
      }));
      es.close();
    });

    es.addEventListener("error", () => {
      // EventSource fires generic "error" on network hiccups too; only
      // surface it if we never got further status updates.
      setState((prev) => {
        if (prev.status === "COMPLETE" || prev.status === "FAILED") return prev;
        return prev;
      });
    });
  }, []);

  return { state, startAnalysis, reset };
}
