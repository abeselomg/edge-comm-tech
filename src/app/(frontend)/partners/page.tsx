import { ClosingCta, CtaRow, PageHead, SectionHead } from "@/components/ui";
import { getPageCopy, getPartnerCategories, getPartners } from "@/lib/content";
import { brandCard, byCategory, filterCss, orbit, RING } from "./partner-parts";

/*
 * Partner network.
 *
 * The hub-and-spoke device carries the ten capability categories rather than
 * the brands: the approved list runs to thirty-two names, and thirty-two
 * labels on one ring is unreadable. The ring is also the filter control -- each
 * node is the label for its radio -- so the diagram does real work.
 *
 * All language about certification, authorisation and partner tier is absent.
 * The content master forbids publishing partnership type, authorisation level
 * or certification tier anywhere public, so no such claim appears here and no
 * field for one exists in the data.
 *
 * Filtering is hidden radio inputs plus sibling selectors: no script, no
 * client component. Highland's "N marks pending approved artwork" line is not
 * ported; see the note on the clients page.
 */

export const metadata = {
  title: "Technology Partners and Manufacturers — Edge Comm-Tech",
  description:
    "Edge Comm-Tech works with global technology manufacturers and distributors across software, AI, networking, compute, cloud, datacenter, cybersecurity, power, broadcast and EV charging.",
};

const MEANING = [
  [
    "Suitable technology",
    "Platforms selected against your requirements rather than whatever is easiest to source.",
  ],
  [
    "Vendor-aligned delivery",
    "Implementation that follows the manufacturer's own guidance, so support stays valid.",
  ],
  [
    "A clear escalation path",
    "Issues that need the manufacturer reach the manufacturer, with Edge Comm-Tech coordinating.",
  ],
  [
    "Lifecycle visibility",
    "Firmware, licensing, warranty and end-of-support changes tracked as part of support.",
  ],
] as const;

