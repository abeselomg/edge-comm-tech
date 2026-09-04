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
  const jobs = (course.relatedJobs ?? []).filter(
    (j): j is Exclude<typeof j, number> =>
      typeof j === "object" && j !== null && j._status === "published",
  );
  const solutions = (course.relatedSolutions ?? []).filter(
    (s): s is Exclude<typeof s, number> => typeof s === "object" && s !== null,
  );

  return (
    <main>
      <section className="dark-surface bg-deep text-paper">
        <div className="wrap pb-16 pt-14 md:pb-20 md:pt-20">
          <Link href="/academy" className="link-quiet text-[0.9375rem] text-paper/60">
            Course catalogue
          </Link>
          <h1 className="display display-lg mt-8 max-w-[18ch]">{course.title}</h1>
          <p className="lede mt-6 text-paper/70">{course.summary}</p>
          <p className="mt-4 text-[0.9375rem] text-paper/55">For {course.audience}.</p>
        </div>
      </section>

      <section className="band bg-paper">
        <div className="wrap grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,19rem)] lg:gap-20">
          <div>
            {outcomes.length > 0 ? (
              <section>
                <h2 className="display display-md">What you will learn</h2>
                <ul className="mt-7 space-y-3">
                  {outcomes.map((o, i) => (
                    <li key={o.id ?? i} className="relative measure pl-6 leading-relaxed text-ink-soft">
                      <span
                        className="absolute left-0 top-[0.72em] h-px w-3 bg-brass"
                        aria-hidden
                      />
                      {o.item}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section className="mt-16">
              <h2 className="display display-md">Curriculum</h2>
              <ol className="mt-9">
                {(course.modules ?? []).map((mod, i) => (
                  <li key={mod.id ?? i} className="border-t border-rule py-7">
                    <div className="grid gap-2 md:grid-cols-[3.25rem_minmax(0,1fr)] md:gap-6">
                      <p className="data pt-1 text-brass">
                        {String(i + 1).padStart(2, "0")}
                      </p>
                      <div>
                        <h3 className="display display-sm">{mod.title}</h3>
                        <p className="measure mt-2 leading-relaxed text-ink-soft">{mod.summary}</p>
                        <ul className="mt-5 space-y-px">
                          {(mod.lessons ?? []).map((lesson) => (
                            <li key={lesson.id ?? lesson.slug}>
                              <Link
                                href={`/academy/${course.slug}/${lesson.slug}`}
                                className="flex items-baseline justify-between gap-4 rounded border border-transparent px-3 py-2.5 transition-colors hover:border-rule hover:bg-paper-2"
                              >
                                <span className="text-[0.9375rem] font-medium">{lesson.title}</span>
                                <span className="data shrink-0 text-ink-soft">{lesson.duration}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <aside className="h-fit lg:sticky lg:top-24">
            <div className="card p-6">
              <dl>
                <div className="spec">
                  <dt>Price</dt>
                  <dd>Free</dd>
                </div>
                <div className="spec">
                  <dt>Lessons</dt>
                  <dd>{lessons.length}</dd>
                </div>
                <div className="spec">
                  <dt>Duration</dt>
                  <dd>{course.duration}</dd>
                </div>
                <div className="spec">
                  <dt>Level</dt>
                  <dd>{LEVEL_LABEL[course.level] ?? course.level}</dd>
                </div>
                <div className="spec">
                  <dt>Account</dt>
                  <dd>Not required</dd>
                </div>
              </dl>
              {first ? (
                <Link
                  href={`/academy/${course.slug}/${first.slug}`}
                  className="btn btn-brass mt-6 w-full"
                >
                  Start the first lesson
                </Link>
              ) : null}
            </div>

            {solutions.length > 0 ? (
              <div className="card mt-5 p-6">
                <h2 className="display display-xs">Related domains</h2>
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

            {jobs.length > 0 ? (
              <div className="card mt-5 p-6">
                <h2 className="display display-xs">Roles this prepares you for</h2>
                <ul className="mt-4 space-y-2.5">
                  {jobs.map((job) => (
                    <li key={job.id}>
                      <Link
                        href={`/careers/jobs/${job.slug}`}
                        className="block border-l-2 border-brass pl-3 text-[0.9375rem] text-ink-soft transition-colors hover:text-teal"
                      >
                        {job.title}
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
