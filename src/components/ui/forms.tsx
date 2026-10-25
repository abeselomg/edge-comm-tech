/*
 * Form parts, ported from design-src/highland/ui.mjs.
 *
 * The controls are disabled, as Highland's were, because nothing is wired to
 * accept a submission yet — the six real forms are Phase 6. A form that looks
 * live and silently discards what someone typed is worse than one that says
 * it is not ready.
 *
 * These live here rather than in the two pages that use them because Phase 6
 * builds six forms and will want the same field shape.
 */

export type FieldType = "text" | "email" | "tel" | "textarea" | "select";

/** The control's box, shared with the live form (components/forms/LiveForm.tsx). */
export const CONTROL_BASE = "mt-1.5 w-full rounded-xl border border-rule bg-paper-2 px-4 py-2.5 text-sm shadow-none";
const CONTROL = `${CONTROL_BASE} text-ink/60`;

export function Field({
  label,
  type = "text",
  hint,
  required,
  options,
  wide,
}: {
  label: string;
  type?: FieldType;
  hint?: string;
  required?: boolean;
  options?: string[];
  wide?: boolean;
}) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <label htmlFor={id} className="font-mono text-[10px] uppercase tracking-widest text-steel">
        {label}
        {required ? <span className="text-lamp"> *</span> : null}
      </label>
      {type === "textarea" ? (
        <textarea id={id} rows={4} className={CONTROL} disabled />
      ) : type === "select" ? (
        <select id={id} className={CONTROL} disabled>
          {(options ?? []).map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : (
        <input id={id} type={type} className={CONTROL} disabled />
      )}
      {hint ? <p className="mt-1 text-[11px] text-steel">{hint}</p> : null}
    </div>
  );
}

/**
 * Why the form above does nothing, and what to do instead.
 *
 * Highland's wording said the fields would be "built against the CMS at
 * implementation" — true of a review build, stale now that the CMS is
 * running, and of no use to a visitor either way. This says the one thing a
 * visitor needs: it is not accepting submissions, here is how to reach Edge
 * meanwhile. The address comes from the CMS rather than being written in.
 */
export function FormNote({ email }: { email?: string }) {
  return (
    <p className="mt-5 flex items-start gap-2 rounded-2xl bg-paper-2 px-5 py-4 text-xs text-steel">
      <svg
        viewBox="0 0 24 24"
        className="mt-0.5 h-4 w-4 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8h.01M11 12h1v4h1" />
      </svg>
      <span>
        This form is not yet accepting submissions.
        {email ? (
          <>
            {" "}
            Please email{" "}
            <a href={`mailto:${email}`} className="underline hover:text-gold">
              {email}
            </a>{" "}
            in the meantime.
          </>
        ) : null}
      </span>
    </p>
  );
}
