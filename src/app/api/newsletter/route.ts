import { NextRequest, NextResponse } from "next/server";

import { subscribeToNewsletter } from "@/lib/beehiiv";
import { clientKeyFromHeaders, rateLimit } from "@/lib/rate-limit";
import { fieldErrors, newsletterSchema } from "@/lib/validation";
import { CONTACT_EMAIL } from "@/lib/site";

export async function POST(request: NextRequest) {
  const { allowed } = rateLimit({
    key: `newsletter:${clientKeyFromHeaders(request.headers)}`,
    limit: 6,
    windowMs: 10 * 60 * 1000,
  });
  if (!allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many attempts. Please try again in a few minutes." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: fieldErrors(parsed.error).email ?? "Enter a valid email address." },
      { status: 400 },
    );
  }

  if (parsed.data.website && parsed.data.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const result = await subscribeToNewsletter(parsed.data.email);

  if (!result.ok) {
    const message =
      result.reason === "not_configured"
        ? `Newsletter signup is not yet live. In the meantime, you can reach us at ${CONTACT_EMAIL}.`
        : result.reason === "invalid_email"
          ? "That email address doesn't look deliverable. Please check it and try again."
          : "Signup failed on our side. Please try again in a moment.";
    const status = result.reason === "invalid_email" ? 400 : 503;
    return NextResponse.json({ ok: false, error: message }, { status });
  }

  return NextResponse.json({ ok: true });
}
