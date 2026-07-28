import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";
import { getPosts, isWordPressConfigured } from "@/lib/wordpress";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/insights`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/early-access`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.9 },
  ];

  if (!isWordPressConfigured()) return staticRoutes;

  // Include up to the 100 most recent published articles.
  const { posts } = await getPosts({ perPage: 100 });
  const articleRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/insights/${post.slug}`,
    lastModified: post.modified ? new Date(post.modified) : undefined,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...articleRoutes];
}
