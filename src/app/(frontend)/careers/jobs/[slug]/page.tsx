import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RichText } from "@/components/rich-text";
import { getJob, getJobs } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

const TYPE_LABEL: Record<string, string> = {
  "full-time": "Full time",
  contract: "Contract",
  internship: "Internship",
};

export async function generateStaticParams() {
  const jobs = await getJobs();
  return jobs.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJob(slug);
  if (!job) return { title: "Role" };
  return { title: job.title, description: job.summary };
}

export default async function JobPage({ params }: Props) {
  const { slug } = await params;
  const job = await getJob(slug);
  if (!job) notFound();

  const requirements = job.requirements ?? [];
  const courses = (job.relatedCourses ?? []).filter(
    (c): c is Exclude<typeof c, number> => typeof c === "object" && c !== null,
  );

  return (
    <main>
      <section className="dark-surface bg-deep text-paper">
        <div className="wrap pb-16 pt-14 md:pb-20 md:pt-20">
          <Link href="/careers" className="link-quiet text-[0.9375rem] text-paper/60">
            All roles
          </Link>
          <h1 className="display display-lg mt-8 max-w-[16ch]">{job.title}</h1>
          <p className="lede mt-6 text-paper/70">{job.summary}</p>
        </div>
      </section>

      <section className="band bg-paper">
        <div className="wrap grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-20">
          <div>
            <RichText data={job.description} />

            {requirements.length > 0 ? (
              <section className="mt-14">
                <h2 className="display display-md">What we expect</h2>
                <ul className="mt-7 space-y-3">
                  {requirements.map((r, i) => (
                    <li key={r.id ?? i} className="relative measure pl-6 leading-relaxed text-ink-soft">
                      <span className="absolute left-0 top-[0.72em] h-px w-3 bg-brass" aria-hidden />
                      {r.item}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>

          <aside className="h-fit lg:sticky lg:top-24">
            <div className="card p-6">
              <h2 className="display display-xs">The role</h2>
              <dl className="mt-4">
                <div className="spec">
                  <dt>Team</dt>
                  <dd>{job.team}</dd>
                </div>
                <div className="spec">
                  <dt>Type</dt>
                  <dd>{TYPE_LABEL[job.type] ?? job.type}</dd>
                </div>
                <div className="spec">
                  <dt>Location</dt>
                  <dd>{job.location}</dd>
                </div>
              </dl>
              <Link href={`/contact?role=${job.slug}`} className="btn btn-brass mt-6 w-full">
                Apply for this role
              </Link>
            </div>

            {courses.length > 0 ? (
              <div className="card mt-5 p-6">
                <h2 className="display display-xs">Watch before you apply</h2>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">
                  Free, no account needed. We reference this material in the interview.
                </p>
                <ul className="mt-4 space-y-2.5">
                  {courses.map((c) => (
                    <li key={c.id}>
                      <Link
                        href={`/academy/${c.slug}`}
                        className="block border-l-2 border-brass pl-3 text-[0.9375rem] text-ink-soft transition-colors hover:text-teal"
                      >
                        {c.title}
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
