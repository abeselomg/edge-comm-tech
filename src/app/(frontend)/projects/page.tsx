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
    <main className="mx-auto max-w-6xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.28em] text-gold">Delivered work</p>
      <h1 className="mt-3 font-display text-5xl">Projects</h1>

      {projects.length === 0 ? (
        <p className="mt-8 max-w-2xl text-lg text-ink/70">
          Project write-ups are published here once the client has agreed to be named. Ask us for
          references relevant to your sector in the meantime.
        </p>
      ) : (
        <ul className="mt-12 grid gap-px bg-ink/15 md:grid-cols-2">
          {projects.map((p) => {
            const sector = typeof p.sector === "object" && p.sector !== null ? p.sector : null;
            return (
              <li key={p.id} className="still p-7">
                <p className="font-mono text-xs uppercase tracking-widest text-steel">
                  {[p.client, p.year, sector?.title].filter(Boolean).join(" · ")}
                </p>
                <h2 className="mt-3 font-display text-2xl">
                  <Link href={`/projects/${p.slug}`} className="hover:text-gold">
                    {p.title}
                  </Link>
                </h2>
                <p className="mt-3 text-sm text-ink/75">{p.scope}</p>
              </li>
            );
          })}
        </ul>
      )}

      <Link
        href="/contact"
        className="mt-12 inline-block bg-gold px-5 py-3 font-mono text-xs uppercase tracking-widest text-white hover:bg-gold-2"
      >
        Ask for references
      </Link>
    </main>
  );
}
