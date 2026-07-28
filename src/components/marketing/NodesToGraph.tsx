"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The platform section's key visual: isolated points that organize into
 * a small knowledge graph as the section scrolls into view. Pure SVG +
 * CSS transitions; instant (no animation) under prefers-reduced-motion.
 */

interface GraphNode {
  /** Final (organized) position. */
  x: number;
  y: number;
  /** Scattered offset before organization. */
  dx: number;
  dy: number;
  r: number;
  label?: string;
  hub?: boolean;
}

const NODES: GraphNode[] = [
  { x: 200, y: 70, dx: -84, dy: -28, r: 5, label: "Research", hub: true },
  { x: 96, y: 128, dx: 40, dy: -52, r: 4, label: "Evidence" },
  { x: 306, y: 118, dx: -36, dy: 44, r: 4, label: "Data" },
  { x: 60, y: 226, dx: 72, dy: 30, r: 4, label: "Models" },
  { x: 168, y: 190, dx: -52, dy: 58, r: 5, label: "Problems", hub: true },
  { x: 282, y: 210, dx: 48, dy: -66, r: 4, label: "Tools" },
  { x: 122, y: 306, dx: -30, dy: -60, r: 4, label: "Use cases" },
  { x: 238, y: 296, dx: 60, dy: 36, r: 5, label: "Institutions", hub: true },
  { x: 338, y: 288, dx: -68, dy: -34, r: 4, label: "Readiness" },
];

const EDGES: Array<[number, number]> = [
  [0, 1],
  [0, 2],
  [0, 4],
  [1, 4],
  [2, 5],
  [4, 3],
  [4, 6],
  [4, 5],
  [5, 8],
  [6, 7],
  [7, 8],
  [7, 4],
];

export function NodesToGraph() {
  const ref = useRef<SVGSVGElement | null>(null);
  const [organized, setOrganized] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    // Reduced-motion users still reach the organized state — the
    // .motion-safe class kills the transitions so it appears instantly.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setOrganized(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 400 360"
      role="img"
      aria-label="Diagram: scattered points of knowledge organizing into a connected graph of research, evidence, data, models, tools, problems, use cases, institutions, and readiness signals."
      className="h-auto w-full max-w-lg"
    >
      <g>
        {EDGES.map(([a, b], i) => (
          <line
            key={i}
            x1={NODES[a].x}
            y1={NODES[a].y}
            x2={NODES[b].x}
            y2={NODES[b].y}
            stroke="rgba(199, 184, 242, 0.36)"
            strokeWidth={0.8}
            className="motion-safe"
            style={{
              opacity: organized ? 1 : 0,
              transition: `opacity 0.8s ease ${0.5 + i * 0.07}s`,
            }}
          />
        ))}
      </g>
      <g>
        {NODES.map((n, i) => (
          <g
            key={i}
            className="motion-safe"
            style={{
              transform: organized ? "translate(0,0)" : `translate(${n.dx}px, ${n.dy}px)`,
              transition: `transform 1.1s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.05}s`,
            }}
          >
            <circle
              cx={n.x}
              cy={n.y}
              r={n.r}
              fill={n.hub ? "#C7B8F2" : "rgba(244, 241, 235, 0.85)"}
            />
            {n.hub ? (
              <circle
                cx={n.x}
                cy={n.y}
                r={n.r + 5}
                fill="none"
                stroke="rgba(199, 184, 242, 0.35)"
                strokeWidth={0.8}
              />
            ) : null}
            {n.label ? (
              <text
                x={n.x}
                y={n.y - n.r - 9}
                textAnchor="middle"
                fill="rgba(244, 241, 235, 0.62)"
                fontSize="11"
                className="motion-safe"
                style={{
                  opacity: organized ? 1 : 0,
                  transition: `opacity 0.7s ease ${0.7 + i * 0.06}s`,
                }}
              >
                {n.label}
              </text>
            ) : null}
          </g>
        ))}
      </g>
    </svg>
  );
}
