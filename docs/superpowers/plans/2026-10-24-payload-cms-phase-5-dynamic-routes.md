# Phase 5 — Dynamic Routes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Serve the remaining 37 Highland pages — five family indexes, seven solutions, six services, eight projects, three news items, three events, two jobs and three media sections — from the CMS, so all 51 pages match their Highland originals.

**Architecture:** One route per family under `src/app/(frontend)/<family>/`, an index `page.tsx` and a `[slug]/page.tsx` that reads through the existing cached readers in `src/lib/content.ts`, calls `notFound()` for an absent or unpublished slug, and prerenders every published slug via `generateStaticParams`. Page-specific pieces live in sibling `*-parts.tsx` files (Next allows a page only its known exports). Solutions render their `detail` blocks in stored order through one block renderer. The parity checker grows from 14 pages to all 51.

**Tech Stack:** Next.js 15 App Router, Payload 3.88.0 local API, vitest 3, `tools/check-parity.mjs`.

**Spec:** `docs/superpowers/specs/2026-10-10-payload-cms-port-design.md` — Phase 5 row of the Phases table: "Dynamic routes — solutions, services, projects, news, events, jobs, media sections, and their indexes. Gate: parity across all 51; link and render checks pass."

## Global Constraints

Carried from the spec and from decisions already made on this branch. Every task includes them.

