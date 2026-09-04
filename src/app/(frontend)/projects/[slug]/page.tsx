import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RichText } from "@/components/rich-text";
import { getProject, getProjects } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "Project" };
  return { title: project.title, description: project.scope };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const sector = typeof project.sector === "object" && project.sector !== null ? project.sector : null;
  const solutions = (project.solutions ?? []).filter(
    (s): s is Exclude<typeof s, number> => typeof s === "object" && s !== null,
  );

  return (
    <main>
      <section className="dark-surface bg-deep text-paper">
        <div className="wrap pb-16 pt-14 md:pb-20 md:pt-20">
          <Link href="/projects" className="link-quiet text-[0.9375rem] text-paper/60">
            All projects
          </Link>
          <h1 className="display display-lg mt-8 max-w-[18ch]">{project.title}</h1>
          <p className="lede mt-6 text-paper/70">{project.scope}</p>
        </div>
      </section>

      <section className="band bg-paper">
        <div className="wrap grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-20">
          <div>
            <RichText data={project.outcome} />
          </div>

          <aside className="h-fit lg:sticky lg:top-24">
            <div className="card p-6">
              <h2 className="display display-xs">Engagement</h2>
              <dl className="mt-4">
                <div className="spec">
                  <dt>Client</dt>
                  <dd>{project.client}</dd>
                </div>
                {project.year ? (
                  <div className="spec">
                    <dt>Year</dt>
                    <dd>{project.year}</dd>
                  </div>
                ) : null}
                {sector ? (
                  <div className="spec">
                    <dt>Sector</dt>
                    <dd>{sector.title}</dd>
                  </div>
                ) : null}
              </dl>
            </div>

            {solutions.length > 0 ? (
              <div className="card mt-5 p-6">
                <h2 className="display display-xs">Domains involved</h2>
                <ul className="mt-4 space-y-2.5">
                  {solutions.map((s) => (
                    <li key={s.id}>
                      <Link
                        href={`/solutions/${s.slug}`}
                        className="block border-l-2 border-brass pl-3 text-[0.9375rem] text-ink-soft transition-colors hover:text-teal"
                      >
                        {s.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>
      </section>
    </main>
  );
}
