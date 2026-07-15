import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "For trying things out",
    features: [
      "5 audits per month",
      "All 9 automated checks",
      "AI-generated reports",
      "Basic score cards",
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
      "Unlimited audits",
      "All 9 automated checks",
      "AI-generated reports",
      "Detailed score cards",
      "Priority support",
      "Export reports as PDF",
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
      "Everything in Pro",
      "5 team members",
      "Shared audit history",
      "Custom branding",
      "API access",
      "Dedicated support",
    ],
    cta: "Contact sales",
    href: "/register",
    variant: "outline" as const,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="border-t py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Start free, upgrade when you need more.
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-3">
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
                    key={feature}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Check className="size-4 shrink-0 text-success" />
                    {feature}
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
  );
}
