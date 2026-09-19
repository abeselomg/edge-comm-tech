# Highland: the remaining pages

Edge Communication Technologies chose the Highland microwave treatment. The
homepage exists and is approved. This spec covers the other twelve pages, plus
the one page the approved header already implies but nobody has built.

## Decisions already taken

Settled in conversation on 2026-09-19, recorded here so they are not relitigated:

- **Content comes from the reference sites' structure, written in Edge's voice.**
  The client asked for this explicitly. It means taking the anatomy of a page
  — what a project entry carries, what meta a course shows, how a job posting
  is laid out — from ienetworksolutions.com and keneraint.com, and writing
  Edge-appropriate entries at that same depth. It does not mean transplanting
  their named engagements.
- **Thirteen new pages**, not twelve. The client agreed seven top-level
  pages plus one detail template each, which is twelve; Contact makes
  thirteen. With the existing homepage the generator emits **fourteen
  files**. See *The extra page* below.
- **Generated from one source**, not hand-authored. See *Architecture*.
- **No per-card "sample" stamps.** The client declined that option. The
  existing `▪` marker stays on numeric placeholders only, and the record of
  what is drafted versus verified lives on the review index instead.

## The constraint that shapes everything

> "make sure each page has a non redundant design"

This client has rejected work for this before, in these words: *"some kind of
the structure is the same. the text placements are the same, the background is
the same and the flow is the same."* Three typefaces over one layout is not
three designs, and fourteen pages over one layout is not fourteen pages.

So this spec fixes a **distinct organising principle per page** before any
markup is written, and a hard rule:

**No two pages may share a hero pattern, and no primary content structure may
appear on more than one page.** A page whose body is "mono eyebrow, display
h2, three-column card grid" is allowed to exist exactly once — the homepage
already spent it. The test is verification step 7, not judgement: at thumbnail
size, no two of the fourteen may read as the same page.

What holds the fourteen together is not layout — it is the shared DNA below.

### Shared DNA (never varies)

| | |
|---|---|
| Paper | `#eef6f4`, cards `#ffffff` |
| Ink | `#1c2430`, secondary `#2a3544` |
| Blue | `#0888c5`, deep `#056a9a`, rules `#0888c530` |
| Lamp | `#c48a5a` — accent only, never structural |
| Steel | `#5c6b76` — meta text |
| Display | Geologica, 700, `-0.03em` |
| Body | Atkinson Hyperlegible |
| Mono | Fragment Mono, uppercase, `0.28em` tracking — eyebrows and meta |
| Radii | `rounded-full` for chips and buttons, `rounded-2xl`/`3xl` for cards |

### Motifs, and where each is allowed

The homepage owns the **sun disk** and the **horizon line**. Reusing them on
every page is precisely the redundancy being guarded against, so each is
rationed:

- **Sun disk** — homepage only.
- **Horizon** — homepage, and rotated to vertical as the About spine.
- **Dashed hop line** — homepage method, and the Academy curriculum.
- **Left-border card** (`border-l-4`) — homepage services, and nowhere else.

New motifs introduced below are similarly single-use unless stated.

## The extra page

The approved header carries a **Contact us** button on every page, pointing at
`#contact`. That anchor exists only on the homepage. On the other twelve it
would scroll nowhere. Contact therefore becomes a real page and the button
points at it site-wide.

## The fourteen pages

Each entry gives the organising principle, the hero treatment, and what makes
it structurally unlike its neighbours.

### 1. Home — `index.html`

Already approved; unchanged except that its links now resolve. Establishes:
asymmetric hero with an offset card, a divided stat strip, pill chips, the
dashed hop path, a three-column left-bordered service grid.

### 2. About — `about.html`

**Principle: a vertical spine.** The horizon line stands up and runs down the
page; the company's story hangs off it in alternating left and right bays.
Nothing on this page is a card grid.

- **Hero**: full-bleed ink panel, reversed out — the only dark hero on the
  site, which also gives the nav a moment of contrast.
