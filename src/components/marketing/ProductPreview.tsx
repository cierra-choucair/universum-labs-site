import Link from "next/link";

import { Arrow, CTALink } from "@/components/marketing/CTA";
import { Reveal } from "@/components/marketing/Reveal";
import { Section, SectionHeading } from "@/components/marketing/Section";
import { LOGIN_URL } from "@/lib/site";

/**
 * The bridge from public vision into the working application. The
 * platform is an early prototype in a separate deployment; no product
 * screenshots exist yet, so the flow is presented as a clearly
 * diagrammatic sequence — never a fabricated screenshot.
 */

const FLOW = [
  {
    step: "Log in",
    body: "Early-access users enter through a private login while the prototype develops.",
  },
  {
    step: "Dashboard",
    body: "An overview of the mapped domain: what has been connected, and where to begin.",
  },
  {
    step: "Graph exploration",
    body: "The heart of the platform — an interactive knowledge graph you move through, following relationships between research, problems, tools, and evidence.",
  },
] as const;

export function ProductPreview() {
  return (
    <Section id="product" className="py-28 sm:py-36" width="wide">
      <SectionHeading
        kicker="The platform"
        title={
          <>
            From this page into the <span className="italic">prototype</span>.
          </>
        }
        lede="The Universum Labs platform is an early prototype in active development, currently focused on quantum and emerging-technology knowledge. This is the flow early users step into."
      />

      <div className="mt-16 grid gap-5 md:grid-cols-3">
        {FLOW.map((item, i) => (
          <Reveal key={item.step} delay={i * 90}>
            <div className="relative h-full rounded-2xl border border-lavender-15 bg-indigo-deep/40 p-7">
              {/* Diagrammatic window chrome — an illustration of the flow, not a screenshot. */}
              <div aria-hidden="true" className="mb-6 select-none">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-lavender-30" />
                  <span className="h-2 w-2 rounded-full bg-lavender-30" />
                  <span className="ml-2 h-2 flex-1 rounded-full bg-lavender-15" />
                </div>
                <div className="mt-5 space-y-2.5">
                  {i === 0 ? (
                    <>
                      <div className="h-2.5 w-2/5 rounded-full bg-lavender-15" />
                      <div className="h-7 w-full rounded-md border border-lavender-15" />
                      <div className="h-7 w-full rounded-md border border-lavender-15" />
                      <div className="h-7 w-1/2 rounded-md bg-[linear-gradient(100deg,#6B21E8,#3B0FCC)] opacity-70" />
                    </>
                  ) : i === 1 ? (
                    <>
                      <div className="flex gap-2.5">
                        <div className="h-14 flex-1 rounded-md border border-lavender-15" />
                        <div className="h-14 flex-1 rounded-md border border-lavender-15" />
                      </div>
                      <div className="h-2.5 w-3/4 rounded-full bg-lavender-15" />
                      <div className="h-2.5 w-1/2 rounded-full bg-lavender-15" />
                    </>
                  ) : (
                    <svg viewBox="0 0 200 64" className="w-full" aria-hidden="true">
                      <g stroke="rgba(199,184,242,0.3)" strokeWidth="0.7">
                        <line x1="30" y1="34" x2="80" y2="14" />
                        <line x1="30" y1="34" x2="86" y2="48" />
                        <line x1="80" y1="14" x2="128" y2="30" />
                        <line x1="86" y1="48" x2="128" y2="30" />
                        <line x1="128" y1="30" x2="172" y2="18" />
                        <line x1="128" y1="30" x2="168" y2="50" />
                      </g>
                      <g fill="#C7B8F2">
                        <circle cx="30" cy="34" r="3.4" />
                        <circle cx="80" cy="14" r="2.6" />
                        <circle cx="86" cy="48" r="2.6" />
                        <circle cx="128" cy="30" r="4" fill="#8B5CF6" />
                        <circle cx="172" cy="18" r="2.6" />
                        <circle cx="168" cy="50" r="2.6" />
                      </g>
                    </svg>
                  )}
                </div>
              </div>
              <p className="kicker">Step {i + 1}</p>
              <h3 className="mt-2 font-display text-2xl text-linen">{item.step}</h3>
              <p className="mt-2 text-sm leading-relaxed text-linen-70">{item.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-10">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-lavender-15 p-7 sm:flex-row sm:items-center">
          <p className="max-w-xl text-sm leading-relaxed text-linen-70">
            <span className="font-medium text-lavender">Early prototype in development.</span>{" "}
            Access is limited while the foundations are built. Early users shape what the platform
            becomes.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <CTALink href="/early-access" variant="primary">
              Join Early Access
            </CTALink>
            {LOGIN_URL.startsWith("http") ? (
              <a href={LOGIN_URL} className="text-sm text-lavender hover:text-linen">
                Log In <Arrow />
              </a>
            ) : (
              <Link href={LOGIN_URL} className="text-sm text-lavender hover:text-linen">
                Log In <Arrow />
              </Link>
            )}
          </div>
        </div>
        <p className="mt-4 text-sm text-linen-50">
          Represent an institution considering a structured pilot?{" "}
          <Link href="/early-access" className="text-lavender underline-offset-4 hover:underline">
            Apply as a pilot organization
          </Link>
          .
        </p>
      </Reveal>
    </Section>
  );
}
