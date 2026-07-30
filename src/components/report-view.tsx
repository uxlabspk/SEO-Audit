"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ReportViewProps {
  markdown: string;
  isStreaming: boolean;
}

export function ReportView({ markdown, isStreaming }: ReportViewProps) {
  if (!markdown && !isStreaming) return null;

  return (
    <div className="rounded-lg border border-border bg-card/60 p-6 sm:p-8">
      <div
        className="prose prose-sm sm:prose-base max-w-none
          prose-headings:font-medium prose-headings:tracking-tight
          prose-h1:text-xl prose-h1:mb-4
          prose-h2:text-base prose-h2:mt-8 prose-h2:mb-3 prose-h2:font-mono prose-h2:uppercase prose-h2:tracking-wide prose-h2:text-muted-foreground prose-h2:border-b prose-h2:border-border prose-h2:pb-2
          prose-h3:text-sm prose-h3:mt-5
          prose-p:text-foreground/90 prose-p:leading-relaxed
          prose-strong:text-foreground prose-strong:font-semibold
          prose-li:text-foreground/90
          prose-code:font-mono prose-code:text-xs prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
          prose-a:text-primary"
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
      </div>
      {isStreaming && (
        <span className="mt-2 inline-block h-4 w-2 animate-pulse bg-primary/70 align-text-bottom" />
      )}
    </div>
  );
}
