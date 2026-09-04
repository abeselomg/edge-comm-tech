"use client";

import { useMemo, useState } from "react";
import type { Partner } from "@/payload-types";

const VB = { w: 1100, h: 1100 };
const CX = 550;
const CY = 550;
const RINGS = [305, 465] as const;

const FILTERS: { id: "all" | NonNullable<Partner["category"]>; label: string }[] = [
  { id: "all", label: "All" },
  { id: "data-center", label: "Data center" },
  { id: "cloud", label: "Cloud & data" },
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

export function PartnerNetwork({ partners }: { partners: Partner[] }) {
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
  const shown = nodes.filter((n) => n.active).length;

  return (
    <div className="dark-surface bg-deep text-paper">
      <div className="wrap pb-16 pt-20 md:pb-0 md:pt-28">
        <h1 className="display display-lg max-w-[15ch]">
          The platforms we build on
        </h1>
        <p className="lede mt-7 text-paper/70">
          We are certified across the vendors that run critical systems, and independent enough to
          tell you when one of them is the wrong answer.
        </p>

        <div className="mt-10 hidden flex-wrap items-center gap-x-2 gap-y-2 border-t border-rule-dark pt-6 md:flex">
          {FILTERS.filter((f) => f.id === "all" || available.has(f.id)).map((item) => {
            const on = filter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                aria-pressed={on}
                className={`rounded px-3 py-1.5 text-[0.9375rem] transition-colors ${
                  on ? "bg-brass text-deep" : "text-paper/55 hover:text-paper"
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <p className="data ml-auto text-paper/45" aria-live="polite">
            {shown} of {partners.length}
          </p>
        </div>
      </div>

      <div className="relative mx-auto hidden aspect-square w-full max-w-[980px] px-4 md:block">
        <svg viewBox={`0 0 ${VB.w} ${VB.h}`} className="absolute inset-0 h-full w-full" aria-hidden>
          {RINGS.map((r) => (
            <circle
              key={r}
              cx={CX}
              cy={CY}
              r={r}
              fill="none"
              stroke="#c8963e"
              strokeWidth="1"
              opacity="0.22"
            />
          ))}
          {nodes.map((n) => (
            <line
              key={n.id}
              x1={CX}
              y1={CY}
              x2={n.x}
              y2={n.y}
              stroke="#c8963e"
              strokeWidth="1"
              opacity={n.active ? 0.34 : 0.06}
            />
          ))}
          <circle cx={CX} cy={CY} r="74" fill="#06231f" stroke="#c8963e" strokeWidth="1" />
        </svg>

        <p
          className="display pointer-events-none absolute left-1/2 top-1/2 w-36 -translate-x-1/2 -translate-y-1/2 text-center text-[0.9375rem] leading-tight"
          aria-hidden
        >
          Edge
        </p>

        {nodes.map((n) => (
          <article
            key={n.id}
            className="absolute w-[104px] -translate-x-1/2 -translate-y-1/2 rounded border border-rule-dark bg-deep-2 px-2 py-1.5 text-center transition-opacity lg:w-28"
            style={{
              left: `${(n.x / VB.w) * 100}%`,
              top: `${(n.y / VB.h) * 100}%`,
              opacity: n.active ? 1 : 0.14,
            }}
          >
            <p className="text-[0.75rem] font-medium md:text-[0.8125rem]">{n.name}</p>
            <p className="data mt-0.5 text-[0.6875rem] text-paper/45">{n.label}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
