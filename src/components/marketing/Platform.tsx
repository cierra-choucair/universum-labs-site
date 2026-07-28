import { NodesToGraph } from "@/components/marketing/NodesToGraph";
import { Reveal } from "@/components/marketing/Reveal";
import { Section, SectionHeading } from "@/components/marketing/Section";

const CONNECTED_THINGS = [
  "Research",
  "Evidence",
  "Data",
  "Models",
  "Tools",
  "Problems",
  "Use cases",
  "Institutions",
  "Technology-readiness signals",
];

/**
 * What Universum Labs is building: an intelligence layer, presented
 * honestly as an early prototype — and the distinction that defines it
 * (repository → search → intelligence layer).
 */
export function Platform() {
  return (
    <Section id="platform" className="py-28 sm:py-36" width="wide">
      <SectionHeading
        kicker="What we're building"
        title={
          <>
            An intelligence layer, not another <span className="italic">archive</span>.
          </>
        }
        lede={
          <>
            The Universum Labs platform — an early prototype in development — structures and
            connects the elements that make up a field of science and technology, so that the whole
            can be explored as one navigable system.
          </>
        }
      />

      <div className="mt-16 grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal className="order-2 lg:order-1">
          <div className="flex justify-center rounded-2xl border border-lavender-15 bg-indigo-deep/40 p-6 sm:p-10">
            <NodesToGraph />
          </div>
          <p className="mt-4 text-center text-xs text-linen-50">
            From isolated records to a connected field — the transformation at the center of the
            platform.
          </p>
        </Reveal>

        <div className="order-1 lg:order-2">
          <Reveal>
            <h3 className="sr-only">What the platform connects</h3>
            <ul className="flex flex-wrap gap-2.5" aria-label="What the platform connects">
              {CONNECTED_THINGS.map((thing) => (
                <li
                  key={thing}
                  className="rounded-full border border-lavender-15 px-4 py-1.5 text-sm text-linen-70"
                >
                  {thing}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={100}>
            <ol className="mt-10 space-y-0">
              <li className="relative border-l border-lavender-15 pb-8 pl-6">
                <span
                  aria-hidden="true"
                  className="absolute -left-[3.5px] top-1.5 h-1.5 w-1.5 rounded-full bg-linen-50"
                />
                <h4 className="text-base font-medium text-linen">A repository stores.</h4>
                <p className="mt-1 text-sm leading-relaxed text-linen-70">
                  Documents accumulate. What each one means for the others stays invisible.
                </p>
              </li>
              <li className="relative border-l border-lavender-15 pb-8 pl-6">
                <span
                  aria-hidden="true"
                  className="absolute -left-[3.5px] top-1.5 h-1.5 w-1.5 rounded-full bg-linen-50"
                />
                <h4 className="text-base font-medium text-linen">Search retrieves.</h4>
                <p className="mt-1 text-sm leading-relaxed text-linen-70">
                  You get the document you asked for — if you already knew to ask for it.
                </p>
              </li>
              <li className="relative border-l border-transparent pl-6">
                <span
                  aria-hidden="true"
                  className="absolute -left-[4.5px] top-1.5 h-2 w-2 rounded-full bg-lavender"
                />
                <h4 className="text-base font-medium text-lavender">
                  An intelligence layer reveals.
                </h4>
                <p className="mt-1 text-sm leading-relaxed text-linen-70">
                  Relationships, patterns, gaps, the weight of evidence, and the context a decision
                  actually needs — including the questions you didn&rsquo;t know to ask.
                </p>
              </li>
            </ol>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
