# Phase 6 — Forms Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the six inert form shells (contact, subscribe, event registration, E-Academy enquiry, job application, internship application) with working forms that validate, persist in Payload, email out over SMTP, resist spam, and store consent.

**Architecture:** One form system. `@payloadcms/plugin-form-builder` holds six seeded `forms` documents (field definitions, confirmation text, notification emails); `form-submissions` is the single admin inbox. Public visitors never write to `form-submissions` directly: its `create` access is closed, and one Next route handler (`POST /forms/[slug]`) does honeypot, rate limit, server-side validation against the stored form definition and consent check, then writes through the local API. Files go to a new private `applications` upload collection, never `media`. A client `<LiveForm>` renders from the form document and replaces the disabled `Field` shell. Email goes through `@payloadcms/email-nodemailer`, configured from env; a failed send never fails or loses the submission.

**Tech Stack:** Next.js 15 route handlers, Payload 3.88.0 local API, `@payloadcms/plugin-form-builder` 3.88.0 (built-in `upload` field), `@payloadcms/email-nodemailer` 3.88.0, vitest 3.

**Spec:** `docs/superpowers/specs/2026-10-10-payload-cms-port-design.md` — *Forms* section and Phase 6 row: "Forms — six forms, submissions collection, SMTP, honeypot, rate limiting. Done when: Each form submits, persists and emails; required fields enforced." Also its Open items note on the form-builder upload field.

## Global Constraints

