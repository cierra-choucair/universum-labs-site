import { z } from "zod";

/**
 * Shared server-side validation schemas for the three public forms.
 * The `website` field on each schema is a honeypot: it is visually
 * hidden in the UI, so any submission that fills it is discarded.
 */

const email = z
  .string()
  .trim()
  .min(3, "Email is required.")
  .max(254, "Email is too long.")
  .email("Enter a valid email address.");

const shortText = (label: string, max = 200) =>
  z.string().trim().min(1, `${label} is required.`).max(max, `${label} is too long.`);

// Accepts any value: routes silently drop submissions where it is
// non-empty, so bots receive an uninformative success response.
const honeypot = z.string().max(500).optional().default("");

export const INQUIRY_TYPES = [
  "Partnership",
  "Strategic advisory",
  "Custom research",
  "Pilot program",
  "Investment",
  "Press",
  "Other",
] as const;

export const contactSchema = z.object({
  name: shortText("Name", 120),
  email,
  organization: z.string().trim().max(200, "Organization is too long.").optional().default(""),
  role: z.string().trim().max(120, "Role is too long.").optional().default(""),
  inquiryType: z.enum(INQUIRY_TYPES, { message: "Choose a type of inquiry." }),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more — at least a sentence.")
    .max(5000, "Message is too long (5000 characters max)."),
  consent: z.literal(true, {
    message: "Consent is required so we can respond to your inquiry.",
  }),
  website: honeypot,
});

export type ContactInput = z.infer<typeof contactSchema>;

export const AUDIENCE_TYPES = ["Individual", "Academic", "Enterprise / Institution"] as const;

export const earlyAccessSchema = z.object({
  name: shortText("Name", 120),
  email,
  organization: z.string().trim().max(200, "Organization is too long.").optional().default(""),
  audienceType: z.enum(AUDIENCE_TYPES, { message: "Choose the option closest to you." }),
  intendedUse: z
    .string()
    .trim()
    .min(10, "Tell us briefly how you intend to use the platform.")
    .max(3000, "Response is too long (3000 characters max)."),
  interests: z
    .string()
    .trim()
    .max(3000, "Response is too long (3000 characters max).")
    .optional()
    .default(""),
  feedbackWillingness: z.boolean().default(false),
  consent: z.literal(true, {
    message: "Consent is required so we can contact you about early access.",
  }),
  website: honeypot,
});

export type EarlyAccessInput = z.infer<typeof earlyAccessSchema>;

export const newsletterSchema = z.object({
  email,
  website: honeypot,
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;

/** Flatten a Zod error into { fieldName: firstMessage }. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}
