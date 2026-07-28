import { Arrow, CTALink } from "@/components/marketing/CTA";
import { Reveal } from "@/components/marketing/Reveal";
import { Section, SectionHeading } from "@/components/marketing/Section";
import { ArticleCard } from "@/components/insights/ArticleCard";
import { getPosts, isWordPressConfigured } from "@/lib/wordpress";

/**
 * Latest three articles from the headless WordPress backend. When the
 * CMS is not configured (or unreachable), an honest coming-soon state
 * renders instead — never placeholder articles.
 */
export async function InsightsPreview() {
  const { posts } = isWordPressConfigured() ? await getPosts({ perPage: 3 }) : { posts: [] };

  return (
    <Section id="insights" className="py-28 sm:py-36" width="wide">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          kicker="Insights"
          title={
            <>
              Field notes from the <span className="italic">frontier</span>.
            </>
          }
          lede="Research, emerging-technology analysis, and news from Universum Labs."
        />
        <Reveal delay={100}>
          <CTALink href="/insights" variant="ghost">
            All insights <Arrow />
          </CTALink>
        </Reveal>
      </div>

      {posts.length > 0 ? (
        <ul className="mt-14 grid gap-8 md:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.id} as="li" delay={i * 80}>
              <ArticleCard post={post} headingLevel="h3" />
            </Reveal>
          ))}
        </ul>
      ) : (
        <Reveal className="mt-14">
          <div className="rounded-2xl border border-lavender-15 bg-indigo-deep/40 px-8 py-14 text-center">
            <p className="font-display text-2xl italic text-linen sm:text-3xl">
              First light, coming soon.
            </p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-linen-70">
              We are preparing our first published research notes and company updates. Join the
              mailing list below to read them when they arrive.
            </p>
          </div>
        </Reveal>
      )}
    </Section>
  );
}
