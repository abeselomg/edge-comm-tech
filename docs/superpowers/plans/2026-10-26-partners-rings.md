# Partners Page — Layered Logo Rings Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the partners-page hero diagram — ten capability-group bubbles on one ring — with three concentric, slowly turning rings carrying all published partners: a logo where approved artwork exists, the partner's name in the same card where it does not.

**Architecture:** A pure layout function (`ringLayout`) divides the partner list over three rings and gives every card an angle; a server component (`PartnerRings`) renders them with CSS only (no client JS), using the existing `eg-spin` keyframes and counter-rotating each card so it stays upright. The capability-group filter (hidden radios + `filterCss`) and the brand grid below are unchanged; the ring no longer takes part in filtering. The diagram is decorative (`aria-hidden`): the brand grid below is the accessible, complete list.

**Tech Stack:** Next.js 15 App Router (server component), Tailwind 4 + `globals.css` keyframes, vitest 3, `tools/check-parity.mjs`.

**Source of the request:** the project owner, 2026-10-26: "reflect them here … different circular layers of logos, not categories", all 32 partners, the 19 without a logo showing their name in the same frame; mockup approved. Layout not chosen by the owner — ruled below.

## Global Constraints

- Only approved media is shown: logos come through `getPartners()` (already `approvedLogo`-gated); never read `logo` any other way. The brand's name is shown wherever there is no approved logo.
- No ranking or tier language, and nothing that implies it: no labels on rings, no ordering by importance, no text such as "primary", "strategic", "certified", "authorized", "gold". Order on rings is deliberately mixed (see Task 1). The page's existing disclaimer paragraph stays untouched.
- The brand short name is "Edge Comm-Tech". The four forbidden organisations (Bonga, Haramaya, Mizan-Tepi, Yekatit 12) appear nowhere, including fixtures.
- Never modify `design-src/` or `design-files/`. No prettier on this repo. `.env` untouched. No new dependency.
- A page file exports only `default`, `metadata`, `generateStaticParams`, `revalidate`, `dynamicParams`; helpers live in `partner-parts.tsx` / `rings.ts` / a component file.
- JSX collapses a newline between `{expr}` and adjacent punctuation; build such sentences as one template string.
- No Docker, local Postgres or machine-level commands (they crash the owner's machine). Everything is verified by unit tests, a static render harness in Chrome (Task 3), and — only after the owner agrees — the review server.
- Full vitest suite needs `--maxWorkers=2`. Run `npx eslint src` and `npx tsc --noEmit` before every commit (the server build lints).
- Commit messages end `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- No schema change (so no migration): `partnerCategories.ringLabel` and the seed's `RING_LABELS` stay, because the brand cards still show the ring label as a pill.

## Rulings carried into the plan

- **Layout:** the hero's two-column layout (text left, diagram right ≈ 34rem) cannot carry 32 cards legibly. The section becomes: eyebrow, headline, intro and "Show all N" centred above; the diagram below it, centred, `max-w-[56rem]`, square. Hidden below `md` (as today): on a phone the filter chips and brand grid do the job. Cost if wrong: one section's CSS.
- **Copy:** keep the eyebrow ("How the network is organised"), the headline ("Ten capability groups, one accountable integrator" — still true of the filter below) and every description. The ONE change is the intro sentence, which currently says "on the ring or in the list below": it becomes "Select a capability group in the list below to see the manufacturers and distributors Edge Comm-Tech works with in that area." This wording is the owner's/Edge's to approve; it is flagged in the final report.
- **Ring membership is decorative.** Order within the ring is the stored `order`, dealt round-robin across rings so logos and name-only cards mix on every ring.
- **Interaction:** none. The cards are not links or filters. Hover pauses the rotation.
- **Cap:** at most 48 partners are drawn on the rings so cards cannot crowd; the brand grid below always lists every partner.

## Review Focus

1. **A partner never appears with a logo it is not approved to show.** Un-approved or null logo → name card; the structural reading of `logo` goes only through the gated value. — Task 2.
2. **No overlap, no overflow.** At 1400, 1024 and 768 px wide, with 32 partners (and 5, and 48), no two cards' boxes intersect and no card leaves the diagram square; the page does not scroll sideways. — Tasks 1, 3.
3. **Cards stay upright while rings turn,** and nothing moves for visitors who prefer reduced motion. — Tasks 2, 3.
4. **The diagram adds no ranking.** No text other than partner names and the centre label; both a unit test over the rendered markup and the parity check enforce it. — Tasks 2, 3.
5. **The group filter still works** and the brand grid still shows all partners; removing the nodes must not break the `f-<key>` radios or `filterCss`. — Task 2.

---

## File Structure

- `src/app/(frontend)/partners/rings.ts` (new) + `rings.test.ts` — pure layout.
- `src/app/(frontend)/partners/PartnerRings.tsx` (new) + `PartnerRings.test.tsx` — the component.
- `src/app/(frontend)/partners/page.tsx`, `partner-parts.tsx`, `page.test.tsx` — layout change, intro sentence, dead-code removal (`orbit`, `RING`, node styles in `filterCss`).
- `src/app/(frontend)/globals.css` — ring classes (keyframes `eg-spin` already exists) and the reduced-motion list.
- `tools/check-parity.mjs` / `tools/parity-copy.mjs` + a test — a narrow, partners-only waiver for the diagram region and the one reworded sentence.

## Task 1: Ring layout, as a pure function

**Files:**
- Create: `src/app/(frontend)/partners/rings.ts`, `src/app/(frontend)/partners/rings.test.ts`

**Interfaces:**
- Produces: `ringLayout<T>(items: T[], opts?: { rings?: number[]; maxItems?: number }): RingCard<T>[]` where `RingCard<T> = { item: T; ring: 0 | 1 | 2; index: number; angle: number /* degrees, 0 = top, clockwise */; x: number; y: number /* % of the square, 0–100, card CENTRE */ }`; and `RING_RADII = [22, 33, 43]` (percent of the square's width).
- Counts per ring are proportional to radius (about 7 / 11 / 14 for 32 items); the same input always gives the same output; items are dealt round-robin in input order so neighbours on a ring are not neighbours in the list; each ring has a different start offset (so cards do not line up radially); `maxItems` defaults to 48 and drops the remainder; fewer than 3 items use only the first ring; 0 items → `[]`.

- [ ] **Step 1: Write the failing tests** — 32 items → ring counts 7/11/14 summing to 32; every item appears exactly once; deterministic (two calls equal); no two cards on the same ring closer than a minimum chord (assert `chord ≥ 0.9 × (2·π·r/count)` approx); ring offsets differ; 1, 2, 3, 5, 48, 100 items (100 → 48 returned); 0 → []; coordinates inside [3, 97]; a mix check — with every third item flagged `logo`, each ring contains both kinds.
- [ ] **Step 2: Run to verify failure** — `npx vitest run src/app/(frontend)/partners/rings.test.ts --maxWorkers=2` → FAIL.
- [ ] **Step 3: Implement** `ringLayout` and `RING_RADII`.
- [ ] **Step 4: Run tests, `npx tsc --noEmit`, `npx eslint src`** → PASS.
- [ ] **Step 5: Commit** — `git commit -m "Lay the partners out on three rings"`.

## Task 2: The component, the page, and the dead code

**Files:**
- Create: `src/app/(frontend)/partners/PartnerRings.tsx`, `PartnerRings.test.tsx`
- Modify: `src/app/(frontend)/partners/page.tsx`, `partner-parts.tsx`, `page.test.tsx`, `src/app/(frontend)/globals.css`

**Interfaces:**
- Consumes: `ringLayout`, `RING_RADII` (Task 1); `getPartners()` items (`WithLogo<Partner>`, logo already gated); the `Mark` component in `src/components/ui/markers.tsx` for a logo-or-name frame if it fits (read it first — the brand cards use it); otherwise render an `<img>` (logo, `alt` = partner name) or a `<span>` (name) directly.
- Produces: `PartnerRings({ partners }: { partners: WithLogo<Partner>[] })` — a server component: a square container (`aspect-square`, `container-type: size` so sizes use `cqw`), three ring wrappers each spinning (`eg-spin` keyframes, different durations 150s / 210s / 270s, alternating direction), dashed ring outlines (decorative), the centre disc ("Edge" / "Comm-Tech", as today), and one card per `RingCard` positioned by `left/top` in %. Each card counter-rotates (`animation` = the same duration, opposite direction) so text stays upright. `aria-hidden="true"` on the whole diagram; `hidden md:block`; `animation-play-state: paused` on hover; under `prefers-reduced-motion` all ring and card animations are off (extend the existing reduced-motion block in `globals.css`).
- Page change per the Rulings: the section becomes centred text above the diagram; the intro sentence changes as ruled; `orbit`, `RING`, the `nodes`/`ringOf`-for-diagram code and every node/spoke/pill selector in `filterCss` are removed (keep the filter logic for the brand cards and the `.l-*` lede spans, and keep `ringOf` for `brandCard`).

- [ ] **Step 1: Write the failing tests**
  - `PartnerRings.test.tsx` (render with `renderToStaticMarkup`): 32 partners → 32 cards; a partner with an approved logo renders an `<img>` with `alt` equal to the partner's name and no name text; a partner whose logo is `null`, `approved: false` or has no `url` renders its name and no `<img>`; the whole diagram is `aria-hidden="true"`; the only text in the output is the 32 names plus "Edge" and "Comm-Tech" (no "brands", no category labels, no digits) — Review Focus #4; 0 partners → renders nothing; 60 partners → 48 cards; every card has an inline `left`/`top` percentage within 3–97; ring wrappers carry distinct animation durations; markup contains no `href` and no `<label>`.
  - `page.test.tsx`: the intro sentence is the new one and no longer contains "on the ring"; the headline still reads "Ten capability groups, one accountable integrator" for ten groups; the `f-all` and `f-<key>` radios and the "Show all N" label are still present; every partner still appears once in the brand grid; no `orbit`/`RING` export remains in `partner-parts.tsx` (structural test).
  - `globals.css` structural test (read the file): the reduced-motion block lists the new ring and card classes.
- [ ] **Step 2: Run to verify failure** — `npx vitest run "src/app/(frontend)/partners" --maxWorkers=2` → FAIL.
- [ ] **Step 3: Implement** the component, CSS classes (`eg-ring`, `eg-ring-card`, …), the page change and the dead-code removal.
- [ ] **Step 4: Run the full suite (`--maxWorkers=2`), `npx tsc --noEmit`, `npx eslint src`** → PASS.
- [ ] **Step 5: Commit** — `git commit -m "Show the partners on three turning rings"`.

## Task 3: Parity waiver and a visual check in Chrome

**Files:**
- Modify: `tools/check-parity.mjs` and/or `tools/parity-copy.mjs`; a test (e.g. `tools/parity-partners.test.ts`)
- Create (NOT committed — scratch outside the repo): a render harness script that server-renders `PartnerRings` (and the section around it) with the 32 real partner names, the 13 approved logos as local files, and the real `globals.css` compiled by Tailwind (or the page's CSS via the production build if available), writes static HTML, and screenshots it.

**Interfaces:**
- Parity: the diagram region of the partners page is excluded on both sides — Highland's ring block (its labels and "N brands" counts) and the port's `PartnerRings` output — through a narrow, partners-only rule; the reworded intro sentence is waived the same way (Highland side rewritten to the new sentence, so only that substitution is allowed). Everything else on the page — headline, group list, descriptions, brand cards, the meaning section — must still be compared and still fail on change. Add tests proving (a) the aligned page passes, (b) a changed sentence elsewhere on the partners page still fails, (c) the waiver does not apply to any other page, (d) `--self` still passes for all Highland pages.
- Visual harness checks, at viewport widths 1400, 1024, 768 and 390 and with counts 32, 5 and 48: at ≥ 768 the diagram is visible, no card's bounding box intersects another's, no card extends beyond the diagram square, `document.documentElement.scrollWidth <= innerWidth` (no sideways scroll); at 390 the diagram is hidden; a card's computed rotation (product of ancestor spin and its own counter-spin) is ≈ 0° at two different animation times (use `page.clock` or `animation.currentTime`); with `emulateMedia({ reducedMotion: "reduce" })` the `getAnimations()` list on the diagram is empty. Save screenshots (1400 and 1024) to the scratchpad and report their full paths.

- [ ] **Step 1: Write the failing parity tests** — as above.
- [ ] **Step 2: Run to verify failure** — `npx vitest run tools --maxWorkers=2` → FAIL.
- [ ] **Step 3: Implement the waiver.**
- [ ] **Step 4: Build and run the harness** (no database: it renders with fixtures); fix any overlap or overflow it finds by adjusting the radii/offsets/card sizes in Tasks 1–2's code, with tests, and say what changed.
- [ ] **Step 5: Run the full suite (`--maxWorkers=2`), `npx tsc --noEmit`, `npx eslint src`** → PASS.
- [ ] **Step 6: Commit** — `git commit -m "Compare the partners page without the old diagram, and check the new rings in Chrome"`.

---

## Done when

- The partners hero shows all 32 partners on three turning rings — 13 with logos, 19 as name cards — with no category text, no labels and no hint of rank.
- The capability-group filter and the brand grid below work as before; nothing else on the page changed except the one reworded intro sentence.
- No overlap or sideways scroll at 1400, 1024, 768; hidden at 390; cards upright; no motion under reduced-motion — shown in Chrome.
- `npx vitest run --maxWorkers=2`, `npx tsc --noEmit`, `npx eslint src` clean; parity passes with only the partners waiver.
- **Not deployed:** the owner reviews the screenshots first. Deploying changes the page the client sees.
