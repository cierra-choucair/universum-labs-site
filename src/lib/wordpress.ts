import "server-only";

import { sanitizeWordPressHtml, stripHtml } from "@/lib/sanitize";

/**
 * Headless WordPress content adapter.
 *
 * Reads from the WordPress REST API (wp/v2) at WORDPRESS_API_URL.
 * Every function degrades gracefully: when WordPress is not configured
 * or unreachable, list calls resolve to an empty result and single-post
 * calls resolve to null, so the site renders its honest empty states
 * instead of failing.
 */

const REVALIDATE_SECONDS = 300;
const DEFAULT_PER_PAGE = 9;

export interface WPCategory {
  id: number;
  name: string;
  slug: string;
}

export interface WPAuthor {
  name: string;
  avatarUrl: string | null;
}

export interface WPImage {
  url: string;
  alt: string;
  width: number | null;
  height: number | null;
}

export interface WPPost {
  id: number;
  slug: string;
  title: string;
  /** Sanitized HTML, safe to render. */
  contentHtml: string;
  /** Plain-text excerpt (tags stripped). */
  excerpt: string;
  date: string;
  modified: string;
  author: WPAuthor | null;
  featuredImage: WPImage | null;
  categories: WPCategory[];
  /** SEO fields from Yoast/RankMath when exposed, otherwise derived. */
  seo: {
    title: string;
    description: string;
  };
}

export interface WPPostList {
  posts: WPPost[];
  totalPages: number;
  totalPosts: number;
}

export function isWordPressConfigured(): boolean {
  return Boolean(getBaseUrl());
}

function getBaseUrl(): string | null {
  const raw = process.env.WORDPRESS_API_URL;
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return url.origin + url.pathname.replace(/\/(wp-json\/?)?$/, "").replace(/\/$/, "");
  } catch {
    return null;
  }
}

function decodeEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

/* eslint-disable @typescript-eslint/no-explicit-any -- raw REST payload */
export function mapPost(raw: any): WPPost {
  const embedded = raw?._embedded ?? {};

  const media = embedded["wp:featuredmedia"]?.[0];
  const featuredImage: WPImage | null = media?.source_url
    ? {
        url: media.source_url,
        alt: media.alt_text || decodeEntities(stripHtml(raw?.title?.rendered ?? "")),
        width: media.media_details?.width ?? null,
        height: media.media_details?.height ?? null,
      }
    : null;

  const authorRaw = embedded.author?.[0];
  const author: WPAuthor | null = authorRaw?.name
    ? {
        name: authorRaw.name,
        avatarUrl: authorRaw.avatar_urls?.["96"] ?? null,
      }
    : null;

  const categories: WPCategory[] = (embedded["wp:term"] ?? [])
    .flat()
    .filter((t: any) => t?.taxonomy === "category")
    .map((t: any) => ({ id: t.id, name: decodeEntities(t.name), slug: t.slug }));

  const title = decodeEntities(stripHtml(raw?.title?.rendered ?? ""));
  const excerpt = decodeEntities(stripHtml(raw?.excerpt?.rendered ?? ""))
    .replace(/\s*\[&hellip;\]\s*$/, "…")
    .replace(/\s*\[…\]\s*$/, "…")
    .trim();

  const yoast = raw?.yoast_head_json;

  return {
    id: raw?.id ?? 0,
    slug: raw?.slug ?? "",
    title,
    contentHtml: sanitizeWordPressHtml(raw?.content?.rendered ?? ""),
    excerpt,
    date: raw?.date_gmt ? `${raw.date_gmt}Z` : (raw?.date ?? ""),
    modified: raw?.modified_gmt ? `${raw.modified_gmt}Z` : (raw?.modified ?? ""),
    author,
    featuredImage,
    categories,
    seo: {
      title: yoast?.title ?? title,
      description: yoast?.description ?? excerpt,
    },
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

async function wpFetch(path: string): Promise<Response | null> {
  const base = getBaseUrl();
  if (!base) return null;
  try {
    const res = await fetch(`${base}/wp-json/wp/v2${path}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) {
      console.error(`WordPress API error ${res.status} for ${path}`);
      return null;
    }
    return res;
  } catch (error) {
    console.error(`WordPress API unreachable for ${path}:`, error);
    return null;
  }
}

export async function getPosts({
  page = 1,
  perPage = DEFAULT_PER_PAGE,
  categorySlug,
}: {
  page?: number;
  perPage?: number;
  categorySlug?: string;
} = {}): Promise<WPPostList> {
  const empty: WPPostList = { posts: [], totalPages: 0, totalPosts: 0 };

  let categoryFilter = "";
  if (categorySlug) {
    const category = await getCategoryBySlug(categorySlug);
    if (!category) return empty;
    categoryFilter = `&categories=${category.id}`;
  }

  const res = await wpFetch(
    `/posts?_embed=1&status=publish&per_page=${perPage}&page=${page}${categoryFilter}`,
  );
  if (!res) return empty;

  try {
    const data = await res.json();
    if (!Array.isArray(data)) return empty;
    return {
      posts: data.map(mapPost),
      totalPages: Number(res.headers.get("X-WP-TotalPages") ?? 1),
      totalPosts: Number(res.headers.get("X-WP-Total") ?? data.length),
    };
  } catch (error) {
    console.error("WordPress API returned malformed post list:", error);
    return empty;
  }
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  if (!/^[a-z0-9-]+$/i.test(slug)) return null;
  const res = await wpFetch(`/posts?_embed=1&status=publish&slug=${encodeURIComponent(slug)}`);
  if (!res) return null;
  try {
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    return mapPost(data[0]);
  } catch (error) {
    console.error("WordPress API returned malformed post:", error);
    return null;
  }
}

export async function getCategories(): Promise<WPCategory[]> {
  const res = await wpFetch(`/categories?per_page=50&hide_empty=true`);
  if (!res) return [];
  try {
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data.map((c) => ({
      id: c.id,
      name: decodeEntities(c.name ?? ""),
      slug: c.slug ?? "",
    }));
  } catch {
    return [];
  }
}

async function getCategoryBySlug(slug: string): Promise<WPCategory | null> {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug) ?? null;
}
