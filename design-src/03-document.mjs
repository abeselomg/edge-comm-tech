import { content as C, esc, num, page, ph, phNote, PLACEHOLDER as P, FONTS } from "./lib.mjs";

/*
 * 03 — Document.
 * The one light direction, and the only one where the page is a deliverable
 * rather than a pitch: a capability statement issued like a drawing set,
 * with a masthead, revision block, numbered clauses and dense tables.
 * Blue-black is the ink here rather than the ground.
 */

const css = `
:root{
  --paper:#f2f4f9; --paper-2:#ffffff; --ink:#080d17; --ink-2:#3d4a63;
  --line:#080d1722; --line-2:#080d1712; --accent:#1e4fd8;
}
body{background:var(--paper);color:var(--ink);
font:400 15.5px/1.6 Inter,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.mono{font-family:"IBM Plex Mono",ui-monospace,monospace}
.sheet{max-width:1120px;margin:0 auto;background:var(--paper-2);min-height:100vh;
border-left:1px solid var(--line-2);border-right:1px solid var(--line-2)}
.pad{padding:2rem 1.5rem}
@media (min-width:820px){.pad{padding:3rem}}

/* masthead ------------------------------------------------------------ */
.top{border-bottom:2px solid var(--ink)}
.mark{font-family:Newsreader,Georgia,serif;font-size:1.6rem;font-weight:600;letter-spacing:-.01em}
.mark span{font-weight:400;color:var(--ink-2)}
.title{margin-top:1.6rem;font-family:Newsreader,Georgia,serif;font-weight:600;
letter-spacing:-.02em;line-height:1.06;font-size:clamp(2.1rem,4.4vw,3.4rem);max-width:20ch}
.abstract{margin-top:1.1rem;max-width:64ch;color:var(--ink-2);font-size:1.0625rem;line-height:1.65}

/* revision block ------------------------------------------------------ */
.rev{margin-top:2rem;display:grid;gap:0;border:1px solid var(--line);
grid-template-columns:repeat(2,1fr)}
@media (min-width:720px){.rev{grid-template-columns:repeat(4,1fr)}}
.rev div{padding:.7rem .9rem;border-right:1px solid var(--line-2);border-bottom:1px solid var(--line-2)}
.rev dt{font-size:.6875rem;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-2)}
.rev dd{margin:.25rem 0 0;font-family:"IBM Plex Mono",monospace;font-size:.875rem}

/* clauses ------------------------------------------------------------- */
.clause{border-top:1px solid var(--line);padding-top:1.6rem;margin-top:2.75rem}
.clause > h2{display:flex;gap:.9rem;align-items:baseline;font-family:Newsreader,Georgia,serif;
font-weight:600;font-size:1.5rem;letter-spacing:-.01em}
.cl-n{font-family:"IBM Plex Mono",monospace;font-size:.8125rem;color:var(--accent);flex:none}
.lead{margin-top:.7rem;max-width:66ch;color:var(--ink-2)}

table{width:100%;border-collapse:collapse;margin-top:1.2rem;font-size:.9375rem}
th,td{text-align:left;vertical-align:top;padding:.7rem .8rem;border-bottom:1px solid var(--line-2)}
thead th{font-size:.6875rem;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-2);
border-bottom:1px solid var(--line);font-weight:500}
tbody th{font-weight:500;width:22%}
td.c{color:var(--ink-2)}
.caps{display:flex;flex-wrap:wrap;gap:.25rem .5rem}
.caps span{font-family:"IBM Plex Mono",monospace;font-size:.6875rem;color:var(--ink-2)}
.scroller{overflow-x:auto}
.scroller table{min-width:44rem}

ol.steps{counter-reset:s;margin-top:1.2rem;display:grid;gap:.9rem}
ol.steps li{display:grid;grid-template-columns:2.4rem 1fr;gap:.9rem}
ol.steps b{font-family:"IBM Plex Mono",monospace;font-weight:400;font-size:.8125rem;color:var(--accent);padding-top:.15rem}
ol.steps span{color:var(--ink-2)}
ol.steps strong{display:block;color:var(--ink);font-weight:600;margin-bottom:.15rem}

.sign{margin-top:3rem;border-top:2px solid var(--ink);padding-top:1.4rem;
display:flex;flex-wrap:wrap;gap:1.5rem;justify-content:space-between;align-items:flex-end}
.sign dl{display:flex;flex-wrap:wrap;gap:.3rem 1.75rem;font-size:.9375rem}
.sign dt{color:var(--ink-2)}
.sign dd{margin:0;font-family:"IBM Plex Mono",monospace}
.btn{display:inline-flex;padding:.8rem 1.4rem;border-radius:4px;background:var(--accent);
color:#fff;text-decoration:none;font-weight:500;font-size:.9375rem}
.foot{padding:1.25rem 1.5rem 7rem;color:var(--ink-2)}
@media (min-width:820px){.foot{padding:1.5rem 3rem 8rem}}
`;

