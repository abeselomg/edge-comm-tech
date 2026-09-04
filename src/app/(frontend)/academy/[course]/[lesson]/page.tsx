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
    <main className="bg-paper">
      <div className="mx-auto grid max-w-[90rem] lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="border-b border-rule px-6 py-8 lg:sticky lg:top-15 lg:h-[calc(100vh-3.75rem)] lg:overflow-y-auto lg:border-b-0 lg:border-r lg:py-10">
          <Link
            href={`/academy/${course.slug}`}
            className="display display-sm block transition-colors hover:text-teal"
          >
            {course.title}
          </Link>
          <nav className="mt-7 space-y-6" aria-label="Course contents">
            {(course.modules ?? []).map((mod, i) => (
              <div key={mod.id ?? i}>
                <h2 className="flex gap-2.5 text-[0.9375rem] font-semibold">
                  <span className="data text-brass">{String(i + 1).padStart(2, "0")}</span>
                  {mod.title}
                </h2>
                <ul className="mt-2 space-y-px border-l border-rule pl-0">
                  {(mod.lessons ?? []).map((item) => {
                    const current = item.slug === lesson.slug;
                    return (
                      <li key={item.id ?? item.slug}>
                        <Link
                          href={`/academy/${course.slug}/${item.slug}`}
                          aria-current={current ? "page" : undefined}
                          className={`-ml-px block border-l-2 py-1.5 pl-3 text-[0.9375rem] transition-colors ${
                            current
                              ? "border-brass font-medium text-ink"
                              : "border-transparent text-ink-soft hover:text-teal"
                          }`}
                        >
                          {item.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        <article className="px-6 py-10 md:px-10 md:py-14">
          <div className="mx-auto max-w-3xl">
            <p className="data text-ink-soft">{lesson.moduleTitle}</p>
            <h1 className="display display-md mt-3">{lesson.title}</h1>
            <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-1">
              <div className="flex gap-2">
                <dt className="text-[0.9375rem] text-ink-soft">Length</dt>
                <dd className="data self-center">{lesson.duration}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-[0.9375rem] text-ink-soft">Account</dt>
                <dd className="data self-center">Not required</dd>
              </div>
            </dl>

            {id ? (
              <div className="mt-8 aspect-video overflow-hidden rounded-md bg-deep">
                <iframe
                  title={lesson.title}
                  className="h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${id}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : null}

            <RichText data={lesson.body} className="mt-9" />

            <nav
              className="mt-14 flex flex-col gap-4 border-t border-rule pt-6 sm:flex-row sm:justify-between"
              aria-label="Lesson"
            >
              {prev ? (
                <Link href={`/academy/${course.slug}/${prev.slug}`} className="group max-w-[20rem]">
                  <span className="block text-[0.9375rem] text-ink-soft">Previous</span>
                  <span className="mt-0.5 block font-medium transition-colors group-hover:text-teal">
                    {prev.title}
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link
                  href={`/academy/${course.slug}/${next.slug}`}
                  className="group max-w-[20rem] sm:text-right"
                >
                  <span className="block text-[0.9375rem] text-ink-soft">Next</span>
                  <span className="mt-0.5 block font-medium transition-colors group-hover:text-teal">
                    {next.title}
                  </span>
                </Link>
              ) : (
                <Link href={`/academy/${course.slug}`} className="group sm:text-right">
                  <span className="block text-[0.9375rem] text-ink-soft">End of course</span>
                  <span className="mt-0.5 block font-medium transition-colors group-hover:text-teal">
                    Back to {course.title}
                  </span>
                </Link>
              )}
            </nav>
          </div>
        </article>
      </div>
    </main>
  );
}
