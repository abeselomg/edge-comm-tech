import type { Metadata } from "next";
import Link from "next/link";
import { getSectors } from "@/lib/content";

export const metadata: Metadata = {
  title: "Sectors",
  description:
    "Government and health, banking and finance, telecommunications, and international organizations — sectors where downtime is not an option.",
};

export default async function SectorsPage() {
  const sectors = await getSectors();

  return (
    <main>
      <section className="dark-surface bg-deep text-paper">
        <div className="wrap pb-20 pt-20 md:pb-24 md:pt-28">
          <h1 className="display display-lg max-w-[15ch]">Where downtime is not an option</h1>
          <p className="lede mt-7 text-paper/70">
            Four sectors, each with a different reason that reliability is a duty rather than a
            preference.
          </p>
        </div>
      </section>

      <section className="band bg-paper">
        <div className="wrap">
          <ul className="grid gap-px bg-rule sm:grid-cols-2">
            {sectors.map((s) => (
              <li key={s.id} className="bg-paper">
                <Link href={`/clients/${s.slug}`} className="group block h-full p-8 md:p-10">
                  <h2 className="display display-md transition-colors group-hover:text-teal">
                    {s.title}
                  </h2>
                  <p className="mt-4 max-w-[40ch] leading-relaxed text-ink-soft">{s.line}</p>
                  <span className="link-quiet mt-6 inline-block text-[0.9375rem] font-medium text-teal">
                    What this sector demands
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
