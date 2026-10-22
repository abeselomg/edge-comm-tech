# Phase 4: Static Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port Highland's fourteen slug-less pages onto the Payload read layer, so every fact on them comes from the CMS.

**Architecture:** Highland's twelve rendering primitives in `design-src/highland/ui.mjs` become React components once, and each page is a thin composition of them over `src/lib/content.ts`. One route map holds every Highland-filename-to-path translation, because fourteen pages linking to each other and to Phase 5's routes will otherwise invent fourteen conventions. A parity checker diffs each Next route's visible text and link targets against the Highland HTML for the same page, which is what "parity check passes per page" means mechanically.

**Tech Stack:** Next.js 15.4.11 App Router (server components), Payload 3.88.0 via `src/lib/content.ts`, Tailwind v4 CSS-first, vitest 3.2.7, Node ≥20.9.

**Spec:** `docs/superpowers/specs/2026-10-10-payload-cms-port-design.md` — Phase 4 row of the Phases table.

## Global Constraints

Every task's requirements implicitly include these.

- `design-src/` and `design-files/` are **read-only**. Reading is required; modifying or deleting anything there is out of scope for this plan.
- `design-src/content.json` must **never** be imported: it is NEXT IT-derived, from before the client's first correction.
- These four organisations must appear nowhere, including comments and test fixtures: **Bonga, Haramaya, Mizan-Tepi, Yekatit 12**.
- No field or rendered string may publish a partnership tier, an authorization level, a certification tier, a salary, a benefit or an employment condition.
- `"Tier III-aligned"` is permitted; `"Tier III-certified"` is not.
- A 100% completion figure always carries `"against agreed project scope"`.
- CCTV and access control are IT infrastructure, **not** cybersecurity.
- On project records the approved wording is `"security control room"`, never `"SOC"`.
- Only media with `approved: true` may be rendered. `src/lib/media.ts`'s `approvedLogo()` is the read-side gate.
- Routes import data **only** from `src/lib/content.ts`. No route calls Payload directly — that is what keeps the published-only filter in one place.
- Tests use **relative imports**. `vitest.config.ts` defines no `@/` alias; only Next resolves it.
- **Do not run prettier.** This repo has no prettier config and is hand-formatted; `--write` rewrites unrelated files.
- Versions are pinned deliberately. Do not upgrade `next` or `@payloadcms/*` in this plan.

## Review Focus

Five conditions Phase 4 will meet that no page's happy path exercises. Each has a test pinned to the task that owns the code.

1. **Content Edge still owes renders as a visible pending marker, not a blank.** Five executive bios, 29 of 32 partner marks and 9 of 10 client marks are absent by design. A page that renders `undefined` or an empty box instead of the marker looks broken rather than honest. — Task 3 (`Pending`), Task 6, Task 7.
2. **A reference whose target was unpublished or un-approved still populates.** Measured on this branch: unpublishing a solution leaves a post's `target` populating with `_status: "draft"`, because Payload's `depth: 2` populate does not re-apply the published filter. A page that links it produces a 404. — Task 1 (`publishedOnly`), Task 9.
3. **An empty collection renders an empty state, not a broken grid.** No open jobs, no upcoming events, no approved downloads are all reachable states an editor can create in one click. — Task 8, Task 10.
4. **A `confirmable` field still pending renders its marker, not its empty value.** One project's year is unconfirmed today, and `pendingLabel` exists precisely so the page says "Year to confirm". — Task 3 (`Confirmable`), Task 5.
5. **An impact figure renders with its qualifier attached.** The 100% counter's qualifier lives in a sibling field; a card that renders `figure` and `unit` but drops `line` publishes a bare "100% completion". — Task 5.

---

## File Structure

