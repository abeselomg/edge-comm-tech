import type { Metadata } from "next";
import Link from "next/link";
import { PartnerNetwork } from "@/components/partner-network";
import { getPartners, getSolutions } from "@/lib/content";

export const metadata: Metadata = {
  title: "Partners",
  description:
    "The vendors and platforms Edge COMM-TECH builds on, across data center, cloud, network, cybersecurity, and applications.",
};

export default async function PartnersPage() {
  const [partners, solutions] = await Promise.all([getPartners(), getSolutions()]);

  return (
    <main>
      <PartnerNetwork partners={partners} />

      <section className="band bg-paper">
        <div className="wrap">
          <div className="grid gap-10 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] md:gap-16">
            <h2 className="display display-md">Which vendors sit in which domain</h2>
            <dl>
              {solutions.map((s) => {
                const tech = (s.technologies ?? []).filter(
                  (p): p is Exclude<typeof p, number> => typeof p === "object" && p !== null,
                );
                if (tech.length === 0) return null;
                return (
                  <div key={s.id} className="border-t border-rule py-6 last:border-b">
                    <dt className="display display-sm">
                      <Link href={`/solutions/${s.slug}`} className="transition-colors hover:text-teal">
                        {s.title}
                      </Link>
                    </dt>
                    <dd className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                      {tech.map((p) => (
                        <span key={p.id} className="data text-ink-soft">
                          {p.name}
                        </span>
                      ))}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>
        </div>
      </section>
    </main>
  );
}
