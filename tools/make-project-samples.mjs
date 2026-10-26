/*
 * Generates the SAMPLE project pictures in seed-assets/projects/<slug>/.
 *
 * Run: node tools/make-project-samples.mjs
 *
 * These are abstract vector scenes (server racks, networks, classrooms, power
 * plant, dashboards ...) drawn here as SVG and rasterised with sharp. They are
 * illustrations, not photographs of any real project, and the seed labels them
 * as samples so editors know to replace them. Output is deterministic.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "seed-assets", "projects");
const W = 1600;
const H = 1000;

/* mulberry32, so every run draws the same pictures */
const rng = (seed) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/* Palettes: all in the Edge blue family, each with a different depth. */
const THEMES = {
  ocean: { bg1: "#04283d", bg2: "#0a5d8c", mid: "#0888c5", light: "#7fd0f2", pale: "#d9f1fb", warm: "#ffc857" },
  night: { bg1: "#071a2b", bg2: "#0b3b5e", mid: "#1692d0", light: "#8bdcf6", pale: "#e1f5fc", warm: "#ffb84d" },
  teal: { bg1: "#05303a", bg2: "#08708a", mid: "#0aa0c4", light: "#8be6e6", pale: "#dcf7f5", warm: "#ffd166" },
  dawn: { bg1: "#0b2e4a", bg2: "#2a7ab0", mid: "#0888c5", light: "#a9e0f7", pale: "#eaf7fd", warm: "#ffb36b" },
};

const defs = (t) => `
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${t.bg1}"/><stop offset="1" stop-color="${t.bg2}"/></linearGradient>
  <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.mid}" stop-opacity=".30"/><stop offset="1" stop-color="${t.bg1}" stop-opacity="0"/></linearGradient>
  <linearGradient id="panel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.light}" stop-opacity=".22"/><stop offset="1" stop-color="${t.mid}" stop-opacity=".08"/></linearGradient>
  <linearGradient id="metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#17435f"/><stop offset=".5" stop-color="#245f84"/><stop offset="1" stop-color="#143a53"/></linearGradient>
  <radialGradient id="glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${t.light}" stop-opacity=".55"/><stop offset="1" stop-color="${t.light}" stop-opacity="0"/></radialGradient>
  <filter id="blur"><feGaussianBlur stdDeviation="14"/></filter>
  <filter id="soft"><feGaussianBlur stdDeviation="2"/></filter>
</defs>`;

