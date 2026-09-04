import Link from "next/link";
import { getCourses, getHomePage, getSectors, getSolutions } from "@/lib/content";

export async function getDesignData() {
  const [home, solutions, sectors, courses] = await Promise.all([
    getHomePage(),
    getSolutions(),
    getSectors(),
    getCourses(),
  ]);
  return { home, solutions, sectors, courses };
}

export const VARIANTS = [
  { id: "current", href: "/", label: "Current", face: "Archivo, expanded" },
  { id: "a", href: "/design/a", label: "A", face: "Newsreader, serif" },
  { id: "b", href: "/design/b", label: "B", face: "Instrument Sans" },
  { id: "c", href: "/design/c", label: "C", face: "Archivo Narrow" },
];

/** Sticky switcher so the three can be flipped between while scrolling. */
export function VariantBar({ active }: { active: string }) {
  return (
    <div className="variant-bar dark-surface text-paper">
      <div className="wrap flex flex-wrap items-center gap-x-1 gap-y-2 py-2.5">
        <span className="data mr-3 text-paper/50">Direction</span>
        {VARIANTS.map((v) => (
          <Link
            key={v.id}
            href={v.href}
            aria-current={v.id === active ? "page" : undefined}
            className={`rounded px-3 py-1.5 text-[0.9375rem] transition-colors ${
              v.id === active ? "bg-brass text-deep" : "text-paper/60 hover:text-paper"
            }`}
          >
            {v.label}
          </Link>
        ))}
        <span className="data ml-auto text-paper/45">
          {VARIANTS.find((v) => v.id === active)?.face}
        </span>
      </div>
    </div>
  );
}
