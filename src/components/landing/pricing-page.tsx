import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Check,
  ArrowRight,
  Zap,
  Shield,
  Users,
  Infinity,
  FileText,
  Headphones,
  Code2,
  Palette,
  MessageSquare,
  Globe,
} from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "For trying things out",
    features: [
      { text: "5 audits per month", icon: Globe },
      { text: "All 9 automated checks", icon: Check },
      { text: "AI-generated reports", icon: FileText },
      { text: "Basic score cards", icon: Check },
    ],
    cta: "Get started",
    href: "/register",
    variant: "outline" as const,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "For professionals and small teams",
    features: [
      { text: "Unlimited audits", icon: Infinity },
      { text: "All 9 automated checks", icon: Check },
      { text: "AI-generated reports", icon: FileText },
      { text: "Detailed score cards", icon: Check },
      { text: "Priority support", icon: Headphones },
      { text: "Export reports as PDF", icon: FileText },
    ],
    cta: "Start free trial",
    href: "/register",
    variant: "default" as const,
  },
  {
    name: "Team",
    price: "$49",
    period: "/month",
    description: "For agencies and larger teams",
    features: [
      { text: "Everything in Pro", icon: Check },
      { text: "5 team members", icon: Users },
      { text: "Shared audit history", icon: Check },
      { text: "Custom branding", icon: Palette },
      { text: "API access", icon: Code2 },
      { text: "Dedicated support", icon: MessageSquare },
    ],
    cta: "Contact sales",
    href: "/register",
    variant: "outline" as const,
  },
];

const comparisons = [
  { feature: "Monthly audits", free: "5", pro: "Unlimited", team: "Unlimited" },
  { feature: "Automated checks", free: "9", pro: "9", team: "9" },
  { feature: "AI reports", free: true, pro: true, team: true },
  { feature: "Score cards", free: "Basic", pro: "Detailed", team: "Detailed" },
  { feature: "PDF export", free: false, pro: true, team: true },
  { feature: "Priority support", free: false, pro: true, team: true },
  { feature: "Team members", free: "—", pro: "—", team: "5" },
  { feature: "Shared history", free: false, pro: false, team: true },
  { feature: "Custom branding", free: false, pro: false, team: true },
  { feature: "API access", free: false, pro: false, team: true },
  { feature: "Dedicated support", free: false, pro: false, team: true },
];

const faqs = [
  {
    question: "Can I try Probe before committing?",
    answer:
      "Yes. The Free plan gives you 5 audits per month with full access to all 9 automated checks and AI-generated reports. No credit card required.",
  },
  {
    question: "What happens when I exceed my audit limit?",
    answer:
      "On the Free plan, you'll need to wait until the next billing cycle for your audits to reset. Upgrade to Pro for unlimited audits anytime.",
  },
  {
    question: "Can I upgrade or downgrade anytime?",
    answer:
      "Yes. You can change your plan at any time. Upgrades take effect immediately, and downgrades apply at the start of your next billing cycle.",
  },
  {
    question: "Do you offer annual billing?",
    answer:
      "Not yet, but it's on our roadmap. Contact us if you're interested in annual pricing for your team.",
  },
  {
    question: "Is there a free trial for Pro?",
    answer:
      "Yes. Start a free 14-day trial of Pro with full access to all features. Cancel anytime before the trial ends and you won't be charged.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards. Team plans can also pay via invoice for annual contracts.",
  },
];

export function PricingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="relative mx-auto container px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground">
            <span className="size-1.5 animate-pulse rounded-full bg-success" />
            Simple pricing
          </div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            Start free,
            <br />
            <span className="text-primary">scale when ready</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            No hidden fees. No credit card required. Upgrade to Pro for
            unlimited audits, or get the Team plan for your agency.
          </p>
          <div className="mt-10 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="size-4 text-primary" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="size-4 text-primary" />
              <span>14-day free trial on Pro</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="size-4 text-primary" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="border-t py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 sm:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl border bg-card p-8 ${
                  plan.name === "Pro"
                    ? "border-primary shadow-lg shadow-primary/10"
                    : ""
                }`}
              >
                {plan.name === "Pro" && (
                  <div className="mb-4 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    Most popular
                  </div>
                )}
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-sm text-muted-foreground">
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {plan.description}
                </p>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature.text}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Check className="size-4 shrink-0 text-success" />
                      {feature.text}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} className="mt-8 block">
                  <Button variant={plan.variant} className="w-full">
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="border-t bg-muted/30 py-24 sm:py-32">
        <div className="mx-auto container px-6">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Compare Plans
            </div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Feature comparison
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              See what&apos;s included in each plan at a glance.
            </p>
          </div>
          <div className="mt-16 overflow-hidden rounded-xl border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-6 py-4 text-left font-medium text-muted-foreground">
                      Feature
                    </th>
                    <th className="px-6 py-4 text-center font-medium">Free</th>
                    <th className="px-6 py-4 text-center font-medium text-primary">
                      Pro
                    </th>
                    <th className="px-6 py-4 text-center font-medium">
                      Team
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((row) => (
                    <tr key={row.feature} className="border-b last:border-0">
                      <td className="px-6 py-3.5 text-muted-foreground">
                        {row.feature}
                      </td>
                      <td className="px-6 py-3.5 text-center">
                        {typeof row.free === "boolean" ? (
                          row.free ? (
                            <Check className="mx-auto size-4 text-success" />
                          ) : (
                            <span className="text-muted-foreground/40">
                              —
                            </span>
                          )
                        ) : (
                          <span className="text-muted-foreground">
                            {row.free}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3.5 text-center">
                        {typeof row.pro === "boolean" ? (
                          row.pro ? (
                            <Check className="mx-auto size-4 text-success" />
                          ) : (
                            <span className="text-muted-foreground/40">
                              —
                            </span>
                          )
                        ) : (
                          <span>{row.pro}</span>
                        )}
                      </td>
                      <td className="px-6 py-3.5 text-center">
                        {typeof row.team === "boolean" ? (
                          row.team ? (
                            <Check className="mx-auto size-4 text-success" />
                          ) : (
                            <span className="text-muted-foreground/40">
                              —
                            </span>
                          )
                        ) : (
                          <span>{row.team}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t py-24 sm:py-32">
        <div className="mx-auto container px-6">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              FAQ
            </div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Frequently asked questions
            </h2>
          </div>
          <div className="mt-16 space-y-6">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-xl border bg-card p-6"
              >
                <h3 className="font-semibold">{faq.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-muted/30 py-24 sm:py-32">
        <div className="mx-auto container px-6 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Ready to get started?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Start with 5 free audits per month. Upgrade when you need more.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Get started for free
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/features">
              <Button variant="outline" size="lg">
                See all features
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
