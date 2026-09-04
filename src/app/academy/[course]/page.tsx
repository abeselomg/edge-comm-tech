import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { courses, flattenLessons, getCourse } from "@/lib/content";

type Props = { params: Promise<{ course: string }> };

export function generateStaticParams() {
  return courses.map((c) => ({ course: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { course: slug } = await params;
  const course = getCourse(slug);
  return { title: course?.title ?? "Course" };
}

export default async function CoursePage({ params }: Props) {
  const { course: slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();
  const first = flattenLessons(course)[0];

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <Link href="/academy" className="font-mono text-xs uppercase tracking-widest text-gold-2">
        ← Catalog
      </Link>
      <h1 className="mt-4 font-display text-5xl">{course.title}</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink/80">{course.summary}</p>
      <p className="mt-2 text-sm text-steel">
        For {course.audience}. {course.duration}.
      </p>
      {first ? (
        <Link
          href={`/academy/${course.slug}/${first.slug}`}
          className="mt-8 inline-block bg-gold px-5 py-3 font-mono text-xs uppercase tracking-widest text-white"
        >
          Start first lesson
        </Link>
      ) : null}

      <div className="mt-14 grid gap-10 md:grid-cols-[1fr_18rem]">
        <ol className="space-y-10">
          {course.modules.map((mod, i) => (
            <li key={mod.slug}>
              <p className="font-mono text-xs text-gold-2">U{String(i + 1).padStart(2, "0")}</p>
              <h2 className="mt-1 font-display text-3xl">{mod.title}</h2>
              <p className="mt-2 text-sm text-ink/75">{mod.summary}</p>
              <ul className="mt-4 border-l border-gold pl-4">
                {mod.lessons.map((lesson) => (
                  <li key={lesson.slug} className="py-2">
                    <Link href={`/academy/${course.slug}/${lesson.slug}`} className="hover:text-gold-2">
                      {lesson.title}
                    </Link>
                    <span className="ml-2 font-mono text-xs text-steel">{lesson.duration}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
        <aside className="h-fit border border-rule bg-paper-2 p-5">
          <p className="font-mono text-xs uppercase tracking-widest text-steel">Related jobs</p>
          <ul className="mt-3 space-y-2 text-sm">
            {course.relatedJobs.map((job) => (
              <li key={job.href}>
                <Link href={job.href} className="hover:text-gold-2">
                  {job.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </main>
  );
}
