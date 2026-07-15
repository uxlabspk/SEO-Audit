import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Globe, ArrowRight } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-6 py-16 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
        <Globe className="size-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">No audits yet</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Run your first website audit to get started. You&apos;ll receive
        performance scores, security checks, and an AI-generated report.
      </p>
      <Link href="/dashboard/new" className="mt-6">
        <Button className="gap-2">
          Run your first audit
          <ArrowRight className="size-4" />
        </Button>
      </Link>
    </div>
  );
}
