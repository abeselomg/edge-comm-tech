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
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/careers" className="font-mono text-xs uppercase tracking-widest text-gold">
        ← All roles
      </Link>
      <p className="mt-6 font-mono text-xs uppercase tracking-widest text-steel">
        {[job.team, job.location, TYPE_LABEL[job.type] ?? job.type].join(" · ")}
      </p>
      <h1 className="mt-3 font-display text-4xl md:text-5xl">{job.title}</h1>
      <p className="mt-4 text-lg text-ink/80">{job.summary}</p>

      <RichText data={job.description} className="mt-10" />

      {requirements.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-display text-2xl">What we expect</h2>
          <ul className="mt-5 space-y-2">
            {requirements.map((r, i) => (
              <li key={r.id ?? i} className="flex gap-3 text-ink/80">
                <span className="text-gold">—</span>
                <span>{r.item}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {courses.length > 0 ? (
        <section className="mt-12 border border-rule bg-paper-2 p-6">
          <h2 className="font-display text-xl">Watch these before you apply</h2>
          <p className="mt-2 text-sm text-ink/70">
            Free, no account needed. We reference this material in the interview.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {courses.map((c) => (
              <li key={c.id}>
                <Link href={`/academy/${c.slug}`} className="text-gold hover:underline">
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <Link
        href={`/contact?role=${job.slug}`}
        className="mt-12 inline-block bg-gold px-5 py-3 font-mono text-xs uppercase tracking-widest text-white hover:bg-gold-2"
      >
        Apply for this role
      </Link>
    </main>
  );
}