- Submissions persist in Payload **and** email out through an env-configured SMTP adapter. Not email alone; a bounced mail must never lose an application.
- Spam handling is a honeypot field plus rate limiting. No Google captcha or any third-party script.
- Consent is a required checkbox per the master, stored with the submission (value and timestamp).
- Field labels, options, required flags and consent wording are ported verbatim from the six `design-src/highland/pages/*.mjs` form definitions (read only; never modify `design-src/` or `design-files/`).
- The careers inquiry category routes to the Careers process, not the contact form (Highland contact page note).
- No rendered string, field or email template publishes a partnership tier, authorization level, salary, benefit or employment condition; forbidden organisations (**Bonga, Haramaya, Mizan-Tepi, Yekatit 12**) appear nowhere, including fixtures.
- Brand short name is "Edge Comm-Tech".
- `.env` is not edited; add placeholders to `.env.example` only. No real credentials in the repo. Do not run prettier on this repo.
- Schema changes ship as an additive migration under `src/migrations/` (Payload's dev push is interactive and hangs; see memory `payload-schema-push-is-interactive`).
- A page file exports only `default`, `metadata`/`generateMetadata`, `generateStaticParams`, `revalidate`, `dynamicParams`; helpers go in sibling `*-parts.tsx`.
- Routes come from `routeFor` / `src/lib/routes.ts`. Mailbox addresses come from the contact-details global (`emailByLabel`), never written into code.
- Verification split: vitest and `tsc` locally; `next build`, parity and live form submission on the server via `git bundle` → `scp` → `/usr/local/sbin/edge-redeploy`, then `NODE_TLS_REJECT_UNAUTHORIZED=0 BASE_URL=https://168.119.61.125 …`. After any reseed, run `edge-redeploy` again.
- Commit messages end `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **Nobody can bypass the guards.** `POST /api/form-submissions` is the plugin's public default (`create: () => true`); left open, a bot skips the honeypot and limiter entirely. Public create must be refused, signed-out reads must be refused. — Task 2.
2. **A CV is never publicly readable.** `media` is public by URL; a CV stored there is a leak. Uploads go to a staff-only collection and its file URL returns 401/403 to an anonymous request. Also: wrong type (not PDF/DOCX), oversize and zero-byte files are rejected, and a rejected file leaves no submission. — Tasks 2, 4.
3. **Mail failure or missing SMTP config does not lose or fail a submission.** Unset `SMTP_HOST` in dev logs and skips; a thrown send is caught, recorded on the submission (`emailStatus`), and the visitor still gets the confirmation. — Task 3.
4. **Required fields and consent are enforced on the server, not only in the browser.** Missing required field, unchecked consent, an option not in the select's list, an unknown field name, and a field value over its length cap each return 422 with a per-field message and persist nothing. — Task 4.
5. **The limiter and honeypot behave under real traffic.** A filled honeypot returns the normal success response (so a bot learns nothing) and persists nothing; the Nth+1 request from one client in the window gets 429 with `Retry-After`; forwarded-for spoofing cannot mint fresh buckets on the server's configured proxy depth; double-click resubmits within the window are not stored twice. — Task 4.

---

## File Structure

- `src/payload.config.ts` — plugin config (upload field, closed access, hooks), email adapter, new collection.
- `src/collections/Applications.ts` — private upload collection for CVs.
- `src/lib/mail.ts` — SMTP env parsing and the adapter factory.
- `src/lib/forms/definitions.ts` — the six form definitions as data (ported labels/options), used by the seed.
- `src/lib/forms/validate.ts` — pure server validation of a payload against a stored form document.
- `src/lib/forms/guard.ts` — honeypot check and in-memory sliding-window limiter.
- `src/app/(frontend)/forms/[slug]/route.ts` — the submission endpoint.
- `src/components/forms/LiveForm.tsx` — client component rendering a form document.
- `src/seed/forms.ts` — upserts the six `forms` documents; `src/seed/verify.ts` checks them.
- `src/migrations/<timestamp>_phase6_forms.*` — additive.
- `tools/check-forms-live.mjs` — submits a clearly-marked test entry to each form on the server.
- Page edits: contact, subscribe, events detail, careers e-academy, careers internships, job detail (`*-parts.tsx` where they hold the shell).
- Delete: `FormNote` and the disabled `Field` once nothing imports them.

## Task 1: Form definitions as data, and the seed

The six field lists exist only inside Highland modules. Port them once as typed data, seed them as `forms` documents, and make the seed the single source the pages render from.

**Files:**
- Create: `src/lib/forms/definitions.ts`, `src/lib/forms/definitions.test.ts`, `src/seed/forms.ts`
- Modify: `src/seed/index.ts`, `src/seed/verify.ts`, `src/payload.config.ts` (`fields: { payment: false, upload: true }`, `uploadCollections: ["applications"]`)
- Modify: `.env.example`

**Interfaces:**
- Produces: `FORM_DEFINITIONS: Record<FormKey, FormDefinition>` where `FormKey = "contact" | "subscribe" | "event-registration" | "academy-enquiry" | "job-application" | "internship-application"` and `FormDefinition = { title: string; confirmationMessage: string; consent: string; fields: FormFieldDef[] }`; `FormFieldDef = { name: string; label: string; type: "text"|"email"|"tel"|"url"|"textarea"|"select"|"checkbox"|"upload"; required?: boolean; hint?: string; options?: string[]; wide?: boolean; maxLength?: number; group?: string }`.
- Produces: `seedForms(payload): Promise<void>` upserting by title; the checkbox-group fields of Subscribe ("Topics of interest" per solution, "What to send": Insights, Events, Company news) carry `group`.
- Consumes: Highland content (`SOLUTIONS` short names) through the existing seed transform layer.

- [ ] **Step 1: Write the failing tests** (`definitions.test.ts`)
  - Exactly six keys. Contact has 9 fields beginning "Full name", "Organization" and ending "How can we help?" (textarea, required, wide); its "Inquiry type" options are the seven inquiry categories; none of them is Careers.
  - `job-application` and `internship-application` each contain one `upload` field labelled "CV upload", required, with hint "PDF or DOCX".
  - Every form has `consent` text starting with "I " and every select has no empty-string option; names are unique within a form and kebab/camel-safe (`/^[a-z][A-Za-z0-9]*$/`).
  - Parity: for each of the six, labels/required/options equal a fresh read of the matching Highland `FIELDS` array (load via dynamic `import()` of the `.mjs`).
  - No definition string contains a forbidden organisation, "tier", "salary" or "benefit".
- [ ] **Step 2: Run to verify failure** — `npx vitest run src/lib/forms` → FAIL.
- [ ] **Step 3: Implement `definitions.ts` and `seed/forms.ts`.** Map `FormFieldDef` to the plugin's block shapes (`text`, `email`, `textarea`, `select` with `{label,value}` options, `checkbox`, `upload` with `uploadCollection: "applications"`, `mimeTypes: ["application/pdf","application/vnd.openxmlformats-officedocument.wordprocessingml.document"]`, `maxFileSize` 5 MB). The plugin has no `tel` or `url` block, so those store as `text`; `validate.ts` checks them by name against `FORM_DEFINITIONS`, not by block type.
- [ ] **Step 4: Add `seed:verify` assertions**: six forms exist; each has ≥1 required field; the two application forms each have exactly one `upload` field. Run `npm run seed:fresh && npm run seed:verify` → PASS.
- [ ] **Step 5: Commit** — `git commit -m "Define the six forms as data and seed them"`.

## Task 2: Lock submissions down, and a private upload collection

**Files:**
- Create: `src/collections/Applications.ts`, `src/collections/Applications.test.ts`, `src/collections/form-access.test.ts`
- Modify: `src/payload.config.ts`
- Create: migration (additive) for `applications` and the submission columns Task 3–4 add

**Interfaces:**
- Produces: collection `applications` (upload, `read`/`update`/`delete`: `signedIn`, `create`: `signedIn`; `mimeTypes` the PDF/DOCX pair; `staticDir` or the same S3 prefix `applications/`; `disablePayloadAccessControl` is NOT set, so file URLs go through access control).
- Produces: `formSubmissionOverrides.access = { create: signedIn, read: signedIn, update: adminOnly, delete: adminOnly }` and extra submission fields `consent: { accepted: checkbox, acceptedAt: date, wording: text }`, `emailStatus: select(pending|sent|failed|skipped)`, `emailError: text`, `meta: { ip hash, userAgent }` (IP stored only as a salted hash).
- Consumes: `signedIn`, `adminOnly` from `src/access`.

- [ ] **Step 1: Write the failing tests**
  - `form-access.test.ts` (against the resolved config): `form-submissions` `create`/`read` return false with no user and true with a user; `forms` `read` stays public (pages render from it) but `forms` write is `signedIn`; `applications` read returns false anonymously.
  - `Applications.test.ts`: slug `applications`, mime types are exactly the two, `admin.group` is "Site".
- [ ] **Step 2: Run** — `npx vitest run src/collections` → FAIL.
- [ ] **Step 3: Implement** the collection, the access overrides and the extra submission fields; register `applications` in `payload.config.ts`. Create the migration with `npm run migrate:create`, review it is purely additive, run `npm run migrate`.
- [ ] **Step 4: Run tests and `npx tsc --noEmit`** (regenerate types: `npm run generate:types`) → PASS.
- [ ] **Step 5: Server proof (Review Focus #1, #2 part):** after deploy, `curl -s -o /dev/null -w "%{http_code}" -X POST $BASE_URL/api/form-submissions -H 'content-type: application/json' -d '{}'` → 401/403; `GET /api/form-submissions` anonymous → 401/403. Record in the plan's ledger below.
- [ ] **Step 6: Commit** — `git commit -m "Close public access to submissions and store CVs privately"`.

## Task 3: SMTP and the mail guarantee

**Files:**
- Create: `src/lib/mail.ts`, `src/lib/mail.test.ts`
- Modify: `src/payload.config.ts` (`email:`), `package.json` (add `@payloadcms/email-nodemailer@3.88.0`, exact), `.env.example`

**Interfaces:**
- Produces: `readMailConfig(env: NodeJS.ProcessEnv): MailConfig | null` — `null` when `SMTP_HOST` is unset; otherwise `{ host, port, secure, user?, pass?, from, to? }` with `SMTP_PORT` default 587, `secure` true for 465; throws a clear error naming the variable when `SMTP_HOST` is set but `SMTP_FROM` is not, or when only one of `SMTP_USER`/`SMTP_PASS` is set.
- Produces: `sendNotification(payload, { submissionId, to: string[], subject: string, text: string }): Promise<"sent"|"failed"|"skipped">` — never throws; updates the submission's `emailStatus`/`emailError`.
- Produces: env keys `SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM`, `FORM_NOTIFY_FALLBACK` documented in `.env.example`.

- [ ] **Step 1: Write the failing tests** (`mail.test.ts`)
  - No `SMTP_HOST` → `null`; port 465 → `secure: true`; host without `SMTP_FROM` throws naming `SMTP_FROM`; `SMTP_USER` alone throws.
  - `sendNotification` with a transport that rejects returns `"failed"`, writes `emailStatus: "failed"` and the message into `emailError`, and does not throw; with config `null` returns `"skipped"`.
  - The email body for a submission lists each field label and value, the consent wording, and for upload fields the filename only (no URL).
- [ ] **Step 2: Run** — `npx vitest run src/lib/mail.test.ts` → FAIL.
- [ ] **Step 3: Implement.** Recipients come from the form document's `emails` array (plugin field) seeded from the contact-details global mailboxes via `emailByLabel` (contact → sales/general; applications → the careers mailbox; academy → training mailbox if the global has one, else the general one); `FORM_NOTIFY_FALLBACK` is used only when a form has no recipient.
- [ ] **Step 4: Run tests, `tsc`** → PASS.
- [ ] **Step 5: Commit** — `git commit -m "Send submission email over env-configured SMTP without ever losing the submission"`.

## Task 4: The submission endpoint — validation, guards, uploads

**Files:**
- Create: `src/lib/forms/validate.ts`, `validate.test.ts`, `src/lib/forms/guard.ts`, `guard.test.ts`
- Create: `src/app/(frontend)/forms/[slug]/route.ts`, `route.test.ts`

**Interfaces:**
- Produces: `validateSubmission(form: FormDoc, input: Record<string, unknown>, files: Record<string, File[]>): { ok: true; data: SubmissionData } | { ok: false; errors: Record<string, string> }`.
- Produces: `isHoneypotTripped(input: Record<string, unknown>): boolean` — field name `website_url` (hidden, off-screen, `tabindex=-1`, `autocomplete=off`); `createLimiter({ max: number; windowMs: number; now?: () => number }): { check(key: string): { allowed: boolean; retryAfterSec: number } }`; `clientKey(headers: Headers, trustedProxies: number): string`.
- Produces: `POST /forms/[slug]` accepting `multipart/form-data` (JSON also accepted when the form has no upload field); responses: 200 `{ ok: true, message }`, 404 unknown/unpublished form, 413/415/422 `{ errors }`, 429 + `Retry-After`. Defaults: 5 submissions per 10 min per client key per form; env `FORM_RATE_MAX`, `FORM_RATE_WINDOW_SEC`, `TRUSTED_PROXY_HOPS` (default 1).
- Consumes: `sendNotification` (Task 3), `loadOr404`-style form read, `FormDoc` from generated types.

- [ ] **Step 1: Write the failing tests**
  - `validate.test.ts`: missing required → error keyed by field name; `email` without `@`/domain, `url` not http(s), `tel` not matching `/^[+\d][\d\s()-]{6,}$/` rejected; select value outside options rejected; unknown field name rejected; text over `maxLength` (default 500; textarea 5000) rejected; consent unchecked rejected with the form's consent wording in the message; upload: missing required file, `.exe` renamed `.pdf` (magic bytes `%PDF-` / `PK`) rejected, > 5 MB rejected, 0 bytes rejected, a valid PDF and a valid DOCX accepted; a non-required empty field passes.
  - `guard.test.ts`: limiter allows `max`, blocks `max+1` with `retryAfterSec > 0`, recovers after the window (injected clock); keys are independent; `clientKey` takes the address `trustedProxies` hops from the right of `x-forwarded-for`, ignores injected leading entries, and falls back to a stable `"unknown"` key.
  - `route.test.ts` (mock `getPayload` and `sendNotification`): valid post creates exactly one submission with `consent.accepted`, `acceptedAt` and wording, calls notify once, returns 200; honeypot filled → 200 identical body, **zero** `create` calls, zero notify calls; invalid → 422 and zero creates; 429 on the sixth; identical payload twice within 10 s creates one submission and still returns 200; notify throwing/failing still returns 200; a thrown `payload.create` returns 500 with a generic message and no stack.
- [ ] **Step 2: Run** — `npx vitest run src/lib/forms "src/app/(frontend)/forms"` → FAIL.
- [ ] **Step 3: Implement.** Order in the handler: form lookup (published only) → limiter → honeypot → parse → validate → create submission through the local API with `overrideAccess: true` (files first into `applications`, ids referenced) → notify (after the create, awaited, errors swallowed into `emailStatus`) → respond. In-memory limiter state is per process; note that in `guard.ts` and in `deploy/README.md` as a Phase 8 follow-up if the host runs more than one instance. Store only a salted hash of the client key (`PAYLOAD_SECRET`-derived).
- [ ] **Step 4: Run tests and `tsc`** → PASS.
- [ ] **Step 5: Commit** — `git commit -m "Accept form submissions through one guarded endpoint"`.

## Task 5: LiveForm and the four plain forms

**Files:**
- Create: `src/components/forms/LiveForm.tsx`, `src/components/forms/LiveForm.test.tsx`, `src/lib/forms/read.ts` (+ test)
- Modify: `src/lib/content.ts` (add `getForm(key: FormKey): Promise<FormDoc>`), `contact-parts.tsx`/`contact/page.tsx`, `subscribe/page.tsx`, `events/event-parts.tsx`, `careers/e-academy/page.tsx`
- Modify: the page tests that currently assert the disabled controls and "Form shown for layout review" wording
- Modify: `src/components/ui/forms.tsx` (keep `Field` visuals; controls become live)

**Interfaces:**
- Produces: `<LiveForm form={FormDoc} action={string} accent?: string />` — renders fields in stored order using the existing `CONTROL` styling and `wide` layout; hidden honeypot; consent checkbox with the stored wording; submit button; on success replaces itself with the form's `confirmationMessage` (role `status`); on 422 shows each field error beside the field and focuses the first (role `alert`); on 429 shows "Too many attempts — please wait N minutes or email <mailbox>"; disables the button while pending (double-click safe).
- Produces: `getForm` cached with the same tags as other readers; revalidated when a `forms` document changes (add collection hook paths: the six pages).
- Event registration: for a past event (existing `events.ts` status helper) the form is not rendered — the registration-closed state already built stays; the form posts the event title in a hidden `event` field validated against published events.

- [ ] **Step 1: Write the failing tests**
  - `LiveForm.test.tsx`: renders every field with its label, `*` on required, options in order, a checkbox group for Subscribe; the honeypot is present, `aria-hidden`, `tabindex=-1`; submitting with a required field empty shows the message and does not call `fetch`; a 422 response renders field errors; a 200 shows the confirmation; the button is disabled during the request; no element carries the `disabled` attribute on first render other than the pending state.
  - Page tests: contact, subscribe, e-academy and an upcoming event each render a form with the right action `/forms/<key>` and none contains "Form shown for layout review" or "not accepting submissions".
  - Review Focus: a past event does not render a form.
- [ ] **Step 2: Run** — `npx vitest run src/components/forms "src/app/(frontend)"` → FAIL.
- [ ] **Step 3: Implement `LiveForm` (client component, no new dependency; native `FormData` + `fetch`), `getForm`, and swap each page's shell.** Delete `FormNote` when unused.
- [ ] **Step 4: Run the full suite and `tsc`** → PASS.
- [ ] **Step 5: Parity** (server): `check-parity.mjs contact subscribe careers-e-academy event-…`: the parity checker's expected text drops the shell note; update its fixtures in the same commit.
- [ ] **Step 6: Commit** — `git commit -m "Wire contact, subscribe, event registration and academy enquiry to live forms"`.

## Task 6: The two application forms, with CV upload

**Files:**
- Modify: `careers/open-positions/job-parts.tsx`, `careers/internships/page.tsx`, `LiveForm.tsx` (file input), tests

**Interfaces:**
- Consumes: `LiveForm`, the upload field handling of Task 4.
- Produces: file input (`accept=".pdf,.docx"`, shows chosen filename and size, client-side pre-check at 5 MB with the same wording as the server); the job form posts the job slug in a hidden `job` field, validated server-side against published jobs; applications close when the job's deadline has passed (reuse the open-ended-deadline handling from Phase 5 — an open-ended deadline stays open).
- The internship caveat paragraph stays before the form, unchanged.

- [ ] **Step 1: Write the failing tests**: file input renders with `accept`; an oversize file shows the error and does not call `fetch`; the request is `multipart/form-data` with the file under the upload field's name; the hidden `job` equals the page slug; a job slug unknown to the server → 422; internship page keeps the caveat before the form (DOM order assertion).
- [ ] **Step 2: Run to verify failure.**
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Server proof (Review Focus #2):** submit a real PDF via `tools/check-forms-live.mjs`; assert 200; fetch the stored file URL anonymously → 401/403; the submission is visible in the admin list. Record in the ledger.
- [ ] **Step 5: Commit** — `git commit -m "Accept CV uploads on the job and internship applications"`.

## Task 7: Whole-phase verification

**Files:**
- Create: `tools/check-forms-live.mjs`
- Modify: `tools/check-parity.mjs` (forms present, no "layout review" text), `deploy/README.md`, `.env.example`

- [ ] **Step 1: Write the probe.** For each of the six forms: POST a valid entry marked `[automated test – ignore]` → 200; POST with a required field removed → 422; POST with the honeypot filled → 200 and no new submission (compare counts through the local API on the server); sixth rapid POST → 429. Exits non-zero on any deviation; entries are deleted afterwards through the local API.
- [ ] **Step 2: Configure SMTP on the server** with a real mailbox supplied by Edge (ask the user; do not invent credentials). Submit one entry per form and confirm `emailStatus: "sent"`. If no mailbox is available, run with `SMTP_HOST` unset and record that the guarantee is verified only as `skipped`, and that SMTP remains open.
- [ ] **Step 3: Kill-the-mail test:** point `SMTP_HOST` at a closed port, submit, confirm 200, submission persisted, `emailStatus: "failed"`.
- [ ] **Step 4: Full verification:** `npx vitest run`, `npx tsc --noEmit`, `edge-redeploy`, `check-parity.mjs --all`, `check-links-live.mjs`, `check-forms-live.mjs` → all PASS.
- [ ] **Step 5: Update `deploy/README.md`:** the endpoint, env keys, limiter being per-process, retention (submissions hold personal data: state the retention decision as open for Edge), the migration. Commit — `git commit -m "Verify all six forms end to end"`.

---

## Ledger

Record exact commands and outcomes here during execution (Task 2 Step 5, Task 6 Step 4, Task 7 Steps 2–4).

## Done when

- All six forms submit on the deployed site, persist in `form-submissions`, and notify by email (or show `skipped` with SMTP recorded as open).
- Required fields, consent and file rules are enforced by the server; a CV URL is not readable anonymously.
- Anonymous `POST`/`GET` to `/api/form-submissions` is refused; honeypot and limiter proven on the server.
- A failed or absent mail transport never loses or fails a submission.
- `npx vitest run`, `npx tsc --noEmit`, the server `next build`, parity (all 51), link and form probes are clean.

Phase 7 (editorial workflow) begins from here.
