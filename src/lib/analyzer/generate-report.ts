import type { Findings } from "./types";
import { SYSTEM_PROMPT, buildUserPrompt } from "./report-prompt";
import { getLlmProvider } from "./llm-provider";

export type ReportChunkCallback = (chunkText: string) => void | Promise<void>;

/**
 * Stream an AI-generated report for the given findings.
 * Port of Python's generate_report(), but provider-agnostic: reads
 * LLM_PROVIDER from env (lmstudio by default) instead of hardcoding LM
 * Studio's endpoint.
 */
export async function generateReport(
  findings: Findings,
  onChunk: ReportChunkCallback = () => {}
): Promise<string> {
  const provider = getLlmProvider();
  const userPrompt = buildUserPrompt(findings);

  let fullText = "";
  for await (const chunk of provider.streamCompletion(SYSTEM_PROMPT, userPrompt)) {
    fullText += chunk.text;
    await onChunk(chunk.text);
  }

  return fullText;
}
