import { NextRequest, NextResponse } from "next/server";

import { clientKeyFromHeaders, rateLimit } from "@/lib/rate-limit";
import { CONTACT_EMAIL } from "@/lib/site";
import { deliverSubmission } from "@/lib/submissions";
import { earlyAccessSchema, fieldErrors } from "@/lib/validation";

// Headroom for a cold-started Google Apps Script receiver.
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const { allowed } = rateLimit({
    key: `early-access:${clientKeyFromHeaders(request.headers)}`,
    limit: 5,
    windowMs: 10 * 60 * 1000,
  });
  if (!allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions. Please try again in a few minutes." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  const parsed = earlyAccessSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Please correct the highlighted fields.",
        fields: fieldErrors(parsed.error),
      },
      { status: 400 },
    );
  }

  if (parsed.data.website && parsed.data.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const d = parsed.data;
  const result = await deliverSubmission({
    form: "early-access",
    subject: `[Universum Labs] Pilot application — ${d.name} (${d.audienceType})`,
    replyTo: d.email,
    fields: [
      ["Name", d.name],
      ["Email", d.email],
      ["Organization / affiliation", d.organization],
      ["Audience type", d.audienceType],
      ["Intended use", d.intendedUse],
      ["Hopes to explore or evaluate", d.interests],
      ["Willing to provide feedback", d.feedbackWillingness ? "Yes" : "No"],
    ],
  });

  if (!result.ok) {
    const message =
      result.reason === "not_configured"
        ? `Online applications are not yet connected. Please email us directly at ${CONTACT_EMAIL}.`
        : `Your application could not be sent right now. Please try again, or email us directly at ${CONTACT_EMAIL}.`;
    return NextResponse.json({ ok: false, error: message }, { status: 503 });
  }

  return NextResponse.json({ ok: true });
}
