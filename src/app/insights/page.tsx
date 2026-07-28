import type { Metadata } from "next";
import Link from "next/link";

import { ArticleCard } from "@/components/insights/ArticleCard";
import { Pagination } from "@/components/insights/Pagination";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { Section } from "@/components/marketing/Section";
import { getCategories, getPosts, isWordPressConfigured } from "@/lib/wordpress";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Research notes, emerging-technology analysis, quantum intelligence, and company news from Universum Labs.",
  alternates: { canonical: "/insights" },
};

export const revalidate = 300;

export default async function InsightsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);
  const categorySlug = params.category;

  const configured = isWordPressConfigured();
  const [{ posts, totalPages }, categories] = configured
    ? await Promise.all([getPosts({ page, categorySlug }), getCategories()])
    : [{ posts: [], totalPages: 0 }, []];

  return (
    <div className="pt-32 sm:pt-40">
      <Section width="wide" className="pb-24 sm:pb-32">
        <header className="max-w-2xl">
          <p className="kicker">Insights</p>
          <h1 className="mt-4 font-display text-5xl leading-[1.05] text-linen sm:text-6xl">
            Field notes from the <span className="italic">frontier</span>.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-linen-70 sm:text-lg">
            Research, emerging-technology analysis, quantum intelligence, and news from Universum
            Labs.
          </p>
        </header>

        {categories.length > 0 ? (
          <nav aria-label="Categories" className="mt-10 flex flex-wrap gap-2.5">
            <Link
              href="/insights"
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                !categorySlug
                  ? "border-lavender text-lavender"
                  : "border-lavender-15 text-linen-70 hover:border-lavender-30"
              }`}
            >
              All
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/insights?category=${category.slug}`}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  categorySlug === category.slug
                    ? "border-lavender text-lavender"
                    : "border-lavender-15 text-linen-70 hover:border-lavender-30"
                }`}
              >
                {category.name}
              </Link>
            ))}
          </nav>
        ) : null}

        {posts.length > 0 ? (
          <>
            <ul className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <li key={post.id}>
                  <ArticleCard post={post} />
                </li>
              ))}
            </ul>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              basePath={categorySlug ? `/insights?category=${categorySlug}` : "/insights"}
            />
          </>
        ) : (
          <div className="mt-16 rounded-3xl border border-lavender-15 bg-indigo-deep/40 px-8 py-20 text-center">
            <svg viewBox="0 0 200 60" className="mx-auto mb-8 w-44" aria-hidden="true">
              <g stroke="rgba(199,184,242,0.3)" strokeWidth="0.6">
                <line x1="30" y1="40" x2="80" y2="18" />
                <line x1="80" y1="18" x2="128" y2="36" />
                <line x1="128" y1="36" x2="174" y2="22" />
              </g>
              <g fill="rgba(199,184,242,0.8)">
                <circle cx="30" cy="40" r="2.5" />
                <circle cx="80" cy="18" r="3" />
                <circle cx="128" cy="36" r="2.5" />
                <circle cx="174" cy="22" r="2" />
              </g>
            </svg>
            <h2 className="font-display text-3xl italic text-linen sm:text-4xl">
              Insights are coming soon.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-linen-70">
              {configured
                ? "No articles have been published yet. The first research notes and company updates are in preparation."
                : "We are preparing our first research notes, emerging-technology analysis, and company updates."}{" "}
              Join the mailing list and they will reach you first.
            </p>
            <div className="mx-auto mt-10 max-w-md text-left">
              <NewsletterForm compact />
            </div>
          </div>
        )}
      </Section>
    </div>
  );
}
