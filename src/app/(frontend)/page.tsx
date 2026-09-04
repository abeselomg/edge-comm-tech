import Link from "next/link";
import {
  domainCode,
  flattenLessons,
  getCourses,
  getHomePage,
  getProjects,
  getSectors,
  getSolutions,
  verifiedStats,
} from "@/lib/content";

export default async function HomePage() {
  const [home, solutions, sectors, projects, courses] = await Promise.all([
    getHomePage(),
    getSolutions(),
    getSectors(),
    getProjects(),
    getCourses(),
  ]);

  const stats = verifiedStats(home);
  const featured = projects.filter((p) => p.featured).slice(0, 3);

  return (
    <main>
      {/* One continuous dark field: the statement, then the register of work. */}
      <section className="dark-surface bg-deep text-paper">
        <div className="wrap pb-20 pt-24 md:pb-28 md:pt-36">
          <h1 className="display display-lg max-w-[16ch]">{home.tagline}</h1>
          <p className="lede mt-8 text-paper/70">{home.heroStatement}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href={home.primaryCta?.href ?? "/solutions"} className="btn btn-brass">
              {home.primaryCta?.label ?? "Explore solutions"}
            </Link>
            <Link href={home.secondaryCta?.href ?? "/contact"} className="btn btn-outline">
              {home.secondaryCta?.label ?? "Talk to an expert"}
            </Link>
          </div>

          {stats.length > 0 ? (
            <dl className="mt-16 flex flex-wrap gap-x-14 gap-y-6 border-t border-rule-dark pt-8">
              {stats.map((item) => (
                <div key={item.id ?? item.label}>
                  <dt className="sr-only">{item.label}</dt>
                  <dd>
                    <span className="display display-md block">{item.value}</span>
                    <span className="mt-1 block text-[0.9375rem] text-paper/55">{item.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>

        <div className="wrap pb-24 md:pb-32">
          <h2 className="display display-md max-w-[20ch]">{home.solutionsIntro}</h2>

          <div className="mt-12">
            {solutions.map((d, i) => {
              const marks = (d.capabilities ?? [])
                .map((c) => c.acronym || c.name)
                .filter(Boolean)
                .slice(0, 5);
              return (
                <Link key={d.id} href={`/solutions/${d.slug}`} className="register-row group">
                  <span className="register-num">{domainCode(i)}</span>
                  <span className="display display-sm text-paper transition-colors group-hover:text-brass">
                    {d.title}
                  </span>
                  <span className="block">
                    <span className="block text-[0.9375rem] leading-relaxed text-paper/60">
                      {d.headline}
                    </span>
                    {marks.length > 0 ? (
                      <span className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
                        {marks.map((m) => (
                          <span key={m} className="data text-paper/55">
                            {m}
                          </span>
                        ))}
                      </span>
                    ) : null}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Delivery sequence. Threaded because the stages genuinely run in order. */}
      <section className="band bg-paper">
        <div className="wrap">
          <h2 className="display display-md max-w-[18ch]">{home.methodTitle}</h2>
          <div className="thread mt-14">
            {(home.method ?? []).map((step) => (
              <div key={step.id ?? step.title} className="thread-step">
                <h3 className="display display-sm">{step.title}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="dark-surface band bg-deep text-paper">
        <div className="wrap">
          <h2 className="display display-md max-w-[22ch]">{home.sectorsIntro}</h2>
          <ul className="mt-12 grid gap-px bg-rule-dark sm:grid-cols-2">
            {sectors.map((s) => (
              <li key={s.id} className="bg-deep">
                <Link href={`/clients/${s.slug}`} className="group block h-full p-7 md:p-9">
                  <h3 className="display display-sm transition-colors group-hover:text-brass">
                    {s.title}
                  </h3>
                  <p className="mt-3 max-w-[38ch] text-[0.9375rem] leading-relaxed text-paper/60">
                    {s.line}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {featured.length > 0 ? (
        <section className="band bg-paper">
          <div className="wrap">
            <h2 className="display display-md">Selected work</h2>
            <ul className="mt-12 grid gap-x-10 gap-y-12 md:grid-cols-3">
              {featured.map((p) => (
                <li key={p.id}>
                  <p className="data text-teal">{p.client}</p>
                  <h3 className="display display-sm mt-2">
                    <Link href={`/projects/${p.slug}`} className="transition-colors hover:text-teal">
                      {p.title}
                    </Link>
                  </h3>
                  <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-soft">{p.scope}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {courses.length > 0 ? (
        <section className="band bg-paper">
          <div className="wrap">
            <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] md:gap-16">
              <div>
                <h2 className="display display-md max-w-[16ch]">
                  We teach the work, not just sell it
                </h2>
                <p className="lede mt-6 text-ink-soft">
                  The E-Academy is free and open, with no account required. It exists because clients
                  who understand their own infrastructure are better clients, and because this market
                  is short of trained engineers.
                </p>
                <Link href="/academy" className="btn btn-brass mt-9">
                  Browse the courses
                </Link>
              </div>
              <ul className="self-center">
                {courses.slice(0, 4).map((c) => (
                  <li key={c.id} className="border-t border-rule last:border-b">
                    <Link
                      href={`/academy/${c.slug}`}
                      className="group flex items-baseline justify-between gap-6 py-4"
                    >
                      <span className="font-medium transition-colors group-hover:text-teal">
                        {c.title}
                      </span>
                      <span className="data shrink-0 text-ink-soft">
                        {flattenLessons(c).length} lessons
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : null}

      <section className="dark-surface band bg-deep text-paper">
        <div className="wrap">
          <h2 className="display display-md max-w-[18ch]">
            Tell us what you need to stand up, replace, or secure
          </h2>
          <p className="lede mt-6 text-paper/65">
            An engineer replies, not a sales queue.
          </p>
          <Link href="/contact" className="btn btn-brass mt-9">
            Start a conversation
          </Link>
        </div>
      </section>
    </main>
  );
}
