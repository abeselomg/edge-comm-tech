import Link from "next/link";
import { domainCode } from "@/lib/content";
import { VariantBar, getDesignData } from "../_shared";

/*
 * Direction A — Newsreader.
 *
 * A serif at display size reads institutional rather than technical: closer
 * to a bank or a consultancy than to a vendor. None of the three reference
 * sites uses one, so it is the strongest differentiator available on type
 * alone. Structure is editorial — a masthead, then a register.
 */
export default async function DirectionA() {
  const { home, solutions, sectors, courses } = await getDesignData();

  return (
    <div className="dir-a">
      <VariantBar active="a" />

      <main>
        <section className="dark-surface bg-deep text-paper">
          <div className="wrap pb-16 pt-20 md:pb-20 md:pt-28">
            <h1 className="display display-lg max-w-[15ch]">{home.tagline}</h1>
          </div>
          <div className="wrap">
            <div className="grid gap-10 border-t border-rule-dark py-10 md:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] md:gap-16">
              <p className="lede max-w-none text-paper/75">{home.heroStatement}</p>
              <div className="flex flex-wrap gap-3 self-start">
                <Link href="/solutions" className="btn btn-brass">
                  {home.primaryCta?.label ?? "Explore solutions"}
                </Link>
                <Link href="/contact" className="btn btn-outline">
                  {home.secondaryCta?.label ?? "Talk to an expert"}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="band bg-paper">
          <div className="wrap">
            <h2 className="display display-md max-w-[20ch]">{home.solutionsIntro}</h2>
            <div className="mt-12">
              {solutions.map((d, i) => (
                <article key={d.id} className="border-t border-rule py-8 last:border-b">
                  <div className="grid gap-3 md:grid-cols-[3rem_minmax(0,18rem)_minmax(0,1fr)] md:gap-10">
                    <p className="data text-brass md:pt-2">{domainCode(i)}</p>
                    <h3 className="display display-sm">
                      <Link href={`/solutions/${d.slug}`} className="transition-colors hover:text-teal">
                        {d.title}
                      </Link>
                    </h3>
                    <div>
                      <p className="leading-relaxed text-ink-soft">{d.summary}</p>
                      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
                        {(d.capabilities ?? []).slice(0, 6).map((c) => (
                          <li key={c.id ?? c.name} className="data text-ink-soft/80">
                            {c.acronym || c.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="dark-surface band bg-deep text-paper">
          <div className="wrap">
            <h2 className="display display-md">{home.methodTitle}</h2>
            <ol className="mt-12 grid gap-x-10 gap-y-10 md:grid-cols-4">
              {(home.method ?? []).map((step, i) => (
                <li key={step.id ?? step.title} className="border-t border-brass pt-5">
                  <p className="data text-brass">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="display display-sm mt-3">{step.title}</h3>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-paper/60">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="band bg-paper">
          <div className="wrap">
            <h2 className="display display-md max-w-[22ch]">{home.sectorsIntro}</h2>
            <ul className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2">
              {sectors.map((s) => (
                <li key={s.id} className="border-t border-rule pt-6">
                  <h3 className="display display-sm">
                    <Link href={`/clients/${s.slug}`} className="transition-colors hover:text-teal">
                      {s.title}
                    </Link>
                  </h3>
                  <p className="mt-2.5 max-w-[42ch] leading-relaxed text-ink-soft">{s.line}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {courses.length > 0 ? (
          <section className="dark-surface band bg-deep text-paper">
            <div className="wrap grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] md:gap-16">
              <div>
                <h2 className="display display-md max-w-[16ch]">
                  We teach the work, not just sell it
                </h2>
                <p className="lede mt-6 text-paper/70">
                  The E-Academy is free and open, with no account required.
                </p>
                <Link href="/academy" className="btn btn-brass mt-8">
                  Browse the courses
                </Link>
              </div>
              <ul className="self-center">
                {courses.slice(0, 4).map((c) => (
                  <li key={c.id} className="border-t border-rule-dark last:border-b">
                    <Link
                      href={`/academy/${c.slug}`}
                      className="block py-4 text-[0.9375rem] text-paper/70 transition-colors hover:text-brass"
                    >
                      {c.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}
