import { Reveal } from "@/components/marketing/Reveal";
import { Section } from "@/components/marketing/Section";

/**
 * The evidence discipline that differentiates the company: quantum
 * approaches are evaluated against the best classical alternatives,
 * not assumed superior. No promised advantage, no market-map hype.
 */
export function QuantumDiscipline() {
  return (
    <Section id="quantum" className="py-28 sm:py-36">
      <div className="rounded-3xl border border-lavender-15 bg-indigo-deep/40 px-7 py-12 sm:px-12 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <Reveal>
            <p className="kicker">Evidence discipline</p>
            <h2 className="mt-4 font-display text-4xl leading-[1.08] text-linen sm:text-5xl">
              Where quantum helps.
              <br />
              <span className="italic text-lavender">And where it doesn&rsquo;t.</span>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-linen-70 sm:text-lg">
              Our first domain is quantum technology — a field where the distance between claim and
              capability is unusually wide. Credible intelligence here cannot start from the
              assumption that quantum wins. It has to compare each quantum approach against the best
              classical alternative, under real constraints: problem size, error rates, cost,
              integration, and the pace at which classical methods themselves keep improving.
            </p>
            <p className="mt-4 text-base leading-relaxed text-linen-70 sm:text-lg">
              So that comparison is built into our analysis. We evaluate where quantum approaches
              may offer meaningful value, where classical methods remain the honest recommendation,
              and where the evidence is still genuinely unsettled — and we say which is which.
            </p>
          </Reveal>

          <Reveal delay={120} className="self-center">
            <ul className="space-y-6" aria-label="What the analysis weighs">
              {[
                {
                  q: "Is there a credible path to advantage?",
                  a: "Mapped against problem structure and published evidence — not vendor roadmaps.",
                },
                {
                  q: "What does the best classical baseline achieve?",
                  a: "Advantage claims mean nothing until the strongest alternative is on the table.",
                },
                {
                  q: "How ready is the approach, really?",
                  a: "Readiness signals traced from research to demonstration to deployment.",
                },
                {
                  q: "What would change the answer?",
                  a: "The assumptions, thresholds, and results that would move a 'not yet' to a 'now'.",
                },
              ].map((item) => (
                <li key={item.q} className="border-l border-lavender-30 pl-5">
                  <p className="font-display text-lg italic text-linen sm:text-xl">{item.q}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-linen-70">{item.a}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
