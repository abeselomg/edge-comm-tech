"use client";

import { useMemo, useState } from "react";
import type { Partner } from "@/payload-types";

const VB = { w: 1100, h: 1100 };
const CX = 550;
const CY = 550;
const RINGS = [305, 465] as const;

const FILTERS: { id: "all" | NonNullable<Partner["category"]>; label: string }[] = [
  { id: "all", label: "All partners" },
  { id: "data-center", label: "Data Center" },
  { id: "cloud", label: "Cloud & Data" },
  { id: "network", label: "Network" },
  { id: "cyber", label: "Cybersecurity" },
  { id: "applications", label: "Applications" },
];

function polar(ring: 0 | 1, index: number, count: number) {
  const offset = ring === 1 ? Math.PI / Math.max(count, 1) : 0;
  const theta = (index / Math.max(count, 1)) * Math.PI * 2 - Math.PI / 2 + offset;
  const r = RINGS[ring];
  return { x: CX + r * Math.cos(theta), y: CY + r * Math.sin(theta) };
}

export function PartnerNetwork({ partners, heading, intro }: {
  partners: Partner[];
  heading: string;
  intro: string;
}) {
  const [filter, setFilter] = useState<"all" | NonNullable<Partner["category"]>>("all");

  const nodes = useMemo(() => {
    const inner = partners.filter((p) => p.ring === "0");
    const outer = partners.filter((p) => p.ring !== "0");
    return partners.map((p) => {
      const ring: 0 | 1 = p.ring === "0" ? 0 : 1;
      const group = ring === 0 ? inner : outer;
      const index = group.findIndex((g) => g.id === p.id);
      return {
        ...p,
        ...polar(ring, index, group.length),
        active: filter === "all" || p.category === filter,
      };
    });
  }, [partners, filter]);

  const available = new Set(partners.map((p) => p.category));

  return (
    <div className="dark-surface bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-6 pt-16">
        <h1 className="max-w-2xl font-display text-4xl leading-tight md:text-5xl">{heading}</h1>
        <p className="font-caption mt-4 max-w-xl text-lg text-paper/65">{intro}</p>
        <div className="mt-8 flex flex-wrap gap-x-4 gap-y-2 border-b border-white/15 pb-4">
          {FILTERS.filter((f) => f.id === "all" || available.has(f.id)).map((item) => {
            const on = filter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                aria-pressed={on}
                className={`font-caption text-sm ${on ? "text-paper underline decoration-gold underline-offset-4" : "text-paper/45 hover:text-paper"}`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative mx-auto aspect-square w-full max-w-[900px]">
        <svg viewBox={`0 0 ${VB.w} ${VB.h}`} className="absolute inset-0 h-full w-full" aria-hidden>
          {RINGS.map((r) => (
            <circle key={r} cx={CX} cy={CY} r={r} fill="none" stroke="white" strokeWidth="1" opacity="0.2" />
          ))}
          {nodes.map((n) => (
            <line
              key={n.id}
              x1={CX}
              y1={CY}
              x2={n.x}
              y2={n.y}
              stroke="white"
              strokeWidth="1"
              opacity={n.active ? 0.35 : 0.06}
            />
          ))}
          <circle cx={CX} cy={CY} r="70" fill="#12151a" stroke="white" strokeWidth="1" />
        </svg>
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 w-32 -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="font-caption text-sm italic">Edge</p>
        </div>
        {nodes.map((n) => (
          <article
            key={n.id}
            className="absolute w-28 -translate-x-1/2 -translate-y-1/2 border border-white/20 bg-ink px-2 py-2 text-center transition-opacity md:w-32"
            style={{
              left: `${(n.x / VB.w) * 100}%`,
              top: `${(n.y / VB.h) * 100}%`,
              opacity: n.active ? 1 : 0.15,
            }}
          >
            <p className="text-[11px] font-medium md:text-xs">{n.name}</p>
            <p className="font-caption mt-0.5 text-[10px] text-paper/50">{n.label}</p>
          </article>
        ))}
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-10">
        <p className="caption-bar text-paper">
          <span>Fig. 07 — Partner network</span>
          <span>
            {partners.length} vendors · two orbits, one hub
          </span>
        </p>
      </div>
    </div>
  );
}
