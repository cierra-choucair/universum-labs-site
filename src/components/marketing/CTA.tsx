import Link from "next/link";
import { ReactNode } from "react";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors duration-200 focus-visible:outline-2";

const variants = {
  /** Quantum gradient — reserved for the most important action on a page. */
  primary:
    "bg-[linear-gradient(100deg,#6B21E8,#3B0FCC)] text-linen hover:brightness-110 active:brightness-95",
  /** Hairline border — secondary actions. */
  secondary: "border border-lavender-30 text-linen hover:border-lavender hover:text-lavender",
  /** Quiet text link with arrow. */
  ghost: "text-lavender hover:text-linen px-0",
} as const;

export function CTALink({
  href,
  children,
  variant = "primary",
  className = "",
  external = false,
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
  external?: boolean;
}) {
  const cls = `${base} ${variants[variant]} ${className}`;
  if (external || href.startsWith("http")) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

/** Small right-pointing arrow used at the end of quiet links. */
export function Arrow() {
  return (
    <span aria-hidden="true" className="translate-y-px">
      →
    </span>
  );
}
