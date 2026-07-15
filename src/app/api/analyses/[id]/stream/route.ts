import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Polls the Analysis row and streams status/report updates to the client
 * as Server-Sent Events. This lets the frontend show live progress
 * ("Checking SEO signals ...", streaming report text) without needing a
 * separate websocket/queue infrastructure -- it just watches Postgres.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const encoder = new TextEncoder();
  let closed = false;

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        if (closed) return;
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
        );
      };

      let lastReportLength = 0;
      let lastStatus = "";
      let lastStep = "";

      const poll = async () => {
        if (closed) return;

        const analysis = await prisma.analysis.findUnique({ where: { id } });

        if (!analysis) {
          send("error", { message: "Analysis not found" });
          controller.close();
          closed = true;
          return;
        }

        if (
          analysis.status !== lastStatus ||
          analysis.statusStep !== lastStep
        ) {
          lastStatus = analysis.status;
          lastStep = analysis.statusStep || "";
          send("status", {
            status: analysis.status,
            step: analysis.statusStep,
          });
        }

        const report = analysis.reportMarkdown || "";
        if (report.length > lastReportLength) {
          send("report_chunk", { text: report.slice(lastReportLength) });
          lastReportLength = report.length;
        }

        if (analysis.status === "COMPLETE") {
          send("done", { analysis });
          controller.close();
          closed = true;
          return;
        }

        if (analysis.status === "FAILED") {
          send("failed", { message: analysis.errorMessage });
          controller.close();
          closed = true;
          return;
        }

        setTimeout(poll, 700);
      };

      poll();

      req.signal.addEventListener("abort", () => {
        closed = true;
        try {
          controller.close();
        } catch {
          // already closed
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
