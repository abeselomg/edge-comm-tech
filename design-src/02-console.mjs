import { content as C, esc, num, page, ph, phNote, PLACEHOLDER as P, FONTS } from "./lib.mjs";

/*
 * 02 — Console.
 * A bento grid rather than stacked sections: the homepage reads as an
 * operations dashboard, which is the surface Edge's clients actually live
 * in. Tiles vary in span so scanning order is set by weight, not by order.
 */

const css = `
:root{
  --void:#05080f; --ink:#080d17; --tile:#0e1523; --tile-2:#121b2c;
  --line:rgba(226,235,248,.11); --text:#e7edf7; --muted:#8b9bb8;
  --accent:#22d3ee; --accent-dim:rgba(34,211,238,.16); --ok:#4ade80;
}
body{background:var(--ink);color:var(--text);
font:400 15px/1.6 "IBM Plex Sans",system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.mono{font-family:"IBM Plex Mono",ui-monospace,monospace}
.shell{max-width:1400px;margin:0 auto;padding:1.25rem 1.25rem 7rem}
@media (min-width:900px){.shell{padding:1.5rem 1.5rem 8rem}}

.bar{display:flex;flex-wrap:wrap;gap:1rem;align-items:center;justify-content:space-between;
padding:.9rem 1.1rem;border:1px solid var(--line);border-radius:10px;background:var(--tile)}
.mark{font-weight:600;letter-spacing:-.02em}
.mark span{font-weight:400;color:var(--muted)}
.bar nav{display:flex;flex-wrap:wrap;gap:1.1rem;font-size:.875rem}
.bar nav a{color:var(--muted);text-decoration:none}
.bar nav a:hover{color:var(--text)}
.live{display:inline-flex;align-items:center;gap:.45rem;font-size:.75rem;color:var(--muted)}
.dot{width:7px;height:7px;border-radius:50%;background:var(--ok);box-shadow:0 0 0 3px rgba(74,222,128,.16)}

.grid{margin-top:1rem;display:grid;gap:1rem;grid-template-columns:repeat(12,1fr)}
.t{border:1px solid var(--line);border-radius:10px;background:var(--tile);padding:1.35rem}
.t.span12{grid-column:span 12}
.t.span8{grid-column:span 12}
.t.span6{grid-column:span 12}
.t.span4{grid-column:span 12}
.t.span3{grid-column:span 6}
@media (min-width:760px){
  .t.span8{grid-column:span 8}.t.span6{grid-column:span 6}
  .t.span4{grid-column:span 4}.t.span3{grid-column:span 3}
}
.t-h{display:flex;align-items:center;justify-content:space-between;gap:1rem;
font-size:.75rem;letter-spacing:.04em;color:var(--muted)}
.t-h b{font-weight:400}

.hero{background:linear-gradient(140deg,#0e1523,#0a1220 60%,#0d1a2b);}
.hero h1{margin-top:1.1rem;font-weight:600;letter-spacing:-.035em;line-height:1.05;
font-size:clamp(2rem,3.6vw,3.1rem)}
.hero p{margin-top:1rem;max-width:52ch;color:var(--muted)}
.acts{margin-top:1.5rem;display:flex;flex-wrap:wrap;gap:.55rem}
.btn{display:inline-flex;align-items:center;padding:.7rem 1.15rem;border-radius:7px;
font-size:.875rem;font-weight:500;text-decoration:none}
.btn-a{background:var(--accent);color:#04222a}
.btn-b{border:1px solid var(--line);color:var(--text)}

.stat{font-weight:600;letter-spacing:-.03em;font-size:2.1rem;margin-top:.7rem}
.stat + p{color:var(--muted);font-size:.8125rem}

.dom{display:grid;gap:.5rem}
.dom a{display:grid;grid-template-columns:2.1rem 1fr;gap:.9rem;align-items:start;
padding:.85rem;border:1px solid var(--line);border-radius:8px;background:var(--tile-2);
text-decoration:none;transition:border-color .15s,background .15s}
.dom a:hover{border-color:var(--accent);background:#132234}
.dom .n{font-family:"IBM Plex Mono",monospace;font-size:.75rem;color:var(--accent);padding-top:.15rem}
.dom .name{font-weight:500;letter-spacing:-.015em}
.dom .line{display:block;margin-top:.2rem;font-size:.8125rem;color:var(--muted)}
.caps{margin-top:.5rem;display:flex;flex-wrap:wrap;gap:.3rem}
.cap{font-family:"IBM Plex Mono",monospace;font-size:.6875rem;color:var(--muted);
background:var(--accent-dim);padding:.15rem .4rem;border-radius:3px}

.rows li{display:flex;justify-content:space-between;gap:1rem;padding:.6rem 0;border-top:1px solid var(--line)}
.rows li:first-child{border-top:0}
.rows span{color:var(--muted);font-size:.8125rem}
.rows b{font-weight:500;font-size:.9375rem}

.sect{display:grid;gap:.9rem}
.sect div{padding:.85rem;border:1px solid var(--line);border-radius:8px;background:var(--tile-2)}
.sect b{display:block;font-weight:500;letter-spacing:-.01em}
.sect span{display:block;margin-top:.25rem;font-size:.8125rem;color:var(--muted)}

.meter{margin-top:.8rem;height:5px;border-radius:99px;background:rgba(226,235,248,.08);overflow:hidden}
.meter i{display:block;height:100%;background:var(--accent);border-radius:99px}
.t .ph-note{margin-top:1rem;color:var(--muted)}
`;

