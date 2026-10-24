import { ClosingCta, Crumb, PageHead } from "@/components/ui";
import { SECTOR_SHORT } from "@/fields/sectors";
import { getPageCopy, getPartners, getProject, getProjects } from "@/lib/content";
import { loadOr404 } from "@/lib/load";
import { accentFor, ProjectBody, ProjectFacts, siblingProjects } from "../project-parts";

/*
 * One template, eight completed-project pages.
 *
 * Shaped as a case study rather than a datasheet: context, then what was
 * delivered, then the result. The facts panel sits immediately under the hero as
 * the content master specifies. A slug that is absent or unpublished is a 404.
 */

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProject(slug);
  return p ? { title: `${p.title} — Edge Comm-Tech`, description: p.summary } : {};
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await loadOr404(() => getProject(slug));
  const [all, copy, brands] = await Promise.all([getProjects(), getPageCopy(), getPartners()]);
  const client = p.client && typeof p.client === "object" ? p.client : null;

  return (
    <main>
      <PageHead
        eyebrow={`${SECTOR_SHORT[p.sector] ?? p.sector} · Completed`}
        title={p.headline ?? p.title}
        intro={p.summary}
        accent={accentFor(p)}
        variant="grid"
        crumb={
          <Crumb
            trail={[{ label: "Projects", href: "/projects" }, { label: client?.name ?? p.title }]}
          />
        }
      />

      <ProjectFacts project={p} />

      <ProjectBody
        project={p}
        siblings={siblingProjects(all, p)}
        implementationNote={copy.projectImplementationNote ?? ""}
        brands={brands as never}
      />

      <ClosingCta
        title="Plan your project with Edge Comm-Tech"
        body="Every engagement on this page began with an assessment and a written requirement. Tell us yours and we will start in the same place."
        primary={{ href: "/contact", label: "Discuss a similar project" }}
        secondary={{ href: "/projects", label: "View all completed projects" }}
        accent={accentFor(p)}
      />
    </main>
  );
}
