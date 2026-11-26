"use client";

import { ReactNode, useEffect, useId, useRef } from "react";

/**
 * Accessible form primitives shared by every site form: explicit
 * labels, described-by error wiring, and consistent dark-surface
 * styling. Field errors are announced via role="alert".
 */

const inputCls =
  "w-full rounded-lg border border-lavender-15 bg-indigo-deep/60 px-4 py-3 text-base text-linen placeholder:text-linen-50 focus:border-lavender focus:outline-none aria-[invalid=true]:border-red-400/70";

function FieldShell({
  id,
  label,
  required,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-linen">
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-1 text-lavender">
            *
          </span>
        ) : null}
      </label>
      {children}
      {hint && !error ? <p className="mt-1.5 text-xs text-linen-50">{hint}</p> : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextField({
  label,
  name,
  type = "text",
  required,
  error,
  hint,
  autoComplete,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: "text" | "email";
  required?: boolean;
  error?: string;
  hint?: string;
  autoComplete?: string;
  defaultValue?: string;
}) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} required={required} error={error} hint={hint}>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={inputCls}
      />
    </FieldShell>
  );
}

export function TextAreaField({
  label,
  name,
  required,
  error,
  hint,
  rows = 5,
}: {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  hint?: string;
  rows?: number;
}) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} required={required} error={error} hint={hint}>
      <textarea
        id={id}
        name={name}
        required={required}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${inputCls} resize-y`}
      />
    </FieldShell>
  );
}

export function SelectField({
  label,
  name,
  options,
  required,
  error,
  placeholder = "Select…",
}: {
  label: string;
  name: string;
  options: readonly string[];
  required?: boolean;
  error?: string;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} required={required} error={error}>
      <select
        id={id}
        name={name}
        required={required}
        defaultValue=""
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${inputCls} appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%228%22%3E%3Cpath%20fill%3D%22%23C7B8F2%22%20d%3D%22M6%208L0%200h12z%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_1rem_center] bg-no-repeat pr-10`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export function CheckboxField({
  label,
  name,
  required,
  error,
}: {
  label: ReactNode;
  name: string;
  required?: boolean;
  error?: string;
}) {
  const id = useId();
  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          id={id}
          name={name}
          type="checkbox"
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-1 h-4 w-4 shrink-0 accent-[#6B21E8]"
        />
        <label htmlFor={id} className="text-sm leading-relaxed text-linen-70">
          {label}
        </label>
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Honeypot field: visually hidden and skipped by keyboard/AT users, but
 * typically filled by naive bots. Submissions with a value are dropped
 * server-side.
 */
export function HoneypotField() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label htmlFor="website-field">Leave this field empty</label>
      <input id="website-field" name="website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

/**
 * The success message replaces a much taller form, so the visitor
 * would otherwise be left scrolled past it. Move them to it and focus
 * it so assistive technology announces the confirmation.
 */
function SuccessMessage({ title, body }: { title: string; body: string }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    node.focus({ preventScroll: true });
    node.scrollIntoView({ block: "center", behavior: reduced ? "auto" : "smooth" });
  }, []);

  return (
    <div
      ref={ref}
      role="status"
      tabIndex={-1}
      className="rounded-lg border border-lavender-30 bg-indigo-deep/70 p-5 text-linen focus:outline-none"
    >
      <p className="font-display text-xl">{title}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-linen-70">{body}</p>
    </div>
  );
}

export function FormStatus({
  phase,
  error,
  successTitle,
  successBody,
}: {
  phase: "idle" | "submitting" | "success" | "error";
  error: string | null;
  successTitle: string;
  successBody: string;
}) {
  if (phase === "success") {
    return <SuccessMessage title={successTitle} body={successBody} />;
  }
  if (phase === "error" && error) {
    return (
      <div role="alert" className="rounded-lg border border-red-400/40 bg-red-950/30 p-4">
        <p className="text-sm leading-relaxed text-red-200">{error}</p>
      </div>
    );
  }
  return null;
}

export function SubmitButton({
  label,
  submittingLabel,
  submitting,
}: {
  label: string;
  submittingLabel: string;
  submitting: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={submitting}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(100deg,#6B21E8,#3B0FCC)] px-7 py-3 text-sm font-medium text-linen transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {submitting ? (
        <>
          <span
            aria-hidden="true"
            className="h-3.5 w-3.5 animate-spin rounded-full border border-linen/40 border-t-linen"
          />
          {submittingLabel}
        </>
      ) : (
        label
      )}
    </button>
  );
}
