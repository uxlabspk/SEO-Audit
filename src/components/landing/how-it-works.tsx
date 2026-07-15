import { Globe, Cpu, FileText, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "1",
    title: "Enter a URL",
    description: "Paste any website URL into the audit tool.",
    icon: Globe,
  },
  {
    number: "2",
    title: "Run automated checks",
    description:
      "We run 9 checks: SSL, security headers, SEO, accessibility, performance, mobile, links, and Core Web Vitals.",
    icon: Cpu,
  },
  {
    number: "3",
    title: "AI generates a report",
    description:
      "Our AI analyzes all findings and writes a prioritized report with specific, actionable fixes.",
    icon: FileText,
  },
];

export function HowItWorks() {
  return (
    <section className="border-t bg-muted/30 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Simple Process
          </div>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            How it works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Three simple steps from URL to actionable report.
          </p>
        </div>
        <div className="relative mt-16">
          <div className="absolute left-1/2 top-0 hidden h-full w-px bg-border sm:block" />
          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.number} className="relative text-center">
                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-mono text-lg font-bold">
                  {step.number}
                </div>
                <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <step.icon className="size-5" />
                </div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
                {index < steps.length - 1 && (
                  <div className="absolute right-0 top-6 hidden translate-x-1/2 sm:block">
                    <ArrowRight className="size-5 text-muted-foreground/40" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
