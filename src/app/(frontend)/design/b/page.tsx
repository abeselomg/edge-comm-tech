import Link from "next/link";
import { domainCode } from "@/lib/content";
import { VariantBar, getDesignData } from "../_shared";

/*
 * Direction B — Instrument Sans.
 *
 * The opposite move from an expanded display face: the headline stops being
 * the event and the information carries the page. Tighter vertical rhythm,
 * the six domains visible without scrolling, and a capability table that
 * puts every acronym on the first screen a buyer sees.
 */
export default async function DirectionB() {
  const { home, solutions, sectors, courses } = await getDesignData();

  return (
    <div className="dir-b">
      <VariantBar active="b" />

      <main>
        <section className="dark-surface bg-deep text-paper">
          <div className="wrap grid gap-12 py-14 md:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] md:gap-16 md:py-20">
            <div className="self-center">
              <h1 className="display display-lg max-w-[20ch]">{home.tagline}</h1>
              <p className="lede mt-5 text-paper/70">{home.heroStatement}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/solutions" className="btn btn-brass">
                  {home.primaryCta?.label ?? "Explore solutions"}
                </Link>
                <Link href="/contact" className="btn btn-outline">
                  {home.secondaryCta?.label ?? "Talk to an expert"}
                </Link>
              </div>
            </div>

            {/* The catalogue is visible immediately, not a scroll away. */}
            <div className="self-center">
              <p className="data text-paper/45">{home.solutionsIntro}</p>
              <ul className="mt-3">
                {solutions.map((d, i) => (
                  <li key={d.id} className="border-t border-rule-dark last:border-b">
                    <Link
                      href={`/solutions/${d.slug}`}
                      className="group flex items-baseline gap-3 py-2.5"
                    >
                      <span className="data text-brass">{domainCode(i)}</span>
                      <span className="text-[0.9375rem] transition-colors group-hover:text-brass">
                        {d.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-paper py-14 md:py-20">
          <div className="wrap">
            <h2 className="display display-md">What each domain covers</h2>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[46rem] border-collapse text-left">
                <thead>
                  <tr className="border-b border-rule">
                    <th scope="col" className="py-3 pr-6 text-[0.9375rem] font-semibold">
                      Domain
                    </th>
                    <th scope="col" className="py-3 pr-6 text-[0.9375rem] font-semibold">
                      Promise
                    </th>
                    <th scope="col" className="py-3 text-[0.9375rem] font-semibold">
                      Capabilities
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {solutions.map((d) => (
                    <tr key={d.id} className="border-b border-rule align-top">
                      <th scope="row" className="py-4 pr-6 font-medium">
                        <Link href={`/solutions/${d.slug}`} className="hover:text-teal">
                          {d.title}
                        </Link>
                      </th>
                      <td className="py-4 pr-6 text-[0.9375rem] text-ink-soft">{d.headline}</td>
                      <td className="py-4">
                        <ul className="flex flex-wrap gap-x-3 gap-y-1.5">
                          {(d.capabilities ?? []).map((c) => (
                            <li key={c.id ?? c.name} className="data text-ink-soft">
                              {c.acronym || c.name}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="bg-paper-2 py-14 md:py-20">
          <div className="wrap grid gap-10 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] md:gap-14">
            <h2 className="display display-md">{home.methodTitle}</h2>
            <ol className="grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
              {(home.method ?? []).map((step, i) => (
                <li key={step.id ?? step.title}>
                  <p className="data text-brass">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="display display-sm mt-1.5">{step.title}</h3>
                  <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-soft">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-paper py-14 md:py-20">
          <div className="wrap grid gap-10 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] md:gap-14">
            <h2 className="display display-md">{home.sectorsIntro}</h2>
            <ul className="grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
              {sectors.map((s) => (
                <li key={s.id}>
                  <h3 className="display display-sm">
                    <Link href={`/clients/${s.slug}`} className="transition-colors hover:text-teal">
                      {s.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-soft">{s.line}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {courses.length > 0 ? (
          <section className="dark-surface bg-deep py-14 text-paper md:py-20">
            <div className="wrap grid gap-10 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] md:gap-14">
              <div>
                <h2 className="display display-md">E-Academy</h2>
                <Link href="/academy" className="btn btn-brass mt-5">
                  Browse the courses
                </Link>
              </div>
              <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
                {courses.map((c) => (
                  <li key={c.id} className="border-t border-rule-dark">
                    <Link
                      href={`/academy/${c.slug}`}
                      className="block py-3 text-[0.9375rem] text-paper/70 transition-colors hover:text-brass"
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
