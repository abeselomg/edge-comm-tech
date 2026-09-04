import Link from "next/link";
import { domainCode, getSiteSettings } from "@/lib/content";
import { VariantBar, getDesignData } from "../_shared";

/*
 * Direction D — Left rail, index first.
 *
 * Deliberately breaks what A, B and C all share:
 *   - the page frame is a fixed rail, not a top bar and a footer
 *   - the catalogue opens the page; the positioning statement comes second
 *   - content sits in an offset grid, not one centred column
 *   - no alternating full-width dark/light bands; one paper ground throughout
 */
export default async function DirectionD() {
  const [{ home, solutions, sectors, courses }, settings] = await Promise.all([
    getDesignData(),
    getSiteSettings(),
  ]);

  const nav = settings.nav ?? [];

  return (
    <div className="dir-d min-h-screen lg:flex">
      <aside className="rail">
        <Link href="/" className="display block text-[1.0625rem] leading-none">
          Edge<span className="font-normal"> COMM-TECH</span>
        </Link>

        <nav className="mt-9 lg:mt-12" aria-label="Main">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1 lg:block lg:space-y-0.5">
            {nav.map((item) => (
              <li key={item.id ?? item.href}>
                <Link
                  href={item.href}
                  className="block py-1.5 text-[0.9375rem] text-paper/65 transition-colors hover:text-brass"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-9 lg:mt-auto lg:pt-10">
          <p className="text-[0.9375rem] leading-relaxed text-paper/45">
            Addis Ababa, Ethiopia
          </p>
          <Link href="/contact" className="btn btn-brass mt-4 w-full lg:w-auto">
            Talk to an expert
          </Link>
        </div>
      </aside>

      <div className="rail-content flex-1">
        <VariantBar active="d" />

        <div className="px-6 md:px-10 lg:px-14">
          {/* The catalogue opens the page. For an integrator the list of what
              you can actually deliver is the pitch. */}
          <section className="pb-4 pt-14 md:pt-20">
            <h1 className="display display-lg max-w-[18ch]">{home.solutionsIntro}</h1>
            <div className="mt-10">
              {solutions.map((d, i) => (
                <Link key={d.id} href={`/solutions/${d.slug}`} className="index-row group">
                  <span className="data text-brass">{domainCode(i)}</span>
                  <span className="display display-sm transition-colors group-hover:text-teal">
                    {d.title}
                  </span>
                  <span className="block">
                    <span className="block text-[0.9375rem] leading-relaxed text-ink-soft">
                      {d.summary}
                    </span>
                    <span className="mt-2.5 flex flex-wrap gap-x-3.5 gap-y-1.5">
                      {(d.capabilities ?? []).map((c) => (
                        <span key={c.id ?? c.name} className="data text-ink-soft/75">
                          {c.acronym || c.name}
                        </span>
                      ))}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* The statement is demoted to a passage, after the evidence. */}
          <section className="offset">
            <p className="offset-label">Who we are</p>
            <div>
              <p className="display display-md max-w-[22ch]">{home.tagline}</p>
              <p className="mt-6 max-w-[58ch] text-[1.0625rem] leading-relaxed text-ink-soft">
                {home.heroStatement}
              </p>
              <Link
                href="/about"
                className="link-quiet mt-6 inline-block font-medium text-teal"
              >
                More about the company
              </Link>
            </div>
          </section>

          <section className="offset">
            <p className="offset-label">{home.methodTitle}</p>
            <ol className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {(home.method ?? []).map((step, i) => (
                <li key={step.id ?? step.title} className="flex gap-4">
                  <span className="data pt-1 text-brass">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="display display-sm block">{step.title}</span>
                    <span className="mt-2 block text-[0.9375rem] leading-relaxed text-ink-soft">
                      {step.body}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <section className="offset">
            <p className="offset-label">Sectors</p>
            <ul className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
              {sectors.map((s) => (
                <li key={s.id}>
                  <h2 className="display display-sm">
                    <Link href={`/clients/${s.slug}`} className="transition-colors hover:text-teal">
                      {s.title}
                    </Link>
                  </h2>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">{s.line}</p>
                </li>
              ))}
            </ul>
          </section>

          {courses.length > 0 ? (
            <section className="offset">
              <p className="offset-label">E-Academy</p>
              <div>
                <p className="max-w-[58ch] text-[1.0625rem] leading-relaxed text-ink-soft">
                  Free and open, with no account required. This market is short of trained
                  engineers, and that is a problem worth chipping away at.
                </p>
                <ul className="mt-6">
                  {courses.map((c) => (
                    <li key={c.id} className="border-t border-rule last:border-b">
                      <Link
                        href={`/academy/${c.slug}`}
                        className="block py-3 font-medium transition-colors hover:text-teal"
                      >
                        {c.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ) : null}
        </div>

        {/* The only dark moment in the content column. */}
        <section className="dark-surface mt-6 bg-deep px-6 py-14 text-paper md:px-10 md:py-16 lg:px-14">
          <h2 className="display display-md max-w-[20ch]">
            Tell us what you need to stand up, replace, or secure
          </h2>
          <p className="mt-5 max-w-[46ch] text-[1.0625rem] leading-relaxed text-paper/65">
            An engineer replies, not a sales queue.
          </p>
          <Link href="/contact" className="btn btn-brass mt-8">
            Start a conversation
          </Link>
          <p className="mt-12 text-[0.9375rem] text-paper/40">
            Edge Communication Technologies, Addis Ababa. © {new Date().getFullYear()}
          </p>
        </section>
      </div>
    </div>
  );
}
