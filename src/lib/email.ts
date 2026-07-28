import "server-only";

import nodemailer from "nodemailer";

/**
 * Inquiry email delivery.
 *
 * Uses standard SMTP credentials so any transactional provider works.
 * When the transport is not configured, callers receive
 * { ok: false, reason: "not_configured" } and surface an honest error —
 * the site never pretends a message was sent.
 */

export type SendResult = { ok: true } | { ok: false; reason: "not_configured" | "send_failed" };

export function isEmailConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    process.env.INQUIRY_TO_EMAIL,
  );
}

export async function sendInquiryEmail({
  subject,
  replyTo,
  text,
}: {
  subject: string;
  replyTo: string;
  text: string;
}): Promise<SendResult> {
  if (!isEmailConfigured()) {
    console.warn("Inquiry email skipped: SMTP transport is not configured.");
    return { ok: false, reason: "not_configured" };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
      to: process.env.INQUIRY_TO_EMAIL,
      replyTo,
      subject,
      text,
    });
    return { ok: true };
  } catch (error) {
    console.error("Inquiry email failed to send:", error);
    return { ok: false, reason: "send_failed" };
  }
}

/** Render label/value pairs as a readable plain-text email body. */
export function formatEmailBody(fields: Array<[label: string, value: string]>): string {
  return fields
    .filter(([, value]) => value.trim().length > 0)
    .map(([label, value]) => `${label}:\n${value.trim()}`)
    .join("\n\n");
}
