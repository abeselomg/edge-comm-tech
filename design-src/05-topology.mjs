import { content as C, esc, num, page, ph, phNote, PLACEHOLDER as P, FONTS } from "./lib.mjs";

/*
 * 05 — Topology.
 * The homepage is a diagram. A core with six domain nodes and the sectors
 * as edge endpoints, drawn to scale in SVG, with the written content
 * hanging off it. Closest to how an integrator actually explains itself
 * on a whiteboard.
 */

const W = 1200;
const H = 760;
const CX = W / 2;
const CY = H / 2;

function nodes(count, radius, rotate = -Math.PI / 2) {
  return Array.from({ length: count }, (_, i) => {
    const t = (i / count) * Math.PI * 2 + rotate;
    return { x: CX + radius * Math.cos(t), y: CY + radius * Math.sin(t), t };
  });
}

const css = `
:root{
  --void:#050a13; --ink:#080e1a; --surface:#0d1626; --line:rgba(226,236,250,.12);
  --text:#e8eefa; --muted:#8496b4; --accent:#4da3ff; --accent-dim:rgba(77,163,255,.18);
}
body{background:var(--ink);color:var(--text);
font:400 16px/1.62 "Space Grotesk",system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.mono{font-family:"IBM Plex Mono",ui-monospace,monospace}
.wrap{max-width:1280px;margin:0 auto;padding:0 1.5rem}

.top{display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:1.4rem 0;
border-bottom:1px solid var(--line)}
.mark{font-weight:700;letter-spacing:-.02em;font-size:1.0625rem}
.mark span{font-weight:400;color:var(--muted)}
.top nav{display:none;gap:1.4rem;font-size:.9375rem}
@media (min-width:900px){.top nav{display:flex}}
.top nav a{color:var(--muted);text-decoration:none}
.top nav a:hover{color:var(--accent)}

.intro{padding:3.5rem 0 1rem;display:grid;gap:1.75rem}
@media (min-width:900px){.intro{grid-template-columns:1.15fr 1fr;gap:4rem;align-items:end}}
.intro h1{font-weight:700;letter-spacing:-.035em;line-height:1.03;font-size:clamp(2.2rem,4.4vw,3.6rem)}
.intro p{color:var(--muted);max-width:46ch}
.acts{margin-top:1.5rem;display:flex;flex-wrap:wrap;gap:.6rem}
.btn{display:inline-flex;padding:.85rem 1.4rem;border-radius:6px;text-decoration:none;
font-weight:500;font-size:.9375rem}
.btn-a{background:var(--accent);color:#04121f}
.btn-b{border:1px solid var(--line);color:var(--text)}

/* diagram ------------------------------------------------------------- */
.map{margin:2.5rem 0 0;border:1px solid var(--line);border-radius:12px;background:
radial-gradient(120% 90% at 50% 45%,#0e1a2c 0%,#080e1a 70%);overflow:hidden}
.map svg{display:block;width:100%;height:auto}
.map figcaption{display:flex;flex-wrap:wrap;gap:.5rem 1.5rem;justify-content:space-between;
padding:.85rem 1.1rem;border-top:1px solid var(--line);color:var(--muted);font-size:.75rem}
.n-core{fill:var(--accent)}
.n-dom{fill:#0d1626;stroke:var(--accent);stroke-width:1.5}
.n-sec{fill:#0d1626;stroke:rgba(226,236,250,.3);stroke-width:1}
.lbl{fill:#e8eefa;font-size:15px;font-weight:500;font-family:"Space Grotesk",sans-serif}
.lbl-s{fill:#8496b4;font-size:12.5px;font-family:"IBM Plex Mono",monospace}
.edge{stroke:var(--accent);stroke-width:1;opacity:.35}
.edge-2{stroke:rgba(226,236,250,.25);stroke-width:1;stroke-dasharray:3 4;opacity:.6}

/* content ------------------------------------------------------------- */
.sec{padding:4.5rem 0;border-top:1px solid var(--line)}
.sec-h{display:flex;gap:.9rem;align-items:baseline;margin-bottom:1.75rem}
.sec-h .mono{color:var(--accent);font-size:.8125rem}
.sec-h h2{font-weight:700;letter-spacing:-.03em;font-size:clamp(1.5rem,2.2vw,2rem)}

.doms{display:grid;gap:1rem}
@media (min-width:760px){.doms{grid-template-columns:1fr 1fr}}
.dom{border:1px solid var(--line);border-radius:10px;padding:1.3rem;background:var(--surface);
text-decoration:none;display:block;transition:border-color .15s}
.dom:hover{border-color:var(--accent)}
.dom .n{font-family:"IBM Plex Mono",monospace;font-size:.75rem;color:var(--accent)}
.dom h3{margin-top:.5rem;font-weight:700;letter-spacing:-.02em;font-size:1.1875rem}
.dom p{margin-top:.5rem;color:var(--muted);font-size:.9375rem}
.caps{margin-top:.9rem;display:flex;flex-wrap:wrap;gap:.3rem}
.caps span{font-family:"IBM Plex Mono",monospace;font-size:.6875rem;color:var(--muted);
background:var(--accent-dim);border-radius:3px;padding:.15rem .4rem}

.cols{display:grid;gap:1.5rem 2.5rem}
@media (min-width:760px){.cols{grid-template-columns:repeat(2,1fr)}}
@media (min-width:1040px){.cols{grid-template-columns:repeat(4,1fr)}}
.cols b{display:block;font-weight:700;letter-spacing:-.015em}
.cols .n{font-family:"IBM Plex Mono",monospace;font-size:.75rem;color:var(--accent)}
.cols span{display:block;margin-top:.35rem;color:var(--muted);font-size:.9375rem}

.proof{display:flex;flex-wrap:wrap;gap:2rem 3.5rem}
.proof dd{margin:0;font-weight:700;letter-spacing:-.03em;font-size:2.4rem}
.proof dt{margin-top:.25rem;color:var(--muted);font-size:.875rem}
.foot{padding:3rem 0 8rem;border-top:1px solid var(--line);color:var(--muted)}
.foot .contact{margin-top:1rem;display:flex;flex-wrap:wrap;gap:.5rem 2rem;font-size:.9375rem}
.foot .ph-note{margin-top:1.75rem;max-width:62ch}
`;

