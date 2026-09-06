import { content as C, esc, num, page, ph, phNote, PLACEHOLDER as P, FONTS } from "./lib.mjs";

/*
 * 04 — Poster.
 * Near-black and deliberately sparse. One statement owns the first screen,
 * then the six domains arrive one per full-height frame at display size.
 * The bet is confidence: very little on screen at any moment.
 */

const css = `
:root{
  --void:#04070e; --ink:#070b14; --line:rgba(230,236,247,.14);
  --text:#eef2fa; --muted:#7d8ba6; --accent:#6e9bff;
}
body{background:var(--void);color:var(--text);
font:400 16px/1.6 Archivo,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.mono{font-family:"IBM Plex Mono",ui-monospace,monospace;font-size:.75rem;letter-spacing:.05em}
.wrap{padding:0 1.5rem}
@media (min-width:900px){.wrap{padding:0 4vw}}

.top{display:flex;justify-content:space-between;align-items:center;gap:1rem;
padding:1.5rem 0;position:sticky;top:0;background:linear-gradient(#04070e 70%,transparent);z-index:5}
.mark{font-weight:800;letter-spacing:-.03em;font-size:1.0625rem}
.mark span{font-weight:400;color:var(--muted)}
.top nav{display:none;gap:1.4rem;font-size:.875rem}
@media (min-width:820px){.top nav{display:flex}}
.top nav a{color:var(--muted);text-decoration:none}
.top nav a:hover{color:var(--text)}

.opening{min-height:82vh;display:flex;flex-direction:column;justify-content:center;
padding:3rem 0 4rem;border-bottom:1px solid var(--line)}
.opening h1{font-weight:800;letter-spacing:-.045em;line-height:.94;
font-size:clamp(3rem,11vw,10rem);text-wrap:balance}
.opening p{margin-top:2.5rem;max-width:40ch;color:var(--muted);
font-size:clamp(1.0625rem,1.5vw,1.35rem);line-height:1.5}
.acts{margin-top:2.5rem;display:flex;flex-wrap:wrap;gap:.7rem}
.btn{display:inline-flex;padding:1rem 1.8rem;border-radius:999px;text-decoration:none;
font-weight:600;font-size:.9375rem}
.btn-a{background:var(--text);color:var(--void)}
.btn-b{border:1px solid var(--line);color:var(--text)}

/* one domain per frame */
.frame{min-height:78vh;display:grid;align-content:center;gap:1.5rem;
padding:4rem 0;border-bottom:1px solid var(--line)}
@media (min-width:1000px){.frame{grid-template-columns:8rem 1fr 22rem;gap:3rem;align-items:center}}
.frame .n{color:var(--accent)}
.frame h2{font-weight:800;letter-spacing:-.04em;line-height:1;
font-size:clamp(2.2rem,5.6vw,4.4rem);text-wrap:balance}
.frame .side p{color:var(--muted);font-size:.9375rem;line-height:1.6}
.frame .caps{margin-top:1.1rem;display:flex;flex-wrap:wrap;gap:.3rem}
.frame .caps span{font-family:"IBM Plex Mono",monospace;font-size:.6875rem;color:var(--muted);
border:1px solid var(--line);border-radius:99px;padding:.2rem .6rem}

.split{padding:5rem 0;border-bottom:1px solid var(--line);display:grid;gap:2.5rem}
@media (min-width:900px){.split{grid-template-columns:1fr 1fr;gap:5rem}}
.split h2{font-weight:800;letter-spacing:-.035em;line-height:1.05;font-size:clamp(1.9rem,3.4vw,2.8rem)}
.list{display:grid;gap:1.4rem}
.list b{display:block;font-weight:600;font-size:1.0625rem;letter-spacing:-.015em}
.list span{display:block;margin-top:.3rem;color:var(--muted);font-size:.9375rem}
.list .n{font-family:"IBM Plex Mono",monospace;font-size:.75rem;color:var(--accent)}

.proof{padding:4rem 0;border-bottom:1px solid var(--line);display:flex;flex-wrap:wrap;gap:2.5rem 4rem}
.proof dd{margin:0;font-weight:800;letter-spacing:-.04em;font-size:clamp(2.6rem,5vw,4rem)}
.proof dt{margin-top:.4rem;color:var(--muted);font-size:.875rem}
.closing{padding:6rem 0 9rem;text-align:center}
.closing h2{font-weight:800;letter-spacing:-.04em;line-height:1;
font-size:clamp(2.2rem,6vw,4.6rem);max-width:18ch;margin:0 auto;text-wrap:balance}
.closing p{margin-top:1.6rem;color:var(--muted)}
.closing .acts{justify-content:center}
.closing .contact{margin-top:2.5rem;display:flex;flex-wrap:wrap;justify-content:center;
gap:.5rem 2rem;color:var(--muted);font-size:.9375rem}
.wrap .ph-note{margin:2.5rem auto 0;max-width:60ch;color:var(--muted);text-align:left}
`;

export default function build() {
  const frames = C.solutions
    .map(
      (d, i) => `<section class="frame">
<p class="mono n">${num(i + 1)} / 06</p>
<h2>${esc(d.title)}</h2>
<div class="side">
  <p>${esc(d.summary)}</p>
  <div class="caps">${d.capabilities
    .slice(0, 8)
    .map((c) => `<span>${esc(c.acronym || c.name)}</span>`)
    .join("")}</div>
</div>
</section>`,
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

  <section class="opening">
    <h1>${esc(C.home.tagline)}</h1>
    <p>${esc(C.home.heroStatement)}</p>
    <div class="acts">
      <a class="btn btn-a" href="#">Explore solutions</a>
      <a class="btn btn-b" href="#">Talk to an expert</a>
    </div>
  </section>

  ${frames}

  <section class="split">
    <h2>${esc(C.home.methodTitle)}</h2>
    <div class="list">${steps}</div>
  </section>

  <section class="split">
    <h2>${esc(C.home.sectorsIntro)}</h2>
    <div class="list">${sectors}</div>
  </section>

  <dl class="proof">
    <div><dd>${ph(P.years)}</dd><dt>Years operating</dt></div>
    <div><dd>${ph(P.engineers)}</dd><dt>Engineers on staff</dt></div>
    <div><dd>${ph(P.projects)}</dd><dt>Projects delivered</dt></div>
  </dl>

  <section class="closing">
    <h2>Tell us what you need to stand up, replace, or secure</h2>
    <p>An engineer replies, not a sales queue.</p>
    <div class="acts"><a class="btn btn-a" href="#">Start a conversation</a></div>
    <div class="contact"><span>${ph(P.phone)}</span><span>${ph(P.email)}</span><span>${ph(P.address)}</span></div>
    ${phNote()}
  </section>
</div>`;

  return page({ id: "04", title: "Poster", font: FONTS.archivo, css, body });
}