export default function build() {
  const doms = C.solutions
    .map(
      (d, i) => `<a href="#">
<span class="n">${num(i + 1)}</span>
<span><span class="name">${esc(d.title)}</span>
<span class="line">${esc(d.headline)}</span>
<span class="caps">${d.capabilities
        .slice(0, 7)
        .map((c) => `<span class="cap">${esc(c.acronym || c.name)}</span>`)
        .join("")}</span></span></a>`,
    )
    .join("");

  const steps = C.home.method
    .map(
      (m, i) =>
        `<li><b>${num(i + 1)} ${esc(m.title)}</b><span>${esc(m.body.split(".")[0])}.</span></li>`,
    )
    .join("");

  const sectors = C.sectors
    .map((s) => `<div><b>${esc(s.title)}</b><span>${esc(s.line)}</span></div>`)
    .join("");

  const courses = C.courses
    .map((c) => `<li><b>${esc(c.title)}</b><span>${c.lessons} lessons</span></li>`)
    .join("");

  const nav = ["Solutions", "Sectors", "Projects", "Partners", "E-Academy", "Company", "Contact"]
    .map((n) => `<a href="#">${n}</a>`)
    .join("");

  const body = `
<div class="shell">
  <header class="bar">
    <p class="mark">Edge<span> COMM-TECH</span></p>
    <nav>${nav}</nav>
    <span class="live"><i class="dot"></i> Addis Ababa</span>
  </header>

  <div class="grid">
    <section class="t span8 hero">
      <p class="t-h"><b>Positioning</b><b class="mono">01</b></p>
      <h1>${esc(C.home.tagline)}</h1>
      <p>${esc(C.home.heroStatement)}</p>
      <div class="acts">
        <a class="btn btn-a" href="#">Explore solutions</a>
        <a class="btn btn-b" href="#">Talk to an expert</a>
      </div>
    </section>

    <section class="t span4">
      <p class="t-h"><b>Track record</b><b class="mono">02</b></p>
      <p class="stat">${ph(P.years)}</p><p>Years operating</p>
      <p class="stat">${ph(P.projects)}</p><p>Projects delivered</p>
      <p class="stat">${ph(P.engineers)}</p><p>Engineers on staff</p>
      ${phNote()}
    </section>

    <section class="t span8">
      <p class="t-h"><b>${esc(C.home.solutionsIntro)}</b><b class="mono">03</b></p>
      <div class="dom" style="margin-top:1rem">${doms}</div>
    </section>

    <div class="t span4" style="background:transparent;border:0;padding:0;display:grid;gap:1rem;align-content:start">
      <section class="t" style="grid-column:auto">
        <p class="t-h"><b>${esc(C.home.methodTitle)}</b><b class="mono">04</b></p>
        <ul class="rows" style="margin-top:.8rem">${steps}</ul>
      </section>
      <section class="t" style="grid-column:auto">
        <p class="t-h"><b>E-Academy</b><b class="mono">05</b></p>
        <ul class="rows" style="margin-top:.8rem">${courses}</ul>
        <div class="meter"><i style="width:62%"></i></div>
        <p style="margin-top:.5rem;font-size:.75rem;color:var(--muted)">
          ${C.courses.reduce((n, c) => n + c.lessons, 0)} lessons published, free, no account
        </p>
      </section>
    </div>

    <section class="t span6">
      <p class="t-h"><b>Sectors served</b><b class="mono">06</b></p>
      <div class="sect" style="margin-top:1rem">${sectors}</div>
    </section>

    <section class="t span6">
      <p class="t-h"><b>Get in touch</b><b class="mono">07</b></p>
      <h2 style="margin-top:1rem;font-weight:600;letter-spacing:-.025em;font-size:1.5rem;line-height:1.2">
        Tell us what you need to stand up, replace, or secure</h2>
      <p style="margin-top:.7rem;color:var(--muted)">An engineer replies, not a sales queue.</p>
      <ul class="rows" style="margin-top:1.1rem">
        <li><span>Phone</span><b>${ph(P.phone)}</b></li>
        <li><span>Email</span><b>${ph(P.email)}</b></li>
        <li><span>Office</span><b>${ph(P.address)}</b></li>
      </ul>
      <div class="acts"><a class="btn btn-a" href="#">Start a conversation</a></div>
    </section>
  </div>
</div>`;

  return page({ id: "02", title: "Console", font: FONTS.plex, css, body });
}
