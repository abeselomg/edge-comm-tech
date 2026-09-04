import type { Metadata } from "next";
import Link from "next/link";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description: "Delivered work across data center, network, cybersecurity, and cloud engagements.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main>
      <section className="dark-surface bg-deep text-paper">
        <div className="wrap pb-20 pt-20 md:pb-24 md:pt-28">
          <h1 className="display display-lg max-w-[12ch]">Delivered work</h1>
          <p className="lede mt-7 text-paper/70">
            Write-ups appear here once the client has agreed to be named. Everything else stays
            between us and them.
          </p>
        </div>
      </section>

      <section className="band bg-paper">
        <div className="wrap">
          {projects.length === 0 ? (
            <div className="card max-w-2xl p-8 md:p-10">
              <h2 className="display display-sm">Nothing published yet</h2>
              <p className="mt-3 leading-relaxed text-ink-soft">
                We will not name a client before they have agreed to it. In the meantime we can put
                you in touch with references relevant to your sector.
              </p>
              <Link href="/contact" className="btn btn-brass mt-7">
                Ask for references
              </Link>
            </div>
          ) : (
            <ul>
              {projects.map((p) => {
                const sector = typeof p.sector === "object" && p.sector !== null ? p.sector : null;
                return (
                  <li key={p.id} className="border-t border-rule last:border-b">
                    <Link
                      href={`/projects/${p.slug}`}
                      className="group grid gap-4 py-9 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] md:gap-10"
                    >
                      <div>
                        <p className="display display-sm">{p.client}</p>
                        <dl className="mt-2 space-y-0.5">
                          {p.year ? (
                            <div className="flex gap-2">
                              <dt className="sr-only">Year</dt>
                              <dd className="data text-ink-soft">{p.year}</dd>
                            </div>
                          ) : null}
                          {sector ? (
                            <div className="flex gap-2">
                              <dt className="sr-only">Sector</dt>
                              <dd className="data text-ink-soft">{sector.title}</dd>
                            </div>
                          ) : null}
                        </dl>
                      </div>
                      <div>
                        <h2 className="text-[1.15rem] font-semibold transition-colors group-hover:text-teal">
                          {p.title}
                        </h2>
                        <p className="measure mt-2 leading-relaxed text-ink-soft">{p.scope}</p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
