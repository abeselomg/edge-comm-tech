"use client";

import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type RefObject } from "react";
import { CONTROL_BASE } from "@/components/ui/forms";
import { HONEYPOT_FIELD } from "@/lib/forms/constants";
import { confirmationText, consentWording, renderFields, type RenderField } from "@/lib/forms/read";
import type { FormDoc } from "@/lib/forms/validate";
import { createSubmitter, describeFile, sendForm, validateClient, type FormState } from "./submit-client";

/*
 * A form that submits for real.
 *
 * It draws whatever the stored `forms` document holds, in stored order, so an
 * editor adding a field in the admin changes the page with no deploy. Hint,
 * group, maxLength and the consent wording are not stored; read.ts joins them
 * back by field name.
 *
 * Plain controls, native FormData and fetch. The browser's own validation
 * bubbles are off (noValidate) so errors read the same whether the page or the
 * server found them, and so the first one can be focused.
 */

const ERROR_TEXT = "text-[#b3261e]";
const INVALID_BORDER = "border-[#b3261e]";
const CONTROL = `${CONTROL_BASE} text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold`;

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

type Segment =
  | { kind: "field"; field: RenderField }
  | { kind: "group"; legend: string; fields: RenderField[] };

/** Consecutive checkboxes that share a group become one fieldset; everything else stands alone. */
function segments(fields: RenderField[]): Segment[] {
  const out: Segment[] = [];
  for (const field of fields) {
    const last = out[out.length - 1];
    if (field.type === "checkbox" && field.group) {
      if (last?.kind === "group" && last.legend === field.group) last.fields.push(field);
      else out.push({ kind: "group", legend: field.group, fields: [field] });
    } else {
      out.push({ kind: "field", field });
    }
  }
  return out;
}

/** The file input, with the chosen file's name and size shown beneath it. */
function UploadInput({
  common,
  className,
}: {
  common: Record<string, unknown> & { id: string };
  className: string;
}) {
  const [chosen, setChosen] = useState("");
  return (
    <>
      <input
        {...common}
        type="file"
        accept=".pdf,.docx"
        className={className}
        onChange={(e) => {
          const file = e.currentTarget.files?.[0];
          setChosen(file ? describeFile(file) : "");
        }}
      />
      <p className="mt-1 text-[11px] text-ink/75" aria-live="polite">
        {chosen}
      </p>
    </>
  );
}

