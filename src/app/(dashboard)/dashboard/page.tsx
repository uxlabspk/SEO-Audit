import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { AnalysisList } from "@/components/dashboard/analysis-list";
import { EmptyState } from "@/components/dashboard/empty-state";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  const analyses = await prisma.analysis.findMany({
    where: { userId: user?.id },
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

  return (
    <div className="mx-auto container">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your website audits and reports
        </p>
      </div>

      {analyses.length === 0 ? (
        <EmptyState />
      ) : (
        <AnalysisList analyses={analyses} />
      )}
    </div>
  );
}
