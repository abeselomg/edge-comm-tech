import { ClosingCta, Crumb, PageHead, Pending, SectionHead } from "@/components/ui";
import { getContactDetails, getDownloads } from "@/lib/content";
import { DownloadList } from "./download-parts";

/*
 * Downloads.
 *
 * Four records, none yet cleared for public download: the content master
 * requires each document to be checked against the current taxonomy. So the
 * page lists what exists, states each document's status, and routes the
 * request to the team rather than serving a file that has not been approved.
 * The gate that decides whether a card links to a file is downloadLink() in
 * download-parts.tsx, and it fails closed.
 *
 * Every card's note is the master's own reviewer note, not a placeholder
 * written here, which is why it reads as internal rather than marketing.
 */

const ACCENT = "#056a9a";

export const metadata = {
  title: "Downloads — Company Profile, Brochures and Datasheets | Edge Comm-Tech",
  description:
    "Request the Edge Comm-Tech company profile, solutions overview, solution datasheets and vendor catalogues.",
};

const ON_REQUEST = [
  "Company registration, licensing and statutory documentation",
  "Client references and completion certificates, subject to each institution's consent",
  "Solution-specific datasheets and bills of quantity prepared for your requirement",
  "Vendor and manufacturer documentation relevant to a proposed platform",
  "Project methodology, quality and handover documentation samples",
  "Training and knowledge-transfer outlines for a proposed scope",
];

export default async function DownloadsPage() {
  const [docs, contact] = await Promise.all([getDownloads(), getContactDetails()]);
  const email = contact.emails?.[0]?.value;
  /*
   * The "nothing is cleared yet" marker is true only while that is true. It
   * disappears the day an editor approves a document, rather than sitting
   * above a card that says Download.
   */
  const anyCleared = docs.some((d) => d.approved === true);

  return (
    <main>
      <PageHead
        eyebrow="Downloads"
        title="The documents clients and tender committees ask for"
        intro="Company profile, solution brochures, datasheets and vendor catalogues. Each document is checked against the current solution taxonomy before it is published, so some are available on request while that review completes."
        accent={ACCENT}
        variant="grid"
        crumb={<Crumb trail={[{ label: "Resources", href: "/resources" }, { label: "Downloads" }]} />}
        meta={
          anyCleared ? null : (
            <p className="eg-rise mt-6">
              <Pending>No document is cleared for direct download yet</Pending>
            </p>
          )
        }
      />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <SectionHead eyebrow="Document library" title="What exists today" accent={ACCENT} />
        </div>
        <DownloadList docs={docs} />
        <p className="mt-8 max-w-3xl rounded-2xl bg-paper-2 px-6 py-5 text-xs leading-relaxed text-steel">
          Documents are listed with their status rather than hidden. Where a file is still under
          review, the team sends the current approved version directly — usually the same working
          day.
        </p>
      </section>

      <section className="border-t border-rule bg-paper-2/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <SectionHead
            eyebrow="Also available on request"
            title="Documentation for procurement and tender"
            intro="Material that is shared directly rather than published, because it is prepared for a specific requirement or subject to a client's consent."
            accent={ACCENT}
          />
          <ul className="mt-8 grid gap-2.5 sm:grid-cols-2">
            {ON_REQUEST.map((x) => (
              <li
                key={x}
                className="eg-inview flex items-start gap-3 rounded-2xl bg-paper px-5 py-4 text-sm text-ink/80"
              >
                <span className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-gold" />
                <span>{x}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ClosingCta
        title="Tell us which document you need"
        body={
          <>
            Email{" "}
            {email ? (
              <a
                href={`mailto:${email}`}
                className="underline decoration-rule underline-offset-2 hover:text-gold"
              >
                {email}
              </a>
            ) : null}{" "}
            or use the contact form, and name the document and the requirement it is for.
          </>
        }
        primary={{ href: "/contact", label: "Request a document" }}
        secondary={{ href: "/resources", label: "Back to resources" }}
        accent={ACCENT}
      />
    </main>
  );
}
