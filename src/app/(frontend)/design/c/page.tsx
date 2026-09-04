import Link from "next/link";
import { domainCode } from "@/lib/content";
import { VariantBar, getDesignData } from "../_shared";

/*
 * Direction C — Archivo Narrow.
 *
 * Condensed industrial: the lettering of rack labels, plant signage, and
 * drawing annotation. The six domains are drawn as a rack elevation, which
 * is the most characteristic object in Edge's world and makes the catalogue
 * a picture rather than a list.
 */
export default async function DirectionC() {
  const { home, solutions, sectors, courses } = await getDesignData();

  return (
    <div className="dir-c">
      <VariantBar active="c" />

      <main>
        <section className="dark-surface bg-deep text-paper">
          <div className="wrap grid gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:gap-16 lg:py-24">
            <div className="self-center">
              <h1 className="display display-lg max-w-[13ch]">{home.tagline}</h1>
              <p className="lede mt-7 text-paper/70">{home.heroStatement}</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="/solutions" className="btn btn-brass">
                  {home.primaryCta?.label ?? "Explore solutions"}
                </Link>
                <Link href="/contact" className="btn btn-outline">
                  {home.secondaryCta?.label ?? "Talk to an expert"}
                </Link>
              </div>
            </div>

            {/* Rack elevation: six units, one per domain. */}
            <div className="self-center">
              <p className="data mb-3 text-paper/45">{home.solutionsIntro}</p>
              <div className="rack">
                {solutions.map((d, i) => (
                  <Link key={d.id} href={`/solutions/${d.slug}`} className="rack-unit group">
                    <span className="rack-rail" aria-hidden>
                      <span />
                      <span />
                      <span />
                    </span>
                    <span className="min-w-0">
                      <span className="display display-sm block truncate transition-colors group-hover:text-brass">
                        {d.title}
                      </span>
                      <span className="data mt-1 block truncate text-paper/45">
                        {(d.capabilities ?? [])
                          .slice(0, 4)
                          .map((c) => c.acronym || c.name)
                          .join("  ")}
                      </span>
                    </span>
                    <span className="data text-brass">{domainCode(i)}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="band bg-paper">
          <div className="wrap">
            <h2 className="display display-md">{home.methodTitle}</h2>
            <ol className="mt-11 grid gap-x-10 gap-y-9 md:grid-cols-4">
              {(home.method ?? []).map((step, i) => (
                <li key={step.id ?? step.title} className="border-t-2 border-brass pt-5">
                  <p className="data text-brass">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="display display-sm mt-2">{step.title}</h3>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="dark-surface band bg-deep text-paper">
          <div className="wrap">
            <h2 className="display display-md max-w-[20ch]">{home.sectorsIntro}</h2>
            <ul className="mt-11 grid gap-px bg-rule-dark sm:grid-cols-2 lg:grid-cols-4">
              {sectors.map((s) => (
                <li key={s.id} className="bg-deep">
                  <Link href={`/clients/${s.slug}`} className="group block h-full p-6">
                    <h3 className="display display-sm transition-colors group-hover:text-brass">
                      {s.title}
                    </h3>
                    <p className="mt-3 text-[0.9375rem] leading-relaxed text-paper/60">{s.line}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {courses.length > 0 ? (
          <section className="band bg-paper">
            <div className="wrap grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] md:gap-16">
              <div>
                <h2 className="display display-md max-w-[16ch]">
                  We teach the work, not just sell it
                </h2>
                <p className="lede mt-6 text-ink-soft">
                  Free and open, with no account required. This market is short of trained
                  engineers, and that is a problem worth chipping away at.
                </p>
                <Link href="/academy" className="btn btn-brass mt-8">
                  Browse the courses
                </Link>
              </div>
              <ul className="self-center">
                {courses.slice(0, 4).map((c) => (
                  <li key={c.id} className="border-t border-rule last:border-b">
                    <Link
                      href={`/academy/${c.slug}`}
                      className="block py-4 font-medium transition-colors hover:text-teal"
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
