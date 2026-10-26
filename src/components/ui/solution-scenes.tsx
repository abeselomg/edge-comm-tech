/*
 * Hand-built isometric scenes, one per solution family: the fallback art for a
 * solution page until a real image lands in public/solutions/art.
 *
 * Everything is inline SVG on a 480x420 canvas. Objects are built from
 * extruded isometric boxes and cylinders with three face shades (top lightest,
 * the y-facing side mid, the x-facing side darkest). Layer classes drive the
 * CSS motion: eg-sv-l1 / eg-sv-l2 float at different depths, eg-sv-pulse
 * breathes a glow, eg-sv-shadow scales inversely to the float. Purely
 * decorative: no <text>, no titles.
 */

import type { ReactNode } from "react";

/* ---- projection and colour ------------------------------------------- */

const U = 26;
const OX = 240;
const OY = 262;
type Pt = [number, number];

/** Isometric (x, y, z) in tile units -> canvas px. x runs right-down, y left-down, z up. */
export function P(x: number, y: number, z: number): Pt {
  return [OX + (x - y) * 0.866 * U, OY + (x + y) * 0.5 * U - z * U];
}
const pts = (a: Pt[]) => a.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");

const hexToRgb = (h: string): [number, number, number] => {
  const n = parseInt(h.replace("#", "").slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
/** Blend `hex` toward `to` by t (0..1). */
export function mix(hex: string, to: string, t: number): string {
  const a = hexToRgb(hex);
  const b = hexToRgb(to);
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * t));
  return `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

type Pal = { top: string; left: string; right: string; edge: string };
const pal = (base: string): Pal => ({
  top: mix(base, "#ffffff", 0.42),
  left: base,
  right: mix(base, "#0a2540", 0.4),
  edge: mix(base, "#ffffff", 0.78),
});

const NAVY = "#0a2540";
const CYAN = "#5fe3ff";
const WARM = "#ffb454";
const PLATFORM = "#cfe3ee";
const SHELL = "#e4eef5";

/* ---- primitives ------------------------------------------------------- */

function Box({
  x,
  y,
  z,
  w,
  d,
  h,
  c,
}: {
  x: number;
  y: number;
  z: number;
  w: number;
  d: number;
  h: number;
  c: Pal;
}) {
  const top = [P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)];
  const left = [P(x, y + d, z + h), P(x + w, y + d, z + h), P(x + w, y + d, z), P(x, y + d, z)];
  const right = [P(x + w, y, z + h), P(x + w, y + d, z + h), P(x + w, y + d, z), P(x + w, y, z)];
  return (
    <g>
      <polygon points={pts(left)} fill={c.left} />
      <polygon points={pts(right)} fill={c.right} />
      <polygon points={pts(top)} fill={c.top} />
      <polyline
        points={pts([top[3], top[2], top[1]])}
        fill="none"
        stroke={c.edge}
        strokeWidth="1"
        opacity=".7"
      />
    </g>
  );
}

/** A quad on the y-facing (lower-left) face of a box at plane y. */
const lq = (y: number, x0: number, x1: number, z0: number, z1: number) =>
  pts([P(x0, y, z1), P(x1, y, z1), P(x1, y, z0), P(x0, y, z0)]);
/** A quad on the x-facing (lower-right) face of a box at plane x. */
const rq = (x: number, y0: number, y1: number, z0: number, z1: number) =>
  pts([P(x, y0, z1), P(x, y1, z1), P(x, y1, z0), P(x, y0, z0)]);
/** A flat quad lying on a horizontal plane z. */
const fq = (z: number, x0: number, x1: number, y0: number, y1: number) =>
  pts([P(x0, y0, z), P(x1, y0, z), P(x1, y1, z), P(x0, y1, z)]);

function Cyl({
  x,
  y,
  z,
  r,
  h,
  c,
  grad,
}: {
  x: number;
  y: number;
  z: number;
  r: number;
  h: number;
  c: Pal;
  grad: string;
}) {
  const [cx, yb] = P(x, y, z);
  const yt = yb - h * U;
  const rx = r * U * 1.2247;
  const ry = r * U * 0.7071;
  return (
    <g>
      <path
        d={`M${cx - rx},${yb} L${cx - rx},${yt} A${rx},${ry} 0 0 0 ${cx + rx},${yt} L${cx + rx},${yb} A${rx},${ry} 0 0 1 ${cx - rx},${yb}Z`}
        fill={`url(#${grad})`}
      />
      <ellipse cx={cx} cy={yt} rx={rx} ry={ry} fill={c.top} />
      <ellipse cx={cx} cy={yt} rx={rx} ry={ry} fill="none" stroke={c.edge} opacity=".7" />
    </g>
  );
}

