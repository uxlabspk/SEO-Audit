import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Clock } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="relative mx-auto container px-6 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground">
          <span className="size-1.5 animate-pulse rounded-full bg-success" />
          Powered by AI
        </div>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
          Your website, audited
          <br />
          <span className="text-primary">in seconds</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Run real checks against Core Web Vitals, SEO, accessibility, and
          security. Get an AI-generated report with prioritized, specific fixes
          you can hand directly to a developer.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link href="/register">
            <Button size="lg" className="gap-2">
              Start for free
              <ArrowRight className="size-4" />
            </Button>
          </Link>
          <Link href="/#features">
            <Button variant="outline" size="lg">
              See how it works
            </Button>
          </Link>
        </div>

        <div className="mx-auto mt-10 flex  items-center justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="size-4 text-primary" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="size-4 text-primary" />
            <span>Results in under 30s</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-primary" />
            <span>Free tier available</span>
          </div>
        </div>

        <div className="mx-auto text-start mt-16 max-w-3xl rounded-xl border bg-card p-2 shadow-2xl shadow-primary/5">
          <div className="rounded-lg bg-muted/30 p-4 font-mono text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-success">$</span>
              probe audit https://your-site.com
            </div>
            <div className="mt-3 space-y-1.5 text-muted-foreground/80">
              <div>✓ Page fetched (142ms)</div>
              <div>✓ SSL certificate valid (expires 2025-08-12)</div>
              <div>✓ 9 security headers checked</div>
              <div>✓ SEO signals analyzed</div>
              <div>✓ Accessibility audit complete</div>
              <div>✓ Core Web Vitals scored</div>
              <div className="text-primary">→ AI report generating...</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
