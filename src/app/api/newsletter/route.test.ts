import { afterEach, describe, expect, it, vi } from "vitest";

import { POST } from "./route";

function makeRequest(body: unknown, ip = `192.0.2.${Math.floor(Math.random() * 250)}`) {
  return new Request("http://localhost/api/newsletter", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  }) as unknown as Parameters<typeof POST>[0];
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("POST /api/newsletter", () => {
  it("rejects malformed email addresses", async () => {
    const res = await POST(makeRequest({ email: "not-an-email", website: "" }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.ok).toBe(false);
  });

  it("fails honestly when Beehiiv is not configured", async () => {
    vi.stubEnv("BEEHIIV_API_KEY", "");
    vi.stubEnv("BEEHIIV_PUBLICATION_ID", "");
    const res = await POST(makeRequest({ email: "reader@example.org", website: "" }));
    expect(res.status).toBe(503);
    const data = await res.json();
    expect(data.ok).toBe(false);
    expect(data.error).toMatch(/not yet live/i);
  });

  it("subscribes via Beehiiv when configured", async () => {
    vi.stubEnv("BEEHIIV_API_KEY", "test-key");
    vi.stubEnv("BEEHIIV_PUBLICATION_ID", "pub_123");
    const fetchSpy = vi.fn(
      async () =>
        new Response(JSON.stringify({ data: { status: "validating" } }), {
          status: 201,
          headers: { "Content-Type": "application/json" },
        }),
    );
    vi.stubGlobal("fetch", fetchSpy);

    const res = await POST(makeRequest({ email: "reader@example.org", website: "" }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);

    expect(fetchSpy).toHaveBeenCalledOnce();
    const [url, init] = fetchSpy.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.beehiiv.com/v2/publications/pub_123/subscriptions");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer test-key");
    const sent = JSON.parse(String(init.body));
    expect(sent.email).toBe("reader@example.org");
    expect(sent.reactivate_existing).toBe(true);
  });

  it("drops honeypot submissions without calling Beehiiv", async () => {
    vi.stubEnv("BEEHIIV_API_KEY", "test-key");
    vi.stubEnv("BEEHIIV_PUBLICATION_ID", "pub_123");
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    const res = await POST(makeRequest({ email: "bot@example.org", website: "gotcha" }));
    expect(res.status).toBe(200);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
