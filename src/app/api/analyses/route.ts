import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { processAnalysis } from "@/lib/analyzer/pipeline";
import { getSession } from "@/lib/auth";

function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

export async function POST(req: NextRequest) {
  let body: { url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.url || typeof body.url !== "string" || !body.url.trim()) {
    return NextResponse.json({ error: "url is required" }, { status: 400 });
  }

  const url = normalizeUrl(body.url);

  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  const session = await getSession();

  const analysis = await prisma.analysis.create({
    data: {
      url,
      status: "QUEUED",
      userId: session?.userId,
    },
  });

  // Fire-and-forget: process in the background. In production, swap this
  // for a real queue (e.g. Inngest, QStash, BullMQ) so it survives
  // serverless function timeouts and restarts. For now this keeps the
  // Node process alive long enough via a detached async call.
  processAnalysis(analysis.id).catch((err) => {
    console.error(`Analysis ${analysis.id} failed unexpectedly:`, err);
  });

  return NextResponse.json({ id: analysis.id }, { status: 201 });
}

export async function GET() {
  const session = await getSession();

  const analyses = await prisma.analysis.findMany({
    where: session?.userId ? { userId: session.userId } : undefined,
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      url: true,
      status: true,
      performanceScore: true,
      seoScore: true,
      accessibilityScore: true,
      bestPracticesScore: true,
      createdAt: true,
      completedAt: true,
    },
  });
  return NextResponse.json({ analyses });
}