| File | Responsibility |
|---|---|
| `src/lib/routes.ts` | Every Highland filename → Next path. The only place a route string is decided. |
| `src/lib/routes.test.ts` | That the map covers all 25 link patterns and round-trips. |
| `src/components/ui/index.ts` | Barrel re-export, so pages import one path. |
| `src/components/ui/page-head.tsx` | `PageHead`, `Crumb`, `CtaRow` — the hero band and its parts. |
| `src/components/ui/section.tsx` | `SectionHead`, `Eyebrow`, `ClosingCta`. |
| `src/components/ui/lists.tsx` | `CheckList`, `NumberedSteps`, `CapCard`. |
| `src/components/ui/markers.tsx` | `Pending`, `Confirmable`, `Mark` — absent content and unconfirmed facts. |
| `src/components/ui/*.test.ts` | One test file per component file. |
| `tools/check-parity.mjs` | Diffs a running route against the Highland HTML for the same page. |
| `src/app/(frontend)/page.tsx` | Home. Replaces the placeholder. |
| `src/app/(frontend)/about/page.tsx` | About. |
| `src/app/(frontend)/about/executive-management/page.tsx` | Executive management. |
| `src/app/(frontend)/clients/page.tsx` | Clients. |
| `src/app/(frontend)/partners/page.tsx` | Partners. |
| `src/app/(frontend)/resources/page.tsx` | Resource centre. |
| `src/app/(frontend)/downloads/page.tsx` | Downloads. |
| `src/app/(frontend)/blog/page.tsx` | Blog index. |
| `src/app/(frontend)/careers/page.tsx` | Careers. |
| `src/app/(frontend)/careers/open-positions/page.tsx` | Open positions. |
| `src/app/(frontend)/careers/e-academy/page.tsx` | Edge E-Academy. |
| `src/app/(frontend)/careers/internships/page.tsx` | Internships. |
| `src/app/(frontend)/contact/page.tsx` | Contact. Form shell only; Phase 6 fills it. |
| `src/app/(frontend)/subscribe/page.tsx` | Subscribe. Form shell only; Phase 6 fills it. |
| `src/seed/index.ts` | Modified: seed `accent` per family. |

Each page is one file because each is one route with one data shape; the shared parts are the `ui/` components, not a page base class.

---

## Task 1: The route map

Fourteen pages link to each other and to Phase 5's routes. Without one map, each page invents a convention and the parity checker cannot know what to compare against.

The scheme is **nested** (`/solutions/enterprise-network`), not Highland's flat `solution-enterprise-network.html`. Two things already committed to nested and must keep working: `src/components/chrome.tsx` links `/solutions/${slug}`, and the seed wrote `page-copy.resourceSections[].href` as `/resources/media/...`. Nothing links to `executive-management.html` in Highland — it is a generated orphan — and it becomes `/about/executive-management`, which is where a reader would look for it.

**Files:**
- Create: `src/lib/routes.ts`
- Create: `src/lib/routes.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `type HighlandFile = string` — a filename as Highland emits it, e.g. `"solution-cybersecurity.html"`.
  - `routeFor(file: HighlandFile): string` — throws on an unrecognised pattern rather than returning a guess.
  - `STATIC_ROUTES: Record<string, string>` — the fourteen slug-less pages, filename → path.
  - `publishedOnly<T extends { _status?: string | null }>(docs: (T | number | string | null | undefined)[]): T[]` — drops ids, nulls and anything whose `_status` is not `"published"`. Review Focus #2.

- [ ] **Step 1: Write the failing tests**

In `src/lib/routes.test.ts`, assert `routeFor` against every pattern Highland emits:

```ts
expect(routeFor("index.html")).toBe("/");
expect(routeFor("about.html")).toBe("/about");
expect(routeFor("executive-management.html")).toBe("/about/executive-management");
expect(routeFor("careers-open-positions.html")).toBe("/careers/open-positions");
expect(routeFor("careers-e-academy.html")).toBe("/careers/e-academy");
expect(routeFor("careers-internships.html")).toBe("/careers/internships");
expect(routeFor("solution-cybersecurity.html")).toBe("/solutions/cybersecurity");
expect(routeFor("service-procurement-supply.html")).toBe("/services/procurement-supply");
expect(routeFor("project-siinqee-bank-datacenter-power.html")).toBe("/projects/siinqee-bank-datacenter-power");
expect(routeFor("news-digital-transformation-meeting.html")).toBe("/news/digital-transformation-meeting");
expect(routeFor("event-gitex-global-2026.html")).toBe("/events/gitex-global-2026");
expect(routeFor("job-hr-manager.html")).toBe("/careers/open-positions/hr-manager");
expect(routeFor("media-documentaries.html")).toBe("/resources/media/documentaries");
expect(() => routeFor("nonsense.html")).toThrow(/nonsense\.html/);
```

Add a test that reads every `href="*.html"` out of `design-files/highland/` and asserts `routeFor` handles each — so a pattern nobody anticipated fails here rather than as a dead link. Assert the count is at least 24.

Add `publishedOnly` tests: a published doc survives; `_status: "draft"` is dropped; a bare `7` is dropped; `null` and `undefined` are dropped; a doc with no `_status` is dropped (fails closed, as `approvedLogo` does).

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/lib/routes.test.ts`
Expected: FAIL, `Cannot find module './routes'`.