- Highland's markup is ported as-is; Highland's rendered text, h1–h3 order and link targets are the acceptance criteria. Never modify `design-src/` or `design-files/` (read only).
- `design-src/content.json` is never imported (NEXT IT-derived, pre-correction).
- These organisations appear nowhere, including comments and test fixtures: **Bonga, Haramaya, Mizan-Tepi, Yekatit 12**.
- No field or rendered string may publish a partnership tier, authorization level, certification tier, salary, benefit or employment condition.
- "Tier III-aligned", never "Tier III-certified". The 100% figure always carries "against agreed project scope". CCTV and access control are IT infrastructure, not cybersecurity. Project records say "security control room", never "SOC".
- Only approved media is published (`approvedLogo`); only published documents are linked (`publishedOnly`).
- Routes come from `routeFor` / `src/lib/routes.ts`; never hand-built (Phase 4 review finding 11).
- Pages that are not statically exportable alone need no `export` beyond `default`, `metadata`/`generateMetadata`, `generateStaticParams`, `revalidate`, `dynamicParams` — helpers go in a sibling `*-parts.tsx`.
- JSX collapses a newline between `{expr}` and adjacent punctuation into a space; build such sentences as one template string.
- `.env` is not edited; no real credentials in the repo. Do not run prettier on this repo.
- Verification split (Phase 4 ruling): vitest and `tsc` run locally; `next build` and parity run on the server via `git bundle` → `scp` → `/usr/local/sbin/edge-redeploy`, then `NODE_TLS_REJECT_UNAUTHORIZED=0 BASE_URL=https://168.119.61.125 npx tsx tools/check-parity.mjs <pages>`. SSH needs the scratchpad deploy key and pinned `known_hosts` (`StrictHostKeyChecking=yes`).
- Pages prerender at build: after any reseed, run `edge-redeploy` again.
- Commit messages end `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## Review Focus

Failure modes the spec implies that no page's happy path exercises. Each has a test pinned to the task that owns the code.

1. **An absent or unpublished slug is a 404, and every inbound link to it disappears.** Payload's `depth` populate keeps an unpublished related document (measured in Phase 4), so unpublishing a solution must not leave a link to it on the home, partner, blog, client, project, service or E-Academy pages, and `/solutions/<that-slug>` must return 404 rather than render a draft. — Task 1 (`loadOr404`), Tasks 4–9.
2. **A prerendered event goes stale.** Event status is derived from dates, and a page prerendered while an event is upcoming keeps inviting registration after the event ends, with nobody having edited anything. The event routes revalidate on a timer, and an event ending today is still upcoming. — Task 8.
3. **Content held back by design renders its holding state, not a hole.** The third news item is held until six publication details are supplied; today the schema cannot hold that list, so the page would drop the "Details to add before publishing" section. Same family: the past event's registration-closed state, the unconfirmed project year, the open-ended job deadline. — Task 2 (schema), Tasks 6–9.
4. **The solution block renderer meets any block list an editor can build.** Order is the stored order; an empty `detail`, a block with no items, or an unknown block type renders nothing and does not throw; every blog `anchor` exists as an `id` on its target page, because the content master requires every destination anchor to exist. — Task 4.
5. **The long tail of detail pages still honours the content constraints.** A sweep of all 51 rendered pages finds no tier, salary or benefit wording, none of the four forbidden organisations, no "SOC" or "Tier III-certified", and no `undefined`/`null`/`[object Object]`. — Task 11.

---

## File Structure

- `src/lib/routes.ts` — gains typed href helpers built on `routeFor`.
- `src/lib/content.ts` — gains `loadOr404`-friendly readers where one is missing (none expected; verify in Task 1).
- `src/app/(frontend)/{solutions,services,projects,news,events}/page.tsx` — five indexes.
- `src/app/(frontend)/{solutions,services,projects,news,events}/[slug]/page.tsx` — five detail families.
- `src/app/(frontend)/careers/open-positions/[slug]/page.tsx` — job detail (`routeFor` puts jobs under the listing page).
- `src/app/(frontend)/resources/media/[slug]/page.tsx` — three media sections.
- `src/app/(frontend)/<family>/*-parts.tsx` — page-specific components and pure helpers, each with a `page.test.tsx`.
- `tools/check-parity.mjs` — page list, forbidden-content sweep; `tools/check-links-live.mjs` (new) — live link probe.
- `src/collections/News.ts` + one new migration — held-for-publication state (Task 2).

## Task 1: Foundations — href helpers, 404 loading, revalidation paths

Every later task needs three things done once: a way to build a family href that cannot drift from `routeFor`, a uniform "read this slug or 404", and revalidation paths that match the real routes. Phase 3 shipped a wrong one: `Jobs.ts` revalidates `/careers/jobs/<slug>` but the route map serves `/careers/open-positions/<slug>`, so editing a job would never refresh its page.

**Files:**
- Modify: `src/lib/routes.ts`, `src/lib/routes.test.ts`
- Create: `src/lib/load.ts`, `src/lib/load.test.ts`
- Modify: `src/collections/{Solutions,Services,Projects,News,Events,Jobs}.ts` (their `paths` helpers)
- Create: `src/collections/revalidate-paths.test.ts`
- Modify: Phase 4 pages that build family hrefs by hand (`grep -rn '`/\(solutions\|services\|projects\|news\|events\)/\$' src/app`), plus `home-parts.tsx` (null `story.client`, review finding 15) and the three pages picking a mailbox by position (finding 16).

**Interfaces:**
- Produces in `src/lib/routes.ts`:
  - `solutionHref(slug: string, anchor?: string): string`, `serviceHref(slug)`, `projectHref(slug)`, `newsHref(slug)`, `eventHref(slug)`, `jobHref(slug)`, `mediaHref(slug)` — each `routeFor(<prefix>-<slug>.html)` plus an optional `#anchor`.
  - `emailByLabel(contact: Pick<ContactDetail,"emails">, label: RegExp): string | undefined`.
- Produces in `src/lib/load.ts`: `loadOr404<T>(read: () => Promise<T | null | undefined>): Promise<T>` — returns the document or calls `notFound()` from `next/navigation`.
- Consumes: `routeFor`, `isKnownRoute`.

- [ ] **Step 1: Write the failing tests**
  - `routes.test.ts`: `jobHref("hr-manager")` is `"/careers/open-positions/hr-manager"`; `solutionHref("cybersecurity","zero-trust-ztna-nac")` ends `#zero-trust-ztna-nac`; every helper's output satisfies `isKnownRoute`; a slug containing a family prefix ("news-room-build") is not re-mapped.
  - `load.test.ts` (mock `next/navigation` so `notFound` throws a sentinel): resolves the document when present; throws the sentinel for `null` and `undefined`.
  - `revalidate-paths.test.ts`: for each of the six collections, evaluate its `paths` helper (export it) with `{slug:"x"}` and assert the detail path equals `routeFor`'s route for that slug, and the list includes the family index. This test fails today for Jobs.
  - Mailbox: `emailByLabel` finds "Sales and general inquiries" by `/sales/i` regardless of order and returns `undefined` when absent.

- [ ] **Step 2: Run them to verify they fail**

  Run: `npx vitest run src/lib/routes.test.ts src/lib/load.test.ts src/collections/revalidate-paths.test.ts`
  Expected: FAIL (helpers undefined; Jobs path mismatch).

- [ ] **Step 3: Implement the helpers, export each collection's `paths`, fix Jobs, add a solution-change fan-out**

  Jobs revalidates the routeFor path. A solution is referenced from `/`, `/about`, `/partners`, `/clients`, `/blog`, `/projects`, `/services`, `/careers/e-academy`; its `paths` returns those plus the detail page, so an unpublish refreshes every page that would otherwise keep a stale link (Review Focus #1).

- [ ] **Step 4: Replace hand-built family hrefs in Phase 4 pages with the helpers; fix the null-client crash and the positional mailboxes**

  Use `doc()`-style narrowing (not `typeof x === "object"`) for `story.client`. Add a `home-parts` test: a success story whose `client` is `null` renders without throwing.

- [ ] **Step 5: Run the full suite and the type check**

  Run: `npx vitest run` then `npx tsc --noEmit`
  Expected: all pass, no type errors.

- [ ] **Step 6: Commit**

```bash
git add src tools
git commit -m "Add route helpers, a 404 loader and correct revalidation paths"
```

## Task 2: Close the schema gaps the dynamic pages need

Phase 3 modelled the data from the content modules, but only the Phase 4 templates were ever rendered against it. The news article template reads `draft` and `pendingFields`; the schema holds neither (the seed turned `sections` into headings and dropped the other two). Find every such gap once, before building pages, instead of discovering one per page.

**Files:**
- Create: `tools/audit-dynamic-content.mjs`
- Modify: `src/collections/News.ts`, `src/seed/index.ts`, `src/seed/transform.ts`, `src/seed/verify.ts`
- Create: one migration under `src/migrations/` (additive)
- Test: `src/seed/transform.test.ts`, `src/collections/News.test.ts`

**Interfaces:**
- Produces: `News.heldForPublication: checkbox` and `News.pendingFields: array of { item: text }`; `NEWS` seed carries both; `verify.ts` asserts the held item has exactly six pending fields and the other two have none.
- Produces: `tools/audit-dynamic-content.mjs` — for each of the 37 templates, lists the properties read from the content module (`a.draft`, `p.tech` …) that have no counterpart in the seeded document; exits non-zero on any.

- [ ] **Step 1: Write the failing tests**
  - `News.test.ts`: the collection has `heldForPublication` (checkbox, default false) and `pendingFields` (array of `item`), and `pendingFields` items use `forbidsPhrases()`.
  - `transform.test.ts`: `toNews` of the third approved record yields `heldForPublication: true` and the six field labels in order ("Official meeting name" … "Organizer or official program URL"); the other two yield `false` and `[]`.

- [ ] **Step 2: Run them to verify they fail**

  Run: `npx vitest run src/collections/News.test.ts src/seed/transform.test.ts`
  Expected: FAIL.

- [ ] **Step 3: Write the audit script, run it, and record every gap it reports in the ledger**

  Approach: statically scan each `design-src/highland/pages/*.mjs` factory for member access on its record variable and diff against the keys of the corresponding seeded document read through the Payload local API. Treat the report as the task's real scope: a gap that is one more additive field joins this task; one that changes an existing field's shape is ruled and ledgered before proceeding.

- [ ] **Step 4: Add the fields, the transform, the seed mapping and the verify assertion; generate the migration**

  Generate with `npx payload migrate:create` (the schema push is interactive and hangs; migrations are the only deterministic path). Inspect the SQL: it must only add the two columns/tables. Apply to an empty database and confirm the table count rises by exactly the new tables.

- [ ] **Step 5: Run the tests, the audit (expect clean) and `seed:verify` on the server after a force reseed**

  Run: `npx vitest run`, `node tools/audit-dynamic-content.mjs`
  Expected: PASS; audit reports no gaps.

- [ ] **Step 6: Commit**

```bash
git add src tools
git commit -m "Hold the unpublished news item's outstanding details in the schema"
```

## Task 3: Extend the parity checker to all 51 pages

**Files:**
- Modify: `tools/check-parity.mjs`
- Create: `tools/check-parity.test.ts` (imports the page-list function)

**Interfaces:**
- Produces: `pageList(scope: "static" | "dynamic" | "all"): string[]` — derived from `design-files/highland/*.html`, never hand-listed. `--all` and `--dynamic` flags; no-argument behaviour stays the fourteen Phase 4 pages.
- Consumes: `routeFor`.

- [ ] **Step 1: Write the failing test**

```ts
expect(pageList("static")).toHaveLength(14);
expect(pageList("dynamic")).toHaveLength(37);
expect(pageList("all")).toHaveLength(51);
// no Highland page is unmapped
for (const p of pageList("all")) expect(() => routeFor(`${p}.html`)).not.toThrow();
```

- [ ] **Step 2: Run it to verify it fails**

  Run: `npx vitest run tools/check-parity.test.ts`
  Expected: FAIL (`pageList` undefined).

- [ ] **Step 3: Implement `pageList` and the flags; keep `--self` working across all 51**

  Run `--self --all` and drive false positives to zero by fixing extractors, not by adding waivers. Any waiver added later carries a comment and, where it is a pattern, is as narrow as the string it excuses (Phase 4 review finding 12).

- [ ] **Step 4: Run the test and `--self --all`**

  Run: `npx vitest run tools/check-parity.test.ts` then `npx tsx tools/check-parity.mjs --self --all`
  Expected: PASS for 51 pages.

- [ ] **Step 5: Commit**

```bash
git add tools
git commit -m "Let the parity checker cover all 51 Highland pages"
```

## Task 4: Solutions — index, seven detail pages and the block renderer

The detail page is the hardest in the phase: a datasheet whose body is an ordered list of `detail` blocks (`capabilities`, `bands`, `layers`, `steps`, `checklist`, `measures`, `sectors`, `models`, `solutions`), plus lead, outcomes, partners sidebar, related solutions and delivered work. The seven pages differ only in which blocks they carry.

**Files:**
- Create: `src/app/(frontend)/solutions/page.tsx`, `src/app/(frontend)/solutions/[slug]/page.tsx`
- Create: `src/app/(frontend)/solutions/solution-parts.tsx`, `src/app/(frontend)/solutions/page.test.tsx`

**Interfaces:**
- Consumes: `getSolutions`, `getSolution`, `getProjects`, `getPartners`, `getPosts`, `getServices`, `loadOr404`, `solutionHref`, `publishedOnly`, Task 3's components (`PageHead`, `Crumb`, `SectionHead`, `CheckList`, `NumberedSteps`, `CapCard`, `Mark`).
- Produces: `DetailBlocks({ blocks, accent, anchors }: { blocks: Solution["detail"]; accent: string; anchors: Record<string,string> })`; `anchorsFor(posts: Post[], slug: string): string[]`; `relatedProjects(projects: Project[], slug: string): Project[]` (published only).

- [ ] **Step 1: Write the failing tests** (Review Focus #4)
  - A block list renders sections in stored order (assert heading order for `[checklist, capabilities]` vs reversed).
  - `[]`, `undefined`, a block with `items: []`, and `{ blockType: "invented" }` each render empty markup and do not throw.
  - Every `anchor` among the seeded posts targeting a solution appears as an `id` on that solution's rendered page (use the seed constants; fails if an anchor has no destination).
  - `relatedProjects` excludes an unpublished project; the partner sidebar excludes an unpublished or unapproved-logo partner's link but keeps its name.
  - The "other six families" list never includes the page's own slug and excludes an unpublished solution.

- [ ] **Step 2: Run them to verify they fail**

  Run: `npx vitest run "src/app/(frontend)/solutions"`
  Expected: FAIL.

- [ ] **Step 3: Implement the parts, the two pages, `generateStaticParams` (published slugs) and `loadOr404`**

  Switch on `blockType` with an exhaustive default that returns `null`. Read Highland's `solutions.mjs` and `solution.mjs`; `ANCHOR_CAPABILITY` and `ANCHOR_BAND` map an anchor to a capability heading or band index and must be ported as data attached to the destination, not guessed.

- [ ] **Step 4: Run tests and type check; deploy; run parity for the index and seven slugs**

  Run: `npx vitest run "src/app/(frontend)/solutions"`, `npx tsc --noEmit`, then on the server `check-parity.mjs solutions solution-cybersecurity …` (all seven).
  Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add "src/app/(frontend)/solutions"
git commit -m "Port the solutions index and the seven solution pages"
```

## Task 5: Services — index and six detail pages

**Files:**
- Create: `src/app/(frontend)/services/page.tsx`, `src/app/(frontend)/services/[slug]/page.tsx`, `src/app/(frontend)/services/service-parts.tsx`, `src/app/(frontend)/services/page.test.tsx`

**Interfaces:**
- Consumes: `getServices`, `getService`, `getSolutions`, `loadOr404`, `serviceHref`, `solutionHref`, `publishedOnly`, shared components.
- Produces: `RelatedLinks({ related }: { related: (Solution | Service | number)[] })` — links only published targets, each through its own family's helper.

- [ ] **Step 1: Write the failing tests**: a service whose `related` includes an unpublished solution drops that link (Review Focus #1); `models`, `checklist` and `fit` blocks render when present and are omitted when empty; `capabilities` renders as cards.
- [ ] **Step 2: Run them to verify they fail** — `npx vitest run "src/app/(frontend)/services"` → FAIL.
- [ ] **Step 3: Build index and detail** from `services.mjs` and `service.mjs`, with `generateStaticParams`.
- [ ] **Step 4: Tests, `tsc`, deploy, parity for `services` and the six `service-*` pages** → PASS.
- [ ] **Step 5: Commit** — `git commit -m "Port the services index and the six service pages"`.

## Task 6: Projects — index and eight detail pages

Case studies with a facts panel directly under the hero (client, sector, location, completion, status, technology), delivered/outcomes lists, a technology section, training, a privacy note and the implementation note from `pageCopy.projectImplementationNote`. Carries the two project-specific content rules: "security control room", never "SOC", and no contract value, quantity or capacity.

**Files:**
- Create: `src/app/(frontend)/projects/page.tsx`, `[slug]/page.tsx`, `project-parts.tsx`, `page.test.tsx`

**Interfaces:**
- Consumes: `getProjects`, `getProject`, `getClients`, `getSolutions`, `getPartners`, `getPageCopy`, `bySector` (from `clients/client-parts`), `projectHref`, `publishedOnly`, `Confirmable`.
- Produces: `ProjectFacts({ project }: { project: Project })`; `siblingProjects(projects: Project[], current: Project): Project[]` — same sector, not itself, published, at most three.

- [ ] **Step 1: Write the failing tests**
  - The unconfirmed year renders its marker ("Year to confirm"), never an empty value (Review Focus #3).
  - A project whose `client` or `solutions` populated as a bare id or draft renders without a dead link.
  - `siblingProjects` caps at three and excludes drafts and the project itself.
  - The facts panel contains no "contract value", "quantity" or "capacity" label, and rendered technology text never contains "SOC" as a word.
- [ ] **Step 2: Run them to verify they fail** — `npx vitest run "src/app/(frontend)/projects"` → FAIL.
- [ ] **Step 3: Build the index (grouped by the three sectors, no filter UI, as Highland) and the detail page, with `generateStaticParams`.**
- [ ] **Step 4: Tests, `tsc`, deploy, parity for `projects` and the eight `project-*` pages** → PASS.
- [ ] **Step 5: Commit** — `git commit -m "Port the project index and the eight project pages"`.

## Task 7: News — index and three articles

**Files:**
- Create: `src/app/(frontend)/news/page.tsx`, `[slug]/page.tsx`, `news-parts.tsx`, `page.test.tsx`

**Interfaces:**
- Consumes: `getNews`, `getNewsItem`, `newsHref`, `RichText` (`@payloadcms/richtext-lexical/react`), `Confirmable`, `Task 2`'s `heldForPublication` / `pendingFields`.
- Produces: `PendingDetails({ fields }: { fields: { item: string }[] })` — renders nothing for an empty list; `splitArchive(items: News[]): { current: News[]; archive: News[] }`.

- [ ] **Step 1: Write the failing tests** (Review Focus #3): the held item shows "Details to add before publishing" with all six fields and the statement that no authorized record supports the wording; the published items show neither; the archive band appears only when something is archived; an undated item shows its marker; the archived 2018 item shows the archived-milestone marker.
- [ ] **Step 2: Run them to verify they fail** — `npx vitest run "src/app/(frontend)/news"` → FAIL.
- [ ] **Step 3: Build index and article.** Highland hard-codes a "Looking forward" block for the 2018 article by slug; port it as part of that article's rich-text body in the seed (ruled in Task 2's ledger), not as a slug conditional in the page.
- [ ] **Step 4: Tests, `tsc`, deploy, parity for `news` and the three `news-*` pages** → PASS.
- [ ] **Step 5: Commit** — `git commit -m "Port the news index and the three articles"`.

## Task 8: Events — index and three event pages

**Files:**
- Create: `src/app/(frontend)/events/page.tsx`, `[slug]/page.tsx`, `event-parts.tsx`, `page.test.tsx`

**Interfaces:**
- Consumes: `getEvents`, `getEvent` (carry derived `status`), `eventHref`, `Field`, `FormNote`, `Pending`.
- Produces: `RegistrationPanel({ event }: { event: EventWithStatus })` — the inert registration form when upcoming, a "registration closed" state when past; `export const revalidate = 3600` on both event routes.

- [ ] **Step 1: Write the failing tests** (Review Focus #2)
  - A past event renders "Completed" and a closed registration state with no enabled-looking form.
  - An event whose range ends today is upcoming (uses `eventStatus` with a fixed clock).
  - Each event route module exports a numeric `revalidate` ≤ 86400 (structural test reading the file).
  - A single-day event with no `endsOn` renders one date; the venue label is "Platform" for online events and "Venue" otherwise.
- [ ] **Step 2: Run them to verify they fail** — `npx vitest run "src/app/(frontend)/events"` → FAIL.
- [ ] **Step 3: Build index (upcoming band, past band) and detail.** The `Field` ids derive from labels; one form per page keeps them unique, and the registration form must stay the only form on its page.
- [ ] **Step 4: Tests, `tsc`, deploy, parity for `events` and the three `event-*` pages** → PASS.
- [ ] **Step 5: Commit** — `git commit -m "Port the events index and the three event pages"`.

## Task 9: Job detail pages

Two vacancy pages under `/careers/open-positions/<slug>`. Required and preferred qualifications stay separate; no salary, benefit or employment condition; the application form is inert.

**Files:**
- Create: `src/app/(frontend)/careers/open-positions/[slug]/page.tsx`, `job-parts.tsx`, `page.test.tsx`

**Interfaces:**
- Consumes: `getJobs`, `getJob`, `jobHref`, `deadlineText`, `deadlinePending`, `hrEmail`, `Field`, `FormNote`, `getCareersContent`.
- Produces: `JobHeader({ job }: { job: Job })`; `Qualifications({ required, preferred })` — omits an empty list's section, never merges the two.

- [ ] **Step 1: Write the failing tests**: the unconfirmed deadline is a marker and a confirmed one reads as text (reusing Task 10's rules from Phase 4); `required` and `preferred` render under separate headings; the "other vacancy" link is absent when the job is the only one published; no rendered string contains "salary", "benefit", "compensation".
- [ ] **Step 2: Run them to verify they fail** — `npx vitest run "src/app/(frontend)/careers/open-positions"` → FAIL.
- [ ] **Step 3: Build the page with `generateStaticParams`; port `job.mjs`.**
- [ ] **Step 4: Tests, `tsc`, deploy, parity for the two `job-*` pages** → PASS.
- [ ] **Step 5: Commit** — `git commit -m "Port the two job pages"`.

## Task 10: Media sections

Documentaries, press releases and coverage share one factory and have no approved items. The section copy (`SHAPE` in `media.mjs`: lead, intro, empty state, three "what to expect" items, ask line) is page prose; the titles and bodies come from `pageCopy.resourceSections`.

**Files:**
- Create: `src/app/(frontend)/resources/media/[slug]/page.tsx`, `media-parts.tsx`, `page.test.tsx`

**Interfaces:**
- Consumes: `getPageCopy`, `mediaHref`, `getContactDetails`, `loadOr404`.
- Produces: `MEDIA_SHAPES: Record<"documentaries"|"press-releases"|"coverage", MediaShape>`; `siblingSections(copy, slug): Section[]` — the other two.

- [ ] **Step 1: Write the failing tests**: an unknown slug (`/resources/media/news`) is a 404, because `news` is a resource section but not a media page; each of the three renders its empty-state sentence and three expectation items; the two siblings link through `mediaHref`.
- [ ] **Step 2: Run them to verify they fail** — `npx vitest run "src/app/(frontend)/resources/media"` → FAIL.
- [ ] **Step 3: Build the page; `generateStaticParams` returns exactly the three media keys; `dynamicParams = false`.**
- [ ] **Step 4: Tests, `tsc`, deploy, parity for the three `media-*` pages** → PASS.
- [ ] **Step 5: Commit** — `git commit -m "Port the three media sections"`.

## Task 11: Whole-phase verification

**Files:**
- Modify: `tools/check-parity.mjs` (forbidden-content sweep), `deploy/README.md`
- Create: `tools/check-links-live.mjs`, `src/app/(frontend)/routes.structure.test.ts`

**Interfaces:**
- Produces: `tools/check-links-live.mjs` — fetches the 51 pages from `BASE_URL`, collects every internal `href`, and requests each (deduplicated); fails on any non-200 or any `.html` link. Structural test asserting each of the six detail pages exports `generateStaticParams` and uses `loadOr404`.

- [ ] **Step 1: Write the failing tests**: the structural test above; a unit test for the forbidden-content scanner — flags "Tier III-certified", "SOC", a partnership tier phrase, each of the four forbidden organisations, and `undefined`/`null`/`[object Object]`, and passes a clean page (Review Focus #5).
- [ ] **Step 2: Run them to verify they fail** — `npx vitest run` → FAIL.
- [ ] **Step 3: Implement the scanner in the checker (runs on every page it fetches) and the live link probe.**
- [ ] **Step 4: Parity across all 51** — `check-parity.mjs --all` against the server. Expected: PASS.
- [ ] **Step 5: Live link probe** — `node tools/check-links-live.mjs`. Expected: every internal link returns 200.
- [ ] **Step 6: Prove Review Focus #1 on the server.** Unpublish one solution through the local API, wait for revalidation (or redeploy), then assert `/solutions/<slug>` is 404 and no other page links it; republish and re-run parity. Record the exact commands and results in the ledger.
- [ ] **Step 7: Full suite, types, server build** — `npx vitest run`, `npx tsc --noEmit`, `edge-redeploy`. Expected: clean.
- [ ] **Step 8: Update `deploy/README.md`** with the dynamic routes, the revalidation fan-out, the event revalidate window and the new migration; commit.

```bash
git add tools deploy src
git commit -m "Verify all 51 pages against Highland, links included"
```

---

## Done when

- `check-parity.mjs --all` passes for all 51 pages locally and against the deployed URL.
- `check-links-live.mjs` finds no internal link that is not a 200 and none that is a `.html` file.
- Unpublishing a solution 404s its page and removes every inbound link, shown on the server.
- A reseed followed by `edge-redeploy` leaves `seed:verify` passing.
- The held news item shows its six outstanding details; the past event shows registration closed; the unconfirmed project year shows its marker.
- `npx vitest run`, `npx tsc --noEmit` and the server `next build` are clean.

Phase 6 (the six real forms) begins from here, against inert shells that already carry the right fields.
