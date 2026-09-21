# Design sources

Generators for the standalone review pages. Nothing in here is published —
`design-src/` builds into `design-files/`, and only `design-files/` is served.

Live at **https://abeselomg.github.io/edge-comm-tech/**

## Current direction

Three pages, generated together from `span/gen-span.mjs`:

| | Page | File |
|---|---|---|
| 01 | Homepage | `07-span-style.html` |
| 02 | About us | `08-span-about.html` |
| 03 | Partners | `09-span-partners.html` |

```bash
node design-src/span/gen-span.mjs design-files
```

One command rewrites all three. They share a stylesheet, a nav and a footer,
so editing the shell in `gen-span.mjs` changes every page at once — never edit
the generated HTML directly, it will be overwritten on the next build.

Supporting modules:

- `span/objects3d.mjs` — the isometric objects drifting behind the home and
  about heroes. True 2:1 projection: a square footprint of half-diagonal `a`
  projects to a diamond `2a` wide and `a` tall.
- `span/netviz.mjs` — the animated mesh on the partners hero. The node layout
  comes from a seeded generator, not `Math.random`, so every build produces
  the same mesh.
- `span/logos/` — Edge's real logo files, embedded as base64 at build time.
  This is why the generated pages are 280–560KB and need no asset hosting.

## Alternative looks

`design-files/landings/` holds two single-page treatments of the same content in
different visual languages, plus their own index:

| File | Look | Status |
|---|---|---|
| `design-files/highland/` | Warm off-white paper, sun disk over a horizon, hops on a dashed path. Geologica. | **Chosen. Now a fourteen-page site — see below.** |
| `landings/cyanotype-print.html` | Blueprint blue, drawing grid, boxed title-block cells, bleach yellow. Chakra Petch. | Not taken forward; hand-authored |

`landings/cyanotype-print.html` is hand-authored and edited in place. Both looks pull
Tailwind and their fonts at runtime, so unlike the pages above they need a network
connection.

## The Highland site

The chosen direction, generated from `design-src/highland/` into
`design-files/highland/`. **Never hand-edit `design-files/highland/` — it is
overwritten on every build.**

```bash
npm run highland        # emit all fourteen pages
npm run check:links     # links resolve, nav intact, no dead fragments, robots tags
npm run check:render    # overflow at 4 widths, Tailwind compiled, contact sheet
node tools/check-home-unchanged.mjs   # the approved homepage is still byte-identical
```

- `gen.mjs` — the shell (head, header, nav, footer) and the page registry. Adding a
  page is one registry line plus one module.
- `content.mjs` — all content as data. The block above the `drafted` divider is
  verified Edge material; below it is written for the design and needs replacing
  before launch.
- `pages/*.mjs` — one module per page, each exporting `{ title, desc, body }`.
- `shell-parts.json` — the approved landing page's head, styles, main and footer,
  lifted verbatim. This is now the authoritative copy: the original file at
  `design-files/landings/highland-microwave.html` is a redirect.

`check-render.mjs` writes `shots-highland/sheet.html`, a contact sheet of all fourteen
pages as thumbnails. That sheet is the test for the one design requirement the client
stated — that no page be redundant. It cannot be asserted from markup, so it is judged
by eye against that sheet.

## Earlier directions

Six homepage treatments explored before the current one. **No longer published** —
the review site shows the current direction only. The generators are kept so any
of them can be rebuilt into `design-files/` if a comparison is ever wanted:

```bash
node design-src/build.mjs design-files
```

| | Direction | Idea | Typeface |
|---|---|---|---|
| 01 | Split | Fixed left half holds identity and proof; right half scrolls the catalogue | Manrope |
| 02 | Console | Dashboard grid of tiles rather than stacked sections | IBM Plex Sans / Mono |
| 03 | Document | Capability statement issued like a drawing set. The one light direction | Newsreader / Inter |
| 04 | Poster | Near-black and sparse, one domain per full-height frame | Archivo |
| 05 | Topology | The homepage is a capability diagram | Space Grotesk |
| 06 | Stack | Organised by layer of infrastructure, read bottom-up | Chivo |

## Publishing

The review site is GitHub Pages, served from the `gh-pages` branch, whose root
is the contents of `design-files/`. To publish a change:

```bash
node design-src/span/gen-span.mjs design-files
git add design-files && git commit -m "..."
git push
git subtree push --prefix design-files origin gh-pages
```

The last line is what actually updates the live site; a plain `git push` only
updates the source branch. The build takes about half a minute after the push.

## Before showing these to Edge

Figures marked with a small square (`▪`) are **placeholders**. No founding
year, headcount or project count has been invented — those need real numbers
from Edge before anything ships. Partner and client counts are real and
countable.

Still outstanding from Edge:

- The full service list. The nine services shown come from the current site,
  and Edge has said the business is broader.
- Whether LinkedIn and X accounts exist. The footer icons point at `#`.
- Whether the "we hire engineers" line on the about page is true.
- Partner category assignments on the partners page, in particular whether
  HP should be HPE, and whether Huawei should also carry compute and storage.
