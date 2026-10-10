# Running the site from Payload

The Highland build is content-complete: 51 pages carrying the client's approved
copy, published for review at
`abeselomg.github.io/edge-comm-tech/highland/`. Its content lives in hand-written
ESM modules under `design-src/highland/`, which means every future copy change
is a developer task and a git commit.

This spec covers moving that site onto the Payload CMS already present in this
repo, so Edge's own staff can edit it.

## What this is not

It is not "build a CMS". Payload 3 is already installed and wired into the Next
app: Postgres-backed, nine collections, three globals, SEO and form-builder
plugins, a typed read layer in `src/lib/content.ts` that filters to published
documents only, and `revalidatePath` hooks on every write. It works.

What it does not have is Edge's approved content model. The existing schema was
built for the retired nine-service taxonomy. The gap:

| Approved content | Payload today |
| --- | --- |
| 7 solution families | `Solutions` holds the old nine-service model |
| 6 professional services | missing |
| 10 clients | missing; `Sectors` is adjacent but a different shape |
| 32 partners across 10 categories | `Partners` exists, needs re-modelling |
| 10 blog posts, 3 events, 4 downloads | missing |
| 8 projects, 3 news items, 2 vacancies | `Projects`, `News`, `Jobs` exist |
| ~12 company singletons | 3 globals |
| 51 public pages | ~14 routes |

So this is a re-model and a port, extending something that works. That framing
matters for sequencing: nothing here starts from zero.

## Decisions already taken

Settled in conversation on 2026-10-10, recorded so they are not relitigated:

- **Edge's own non-technical staff are the editors.** This is the decision that
  shapes the rest. The admin is a deliverable, not a side effect of the schema,
  and the content master's prohibitions have to be enforced by the CMS rather
  than remembered by whoever is typing.
- **Highland's design ports as-is.** The client has reviewed and corrected this
  look across several rounds. Re-skinning it is a separate conversation with
  him, not a decision to take inside a CMS port. See *Open items*.
- **Host stays undecided; the design stays portable.** Media goes behind a
  storage abstraction and no host-specific API is used, so Vercel-plus-hosted-
  Postgres and a single VPS both remain available.
- **Structured collections with fixed templates**, not a block-based page
  builder. Editors fill typed fields; they cannot reach layout. The one
  exception is documented under *The one departure*.
- **No content is retyped.** The approved copy is already structured data in
  `design-src/highland/*.mjs`. The seed imports it.

## The constraint that shapes everything

The content master forbids specific claims, and the people editing the site
will not have read its 207 pages. Guidance in a field description is not
enforcement; a schema that cannot hold a forbidden claim is.

**Every prohibition in the master that can be expressed as a schema or
validation rule must be, rather than written as advice.** Where a rule cannot
be mechanised, it is stated in the field's `admin.description` and named as a
residual risk here.

## Content model

Conventions follow the existing code: `slugField`/`orderField` from
`src/fields/slug.ts`, the access helpers in `src/access/`, the revalidation
helpers in `src/hooks/revalidate.ts`, `versions: { drafts: true }`, and
`admin.description` written as plain-language guidance for the editor.

### Collections

★ marks a collection whose documents get their own URL.

| Collection | Rows | Route |
| --- | --- | --- |
| ★ `solutions` | 7 | `/solutions/<slug>` |
| ★ `services` | 6 | `/services/<slug>` |
| ★ `projects` | 8 | `/projects/<slug>` |
| ★ `news` | 3 | `/news/<slug>` |
| ★ `events` | 3 | `/events/<slug>` |
| ★ `jobs` | 2 | `/careers/jobs/<slug>` |
| `clients` | 10 | index only |
| `partners` | 32 | index only |
| `partnerCategories` | 10 | — |
| `posts` | 10 | index only, by design |
| `postCategories` | 10 | — |
| `downloads` | 4 | — |
| `academyTracks` | 6 | — |
| `media`, `users` | — | already exist |

Fields, taken from the approved content rather than invented:

- **`solutions`** — `order`, `slug`, `title`, `short`, `blurb`, `accent`,
  `headline`, `intro`, `experience`, `detail` (see *The one departure*),
  `outcomes[]`, `related[] → solutions`.
