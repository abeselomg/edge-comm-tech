import type { Metadata } from "next";
import Link from "next/link";
import { domains } from "@/lib/content";

export const metadata: Metadata = { title: "Solutions" };

export default function SolutionsPage() {
  return (
    <main>
      {domains.map((d, i) => (
        <Link
          key={d.slug}
          href={`/solutions/${d.slug}`}
          className={`frame block px-6 ${i % 2 === 0 ? "bg-paper-2" : "bg-paper"}`}
        >
          <div className="mx-auto flex min-h-[70vh] w-full max-w-6xl flex-col justify-end py-16">
            <p className="font-caption text-gold">{d.code}</p>
            <h1 className="mt-3 font-display text-4xl md:text-6xl">{d.title}</h1>
            <p className="mt-4 max-w-xl text-lg">{d.headline}</p>
            <p className="mt-3 max-w-xl text-ink/70">{d.line}</p>
            <p className="caption-bar text-ink">
              <span>
                Fig. 04.{i + 1} — {d.title}
              </span>
              <span>Explore domain →</span>
            </p>
          </div>
        </Link>
      ))}
    </main>
  );
}
