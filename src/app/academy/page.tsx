import type { Metadata } from "next";
import Link from "next/link";
import { courses } from "@/lib/content";

export const metadata: Metadata = { title: "E-Academy" };

export default function AcademyPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.28em] text-gold-2">Public courses</p>
      <h1 className="mt-3 font-display text-5xl">E-Academy</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink/80">
        Structured courses: modules, lessons, video. Watch without an account. No quizzes, progress bars, or
        certificates in this phase.
      </p>
      <ul className="mt-12 grid gap-6">
        {courses.map((course) => (
          <li key={course.slug} className="rounded-2xl border border-rule bg-paper-2 p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-steel">{course.duration}</p>
            <h2 className="mt-2 font-display text-3xl">
              <Link href={`/academy/${course.slug}`} className="hover:text-gold-2">
                {course.title}
              </Link>
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-ink/80">{course.summary}</p>
            <p className="mt-4 font-mono text-xs text-steel">
              {course.modules.length} modules · {course.modules.reduce((n, m) => n + m.lessons.length, 0)} lessons
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
