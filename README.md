# Six homepage directions

Standalone mockups for Edge Communication Technologies. Open `index.html` —
no server, no build, no dependencies. Every page has a switcher fixed to the
bottom of the screen for flipping between all six.

| | Direction | Idea | Typeface |
|---|---|---|---|
| 01 | Split | Fixed left half holds identity and proof; right half scrolls the catalogue | Manrope |
| 02 | Console | Dashboard grid of tiles rather than stacked sections | IBM Plex Sans / Mono |
| 03 | Document | Capability statement issued like a drawing set. The one light direction | Newsreader / Inter |
| 04 | Poster | Near-black and sparse, one domain per full-height frame | Archivo |
| 05 | Topology | The homepage is a capability diagram | Space Grotesk |
| 06 | Stack | Organised by layer of infrastructure, read bottom-up | Chivo |

All six share one blue-black palette family, each with its own accent. The
content is Edge's real copy, exported from the CMS.

## Before showing these

- **Figures marked with a small square are placeholders.** Years operating,
  headcount, project counts and every contact detail are invented to hold the
  layout. Nothing marked that way should be quoted.
- **The headline is a stand-in.** "Designed, commissioned, supported." was
  written to fill the space and is the largest text on every page. It needs
  Edge's own line.

## Regenerating

```bash
node design-files/_src/build.mjs design-files
```

`_src/content.json` is a snapshot of the CMS content. To refresh it, re-export
from the seed data in `src/seed/data/`. Editing a direction means editing its
file in `_src/` and re-running the build; the HTML is generated, not hand-kept.