function Fieldline({ field, id, error }: { field: RenderField; id: string; error?: string }) {
  const errId = `${id}-error`;
  const common = {
    id,
    name: field.name,
    required: field.required || undefined,
    ...(field.maxLength ? { maxLength: field.maxLength } : {}),
    ...(error ? { "aria-invalid": true as const, "aria-describedby": errId } : {}),
  };
  const cls = `${CONTROL} ${error ? INVALID_BORDER : ""}`.trim();
  return (
    <div className={field.wide ? "sm:col-span-2" : undefined}>
      <label htmlFor={id} className="font-mono text-[10px] uppercase tracking-widest text-steel">
        {field.label}
        {field.required ? <span className="text-lamp"> *</span> : null}
      </label>
      {field.type === "textarea" ? (
        <textarea {...common} rows={4} className={cls} />
      ) : field.type === "select" ? (
        <select {...common} defaultValue={field.placeholder ? "" : undefined} className={cls}>
          {(field.options ?? []).map((o, i) =>
            i === 0 && field.placeholder ? (
              <option key={o} value="">
                {o}
              </option>
            ) : (
              <option key={o}>{o}</option>
            ),
          )}
        </select>
      ) : field.type === "upload" ? (
        <UploadInput common={common} className={cls} />
      ) : (
        <input {...common} type={field.type === "number" ? "number" : field.type} className={cls} />
      )}
      {field.hint ? <p className="mt-1 text-[11px] text-steel">{field.hint}</p> : null}
      {error ? (
        <p id={errId} role="alert" className={`mt-1 text-xs ${ERROR_TEXT}`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

function Checkbox({ field, id, error, boxed }: { field: RenderField; id: string; error?: string; boxed?: boolean }) {
  const errId = `${id}-error`;
  return (
    <div>
      <label
        htmlFor={id}
        className={
          boxed
            ? `flex flex-col gap-1 rounded-xl bg-paper-2 px-4 py-3 ${field.hint ? "" : "text-sm text-ink/75"}`
            : "flex items-start gap-3 text-xs leading-relaxed text-steel"
        }
      >
        <span className={boxed ? "flex items-start gap-2.5 text-sm" : "contents"}>
          <input
            id={id}
            type="checkbox"
            name={field.name}
            className="mt-1 shrink-0"
            {...(error ? { "aria-invalid": true as const, "aria-describedby": errId } : {})}
          />
          <span>{field.label}</span>
        </span>
        {field.hint ? <span className="pl-[1.6rem] text-[11px] text-steel">{field.hint}</span> : null}
      </label>
      {error ? (
        <p id={errId} role="alert" className={`mt-1 text-xs ${ERROR_TEXT}`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function FormView({
  form,
  action,
  submitLabel,
  accent,
  email,
  hidden,
  state,
  onSubmit,
  formRef,
}: {
  form: FormDoc;
  action: string;
  submitLabel: string;
  accent?: string;
  email?: string;
  hidden?: Record<string, string>;
  state: FormState;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  formRef?: RefObject<HTMLFormElement | null>;
}) {
  const base = useId();
  const fields = useMemo(() => renderFields(form), [form]);
  const consent = consentWording(form);
  const pending = state.phase === "pending";
  const errors = state.phase === "invalid" ? state.errors : {};
  const drawn = new Set([...fields.map((f) => f.name), "consent"]);
  // Errors for things the form does not draw: the hidden event, a whole-form refusal.
  const loose = Object.entries(errors).filter(([name]) => !drawn.has(name));
  const idOf = (name: string) => `${base}-${name}`;

  if (state.phase === "success") {
    return (
      <SuccessNote message={state.message || confirmationText(form)} accent={accent} />
    );
  }

  return (
    <form
      ref={formRef}
      action={action}
      method="post"
      encType="multipart/form-data"
      noValidate
      onSubmit={onSubmit}
      aria-busy={pending ? true : undefined}
      className="mt-8 grid gap-5 sm:grid-cols-2"
    >
      {Object.entries(hidden ?? {}).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
        <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      {segments(fields).map((seg) =>
        seg.kind === "field" ? (
          seg.field.type === "checkbox" ? (
            <div key={seg.field.name} className="sm:col-span-2">
              <Checkbox field={seg.field} id={idOf(seg.field.name)} error={errors[seg.field.name]} />
            </div>
          ) : (
            <Fieldline key={seg.field.name} field={seg.field} id={idOf(seg.field.name)} error={errors[seg.field.name]} />
          )
        ) : (
          <fieldset key={seg.legend} className="sm:col-span-2">
            <legend className="font-mono text-[10px] uppercase tracking-widest text-steel">{seg.legend}</legend>
            <div
              className={`mt-3 grid gap-2 ${seg.fields.some((f) => f.hint) ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}
            >
              {seg.fields.map((f) => (
                <Checkbox key={f.name} field={f} id={idOf(f.name)} error={errors[f.name]} boxed />
              ))}
            </div>
          </fieldset>
        ),
      )}

      <div className="sm:col-span-2">
        <label htmlFor={idOf("consent")} className="flex items-start gap-3 text-xs leading-relaxed text-steel">
          <input
            id={idOf("consent")}
            type="checkbox"
            name="consent"
            className="mt-0.5"
            {...(errors.consent ? { "aria-invalid": true as const, "aria-describedby": `${idOf("consent")}-error` } : {})}
          />
          <span>{consent}</span>
        </label>
        {errors.consent ? (
          <p id={`${idOf("consent")}-error`} role="alert" className={`mt-1 text-xs ${ERROR_TEXT}`}>
            {errors.consent}
          </p>
        ) : null}
      </div>

      {loose.map(([name, message]) => (
        <p key={name} role="alert" className={`sm:col-span-2 text-xs ${ERROR_TEXT}`}>
          {message}
        </p>
      ))}
      {state.phase === "failed" ? (
        <p role="alert" className={`sm:col-span-2 text-xs ${ERROR_TEXT}`}>
          {state.message}
          {email ? (
            <>
              {" "}
              <a href={`mailto:${email}`} className="underline">
                {email}
              </a>
            </>
          ) : null}
        </p>
      ) : null}
      {state.phase === "limited" ? <LimitedNote seconds={state.retryAfterSec} email={email} /> : null}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className={`rounded-full px-6 py-3 text-sm font-semibold text-white disabled:opacity-60 ${accent ? "" : "bg-gold"}`}
          style={accent ? { background: accent } : undefined}
        >
          {pending ? "Sending…" : submitLabel}
        </button>
      </div>
    </form>
  );
}

function LimitedNote({ seconds, email }: { seconds: number; email?: string }) {
  const wait = plural(Math.max(1, Math.ceil(seconds / 60)), "minute");
  return (
    <p role="alert" className={`sm:col-span-2 text-xs ${ERROR_TEXT}`}>
      {email ? (
        <>
          {`Too many attempts — please wait ${wait} or email `}
          <a href={`mailto:${email}`} className="underline">
            {email}
          </a>
        </>
      ) : (
        `Too many attempts — please wait ${wait} and try again.`
      )}
    </p>
  );
}

function SuccessNote({ message, accent }: { message: string; accent?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => ref.current?.focus(), []);
  return (
    <div
      ref={ref}
      role="status"
      tabIndex={-1}
      className="mt-8 rounded-2xl bg-paper-2 px-6 py-5 text-sm leading-relaxed text-ink/80 outline-none"
      style={accent ? { borderLeft: `4px solid ${accent}` } : { borderLeft: "4px solid var(--color-gold)" }}
    >
      {message.split("\n\n").map((para) => (
        <p key={para} className="[&+p]:mt-3">
          {para}
        </p>
      ))}
    </div>
  );
}

/**
 * `action` is the endpoint (`/forms/<key>`). `hidden` carries context fields the
 * page owns, such as the event slug. `email` is the mailbox named when the
 * visitor is rate limited or the send fails.
 */
export function LiveForm({
  form,
  action,
  submitLabel,
  accent,
  email,
  hidden,
}: {
  form: FormDoc;
  action: string;
  submitLabel: string;
  accent?: string;
  email?: string;
  hidden?: Record<string, string>;
}) {
  const [state, setState] = useState<FormState>({ phase: "idle" });
  const formRef = useRef<HTMLFormElement>(null);
  const fields = useMemo(() => renderFields(form), [form]);
  const consent = consentWording(form);

  const submitter = useMemo(
    () => createSubmitter((data) => sendForm(action, data), setState),
    [action],
  );

  // After errors render, move focus to the first flagged control.
  useEffect(() => {
    if (state.phase !== "invalid") return;
    formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [state]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const errors = validateClient(fields, consent, data);
    if (Object.keys(errors).length) {
      setState({ phase: "invalid", errors });
      return;
    }
    void submitter(data);
  }

  return (
    <FormView
      form={form}
      action={action}
      submitLabel={submitLabel}
      accent={accent}
      email={email}
      hidden={hidden}
      state={state}
      onSubmit={onSubmit}
      formRef={formRef}
    />
  );
}
