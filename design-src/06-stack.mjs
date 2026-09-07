import { content as C, esc, num, page, ph, phNote, PLACEHOLDER as P, FONTS } from "./lib.mjs";

/*
 * 06 — Stack.
 * The page is organised by layer of infrastructure rather than by marketing
 * section: facility at the base, services at the top, read bottom-up the way
 * an engineer would describe a build. Each stratum opens on hover/focus to
 * show its capabilities. A depth gutter runs down the left.
 */

const css = `
:root{
  --void:#04070d; --ink:#070c16; --strata:#0b1220; --strata-2:#101a2c;
  --line:rgba(228,236,250,.11); --text:#e9eff9; --muted:#8695b2; --accent:#5b8cff;
}
body{background:var(--ink);color:var(--text);
font:400 16px/1.62 Chivo,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.mono{font-family:"IBM Plex Mono",ui-monospace,monospace}
.wrap{max-width:1240px;margin:0 auto;padding:0 1.25rem}
@media (min-width:900px){.wrap{padding:0 2rem}}

.top{display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:1.4rem 0}
.mark{font-weight:900;letter-spacing:-.03em;font-size:1.0625rem}
.mark span{font-weight:400;color:var(--muted)}
.top nav{display:none;gap:1.35rem;font-size:.9375rem}
@media (min-width:900px){.top nav{display:flex}}
.top nav a{color:var(--muted);text-decoration:none}
.top nav a:hover{color:var(--accent)}

.lede{padding:2.5rem 0 3rem;max-width:60ch}
.lede h1{font-weight:900;letter-spacing:-.04em;line-height:1.02;font-size:clamp(2.2rem,4.6vw,3.6rem)}
.lede p{margin-top:1.25rem;color:var(--muted);font-size:1.0625rem}
.acts{margin-top:1.75rem;display:flex;flex-wrap:wrap;gap:.6rem}
.btn{display:inline-flex;padding:.85rem 1.4rem;border-radius:6px;text-decoration:none;
font-weight:700;font-size:.9375rem}
.btn-a{background:var(--accent);color:#04101f}
.btn-b{border:1px solid var(--line);color:var(--text)}

/* the stack ----------------------------------------------------------- */
.stackhead{display:flex;flex-wrap:wrap;gap:.5rem 1.5rem;justify-content:space-between;
align-items:baseline;padding-bottom:.9rem;border-bottom:1px solid var(--line)}
.stackhead h2{font-weight:900;letter-spacing:-.03em;font-size:clamp(1.4rem,2.1vw,1.85rem)}
.stackhead span{color:var(--muted);font-size:.8125rem}

.stack{margin-top:1.25rem;display:grid;grid-template-columns:3.25rem 1fr;gap:0}
.depth{position:relative;border-right:1px solid var(--line)}
.depth::after{content:"";position:absolute;left:50%;top:.5rem;bottom:.5rem;width:1px;
background:linear-gradient(var(--accent),rgba(91,140,255,.15))}
.layers{display:grid;gap:.5rem;padding:.25rem 0 .25rem 1.1rem}

.layer{position:relative;border:1px solid var(--line);border-radius:10px;background:var(--strata);
padding:1.2rem 1.25rem;transition:border-color .16s,background .16s,transform .16s}
.layer::before{content:"";position:absolute;left:-1.1rem;top:1.75rem;width:1.1rem;height:1px;background:var(--line)}
.layer:hover,.layer:focus-within{border-color:var(--accent);background:var(--strata-2);transform:translateX(2px)}
.layer-h{display:flex;flex-wrap:wrap;gap:.35rem 1rem;align-items:baseline;justify-content:space-between}
.layer-t{display:flex;gap:.8rem;align-items:baseline;min-width:0}
.layer-n{font-family:"IBM Plex Mono",monospace;font-size:.75rem;color:var(--accent);flex:none}
.layer-name{font-weight:700;letter-spacing:-.02em;font-size:1.125rem}
.layer-tag{font-family:"IBM Plex Mono",monospace;font-size:.6875rem;color:var(--muted);
border:1px solid var(--line);border-radius:99px;padding:.15rem .55rem;flex:none}
.layer p{margin-top:.55rem;color:var(--muted);font-size:.9375rem;max-width:70ch}
.caps{margin-top:.85rem;display:flex;flex-wrap:wrap;gap:.3rem}
.caps span{font-family:"IBM Plex Mono",monospace;font-size:.6875rem;color:var(--muted);
background:rgba(91,140,255,.14);border-radius:3px;padding:.15rem .45rem}

/* remaining sections -------------------------------------------------- */
.band{padding:4.5rem 0;border-top:1px solid var(--line);margin-top:4rem}
.band h2{font-weight:900;letter-spacing:-.03em;font-size:clamp(1.4rem,2.1vw,1.85rem)}
.cols{margin-top:1.75rem;display:grid;gap:1.5rem 2.5rem}
@media (min-width:700px){.cols{grid-template-columns:1fr 1fr}}
@media (min-width:1040px){.cols.four{grid-template-columns:repeat(4,1fr)}}
.cols b{display:block;font-weight:700;letter-spacing:-.015em}
.cols .n{font-family:"IBM Plex Mono",monospace;font-size:.75rem;color:var(--accent)}
.cols span{display:block;margin-top:.35rem;color:var(--muted);font-size:.9375rem}

.proof{display:flex;flex-wrap:wrap;gap:2rem 3.5rem;margin-top:1.75rem}
.proof dd{margin:0;font-weight:900;letter-spacing:-.035em;font-size:2.3rem}
.proof dt{margin-top:.25rem;color:var(--muted);font-size:.875rem}

.end{margin-top:4rem;border-top:1px solid var(--line);padding:3.5rem 0 8rem}
.end h2{max-width:22ch}
.end p{margin-top:.8rem;color:var(--muted)}
.end .contact{margin-top:1.5rem;display:flex;flex-wrap:wrap;gap:.5rem 2rem;color:var(--muted);font-size:.9375rem}
.end .ph-note{margin-top:2rem;color:var(--muted);max-width:62ch}
`;

