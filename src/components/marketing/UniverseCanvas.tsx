"use client";

import { useEffect, useRef } from "react";

/**
 * The hero's cinematic field of knowledge.
 *
 * A canvas-2D particle field that begins as scattered points of light
 * (individual pieces of knowledge in darkness) and — as the visitor
 * scrolls — organizes into clusters joined by hairline edges: the
 * emergence of structure from fragments. Pointer movement adds a
 * subtle parallax so the field reads as deep space rather than a flat
 * texture.
 *
 * Engineering constraints, in order:
 *  - never block first paint (mounts after hydration, draws off the
 *    main content path)
 *  - prefers-reduced-motion → a single static, already-organized frame
 *  - pauses when offscreen or when the tab is hidden
 *  - node count scales with viewport area; devicePixelRatio capped at 2
 */

interface NodePoint {
  /** Scattered position (fractions of canvas size). */
  sx: number;
  sy: number;
  /** Organized position — where the point settles as structure emerges. */
  ox: number;
  oy: number;
  /** Depth 0 (far) … 1 (near) for parallax + size. */
  z: number;
  /** Drift phase offsets. */
  p1: number;
  p2: number;
  /** Cluster index, or -1 for unaffiliated background stars. */
  cluster: number;
  /** Render size and brightness. */
  r: number;
  bright: number;
}

interface Edge {
  a: number;
  b: number;
  /** Structure threshold at which this edge begins to appear. */
  at: number;
  /** True for the rare gradient-accented edge. */
  accent: boolean;
}

const LINEN = "244, 241, 235";
const LAVENDER = "199, 184, 242";
const QUANTUM = "124, 58, 237";

function buildField(width: number, height: number, reduced: boolean) {
  // Deterministic PRNG so server/client and reduced-motion renders agree.
  let seed = 1_234_567;
  const rand = () => {
    seed = (seed * 1_103_515_245 + 12_345) % 2_147_483_648;
    return seed / 2_147_483_648;
  };

  const area = width * height;
  const count = Math.max(70, Math.min(240, Math.round(area / 9000)));

  // Cluster anchors — the constellations that emerge. Kept away from
  // the horizontal center-band where the headline sits.
  const clusterCount = width < 640 ? 4 : 6;
  const anchors: Array<{ x: number; y: number; spread: number }> = [];
  for (let i = 0; i < clusterCount; i++) {
    const left = i % 2 === 0;
    anchors.push({
      x: left ? 0.06 + rand() * 0.22 : 0.72 + rand() * 0.22,
      y: 0.08 + rand() * 0.84,
      spread: 0.05 + rand() * 0.055,
    });
  }

  const nodes: NodePoint[] = [];
  for (let i = 0; i < count; i++) {
    const inCluster = rand() < 0.62;
    const cluster = inCluster ? Math.floor(rand() * clusterCount) : -1;
    const sx = rand();
    const sy = rand();
    let ox = sx;
    let oy = sy;
    if (cluster >= 0) {
      const a = anchors[cluster];
      const angle = rand() * Math.PI * 2;
      const dist = Math.sqrt(rand()) * a.spread * (width < 640 ? 1.5 : 1);
      ox = a.x + Math.cos(angle) * dist;
      oy = a.y + Math.sin(angle) * dist * (width / Math.max(height, 1));
    }
    const z = 0.25 + rand() * 0.75;
    nodes.push({
      sx,
      sy,
      ox: Math.min(0.98, Math.max(0.02, ox)),
      oy: Math.min(0.98, Math.max(0.02, oy)),
      z,
      p1: rand() * Math.PI * 2,
      p2: rand() * Math.PI * 2,
      cluster,
      r: (0.6 + rand() * 1.3) * (0.5 + z * 0.8),
      bright: 0.25 + rand() * 0.55,
    });
  }

  // Edges connect organized neighbors within a cluster, appearing in
  // sequence as structure grows.
  const edges: Edge[] = [];
  for (let c = 0; c < clusterCount; c++) {
    const members = nodes.map((n, idx) => ({ n, idx })).filter(({ n }) => n.cluster === c);
    for (let i = 0; i < members.length; i++) {
      // Connect each member to its 2 nearest cluster siblings.
      const dists = members
        .map(({ n, idx }) => ({
          idx,
          d: (n.ox - members[i].n.ox) ** 2 + (n.oy - members[i].n.oy) ** 2,
        }))
        .filter(({ idx }) => idx !== members[i].idx)
        .sort((p, q) => p.d - q.d)
        .slice(0, 2);
      for (const { idx } of dists) {
        const a = Math.min(members[i].idx, idx);
        const b = Math.max(members[i].idx, idx);
        if (!edges.some((e) => e.a === a && e.b === b)) {
          edges.push({ a, b, at: 0.25 + rand() * 0.6, accent: rand() < 0.06 });
        }
      }
    }
  }

  // A handful of long-range "bridge" edges between clusters — the
  // relationships conventional search cannot see. They appear last.
  for (let c = 0; c + 1 < clusterCount; c += 2) {
    const from = nodes.findIndex((n) => n.cluster === c);
    const to = nodes.findIndex((n) => n.cluster === c + 1);
    if (from >= 0 && to >= 0) {
      edges.push({ a: from, b: to, at: 0.82, accent: true });
    }
  }

  return { nodes, edges, initialStructure: reduced ? 1 : 0.12 };
}

