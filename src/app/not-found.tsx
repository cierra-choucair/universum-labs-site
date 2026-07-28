import { CTALink } from "@/components/marketing/CTA";
import { Section } from "@/components/marketing/Section";

export default function NotFound() {
  return (
    <div className="pt-32 sm:pt-40">
      <Section width="narrow" className="pb-24 sm:pb-32">
        <div className="mx-auto max-w-lg text-center">
          <p className="kicker">404</p>
          <h1 className="mt-4 font-display text-4xl leading-[1.08] text-linen sm:text-5xl">
            This point in space is <span className="italic">uncharted</span>.
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-linen-70">
            The page you were looking for doesn&rsquo;t exist — or hasn&rsquo;t been connected to
            the map yet.
          </p>
          <div className="mt-8">
            <CTALink href="/" variant="secondary">
              Return to the homepage
            </CTALink>
          </div>
        </div>
      </Section>
    </div>
  );
}