- **`services`** — `order`, `slug`, `title`, `short`, `blurb`, `accent`,
  `headline`, `intro`, `capabilities[{title, body}]`, `checklistTitle`,
  `checklist[]`, `modelsTitle`, `models[{title, body}]`, `fit`, `note`,
  `related[] → services`.
- **`projects`** — `slug`, `featured`, `client → clients`, `sector`,
  `sectorFull`, `location`, `year` (confirmable), `title`, `primary`,
  `summary`, `solutions[] → solutions`, `tech[]`, `need`, `scope`,
  `delivered[]`, `outcomes[]`, `technology[]`, `technologyNote`, `training`,
  `privacy`.
- **`clients`** — `name`, `logo → media`, `sector` (select: education,
  banking, government), `summary`,
  `engagements[] → projects`, `solutions[] → solutions`.
- **`partners`** — `name`, `logo → media`, `categories[] → partnerCategories`,
  `featured`, `capability`, `solution → solutions`, `projects[] → projects`.
  **No tier, authorization or certification field exists.**
- **`partnerCategories`** — `key`, `label`, `ringLabel`, `description`.
  `ringLabel` is the short form the partners diagram needs; it is presentation,
  not a second name.
- **`posts`** — `order`, `slug`, `title`, `category → postCategories`,
  `body` (rich text), `target → solutions`, `anchor`, `readMoreLabel`.
- **`news`** — `slug`, `title`, `kind`, `date` (confirmable), `archive`,
  `standfirst`, `body` (rich text).
- **`events`** — `slug`, `title`, `headline`, `intro`, `displayDate`,
  `startsOn`, `endsOn`, `category`, `format`, `venue`, `audience`,
  `program[]`, `action`, `pendingNote`. Status is **derived**, not stored: a
  stored status goes stale silently the morning after an event. It derives
  from `endsOn ?? startsOn`, because events can span days — GITEX runs 7–11
  December while Highland's single `iso` holds only the 7th, so deriving from
  a start date alone would mark a running event past. `displayDate` carries
  the human string ("7–11 December 2026") since it cannot be formatted back
  out of two dates reliably.
- **`downloads`** — `title`, `category`, `owner`, `meta`, `note`,
  `file → media`, `approved`.
- **`jobs`** — `slug`, `title`, `department`, `level`, `reports`, `type`,
  `status`, `location`, `deadline` (confirmable), `purposeTitle`, `purpose`,
  `scope`, `responsibilities[]`, `required[]`, `preferred[]`, `success`.
- **`academyTracks`** — `order`, `slug`, `title`, `body`, `solution → solutions`.
  The slug is a stable anchor id on the E-Academy page, not a URL; these tracks
  have no page of their own.

`posts` deliberately has no detail route. The master's instruction is explicit:
*"do not create thin article-detail pages containing the same short copy solely
to insert another click."* A post's Read More goes to its solution capability,
so no field implies otherwise.

Accent colour is a field on `solutions` and `services` rather than a lookup
table keyed by slug. A hue belongs to the thing it colours.

### Globals

Five, each using `tabs`. A naive mapping produces about fifteen singletons,
and fifteen sidebar entries is hostile to a non-technical editor.

- **Company** — profile (legal name, short name, domain, established,
  positioning), mission, vision, values (7), journey (10 milestones),
  differentiators (6), sustainability (5), industries (4), delivery (5),
  executive roles (5).
- **Contact** — office address, map URL, phones, WhatsApp, emails, emergency
  line, response time, opening hours, and the 7 inquiry categories with their
  routing addresses.
- **Site settings** — navigation, footer, impact counters, impact support line.
  Extends the existing global.
- **Careers** — pathways (6), culture (7), development (5), experience points
  (5), application documents, the internship programme (tracks, eligibility,
  structure, selection, documents, schedule), academy audiences, levels,
  delivery modes, and course-page sections.
- **Page copy** — per-page heroes and section intros for home, about,
  resources, clients and partners, plus the 6 resource-section descriptors.
  The home page's six technology priorities and the solutions overview's five
  are **different lists in the master** and are stored separately; collapsing
  them would put the wrong wording on one of the two pages.

