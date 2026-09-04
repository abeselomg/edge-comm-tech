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
    <main className="mx-auto max-w-6xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.28em] text-gold-2">Public courses</p>
      <h1 className="mt-3 font-display text-5xl">E-Academy</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink/80">
        Structured courses built from the work we actually do: modules, lessons, video. Watch without an
        account. No quizzes, progress bars, or certificates.
      </p>

      {courses.length === 0 ? (
        <p className="mt-10 text-ink/70">Courses are being prepared. Check back shortly.</p>
      ) : (
        <ul className="mt-12 grid gap-6">
          {courses.map((course) => {
            const lessons = flattenLessons(course);
            const first = lessons[0];
            return (
              <li
                key={course.id}
                className="grid gap-6 rounded-2xl border border-rule bg-paper-2 p-6 md:grid-cols-[1fr_14rem]"
              >
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-steel">
                    {[
                      LEVEL_LABEL[course.level] ?? course.level,
                      course.duration,
                      `${lessons.length} ${lessons.length === 1 ? "lesson" : "lessons"}`,
                    ].join(" · ")}
                  </p>
                  <h2 className="mt-2 font-display text-3xl">
                    <Link href={`/academy/${course.slug}`} className="hover:text-gold-2">
                      {course.title}
                    </Link>
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm text-ink/80">{course.summary}</p>
                  <p className="mt-3 font-caption text-sm text-steel">For {course.audience}.</p>
                </div>

                <div className="flex flex-col justify-between gap-4 border-t border-rule pt-4 md:border-l md:border-t-0 md:pl-6 md:pt-0">
                  <div>
                    <p className="font-display text-2xl">Free</p>
                    <p className="font-caption text-sm text-steel">No account needed</p>
                  </div>
                  {first ? (
                    <Link
                      href={`/academy/${course.slug}/${first.slug}`}
                      className="block bg-gold px-4 py-3 text-center font-mono text-xs uppercase tracking-widest text-white hover:bg-gold-2"
                    >
                      Start now
                    </Link>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
