import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * SITE_URL is resolved at module load, so each case re-imports the
 * module with a fresh environment.
 */
async function loadSiteUrl(): Promise<string> {
  vi.resetModules();
  const mod = await import("./site");
  return mod.SITE_URL;
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("SITE_URL resolution", () => {
  it("prefers NEXT_PUBLIC_SITE_URL and strips a trailing slash", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.universumlabs.com/");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "ignored.vercel.app");
    expect(await loadSiteUrl()).toBe("https://www.universumlabs.com");
  });

  it("falls back to the Vercel production domain when no site URL is set", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "universum-labs.vercel.app");
    expect(await loadSiteUrl()).toBe("https://universum-labs.vercel.app");
  });

  it("defaults to localhost with neither configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "");
    expect(await loadSiteUrl()).toBe("http://localhost:3000");
  });
});
