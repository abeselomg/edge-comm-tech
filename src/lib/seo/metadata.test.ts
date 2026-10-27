import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  buildMetadata,
  cleanTitle,
  documentSeo,
  fullTitle,
  HOME_DESCRIPTION,
  HOME_TITLE,
  shareImageOf,
  TITLE_TEMPLATE,
  titleField,
} from "./metadata";
import { stripMarkup, trimDescription } from "./text";

const saved = { url: process.env.SITE_URL, idx: process.env.SITE_INDEXABLE };
beforeEach(() => {
  process.env.SITE_URL = "https://www.example.com";
  process.env.SITE_INDEXABLE = "true";
});
afterEach(() => {
  for (const [key, value] of [["SITE_URL", saved.url], ["SITE_INDEXABLE", saved.idx]] as const) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

const brandCount = (s: string) => (s.match(/Edge Comm-Tech/gi) ?? []).length;

describe("the title template", () => {
  it("is one format, '%s | Edge Comm-Tech'", () => {
    expect(TITLE_TEMPLATE).toBe("%s | Edge Comm-Tech");
  });
});

describe("titles carry the site name exactly once", () => {
  const raw = [
    "Cybersecurity Solutions",
    "Cybersecurity Solutions — Edge Comm-Tech",
    "Cybersecurity Solutions | Edge Comm-Tech",
    "Cybersecurity Solutions - Edge Comm-Tech",
    "Cybersecurity Solutions — Edge Comm-Tech — Edge Comm-Tech",
    "Careers at Edge Comm-Tech — Build Africa's Digital Future",
    "Our Clients — Banks, Universities and Government Institutions | Edge Comm-Tech",
    "Edge Comm-Tech",
    "Senior Engineer — Careers at Edge Comm-Tech",
    HOME_TITLE,
    "Executive Management",
  ];

  it.each(raw)("%s", (title) => {
    expect(brandCount(fullTitle(title))).toBe(1);
    const field = titleField(title);
    // A plain string gets the brand from the layout template; an absolute title
    // already has it. Either way the rendered title has it once.
    const rendered = typeof field === "string" ? TITLE_TEMPLATE.replace("%s", field) : (field as { absolute: string }).absolute;
    expect(brandCount(rendered)).toBe(1);
    expect(rendered).toBe(fullTitle(title));
  });

  it("strips a trailing brand in every separator form", () => {
    for (const sep of [" — ", " – ", " | ", " - "]) {
      expect(cleanTitle(`Services${sep}Edge Comm-Tech`)).toBe("Services");
    }
  });

  it("does not add the brand after a title that already names it", () => {
    expect(fullTitle("About Edge Comm-Tech — Technology Solutions Company in Ethiopia")).toBe(
      "About Edge Comm-Tech — Technology Solutions Company in Ethiopia",
    );
  });

  it("the home title is the explicit one built from the site's copy", () => {
    expect(fullTitle(HOME_TITLE)).toBe("Edge Comm-Tech: integrated technology solutions in Ethiopia");
  });
});

describe("trimDescription", () => {
  it("strips markup and collapses whitespace", () => {
    expect(trimDescription("<p>Hello&nbsp; <b>world</b></p>\n\n again")).toBe("Hello world again");
    expect(stripMarkup(null)).toBe("");
  });

  it("leaves a short description alone", () => {
    expect(trimDescription("Short and sweet.")).toBe("Short and sweet.");
  });

  it("cuts a long one at a word boundary, within 155 characters, with an ellipsis", () => {
    const long = "word ".repeat(80).trim();
    const out = trimDescription(long);
    expect(out.length).toBeLessThanOrEqual(155);
    expect(out.endsWith("…")).toBe(true);
    expect(out.slice(0, -1).split(" ").every((w) => w === "word")).toBe(true);
  });

  it("prefers the end of a sentence in the back half", () => {
    const first = "This first sentence is deliberately long enough to pass the halfway point of the limit.";
    const text = `${first} Then a second sentence continues beyond the limit with many more words so it must be cut somewhere.`;
    const out = trimDescription(text);
    expect(out).toBe(first);
    // ...but a sentence that ends before the halfway point is not worth keeping alone.
    const early = `Hi. ${"x".repeat(50)} ${"y".repeat(150)}`;
    expect(trimDescription(early)).toBe(`Hi. ${"x".repeat(50)}…`);
  });

  it("never exceeds the limit, whatever the text", () => {
    for (const n of [150, 154, 155, 156, 157, 200]) {
      const text = `${"a".repeat(n - 4)} bbb ccc ddd`;
      expect(trimDescription(text).length).toBeLessThanOrEqual(155);
    }
  });

  it("the home description fits", () => {
    expect(HOME_DESCRIPTION.length).toBeLessThanOrEqual(155);
  });
});

describe("buildMetadata", () => {
  // Built per test, after beforeEach has set the environment.
  const make = () =>
    buildMetadata({
      title: "Cybersecurity Solutions",
      description: "<p>Protect the network.</p>",
      path: "/solutions/cybersecurity?utm=x",
    });

  it("sets title (plain, for the template), description and an absolute canonical without a query", () => {
    expect(make().title).toBe("Cybersecurity Solutions");
    expect(make().description).toBe("Protect the network.");
    expect(make().alternates?.canonical).toBe("https://www.example.com/solutions/cybersecurity");
  });

  it("builds the Open Graph card with the full title and the default picture", () => {
    expect(make().openGraph).toMatchObject({
      type: "website",
      siteName: "Edge Comm-Tech",
      url: "https://www.example.com/solutions/cybersecurity",
      title: "Cybersecurity Solutions | Edge Comm-Tech",
      description: "Protect the network.",
      locale: "en_ET",
      images: [{ url: "https://www.example.com/og-default.png", width: 1200, height: 630 }],
    });
  });

  it("builds a large-image Twitter card", () => {
    expect(make().twitter).toMatchObject({
      card: "summary_large_image",
      title: "Cybersecurity Solutions | Edge Comm-Tech",
      description: "Protect the network.",
    });
  });

  it("is open to indexing when the site is indexable", () => {
    expect(make().robots).toBeUndefined();
  });

  it("is noindex, nofollow when the site is not indexable", () => {
    process.env.SITE_INDEXABLE = "yes";
    expect(buildMetadata({ title: "x", path: "/x" }).robots).toEqual({ index: false, follow: false });
    delete process.env.SITE_INDEXABLE;
    expect(buildMetadata({ title: "x", path: "/x" }).robots).toEqual({ index: false, follow: false });
  });

  it("can keep a single page out of an indexable site", () => {
    expect(buildMetadata({ title: "x", path: "/x", noindex: true }).robots).toEqual({
      index: false,
      follow: false,
    });
  });

  it("uses the page's own share picture, absolutised", () => {
    const m = buildMetadata({
      title: "x",
      path: "/x",
      image: { url: "/api/media/file/a.png", width: 800, height: 400, alt: "A" },
    });
    expect(m.openGraph?.images).toEqual([
      { url: "https://www.example.com/api/media/file/a.png", width: 800, height: 400, alt: "A" },
    ]);
  });

  it("marks a news article as an article", () => {
    const m = buildMetadata({ title: "x", path: "/news/x", type: "article", modifiedTime: "2026-01-01T00:00:00.000Z" });
    expect(m.openGraph).toMatchObject({ type: "article", modifiedTime: "2026-01-01T00:00:00.000Z" });
  });

  it("omits an absent description rather than printing an empty one", () => {
    expect(buildMetadata({ title: "x", path: "/x" }).description).toBeUndefined();
  });
});

describe("documentSeo", () => {
  const fallback = { title: "Doc title", description: "<p>Doc summary</p>" };

  it("uses the document's own title and summary when the editor typed nothing", () => {
    expect(documentSeo({}, fallback)).toEqual({ title: "Doc title", description: "Doc summary", image: null });
    expect(documentSeo({ meta: { title: "  ", description: "" } }, fallback).title).toBe("Doc title");
  });

  it("prefers what the editor typed under the search fields", () => {
    const seo = documentSeo({ meta: { title: "Custom", description: "Custom text" } }, fallback);
    expect(seo.title).toBe("Custom");
    expect(seo.description).toBe("Custom text");
  });

  it("only uses a share picture whose media is approved", () => {
    const approved = { id: 1, url: "/api/media/file/a.png", approved: true, width: 1200, height: 630, alt: "A" };
    expect(documentSeo({ meta: { image: approved } }, fallback).image).toMatchObject({ url: approved.url });
    expect(documentSeo({ meta: { image: { ...approved, approved: false } } }, fallback).image).toBeNull();
    expect(documentSeo({ meta: { image: 7 } }, fallback).image).toBeNull();
    expect(shareImageOf(undefined)).toBeNull();
  });

  it("does not double the site name when an editor saved a title with the old suffix", () => {
    const seo = documentSeo({ meta: { title: "Cybersecurity — Edge Comm-Tech" } }, fallback);
    expect(brandCount(buildMetadata({ ...seo, path: "/x" }).openGraph?.title as string)).toBe(1);
  });
});

describe("the canonical link", () => {
  it.each(["?utm_source=newsletter", "?page=2", "?lang=am", "?utm_source=x&page=2&lang=am#top"])(
    "drops %s",
    (query) => {
      const meta = buildMetadata({ title: "Services", description: "What we do.", path: `/services${query}` });
      expect(meta.alternates?.canonical).toBe("https://www.example.com/services");
      expect(meta.openGraph?.url).toBe("https://www.example.com/services");
    },
  );
});
