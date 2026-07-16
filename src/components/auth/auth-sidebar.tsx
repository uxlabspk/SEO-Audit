"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CheckCircle2,
  Gauge,
  Shield,
  Zap,
  FileText,
  ArrowRight,
  Lock,
  Users,
  BarChart3,
  Globe,
  Mail,
} from "lucide-react";

interface FeatureItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

interface SidebarContent {
  headline: string;
  headlineHighlight: string;
  description: string;
  features: FeatureItem[];
  badges: string[];
}

const pages: Record<string, SidebarContent> = {
  "/login": {
    headline: "Welcome back to",
    headlineHighlight: "Probe",
    description:
      "Pick up where you left off. Your audits and reports are waiting.",
    features: [
      {
        icon: Gauge,
        title: "Core Web Vitals",
        description: "Real performance metrics from Google Chrome.",
      },
      {
        icon: Shield,
        title: "Security Headers",
        description: "9 critical headers checked and scored.",
      },
      {
        icon: Zap,
        title: "Results in seconds",
        description: "Full audit report in under 30 seconds.",
      },
      {
        icon: FileText,
        title: "AI Reports",
        description: "Prioritized, actionable fixes for developers.",
      },
    ],
    badges: ["No credit card required", "Free tier available"],
  },
  "/register": {
    headline: "Start auditing",
    headlineHighlight: "for free",
    description:
      "Create your account and run your first website audit in under a minute.",
    features: [
      {
        icon: Globe,
        title: "5 free audits per month",
        description: "Full access to all 9 automated checks.",
      },
      {
        icon: BarChart3,
        title: "AI-generated reports",
        description: "Prioritized fixes, not generic advice.",
      },
      {
        icon: Lock,
        title: "No credit card required",
        description: "Start for free, upgrade when ready.",
      },
      {
        icon: Zap,
        title: "Results in seconds",
        description: "Full report in under 30 seconds.",
      },
    ],
    badges: ["5 free audits/month", "All 9 checks included"],
  },
  "/forgot-password": {
    headline: "Account",
    headlineHighlight: "recovery",
    description:
      "No worries. Enter your email and we&apos;ll send you a link to reset your password.",
    features: [
      {
        icon: Lock,
        title: "Secure reset process",
        description: "Time-limited tokens expire after 24 hours.",
      },
      {
        icon: Shield,
        title: "Account protection",
        description: "Your account stays safe during the reset.",
      },
      {
        icon: Mail,
        title: "Instant delivery",
        description: "Reset link arrives in your inbox within seconds.",
      },
      {
        icon: CheckCircle2,
        title: "One-click reset",
        description: "Click the link and set a new password.",
      },
    ],
    badges: ["24-hour expiry", "Secure token-based"],
  },
  "/reset-password": {
    headline: "Set your",
    headlineHighlight: "new password",
    description:
      "Choose a strong password to secure your account. Make it at least 8 characters.",
    features: [
      {
        icon: Lock,
        title: "Strong encryption",
        description: "Passwords hashed with bcrypt, 12 rounds.",
      },
      {
        icon: Shield,
        title: "Session security",
        description: "Old sessions are invalidated after reset.",
      },
      {
        icon: CheckCircle2,
        title: "Instant activation",
        description: "New password works immediately.",
      },
      {
        icon: Zap,
        title: "Quick process",
        description: "Back to your audits in under a minute.",
      },
    ],
    badges: ["Encrypted storage", "Instant activation"],
  },
  "/verify-email": {
    headline: "Verify your",
    headlineHighlight: "email address",
    description:
      "Check your inbox for a verification link. Once verified, you&apos;ll have full access to Probe.",
    features: [
      {
        icon: Mail,
        title: "Check your inbox",
        description: "We sent a verification link to your email.",
      },
      {
        icon: Shield,
        title: "Secure link",
        description: "Verification tokens expire after 24 hours.",
      },
      {
        icon: CheckCircle2,
        title: "One-click verify",
        description: "Click the link and you're all set.",
      },
      {
        icon: Zap,
        title: "Instant access",
        description: "Full access unlocked after verification.",
      },
    ],
    badges: ["24-hour expiry", "One-click verify"],
  },
};

const defaultPage: SidebarContent = {
  headline: "Your website, audited",
  headlineHighlight: "in seconds",
  description:
    "Run real checks against Core Web Vitals, SEO, accessibility, and security. Get an AI-generated report with prioritized fixes.",
  features: [
    {
      icon: Gauge,
      title: "Core Web Vitals",
      description: "Real performance metrics from Google Chrome.",
    },
    {
      icon: Shield,
      title: "Security Headers",
      description: "9 critical headers checked and scored.",
    },
    {
      icon: Zap,
      title: "Results in seconds",
      description: "Full audit report in under 30 seconds.",
    },
    {
      icon: FileText,
      title: "AI Reports",
      description: "Prioritized, actionable fixes for developers.",
    },
  ],
  badges: ["No credit card required", "Free tier available"],
};

export function AuthSidebar() {
  const pathname = usePathname();
  const content = pages[pathname] || defaultPage;

  return (
    <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-muted/30 p-10 lg:flex">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />

      <div className="relative">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-mono text-sm font-bold">
            P
          </div>
          <span className="text-xl font-semibold tracking-tight">Probe</span>
        </Link>
      </div>

      <div className="relative space-y-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {content.headline}
            <br />
            <span
              className="text-primary"
              dangerouslySetInnerHTML={{ __html: content.headlineHighlight }}
            />
          </h2>
          <p
            className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: content.description }}
          />
        </div>

        <div className="space-y-4">
          {content.features.map((feature) => (
            <div key={feature.title} className="flex items-start gap-3">
              <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <feature.icon className="size-4" />
              </div>
              <div>
                <h3 className="text-sm font-medium">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          {content.badges.map((badge) => (
            <div key={badge} className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-success" />
              <span>{badge}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
