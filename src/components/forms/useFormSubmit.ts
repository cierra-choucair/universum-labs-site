"use client";

import { useCallback, useState } from "react";

export type FormPhase = "idle" | "submitting" | "success" | "error";

interface ApiResponse {
  ok: boolean;
  error?: string;
  fields?: Record<string, string>;
}

/**
 * Shared submission state for all site forms: JSON POST, loading /
 * success / error phases, and per-field server validation errors.
 * Never reports success unless the server confirmed delivery.
 */
export function useFormSubmit(endpoint: string) {
  const [phase, setPhase] = useState<FormPhase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const submit = useCallback(
    async (payload: Record<string, unknown>) => {
      setPhase("submitting");
      setError(null);
      setFieldErrors({});
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        let data: ApiResponse | null = null;
        try {
          data = (await res.json()) as ApiResponse;
        } catch {
          data = null;
        }
        if (res.ok && data?.ok) {
          setPhase("success");
          return true;
        }
        setPhase("error");
        setError(data?.error ?? "Something went wrong. Please try again.");
        if (data?.fields) setFieldErrors(data.fields);
        return false;
      } catch {
        setPhase("error");
        setError("Network error — please check your connection and try again.");
        return false;
      }
    },
    [endpoint],
  );

  const reset = useCallback(() => {
    setPhase("idle");
    setError(null);
    setFieldErrors({});
  }, []);

  return { phase, error, fieldErrors, submit, reset };
}
