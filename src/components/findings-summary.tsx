import type { Findings } from "@/lib/analyzer/types";
import { CheckCircle2, XCircle } from "lucide-react";

interface FindingsSummaryProps {
  findings: Findings;
}

function StatusIcon({ ok }: { ok: boolean }) {
  return ok ? (
    <CheckCircle2 className="size-4 shrink-0 text-success" />
  ) : (
    <XCircle className="size-4 shrink-0 text-destructive" />
  );
}

function Row({
  label,
  ok,
  detail,
}: {
  label: string;
  ok: boolean;
  detail?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <div className="flex items-center gap-2.5">
        <StatusIcon ok={ok} />
        <span className="text-sm">{label}</span>
      </div>
      {detail && (
        <span className="font-mono text-xs text-muted-foreground">{detail}</span>
      )}
    </div>
  );
}

export function FindingsSummary({ findings }: FindingsSummaryProps) {
  const cwv = findings.pagespeed_core_web_vitals?.field_data_real_users;

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <section className="rounded-lg border border-border bg-card/60 p-5">
        <h3 className="mb-1 font-mono text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Core Web Vitals
        </h3>
        <p className="mb-2 text-xs text-muted-foreground">
          {findings.pagespeed_core_web_vitals?.available && cwv
            ? "Real-user data, 75th percentile"
            : "Lab data or unavailable"}
        </p>
        <div className="divide-y divide-border">
          <Row
            label="Largest Contentful Paint"
            ok={(cwv?.LCP_seconds ?? 99) <= findings.standards_reference.core_web_vitals.LCP.good}
            detail={cwv?.LCP_seconds ? `${cwv.LCP_seconds}s` : "n/a"}
          />
          <Row
            label="Interaction to Next Paint"
            ok={(cwv?.INP_ms ?? 9999) <= findings.standards_reference.core_web_vitals.INP.good}
            detail={cwv?.INP_ms ? `${cwv.INP_ms}ms` : "n/a"}
          />
          <Row
            label="Cumulative Layout Shift"
            ok={(cwv?.CLS ?? 9) <= findings.standards_reference.core_web_vitals.CLS.good}
            detail={cwv?.CLS !== undefined ? String(cwv.CLS) : "n/a"}
          />
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card/60 p-5">
        <h3 className="mb-3 font-mono text-xs font-medium tracking-wide text-muted-foreground uppercase">
          SEO
        </h3>
        <div className="divide-y divide-border">
          <Row
            label="Title tag length"
            ok={findings.seo.title.ok_length}
            detail={`${findings.seo.title.length} chars`}
          />
          <Row
            label="Meta description"
            ok={findings.seo.meta_description.ok_length}
            detail={`${findings.seo.meta_description.length} chars`}
          />
          <Row
            label="Single H1"
            ok={findings.seo.h1.ok}
            detail={`${findings.seo.h1.count} found`}
          />
          <Row label="Canonical tag" ok={findings.seo.canonical.present} />
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card/60 p-5">
        <h3 className="mb-3 font-mono text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Accessibility
        </h3>
        <div className="divide-y divide-border">
          <Row
            label="Images with alt text"
            ok={findings.accessibility.images.missing_alt === 0}
            detail={`${findings.accessibility.images.missing_alt} missing`}
          />
          <Row label="HTML lang attribute" ok={findings.accessibility.lang_attribute.present} />
          <Row
            label="Heading order"
            ok={!findings.accessibility.heading_order.skips_levels}
          />
          <Row
            label="Labeled form inputs"
            ok={findings.accessibility.form_inputs.unlabeled === 0}
            detail={`${findings.accessibility.form_inputs.unlabeled} unlabeled`}
          />
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card/60 p-5">
        <h3 className="mb-3 font-mono text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Security
        </h3>
        <div className="divide-y divide-border">
          <Row label="HTTPS / SSL" ok={findings.ssl.has_ssl} />
          {findings.ssl.has_ssl && (
            <Row
              label="Certificate expiry"
              ok={(findings.ssl.days_until_expiry ?? 0) > 14}
              detail={
                findings.ssl.days_until_expiry !== undefined
                  ? `${findings.ssl.days_until_expiry}d left`
                  : undefined
              }
            />
          )}
          <Row
            label="Security headers"
            ok={findings.security_headers.missing.length === 0}
            detail={`${findings.security_headers.missing.length} missing`}
          />
          <Row
            label="Broken internal links"
            ok={findings.links.broken_count === 0}
            detail={`${findings.links.broken_count} of ${findings.links.checked_count}`}
          />
        </div>
      </section>
    </div>
  );
}
