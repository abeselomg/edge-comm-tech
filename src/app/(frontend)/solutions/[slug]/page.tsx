import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RichText } from "@/components/rich-text";
import { getSolution, getSolutions } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const solutions = await getSolutions();
  return solutions.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const domain = await getSolution(slug);
  if (!domain) return { title: "Solution" };
  return { title: domain.title, description: domain.summary };
}

export default async function SolutionPage({ params }: Props) {
  const { slug } = await params;
  const domain = await getSolution(slug);
  if (!domain) notFound();

  const capabilities = domain.capabilities ?? [];
  const scope = domain.scopeOfWork ?? [];
  const deliverables = domain.deliverables ?? [];
  const partners = (domain.technologies ?? []).filter(
    (p): p is Exclude<typeof p, number> => typeof p === "object" && p !== null,
  );

  return (
    <main>
      <section className="dark-surface bg-ink px-6 py-20 text-paper">
        <div className="mx-auto max-w-6xl">
          <Link href="/solutions" className="font-mono text-xs uppercase tracking-widest text-gold-2">
            ← All domains
          </Link>
          <h1 className="mt-6 max-w-3xl font-display text-4xl md:text-6xl">{domain.title}</h1>
          <p className="mt-5 max-w-2xl font-display text-xl text-gold-2">{domain.headline}</p>
          <p className="mt-4 max-w-2xl text-lg text-paper/75">{domain.summary}</p>
        </div>
      </section>

      <section className="bg-paper-2 px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div>
            <RichText data={domain.overview} />

            {capabilities.length > 0 ? (
              <section className="mt-16">
                <h2 className="font-display text-3xl">What this domain covers</h2>
                <dl className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
                  {capabilities.map((c) => (
                    <div key={c.id ?? c.name} className="py-5">
                      <dt className="flex flex-wrap items-baseline gap-x-3">
                        <span className="font-display text-lg">{c.name}</span>
                        {c.acronym ? (
                          <span className="font-mono text-xs uppercase tracking-widest text-gold">
                            {c.acronym}
                          </span>
                        ) : null}
                      </dt>
                      <dd className="mt-2 text-ink/75">{c.valueLine}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ) : null}

            {scope.length > 0 ? (
              <section className="mt-16">
                <h2 className="font-display text-3xl">A typical engagement</h2>
                <ol className="mt-6 space-y-3">
                  {scope.map((s, i) => (
                    <li key={s.id ?? i} className="flex gap-4">
                      <span className="font-mono text-xs text-gold">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-ink/80">{s.item}</span>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}
          </div>

          <aside className="h-fit lg:sticky lg:top-24">
            {deliverables.length > 0 ? (
              <div className="still p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-steel">
                  What you are handed
                </p>
                <ul className="mt-4 space-y-2 text-sm text-ink/80">
                  {deliverables.map((d, i) => (
                    <li key={d.id ?? i} className="border-l-2 border-gold pl-3">
                      {d.item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {partners.length > 0 ? (
              <div className="still mt-6 p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-steel">
                  Technologies we build on
                </p>
                <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5 text-sm text-ink/80">
                  {partners.map((p) => (
                    <li key={p.id} className="font-caption">
                      {p.name}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <Link
              href={`/contact?domain=${domain.slug}`}
              className="mt-6 block bg-gold px-5 py-3 text-center font-mono text-xs uppercase tracking-widest text-white hover:bg-gold-2"
            >
              Talk to an expert
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
