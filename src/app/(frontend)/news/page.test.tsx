import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { p } from "../../../seed/lexical";
import {
  ArchiveBand,
  ArticleBody,
  dateText,
  MoreNews,
  NewsRow,
  PendingDetails,
  splitArchive,
} from "./news-parts";

const html = (el: React.ReactElement | null) => renderToStaticMarkup(<div>{el}</div>);
const live = (over: Record<string, unknown> = {}) => ({ _status: "published", ...over });
const date = (value: string | null, status: "confirmed" | "pending" = "confirmed") => ({
  status,
  value,
  pendingLabel: "Date to confirm",
});
const item = (over: Record<string, unknown> = {}) =>
  live({
    slug: "n1",
    title: "A headline",
    kind: "Company news",
    date: date("2026"),
    archive: false,
    standfirst: "Opening paragraph.",
    body: { root: { type: "root", children: [p("Running text.")] } },
    sections: [],
    heldForPublication: false,
    pendingFields: [],
    closing: {},
    ...over,
  }) as never;

describe("splitArchive", () => {
  it("separates archived milestones from the current feed, keeping order", () => {
    const { current, archive } = splitArchive([
      item({ slug: "a" }),
      item({ slug: "b", archive: true }),
      item({ slug: "c" }),
    ]);
    expect(current.map((n) => n.slug)).toEqual(["a", "c"]);
    expect(archive.map((n) => n.slug)).toEqual(["b"]);
  });
});

describe("dateText", () => {
  it("reads a confirmed date, and the pending label for an undated item", () => {
    expect(dateText(date("2018") as never)).toBe("2018");
    expect(dateText(date(null, "pending") as never)).toBe("Date to confirm");
    expect(dateText(undefined)).toBe("Date to confirm");
  });
});

describe("NewsRow", () => {
  it("shows an undated item's marker rather than a plausible date", () => {
    const out = html(<ul><NewsRow item={item({ date: date(null, "pending") })} /></ul>);
    expect(out).toContain("Date to confirm");
    expect(out).toContain('href="/news/n1"');
    expect(out).not.toContain("undefined");
  });
});

describe("ArchiveBand", () => {
  it("opens only when something is archived", () => {
    expect(html(<ArchiveBand items={[]} />)).not.toContain("From the archive");
    expect(html(<ArchiveBand items={[item({ archive: true, date: date("2018") })]} />)).toContain("From the archive");
  });
});

// Review Focus #3: content held back by design renders its holding state.
describe("PendingDetails", () => {
  const six = ["Official meeting name", "Organizer and partners", "Date and venue", "Edge Comm-Tech attendees", "Approved event photographs", "Organizer or official program URL"];

  it("lists every outstanding detail, in order, with the statement that no record supports the wording", () => {
    const out = html(<PendingDetails fields={six.map((x) => ({ item: x }))} />);
    expect(out).toContain("Details to add before publishing");
    let last = -1;
    for (const f of six) {
      const at = out.indexOf(f);
      expect(at, f).toBeGreaterThan(last);
      last = at;
    }
    expect(out).toContain("no authorized record supports that wording yet");
  });

  it("renders nothing for an item with no outstanding details", () => {
    expect(html(<PendingDetails fields={[]} />)).not.toContain("Details to add");
    expect(html(<PendingDetails fields={undefined} />)).not.toContain("Details to add");
  });
});

describe("ArticleBody", () => {
  it("renders running text, then each titled section under a Priority label", () => {
    const out = html(
      <ArticleBody
        item={item({ sections: [{ title: "Reliable foundations", body: "Networks first." }] })}
        accent="#0888c5"
      />,
    );
    expect(out).toContain("Running text.");
    expect(out.match(/Priority/g)).toHaveLength(1);
    expect(out).toContain("Reliable foundations");
    expect(out).toContain("Networks first.");
  });

  it("works for an item that is all sections and no body", () => {
    expect(() =>
      html(<ArticleBody item={item({ body: null, sections: [{ title: "T", body: "B" }] })} accent="#0888c5" />),
    ).not.toThrow();
  });

  it("shows the outstanding details only while the item is held", () => {
    const fields = [{ item: "Date and venue" }];
    expect(html(<ArticleBody item={item({ heldForPublication: true, pendingFields: fields })} accent="#c48a5a" />)).toContain("Date and venue");
    expect(html(<ArticleBody item={item({ heldForPublication: false, pendingFields: fields })} accent="#c48a5a" />)).not.toContain("Date and venue");
  });

  it("renders the closing block with its links, and not an empty one", () => {
    const closing = { eyebrow: "Looking forward", title: "T", body: "B", links: [{ label: "About", href: "/about" }] };
    const out = html(<ArticleBody item={item({ closing })} accent="#0888c5" />);
    expect(out).toContain("Looking forward");
    expect(out).toContain('href="/about"');
    expect(html(<ArticleBody item={item({ closing: {} })} accent="#0888c5" />)).not.toContain("Looking forward");
  });
});

describe("MoreNews", () => {
  it("lists the other published items, never the current one", () => {
    const out = html(
      <MoreNews
        currentSlug="self"
        items={[item({ slug: "self", title: "SelfTitle" }), item({ slug: "o", title: "OtherTitle" }), item({ slug: "d", title: "DraftTitle", _status: "draft" })]}
      />,
    );
    expect(out).toContain("OtherTitle");
    expect(out).not.toContain("SelfTitle");
    expect(out).not.toContain("DraftTitle");
  });
});
