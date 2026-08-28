import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

interface AccountStatsProps {
  userId: string;
  emailVerified: Date | null;
}

export async function AccountStats({ userId, emailVerified }: AccountStatsProps) {
  const [totalAnalyses, totalChildren] = await Promise.all([
    prisma.analysis.count({
      where: { userId, parentAnalysisId: null },
    }),
    prisma.analysis.count({
      where: { userId, parentAnalysisId: { not: null } },
    }),
  ]);

  const totalPages = totalAnalyses + totalChildren;

  return (
    <div className="rounded-xl border bg-card p-6">
      <h2 className="text-sm font-medium">Account</h2>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div>
          <p className="text-2xl font-semibold">{totalAnalyses}</p>
          <p className="text-xs text-muted-foreground">Audits run</p>
        </div>
        <div>
          <p className="text-2xl font-semibold">{totalPages}</p>
          <p className="text-xs text-muted-foreground">Pages analyzed</p>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <Shield className="size-4" />
            <Badge
              variant="secondary"
              className={
                emailVerified
                  ? "bg-success/10 text-success"
                  : "bg-warning/10 text-warning"
              }
            >
              {emailVerified ? "Verified" : "Unverified"}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Email status</p>
        </div>
      </div>
    </div>
  );
}
