# Phase 7 — Editorial Workflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** An editor (Edge's non-technical staff) can draft a change, see it on the real page before it is public, and publish it; and cannot reach what only an admin may change — Contact details above all.

**Architecture:** Drafts and autosave already exist on all 13 content collections (`versions: { drafts: { autosave: { interval: 800 } } }`). This phase adds (1) one explicit role matrix, enforced in config and pinned by a test, with the privilege holes closed; (2) Next draft mode — a staff-only `/preview` route sets the draft cookie, and the content readers in `src/lib/content.ts` read the latest draft instead of the published version when it is set; (3) an admin "Preview" link on every previewable document; (4) revalidation that ignores pure-draft saves. Public visitors never see a draft: the draft cookie can only be set by a signed-in user.

**Tech Stack:** Next.js 15 `draftMode()`, Payload 3.88.0 (`admin.preview`, `draft: true`, `payload.auth`), vitest 3.

**Spec:** `docs/superpowers/specs/2026-10-10-payload-cms-port-design.md` — Phase 7 row: "Editorial workflow — draft preview via Next draft mode, autosave, role gating. Done when: An editor can draft, preview and publish; an editor cannot edit Contact." Also *Decisions already taken*: "Edge's own non-technical staff are the editors."

## Global Constraints

- Only published documents reach the public site. Draft reads happen only inside a draft-mode request, which only a signed-in user can start. `PUBLISHED` filtering and `approvedLogo` stay in force outside draft mode.
- Roles are exactly `admin` and `editor` (`Users.role`). No third role is added.
- Never modify `design-src/` or `design-files/` (read only). No prettier on this repo. `.env` is not edited; no real credentials in the repo.
- Routes come from `routeFor` / `src/lib/routes.ts`; the preview route accepts only paths for which `isKnownRoute` is true (no open redirect).
- A page file exports only `default`, `metadata`/`generateMetadata`, `generateStaticParams`, `revalidate`, `dynamicParams`; helpers go in sibling files.
- Schema changes ship as an additive migration under `src/migrations/` (Payload's dev push is interactive). Run `npm run migrate:create`; review it is additive.
- **No Docker, local Postgres, or machine-level commands** (they crash the developer's machine). Everything before Task 5 is verified with unit tests and `tsc`; database-dependent behaviour is verified on the server in Task 5. Run `npx eslint src` before any deploy — the server build lints.
- Server verification split: `git clone` → rename branch to `payload-cms-integration` → `git bundle` → `scp` → `/usr/local/sbin/edge-redeploy` (see `deploy/README.md`). Strip CRLF from anything copied from Windows. SSH uses the scratchpad deploy key and pinned `known_hosts`.
- Commit messages end `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## Rulings carried into the plan

- **Editors publish; editors do not delete.** The spec's done-when has an editor drafting, previewing and publishing. Deletion is unrecoverable on the public site and breaks the approved ordering, so content-collection `delete` becomes admin-only; an editor unpublishes instead. Cost if wrong: one-line change per collection.
- **Editors may edit** Company, Careers and Page copy (already `signedIn`); **admins only** Contact details and Site settings (already `adminOnly`), Users (create/delete), and the form definitions (`forms`: create/update/delete) — a renamed or reshaped form breaks its route (forms are found by title).
- **Editors may read form submissions** (the non-technical person checking the inbox is an editor — spec, *Forms*) but not change or delete them (already admin-only).
- **Pure-draft saves do not revalidate.** An autosave on a published document creates a draft version; the public page must not change and must not be re-rendered.
- **The first user is an admin.** The seed creates no users; `/admin` offers "Create first user", and `role` defaults to `editor`, so a careless first signup would leave no admin.

## Review Focus

1. **A draft never leaks.** An anonymous request carrying a forged draft cookie, a stale cookie after logout, and a request to `/preview` without a session must all render published content only. A draft-only document's URL is 404 when not in draft mode. — Tasks 2, 3.
2. **An editor cannot escalate.** An editor cannot change their own role, create or delete users, change another user's email or password, or edit Contact details, Site settings or any form definition. — Task 1.
3. **Autosave on a published document leaves the live page untouched** and does not trigger revalidation; unpublishing (published → draft) and publishing do. — Task 4.
4. **The preview route is not an open redirect or an SSRF-ish hop.** `path` must be an internal route known to `routeFor`; anything else (`//evil.test`, `https://…`, `/api/…`, backslashes, encoded slashes) is refused. — Task 3.
5. **Draft mode does not break the prerendered site.** `draftMode()` is unavailable outside a request (build, `generateStaticParams`, the seed); the readers must fall back to published, not throw. A draft-only slug is not 404 under `dynamicParams = false`. — Task 2.

---

## File Structure

- `src/access/index.ts` — gains `selfOrAdmin`, `adminOrSelfField` helpers.
- `src/access/matrix.ts`, `src/access/matrix.test.ts` (new) — the role matrix as data, and the test that resolves the real config and asserts it for anonymous / editor / admin.
- `src/collections/Users.ts`, `src/fields/submission.ts`, `src/payload.config.ts` — privilege fixes, read-only audit fields, forms admin-only.
- `src/lib/draft.ts`, `src/lib/draft.test.ts` (new) — `isDraft()` and the `PUBLISHED` switch.
- `src/lib/content.ts` — readers consult `isDraft()`.
- `src/app/(frontend)/preview/route.ts`, `src/app/(frontend)/preview/exit/route.ts` (new), `src/lib/preview.ts` (+ test) — the enable/exit routes and the path guard.
- Each previewable collection — `admin.preview`.
- `src/hooks/revalidate.ts` — skip pure-draft saves.
- `tools/check-editorial-live.mjs` (new) — the live editorial probe; `deploy/README.md`.

## Task 1: The role matrix, and closing the privilege holes

**Files:**
- Create: `src/access/matrix.ts`, `src/access/matrix.test.ts`
- Modify: `src/access/index.ts`, `src/collections/Users.ts`, the 13 content collections (their `delete` access), `src/fields/submission.ts`, `src/payload.config.ts` (forms access), `src/collections/Users.test.ts` (new)

**Interfaces:**
- Produces: `selfOrAdmin: Access` (admin, or a where-clause limiting to the user's own `id`); `ROLE_MATRIX: Record<string, { anonymous: Ops; editor: Ops; admin: Ops }>` where `Ops = { read: boolean; create: boolean; update: boolean; delete: boolean }`, one entry per collection and global slug (globals have `read`/`update` only).
- Produces: a `beforeValidate` hook on `users` forcing `role: "admin"` when no user exists yet.

- [ ] **Step 1: Write the failing tests**
  - `matrix.test.ts` resolves the real config (as `form-access.test.ts` does) and, for every collection and global in config, asserts the access results for an anonymous request, an editor `{ role: "editor" }` and an admin against `ROLE_MATRIX`; it also fails if a slug in config has no matrix entry and if a matrix entry has no slug (so a new collection cannot ship unclassified).
  - The matrix pins: content collections — anonymous read published only (`where` clause), editor create/update true, **delete false**, admin all; `contact-details`, `site-settings` — editor update false; `company`, `careers-content`, `page-copy` — editor update true; `users` — editor create false, delete false, update only self; `forms` — editor create/update/delete false, read true; `form-submissions` — anonymous nothing, editor read true / update false / delete false; `applications` — staff read only; `media` as currently configured.
  - `Users.test.ts`: an editor cannot change their own `role` (field update access false) nor another user's email/password (update access returns a where-clause that excludes others); an editor updating themselves is allowed; with zero users in the database the `beforeValidate` hook returns `role: "admin"` whatever was submitted, and with ≥1 user it leaves the submitted role alone (fake `payload.count`).
  - `submission.ts`: `consent`, `meta`, `emailStatus`, `emailError` are `admin.readOnly: true`.
- [ ] **Step 2: Run to verify failure** — `npx vitest run src/access src/collections/Users.test.ts src/fields` → FAIL.
- [ ] **Step 3: Implement.** `Users.update` becomes `selfOrAdmin`; `role` keeps `adminOnlyField` for update; add the first-user hook; set `delete: adminOnly` on the 13 content collections and `create/update/delete: adminOnly` on `forms`; mark the four submission audit fields read-only. `ROLE_MATRIX` is the single source of truth the test reads — do not duplicate it in the config.
- [ ] **Step 4: Run tests and `npx tsc --noEmit`** → PASS.
- [ ] **Step 5: Commit** — `git commit -m "Pin the editor and admin roles in one matrix and close the escalation paths"`.

## Task 2: Draft-aware readers

**Files:**
- Create: `src/lib/draft.ts`, `src/lib/draft.test.ts`
- Modify: `src/lib/content.ts`, `src/lib/content.test.ts`, route `generateStaticParams`/`dynamicParams` where a draft-only slug would 404

**Interfaces:**
- Produces: `isDraft(): Promise<boolean>` — `draftMode().isEnabled`, and `false` (never a throw) when called outside a request scope.
- Produces: in `content.ts`, `many`/`one`/global readers pass `draft: true` and drop the `PUBLISHED` filter when `isDraft()`; published-only otherwise. The `cache()` wrappers key on the draft flag (React `cache` is per request, so a draft request cannot poison a public one — assert this in a test).
- Consumes: `PUBLISHED`, `payloadClient`.

- [ ] **Step 1: Write the failing tests** (mock `next/headers`):
  - `draft.test.ts`: `isDraft()` is true when `draftMode()` resolves `{isEnabled:true}`, false when disabled, and **false when `draftMode()` throws** (outside a request).
  - `content.test.ts` (fake `payload.find`): with draft off, every reader passes the `_status: published` filter and no `draft`; with draft on, no `_status` filter and `draft: true`; `getSolution(slug)` with draft on and a draft-only document returns it; with draft off returns `null`; the globals pass `draft: true` only when versions are enabled for them (globals have `versions: { drafts: false }` — they publish immediately, so a global read never sets `draft`).
  - Review Focus #5: a structural test that every `[slug]` page whose `generateStaticParams` lists only published slugs does not set `dynamicParams = false` (the unknown-slug 404 is `loadOr404`'s job) — extend `routes.structure.test.ts`.
- [ ] **Step 2: Run to verify failure** — `npx vitest run src/lib src/app` → FAIL.
- [ ] **Step 3: Implement.** Keep the existing exports and signatures; the change is internal. Where depth-populated relations come back as published-only, note in the report whether Payload's `draft: true` populates draft relations (it is verified live in Task 5, not locally).
- [ ] **Step 4: Run the full suite, `tsc`, `npx eslint src`** → PASS.
- [ ] **Step 5: Commit** — `git commit -m "Read the latest draft instead of the published version in draft mode"`.

## Task 3: The preview route and the admin Preview link

**Files:**
- Create: `src/lib/preview.ts`, `src/lib/preview.test.ts`, `src/app/(frontend)/preview/route.ts`, `src/app/(frontend)/preview/exit/route.ts`, `src/app/(frontend)/preview/route.test.ts`
- Modify: the 13 collections (`admin.preview`), `src/payload.config.ts` if a shared helper is registered there

**Interfaces:**
- Produces: `safePreviewPath(path: unknown): string | null` — returns the path only if it is a string starting with a single `/`, contains no `//`, backslash, `:` , `@`, control character or encoded slash/backslash (`%2f`, `%5c`), is not under `/api` or `/admin`, and `isKnownRoute(path-without-query-and-hash)` is true; else `null`.
- Produces: `previewUrl(collection: string, doc: { slug?: string | null }): string | null` — `/preview?path=<encoded public path from routeFor/href helpers>`; `null` for a document with no public page (so the admin shows no link).
- Produces: `GET /preview?path=…` — authenticates with `payload.auth({ headers })`; no user → 401 and no cookie; user + safe path → `draftMode().enable()` and 307 to the path; unsafe path → 400. `GET /preview/exit?path=…` → `draftMode().disable()` and 307 to a safe path or `/`.

- [ ] **Step 1: Write the failing tests**
  - `preview.test.ts`: `safePreviewPath` accepts `/solutions/cybersecurity`, `/events`, `/careers/open-positions/hr-manager#apply`; refuses `//evil.test`, `/\evil`, `https://evil.test`, `/api/users`, `/admin`, `/%2Fevil`, `/solutions/%5C`, `/unknown-page`, `""`, `undefined`, an array, and a 2 kB path; `previewUrl("solutions", {slug:"cybersecurity"})` resolves through the real href helpers and the result satisfies `safePreviewPath`; `previewUrl` is `null` for collections with no detail page (partnerCategories, postCategories, clients, partners) and for a missing slug.
  - `route.test.ts` (fake `payload.auth`, mocked `next/headers`): no session → 401 and `draftMode().enable` never called; session + good path → enabled and a 307 `Location` equal to the path; session + bad path → 400 and not enabled; exit route disables and redirects safely; **a request carrying only an `__prerender_bypass` cookie but no session is not treated as authenticated by `/preview`**.
  - Each previewable collection config has an `admin.preview` that returns the `previewUrl` for a sample doc and `null` for a doc without a slug.
- [ ] **Step 2: Run to verify failure** — `npx vitest run src/lib/preview.test.ts "src/app/(frontend)/preview"` → FAIL.
- [ ] **Step 3: Implement.** Keep `admin.preview` as `(doc) => previewUrl(slug, doc)`. Index pages for list collections that also have a page (e.g. `/events`) are previewed through the detail document; globals have no preview (they publish immediately). Add a visible "Exit preview" affordance on the public pages: a small fixed bar rendered by the frontend layout only when `isDraft()` is true, linking to `/preview/exit?path=<current path>` and stating "Preview — unpublished changes are shown". The bar must never render outside draft mode (test it).
- [ ] **Step 4: Run tests, `tsc`, `npx eslint src`** → PASS.
- [ ] **Step 5: Commit** — `git commit -m "Add a staff-only preview route and an admin Preview link"`.

## Task 4: Revalidate on publish, not on every autosave

**Files:**
- Modify: `src/hooks/revalidate.ts`, `src/hooks/revalidate.test.ts`

**Interfaces:**
- Produces: `revalidateAfterChange` and the global/forms variants skip `expire()` when neither `doc._status` nor `previousDoc._status` is `"published"` (a pure-draft save); they still revalidate when a document becomes published, stays published and is saved as published, or goes from published to draft (unpublish). Globals (no drafts) always revalidate.

- [ ] **Step 1: Write the failing tests** (spy on `revalidatePath`): draft→draft: not called; draft→published: called; published→published: called; published→draft (unpublish): called; a document with no `_status` (global / forms): called; the new-document-created-as-draft case: not called.
- [ ] **Step 2: Run to verify failure** — `npx vitest run src/hooks` → FAIL.
- [ ] **Step 3: Implement** with a small pure helper `affectsPublishedSite(doc, previousDoc): boolean` exported for the test.
- [ ] **Step 4: Run the full suite and `tsc`** → PASS.
- [ ] **Step 5: Commit** — `git commit -m "Leave the published site alone when only a draft was saved"`.

## Task 5: Whole-phase verification on the server

**Files:**
- Create: `tools/check-editorial-live.mjs`, `tools/check-editorial-live.test.ts`
- Modify: `deploy/README.md`

The probe is HTTP-only, so it needs no database access of its own. It logs in over the REST API with throwaway accounts that the operator creates (and deletes) on the server — the script prints the exact commands.

- [ ] **Step 1: Write the failing tests** for the probe's pure parts (request building, cookie handling, result classification) behind an injectable `fetch`.
- [ ] **Step 2: Implement `check-editorial-live.mjs`.** With an editor session and an admin session, against a disposable test document (a News item created by the probe, titled `[automated test – ignore]`): (a) editor creates a draft → 200, and the document's public URL is 404 anonymously; (b) editor publishes → public URL 200 and shows the title; (c) editor autosaves a changed title as a draft (`PATCH …?draft=true&autosave=true`) → the public page still shows the old title; (d) `/preview?path=…` with the editor session sets the draft cookie and the page shows the new title; the same URL with a forged `__prerender_bypass` cookie and no session shows the old title; `/preview` without a session → 401; (e) editor publishes the change → the public page shows the new title without a redeploy; (f) editor unpublishes → public URL 404; (g) editor `PATCH /api/globals/contact-details` → 403, admin → 200 with an unchanged payload; (h) editor `POST /api/users` → 403, `PATCH /api/users/<admin id>` → 403, editor changing their own `role` → role unchanged/403; (i) editor `DELETE` of the test document → 403, admin → 200; (j) editor `PATCH /api/forms/<id>` → 403; (k) every unsafe preview path is refused (400).
- [ ] **Step 3: Deploy** the merged branch (bundle under `payload-cms-integration`, `edge-redeploy`). Operator steps, no real credentials: create two throwaway users (`editor-probe`, `admin-probe`) through the local API with random passwords from `openssl rand`, written to `/root/` only, then run the probe, then delete both users and the test document, and confirm none remain.
- [ ] **Step 4: Live checks that need a session but not a browser:** `GET /admin` for a signed-out visitor redirects to login; the first-user hook is exercised only by its unit test (the server already has the throwaway admin, so it cannot be re-tested live — state that).
- [ ] **Step 5: Full verification:** `npx vitest run`, `npx tsc --noEmit`, `npx eslint src`, server `check-parity.mjs --all` (51 pages unchanged), `check-links-live.mjs`, `check-forms-live.mjs` (forms unaffected), the editorial probe — all PASS. Update `deploy/README.md`: the role matrix in prose, the preview flow for editors (a non-technical walk-through: edit → Preview → Publish), how to create the first admin, and that deleting content is an admin action.
- [ ] **Step 6: Commit** — `git commit -m "Verify the editorial workflow end to end on the server"`.

---

## Done when

- An editor can create a draft, open the admin Preview link and see it on the real page, publish it, and see the public page change without a redeploy — shown on the server.
- An anonymous visitor, a forged draft cookie and a signed-out `/preview` never see a draft.
- An editor cannot edit Contact details, Site settings or a form definition, cannot create or delete users, cannot change another user's account or their own role, and cannot delete content — shown on the server.
- Autosave on a published document leaves the public page unchanged.
- `ROLE_MATRIX` covers every collection and global, and a new one without an entry fails the suite.
- `npx vitest run`, `npx tsc --noEmit`, `npx eslint src`, 51-page parity and the link and form probes are clean.

Phase 8 (deploy readiness: host decision, storage, migrations, backups, a shared rate limiter) begins from here.
