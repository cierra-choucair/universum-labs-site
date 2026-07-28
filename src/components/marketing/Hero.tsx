import Link from "next/link";

import { CTALink } from "@/components/marketing/CTA";
import { UniverseCanvas } from "@/components/marketing/UniverseCanvas";
import { LOGIN_URL } from "@/lib/site";

/**
 * Hero: darkness as the scale of the unknown, points of light as
 * individual pieces of knowledge. The canvas field behind the headline
 * begins scattered and organizes as the visitor scrolls — the page's
 * central metaphor, started here and carried through the sections
 * below.
 */
export function Hero() {
  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden">
      {/* Atmospheric depth: a faint indigo nebula behind the field. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_70%_20%,rgba(20,9,42,0.9),transparent_70%),radial-gradient(ellipse_50%_40%_at_15%_75%,rgba(59,15,204,0.12),transparent_70%)]"
      />
      <UniverseCanvas className="absolute inset-0 h-full w-full" />
      {/* Legibility veil behind the headline block. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_55%,rgba(10,6,18,0.72),transparent_75%)]"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 pb-24 pt-32 text-center sm:px-10">
        <p className="kicker">Scientific intelligence infrastructure</p>
        <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[1.04] text-linen sm:text-6xl lg:text-7xl">
          A digital <span className="italic">Alexandria</span> for scientific knowledge.
        </h1>
        <p className="mt-7 max-w-2xl text-base leading-relaxed text-linen-70 sm:text-lg">
          Universum Labs is creating the intelligence layer for emerging technology — connecting
          research, evidence, data, models, tools, use cases, and institutions into systems people
          can navigate and act upon.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <CTALink href="/early-access" variant="primary">
            Join Early Access
          </CTALink>
          <CTALink href="/contact" variant="secondary">
            Partner With Us
          </CTALink>
        </div>

        <p className="mt-6 text-sm text-linen-50">
          Already exploring with us?{" "}
          {LOGIN_URL.startsWith("http") ? (
            <a href={LOGIN_URL} className="text-lavender underline-offset-4 hover:underline">
              Log in
            </a>
          ) : (
            <Link href={LOGIN_URL} className="text-lavender underline-offset-4 hover:underline">
              Log in
            </Link>
          )}
        </p>
      </div>

      {/* Scroll cue */}
      <div className="relative z-10 flex justify-center pb-10">
        <a
          href="#premise"
          className="flex flex-col items-center gap-2 text-xs uppercase tracking-[0.22em] text-linen-50 transition-colors hover:text-lavender"
        >
          The idea
          <span aria-hidden="true" className="block h-8 w-px bg-lavender-30" />
        </a>
      </div>
    </section>
  );
}