/* Which layer of the stack each domain actually sits at, base upward. */
const LAYERS = [
  { slug: "professional-services", tag: "Services" },
  { slug: "business-applications", tag: "Applications" },
  { slug: "cybersecurity-digital-resilience", tag: "Security" },
  { slug: "compute-cloud-data", tag: "Compute" },
  { slug: "enterprise-network-connectivity", tag: "Network" },
  { slug: "data-center-critical-systems", tag: "Facility" },
];

export default function build() {
  const layers = LAYERS.map((l, i) => {
    const d = C.solutions.find((s) => s.slug === l.slug);
    const idx = C.solutions.indexOf(d);
    return `<a class="layer" href="#">
<span class="layer-h">
  <span class="layer-t"><span class="layer-n">${num(idx + 1)}</span><span class="layer-name">${esc(d.title)}</span></span>
  <span class="layer-tag">${esc(l.tag)}</span>
</span>
<p>${esc(d.summary)}</p>
<span class="caps">${d.capabilities
      .slice(0, 9)
      .map((c) => `<span>${esc(c.acronym || c.name)}</span>`)
      .join("")}</span>
</a>`;
  }).join("");

  const steps = C.home.method
    .map(
      (m, i) =>
        `<div><span class="n">${num(i + 1)}</span><b>${esc(m.title)}</b><span>${esc(m.body)}</span></div>`,
    )
    .join("");

  const sectors = C.sectors
    .map((s) => `<div><b>${esc(s.title)}</b><span>${esc(s.line)}</span></div>`)
    .join("");

  const courses = C.courses
    .map(
      (c) =>
        `<div><b>${esc(c.title)}</b><span>${c.lessons} lessons, free, no account</span></div>`,
    )
    .join("");

  const nav = ["Solutions", "Sectors", "Partners", "E-Academy", "Company", "Contact"]
    .map((n) => `<a href="#">${n}</a>`)
    .join("");

  const body = `
<div class="wrap">
  <header class="top">
    <p class="mark">Edge<span> COMM-TECH</span></p>
    <nav>${nav}</nav>
  </header>

  <section class="lede">
    <h1>${esc(C.home.tagline)}</h1>
    <p>${esc(C.home.heroStatement)}</p>
    <div class="acts">
      <a class="btn btn-a" href="#">Explore solutions</a>
      <a class="btn btn-b" href="#">Talk to an expert</a>
    </div>
  </section>

  <section>
    <div class="stackhead">
      <h2>${esc(C.home.solutionsIntro)}</h2>
      <span>Read from the bottom up, the way a build is delivered</span>
    </div>
    <div class="stack">
      <div class="depth" aria-hidden="true"></div>
      <div class="layers">${layers}</div>
    </div>
  </section>

  <section class="band">
    <h2>${esc(C.home.methodTitle)}</h2>
    <div class="cols four">${steps}</div>
  </section>

  <section class="band">
    <h2>${esc(C.home.sectorsIntro)}</h2>
    <div class="cols">${sectors}</div>
  </section>

  <section class="band">
    <h2>We teach the work, not just sell it</h2>
    <div class="cols">${courses}</div>
  </section>

  <section class="band">
    <h2>Track record</h2>
    <dl class="proof">
      <div><dd>${ph(P.years)}</dd><dt>Years operating</dt></div>
      <div><dd>${ph(P.engineers)}</dd><dt>Engineers on staff</dt></div>
      <div><dd>${ph(P.projects)}</dd><dt>Projects delivered</dt></div>
      <div><dd>${ph(P.clients)}</dd><dt>Clients served</dt></div>
    </dl>
  </section>

  <footer class="end">
    <h2>Tell us what you need to stand up, replace, or secure</h2>
    <p>An engineer replies, not a sales queue.</p>
    <div class="acts"><a class="btn btn-a" href="#">Start a conversation</a></div>
    <div class="contact"><span>${ph(P.phone)}</span><span>${ph(P.email)}</span><span>${ph(P.address)}</span></div>
    ${phNote()}
  </footer>
</div>`;

  return page({ id: "06", title: "Stack", font: FONTS.chivo, css, body });
}
