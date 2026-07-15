const steps = [
  {
    number: "1",
    title: "Enter a URL",
    description: "Paste any website URL into the audit tool.",
  },
  {
    number: "2",
    title: "Run automated checks",
    description:
      "We run 9 checks: SSL, security headers, SEO, accessibility, performance, mobile, links, and Core Web Vitals.",
  },
  {
    number: "3",
    title: "AI generates a report",
    description:
      "Our AI analyzes all findings and writes a prioritized report with specific, actionable fixes.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-t bg-muted/30 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            How it works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Three steps from URL to actionable report.
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-mono text-lg font-bold">
                {step.number}
              </div>
              <h3 className="font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
