import type { Metadata } from "next";
import Link from "next/link";
import { getJobs } from "@/lib/content";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Engineering, operations, and internship roles at Edge COMM-TECH in Addis Ababa.",
};

const TYPE_LABEL: Record<string, string> = {
  "full-time": "Full time",
  contract: "Contract",
  internship: "Internship",
};

export default async function CareersPage() {
  const jobs = await getJobs();

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.28em] text-gold">Join us</p>
      <h1 className="mt-3 font-display text-5xl">Careers</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink/80">
        We hire engineers who want to be in the room when it is commissioned. Every open role links to the
        E-Academy material we expect candidates to have watched before an interview.
      </p>

      {jobs.length === 0 ? (
        <div className="mt-12 border border-rule bg-paper-2 p-8">
          <h2 className="font-display text-2xl">No open roles right now</h2>
          <p className="mt-3 max-w-xl text-ink/75">
            We still read speculative applications, particularly from network, systems, and security
            engineers. Send a CV through the contact form and tell us which domain interests you.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-block bg-gold px-5 py-3 font-mono text-xs uppercase tracking-widest text-white hover:bg-gold-2"
          >
            Send a speculative application
          </Link>
        </div>
      ) : (
        <ul className="mt-12 divide-y divide-ink/10 border-y border-ink/10">
          {jobs.map((job) => (
            <li key={job.id} className="py-6">
              <p className="font-mono text-xs uppercase tracking-widest text-steel">
                {[job.team, job.location, TYPE_LABEL[job.type] ?? job.type].join(" · ")}
              </p>
              <h2 className="mt-2 font-display text-2xl">
                <Link href={`/careers/jobs/${job.slug}`} className="hover:text-gold">
                  {job.title}
                </Link>
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-ink/75">{job.summary}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
