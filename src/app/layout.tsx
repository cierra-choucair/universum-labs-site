import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { ReactNode } from "react";

import { SiteFooter } from "@/components/marketing/SiteFooter";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { CONTACT_EMAIL, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";

import "./globals.css";

/**
 * Site typefaces, self-hosted (no third-party font requests):
 * Poppins for headings, Roboto (variable) for body/UI, and
 * Space Grotesk kept solely for the wordmark lockup, per the brand
 * book's fixed logo treatment.
 */
const poppins = localFont({
  src: [
    { path: "../fonts/poppins-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/poppins-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/poppins-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/poppins-400-italic.woff2", weight: "400", style: "italic" },
    { path: "../fonts/poppins-500-italic.woff2", weight: "500", style: "italic" },
    { path: "../fonts/poppins-600-italic.woff2", weight: "600", style: "italic" },
  ],
  variable: "--font-poppins",
  display: "swap",
});

const roboto = localFont({
  src: [
    { path: "../fonts/roboto-variable.woff2", weight: "100 900", style: "normal" },
    { path: "../fonts/roboto-italic-variable.woff2", weight: "100 900", style: "italic" },
  ],
  variable: "--font-roboto",
  display: "swap",
});

const spaceGrotesk = localFont({
  src: "../fonts/space-grotesk-variable.woff2",
  weight: "300 700",
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [{ url: "/brand/og-image.png", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: ["/brand/og-image.png"],
  },
  alternates: {
    canonical: "/",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/brand/universum-mark.svg`,
  description: SITE_DESCRIPTION,
  email: CONTACT_EMAIL,
  slogan: SITE_TAGLINE,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${roboto.variable} ${spaceGrotesk.variable}`}>
      <body>
        {/* Scroll-reveal styling must never hide content when JS is off. */}
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-indigo-deep focus:px-5 focus:py-2.5 focus:text-sm focus:text-linen"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <Script
          id="organization-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </body>
    </html>
  );
}
