import type { Metadata } from "next";

import { EarlyAccessForm } from "@/components/forms/EarlyAccessForm";
import { Section } from "@/components/marketing/Section";

export const metadata: Metadata = {
  title: "Join Early Access",
  description:
    "Apply for early access to the Universum Labs platform — an early prototype for exploring connected scientific knowledge.",
  alternates: { canonical: "/early-access" },
};

export default function EarlyAccessPage() {
  return (
    <div className="pt-32 sm:pt-40">
      <Section className="pb-24 sm:pb-32" width="wide">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <header>
            <p className="kicker">Early access</p>
            <h1 className="mt-4 font-display text-5xl leading-[1.05] text-linen sm:text-6xl">
              Help shape the <span className="italic">map</span>.
            </h1>
            <p className="mt-6 text-base leading-relaxed text-linen-70 sm:text-lg">
              The Universum Labs platform is an early prototype in active development. We are
              onboarding a small group of early users — researchers, institutions, and curious minds
              — whose questions and feedback will shape what it becomes.
            </p>
            <ul className="mt-8 space-y-4 text-sm leading-relaxed text-linen-70">
              <li className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-lavender"
                />
                Explore the current quantum and emerging-technology knowledge graph as it grows.
              </li>
              <li className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-lavender"
                />
                Bring your own research questions and see what connected knowledge reveals.
              </li>
              <li className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-lavender"
                />
                Influence the roadmap directly — early feedback carries real weight here.
              </li>
            </ul>
          </header>
          <div className="rounded-3xl border border-lavender-15 bg-indigo-deep/40 p-7 sm:p-10">
            <EarlyAccessForm />
          </div>
        </div>
      </Section>
    </div>
  );
}
