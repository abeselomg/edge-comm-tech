import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RichText } from "@/components/rich-text";
import { getSector, getSectors } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const sectors = await getSectors();
  return sectors.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sector = await getSector(slug);
  if (!sector) return { title: "Sector" };
  return { title: sector.title, description: sector.line };
}

export default async function SectorPage({ params }: Props) {
  const { slug } = await params;
  const sector = await getSector(slug);
  if (!sector) notFound();

  const pressures = sector.pressures ?? [];
  const solutions = (sector.solutions ?? []).filter(
    (s): s is Exclude<typeof s, number> => typeof s === "object" && s !== null,
  );

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/clients" className="font-mono text-xs uppercase tracking-widest text-gold">
        ← All sectors
      </Link>
      <h1 className="mt-6 font-display text-4xl md:text-5xl">{sector.title}</h1>
      <p className="mt-4 text-lg text-ink/80">{sector.line}</p>

      <RichText data={sector.body} className="mt-10" />

      {pressures.length > 0 ? (
        <section className="mt-14">
          <h2 className="font-display text-3xl">What makes this sector different</h2>
          <dl className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
            {pressures.map((p) => (
              <div key={p.id ?? p.title} className="py-5">
                <dt className="font-display text-lg">{p.title}</dt>
                <dd className="mt-2 text-ink/75">{p.detail}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {solutions.length > 0 ? (
        <section className="mt-14">
          <h2 className="font-display text-2xl">Domains most often engaged</h2>
          <ul className="mt-5 flex flex-wrap gap-3">
            {solutions.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/solutions/${s.slug}`}
                  className="inline-block border border-rule bg-paper-2 px-4 py-2 text-sm hover:border-gold hover:text-gold"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <Link
        href="/contact"
        className="mt-12 inline-block bg-gold px-5 py-3 font-mono text-xs uppercase tracking-widest text-white hover:bg-gold-2"
      >
        Talk to an expert
      </Link>
    </main>
  );
}