Thirteen content collections, plus the existing `media` and `users`, and five
globals behind 51 routes. The route map sums to exactly 51; see *Routes*.

### The one departure

Solution detail pages genuinely vary in shape in the master. Most carry a flat
capability list; the datacenter family has two named bands; others have a
layered architecture or a numbered sequence.

Giving every solution every field and leaving most empty is worse for an
editor than the alternative: `solutions.detail` is a **typed section list** —
a Payload `blocks` field offering exactly `capabilities`, `bands`, `layers`,
`steps`, `checklist` and `models`.

This is not a page builder. The editor picks from six known section types,
cannot invent layout, and cannot style anything. It mirrors variation the
client's own content already has. Scope is contained to this one field on this
one collection.

## Guardrails

Four mechanisms, strongest first.

**1. Absence.** No field means unpublishable. Partner tier, authorization level
and certification tier do not exist in the schema.

**2. A shared phrase validator** — `src/fields/validators.ts`, attached to
every free-text and rich-text field, blocking on save with a message naming the
rule:

- `tier III certified` → the master allows *Tier III-aligned*, never *certified*
- `gold` / `platinum` / `elite` / `premier partner`
- `authorized reseller`, `certified partner`
- `100% secure`, `fully secure` — absolute security claims

The validator takes a shared base list plus per-collection additions.
"SOC" is **not** blanket-banned: it is legitimate on the cybersecurity
solution page, and the master's rule is specifically that Bahir Dar's campus
spaces are *security control rooms*. That rule therefore applies only to
`projects`. A guardrail that cries wolf gets switched off.

**3. Fields that cannot be half-filled.** The 100% impact counter is `figure`
plus a required `qualifier`, validated to contain "against agreed project
scope" whenever the figure is a percentage. `media` gains `source`,
`retrievedAt` and `reviewedBy`, all required before `approved` can be ticked.

**4. Approval gates on relationships.** Every `logo` relationship uses
`filterOptions: { approved: { equals: true } }`, so unapproved artwork cannot
be selected — not merely discouraged. This generalises the `verified` checkbox
already on `SiteSettings.contact`.

### The pending pattern

Highland renders a visible "pending from Edge" badge for facts Edge has not
confirmed. That is content state, so it belongs in the schema: a reusable
`confirmable()` field group returning `{ value, status, pendingLabel }`, used
for project years, internship dates, job deadlines and executive names. The
front end renders the badge from `status`, so confirming a fact clears the
badge with no code change.

### Residual risks the schema cannot catch

Stated in `admin.description` and accepted as human responsibility:

- Inventing statistics.
- Classifying CCTV, access control and barriers as cybersecurity rather than
  IT infrastructure.
- Publishing a client engagement the client has not consented to.

## Frontend

### Routes

Highland's flat filenames become nested routes: `solution-cybersecurity.html`
→ `/solutions/cybersecurity`. Twenty-six route files cover all 51 pages,
because six dynamic segments absorb the 32 factory-generated ones.

```
/                                     1
/solutions  /solutions/[slug]         1 + 7
/services   /services/[slug]          1 + 6
/projects   /projects/[slug]          1 + 8
/clients                              1
/partners                             1
/resources                            1
/news       /news/[slug]              1 + 3
/resources/media/[section]            3
/events     /events/[slug]            1 + 3
/downloads                            1
/subscribe                            1
/blog                                 1
/careers                              1
/careers/open-positions               1
/careers/internships                  1
/careers/e-academy                    1
/careers/jobs/[slug]                  2
/about                                1
/about/executive-management           1
/contact                              1
                                   = 51
```

### Rendering

Static by default: `generateStaticParams` on every dynamic route, revalidated
on publish through the existing `revalidatePath` hooks. Content changes rarely
and the audience is in Ethiopia, where latency is real — pre-rendered HTML is
worth more here than anywhere.

### Porting

Mostly mechanical. Highland's `ui.mjs` atoms (`pageHead`, `sectionHead`,
`closingCta`, `mark`, `pending`, `field`, `formNote`, `checkList`,
`numberedSteps`, `crumb`) become components in `src/components/`. Each page
module becomes a route component reading through `src/lib/content.ts`. No raw
Payload calls in components.

Three details are not mechanical:

