import {
  Zap,
  Shield,
  Search,
  Accessibility,
  Gauge,
  FileText,
} from "lucide-react";

const features = [
  {
    icon: Gauge,
    title: "Core Web Vitals",
    description:
      "Real performance metrics from Google Chrome. LCP, INP, CLS, and full Lighthouse scores.",
    color: "text-primary",
  },
  {
    icon: Search,
    title: "SEO Analysis",
    description:
      "Title tags, meta descriptions, headings, canonical URLs, Open Graph tags, and robots directives.",
    color: "text-primary",
  },
  {
    icon: Accessibility,
    title: "Accessibility",
    description:
      "Alt text coverage, ARIA labels, heading hierarchy, form labels, and keyboard navigation issues.",
    color: "text-primary",
  },
  {
    icon: Shield,
    title: "Security Headers",
    description:
      "HSTS, CSP, X-Frame-Options, Referrer-Policy, and 6 more headers checked and scored.",
    color: "text-primary",
  },
  {
    icon: Zap,
    title: "Performance Audit",
    description:
      "Page size, compression, caching, render-blocking resources, and image optimization checks.",
    color: "text-primary",
  },
  {
    icon: FileText,
    title: "AI Reports",
    description:
      "Get a client-ready markdown report with prioritized, specific fixes — not generic advice.",
    color: "text-primary",
  },
];

export function Features() {
  return (
    <section id="features" className="border-t py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Comprehensive Audits
          </div>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Everything you need to audit a website
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Nine automated checks plus an AI-generated report. No configuration
            needed. Get actionable insights in seconds.
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border bg-card p-6 transition-all hover:border-primary/20 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="size-5" />
              </div>
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
