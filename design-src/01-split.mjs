import { content as C, esc, num, page, ph, phNote, PLACEHOLDER as P, FONTS } from "./lib.mjs";

/*
 * 01 — Split.
 * A fixed left half carries identity, statement and proof; the right half
 * scrolls the catalogue. The page has no top bar and no footer: the left
 * pane is permanent, so navigation and pitch are never off-screen.
 */

const css = `
:root{
  --void:#05080f; --ink:#0a101c; --surface:#101a2b; --line:rgba(226,235,248,.13);
  --text:#e6ebf4; --muted:#8fa0bd; --accent:#3d7bff; --accent-soft:#7aa5ff;
}
body{background:var(--ink);color:var(--text);font:400 16px/1.65 Manrope,system-ui,sans-serif;
-webkit-font-smoothing:antialiased}
.wrap{display:grid;min-height:100vh}
@media (min-width:1000px){.wrap{grid-template-columns:46% 1fr;background:linear-gradient(90deg,var(--void) 0 46%,var(--ink) 46%)}}

/* --- left pane ------------------------------------------------------- */
.pane{background:var(--void);padding:2rem 1.5rem 3rem;display:flex;flex-direction:column;
border-bottom:1px solid var(--line)}
@media (min-width:1000px){
  .pane{position:sticky;top:0;height:100vh;padding:3rem 3.5rem;border-bottom:0;border-right:1px solid var(--line)}
}
.mark{font-weight:800;letter-spacing:-.02em;font-size:1.0625rem}
.mark span{font-weight:400;opacity:.72}
.statement{margin-top:auto;padding-top:3.5rem;font-weight:800;letter-spacing:-.035em;line-height:1.02;
font-size:clamp(2.4rem,4.6vw,4rem)}
.sub{margin-top:1.6rem;max-width:34ch;color:var(--muted);font-size:clamp(1rem,1.15vw,1.0625rem);line-height:1.6}
.acts{margin-top:2rem;display:flex;flex-wrap:wrap;gap:.6rem}
.btn{display:inline-flex;align-items:center;padding:.85rem 1.4rem;border-radius:6px;
font-weight:600;font-size:.9375rem;text-decoration:none;transition:background .16s,border-color .16s}
.btn-a{background:var(--accent);color:#fff}
.btn-a:hover{background:var(--accent-soft)}
.btn-b{border:1px solid var(--line);color:var(--text)}
.btn-b:hover{border-color:var(--accent-soft)}
.proof{margin-top:auto;padding-top:3rem;display:flex;flex-wrap:wrap;gap:1.75rem 2.5rem}
.proof div{min-width:5.5rem}
.proof dt{font-size:.8125rem;color:var(--muted);margin-top:.3rem}
.proof dd{margin:0;font-weight:800;font-size:1.85rem;letter-spacing:-.03em}
.pane .ph-note{margin-top:1.75rem;color:var(--muted);max-width:38ch}

/* --- right pane ------------------------------------------------------ */
.feed{padding:2.5rem 1.5rem 7rem}
@media (min-width:1000px){.feed{padding:3rem 3.5rem 8rem}}
.sec + .sec{margin-top:4.5rem}
.sec-h{font-size:.8125rem;letter-spacing:.02em;color:var(--muted);
font-family:ui-monospace,"SFMono-Regular",Menlo,monospace}
.h2{margin-top:.75rem;font-weight:800;letter-spacing:-.03em;line-height:1.1;
font-size:clamp(1.5rem,2.1vw,1.9rem)}

.dom{margin-top:1.75rem}
.dom a{display:block;text-decoration:none;padding:1.4rem 0;border-top:1px solid var(--line)}
.dom li:last-child a{border-bottom:1px solid var(--line)}
.dom a:hover{background:rgba(61,123,255,.05)}
.dom-t{display:flex;gap:.9rem;align-items:baseline}
.dom-n{font-family:ui-monospace,Menlo,monospace;font-size:.8125rem;color:var(--accent)}
.dom-name{font-weight:600;font-size:1.125rem;letter-spacing:-.02em}
.dom a:hover .dom-name{color:var(--accent-soft)}
.dom-s{display:block;margin-top:.5rem;padding-left:1.75rem;color:var(--muted);font-size:.9375rem;max-width:56ch}
.chips{margin-top:.7rem;padding-left:1.75rem;display:flex;flex-wrap:wrap;gap:.35rem}
.chip{font-family:ui-monospace,Menlo,monospace;font-size:.6875rem;padding:.2rem .45rem;
border:1px solid var(--line);border-radius:3px;color:var(--muted)}

.grid2{margin-top:1.75rem;display:grid;gap:1.5rem 2.5rem}
@media (min-width:640px){.grid2{grid-template-columns:1fr 1fr}}
.g-t{font-weight:600;font-size:1.0625rem;letter-spacing:-.015em}
.g-b{margin-top:.4rem;color:var(--muted);font-size:.9375rem}
.step{display:flex;gap:.9rem}
.step-n{font-family:ui-monospace,Menlo,monospace;font-size:.8125rem;color:var(--accent);padding-top:.2rem}

.courses{margin-top:1.5rem}
.courses li{border-top:1px solid var(--line)}
.courses li:last-child{border-bottom:1px solid var(--line)}
.courses a{display:flex;justify-content:space-between;gap:1.5rem;padding:.85rem 0;
text-decoration:none;font-size:.9375rem}
.courses a:hover{color:var(--accent-soft)}
.courses em{font-style:normal;font-family:ui-monospace,Menlo,monospace;font-size:.75rem;color:var(--muted);flex:none}

.cta{margin-top:4.5rem;padding:2rem;border:1px solid var(--line);border-radius:10px;background:var(--surface)}
.cta p{margin-top:.6rem;color:var(--muted);max-width:44ch;font-size:.9375rem}
.contact{margin-top:1.4rem;display:flex;flex-wrap:wrap;gap:.4rem 1.5rem;font-size:.9375rem;color:var(--muted)}
`;

