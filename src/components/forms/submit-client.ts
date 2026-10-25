import type { RenderField } from "@/lib/forms/read";

/*
 * The browser half of a form submission, with no React in it so it can be
 * tested without a DOM.
 *
 * The server (src/lib/forms/submit.ts) is the enforcement; this only spares a
 * visitor a round trip for the mistakes that are obvious. The messages match
 * the server's wording so a field reads the same whichever side caught it.
 */

export type Outcome =
  | { kind: "success"; message?: string }
  | { kind: "invalid"; errors: Record<string, string> }
  | { kind: "limited"; retryAfterSec: number }
  | { kind: "failed"; message: string };

export type FormState =
  | { phase: "idle" }
  | { phase: "pending" }
  | { phase: "success"; message: string }
  | { phase: "invalid"; errors: Record<string, string> }
  | { phase: "limited"; retryAfterSec: number }
  | { phase: "failed"; message: string };

const EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;
const FAILED = "Your submission could not be sent. Please try again later.";

/** Required fields, consent and the email shape: what is obvious without the server. */
export function validateClient(fields: RenderField[], consentWording: string, data: FormData): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const f of fields) {
    const value = data.get(f.name);
    if (f.type === "upload") {
      const empty = !(value instanceof File) || (value.size === 0 && value.name === "");
      if (f.required && empty) errors[f.name] = `${f.label} is required.`;
      continue;
    }
    if (f.type === "checkbox") {
      if (f.required && !value) errors[f.name] = `${f.label} is required.`;
      continue;
    }
    const text = typeof value === "string" ? value.trim() : "";
    if (!text) {
      if (f.required) errors[f.name] = `${f.label} is required.`;
    } else if (f.type === "email" && !EMAIL.test(text)) {
      errors[f.name] = `${f.label}: enter a valid email address.`;
    }
  }
  if (!data.get("consent")) errors.consent = `Please confirm: ${consentWording}`;
  return errors;
}

type FetchLike = (input: string, init: { method: "POST"; body: FormData }) => Promise<Response>;

/** Posts the form and sorts the answer into the four things the form can do next. */
export async function sendForm(action: string, body: FormData, fetchImpl: FetchLike = fetch): Promise<Outcome> {
  let res: Response;
  try {
    res = await fetchImpl(action, { method: "POST", body });
  } catch {
    return { kind: "failed", message: FAILED };
  }
  let payload: { ok?: boolean; message?: unknown; errors?: unknown } | null = null;
  try {
    payload = await res.json();
  } catch {
    payload = null;
  }
  const errors =
    payload && payload.errors && typeof payload.errors === "object"
      ? (payload.errors as Record<string, string>)
      : null;

  if (res.status === 429) {
    const seconds = Number(res.headers.get("retry-after"));
    return { kind: "limited", retryAfterSec: Number.isFinite(seconds) && seconds > 0 ? seconds : 60 };
  }
  if (res.status === 422 && errors) return { kind: "invalid", errors };
  if (res.ok && payload?.ok) {
    return { kind: "success", ...(typeof payload.message === "string" ? { message: payload.message } : {}) };
  }
  return { kind: "failed", message: errors?._form ?? FAILED };
}

/**
 * One submission at a time. The flag is set before anything is awaited, so a
 * second click in the same tick cannot slip past a button that React has not
 * yet re-rendered as disabled.
 */
export function createSubmitter(run: (data: FormData) => Promise<Outcome>, onChange: (state: FormState) => void) {
  let pending = false;
  return async (data: FormData): Promise<void> => {
    if (pending) return;
    pending = true;
    onChange({ phase: "pending" });
    let outcome: Outcome;
    try {
      outcome = await run(data);
    } catch {
      outcome = { kind: "failed", message: FAILED };
    }
    pending = false;
    switch (outcome.kind) {
      case "success":
        onChange({ phase: "success", message: outcome.message ?? "" });
        break;
      case "invalid":
        onChange({ phase: "invalid", errors: outcome.errors });
        break;
      case "limited":
        onChange({ phase: "limited", retryAfterSec: outcome.retryAfterSec });
        break;
      default:
        onChange({ phase: "failed", message: outcome.message });
    }
  };
}
