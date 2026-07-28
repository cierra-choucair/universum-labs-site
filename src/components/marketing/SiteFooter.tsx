import Link from "next/link";

import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { UniversumLogo } from "@/components/marketing/Logo";
import { CONTACT_EMAIL, LOGIN_URL, NAV_ITEMS } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-lavender-15 bg-void">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
          <div>
            <UniversumLogo stacked />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-linen-70">
              A living map of scientific knowledge — connecting research, evidence, tools, and
              institutions so people can explore, understand, and act on what humanity knows.
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="kicker">Site</h2>
            <ul className="mt-4 space-y-2.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-linen-70 transition-colors hover:text-linen"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Get involved">
            <h2 className="kicker">Get involved</h2>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  href="/early-access"
                  className="text-sm text-linen-70 transition-colors hover:text-linen"
                >
                  Early access
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-linen-70 transition-colors hover:text-linen"
                >
                  Contact &amp; partnerships
                </Link>
              </li>
              <li>
                <a
                  href={LOGIN_URL}
                  className="text-sm text-linen-70 transition-colors hover:text-linen"
                >
                  Log in
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-sm text-linen-70 transition-colors hover:text-linen"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <NewsletterForm compact />
          </div>
        </div>

        <div className="hairline mt-14" aria-hidden="true" />

        <div className="mt-6 flex flex-col gap-2 text-xs text-linen-50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Universum Labs. All rights reserved.</p>
          {/* TODO: replace with real policy pages before launch. */}
          <p>Privacy policy and terms of use — in preparation.</p>
        </div>
      </div>
    </footer>
  );
}
