# Payload CMS Foundation (Phases 0–3) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Put Edge's approved content model into the Payload CMS already in this repo, seeded from the Highland content modules, with Highland's visual theme and site chrome live — so Phases 4–5 can build pages against a working data layer.

**Architecture:** Thirteen content collections and five tabbed globals replace a schema built for the retired nine-service taxonomy. The content master's prohibitions are enforced as field validators and relationship filters rather than written as advice. A dependency-ordered seed imports `design-src/highland/*.mjs`, upserting by slug so a re-run never destroys an editor's work. Highland's Tailwind v4 theme and `eg-*` animation CSS replace the frontend's current teal/brass design system, and the 17 routes built on that system are retired first so the build never spends a dozen tasks broken.

**Tech Stack:** Next 15.4 (App Router), Payload 3.88 with `@payloadcms/db-postgres`, Postgres 16 via `docker compose`, Tailwind v4 (CSS-first `@theme`), Lexical rich text, vitest, `next/font/google`.

**Spec:** `docs/superpowers/specs/2026-10-10-payload-cms-port-design.md`

## Global Constraints

- **Payload 3.88.0 exactly.** Every `@payloadcms/*` package is pinned to `3.88.0` with no caret. New Payload packages match that version.
- **No field may exist for partnership type, authorization level or certification tier.** Absence is the enforcement mechanism.
- **"Tier III-aligned", never "Tier III-certified".**
- **The 100% impact figure always carries "against agreed project scope".**
- **CCTV, access control and barriers are IT infrastructure, not cybersecurity.**
- **Bahir Dar's campus spaces are "security control rooms", never "SOC".** This rule applies only to `projects`; "SOC" is legitimate on the cybersecurity solution page.
- **Only approved assets may be published** — every published image needs a recorded source, retrieval date and internal reviewer.
- **`design-src/content.json` must never be imported.** It is a NEXT IT-derived model and none of it is Edge's.
- **Nothing in `design-src/` or `design-files/` is deleted or modified by this plan.**
- **`posts` gets no detail route.** The master forbids thin article pages that exist only to add a click.
- **Highland's design ports as-is.** No re-skinning to the master's brand palette in this plan.
- **No host-specific API.** Media goes behind a storage abstraction; Vercel and a single VPS both stay available.
- All new code is TypeScript. Follow the existing conventions in `src/fields/slug.ts`, `src/access/index.ts` and `src/hooks/revalidate.ts`.

## Review Focus

Five failure modes the spec implies that no task's happy-path tests would exercise. Each has a test assigned to the task owning the code.

1. **A seed re-run after an editor has made changes must not clobber them.** The existing script clears collections before writing; the new one upserts by slug, and `--fresh` is the only way to wipe. *(Task 16)*
2. **An event whose date range straddles today must read as upcoming.** GITEX runs 7–11 December but Highland stores only `2026-12-07`; deriving status from a start date alone marks a running event past. *(Task 12)*
3. **A forbidden phrase can arrive inside rich text, not just a plain string.** Lexical stores a JSON node tree, so a validator that only inspects strings will pass `tier III certified` straight through. *(Task 3)*
4. **A project whose client name matches no client row must fail the seed loudly.** A silent `undefined` relationship produces a project page with no client and no error. *(Task 16)*
5. **An approved logo that is later un-approved must stop rendering.** `filterOptions` gates selection at edit time only; the read path needs its own check or an un-approved asset keeps publishing. *(Task 19)*

---

## File Structure

**Created:**

| File | Responsibility |
| --- | --- |
| `vitest.config.ts` | Test runner config, node environment |
| `src/fields/validators.ts` | Forbidden-phrase validator; Lexical text extraction |
| `src/fields/validators.test.ts` | Tests for the above |
| `src/fields/confirmable.ts` | `confirmable()` field-group helper |
| `src/fields/confirmable.test.ts` | Tests for the above |
| `src/collections/Services.ts` | 6 professional services |
| `src/collections/Clients.ts` | 10 client institutions |
| `src/collections/PartnerCategories.ts` | 10 partner capability groups |
| `src/collections/Posts.ts`, `PostCategories.ts` | 10 insight articles, 10 categories |
| `src/collections/Events.ts` | 3 events; status derived, not stored |
| `src/collections/Downloads.ts` | 4 documents with approval gate |
| `src/collections/AcademyTracks.ts` | 6 E-Academy tracks |
| `src/globals/Company.ts` | Profile, mission, values, journey, differentiators, sustainability, industries, delivery, executive roles |
| `src/globals/ContactDetails.ts` | Office, phones, emails, hours, 7 inquiry categories |
| `src/globals/Careers.ts` | Pathways, culture, development, internship, academy meta |
| `src/globals/PageCopy.ts` | Per-page heroes and section intros, resource sections, shared project copy |
| `src/lib/events.ts` | `eventStatus()` — pure date logic |
| `src/lib/events.test.ts` | Tests for the above |
| `src/seed/transform/*.ts` | Highland shape → Payload shape, pure functions |
| `src/seed/transform/*.test.ts` | Tests for the above |
| `src/seed/upsert.ts` | `upsertBySlug()` and the name→id resolver |
| `src/seed/verify.ts` | Row counts and dangling-relationship assertions |
| `src/components/chrome.tsx` | Rewritten: Highland header and footer |

**Modified:**

| File | Change |
| --- | --- |
| `package.json` | Add vitest, `@payloadcms/storage-s3@3.88.0`; add `test` and `seed:fresh` scripts |
| `src/app/(frontend)/globals.css` | Highland's `@theme` tokens and `eg-*` animation CSS replace the teal/brass system |
| `src/app/(frontend)/layout.tsx` | Geologica / Atkinson Hyperlegible / Fragment Mono replace Syne / IBM Plex |
| `src/collections/Media.ts` | Add `source`, `retrievedAt`, `reviewedBy`, `approved` |
| `src/collections/Solutions.ts` | Re-model to the 7 approved families with typed detail sections |
| `src/collections/Projects.ts` | Re-model; `client` becomes a relationship |
| `src/collections/Partners.ts` | Re-model to categories; no tier field |
| `src/collections/News.ts`, `Jobs.ts` | Re-model to approved fields |
| `src/globals/SiteSettings.ts` | Add impact counters with the qualifier validator |
| `src/payload.config.ts` | Register new collections and globals; add storage adapter |
| `src/lib/content.ts` | Trimmed in Task 6, rebuilt in Task 19 |
| `src/seed/index.ts` | Dependency-ordered upsert replacing clear-then-create |

**Deleted:**

| File | Why |
| --- | --- |
| `src/app/(frontend)/{about,academy,careers,clients,contact,news,partners,projects,solutions}/` | 17 routes built on the retired design system and schema; Phases 4–5 replace them |
| `src/collections/Sectors.ts`, `Courses.ts` | Replaced by a `sector` select on `clients` and by `academyTracks` |
| `src/globals/HomePage.ts`, `CompanyPage.ts` | Replaced by `PageCopy` and `Company` |
| `src/seed/data/{solutions,sectors,courses,partners,globals}.ts` | Old-model seed data; the new seed reads `design-src/highland/*.mjs` |

---

## Prerequisite: database running

Every task from 8 onward needs Postgres. Start it once:

```bash
docker compose up -d        # Postgres on localhost:5434
```

Confirm with `docker compose ps`. If `DATABASE_URI` or `PAYLOAD_SECRET` is unset, copy `.env.example` to `.env` and generate a secret with
`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.

---

## Phase 0 — Foundations

### Task 1: Spike — does form-builder accept a custom upload field?

Throwaway investigation. Its output is an answer recorded in the spec, not code we keep.

**Files:**
- Modify: `docs/superpowers/specs/2026-10-10-payload-cms-port-design.md` (append findings to *Open items*)
- Modify: `src/payload.config.ts` (temporarily, reverted in Step 4)

**Interfaces:**
- Consumes: nothing
- Produces: a recorded decision that Phase 6 depends on. No code.

- [ ] **Step 1: Read the plugin's field configuration surface**

```bash
sed -n '1,80p' node_modules/@payloadcms/plugin-form-builder/dist/types.d.ts
grep -rn "fields" node_modules/@payloadcms/plugin-form-builder/dist/plugin.d.ts
```

Looking for whether `formBuilderPlugin({ fields: { ... } })` accepts an arbitrary
Payload `Block` alongside its built-ins (`text`, `textarea`, `select`,
`checkbox`, `email`, `number`, `message`, `payment`).

- [ ] **Step 2: Try the smallest possible custom field**

Add to `src/payload.config.ts` inside the existing `formBuilderPlugin({...})` call:

```ts
    formBuilderPlugin({
      fields: {
        payment: false,
        cvUpload: {
          slug: "cvUpload",
          labels: { singular: "CV upload", plural: "CV uploads" },
          fields: [
            { name: "name", type: "text", required: true },
            { name: "label", type: "text" },
            { name: "required", type: "checkbox" },
          ],
        },
      },
      formOverrides: { admin: { group: "Site" } },
      formSubmissionOverrides: { admin: { group: "Site" } },
    }),
```

- [ ] **Step 3: Check it compiles and appears in the admin**

Run:

```bash
npx tsc --noEmit
npm run dev
```

Open `http://localhost:3000/admin/collections/forms`, edit the Contact form,
and open the Fields block picker. Expected: "CV upload" is offered.

- [ ] **Step 4: Record the answer and revert the experiment**

Append to the spec's *Open items* section, replacing the last bullet:

```markdown
- **The form-builder upload field is resolved.** `formBuilderPlugin`
  <accepts | rejects> a custom block in its `fields` map. Phase 6 therefore
  uses <one form system, extended | typed route handlers for the two
  application forms>.
```

Then revert the config change — Phase 6 implements it properly:

```bash
git checkout src/payload.config.ts
```

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/specs/2026-10-10-payload-cms-port-design.md
git commit -m "Record the form-builder upload field spike result"
```

---

### Task 2: Test runner

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: nothing
- Produces: `npm test` and `npm run test:watch`. Every later task's tests run through these.

- [ ] **Step 1: Install vitest**

```bash
npm i -D vitest@^3.2.4
```

- [ ] **Step 2: Write the config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

/*
 * Node environment, not jsdom. Everything tested in Phases 0-3 is a pure
 * function — validators, date logic, seed transforms — so there is no DOM to
 * simulate and no Payload instance to boot. Collections and the seed are
 * verified by running them against the real database instead; see
 * src/seed/verify.ts.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
```

- [ ] **Step 3: Add the scripts**

In `package.json`, add to `"scripts"`:

```json
    "test": "vitest run",
    "test:watch": "vitest"
```

- [ ] **Step 4: Verify the runner starts with no tests**

Run: `npm test`
Expected: exits 0 (or reports "No test files found"), not a config error.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vitest.config.ts
git commit -m "Add vitest for the pure functions this port introduces"
```

---

### Task 3: Forbidden-phrase validator

Carries **Review Focus #3**: a forbidden phrase arriving inside Lexical rich text rather than a plain string.

**Files:**
- Create: `src/fields/validators.ts`
- Create: `src/fields/validators.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `type Rule = { pattern: RegExp; message: string }`
  - `BASE_RULES: Rule[]`, `PROJECT_RULES: Rule[]`
  - `extractText(value: unknown): string`
  - `forbidsPhrases(rules?: Rule[]): (value: unknown) => true | string`
  - `requiresScopeQualifier(value: unknown, siblingData: { figure?: string | null }): true | string`

  Tasks 9–14 attach `forbidsPhrases()` to text and rich-text fields. Task 14 attaches `requiresScopeQualifier` to the impact counter.

- [ ] **Step 1: Write the failing tests**

Create `src/fields/validators.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  BASE_RULES,
  PROJECT_RULES,
  extractText,
  forbidsPhrases,
  requiresScopeQualifier,
} from "./validators";

describe("extractText", () => {
  it("returns a plain string unchanged", () => {
    expect(extractText("hello")).toBe("hello");
  });

  it("walks a Lexical node tree and joins its text", () => {
    const lexical = {
      root: {
        type: "root",
        children: [
          {
            type: "paragraph",
            children: [
              { type: "text", text: "A " },
              { type: "text", text: "Tier III certified" },
              { type: "text", text: " datacenter" },
            ],
          },
        ],
      },
    };
    expect(extractText(lexical)).toContain("Tier III certified");
  });

  it("reaches text nested several levels deep", () => {
    const lexical = {
      root: { children: [{ children: [{ children: [{ type: "text", text: "gold partner" }] }] }] },
    };
    expect(extractText(lexical)).toContain("gold partner");
  });

  it("returns an empty string for null, undefined and numbers", () => {
    expect(extractText(null)).toBe("");
    expect(extractText(undefined)).toBe("");
    expect(extractText(42)).toBe("");
  });
});

describe("forbidsPhrases", () => {
  const validate = forbidsPhrases();

  it("passes ordinary copy", () => {
    expect(validate("A Tier III-aligned datacenter facility.")).toBe(true);
  });

  it("passes empty and absent values, leaving required-ness to the field", () => {
    expect(validate("")).toBe(true);
    expect(validate(undefined)).toBe(true);
  });

  it("blocks Tier III certified and names the rule", () => {
    const result = validate("A Tier III certified facility.");
    expect(result).not.toBe(true);
    expect(String(result)).toContain("Tier III-aligned");
  });

  it("blocks the hyphenated and cased variants", () => {
    expect(validate("tier iii-certified")).not.toBe(true);
    expect(validate("TIER 3 CERTIFIED")).not.toBe(true);
  });

  it("blocks partner tier claims", () => {
    expect(validate("We are a gold partner.")).not.toBe(true);
    expect(validate("An authorized reseller of HPE.")).not.toBe(true);
    expect(validate("A certified partner.")).not.toBe(true);
  });

  it("blocks absolute security claims", () => {
    expect(validate("Your data is 100% secure.")).not.toBe(true);
    expect(validate("A fully secure network.")).not.toBe(true);
  });

  it("blocks a forbidden phrase hidden in rich text", () => {
    const lexical = {
      root: { children: [{ children: [{ type: "text", text: "Tier III certified" }] }] },
    };
    expect(validate(lexical)).not.toBe(true);
  });

  it("allows SOC by default, because the cybersecurity page needs it", () => {
    expect(validate("Managed SOC services.")).toBe(true);
  });

  it("blocks SOC under the project rules only", () => {
    const projectValidate = forbidsPhrases(PROJECT_RULES);
    const result = projectValidate("Two campus SOC rooms were commissioned.");
    expect(result).not.toBe(true);
    expect(String(result)).toContain("security control room");
    expect(projectValidate("Two campus security control rooms.")).toBe(true);
  });

  it("still applies the base rules when given project rules", () => {
    expect(forbidsPhrases(PROJECT_RULES)("gold partner")).not.toBe(true);
  });

  it("does not fire on SOC inside an unrelated word", () => {
    const projectValidate = forbidsPhrases(PROJECT_RULES);
    expect(projectValidate("Associated social infrastructure.")).toBe(true);
  });

  it("exposes its rules, each with a message", () => {
    expect(BASE_RULES.length).toBeGreaterThan(0);
    for (const rule of BASE_RULES) expect(rule.message).not.toHaveLength(0);
  });
});

describe("requiresScopeQualifier", () => {
  it("requires the qualifier when the figure is a percentage", () => {
    const result = requiresScopeQualifier("of everything", { figure: "100%" });
    expect(result).not.toBe(true);
    expect(String(result)).toContain("against agreed project scope");
  });

  it("accepts the approved qualifier", () => {
    expect(requiresScopeQualifier("against agreed project scope", { figure: "100%" })).toBe(true);
  });

  it("matches the qualifier case-insensitively", () => {
    expect(requiresScopeQualifier("Against Agreed Project Scope", { figure: "100%" })).toBe(true);
  });

  it("ignores non-percentage figures", () => {
    expect(requiresScopeQualifier("projects delivered", { figure: "67+" })).toBe(true);
  });

  it("ignores an absent figure", () => {
    expect(requiresScopeQualifier("anything", {})).toBe(true);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- validators`

Expected: FAIL with `Failed to resolve import "./validators"`.

- [ ] **Step 3: Write the implementation**

Create `src/fields/validators.ts`:

```ts
/*
 * The content master forbids specific claims. The people editing this site
 * will not have read its 207 pages, so guidance in a field description is not
 * enough -- these block on save and name the rule they enforce.
 *
 * Two design notes worth keeping:
 *
 *   - Rich text is a Lexical node tree, not a string. A validator that only
 *     inspects strings passes "Tier III certified" straight through when it is
 *     typed into a rich-text field, which is where most prose lives.
 *     extractText flattens either shape.
 *
 *   - "SOC" is NOT a base rule. It is legitimate on the cybersecurity solution
 *     page; the master's rule is specifically that Bahir Dar's campus spaces
 *     are security control rooms. So it lives in PROJECT_RULES and applies
 *     only there. A guardrail that fires on correct copy gets switched off.
 */

export type Rule = { pattern: RegExp; message: string };

export const BASE_RULES: Rule[] = [
  {
    pattern: /tier\s*(?:iii|3)\W{0,3}certified/i,
    message:
      'The content master allows "Tier III-aligned" and never "Tier III-certified". Edge has not certified a facility.',
  },
  {
    pattern: /\b(?:gold|silver|platinum|elite|premier)\s+partner\b/i,
    message:
      "Partnership tiers may not be published. Remove the tier and describe what the technology does instead.",
  },
  {
    pattern: /\bauthoriz(?:ed|sed)\s+(?:reseller|partner|distributor)\b/i,
    message:
      "Authorization status may not be published. It changes over time and is governed by each manufacturer's agreement.",
  },
  {
    pattern: /\bcertified\s+partner\b/i,
    message: "Certification tiers may not be published.",
  },
  {
    pattern: /\b(?:100%|fully|completely|totally)\s+secure\b/i,
    message:
      "Absolute security claims are forbidden. Describe the controls rather than promising an outcome.",
  },
];

/** Base rules plus the project-only wording rule. */
export const PROJECT_RULES: Rule[] = [
  ...BASE_RULES,
  {
    pattern: /\bSOC\b/,
    message:
      'On project records the approved wording is "campus security control room", not "SOC".',
  },
];

/**
 * Flatten a field value to searchable text. Handles a plain string and a
 * Lexical editor state; anything else contributes nothing.
 */
export function extractText(value: unknown): string {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return "";

  const parts: string[] = [];
  const walk = (node: unknown): void => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    const record = node as Record<string, unknown>;
    if (typeof record.text === "string") parts.push(record.text);
    if (record.root) walk(record.root);
    if (Array.isArray(record.children)) record.children.forEach(walk);
  };

  walk(value);
  return parts.join(" ");
}

/**
 * Field validator. Returns true, or the message of the first rule that fires.
 * Empty values pass: whether a field is required is the field's own business.
 */
export function forbidsPhrases(rules: Rule[] = BASE_RULES) {
  return (value: unknown): true | string => {
    const text = extractText(value);
    if (!text.trim()) return true;
    for (const rule of rules) {
      if (rule.pattern.test(text)) return rule.message;
    }
    return true;
  };
}

/**
 * The master requires the 100% completion figure to carry its qualifier
 * everywhere it appears. Applied to the impact counter's `line` field.
 */
export function requiresScopeQualifier(
  value: unknown,
  siblingData: { figure?: string | null },
): true | string {
  const figure = siblingData?.figure ?? "";
  if (!figure.includes("%")) return true;
  if (/against agreed project scope/i.test(extractText(value))) return true;
  return 'A percentage completion figure must carry "against agreed project scope".';
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -- validators`

Expected: PASS, all cases.

- [ ] **Step 5: Commit**

```bash
git add src/fields/validators.ts src/fields/validators.test.ts
git commit -m "Enforce the content master's forbidden claims as field validators"
```

---

### Task 4: The `confirmable()` field helper

Highland renders a visible "pending from Edge" badge for facts Edge has not confirmed. That is content state, so it belongs in the schema rather than in page code.

**Files:**
- Create: `src/fields/confirmable.ts`
- Create: `src/fields/confirmable.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `confirmable(name: string, opts?: { label?: string; description?: string; defaultPendingLabel?: string }): Field`
  - `type ConfirmableValue = { value?: string | null; status: "confirmed" | "pending"; pendingLabel?: string | null }`

  Task 10 uses it for `projects.year`, Task 13 for `jobs.deadline`, Task 14 for executive names and internship dates. Task 19's read layer and Phase 4's components consume `ConfirmableValue`.

- [ ] **Step 1: Write the failing tests**

Create `src/fields/confirmable.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import type { Field } from "payload";
import { confirmable } from "./confirmable";

type GroupField = Extract<Field, { type: "group" }>;

const subfield = (group: GroupField, name: string) =>
  group.fields.find((f) => "name" in f && f.name === name);

