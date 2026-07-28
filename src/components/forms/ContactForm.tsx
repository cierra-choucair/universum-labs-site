"use client";

import { FormEvent } from "react";

import {
  CheckboxField,
  FormStatus,
  HoneypotField,
  SelectField,
  SubmitButton,
  TextAreaField,
  TextField,
} from "@/components/forms/fields";
import { useFormSubmit } from "@/components/forms/useFormSubmit";
import { INQUIRY_TYPES } from "@/lib/validation";

/**
 * Partnership & contact form. Submits to /api/contact, which delivers
 * to the configured inquiry inbox. All validation is enforced
 * server-side; HTML attributes provide the first, faster layer.
 */
export function ContactForm() {
  const { phase, error, fieldErrors, submit } = useFormSubmit("/api/contact");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    await submit({
      name: data.get("name"),
      email: data.get("email"),
      organization: data.get("organization") ?? "",
      role: data.get("role") ?? "",
      inquiryType: data.get("inquiryType"),
      message: data.get("message"),
      consent: data.get("consent") === "on",
      website: data.get("website") ?? "",
    });
  }

  if (phase === "success") {
    return (
      <FormStatus
        phase={phase}
        error={null}
        successTitle="Thank you — your message is on its way."
        successBody="We read every inquiry and will reply to the address you provided, usually within a few working days."
      />
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate={false} className="relative space-y-6">
      <HoneypotField />
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField label="Name" name="name" required autoComplete="name" error={fieldErrors.name} />
        <TextField
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
          error={fieldErrors.email}
        />
        <TextField
          label="Organization"
          name="organization"
          autoComplete="organization"
          error={fieldErrors.organization}
        />
        <TextField
          label="Role"
          name="role"
          autoComplete="organization-title"
          error={fieldErrors.role}
        />
      </div>
      <SelectField
        label="Type of inquiry"
        name="inquiryType"
        required
        options={INQUIRY_TYPES}
        error={fieldErrors.inquiryType}
      />
      <TextAreaField
        label="How can we help?"
        name="message"
        required
        rows={6}
        hint="A few sentences about your goals, questions, or the problem you are working on."
        error={fieldErrors.message}
      />
      <CheckboxField
        name="consent"
        required
        error={fieldErrors.consent}
        label="I agree that Universum Labs may store this submission and contact me about my inquiry."
      />
      <FormStatus phase={phase} error={error} successTitle="" successBody="" />
      <SubmitButton
        label="Send message"
        submittingLabel="Sending…"
        submitting={phase === "submitting"}
      />
    </form>
  );
}
