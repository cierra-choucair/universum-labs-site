import { describe, expect, it } from "vitest";

import { contactSchema, earlyAccessSchema, fieldErrors, newsletterSchema } from "./validation";

const validContact = {
  name: "Ada Researcher",
  email: "ada@example.org",
  organization: "Example University",
  role: "Professor",
  inquiryType: "Partnership",
  message: "We would like to discuss a research pilot with your team.",
  consent: true,
  website: "",
};

describe("contactSchema", () => {
  it("accepts a valid submission", () => {
    const result = contactSchema.safeParse(validContact);
    expect(result.success).toBe(true);
  });

  it("requires consent", () => {
    const result = contactSchema.safeParse({ ...validContact, consent: false });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(fieldErrors(result.error)).toHaveProperty("consent");
    }
  });

  it("rejects invalid email addresses", () => {
    const result = contactSchema.safeParse({ ...validContact, email: "not-an-email" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(fieldErrors(result.error).email).toMatch(/valid email/i);
    }
  });

  it("rejects unknown inquiry types", () => {
    const result = contactSchema.safeParse({ ...validContact, inquiryType: "Spam" });
    expect(result.success).toBe(false);
  });

  it("rejects messages that are too short", () => {
    const result = contactSchema.safeParse({ ...validContact, message: "hi" });
    expect(result.success).toBe(false);
  });

  it("accepts a filled honeypot at the schema layer (routes drop it silently)", () => {
    const result = contactSchema.safeParse({ ...validContact, website: "https://spam.example" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.website).toBe("https://spam.example");
  });

  it("allows optional organization and role to be empty", () => {
    const result = contactSchema.safeParse({ ...validContact, organization: "", role: "" });
    expect(result.success).toBe(true);
  });
});

describe("earlyAccessSchema", () => {
  const valid = {
    name: "Sam Scholar",
    email: "sam@example.org",
    organization: "Independent",
    audienceType: "Individual",
    intendedUse: "Exploring quantum-error-correction literature across fields.",
    interests: "",
    feedbackWillingness: true,
    consent: true,
    website: "",
  };

  it("accepts a valid application", () => {
    expect(earlyAccessSchema.safeParse(valid).success).toBe(true);
  });

  it("requires an audience type from the fixed list", () => {
    expect(earlyAccessSchema.safeParse({ ...valid, audienceType: "Alien" }).success).toBe(false);
  });

  it("requires an intended use", () => {
    expect(earlyAccessSchema.safeParse({ ...valid, intendedUse: "" }).success).toBe(false);
  });

  it("defaults feedbackWillingness to false when omitted", () => {
    const rest: Record<string, unknown> = { ...valid };
    delete rest.feedbackWillingness;
    const result = earlyAccessSchema.safeParse(rest);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.feedbackWillingness).toBe(false);
  });
});

describe("newsletterSchema", () => {
  it("accepts a plain email", () => {
    expect(newsletterSchema.safeParse({ email: "reader@example.org", website: "" }).success).toBe(
      true,
    );
  });

  it("trims surrounding whitespace", () => {
    const result = newsletterSchema.safeParse({ email: "  reader@example.org  ", website: "" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.email).toBe("reader@example.org");
  });

  it("rejects malformed emails", () => {
    expect(newsletterSchema.safeParse({ email: "reader@", website: "" }).success).toBe(false);
  });
});
