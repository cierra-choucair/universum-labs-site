import { ReactNode } from "react";

import { Reveal } from "@/components/marketing/Reveal";

/**
 * Shared section scaffolding: consistent max-width, vertical rhythm,
 * and the kicker → display-serif heading pattern used across the site.
 */
export function Section({
  id,
  children,
  className = "",
  width = "default",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  width?: "default" | "wide" | "narrow";
}) {
  const widths = {
    narrow: "max-w-3xl",
    default: "max-w-5xl",
    wide: "max-w-6xl",
  } as const;
  return (
    <section id={id} className={`scroll-mt-24 px-6 sm:px-10 ${className}`}>
      <div className={`mx-auto ${widths[width]}`}>{children}</div>
    </section>
  );
}

export function SectionHeading({
  kicker,
  title,
  lede,
  align = "left",
}: {
  kicker: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
}) {
  const alignment = align === "center" ? "text-center mx-auto" : "";
  return (
    <Reveal className={`max-w-2xl ${alignment}`}>
      <p className="kicker">{kicker}</p>
      <h2 className="mt-4 font-display text-4xl leading-[1.08] text-linen sm:text-5xl">{title}</h2>
      {lede ? (
        <p className="mt-5 text-base leading-relaxed text-linen-70 sm:text-lg">{lede}</p>
      ) : null}
    </Reveal>
  );
}
