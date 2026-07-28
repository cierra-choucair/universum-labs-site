import { Reveal } from "@/components/marketing/Reveal";
import { Section } from "@/components/marketing/Section";

/**
 * The premise: humanity does not lack information — it lacks coherence
 * across information. Deliberately spare: one claim, one explanation.
 */
export function Premise() {
  return (
    <Section id="premise" className="py-28 sm:py-36">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <Reveal>
          <p className="kicker">The premise</p>
          <h2 className="mt-4 font-display text-4xl leading-[1.08] text-linen sm:text-5xl lg:text-6xl">
            Knowledge is not scarce.
            <br />
            <span className="italic text-lavender">Coherence</span> is.
          </h2>
        </Reveal>
        <Reveal delay={120} className="self-end">
          <div className="space-y-5 text-base leading-relaxed text-linen-70 sm:text-lg">
            <p>
              Every year, humanity produces more papers, datasets, models, tools, and experiments
              than any person or institution can hold in view. They accumulate across journals,
              repositories, preprint servers, lab archives, and org charts — each one meaningful,
              almost none of them connected.
            </p>
            <p>
              Search helps people retrieve documents. It cannot show how a method in one field
              answers a problem in another, which claims rest on strong evidence, or where a
              technology actually stands on its path from idea to use.
            </p>
            <p className="text-linen">
              Universum Labs is interested in what becomes possible when the relationships among
              documents, data, ideas, and institutions become navigable — when knowledge behaves
              less like an archive and more like a map.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
