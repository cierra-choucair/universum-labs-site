import { Reveal } from "@/components/marketing/Reveal";
import { Section } from "@/components/marketing/Section";

/**
 * The vision: what "a digital Alexandria" actually means — the
 * aspiration to gather knowledge, extended into a context where
 * gathering is no longer enough.
 */
export function Vision() {
  return (
    <Section id="vision" className="py-28 sm:py-36">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <p className="kicker">The vision</p>
          <h2 className="mt-4 font-display text-4xl leading-[1.08] text-linen sm:text-5xl">
            Why <span className="italic">Alexandria</span>?
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <div className="mt-8 space-y-5 text-left text-base leading-relaxed text-linen-70 sm:text-lg">
            <p>
              The Library of Alexandria stands for a particular ambition: that the knowledge of the
              world could be gathered in one place, and that gathering it would multiply its value.
              For its time, collection was the frontier.
            </p>
            <p>
              Our time has the opposite problem. Knowledge is abundant and duplicated across
              thousands of systems — what it lacks is connection. A digital Alexandria cannot be a
              bigger archive. It has to be a structure in which knowledge is <em>connected</em> to
              what it concerns, <em>evaluated</em> against its evidence, <em>contextualized</em> by
              the institutions and tools around it, and <em>explorable</em> by anyone with a serious
              question.
            </p>
            <p>
              That is the infrastructure Universum Labs exists to build — beginning with quantum and
              emerging technology, and growing toward the sciences at large.
            </p>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <figure className="mt-14 border-t border-b border-lavender-15 py-10">
            <blockquote className="font-display text-2xl leading-snug text-linen sm:text-3xl">
              &ldquo;A living map of human scientific knowledge — what we know, what remains
              unknown, and what comes next.&rdquo;
            </blockquote>
            <figcaption className="kicker mt-5">The long horizon</figcaption>
          </figure>
        </Reveal>
      </div>
    </Section>
  );
}
