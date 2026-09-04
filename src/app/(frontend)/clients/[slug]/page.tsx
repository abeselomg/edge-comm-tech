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
    <main>
      <section className="dark-surface bg-deep text-paper">
        <div className="wrap pb-16 pt-14 md:pb-20 md:pt-20">
          <Link href="/clients" className="link-quiet text-[0.9375rem] text-paper/60">
            All sectors
          </Link>
          <h1 className="display display-lg mt-8 max-w-[15ch]">{sector.title}</h1>
          <p className="lede mt-6 text-paper/70">{sector.line}</p>
        </div>
      </section>

      <section className="band bg-paper">
        <div className="wrap grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-20">
          <div>
            <RichText data={sector.body} />

            {pressures.length > 0 ? (
              <section className="mt-16">
                <h2 className="display display-md">What makes this sector different</h2>
                <dl className="mt-9">
                  {pressures.map((p) => (
                    <div key={p.id ?? p.title} className="border-t border-rule py-5">
                      <dt className="display display-sm">{p.title}</dt>
                      <dd className="measure mt-2 leading-relaxed text-ink-soft">{p.detail}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ) : null}
          </div>

          <aside className="h-fit lg:sticky lg:top-24">
            {solutions.length > 0 ? (
              <div className="card p-6">
                <h2 className="display display-xs">Domains most often engaged</h2>
                <ul className="mt-4 space-y-2.5">
                  {solutions.map((s) => (
                    <li key={s.id}>
                      <Link
                        href={`/solutions/${s.slug}`}
                        className="block border-l-2 border-brass pl-3 text-[0.9375rem] leading-relaxed text-ink-soft transition-colors hover:text-teal"
                      >
                        {s.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <Link href="/contact" className="btn btn-brass mt-5 w-full">
              Talk to an expert
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
