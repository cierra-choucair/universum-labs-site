import { Arrow, CTALink } from "@/components/marketing/CTA";
import { Reveal } from "@/components/marketing/Reveal";
import { Section, SectionHeading } from "@/components/marketing/Section";

/**
 * Current work, organized as one system — Map → Evaluate → Build →
 * Advise — with the six underlying engagement capabilities
 * discoverable inside it rather than flattened into a grid of cards.
 */

const MODES = [
  {
    title: "Map",
    lead: "See a field whole.",
    body: "We synthesize research and map technology ecosystems so the state of a field — its people, evidence, tools, and open problems — becomes visible at once.",
    capabilities: [
      "Research synthesis and evidence mapping",
      "Emerging-technology landscape and ecosystem mapping",
    ],
  },
  {
    title: "Evaluate",
    lead: "Weigh what is real.",
    body: "We assess opportunities against alternatives, readiness against claims, and evidence against enthusiasm — including whether a quantum approach beats the best classical one.",
    capabilities: ["Classical-versus-quantum opportunity analysis"],
  },
  {
    title: "Build",
    lead: "Make it infrastructure.",
    body: "We build the systems that keep intelligence alive after the report is delivered: observatories, knowledge graphs, and decision environments owned by your institution.",
    capabilities: [
      "Institutional observatories and decision tools",
      "Custom knowledge graphs and intelligence platforms",
    ],
  },
  {
    title: "Advise",
    lead: "Decide with context.",
    body: "We work alongside leadership on complex emerging-technology decisions, bringing the mapped evidence into the room where strategy is set.",
    capabilities: ["Strategic advisory and custom research"],
  },
] as const;

export function Capabilities() {
  return (
    <Section id="work" className="py-28 sm:py-36" width="wide">
      <SectionHeading
        kicker="Current work"
        title={
          <>
            From evidence to <span className="italic">action</span>.
          </>
        }
        lede="While the platform matures, Universum Labs works directly with institutions today. Four modes of engagement, one discipline: every claim traceable to evidence."
      />

      <div className="mt-16 grid gap-x-12 gap-y-14 sm:grid-cols-2">
        {MODES.map((mode, i) => (
          <Reveal key={mode.title} delay={i * 70}>
            <article className="relative border-t border-lavender-15 pt-6">
              <span
                aria-hidden="true"
                className="absolute -top-[3px] left-0 h-[5px] w-[5px] rounded-full bg-lavender"
              />
              <div className="flex items-baseline gap-4">
                <span aria-hidden="true" className="font-mono text-xs text-linen-50">
                  0{i + 1}
                </span>
                <h3 className="font-display text-3xl text-linen">
                  {mode.title} <span className="italic text-lavender">— {mode.lead}</span>
                </h3>
              </div>
              <p className="mt-3 text-base leading-relaxed text-linen-70">{mode.body}</p>
              <ul className="mt-4 space-y-1.5" aria-label={`${mode.title} capabilities`}>
                {mode.capabilities.map((capability) => (
                  <li key={capability} className="flex items-start gap-2.5 text-sm text-linen-50">
                    <span
                      aria-hidden="true"
                      className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-lavender-30"
                    />
                    {capability}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-14">
        <CTALink href="/contact" variant="ghost">
          Start a conversation about an engagement <Arrow />
        </CTALink>
      </Reveal>
    </Section>
  );
}