export function UniverseCanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = reducedMotion.matches;

    let field = buildField(1, 1, reduced);
    let structure = field.initialStructure;
    let width = 0;
    let height = 0;
    let dpr = 1;

    let pointerX = 0.5;
    let pointerY = 0.5;
    let pointerActiveUntil = 0;

    let raf = 0;
    let running = false;
    let inView = true;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      field = buildField(width, height, reduced);
      if (reduced) drawFrame(performance.now());
    };

    const targetStructure = () => {
      // Structure emerges over the first ~1.2 viewports of scroll,
      // starting from a gently pre-organized state.
      const progress = Math.min(1, window.scrollY / (window.innerHeight * 1.2));
      return 0.12 + progress * 0.88;
    };

    function drawFrame(now: number) {
      if (!ctx) return;
      const t = now / 1000;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const { nodes, edges } = field;
      const pointerStrength = reduced
        ? 0
        : Math.max(0, Math.min(1, (pointerActiveUntil - now) / 600));

      // Resolve node screen positions.
      const px: number[] = new Array(nodes.length);
      const py: number[] = new Array(nodes.length);
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const ease = structure * structure * (3 - 2 * structure); // smoothstep
        let x = n.sx + (n.ox - n.sx) * ease;
        let y = n.sy + (n.oy - n.sy) * ease;
        if (!reduced) {
          // Ambient drift, calmer as structure emerges.
          const drift = (1 - ease * 0.75) * 0.008;
          x += Math.sin(t * 0.24 + n.p1) * drift;
          y += Math.cos(t * 0.19 + n.p2) * drift;
          // Depth parallax toward the pointer.
          x += (pointerX - 0.5) * 0.028 * n.z * pointerStrength;
          y += (pointerY - 0.5) * 0.028 * n.z * pointerStrength;
        }
        px[i] = x * width;
        py[i] = y * height;
      }

      // Edges beneath nodes.
      for (const e of edges) {
        if (structure < e.at) continue;
        const reveal = Math.min(1, (structure - e.at) / 0.14);
        const ax = px[e.a];
        const ay = py[e.a];
        const bx = px[e.b];
        const by = py[e.b];
        const alpha = reveal * (e.accent ? 0.34 : 0.16);
        ctx.strokeStyle = e.accent ? `rgba(${QUANTUM}, ${alpha})` : `rgba(${LAVENDER}, ${alpha})`;
        ctx.lineWidth = e.accent ? 1 : 0.6;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        // Draw edges progressively from a to b.
        ctx.lineTo(ax + (bx - ax) * reveal, ay + (by - ay) * reveal);
        ctx.stroke();
      }

      // Nodes.
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const twinkle = reduced ? 1 : 0.82 + 0.18 * Math.sin(t * 0.5 + n.p1 * 3);
        const connected = n.cluster >= 0 && structure > 0.4;
        const alpha = n.bright * twinkle * (connected ? 1 : 0.8);
        ctx.fillStyle = connected
          ? `rgba(${LAVENDER}, ${alpha})`
          : `rgba(${LINEN}, ${alpha * 0.8})`;
        ctx.beginPath();
        ctx.arc(px[i], py[i], n.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const tick = (now: number) => {
      if (!running) return;
      const target = targetStructure();
      structure += (target - structure) * 0.045;
      drawFrame(now);
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || reduced || !inView || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX / window.innerWidth;
      pointerY = event.clientY / window.innerHeight;
      pointerActiveUntil = performance.now() + 2500;
    };

    const onVisibility = () => (document.hidden ? stop() : start());
    const onMotionChange = () => {
      reduced = reducedMotion.matches;
      if (reduced) {
        stop();
        structure = 1;
        drawFrame(performance.now());
      } else {
        start();
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        inView = entries.some((e) => e.isIntersecting);
        if (inView) start();
        else stop();
      },
      { threshold: 0 },
    );

    resize();
    if (reduced) {
      structure = 1;
      drawFrame(performance.now());
    } else {
      start();
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    io.observe(canvas);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    reducedMotion.addEventListener("change", onMotionChange);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
      reducedMotion.removeEventListener("change", onMotionChange);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
