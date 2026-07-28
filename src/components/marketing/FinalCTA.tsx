import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { CTALink } from "@/components/marketing/CTA";
import { Reveal } from "@/components/marketing/Reveal";
import { Section } from "@/components/marketing/Section";

/**
 * The closing invitation: not a sales banner, but a call to help build
 * knowledge infrastructure — with three concrete ways to take part.
 */
export function FinalCTA() {
  return (
    <Section id="join" className="relative overflow-hidden py-32 sm:py-40">
      {/* A quiet constellation behind the closing statement. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_45%_at_50%_40%,rgba(59,15,204,0.14),transparent_70%)]"
      />
      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal>
          <p className="kicker">An invitation</p>
          <h2 className="mt-5 font-display text-4xl leading-[1.06] text-linen sm:text-5xl lg:text-6xl">
            Every map begins with a few
            <span className="italic text-lavender"> points of light</span>.
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-linen-70 sm:text-lg">
            A living map of scientific knowledge will not be built by one company alone. It will be
            built with the researchers who explore it, the institutions that test it against real
            questions, and the partners who need it to exist. If that includes you, this is the
            moment to take part.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-11 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <CTALink href="/early-access" variant="primary">
              Apply for Early Access
            </CTALink>
            <CTALink href="/contact" variant="secondary">
              Explore a Partnership
            </CTALink>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="mx-auto mt-14 max-w-md text-left">
            <NewsletterForm />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
