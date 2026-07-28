import { Capabilities } from "@/components/marketing/Capabilities";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { Hero } from "@/components/marketing/Hero";
import { InsightsPreview } from "@/components/marketing/InsightsPreview";
import { Pathways } from "@/components/marketing/Pathways";
import { Platform } from "@/components/marketing/Platform";
import { Premise } from "@/components/marketing/Premise";
import { ProductPreview } from "@/components/marketing/ProductPreview";
import { QuantumDiscipline } from "@/components/marketing/QuantumDiscipline";
import { Team } from "@/components/marketing/Team";
import { Vision } from "@/components/marketing/Vision";

/**
 * The public homepage: a single narrative from darkness (the scale of
 * the unknown) through structure (the intelligence layer) to
 * invitation (early access, partnership, newsletter).
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Premise />
      <div className="hairline mx-auto max-w-5xl" aria-hidden="true" />
      <Vision />
      <Platform />
      <Pathways />
      <Capabilities />
      <QuantumDiscipline />
      <ProductPreview />
      <div className="hairline mx-auto max-w-5xl" aria-hidden="true" />
      <Team />
      <InsightsPreview />
      <FinalCTA />
    </>
  );
}
