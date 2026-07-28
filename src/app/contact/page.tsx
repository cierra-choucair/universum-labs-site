import type { Metadata } from "next";

import { ContactForm } from "@/components/forms/ContactForm";
import { Section } from "@/components/marketing/Section";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Partner With Us",
  description:
    "Start a conversation with Universum Labs about partnerships, strategic advisory, custom research, pilots, or investment.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="pt-32 sm:pt-40">
      <Section className="pb-24 sm:pb-32" width="wide">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <header>
            <p className="kicker">Contact &amp; partnerships</p>
            <h1 className="mt-4 font-display text-5xl leading-[1.05] text-linen sm:text-6xl">
              Let&rsquo;s <span className="italic">connect</span>.
            </h1>
            <p className="mt-6 text-base leading-relaxed text-linen-70 sm:text-lg">
              Whether you represent a university weighing a pilot, an institution that needs
              emerging-technology intelligence, a potential partner or funder, or a team with a hard
              question about quantum — we would like to hear from you.
            </p>
            <p className="mt-6 text-sm leading-relaxed text-linen-50">
              Prefer email? Reach us directly at{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-lavender underline-offset-4 hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </header>
          <div className="rounded-3xl border border-lavender-15 bg-indigo-deep/40 p-7 sm:p-10">
            <ContactForm />
          </div>
        </div>
      </Section>
    </div>
  );
}
