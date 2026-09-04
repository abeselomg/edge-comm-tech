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
    <main className="mx-auto max-w-6xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.28em] text-gold">Who we serve</p>
      <h1 className="mt-3 font-display text-5xl">Trusted across critical sectors</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink/80">
        From government and finance to telecom and international organizations, we work where technology
        reliability is a duty rather than a preference.
      </p>
      <ul className="mt-12 grid gap-4 md:grid-cols-2">
        {sectors.map((s) => (
          <li key={s.id} className="border-l-4 border-gold bg-paper-2 px-6 py-6">
            <h2 className="font-display text-2xl">
              <Link href={`/clients/${s.slug}`} className="hover:text-gold">
                {s.title}
              </Link>
            </h2>
            <p className="mt-2 text-ink/75">{s.line}</p>
            <Link
              href={`/clients/${s.slug}`}
              className="mt-4 inline-block font-mono text-xs uppercase tracking-widest text-gold"
            >
              Read more →
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