export default function build() {
  const domPts = nodes(6, 210);
  const secPts = nodes(4, 330, -Math.PI / 2 + Math.PI / 4);

  const edges = domPts
    .map((p) => `<line class="edge" x1="${CX}" y1="${CY}" x2="${p.x.toFixed(1)}" y2="${p.y.toFixed(1)}"/>`)
    .join("");

  const edges2 = secPts
    .map((s, i) => {
      const a = domPts[i % 6];
      const b = domPts[(i + 3) % 6];
      return `<line class="edge-2" x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}" x2="${s.x.toFixed(1)}" y2="${s.y.toFixed(1)}"/>
<line class="edge-2" x1="${b.x.toFixed(1)}" y1="${b.y.toFixed(1)}" x2="${s.x.toFixed(1)}" y2="${s.y.toFixed(1)}"/>`;
    })
    .join("");

  const domNodes = domPts
    .map((p, i) => {
      const d = C.solutions[i];
      const words = d.title.split(" ");
      const mid = Math.ceil(words.length / 2);
      const l1 = words.slice(0, mid).join(" ");
      const l2 = words.slice(mid).join(" ");

      /* Labels are stacked away from the node so they never sit on the
         circle. Directly above or below the core needs a bigger offset than
         the sides, because the whole two-line block has to clear the glyph. */
      const isMid = Math.abs(p.x - CX) < 40;
      const right = p.x >= CX;
      let anchor, tx, yNum, y1, y2;

      if (isMid && p.y < CY) {
        anchor = "middle"; tx = p.x; yNum = p.y - 68; y1 = p.y - 50; y2 = p.y - 32;
      } else if (isMid) {
        anchor = "middle"; tx = p.x; yNum = p.y + 32; y1 = p.y + 50; y2 = p.y + 68;
      } else {
        anchor = right ? "start" : "end";
        tx = p.x + (right ? 22 : -22);
        yNum = p.y - 20; y1 = p.y - 1; y2 = p.y + 17;
      }

      return `<g>
<circle class="n-dom" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="13"/>
<text class="lbl-s" x="${tx.toFixed(1)}" y="${yNum.toFixed(1)}" text-anchor="${anchor}">${num(i + 1)}</text>
<text class="lbl" x="${tx.toFixed(1)}" y="${y1.toFixed(1)}" text-anchor="${anchor}">${esc(l1)}</text>
<text class="lbl" x="${tx.toFixed(1)}" y="${y2.toFixed(1)}" text-anchor="${anchor}">${esc(l2)}</text>
</g>`;
    })
    .join("");

  const secNodes = secPts
    .map((p, i) => {
      const right = p.x >= CX;
      const anchor = right ? "start" : "end";
      const dx = right ? 18 : -18;
      return `<g>
<circle class="n-sec" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="7"/>
<text class="lbl-s" x="${(p.x + dx).toFixed(1)}" y="${(p.y + 4).toFixed(1)}" text-anchor="${anchor}">${esc(C.sectors[i].title)}</text>
</g>`;
    })
    .join("");

  const doms = C.solutions
    .map(
      (d, i) => `<a class="dom" href="#">
<span class="n">${num(i + 1)}</span>
<h3>${esc(d.title)}</h3>
<p>${esc(d.summary)}</p>
<span class="caps">${d.capabilities
        .slice(0, 8)
        .map((c) => `<span>${esc(c.acronym || c.name)}</span>`)
        .join("")}</span></a>`,
    )
    .join("");

  const steps = C.home.method
    .map(
      (m, i) =>
        `<div><span class="n">${num(i + 1)}</span><b>${esc(m.title)}</b><span>${esc(m.body)}</span></div>`,
    )
    .join("");

  const sectors = C.sectors
    .map((s) => `<div><b>${esc(s.title)}</b><span>${esc(s.line)}</span></div>`)
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

  <section class="intro">
    <h1>${esc(C.home.tagline)}</h1>
    <div>
      <p>${esc(C.home.heroStatement)}</p>
      <div class="acts">
        <a class="btn btn-a" href="#">Explore solutions</a>
        <a class="btn btn-b" href="#">Talk to an expert</a>
      </div>
    </div>
  </section>

  <figure class="map">
    <svg viewBox="0 0 ${W} ${H}" role="img"
      aria-label="Six technology domains connecting a single core to four sectors served">
      <circle cx="${CX}" cy="${CY}" r="210" fill="none" stroke="rgba(226,236,250,.07)"/>
      <circle cx="${CX}" cy="${CY}" r="330" fill="none" stroke="rgba(226,236,250,.05)"/>
      ${edges2}${edges}
      <circle class="n-core" cx="${CX}" cy="${CY}" r="30" opacity=".14"/>
      <circle class="n-core" cx="${CX}" cy="${CY}" r="9"/>
      <text class="lbl" x="${CX}" y="${CY + 52}" text-anchor="middle">Edge</text>
      ${domNodes}${secNodes}
    </svg>
    <figcaption>
      <span>Six domains, one contract, four sectors</span>
      <span class="mono">Fig. 1 — capability map</span>
    </figcaption>
  </figure>

  <section class="sec">
    <div class="sec-h"><span class="mono">01</span><h2>${esc(C.home.solutionsIntro)}</h2></div>
    <div class="doms">${doms}</div>
  </section>

  <section class="sec">
    <div class="sec-h"><span class="mono">02</span><h2>${esc(C.home.methodTitle)}</h2></div>
    <div class="cols">${steps}</div>
  </section>

  <section class="sec">
    <div class="sec-h"><span class="mono">03</span><h2>${esc(C.home.sectorsIntro)}</h2></div>
    <div class="cols">${sectors}</div>
  </section>

  <section class="sec">
    <div class="sec-h"><span class="mono">04</span><h2>Track record</h2></div>
    <dl class="proof">
      <div><dd>${ph(P.years)}</dd><dt>Years operating</dt></div>
      <div><dd>${ph(P.engineers)}</dd><dt>Engineers on staff</dt></div>
      <div><dd>${ph(P.projects)}</dd><dt>Projects delivered</dt></div>
      <div><dd>${ph(P.clients)}</dd><dt>Clients served</dt></div>
    </dl>
  </section>

  <footer class="foot">
    <h2 style="font-weight:700;letter-spacing:-.03em;font-size:1.6rem;color:var(--text)">
      Tell us what you need to stand up, replace, or secure</h2>
    <div class="contact"><span>${ph(P.phone)}</span><span>${ph(P.email)}</span><span>${ph(P.address)}</span></div>
    ${phNote()}
  </footer>
</div>`;

  return page({ id: "05", title: "Topology", font: FONTS.grotesk, css, body });
}
