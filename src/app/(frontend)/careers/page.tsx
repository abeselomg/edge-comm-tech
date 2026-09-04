import type { Metadata } from "next";
import Link from "next/link";
import { getJobs } from "@/lib/content";

export const metadata: Metadata = {
  title: "Careers",
  description: "Engineering, operations, and internship roles at Edge COMM-TECH in Addis Ababa.",
};

const TYPE_LABEL: Record<string, string> = {
  "full-time": "Full time",
  contract: "Contract",
  internship: "Internship",
};

export default async function CareersPage() {
  const jobs = await getJobs();

  return (
    <main>
      <section className="dark-surface bg-deep text-paper">
        <div className="wrap pb-20 pt-20 md:pb-24 md:pt-28">
          <h1 className="display display-lg max-w-[16ch]">Engineers who want to be in the room</h1>
          <p className="lede mt-7 text-paper/70">
            Every open role links to the E-Academy material we expect candidates to have watched
            before an interview. It is free, and we reference it.
          </p>
        </div>
      </section>

      <section className="band bg-paper">
        <div className="wrap">
          {jobs.length === 0 ? (
            <div className="card max-w-2xl p-8 md:p-10">
              <h2 className="display display-sm">No open roles right now</h2>
              <p className="mt-3 leading-relaxed text-ink-soft">
                We still read speculative applications, particularly from network, systems, and
                security engineers. Send a CV and tell us which domain interests you.
              </p>
              <Link href="/contact" className="btn btn-brass mt-7">
                Send a speculative application
              </Link>
            </div>
          ) : (
            <ul>
              {jobs.map((job) => (
                <li key={job.id} className="border-t border-rule last:border-b">
                  <Link
                    href={`/careers/jobs/${job.slug}`}
                    className="group grid gap-4 py-9 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] md:gap-10"
                  >
                    <dl className="space-y-0.5">
                      <div>
                        <dt className="sr-only">Team</dt>
                        <dd className="data text-brass">{job.team}</dd>
                      </div>
                      <div>
                        <dt className="sr-only">Type</dt>
                        <dd className="data text-ink-soft">{TYPE_LABEL[job.type] ?? job.type}</dd>
                      </div>
                      <div>
                        <dt className="sr-only">Location</dt>
                        <dd className="data text-ink-soft">{job.location}</dd>
                      </div>
                    </dl>
                    <div>
                      <h2 className="display display-sm transition-colors group-hover:text-teal">
                        {job.title}
                      </h2>
                      <p className="measure mt-2.5 leading-relaxed text-ink-soft">{job.summary}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