describe("confirmable", () => {
  const field = confirmable("year", {
    label: "Year",
    description: "The year the project completed.",
  }) as GroupField;

  it("is a group named after the fact", () => {
    expect(field.type).toBe("group");
    expect(field.name).toBe("year");
  });

  it("carries the label and description through to the admin", () => {
    expect(field.label).toBe("Year");
    expect(field.admin?.description).toBe("The year the project completed.");
  });

  it("holds exactly value, status and pendingLabel", () => {
    const names = field.fields.flatMap((f) => ("name" in f && f.name ? [f.name] : []));
    expect(names).toEqual(["value", "status", "pendingLabel"]);
  });

  it("defaults to pending, so an unfilled fact is never implied as confirmed", () => {
    const status = subfield(field, "status");
    expect(status && "defaultValue" in status && status.defaultValue).toBe("pending");
  });

  it("offers only confirmed and pending", () => {
    const status = subfield(field, "status");
    const options = status && "options" in status ? status.options : [];
    const values = (options as { value: string }[]).map((o) => o.value);
    expect(values).toEqual(["confirmed", "pending"]);
  });

  it("shows pendingLabel only while the fact is pending", () => {
    const pendingLabel = subfield(field, "pendingLabel");
    const condition = pendingLabel?.admin?.condition;
    expect(typeof condition).toBe("function");
    expect(condition?.({}, { status: "pending" }, { user: null } as never)).toBe(true);
    expect(condition?.({}, { status: "confirmed" }, { user: null } as never)).toBe(false);
  });

  it("supplies a default pending label when one is given", () => {
    const withDefault = confirmable("deadline", {
      defaultPendingLabel: "Deadline to be confirmed",
    }) as GroupField;
    const pendingLabel = subfield(withDefault, "pendingLabel");
    expect(pendingLabel && "defaultValue" in pendingLabel && pendingLabel.defaultValue).toBe(
      "Deadline to be confirmed",
    );
  });

  it("works with no options at all", () => {
    const bare = confirmable("completedOn") as GroupField;
    expect(bare.name).toBe("completedOn");
    expect(bare.fields).toHaveLength(3);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- confirmable`

Expected: FAIL with `Failed to resolve import "./confirmable"`.

- [ ] **Step 3: Write the implementation**

Create `src/fields/confirmable.ts`:

```ts
import type { Field } from "payload";

/*
 * A fact Edge may not have confirmed yet.
 *
 * Highland shows these as a visible "pending" badge rather than guessing a
 * plausible value, and that visibility is a content decision, not a styling
 * one -- so the state lives in the schema. The front end renders the badge
 * from `status`, which means an editor confirming a fact clears the badge
 * with no code change.
 *
 * Status defaults to "pending" deliberately: a new document with an empty
 * value should not claim the value is confirmed.
 */

export type ConfirmableValue = {
  value?: string | null;
  status: "confirmed" | "pending";
  pendingLabel?: string | null;
};

export const confirmable = (
  name: string,
  opts: { label?: string; description?: string; defaultPendingLabel?: string } = {},
): Field => ({
  name,
  type: "group",
  ...(opts.label ? { label: opts.label } : {}),
  ...(opts.description ? { admin: { description: opts.description } } : {}),
  fields: [
    {
      name: "value",
      type: "text",
      admin: { description: "Leave empty while this is still unconfirmed." },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "pending",
      options: [
        { label: "Confirmed by Edge", value: "confirmed" },
        { label: "Pending confirmation", value: "pending" },
      ],
      admin: {
        description:
          "While this is pending, the site shows a visible marker instead of the value.",
      },
    },
    {
      name: "pendingLabel",
      type: "text",
      ...(opts.defaultPendingLabel ? { defaultValue: opts.defaultPendingLabel } : {}),
      admin: {
        description: "What the marker says, e.g. 'Year to confirm'.",
        condition: (_data, siblingData) => siblingData?.status === "pending",
      },
    },
  ],
});
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -- confirmable`

Expected: PASS, all cases.

- [ ] **Step 5: Commit**

```bash
git add src/fields/confirmable.ts src/fields/confirmable.test.ts
git commit -m "Add a confirmable() field for facts Edge has not confirmed

Status defaults to pending: a new document with an empty value must not imply
the value is confirmed. The front end renders Highland's visible marker from
this status, so confirming a fact clears the marker with no code change."
```

---

### Task 5: Host-agnostic media storage

The spec keeps hosting undecided, which means uploads cannot assume a persistent local disk and cannot use a host-specific API.

**Files:**
- Modify: `package.json`
- Modify: `src/payload.config.ts`
- Modify: `.env.example`

**Interfaces:**
- Consumes: nothing
- Produces: an `s3Storage` adapter registered in `payload.config.ts` only when `S3_BUCKET` is set. Task 8's `media` collection needs no knowledge of which backend is active.

- [ ] **Step 1: Install the adapter at the pinned version**

```bash
npm i @payloadcms/storage-s3@3.88.0
```

- [ ] **Step 2: Document the variables**

Append to `.env.example`:

```
# Media storage. With S3_BUCKET unset, uploads go to local disk for
# development. Set all five for any S3-compatible bucket -- AWS, Cloudflare
# R2, Backblaze B2 or MinIO -- which is what keeping both hosting options
# open requires.
S3_BUCKET=
S3_REGION=
S3_ENDPOINT=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
```

- [ ] **Step 3: Register the adapter conditionally**

In `src/payload.config.ts`, add the import beside the existing plugin imports:

```ts
import { s3Storage } from "@payloadcms/storage-s3";
```

Add above `export default buildConfig({`:

```ts
/*
 * Hosting is deliberately undecided, so media goes behind an adapter rather
 * than onto a disk. With no S3_BUCKET set we fall through to Payload's local
 * disk handling, which is right for development and wrong for serverless.
 * Setting the five S3_* variables switches to any S3-compatible bucket.
 */
const storagePlugins = process.env.S3_BUCKET
  ? [
      s3Storage({
        collections: { media: true },
        bucket: process.env.S3_BUCKET,
        config: {
          region: process.env.S3_REGION,
          endpoint: process.env.S3_ENDPOINT,
          forcePathStyle: Boolean(process.env.S3_ENDPOINT),
          credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
          },
        },
      }),
    ]
  : [];
```

Then add `...storagePlugins,` as the last entry of the existing `plugins: [...]` array.

- [ ] **Step 4: Verify both paths typecheck and the unset path still boots**

Run:

```bash
npx tsc --noEmit
docker compose up -d
npm run dev
```

Expected: `tsc` clean. The admin loads at `http://localhost:3000/admin`, and uploading an image to Media still works with no `S3_*` variables set.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json src/payload.config.ts .env.example
git commit -m "Put media behind an S3 adapter, enabled by env

Hosting is undecided, so uploads cannot assume a persistent local disk. With
S3_BUCKET unset this falls through to local disk for development; set it and
any S3-compatible bucket works, including R2, B2 and MinIO. No host-specific
API is used either way."
```

---

### Task 6: Retire the routes built on the old model

**Why this comes before the schema work.** The 17 existing frontend routes read the old collections through `src/lib/content.ts`. Replacing those collections in Tasks 8–14 breaks every one of them, and TypeScript would stay red for a dozen tasks. Retiring them first keeps the build green throughout.

**Why it is safe.** The Next app is not deployed: there is no `vercel.json`, `DATABASE_URI` points at `127.0.0.1:5434`, and the root layout awaits `getSiteSettings()` so `next build` cannot complete without a local database. The client reviews the Highland GitHub Pages build, which this plan does not touch. There is no uptime to protect.

**Files:**
- Delete: `src/app/(frontend)/{about,academy,careers,clients,contact,design,news,partners,projects,solutions}/`
- Modify: `src/app/(frontend)/page.tsx`
- Modify: `src/lib/content.ts:1-263`

**Interfaces:**
- Consumes: nothing
- Produces: a `src/lib/content.ts` exporting only `getSiteSettings`, `getContactForm`, and the types `SiteSetting` and `ContactForm`. Task 19 rebuilds the rest. `src/components/chrome.tsx` keeps compiling because it only needs `SiteSetting`.

- [ ] **Step 1: Confirm the app cannot currently build, so the deletion costs nothing**

```bash
docker compose down
npx next build 2>&1 | tail -20
```

Expected: the build fails reaching Postgres. This is the evidence that no working page is being discarded. Bring the database back up afterwards:

```bash
docker compose up -d
```

- [ ] **Step 2: Delete the route folders**

```bash
git rm -r "src/app/(frontend)/about" "src/app/(frontend)/academy" \
          "src/app/(frontend)/careers" "src/app/(frontend)/clients" \
          "src/app/(frontend)/contact" "src/app/(frontend)/news" \
          "src/app/(frontend)/partners" "src/app/(frontend)/projects" \
          "src/app/(frontend)/solutions" "src/app/(frontend)/design"
```

`src/app/(frontend)/design/` goes with them. It is a route built on the old
model like the rest: `design/_shared.tsx` imports `getCourses`, `getHomePage`,
`getSectors` and `getSolutions`, and `design/{a,b,c,d,e}/page.tsx` each import
`domainCode` — none of which survive Step 4, and the first three of which read
collections Task 15 deletes. Its own `layout.tsx` says *"Delete this folder
once a direction is picked"*; Highland was picked. The folder's uncommitted
state is preserved on branch `design-directions-wip` (commit `2f332df`), so
this deletion loses nothing.

- [ ] **Step 3: Replace the home page with a placeholder**

Overwrite `src/app/(frontend)/page.tsx`:

```tsx
/*
 * Placeholder. Phase 4 Task 1 replaces this with Highland's homepage.
 *
 * It exists so the app has a route and `next build` stays green while the
 * schema is replaced underneath it. It reads nothing from the CMS on purpose:
 * the collections it would read are being rebuilt.
 */
export default function HomePage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold">
        Edge Comm-Tech
      </p>
      <h1 className="mt-3 font-display text-4xl leading-tight">
        Content model rebuild in progress
      </h1>
      <p className="mt-5 text-ink/75">
        The approved content is being moved into the CMS. The reviewable site
        remains the Highland build.
      </p>
    </main>
  );
}
```

- [ ] **Step 4: Trim the read layer to what still has a schema**

Replace the whole of `src/lib/content.ts` with:

```ts
import { cache } from "react";
import { getPayload } from "payload";
import config from "@payload-config";
import type { SiteSetting } from "@/payload-types";

export type { SiteSetting };

/*
 * Reduced to the two readers whose collections survive the content-model
 * rebuild. Task 19 adds readers for the thirteen new collections and five
 * globals once they exist; keeping the old getters here would only hold
 * references to collections that are being deleted.
 */

const payloadClient = cache(async () => getPayload({ config }));

/**
 * Only published documents reach the public site. The Local API defaults to
 * overrideAccess: true, so the access rules in src/access are not enough on
 * their own -- every read filters on _status explicitly.
 */
export const PUBLISHED = { _status: { equals: "published" } } as const;

export const getSiteSettings = cache(async (): Promise<SiteSetting> => {
  const payload = await payloadClient();
  return payload.findGlobal({ slug: "site-settings", depth: 1 });
});

export type ContactForm = Awaited<ReturnType<typeof getContactForm>>;

/**
 * The contact form is a plugin-form-builder document so Edge staff can add or
 * reorder fields without a deploy. Phase 6 builds the remaining five forms.
 */
export const getContactForm = cache(async () => {
  const payload = await payloadClient();
  const { docs } = await payload.find({
    collection: "forms",
    where: { title: { equals: "Contact" } },
    limit: 1,
    depth: 1,
  });
  return docs[0] ?? null;
});
```

- [ ] **Step 5: Verify the build is green again**

Run:

```bash
npx tsc --noEmit
npx next build
```

Expected: `tsc` clean; the build completes with route `/` plus the Payload admin and API routes, and nothing else. No `about`, `solutions`, `projects` and so on — and no `/design` either, since Step 2 deleted it.

- [ ] **Step 6: Commit**

```bash
git add -A src/app/\(frontend\) src/lib/content.ts
git commit -m "Retire the routes built on the retired content model

These 17 routes read the old nine-service schema through content.ts, so
replacing that schema would leave TypeScript red for a dozen tasks. Deleting
them first keeps the build green while the model is rebuilt.

Safe because the Next app is not deployed: no vercel.json, a localhost
DATABASE_URI, and a root layout that awaits getSiteSettings() so next build
cannot complete without a local database. The client reviews the Highland
Pages build, which is untouched.

content.ts keeps only the two readers whose collections survive. Task 19
rebuilds the rest against the new model."
```

---

### Task 7: Install Highland's theme

Highland's look replaces the frontend's teal-and-brass design system wholesale. The one file that consumed those tokens, `design.css`, went with the A–E exploration in Task 6, so this task replaces the theme and the typefaces without having to preserve anything.

**Decision taken (amended 2026-10-11):** the folder is deleted, not vendored. The original plan preserved it because it was uncommitted work; that work is now committed to branch `design-directions-wip` (`2f332df`), and Task 6 Step 2 deletes the folder. The teal/brass system therefore has no remaining consumer and is simply replaced. The two steps that existed only to keep `/design/*` alive — vendoring the old tokens into `design.css`, and verifying the exploration still rendered — are struck from this task, and the surviving steps are renumbered 1–4.

**Files:**
- Modify: `src/app/(frontend)/globals.css`
- Modify: `src/app/(frontend)/layout.tsx`
- Delete: `src/components/{contact-form,partner-network,rich-text}.tsx`

**Interfaces:**
- Consumes: nothing
- Produces: Tailwind tokens `ink`, `ink-2`, `paper`, `paper-2`, `gold`, `gold-2`, `lamp`, `steel`, `rule`; font families `display`, `sans`, `mono`; and the classes `eg-rise`, `eg-pop`, `eg-draw`, `eg-breathe`, `eg-spin-slow`, `eg-inview`, `sun-disk`, `horizon`. Every component in Phases 4–5 uses these names, which are the same names Highland's markup already uses — so ported markup needs no class rewriting.

- [ ] **Step 1: Delete the components the retired routes left behind**

```bash
git rm src/components/contact-form.tsx src/components/partner-network.tsx \
       src/components/rich-text.tsx
```

Task 6 deleted the routes but not the components only those routes rendered.
Nothing imports these three — verify with
`grep -rn "contact-form\|partner-network\|rich-text" src/ --include=*.tsx`,
which should return only their own definitions. They are also styled entirely
against the teal/brass system that Step 2 deletes, so they cannot be kept
working: `contact-form` and `partner-network` use `btn-brass`, `bg-brass`,
`bg-deep-2` and `border-rule-dark`, and `rich-text` renders nothing but a
`prose-edge` wrapper. Phase 4 rebuilds a rich-text renderer against Highland's
prose styles and Phase 6 rebuilds the forms on `plugin-form-builder`; both are
outside this plan. If either wants to crib from these files they are in git
history at `20daf05`.

`src/components/mobile-nav.tsx` is NOT deleted here. `chrome.tsx` still imports
it, so removing it now breaks the build. It becomes an orphan in Task 20, which
replaces `chrome.tsx` with a version importing `nav-links` instead, and Task 20
deletes it there.

- [ ] **Step 2: Replace the global theme with Highland's**

Replace everything in `src/app/(frontend)/globals.css` from `@import "tailwindcss";` through the end of the `.prose-edge`/`.dark-surface` block with:

```css
@import "tailwindcss";

/*
 * Highland. The design the client has reviewed and corrected across several
 * rounds, ported from design-src/highland/gen.mjs.
 *
 * The token names match Highland's Tailwind config exactly -- ink, paper,
 * gold, lamp, steel, rule -- so markup ported from design-src needs no class
 * rewriting. "gold" is Edge's blue; the name is inherited from the original
 * palette and kept because 1,100+ ported class names use it.
 *
 * The previous teal-and-brass system is gone. Its only consumer was the A-E
 * typography comparison under /design, which chose this direction and was
 * deleted once it had; that exploration is preserved on the branch
 * design-directions-wip if anyone needs to read it again.
 */

@theme {
  --color-ink: #1c2430;
  --color-ink-2: #2a3544;
  --color-paper: #eef6f4;
  --color-paper-2: #ffffff;
  --color-gold: #0888c5;
  --color-gold-2: #056a9a;
  --color-lamp: #c48a5a;
  --color-steel: #5c6b76;
  --color-rule: #0888c530;

  --font-display: var(--font-geologica), Geologica, "Segoe UI", sans-serif;
  --font-sans: var(--font-atkinson), "Atkinson Hyperlegible", "Segoe UI", sans-serif;
  --font-mono: var(--font-fragment), "Fragment Mono", ui-monospace, monospace;
}

body {
  background: var(--color-paper);
  color: var(--color-ink);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}

/* 1,173 ported elements carry font-display and expect this tightening. */
.font-display {
  letter-spacing: -0.03em;
  font-weight: 700;
}

:focus-visible {
  outline: 2px solid var(--color-gold);
  outline-offset: 3px;
}

/* ------------------------------------------------------------ hero device

   The sun disk and horizon are the approved homepage hero. Phase 4 Task 1
   renders them; they are here because they are page furniture, not utilities.
*/

.sun-disk {
  position: absolute;
  right: -6rem;
  top: -5rem;
  width: 22rem;
  height: 22rem;
  border-radius: 999px;
  background: radial-gradient(circle at 40% 40%, #fff8 0%, #0888c5 42%, transparent 70%);
  opacity: 0.55;
  pointer-events: none;
}

.horizon {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 28%;
  height: 1px;
  background: linear-gradient(90deg, transparent, #0888c5 20%, #0888c5 80%, transparent);
  pointer-events: none;
}

/* ----------------------------------------------------------------- motion

   These animate the independent translate, scale and rotate properties
   rather than transform, and the difference is load-bearing.

   Animating transform with "both" fill mode means the animation's resting
   value wins the cascade over any transform an element also carries. That
   silently killed every hover:-translate-y lift on an .eg-inview card, and it
   wiped the -translate-x-1/2 -translate-y-1/2 centring on the partners ring
   nodes and hub, pushing a node past the viewport edge.

   translate/scale/rotate compose with transform instead of replacing it, so
   Tailwind's utilities and the motion can coexist. Do not "simplify" these
   back to transform.
*/

@keyframes eg-rise { from { opacity: 0; translate: 0 16px } to { opacity: 1; translate: none } }
@keyframes eg-pop { from { opacity: 0; scale: .82 } to { opacity: 1; scale: none } }
@keyframes eg-draw { to { stroke-dashoffset: 0 } }
@keyframes eg-breathe { 0%, 100% { scale: 1 } 50% { scale: 1.035 } }
@keyframes eg-spin { to { rotate: 360deg } }

.eg-rise {
  animation: eg-rise .7s cubic-bezier(.2, .7, .3, 1) both;
  animation-delay: var(--d, 0s);
}

.eg-pop {
  animation: eg-pop .55s cubic-bezier(.2, .9, .3, 1.25) both;
  animation-delay: var(--d, 0s);
}

.eg-draw {
  stroke-dasharray: var(--len, 320);
  stroke-dashoffset: var(--len, 320);
  animation: eg-draw 1s ease-out both;
  animation-delay: var(--d, 0s);
}

.eg-breathe {
  animation: eg-breathe 6s ease-in-out infinite;
  transform-origin: center;
  transform-box: fill-box;
}

.eg-spin-slow {
  animation: eg-spin 120s linear infinite;
  transform-origin: center;
  transform-box: fill-box;
}

/* Below the fold, play on scroll rather than on load, so nothing animates
   where nobody is looking. Unsupported browsers just show the element. */
@supports (animation-timeline: view()) {
  .eg-inview {
    animation: eg-rise .7s cubic-bezier(.2, .7, .3, 1) both;
    animation-timeline: view();
    animation-range: entry 0% entry 50%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .eg-rise, .eg-pop, .eg-draw, .eg-breathe, .eg-spin-slow, .eg-inview {
    animation: none !important;
  }

  .eg-draw {
    stroke-dasharray: none;
    stroke-dashoffset: 0;
  }
}
```

Highland's `hop-line` and `.ph` rules are deliberately not ported: both have zero uses in the current 51-page build.

- [ ] **Step 3: Swap the typefaces**

In `src/app/(frontend)/layout.tsx`, replace the three font imports and declarations:

```tsx
import { Atkinson_Hyperlegible, Fragment_Mono, Geologica } from "next/font/google";

const geologica = Geologica({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-geologica",
  display: "swap",
});

const atkinson = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-atkinson",
  display: "swap",
});

const fragmentMono = Fragment_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-fragment",
  display: "swap",
});
```

Update the `<html>` className to `` `${geologica.variable} ${atkinson.variable} ${fragmentMono.variable}` ``, and change the skip link's colours from `focus:bg-brass focus:text-deep` to `focus:bg-gold focus:text-white`, since `brass` and `deep` no longer exist.

- [ ] **Step 4: Verify the theme renders and nothing references dead tokens**

Run:

```bash
grep -rnE "brass|deep-2|color-teal|signal|prose-edge|register-row" src/app src/components --include=*.tsx \
  | grep -vE "^src/components/(chrome|mobile-nav)\.tsx:"
npx tsc --noEmit
npm run dev
```

Expected: the filtered grep returns **nothing**. `tsc` clean. `/` renders the placeholder in Highland's blue on tinted paper with Geologica headings.

The two excluded files are the last legitimate consumers of the old tokens and both are resolved in Task 20: it replaces `chrome.tsx` wholesale with a version using `text-gold`, and deletes `mobile-nav.tsx` once that replacement imports `nav-links` instead. Repainting either one here would be work Task 20 throws away. Until then the header and footer render their accents in body ink rather than blue, on a site serving one placeholder page and not deployed. Everything outside those two files must be clean, so this check still has teeth: if a hit appears in any other file, a component is reaching for a token that no longer exists.

- [ ] **Step 5: Commit**

```bash
git add "src/app/(frontend)/globals.css" "src/app/(frontend)/layout.tsx" \
        src/components/contact-form.tsx src/components/partner-network.tsx \
        src/components/rich-text.tsx
git commit -m "Port Highland's theme and motion into the Next app

Token names match Highland's Tailwind config exactly, so the markup ported in
Phases 4-5 needs no class rewriting. 'gold' is Edge's blue -- the name is
inherited and kept because 1,100+ ported class names use it.

The keyframes animate the independent translate/scale/rotate properties rather
than transform. Animating transform with 'both' fill mode makes the resting
value outrank any transform the element also carries, which killed every hover
lift and broke the partners diagram's centring. Do not simplify these back.

The teal-and-brass system is dropped rather than scoped. Its only consumer
was the A-E typography comparison, which picked this direction and was
deleted with the other retired routes; it is preserved on the branch
design-directions-wip. hop-line and .ph are not ported: zero uses in the
current build."
```

---

## Phase 1 — Content model

Every collection in this phase follows the conventions already in the repo: `slugField`/`orderField` from `src/fields/slug.ts`, the access helpers from `src/access`, `revalidateAfterChange`/`revalidateAfterDelete` from `src/hooks/revalidate.ts`, `versions: { drafts: true }`, and an `admin.description` on every non-obvious field written as plain-language guidance for a non-technical editor.

Drafts get autosave, which the existing collections do not have. An editor who loses twenty minutes of typing to a closed tab does not trust the tool again.

### Task 8: Media provenance and the approval gate

The master permits publishing only assets with a recorded source, retrieval date and internal reviewer. Twenty-nine of thirty-two partner marks and nine of ten client marks have no approved artwork, so this gate is load-bearing from day one, not a future concern.

**Files:**
- Modify: `src/collections/Media.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `media` documents with `approved: boolean`, `source`, `retrievedAt`, `reviewedBy`. Tasks 10 and 11 reference them through `filterOptions: { approved: { equals: true } }`.

- [ ] **Step 1: Add the provenance group and the gate**

In `src/collections/Media.ts`, append to the `fields` array, after `credit`:

```ts
    {
      name: "provenance",
      type: "group",
      label: "Where this came from",
      admin: {
        description:
          "The content master allows publishing only assets whose source, retrieval date and internal reviewer are recorded. Fill these in before ticking Approved.",
      },
      fields: [
        {
          name: "source",
          type: "text",
          admin: {
            description:
              "Where the file came from — a brand's own press kit URL, the client's handover pack, or the name of the Edge photographer.",
          },
        },
        {
          name: "retrievedAt",
          type: "date",
          admin: { description: "The day it was obtained." },
        },
        {
          name: "reviewedBy",
          type: "text",
          admin: {
            description: "Who at Edge checked that publishing this is permitted.",
          },
        },
      ],
    },
    {
      name: "approved",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description:
          "Until this is ticked, the file cannot be selected as a logo anywhere on the site. The brand's name is shown instead.",
      },
      validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
        if (!value) return true;
        const p = (siblingData?.provenance ?? {}) as Record<string, unknown>;
        const missing = (["source", "retrievedAt", "reviewedBy"] as const).filter((k) => !p[k]);
        if (missing.length === 0) return true;
        return `Record ${missing.join(", ")} under "Where this came from" before approving this asset.`;
      },
    },
```

- [ ] **Step 2: Generate types and verify the gate in the admin**

Run:

```bash
docker compose up -d
npm run generate:types
npx tsc --noEmit
npm run dev
```

In `/admin/collections/media`, upload any image, tick **Approved** and save.
Expected: save is refused with "Record source, retrievedAt, reviewedBy…". Fill the three fields, save again. Expected: saves.

- [ ] **Step 3: Commit**

```bash
git add src/collections/Media.ts src/payload-types.ts
git commit -m "Gate media approval behind recorded provenance

The content master permits publishing only assets with a recorded source,
retrieval date and reviewer. Approved cannot be ticked until all three are
filled, and Tasks 10-11 filter logo relationships to approved assets only --
so an unapproved file cannot be selected, not merely discouraged.

This matters on day one rather than later: 29 of 32 partner marks and 9 of 10
client marks have no approved artwork, and the site renders the brand's name
in the same frame instead."
```

---

### Task 9: Solutions and services

Seven solution families and six professional services. `Solutions.ts` is re-modelled from the old nine-service shape; `Services.ts` is new.

This task carries the spec's one departure from fixed templates: `solutions.detail` is a typed section list. The master's solution pages genuinely vary — most have a flat capability list, datacenter has two named bands, others have layered architectures or numbered sequences. Giving every solution every field and leaving most empty is worse for an editor than offering six known section types.

**Files:**
- Modify: `src/collections/Solutions.ts`
- Create: `src/collections/Services.ts`
- Modify: `src/payload.config.ts` (register `Services`)

**Interfaces:**
- Consumes: `forbidsPhrases` from `src/fields/validators.ts` (Task 3); `slugField`, `orderField` from `src/fields/slug.ts`
- Produces: collections `solutions` and `services`. Tasks 10–13 relate to `solutions`; Task 14's Page Copy global does not. Task 16's transforms target these exact field names. The `detail` blocks are `capabilities`, `bands`, `layers`, `sectors`, `measures`, `steps`, `checklist`, `models` — EIGHT, not six. An earlier draft of this line listed six; `sectors` and `measures` were added to the task's code during the plan's own self-review, because three of the seven families carry per-sector copy and several state how a client judges the outcome, and the Interfaces line was not updated to match. Task 16's transforms target the six named in that earlier draft; the other two carry no transform and are rendered directly.

- [ ] **Step 1: Write the detail blocks and the solutions collection**

Replace the whole of `src/collections/Solutions.ts`:

```ts
import type { Block, CollectionConfig } from "payload";
import { publishedOrSignedIn, signedIn } from "../access";
import { orderField, slugField } from "../fields/slug";
import { forbidsPhrases } from "../fields/validators";
import { revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";

const paths = (doc: { slug?: string | null }) => [
  "/",
  "/solutions",
  ...(doc.slug ? [`/solutions/${doc.slug}`] : []),
];

/*
 * Detail sections.
 *
 * The approved solution pages do not share one shape: most carry a flat
 * capability list, the datacenter family carries two named bands, and others
 * carry a layered architecture or a numbered sequence. Rather than give every
 * solution every field and leave most of them empty, an editor picks from
 * these six.
 *
 * This is deliberately not a page builder. There are six types, they cannot be
 * styled, and they cannot be nested. It mirrors variation the client's own
 * content already has.
 */

const titledBody = [
  { name: "title", type: "text", required: true, validate: forbidsPhrases() },
  { name: "body", type: "textarea", required: true, validate: forbidsPhrases() },
] as const;

const DETAIL_BLOCKS: Block[] = [
  {
    slug: "capabilities",
    labels: { singular: "Capability list", plural: "Capability lists" },
    fields: [
      {
        name: "items",
        type: "array",
        minRows: 1,
        labels: { singular: "Capability", plural: "Capabilities" },
        fields: [...titledBody],
      },
    ],
  },
  {
    slug: "bands",
    labels: { singular: "Capability bands", plural: "Capability bands" },
    admin: {
      description:
        "Two or more named groups instead of one flat list. Used where a family covers distinct areas, like datacenter facility and IT infrastructure.",
    },
    fields: [
      {
        name: "items",
        type: "array",
        minRows: 2,
        labels: { singular: "Band", plural: "Bands" },
        fields: [
          { name: "title", type: "text", required: true, validate: forbidsPhrases() },
          {
            name: "entries",
            type: "array",
            minRows: 1,
            labels: { singular: "Entry", plural: "Entries" },
            fields: [{ name: "item", type: "text", required: true, validate: forbidsPhrases() }],
          },
        ],
      },
    ],
  },
  {
    slug: "layers",
    labels: { singular: "Architecture layers", plural: "Architecture layers" },
    admin: { description: "A stack, rendered top to bottom in this order." },
    fields: [
      { name: "title", type: "text", validate: forbidsPhrases() },
      {
        name: "items",
        type: "array",
        minRows: 1,
        labels: { singular: "Layer", plural: "Layers" },
        fields: [...titledBody],
      },
    ],
  },
  {
    slug: "sectors",
    labels: { singular: "Sector relevance", plural: "Sector relevance" },
    admin: {
      description:
        "How this family applies per sector. Three of the seven families carry this; the rest do not.",
    },
    fields: [
      { name: "title", type: "text", validate: forbidsPhrases() },
      {
        name: "items",
        type: "array",
        minRows: 1,
        labels: { singular: "Sector", plural: "Sectors" },
        fields: [...titledBody],
      },
    ],
  },
  {
    slug: "measures",
    labels: { singular: "Value measures", plural: "Value measures" },
    admin: { description: "How a client judges whether this delivered value." },
    fields: [
      { name: "title", type: "text", required: true, validate: forbidsPhrases() },
      {
        name: "items",
        type: "array",
        minRows: 1,
        labels: { singular: "Measure", plural: "Measures" },
        fields: [{ name: "item", type: "text", required: true, validate: forbidsPhrases() }],
      },
    ],
  },
  {
    slug: "steps",
    labels: { singular: "Numbered sequence", plural: "Numbered sequences" },
    admin: { description: "An approach, lifecycle or delivery sequence. Numbered automatically." },
    fields: [
      { name: "title", type: "text", validate: forbidsPhrases() },
      {
        name: "items",
        type: "array",
        minRows: 1,
        labels: { singular: "Step", plural: "Steps" },
        fields: [...titledBody],
      },
    ],
  },
  {
    slug: "checklist",
    labels: { singular: "Checklist", plural: "Checklists" },
    admin: { description: "Considerations, controls or principles, as a titled list." },
    fields: [
      { name: "title", type: "text", required: true, validate: forbidsPhrases() },
      {
        name: "items",
        type: "array",
        minRows: 1,
        labels: { singular: "Item", plural: "Items" },
        fields: [{ name: "item", type: "text", required: true, validate: forbidsPhrases() }],
      },
      {
        name: "note",
        type: "textarea",
        admin: { description: "A qualification under the list, where the approved copy has one." },
        validate: forbidsPhrases(),
      },
    ],
  },
  {
    slug: "models",
    labels: { singular: "Engagement models", plural: "Engagement models" },
    admin: { description: "Named engagement or support models." },
    fields: [
      { name: "title", type: "text", required: true, validate: forbidsPhrases() },
      {
        name: "items",
        type: "array",
        minRows: 1,
        labels: { singular: "Model", plural: "Models" },
        fields: [...titledBody],
      },
    ],
  },
];

export const Solutions: CollectionConfig = {
  slug: "solutions",
  labels: { singular: "Solution family", plural: "Solution families" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "order", "_status"],
    group: "Content",
    description:
      "The seven integrated solution families. These are the main pages buyers land on from search.",
  },
  access: { read: publishedOrSignedIn, create: signedIn, update: signedIn, delete: signedIn },
  versions: { drafts: { autosave: { interval: 800 } } },
  hooks: {
    afterChange: [revalidateAfterChange(paths)],
    afterDelete: [revalidateAfterDelete(paths)],
  },
  fields: [
    { name: "title", type: "text", required: true, validate: forbidsPhrases() },
    slugField("Page URL: /solutions/<slug>"),
    orderField,
    {
      name: "short",
      type: "text",
      required: true,
      admin: { description: "The abbreviated name used in navigation, tags and footers." },
      validate: forbidsPhrases(),
    },
    {
      name: "blurb",
      type: "textarea",
      required: true,
      admin: { description: "One or two sentences. Used on cards and in the solutions ledger." },
      validate: forbidsPhrases(),
    },
    {
      name: "accent",
      type: "text",
      required: true,
      defaultValue: "#0888c5",
      admin: {
        position: "sidebar",
        description: "Hex colour for this family, e.g. #0888c5. Used for numerals, tags and rules.",
      },
    },
    {
      name: "headline",
      type: "text",
      required: true,
      admin: { description: "The promise at the top of the page. One line." },
      validate: forbidsPhrases(),
    },
    {
      name: "intro",
      type: "textarea",
      required: true,
      admin: { description: "The paragraph under the headline." },
      validate: forbidsPhrases(),
    },
    {
      name: "lead",
      type: "textarea",
      admin: {
        description:
          "A longer opening passage before the body, where the approved copy has one. Two of the seven families do.",
      },
      validate: forbidsPhrases(),
    },
    {
      name: "detail",
      type: "blocks",
      blocks: DETAIL_BLOCKS,
      admin: {
        description:
          "The body of the page, in order. Pick the section types this family needs — most use a single capability list.",
      },
    },
    {
      name: "outcomesTitle",
      type: "text",
      admin: { description: "Heading for the outcomes below, where the approved copy has one." },
      validate: forbidsPhrases(),
    },
    {
      name: "outcomes",
      type: "array",
      labels: { singular: "Outcome", plural: "Business outcomes" },
      admin: { description: "What the client gets, in business terms rather than technical ones." },
      fields: [{ name: "item", type: "text", required: true, validate: forbidsPhrases() }],
    },
    {
      name: "note",
      type: "textarea",
      admin: {
        description:
          "A qualification on the whole page. The datacenter family uses this to state that Tier claims are only made when independently verified, and that CCTV and access control are IT infrastructure here rather than cybersecurity.",
      },
      validate: forbidsPhrases(),
    },
    {
      name: "partners",
      type: "relationship",
      relationTo: "partners",
      hasMany: true,
      admin: {
        description:
          "The platforms this family is delivered on. All seven families list these, and they are a relationship rather than typed names so a brand cannot appear here under a name it does not use elsewhere.",
      },
    },
    {
      name: "experience",
      type: "textarea",
      admin: {
        description:
          "The approved related-experience paragraph. Name only engagements in the approved client directory.",
      },
      validate: forbidsPhrases(),
    },
    {
      name: "related",
      type: "relationship",
      relationTo: "solutions",
      hasMany: true,
      admin: { description: "Families a reader of this page should see next." },
    },
  ],
};
```

- [ ] **Step 2: Write the services collection**

Create `src/collections/Services.ts`:

```ts
import type { CollectionConfig } from "payload";
import { publishedOrSignedIn, signedIn } from "../access";
import { orderField, slugField } from "../fields/slug";
import { forbidsPhrases } from "../fields/validators";
import { revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";

const paths = (doc: { slug?: string | null }) => [
  "/",
  "/services",
  "/solutions",
  ...(doc.slug ? [`/services/${doc.slug}`] : []),
];

/*
 * The six professional services.
 *
 * Deliberately a flatter shape than Solutions: every approved service page
 * carries one capability list, so there is no typed-section list here. The
 * variation that justified blocks on Solutions does not exist on these pages,
 * and offering blocks anyway would invite an editor to invent it.
 */
export const Services: CollectionConfig = {
  slug: "services",
  labels: { singular: "Professional service", plural: "Professional services" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "order", "_status"],
    group: "Content",
    description:
      "The six services spanning the technology lifecycle, from advisory through managed support.",
  },
  access: { read: publishedOrSignedIn, create: signedIn, update: signedIn, delete: signedIn },
  versions: { drafts: { autosave: { interval: 800 } } },
  hooks: {
    afterChange: [revalidateAfterChange(paths)],
    afterDelete: [revalidateAfterDelete(paths)],
  },
  fields: [
    { name: "title", type: "text", required: true, validate: forbidsPhrases() },
    slugField("Page URL: /services/<slug>"),
    orderField,
    {
      name: "short",
      type: "text",
      required: true,
      admin: { description: "The abbreviated name used in navigation and cards." },
      validate: forbidsPhrases(),
    },
    {
      name: "blurb",
      type: "textarea",
      required: true,
      admin: { description: "One or two sentences, used on cards." },
      validate: forbidsPhrases(),
    },
    {
      name: "accent",
      type: "text",
      required: true,
      defaultValue: "#056a9a",
      admin: { position: "sidebar", description: "Hex colour for this service, e.g. #056a9a." },
    },
    {
      name: "headline",
      type: "text",
      required: true,
      admin: { description: "The promise at the top of the page. One line." },
      validate: forbidsPhrases(),
    },
    {
      name: "intro",
      type: "textarea",
      required: true,
      validate: forbidsPhrases(),
    },
    {
      name: "capabilities",
      type: "array",
      minRows: 1,
      labels: { singular: "Capability", plural: "What this includes" },
      fields: [
        { name: "title", type: "text", required: true, validate: forbidsPhrases() },
        { name: "body", type: "textarea", required: true, validate: forbidsPhrases() },
      ],
    },
    {
      name: "checklistTitle",
      type: "text",
      admin: { description: "Heading for the checklist below, if this service has one." },
      validate: forbidsPhrases(),
    },
    {
      name: "checklist",
      type: "array",
      labels: { singular: "Item", plural: "Checklist" },
      fields: [{ name: "item", type: "text", required: true, validate: forbidsPhrases() }],
    },
    {
      name: "modelsTitle",
      type: "text",
      admin: { description: "Heading for the engagement or support models below, if any." },
      validate: forbidsPhrases(),
    },
    {
      name: "models",
      type: "array",
      labels: { singular: "Model", plural: "Models" },
      fields: [
        { name: "title", type: "text", required: true, validate: forbidsPhrases() },
        { name: "body", type: "textarea", required: true, validate: forbidsPhrases() },
      ],
    },
    {
      name: "fit",
      type: "textarea",
      admin: {
        description:
          "When this service applies. Shown as a pulled-out line on the overview and the page.",
      },
      validate: forbidsPhrases(),
    },
    {
      name: "note",
      type: "textarea",
      admin: { description: "A qualification or caveat, if the approved copy carries one." },
      validate: forbidsPhrases(),
    },
    {
      name: "related",
      type: "relationship",
      relationTo: "services",
      hasMany: true,
      admin: { description: "Services a reader of this page should see next." },
    },
  ],
};
```

- [ ] **Step 3: Register both and generate types**

In `src/payload.config.ts`, add `import { Services } from "./collections/Services";` beside the other collection imports, and put `Services` into the `collections` array immediately after `Solutions`.

Run:

```bash
npm run generate:types
npx tsc --noEmit
```

Expected: `tsc` clean, and `src/payload-types.ts` now contains `Solution` with a `detail` union and a `Service` interface.

- [ ] **Step 4: Verify the guardrail and the blocks in the admin**

Run: `npm run dev`

In `/admin/collections/solutions`, create a document. In **Headline**, type `A Tier III certified facility` and save.
Expected: refused, with the message naming "Tier III-aligned".

Correct it to `A Tier III-aligned facility`, then add a **Detail** section and confirm the picker offers exactly: Capability list, Capability bands, Architecture layers, Numbered sequence, Checklist, Engagement models. Save.
Expected: saves. Leave the draft; Task 17's seed will replace it.

- [ ] **Step 5: Commit**

```bash
git add src/collections/Solutions.ts src/collections/Services.ts \
        src/payload.config.ts src/payload-types.ts
git commit -m "Model the 7 solution families and 6 professional services

Solutions carries the spec's one departure from fixed templates: its detail
body is a typed section list of six known types. The approved pages genuinely
vary -- datacenter has two named bands where most have a flat capability list
-- and giving every family every field would leave most of them empty.

Services is deliberately flatter. Every approved service page has one
capability list, so there is no block field there; offering one would invite an
editor to invent variation the content does not have.

Every free-text field carries the forbidden-phrase validator."
```

---

### Task 10: Clients and projects

Ten institutions and eight documented engagements. `clients` is new; `projects` is re-modelled so `client` becomes a relationship rather than a repeated string.

Four organisations that appeared in the earlier draft model — Bonga, Haramaya, Mizan-Tepi and Yekatit 12 — are absent from the approved client directory and must not be re-entered here.

**Files:**
- Create: `src/fields/sectors.ts`
- Create: `src/collections/Clients.ts`
- Modify: `src/collections/Projects.ts`
- Modify: `src/payload.config.ts` (register `Clients`)

**Interfaces:**
- Consumes: `forbidsPhrases`, `PROJECT_RULES` (Task 3); `confirmable` (Task 4); `media.approved` (Task 8); `solutions` (Task 9)
- Produces:
  - `SECTOR_OPTIONS: { label: string; value: "education" | "banking" | "government" }[]`
  - collections `clients` and `projects`
  - `projects.year` is a `ConfirmableValue`; Task 16's transform and Task 19's reader both depend on that
  - `clients.engagements` and `projects.client` are the two halves of one relationship; Task 15's resolver populates both

- [ ] **Step 1: Write the shared sector vocabulary**

Create `src/fields/sectors.ts`:

```ts
/*
 * The three sectors in Edge's approved client directory. Shared between
 * clients and projects so the two can never drift into different vocabularies
 * -- a client filed under "Education" whose project says "Higher Education"
 * breaks grouping on both index pages.
 *
 * A three-row collection would be over-modelled: these never change without
 * the content master changing.
 */
export const SECTOR_OPTIONS = [
  { label: "Universities and Education", value: "education" },
  { label: "Banking and Financial Markets", value: "banking" },
  { label: "Government and Public Institutions", value: "government" },
] as const;
```

- [ ] **Step 2: Write the clients collection**

Create `src/collections/Clients.ts`:

```ts
import type { CollectionConfig } from "payload";
import { publishedOrSignedIn, signedIn } from "../access";
import { orderField } from "../fields/slug";
import { SECTOR_OPTIONS } from "../fields/sectors";
import { forbidsPhrases } from "../fields/validators";
import { revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";

const paths = () => ["/", "/clients"];

/*
 * The ten institutions in the approved client directory, and only those.
 *
 * Bonga, Haramaya, Mizan-Tepi and Yekatit 12 appeared in an earlier drafted
 * model and are absent from the directory. They were retired rather than
 * edited, and must not be re-added here.
 *
 * There is no per-client page: the approved design has a clients index only.
 * So there is no slug field, and `order` controls the mark wall.
 */
export const Clients: CollectionConfig = {
  slug: "clients",
  labels: { singular: "Client", plural: "Clients" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "sector", "order", "_status"],
    group: "Content",
    description:
      "Institutions Edge works with. Only organisations in the approved client directory belong here.",
  },
  access: { read: publishedOrSignedIn, create: signedIn, update: signedIn, delete: signedIn },
  versions: { drafts: { autosave: { interval: 800 } } },
  hooks: {
    afterChange: [revalidateAfterChange(paths)],
    afterDelete: [revalidateAfterDelete(paths)],
  },
  fields: [
    { name: "name", type: "text", required: true, validate: forbidsPhrases() },
    orderField,
    {
      name: "sector",
      type: "select",
      required: true,
      options: [...SECTOR_OPTIONS],
      admin: { position: "sidebar" },
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      filterOptions: { approved: { equals: true } },
      admin: {
        description:
          "Only approved assets can be selected. With no logo, the site sets the institution's name in the same frame the mark would occupy — which is the intended behaviour, not a gap.",
      },
    },
    {
      name: "summary",
      type: "textarea",
      required: true,
      admin: { description: "Two or three sentences on what Edge has delivered for them." },
      validate: forbidsPhrases(),
    },
    {
      name: "engagements",
      type: "relationship",
      relationTo: "projects",
      hasMany: true,
      admin: {
        description:
          "Published project records for this client. Leave empty where engagement details are not published.",
      },
    },
    {
      name: "solutions",
      type: "relationship",
      relationTo: "solutions",
      hasMany: true,
      admin: { description: "The solution families this relationship spans." },
    },
  ],
};
```

- [ ] **Step 3: Re-model the projects collection**

Replace the whole of `src/collections/Projects.ts`:

```ts
import type { CollectionConfig } from "payload";
import { publishedOrSignedIn, signedIn } from "../access";
import { slugField } from "../fields/slug";
import { SECTOR_OPTIONS } from "../fields/sectors";
import { confirmable } from "../fields/confirmable";
import { PROJECT_RULES, forbidsPhrases } from "../fields/validators";
import { revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";

const paths = (doc: { slug?: string | null }) => [
  "/",
  "/projects",
  "/clients",
  ...(doc.slug ? [`/projects/${doc.slug}`] : []),
];

/*
 * The eight documented engagements.
 *
 * Every free-text field here validates against PROJECT_RULES rather than the
 * base rules, which adds one project-only rule: the approved wording for Bahir
 * Dar's campus spaces is "campus security control room", never "SOC". That
 * rule is scoped to this collection because SOC is correct on the
 * cybersecurity solution page.
 *
 * No contract values and no invented quantities. The master publishes neither.
 */
const projectText = forbidsPhrases(PROJECT_RULES);

export const Projects: CollectionConfig = {
  slug: "projects",
  labels: { singular: "Project", plural: "Projects" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "client", "sector", "_status"],
    group: "Content",
    description: "Delivered engagements, written as case records rather than marketing.",
  },
  access: { read: publishedOrSignedIn, create: signedIn, update: signedIn, delete: signedIn },
  versions: { drafts: { autosave: { interval: 800 } } },
  hooks: {
    afterChange: [revalidateAfterChange(paths)],
    afterDelete: [revalidateAfterDelete(paths)],
  },
  fields: [
    { name: "title", type: "text", required: true, validate: projectText },
    slugField("Page URL: /projects/<slug>"),
    {
      name: "client",
      type: "relationship",
      relationTo: "clients",
      required: true,
      admin: { description: "Must be an institution in the approved client directory." },
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description: "The featured engagement leads the projects index. Tick one.",
      },
    },
    {
      name: "sector",
      type: "select",
      required: true,
      options: [...SECTOR_OPTIONS],
      admin: { position: "sidebar" },
    },
    {
      name: "sectorFull",
      type: "text",
      admin: {
        description:
          "The longer sector description shown on the project page, e.g. 'Higher Education'.",
      },
      validate: projectText,
    },
    {
      name: "location",
      type: "text",
      required: true,
      admin: { description: "Where the work happened, e.g. 'Bahir Dar — university campuses'." },
      validate: projectText,
    },
    confirmable("year", {
      label: "Period",
      description:
        "When the work ran, e.g. '2024/2025'. Leave the value empty and the status pending where Edge has not confirmed it.",
      defaultPendingLabel: "Year to confirm",
    }),
    {
      name: "primary",
      type: "text",
      required: true,
      admin: { description: "The focus in a few words, e.g. 'Smart learning and collaboration'." },
      validate: projectText,
    },
    {
      name: "headline",
      type: "text",
      admin: {
        description:
          "The promise at the top of the project page, where the approved copy has one distinct from the title.",
      },
      validate: projectText,
    },
    {
      name: "summary",
      type: "textarea",
      required: true,
      admin: { description: "Two or three sentences. Used on the index and in search results." },
      validate: projectText,
    },
    {
      name: "solutions",
      type: "relationship",
      relationTo: "solutions",
      hasMany: true,
      required: true,
      admin: {
        description:
          "The families this engagement drew on. CCTV, access control and barriers belong to Datacenter and IT Infrastructure, not Cybersecurity.",
      },
    },
    {
      name: "tech",
      type: "array",
      labels: { singular: "Technology", plural: "Technologies used" },
      admin: { description: "Named platforms, e.g. PeopleLink, IQBoard, NEARITY." },
      fields: [{ name: "item", type: "text", required: true, validate: projectText }],
    },
    {
      name: "need",
      type: "textarea",
      required: true,
      admin: { description: "What the client needed, before any mention of what Edge did." },
      validate: projectText,
    },
    {
      name: "scope",
      type: "textarea",
      required: true,
      admin: { description: "What the engagement covered." },
      validate: projectText,
    },
    {
      name: "delivered",
      type: "array",
      labels: { singular: "Item", plural: "What was delivered" },
      minRows: 1,
      fields: [{ name: "item", type: "text", required: true, validate: projectText }],
    },
    {
      name: "outcomes",
      type: "array",
      labels: { singular: "Outcome", plural: "Outcomes" },
      fields: [{ name: "item", type: "text", required: true, validate: projectText }],
    },
    {
      name: "technology",
      type: "array",
      labels: { singular: "Component", plural: "Technology detail" },
      fields: [{ name: "item", type: "text", required: true, validate: projectText }],
    },
    {
      name: "technologyNote",
      type: "textarea",
      admin: { description: "A qualification on the technology list, if the approved copy has one." },
      validate: projectText,
    },
    {
      name: "training",
      type: "textarea",
      admin: { description: "Knowledge transfer and training delivered at handover." },
      validate: projectText,
    },
    {
      name: "privacy",
      type: "textarea",
      admin: {
        description:
          "Any privacy or data-handling note the client requires alongside this record.",
      },
      validate: projectText,
    },
  ],
};
```

- [ ] **Step 4: Register and generate types**

In `src/payload.config.ts`, add `import { Clients } from "./collections/Clients";` and place `Clients` in the `collections` array immediately before `Projects`.

Run:

```bash
npm run generate:types
npx tsc --noEmit
```

Expected: clean. `src/payload-types.ts` gains `Client`, and `Project.year` is a group with `value`, `status`, `pendingLabel`.

- [ ] **Step 5: Verify the project-only SOC rule and the logo gate**

Run: `npm run dev`

In `/admin/collections/projects`, create a draft and put `Two campus SOC rooms` in **Scope**. Save.
Expected: refused, naming "campus security control room".

Change it to `Two campus security control rooms`. Save.
Expected: saves.

Then in `/admin/collections/clients`, create a draft and open the **Logo** picker.
Expected: only media with Approved ticked is offered. If you have an unapproved upload from Task 8, confirm it is absent.

- [ ] **Step 6: Commit**

```bash
git add src/fields/sectors.ts src/collections/Clients.ts src/collections/Projects.ts \
        src/payload.config.ts src/payload-types.ts
git commit -m "Model the 10 clients and re-model the 8 projects

client becomes a relationship rather than a string repeated on every project,
so the clients index and the project pages cannot disagree about who the work
was for.

Project free text validates against PROJECT_RULES, which adds the one
project-only rule: Bahir Dar's campus spaces are security control rooms, not
SOC. Scoped here because SOC is correct on the cybersecurity page.

Sector is a shared three-option vocabulary rather than a collection -- these
never change without the content master changing -- and the logo relationship
is filtered to approved assets, so an unapproved mark cannot be selected.

Clients has no slug: the approved design has an index only, no per-client page."
```

---

### Task 11: Partner taxonomy

Ten capability groups and thirty-two brands. `partnerCategories` is new; `partners` is re-modelled.

**The strongest guardrail in this plan is in this task, and it is an absence.** There is no field for partnership type, authorization level or certification tier. Not hidden, not admin-only — absent. An editor cannot publish what the schema cannot hold. Do not add one.

**Files:**
- Create: `src/collections/PartnerCategories.ts`
- Modify: `src/collections/Partners.ts`
- Modify: `src/payload.config.ts` (register `PartnerCategories`)

**Interfaces:**
- Consumes: `forbidsPhrases` (Task 3); `media.approved` (Task 8); `solutions` (Task 9); `projects` (Task 10)
- Produces:
  - collection `partnerCategories` with `key`, `label`, `ringLabel`, `description`, `order`
  - collection `partners` with `name`, `logo`, `categories`, `featured`, `capability`, `solution`, `projects`, `order`
  - Task 16's transform maps Highland's `cats[]` onto `categories` and its `cap` onto `capability`
  - Phase 5's partners page reads `ringLabel` for the diagram and `label` everywhere else

- [ ] **Step 1: Write the categories collection**

Create `src/collections/PartnerCategories.ts`:

```ts
import type { CollectionConfig } from "payload";
import { publishedOrSignedIn, signedIn } from "../access";
import { orderField } from "../fields/slug";
import { forbidsPhrases } from "../fields/validators";
import { revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";

const paths = () => ["/partners"];

/*
 * The ten capability groups the partner network is organised by.
 *
 * ringLabel exists because the partners diagram puts these on a circle, where
 * "Datacenter Facility and IT Infrastructure" does not fit and "Datacenter"
 * does. It is the same category set shorter, not a second name for it -- which
 * is why it lives beside the label rather than being derived by truncation.
 */
export const PartnerCategories: CollectionConfig = {
  slug: "partnerCategories",
  labels: { singular: "Partner category", plural: "Partner categories" },
  admin: {
    useAsTitle: "label",
    defaultColumns: ["label", "ringLabel", "order"],
    group: "Content",
    description: "Capability groups used to organise and filter the partner network.",
  },
  access: { read: publishedOrSignedIn, create: signedIn, update: signedIn, delete: signedIn },
  versions: { drafts: { autosave: { interval: 800 } } },
  hooks: {
    afterChange: [revalidateAfterChange(paths)],
    afterDelete: [revalidateAfterDelete(paths)],
  },
  fields: [
    {
      name: "key",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        position: "sidebar",
        description: "Stable identifier used by the filter, e.g. system-cloud. Do not change it.",
      },
      hooks: {
        beforeValidate: [({ value }) => (typeof value === "string" ? value.trim().toLowerCase() : value)],
      },
    },
    {
      name: "label",
      type: "text",
      required: true,
      admin: { description: "The full name, e.g. 'System, Computing and Cloud'." },
      validate: forbidsPhrases(),
    },
    {
      name: "ringLabel",
      type: "text",
      required: true,
      admin: {
        description:
          "A short form that fits on the partner diagram, e.g. 'Compute & Cloud'. Two or three words.",
      },
      validate: forbidsPhrases(),
    },
    {
      name: "description",
      type: "textarea",
      required: true,
      admin: { description: "What this group covers. Shown when the group is selected." },
      validate: forbidsPhrases(),
    },
    orderField,
  ],
};
```

- [ ] **Step 2: Re-model the partners collection**

Replace the whole of `src/collections/Partners.ts`:

```ts
import type { CollectionConfig } from "payload";
import { publishedOrSignedIn, signedIn } from "../access";
import { orderField } from "../fields/slug";
import { forbidsPhrases } from "../fields/validators";
import { revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";

const paths = () => ["/", "/partners", "/solutions"];

/*
 * The thirty-two manufacturers and distributors Edge works with.
 *
 * THERE IS NO FIELD HERE FOR PARTNERSHIP TYPE, AUTHORIZATION LEVEL OR
 * CERTIFICATION TIER, AND NONE MAY BE ADDED.
 *
 * The content master forbids publishing any of them: they change over time and
 * are governed by each manufacturer's own agreements. Absence is the
 * enforcement mechanism -- a validator can be argued with, a missing column
 * cannot. If someone asks for "just a note field" for tier, the answer is the
 * same: it ends up rendered.
 *
 * There is no per-partner page either. Brands link to the Edge solution page
 * they belong to, never to their own site.
 */
export const Partners: CollectionConfig = {
  slug: "partners",
  labels: { singular: "Partner", plural: "Partners" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "solution", "featured", "order"],
    group: "Content",
    description:
      "Manufacturers and distributors. Partnership tiers and authorization levels are never published — do not add fields for them.",
  },
  access: { read: publishedOrSignedIn, create: signedIn, update: signedIn, delete: signedIn },
  versions: { drafts: { autosave: { interval: 800 } } },
  hooks: {
    afterChange: [revalidateAfterChange(paths)],
    afterDelete: [revalidateAfterDelete(paths)],
  },
  fields: [
    { name: "name", type: "text", required: true, validate: forbidsPhrases() },
    orderField,
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      filterOptions: { approved: { equals: true } },
      admin: {
        description:
          "Only approved assets can be selected. With no logo, the site sets the brand's name in the same frame the mark would occupy — intended behaviour, not a gap. Dropping an approved file in here is the whole swap.",
      },
    },
    {
      name: "categories",
      type: "relationship",
      relationTo: "partnerCategories",
      hasMany: true,
      required: true,
      admin: { description: "Every group this brand belongs to. Most belong to one or two." },
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: { position: "sidebar", description: "Featured brands lead the partner network." },
    },
    {
      name: "capability",
      type: "textarea",
      required: true,
      admin: {
        description:
          "What Edge delivers with this technology, in the client's terms. Describe the capability, never the relationship.",
      },
      validate: forbidsPhrases(),
    },
    {
      name: "solution",
      type: "relationship",
      relationTo: "solutions",
      required: true,
      admin: {
        description:
          "The Edge solution page this brand links to. Brand cards never link to the brand's own site.",
      },
    },
    {
      name: "projects",
      type: "relationship",
      relationTo: "projects",
      hasMany: true,
      admin: { description: "Delivered engagements where this technology was used, if published." },
    },
  ],
};
```

- [ ] **Step 3: Register and generate types**

In `src/payload.config.ts`, add `import { PartnerCategories } from "./collections/PartnerCategories";` and place `PartnerCategories` in the `collections` array immediately before `Partners`.

Run:

```bash
npm run generate:types
npx tsc --noEmit
```

Expected: clean, with `PartnerCategory` and a re-shaped `Partner` in `payload-types.ts`.

- [ ] **Step 4: Verify the absence is real and the key is stable**

Run:

```bash
grep -niE "tier|authoriz|certif" src/collections/Partners.ts
```

Expected: matches only inside the comment and the `admin.description` warning — never a field `name`.

Then `npm run dev`, open `/admin/collections/partners`, and confirm the edit form offers no tier, authorization or certification input. Create a category with key `System-Cloud` and confirm it saves as `system-cloud`.

- [ ] **Step 5: Commit**

```bash
git add src/collections/PartnerCategories.ts src/collections/Partners.ts \
        src/payload.config.ts src/payload-types.ts
git commit -m "Model the partner network with no tier field, by design

The content master forbids publishing partnership type, authorization level
and certification tier. This schema has no field for any of them -- absence,
not a validator, because a validator can be argued with and a missing column
cannot. The collection description says so for whoever reads it next.

ringLabel sits beside label rather than being truncated from it: the diagram
needs 'Compute & Cloud' where the real name is 'System, Computing and Cloud',
and that is an editorial choice, not a string operation.

Brand cards relate to the Edge solution page they belong to, never to the
brand's own site."
```

---

### Task 12: Events, and the status that must not go stale

Carries **Review Focus #2**: an event whose date range straddles today must read as upcoming.

Highland stores a single `iso` per event, which is wrong for a range. GITEX runs 7–11 December but its `iso` is `2026-12-07`, so status derived from a start date alone marks a running event past on the 8th. This task models a range and derives status from its end.

**Files:**
- Create: `src/lib/events.ts`
- Create: `src/lib/events.test.ts`
- Create: `src/collections/Events.ts`
- Modify: `src/payload.config.ts` (register `Events`)

**Interfaces:**
- Consumes: `forbidsPhrases` (Task 3)
- Produces:
  - `type EventStatus = "upcoming" | "past"`
  - `eventStatus(input: { startsOn?: string | null; endsOn?: string | null }, now?: Date): EventStatus`
  - collection `events` with `startsOn`, `endsOn`, `displayDate` and **no stored status**
  - Task 17's transform derives `startsOn`/`endsOn` from Highland's `iso` and `date`; Task 19's reader calls `eventStatus`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/events.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { eventStatus } from "./events";

const at = (iso: string) => new Date(`${iso}T09:00:00Z`);

describe("eventStatus", () => {
  it("is upcoming before a single-day event", () => {
    expect(eventStatus({ startsOn: "2026-10-23" }, at("2026-10-09"))).toBe("upcoming");
  });

  it("is upcoming on the day of a single-day event", () => {
    expect(eventStatus({ startsOn: "2026-10-23" }, at("2026-10-23"))).toBe("upcoming");
  });

  it("is past the day after a single-day event", () => {
    expect(eventStatus({ startsOn: "2026-09-28" }, at("2026-09-29"))).toBe("past");
  });

  it("is upcoming midway through a multi-day event", () => {
    // GITEX: 7-11 December. On the 8th it is running, not over.
    const gitex = { startsOn: "2026-12-07", endsOn: "2026-12-11" };
    expect(eventStatus(gitex, at("2026-12-08"))).toBe("upcoming");
  });

  it("is upcoming on the final day of a multi-day event", () => {
    expect(eventStatus({ startsOn: "2026-12-07", endsOn: "2026-12-11" }, at("2026-12-11"))).toBe(
      "upcoming",
    );
  });

  it("is past the day after a multi-day event ends", () => {
    expect(eventStatus({ startsOn: "2026-12-07", endsOn: "2026-12-11" }, at("2026-12-12"))).toBe(
      "past",
    );
  });

  it("falls back to the start date when there is no end date", () => {
    expect(eventStatus({ startsOn: "2026-09-28", endsOn: null }, at("2026-09-29"))).toBe("past");
  });

  it("ignores time of day, comparing whole dates only", () => {
    const lateInTheDay = new Date("2026-10-23T23:59:00Z");
    expect(eventStatus({ startsOn: "2026-10-23" }, lateInTheDay)).toBe("upcoming");
  });

  it("accepts a full timestamp as the stored date", () => {
    expect(eventStatus({ startsOn: "2026-12-07T00:00:00.000Z", endsOn: "2026-12-11T00:00:00.000Z" }, at("2026-12-09"))).toBe(
      "upcoming",
    );
  });

  it("treats a missing date as upcoming, so a data error stays visible", () => {
    expect(eventStatus({}, at("2026-10-09"))).toBe("upcoming");
    expect(eventStatus({ startsOn: null }, at("2026-10-09"))).toBe("upcoming");
  });

  it("treats an unparseable date as upcoming rather than hiding the event", () => {
    expect(eventStatus({ startsOn: "not a date" }, at("2026-10-09"))).toBe("upcoming");
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- events`

Expected: FAIL with `Failed to resolve import "./events"`.

- [ ] **Step 3: Write the implementation**

Create `src/lib/events.ts`:

```ts
/*
 * Event status is derived, never stored.
 *
 * A stored status goes stale silently the morning after an event: nobody gets
 * a notification, and the page keeps inviting registrations for a session that
 * has happened.
 *
 * It derives from the END of the range, not the start. Highland kept a single
 * `iso` per event, which is fine for a one-day webinar and wrong for GITEX:
 * that runs 7-11 December, and a start-date comparison marks it past on the
 * 8th while the team is still standing on the floor.
 *
 * Comparison is on whole UTC dates. Comparing timestamps would flip an event
 * to past at midnight UTC rather than at the end of its last day, and
 * comparing in local time would give different answers to a reader in Addis
 * Ababa and the build server.
 *
 * A missing or unparseable date returns "upcoming" on purpose. The failure
 * mode of guessing wrong here is either an event nobody can find or an event
 * that looks live; the second is visible and gets fixed, the first does not.
 */

export type EventStatus = "upcoming" | "past";

/** Whole-day UTC ordinal, so time of day cannot affect the comparison. */
const dayNumber = (date: Date): number =>
  Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 86_400_000;

export function eventStatus(
  input: { startsOn?: string | null; endsOn?: string | null },
  now: Date = new Date(),
): EventStatus {
  const raw = input.endsOn ?? input.startsOn;
  if (!raw) return "upcoming";

  const ends = new Date(raw);
  if (Number.isNaN(ends.getTime())) return "upcoming";

  return dayNumber(ends) < dayNumber(now) ? "past" : "upcoming";
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -- events`

Expected: PASS, all eleven cases.

- [ ] **Step 5: Write the events collection**

Create `src/collections/Events.ts`:

```ts
import type { CollectionConfig } from "payload";
import { publishedOrSignedIn, signedIn } from "../access";
import { slugField } from "../fields/slug";
import { forbidsPhrases } from "../fields/validators";
import { revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";

const paths = (doc: { slug?: string | null }) => [
  "/resources",
  "/events",
  ...(doc.slug ? [`/events/${doc.slug}`] : []),
];

/*
 * Webinars, briefings and exhibitions.
 *
 * There is deliberately no `status` field. See src/lib/events.ts: it is
 * derived from endsOn ?? startsOn so it cannot go stale, and storing it would
 * give an editor a value to forget to change.
 *
 * displayDate carries the human string because it cannot be formatted back out
 * of two dates reliably -- "7-11 December 2026" is an editorial choice about
 * an en dash and a dropped month, not a date format.
 */
export const Events: CollectionConfig = {
  slug: "events",
  labels: { singular: "Event", plural: "Events" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "displayDate", "format", "_status"],
    group: "Resources",
    description:
      "Sessions Edge runs or attends. Upcoming and past are worked out from the dates — there is nothing to switch over afterwards.",
  },
  access: { read: publishedOrSignedIn, create: signedIn, update: signedIn, delete: signedIn },
  versions: { drafts: { autosave: { interval: 800 } } },
  hooks: {
    afterChange: [revalidateAfterChange(paths)],
    afterDelete: [revalidateAfterDelete(paths)],
  },
  fields: [
    { name: "title", type: "text", required: true, validate: forbidsPhrases() },
    slugField("Page URL: /events/<slug>"),
    {
      name: "startsOn",
      type: "date",
      required: true,
      admin: { position: "sidebar", description: "First day of the session." },
    },
    {
      name: "endsOn",
      type: "date",
      admin: {
        position: "sidebar",
        description:
          "Last day, for sessions running more than one day. Leave empty for a single-day event — the site then uses the start date.",
      },
    },
    {
      name: "displayDate",
      type: "text",
      required: true,
      admin: {
        description:
          "How the date reads on the page, e.g. '7–11 December 2026' or '23 October 2026'.",
      },
      validate: forbidsPhrases(),
    },
    {
      name: "category",
      type: "text",
      required: true,
      admin: { description: "e.g. 'Webinar and online event', 'International exhibition'." },
      validate: forbidsPhrases(),
    },
    {
      name: "format",
      type: "select",
      required: true,
      options: [
        { label: "Online", value: "Online" },
        { label: "In person", value: "In person" },
        { label: "Hybrid", value: "Hybrid" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "venue",
      type: "text",
      required: true,
      admin: {
        description:
          "The platform for an online session or the venue for an in-person one. 'Platform to be confirmed' is an acceptable value.",
      },
      validate: forbidsPhrases(),
    },
    {
      name: "headline",
      type: "text",
      required: true,
      admin: { description: "The promise at the top of the page. One line." },
      validate: forbidsPhrases(),
    },
    {
      name: "intro",
      type: "textarea",
      required: true,
      validate: forbidsPhrases(),
    },
    {
      name: "audience",
      type: "text",
      required: true,
      admin: { description: "Who the session is for." },
      validate: forbidsPhrases(),
    },
    {
      name: "program",
      type: "array",
      minRows: 1,
      labels: { singular: "Item", plural: "Programme" },
      fields: [{ name: "item", type: "text", required: true, validate: forbidsPhrases() }],
    },
    {
      name: "action",
      type: "text",
      required: true,
      defaultValue: "Register",
      admin: { description: "The registration button's wording, e.g. 'Register Online'." },
      validate: forbidsPhrases(),
    },
    {
      name: "pendingNote",
      type: "text",
      admin: {
        description:
          "Shown as a visible marker where something about the session is not yet confirmed.",
      },
      validate: forbidsPhrases(),
    },
  ],
};
```

- [ ] **Step 6: Register, generate types, verify**

In `src/payload.config.ts`, add `import { Events } from "./collections/Events";` and place `Events` in the `collections` array after `Projects`.

Run:

```bash
npm run generate:types
npx tsc --noEmit
npm test
npm run dev
```

Expected: `tsc` clean, all tests pass, and `/admin/collections/events` offers no status field.

- [ ] **Step 7: Commit**

```bash
git add src/lib/events.ts src/lib/events.test.ts src/collections/Events.ts \
        src/payload.config.ts src/payload-types.ts
git commit -m "Derive event status from the end of the range, never store it

A stored status goes stale silently the morning after an event -- nobody is
notified, and the page keeps inviting registrations for a session that has
happened. So there is no status field.

It derives from endsOn ?? startsOn, not from the start. Highland kept one iso
per event, which is right for a one-day webinar and wrong for GITEX: that runs
7-11 December, and a start-date comparison marks it past on the 8th while the
team is still on the floor.

Comparison is on whole UTC dates: timestamps would flip an event at midnight
UTC rather than at the end of its last day, and local time would give a reader
in Addis Ababa a different answer from the build server. A missing or
unparseable date reads upcoming, because an event that looks live is visible
and gets fixed, while one nobody can find is not."
```

---

### Task 13: Insights, news and downloads

Ten posts across ten categories, three news records, four documents.

**Files:**
- Create: `src/collections/PostCategories.ts`
- Create: `src/collections/Posts.ts`
- Create: `src/collections/Downloads.ts`
- Modify: `src/collections/News.ts`
- Modify: `src/payload.config.ts` (register the four)

**Interfaces:**
- Consumes: `forbidsPhrases` (Task 3); `confirmable` (Task 4); `media.approved` (Task 8); `solutions` (Task 9)
- Produces: collections `postCategories`, `posts`, `news`, `downloads`. `posts.target` + `posts.anchor` are the Read More destination; Phase 5's blog page builds `/solutions/<target>#<anchor>` from them. `news.date` is a `ConfirmableValue`.

- [ ] **Step 1: Write the post categories**

Create `src/collections/PostCategories.ts`:

```ts
import type { CollectionConfig } from "payload";
import { publishedOrSignedIn, signedIn } from "../access";
import { orderField } from "../fields/slug";
import { forbidsPhrases } from "../fields/validators";
import { revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";

const paths = () => ["/blog"];

/** Topic labels for the insights rail. No pages of their own. */
export const PostCategories: CollectionConfig = {
  slug: "postCategories",
  labels: { singular: "Insight topic", plural: "Insight topics" },
  admin: {
    useAsTitle: "label",
    defaultColumns: ["label", "order"],
    group: "Resources",
    description: "Topics used to group the insights page.",
  },
  access: { read: publishedOrSignedIn, create: signedIn, update: signedIn, delete: signedIn },
  versions: { drafts: { autosave: { interval: 800 } } },
  hooks: {
    afterChange: [revalidateAfterChange(paths)],
    afterDelete: [revalidateAfterDelete(paths)],
  },
  fields: [
    {
      name: "key",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: { position: "sidebar", description: "Stable identifier. Do not change it." },
      hooks: {
        beforeValidate: [({ value }) => (typeof value === "string" ? value.trim().toLowerCase() : value)],
      },
    },
    { name: "label", type: "text", required: true, validate: forbidsPhrases() },
    orderField,
  ],
};
```

- [ ] **Step 2: Write the posts collection**

Create `src/collections/Posts.ts`:

```ts
import type { CollectionConfig } from "payload";
import { publishedOrSignedIn, signedIn } from "../access";
import { orderField, slugField } from "../fields/slug";
import { forbidsPhrases } from "../fields/validators";
import { revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";

/*
 * Insights.
 *
 * THESE HAVE NO DETAIL PAGES, AND NONE MAY BE ADDED.
 *
 * The content master is explicit: "do not create thin article-detail pages
 * containing the same short copy solely to insert another click." The articles
 * are short by design and publish in full on /blog; the Read More goes to the
 * solution capability each one introduces.
 *
 * So the slug here is an anchor on /blog, not a URL, and the revalidation
 * paths list no per-post route. If someone asks for article pages, the answer
 * is in the master.
 */
const paths = () => ["/", "/blog", "/resources"];

export const Posts: CollectionConfig = {
  slug: "posts",
  labels: { singular: "Insight", plural: "Insights" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "order", "_status"],
    group: "Resources",
    description:
      "Short articles, published in full on the insights page. They have no separate pages — each one links through to the solution it introduces.",
  },
  access: { read: publishedOrSignedIn, create: signedIn, update: signedIn, delete: signedIn },
  versions: { drafts: { autosave: { interval: 800 } } },
  hooks: {
    afterChange: [revalidateAfterChange(paths)],
    afterDelete: [revalidateAfterDelete(paths)],
  },
  fields: [
    { name: "title", type: "text", required: true, validate: forbidsPhrases() },
    slugField("Anchor on the insights page: /blog#post-<slug>. Not a page of its own."),
    orderField,
    {
      name: "category",
      type: "relationship",
      relationTo: "postCategories",
      required: true,
    },
    {
      name: "body",
      type: "richText",
      required: true,
      admin: {
        description:
          "Two or three paragraphs. Short is the point — the solution page carries the depth.",
      },
      validate: forbidsPhrases(),
    },
    {
      name: "target",
      type: "relationship",
      relationTo: "solutions",
      required: true,
      admin: { description: "The solution family this article's Read More goes to." },
    },
    {
      name: "anchor",
      type: "text",
      admin: {
        description:
          "Optional. The capability heading on that solution page to jump to. Leave empty to link to the top of the page — one article has no single matching capability and does exactly that.",
      },
    },
    {
      name: "readMoreLabel",
      type: "text",
      required: true,
      admin: { description: "The link's wording, e.g. 'Read more about Private RAG…'." },
      validate: forbidsPhrases(),
    },
  ],
};
```

- [ ] **Step 3: Re-model the news collection**

Replace the whole of `src/collections/News.ts`:

```ts
import type { CollectionConfig } from "payload";
import { publishedOrSignedIn, signedIn } from "../access";
import { slugField } from "../fields/slug";
import { confirmable } from "../fields/confirmable";
import { forbidsPhrases } from "../fields/validators";
import { revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";

const paths = (doc: { slug?: string | null }) => [
  "/resources",
  "/news",
  ...(doc.slug ? [`/news/${doc.slug}`] : []),
];

/*
 * Company news and announcements.
 *
 * `archive` keeps the 2018 founding milestone out of the current feed without
 * deleting it: it belongs in an archive band, not presented as news.
 */
export const News: CollectionConfig = {
  slug: "news",
  labels: { singular: "News item", plural: "News and announcements" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "kind", "archive", "_status"],
    group: "Resources",
    description: "Milestones, partnership and project announcements, and company updates.",
  },
  access: { read: publishedOrSignedIn, create: signedIn, update: signedIn, delete: signedIn },
  versions: { drafts: { autosave: { interval: 800 } } },
  hooks: {
    afterChange: [revalidateAfterChange(paths)],
    afterDelete: [revalidateAfterDelete(paths)],
  },
  fields: [
    { name: "title", type: "text", required: true, validate: forbidsPhrases() },
    slugField("Page URL: /news/<slug>"),
    {
      name: "kind",
      type: "text",
      required: true,
      admin: {
        position: "sidebar",
        description: "e.g. 'Company milestone', 'Company news', 'Insight'.",
      },
      validate: forbidsPhrases(),
    },
    confirmable("date", {
      label: "Date",
      description:
        "How the date reads, e.g. '2018' or 'Evergreen'. Leave the value empty and the status pending where Edge has not confirmed it.",
      defaultPendingLabel: "Date to confirm",
    }),
    {
      name: "archive",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description:
          "Ticked items move to the archive band instead of the current feed. Use for older milestones.",
      },
    },
    {
      name: "standfirst",
      type: "textarea",
      required: true,
      admin: { description: "The opening paragraph, shown on the index and under the headline." },
      validate: forbidsPhrases(),
    },
    {
      name: "body",
      type: "richText",
      required: true,
      validate: forbidsPhrases(),
    },
  ],
};
```

- [ ] **Step 4: Write the downloads collection**

Create `src/collections/Downloads.ts`:

```ts
import type { CollectionConfig } from "payload";
import { publishedOrSignedIn, signedIn } from "../access";
import { orderField } from "../fields/slug";
import { forbidsPhrases } from "../fields/validators";
import { revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";

const paths = () => ["/resources", "/downloads"];

/*
 * Documents the site offers.
 *
 * `approved` is separate from the file: a document can exist here, be listed
 * with its status, and still not be downloadable. The master requires each one
 * to be checked against the current solution taxonomy first, and listing a
 * document honestly as under review is better than hiding it or serving a
 * version that contradicts the site.
 */
export const Downloads: CollectionConfig = {
  slug: "downloads",
  labels: { singular: "Download", plural: "Downloads" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "approved", "_status"],
    group: "Resources",
    description:
      "Company profile, brochures, datasheets and vendor catalogues. Until Approved is ticked, the site lists the document and routes the request to the team instead of serving the file.",
  },
  access: { read: publishedOrSignedIn, create: signedIn, update: signedIn, delete: signedIn },
  versions: { drafts: { autosave: { interval: 800 } } },
  hooks: {
    afterChange: [revalidateAfterChange(paths)],
    afterDelete: [revalidateAfterDelete(paths)],
  },
  fields: [
    { name: "title", type: "text", required: true, validate: forbidsPhrases() },
    orderField,
    {
      name: "category",
      type: "text",
      required: true,
      admin: {
        position: "sidebar",
        description: "e.g. 'Company profile', 'Solution brochure', 'Datasheet'.",
      },
      validate: forbidsPhrases(),
    },
    {
      name: "owner",
      type: "text",
      required: true,
      admin: { position: "sidebar", description: "Who owns the document, e.g. 'Edge Comm-Tech'." },
      validate: forbidsPhrases(),
    },
    {
      name: "meta",
      type: "text",
      required: true,
      admin: { description: "Format and version, e.g. 'PDF · English · Version 13'." },
      validate: forbidsPhrases(),
    },
    {
      name: "note",
      type: "textarea",
      admin: {
        description: "The reviewer's note on what still needs checking before this is offered.",
      },
      validate: forbidsPhrases(),
    },
    {
      name: "file",
      type: "upload",
      relationTo: "media",
      admin: { description: "The document itself. Can be empty while it is still being prepared." },
    },
    {
      name: "approved",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description:
          "Tick only when the document has been checked against the current solution taxonomy. Until then the site offers to send it on request.",
      },
      validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
        if (!value) return true;
        if (siblingData?.file) return true;
        return "Attach the file before approving it for download.";
      },
    },
  ],
};
```

- [ ] **Step 5: Register all four and generate types**

In `src/payload.config.ts`, add the imports and place them in the `collections` array after `Events`:

```ts
import { PostCategories } from "./collections/PostCategories";
import { Posts } from "./collections/Posts";
import { Downloads } from "./collections/Downloads";
```

Order in the array: `PostCategories, Posts, News, Downloads`.

Run:

```bash
npm run generate:types
npx tsc --noEmit
```

Expected: clean, with `PostCategory`, `Post`, `Download` and a re-shaped `News` in `payload-types.ts`.

- [ ] **Step 6: Verify the download gate**

Run: `npm run dev`

In `/admin/collections/downloads`, create a draft with no file, tick **Approved**, save.
Expected: refused with "Attach the file before approving it for download."

Untick Approved. Save.
Expected: saves — a document can be listed without being downloadable, which is the intended state for all four.

- [ ] **Step 7: Commit**

```bash
git add src/collections/PostCategories.ts src/collections/Posts.ts \
        src/collections/News.ts src/collections/Downloads.ts \
        src/payload.config.ts src/payload-types.ts
git commit -m "Model insights, news and downloads

Posts have no detail pages and the collection says so in a comment that cites
the master: thin article pages carrying the same short copy to add a click are
forbidden. The slug is an anchor on /blog, and the revalidation paths list no
per-post route.

Downloads separates approved from file, because all four documents currently
exist without being downloadable -- the master requires each to be checked
against the current taxonomy first. Listing one honestly as under review beats
hiding it or serving a version that contradicts the site. Approved cannot be
ticked without a file attached.

News keeps an archive flag so the 2018 founding milestone sits in an archive
band rather than being presented as current news."
```

---

### Task 14: Vacancies and academy tracks

Two published vacancies and six E-Academy tracks.

**A second absence guardrail lives here.** There is no field for salary, benefits or employment conditions. The master approves none of them for publication, so the schema holds none.

**Files:**
- Modify: `src/collections/Jobs.ts`
- Create: `src/collections/AcademyTracks.ts`
- Modify: `src/payload.config.ts` (register `AcademyTracks`)

**Interfaces:**
- Consumes: `forbidsPhrases` (Task 3); `confirmable` (Task 4); `solutions` (Task 9)
- Produces: collections `jobs` and `academyTracks`. `jobs.deadline` is a `ConfirmableValue`. Phase 4's careers pages read both; `academyTracks.slug` is an anchor on the E-Academy page, not a route.

- [ ] **Step 1: Re-model the jobs collection**

Replace the whole of `src/collections/Jobs.ts`:

```ts
import type { CollectionConfig } from "payload";
import { publishedOrSignedIn, signedIn } from "../access";
import { slugField } from "../fields/slug";
import { confirmable } from "../fields/confirmable";
import { forbidsPhrases } from "../fields/validators";
import { revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";

const paths = (doc: { slug?: string | null }) => [
  "/careers",
  "/careers/open-positions",
  ...(doc.slug ? [`/careers/jobs/${doc.slug}`] : []),
];

/*
 * Open positions.
 *
 * THERE IS NO FIELD FOR SALARY, BENEFITS OR EMPLOYMENT CONDITIONS, AND NONE
 * MAY BE ADDED. The master approves none of them for publication.
 *
 * Required and preferred qualifications stay separate lists because the master
 * keeps them separate: collapsing them turns a preference into a barrier, and
 * candidates self-select out.
 */
export const Jobs: CollectionConfig = {
  slug: "jobs",
  labels: { singular: "Open position", plural: "Open positions" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "department", "level", "_status"],
    group: "People",
    description:
      "Published vacancies. Salary and benefits are never published — do not add fields for them.",
  },
  access: { read: publishedOrSignedIn, create: signedIn, update: signedIn, delete: signedIn },
  versions: { drafts: { autosave: { interval: 800 } } },
  hooks: {
    afterChange: [revalidateAfterChange(paths)],
    afterDelete: [revalidateAfterDelete(paths)],
  },
  fields: [
    { name: "title", type: "text", required: true, validate: forbidsPhrases() },
    slugField("Page URL: /careers/jobs/<slug>"),
    {
      name: "department",
      type: "text",
      required: true,
      admin: { position: "sidebar" },
      validate: forbidsPhrases(),
    },
    {
      name: "level",
      type: "select",
      required: true,
      options: [
        { label: "Executive", value: "Executive" },
        { label: "Senior", value: "Senior" },
        { label: "Mid-level", value: "Mid-level" },
        { label: "Junior", value: "Junior" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "reports",
      type: "text",
      required: true,
      admin: { position: "sidebar", description: "Who the role reports to." },
      validate: forbidsPhrases(),
    },
    {
      name: "type",
      type: "text",
      required: true,
      admin: { position: "sidebar", description: "e.g. 'Full-time'." },
      validate: forbidsPhrases(),
    },
    {
      name: "status",
      type: "text",
      required: true,
      defaultValue: "Open",
      admin: { position: "sidebar" },
      validate: forbidsPhrases(),
    },
    {
      name: "location",
      type: "text",
      required: true,
      validate: forbidsPhrases(),
    },
    confirmable("deadline", {
      label: "Application deadline",
      description:
        "Leave the value empty and the status pending until Edge sets a date — the site then shows a visible marker rather than implying there is time.",
      defaultPendingLabel: "Deadline to be confirmed",
    }),
    {
      name: "purposeTitle",
      type: "text",
      required: true,
      admin: { description: "A one-line statement of what the role is for." },
      validate: forbidsPhrases(),
    },
    {
      name: "purpose",
      type: "textarea",
      required: true,
      validate: forbidsPhrases(),
    },
    {
      name: "scope",
      type: "textarea",
      admin: { description: "The breadth of the role, where the approved copy describes it." },
      validate: forbidsPhrases(),
    },
    {
      name: "responsibilities",
      type: "array",
      minRows: 1,
      labels: { singular: "Responsibility", plural: "What the role owns" },
      fields: [{ name: "item", type: "text", required: true, validate: forbidsPhrases() }],
    },
    {
      name: "required",
      type: "array",
      minRows: 1,
      labels: { singular: "Requirement", plural: "Required qualifications" },
      admin: { description: "Genuine requirements only. Anything desirable belongs in Preferred." },
      fields: [{ name: "item", type: "text", required: true, validate: forbidsPhrases() }],
    },
    {
      name: "preferred",
      type: "array",
      labels: { singular: "Preference", plural: "Preferred qualifications" },
      admin: { description: "What strengthens an application without being a barrier to applying." },
      fields: [{ name: "item", type: "text", required: true, validate: forbidsPhrases() }],
    },
    {
      name: "success",
      type: "textarea",
      required: true,
      admin: { description: "How performance in the role will be judged." },
      validate: forbidsPhrases(),
    },
  ],
};
```

- [ ] **Step 2: Write the academy tracks collection**

Create `src/collections/AcademyTracks.ts`:

```ts
import type { CollectionConfig } from "payload";
import { publishedOrSignedIn, signedIn } from "../access";
import { orderField, slugField } from "../fields/slug";
import { forbidsPhrases } from "../fields/validators";
import { revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";

const paths = () => ["/careers", "/careers/e-academy"];

/*
 * E-Academy training tracks.
 *
 * Each track teaches a solution family Edge actually implements, which is why
 * `solution` is required: the academy is not a separate catalogue of courses,
 * it teaches the work. A track with no solution behind it would be a course
 * Edge does not do.
 *
 * The slug is an anchor on the E-Academy page. These have no pages of their
 * own; individual courses are published per intake, which Phase 6 handles.
 */
export const AcademyTracks: CollectionConfig = {
  slug: "academyTracks",
  labels: { singular: "Academy track", plural: "Academy tracks" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "solution", "order", "_status"],
    group: "People",
    description: "Training tracks, each mapped to a solution family Edge delivers.",
  },
  access: { read: publishedOrSignedIn, create: signedIn, update: signedIn, delete: signedIn },
  versions: { drafts: { autosave: { interval: 800 } } },
  hooks: {
    afterChange: [revalidateAfterChange(paths)],
    afterDelete: [revalidateAfterDelete(paths)],
  },
  fields: [
    { name: "title", type: "text", required: true, validate: forbidsPhrases() },
    slugField("Anchor on the E-Academy page. Not a page of its own."),
    orderField,
    {
      name: "body",
      type: "textarea",
      required: true,
      admin: { description: "What the track covers." },
      validate: forbidsPhrases(),
    },
    {
      name: "solution",
      type: "relationship",
      relationTo: "solutions",
      required: true,
      admin: {
        description:
          "The family this track teaches. Required — a track with no solution behind it is a course Edge does not deliver.",
      },
    },
  ],
};
```

- [ ] **Step 3: Register and generate types**

In `src/payload.config.ts`, add `import { AcademyTracks } from "./collections/AcademyTracks";` and place `AcademyTracks` in the `collections` array immediately after `Jobs`.

Run:

```bash
npm run generate:types
npx tsc --noEmit
```

Expected: clean, with `AcademyTrack` and a re-shaped `Job` in `payload-types.ts`.

- [ ] **Step 4: Verify both absences and the pending deadline**

Run:

```bash
grep -niE "salary|benefit|compensation|wage" src/collections/Jobs.ts
```

Expected: matches only in the comment and the collection description — never a field `name`.

Then `npm run dev` and open `/admin/collections/jobs`. Create a draft, leave **Application deadline → Value** empty with status **Pending confirmation**.
Expected: saves, and the `pendingLabel` field is visible. Switch the status to **Confirmed by Edge**.
Expected: `pendingLabel` disappears from the form.

- [ ] **Step 5: Commit**

```bash
git add src/collections/Jobs.ts src/collections/AcademyTracks.ts \
        src/payload.config.ts src/payload-types.ts
git commit -m "Model the 2 vacancies and 6 academy tracks

No field for salary, benefits or employment conditions: the master approves
none of them for publication, so the schema holds none. Same reasoning as the
partner tier fields.

Required and preferred qualifications stay separate lists because the master
keeps them separate. Collapsing them turns a preference into a barrier and
candidates self-select out.

Academy tracks require a solution relationship. The academy teaches the work
Edge actually delivers, so a track with nothing behind it would be a course
Edge does not do."
```

---

### Task 15: The five globals, and retiring the old model

Five globals using `tabs`. A naive mapping of the master's singletons produces about fifteen, and fifteen sidebar entries is hostile to a non-technical editor.

This task also deletes the collections and globals the new model replaces. Nothing reads them: Task 6 trimmed `content.ts` and deleted the routes.

**Files:**
- Create: `src/globals/Company.ts`
- Create: `src/globals/ContactDetails.ts`
- Create: `src/globals/Careers.ts`
- Create: `src/globals/PageCopy.ts`
- Modify: `src/globals/SiteSettings.ts`
- Modify: `src/payload.config.ts`
- Delete: `src/collections/Sectors.ts`, `src/collections/Courses.ts`, `src/globals/HomePage.ts`, `src/globals/CompanyPage.ts`
- Delete: `src/seed/data/{solutions,sectors,courses,partners,globals}.ts`
- Note: `src/seed/index.ts` is NOT listed here. It was deleted during Task 9 (commit `bb0ad41`), because re-modelling Solutions broke its `payload.create` call and leaving it would have held `tsc` red from Task 9 through Task 14. The `git rm` below no longer names it.
- Note: `package.json` is deliberately left untouched — its `seed` script points at a file that no longer exists, and Task 18 restores it

**Interfaces:**
- Consumes: `forbidsPhrases`, `requiresScopeQualifier` (Task 3); `confirmable` (Task 4); `media` (Task 8)
- Produces: globals `company`, `contact-details`, `careers-content`, `page-copy`, and an extended `site-settings` carrying `impact[]`. Task 17's transforms target these field paths; Task 19 reads them; Task 20's footer reads `site-settings` and `contact-details`.

- [ ] **Step 1: Write the Company global**

Create `src/globals/Company.ts`:

```ts
import type { GlobalConfig } from "payload";
import { signedIn } from "../access";
import { confirmable } from "../fields/confirmable";
import { forbidsPhrases } from "../fields/validators";
import { revalidateGlobal } from "../hooks/revalidate";

const titledBody = [
  { name: "title", type: "text", required: true, validate: forbidsPhrases() },
  { name: "body", type: "textarea", required: true, validate: forbidsPhrases() },
] as const;

/*
 * Who Edge is. Tabs rather than nine separate globals, because an editor
 * looking for "our values" should not have to know which of fifteen sidebar
 * entries holds them.
 *
 * Executive roles carry titles and a confirmable name. The master publishes
 * the five role titles and no biographies, so the schema offers a name that
 * can be pending and no biography field at all -- there is nothing approved to
 * put in one, and an empty rich-text box invites someone to write it.
 */
export const Company: GlobalConfig = {
  slug: "company",
  label: "Company",
  admin: { group: "Company", description: "Profile, mission, values, history and leadership." },
  access: { read: () => true, update: signedIn },
  versions: { drafts: false },
  hooks: { afterChange: [revalidateGlobal(["/", "/about", "/about/executive-management"])] },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Profile",
          fields: [
            { name: "legalName", type: "text", required: true, validate: forbidsPhrases() },
            { name: "shortName", type: "text", required: true, validate: forbidsPhrases() },
            { name: "domain", type: "text", required: true },
            {
              name: "established",
              type: "text",
              required: true,
              admin: { description: "e.g. 'March 2018'." },
            },
            {
              name: "positioning",
              type: "textarea",
              required: true,
              admin: { description: "One sentence describing what Edge is." },
              validate: forbidsPhrases(),
            },
          ],
        },
        {
          label: "Mission and vision",
          fields: [
            { name: "mission", type: "text", required: true, validate: forbidsPhrases() },
            { name: "missionBody", type: "textarea", required: true, validate: forbidsPhrases() },
            { name: "vision", type: "text", required: true, validate: forbidsPhrases() },
            { name: "visionBody", type: "textarea", required: true, validate: forbidsPhrases() },
          ],
        },
        {
          label: "Values",
          fields: [
            {
              name: "values",
              type: "array",
              minRows: 1,
              labels: { singular: "Value", plural: "Values" },
              fields: [...titledBody],
            },
          ],
        },
        {
          label: "Journey",
          fields: [
            {
              name: "journey",
              type: "array",
              minRows: 1,
              labels: { singular: "Milestone", plural: "Milestones" },
              admin: { description: "In order, oldest first. The last one renders as current." },
              fields: [
                {
                  name: "when",
                  type: "text",
                  required: true,
                  admin: { description: "e.g. 'March 2018', '2024/2025'." },
                },
                { name: "what", type: "textarea", required: true, validate: forbidsPhrases() },
              ],
            },
          ],
        },
        {
          label: "Why Edge",
          fields: [
            {
              name: "differentiators",
              type: "array",
              minRows: 1,
              labels: { singular: "Differentiator", plural: "Differentiators" },
              fields: [...titledBody],
            },
            {
              name: "delivery",
              type: "array",
              minRows: 1,
              labels: { singular: "Stage", plural: "Delivery stages" },
              admin: { description: "The lifecycle Edge works across, in order." },
              fields: [...titledBody],
            },
            {
              name: "industries",
              type: "array",
              minRows: 1,
              labels: { singular: "Industry", plural: "Industries" },
              fields: [...titledBody],
            },
            {
              name: "sustainability",
              type: "array",
              minRows: 1,
              labels: { singular: "Commitment", plural: "Sustainability commitments" },
              fields: [...titledBody],
            },
          ],
        },
        {
          label: "Leadership",
          fields: [
            {
              name: "executiveRoles",
              type: "array",
              minRows: 1,
              labels: { singular: "Role", plural: "Executive roles" },
              admin: {
                description:
                  "The master publishes role titles only. Leave each name pending until Edge approves it for release — the site then shows the role with a visible marker rather than a blank.",
              },
              fields: [
                { name: "title", type: "text", required: true, validate: forbidsPhrases() },
                confirmable("holder", {
                  label: "Name",
                  defaultPendingLabel: "Name and biography pending",
                }),
              ],
            },
          ],
        },
      ],
    },
  ],
};
```

- [ ] **Step 2: Write the Contact global**

Create `src/globals/ContactDetails.ts`:

```ts
import type { GlobalConfig } from "payload";
import { adminOnly, signedIn } from "../access";
import { forbidsPhrases } from "../fields/validators";
import { revalidateGlobal } from "../hooks/revalidate";

/*
 * Contact details, and where each kind of enquiry goes.
 *
 * Update is ADMIN-ONLY, not editor. A wrong phone number here appears in the
 * footer of all 51 pages, and that exact failure shipped once already: the
 * inherited footer carried a phone number and office address that were not
 * Edge's. Editors can change any amount of prose; they cannot change this.
 *
 * Every write expires the whole layout, because the footer is in it.
 */
export const ContactDetails: GlobalConfig = {
  slug: "contact-details",
  label: "Contact details",
  admin: {
    group: "Company",
    description:
      "Address, phones, emails, hours and enquiry routing. Admin-only: these appear in the footer of every page.",
  },
  access: { read: () => true, update: adminOnly },
  versions: { drafts: false },
  hooks: { afterChange: [revalidateGlobal([], true)] },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Office",
          fields: [
            {
              name: "office",
              type: "array",
              minRows: 1,
              labels: { singular: "Line", plural: "Address lines" },
              admin: { description: "One line each, starting with the legal entity name." },
              fields: [{ name: "line", type: "text", required: true }],
            },
            {
              name: "mapUrl",
              type: "text",
              admin: { description: "A link that opens the office location in a map." },
            },
          ],
        },
        {
          label: "Channels",
          fields: [
            {
              name: "phones",
              type: "array",
              minRows: 1,
              labels: { singular: "Phone", plural: "Phones" },
              fields: [
                { name: "label", type: "text", required: true },
                {
                  name: "value",
                  type: "text",
                  required: true,
                  admin: { description: "As displayed, e.g. '+251 95 569 5565'." },
                },
                {
                  name: "tel",
                  type: "text",
                  required: true,
                  admin: { description: "Digits only with country code, for the tel: link." },
                },
              ],
            },
            {
              name: "whatsapp",
              type: "text",
              admin: { description: "Full wa.me link." },
            },
            {
              name: "emails",
              type: "array",
              minRows: 1,
              labels: { singular: "Email", plural: "Emails" },
              fields: [
                { name: "label", type: "text", required: true },
                { name: "value", type: "email", required: true },
              ],
            },
            {
              name: "emergency",
              type: "text",
              admin: { description: "The number to call for a live incident." },
            },
            {
              name: "response",
              type: "text",
              required: true,
              admin: { description: "e.g. 'Within one business day'." },
            },
          ],
        },
        {
          label: "Hours",
          fields: [
            {
              name: "hours",
              type: "array",
              minRows: 1,
              labels: { singular: "Row", plural: "Opening hours" },
              fields: [
                { name: "days", type: "text", required: true },
                { name: "hours", type: "text", required: true },
              ],
            },
          ],
        },
        {
          label: "Enquiry routing",
          fields: [
            {
              name: "inquiryCategories",
              type: "array",
              minRows: 1,
              labels: { singular: "Category", plural: "Enquiry categories" },
              admin: {
                description:
                  "Each kind of enquiry, what to include, and the address it reaches. Careers deliberately routes through the careers application process rather than the contact form.",
              },
              fields: [
                {
                  name: "key",
                  type: "text",
                  required: true,
                  admin: { description: "Stable identifier, e.g. consultation." },
                },
                { name: "title", type: "text", required: true, validate: forbidsPhrases() },
                {
                  name: "prompt",
                  type: "textarea",
                  required: true,
                  admin: { description: "What to include so the enquiry can be answered properly." },
                  validate: forbidsPhrases(),
                },
                { name: "route", type: "email", required: true },
              ],
            },
          ],
        },
      ],
    },
  ],
};
```

- [ ] **Step 3: Extend Site settings with the impact counters, and lock it to admins**

In `src/globals/SiteSettings.ts`:

Change the import line to `import { adminOnly, signedIn } from "../access";` and the access block to `access: { read: () => true, update: adminOnly },`. Leave the existing `nav`, `headerCta` and `contact` fields in place — Task 20 reads `nav`, and the legacy `contact` group is removed once Task 20 confirms the footer reads `contact-details` instead.

Append to the `fields` array:

```ts
    {
      name: "impact",
      type: "array",
      maxRows: 4,
      labels: { singular: "Counter", plural: "Impact counters" },
      admin: {
        description:
          "The four figures across the site. A percentage figure must carry its qualifier — the master requires 'against agreed project scope' wherever the completion figure appears.",
      },
      fields: [
        {
          name: "figure",
          type: "text",
          required: true,
          admin: { description: "e.g. '67+', '100%'." },
        },
        {
          name: "unit",
          type: "text",
          required: true,
          admin: { description: "e.g. 'projects', 'completion'." },
          validate: forbidsPhrases(),
        },
        {
          name: "line",
          type: "text",
          required: true,
          admin: { description: "The qualifying sentence under the figure." },
          validate: requiresScopeQualifier,
        },
      ],
    },
    {
      name: "impactSupport",
      type: "text",
      admin: { description: "The line under the counters." },
      validate: forbidsPhrases(),
    },
```

Add the validator import at the top:

```ts
import { forbidsPhrases, requiresScopeQualifier } from "../fields/validators";
```

- [ ] **Step 4: Write the Careers global**

Create `src/globals/Careers.ts`:

```ts
import type { GlobalConfig } from "payload";
import { signedIn } from "../access";
import { confirmable } from "../fields/confirmable";
import { forbidsPhrases } from "../fields/validators";
import { revalidateGlobal } from "../hooks/revalidate";

const titledBody = [
  { name: "title", type: "text", required: true, validate: forbidsPhrases() },
  { name: "body", type: "textarea", required: true, validate: forbidsPhrases() },
] as const;

const itemList = (plural: string, singular: string) =>
  ({
    type: "array" as const,
    labels: { singular, plural },
    fields: [{ name: "item", type: "text" as const, required: true, validate: forbidsPhrases() }],
  });

/*
 * Everything the careers pages need that is not a vacancy or a track.
 *
 * The internship caveat is a required field, not an optional note. The master
 * publishes it in full -- applying does not guarantee placement -- and it has
 * to appear before the form, so the page cannot render without it.
 */
export const Careers: GlobalConfig = {
  slug: "careers-content",
  label: "Careers content",
  admin: {
    group: "People",
    description: "Pathways, culture, the internship programme and E-Academy settings.",
  },
  access: { read: () => true, update: signedIn },
  versions: { drafts: false },
  hooks: {
    afterChange: [
      revalidateGlobal([
        "/careers",
        "/careers/open-positions",
        "/careers/internships",
        "/careers/e-academy",
      ]),
    ],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Working here",
          fields: [
            {
              name: "pathways",
              type: "array",
              minRows: 1,
              labels: { singular: "Pathway", plural: "Career pathways" },
              fields: [...titledBody],
            },
            {
              name: "culture",
              type: "array",
              minRows: 1,
              labels: { singular: "Value", plural: "Culture values" },
              fields: [...titledBody],
            },
            { ...itemList("How people develop", "Point"), name: "development" },
            { ...itemList("What the experience is like", "Point"), name: "experiencePoints" },
            {
              ...itemList("Documents every application needs", "Document"),
              name: "applicationDocs",
            },
          ],
        },
        {
          label: "Internship",
          fields: [
            {
              name: "internship",
              type: "group",
              label: "Graduate internship programme",
              fields: [
                { name: "title", type: "text", required: true, validate: forbidsPhrases() },
                { name: "type", type: "text", required: true, validate: forbidsPhrases() },
                { name: "location", type: "textarea", required: true, validate: forbidsPhrases() },
                confirmable("schedule", {
                  label: "Schedule",
                  defaultPendingLabel: "Dates to be confirmed",
                }),
                confirmable("deadline", {
                  label: "Application deadline",
                  defaultPendingLabel: "Deadline to be confirmed",
                }),
                { name: "intro", type: "textarea", required: true, validate: forbidsPhrases() },
                {
                  name: "caveat",
                  type: "textarea",
                  required: true,
                  admin: {
                    description:
                      "Published in full, before the form. The master requires applicants to be told that applying does not guarantee placement — do not soften or shorten this.",
                  },
                  validate: forbidsPhrases(),
                },
                {
                  name: "tracks",
                  type: "array",
                  minRows: 1,
                  labels: { singular: "Track", plural: "Tracks" },
                  fields: [...titledBody],
                },
                { ...itemList("Eligibility", "Criterion"), name: "eligibility" },
                { ...itemList("Documents required", "Document"), name: "documents" },
                {
                  name: "structure",
                  type: "array",
                  minRows: 1,
                  labels: { singular: "Stage", plural: "Programme structure" },
                  fields: [...titledBody],
                },
                {
                  name: "selection",
                  type: "array",
                  minRows: 1,
                  labels: { singular: "Stage", plural: "Selection stages" },
                  fields: [
                    { name: "n", type: "number", required: true },
                    ...titledBody,
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "E-Academy",
          fields: [
            {
              name: "academyAudiences",
              type: "array",
              minRows: 1,
              labels: { singular: "Audience", plural: "Audiences" },
              fields: [
                ...titledBody,
                {
                  name: "action",
                  type: "text",
                  required: true,
                  admin: { description: "The call to action for this audience." },
                  validate: forbidsPhrases(),
                },
              ],
            },
            { ...itemList("Levels", "Level"), name: "academyLevels" },
            { ...itemList("Delivery modes", "Mode"), name: "academyDelivery" },
            {
              name: "courseSections",
              type: "array",
              minRows: 1,
              labels: { singular: "Section", plural: "Course page sections" },
              admin: {
                description:
                  "The sections every published course listing carries, so programmes can be compared properly.",
              },
              fields: [...titledBody],
            },
          ],
        },
      ],
    },
  ],
};
```

- [ ] **Step 5: Write the Page copy global**

Create `src/globals/PageCopy.ts`:

```ts
import type { GlobalConfig } from "payload";
import { signedIn } from "../access";
import { forbidsPhrases } from "../fields/validators";
import { revalidateGlobal } from "../hooks/revalidate";

const titledBody = [
  { name: "title", type: "text", required: true, validate: forbidsPhrases() },
  { name: "body", type: "textarea", required: true, validate: forbidsPhrases() },
] as const;

const hero = (label: string) =>
  ({
    name: "hero",
    type: "group" as const,
    label,
    fields: [
      { name: "eyebrow", type: "text" as const, required: true, validate: forbidsPhrases() },
      { name: "title", type: "text" as const, required: true, validate: forbidsPhrases() },
      { name: "intro", type: "textarea" as const, required: true, validate: forbidsPhrases() },
    ],
  });

/*
 * Page-level copy that is not a collection document: the heroes and section
 * intros for the pages assembled from several collections.
 *
 * The home page's technology priorities and the solutions overview's are
 * DIFFERENT LISTS in the master -- six and five, with different wording. They
 * are stored separately here on purpose. Collapsing them to one list would put
 * the wrong wording on one of the two pages, which is the kind of tidying that
 * looks like a refactor and is a content error.
 */
export const PageCopy: GlobalConfig = {
  slug: "page-copy",
  label: "Page copy",
  admin: {
    group: "Site",
    description: "Headings and intros for the pages built from several collections.",
  },
  access: { read: () => true, update: signedIn },
  versions: { drafts: false },
  hooks: {
    afterChange: [
      revalidateGlobal([
        "/",
        "/about",
        "/solutions",
        "/services",
        "/resources",
        "/clients",
        "/partners",
      ]),
    ],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Home",
          fields: [
            { ...hero("Home hero") , name: "homeHero" },
            {
              name: "homePriorities",
              type: "array",
              labels: { singular: "Priority", plural: "Technology priorities (home)" },
              admin: {
                description:
                  "The home page's own list. The solutions overview has a separate, differently worded list — do not merge them.",
              },
              fields: [...titledBody],
            },
          ],
        },
        {
          label: "Solutions overview",
          fields: [
            { ...hero("Solutions hero"), name: "solutionsHero" },
            {
              name: "solutionsPriorities",
              type: "array",
              labels: { singular: "Priority", plural: "Technology priorities (solutions)" },
              admin: { description: "The solutions overview's own list. Not the home page's." },
              fields: [...titledBody],
            },
            {
              name: "solutionsFramework",
              type: "array",
              labels: { singular: "Stage", plural: "Delivery framework" },
              admin: {
                description:
                  "The six-step framework on this page. The Company global's five-stage delivery list is a different thing.",
              },
              fields: [...titledBody],
            },
          ],
        },
        {
          label: "Other pages",
          fields: [
            { ...hero("About hero"), name: "aboutHero" },
            { ...hero("Services hero"), name: "servicesHero" },
            { ...hero("Clients hero"), name: "clientsHero" },
            { ...hero("Partners hero"), name: "partnersHero" },
            { ...hero("Resources hero"), name: "resourcesHero" },
          ],
        },
        {
          label: "Shared copy",
          fields: [
            {
              name: "projectImplementationNote",
              type: "textarea",
              admin: {
                description:
                  "The paragraph describing how Edge coordinates delivery, shown on every project page. One copy here rather than repeated on all eight records, so correcting it is one edit.",
              },
              validate: forbidsPhrases(),
            },
          ],
        },
        {
          label: "Resource sections",
          fields: [
            {
              name: "resourceSections",
              type: "array",
              minRows: 1,
              labels: { singular: "Section", plural: "Resource sections" },
              admin: { description: "The six sections of the resource centre, in order." },
              fields: [
                { name: "key", type: "text", required: true },
                { name: "title", type: "text", required: true, validate: forbidsPhrases() },
                {
                  name: "href",
                  type: "text",
                  required: true,
                  admin: { description: "Route, e.g. /news or /resources/media/documentaries." },
                },
                { name: "body", type: "textarea", required: true, validate: forbidsPhrases() },
              ],
            },
          ],
        },
      ],
    },
  ],
};
```

- [ ] **Step 6: Register the new globals, delete the retired model**

In `src/payload.config.ts`:

- Remove the imports of `Sectors`, `Courses`, `HomePage` and `CompanyPage`, and remove them from the `collections` and `globals` arrays.
- Add `import { Company } from "./globals/Company";`, `import { ContactDetails } from "./globals/ContactDetails";`, `import { Careers } from "./globals/Careers";`, `import { PageCopy } from "./globals/PageCopy";`.
- Set `globals: [SiteSettings, Company, ContactDetails, Careers, PageCopy],`.
- Update the `seoPlugin` collections list to `["solutions", "services", "projects", "news", "events", "jobs", "posts"]`.
- Fix `generateDescription` in the same call. It currently reads
  `({ doc }) => doc?.summary ?? doc?.line ?? doc?.excerpt ?? ""`, and NONE of `summary`, `line` or `excerpt` exists on any collection this plan creates — they all carry `blurb`. Left as it is, every solution, service, project and news page ships an empty meta description. Replace it with:

```ts
generateDescription: ({ doc }) =>
  doc?.blurb ?? doc?.summary ?? doc?.excerpt ?? "",
```

  `blurb` first, since it is what the new model uses; the other two stay as fallbacks for any collection that still carries them.

Then delete the retired files and the old seed, which references every collection being removed:

```bash
git rm src/collections/Sectors.ts src/collections/Courses.ts \
       src/globals/HomePage.ts src/globals/CompanyPage.ts \
       src/seed/data/solutions.ts src/seed/data/sectors.ts \
       src/seed/data/courses.ts src/seed/data/partners.ts src/seed/data/globals.ts
```

`src/seed/lexical.ts` stays — Task 17 reuses its helpers.

`src/seed/index.ts` is already gone — Task 9 deleted it. The `seed` script in `package.json` still points at it. Leave the script: Task 18 restores the file. `npm run seed` has been broken since Task 9 and stays broken until then.

- [ ] **Step 7: Generate types and verify the whole model loads**

Run:

```bash
npm run generate:types
npx tsc --noEmit
npm test
npm run dev
```

Expected: `tsc` clean, tests pass. In `/admin`, the sidebar shows groups **Content** (solutions, services, clients, projects, partner categories, partners), **Resources** (post categories, posts, news, events, downloads), **People** (jobs, academy tracks), **Company** (company, contact details), **Site** (site settings, page copy, forms), **Library** (media), **Admin** (users). Thirteen content collections, five globals.

Then confirm the impact validator: in Site settings, add a counter with figure `100%` and line `of everything we do`. Save.
Expected: refused, naming "against agreed project scope". Change the line to `against agreed project scope`. Save.
Expected: saves.

- [ ] **Step 8: Commit**

```bash
git add -A src/globals src/collections src/seed src/payload.config.ts src/payload-types.ts
git commit -m "Add the five globals and delete the retired content model

Five tabbed globals rather than the fifteen a naive mapping of the master's
singletons gives. Fifteen sidebar entries is hostile to a non-technical
editor, and an editor looking for 'our values' should not have to know which
entry holds them.

Contact details and Site settings are admin-only. A wrong phone number there
reaches the footer of all 51 pages, and that exact failure shipped once
already -- the inherited footer carried an address and number that were not
Edge's. Editors can change any amount of prose; not these.

Page copy keeps the home page's six technology priorities and the solutions
overview's five as separate lists, because the master words them differently.
Merging them would look like a refactor and be a content error.

The internship caveat is required, not optional: the master publishes it in
full before the form, so the page cannot render without it.

Deletes Sectors, Courses, HomePage, CompanyPage and the old seed data, which
modelled the retired nine-service taxonomy. Nothing reads them -- Task 6 took
out the routes and trimmed content.ts. npm run seed is broken until Task 18
restores src/seed/index.ts."
```

---

## Phase 2 — Seed

The approved content is already structured data in `design-src/highland/*.mjs`. Nothing is retyped. The work is a transform layer, because Highland is denormalised where Payload is relational, and a write strategy that is safe to run twice.

**Do not import `design-src/content.json`.** It is a NEXT IT-derived model from before the client's first correction and none of it is Edge's.

### Task 16: Write modes and the relationship resolver

Carries **Review Focus #1** (a re-run must not clobber an editor's work) and **Review Focus #4** (a client name matching no row must fail loudly).

**Files:**
- Create: `src/seed/upsert.ts`
- Create: `src/seed/upsert.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `type SeedMode = "fill" | "force" | "fresh"`
  - `decideWrite(exists: boolean, mode: SeedMode): "create" | "update" | "skip"`
  - `makeResolver<T>(label: string, entries: { key: string; id: T }[]): (key: string) => T`
  - `type SeedReport = { created: number; updated: number; skipped: number }`

  Task 18's seed script uses all of these.

- [ ] **Step 1: Write the failing tests**

Create `src/seed/upsert.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { decideWrite, makeResolver } from "./upsert";

describe("decideWrite", () => {
  it("creates a document that does not exist, in every mode", () => {
    expect(decideWrite(false, "fill")).toBe("create");
    expect(decideWrite(false, "force")).toBe("create");
    expect(decideWrite(false, "fresh")).toBe("create");
  });

  it("skips an existing document in the default fill mode", () => {
    // This is Review Focus #1: a re-run must not overwrite an editor's work.
    expect(decideWrite(true, "fill")).toBe("skip");
  });

  it("updates an existing document only when force is asked for", () => {
    expect(decideWrite(true, "force")).toBe("update");
  });

  it("creates in fresh mode, because fresh deletes everything first", () => {
    expect(decideWrite(true, "fresh")).toBe("create");
  });
});

describe("makeResolver", () => {
  const resolve = makeResolver("client", [
    { key: "Bahir Dar University", id: 1 },
    { key: "Gadaa Bank", id: 2 },
    { key: "National Bank of Ethiopia", id: 3 },
  ]);

  it("resolves an exact name", () => {
    expect(resolve("Gadaa Bank")).toBe(2);
  });

  it("ignores surrounding whitespace and case", () => {
    expect(resolve("  gadaa bank ")).toBe(2);
  });

  it("throws on an unknown name rather than returning undefined", () => {
    // Review Focus #4: a silent undefined produces a project page with no
    // client and no error anywhere.
    expect(() => resolve("Bonga University")).toThrow(/client/i);
  });

  it("names the missing key in the error", () => {
    expect(() => resolve("Bonga University")).toThrow(/Bonga University/);
  });

  it("suggests the closest known name, to catch a typo", () => {
    expect(() => resolve("Gadaa Bnak")).toThrow(/Gadaa Bank/);
  });

  it("lists the known names when nothing is close", () => {
    try {
      resolve("Something Entirely Different");
      throw new Error("should have thrown");
    } catch (error) {
      expect(String(error)).toContain("Bahir Dar University");
    }
  });

  it("rejects an empty key", () => {
    expect(() => resolve("")).toThrow(/client/i);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- upsert`

Expected: FAIL with `Failed to resolve import "./upsert"`.

- [ ] **Step 3: Write the implementation**

Create `src/seed/upsert.ts`:

```ts
/*
 * How the seed writes, and how it resolves names to ids.
 *
 * The old seed cleared every collection before writing -- it called itself "a
 * reset rather than an append". That is safe while the database holds nothing
 * but seed output and destructive the moment Edge has edited anything, which
 * is the week after this ships.
 *
 * So there are three modes, and the safe one is the default:
 *
 *   fill   (default) create what is missing, leave what exists alone.
 *                    Running this twice changes nothing the second time.
 *   force            overwrite existing documents in place, keeping their ids
 *                    so relationships survive. For re-importing after a
 *                    content fix, when you know what you are overwriting.
 *   fresh            delete everything, then create. For a clean rebuild.
 *
 * "fill" means a re-run cannot destroy an editor's work, and the script
 * reports what it skipped so nobody mistakes a no-op for a failure.
 */

export type SeedMode = "fill" | "force" | "fresh";

export type SeedReport = { created: number; updated: number; skipped: number };

export function decideWrite(exists: boolean, mode: SeedMode): "create" | "update" | "skip" {
  if (!exists) return "create";
  if (mode === "fresh") return "create";
  if (mode === "force") return "update";
  return "skip";
}

/** Levenshtein distance, for suggesting the name the author probably meant. */
function distance(a: string, b: string): number {
  const rows = Array.from({ length: b.length + 1 }, (_, i) => [i, ...Array(a.length).fill(0)]);
  for (let j = 1; j <= a.length; j += 1) rows[0][j] = j;
  for (let i = 1; i <= b.length; i += 1) {
    for (let j = 1; j <= a.length; j += 1) {
      rows[i][j] =
        b[i - 1] === a[j - 1]
          ? rows[i - 1][j - 1]
          : 1 + Math.min(rows[i - 1][j], rows[i][j - 1], rows[i - 1][j - 1]);
    }
  }
  return rows[b.length][a.length];
}

/**
 * Resolve a human name to the id of the document created for it.
 *
 * Throws rather than returning undefined. A silent miss here produces a
 * project page with no client, a partner card linking nowhere, and no error
 * anywhere -- the kind of fault that reaches the client before anyone notices.
 */
export function makeResolver<T>(
  label: string,
  entries: { key: string; id: T }[],
): (key: string) => T {
  const index = new Map(entries.map((e) => [e.key.trim().toLowerCase(), e.id]));
  const known = entries.map((e) => e.key);

  return (key: string): T => {
    const normalised = (key ?? "").trim().toLowerCase();
    const hit = index.get(normalised);
    if (hit !== undefined) return hit;

    const nearest = known
      .map((name) => ({ name, d: distance(normalised, name.toLowerCase()) }))
      .sort((a, b) => a.d - b.d)[0];

    const hint =
      nearest && nearest.d <= Math.max(3, Math.floor(nearest.name.length / 3))
        ? ` Did you mean "${nearest.name}"?`
        : ` Known ${label}s: ${known.join(", ")}.`;

    throw new Error(`No ${label} matches "${key}".${hint}`);
  };
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -- upsert`

Expected: PASS, all twelve cases.

- [ ] **Step 5: Commit**

```bash
git add src/seed/upsert.ts src/seed/upsert.test.ts
git commit -m "Make the seed safe to run twice, and loud when a name misses

The old seed cleared every collection first -- it called itself a reset rather
than an append. Safe while the database holds only seed output, destructive
the week after Edge starts editing. So: fill (default) creates what is missing
and leaves the rest alone, force overwrites in place keeping ids, fresh
deletes first. A re-run in the default mode cannot destroy an editor's work,
and the script reports what it skipped so a no-op is not mistaken for failure.

The resolver throws instead of returning undefined, and suggests the nearest
known name. A silent miss gives you a project page with no client, a partner
card linking nowhere, and no error anywhere -- which reaches the client before
it reaches anyone who could fix it."
```

---

### Task 17: Highland → Payload transforms

Pure functions turning Highland's denormalised shapes into Payload's. Kept separate from the seed script so they can be tested without a database.

**Files:**
- Create: `src/seed/transform.ts`
- Create: `src/seed/transform.test.ts`

**Interfaces:**
- Consumes: `p`, `rich` from `src/seed/lexical.ts`; `ConfirmableValue` from `src/fields/confirmable.ts`
- Produces:
  - `toItems(values: string[]): { item: string }[]`
  - `toConfirmable(raw: string | undefined, fallbackLabel: string): ConfirmableValue`
  - `toRichParagraphs(paras: string[]): ReturnType<typeof rich>`
  - `eventDates(input: { iso: string; date: string }): { startsOn: string; endsOn: string | null }`
  - `toDetailBlocks(detail: Record<string, unknown>): { blockType: string; [k: string]: unknown }[]`

  Task 18's seed script calls all five.

- [ ] **Step 1: Write the failing tests**

Create `src/seed/transform.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { eventDates, toConfirmable, toDetailBlocks, toItems, toRichParagraphs } from "./transform";

describe("toItems", () => {
  it("wraps strings for Payload's array-of-one-field shape", () => {
    expect(toItems(["a", "b"])).toEqual([{ item: "a" }, { item: "b" }]);
  });

  it("returns an empty array for an empty or absent list", () => {
    expect(toItems([])).toEqual([]);
    expect(toItems(undefined as unknown as string[])).toEqual([]);
  });
});

describe("toConfirmable", () => {
  it("treats a real value as confirmed", () => {
    expect(toConfirmable("2024/2025", "Year to confirm")).toEqual({
      value: "2024/2025",
      status: "confirmed",
      pendingLabel: null,
    });
  });

  it("recognises Highland's to-confirm wording as pending", () => {
    expect(toConfirmable("Year to confirm", "Year to confirm")).toEqual({
      value: null,
      status: "pending",
      pendingLabel: "Year to confirm",
    });
  });

  it("recognises the same wording in any case", () => {
    expect(toConfirmable("To be confirmed", "Deadline to be confirmed").status).toBe("pending");
  });

  it("treats an empty or absent value as pending with the fallback label", () => {
    expect(toConfirmable("", "Date to confirm")).toEqual({
      value: null,
      status: "pending",
      pendingLabel: "Date to confirm",
    });
    expect(toConfirmable(undefined, "Date to confirm").status).toBe("pending");
  });

  it("does not mistake a value that merely contains a date for pending", () => {
    expect(toConfirmable("2026", "Date to confirm").status).toBe("confirmed");
  });
});

describe("toRichParagraphs", () => {
  it("builds an editor state whose text survives the round trip", () => {
    const state = toRichParagraphs(["First para.", "Second para."]);
    expect(JSON.stringify(state)).toContain("First para.");
    expect(JSON.stringify(state)).toContain("Second para.");
  });

  it("produces one paragraph node per string", () => {
    const state = toRichParagraphs(["a", "b", "c"]) as { root: { children: unknown[] } };
    expect(state.root.children).toHaveLength(3);
  });
});

describe("eventDates", () => {
  it("derives an end date from a day range", () => {
    // GITEX. Highland stores only the start; the range lives in the display string.
    expect(eventDates({ iso: "2026-12-07", date: "7–11 December 2026" })).toEqual({
      startsOn: "2026-12-07",
      endsOn: "2026-12-11",
    });
  });

  it("handles a hyphen as well as an en dash", () => {
    expect(eventDates({ iso: "2026-12-07", date: "7-11 December 2026" }).endsOn).toBe("2026-12-11");
  });

  it("leaves endsOn null for a single-day event", () => {
    expect(eventDates({ iso: "2026-09-28", date: "28 September 2026" })).toEqual({
      startsOn: "2026-09-28",
      endsOn: null,
    });
  });

  it("leaves endsOn null when the range crosses months, rather than guessing", () => {
    expect(eventDates({ iso: "2026-11-30", date: "30 November – 2 December 2026" }).endsOn).toBe(
      null,
    );
  });

  it("passes the start date through untouched", () => {
    expect(eventDates({ iso: "2026-10-23", date: "23 October 2026" }).startsOn).toBe("2026-10-23");
  });
});

describe("toDetailBlocks", () => {
  it("turns a flat capability list into one capabilities block", () => {
    const blocks = toDetailBlocks({
      capabilities: [{ title: "Cloud Security", body: "Posture and workload protection." }],
    });
    expect(blocks).toHaveLength(1);
    expect(blocks[0].blockType).toBe("capabilities");
    expect((blocks[0].items as unknown[])).toHaveLength(1);
  });

  it("turns named bands into a bands block with nested entries", () => {
    const blocks = toDetailBlocks({
      capabilities: [],
      bands: [
        { title: "Datacenter facility", items: ["Racks", "Cooling"] },
        { title: "IT infrastructure", items: ["CCTV"] },
      ],
    });
    expect(blocks).toHaveLength(1);
    expect(blocks[0].blockType).toBe("bands");
    const items = blocks[0].items as { title: string; entries: { item: string }[] }[];
    expect(items[0].entries).toEqual([{ item: "Racks" }, { item: "Cooling" }]);
  });

  it("emits a checklist block only when there are items", () => {
    expect(toDetailBlocks({ checklistTitle: "Controls", checklist: [] })).toHaveLength(0);
    expect(
      toDetailBlocks({ checklistTitle: "Controls", checklist: ["Least privilege"] }),
    ).toHaveLength(1);
  });

  it("keeps the approved section order", () => {
    const blocks = toDetailBlocks({
      capabilities: [{ title: "A", body: "a" }],
      layers: [{ title: "L", body: "l" }],
      sectors: [{ title: "Banking & Finance", body: "s" }],
      measures: ["Reduced handling time"],
      steps: [{ title: "S", body: "s" }],
      checklistTitle: "C",
      checklist: ["c"],
      modelsTitle: "M",
      models: [{ title: "M1", body: "m" }],
    });
    expect(blocks.map((b) => b.blockType)).toEqual([
      "capabilities",
      "layers",
      "sectors",
      "measures",
      "steps",
      "checklist",
      "models",
    ]);
  });

  it("carries the heading that belongs to each section", () => {
    const blocks = toDetailBlocks({
      layers: [{ title: "L", body: "l" }],
      layersTitle: "Flexible deployment based on risk",
      measures: ["Adoption"],
      measuresTitle: "Measure business value, not only model performance",
      stepsTitle: "How we approach it",
      steps: [{ title: "S", body: "s" }],
    });
    const byType = Object.fromEntries(blocks.map((b) => [b.blockType, b.title]));
    expect(byType.layers).toBe("Flexible deployment based on risk");
    expect(byType.measures).toBe("Measure business value, not only model performance");
    expect(byType.steps).toBe("How we approach it");
  });

  it("carries the qualifying note that belongs under a checklist", () => {
    const blocks = toDetailBlocks({
      checklistTitle: "Principles",
      checklist: ["Least privilege"],
      checklistNote: "Sensitive decisions remain subject to authorized human review.",
    });
    expect(blocks[0].note).toContain("human review");
  });

  it("turns a flat measures list into items rather than titled bodies", () => {
    const blocks = toDetailBlocks({ measures: ["Reduced handling time", "Higher resolution rate"] });
    expect(blocks[0].items).toEqual([
      { item: "Reduced handling time" },
      { item: "Higher resolution rate" },
    ]);
  });

  it("returns nothing for an empty detail record", () => {
    expect(toDetailBlocks({})).toEqual([]);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- transform`

Expected: FAIL with `Failed to resolve import "./transform"`.

- [ ] **Step 3: Write the implementation**

Create `src/seed/transform.ts`:

```ts
import type { ConfirmableValue } from "../fields/confirmable";
import { p, rich } from "./lexical";

/*
 * Highland's content modules to Payload's field shapes.
 *
 * Pure functions, no Payload import, so they are testable without a database
 * -- which is the whole reason they are not inlined into the seed script.
 */

type TitledBody = { title: string; body: string };

/** Payload's array-of-one-field shape. */
export const toItems = (values: string[] = []): { item: string }[] =>
  (values ?? []).map((item) => ({ item }));

/*
 * Highland encodes an unconfirmed fact as the placeholder text itself --
 * "Year to confirm", "To be confirmed" -- in the same field that otherwise
 * holds a real value. Payload keeps the state separately, so detect the
 * placeholder rather than importing it as data.
 */
export function toConfirmable(
  raw: string | undefined,
  fallbackLabel: string,
): ConfirmableValue {
  const value = (raw ?? "").trim();
  const isPending = value === "" || /to\s+(?:be\s+)?confirm/i.test(value);
  if (isPending) {
    return { value: null, status: "pending", pendingLabel: value || fallbackLabel };
  }
  return { value, status: "confirmed", pendingLabel: null };
}

/** Highland stores bodies as string arrays; Payload rich text wants Lexical. */
export const toRichParagraphs = (paras: string[] = []) => rich(...paras.map((text) => p(text)));

/*
 * Highland keeps one `iso` per event plus a human date string, which is fine
 * for a one-day webinar and lossy for a range: GITEX is "7-11 December 2026"
 * with iso "2026-12-07". The end date has to come out of the display string.
 *
 * Only a same-month day range is parsed. A range crossing months returns null
 * rather than a guess -- an event whose end date is wrong by a month is worse
 * than one with no end date, which simply falls back to the start.
 */
export function eventDates(input: { iso: string; date: string }): {
  startsOn: string;
  endsOn: string | null;
} {
  const match = /^(\d{1,2})\s*[–-]\s*(\d{1,2})\s+\w+\s+\d{4}$/.exec(input.date.trim());
  if (!match) return { startsOn: input.iso, endsOn: null };

  const endDay = match[2].padStart(2, "0");
  const [year, month] = input.iso.split("-");
  return { startsOn: input.iso, endsOn: `${year}-${month}-${endDay}` };
}

/*
 * Solution detail sections, in the order the approved pages render them.
 *
 * A section is emitted only when it has content. Highland's SOLUTION_DETAIL
 * entries carry different subsets -- the datacenter family uses `bands` and an
 * empty `capabilities`, most use the reverse -- and an empty block in Payload
 * renders as an empty heading on the page.
 */
export function toDetailBlocks(
  detail: Record<string, unknown>,
): { blockType: string; [k: string]: unknown }[] {
  const blocks: { blockType: string; [k: string]: unknown }[] = [];

  const capabilities = (detail.capabilities as TitledBody[] | undefined) ?? [];
  if (capabilities.length) {
    blocks.push({ blockType: "capabilities", items: capabilities.map((c) => ({ ...c })) });
  }

  const bands = (detail.bands as { title: string; items: string[] }[] | undefined) ?? [];
  if (bands.length) {
    blocks.push({
      blockType: "bands",
      items: bands.map((b) => ({ title: b.title, entries: toItems(b.items) })),
    });
  }

  const layers = (detail.layers as TitledBody[] | undefined) ?? [];
  if (layers.length) {
    blocks.push({
      blockType: "layers",
      title: (detail.layersTitle as string | undefined) ?? null,
      items: layers.map((l) => ({ ...l })),
    });
  }

  const sectors = (detail.sectors as TitledBody[] | undefined) ?? [];
  if (sectors.length) {
    blocks.push({
      blockType: "sectors",
      title: (detail.sectorsTitle as string | undefined) ?? null,
      items: sectors.map((x) => ({ ...x })),
    });
  }

  const measures = (detail.measures as string[] | undefined) ?? [];
  if (measures.length) {
    blocks.push({
      blockType: "measures",
      title: (detail.measuresTitle as string | undefined) ?? "How value is measured",
      items: toItems(measures),
    });
  }

  const steps = (detail.steps as TitledBody[] | undefined) ?? [];
  if (steps.length) {
    blocks.push({
      blockType: "steps",
      title: (detail.stepsTitle as string | undefined) ?? null,
      items: steps.map((s) => ({ ...s })),
    });
  }

  const checklist = (detail.checklist as string[] | undefined) ?? [];
  if (checklist.length) {
    blocks.push({
      blockType: "checklist",
      title: (detail.checklistTitle as string | undefined) ?? "Considerations",
      items: toItems(checklist),
      note: (detail.checklistNote as string | undefined) ?? null,
    });
  }

  const models = (detail.models as TitledBody[] | undefined) ?? [];
  if (models.length) {
    blocks.push({
      blockType: "models",
      title: (detail.modelsTitle as string | undefined) ?? "Engagement models",
      items: models.map((m) => ({ ...m })),
    });
  }

  return blocks;
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -- transform`

Expected: PASS, all cases.

- [ ] **Step 5: Commit**

```bash
git add src/seed/transform.ts src/seed/transform.test.ts
git commit -m "Transform Highland's shapes into Payload's, as pure functions

No Payload import, so these are testable without a database -- which is why
they are not inlined into the seed script.

Three pieces carry real logic. Highland encodes an unconfirmed fact as the
placeholder text itself, in the field that otherwise holds a real value, so
toConfirmable detects the placeholder rather than importing it as data.
eventDates recovers an end date from the display string, because Highland's
single iso is lossy for a range -- and returns null for a range crossing
months rather than guessing, since an end date wrong by a month is worse than
none. toDetailBlocks emits a section only when it has content, because
Highland's entries carry different subsets and an empty block renders as an
empty heading."
```

---

### Task 18: The seed script and its verification

Dependency-ordered writes, then assertions that the database holds what the master says it should.

**Two ordering problems this has to solve.** `solutions.related` and `services.related` point at their own collection, and `clients.engagements` points at projects while `projects.client` points back at clients. Neither can be satisfied in one pass, so both are written in a second patch pass once every id exists.

**Files:**
- Create: `src/seed/index.ts`
- Create: `src/seed/verify.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: `decideWrite`, `makeResolver`, `SeedMode`, `SeedReport` (Task 16); every transform (Task 17); every collection and global (Tasks 8–15)
- Produces: `npm run seed`, `npm run seed:force`, `npm run seed:fresh`, `npm run seed:verify`

- [ ] **Step 1: Write the seed script**

Create `src/seed/index.ts`:

```ts
import { getPayload } from "payload";
import type { Payload } from "payload";
import config from "../payload.config";

import { COMPANY, IMPACT, IMPACT_SUPPORT, VALUES, JOURNEY, DIFFERENTIATORS, DELIVERY, INDUSTRIES, SUSTAINABILITY, EXECUTIVE_ROLES, CONTACT, INQUIRY_CATEGORIES, NAV, SOLUTIONS, SERVICES, CLIENTS, CLIENT_SECTORS, PARTNERS, PARTNER_CATEGORIES, PROJECTS } from "../../design-src/highland/content.mjs";
import { SOLUTION_DETAIL, SERVICE_DETAIL } from "../../design-src/highland/detail.mjs";
import { IMPLEMENTATION, PROJECT_DETAIL } from "../../design-src/highland/project-detail.mjs";
import { BLOG_CATEGORIES, POSTS, NEWS, EVENTS, DOWNLOADS, RESOURCE_SECTIONS } from "../../design-src/highland/editorial.mjs";
import { CAREER_PATHWAYS, CULTURE, DEVELOPMENT, EXPERIENCE_POINTS, APPLICATION_DOCS, INTERNSHIP, ACADEMY_AUDIENCES, ACADEMY_TRACKS, ACADEMY_LEVELS, ACADEMY_DELIVERY, COURSE_SECTIONS, JOBS } from "../../design-src/highland/people.mjs";

import { decideWrite, makeResolver, type SeedMode, type SeedReport } from "./upsert";
import { eventDates, toConfirmable, toDetailBlocks, toItems, toRichParagraphs } from "./transform";

/*
 * Loads Edge's approved content into Payload from the Highland modules.
 *
 * Those modules are the record of what came from
 * Edge_Comm-Tech_Website_Content_Master_2026.pdf, so nothing here is retyped
 * and nothing is invented. design-src/content.json is NOT imported: it is a
 * NEXT IT-derived model from before the client's first correction.
 *
 * Modes (see ./upsert.ts): fill creates what is missing and leaves the rest,
 * force overwrites in place, fresh deletes first. Default is fill, so a
 * re-run cannot destroy an editor's work.
 */

const MODE = (process.argv.find((a) => /^--(fill|force|fresh)$/.test(a))?.slice(2) ??
  "fill") as SeedMode;

const SEEDED = [
  "partnerCategories", "postCategories", "solutions", "services", "clients",
  "projects", "partners", "posts", "news", "events", "downloads", "jobs",
  "academyTracks",
] as const;

type Slugged = (typeof SEEDED)[number];

async function write(
  payload: Payload,
  collection: Slugged,
  key: { field: string; value: string },
  data: Record<string, unknown>,
  report: SeedReport,
): Promise<number> {
  const { docs } = await payload.find({
    collection,
    where: { [key.field]: { equals: key.value } },
    limit: 1,
    depth: 0,
  });
  const existing = docs[0];
  const action = decideWrite(Boolean(existing), MODE);

  if (action === "skip") {
    report.skipped += 1;
    return existing.id as number;
  }
  if (action === "update") {
    const doc = await payload.update({
      collection,
      id: existing.id,
      data: { ...data, _status: "published" },
    });
    report.updated += 1;
    return doc.id as number;
  }
  const doc = await payload.create({ collection, data: { ...data, _status: "published" } });
  report.created += 1;
  return doc.id as number;
}

async function seed() {
  const payload = await getPayload({ config });
  const report: SeedReport = { created: 0, updated: 0, skipped: 0 };

  if (MODE === "fresh") {
    payload.logger.info("fresh: clearing seeded collections");
    for (const collection of SEEDED) {
      await payload.delete({ collection, where: { id: { exists: true } } });
    }
  }

  /* ---------------------------------------------- 1. no dependencies */

  const categoryIds: { key: string; id: number }[] = [];
  for (const [key, label, description] of PARTNER_CATEGORIES) {
    const ringLabel = label.split(/\s+(?:and|&)\s+/)[0];
    categoryIds.push({
      key,
      id: await write(payload, "partnerCategories", { field: "key", value: key },
        { key, label, ringLabel, description, order: categoryIds.length + 1 }, report),
    });
  }
  const category = makeResolver("partner category", categoryIds);

  const postCatIds: { key: string; id: number }[] = [];
  for (const [key, label] of BLOG_CATEGORIES) {
    postCatIds.push({
      key,
      id: await write(payload, "postCategories", { field: "key", value: key },
        { key, label, order: postCatIds.length + 1 }, report),
    });
  }
  const postCategory = makeResolver("post category", postCatIds);

  /* ------------------------------- 2. solutions and services, pass one */

  const solutionIds: { key: string; id: number }[] = [];
  for (const s of SOLUTIONS) {
    const d = SOLUTION_DETAIL[s.slug] ?? {};
    solutionIds.push({
      key: s.slug,
      id: await write(payload, "solutions", { field: "slug", value: s.slug }, {
        title: s.title, slug: s.slug, short: s.short, blurb: s.blurb, order: s.n,
        accent: "#0888c5", headline: d.headline ?? s.title, intro: d.intro ?? s.blurb,
        lead: d.lead ?? null, detail: toDetailBlocks(d),
        outcomesTitle: d.outcomesTitle ?? null, outcomes: toItems(d.outcomes ?? []),
        note: d.note ?? null, experience: d.experience ?? null,
      }, report),
    });
  }
  const solution = makeResolver("solution", solutionIds);

  const serviceIds: { key: string; id: number }[] = [];
  for (const s of SERVICES) {
    const d = SERVICE_DETAIL[s.slug] ?? {};
    serviceIds.push({
      key: s.slug,
      id: await write(payload, "services", { field: "slug", value: s.slug }, {
        title: s.title, slug: s.slug, short: s.short, blurb: s.blurb, order: s.n,
        accent: "#056a9a", headline: d.headline ?? s.title, intro: d.intro ?? s.blurb,
        capabilities: (d.capabilities ?? []).map((c: { title: string; body: string }) => ({ ...c })),
        checklistTitle: d.checklistTitle ?? null, checklist: toItems(d.checklist ?? []),
        modelsTitle: d.modelsTitle ?? null,
        models: (d.models ?? []).map((m: { title: string; body: string }) => ({ ...m })),
        fit: d.fit ?? null, note: d.note ?? null,
      }, report),
    });
  }
  const service = makeResolver("service", serviceIds);

  /* -------------------------------------- 3. clients, then projects */

  const clientIds: { key: string; id: number }[] = [];
  for (const c of CLIENTS) {
    clientIds.push({
      key: c.name,
      id: await write(payload, "clients", { field: "name", value: c.name }, {
        name: c.name, sector: c.sector, summary: c.summary,
        order: clientIds.length + 1,
        solutions: c.solutions.map(solution),
      }, report),
    });
  }
  const client = makeResolver("client", clientIds);

  const projectIds: { key: string; id: number }[] = [];
  for (const pr of PROJECTS) {
    const d = PROJECT_DETAIL[pr.slug] ?? {};
    projectIds.push({
      key: pr.slug,
      id: await write(payload, "projects", { field: "slug", value: pr.slug }, {
        title: pr.title, slug: pr.slug, client: client(pr.client),
        featured: pr.featured === 1, sector: pr.sector.toLowerCase(),
        sectorFull: pr.sectorFull, location: pr.location,
        year: toConfirmable(pr.year, "Year to confirm"),
        primary: pr.primary, headline: d.headline ?? null, summary: pr.summary,
        solutions: pr.solutions.map(solution), tech: toItems(pr.tech),
        need: d.need ?? pr.summary, scope: d.scope ?? pr.summary,
        delivered: toItems(d.delivered ?? []), outcomes: toItems(d.outcomes ?? []),
        technology: toItems(d.technology ?? []), technologyNote: d.technologyNote ?? null,
        training: d.training ?? null, privacy: d.privacy ?? null,
      }, report),
    });
  }
  const project = makeResolver("project", projectIds);

  /* ------------------------------------------------------ 4. partners */

  const partnerIds: { key: string; id: number }[] = [];
  for (const pt of PARTNERS) {
    partnerIds.push({
      key: pt.name,
      id: await write(payload, "partners", { field: "name", value: pt.name }, {
        name: pt.name, order: PARTNERS.indexOf(pt) + 1,
        categories: pt.cats.map(category), featured: Boolean(pt.featured),
        capability: pt.cap, solution: solution(pt.solution),
        projects: pt.projects.map(project),
      }, report),
    });
  }
  const partner = makeResolver("partner", partnerIds);

  /* ----------------------------------------------------- 5. editorial */

  for (const post of POSTS) {
    await write(payload, "posts", { field: "slug", value: post.slug }, {
      title: post.title, slug: post.slug, order: POSTS.indexOf(post) + 1,
      category: postCategory(post.cat), body: toRichParagraphs(post.paras),
      target: solution(post.to), anchor: post.anchor ?? null,
      readMoreLabel: post.label,
    }, report);
  }

  for (const n of NEWS) {
    await write(payload, "news", { field: "slug", value: n.slug }, {
      title: n.title, slug: n.slug, kind: n.kind,
      date: toConfirmable(n.date, "Date to confirm"),
      archive: Boolean(n.archive), standfirst: n.standfirst,
      body: toRichParagraphs(n.paras),
    }, report);
  }

  for (const e of EVENTS) {
    const { startsOn, endsOn } = eventDates({ iso: e.iso, date: e.date });
    await write(payload, "events", { field: "slug", value: e.slug }, {
      title: e.title, slug: e.slug, startsOn, endsOn, displayDate: e.date,
      category: e.category, format: e.format, venue: e.venue,
      headline: e.headline, intro: e.intro, audience: e.audience,
      program: toItems(e.program), action: e.action, pendingNote: e.pending ?? null,
    }, report);
  }

  for (const d of DOWNLOADS) {
    await write(payload, "downloads", { field: "title", value: d.title }, {
      title: d.title, order: DOWNLOADS.indexOf(d) + 1, category: d.category,
      owner: d.owner, meta: d.meta, note: d.note ?? null, approved: false,
    }, report);
  }

  /* -------------------------------------------------------- 6. people */

  for (const j of JOBS) {
    await write(payload, "jobs", { field: "slug", value: j.slug }, {
      title: j.title, slug: j.slug, department: j.department, level: j.level,
      reports: j.reports, type: j.type, status: j.status, location: j.location,
      deadline: toConfirmable(j.deadline, "Deadline to be confirmed"),
      purposeTitle: j.purposeTitle, purpose: j.purpose, scope: j.scope ?? null,
      responsibilities: toItems(j.responsibilities), required: toItems(j.required),
      preferred: toItems(j.preferred), success: j.success,
    }, report);
  }

  for (const t of ACADEMY_TRACKS) {
    await write(payload, "academyTracks", { field: "slug", value: t.slug }, {
      title: t.title, slug: t.slug, order: ACADEMY_TRACKS.indexOf(t) + 1,
      body: t.body, solution: solution(t.solution),
    }, report);
  }

  /* ------------------- 7. second pass: self and circular relations

     Three relationships cannot be satisfied in one pass: solutions.related
     and services.related point into their own collection, clients.engagements
     and projects.client point at each other, and solutions.partners points at
     partners -- which are created after solutions, because every partner
     points back at a solution. */

  payload.logger.info("patching relations that needed every id to exist");

  for (const s of SOLUTIONS) {
    const d = SOLUTION_DETAIL[s.slug] ?? {};
    const related = (d.links ?? []).filter((x: string) => x !== s.slug);
    const brands = d.partners ?? [];
    if (related.length || brands.length) {
      await payload.update({ collection: "solutions", id: solution(s.slug), data: {
        ...(related.length ? { related: related.map(solution) } : {}),
        ...(brands.length ? { partners: brands.map(partner) } : {}),
      }});
    }
  }

  for (const s of SERVICES) {
    const related = (SERVICE_DETAIL[s.slug]?.links ?? []).filter((x: string) => x !== s.slug);
    if (related.length) {
      await payload.update({ collection: "services", id: service(s.slug),
        data: { related: related.map(service) } });
    }
  }

  for (const c of CLIENTS) {
    if (c.engagements.length) {
      await payload.update({ collection: "clients", id: client(c.name),
        data: { engagements: c.engagements.map(project) } });
    }
  }

  /* ------------------------------------------------------- 8. globals */

  payload.logger.info("seeding globals");

  await payload.updateGlobal({ slug: "site-settings", data: {
    nav: NAV.map(([label, href]) => ({ label, href: `/${href.replace(/\.html$/, "").replace(/^index$/, "")}` })),
    impact: IMPACT.map((m) => ({ figure: m.figure, unit: m.unit, line: m.line })),
    impactSupport: IMPACT_SUPPORT,
  }});

  await payload.updateGlobal({ slug: "company", data: {
    legalName: COMPANY.legal, shortName: COMPANY.short, domain: COMPANY.domain,
    established: COMPANY.established, positioning: COMPANY.positioning,
    mission: COMPANY.mission, missionBody: COMPANY.missionBody,
    vision: COMPANY.vision, visionBody: COMPANY.visionBody,
    values: VALUES.map((v) => ({ ...v })),
    journey: JOURNEY.map((m) => ({ ...m })),
    differentiators: DIFFERENTIATORS.map((d) => ({ ...d })),
    delivery: DELIVERY.map((d) => ({ title: d.title, body: d.body })),
    industries: INDUSTRIES.map((i) => ({ ...i })),
    sustainability: SUSTAINABILITY.map((s) => ({ ...s })),
    executiveRoles: EXECUTIVE_ROLES.map((title: string) => ({
      title, holder: toConfirmable(undefined, "Name and biography pending"),
    })),
  }});

  await payload.updateGlobal({ slug: "contact-details", data: {
    office: CONTACT.office.map((line: string) => ({ line })),
    mapUrl: CONTACT.map, phones: CONTACT.phones.map((p) => ({ ...p })),
    whatsapp: CONTACT.whatsapp, emails: CONTACT.emails.map((e) => ({ ...e })),
    emergency: CONTACT.emergency, response: CONTACT.response,
    hours: CONTACT.hours.map(([days, hours]: [string, string]) => ({ days, hours })),
    inquiryCategories: INQUIRY_CATEGORIES.map((c) => ({
      key: c.slug, title: c.title, prompt: c.prompt, route: c.route,
    })),
  }});

  await payload.updateGlobal({ slug: "careers-content", data: {
    pathways: CAREER_PATHWAYS.map((x) => ({ ...x })),
    culture: CULTURE.map(([title, body]: [string, string]) => ({ title, body })),
    development: toItems(DEVELOPMENT), experiencePoints: toItems(EXPERIENCE_POINTS),
    applicationDocs: toItems(APPLICATION_DOCS),
    internship: {
      title: INTERNSHIP.title, type: INTERNSHIP.type, location: INTERNSHIP.location,
      schedule: toConfirmable(INTERNSHIP.schedule, "Dates to be confirmed"),
      deadline: toConfirmable(INTERNSHIP.deadline, "Deadline to be confirmed"),
      intro: INTERNSHIP.intro, caveat: INTERNSHIP.caveat,
      tracks: INTERNSHIP.tracks.map((t) => ({ ...t })),
      eligibility: toItems(INTERNSHIP.eligibility),
      documents: toItems(INTERNSHIP.documents),
      structure: INTERNSHIP.structure.map((s) => ({ ...s })),
      selection: INTERNSHIP.selection.map((s) => ({ n: s.n, title: s.title, body: s.body })),
    },
    academyAudiences: ACADEMY_AUDIENCES.map((a) => ({ ...a })),
    academyLevels: toItems(ACADEMY_LEVELS), academyDelivery: toItems(ACADEMY_DELIVERY),
    courseSections: COURSE_SECTIONS.map((s) => ({ ...s })),
  }});

  await payload.updateGlobal({ slug: "page-copy", data: {
    projectImplementationNote: IMPLEMENTATION,
    resourceSections: RESOURCE_SECTIONS.map((s) => ({
      key: s.slug, title: s.title, body: s.body,
      href: `/${s.file.replace(/\.html$/, "").replace(/^media-/, "resources/media/")}`,
    })),
  }});

  payload.logger.info(
    `seed (${MODE}): ${report.created} created, ${report.updated} updated, ${report.skipped} left alone`,
  );
  if (MODE === "fill" && report.skipped > 0) {
    payload.logger.info("skipped documents already existed. Use --force to overwrite them.");
  }
}

await seed();
process.exit(0);
```

- [ ] **Step 2: Write the verification script**

Create `src/seed/verify.ts`:

```ts
import { getPayload } from "payload";
import config from "../payload.config";

/*
 * Asserts the database holds what the content master says it should.
 *
 * Counts catch a transform that silently dropped rows. The relationship checks
 * catch the opposite failure: rows that exist but point at nothing, which
 * renders as a project with no client or a partner card linking nowhere.
 */

const EXPECTED: Record<string, number> = {
  solutions: 7, services: 6, projects: 8, clients: 10, partners: 32,
  partnerCategories: 10, posts: 10, postCategories: 10, news: 3, events: 3,
  downloads: 4, jobs: 2, academyTracks: 6,
};

const problems: string[] = [];
const payload = await getPayload({ config });

for (const [collection, expected] of Object.entries(EXPECTED)) {
  const { totalDocs } = await payload.count({ collection: collection as never });
  if (totalDocs !== expected) {
    problems.push(`${collection}: expected ${expected}, found ${totalDocs}`);
  }
}

const { docs: projects } = await payload.find({ collection: "projects", limit: 100, depth: 0 });
for (const p of projects) {
  if (!p.client) problems.push(`project "${p.slug}" has no client`);
  if (!p.solutions?.length) problems.push(`project "${p.slug}" has no solutions`);
}

const { docs: partners } = await payload.find({ collection: "partners", limit: 100, depth: 0 });
for (const p of partners) {
  if (!p.solution) problems.push(`partner "${p.name}" links to no solution`);
  if (!p.categories?.length) problems.push(`partner "${p.name}" has no category`);
}

const { docs: posts } = await payload.find({ collection: "posts", limit: 100, depth: 0 });
for (const p of posts) {
  if (!p.target) problems.push(`post "${p.slug}" has no target solution`);
}

/* All seven families list the platforms they are delivered on, and those are
   patched in the seed's second pass -- so an empty list here means the patch
   pass did not run, which the counts alone would not reveal. */
const { docs: solutions } = await payload.find({ collection: "solutions", limit: 100, depth: 0 });
for (const sol of solutions) {
  if (!sol.partners?.length) problems.push(`solution "${sol.slug}" lists no partners`);
}

if (problems.length) {
  console.error(`FAIL — ${problems.length} problem(s):`);
  for (const line of problems) console.error(`  ${line}`);
  process.exit(1);
}

console.log(
  `PASS — ${Object.values(EXPECTED).reduce((a, b) => a + b, 0)} documents across ${Object.keys(EXPECTED).length} collections, no dangling relationships`,
);
process.exit(0);
```

- [ ] **Step 3: Add the scripts**

In `package.json`, replace the existing `"seed"` entry with:

```json
    "seed": "cross-env NODE_OPTIONS=--no-deprecation payload run src/seed/index.ts",
    "seed:force": "cross-env NODE_OPTIONS=--no-deprecation payload run src/seed/index.ts --force",
    "seed:fresh": "cross-env NODE_OPTIONS=--no-deprecation payload run src/seed/index.ts --fresh",
    "seed:verify": "cross-env NODE_OPTIONS=--no-deprecation payload run src/seed/verify.ts"
```

- [ ] **Step 4: Run the seed and verify the counts**

```bash
docker compose up -d
npm run seed:fresh
npm run seed:verify
```

Expected: the seed reports 111 created, and verify prints
`PASS — 111 documents across 13 collections, no dangling relationships`.

If the resolver throws, it will name the unmatched value and suggest the nearest — fix the data reference rather than loosening the resolver.

- [ ] **Step 5: Prove a re-run is safe (Review Focus #1)**

```bash
npm run seed
```

Expected: `seed (fill): 0 created, 0 updated, 111 left alone`, followed by the note about `--force`. Nothing is overwritten.

Now simulate an editor: in `/admin/collections/solutions`, change any solution's **headline**, save, and run `npm run seed` again.
Expected: still 0 updated, and the edited headline survives. Then `npm run seed:force` and confirm it is restored — which is what force is for.

- [ ] **Step 6: Commit**

```bash
git add src/seed/index.ts src/seed/verify.ts package.json
git commit -m "Seed Payload from the approved Highland content

111 documents and five globals, imported from design-src/highland/*.mjs --
the record of what came from the content master. Nothing is retyped and
nothing is invented. design-src/content.json is not imported.

Two ordering problems needed a second pass: solutions.related and
services.related point at their own collection, and clients.engagements and
projects.client point at each other. Both are patched once every id exists.

Default mode leaves existing documents alone and says how many it skipped, so
a re-run after Edge has edited cannot destroy their work -- verified by
editing a headline, re-running, and watching it survive. --force overwrites in
place keeping ids; --fresh deletes first.

verify.ts checks counts against the master and walks the relationships,
because rows that exist but point at nothing render as a project with no
client and raise no error on their own."
```

---

## Phase 3 — Data layer and chrome

### Task 19: The read layer

Carries **Review Focus #5**: an approved logo that is later un-approved must stop rendering.

`filterOptions` gates selection in the admin, at edit time. It does nothing about a document that was selected while approved and un-approved afterwards — that asset keeps publishing. The read layer needs its own check.

**Files:**
- Create: `src/lib/media.ts`
- Create: `src/lib/media.test.ts`
- Modify: `src/lib/content.ts`

**Interfaces:**
- Consumes: `eventStatus` (Task 12); every collection and global (Tasks 8–15)
- Produces: one reader per content need, each `cache()`d and filtered to published documents. Phases 4–5 import only from here; no route calls Payload directly.
  - `approvedLogo(logo: unknown): MediaDoc | null`
  - `getCompany()`, `getContactDetails()`, `getCareersContent()`, `getPageCopy()`, `getSiteSettings()`
  - `getSolutions()`, `getSolution(slug)`, `getServices()`, `getService(slug)`
  - `getProjects()`, `getProject(slug)`, `getClients()`, `getPartners()`, `getPartnerCategories()`
  - `getPosts()`, `getPostCategories()`, `getNews()`, `getNewsItem(slug)`
  - `getEvents()` (each with a derived `status`), `getEvent(slug)`, `getDownloads()`
  - `getJobs()`, `getJob(slug)`, `getAcademyTracks()`

- [ ] **Step 1: Write the failing test for the logo gate**

Create `src/lib/media.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { approvedLogo } from "./media";

describe("approvedLogo", () => {
  it("returns an approved asset", () => {
    const logo = { id: 1, url: "/m/hp.png", alt: "HP", approved: true };
    expect(approvedLogo(logo)).toEqual(logo);
  });

  it("returns null for an asset whose approval was withdrawn", () => {
    // Review Focus #5. filterOptions stops SELECTION in the admin; it does
    // nothing about an asset un-approved after it was selected.
    expect(approvedLogo({ id: 1, url: "/m/hp.png", alt: "HP", approved: false })).toBe(null);
  });

  it("returns null when approval is absent rather than assuming true", () => {
    expect(approvedLogo({ id: 1, url: "/m/hp.png", alt: "HP" })).toBe(null);
  });

  it("returns null for an unpopulated relationship", () => {
    // depth: 0 gives a bare id, which carries no approval state to trust.
    expect(approvedLogo(7)).toBe(null);
    expect(approvedLogo("7")).toBe(null);
  });

  it("returns null for null, undefined and nonsense", () => {
    expect(approvedLogo(null)).toBe(null);
    expect(approvedLogo(undefined)).toBe(null);
    expect(approvedLogo({})).toBe(null);
  });

  it("returns null when the asset has no url to render", () => {
    expect(approvedLogo({ id: 1, alt: "HP", approved: true })).toBe(null);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- media`

Expected: FAIL with `Failed to resolve import "./media"`.

- [ ] **Step 3: Write the implementation**

Create `src/lib/media.ts`:

```ts
/*
 * The second half of the media approval gate.
 *
 * filterOptions on the logo relationships stops an unapproved asset being
 * SELECTED in the admin. It does nothing about one that was selected while
 * approved and un-approved afterwards -- that keeps publishing, which is
 * exactly the case the content master cares about, because approval is
 * withdrawn when someone discovers the asset should not have been published.
 *
 * So every read of a logo goes through here. Absent approval is treated as
 * not approved: the default has to fail closed.
 */

export type MediaDoc = {
  id: number | string;
  url: string;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
  approved?: boolean | null;
};

export function approvedLogo(logo: unknown): MediaDoc | null {
  if (!logo || typeof logo !== "object") return null;
  const doc = logo as Partial<MediaDoc>;
  if (doc.approved !== true) return null;
  if (typeof doc.url !== "string" || !doc.url) return null;
  return doc as MediaDoc;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- media`

Expected: PASS, all six cases.

- [ ] **Step 5: Rebuild the read layer**

Replace the whole of `src/lib/content.ts`:

```ts
import { cache } from "react";
import { getPayload } from "payload";
import config from "@payload-config";
import type {
  AcademyTrack, CareersContent, Client, Company, ContactDetail, Download, Event, Job,
  News, PageCopy, Partner, PartnerCategory, Post, PostCategory, Project, Service,
  SiteSetting, Solution,
} from "@/payload-types";
import { eventStatus, type EventStatus } from "./events";
import { approvedLogo } from "./media";

export type {
  AcademyTrack, CareersContent, Client, Company, ContactDetail, Download, Event, Job,
  News, PageCopy, Partner, PartnerCategory, Post, PostCategory, Project, Service,
  SiteSetting, Solution,
};

/*
 * Every read the public site makes. Routes import from here and never call
 * Payload directly, so the published-only filter and the logo approval gate
 * cannot be forgotten in one route.
 *
 * Only published documents reach the public site. The Local API defaults to
 * overrideAccess: true, so the access rules in src/access are not enough on
 * their own -- every read below filters on _status explicitly. Do not remove
 * that filter to "simplify" a query.
 */

const payloadClient = cache(async () => getPayload({ config }));

const PUBLISHED = { _status: { equals: "published" } } as const;

const byOrder = { sort: "order" } as const;

async function many<T>(collection: string, extra: Record<string, unknown> = {}): Promise<T[]> {
  const payload = await payloadClient();
  const { docs } = await payload.find({
    collection: collection as never,
    where: PUBLISHED,
    limit: 200,
    depth: 2,
    ...extra,
  });
  return docs as T[];
}

async function one<T>(collection: string, slug: string): Promise<T | null> {
  const payload = await payloadClient();
  const { docs } = await payload.find({
    collection: collection as never,
    where: { ...PUBLISHED, slug: { equals: slug } },
    limit: 1,
    depth: 2,
  });
  return (docs[0] as T) ?? null;
}

/* ---------------------------------------------------------------- globals */

export const getSiteSettings = cache(async (): Promise<SiteSetting> => {
  const payload = await payloadClient();
  return payload.findGlobal({ slug: "site-settings", depth: 1 });
});

export const getCompany = cache(async (): Promise<Company> => {
  const payload = await payloadClient();
  return payload.findGlobal({ slug: "company", depth: 1 });
});

export const getContactDetails = cache(async (): Promise<ContactDetail> => {
  const payload = await payloadClient();
  return payload.findGlobal({ slug: "contact-details", depth: 1 });
});

export const getCareersContent = cache(async (): Promise<CareersContent> => {
  const payload = await payloadClient();
  return payload.findGlobal({ slug: "careers-content", depth: 1 });
});

export const getPageCopy = cache(async (): Promise<PageCopy> => {
  const payload = await payloadClient();
  return payload.findGlobal({ slug: "page-copy", depth: 1 });
});

/* ----------------------------------------------- solutions and services */

export const getSolutions = cache(() => many<Solution>("solutions", byOrder));
export const getSolution = cache((slug: string) => one<Solution>("solutions", slug));
export const getServices = cache(() => many<Service>("services", byOrder));
export const getService = cache((slug: string) => one<Service>("services", slug));

/* ---------------------------------------------------------- the evidence */

export const getProjects = cache(() => many<Project>("projects"));
export const getProject = cache((slug: string) => one<Project>("projects", slug));

/*
 * Clients and partners carry logos, so both strip assets whose approval has
 * been withdrawn. A null logo is the intended state for most of them: the
 * page sets the institution's or brand's name in the same frame.
 */
export type WithLogo<T> = Omit<T, "logo"> & { logo: ReturnType<typeof approvedLogo> };

export const getClients = cache(async (): Promise<WithLogo<Client>[]> => {
  const docs = await many<Client>("clients", byOrder);
  return docs.map((c) => ({ ...c, logo: approvedLogo(c.logo) }));
});

export const getPartners = cache(async (): Promise<WithLogo<Partner>[]> => {
  const docs = await many<Partner>("partners", byOrder);
  return docs.map((p) => ({ ...p, logo: approvedLogo(p.logo) }));
});

export const getPartnerCategories = cache(() =>
  many<PartnerCategory>("partnerCategories", byOrder),
);

/* ------------------------------------------------------------- editorial */

export const getPosts = cache(() => many<Post>("posts", byOrder));
export const getPostCategories = cache(() => many<PostCategory>("postCategories", byOrder));
export const getNews = cache(() => many<News>("news"));
export const getNewsItem = cache((slug: string) => one<News>("news", slug));

/*
 * Status is derived on read, never stored -- see src/lib/events.ts. That is
 * why it is attached here rather than left to each page: three pages show
 * event status and they must not disagree.
 */
export type EventWithStatus = Event & { status: EventStatus };

export const getEvents = cache(async (): Promise<EventWithStatus[]> => {
  const docs = await many<Event>("events", { sort: "startsOn" });
  return docs.map((e) => ({ ...e, status: eventStatus(e) }));
});

export const getEvent = cache(async (slug: string): Promise<EventWithStatus | null> => {
  const doc = await one<Event>("events", slug);
  return doc ? { ...doc, status: eventStatus(doc) } : null;
});

export const getDownloads = cache(() => many<Download>("downloads", byOrder));

/* ---------------------------------------------------------------- people */

export const getJobs = cache(() => many<Job>("jobs"));
export const getJob = cache((slug: string) => one<Job>("jobs", slug));
export const getAcademyTracks = cache(() => many<AcademyTrack>("academyTracks", byOrder));

/* ----------------------------------------------------------------- forms */

export type ContactForm = Awaited<ReturnType<typeof getContactForm>>;

export const getContactForm = cache(async () => {
  const payload = await payloadClient();
  const { docs } = await payload.find({
    collection: "forms",
    where: { title: { equals: "Contact" } },
    limit: 1,
    depth: 1,
  });
  return docs[0] ?? null;
});
```

- [ ] **Step 6: Verify every reader returns the seeded content**

Create a throwaway check and run it:

```bash
cat > /tmp/read-check.ts <<'EOF'
import { getSolutions, getServices, getProjects, getClients, getPartners, getPosts, getEvents, getJobs, getAcademyTracks, getCompany, getContactDetails } from "../src/lib/content";
const counts = {
  solutions: (await getSolutions()).length,
  services: (await getServices()).length,
  projects: (await getProjects()).length,
  clients: (await getClients()).length,
  partners: (await getPartners()).length,
  posts: (await getPosts()).length,
  events: (await getEvents()).length,
  jobs: (await getJobs()).length,
  academyTracks: (await getAcademyTracks()).length,
};
console.log(counts);
console.log("company:", (await getCompany()).legalName);
console.log("phone:", (await getContactDetails()).phones?.[0]?.value);
console.log("event statuses:", (await getEvents()).map((e) => `${e.slug}=${e.status}`).join(" "));
console.log("logos surviving the gate:", (await getPartners()).filter((p) => p.logo).length);
EOF
cp /tmp/read-check.ts src/lib/read-check.ts
npx cross-env NODE_OPTIONS=--no-deprecation payload run src/lib/read-check.ts
rm src/lib/read-check.ts
```

Expected: `{ solutions: 7, services: 6, projects: 8, clients: 10, partners: 32, posts: 10, events: 3, jobs: 2, academyTracks: 6 }`, the legal name, the real phone number, and event statuses reflecting today's date. "logos surviving the gate" is 0 until media are uploaded and approved — correct, not a failure.

- [ ] **Step 7: Commit**

```bash
git add src/lib/media.ts src/lib/media.test.ts src/lib/content.ts
git commit -m "Rebuild the read layer for the approved content model

One reader per content need, each cached and filtered to published documents.
Routes import only from here and never call Payload directly, so the
published-only filter cannot be forgotten in one route -- it matters because
the Local API overrides access rules, making that explicit filter the only
thing keeping drafts off the public site.

approvedLogo is the second half of the media gate. filterOptions stops an
unapproved asset being selected in the admin and does nothing about one
un-approved after selection -- which is the case that matters, since approval
gets withdrawn precisely when someone finds an asset should not have been
published. Absent approval is treated as not approved: it fails closed.

Event status is attached on read rather than left to each page, because three
pages show it and they must not disagree."
```

---

### Task 20: Header, footer and layout

Highland's chrome, reading from the CMS. The footer is the reason `contact-details` is admin-only: it appears on all 51 pages, and the inherited one carried a phone number and office address that were not Edge's.

**Files:**
- Create: `public/edge-logo.png` (copied, not authored)
- Create: `src/components/nav-links.tsx`
- Modify: `src/components/chrome.tsx`
- Modify: `src/app/(frontend)/layout.tsx`
- Delete: `src/components/mobile-nav.tsx`

**Interfaces:**
- Consumes: `getSiteSettings`, `getContactDetails`, `getSolutions`, `getCompany` (Task 19)
- Produces: `<SiteHeader />` and `<SiteFooter />`, both async server components that fetch their own data. Phases 4–5 touch neither; the layout renders them once.

- [ ] **Step 1: Publish the logo**

The generator's output holds the prepared asset. Copy it — do not modify anything under `design-src/` or `design-files/`:

```bash
mkdir -p public
cp design-files/highland/edge-logo.png public/edge-logo.png
```

- [ ] **Step 2: Write the nav links as a client component**

Only the links need to know the current route, so only they are a client component. Create `src/components/nav-links.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/*
 * Current-page marking needs the pathname, which is a client concern. Keeping
 * it to this component leaves the header, footer and every page a server
 * component -- the alternative is making the whole header client-side to
 * highlight one link.
 */
export function NavLinks({
  items,
  className,
  activeClass = "text-gold",
  idleClass = "text-ink/70 hover:text-gold",
}: {
  items: { label: string; href: string }[];
  className?: string;
  activeClass?: string;
  idleClass?: string;
}) {
  const pathname = usePathname();

  return (
    <>
      {items.map((item) => {
        const current = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={current ? "page" : undefined}
            className={`${className ?? ""} ${current ? activeClass : idleClass}`}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
```

- [ ] **Step 3: Write the header and footer**

The replacement imports `./nav-links` and does not import `mobile-nav`, so
`src/components/mobile-nav.tsx` becomes unreachable the moment this lands. It is
the last file carrying `bg-brass` and `btn-brass`, tokens deleted in Task 7, and
Step 6 removes it. Do not port it; `nav-links` is its replacement.

Replace the whole of `src/components/chrome.tsx`:

```tsx
import Image from "next/image";
import Link from "next/link";
import { NavLinks } from "./nav-links";
import { getCompany, getContactDetails, getSiteSettings, getSolutions } from "@/lib/content";

/*
 * Highland's header and footer.
 *
 * Both fetch their own data rather than taking it as props: they are rendered
 * once by the layout, the readers are cache()d, and threading five globals
 * through the layout as props only invites a page to pass the wrong one.
 *
 * Every fact in the footer comes from the CMS. The footer this replaces was
 * the single-page design's, string-patched, and it carried the wrong office
 * address and the wrong telephone number on every page -- which is why
 * contact-details is admin-only.
 */

export async function SiteHeader() {
  const settings = await getSiteSettings();
  const items = (settings.nav ?? []).map((n) => ({ label: n.label, href: n.href }));

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/90 text-ink backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="shrink-0 leading-none">
          <Image
            src="/edge-logo.png"
            alt="Edge Communication Technologies"
            width={391}
            height={176}
            className="h-14 w-auto"
            priority
          />
        </Link>
        <nav className="hidden items-center gap-5 text-sm lg:flex" aria-label="Main">
          <NavLinks items={items} />
        </nav>
        <Link
          href="/contact"
          className="hidden rounded-full bg-gold px-4 py-2 text-sm text-white md:inline-block"
        >
          Contact us
        </Link>
      </div>
      <nav
        className="flex gap-4 overflow-x-auto border-t border-rule px-6 py-2.5 text-xs lg:hidden"
        aria-label="Main"
      >
        <NavLinks items={items} className="whitespace-nowrap" idleClass="text-ink/70" />
        <Link href="/contact" className="whitespace-nowrap text-gold">
          Contact
        </Link>
      </nav>
    </header>
  );
}

export async function SiteFooter() {
  const [settings, contact, solutions, company] = await Promise.all([
    getSiteSettings(),
    getContactDetails(),
    getSolutions(),
    getCompany(),
  ]);

  const companyLinks = (settings.nav ?? []).filter((n) => n.href !== "/solutions");
  const pill =
    "rounded-full border border-rule px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ink/70 transition hover:border-gold hover:text-gold";

  return (
    <footer className="border-t border-rule bg-paper-2">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Image
            src="/edge-logo.png"
            alt="Edge Communication Technologies"
            width={391}
            height={176}
            className="h-16 w-auto"
          />
          <p className="mt-3 max-w-sm text-sm text-ink/70">
            An integrated technology company in Addis Ababa, delivering the infrastructure,
            security, software and support that Ethiopian banks, universities and public
            institutions depend on.
          </p>
          <p className="mt-4 flex flex-wrap gap-2">
            {contact.whatsapp ? (
              <a href={contact.whatsapp} className={pill}>
                WhatsApp
              </a>
            ) : null}
            <Link href="/subscribe" className={pill}>
              Subscribe
            </Link>
          </p>
        </div>

        <div>
          <h4 className="font-display text-sm">Solutions</h4>
          <ul className="mt-3 space-y-1.5 text-sm text-ink/70">
            {solutions.map((s) => (
              <li key={s.slug}>
                <Link href={`/solutions/${s.slug}`} className="hover:text-gold">
                  {s.short}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/services" className="hover:text-gold">
                Professional services
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm">Company</h4>
          <ul className="mt-3 space-y-1.5 text-sm text-ink/70">
            {companyLinks.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="hover:text-gold">
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/contact" className="hover:text-gold">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm">Get in touch</h4>
          <ul className="mt-3 space-y-1.5 text-sm text-ink/70">
            <li>
              {(contact.office ?? []).slice(1).map((line, i) => (
                <span key={line.line} className="block">
                  {line.line}
                </span>
              ))}
            </li>
            {(contact.emails ?? []).map((e) => (
              <li key={e.value}>
                <a href={`mailto:${e.value}`} className="hover:text-gold">
                  {e.value}
                </a>
              </li>
            ))}
            {(contact.phones ?? []).map((t) => (
              <li key={t.tel}>
                <a href={`tel:${t.tel}`} className="hover:text-gold">
                  {t.value}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-3 border-t border-rule px-6 py-6 text-sm text-steel md:flex-row md:justify-between">
        <p>
          &copy; {new Date().getFullYear()} {company.legalName}. All rights reserved.
        </p>
        <p className="text-ink/50">Design review build &mdash; content pending final approval.</p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Simplify the layout**

In `src/app/(frontend)/layout.tsx`, remove the `getSiteSettings` import and call, and render the chrome without props:

```tsx
        <SiteHeader />
        <div id="main">{children}</div>
        <SiteFooter />
```

Also update the metadata description to Edge's approved positioning:

```tsx
export const metadata: Metadata = {
  title: {
    default: "Edge Comm-Tech",
    template: "%s — Edge Comm-Tech",
  },
  description:
    "Edge Communication Technologies — integrated technology solutions across enterprise networks, cloud, datacenters, cybersecurity, software, AI, power and broadcast for Ethiopian institutions.",
};
```

- [ ] **Step 5: Verify the chrome carries the real facts**

Run:

```bash
docker compose up -d
npx tsc --noEmit
npm run dev
```

Open `http://localhost:3000/`. Expected in the footer, read from the CMS:

- **BMA Plaza, 9th Floor**, Gerji Imperial, Bole Sub-City, Addis Ababa, Ethiopia
- **+251 95 569 5565** and **+251 911 538 809**
- sales@, support@ and hr@edgecomm-tech.com
- Seven solution families plus Professional services
- Edge Communication Technologies PLC in the bottom bar

Confirm the old facts are gone:

```bash
grep -rniE "lubaba|info@edgecomm|92 255|NOC and SOC|Built to international standards|Advise, implement, manage" src/ || echo "clean"
```

Expected: `clean`.

Then check the nav fits: at 1024px the eight desktop items must not wrap. Highland's measured headroom at that width was about 190px, and the markup and type are the same here.

- [ ] **Step 6: Commit**

```bash
git rm src/components/mobile-nav.tsx
git add public/edge-logo.png src/components/nav-links.tsx src/components/chrome.tsx \
        "src/app/(frontend)/layout.tsx"
git commit -m "Port Highland's header and footer, reading every fact from the CMS

The footer this replaces was the single-page design's with string patches
applied, and it carried the wrong office address and the wrong telephone
number on every page -- which is why contact-details is admin-only. Every
fact here now comes from the CMS.

Both components fetch their own data rather than taking props. They are
rendered once by the layout, the readers are cache()d, and threading five
globals through as props only invites a page to pass the wrong one.

Current-page marking needs the pathname, so only the links are a client
component. Making the whole header client-side to highlight one link would
cost the server rendering of the chrome on every page."
```

---

## Done when

- `npm test` passes: validators, confirmable, event status, seed write modes, transforms, logo gate.
- `npm run seed:fresh && npm run seed:verify` prints `PASS — 111 documents across 13 collections, no dangling relationships`.
- `npm run seed` a second time reports `0 created, 0 updated, 111 left alone`.
- `npx tsc --noEmit` is clean and `npx next build` completes.
- `/admin` shows 13 content collections and 5 globals, grouped Content / Resources / People / Company / Site / Library / Admin.
- `/` renders the placeholder in Highland's palette with Highland's header and footer, and the footer carries Edge's real address, phones and emails.
- No field anywhere accepts a partnership tier, an authorization level, a certification tier, a salary or a benefit.

Phase 4 (static pages) begins from here, against a working data layer.