/** A circle on the floor plane, as an isometric ellipse. */
function Ring({
  x,
  y,
  z = 0.02,
  r,
  stroke,
  className,
  sw = 2,
  style,
}: {
  x: number;
  y: number;
  z?: number;
  r: number;
  stroke: string;
  className?: string;
  sw?: number;
  style?: React.CSSProperties;
}) {
  const [cx, cy] = P(x, y, z);
  return (
    <ellipse
      cx={cx}
      cy={cy}
      rx={r * U * 1.2247}
      ry={r * U * 0.7071}
      fill="none"
      stroke={stroke}
      strokeWidth={sw}
      className={className}
      style={style}
    />
  );
}

const delay = (s: number): React.CSSProperties => ({ animationDelay: `${s}s` });

/* ---- the stage every scene stands on ---------------------------------- */

function Stage({ id, accent, children }: { id: string; accent: string; children: ReactNode }) {
  const glow = mix(accent, CYAN, 0.55);
  const tile = mix(accent, "#ffffff", 0.62);
  const grid: ReactNode[] = [];
  for (let i = -3; i <= 3; i += 1.9) {
    grid.push(
      <line key={`a${i}`} x1={P(i, -3.8, 0.01)[0]} y1={P(i, -3.8, 0.01)[1]} x2={P(i, 3.8, 0.01)[0]} y2={P(i, 3.8, 0.01)[1]} />,
      <line key={`b${i}`} x1={P(-3.8, i, 0.01)[0]} y1={P(-3.8, i, 0.01)[1]} x2={P(3.8, i, 0.01)[0]} y2={P(3.8, i, 0.01)[1]} />,
    );
  }
  return (
    <svg
      viewBox="30 50 420 350"
      className="eg-sv-svg"
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor={glow} stopOpacity=".7" />
          <stop offset="1" stopColor={glow} stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-blur`} x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <linearGradient id={`${id}-cyl`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={mix(accent, "#ffffff", 0.35)} />
          <stop offset=".55" stopColor={accent} />
          <stop offset="1" stopColor={mix(accent, NAVY, 0.45)} />
        </linearGradient>
        <linearGradient id={`${id}-cylw`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={mix(WARM, "#ffffff", 0.45)} />
          <stop offset=".55" stopColor={WARM} />
          <stop offset="1" stopColor={mix(WARM, NAVY, 0.45)} />
        </linearGradient>
        <linearGradient id={`${id}-cyln`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#f4f9fc" />
          <stop offset=".55" stopColor={SHELL} />
          <stop offset="1" stopColor="#8aa6bb" />
        </linearGradient>
        <linearGradient id={`${id}-body`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={mix(accent, "#ffffff", 0.55)} />
          <stop offset="1" stopColor={accent} />
        </linearGradient>
        <linearGradient id={`${id}-screen`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#12395c" />
          <stop offset="1" stopColor={mix(accent, NAVY, 0.5)} />
        </linearGradient>
      </defs>
      <ellipse className="eg-sv-shadow" cx={OX} cy={OY + 62} rx="190" ry="46" fill={NAVY} opacity=".38" filter={`url(#${id}-blur)`} />
      <ellipse className="eg-sv-pulse" cx={OX} cy={OY - 8} rx="232" ry="124" fill={`url(#${id}-glow)`} />
      <g className="eg-sv-l0">
        <Box x={-4.4} y={-4.4} z={-0.55} w={8.8} d={8.8} h={0.55} c={pal(PLATFORM)} />
        <polygon points={fq(0.01, -3.9, 3.9, -3.9, 3.9)} fill={tile} opacity=".85" />
        <g stroke="#ffffff" strokeWidth="1.2" opacity=".7">
          {grid}
        </g>
        <polyline
          points={pts([P(-4.4, 4.4, 0), P(4.4, 4.4, 0), P(4.4, -4.4, 0)])}
          fill="none"
          stroke={glow}
          strokeWidth="2.5"
          className="eg-sv-pulse"
        />
      </g>
      {children}
    </svg>
  );
}

/* ---- cybersecurity: shield and lock, firewall wall, monitor ---------- */

function Cybersecurity({ id, accent }: { id: string; accent: string }) {
  const a = pal(accent);
  const w = pal("#ff9a4a");
  const [sx, sy] = P(1.1, 1.3, 3.4);
  const shield =
    "M0,-72 C30,-52 54,-48 62,-48 V8 C62,46 32,66 0,80 C-32,66 -62,46 -62,8 V-48 C-54,-48 -30,-52 0,-72Z";
  return (
    <Stage id={id} accent={accent}>
      <g className="eg-sv-l1">
        {[
          [-0.6, 0],
          [0.8, 0],
          [2.2, 0],
        ].map(([x, z]) => (
          <Box key={`r1${x}`} x={x} y={-3.7} z={z} w={1.3} d={0.9} h={1.1} c={w} />
        ))}
        {[
          [0.1, 1.1],
          [1.5, 1.1],
        ].map(([x, z]) => (
          <Box key={`r2${x}`} x={x} y={-3.7} z={z} w={1.3} d={0.9} h={1.1} c={w} />
        ))}
        <Box x={0.8} y={-3.7} z={2.2} w={1.3} d={0.9} h={1.1} c={w} />
        <polygon points={fq(3.3, 0.8, 2.1, -3.7, -2.8)} fill={WARM} opacity=".5" className="eg-sv-pulse" />
      </g>
      <g className="eg-sv-l1" style={delay(-2)}>
        <Box x={-3.3} y={-0.9} z={0} w={0.8} d={1.5} h={0.14} c={pal(SHELL)} />
        <Box x={-3.15} y={-0.4} z={0.14} w={0.2} d={0.5} h={0.9} c={pal(SHELL)} />
        <Box x={-3.4} y={-2.2} z={1.0} w={0.4} d={3.4} h={2.3} c={pal(NAVY)} />
        <polygon points={rq(-3.0, -2.05, 1.05, 1.15, 3.15)} fill={`url(#${id}-screen)`} />
        {[0.5, 0.95, 1.4, 1.85].map((z, i) => (
          <polygon key={z} points={rq(-3.0, -1.8, -1.8 + [1.9, 1.3, 2.2, 0.9][i], z, z + 0.14)} fill={i === 1 ? WARM : CYAN} opacity=".85" />
        ))}
      </g>
      <ellipse cx={sx - 4} cy={sy + 88} rx="50" ry="14" fill={NAVY} opacity=".28" className="eg-sv-shadow" />
      <g className="eg-sv-l2">
        <g transform={`translate(${sx} ${sy})`}>
          <path d={shield} transform="translate(9 11)" fill={mix(accent, NAVY, 0.55)} />
          <path d={shield} fill={`url(#${id}-body)`} stroke="#ffffff" strokeOpacity=".7" strokeWidth="2" />
          <path d={shield} transform="scale(.8)" fill={a.right} opacity=".55" />
          <path d={shield} transform="scale(.8) translate(-2 -3)" fill={mix(accent, "#ffffff", 0.2)} />
          <path d="M-44,-34 C-20,-48 10,-52 30,-44" fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" opacity=".5" />
          <path d="M-14,-12 V-26 a14,14 0 0 1 28,0 V-12" fill="none" stroke={mix(WARM, NAVY, 0.25)} strokeWidth="8" strokeLinecap="round" transform="translate(0 6)" />
          <rect x="-24" y="-8" width="48" height="38" rx="8" fill={WARM} />
          <rect x="-24" y="14" width="48" height="16" rx="8" fill={mix(WARM, NAVY, 0.25)} opacity=".55" />
          <circle cx="0" cy="8" r="6" fill={NAVY} />
          <rect x="-2.5" y="10" width="5" height="12" rx="2" fill={NAVY} />
        </g>
      </g>
    </Stage>
  );
}

/* ---- enterprise network: switch hub, nodes, glowing links ------------ */

function EnterpriseNetwork({ id, accent }: { id: string; accent: string }) {
  const a = pal(accent);
  const nodes: [number, number][] = [
    [-3.4, -3.4],
    [2.3, -3.4],
    [-3.4, 2.3],
    [2.3, 2.3],
  ];
  const [gx, gy] = P(0, 0, 4.4);
  return (
    <Stage id={id} accent={accent}>
      <g className="eg-sv-l0">
        {nodes.map(([x, y], i) => {
          const c1 = P(x + 0.55, y + 0.55, 0.05);
          const mid = P(i % 2 === 0 ? x + 0.55 : 0, i % 2 === 0 ? 0 : y + 0.55, 0.05);
          const c0 = P(0, 0, 0.05);
          return (
            <polyline
              key={i}
              points={pts([c0, mid, c1])}
              fill="none"
              stroke={mix(accent, CYAN, 0.6)}
              strokeWidth="4"
              strokeLinejoin="round"
              strokeLinecap="round"
              className="eg-sv-pulse"
              style={delay(-i * 0.7)}
            />
          );
        })}
      </g>
      <g className="eg-sv-l1">
        {nodes.slice(0, 2).map(([x, y]) => (
          <Node key={`${x}${y}`} x={x} y={y} a={a} />
        ))}
        <Box x={-1.5} y={-1.5} z={0} w={3} d={3} h={0.8} c={pal(SHELL)} />
        <polygon points={fq(0.81, -1.2, 1.2, -1.2, 1.2)} fill={mix(accent, "#ffffff", 0.7)} />
        {[-0.9, -0.3, 0.3, 0.9].map((x) => (
          <polygon key={x} points={lq(1.5, x - 0.18, x + 0.18, 0.28, 0.5)} fill={NAVY} opacity=".75" />
        ))}
        {[-0.9, -0.3, 0.3, 0.9].map((y) => (
          <polygon key={y} points={rq(1.5, y - 0.18, y + 0.18, 0.28, 0.5)} fill={NAVY} opacity=".75" />
        ))}
        <circle cx={P(0.2, 1.5, 0.64)[0]} cy={P(0.2, 1.5, 0.64)[1]} r="2.6" fill={CYAN} className="eg-sv-pulse" />
        {nodes.slice(2).map(([x, y]) => (
          <Node key={`${x}${y}`} x={x} y={y} a={a} />
        ))}
      </g>
      <g className="eg-sv-l2">
        <line x1={gx} y1={gy + 18} x2={gx} y2={P(0, 0, 0.9)[1]} stroke={CYAN} strokeWidth="3" opacity=".6" className="eg-sv-pulse" />
        <ellipse cx={gx} cy={gy + 52} rx="38" ry="13" fill="none" stroke={CYAN} strokeWidth="2" className="eg-sv-pulse" />
        <circle cx={gx} cy={gy} r="34" fill={`url(#${id}-body)`} stroke="#ffffff" strokeOpacity=".6" strokeWidth="2" />
        <ellipse cx={gx} cy={gy} rx="34" ry="12" fill="none" stroke="#ffffff" strokeOpacity=".7" strokeWidth="2" />
        <ellipse cx={gx} cy={gy} rx="12" ry="34" fill="none" stroke="#ffffff" strokeOpacity=".7" strokeWidth="2" />
        <circle cx={gx - 11} cy={gy - 12} r="8" fill="#ffffff" opacity=".35" />
      </g>
    </Stage>
  );
}

function Node({ x, y, a }: { x: number; y: number; a: Pal }) {
  const [lx, ly] = P(x + 0.3, y + 1.1, 0.7);
  return (
    <g>
      <Box x={x} y={y} z={0} w={1.1} d={1.1} h={1.0} c={a} />
      <polygon points={lq(y + 1.1, x + 0.15, x + 0.95, 0.55, 0.8)} fill={NAVY} opacity=".5" />
      <circle cx={lx} cy={ly} r="2.2" fill={WARM} className="eg-sv-pulse" />
    </g>
  );
}

/* ---- system cloud: cloud over server stack with data arrows ---------- */

function SystemCloud({ id, accent }: { id: string; accent: string }) {
  const a = pal(accent);
  const [cx, cy] = P(0, 0, 4.6);
  const cloud =
    "M-62,28 a30,30 0 0 1 4,-59 a42,42 0 0 1 78,-12 a34,34 0 0 1 36,48 a22,22 0 0 1 -8,23z";
  return (
    <Stage id={id} accent={accent}>
      <g className="eg-sv-l1">
        {[0, 1, 2].map((i) => {
          const z = i * 0.95;
          return (
            <g key={i}>
              <Box x={-2.5} y={-1.2} z={z} w={4.2} d={3} h={0.8} c={i === 1 ? pal(SHELL) : a} />
              <polygon points={lq(1.8, -2.2, 0.1, z + 0.28, z + 0.5)} fill={NAVY} opacity=".55" />
              {[0.7, 1.1, 1.5].map((x) => (
                <circle key={x} cx={P(x, 1.8, z + 0.39)[0]} cy={P(x, 1.8, z + 0.39)[1]} r="2.3" fill={i === 1 ? CYAN : WARM} className="eg-sv-pulse" style={delay(-(i + x))} />
              ))}
            </g>
          );
        })}
      </g>
      <g className="eg-sv-l2">
        <g transform={`translate(${cx} ${cy})`}>
          <path d={cloud} transform="translate(8 10)" fill={mix(accent, NAVY, 0.5)} opacity=".55" />
          <path d={cloud} fill="#ffffff" stroke={mix(accent, "#ffffff", 0.4)} strokeWidth="2" />
          <path d="M-52,22 a24,24 0 0 1 2,-44 a36,36 0 0 1 40,-24" fill="none" stroke={mix(accent, "#ffffff", 0.7)} strokeWidth="5" strokeLinecap="round" opacity=".7" />
          <path d="M-44,26 H52" stroke={mix(accent, "#ffffff", 0.6)} strokeWidth="5" strokeLinecap="round" />
          <g className="eg-sv-pulse" fill={accent}>
            <path d="M-12,30 v34 m0 0 l-9,-9 m9,9 l9,-9" fill="none" stroke={accent} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" transform="translate(-10 4)" />
          </g>
          <g className="eg-sv-pulse" style={delay(-1.4)}>
            <path d="M12,62 v-34 m0,0 l-9,9 m9,-9 l9,9" fill="none" stroke={WARM} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" transform="translate(14 4)" />
          </g>
        </g>
      </g>
    </Stage>
  );
}

/* ---- datacenter: racks with status lights, cooling units ------------- */

function Datacenter({ id, accent }: { id: string; accent: string }) {
  const rack = pal(mix(accent, NAVY, 0.55));
  const racks = [-3.5, -1.8, -0.1];
  const leds = [CYAN, "#6df2a5", WARM];
  return (
    <Stage id={id} accent={accent}>
      <polygon points={fq(0.02, -3.6, 1.5, -2.0, -0.4)} fill={CYAN} opacity=".3" className="eg-sv-pulse" />
      <g className="eg-sv-l1">
        {racks.map((x, ri) => (
          <g key={x}>
            <Box x={x} y={-3.2} z={0} w={1.5} d={2} h={4.4} c={rack} />
            {[0, 1, 2, 3, 4].map((u) => {
              const z0 = 0.35 + u * 0.8;
              return (
                <g key={u}>
                  <polygon points={lq(-1.2, x + 0.12, x + 1.38, z0, z0 + 0.5)} fill={mix(accent, NAVY, 0.25)} />
                  {[0, 1].map((k) => (
                    <circle
                      key={k}
                      cx={P(x + 0.35 + k * 0.28, -1.2, z0 + 0.25)[0]}
                      cy={P(x + 0.35 + k * 0.28, -1.2, z0 + 0.25)[1]}
                      r="2"
                      fill={leds[(u + k + ri) % 3]}
                      className="eg-sv-pulse"
                      style={delay(-((u * 0.4 + k * 0.9 + ri) % 3))}
                    />
                  ))}
                  <line x1={P(x + 0.8, -1.2, z0 + 0.25)[0]} y1={P(x + 0.8, -1.2, z0 + 0.25)[1]} x2={P(x + 1.25, -1.2, z0 + 0.25)[0]} y2={P(x + 1.25, -1.2, z0 + 0.25)[1]} stroke="#ffffff" strokeOpacity=".5" strokeWidth="2" />
                </g>
              );
            })}
          </g>
        ))}
      </g>
      <g className="eg-sv-l1" style={delay(-3)}>
        {[0.6, 2.4].map((y) => {
          const [fx, fy] = P(1.6, y, 2.4);
          return (
            <g key={y}>
              <Cyl x={1.6} y={y} z={0} r={0.85} h={2.4} c={pal(SHELL)} grad={`${id}-cyln`} />
              <g transform={`translate(${fx} ${fy})`}>
                <ellipse rx="18" ry="10" fill={NAVY} opacity=".7" />
                <g className="eg-sv-spin" stroke={CYAN} strokeWidth="3" strokeLinecap="round">
                  <path d="M-14,0H14M0,-8V8" />
                </g>
              </g>
              <Ring x={1.6} y={y} z={2.6} r={1.2} stroke={CYAN} className="eg-sv-pulse" sw={1.5} style={delay(-y)} />
            </g>
          );
        })}
      </g>
    </Stage>
  );
}

/* ---- power: UPS cabinet, battery cells, cables, lightning bolt ------- */

function PowerTechnology({ id, accent }: { id: string; accent: string }) {
  const [bx, by] = P(-0.3, 1.0, 4.3);
  const bolt = "M10,-64 L-30,6 H-4 L-14,64 L34,-12 H6Z";
  return (
    <Stage id={id} accent={accent}>
      <g className="eg-sv-l0">
        {[-2.2, -0.5, 1.2].map((y, i) => (
          <polyline
            key={y}
            points={pts([P(-1.2, 0.2, 0.05), P(0.9, 0.2, 0.05), P(0.9, y + 0.8, 0.05), P(1.8, y + 0.8, 0.05)])}
            fill="none"
            stroke={WARM}
            strokeWidth="4"
            strokeLinejoin="round"
            className="eg-sv-pulse"
            style={delay(-i * 0.8)}
            opacity=".9"
          />
        ))}
      </g>
      <g className="eg-sv-l1">
        <Box x={-3.6} y={-1.8} z={0} w={2.6} d={2.8} h={2.9} c={pal(accent)} />
        <polygon points={lq(1.0, -3.4, -1.2, 1.8, 2.6)} fill={`url(#${id}-screen)`} />
        <polygon points={lq(1.0, -3.3, -2.1, 2.05, 2.35)} fill={WARM} className="eg-sv-pulse" />
        {[-3.3, -2.7, -2.1].map((x) => (
          <polygon key={x} points={lq(1.0, x, x + 0.4, 0.45, 0.75)} fill={NAVY} opacity=".5" />
        ))}
        {[-2.7, -1.0, 0.7].map((y, i) => (
          <g key={y}>
            <Cyl x={2.3} y={y} z={0} r={0.72} h={2.3} c={pal(SHELL)} grad={`${id}-cyln`} />
            <Cyl x={2.3} y={y} z={0.55} r={0.74} h={0.42} c={pal(WARM)} grad={`${id}-cylw`} />
            <Cyl x={2.3} y={y} z={2.3} r={0.28} h={0.3} c={pal(accent)} grad={`${id}-cyl`} />
            <circle cx={P(2.3, y, 1.65)[0]} cy={P(2.3, y, 1.65)[1] + 14} r="2.6" fill={CYAN} className="eg-sv-pulse" style={delay(-i)} />
          </g>
        ))}
      </g>
      <g className="eg-sv-l2">
        <ellipse cx={bx} cy={by} rx="84" ry="96" fill={`url(#${id}-glow)`} className="eg-sv-pulse" />
        <g transform={`translate(${bx} ${by})`}>
          <path d={bolt} transform="translate(8 9)" fill={mix(WARM, NAVY, 0.5)} />
          <path d={bolt} fill={WARM} stroke="#fff3d6" strokeWidth="3" strokeLinejoin="round" />
          <path d="M8,-52 L-22,2" stroke="#fff3d6" strokeWidth="5" strokeLinecap="round" opacity=".8" />
        </g>
      </g>
    </Stage>
  );
}

/* ---- broadcast and satellite: dish, orbiting satellite, signal rings -- */

function BroadcastSatellite({ id, accent }: { id: string; accent: string }) {
  const [dx, dy] = P(-1.6, 1.4, 3.0);
  const [sx, sy] = P(1.6, -2.4, 6.0);
  const panel = (flip: number) => (
    <g transform={`scale(${flip} 1)`}>
      <polygon points="14,-6 70,-30 70,8 14,26" fill={mix(accent, NAVY, 0.35)} stroke="#ffffff" strokeOpacity=".6" />
      <path d="M28,0 L28,24 M42,-6 L42,18 M56,-12 L56,12 M14,10 L70,-11" stroke="#ffffff" strokeOpacity=".5" strokeWidth="1.3" fill="none" />
    </g>
  );
  return (
    <Stage id={id} accent={accent}>
      <g className="eg-sv-l0">
        {[1.2, 2.1, 3.0].map((r, i) => (
          <Ring key={r} x={-1.6} y={1.4} r={r} stroke={CYAN} className="eg-sv-pulse" style={delay(-i * 0.9)} />
        ))}
      </g>
      <g className="eg-sv-l1">
        <Box x={1.2} y={0.9} z={0} w={2.4} d={1.4} h={1.5} c={pal(NAVY)} />
        <polygon points={lq(2.3, 1.4, 3.4, 0.2, 1.3)} fill={`url(#${id}-screen)`} />
        <polygon points={pts([P(2.2, 2.3, 0.95), P(2.2, 2.3, 0.55), P(2.7, 2.3, 0.75)])} fill={CYAN} />
        <Cyl x={-1.6} y={1.4} z={0} r={0.95} h={0.45} c={pal(SHELL)} grad={`${id}-cyln`} />
        <Cyl x={-1.6} y={1.4} z={0.45} r={0.26} h={2.1} c={pal(accent)} grad={`${id}-cyl`} />
        <g transform={`translate(${dx} ${dy}) rotate(-32)`}>
          <ellipse rx="60" ry="34" fill={mix(accent, NAVY, 0.55)} transform="translate(5 7)" />
          <ellipse rx="60" ry="34" fill="#ffffff" stroke={mix(accent, "#ffffff", 0.3)} strokeWidth="3" />
          <ellipse rx="46" ry="24" cx="6" fill={mix(accent, "#ffffff", 0.55)} />
          <ellipse rx="22" ry="12" cx="10" fill="#ffffff" opacity=".55" />
          <line x1="8" y1="0" x2="62" y2="-4" stroke={NAVY} strokeWidth="3" strokeLinecap="round" />
          <circle cx="64" cy="-4" r="5" fill={WARM} className="eg-sv-pulse" />
        </g>
      </g>
      <line x1={dx + 30} y1={dy - 24} x2={sx - 24} y2={sy + 24} stroke={CYAN} strokeWidth="2.5" strokeDasharray="3 9" strokeLinecap="round" className="eg-sv-pulse" />
      <g className="eg-sv-l2">
        <g transform={`translate(${sx} ${sy})`}>
          {[26, 44, 62].map((r, i) => (
            <circle key={r} r={r} fill="none" stroke={CYAN} strokeWidth="2" className="eg-sv-pulse" style={delay(-i * 0.8)} />
          ))}
          {panel(1)}
          {panel(-1)}
          <rect x="-15" y="-15" width="30" height="30" rx="6" fill="#ffffff" stroke={mix(accent, "#ffffff", 0.3)} strokeWidth="2" />
          <rect x="-15" y="1" width="30" height="14" rx="6" fill={WARM} />
          <rect x="-8" y="-8" width="16" height="8" rx="3" fill={accent} opacity=".7" />
          <line x1="0" y1="-15" x2="0" y2="-30" stroke={NAVY} strokeWidth="3" strokeLinecap="round" />
          <circle cy="-32" r="4" fill={WARM} />
        </g>
      </g>
    </Stage>
  );
}

/* ---- software, AI and digital: code window, chip, neural nodes ------- */

function SoftwareAiDigital({ id, accent }: { id: string; accent: string }) {
  const [gx, gy] = P(1.4, 0.4, 4.2);
  const net: [number, number][] = [
    [-52, 14],
    [-14, -34],
    [30, -2],
    [-6, 38],
    [54, -44],
  ];
  // [start y, end y, height z, colour] for each line of code on the window.
  const rows: [number, number, number, string][] = [
    [-2.8, -0.8, 2.8, CYAN],
    [-2.4, -1.1, 2.4, WARM],
    [-2.4, -0.3, 2.0, "#ffffff"],
    [-2.0, -0.3, 1.6, CYAN],
    [-2.0, -1.1, 1.2, accent],
    [-2.8, -0.4, 0.8, "#ffffff"],
  ];
  return (
    <Stage id={id} accent={accent}>
      <g className="eg-sv-l1">
        <Box x={-3.5} y={-3.3} z={0.7} w={0.5} d={5.2} h={3.6} c={pal(NAVY)} />
        <Box x={-3.4} y={-0.4} z={0} w={0.3} d={0.8} h={0.7} c={pal(SHELL)} />
        <polygon points={rq(-3.0, -3.1, 1.7, 3.0, 3.9)} fill={mix(accent, NAVY, 0.2)} />
        {[0, 1, 2].map((k) => (
          <circle key={k} cx={P(-3.0, -2.85 + k * 0.4, 3.45)[0]} cy={P(-3.0, -2.85 + k * 0.4, 3.45)[1]} r="3" fill={[WARM, "#6df2a5", CYAN][k]} />
        ))}
        {rows.map(([y0, y1, z, c], i) => (
          <polygon key={i} points={rq(-3.0, y0, y1, z, z + 0.16)} fill={c} opacity=".9" />
        ))}
      </g>
      <g className="eg-sv-l1" style={delay(-2.4)}>
        <Box x={0.3} y={0.5} z={0} w={3} d={3} h={0.5} c={pal(NAVY)} />
        <polygon points={fq(0.51, 0.75, 2.85, 0.95, 3.05)} fill={mix(accent, "#ffffff", 0.35)} />
        <polygon points={fq(0.52, 1.15, 2.45, 1.35, 2.65)} fill={accent} />
        {[0.7, 1.3, 1.9, 2.5].map((t) => (
          <g key={t} stroke={mix(NAVY, "#ffffff", 0.6)} strokeWidth="3" strokeLinecap="round">
            <line x1={P(0.3 + t, 3.5, 0.2)[0]} y1={P(0.3 + t, 3.5, 0.2)[1]} x2={P(0.3 + t, 3.8, 0.2)[0]} y2={P(0.3 + t, 3.8, 0.2)[1]} />
            <line x1={P(3.3, 0.5 + t, 0.2)[0]} y1={P(3.3, 0.5 + t, 0.2)[1]} x2={P(3.6, 0.5 + t, 0.2)[0]} y2={P(3.6, 0.5 + t, 0.2)[1]} />
          </g>
        ))}
        <circle cx={P(1.8, 1.8, 0.53)[0]} cy={P(1.8, 1.8, 0.53)[1]} r="5" fill="#ffffff" className="eg-sv-pulse" />
      </g>
      <g className="eg-sv-l2">
        <g transform={`translate(${gx} ${gy})`}>
          <g stroke={CYAN} strokeWidth="2.2" opacity=".85" className="eg-sv-pulse">
            {[
              [0, 1],
              [1, 2],
              [2, 3],
              [0, 3],
              [2, 4],
            ].map(([p, q]) => (
              <line key={`${p}${q}`} x1={net[p][0]} y1={net[p][1]} x2={net[q][0]} y2={net[q][1]} />
            ))}
          </g>
          {net.map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={i === 2 ? 15 : 10} fill={`url(#${id}-body)`} stroke="#ffffff" strokeWidth="2.5" />
              <circle cx={x - 3} cy={y - 3} r={i === 2 ? 4 : 2.6} fill="#ffffff" opacity=".7" />
            </g>
          ))}
          <path d="M70,-76 l5,12 12,5 -12,5 -5,12 -5,-12 -12,-5 12,-5z" fill={WARM} className="eg-sv-pulse" />
          <path d="M-70,-48 l3,7 7,3 -7,3 -3,7 -3,-7 -7,-3 7,-3z" fill="#ffffff" className="eg-sv-pulse" style={delay(-1.3)} />
        </g>
      </g>
    </Stage>
  );
}

/* ---- lookup ----------------------------------------------------------- */

const SCENES: Record<string, (p: { id: string; accent: string }) => ReactNode> = {
  cybersecurity: Cybersecurity,
  "enterprise-network": EnterpriseNetwork,
  "system-cloud": SystemCloud,
  "datacenter-facility-it-infrastructure": Datacenter,
  "power-technology": PowerTechnology,
  "broadcast-satellite": BroadcastSatellite,
  "software-ai-digital": SoftwareAiDigital,
};

export const SCENE_SLUGS = Object.keys(SCENES);

/** The isometric scene for a slug; a bare platform with one cube for an unknown slug. */
export function SolutionScene({ slug, accent }: { slug: string; accent: string }) {
  const id = `eg-sv-${slug}`;
  const Scene = SCENES[slug];
  if (Scene) return <>{Scene({ id, accent })}</>;
  return (
    <Stage id={id} accent={accent}>
      <g className="eg-sv-l1">
        <Box x={-1.2} y={-1.2} z={0} w={2.4} d={2.4} h={2.4} c={pal(accent)} />
      </g>
    </Stage>
  );
}
