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
      <section className="dark-surface bg-deep text-paper">
        <div className="wrap pb-20 pt-20 md:pb-24 md:pt-28">
          <h1 className="display display-lg max-w-[14ch]">Six domains, one contract</h1>
          <p className="lede mt-7 text-paper/70">
            Most failures we are called in to fix happen at the seam between two suppliers. These
            six domains are designed, delivered, and supported by the same team.
          </p>
        </div>
      </section>

      <section className="bg-paper">
        <div className="wrap">
          {solutions.map((d, i) => (
            <article
              key={d.id}
              className="grid gap-6 border-b border-rule py-12 md:grid-cols-[3.25rem_minmax(0,1fr)] md:gap-10 md:py-16"
            >
              <p className="data pt-1 text-brass">{domainCode(i)}</p>

              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-14">
                <div>
                  <h2 className="display display-md">
                    <Link href={`/solutions/${d.slug}`} className="transition-colors hover:text-teal">
                      {d.title}
                    </Link>
                  </h2>
                  <p className="mt-4 text-[1.0625rem] font-medium text-teal">{d.headline}</p>
                  <p className="measure mt-4 leading-relaxed text-ink-soft">{d.summary}</p>
                  <Link
                    href={`/solutions/${d.slug}`}
                    className="link-quiet mt-6 inline-block text-[0.9375rem] font-medium text-teal"
                  >
                    Read the detail
                  </Link>
                </div>

                {(d.capabilities ?? []).length > 0 ? (
                  <div className="lg:pt-2">
                    <h3 className="text-[0.9375rem] font-semibold">What it covers</h3>
                    <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                      {(d.capabilities ?? []).map((c) => (
                        <li key={c.id ?? c.name} className="data text-ink-soft">
                          {c.acronym || c.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="dark-surface band bg-deep text-paper">
        <div className="wrap">
          <h2 className="display display-md max-w-[20ch]">
            Not sure which domain your problem sits in?
          </h2>
          <p className="lede mt-6 text-paper/65">
            Most real projects cross two or three. Describe the outcome and we will map it.
          </p>
          <Link href="/contact" className="btn btn-brass mt-9">
            Talk to an expert
          </Link>
        </div>
      </section>
    </main>
  );
}
