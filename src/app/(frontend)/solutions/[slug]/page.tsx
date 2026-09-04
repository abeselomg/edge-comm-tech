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
      <section className="dark-surface bg-deep text-paper">
        <div className="wrap pb-16 pt-14 md:pb-20 md:pt-20">
          <Link href="/solutions" className="link-quiet text-[0.9375rem] text-paper/60">
            All domains
          </Link>
          <h1 className="display display-lg mt-8 max-w-[16ch]">{domain.title}</h1>
          <p className="display display-sm mt-6 max-w-[24ch] text-brass">{domain.headline}</p>
          <p className="lede mt-6 text-paper/70">{domain.summary}</p>
        </div>
      </section>

      <section className="band bg-paper">
        <div className="wrap grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-20">
          <div>
            <RichText data={domain.overview} />

            {capabilities.length > 0 ? (
              <section className="mt-16">
                <h2 className="display display-md">What this domain covers</h2>
                <p className="mt-3 max-w-[52ch] text-[0.9375rem] text-ink-soft">
                  The industry terms, and what each one actually does for you.
                </p>
                <dl className="mt-9">
                  {capabilities.map((c) => (
                    <div key={c.id ?? c.name} className="border-t border-rule py-5">
                      <dt className="flex flex-wrap items-baseline gap-x-3">
                        <span className="display display-sm">{c.name}</span>
                        {c.acronym ? <span className="data text-brass">{c.acronym}</span> : null}
                      </dt>
                      <dd className="measure mt-2 leading-relaxed text-ink-soft">{c.valueLine}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ) : null}

            {scope.length > 0 ? (
              <section className="mt-16">
                <h2 className="display display-md">A typical engagement</h2>
                <ol className="thread-v mt-10">
                  {scope.map((s, i) => (
                    <li key={s.id ?? i} className="measure leading-relaxed text-ink-soft">
                      {s.item}
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}
          </div>

          <aside className="h-fit lg:sticky lg:top-24">
            {deliverables.length > 0 ? (
              <div className="card p-6">
                <h2 className="display display-xs">What you are handed</h2>
                <ul className="mt-4 space-y-2.5">
                  {deliverables.map((d, i) => (
                    <li
                      key={d.id ?? i}
                      className="border-l-2 border-brass pl-3 text-[0.9375rem] leading-relaxed text-ink-soft"
                    >
                      {d.item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {partners.length > 0 ? (
              <div className="card mt-5 p-6">
                <h2 className="display display-xs">Built on</h2>
                <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                  {partners.map((p) => (
                    <li key={p.id} className="data text-ink-soft">
                      {p.name}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <Link href={`/contact?domain=${domain.slug}`} className="btn btn-brass mt-5 w-full">
              Talk to an expert
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
