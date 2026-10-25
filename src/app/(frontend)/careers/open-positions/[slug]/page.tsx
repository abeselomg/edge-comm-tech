import { Crumb, PageHead } from "@/components/ui";
import { getCareersContent, getContactDetails, getForm, getJob, getJobs } from "@/lib/content";
import { jobOpen } from "@/lib/jobs";
import { loadOr404 } from "@/lib/load";
import { hrEmail } from "../../careers-parts";
import { accentFor, ApplyPanel, JobAside, JobHeader, JobSections } from "../job-parts";

/*
 * One template, the vacancy pages -- the real openings in the content master.
 * A slug that is absent or unpublished is a 404, and the page is prerendered for
 * every published slug.
 */

export async function generateStaticParams() {
  return (await getJobs()).map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const j = await getJob(slug);
  return j ? { title: `${j.title} — Careers at Edge Comm-Tech`, description: j.purpose } : {};
}

export default async function JobPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const j = await loadOr404(() => getJob(slug));
  const [all, careers, contact, form] = await Promise.all([
    getJobs(),
    getCareersContent(),
    getContactDetails(),
    // A closed job shows no form, so the form is not read for it.
    jobOpen(j) ? getForm("job-application") : null,
  ]);
  const accent = accentFor(j);

  return (
    <main>
      <PageHead
        eyebrow={`Open position · ${j.department}`}
        title={j.title}
        intro={j.purposeTitle}
        accent={accent}
        variant="rule"
        crumb={
          <Crumb
            trail={[
              { label: "Careers", href: "/careers" },
              { label: "Open positions", href: "/careers/open-positions" },
              { label: j.title },
            ]}
          />
        }
      />

      <JobHeader job={j} />

      <div className="mx-auto grid max-w-6xl gap-14 px-6 py-16 lg:grid-cols-[1fr_17rem]">
        <article className="min-w-0">
          <JobSections job={j} accent={accent} />
          <ApplyPanel job={j} accent={accent} email={hrEmail(contact)} form={form} />
        </article>
        <JobAside job={j} others={all} docs={careers.applicationDocs ?? []} accent={accent} />
      </div>
    </main>
  );
}
