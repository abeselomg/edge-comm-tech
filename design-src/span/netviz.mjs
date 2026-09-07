/*
 * Animated network mesh for the partners hero.
 *
 * Nodes on a jittered grid, each linked to its nearest neighbours, with light
 * travelling along a subset of the links. The layout comes from a seeded
 * generator rather than Math.random, so rebuilding the page produces the same
 * mesh — the composition is a design decision, not a lottery each build.
 *
 * The pulse trick: every line carries pathLength="100", which normalises its
 * geometry to 100 units regardless of how long it actually is. One shared
 * keyframe then moves a 14-unit dash across every link at the same visual
 * speed, however long or short the link.
 */

const W = 1600;
const H = 700;

/* Deterministic PRNG (numerical recipes LCG). */
let seed = 20260907;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const between = (a, b) => a + rnd() * (b - a);

/* ------------------------------------------------------------------- nodes */

const COLS = 7;
const ROWS = 4;
const nodes = [];

for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    /* Thin the mesh out towards the bottom, where the horizon glow sits. */
    if (r === ROWS - 1 && rnd() < 0.4) continue;
    const cw = W / COLS;
    const ch = H / ROWS;
    nodes.push({
      x: c * cw + between(0.18, 0.82) * cw,
      y: r * ch + between(0.18, 0.82) * ch,
      r: between(2, 3.4),
    });
  }
}

/* ------------------------------------------------------------------- links */

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const key = (i, j) => (i < j ? `${i}-${j}` : `${j}-${i}`);

const seen = new Set();
const links = [];

nodes.forEach((n, i) => {
  const near = nodes
    .map((m, j) => ({ j, d: dist(n, m) }))
    .filter((o) => o.j !== i)
    .sort((a, b) => a.d - b.d)
    .slice(0, 2);

  for (const { j } of near) {
    const k = key(i, j);
    if (seen.has(k)) continue;
    seen.add(k);
    links.push([i, j]);
  }
});

/* A handful of longer hops, so the mesh reads as a network rather than a grid. */
for (let n = 0; n < 6; n++) {
  const i = Math.floor(rnd() * nodes.length);
  const j = Math.floor(rnd() * nodes.length);
  const k = key(i, j);
  if (i === j || seen.has(k)) continue;
  const d = dist(nodes[i], nodes[j]);
  if (d < 240 || d > 620) continue;
  seen.add(k);
  links.push([i, j]);
}

/* ------------------------------------------------------------------ markup */

const line = (cls, [i, j], extra = "") => {
  const a = nodes[i];
  const b = nodes[j];
  return `<line class="${cls}" x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}"
x2="${b.x.toFixed(1)}" y2="${b.y.toFixed(1)}" pathLength="100"${extra}/>`;
};

const wires = links.map((l) => line("wire", l)).join("");

/* Every third link carries a travelling pulse, on its own timing. */
const pulses = links
  .filter((_, i) => i % 3 === 0)
  .map((l, i) =>
    line(
      "pulse",
      l,
      ` style="--d:${between(3.4, 7).toFixed(2)}s;--dl:${(i * 0.62).toFixed(2)}s"`,
    ),
  )
  .join("");

const dots = nodes
  .map(
    (n, i) =>
      `<circle class="dot${i % 4 === 0 ? " lit" : ""}" cx="${n.x.toFixed(1)}"
cy="${n.y.toFixed(1)}" r="${n.r.toFixed(1)}" style="--dl:${(i * 0.31).toFixed(2)}s"/>`,
  )
  .join("");

/* Three nodes ping outward, the way a discovery sweep looks on a console. */
const pings = [3, 11, 19]
  .filter((i) => nodes[i])
  .map(
    (i, n) =>
      `<circle class="ping" cx="${nodes[i].x.toFixed(1)}" cy="${nodes[i].y.toFixed(1)}"
r="3" style="--dl:${(n * 2.4).toFixed(1)}s"/>`,
  )
  .join("");

export const netviz = `<svg class="netviz" viewBox="0 0 ${W} ${H}"
preserveAspectRatio="xMidYMid slice" aria-hidden="true" fill="none">
<g class="wires">${wires}</g>
<g class="pulses">${pulses}</g>
<g class="pings">${pings}</g>
<g class="dots">${dots}</g>
</svg>`;

export const netvizCss = `
/* ---- animated network mesh (partners hero) ---- */
.netfield{position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden}
/* The mesh is the structure on this hero, so the ambient arcs step back. */
.hero-net .arcs{opacity:.22}
.netviz{position:absolute;inset:0;width:100%;height:100%;
/* Fade the mesh out behind the headline so the type never fights it. */
-webkit-mask-image:radial-gradient(62% 64% at 33% 48%,
  transparent 8%,rgba(0,0,0,.5) 40%,#000 74%);
mask-image:radial-gradient(62% 64% at 33% 48%,
  transparent 8%,rgba(0,0,0,.5) 40%,#000 74%)}

.wire{stroke:rgba(120,190,240,.17);stroke-width:1}
.pulse{stroke:var(--blue-glow);stroke-width:1.9;stroke-linecap:round;
stroke-dasharray:14 200;animation:flow var(--d,5s) linear var(--dl,0s) infinite}
.pulses{filter:drop-shadow(0 0 5px rgba(122,212,255,.85))}
.dot{fill:#7fc6f0;opacity:.5}
.dot.lit{fill:#d6f1ff;opacity:.9;animation:breathe 4.6s ease-in-out var(--dl,0s) infinite}
.dots{filter:drop-shadow(0 0 6px rgba(63,184,245,.7))}
.ping{fill:none;stroke:var(--blue-lift);stroke-width:1.2;transform-origin:center;
animation:ping 7.2s ease-out var(--dl,0s) infinite}

@keyframes flow{from{stroke-dashoffset:14}to{stroke-dashoffset:-100}}
@keyframes breathe{0%,100%{opacity:.45}50%{opacity:1}}
@keyframes ping{
  0%{r:3;opacity:.75}
  55%{r:52;opacity:0}
  100%{r:52;opacity:0}
}

@media (prefers-reduced-motion:reduce){
  .pulse,.dot.lit,.ping{animation:none}
  .ping{opacity:.25}
}`;
