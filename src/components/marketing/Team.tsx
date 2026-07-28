import fs from "node:fs";
import path from "node:path";

import Image from "next/image";

import { Reveal } from "@/components/marketing/Reveal";
import { Section, SectionHeading } from "@/components/marketing/Section";

/**
 * The founding team as currently presented publicly. Headshots are
 * loaded from /public/team/<slug>.<ext> when present; until real
 * photographs are added to the repository, a constellation monogram is
 * rendered instead. No invented biographies, credentials, or links.
 */

const TEAM = [
  { name: "Cierra", role: "Chief Executive Officer", slug: "cierra" },
  { name: "Sandro", role: "Chief Operating Officer", slug: "sandro" },
  { name: "Autumn", role: "Chief Technology Officer", slug: "autumn" },
] as const;

const HEADSHOT_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "avif"];

function findHeadshot(slug: string): string | null {
  for (const ext of HEADSHOT_EXTENSIONS) {
    const file = path.join(process.cwd(), "public", "team", `${slug}.${ext}`);
    if (fs.existsSync(file)) return `/team/${slug}.${ext}`;
  }
  return null;
}

function ConstellationMonogram({ initial }: { initial: string }) {
  return (
    <div
      aria-hidden="true"
      className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-lavender-15 bg-indigo-deep/50"
    >
      <svg viewBox="0 0 160 160" className="absolute inset-0 h-full w-full">
        <g stroke="rgba(199,184,242,0.25)" strokeWidth="0.6" fill="none">
          <circle cx="80" cy="80" r="52" />
          <circle cx="80" cy="80" r="34" opacity="0.6" />
        </g>
        <g fill="rgba(199,184,242,0.8)">
          <circle cx="80" cy="28" r="2" />
          <circle cx="126" cy="96" r="1.6" />
          <circle cx="46" cy="118" r="1.6" />
          <circle cx="32" cy="62" r="1.2" />
        </g>
      </svg>
      <span className="relative font-display text-6xl italic text-lavender">{initial}</span>
    </div>
  );
}

export function Team() {
  const members = TEAM.map((member) => ({
    ...member,
    headshot: findHeadshot(member.slug),
  }));

  return (
    <Section id="team" className="py-28 sm:py-36">
      <SectionHeading
        kicker="The team"
        title={
          <>
            The people <span className="italic">drawing the map</span>.
          </>
        }
        lede="Universum Labs is built by a small founding team that believes scientific knowledge deserves better infrastructure — and that building it is a long, serious undertaking."
      />

      <ul className="mt-16 grid gap-10 sm:grid-cols-3">
        {members.map((member, i) => (
          <Reveal key={member.slug} as="li" delay={i * 90}>
            {member.headshot ? (
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-lavender-15">
                <Image
                  src={member.headshot}
                  alt={`Portrait of ${member.name}, ${member.role} of Universum Labs`}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <ConstellationMonogram initial={member.name.charAt(0)} />
            )}
            <h3 className="mt-5 font-display text-2xl text-linen">{member.name}</h3>
            <p className="mt-1 text-sm uppercase tracking-[0.14em] text-lavender">{member.role}</p>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
