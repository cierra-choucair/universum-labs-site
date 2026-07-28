import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { CTALink } from "@/components/marketing/CTA";
import { Section } from "@/components/marketing/Section";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to the Universum Labs platform.",
  robots: { index: false },
};

/**
 * Stable /login path. Once the application is deployed and
 * NEXT_PUBLIC_APP_LOGIN_URL (or NEXT_PUBLIC_APP_URL) is configured,
 * this route redirects straight to the real login. Until then it
 * explains early access honestly.
 */
export default function LoginPage() {
  const appLogin =
    process.env.NEXT_PUBLIC_APP_LOGIN_URL ??
    (process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")}/login`
      : null);

  if (appLogin) {
    redirect(appLogin);
  }

  return (
    <div className="pt-32 sm:pt-40">
      <Section width="narrow" className="pb-24 sm:pb-32">
        <div className="mx-auto max-w-lg rounded-3xl border border-lavender-15 bg-indigo-deep/40 p-10 text-center">
          <p className="kicker">Platform access</p>
          <h1 className="mt-4 font-display text-4xl leading-[1.08] text-linen">
            The platform opens with <span className="italic">early access</span>.
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-linen-70">
            The Universum Labs platform is an early prototype in development, and login is currently
            limited to early-access participants. Public login will be linked here the moment it is
            available.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4">
            <CTALink href="/early-access" variant="primary">
              Apply for Early Access
            </CTALink>
            <CTALink href="/" variant="ghost">
              Back to the homepage
            </CTALink>
          </div>
        </div>
      </Section>
    </div>
  );
}
