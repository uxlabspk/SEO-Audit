import { Shield, Target, Heart, Zap } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Actionable over theoretical",
    description:
      "Every report returns specific fixes, not generic advice. We tell you exactly what to change and where.",
  },
  {
    icon: Shield,
    title: "Privacy by default",
    description:
      "We don't store your data after the audit completes. No tracking, no profiles, no selling insights.",
  },
  {
    icon: Zap,
    title: "Speed matters",
    description:
      "Developers and agencies need answers now. Full audits run in under 30 seconds, not 30 minutes.",
  },
  {
    icon: Heart,
    title: "Built for developers",
    description:
      "We ship reports you can hand directly to a developer or client. Markdown, prioritized, no fluff.",
  },
];

export function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="relative mx-auto container px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground">
            About Probe
          </div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            We make websites
            <br />
            <span className="text-primary">better, faster</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Probe started because most website audits are either too slow, too
            generic, or too expensive. We built the tool we wished existed: fast,
            specific, and free to start.
          </p>
        </div>
      </section>

      <section className="border-t bg-muted/30 py-24 sm:py-32">
        <div className="mx-auto container px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Our Mission
            </div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Make web quality accessible
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Every website deserves a thorough audit. Not just the ones with
              enterprise budgets. We combine automated checks with AI analysis
              to deliver insights that used to require a consultant, at a
              fraction of the cost and time.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t py-24 sm:py-32">
        <div className="mx-auto container px-6">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              What We Believe
            </div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Our values
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              The principles behind every decision we make.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-xl border bg-card p-6"
              >
                <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <value.icon className="size-5" />
                </div>
                <h3 className="font-semibold">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/30 py-24 sm:py-32">
        <div className="mx-auto container px-6 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Ready to audit your site?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Get a comprehensive report with actionable fixes in under 30 seconds.
          </p>
          <div className="mt-8">
            <a
              href="/register"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Start for free
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
