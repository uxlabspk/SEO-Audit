import { Shield, Users, BarChart3, CheckCircle2 } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "2,500+",
    label: "Websites Audited",
  },
  {
    icon: CheckCircle2,
    value: "99.9%",
    label: "Uptime Guaranteed",
  },
  {
    icon: Shield,
    value: "SOC 2",
    label: "Security Compliant",
  },
  {
    icon: BarChart3,
    value: "4.9/5",
    label: "User Rating",
  },
];

const trustedBy = [
  "Trusted by developers and agencies worldwide",
  "GDPR compliant data processing",
  "No data stored after audit completes",
];

export function TrustSignals() {
  return (
    <section className="border-t bg-muted/30 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <stat.icon className="size-5" />
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          {trustedBy.map((item) => (
            <div key={item} className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-success" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