const frame = (t, body, r) => {
  const dots = Array.from({ length: 46 }, () => {
    const x = r() * W;
    const y = r() * H;
    return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(1 + r() * 2.4).toFixed(1)}" fill="${t.light}" opacity="${(0.1 + r() * 0.25).toFixed(2)}"/>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${defs(t)}
<rect width="${W}" height="${H}" fill="url(#bg)"/>
<circle cx="${(0.2 + r() * 0.6) * W}" cy="${0.2 * H}" r="420" fill="url(#glow)"/>
${dots}${body}</svg>`;
};

/* ------------------------------------------------------------------ pieces */

const led = (x, y, c, on = true) =>
  `<circle cx="${x}" cy="${y}" r="4" fill="${on ? c : "#2c5873"}"/>${on ? `<circle cx="${x}" cy="${y}" r="9" fill="${c}" opacity=".25"/>` : ""}`;

function rack(x, y, w, h, t, r, units = 9) {
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="url(#metal)" stroke="${t.light}" stroke-opacity=".35" stroke-width="2"/>`;
  const uh = (h - 40) / units;
  for (let i = 0; i < units; i++) {
    const uy = y + 20 + i * uh;
    s += `<rect x="${x + 12}" y="${uy + 3}" width="${w - 24}" height="${uh - 8}" rx="3" fill="#0a2a40" stroke="${t.mid}" stroke-opacity=".5"/>`;
    for (let k = 0; k < 6; k++) s += `<rect x="${x + 22 + k * 11}" y="${uy + uh / 2 - 4}" width="6" height="6" rx="1" fill="${t.light}" opacity="${0.15 + r() * 0.2}"/>`;
    s += led(x + w - 30, uy + uh / 2 - 1, r() > 0.25 ? t.light : t.warm, r() > 0.15);
    s += led(x + w - 48, uy + uh / 2 - 1, "#6df0a8", r() > 0.3);
  }
  return s;
}

const cable = (x1, y1, x2, y2, c, sag = 60) =>
  `<path d="M${x1} ${y1} C ${x1} ${y1 + sag}, ${x2} ${y2 + sag}, ${x2} ${y2}" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round" opacity=".7"/>`;

const card = (x, y, w, h, t, rx = 18) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="url(#panel)" stroke="${t.light}" stroke-opacity=".4" stroke-width="2"/>`;

function bars(x, y, w, h, t, r, n = 8, hot = false) {
  let s = "";
  const bw = w / n;
  for (let i = 0; i < n; i++) {
    const bh = h * (0.25 + r() * 0.7);
    s += `<rect x="${x + i * bw + 5}" y="${y + h - bh}" width="${bw - 10}" height="${bh}" rx="4" fill="${hot && i === n - 3 ? t.warm : t.light}" opacity="${0.55 + r() * 0.4}"/>`;
  }
  return s;
}

function line(x, y, w, h, t, r, c) {
  const pts = Array.from({ length: 9 }, (_, i) => [x + (w / 8) * i, y + h * (0.2 + r() * 0.65)]);
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(0)} ${p[1].toFixed(0)}`).join(" ");
  return `<path d="${d} L${x + w} ${y + h} L${x} ${y + h} Z" fill="${c ?? t.mid}" opacity=".25"/><path d="${d}" fill="none" stroke="${c ?? t.light}" stroke-width="5" stroke-linejoin="round"/>`;
}

const gauge = (cx, cy, rad, t, v, label) => {
  const a = Math.PI * (1 + v);
  const nx = cx + Math.cos(a) * (rad - 14);
  const ny = cy + Math.sin(a) * (rad - 14);
  return `<path d="M${cx - rad} ${cy} A${rad} ${rad} 0 0 1 ${cx + rad} ${cy}" fill="none" stroke="${t.mid}" stroke-opacity=".5" stroke-width="16" stroke-linecap="round"/>
<path d="M${cx - rad} ${cy} A${rad} ${rad} 0 0 1 ${nx.toFixed(0)} ${ny.toFixed(0)}" fill="none" stroke="${t.light}" stroke-width="16" stroke-linecap="round"/>
<circle cx="${cx}" cy="${cy}" r="12" fill="${t.pale}"/>${label ?? ""}`;
};

/* ------------------------------------------------------------------ scenes */

const SCENES = {
  /* A front-on row of racks with cabling, on a lit floor. */
  racks(t, r) {
    let s = `<rect y="700" width="${W}" height="300" fill="url(#floor)"/>`;
    const n = 7;
    const rw = 170;
    const gap = (W - n * rw) / (n + 1);
    for (let i = 0; i < n; i++) {
      const x = gap + i * (rw + gap);
      const h = 520 + (i % 2) * 40;
      s += `<ellipse cx="${x + rw / 2}" cy="${160 + 130 + h - 130 + 110}" rx="${rw * 0.7}" ry="16" fill="#000" opacity=".25"/>`;
      s += rack(x, 700 - h + 100, rw, h, t, r, 10);
    }
    for (let i = 0; i < n - 1; i++) {
      const x1 = gap + i * (rw + gap) + rw;
      s += cable(x1 - 20, 250 + (i % 3) * 30, x1 + gap + 20, 250 + ((i + 1) % 3) * 30, i % 2 ? t.light : t.warm, 90);
    }
    s += `<rect x="${gap}" y="170" width="${W - 2 * gap}" height="14" rx="7" fill="${t.light}" opacity=".35"/>`;
    return s;
  },

  /* A corridor between two rows of racks, converging on a lit end wall. */
  aisle(t, r) {
    const vx = W / 2;
    const vy = 430;
    let s = `<polygon points="0,${H} ${W},${H} ${vx + 90},${vy + 60} ${vx - 90},${vy + 60}" fill="url(#floor)"/>`;
    s += `<rect x="${vx - 90}" y="${vy - 90}" width="180" height="150" fill="${t.pale}" opacity=".85"/><rect x="${vx - 90}" y="${vy - 90}" width="180" height="150" fill="url(#glow)"/>`;
    for (const side of [-1, 1]) {
      for (let i = 0; i < 6; i++) {
        const k = i / 6;
        const nextk = (i + 1) / 6;
        const e = (q) => Math.pow(q, 1.6);
        const xa = vx + side * (90 + (1 - e(k)) * 640);
        const xb = vx + side * (90 + (1 - e(nextk)) * 640);
        const ha = 120 + (1 - e(k)) * 600;
        const hb = 120 + (1 - e(nextk)) * 600;
        const ya = vy + 60 - ha * 0.55 + (1 - e(k)) * 150;
        const yb = vy + 60 - hb * 0.55 + (1 - e(nextk)) * 150;
        s += `<polygon points="${xa},${ya} ${xb},${yb} ${xb},${yb + hb} ${xa},${ya + ha}" fill="${i % 2 ? "#123f5c" : "#17496a"}" stroke="${t.light}" stroke-opacity=".35" stroke-width="2"/>`;
        for (let u = 0; u < 5; u++) {
          const f = (u + 0.5) / 5;
          const lx = xa + (xb - xa) * 0.5;
          const ly = (ya + (ya + ha) * 0 ) + ha * f + (yb - ya) * 0.5;
          s += led(lx, ly, r() > 0.2 ? t.light : t.warm, r() > 0.1);
        }
      }
    }
    s += `<polygon points="${vx - 70},${H} ${vx + 70},${H} ${vx + 18},${vy + 70} ${vx - 18},${vy + 70}" fill="${t.light}" opacity=".1"/>`;
    return s;
  },

  /* Nodes and links around a core switch. */
  network(t, r) {
    const cx = W / 2;
    const cy = H / 2;
    const ring = (rad, n, off) =>
      Array.from({ length: n }, (_, i) => {
        const a = off + (Math.PI * 2 * i) / n;
        return [cx + Math.cos(a) * rad * 1.35, cy + Math.sin(a) * rad * 0.85];
      });
    const inner = ring(210, 4 + Math.floor(r() * 4), r() * 3);
    const outer = ring(400, 8 + Math.floor(r() * 6), r() * 3);
    let s = `<circle cx="${cx}" cy="${cy}" r="${430}" fill="url(#glow)"/>`;
    for (const o of outer) {
      const near = inner.reduce((b, n) => (Math.hypot(n[0] - o[0], n[1] - o[1]) < Math.hypot(b[0] - o[0], b[1] - o[1]) ? n : b));
      s += `<line x1="${o[0]}" y1="${o[1]}" x2="${near[0]}" y2="${near[1]}" stroke="${t.light}" stroke-opacity=".5" stroke-width="3"/>`;
    }
    for (const n of inner) s += `<line x1="${cx}" y1="${cy}" x2="${n[0]}" y2="${n[1]}" stroke="${t.light}" stroke-opacity=".7" stroke-width="5"/>`;
    for (const o of outer) {
      s += `<g transform="translate(${o[0] - 30},${o[1] - 22})"><rect width="60" height="44" rx="8" fill="#0a2a40" stroke="${t.light}" stroke-opacity=".7" stroke-width="2.5"/><rect x="8" y="8" width="44" height="22" rx="3" fill="${t.mid}" opacity=".6"/><rect x="22" y="34" width="16" height="4" fill="${t.light}"/></g>`;
    }
    for (const n of inner) {
      s += `<circle cx="${n[0]}" cy="${n[1]}" r="34" fill="#0a2a40" stroke="${t.light}" stroke-width="4"/><circle cx="${n[0]}" cy="${n[1]}" r="14" fill="${t.light}"/>`;
    }
    s += `<circle cx="${cx}" cy="${cy}" r="86" fill="#0a2a40" stroke="${t.warm}" stroke-width="5"/><circle cx="${cx}" cy="${cy}" r="86" fill="url(#glow)"/>`;
    s += `<g stroke="${t.pale}" stroke-width="7" stroke-linecap="round" fill="none"><path d="M${cx - 38} ${cy - 14}h76M${cx - 38} ${cy + 14}h76M${cx + 22} ${cy - 30}l16 16-16 16M${cx - 22} ${cy - 2}l-16 16 16 16"/></g>`;
    return s;
  },

  /* A classroom: front display, teacher's desk, rows of student desks. */
  classroom(t, r) {
    let s = `<rect y="640" width="${W}" height="360" fill="url(#floor)"/>`;
    s += card(380, 120, 840, 440, t, 24);
    s += `<rect x="410" y="150" width="780" height="380" rx="14" fill="#06304a"/>`;
    s += `<g>${bars(450, 330, 340, 170, t, r, 7, true)}</g>`;
    s += `<g>${line(830, 190, 320, 140, t, r)}</g>`;
    s += `<rect x="830" y="360" width="320" height="22" rx="11" fill="${t.light}" opacity=".5"/><rect x="830" y="400" width="240" height="22" rx="11" fill="${t.light}" opacity=".3"/><rect x="830" y="440" width="280" height="22" rx="11" fill="${t.light}" opacity=".3"/>`;
    s += `<circle cx="480" cy="230" r="34" fill="${t.warm}" opacity=".9"/><rect x="540" y="214" width="220" height="14" rx="7" fill="${t.pale}" opacity=".8"/><rect x="540" y="242" width="150" height="12" rx="6" fill="${t.pale}" opacity=".5"/>`;
    s += `<rect x="700" y="580" width="200" height="14" rx="7" fill="${t.light}" opacity=".6"/><rect x="760" y="594" width="80" height="30" fill="#0a2a40"/>`;
    for (let row = 0; row < 3; row++) {
      for (let c = 0; c < 6; c++) {
        const k = 1 - row * 0.12;
        const x = 190 + c * 220 * k + row * 20 + (1 - k) * 600;
        const y = 700 + row * 100;
        const w = 160 * k;
        s += `<rect x="${x}" y="${y}" width="${w}" height="${34 * k}" rx="6" fill="#17496a" stroke="${t.light}" stroke-opacity=".6" stroke-width="2"/>`;
        s += `<rect x="${x + w * 0.3}" y="${y - 40 * k}" width="${w * 0.4}" height="${28 * k}" rx="4" fill="${t.mid}" opacity=".75"/>`;
        s += `<circle cx="${x + w / 2}" cy="${y - 62 * k}" r="${18 * k}" fill="${r() > 0.5 ? t.pale : t.light}" opacity=".85"/>`;
      }
    }
    return s;
  },

  /* A meeting room: oval table, wall display, laptops and participants. */
  meeting(t, r) {
    let s = `<rect y="660" width="${W}" height="340" fill="url(#floor)"/>`;
    s += card(250, 100, 1100, 430, t, 26);
    s += `<rect x="280" y="130" width="540" height="370" rx="14" fill="#06304a"/>`;
    for (let i = 0; i < 4; i++) {
      const x = 300 + (i % 2) * 255;
      const y = 150 + Math.floor(i / 2) * 175;
      s += `<rect x="${x}" y="${y}" width="240" height="160" rx="10" fill="${t.bg2}" stroke="${t.light}" stroke-opacity=".5" stroke-width="2"/><circle cx="${x + 120}" cy="${y + 66}" r="30" fill="${t.light}" opacity=".7"/><path d="M${x + 60} ${y + 150}q60 -70 120 0z" fill="${t.light}" opacity=".6"/>`;
    }
    s += `<rect x="860" y="130" width="460" height="370" rx="14" fill="#06304a"/>${line(890, 170, 400, 160, t, r)}${bars(890, 360, 400, 110, t, r, 9)}`;
    s += `<ellipse cx="800" cy="780" rx="560" ry="120" fill="#17496a" stroke="${t.light}" stroke-opacity=".7" stroke-width="3"/><ellipse cx="800" cy="765" rx="520" ry="100" fill="${t.mid}" opacity=".35"/>`;
    for (let i = 0; i < 7; i++) {
      const a = (Math.PI * 2 * i) / 7;
      const x = 800 + Math.cos(a) * 640;
      const y = 770 + Math.sin(a) * 175;
      s += `<circle cx="${x}" cy="${y - 50}" r="36" fill="${i % 3 ? t.pale : t.light}" opacity=".85"/><path d="M${x - 56} ${y + 30}q56 -90 112 0z" fill="${t.light}" opacity=".6"/>`;
    }
    for (let i = 0; i < 4; i++) s += `<rect x="${560 + i * 130}" y="750" width="70" height="42" rx="4" fill="#0a2a40" stroke="${t.light}" stroke-width="2"/><rect x="${568 + i * 130}" y="756" width="54" height="28" fill="${t.light}" opacity=".5"/>`;
    return s;
  },

  /* A bank branch facade: pediment, columns, doors, ATM bay. */
  bank(t, r) {
    let s = `<rect y="780" width="${W}" height="220" fill="url(#floor)"/>`;
    s += `<polygon points="260,300 800,130 1340,300" fill="#17496a" stroke="${t.light}" stroke-width="4"/><circle cx="800" cy="240" r="46" fill="${t.warm}" opacity=".9"/><path d="M780 240h40M800 220v40" stroke="${t.bg1}" stroke-width="7"/>`;
    s += `<rect x="260" y="300" width="1080" height="40" fill="${t.mid}"/>`;
    for (let i = 0; i < 6; i++) s += `<rect x="${300 + i * 190}" y="340" width="56" height="420" rx="6" fill="url(#metal)" stroke="${t.light}" stroke-opacity=".5" stroke-width="2"/>`;
    s += `<rect x="260" y="760" width="1080" height="36" fill="${t.mid}"/><rect x="220" y="796" width="1160" height="30" fill="#17496a"/>`;
    s += `<rect x="670" y="520" width="260" height="240" rx="10" fill="#06304a" stroke="${t.light}" stroke-width="3"/><line x1="800" y1="520" x2="800" y2="760" stroke="${t.light}" stroke-width="3"/><rect x="690" y="540" width="100" height="200" fill="${t.light}" opacity=".18"/><rect x="810" y="540" width="100" height="200" fill="${t.light}" opacity=".18"/>`;
    s += `<rect x="420" y="520" width="190" height="240" rx="10" fill="#06304a" stroke="${t.warm}" stroke-width="3"/><rect x="450" y="550" width="130" height="80" rx="6" fill="${t.mid}" opacity=".8"/><rect x="470" y="660" width="90" height="14" rx="3" fill="${t.light}"/><circle cx="515" cy="705" r="10" fill="${t.warm}"/>`;
    s += `<rect x="990" y="520" width="190" height="240" rx="10" fill="#06304a" stroke="${t.light}" stroke-width="3"/>${bars(1010, 560, 150, 120, t, r, 5)}`;
    s += `<path d="M180 190q120 -90 240 0" fill="none" stroke="${t.light}" stroke-opacity=".5" stroke-width="4"/><circle cx="260" cy="150" r="9" fill="${t.light}" opacity=".6"/>`;
    return s;
  },

  /* Backup: database cylinders feeding a cloud, with sync arrows. */
  backup(t, r) {
    const cyl = (x, y, w, h, c) =>
      `<path d="M${x} ${y}v${h}a${w / 2} 26 0 0 0 ${w} 0v${-h}" fill="#0f3a56" stroke="${c}" stroke-width="3"/><ellipse cx="${x + w / 2}" cy="${y}" rx="${w / 2}" ry="26" fill="#17496a" stroke="${c}" stroke-width="3"/>` +
      [1, 2, 3].map((k) => `<path d="M${x} ${y + (h / 4) * k}a${w / 2} 26 0 0 0 ${w} 0" fill="none" stroke="${c}" stroke-opacity=".55" stroke-width="2.5"/>`).join("") +
      `<circle cx="${x + w - 26}" cy="${y + h - 36}" r="6" fill="${t.warm}"/>`;
    let s = `<rect y="740" width="${W}" height="260" fill="url(#floor)"/>`;
    s += cyl(180, 400, 260, 300, t.light) + cyl(520, 330, 260, 370, t.light);
    s += `<g transform="translate(960,120)"><path d="M120 300c-90 0-110-110-20-130 10-100 150-130 210-50 80-30 150 40 120 110 60 10 60 70 0 70z" fill="url(#panel)" stroke="${t.light}" stroke-width="5"/><path d="M200 240l60-50 60 50M260 190v120" fill="none" stroke="${t.pale}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/></g>`;
    s += `<path d="M620 320C700 200 860 220 980 300" fill="none" stroke="${t.warm}" stroke-width="7" stroke-dasharray="4 18" stroke-linecap="round"/><path d="M960 292l22 12-24 14" fill="none" stroke="${t.warm}" stroke-width="7" stroke-linecap="round"/>`;
    s += cyl(960, 560, 300, 200, t.mid) + cyl(1310, 600, 190, 160, t.mid);
    s += `<path d="M850 640h90" stroke="${t.light}" stroke-width="6" stroke-dasharray="3 14" stroke-linecap="round"/><path d="M1270 690h30" stroke="${t.light}" stroke-width="6" stroke-linecap="round"/>`;
    s += `<g transform="translate(700 830)">${["#6df0a8", t.light, t.warm].map((c, i) => `<circle cx="${i * 36}" cy="0" r="9" fill="${c}"/>`).join("")}</g>`;
    return s;
  },

  /* A generator set beside a transformer, with pylons and a power flow. */
  power(t, r) {
    let s = `<rect y="760" width="${W}" height="240" fill="url(#floor)"/>`;
    // pylons
    for (const px of [140, 1480]) {
      s += `<path d="M${px} 780L${px + 40} 200L${px + 80} 780M${px + 8} 600h64M${px + 18} 440h44M${px - 30} 300h140" fill="none" stroke="${t.light}" stroke-opacity=".7" stroke-width="5" stroke-linecap="round"/>`;
    }
    s += `<path d="M110 300q600 160 1190 0" fill="none" stroke="${t.light}" stroke-opacity=".6" stroke-width="3"/><path d="M110 330q600 160 1190 0" fill="none" stroke="${t.light}" stroke-opacity=".4" stroke-width="3"/>`;
    // generator
    s += `<rect x="280" y="420" width="640" height="340" rx="22" fill="url(#metal)" stroke="${t.light}" stroke-width="4"/>`;
    for (let i = 0; i < 9; i++) s += `<rect x="${320 + i * 24}" y="460" width="10" height="150" rx="5" fill="#0a2a40" opacity=".8"/>`;
    s += `<rect x="580" y="450" width="300" height="120" rx="12" fill="#06304a"/>${gauge(660, 550, 50, t, 0.7)}${gauge(790, 550, 50, t, 0.45)}`;
    s += `<rect x="320" y="640" width="560" height="40" rx="8" fill="${t.mid}" opacity=".5"/><path d="M580 700h-20l36-64v44h22l-36 64z" transform="translate(-240 -30) scale(1.0)" fill="${t.warm}"/>`;
    s += `<rect x="360" y="370" width="46" height="70" rx="6" fill="#17496a" stroke="${t.light}" stroke-width="3"/><circle cx="383" cy="340" r="22" fill="${t.light}" opacity=".15"/><circle cx="400" cy="300" r="30" fill="${t.light}" opacity=".1"/>`;
    // transformer
    s += `<rect x="1000" y="500" width="260" height="260" rx="18" fill="url(#metal)" stroke="${t.light}" stroke-width="4"/>`;
    for (let i = 0; i < 7; i++) s += `<rect x="${1020 + i * 34}" y="530" width="18" height="180" rx="9" fill="#0a2a40" opacity=".85"/>`;
    for (const x of [1050, 1130, 1210]) s += `<rect x="${x - 12}" y="440" width="24" height="64" rx="6" fill="#17496a" stroke="${t.light}" stroke-width="3"/><path d="M${x} 440V380" stroke="${t.warm}" stroke-width="5"/>`;
    s += `<path d="M920 640h80" stroke="${t.warm}" stroke-width="8" stroke-dasharray="3 16" stroke-linecap="round"/>`;
    return s;
  },

  /* Three or four generators in a row (multi-site backup power). */
  generators(t, r) {
    let s = `<rect y="740" width="${W}" height="260" fill="url(#floor)"/>`;
    const cols = 3;
    for (let i = 0; i < cols; i++) {
      const x = 130 + i * 470;
      const y = 380 + (i === 1 ? -50 : 0);
      s += `<rect x="${x}" y="${y}" width="400" height="${330 + (i === 1 ? 50 : 0)}" rx="18" fill="url(#metal)" stroke="${t.light}" stroke-width="4"/>`;
      for (let k = 0; k < 5; k++) s += `<rect x="${x + 28}" y="${y + 36 + k * 22}" width="${200 - k * 8}" height="8" rx="4" fill="#0a2a40" opacity=".85"/>`;
      s += `<rect x="${x + 250}" y="${y + 30}" width="120" height="96" rx="8" fill="#06304a"/>${gauge(x + 310, y + 98, 38, t, 0.4 + i * 0.2)}`;
      s += `<path d="M${x + 150} ${y + 290}h-18l30 -66v44h20l-30 66z" fill="${t.warm}"/>`;
      s += `<circle cx="${x + 60}" cy="${y + 250}" r="8" fill="#6df0a8"/><circle cx="${x + 86}" cy="${y + 250}" r="8" fill="${t.light}"/>`;
      s += `<rect x="${x + 40}" y="${y - 70}" width="34" height="76" rx="6" fill="#17496a" stroke="${t.light}" stroke-width="3"/>`;
      s += `<circle cx="${x + 57}" cy="${y - 100}" r="20" fill="${t.light}" opacity=".15"/>`;
    }
    s += `<path d="M130 220h1330" stroke="${t.warm}" stroke-width="6" stroke-dasharray="3 16" stroke-linecap="round"/>`;
    for (let i = 0; i < cols; i++) s += `<path d="M${330 + i * 470} 220v110" stroke="${t.warm}" stroke-opacity=".6" stroke-width="5"/>`;
    return s;
  },

  /* A monitoring dashboard: tiles, charts, gauges and a status strip. */
  dashboard(t, r) {
    let s = card(120, 100, 1360, 800, t, 28);
    s += `<rect x="150" y="130" width="1300" height="64" rx="14" fill="#06304a"/><circle cx="190" cy="162" r="12" fill="${t.warm}"/><rect x="220" y="152" width="200" height="20" rx="10" fill="${t.light}" opacity=".6"/>`;
    for (let i = 0; i < 4; i++) s += led(1230 + i * 50, 162, i === 3 ? t.warm : "#6df0a8");
    const tiles = [
      [150, 220, 410, 250],
      [585, 220, 410, 250],
      [1020, 220, 430, 250],
    ];
    s += tiles
      .map(
        ([x, y, w, h], i) =>
          `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="#06304a" stroke="${t.light}" stroke-opacity=".3" stroke-width="2"/>` +
          (i === 0 ? line(x + 24, y + 50, w - 48, h - 90, t, r) : i === 1 ? bars(x + 24, y + 40, w - 48, h - 80, t, r, 9, true) : gauge(x + w / 2, y + 170, 110, t, 0.62)),
      )
      .join("");
    s += `<rect x="150" y="495" width="840" height="375" rx="16" fill="#06304a" stroke="${t.light}" stroke-opacity=".3" stroke-width="2"/>`;
    s += line(180, 530, 780, 160, t, r, t.light);
    s += line(180, 700, 780, 140, t, r, t.warm);
    for (let i = 0; i < 6; i++) s += `<rect x="1020" y="${495 + i * 63}" width="430" height="52" rx="12" fill="#06304a" stroke="${t.light}" stroke-opacity=".3" stroke-width="2"/>` + led(1050, 521 + i * 63, i === 4 ? t.warm : "#6df0a8") + `<rect x="1080" y="${511 + i * 63}" width="${150 + r() * 170}" height="14" rx="7" fill="${t.light}" opacity=".5"/>`;
    return s;
  },

  /* A campus with cameras: pole camera and field-of-view cones over buildings. */
  cctv(t, r) {
    let s = `<rect y="700" width="${W}" height="300" fill="url(#floor)"/>`;
    const bldg = (x, w, h) => {
      let b = `<rect x="${x}" y="${700 - h}" width="${w}" height="${h}" rx="6" fill="#123f5c" stroke="${t.light}" stroke-opacity=".5" stroke-width="2"/>`;
      for (let yy = 700 - h + 30; yy < 670; yy += 46) for (let xx = x + 22; xx < x + w - 30; xx += 44) b += `<rect x="${xx}" y="${yy}" width="24" height="26" rx="3" fill="${r() > 0.35 ? t.light : "#2c5873"}" opacity="${0.4 + r() * 0.4}"/>`;
      return b;
    };
    s += bldg(80, 260, 380) + bldg(380, 200, 270) + bldg(900, 300, 330) + bldg(1250, 250, 440);
    // camera cones
    s += `<polygon points="720,300 380,760 900,760" fill="${t.light}" opacity=".16"/><polygon points="720,300 520,760 780,760" fill="${t.light}" opacity=".12"/>`;
    s += `<path d="M720 300V190" stroke="${t.light}" stroke-width="12" stroke-linecap="round"/><path d="M720 700V300" stroke="#245f84" stroke-width="14"/>`;
    s += `<g transform="translate(720 190) rotate(18)"><rect x="-70" y="-30" width="140" height="60" rx="14" fill="url(#metal)" stroke="${t.light}" stroke-width="4"/><circle cx="62" cy="0" r="24" fill="#06304a" stroke="${t.warm}" stroke-width="5"/><circle cx="62" cy="0" r="9" fill="${t.warm}"/></g>`;
    s += led(690, 170, "#ff6b6b");
    // second camera
    s += `<g transform="translate(1100 380) rotate(-20)"><rect x="-50" y="-22" width="100" height="44" rx="10" fill="url(#metal)" stroke="${t.light}" stroke-width="3"/><circle cx="-44" cy="0" r="17" fill="#06304a" stroke="${t.warm}" stroke-width="4"/></g><polygon points="1100,380 800,740 1040,760" fill="${t.light}" opacity=".13"/>`;
    return s;
  },

  /* A security control room: video wall above a console. */
  controlroom(t, r) {
    let s = `<rect y="720" width="${W}" height="280" fill="url(#floor)"/>`;
    for (let row = 0; row < 2; row++)
      for (let c = 0; c < 4; c++) {
        const x = 150 + c * 340;
        const y = 110 + row * 250;
        s += `<rect x="${x}" y="${y}" width="320" height="230" rx="10" fill="#06304a" stroke="${t.light}" stroke-width="3"/>`;
        s += `<polygon points="${x + 20},${y + 200} ${x + 110},${y + 90} ${x + 190},${y + 150} ${x + 300},${y + 60} ${x + 300},${y + 210} ${x + 20},${y + 210}" fill="${t.mid}" opacity=".35"/>`;
        s += `<circle cx="${x + 36}" cy="${y + 32}" r="8" fill="${r() > 0.7 ? t.warm : "#ff6b6b"}"/><rect x="${x + 56}" y="${y + 26}" width="80" height="12" rx="6" fill="${t.light}" opacity=".5"/>`;
      }
    s += `<path d="M120 760h1360l-60 120H180z" fill="#17496a" stroke="${t.light}" stroke-opacity=".6" stroke-width="3"/>`;
    for (let i = 0; i < 3; i++) s += `<rect x="${360 + i * 330}" y="770" width="200" height="14" rx="7" fill="${t.light}" opacity=".5"/>`;
    for (let i = 0; i < 3; i++) {
      const x = 330 + i * 450;
      s += `<circle cx="${x}" cy="690" r="34" fill="${t.pale}" opacity=".8"/><path d="M${x - 70} 770q70 -130 140 0z" fill="${t.light}" opacity=".6"/>`;
    }
    return s;
  },
};

/* --------------------------------------------------------------- the plan */

const PLAN = {
  "bahir-dar-university-smart-classrooms": { theme: "dawn", pics: ["classroom", "dashboard", "network", "meeting"] },
  "bahir-dar-university-safe-campus": { theme: "night", pics: ["cctv", "controlroom", "network", "racks"] },
  "gadaa-bank-computing-infrastructure": { theme: "ocean", pics: ["aisle", "racks", "network", "dashboard"] },
  "national-bank-ethiopia-backup-infrastructure": { theme: "teal", pics: ["backup", "aisle", "racks", "network"] },
  "ministry-urban-infrastructure-computing": { theme: "night", pics: ["network", "racks", "dashboard", "aisle"] },
  "siinqee-bank-datacenter-power": { theme: "ocean", pics: ["power", "racks", "dashboard", "bank"] },
  "arba-minch-university-smart-meeting-rooms": { theme: "teal", pics: ["meeting", "dashboard", "classroom", "network"] },
  "zemen-bank-generator-solutions": { theme: "dawn", pics: ["generators", "power", "bank", "dashboard"] },
};

const NAMES = ["cover", "g1", "g2", "g3"];

let total = 0;
let seed = 7;
for (const [slug, plan] of Object.entries(PLAN)) {
  const dir = path.join(OUT, slug);
  fs.mkdirSync(dir, { recursive: true });
  for (let i = 0; i < plan.pics.length; i++) {
    seed += 13;
    const r = rng(seed);
    const svg = frame(THEMES[plan.theme], SCENES[plan.pics[i]](THEMES[plan.theme], r), r);
    const cover = i === 0;
    const file = path.join(dir, `${NAMES[i]}.jpg`);
    const buf = await sharp(Buffer.from(svg))
      .resize(cover ? 1600 : 1200, cover ? 1000 : 750)
      .jpeg({ quality: 78, mozjpeg: true, chromaSubsampling: "4:2:0" })
      .toBuffer();
    fs.writeFileSync(file, buf);
    total += buf.length;
    console.log(`${slug}/${NAMES[i]}.jpg  ${plan.pics[i]}  ${(buf.length / 1024).toFixed(0)} KB`);
  }
}
console.log(`total ${(total / 1024).toFixed(0)} KB`);
