# Universum Labs — Public Website

The public website for **Universum Labs**: _a digital Alexandria for scientific knowledge_.
Built with Next.js (App Router), TypeScript, and Tailwind CSS, with a headless-WordPress
content adapter for Insights, server-side email delivery for inquiry forms, and a
Beehiiv-backed newsletter.

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in what you have; everything degrades gracefully
npm run dev                  # http://localhost:3000
```

## Commands

| Command                | Purpose                                  |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | Development server                       |
| `npm run build`        | Production build (includes type check)   |
| `npm start`            | Serve the production build               |
| `npm run lint`         | ESLint                                   |
| `npm run typecheck`    | TypeScript, no emit                      |
| `npm test`             | Vitest suite (forms, CMS adapter, email) |
| `npm run format`       | Prettier write                           |
| `npm run format:check` | Prettier check                           |

## Routes

| Route               | Description                                                                                                                          |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `/`                 | Cinematic single-page homepage                                                                                                       |
| `/insights`         | Article index (headless WordPress; honest empty state when unset)                                                                    |
| `/insights/[slug]`  | Individual article                                                                                                                   |
| `/contact`          | Partnership & contact form                                                                                                           |
| `/early-access`     | Pilot / early-access application                                                                                                     |
| `/login`            | Redirects to the platform login once `NEXT_PUBLIC_APP_LOGIN_URL` (or `NEXT_PUBLIC_APP_URL`) is set; explains early access until then |
| `/api/contact`      | Contact form endpoint (SMTP delivery)                                                                                                |
| `/api/early-access` | Pilot application endpoint (SMTP delivery)                                                                                           |
| `/api/newsletter`   | Newsletter endpoint (Beehiiv v2 API, server-side only)                                                                               |

## Environment variables

See [`.env.example`](.env.example) for the full annotated list.

| Variable                                                                                           | Required for                                                               |
| -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                                                                             | Canonical URLs, sitemap, OG metadata                                       |
| `NEXT_PUBLIC_APP_URL` / `NEXT_PUBLIC_APP_LOGIN_URL`                                                | Linking "Log In" to the deployed platform                                  |
| `INQUIRY_TO_EMAIL`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `SMTP_SECURE` | Contact + pilot form delivery ([docs](docs/EMAIL_AND_NEWSLETTER_SETUP.md)) |
| `BEEHIIV_API_KEY`, `BEEHIIV_PUBLICATION_ID`                                                        | Newsletter signup ([docs](docs/EMAIL_AND_NEWSLETTER_SETUP.md))             |
| `WORDPRESS_API_URL`                                                                                | Insights content ([docs](docs/WORDPRESS_SETUP.md))                         |

Every integration is optional at build time: without credentials the forms report
honestly that they are not yet connected, and Insights shows its "coming soon" state.
No integration ever fakes success.

## Project structure

```
src/
  app/                 Routes, API handlers, metadata, sitemap, robots
  components/
    marketing/         Public-site sections (hero, canvas, pathways, team…)
    insights/          Article cards and pagination
    forms/             Form fields, submission hook, the three forms
  lib/                 Server-side adapters: WordPress, email, Beehiiv,
                       validation, sanitization, rate limiting, site config
  fonts/               Self-hosted brand typefaces (Space Grotesk, Instrument Serif)
public/brand/          Mark SVG and Open Graph image
public/team/           Drop team headshots here as <name>.jpg|png|webp
                       (cierra, sandro, autumn) — the team section picks
                       them up automatically; until then it renders
                       constellation monograms.
docs/                  Setup guides (WordPress, email, Beehiiv)
```

## Brand

Design tokens come from the Universum Labs brand book (v1.0, 2026): Void Black
`#0A0612`, Deep Indigo `#14092A`, Linen White `#F4F1EB`, Lumen Lavender `#C7B8F2`,
and the Quantum Gradient `#6B21E8 → #3B0FCC` (reserved for the mark and singular
hero moments). Typography is Poppins (headings/display) and Roboto (body/UI),
with Space Grotesk retained solely for the wordmark lockup; all three are
self-hosted from `src/fonts`.

## The platform application

The login → dashboard → graph application lives in a **separate repository** and is
not yet deployed. This site links to it exclusively through
`NEXT_PUBLIC_APP_URL` / `NEXT_PUBLIC_APP_LOGIN_URL`; until those are set, `/login`
renders an honest early-access explanation. No application code was moved or
modified.
