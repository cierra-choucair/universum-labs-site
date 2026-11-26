import { afterEach, describe, expect, it, vi } from "vitest";

import { POST } from "./route";

function makeRequest(body: unknown, ip = `198.18.0.${Math.floor(Math.random() * 250)}`) {
  return new Request("http://localhost/api/early-access", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  }) as unknown as Parameters<typeof POST>[0];
}

const validBody = {
  name: "Ada Researcher",
  email: "ada@example.org",
  organization: "Example University",
  audienceType: "Academic",
  intendedUse: "Mapping quantum error-correction evidence for our lab.",
  interests: "Readiness signals",
  feedbackWillingness: true,
  consent: true,
  website: "",
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("POST /api/early-access", () => {
  it("saves a valid application to the Google Sheet", async () => {
    vi.stubEnv("GOOGLE_SHEETS_WEBHOOK_URL", "https://script.google.com/macros/s/TEST/exec");
    vi.stubEnv("GOOGLE_SHEETS_WEBHOOK_SECRET", "s3cret");
    vi.stubEnv("SMTP_HOST", "");
    const fetchSpy = vi.fn(
      async () =>
        new Response(JSON.stringify({ ok: true }), {
          headers: { "Content-Type": "application/json" },
        }),
    );
    vi.stubGlobal("fetch", fetchSpy);

    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(200);
    expect((await res.json()).ok).toBe(true);

    const [, init] = fetchSpy.mock.calls[0] as unknown as [string, RequestInit];
    const sent = JSON.parse(String(init.body));
    expect(sent.form).toBe("early-access");
    expect(sent.subject).toBe("[Universum Labs] Pilot application — Ada Researcher (Academic)");
    expect(sent.replyTo).toBe("ada@example.org");
    expect(sent.fields).toContainEqual(["Audience type", "Academic"]);
    expect(sent.fields).toContainEqual(["Willing to provide feedback", "Yes"]);
  });

  it("fails honestly with 503 when nothing is configured", async () => {
    vi.stubEnv("GOOGLE_SHEETS_WEBHOOK_URL", "");
    vi.stubEnv("SMTP_HOST", "");
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(503);
    const data = await res.json();
    expect(data.ok).toBe(false);
    expect(data.error).toMatch(/not yet connected/i);
  });

  it("reports a failure when the sheet rejects the application", async () => {
    vi.stubEnv("GOOGLE_SHEETS_WEBHOOK_URL", "https://script.google.com/macros/s/TEST/exec");
    vi.stubEnv("GOOGLE_SHEETS_WEBHOOK_SECRET", "wrong");
    vi.stubEnv("SMTP_HOST", "");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ ok: false, error: "unauthorized" }))),
    );
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(503);
    expect((await res.json()).error).toMatch(/could not be sent/i);
  });

  it("returns field errors for an invalid application", async () => {
    const res = await POST(makeRequest({ ...validBody, audienceType: "Alien", consent: false }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.fields).toHaveProperty("audienceType");
    expect(data.fields).toHaveProperty("consent");
  });
});
