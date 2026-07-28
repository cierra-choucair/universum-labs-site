import { describe, expect, it } from "vitest";

import { clientKeyFromHeaders, rateLimit } from "./rate-limit";

describe("rateLimit", () => {
  it("allows requests under the limit and blocks over it", () => {
    const key = `test-${Math.random()}`;
    const base = 1_000_000;
    for (let i = 0; i < 3; i++) {
      expect(rateLimit({ key, limit: 3, windowMs: 60_000, now: base + i }).allowed).toBe(true);
    }
    expect(rateLimit({ key, limit: 3, windowMs: 60_000, now: base + 10 }).allowed).toBe(false);
  });

  it("slides the window so old requests expire", () => {
    const key = `test-${Math.random()}`;
    const base = 2_000_000;
    for (let i = 0; i < 3; i++) {
      rateLimit({ key, limit: 3, windowMs: 60_000, now: base });
    }
    expect(rateLimit({ key, limit: 3, windowMs: 60_000, now: base + 1 }).allowed).toBe(false);
    // After the window passes, requests are allowed again.
    expect(rateLimit({ key, limit: 3, windowMs: 60_000, now: base + 61_000 }).allowed).toBe(true);
  });

  it("tracks keys independently", () => {
    const now = 3_000_000;
    expect(rateLimit({ key: "a", limit: 1, windowMs: 60_000, now }).allowed).toBe(true);
    expect(rateLimit({ key: "b", limit: 1, windowMs: 60_000, now }).allowed).toBe(true);
    expect(rateLimit({ key: "a", limit: 1, windowMs: 60_000, now: now + 1 }).allowed).toBe(false);
  });
});

describe("clientKeyFromHeaders", () => {
  it("uses the first x-forwarded-for entry", () => {
    const headers = new Headers({ "x-forwarded-for": "203.0.113.9, 10.0.0.1" });
    expect(clientKeyFromHeaders(headers)).toBe("203.0.113.9");
  });

  it("falls back to x-real-ip and then unknown", () => {
    expect(clientKeyFromHeaders(new Headers({ "x-real-ip": "203.0.113.7" }))).toBe("203.0.113.7");
    expect(clientKeyFromHeaders(new Headers())).toBe("unknown");
  });
});
