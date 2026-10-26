import { buildMetadata } from "@/lib/seo/metadata";
import Link from "next/link";
import { ClosingCta, CtaRow, Mark, PageHead, SectionHead } from "@/components/ui";
import { SECTOR_OPTIONS } from "@/fields/sectors";
import { getClients, getCompany, getPageCopy } from "@/lib/content";
import { bySector, clientCard, SECTOR_ACCENT } from "./client-parts";

/*
 * Client directory.
 *
 * Ten institutions, exactly as listed in the approved client directory. Four
 * organisations that appeared in an earlier draft model are absent from that
 * directory and are not here.
 *
 * Marks: only one institution has approved artwork on file. The rest render
 * their name in the identical frame, because the content master permits
 * publishing only approved assets. Highland printed a count of the marks still
 * pending under the wall; that line is not ported. A directory should not
 * apologise for what it is waiting on, and the frame already reads as
 * deliberate.
 */

export const metadata = buildMetadata({
  title: "Our Clients — Banks, Universities and Government Institutions | Edge Comm-Tech",
  description:
    "Edge Comm-Tech works with Ethiopian banks, universities, ministries and public institutions delivering infrastructure, security, power and digital learning technology.",
  path: "/clients",
});

export default async function ClientsPage() {
  const [copy, clients, company] = await Promise.all([getPageCopy(), getClients(), getCompany()]);
  const hero = copy.clientsHero;
  const groups = bySector(clients);

  return (
    <main>
      <PageHead
        eyebrow={hero?.eyebrow}
        title={hero?.title ?? "Clients"}
        intro={hero?.intro}
        accent="#056a9a"
        variant="grid"
        ambience="clients"
        ctas={
          <CtaRow
            primary={{ href: "/contact", label: "Become a client" }}
            secondary={{ href: "/projects", label: "Read the project records" }}
          />
        }
      />

      {/* The mark wall: uniform frames, so a name reads as deliberately as a logo. */}
      <section className="border-b border-rule bg-paper-2/40">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <p className="font-mono text-[10px] uppercase tracking-widest text-gold">
            Institutions we serve
          </p>
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {clients.map((c) => (
              <li
                key={c.name}
                className="eg-inview flex h-20 items-center justify-center rounded-2xl border border-rule bg-paper px-4 transition hover:border-gold"
              >
                <Mark item={c} h="h-10" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {SECTOR_OPTIONS.map(({ value, label }) => {
        const list = groups[value];
        if (!list) return null;
        return (
          <section key={value} className="border-t border-rule">
            <div className="mx-auto max-w-6xl px-6 py-16">
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <div>
                  <p
                    className="font-mono text-[10px] uppercase tracking-widest"
                    style={{ color: SECTOR_ACCENT[value] }}
                  >
                    Sector
                  </p>
                  <h2 className="mt-2 font-display text-[clamp(1.5rem,2.8vw,2.1rem)]">{label}</h2>
                </div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-steel">
                  {`${list.length} institution${list.length > 1 ? "s" : ""}`}
                </p>
              </div>
              <div className="mt-8">{list.map(clientCard)}</div>
            </div>
          </section>
        );
      })}

      <section className="border-t border-rule bg-paper-2/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHead
            eyebrow="Why institutions stay"
            title="The reasons clients come back for the next project"
          />
          <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {(company.differentiators ?? []).map((d) => (
              <div key={d.title} className="eg-inview border-t border-rule pt-5">
                <h3 className="font-display text-lg">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20">
        <SectionHead
          eyebrow="References"
          title="Client references on request"
          intro="Detailed references, named contacts and completion certificates are shared directly with prospective clients and tender committees, subject to each institution's consent."
        />
        <p className="mt-6">
          <Link
            href="/contact"
            className="inline-block rounded-full border border-rule px-6 py-3 text-sm font-semibold transition hover:border-gold hover:text-gold"
          >
            Request references
          </Link>
        </p>
      </section>

      <ClosingCta
        title="Let's talk about your institution"
        body="Tell us what you are modernizing and what it has to keep running while you do it. We will come back with a practical approach."
        primary={{ href: "/contact", label: "Contact our team" }}
        secondary={{ href: "/partners", label: "See our technology partners" }}
        accent="#056a9a"
      />
    </main>
  );
}
