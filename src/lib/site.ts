/**
 * Central site configuration.
 *
 * Everything that depends on deployment context (domains, application
 * URLs) is resolved from environment variables here, so no URL is
 * hardcoded anywhere else in the codebase.
 */

export const SITE_NAME = "Universum Labs";

export const SITE_TAGLINE = "A digital Alexandria for scientific knowledge";

export const SITE_DESCRIPTION =
  "Universum Labs is creating the intelligence layer for emerging technology — connecting research, evidence, data, models, tools, use cases, and institutions into systems people can navigate and act upon.";

/** Verified public contact address (from the Universum Labs brand book). */
export const CONTACT_EMAIL = "hello@universumlabs.com";

/**
 * Canonical site URL. Set NEXT_PUBLIC_SITE_URL in production;
 * falls back to localhost so local builds always work.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
  /\/$/,
  "",
);

/**
 * The Universum Labs application (login → dashboard → graph) lives in a
 * separate deployment. Until it is deployed, links resolve to the local
 * /login page which explains early access honestly.
 */
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? null;

export const LOGIN_URL =
  process.env.NEXT_PUBLIC_APP_LOGIN_URL ?? (APP_URL ? `${APP_URL}/login` : "/login");

/** Primary homepage navigation. Anchors live on the homepage. */
export const NAV_ITEMS = [
  { label: "Vision", href: "/#vision" },
  { label: "Platform", href: "/#platform" },
  { label: "Work", href: "/#work" },
  { label: "Who It Serves", href: "/#who-it-serves" },
  { label: "Team", href: "/#team" },
  { label: "Insights", href: "/insights" },
] as const;