- [ ] **Step 3: Implement `src/lib/routes.ts`**

`STATIC_ROUTES` as a literal object; `routeFor` matches the six `<prefix>-<slug>.html` families by prefix and falls back to `STATIC_ROUTES`, throwing a message naming the unrecognised file and pointing at this map.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/lib/routes.test.ts`
Expected: PASS.

- [ ] **Step 5: Correct the seeded hrefs that disagree with the map**

`src/seed/index.ts` writes `site-settings.nav[].href` and `page-copy.resourceSections[].href` from Highland filenames with inline `.replace()` calls. Replace both with `routeFor(...)` so there is one translation, then `npm run seed:force` and confirm `seed:verify` still prints PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/routes.ts src/lib/routes.test.ts src/seed/index.ts
git commit -m "Map Highland's filenames to routes in one place"
```

---

## Task 2: Seed the per-family accent colour

`Solutions.accent` and `Services.accent` exist in the schema and are seeded — with a single hardcoded value each, so all seven solutions are `#0888c5` and all six services `#056a9a`. Verified against the deployed database. The approved content gives every family its own colour in `ACCENT` (`design-src/highland/content.mjs`), and Highland colours cards, chips, borders and hero washes by family. Left as-is, Phase 4's pages lose that distinction everywhere at once.

**Files:**
- Modify: `src/seed/index.ts` (the solutions and services writes)
- Modify: `src/seed/verify.ts`

**Interfaces:**
- Consumes: `ACCENT` from `design-src/highland/content.mjs` — `Record<string, string>` of slug → hex.
- Produces: every solution and service document carrying its own `accent`.

- [ ] **Step 1: Add the failing check to `seed:verify`**

Assert each solution's and service's `accent` equals `ACCENT[slug]`, and that the solutions' accents are not all equal. Numbers written out: 7 solutions, 6 services, 13 slugs in `ACCENT`.

- [ ] **Step 2: Run it against the current database to watch it fail**

Run: `npm run seed:verify`
Expected: FAIL naming solutions whose accent is `#0888c5` rather than their own.

- [ ] **Step 3: Seed `accent` from the map**

Replace the two literals with a lookup keyed on the slug, throwing on a slug missing from `ACCENT` rather than defaulting to a colour — a silently wrong colour is the failure this task exists to fix.

- [ ] **Step 4: Reseed and verify**

Run: `npm run seed:force && npm run seed:verify`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/seed/index.ts src/seed/verify.ts
git commit -m "Give each solution and service its own accent colour"
```

---

## Task 3: The UI primitives

`design-src/highland/ui.mjs` holds twelve functions that return HTML strings; every page is built from them. Porting them once as components is what makes the remaining page tasks thin. Read the originals for the exact markup and class lists — they are the approved design, and this task is a translation, not a redesign.

`Pending`, `Confirmable` and `Mark` carry Review Focus #1 and #4: content Edge still owes, and facts not yet confirmed, are *expected* states on these pages and must render a visible marker.

**Files:**
- Create: `src/components/ui/page-head.tsx`, `section.tsx`, `lists.tsx`, `markers.tsx`, `index.ts`
- Create: `src/components/ui/markers.test.ts`, `lists.test.ts`

**Interfaces:**
- Consumes: `approvedLogo`, `MediaDoc` from `src/lib/media.ts`.
- Produces, all server components taking plain props:
  - `PageHead({ eyebrow?, title, intro?, accent?, variant?, crumb?, meta?, ctas? })` — `variant` is `"wash" | "rule" | "grid" | "beam"`, default `"wash"`; `accent` defaults to `"#0888c5"`.
  - `Crumb({ trail }: { trail: { label: string; href?: string }[] })`
  - `CtaRow({ primary, secondary?, accent? })` where each cta is `{ label: string; href: string }`
  - `SectionHead({ eyebrow?, title, intro?, accent?, wide? })`
  - `Eyebrow({ children, className? })`
  - `ClosingCta({ title, body, primary, secondary?, accent? })`
  - `CheckList({ items, accent?, cols? })` — `items: string[]`
  - `NumberedSteps({ steps, accent? })` — `steps: { title: string; body: string }[]`
  - `CapCard({ title, body })` — the heading-plus-paragraph card the bands block renders
  - `Pending({ children })` — the marker for content Edge has not supplied
  - `Confirmable({ value })` taking `{ value?: string | null; status: "confirmed" | "pending"; pendingLabel?: string | null }` and rendering the value when confirmed, the `pendingLabel` in a `Pending` when not
  - `Mark({ item, h?, box? })` — a logo through `approvedLogo`, falling back to the institution's name set in the same frame

- [ ] **Step 1: Write the failing tests for the markers and lists**

These four are the ones with behaviour rather than markup:

```ts
// Confirmable — Review Focus #4
expect(render(<Confirmable value={{ value: "2024", status: "confirmed" }} />)).toContain("2024");
const pending = render(<Confirmable value={{ value: null, status: "pending", pendingLabel: "Year to confirm" }} />);
expect(pending).toContain("Year to confirm");
expect(pending).not.toContain("null");
// a confirmed status with no value must not render an empty marker-less blank
expect(render(<Confirmable value={{ value: null, status: "confirmed" }} />)).toContain("—");