- **Body**: the spine, with Advise / Implement / Manage as stations, then the
  four engineering disciplines as spurs.
- **Executive management**: a portrait row, name and role only. Drafted; see
  *Content* below.
- **Close**: the five client institutions as a plain rule-separated list, not
  the homepage's chips.

### 3. Partners — `partners.html`

**Principle: a coverage matrix.** Partners down the side, capability areas
across the top, a mark where a partner covers an area. This answers the
question a buyer actually has — *who do you use for what* — and is a structure
used nowhere else on the site.

- **Hero**: compact, a single rule and the eight marks in a row.
- **Matrix**: eight rows × five areas (networking, security, compute and
  storage, power and cooling, racks and cabling).
- **Category filter**: the same five areas as pills, dimming non-matching rows.
- **Close**: three short statements on how a platform gets chosen.

The dark direction's radial hub is deliberately not reused — the matrix says
the same thing with more precision and keeps the two directions distinct.

### 4. Solutions — `solutions.html`

**Principle: index and detail in one view.** A sticky numbered rail on the
left listing all nine services; the right column scrolls through them. The
reader always knows where they are in a list of nine.

- **Hero**: a title block only, no artwork — the rail is the visual interest.
- Each of the nine gets a number, a one-line definition, the acronyms it
  involves, and a link to its page.
- **Sector categorisation**: a secondary grouping toggle (by service / by
  sector), satisfying the requirements document without a second page.

### 5. Solution detail — `solution-datacenter.html`

**Principle: a datasheet.** Full-width title block, then a narrow reading
column with a specifications sidebar pinned beside it.

- **Hero**: title block with a rule and mono metadata (service number, the
  partners involved, related sectors).
- **Left**: overview, scope of work, deliverables — prose.
- **Right sidebar**: capabilities with each acronym expanded and given a value
  line (HCI, NAC, rPDU, Tier III, N+1, PUE), partner logos, related projects.

One worked example is built. The other eight are the same template.

### 6. Projects — `projects.html`

**Principle: a register, not a gallery.** One project per full-width row on a
rule — client, scope, sector, year — the way an integrator's completed-works
schedule actually reads. Cards would make this the third card grid on the site.

- **Hero**: the filter bar is the hero. Sector filters across the top under a
  single line of type.
- **Rows**: hovering a row reveals the technologies used.
- Built around Edge's five real client institutions. See *Content*.

### 7. Project detail — `project-bonga.html`

**Principle: a case record.** Image band, then a facts table beside a
narrative — the two-column split is fact/story, not index/detail.

- **Hero**: full-bleed image slot with the client name reversed out.
- **Facts**: client, sector, year, services, technologies, outcome.
- **Narrative**: what was there before, what was built, what it changed.

### 8. Academy — `academy.html`

**Principle: a catalogue with meta.** Dense two-column list where each course
shows duration, level and lesson count in a mono meta row — the information a
prospective student sorts on. Kenera's course meta row is the model.

- **Hero**: a count and a filter by service line.
- The dashed hop line returns here, running through the course list as a
  learning path.

### 9. Course detail — `course-soc.html`

**Principle: a curriculum.** Modules as an accordion expanding to lessons,
with a sticky enrolment card.

- **Hero**: course title, meta row, and the enrolment card already visible.
- **Body**: outcomes, then the module/lesson tree.
- **Registration**: form fields, no submission — this is a design.

### 10. Career — `career.html`

**Principle: an asymmetric split.** Why work at Edge on the left as narrative,
open positions on the right as a list. Neither column is a grid.

- **Hero**: reversed-out band, quieter than About's.
- **Internships**: a distinct block below, since the requirements document
  calls them out separately.

### 11. Job detail — `job-network-engineer.html`

**Principle: a posting.** Title block with meta chips, requirements as a
list, a sticky apply card carrying the CV upload.

- Follows Kenera's job anatomy: summary, qualification and experience,
  location, salary, how to apply, deadline.

