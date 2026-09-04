import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { flattenLessons, getCourse, getCourses } from "@/lib/content";

type Props = { params: Promise<{ course: string }> };

const LEVEL_LABEL: Record<string, string> = {
  all: "All levels",
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export async function generateStaticParams() {
  const courses = await getCourses();
  return courses.map((c) => ({ course: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { course: slug } = await params;
  const course = await getCourse(slug);
  if (!course) return { title: "Course" };
  return { title: course.title, description: course.summary };
}

export default async function CoursePage({ params }: Props) {
  const { course: slug } = await params;
  const course = await getCourse(slug);
  if (!course) notFound();

  const lessons = flattenLessons(course);
  const first = lessons[0];
  const outcomes = course.outcomes ?? [];
  // Related docs are populated regardless of status, so unpublished roles are
  // filtered out here rather than linking visitors to a 404.
  const jobs = (course.relatedJobs ?? []).filter(
    (j): j is Exclude<typeof j, number> =>
      typeof j === "object" && j !== null && j._status === "published",
  );
  const solutions = (course.relatedSolutions ?? []).filter(
    (s): s is Exclude<typeof s, number> => typeof s === "object" && s !== null,
  );

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <Link href="/academy" className="font-mono text-xs uppercase tracking-widest text-gold-2">
        ← Catalog
      </Link>

      <div className="mt-14 grid gap-12 md:grid-cols-[1fr_19rem]">
        <div>
          <h1 className="font-display text-4xl md:text-5xl">{course.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-ink/80">{course.summary}</p>
          <p className="mt-2 font-caption text-sm text-steel">For {course.audience}.</p>

          {outcomes.length > 0 ? (
            <section className="mt-12">
              <h2 className="font-display text-2xl">What you will learn</h2>
              <ul className="mt-5 space-y-2">
                {outcomes.map((o, i) => (
                  <li key={o.id ?? i} className="flex gap-3 text-ink/80">
                    <span className="text-gold-2">—</span>
                    <span>{o.item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="mt-14">
            <h2 className="font-display text-2xl">Curriculum</h2>
            <ol className="mt-8 space-y-10">
              {(course.modules ?? []).map((mod, i) => (
                <li key={mod.id ?? i}>
                  <p className="font-mono text-xs text-gold-2">U{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-1 font-display text-2xl">{mod.title}</h3>
                  <p className="mt-2 text-sm text-ink/75">{mod.summary}</p>
                  <ul className="mt-4 border-l border-gold pl-4">
                    {(mod.lessons ?? []).map((lesson) => (
                      <li key={lesson.id ?? lesson.slug} className="py-2">
                        <Link
                          href={`/academy/${course.slug}/${lesson.slug}`}
                          className="hover:text-gold-2"
                        >
                          {lesson.title}
                        </Link>
                        <span className="ml-2 font-mono text-xs text-steel">{lesson.duration}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="h-fit md:sticky md:top-24">
          <div className="still p-6">
            <p className="font-display text-3xl">Free</p>
            <dl className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-steel">Lessons</dt>
                <dd>{lessons.length}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-steel">Duration</dt>
                <dd className="text-right">{course.duration}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-steel">Level</dt>
                <dd>{LEVEL_LABEL[course.level] ?? course.level}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-steel">Account</dt>
                <dd>Not required</dd>
              </div>
            </dl>
            {first ? (
              <Link
                href={`/academy/${course.slug}/${first.slug}`}
                className="mt-6 block bg-gold px-4 py-3 text-center font-mono text-xs uppercase tracking-widest text-white hover:bg-gold-2"
              >
                Start now
              </Link>
            ) : null}
          </div>

          {jobs.length > 0 ? (
            <div className="still mt-6 p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-steel">Related roles</p>
              <ul className="mt-3 space-y-2 text-sm">
                {jobs.map((job) => (
                  <li key={job.id}>
                    <Link href={`/careers/jobs/${job.slug}`} className="hover:text-gold-2">
                      {job.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {solutions.length > 0 ? (
            <div className="still mt-6 p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-steel">
                Related domains
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {solutions.map((s) => (
                  <li key={s.id}>
                    <Link href={`/solutions/${s.slug}`} className="hover:text-gold-2">
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </div>
    </main>
  );
}
