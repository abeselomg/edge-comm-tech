import type { Metadata } from "next";
import Link from "next/link";
import { RichText } from "@/components/rich-text";
import { getCompanyPage, getHomePage, verifiedStats } from "@/lib/content";

export const metadata: Metadata = {
  title: "Company",
  description:
    "Edge Communication Technologies — an integrated technology solutions and systems integration partner in Addis Ababa.",
};

export default async function CompanyPage() {
  const [company, home] = await Promise.all([getCompanyPage(), getHomePage()]);
  const stats = verifiedStats(home);
  const values = company.values ?? [];
  const outcomes = company.outcomes ?? [];
  const founded = company.founded;

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.28em] text-gold">Company</p>
      <h1 className="mt-3 font-display text-5xl">{company.heading}</h1>
      <p className="mt-6 text-lg text-ink/80">{company.intro}</p>
      <p className="mt-6 text-ink/80">{company.commitment}</p>

      {founded?.verified && founded.year ? (
        <p className="mt-6 font-caption text-steel">
          Operating from Addis Ababa since {founded.year}.{founded.detail ? ` ${founded.detail}` : ""}
        </p>
      ) : null}

      {stats.length > 0 ? (
        <div
          className="mt-10 grid border border-rule"
          style={{ gridTemplateColumns: `repeat(${Math.min(stats.length, 3)}, minmax(0, 1fr))` }}
        >
          {stats.map((item) => (
            <div key={item.id ?? item.label} className="border-r border-rule px-4 py-6 last:border-r-0">
              <p className="font-display text-2xl text-gold">{item.value}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-steel">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      <RichText data={company.body} className="mt-12" />

      {values.length > 0 ? (
        <section className="mt-14">
          <h2 className="font-display text-3xl">What we hold ourselves to</h2>
          <dl className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
            {values.map((v) => (
              <div key={v.id ?? v.title} className="py-5">
                <dt className="font-display text-lg">{v.title}</dt>
                <dd className="mt-2 text-ink/75">{v.body}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {outcomes.length > 0 ? (
        <section className="mt-14">
          <h2 className="font-display text-3xl">What clients get</h2>
          <ul className="mt-6 space-y-3 text-ink/80">
            {outcomes.map((o, i) => (
              <li key={o.id ?? i} className="flex gap-3">
                <span className="text-gold">—</span>
                <span>{o.item}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="mt-14 flex flex-wrap gap-4">
        <Link
          href="/solutions"
          className="inline-block bg-gold px-5 py-3 font-mono text-xs uppercase tracking-widest text-white hover:bg-gold-2"
        >
          Explore solutions
        </Link>
        <Link
          href="/careers"
          className="inline-block border border-rule px-5 py-3 font-mono text-xs uppercase tracking-widest hover:border-gold hover:text-gold"
        >
          Work with us
        </Link>
      </div>
    </main>
  );
}
