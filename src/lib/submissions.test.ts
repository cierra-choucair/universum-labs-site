import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./email", () => ({
  isEmailConfigured: vi.fn(() => false),
  sendInquiryEmail: vi.fn(async () => ({ ok: true })),
  formatEmailBody: (fields: Array<[string, string]>) =>
    fields.map(([label, value]) => `${label}: ${value}`).join("\n"),
}));

import { isEmailConfigured, sendInquiryEmail } from "./email";
import { deliverSubmission, isSheetsConfigured, sendToGoogleSheets } from "./submissions";

const SUBMISSION = {
  form: "early-access" as const,
  subject: "[Universum Labs] Pilot application — Ada (Academic)",
  replyTo: "ada@example.org",
  fields: [
    ["Name", "Ada"],
    ["Email", "ada@example.org"],
  ] as Array<[string, string]>,
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

beforeEach(() => {
  vi.stubEnv("GOOGLE_SHEETS_WEBHOOK_URL", "https://script.google.com/macros/s/TEST/exec");
  vi.stubEnv("GOOGLE_SHEETS_WEBHOOK_SECRET", "s3cret");
  vi.mocked(isEmailConfigured).mockReturnValue(false);
  vi.mocked(sendInquiryEmail).mockResolvedValue({ ok: true });
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("sendToGoogleSheets", () => {
  it("posts the secret, form, and fields, and succeeds on { ok: true }", async () => {
    const fetchSpy = vi.fn(async () => jsonResponse({ ok: true }));
    vi.stubGlobal("fetch", fetchSpy);

    await expect(sendToGoogleSheets(SUBMISSION)).resolves.toBe(true);

    const [url, init] = fetchSpy.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://script.google.com/macros/s/TEST/exec");
    expect(init.method).toBe("POST");
    const sent = JSON.parse(String(init.body));
    expect(sent.secret).toBe("s3cret");
    expect(sent.form).toBe("early-access");
    expect(sent.replyTo).toBe("ada@example.org");
    expect(sent.fields).toEqual(SUBMISSION.fields);
    expect(typeof sent.submittedAt).toBe("string");
  });

  it("fails when the script rejects the submission", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => jsonResponse({ ok: false, error: "unauthorized" })),
    );
    await expect(sendToGoogleSheets(SUBMISSION)).resolves.toBe(false);
  });

  it("fails on a non-JSON page (misconfigured or crashed deployment)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("<html>Script function not found</html>", { status: 200 })),
    );
    await expect(sendToGoogleSheets(SUBMISSION)).resolves.toBe(false);
  });

  it("fails on HTTP errors and network failures", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("nope", { status: 500 })),
    );
    await expect(sendToGoogleSheets(SUBMISSION)).resolves.toBe(false);

    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("network down");
      }),
    );
    await expect(sendToGoogleSheets(SUBMISSION)).resolves.toBe(false);
  });

  it("strips quotes and whitespace pasted around the secret and URL", async () => {
    vi.stubEnv("GOOGLE_SHEETS_WEBHOOK_URL", "  https://script.google.com/macros/s/TEST/exec\n");
    vi.stubEnv("GOOGLE_SHEETS_WEBHOOK_SECRET", ' "s3cret" ');
    const fetchSpy = vi.fn(async () => jsonResponse({ ok: true }));
    vi.stubGlobal("fetch", fetchSpy);

    await expect(sendToGoogleSheets(SUBMISSION)).resolves.toBe(true);
    const [url, init] = fetchSpy.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://script.google.com/macros/s/TEST/exec");
    expect(JSON.parse(String(init.body)).secret).toBe("s3cret");
  });

  it("requires both the URL and the secret", () => {
    vi.stubEnv("GOOGLE_SHEETS_WEBHOOK_SECRET", "");
    expect(isSheetsConfigured()).toBe(false);
  });
});

describe("deliverSubmission", () => {
  it("reports not_configured when no destination is set up", async () => {
    vi.stubEnv("GOOGLE_SHEETS_WEBHOOK_URL", "");
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    await expect(deliverSubmission(SUBMISSION)).resolves.toEqual({
      ok: false,
      reason: "not_configured",
    });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("succeeds through Google Sheets alone", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => jsonResponse({ ok: true })),
    );
    await expect(deliverSubmission(SUBMISSION)).resolves.toEqual({ ok: true });
    expect(sendInquiryEmail).not.toHaveBeenCalled();
  });

  it("succeeds if the sheet saves it even when SMTP fails", async () => {
    vi.mocked(isEmailConfigured).mockReturnValue(true);
    vi.mocked(sendInquiryEmail).mockResolvedValue({ ok: false, reason: "send_failed" });
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => jsonResponse({ ok: true })),
    );
    await expect(deliverSubmission(SUBMISSION)).resolves.toEqual({ ok: true });
  });

  it("succeeds through SMTP when the sheet is down", async () => {
    vi.mocked(isEmailConfigured).mockReturnValue(true);
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("down", { status: 503 })),
    );
    await expect(deliverSubmission(SUBMISSION)).resolves.toEqual({ ok: true });
  });

  it("fails honestly when every destination fails", async () => {
    vi.mocked(isEmailConfigured).mockReturnValue(true);
    vi.mocked(sendInquiryEmail).mockResolvedValue({ ok: false, reason: "send_failed" });
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => jsonResponse({ ok: false, error: "server_error" })),
    );
    await expect(deliverSubmission(SUBMISSION)).resolves.toEqual({ ok: false, reason: "failed" });
  });
});
