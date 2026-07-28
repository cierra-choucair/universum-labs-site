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
import { AUDIENCE_TYPES } from "@/lib/validation";

/**
 * Pilot / early-access application. Distinct from the contact form:
 * captures audience type, intended use, and evaluation interests, and
 * is delivered with a subject line identifying it as a pilot
 * application.
 */
export function EarlyAccessForm() {
  const { phase, error, fieldErrors, submit } = useFormSubmit("/api/early-access");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await submit({
      name: data.get("name"),
      email: data.get("email"),
      organization: data.get("organization") ?? "",
      audienceType: data.get("audienceType"),
      intendedUse: data.get("intendedUse"),
      interests: data.get("interests") ?? "",
      feedbackWillingness: data.get("feedbackWillingness") === "on",
      consent: data.get("consent") === "on",
      website: data.get("website") ?? "",
    });
  }

  if (phase === "success") {
    return (
      <FormStatus
        phase={phase}
        error={null}
        successTitle="Application received."
        successBody="Thank you for your interest in the pilot. The platform is an early prototype, and we are onboarding a small number of early users deliberately — we will be in touch as access opens."
      />
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative space-y-6">
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
      </div>
      <TextField
        label="Organization or affiliation"
        name="organization"
        autoComplete="organization"
        hint="University, lab, company, agency — or independent."
        error={fieldErrors.organization}
      />
      <SelectField
        label="Which best describes you?"
        name="audienceType"
        required
        options={AUDIENCE_TYPES}
        error={fieldErrors.audienceType}
      />
      <TextAreaField
        label="How do you intend to use the platform?"
        name="intendedUse"
        required
        rows={4}
        hint="The research questions, decisions, or explorations you would bring to it."
        error={fieldErrors.intendedUse}
      />
      <TextAreaField
        label="What would you most like to explore or evaluate?"
        name="interests"
        rows={3}
        hint="Optional — topics, technologies, or capabilities you care about."
        error={fieldErrors.interests}
      />
      <CheckboxField
        name="feedbackWillingness"
        label="I am willing to share feedback with the Universum Labs team as the prototype develops."
      />
      <CheckboxField
        name="consent"
        required
        error={fieldErrors.consent}
        label="I agree that Universum Labs may store this application and contact me about early access."
      />
      <FormStatus phase={phase} error={error} successTitle="" successBody="" />
      <SubmitButton
        label="Apply for early access"
        submittingLabel="Submitting…"
        submitting={phase === "submitting"}
      />
    </form>
  );
}
