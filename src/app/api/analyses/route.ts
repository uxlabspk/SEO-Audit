import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { processAnalysis } from "@/lib/analyzer/pipeline";
import { getSession } from "@/lib/auth";
import { crawlSite } from "@/lib/crawler";

function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

export async function POST(req: NextRequest) {
  let body: { url?: string; fullAudit?: boolean };
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

  if (body.fullAudit) {
    const parent = await prisma.analysis.create({
      data: {
        url,
        status: "QUEUED",
        userId: session?.userId,
      },
    });

    // Background: crawl → create children → process each
    runFullAudit(parent.id, url, session?.userId ?? null).catch((err) => {
      console.error(`Full audit ${parent.id} failed:`, err);
    });

    return NextResponse.json({ id: parent.id }, { status: 201 });
  }

  const analysis = await prisma.analysis.create({
    data: {
      url,
      status: "QUEUED",
      userId: session?.userId,
    },
  });

  processAnalysis(analysis.id).catch((err) => {
    console.error(`Analysis ${analysis.id} failed unexpectedly:`, err);
  });

  return NextResponse.json({ id: analysis.id }, { status: 201 });
}

async function runFullAudit(
  parentId: string,
  startUrl: string,
  userId: string | null
) {
  await prisma.analysis.update({
    where: { id: parentId },
    data: { status: "FETCHING", statusStep: "Crawling website..." },
  });

  const { urls, errors } = await crawlSite(startUrl, async (step) => {
    await prisma.analysis.update({
      where: { id: parentId },
      data: { statusStep: step },
    });
  });

  if (urls.length === 0) {
    await prisma.analysis.update({
      where: { id: parentId },
      data: {
        status: "FAILED",
        errorMessage: `No pages found to audit${errors.length ? `. Crawl errors: ${errors.slice(0, 3).join("; ")}` : ""}`,
      },
    });
    return;
  }

  await prisma.analysis.update({
    where: { id: parentId },
    data: { statusStep: `Found ${urls.length} pages. Starting audits...` },
  });

  // Create child analyses for all discovered pages
  await prisma.analysis.createMany({
    data: urls.map((url) => ({
      url,
      status: "QUEUED" as const,
      userId,
      parentAnalysisId: parentId,
    })),
  });

  // Process each child sequentially to avoid overwhelming the server
  const childRecords = await prisma.analysis.findMany({
    where: { parentAnalysisId: parentId },
    orderBy: { createdAt: "asc" },
  });

  let completed = 0;
  for (const child of childRecords) {
    await prisma.analysis.update({
      where: { id: parentId },
      data: {
        statusStep: `Auditing page ${completed + 1}/${childRecords.length}: ${child.url}`,
      },
    });

    try {
      await processAnalysis(child.id);
    } catch {
      // processAnalysis handles its own error state
    }
    completed++;
  }

  // Gather scores from children for the parent
  const allChildren = await prisma.analysis.findMany({
    where: { parentAnalysisId: parentId },
  });

  const scored = allChildren.filter((c) => c.performanceScore != null);
  const avg = (field: "performanceScore" | "seoScore" | "accessibilityScore" | "bestPracticesScore") => {
    const vals = scored.map((c) => c[field]!).filter(Boolean);
    return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
  };

  const combinedReport = allChildren
    .map((c) => {
      const status = c.status === "COMPLETE" ? "Passed" : c.status === "FAILED" ? "Failed" : c.status;
      return `## ${c.url}\n**Status:** ${status}${c.reportMarkdown ? `\n\n${c.reportMarkdown}` : ""}`;
    })
    .join("\n\n---\n\n");

  await prisma.analysis.update({
    where: { id: parentId },
    data: {
      status: "GENERATING_REPORT",
      statusStep: "Compiling results...",
      performanceScore: avg("performanceScore"),
      seoScore: avg("seoScore"),
      accessibilityScore: avg("accessibilityScore"),
      bestPracticesScore: avg("bestPracticesScore"),
    },
  });

  await prisma.analysis.update({
    where: { id: parentId },
    data: {
      reportMarkdown: combinedReport,
      status: "COMPLETE",
      statusStep: null,
      completedAt: new Date(),
    },
  });
}

export async function GET() {
  const session = await getSession();

  const analyses = await prisma.analysis.findMany({
    where: {
      ...(session?.userId ? { userId: session.userId } : {}),
      parentAnalysisId: null, // Only show top-level analyses in the list
    },
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
      _count: { select: { children: true } },
    },
  });

  return NextResponse.json({
    analyses: analyses.map((a) => ({
      ...a,
      pageCount: a._count.children + 1, // +1 for the parent itself
    })),
  });
}
