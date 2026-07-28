import { afterEach, describe, expect, it, vi } from "vitest";

import { getPostBySlug, getPosts, isWordPressConfigured, mapPost } from "./wordpress";

const RAW_POST = {
  id: 42,
  slug: "toward-a-knowledge-graph",
  date_gmt: "2026-04-01T10:00:00",
  modified_gmt: "2026-04-02T11:00:00",
  title: { rendered: "Toward a knowledge graph of quantum &amp; readiness" },
  excerpt: { rendered: "<p>How readiness signals can be mapped. [&hellip;]</p>" },
  content: {
    rendered: `<h2>Structure</h2><p>Body text.</p><script>alert("xss")</script>`,
  },
  _embedded: {
    author: [{ name: "Universum Labs", avatar_urls: { "96": "https://cms.example/avatar.png" } }],
    "wp:featuredmedia": [
      {
        source_url: "https://cms.example/wp-content/uploads/graph.jpg",
        alt_text: "A knowledge graph visualization",
        media_details: { width: 1600, height: 900 },
      },
    ],
    "wp:term": [
      [
        { id: 3, taxonomy: "category", name: "Quantum Intelligence", slug: "quantum-intelligence" },
        { id: 9, taxonomy: "post_tag", name: "graphs", slug: "graphs" },
      ],
    ],
  },
};

describe("mapPost", () => {
  const post = mapPost(RAW_POST);

  it("maps core fields and decodes entities", () => {
    expect(post.id).toBe(42);
    expect(post.slug).toBe("toward-a-knowledge-graph");
    expect(post.title).toBe("Toward a knowledge graph of quantum & readiness");
    expect(post.date).toBe("2026-04-01T10:00:00Z");
  });

  it("sanitizes content HTML", () => {
    expect(post.contentHtml).toContain("<h2>Structure</h2>");
    expect(post.contentHtml).not.toContain("script");
  });

  it("cleans the excerpt", () => {
    expect(post.excerpt).toBe("How readiness signals can be mapped.…");
  });

  it("maps featured image, author, and categories (not tags)", () => {
    expect(post.featuredImage?.url).toBe("https://cms.example/wp-content/uploads/graph.jpg");
    expect(post.featuredImage?.width).toBe(1600);
    expect(post.author?.name).toBe("Universum Labs");
    expect(post.categories).toEqual([
      { id: 3, name: "Quantum Intelligence", slug: "quantum-intelligence" },
    ]);
  });

  it("derives SEO fields when no SEO plugin data exists", () => {
    expect(post.seo.title).toBe(post.title);
    expect(post.seo.description).toBe(post.excerpt);
  });

  it("prefers Yoast SEO data when present", () => {
    const withYoast = mapPost({
      ...RAW_POST,
      yoast_head_json: { title: "SEO Title", description: "SEO description" },
    });
    expect(withYoast.seo).toEqual({ title: "SEO Title", description: "SEO description" });
  });

  it("survives minimal payloads", () => {
    const minimal = mapPost({ id: 1, slug: "x", title: { rendered: "X" } });
    expect(minimal.featuredImage).toBeNull();
    expect(minimal.author).toBeNull();
    expect(minimal.categories).toEqual([]);
  });
});

describe("adapter without WORDPRESS_API_URL", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("reports unconfigured and returns empty results without fetching", async () => {
    vi.stubEnv("WORDPRESS_API_URL", "");
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    expect(isWordPressConfigured()).toBe(false);
    await expect(getPosts()).resolves.toEqual({ posts: [], totalPages: 0, totalPosts: 0 });
    await expect(getPostBySlug("anything")).resolves.toBeNull();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("returns empty results when the API is unreachable", async () => {
    vi.stubEnv("WORDPRESS_API_URL", "https://cms.example");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("network down");
      }),
    );
    await expect(getPosts()).resolves.toEqual({ posts: [], totalPages: 0, totalPosts: 0 });
    await expect(getPostBySlug("a-post")).resolves.toBeNull();
  });

  it("rejects invalid slugs before touching the network", async () => {
    vi.stubEnv("WORDPRESS_API_URL", "https://cms.example");
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    await expect(getPostBySlug("../../etc/passwd")).resolves.toBeNull();
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

describe("adapter with a working API", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("parses posts and pagination headers", async () => {
    vi.stubEnv("WORDPRESS_API_URL", "https://cms.example");
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(JSON.stringify([RAW_POST]), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "X-WP-TotalPages": "4",
              "X-WP-Total": "31",
            },
          }),
      ),
    );
    const { posts, totalPages, totalPosts } = await getPosts({ page: 2 });
    expect(posts).toHaveLength(1);
    expect(posts[0].slug).toBe("toward-a-knowledge-graph");
    expect(totalPages).toBe(4);
    expect(totalPosts).toBe(31);
  });
});
