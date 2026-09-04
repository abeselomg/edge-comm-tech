import Link from "next/link";
import {
  domainCode,
  getHomePage,
  getProjects,
  getSectors,
  getSolutions,
  verifiedStats,
} from "@/lib/content";

export default async function HomePage() {
  const [home, solutions, sectors, projects] = await Promise.all([
    getHomePage(),
    getSolutions(),
    getSectors(),
    getProjects(),
  ]);

  const stats = verifiedStats(home);
  const featured = projects.filter((p) => p.featured).slice(0, 3);

  return (
    <main>
      <section className="frame dark-surface bg-ink text-paper">
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-end px-6 pb-6 pt-24">
          <p className="font-caption text-lg text-paper/70">{home.tagline}</p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.05] md:text-7xl">
            {home.heroStatement}
          </h1>
          <div className="mt-10 flex gap-6 text-sm">
            <Link
              href={home.primaryCta?.href ?? "/solutions"}
              className="underline decoration-gold underline-offset-4"
            >
              {home.primaryCta?.label ?? "Explore solutions"}
            </Link>
            <Link href={home.secondaryCta?.href ?? "/contact"}>
              {home.secondaryCta?.label ?? "Talk to an expert"}
            </Link>
          </div>
          <div className="caption-bar text-paper">
            <span>Fig. 01 — Positioning</span>
            <span>Addis Ababa</span>
          </div>
        </div>
      </section>

      {stats.length > 0 ? (
        <section className="bg-paper-2 px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <div
              className="grid gap-8 border-b border-ink/10 pb-8"
              style={{ gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, minmax(0, 1fr))` }}
            >
              {stats.map((item) => (
                <div key={item.id ?? item.label}>
                  <p className="font-display text-4xl">{item.value}</p>
                  <p className="font-caption mt-1 text-steel">{item.label}</p>
                </div>
              ))}
            </div>
            <p className="caption-bar !mt-3 border-0 pt-0">Fig. 02 — Proof</p>
          </div>
        </section>
      ) : null}

      <section className="bg-paper px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl md:text-4xl">{home.methodTitle}</h2>
          <div className="mt-10 grid gap-px bg-ink/15 md:grid-cols-2 lg:grid-cols-4">
            {(home.method ?? []).map((step, i) => (
              <article key={step.id ?? step.title} className="still p-6">
                <p className="font-mono text-xs text-gold">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-8 font-display text-2xl">{step.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-ink/70">{step.body}</p>
              </article>
            ))}
          </div>
          <p className="caption-bar text-ink">
            <span>Fig. 03 — {home.methodTitle}</span>
            <span>{(home.method ?? []).length} stages</span>
          </p>
        </div>
      </section>

      <section className="frame dark-surface bg-ink text-paper">
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pt-16 pb-6">
          <h2 className="font-display text-4xl md:text-5xl">{home.solutionsIntro}</h2>
          <div className="mt-10 grid flex-1 grid-cols-2 gap-3 md:grid-cols-3">
            {solutions.map((d, i) => (
              <Link
                key={d.id}
                href={`/solutions/${d.slug}`}
                className="flex flex-col border border-white/15 p-4 transition-colors hover:border-gold-2"
              >
                <p className="font-caption text-sm text-gold-2">{domainCode(i)}</p>
                <h3 className="mt-auto pt-8 font-display text-lg">{d.title}</h3>
                <p className="mt-2 text-xs text-paper/55">{d.headline}</p>
              </Link>
            ))}
          </div>
          <div className="caption-bar">
            <span>Fig. 04 — Portfolio</span>
            <span>{solutions.length} domains</span>
          </div>
        </div>
      </section>

      {featured.length > 0 ? (
        <section className="bg-paper-2 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-display text-3xl md:text-4xl">Selected work</h2>
            <div className="mt-10 grid gap-10 md:grid-cols-3">
              {featured.map((p, i) => (
                <article key={p.id}>
                  <p className="font-caption text-sm text-steel">
                    Fig. 05.{i + 1} — {p.client}
                  </p>
                  <h3 className="mt-2 font-display text-2xl">
                    <Link href={`/projects/${p.slug}`} className="hover:text-gold">
                      {p.title}
                    </Link>
                  </h3>
                  <p className="mt-3 text-sm text-ink/70">{p.scope}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="border-t border-ink/10 bg-paper px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl md:text-4xl">{home.sectorsIntro}</h2>
          <ul className="mt-10 grid gap-8 md:grid-cols-4">
            {sectors.map((s) => (
              <li key={s.id}>
                <Link href={`/clients/${s.slug}`}>
                  <h3 className="font-display text-xl hover:text-gold">{s.title}</h3>
                  <p className="mt-2 font-caption text-sm text-ink/65">{s.line}</p>
                </Link>
              </li>
            ))}
          </ul>
          <p className="caption-bar text-ink">
            <span>Fig. 06 — Sectors</span>
            <span>{sectors.map((s) => s.title).join(", ")}</span>
          </p>
        </div>
      </section>
    </main>
  );
}
