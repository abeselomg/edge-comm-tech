import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RichText } from "@/components/rich-text";
import { flattenLessons, getCourse, getCourses, youtubeId } from "@/lib/content";

type Props = { params: Promise<{ course: string; lesson: string }> };

export async function generateStaticParams() {
  const courses = await getCourses();
  return courses.flatMap((c) =>
    flattenLessons(c).map((l) => ({ course: c.slug, lesson: l.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { course: slug, lesson: lessonSlug } = await params;
  const course = await getCourse(slug);
  const lesson = course && flattenLessons(course).find((l) => l.slug === lessonSlug);
  return { title: lesson?.title ?? "Lesson" };
}

export default async function LessonPage({ params }: Props) {
  const { course: slug, lesson: lessonSlug } = await params;
  const course = await getCourse(slug);
  if (!course) notFound();

  const all = flattenLessons(course);
  const index = all.findIndex((l) => l.slug === lessonSlug);
  if (index < 0) notFound();

  const lesson = all[index];
  const prev = all[index - 1];
  const next = all[index + 1];
  const id = youtubeId(lesson.videoUrl);

  return (
    <main className="dark-surface min-h-[70vh] bg-ink text-paper">
      <div className="mx-auto grid max-w-[1400px] md:grid-cols-[16rem_1fr]">
        <aside className="border-b border-white/10 p-5 md:border-b-0 md:border-r md:border-white/10">
          <Link
            href={`/academy/${course.slug}`}
            className="font-mono text-[11px] uppercase tracking-widest text-gold"
          >
            {course.title}
          </Link>
          <nav className="mt-6 space-y-6">
            {(course.modules ?? []).map((mod, i) => (
              <div key={mod.id ?? i}>
                <p className="font-mono text-[10px] uppercase tracking-widest text-steel">
                  U{String(i + 1).padStart(2, "0")} {mod.title}
                </p>
                <ul className="mt-2 space-y-1">
                  {(mod.lessons ?? []).map((item) => (
                    <li key={item.id ?? item.slug}>
                      <Link
                        href={`/academy/${course.slug}/${item.slug}`}
                        aria-current={item.slug === lesson.slug ? "page" : undefined}
                        className={`block py-1 text-sm ${
                          item.slug === lesson.slug ? "text-lamp" : "text-paper/70 hover:text-paper"
                        }`}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        <div className="p-5 md:p-8">
          <h1 className="font-display text-3xl md:text-4xl">{lesson.title}</h1>
          <p className="mt-2 font-mono text-xs text-steel">
            {lesson.moduleTitle} · {lesson.duration} · no login
          </p>

          {id ? (
            <div className="mt-6 aspect-video overflow-hidden bg-black">
              <iframe
                title={lesson.title}
                className="h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${id}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : null}

          <RichText data={lesson.body} className="mt-8 max-w-2xl" />

          <div className="mt-12 flex justify-between gap-6 border-t border-white/10 pt-6 font-mono text-xs uppercase tracking-widest">
            {prev ? (
              <Link href={`/academy/${course.slug}/${prev.slug}`} className="text-gold">
                ← {prev.title}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/academy/${course.slug}/${next.slug}`} className="text-gold">
                {next.title} →
              </Link>
            ) : (
              <Link href={`/academy/${course.slug}`} className="text-gold">
                Back to course
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
