import { Hero } from "@/components/landing/hero";
import { TrustSignals } from "@/components/landing/trust-signals";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Pricing } from "@/components/landing/pricing";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustSignals />
      <Features />
      <HowItWorks />
      <Pricing />
    </>
  );
}
