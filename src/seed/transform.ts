import type { ConfirmableValue } from "../fields/confirmable";
import { p, rich } from "./lexical";

/*
 * Highland's content modules to Payload's field shapes.
 *
 * Pure functions, no Payload import, so they are testable without a database
 * -- which is the whole reason they are not inlined into the seed script.
 */

type TitledBody = { title: string; body: string };

/** Payload's array-of-one-field shape. */
export const toItems = (values: string[] = []): { item: string }[] =>
  (values ?? []).map((item) => ({ item }));

/*
 * Highland encodes an unconfirmed fact as the placeholder text itself --
 * "Year to confirm", "To be confirmed" -- in the same field that otherwise
 * holds a real value. Payload keeps the state separately, so detect the
 * placeholder rather than importing it as data.
 */
export function toConfirmable(
  raw: string | undefined,
  fallbackLabel: string,
): ConfirmableValue {
  const value = (raw ?? "").trim();
  const isPending = value === "" || /to\s+(?:be\s+)?confirm/i.test(value);
  if (isPending) {
    return { value: null, status: "pending", pendingLabel: value || fallbackLabel };
  }
  return { value, status: "confirmed", pendingLabel: null };
}

/** Highland stores bodies as string arrays; Payload rich text wants Lexical. */
export const toRichParagraphs = (paras: string[] = []) => rich(...paras.map((text) => p(text)));

/*
 * Highland keeps one `iso` per event plus a human date string, which is fine
 * for a one-day webinar and lossy for a range: GITEX is "7-11 December 2026"
 * with iso "2026-12-07". The end date has to come out of the display string.
 *
 * Only a same-month day range is parsed. A range crossing months returns null
 * rather than a guess -- an event whose end date is wrong by a month is worse
 * than one with no end date, which simply falls back to the start.
 */
export function eventDates(input: { iso: string; date: string }): {
  startsOn: string;
  endsOn: string | null;
} {
  const match = /^(\d{1,2})\s*[–-]\s*(\d{1,2})\s+\w+\s+\d{4}$/.exec(input.date.trim());
  if (!match) return { startsOn: input.iso, endsOn: null };

  const [year, month, startDay] = input.iso.split("-");
  // An end day before the start day means the display string and the iso
  // disagree; say nothing rather than emit a range that runs backwards.
  if (Number(match[2]) < Number(startDay)) return { startsOn: input.iso, endsOn: null };
  const endDay = match[2].padStart(2, "0");
  return { startsOn: input.iso, endsOn: `${year}-${month}-${endDay}` };
}

/*
 * Solution detail sections, in the order the approved pages render them
 * (design-src/highland/pages/solution.mjs and service.mjs): bands, capabilities,
 * layers, steps, checklist, measures, sectors, then models (services only).
 *
 * A section is emitted only when it has content. Highland's entries carry
 * different subsets -- the datacenter family uses `bands` and an empty
 * `capabilities`, most use the reverse -- and an empty block in Payload
 * renders as an empty heading on the page.
 *
 * Highland's bands are { label, title, items: [{ title, body }] }; Payload's
 * bands block holds only a title and plain-string entries. Object entries are
 * flattened to "Title: body" and the band `label` is dropped. Plain-string
 * entries pass through unchanged.
 */
const titledBodies = (list: TitledBody[]) => list.map(({ title, body }) => ({ title, body }));

const str = (v: unknown): string | null => (typeof v === "string" && v ? v : null);

export function toDetailBlocks(
  detail: Record<string, unknown>,
): { blockType: string; [k: string]: unknown }[] {
  const blocks: { blockType: string; [k: string]: unknown }[] = [];
  const list = <T>(key: string) => (detail[key] as T[] | undefined) ?? [];

  const bands = list<{ title: string; items: (string | TitledBody)[] }>("bands");
  if (bands.length) {
    blocks.push({
      blockType: "bands",
      items: bands.map((b) => ({
        title: b.title,
        entries: toItems(
          (b.items ?? []).map((e) => (typeof e === "string" ? e : `${e.title}: ${e.body}`)),
        ),
      })),
    });
  }

  const capabilities = list<TitledBody>("capabilities");
  if (capabilities.length) {
    blocks.push({ blockType: "capabilities", items: titledBodies(capabilities) });
  }

  const layers = list<TitledBody>("layers");
  if (layers.length) {
    blocks.push({ blockType: "layers", title: str(detail.layersTitle), items: titledBodies(layers) });
  }

  const steps = list<TitledBody>("steps");
  if (steps.length) {
    blocks.push({ blockType: "steps", title: str(detail.stepsTitle), items: titledBodies(steps) });
  }

  const checklist = list<string>("checklist");
  if (checklist.length) {
    blocks.push({
      blockType: "checklist",
      title: str(detail.checklistTitle) ?? "Considerations",
      items: toItems(checklist),
      note: str(detail.checklistNote),
    });
  }

  const measures = list<string>("measures");
  if (measures.length) {
    blocks.push({
      blockType: "measures",
      title: str(detail.measuresTitle) ?? "How value is measured",
      items: toItems(measures),
    });
  }

  const sectors = list<TitledBody>("sectors");
  if (sectors.length) {
    blocks.push({ blockType: "sectors", title: str(detail.sectorsTitle), items: titledBodies(sectors) });
  }

  const models = list<TitledBody>("models");
  if (models.length) {
    blocks.push({
      blockType: "models",
      title: str(detail.modelsTitle) ?? "Engagement models",
      items: titledBodies(models),
    });
  }

  return blocks;
}