export default function build() {
  const doms = C.solutions
    .map(
      (d, i) => `<li><a href="#">
<span class="dom-t"><span class="dom-n">${num(i + 1)}</span><span class="dom-name">${esc(d.title)}</span></span>
<span class="dom-s">${esc(d.summary)}</span>
<span class="chips">${d.capabilities
        .slice(0, 8)
        .map((c) => `<span class="chip">${esc(c.acronym || c.name)}</span>`)
        .join("")}</span>
</a></li>`,
    )
    .join("");

  const steps = C.home.method
    .map(
      (m, i) => `<div class="step"><span class="step-n">${num(i + 1)}</span>
<span><span class="g-t">${esc(m.title)}</span><span class="g-b" style="display:block">${esc(m.body)}</span></span></div>`,
    )
    .join("");

  const sectors = C.sectors
    .map(
      (s) =>
        `<div><p class="g-t">${esc(s.title)}</p><p class="g-b">${esc(s.line)}</p></div>`,
    )
    .join("");

  const courses = C.courses
    .map(
      (c) =>
        `<li><a href="#"><span>${esc(c.title)}</span><em>${c.lessons} lessons</em></a></li>`,
    )
    .join("");

  const body = `
<div class="wrap">
  <aside class="pane">
    <p class="mark">Edge<span> COMM-TECH</span></p>
    <h1 class="statement">${esc(C.home.tagline)}</h1>
    <p class="sub">${esc(C.home.heroStatement)}</p>
    <div class="acts">
      <a class="btn btn-a" href="#">Explore solutions</a>
      <a class="btn btn-b" href="#">Talk to an expert</a>
    </div>
    <dl class="proof">
      <div><dd>${ph(P.years)}</dd><dt>Years operating</dt></div>
      <div><dd>${ph(P.engineers)}</dd><dt>Engineers on staff</dt></div>
      <div><dd>${ph(P.projects)}</dd><dt>Projects delivered</dt></div>
    </dl>
    ${phNote()}
  </aside>

  <main class="feed">
    <section class="sec">
      <p class="sec-h">What we deliver</p>
      <h2 class="h2">${esc(C.home.solutionsIntro)}</h2>
      <ul class="dom">${doms}</ul>
    </section>

    <section class="sec">
      <p class="sec-h">Method</p>
      <h2 class="h2">${esc(C.home.methodTitle)}</h2>
      <div class="grid2">${steps}</div>
    </section>

    <section class="sec">
      <p class="sec-h">Sectors</p>
      <h2 class="h2">${esc(C.home.sectorsIntro)}</h2>
      <div class="grid2">${sectors}</div>
    </section>

    <section class="sec">
      <p class="sec-h">E-Academy</p>
      <h2 class="h2">We teach the work, not just sell it</h2>
      <ul class="courses">${courses}</ul>
    </section>

    <section class="cta">
      <h2 class="h2" style="margin-top:0">Tell us what you need to stand up, replace, or secure</h2>
      <p>An engineer replies, not a sales queue.</p>
      <div class="contact">
        <span>${ph(P.phone)}</span><span>${ph(P.email)}</span><span>${ph(P.address)}</span>
      </div>
    </section>
  </main>
</div>`;

  return page({ id: "01", title: "Split", font: FONTS.manrope, css, body });
}
