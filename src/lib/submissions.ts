import "server-only";

import { formatEmailBody, isEmailConfigured, sendInquiryEmail } from "@/lib/email";

/**
 * Form submission delivery.
 *
 * Each submission is sent to every configured destination:
 *  - a Google Sheet, via the Apps Script receiver in
 *    docs/beta-signups-apps-script.gs (appends a row and emails the
 *    sheet owner), and/or
 *  - SMTP email (src/lib/email.ts).
 *
 * The visitor is told their submission was received only if at least
 * one destination confirmed it; if none is configured or all fail,
 * the route reports an honest error.
 */

export type FormKind = "early-access" | "contact";

export interface Submission {
  form: FormKind;
  subject: string;
  replyTo: string;
  fields: Array<[label: string, value: string]>;
}

export type DeliveryResult = { ok: true } | { ok: false; reason: "not_configured" | "failed" };

const SHEETS_TIMEOUT_MS = 15_000;

/**
 * Values pasted into a hosting dashboard often pick up surrounding
 * whitespace or the quote marks from the script line they were copied
 * from; either makes the shared secret silently mismatch.
 */
function cleanEnv(value: string | undefined): string {
  return (value ?? "")
    .trim()
    .replace(/^(["'])(.*)\1$/, "$2")
    .trim();
}

export function isSheetsConfigured(): boolean {
  return Boolean(
    cleanEnv(process.env.GOOGLE_SHEETS_WEBHOOK_URL) &&
    cleanEnv(process.env.GOOGLE_SHEETS_WEBHOOK_SECRET),
  );
}

export async function sendToGoogleSheets(submission: Submission): Promise<boolean> {
  const url = cleanEnv(process.env.GOOGLE_SHEETS_WEBHOOK_URL);
  const secret = cleanEnv(process.env.GOOGLE_SHEETS_WEBHOOK_SECRET);
  if (!url || !secret) return false;

  try {
    // Apps Script answers a POST with a 302 to the script's output;
    // fetch follows it (as a GET, per spec) and returns the JSON body.
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        form: submission.form,
        subject: submission.subject,
        replyTo: submission.replyTo,
        fields: submission.fields,
        submittedAt: new Date().toISOString(),
      }),
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(SHEETS_TIMEOUT_MS),
    });

    if (!res.ok) {
      console.error(`Google Sheets receiver returned HTTP ${res.status}.`);
      return false;
    }

    // A misconfigured or crashed script returns an HTML page with HTTP
    // 200, so success requires the script's own { ok: true } reply.
    const text = await res.text();
    let data: { ok?: unknown; error?: unknown } | null = null;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("Google Sheets receiver returned a non-JSON response — check the deployment.");
      return false;
    }
    if (data?.ok === true) return true;
    console.error(`Google Sheets receiver rejected the submission: ${String(data?.error)}`);
    return false;
  } catch (error) {
    console.error("Google Sheets receiver unreachable:", error);
    return false;
  }
}

export async function deliverSubmission(submission: Submission): Promise<DeliveryResult> {
  const deliveries: Array<Promise<boolean>> = [];

  if (isSheetsConfigured()) {
    deliveries.push(sendToGoogleSheets(submission));
  }
  if (isEmailConfigured()) {
    deliveries.push(
      sendInquiryEmail({
        subject: submission.subject,
        replyTo: submission.replyTo,
        text: formatEmailBody(submission.fields),
      }).then((result) => result.ok),
    );
  }

  if (deliveries.length === 0) {
    console.warn("Form submission dropped: no delivery destination is configured.");
    return { ok: false, reason: "not_configured" };
  }

  const results = await Promise.all(deliveries);
  return results.some(Boolean) ? { ok: true } : { ok: false, reason: "failed" };
}
