import { Mark } from "@/components/ui";
import type { WithLogo } from "@/lib/content";
import { approvedLogo } from "@/lib/media";
import type { Partner } from "@/payload-types";
import { CARD, RING_RADII, ringLayout } from "./rings";

/*
 * The partners on three slowly turning rings: a logo where approved artwork
 * exists, the partner's name in the same card where it does not.
 *
 * Decorative, so the whole diagram is aria-hidden: the brand grid below it is
 * the complete, accessible list. Nothing here is a link or a control, and the
 * only text is the partners' names and the hub's "Edge Comm-Tech" -- no ring
 * labels, no counts, nothing that reads as rank (Review Focus #4).
 *
 * CSS only, no client script. Each ring wrapper turns with eg-spin, which
 * animates the independent `rotate` property; each card is centred on its
 * point with `translate` and turns back by the same amount at the same speed,
 * so it stays upright. The keyframes, hover pause and reduced-motion rule are
 * in globals.css (.eg-rings, .eg-ring, .eg-ring-card).
 *
 * Every size is in cqw -- the root is an inline-size container, and square -- so the
 * diagram scales as one piece. The card box comes from rings.ts (CARD), where
 * a test holds it to the ring spacing.
 */

/** Seconds per turn and direction, inner ring first. */
const SPIN = [
  { spin: 150, dir: "normal", counter: "reverse" },
  { spin: 210, dir: "reverse", counter: "normal" },
  { spin: 270, dir: "normal", counter: "reverse" },
] as const;

type RingPartner = Pick<WithLogo<Partner>, "name" | "logo">;

export function PartnerRings({ partners }: { partners: RingPartner[] }) {
  // Logo or name is decided by the same gate Mark applies, so both kinds are
  // spread over every ring.
  const cards = ringLayout(partners, { kind: (p) => approvedLogo(p.logo) !== null });
  if (cards.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      data-parity="partner-rings"
      className="eg-rings relative mx-auto hidden aspect-square w-full max-w-[56rem] md:block"
    >
      {RING_RADII.map((r) => (
        <span
          key={r}
          className="eg-ring-line absolute rounded-full border border-dashed border-gold/20"
          style={{ width: `${2 * r}%`, height: `${2 * r}%`, left: `${50 - r}%`, top: `${50 - r}%` }}
        />
      ))}
      <div className="eg-breathe absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="grid h-28 w-28 place-items-center rounded-full border border-gold/30 bg-paper text-center shadow-[0_18px_44px_-24px_rgb(8_136_197/0.8)]">
          <span className="font-display text-[13px] leading-tight">
            Edge
            <br />
            Comm-Tech
          </span>
        </span>
      </div>
      {SPIN.map(({ spin, dir, counter }, ring) => (
        <div
          key={ring}
          className={`eg-ring eg-ring-${ring}`}
          style={{ "--spin": `${spin}s`, "--dir": dir, "--counter": counter } as React.CSSProperties}
        >
          {cards
            .filter((c) => c.ring === ring)
            .map((c) => (
              <div
                key={c.index}
                className="eg-ring-card"
                style={{ left: `${c.x}%`, top: `${c.y}%`, width: `${CARD.w}cqw`, height: `${CARD.h}cqw` }}
              >
                <Mark item={c.item} imgClass="eg-ring-logo" nameClass="eg-ring-name" lazy />
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