- **Tailwind.** Highland uses the play CDN with a JS `tailwind.config`; this app
  is Tailwind v4, CSS-first. Highland's tokens (`ink`, `paper`, `gold`, `lamp`,
  `steel`, `rule`) move into `@theme` in `globals.css`.
- **Animation CSS.** The `eg-*` keyframes move into the real stylesheet,
  including the fix that animates the independent `translate`/`scale`/`rotate`
  properties instead of `transform`. Animating `transform` with `both` fill
  mode outranks any transform the element also carries, which silently killed
  every hover lift and broke the partners diagram's centring.
- **Scoping.** Highland's theme collides with the frontend's current theme, so
  the `/design/*` A–E explorations must have their styles scoped to their own
  layout or they will break.

Fonts go through `next/font/google` (Geologica, Atkinson Hyperlegible, Fragment
Mono), matching how `layout.tsx` already loads type.

## Media

Add `@payloadcms/storage-s3`, env-gated: with no S3 variables set, uploads go
to local disk for development; with them set, to any S3-compatible bucket. That
covers AWS, Cloudflare R2, Backblaze and MinIO, which is what keeping both
hosting options open actually requires.

`Media` keeps its existing image sizes and focal point, and gains the
provenance fields described under *Guardrails*.

## Forms

The master specifies six: contact, subscribe, event registration and academy
enquiry — all plain fields, which `@payloadcms/plugin-form-builder` already
handles and which the contact form already uses — plus job and internship
applications, which need a **CV upload** the plugin has no field for.

Plan: extend form-builder with one custom upload field block rather than run
two form systems. A single submissions inbox in the admin matters when the
person checking it is non-technical.

This is the spec's one unverified assumption, and Phase 0 spikes it. Fallback
if the plugin resists: typed route handlers for the two application forms only,
accepting two systems as the lesser cost.

Either way:

- Submissions persist in Payload **and** email out through an env-configured
  SMTP adapter. Not email alone: SMTP from Ethiopian hosting can be
  unreliable, and a job application lost to a bounced mail is worse than one
  sitting in an inbox nobody emailed about.
- Spam handling is a honeypot field plus rate limiting — deliberately not a
  Google captcha, which adds a third-party dependency and a blocked-in-country
  risk for no proportionate gain.
- Consent capture is a required checkbox per the master, stored with the
  submission.

## Seeding

The approved content is already structured data, so the seed imports
`design-src/highland/*.mjs` rather than retyping it. It needs a transform
layer, because Highland is denormalised where Payload is relational:
`PROJECTS[0].client` is the string `"Bahir Dar University"` and has to resolve
to a `clients` row.

So: dependency-ordered writes — `partnerCategories` → `partners`,
`clients` → `projects`, `solutions` → `services` → everything referencing
them — with a name-to-id map, reusing `src/seed/lexical.ts` for the
genuinely long-form fields.

Most Highland fields stay plain text and arrays. Only news bodies, blog posts
and solution overviews become Lexical rich text. Forcing rich text everywhere
would be worse for editors and would risk reflowing copy the client has signed
off.

**The seed's contract changes.** The existing script is explicitly *"a reset
rather than an append"* — it clears collections before writing. That is safe
today and destructive the moment Edge has edited anything. New behaviour:
upsert by slug by default, with `--fresh` as an explicit opt-in wipe.

## Verification

We have 51 known-good pages, so the port gets a **parity check**: render each
Next route, extract its visible text, and diff against the corresponding
Highland page. Any difference that is not an intentional URL change is a
porting bug.

Alongside it:

- `tools/check-links.mjs` and `tools/check-render.mjs` point at the Next build
  output, keeping links, cross-page fragments, images, nav order and overflow
  at 390/768/940/1024/1440 covered.
- The validators are pure functions and get unit tests. This requires adding
  **vitest**; the project has no test runner.
- Seed verification asserts row counts: 7 solutions, 6 services, 8 projects,
  10 clients, 32 partners, 10 partner categories, 10 posts, 10 post
  categories, 3 news, 3 events, 4 downloads, 2 jobs, 6 academy tracks.

## Highland's fate

`design-src/highland` stays through the port. It is both the reference
implementation and the client's live review site; deleting it mid-port throws
away the ability to diff. After the Payload site is signed off, the generator
can retire while the content modules remain as the record of what came from the
master.

