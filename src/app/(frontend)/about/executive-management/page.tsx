import Link from "next/link";
import { ClosingCta, Crumb, PageHead, Pending, SectionHead } from "@/components/ui";
import { getCompany, getContactDetails } from "@/lib/content";
import { executiveCard } from "./exec-parts";
import { emailByLabel } from "@/lib/routes";

/*
 * Executive management.
 *
 * The content master lists five executive roles and no names, biographies or
 * portraits, so every card shows a marker. That is the page working: an
 * invented leadership team would be worse than an empty frame that says what
 * it is waiting for. When Edge supplies the names each card gains one and the
 * markers come off, with no layout change.
 *
 * Nothing in Highland links to this page -- it was a generated orphan. It
 * lives under /about, which is where a reader would look for it, and /about
 * links to it.
 */

const DARK = "#003D6B";
const ACCENT = "#056a9a";

export const metadata = {
  title: "Executive Management",
  description:
    "The executive leadership structure of Edge Communication Technologies PLC and the responsibilities each role carries.",
};

export default async function ExecutiveManagementPage() {
  const [company, contact] = await Promise.all([getCompany(), getContactDetails()]);
  const roles = company.executiveRoles ?? [];
  const email = emailByLabel(contact, /sales/i);

  return (
    <main>
      <PageHead
        eyebrow="Leadership"
        title="Executive management"
        intro="Edge Comm-Tech is led by an executive team accountable for strategy, engineering, delivery, commercial performance and client outcomes."
        accent={ACCENT}
        variant="rule"
        crumb={
          <Crumb
            trail={[{ label: "About", href: "/about" }, { label: "Executive management" }]}
          />
        }
        meta={
          <p className="eg-rise mt-6">
            <Pending>Names, biographies and portraits pending from Edge</Pending>
          </p>
        }
      />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <SectionHead
          eyebrow="Structure"
          title={`${roles.length} executive roles`}
          intro="The roles accountable for strategy, engineering, delivery, commercial performance and client outcomes."
          accent={ACCENT}
        />
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((role, i) => executiveCard(role, i))}
        </div>
        <p className="mt-8 max-w-3xl rounded-2xl bg-paper-2 px-6 py-5 text-xs leading-relaxed text-steel">
          Names, biographies and portraits are published once Edge Comm-Tech approves them for
          release. In the meantime, introductions to the relevant executive are arranged directly
          for clients, partners and tender committees.
        </p>
      </section>

      {/* How leadership shows up in the work */}
      <section className="relative overflow-hidden" style={{ background: DARK }}>
        <span
          className="pointer-events-none absolute -right-40 -top-32 h-[36rem] w-[36rem] rounded-full"
          style={{ background: "radial-gradient(circle,rgb(255 255 255/0.06),transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-6xl px-6 py-20 text-white">
          <p className="font-mono text-[10px] uppercase tracking-widest text-white/55">
            What leadership is held to
          </p>
          <h2 className="mt-3 max-w-3xl font-display text-[clamp(1.6rem,3.2vw,2.5rem)] leading-tight">
            The values the executive team is accountable for
          </h2>
          <div className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {(company.values ?? []).map((v) => (
              <div key={v.title} className="eg-inview border-t border-white/15 pt-5">
                <h3 className="font-display text-lg">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* A little company context, so the page is not only an empty roster */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <SectionHead eyebrow="Context" title="The company this team leads" accent={ACCENT} />
        <ol className="relative mt-10 border-l border-rule pl-8">
          {(company.journey ?? []).slice(-4).map((m, i, arr) => (
            <li key={m.when} className="eg-inview relative pb-8 last:pb-0">
              <span
                className={`absolute -left-[2.3rem] top-1 grid h-4 w-4 place-items-center rounded-full border-2 border-paper ${
                  i === arr.length - 1 ? "bg-gold" : "bg-gold/40"
                }`}
              />
              <p className="font-mono text-[10px] uppercase tracking-widest text-gold">{m.when}</p>
              <p className="mt-1.5 max-w-2xl leading-relaxed text-ink/80">{m.what}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8">
          <Link
            href="/about"
            className="inline-block rounded-full border border-rule px-6 py-3 text-sm font-semibold transition hover:border-gold hover:text-gold"
          >
            Read the full company story
          </Link>
        </p>
      </section>

      <ClosingCta
        title="Need to reach the executive team?"
        body={
          <>
            For partnership discussions, institutional engagements or tender matters, email{" "}
            {email ? (
              <a
                href={`mailto:${email}`}
                className="underline decoration-rule underline-offset-2 hover:text-gold"
              >
                {email}
              </a>
            ) : null}{" "}
            and your message will be directed to the relevant executive.
          </>
        }
        primary={{ href: "/contact", label: "Contact Edge Comm-Tech" }}
        secondary={{ href: "/careers", label: "Careers at Edge" }}
        accent={ACCENT}
      />
    </main>
  );
}
