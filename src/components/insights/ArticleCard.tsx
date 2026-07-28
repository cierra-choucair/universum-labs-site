import Image from "next/image";
import Link from "next/link";

import type { WPPost } from "@/lib/wordpress";

export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function ArticleCard({
  post,
  headingLevel = "h2",
}: {
  post: WPPost;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-lavender-15 bg-indigo-deep/40 transition-colors hover:border-lavender-30">
      {post.featuredImage ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Image
            src={post.featuredImage.url}
            alt={post.featuredImage.alt}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      ) : (
        <div
          aria-hidden="true"
          className="relative aspect-[16/9] w-full bg-[radial-gradient(ellipse_70%_80%_at_30%_20%,rgba(59,15,204,0.25),transparent_70%)]"
        >
          <svg viewBox="0 0 320 180" className="h-full w-full">
            <g stroke="rgba(199,184,242,0.25)" strokeWidth="0.6">
              <line x1="60" y1="120" x2="130" y2="60" />
              <line x1="130" y1="60" x2="210" y2="95" />
              <line x1="210" y1="95" x2="270" y2="50" />
            </g>
            <g fill="rgba(199,184,242,0.7)">
              <circle cx="60" cy="120" r="2.5" />
              <circle cx="130" cy="60" r="3" />
              <circle cx="210" cy="95" r="2.5" />
              <circle cx="270" cy="50" r="2" />
            </g>
          </svg>
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        {post.categories.length > 0 ? (
          <p className="mb-3 flex flex-wrap gap-2">
            {post.categories.slice(0, 2).map((category) => (
              <span
                key={category.id}
                className="rounded-full border border-lavender-15 px-3 py-0.5 text-xs uppercase tracking-[0.12em] text-lavender"
              >
                {category.name}
              </span>
            ))}
          </p>
        ) : null}
        <Heading className="font-display text-xl leading-snug text-linen">
          <Link
            href={`/insights/${post.slug}`}
            className="after:absolute after:inset-0 group-hover:text-lavender"
          >
            {post.title}
          </Link>
        </Heading>
        {post.excerpt ? (
          <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-linen-70">
            {post.excerpt}
          </p>
        ) : null}
        <p className="mt-auto pt-5 text-xs text-linen-50">
          {post.author ? `${post.author.name} · ` : ""}
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </p>
      </div>
    </article>
  );
}
