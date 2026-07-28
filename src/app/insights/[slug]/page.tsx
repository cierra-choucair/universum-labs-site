import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";

import { formatDate } from "@/components/insights/ArticleCard";
import { Section } from "@/components/marketing/Section";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { getPostBySlug } from "@/lib/wordpress";

export const revalidate = 300;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Article not found" };
  return {
    title: post.seo.title,
    description: post.seo.description,
    alternates: { canonical: `/insights/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.seo.title,
      description: post.seo.description,
      url: `${SITE_URL}/insights/${post.slug}`,
      publishedTime: post.date,
      modifiedTime: post.modified,
      images: post.featuredImage ? [{ url: post.featuredImage.url }] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.seo.description,
    datePublished: post.date,
    dateModified: post.modified,
    url: `${SITE_URL}/insights/${post.slug}`,
    image: post.featuredImage?.url,
    author: post.author
      ? { "@type": "Person", name: post.author.name }
      : { "@type": "Organization", name: SITE_NAME },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/brand/universum-mark.svg` },
    },
  };

  return (
    <div className="pt-32 sm:pt-40">
      <Section width="narrow" className="pb-24 sm:pb-32">
        <nav aria-label="Breadcrumb" className="mb-10">
          <Link href="/insights" className="text-sm text-lavender hover:text-linen">
            ← All insights
          </Link>
        </nav>

        <article>
          <header>
            {post.categories.length > 0 ? (
              <p className="mb-4 flex flex-wrap gap-2">
                {post.categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/insights?category=${category.slug}`}
                    className="rounded-full border border-lavender-15 px-3 py-0.5 text-xs uppercase tracking-[0.12em] text-lavender hover:border-lavender-30"
                  >
                    {category.name}
                  </Link>
                ))}
              </p>
            ) : null}
            <h1 className="font-display text-4xl leading-[1.08] text-linen sm:text-5xl">
              {post.title}
            </h1>
            <p className="mt-5 text-sm text-linen-50">
              {post.author ? `${post.author.name} · ` : ""}
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </p>
          </header>

          {post.featuredImage ? (
            <figure className="mt-10 overflow-hidden rounded-2xl border border-lavender-15">
              <Image
                src={post.featuredImage.url}
                alt={post.featuredImage.alt}
                width={post.featuredImage.width ?? 1280}
                height={post.featuredImage.height ?? 720}
                sizes="(min-width: 768px) 720px, 100vw"
                className="h-auto w-full"
                priority
              />
            </figure>
          ) : null}

          <div
            className="prose-insights mt-10"
            // Sanitized server-side in the WordPress adapter before render.
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </article>

        <div className="hairline mt-16" aria-hidden="true" />
        <p className="mt-8 text-sm text-linen-70">
          <Link href="/insights" className="text-lavender hover:text-linen">
            ← Back to all insights
          </Link>
        </p>
      </Section>
      <Script
        id="article-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
    </div>
  );
}
