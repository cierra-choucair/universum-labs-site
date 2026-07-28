"use client";

import { useId } from "react";

/**
 * The Universum Labs mark — an interlocking recursion on a 5×7 unit
 * grid, traced from the supplied brand artwork. The Quantum Gradient
 * (#6B21E8 → #3B0FCC) is reserved for the mark, per the brand book.
 */
export function UniversumMark({ className }: { className?: string }) {
  // Unique gradient id per instance so multiple logos can coexist.
  const id = useId();
  const gradientId = `ul-quantum-${id.replace(/[^a-zA-Z0-9-]/g, "")}`;

  return (
    <svg
      viewBox="0 0 330 477"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="330"
          y2="0"
        >
          <stop offset="0" stopColor="#6B21E8" />
          <stop offset="1" stopColor="#3B0FCC" />
        </linearGradient>
      </defs>
      <g fill={`url(#${gradientId})`}>
        <rect x="61" y="0" width="192" height="60" />
        <rect x="61" y="60" width="63" height="23" />
        <rect x="61" y="83" width="269" height="60" />
        <rect x="271" y="143" width="59" height="191" />
        <rect x="0" y="166" width="246" height="60" />
        <rect x="0" y="226" width="61" height="86" />
        <rect x="61" y="251" width="102" height="61" />
        <rect x="187" y="226" width="59" height="108" />
        <rect x="61" y="334" width="269" height="61" />
        <rect x="61" y="395" width="63" height="23" />
        <rect x="61" y="418" width="246" height="59" />
      </g>
    </svg>
  );
}

/**
 * Full lockup: mark + wordmark. The wordmark is live text set in Space
 * Grotesk caps at 0.14em tracking, per the brand book.
 */
export function UniversumLogo({
  className,
  stacked = false,
}: {
  className?: string;
  stacked?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-3 ${className ?? ""}`}>
      <UniversumMark className="h-8 w-auto shrink-0" />
      <span
        className={`font-sans font-medium uppercase leading-[1.05] tracking-[0.14em] text-linen ${
          stacked ? "flex flex-col text-sm" : "text-sm"
        }`}
      >
        {stacked ? (
          <>
            <span>Universum</span>
            <span>Labs</span>
          </>
        ) : (
          <>Universum Labs</>
        )}
      </span>
    </span>
  );
}
