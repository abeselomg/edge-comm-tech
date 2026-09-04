import Link from "next/link";

const DIRECTIONS = [
  {
    href: "/",
    label: "Current",
    face: "Archivo, width axis pushed to 115%",
    idea: "Statement hero, then a numbered register of the six domains.",
    note: "The expanded display face is the thing flagged as not working.",
  },
  {
    href: "/design/a",
    label: "A — Institutional",
    face: "Newsreader, serif",
    idea: "Masthead hero, editorial register, sequence on hairline rules.",
    note: "A serif reads closer to a bank or consultancy than a vendor. None of the three reference sites uses one, so it is the strongest differentiator available on type alone.",
  },
  {
    href: "/design/b",
    label: "B — Utility",
    face: "Instrument Sans, normal width",
    idea: "Small headline, the six domains beside it, then a full capability table.",
    note: "The opposite move: the headline stops being the event and the information carries the page. Every acronym is on the first screen.",
  },
  {
    href: "/design/d",
    label: "D — Left rail",
    face: "Instrument Sans, one family",
    idea: "Fixed left rail instead of a top bar. The catalogue opens the page; the pitch comes second. Offset grid, one paper ground, no alternating bands.",
    note: "The only one that changes the page frame and the section order rather than the typeface. A, B and C are one structure wearing three fonts; this is a different structure.",
  },
  {
    href: "/design/c",
    label: "C — Industrial",
    face: "Archivo Narrow, condensed",
    idea: "Large condensed headline with the domains drawn as a rack elevation.",
    note: "The lettering of rack labels and plant signage. Makes the catalogue a picture of the thing Edge actually builds.",
  },
];

export default function DesignIndex() {
  return (
    <main>
      <section className="dark-surface bg-deep text-paper">
        <div className="wrap pb-14 pt-20 md:pb-16 md:pt-24">
          <h1 className="display display-lg max-w-[16ch]">Three homepage directions</h1>
          <p className="lede mt-7 text-paper/70">
            Same palette and the same content in all four, so the comparison is about typography and
            structure rather than colour. Each page has a switcher at the top for flipping between
            them.
          </p>
        </div>
      </section>

      <section className="band bg-paper">
        <div className="wrap">
          <ul className="grid gap-6 lg:grid-cols-2">
            {DIRECTIONS.map((d) => (
              <li key={d.href} className="card flex flex-col p-7">
                <h2 className="display display-sm">
                  <Link href={d.href} className="transition-colors hover:text-teal">
                    {d.label}
                  </Link>
                </h2>
                <p className="data mt-2 text-brass">{d.face}</p>
                <p className="mt-4 font-medium">{d.idea}</p>
                <p className="mt-2 leading-relaxed text-ink-soft">{d.note}</p>
                <Link href={d.href} className="btn btn-outline-ink mt-6 self-start">
                  Open {d.label.split(" ")[0]}
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-12 max-w-[60ch] leading-relaxed text-ink-soft">
            These routes are temporary and excluded from search. Once you pick a direction I roll it
            across the rest of the site and delete the other two.
          </p>
        </div>
      </section>
    </main>
  );
}