export default async function PartnersPage() {
  const [copy, partners, categories] = await Promise.all([
    getPageCopy(),
    getPartners(),
    getPartnerCategories(),
  ]);
  const hero = copy.partnersHero;
  const groups = byCategory(partners, categories);
  const keys = Object.keys(groups);
  const labelOf = Object.fromEntries(categories.map((c) => [c.key, c.label]));
  const ringOf = Object.fromEntries(categories.map((c) => [c.key, c.ringLabel]));
  const nodes = orbit(keys);

  return (
    <main>
      <style dangerouslySetInnerHTML={{ __html: filterCss(keys) }} />
      <PageHead
        eyebrow={hero?.eyebrow}
        title={hero?.title ?? "Partner network"}
        intro={hero?.intro}
        accent="#0888c5"
        variant="wash"
        ctas={
          <CtaRow
            primary={{ href: "#network", label: "Browse the network" }}
            secondary={{ href: "/contact", label: "Discuss a platform" }}
          />
        }
      />

      {/* Radios first: every filterable region below is a later sibling. */}
      <div id="network" className="relative">
        <input type="radio" name="cat" id="f-all" className="sr-only" defaultChecked />
        {keys.map((k) => (
          <input key={k} type="radio" name="cat" id={`f-${k}`} className="sr-only" />
        ))}

        <div className="wrap">
          <section className="mx-auto max-w-6xl px-6 py-16">
            <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
              <div>
                <SectionHead
                  eyebrow="How the network is organised"
                  title={`${keys.length === 10 ? "Ten" : keys.length} capability groups, one accountable integrator`}
                />
                <p className="lede mt-5 max-w-xl text-sm leading-relaxed text-ink/70">
                  <span className="l-all">
                    Select a capability group — on the ring or in the list below — to see the
                    manufacturers and distributors Edge Comm-Tech works with in that area.
                  </span>
                  {categories
                    .filter((c) => keys.includes(c.key))
                    .map((c) => (
                      <span key={c.key} className={`l-${c.key}`}>
                        {c.description}
                      </span>
                    ))}
                </p>
                <p className="mt-6">
                  <label
                    htmlFor="f-all"
                    className="inline-block cursor-pointer rounded-full border border-rule px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition hover:border-gold hover:text-gold"
                  >
                    {`Show all ${partners.length}`}
                  </label>
                </p>
              </div>

              {/* Hidden below md: ten 8.5rem nodes on a ring that narrow is unreadable,
                  and the filter bar below does the same job on a phone. */}
              <div className="relative mx-auto hidden aspect-square w-full max-w-[34rem] md:block">
                <svg viewBox="0 0 820 820" className="absolute inset-0 h-full w-full" aria-hidden="true">
                  <defs>
                    <linearGradient id="spoke" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#0888c5" stopOpacity=".55" />
                      <stop offset="100%" stopColor="#0888c5" stopOpacity=".12" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx={RING.cx}
                    cy={RING.cy}
                    r={RING.r}
                    fill="none"
                    stroke="#0888c5"
                    strokeOpacity=".12"
                    strokeDasharray="3 7"
                  />
                  {nodes.map((n, i) => (
                    <line
                      key={n.k}
                      className={`spoke eg-draw s-${n.k}`}
                      style={{ "--len": RING.r, "--d": `${(i * 0.08).toFixed(2)}s` } as React.CSSProperties}
                      x1={RING.cx}
                      y1={RING.cy}
                      x2={n.x.toFixed(1)}
                      y2={n.y.toFixed(1)}
                      stroke="url(#spoke)"
                      strokeWidth="1.5"
                    />
                  ))}
                </svg>
                <div className="eg-breathe absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="grid h-28 w-28 place-items-center rounded-full border border-gold/30 bg-paper text-center shadow-[0_18px_44px_-24px_rgb(8_136_197/0.8)]">
                    <span className="font-display text-[13px] leading-tight">
                      Edge
                      <br />
                      Comm-Tech
                    </span>
                  </span>
                </div>
                {nodes.map((n, i) => (
                  <div
                    key={n.k}
                    className={`node c-${n.k} eg-pop absolute -translate-x-1/2 -translate-y-1/2`}
                    style={
                      {
                        "--d": `${(0.45 + i * 0.06).toFixed(2)}s`,
                        left: `${((n.x / 820) * 100).toFixed(2)}%`,
                        top: `${((n.y / 820) * 100).toFixed(2)}%`,
                      } as React.CSSProperties
                    }
                  >
                    <label
                      htmlFor={`f-${n.k}`}
                      className="pill flex w-[8.5rem] cursor-pointer flex-col items-center gap-0.5 rounded-2xl border border-rule bg-paper-2 px-3 py-2.5 text-center shadow-[0_8px_24px_-16px_rgb(8_136_197/0.7)] transition hover:-translate-y-0.5 hover:border-gold"
                    >
                      <span className="font-display text-[13px] leading-tight">{ringOf[n.k]}</span>
                      <span className="font-mono text-[9px] uppercase tracking-widest text-steel">
                        {`${groups[n.k].length} brands`}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Filter bar + brand grid */}
          <section className="border-t border-rule bg-paper-2/40">
            <div className="mx-auto max-w-6xl px-6 py-14">
              <p className="font-mono text-[10px] uppercase tracking-widest text-gold">
                Manufacturers and distributors
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <label
                  htmlFor="f-all"
                  className="cursor-pointer rounded-full border border-rule px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-widest transition hover:border-gold"
                >
                  {`All ${partners.length}`}
                </label>
                {keys.map((k) => (
                  <label
                    key={k}
                    htmlFor={`f-${k}`}
                    className="cursor-pointer rounded-full border border-rule px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-widest transition hover:border-gold"
                  >
                    {labelOf[k]} <span className="text-steel">{groups[k].length}</span>
                  </label>
                ))}
              </div>
              <ul className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {partners.map((p) => brandCard(p, ringOf))}
              </ul>
            </div>
          </section>
        </div>
      </div>

      {/* What a partnership means here, stated without tier claims */}
      <section className="border-t border-rule">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHead
            eyebrow="What this means for clients"
            title="Why the manufacturer relationship matters"
          />
          <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {MEANING.map(([t, b], i) => (
              <div key={t} className="eg-inview border-t border-rule pt-5">
                <span className="font-mono text-[10px] text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-1.5 font-display text-lg leading-snug">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{b}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 max-w-3xl rounded-2xl bg-paper-2 px-6 py-5 text-xs leading-relaxed text-steel">
            Partner names and marks are shown to describe the technologies Edge Comm-Tech delivers
            and supports. Specific partnership types, authorization levels and certification tiers
            are confirmed directly with clients and tender committees rather than published,
            because they change over time and are governed by each manufacturer&apos;s own
            agreements.
          </p>
        </div>
      </section>

      <ClosingCta
        title="Looking for a specific platform?"
        body="Tell us which technology you are standardising on, or what you need it to do. We will tell you whether we deliver it and how we would support it."
        primary={{ href: "/contact", label: "Ask about a platform" }}
        secondary={{ href: "/solutions", label: "Explore solutions" }}
      />
    </main>
  );
}
