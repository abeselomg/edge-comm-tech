import Link from "next/link";
import { Pending } from "@/components/ui";
import { approvedLogo } from "@/lib/media";
import type { Download } from "@/payload-types";

/*
 * The downloads page's own pieces, beside page.tsx because Next allows a page
 * only its known exports.
 */

/**
 * The URL to serve for a document, or null when it must not be served.
 *
 * The approval gate lives here, on the read side. Both flags have to hold --
 * the document is approved *and* its file is an approved asset -- and an
 * absent flag is a no, not a yes. `filterOptions` on the file relationship
 * stops an unapproved asset being selected, but says nothing about one
 * un-approved after it was attached; this is the check that covers that.
 *
 * The listing is deliberately not gated. The collection's own contract is that
 * a document can be "listed with its status, and still not be downloadable":
 * hiding an unapproved document would drop all four from the page today.
 */
export function downloadLink(doc: Pick<Download, "approved" | "file">): string | null {
  if (doc.approved !== true) return null;
  return approvedLogo(doc.file)?.url ?? null;
}

function DocIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0 text-steel"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

function DownloadCard({ d }: { d: Download }) {
  const href = downloadLink(d);
  return (
    <li className="eg-inview flex flex-col rounded-2xl border border-rule p-6 transition hover:border-gold">
      <div className="flex items-start justify-between gap-4">
        <span className="font-mono text-[10px] uppercase tracking-widest text-gold">
          {d.category}
        </span>
        <DocIcon />
      </div>
      <h3 className="mt-2.5 font-display text-lg leading-snug">{d.title}</h3>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-steel">{d.meta}</p>
      {d.note ? (
        <p className="mt-3 flex-1 text-[13px] leading-relaxed text-ink/65">{d.note}</p>
      ) : (
        <span className="flex-1" />
      )}
      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-rule pt-4">
        {href ? (
          <a
            href={href}
            className="font-mono text-[10px] uppercase tracking-widest text-gold"
            download
          >
            Download &rarr;
          </a>
        ) : (
          <>
            <Pending>Approval pending</Pending>
            <Link href="/contact" className="font-mono text-[10px] uppercase tracking-widest text-gold">
              Request it &rarr;
            </Link>
          </>
        )}
      </div>
      <p className="mt-2.5 text-[11px] text-steel">{`Owner: ${d.owner}`}</p>
    </li>
  );
}

/**
 * The document library, or an honest empty state.
 *
 * An editor can unpublish every download, and a blank grid under a heading
 * that says "What exists today" would read as a broken page.
 */
export function DownloadList({ docs }: { docs: Download[] }) {
  if (docs.length === 0) {
    return (
      <p className="mt-9 rounded-2xl bg-paper-2 px-6 py-5 text-sm text-steel">
        There are no documents to download right now. Ask the team and they will send the current
        approved version directly.
      </p>
    );
  }
  return (
    <ul className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {docs.map((d) => (
        <DownloadCard key={d.id} d={d} />
      ))}
    </ul>
  );
}
