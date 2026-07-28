"use client";

import { FormEvent, useId } from "react";

import { useFormSubmit } from "@/components/forms/useFormSubmit";

/**
 * Reusable newsletter signup (Beehiiv, via /api/newsletter). Used in
 * the footer and the closing call to action. Reports honestly when the
 * integration is not yet configured.
 */
export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const { phase, error, submit } = useFormSubmit("/api/newsletter");
  const id = useId();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await submit({
      email: data.get("email"),
      website: data.get("website") ?? "",
    });
  }

  if (phase === "success") {
    return (
      <p role="status" className="text-sm leading-relaxed text-lavender">
        You&rsquo;re on the list. If your inbox asks, please confirm the subscription so we can
        reach you.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative">
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${id}-website`}>Leave this field empty</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <label htmlFor={`${id}-email`} className="mb-2 block text-sm font-medium text-linen">
        {compact ? "Newsletter" : "Join the Universum Labs mailing list"}
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.org"
          className="w-full min-w-0 flex-1 rounded-full border border-lavender-15 bg-indigo-deep/60 px-5 py-2.5 text-sm text-linen placeholder:text-linen-50 focus:border-lavender focus:outline-none"
        />
        <button
          type="submit"
          disabled={phase === "submitting"}
          className="shrink-0 rounded-full border border-lavender-30 px-5 py-2.5 text-sm font-medium text-linen transition hover:border-lavender hover:text-lavender disabled:cursor-not-allowed disabled:opacity-60"
        >
          {phase === "submitting" ? "Joining…" : "Subscribe"}
        </button>
      </div>
      {phase === "error" && error ? (
        <p role="alert" className="mt-2 text-sm text-red-300">
          {error}
        </p>
      ) : (
        <p className="mt-2 text-xs text-linen-50">
          Occasional letters on scientific intelligence. No noise, unsubscribe anytime.
        </p>
      )}
    </form>
  );
}
