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
    <main>
      <section className="dark-surface bg-deep text-paper">
        <div className="wrap pb-20 pt-20 md:pb-24 md:pt-28">
          <h1 className="display display-lg max-w-[14ch]">{company.heading}</h1>
          <p className="lede mt-7 text-paper/75">{company.intro}</p>

          {founded?.verified && founded.year ? (
            <p className="mt-5 text-[0.9375rem] text-paper/55">
              Operating from Addis Ababa since {founded.year}.
              {founded.detail ? ` ${founded.detail}` : ""}
            </p>
          ) : null}

          {stats.length > 0 ? (
            <dl className="mt-14 flex flex-wrap gap-x-14 gap-y-6 border-t border-rule-dark pt-8">
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
      </section>

      <section className="band bg-paper">
        <div className="wrap-narrow">
          <p className="lede max-w-none text-ink">{company.commitment}</p>
          <RichText data={company.body} className="mt-10" />
        </div>
      </section>

      {values.length > 0 ? (
        <section className="band bg-paper-2">
          <div className="wrap">
            <div className="grid gap-10 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] md:gap-16">
              <h2 className="display display-md">What we hold ourselves to</h2>
              <dl>
                {values.map((v) => (
                  <div key={v.id ?? v.title} className="border-t border-rule py-6 last:border-b">
                    <dt className="display display-sm">{v.title}</dt>
                    <dd className="measure mt-2.5 leading-relaxed text-ink-soft">{v.body}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>
      ) : null}

      {outcomes.length > 0 ? (
        <section className="band bg-paper">
          <div className="wrap">
            <div className="grid gap-10 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] md:gap-16">
              <h2 className="display display-md">What clients get</h2>
              <ul className="space-y-3.5">
                {outcomes.map((o, i) => (
                  <li key={o.id ?? i} className="relative measure pl-6 leading-relaxed text-ink-soft">
                    <span className="absolute left-0 top-[0.72em] h-px w-3 bg-brass" aria-hidden />
                    {o.item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : null}

      <section className="dark-surface band bg-deep text-paper">
        <div className="wrap flex flex-wrap items-center justify-between gap-8">
          <h2 className="display display-md max-w-[16ch]">Work with us, or come and work here</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="btn btn-brass">
              Talk to an expert
            </Link>
            <Link href="/careers" className="btn btn-outline">
              See open roles
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
