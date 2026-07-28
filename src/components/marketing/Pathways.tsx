import { Arrow, CTALink } from "@/components/marketing/CTA";
import { Reveal } from "@/components/marketing/Reveal";
import { Section, SectionHeading } from "@/components/marketing/Section";

/**
 * Three pathways through the same universe of knowledge — individuals,
 * academia, and enterprise/institutions — joined by a single vertical
 * constellation line rather than presented as interchangeable personas.
 */

const PATHWAYS = [
  {
    id: "explore",
    kicker: "For individuals",
    title: "Explore",
    audience: "Researchers, independent scholars, technologists, students, and the curious.",
    body: "Enter a connected field of scientific knowledge and follow it wherever it leads: trace an idea across disciplines, see which evidence supports a claim, and discover relationships that conventional search would never surface. Curiosity is a legitimate research method here.",
    cta: { label: "Join Early Access", href: "/early-access" },
  },
  {
    id: "advance",
    kicker: "For academia",
    title: "Advance",
    audience: "Universities, laboratories, and research institutions.",
    body: "Synthesize research at the pace it is produced, map evidence across fields, make institutional knowledge visible and durable, and find the interdisciplinary connections that turn adjacent work into collaboration. Pilot programs shape the platform with us.",
    cta: { label: "Discuss a pilot", href: "/early-access" },
  },
  {
    id: "decide",
    kicker: "For enterprise & institutions",
    title: "Decide & Build",
    audience: "Companies, governments, multilateral bodies, and economic-development groups.",
    body: "Understand a technology landscape as a living system: who is doing what, where the evidence stands, which opportunities are real, and how ready each approach actually is. From readiness analysis to dedicated observatories and custom intelligence systems.",
    cta: { label: "Partner With Us", href: "/contact" },
  },
] as const;

export function Pathways() {
  return (
    <Section id="who-it-serves" className="py-28 sm:py-36" width="wide">
      <SectionHeading
        kicker="Who it serves"
        title={
          <>
            One universe. <span className="italic">Three ways in.</span>
          </>
        }
        lede="The same connected knowledge serves a student following an idea, a laboratory mapping a field, and a government weighing an investment. Each audience has its own pathway — none of them an afterthought."
      />

      <div className="relative mt-16">
        {/* The constellation line connecting the three pathways. */}
        <div
          aria-hidden="true"
          className="absolute bottom-8 left-[7px] top-2 hidden w-px bg-gradient-to-b from-lavender-30 via-lavender-30 to-transparent md:block"
        />
        <ol className="space-y-14 md:space-y-20">
          {PATHWAYS.map((p, i) => (
            <Reveal key={p.id} as="li" delay={i * 80} className="relative md:pl-14">
              <span
                aria-hidden="true"
                className="absolute left-0 top-2 hidden h-[15px] w-[15px] rounded-full border border-lavender bg-void md:block"
              >
                <span className="absolute inset-[4px] rounded-full bg-lavender" />
              </span>
              <div className="grid gap-6 md:grid-cols-[1fr_1.6fr] md:gap-12">
                <div>
                  <p className="kicker">{p.kicker}</p>
                  <h3 className="mt-3 font-display text-3xl italic text-linen sm:text-4xl">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-linen-50">{p.audience}</p>
                </div>
                <div>
                  <p className="text-base leading-relaxed text-linen-70 sm:text-lg">{p.body}</p>
                  <CTALink href={p.cta.href} variant="ghost" className="mt-5">
                    {p.cta.label} <Arrow />
                  </CTALink>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}
