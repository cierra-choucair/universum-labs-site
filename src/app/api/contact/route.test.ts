import { afterEach, describe, expect, it, vi } from "vitest";

import { POST } from "./route";

function makeRequest(body: unknown, ip = `203.0.113.${Math.floor(Math.random() * 250)}`) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
    // The handler only uses .json() and .headers, both present on Request.
  }) as unknown as Parameters<typeof POST>[0];
}

const validBody = {
  name: "Ada Researcher",
  email: "ada@example.org",
  organization: "Example University",
  role: "Professor",
  inquiryType: "Partnership",
  message: "We would like to discuss a research pilot with your team.",
  consent: true,
  website: "",
};

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("POST /api/contact", () => {
  it("returns field errors for an invalid submission", async () => {
    const res = await POST(makeRequest({ ...validBody, email: "nope", consent: false }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.ok).toBe(false);
    expect(data.fields).toHaveProperty("email");
    expect(data.fields).toHaveProperty("consent");
  });

  it("fails honestly with 503 when email is not configured", async () => {
    vi.stubEnv("SMTP_HOST", "");
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(503);
    const data = await res.json();
    expect(data.ok).toBe(false);
    expect(data.error).toMatch(/not yet connected/i);
    // The honest failure points people at the real inbox.
    expect(data.error).toContain("hello@universumlabs.com");
  });

  it("silently drops honeypot submissions without sending email", async () => {
    const res = await POST(makeRequest({ ...validBody, website: "https://spam.example" }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
  });

  it("rejects malformed JSON", async () => {
    const req = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": "203.0.113.250" },
      body: "{not json",
    }) as unknown as Parameters<typeof POST>[0];
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("rate limits repeated submissions from one client", async () => {
    const ip = "198.51.100.77";
    let last: Response | undefined;
    for (let i = 0; i < 6; i++) {
      last = await POST(makeRequest(validBody, ip));
    }
    expect(last?.status).toBe(429);
  });
});
