import type { Metadata } from "next";
import Link from "next/link";
import { flattenLessons, getCourses } from "@/lib/content";

export const metadata: Metadata = {
  title: "E-Academy",
  description:
    "Free, public technical courses from Edge COMM-TECH — networking, cybersecurity, data center, and systems administration. No account required.",
};

const LEVEL_LABEL: Record<string, string> = {
  all: "All levels",
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export default async function AcademyPage() {
  const courses = await getCourses();

  return (
    <main>
      <section className="dark-surface bg-deep text-paper">
        <div className="wrap pb-20 pt-20 md:pb-24 md:pt-28">
          <h1 className="display display-lg max-w-[13ch]">E-Academy</h1>
          <p className="lede mt-7 text-paper/70">
            Courses built from the work we actually do. Watch without an account — no sign-up, no
            quizzes, no certificates.
          </p>
        </div>
      </section>

      <section className="band bg-paper">
        <div className="wrap">
          {courses.length === 0 ? (
            <p className="text-lg text-ink-soft">Courses are being prepared. Check back shortly.</p>
          ) : (
            <ul className="grid gap-6 lg:grid-cols-2">
              {courses.map((course) => {
                const lessons = flattenLessons(course);
                const first = lessons[0];
                return (
                  <li key={course.id} className="card flex flex-col p-7 md:p-8">
                    <h2 className="display display-sm">
                      <Link href={`/academy/${course.slug}`} className="transition-colors hover:text-teal">
                        {course.title}
                      </Link>
                    </h2>
                    <p className="mt-3 leading-relaxed text-ink-soft">{course.summary}</p>
                    <p className="mt-3 text-[0.9375rem] text-ink-soft">For {course.audience}.</p>

                    <dl className="mt-6 border-t border-rule pt-1">
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
                    </dl>

                    {first ? (
                      <Link
                        href={`/academy/${course.slug}/${first.slug}`}
                        className="btn btn-outline-ink mt-6 self-start"
                      >
                        Start the first lesson
                      </Link>
                    ) : null}
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
