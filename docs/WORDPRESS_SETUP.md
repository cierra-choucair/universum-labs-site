# Headless WordPress Setup for Insights

The Insights section (`/insights`, `/insights/[slug]`, and the homepage preview)
reads from a standard WordPress installation over the built-in
[WordPress REST API](https://developer.wordpress.org/rest-api/). No plugin is
required for the core integration. Until WordPress is configured the site renders
an honest "Insights are coming soon" state — nothing breaks.

## 1. Provision WordPress

Any standard WordPress host works (WordPress.com Business, WP Engine, Kinsta,
Hostinger, a self-managed instance…). The website only reads from it, so it can
live on a subdomain such as `cms.universumlabs.com`. Requirements:

- WordPress 5.9+ (REST API v2 is built in)
- Publicly reachable over HTTPS
- Pretty permalinks enabled (see below — **required**, the REST API depends on it)

Editors write in the normal WordPress admin; this site fetches and renders the
content. Themes on the WordPress side are irrelevant (only the admin is used).

## 2. Required WordPress settings

1. **Permalinks** — Settings → Permalinks → select **"Post name"**
   (`/%postname%/`). This enables the REST API routes and gives posts the clean
   slugs the frontend uses.
2. **Site visibility** — Settings → Reading → make sure
   "Discourage search engines" reflects your intent for the CMS domain itself.
   (The frontend carries the public SEO; you generally want the CMS domain not
   indexed. This does not affect the REST API.)
3. **Time zone** — Settings → General → set to your publishing time zone; dates
   shown on the site come from post publish dates.

## 3. Environment variable

Set one variable on the website deployment:

```
WORDPRESS_API_URL=https://cms.universumlabs.com
```

Base URL only — no `/wp-json` suffix, no trailing slash (both are tolerated and
stripped). Rebuild/redeploy after setting it.

## 4. Categories

The frontend renders whatever categories exist in WordPress, so create the
editorial taxonomy there (Posts → Categories). The intended set:

- Research
- Emerging Technology
- Quantum Intelligence
- Company News
- Field Notes

Category filtering (`/insights?category=<slug>`) and the badges on cards use
these directly. Only non-empty categories are offered as filters. Tags are
ignored by the frontend.

## 5. Featured images and authors

- **Featured image** → becomes the card image and the article hero. Recommended
  size: 1600×900 (16:9). Always set alt text in the media library — it is
  passed through to the frontend.
- **Author display name** (Users → Profile → "Display name publicly as") →
  shown on cards and articles, and used in Article structured data.
- Posts without a featured image get a tasteful constellation placeholder; the
  site never fabricates imagery.

## 6. Excerpts and SEO metadata

- The excerpt (or WordPress's auto-excerpt) becomes the card text and the
  article's meta description.
- If **Yoast SEO** is installed, its `yoast_head_json` title/description are
  used automatically for article metadata. This is optional — without it the
  frontend derives sensible metadata from the title and excerpt.

## 7. CORS

Not needed. All WordPress requests are made **server-side** (during rendering
with 5-minute revalidation), never from the browser — so no CORS headers are
required on the WordPress host, and the CMS can even be IP-restricted to the
website's egress if desired.

## 8. Caching / revalidation

The adapter (`src/lib/wordpress.ts`) fetches with `revalidate: 300` — content
changes appear within five minutes without a redeploy. Adjust
`REVALIDATE_SECONDS` there if editorial cadence demands it.

## 9. Test the connection

1. Verify the API from your machine:
   ```bash
   curl "https://cms.universumlabs.com/wp-json/wp/v2/posts?per_page=1&_embed=1"
   ```
   You should receive JSON containing your latest published post.
2. Set `WORDPRESS_API_URL` locally in `.env.local`, run `npm run dev`, and open
   `http://localhost:3000/insights` — the post list should render.
3. Open an individual article and confirm the featured image, category badges,
   author, and date.
4. Unreachable/misconfigured API → the site logs the error server-side and
   falls back to the "coming soon" state. It never crashes the page.

## 10. Optional plugins

None are required. Genuinely useful ones:

- **Yoast SEO** — richer article metadata, picked up automatically (see §6).
- A security/hardening plugin of your choice for the WordPress admin itself.

Avoid page-builder plugins that emit heavy proprietary markup — the frontend
sanitizes HTML to standard editorial elements (headings, lists, quotes, tables,
images, code), which matches the core block editor's output.