Nothing in `design-src/` or `design-files/` is deleted by this work.

## Phases

Each ends in something checkable, and nothing later is required to verify
anything earlier.

| # | Phase | Done when |
| --- | --- | --- |
| 0 | Foundations — spike the form-builder upload field; add vitest and storage-s3; port the Tailwind theme, animation CSS and fonts; write the shared validators | Validator tests pass; Highland's look renders in the Next app; the spike has an answer |
| 1 | Content model — 14 collections, 5 globals, guardrails, `confirmable()` | Admin loads; forbidden phrases rejected on save; types generated |
| 2 | Seed — transform layer, dependency-ordered upsert, `--fresh` flag | Row counts match; no dangling relationships |
| 3 | Data layer and chrome — extend `src/lib/content.ts`; port header, footer, layout | Footer shows the real contact facts, read from the CMS |
| 4 | Static pages — home, about, executive management, contact, clients, partners, resources, downloads, subscribe, blog, careers ×4 | Parity check passes per page |
| 5 | Dynamic routes — solutions, services, projects, news, events, jobs, media sections, and their indexes | Parity across all 51; link and render checks pass |
| 6 | Forms — six forms, submissions collection, SMTP, honeypot, rate limiting | Each form submits, persists and emails; required fields enforced |
| 7 | Editorial workflow — draft preview via Next draft mode, autosave, role gating | An editor can draft, preview and publish; an editor cannot edit Contact |
| 8 | Deploy readiness — host decision, storage env, migrations, backups | The checks pass against the deployed URL |

Phases 4 and 5 are the bulk of the work and are internally parallel: each page
is independent once Phase 3 lands.

This spec is too large for one implementation plan. Phases 0–3 plan together as
the foundation; Phases 4 and 5 each warrant their own plan given their page
count; Phases 6–8 plan together. Each plan is written when its predecessor has
landed, so later plans can account for what the earlier ones actually found.

## Out of scope

- **The Highland generator.** Not modified, not deleted.
- **Privacy, Terms and Cookie pages.** The master outlines them; Edge has not
  supplied the text. Three routes to add when it arrives.
- **Amharic or any second language.** The master is English throughout.
- **Re-skinning to the master's brand palette.** See *Open items*.
- **The A–E typography explorations.** Uncommitted work in
  `src/app/(frontend)/design/`, unrelated to this port beyond needing its
  styles scoped.

## Open items

- **Highland's look departs from the master's stated brand.** The master
  specifies `#1787C6`, `#10C7FF`, `#003D6B`, `#565656` on white with Rajdhani
  type; Highland uses tinted paper `#eef6f4`, `#0888c5`, and Geologica. The
  client has approved Highland through iteration, so this port keeps it — but
  the conflict is his to settle, and it should be put to him explicitly rather
  than left to surface after launch.
- **Hosting is undecided.** The design stays portable, but Phase 8 cannot
  complete until Edge chooses, because the decision determines media storage,
  Postgres hosting and backup responsibility.
- **Content still owed by Edge**, all currently rendered as visible pending
  markers: five executive names, biographies and portraits; 29 of 32 partner
  marks and 9 of 10 client marks; project photography; documentary,
  press-release and media-coverage items; download approvals; internship intake
  dates; and the Bahir Dar CCTV completion year.
- **The form-builder upload field is resolved.** `formBuilderPlugin`
  accepts a custom block in its `fields` map at runtime (unknown keys are
  returned as the block verbatim), but its `FieldConfig` type is
  `Partial<Field>` and rejects a block's `slug`, so a hand-rolled block fails
  `tsc`. That is moot: `@payloadcms/plugin-form-builder` 3.88.0 ships a
  built-in `upload` field (`fields: { upload: true }` plus
  `uploadCollections: ["media"]`, which type-checks), whose submission hook
  stores the files as `media` documents. Phase 6 therefore uses one form
  system, extended with the built-in upload field. Checked by reading the
  plugin source and types and by `tsc`; the admin block picker and a real
  multipart submission were not exercised. Phase 6 should confirm both, and
  that CV uploads into `media` are not publicly readable.
