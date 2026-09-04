import type { Metadata } from "next";
import Link from "next/link";
import { domainCode, getSolutions } from "@/lib/content";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Data center and critical systems, cybersecurity, enterprise networking, compute and cloud, business applications, and professional services.",
};

export default async function SolutionsPage() {
  const solutions = await getSolutions();

  return (
    <main>
      {solutions.map((d, i) => (
        <Link
          key={d.id}
          href={`/solutions/${d.slug}`}
          className={`frame block px-6 ${i % 2 === 0 ? "bg-paper-2" : "bg-paper"}`}
        >
          <div className="mx-auto flex min-h-[70vh] w-full max-w-6xl flex-col justify-end py-16">
            <p className="font-caption text-gold">{domainCode(i)}</p>
            <h2 className="mt-3 font-display text-4xl md:text-6xl">{d.title}</h2>
            <p className="mt-4 max-w-xl text-lg">{d.headline}</p>
            <p className="mt-3 max-w-xl text-ink/70">{d.summary}</p>
            {(d.capabilities ?? []).length > 0 ? (
              <p className="mt-5 max-w-2xl font-mono text-xs uppercase tracking-widest text-steel">
                {(d.capabilities ?? [])
                  .map((c) => c.acronym || c.name)
                  .slice(0, 6)
                  .join(" · ")}
              </p>
            ) : null}
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
