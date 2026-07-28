/**
 * Minimal in-memory sliding-window rate limiter for form endpoints.
 *
 * Suitable for a single-instance deployment; on serverless platforms
 * each instance keeps its own window, which still blunts bursts from a
 * single client. Swap for a shared store (Upstash, Redis) if the site
 * ever runs at a scale where that matters.
 */

interface Window {
  timestamps: number[];
}

const buckets = new Map<string, Window>();

const MAX_BUCKETS = 10_000;

export function rateLimit({
  key,
  limit,
  windowMs,
  now = Date.now(),
}: {
  key: string;
  limit: number;
  windowMs: number;
  now?: number;
}): { allowed: boolean; remaining: number } {
  // Opportunistic cleanup so the map cannot grow without bound.
  if (buckets.size > MAX_BUCKETS) {
    for (const [k, w] of buckets) {
      if (w.timestamps.every((t) => now - t > windowMs)) buckets.delete(k);
      if (buckets.size <= MAX_BUCKETS / 2) break;
    }
  }

  const bucket = buckets.get(key) ?? { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((t) => now - t < windowMs);

  if (bucket.timestamps.length >= limit) {
    buckets.set(key, bucket);
    return { allowed: false, remaining: 0 };
  }

  bucket.timestamps.push(now);
  buckets.set(key, bucket);
  return { allowed: true, remaining: limit - bucket.timestamps.length };
}

/** Derive a stable client key from proxy headers, for rate limiting only. */
export function clientKeyFromHeaders(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}
