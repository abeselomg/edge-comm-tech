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
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/projects" className="font-mono text-xs uppercase tracking-widest text-gold">
        ← All projects
      </Link>
      <p className="mt-6 font-mono text-xs uppercase tracking-widest text-steel">
        {[project.client, project.year, sector?.title].filter(Boolean).join(" · ")}
      </p>
      <h1 className="mt-3 font-display text-4xl md:text-5xl">{project.title}</h1>
      <p className="mt-4 text-lg text-ink/80">{project.scope}</p>

      <RichText data={project.outcome} className="mt-10" />

      {solutions.length > 0 ? (
        <section className="mt-14">
          <h2 className="font-display text-2xl">Domains involved</h2>
          <ul className="mt-5 flex flex-wrap gap-3">
            {solutions.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/solutions/${s.slug}`}
                  className="inline-block border border-rule bg-paper-2 px-4 py-2 text-sm hover:border-gold hover:text-gold"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