### 12. Blog — `blog.html`

**Principle: editorial hierarchy.** One lead post at large size, the rest in a
compact dated list, categories and tags in a rail. Explicitly not a grid of
equal cards.

### 13. Blog post — `blog-post.html`

**Principle: an article.** Narrow measure, author and date, pull quotes,
related posts at the foot.

### 14. Contact — `contact.html`

**Principle: form beside facts.** The enquiry form on one side, the real
office details and a map slot on the other.

## Content

### Verified — use freely

Nine services, eight manufacturer partners, five client institutions, the Bole
office address, both phone numbers, three email addresses, `edgecomm-tech.com`.

### Drafted — written for this design, not supplied by Edge

Projects, courses, job postings, blog posts, executive profiles.

**Projects** are built from Edge's five real clients crossed with Edge's nine
real services, which yields plausible engagements without borrowing anyone's.
One caution recorded from the research: IE Networks list *Datacenter Facility
and HCI – Yekatit 12 Hospital and Medical College* among their own projects,
and Yekatit 12 is also on Edge's client list. Edge's Yekatit 12 entry must
describe different work, or the two sites will contradict each other in front
of a client who may know both.

**Courses** map onto Edge's service lines. Kenera run ten, most corresponding
to something Edge actually does — SOC fundamentals, firewall administration,
enterprise wireless, backup and disaster recovery. Note that
`design-src/content.json` already contains four courses, but they were written
against the NEXT IT-derived six-domain model and need re-aligning before use.

### Do not use

`design-src/content.json` as a whole. Its six solutions, four sectors and
twenty-six partners (Hikvision, HPE, Rittal, Microsoft, Eaton, Schneider…) are
the NEXT IT-derived model from before the client's first correction. Edge's
real material is nine services, eight partners, five clients. Reusing that file
wholesale would quietly reintroduce the borrowed content the client rejected.

### Placeholders

The `▪` marker stays on figures Edge has not published: years operating,
engineers on staff, projects delivered. It is not applied to drafted prose.

## Architecture

```
design-src/highland/
  gen.mjs        shell, header, footer, nav, page assembly
  content.mjs    all content as data, separate so data is obviously data
  pages/         one module per page, exporting its body
design-files/highland/
  index.html     and the other thirteen
```

`node design-src/highland/gen.mjs design-files/highland` emits every page.

- **Tailwind play CDN and the existing config block carry over unchanged.**
  The approved palette and type must survive exactly; porting to hand-written
  CSS would risk the look for no benefit at this stage.
- **The shell is defined once.** Header, nav and footer live in `gen.mjs`.
  Changing a nav item is one edit and rebuilds all fourteen.
- **Each page body is its own module.** Thirteen bodies in one file would be
  unreadable and unreliable to edit; one module per page keeps each small
  enough to hold in view whole.
- **`landings/highland-microwave.html` becomes a redirect** to
  `../highland/`, so the URL already given to the client keeps working.

## Verification

Before this is called done:

1. `node design-src/highland/gen.mjs design-files/highland` emits fourteen
   files with no errors.
2. Every internal link resolves — no `href` pointing at a file that does not
   exist, checked by script across all fourteen.
3. No page has horizontal overflow at 390px, 768px, 940px or 1440px.
4. The header renders on every page with all seven items, the current page
   marked, and the mobile menu opening.
5. Tailwind compiles on every page — verified by a computed `max-width` on a
   `max-w-6xl` element, not by eye.
6. Every `Contact us` button resolves to `contact.html`.
7. **The redundancy check**: screenshots of all fourteen laid on one contact
   sheet. If two pages read as the same page at thumbnail size, the spec has
   failed regardless of what the markup says.
8. Published to GitHub Pages, and the live URLs verified, not just the local
   files.

## Out of scope

Real photography, working forms, the Payload CMS wiring, Amharic. The content
tables are shaped so the CMS can consume them later, but that is separate work.