export default function build() {
  const domRows = C.solutions
    .map(
      (d, i) => `<tr>
<th scope="row"><span class="mono" style="color:var(--accent);font-size:.75rem">${num(i + 1)}</span><br>${esc(d.title)}</th>
<td class="c">${esc(d.headline)}</td>
<td><span class="caps">${d.capabilities
        .map((c) => `<span>${esc(c.acronym || c.name)}</span>`)
        .join("")}</span></td>
</tr>`,
    )
    .join("");

  const sectorRows = C.sectors
    .map(
      (s) => `<tr><th scope="row">${esc(s.title)}</th><td class="c">${esc(s.line)}</td>
<td class="c">${esc(s.pressures.map((p) => p.title).join(", "))}</td></tr>`,
    )
    .join("");

  const steps = C.home.method
    .map(
      (m, i) =>
        `<li><b>${num(i + 1)}</b><span><strong>${esc(m.title)}</strong>${esc(m.body)}</span></li>`,
    )
    .join("");

  const courseRows = C.courses
    .map(
      (c) => `<tr><th scope="row">${esc(c.title)}</th>
<td class="c">${esc(c.audience)}</td>
<td class="mono" style="font-size:.8125rem">${c.lessons} lessons</td>
<td class="mono" style="font-size:.8125rem">${esc(c.duration)}</td></tr>`,
    )
    .join("");

  const body = `
<article class="sheet">
  <header class="top pad">
    <p class="mark">Edge<span> COMM-TECH</span></p>
    <h1 class="title">${esc(C.home.tagline)}</h1>
    <p class="abstract">${esc(C.home.heroStatement)}</p>

    <dl class="rev">
      <div><dt>Document</dt><dd>Capability statement</dd></div>
      <div><dt>Issued</dt><dd>${new Date().toISOString().slice(0, 10)}</dd></div>
      <div><dt>Revision</dt><dd>A</dd></div>
      <div><dt>Origin</dt><dd>Addis Ababa, ET</dd></div>
    </dl>
  </header>

  <div class="pad" style="padding-top:0">
    <section class="clause">
      <h2><span class="cl-n">1.0</span> ${esc(C.home.solutionsIntro)}</h2>
      <p class="lead">Each domain is designed, delivered and supported by the same team. The
      capability column lists the industry terms a specification is normally written in.</p>
      <div class="scroller">
        <table>
          <thead><tr><th>Domain</th><th>Promise</th><th>Capabilities</th></tr></thead>
          <tbody>${domRows}</tbody>
        </table>
      </div>
    </section>

    <section class="clause">
      <h2><span class="cl-n">2.0</span> ${esc(C.home.methodTitle)}</h2>
      <ol class="steps">${steps}</ol>
    </section>

    <section class="clause">
      <h2><span class="cl-n">3.0</span> ${esc(C.home.sectorsIntro)}</h2>
      <div class="scroller">
        <table>
          <thead><tr><th>Sector</th><th>Why reliability is a duty</th><th>Operating pressures</th></tr></thead>
          <tbody>${sectorRows}</tbody>
        </table>
      </div>
    </section>

    <section class="clause">
      <h2><span class="cl-n">4.0</span> E-Academy</h2>
      <p class="lead">Free and open, no account required. Published because clients who understand
      their own infrastructure are better clients, and this market is short of trained engineers.</p>
      <div class="scroller">
        <table>
          <thead><tr><th>Course</th><th>Audience</th><th>Lessons</th><th>Duration</th></tr></thead>
          <tbody>${courseRows}</tbody>
        </table>
      </div>
    </section>

    <section class="clause">
      <h2><span class="cl-n">5.0</span> Record</h2>
      <div class="scroller">
        <table>
          <thead><tr><th>Measure</th><th>Value</th><th>Status</th></tr></thead>
          <tbody>
            <tr><th scope="row">Years operating</th><td class="mono">${ph(P.years)}</td><td class="c">Unconfirmed</td></tr>
            <tr><th scope="row">Engineers on staff</th><td class="mono">${ph(P.engineers)}</td><td class="c">Unconfirmed</td></tr>
            <tr><th scope="row">Projects delivered</th><td class="mono">${ph(P.projects)}</td><td class="c">Unconfirmed</td></tr>
            <tr><th scope="row">Clients served</th><td class="mono">${ph(P.clients)}</td><td class="c">Unconfirmed</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <div class="sign">
      <dl>
        <dt>Telephone</dt><dd>${ph(P.phone)}</dd>
        <dt>Email</dt><dd>${ph(P.email)}</dd>
        <dt>Office</dt><dd>${ph(P.address)}</dd>
      </dl>
      <a class="btn" href="#">Request a scoping call</a>
    </div>
  </div>

  <div class="foot">${phNote()}</div>
</article>`;

  return page({ id: "03", title: "Document", font: FONTS.document, css, body });
}