// Mark — Review Focus #1 and the media gate
expect(render(<Mark item={{ name: "Gadaa Bank", logo: { url: "/m/g.png", approved: true } }} />)).toContain("/m/g.png");
const unapproved = render(<Mark item={{ name: "Gadaa Bank", logo: { url: "/m/g.png", approved: false } }} />);
expect(unapproved).not.toContain("/m/g.png");
expect(unapproved).toContain("Gadaa Bank");
expect(render(<Mark item={{ name: "Gadaa Bank", logo: null }} />)).toContain("Gadaa Bank");

// CheckList and NumberedSteps on empty input render nothing, not an empty list
expect(render(<CheckList items={[]} />)).toBe("");
expect(render(<NumberedSteps steps={[]} />)).toBe("");
```

`render` is `renderToStaticMarkup` from `react-dom/server`. Tests import from `"./markers"` and `"./lists"` — relative, because vitest has no `@/` alias. Note `vitest.config.ts` sets `environment: "node"`; `renderToStaticMarkup` needs no DOM, so this stays as-is.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/components/ui`
Expected: FAIL, modules not found.

- [ ] **Step 3: Implement the twelve components**

Port the markup and class lists verbatim from `design-src/highland/ui.mjs`. Two translations to make deliberately: Highland's `esc()` disappears, because React escapes by default; and `${}` interpolation of HTML becomes children rather than `dangerouslySetInnerHTML`, except where the approved copy itself contains an entity, which `page-copy.ts` already decoded to plain text.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/components/ui`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui
git commit -m "Port Highland's rendering primitives as components"
```

---

## Task 4: The parity checker

"Parity check passes per page" is the spec's done-when for this phase, and it needs a mechanism. `tools/check-links.mjs` and `tools/check-render.mjs` both take a directory of static HTML and cannot see a running app.

This compares **content**, not pixels: the visible text, the heading structure and the link targets. The theme is already ported and shared, so a styling diff is not what this is for; a dropped section, a wrong sentence or a link to a route nobody built is.

**Files:**
- Create: `tools/check-parity.mjs`
- Modify: `package.json` (add `check:parity`)

**Interfaces:**
- Consumes: `routeFor` from `src/lib/routes.ts`; `design-files/highland/*.html`; a running server at `$BASE_URL` (default `http://localhost:3000`).
- Produces: `node tools/check-parity.mjs [page…]` exiting non-zero with a per-page diff. With no arguments it checks the fourteen static pages.

- [ ] **Step 1: Write the checker**

For each page: read `design-files/highland/<file>.html`, fetch `routeFor(file)` from `$BASE_URL`, and from each extract (a) visible text with tags stripped, entities decoded and whitespace collapsed, (b) the ordered list of `h1`–`h3` text, (c) the set of link targets with Highland's mapped through `routeFor`. Report sentences present in one and not the other, headings out of order or missing, and link targets that differ.

Normalise two things that differ legitimately and would otherwise drown the signal: the copyright year, and Highland's `?v=` cache-busting query strings.

- [ ] **Step 2: Prove it fails on a real difference**

Run it against the unported placeholder home page.
Run: `npm run check:parity -- index`
Expected: FAIL, reporting most of Highland's home-page copy missing.

- [ ] **Step 3: Prove it passes on an identical pair**

Point it at a page whose Highland HTML is its own source — check `about` against `about` by temporarily passing the Highland file as both sides — and confirm it reports no differences. This proves the normaliser is not reporting noise.

- [ ] **Step 4: Commit**

```bash
git add tools/check-parity.mjs package.json
git commit -m "Check a rendered route against its Highland page"
```

---

## Task 5: Home

The largest page and the one that exercises the most of the read layer: impact counters, six featured projects in order, the seven solution families, technology priorities, industries, differentiators, client sectors, featured partners and the latest posts.

Carries Review Focus #5: the 100% counter's qualifier lives in `impact[].line`, a sibling of `figure` and `unit`. Rendering the figure without the line publishes a bare "100% completion".

**Files:**
- Modify: `src/app/(frontend)/page.tsx` (replaces the placeholder)
- Create: `src/app/(frontend)/page.test.ts`

**Interfaces:**
- Consumes: `PageHead`, `SectionHead`, `CapCard`, `Mark`, `Confirmable`, `Pending` (Task 3); `routeFor`, `publishedOnly` (Task 1); from `src/lib/content.ts` — `getSiteSettings`, `getCompany`, `getPageCopy`, `getSolutions`, `getProjects`, `getClients`, `getPartners`, `getPosts`.
- Produces: the `/` route, plus two helpers exported from the page file so they can be tested without rendering it:
  - `featuredProjects(projects: Project[]): Project[]` — the featured ones, ascending by `order`
  - `impactCard(counter: { figure: string; unit: string; line?: string | null }): string` — renders figure, unit and line together

- [ ] **Step 1: Write the failing test**

A unit test over the page's data assembly, not its markup. Extract the ordering and filtering into `featuredProjects(projects)` exported from the page file and assert:

```ts
// six featured, in order, from the real seeded shape
expect(featuredProjects(PROJECTS).map(p => p.slug)).toEqual([
  "bahir-dar-university-smart-classrooms",
  "bahir-dar-university-safe-campus",
  "gadaa-bank-computing-infrastructure",
  "national-bank-ethiopia-backup-infrastructure",
  "ministry-urban-infrastructure-computing",
  "siinqee-bank-datacenter-power",
]);
// Review Focus #5: every impact counter renders its line
expect(impactCard({ figure: "100%", unit: "completion", line: "against agreed project scope" }))
  .toContain("against agreed project scope");
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run "src/app/(frontend)/page.test.ts"`
Expected: FAIL, exports not found.

- [ ] **Step 3: Build the page**

Read `design-src/highland/pages/home.mjs` for the sections, their order and their copy. The hero's two paragraphs come from `page-copy.homeHero.intro` and `.introSecondary`. Priorities come from `page-copy.homePriorities` — the home page's six, **not** the solutions overview's five.

- [ ] **Step 4: Run the tests and the parity check**

Run: `npx vitest run "src/app/(frontend)"` then `npm run dev` and `npm run check:parity -- index`
Expected: both PASS.

- [ ] **Step 5: Commit**

```bash
git add "src/app/(frontend)/page.tsx" "src/app/(frontend)/page.test.ts"
git commit -m "Port the home page onto the CMS"
```

---

## Task 6: About and executive management

Two pages from one data source. Executive management carries Review Focus #1 most directly: all five executive biographies and portraits are content Edge has not supplied, so every one renders a pending marker today, and that is the correct output rather than a gap to fill with placeholder prose.

Nothing in Highland links to `executive-management.html`. This task gives it the route `/about/executive-management` and a link from `/about`, because an orphan page is one nobody reads.

**Files:**
- Create: `src/app/(frontend)/about/page.tsx`
- Create: `src/app/(frontend)/about/executive-management/page.tsx`
- Create: `src/app/(frontend)/about/executive-management/page.test.ts`

**Interfaces:**
- Consumes: Task 3's components; `getCompany`, `getSiteSettings`, `getSolutions`, `getContactDetails` from `src/lib/content.ts`.
- Produces: `/about` and `/about/executive-management`, plus
  - `executiveCard(role: { role: string; name?: string | null; bio?: string | null }): string`

- [ ] **Step 1: Write the failing test for the pending executives**

```ts
// Review Focus #1: a role with no bio renders its marker, never "undefined"
const card = executiveCard({ role: "Chief Technology Officer", name: null, bio: null });
expect(card).toContain("Chief Technology Officer");
expect(card).toMatch(/to be (announced|confirmed)/i);
expect(card).not.toContain("undefined");
expect(card).not.toContain("null");
```

Read `design-src/highland/pages/executive-management.mjs` for the approved wording of that marker and assert the real string, not a regex, once you have it.

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run "src/app/(frontend)/about"`
Expected: FAIL.

- [ ] **Step 3: Build both pages**

Read `about.mjs` and `executive-management.mjs`. The about hero's intro interpolates the short name — `page-copy.aboutHero.intro` already carries it as a template string over `COMPANY.short`. Add the link to `/about/executive-management` in about's leadership section.

- [ ] **Step 4: Run the tests and the parity checks**

Run: `npx vitest run "src/app/(frontend)/about"` then `npm run check:parity -- about executive-management`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add "src/app/(frontend)/about"
git commit -m "Port the about and executive management pages"
```

---

## Task 7: Clients and partners

Both are logo directories over mostly-absent marks: 9 of 10 client logos and 29 of 32 partner marks are not yet supplied. `Mark` (Task 3) already falls back to the name; these pages must not also print a count of what is missing or an apology for it.

Both group their records: clients by sector via `SECTOR_SHORT` from `src/fields/sectors.ts`, partners by the ten `partnerCategories`. A partner carries `categories` as a relationship array, so grouping needs `publishedOnly` (Task 1) — Review Focus #2.

**Files:**
- Create: `src/app/(frontend)/clients/page.tsx`
- Create: `src/app/(frontend)/partners/page.tsx`
- Create: `src/app/(frontend)/partners/page.test.ts`

**Interfaces:**
- Consumes: Task 3's components; `SECTOR_OPTIONS`, `SECTOR_SHORT` from `src/fields/sectors.ts`; `getClients`, `getPartners`, `getPartnerCategories`, `getProjects`, `getSolutions`.
- Produces: `/clients` and `/partners`, plus
  - `byCategory(partners: Partner[], categories: PartnerCategory[]): Record<string, Partner[]>`
  - `bySector(clients: Client[]): Record<SectorSlug, Client[]>`

- [ ] **Step 1: Write the failing test for grouping**

```ts
// every partner appears under at least one category, and none is dropped
const grouped = byCategory(PARTNERS, PARTNER_CATEGORIES);
expect(new Set(Object.values(grouped).flat().map(p => p.name)).size).toBe(32);
// Review Focus #2: a category whose document is unpublished is not a group
expect(byCategory([{ name: "X", categories: [{ key: "network", _status: "draft" }] }], CATS)).toEqual({});
// clients group by the three approved sectors and nothing else
expect(Object.keys(bySector(CLIENTS)).sort()).toEqual(["banking", "education", "government"]);
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run "src/app/(frontend)/partners"`
Expected: FAIL.

- [ ] **Step 3: Build both pages**

Read `clients.mjs` and `partners.mjs`. Partner cards colour by their solution's `accent`, which Task 2 made per-family.

- [ ] **Step 4: Run the tests and the parity checks**

Run: `npx vitest run "src/app/(frontend)/partners"` then `npm run check:parity -- clients partners`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add "src/app/(frontend)/clients" "src/app/(frontend)/partners"
git commit -m "Port the client and partner directories"
```

---

## Task 8: Resources and downloads

The resource centre indexes six sections and counts what is in each; downloads lists four documents behind the approval gate. Carries Review Focus #3: an editor can un-approve every download in one click, and `/downloads` must then say so rather than render an empty grid.

Downloads also gate on `approved`, which `src/lib/content.ts` does **not** currently filter — `getDownloads()` returns all of them. Deciding that filter is part of this task: the file relationship is gated at selection time only, so the read side has to drop an un-approved document the way `approvedLogo` drops an un-approved image.

**Files:**
- Create: `src/app/(frontend)/resources/page.tsx`
- Create: `src/app/(frontend)/downloads/page.tsx`
- Create: `src/app/(frontend)/downloads/page.test.ts`
- Modify: `src/lib/content.ts` (`getDownloads` gates on `approved`)
- Modify: `src/lib/content.test.ts`

**Interfaces:**
- Consumes: Task 3's components; `routeFor` (Task 1); `getPageCopy`, `getDownloads`, `getNews`, `getEvents`, `getPosts`.
- Produces: `/resources`, `/downloads`, `getDownloads()` returning only approved documents, plus
  - `approvedDownloads(docs: Download[]): Download[]` — the read-side gate, absent approval failing closed
  - `downloadsBody(docs: Download[]): string` — the list, or the empty state when there are none

- [ ] **Step 1: Write the failing tests**

```ts
// Review Focus #3
expect(downloadsBody([])).toMatch(/no documents|nothing to download/i);
// the approval gate on read, not only on selection
expect(approvedDownloads([{ title: "A", approved: true }, { title: "B", approved: false }]))
  .toEqual([{ title: "A", approved: true }]);
expect(approvedDownloads([{ title: "C" }])).toEqual([]); // absent approval fails closed
```

Extend `src/lib/content.test.ts`'s structural checks so `getDownloads` is asserted to pass through the gate, the way the published filter is asserted.

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run "src/app/(frontend)/downloads" src/lib/content.test.ts`
Expected: FAIL.

- [ ] **Step 3: Build both pages and add the gate**

Read `resources.mjs` and `downloads.mjs`. The six section cards come from `page-copy.resourceSections`, whose `href` Task 1 made a real route.

- [ ] **Step 4: Run the tests and the parity checks**

Run: `npx vitest run` then `npm run check:parity -- resources downloads`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add "src/app/(frontend)/resources" "src/app/(frontend)/downloads" src/lib/content.ts src/lib/content.test.ts
git commit -m "Port the resource centre and gate downloads on approval"
```

---

## Task 9: Blog

Ten posts in ten categories, each pointing at a target solution. Carries Review Focus #2 at its sharpest: every post links to its target, and a post whose target solution was unpublished would link to a 404 while the post itself stays published.

**Files:**
- Create: `src/app/(frontend)/blog/page.tsx`
- Create: `src/app/(frontend)/blog/page.test.ts`

**Interfaces:**
- Consumes: `publishedOnly`, `routeFor` (Task 1); Task 3's components; `getPosts`, `getPostCategories`.
- Produces: `/blog`, plus
  - `postCard(post: Post): string` — linked to its target only when that target is published

- [ ] **Step 1: Write the failing test**

```ts
// Review Focus #2: a post whose target is unpublished renders without a link,
// not with a link to a page that 404s
const withDraftTarget = { slug: "p", title: "P", target: { slug: "s", _status: "draft" } };
expect(postCard(withDraftTarget)).not.toContain("/solutions/s");
expect(postCard(withDraftTarget)).toContain("P");
expect(postCard({ slug: "p", title: "P", target: { slug: "s", _status: "published" } }))
  .toContain("/solutions/s");
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run "src/app/(frontend)/blog"`
Expected: FAIL.

- [ ] **Step 3: Build the page**

Read `blog.mjs`. Category filtering is client-side in Highland via CSS classes; keep that, so the page stays a server component.

- [ ] **Step 4: Run the tests and the parity check**

Run: `npx vitest run "src/app/(frontend)/blog"` then `npm run check:parity -- blog`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add "src/app/(frontend)/blog"
git commit -m "Port the blog index"
```

---

## Task 10: The four careers pages

Careers, open positions, E-Academy and internships, all from `careers-content` and `jobs`. Carries Review Focus #3: there are two jobs today and an editor can unpublish both, so `/careers/open-positions` needs an empty state. E-Academy additionally reads `academyTracks`, each with a solution relationship — `publishedOnly` again.

**Files:**
- Create: `src/app/(frontend)/careers/page.tsx`
- Create: `src/app/(frontend)/careers/open-positions/page.tsx`
- Create: `src/app/(frontend)/careers/e-academy/page.tsx`
- Create: `src/app/(frontend)/careers/internships/page.tsx`
- Create: `src/app/(frontend)/careers/open-positions/page.test.ts`

**Interfaces:**
- Consumes: Task 3's components; `routeFor`, `publishedOnly` (Task 1); `getCareersContent`, `getJobs`, `getAcademyTracks`, `getSolutions`.
- Produces: the four `/careers/*` routes, plus
  - `positionsBody(jobs: Job[]): string` — the list, or the empty state
  - `jobRow(job: Job): string` — one row, linked through `routeFor`

- [ ] **Step 1: Write the failing tests**

```ts
// Review Focus #3
expect(positionsBody([])).toMatch(/no open (positions|roles)/i);
// the ladder renders the stored value verbatim, including "Manager"
expect(jobRow({ slug: "hr-manager", title: "HR Manager", level: "Manager", department: "People" }))
  .toContain("Manager");
// and links through the route map, not a hand-built path
expect(jobRow({ slug: "hr-manager", title: "x", level: "Manager", department: "y" }))
  .toContain("/careers/open-positions/hr-manager");
```

No test may assert a salary, a benefit or an employment condition appears, because no field holds one.

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run "src/app/(frontend)/careers"`
Expected: FAIL.

- [ ] **Step 3: Build the four pages**

Read the four `careers*.mjs` modules. Internships is the smallest — one `INTERNSHIP` object. E-Academy is the largest, with audiences, tracks, levels, delivery modes and course sections.

- [ ] **Step 4: Run the tests and the parity checks**

Run: `npx vitest run "src/app/(frontend)/careers"` then `npm run check:parity -- careers careers-open-positions careers-e-academy careers-internships`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add "src/app/(frontend)/careers"
git commit -m "Port the four careers pages"
```

---

## Task 11: Contact and subscribe

Both pages are forms, and **forms are Phase 6**. This task ports everything around the form — the hero, the real contact facts, the inquiry categories, the office hours, the map link — and renders the form as a disabled shell with a visible note that it is not yet live. A form that looks live and silently discards a submission is worse than one that says it is coming.

`contact-details` is admin-only for a reason: the inherited page carried the wrong office address and telephone number. Every fact here comes from the CMS.

**Files:**
- Create: `src/app/(frontend)/contact/page.tsx`
- Create: `src/app/(frontend)/subscribe/page.tsx`
- Create: `src/app/(frontend)/contact/page.test.ts`

**Interfaces:**
- Consumes: Task 3's components (`field` and `formNote` from `ui.mjs` port here); `getContactDetails`, `getSolutions`.
- Produces: `/contact` and `/subscribe`, plus
  - `contactBody(contact: ContactDetail): string`
  - `formShell(): string` — the disabled form with its visible not-yet-live note

- [ ] **Step 1: Write the failing test**

```ts
// the real facts, from the CMS, and the shell is honestly inert
const page = contactBody(CONTACT_FIXTURE);
expect(page).toContain("BMA Plaza, 9th Floor");
expect(page).toContain("+251 95 569 5565");
expect(page).not.toMatch(/lubaba/i);          // the inherited address
expect(page).not.toContain("info@edgecomm");  // the inherited mailbox
expect(formShell()).toContain("disabled");
expect(formShell()).toMatch(/not yet (live|accepting)/i);
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run "src/app/(frontend)/contact"`
Expected: FAIL.

- [ ] **Step 3: Build both pages**

Read `contact.mjs` and `subscribe.mjs`. The seven inquiry categories come from `contact-details.inquiryCategories`.

- [ ] **Step 4: Run the tests and the parity checks**

The parity checker will report the form's inputs as a difference, because Highland's are not disabled. Pass `--allow-form-diff` for these two pages and record why in the command.

Run: `npx vitest run "src/app/(frontend)/contact"` then `npm run check:parity -- contact subscribe --allow-form-diff`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add "src/app/(frontend)/contact" "src/app/(frontend)/subscribe"
git commit -m "Port the contact and subscribe pages, form shells inert"
```

---

## Task 12: Whole-phase verification

The fourteen pages exist; this proves they hold together and that nothing outside Phase 4 broke.

**Files:**
- Modify: `tools/check-parity.mjs` if the sweep finds a normalisation gap
- Modify: `deploy/README.md`

**Interfaces:**
- Consumes: every route from Tasks 5–11 and the checker from Task 4.
- Produces: nothing later depends on. This task is the phase's gate, not a component.

- [ ] **Step 1: Parity across all fourteen**

Run: `npm run check:parity`
Expected: PASS for all fourteen with no arguments.

- [ ] **Step 2: Every internal link resolves**

Extend the sweep to assert every `href` the fourteen pages emit is either an implemented route or a Phase 5 route listed in `routeFor`, and that no page links to a `.html` file.

- [ ] **Step 3: The full suite, types and build**

Run: `npx vitest run`, `npx tsc --noEmit`, `npx next build`
Expected: all clean. The build prerenders the static pages, so it also proves each one renders against the real database.

- [ ] **Step 4: Deploy and check against the server**

Run: `git bundle create /tmp/edge.bundle payload-cms-integration`, scp it, then `ssh root@168.119.61.125 /usr/local/sbin/edge-redeploy`, then `BASE_URL=https://168.119.61.125 npm run check:parity` with certificate verification off, since the interim certificate is self-signed.
Expected: PASS against the deployed URL.

- [ ] **Step 5: Record what Phase 4 changed in the runbook, and commit**

```bash
git add deploy/README.md tools/check-parity.mjs
git commit -m "Verify the fourteen static pages against Highland"
```

---

## Done when

- `npm run check:parity` passes for all fourteen pages, locally and against the deployed URL.
- No page links to a `.html` file, and every internal link is a route `routeFor` knows.
- `npx vitest run`, `npx tsc --noEmit` and `npx next build` are clean.
- Every solution and service carries its own accent colour; `seed:verify` enforces it.
- Content Edge still owes renders as a visible pending marker on every page that touches it.
- `/downloads` shows only approved documents, and says so when there are none.
- No rendered string carries a partnership tier, an authorization level, a certification tier, a salary or a benefit.

Phase 5 (dynamic routes) begins from here, against a working primitive set and route map.
