import "server-only";

/**
 * Beehiiv newsletter integration (v2 API).
 *
 * Subscriptions are created server-side only; the API key never
 * reaches the browser. When Beehiiv is not configured the caller
 * receives { ok: false, reason: "not_configured" } and the UI reports
 * honestly that signup is not yet available.
 *
 * API reference: POST https://api.beehiiv.com/v2/publications/{id}/subscriptions
 */

export type BeehiivResult =
  | { ok: true; status: "active" | "validating" | "pending" | "invalid" | string }
  | { ok: false; reason: "not_configured" | "invalid_email" | "api_error" };

export function isBeehiivConfigured(): boolean {
  return Boolean(process.env.BEEHIIV_API_KEY && process.env.BEEHIIV_PUBLICATION_ID);
}

export async function subscribeToNewsletter(email: string): Promise<BeehiivResult> {
  if (!isBeehiivConfigured()) {
    console.warn("Newsletter signup skipped: Beehiiv is not configured.");
    return { ok: false, reason: "not_configured" };
  }

  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

  try {
    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          // Re-activating a previously unsubscribed address is treated as
          // success, and an already-active address is not duplicated.
          reactivate_existing: true,
          send_welcome_email: true,
          utm_source: "universumlabs-website",
        }),
      },
    );

    if (res.status === 400 || res.status === 422) {
      return { ok: false, reason: "invalid_email" };
    }

    if (!res.ok) {
      console.error(`Beehiiv API error: ${res.status} ${await res.text()}`);
      return { ok: false, reason: "api_error" };
    }

    const data = await res.json();
    const status = data?.data?.status ?? "active";
    if (status === "invalid") {
      return { ok: false, reason: "invalid_email" };
    }
    return { ok: true, status };
  } catch (error) {
    console.error("Beehiiv API unreachable:", error);
    return { ok: false, reason: "api_error" };
  }
}
