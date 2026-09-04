import Link from "next/link";
import { about, domains, journey, nextFramework, proof, sectors } from "@/lib/content";

export default function HomePage() {
  return (
    <main>
      <section className="frame bg-ink text-paper">
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-end px-6 pb-6 pt-24">
          <p className="font-caption text-lg text-paper/70">Think Next. Deliver Now.</p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.05] md:text-7xl">{about.intro}</h1>
          <div className="mt-10 flex gap-6 text-sm">
            <Link href="/solutions" className="underline decoration-gold underline-offset-4">
              Explore solutions
            </Link>
            <Link href="/contact">Talk to an expert</Link>
          </div>
          <div className="caption-bar text-paper">
            <span>Fig. 01 — Positioning</span>
            <span>Addis Ababa, 2018–</span>
          </div>
        </div>
      </section>

      <section className="bg-paper-2 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-3 gap-8 border-b border-ink/10 pb-8">
            {proof.map((item) => (
              <div key={item.label}>
                <p className="font-display text-4xl">{item.value}</p>
                <p className="font-caption mt-1 text-steel">{item.label}</p>
              </div>
            ))}
          </div>
          <p className="caption-bar !mt-3 border-0 pt-0">Fig. 02 — Proof</p>
        </div>
      </section>

      <section className="bg-paper px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-px bg-ink/15 md:grid-cols-4">
            {nextFramework.map((step) => (
              <article key={step.title} className="still p-6">
                <p className="font-caption text-gold">{step.letter}</p>
                <h2 className="mt-8 font-display text-2xl">{step.title}</h2>
                <p className="mt-4 text-sm leading-relaxed text-ink/70">{step.body}</p>
              </article>
            ))}
          </div>
          <p className="caption-bar text-ink">
            <span>Fig. 03 — Navigate, Enable, eXceed, Transform</span>
            <span>Contact sheet</span>
          </p>
        </div>
      </section>

      <section className="frame bg-ink text-paper">
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pt-16 pb-6">
          <h2 className="font-display text-4xl md:text-5xl">Six integrated technology domains</h2>
          <div className="mt-10 grid flex-1 grid-cols-2 gap-3 md:grid-cols-3">
            {domains.map((d) => (
              <Link key={d.slug} href={`/solutions/${d.slug}`} className="flex flex-col border border-white/15 p-4">
                <p className="font-caption text-sm text-gold-2">{d.code}</p>
                <h3 className="mt-auto pt-8 font-display text-lg">{d.title}</h3>
                <p className="mt-2 text-xs text-paper/55">{d.headline}</p>
              </Link>
            ))}
          </div>
          <div className="caption-bar">
            <span>Fig. 04 — Portfolio</span>
            <span>6 frames</span>
          </div>
        </div>
      </section>

      <section className="bg-paper-2 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 md:grid-cols-3">
            {journey.map((step, i) => (
              <article key={step.title}>
                <div className="mb-5 aspect-[4/3] bg-paper" />
                <p className="font-caption text-sm text-steel">
                  Fig. 05.{i + 1} — {step.title}
                </p>
                <h3 className="mt-2 font-display text-2xl">{step.title}</h3>
                <p className="mt-3 text-sm text-ink/70">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-ink/10 bg-paper px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-4">
            {sectors.map((s) => (
              <Link key={s.slug} href="/clients">
                <h3 className="font-display text-xl">{s.title}</h3>
                <p className="mt-2 font-caption text-sm text-ink/65">{s.line}</p>
              </Link>
            ))}
          </div>
          <p className="caption-bar text-ink">
            <span>Fig. 06 — Sectors</span>
            <span>Government, finance, telecom, international</span>
          </p>
        </div>
      </section>
    </main>
  );
}
