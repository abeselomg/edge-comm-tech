"use client";

import { useState } from "react";
import type { Form } from "@/payload-types";

type Field = NonNullable<Form["fields"]>[number];

const INPUT =
  "mt-1 w-full border border-rule bg-paper-2 px-3 py-2 focus:border-gold focus:outline-none";

/** Fields the form builder can produce that we render as a plain input. */
const TEXTLIKE = new Set(["text", "email", "number"]);

export function ContactForm({
  form,
  defaults,
}: {
  form: Form;
  defaults?: Record<string, string>;
}) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string>("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setError("");

    const data = new FormData(event.currentTarget);
    const submissionData = Array.from(data.entries()).map(([field, value]) => ({
      field,
      value: String(value),
    }));

    try {
      const res = await fetch("/api/form-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form: form.id, submissionData }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      setState("sent");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (state === "sent") {
    return (
      <div className="mt-10 border border-gold bg-paper-2 p-6">
        <p className="font-display text-2xl">{form.confirmationMessage ? "Thank you." : "Thank you."}</p>
        <p className="mt-2 text-ink/75">
          Your message has reached us. We reply to enquiries within one business day.
        </p>
      </div>
    );
  }

  return (
    <form className="mt-10 space-y-5" onSubmit={onSubmit}>
      {(form.fields ?? []).map((field: Field) => {
        if (field.blockType === "message") return null;
        const label = ("label" in field && field.label) || field.name;
        const required = "required" in field ? Boolean(field.required) : false;
        const preset = defaults?.[field.name];

        if (field.blockType === "textarea") {
          return (
            <label key={field.id ?? field.name} className="block text-sm">
              {label}
              <textarea
                name={field.name}
                required={required}
                rows={5}
                defaultValue={preset}
                className={INPUT}
              />
            </label>
          );
        }

        if (field.blockType === "select") {
          return (
            <label key={field.id ?? field.name} className="block text-sm">
              {label}
              <select name={field.name} required={required} defaultValue={preset} className={INPUT}>
                <option value="">Select…</option>
                {(field.options ?? []).map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          );
        }

        if (field.blockType === "checkbox") {
          return (
            <label key={field.id ?? field.name} className="flex items-center gap-2 text-sm">
              <input type="checkbox" name={field.name} required={required} />
              {label}
            </label>
          );
        }

        if (TEXTLIKE.has(field.blockType)) {
          return (
            <label key={field.id ?? field.name} className="block text-sm">
              {label}
              <input
                type={field.blockType === "email" ? "email" : field.blockType === "number" ? "number" : "text"}
                name={field.name}
                required={required}
                defaultValue={preset}
                className={INPUT}
              />
            </label>
          );
        }

        return null;
      })}

      {state === "error" ? (
        <p role="alert" className="text-sm text-red-700">
          {error} Please try again, or email us directly.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={state === "sending"}
        className="bg-gold px-5 py-3 font-mono text-xs uppercase tracking-widest text-white hover:bg-gold-2 disabled:opacity-60"
      >
        {state === "sending" ? "Sending…" : form.submitButtonLabel || "Send enquiry"}
      </button>
    </form>
  );
}
