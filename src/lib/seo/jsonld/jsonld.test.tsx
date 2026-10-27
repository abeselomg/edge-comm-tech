import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { applyPageWaivers, copySentences } from "../../../../tools/parity-copy.mjs";
import { JsonLd, serializeJsonLd } from "@/components/seo/json-ld";
import type { Event, Job, News, Post } from "@/payload-types";
import { clean } from "./clean";
import {
  blogPosting,
  employmentType,
  event,
  isoDate,
  jobPosting,
  newsArticle,
  professionalService,
  projectWork,
  solutionService,
} from "./content";
import { foundingDate, organization, postalAddress, website } from "./organization";
import { breadcrumbs, graph, itemList } from "./page";
import { absoluteUrl, orgId } from "./url";

const ORIGIN = "https://example.test";
let saved: string | undefined;
beforeEach(() => {
  saved = process.env.SITE_URL;
  process.env.SITE_URL = `${ORIGIN}/`;
});
afterEach(() => {
  if (saved === undefined) delete process.env.SITE_URL;
  else process.env.SITE_URL = saved;
});

const roundTrip = (v: unknown) => JSON.parse(JSON.stringify(v));

describe("absoluteUrl", () => {
  it("strips the trailing slash and joins paths", () => {
    expect(absoluteUrl("/solutions/x")).toBe(`${ORIGIN}/solutions/x`);
    expect(absoluteUrl("solutions/x")).toBe(`${ORIGIN}/solutions/x`);
    expect(absoluteUrl("/")).toBe(`${ORIGIN}/`);
    expect(absoluteUrl("")).toBe(ORIGIN);
    expect(orgId()).toBe(`${ORIGIN}/#organization`);
  });
  it("leaves an absolute URL alone and falls back to localhost", () => {
    expect(absoluteUrl("https://other.test/a")).toBe("https://other.test/a");
    delete process.env.SITE_URL;
    expect(absoluteUrl("/a")).toBe("http://localhost:3000/a");
  });
});

describe("clean", () => {
  it("strips null, undefined, blanks, empty arrays and objects, recursively", () => {
    expect(
      clean({ a: "", b: "  ", c: null, d: undefined, e: [], f: {}, g: { h: "" }, i: [{ j: undefined }], k: "x", l: 0, m: false }),
    ).toEqual({ k: "x", l: 0, m: false });
  });
  it("returns undefined when nothing is left", () => {
    expect(clean({ a: "" })).toBeUndefined();
    expect(clean(null)).toBeUndefined();
  });
});

describe("JsonLd", () => {
  it("escapes < so a closing script tag cannot end the element", () => {
    const html = renderToStaticMarkup(<JsonLd data={{ name: "</script><script>alert(1)</script>" }} />);
    expect(html).toContain('<script type="application/ld+json">');
    expect(html.match(/<\/script>/g)).toHaveLength(1);
    expect(html).toContain("\\u003c/script>");
    expect(JSON.parse(serializeJsonLd({ name: "</script>" })!).name).toBe("</script>");
  });
  it("renders nothing for empty data", () => {
    expect(renderToStaticMarkup(<JsonLd data={undefined} />)).toBe("");
    expect(renderToStaticMarkup(<JsonLd data={{ a: "", b: [] }} />)).toBe("");
  });
});

const company = {
  legalName: "Edge Communication Technologies PLC",
  shortName: "Edge Comm-Tech",
  established: "March 2018",
  positioning: "Ethiopia's trusted end-to-end technology solutions and systems-integration partner.",
};
const contact = {
  office: [
    { line: "Edge Communication Technologies PLC" },
    { line: "BMA Plaza, 9th Floor" },
    { line: "Gerji Imperial, Bole Sub-City" },
    { line: "Addis Ababa, Ethiopia" },
  ],
  phones: [{ label: "Main telephone", value: "+251 95 569 5565", tel: "+251955695565" }],
  emails: [{ label: "Sales", value: "sales@edgecomm-tech.com" }],
};

describe("organization and website", () => {
  it("builds the organisation from the real fields", () => {
    const o = organization({ company, contact, social: [] }) as Record<string, any>;
    expect(o["@type"]).toBe("Organization");
    expect(o["@id"]).toBe(`${ORIGIN}/#organization`);
    expect(o.name).toBe("Edge Comm-Tech");
    expect(o.legalName).toBe(company.legalName);
    expect(o.logo.url).toBe(`${ORIGIN}/edge-logo.png`);
    expect(o.foundingDate).toBe("2018-03");
    expect(o.address).toEqual({
      "@type": "PostalAddress",
      streetAddress: "BMA Plaza, 9th Floor, Gerji Imperial, Bole Sub-City",
      addressLocality: "Addis Ababa",
      addressCountry: "ET",
    });
    expect(o.telephone).toBe("+251955695565");
    expect(o.contactPoint).toHaveLength(2);
    expect(o).not.toHaveProperty("sameAs");
  });
  it("keeps only real http(s) social URLs", () => {
    const o = organization({
      company,
      contact,
      social: [{ platform: "LinkedIn", url: "https://linkedin.com/company/x" }, { platform: "x", url: "" }, { platform: "y", url: "handle" }],
    }) as Record<string, any>;
    expect(o.sameAs).toEqual(["https://linkedin.com/company/x"]);
  });
  it("omits what the data lacks", () => {
    const o = organization({ company: { ...company, established: "Founded long ago" }, contact: null });
    expect(o).not.toHaveProperty("foundingDate");
    expect(o).not.toHaveProperty("address");
    expect(o).not.toHaveProperty("contactPoint");
  });
  it("parses founding dates and addresses defensively", () => {
    expect(foundingDate("2018")).toBe("2018");
    expect(foundingDate(undefined)).toBeUndefined();
    expect(postalAddress([{ line: "Name" }])).toBeUndefined();
  });
  it("the website has no SearchAction", () => {
    const w = website(company);
    expect(w["@type"]).toBe("WebSite");
    expect(JSON.stringify(w)).not.toContain("SearchAction");
  });
});

describe("breadcrumbs, itemList and graph", () => {
  it("prepends Home and leaves the current page without a URL", () => {
    const b = breadcrumbs([{ label: "Solutions", href: "/solutions" }, { label: "Cybersecurity" }]) as Record<string, any>;
    expect(b.itemListElement.map((i: any) => [i.position, i.name, i.item])).toEqual([
      [1, "Home", `${ORIGIN}/`],
      [2, "Solutions", `${ORIGIN}/solutions`],
      [3, "Cybersecurity", undefined],
    ]);
  });
  it("lists items with absolute URLs, and by name when there is no page", () => {
    const l = itemList("Clients", [{ name: "A", href: "/a" }, { name: "B" }]) as Record<string, any>;
    expect(l.numberOfItems).toBe(2);
    expect(l.itemListElement[0].url).toBe(`${ORIGIN}/a`);
    expect(l.itemListElement[1]).not.toHaveProperty("url");
  });
  it("wraps nodes in one @graph and drops empties", () => {
    expect(graph(undefined, {})).toBeUndefined();
    const g = graph({ "@type": "Thing", name: "x" }, undefined) as Record<string, any>;
    expect(g["@context"]).toBe("https://schema.org");
    expect(g["@graph"]).toHaveLength(1);
  });
});

describe("services", () => {
  it("points the provider at the organisation and serves Ethiopia", () => {
    const s = solutionService({ title: "Cybersecurity", blurb: "Protect it.", slug: "cybersecurity", _status: "published" }) as Record<string, any>;
    expect(s["@type"]).toBe("Service");
    expect(s.provider).toEqual({ "@id": orgId() });
    expect(s.areaServed.name).toBe("Ethiopia");
    expect(s.url).toBe(`${ORIGIN}/solutions/cybersecurity`);
    expect((professionalService({ title: "T", blurb: "b", slug: "t", _status: "published" }) as any).url).toBe(`${ORIGIN}/services/t`);
  });
  it("describes nothing that is not published", () => {
    expect(solutionService({ title: "T", blurb: "b", slug: "t", _status: "draft" })).toBeUndefined();
    expect(solutionService({ title: "T", blurb: "b", slug: "t" })).toBeUndefined();
    expect(newsArticle(news({ _status: "draft" }))).toBeUndefined();
    expect(event(ev({ _status: "draft" }))).toBeUndefined();
    expect(jobPosting(job({ _status: "draft" }), true)).toBeUndefined();
    expect(blogPosting({ title: "P", slug: "p", body: {}, updatedAt: "", _status: "draft" } as unknown as Post)).toBeUndefined();
    expect(projectWork({ title: "P", slug: "p", _status: "draft" } as any)).toBeUndefined();
  });
});

const news = (over: Partial<News> = {}) =>
  ({
    title: "Edge established",
    slug: "edge-established",
    standfirst: "Edge began in 2018.",
    date: { status: "confirmed", value: "2018" },
    updatedAt: "2026-01-02T03:04:05.000Z",
    heldForPublication: false,
    _status: "published",
    ...over,
  }) as News;

describe("news and blog", () => {
  it("builds a NewsArticle with ISO dates", () => {
    const a = newsArticle(news()) as Record<string, any>;
    expect(a["@type"]).toBe("NewsArticle");
    expect(a.headline).toBe("Edge established");
    expect(a.datePublished).toBe("2018");
    expect(a.dateModified).toBe("2026-01-02T03:04:05.000Z");
    expect(a.author).toEqual({ "@id": orgId() });
    expect(a.mainEntityOfPage["@id"]).toBe(`${ORIGIN}/news/edge-established`);
  });
  it("drops a pending or free-text date and skips held articles", () => {
    expect(newsArticle(news({ date: { status: "pending", value: "" } }))).not.toHaveProperty("datePublished");
    expect(newsArticle(news({ date: { status: "confirmed", value: "Evergreen" } }))).not.toHaveProperty("datePublished");
    expect(newsArticle(news({ heldForPublication: true }))).toBeUndefined();
  });
  it("builds a BlogPosting anchored on /blog", () => {
    const body = { root: { type: "root", children: [{ type: "paragraph", children: [{ type: "text", text: "First para." }] }] } };
    const p = blogPosting({ title: "Post", slug: "post", body, updatedAt: "2026-02-03T00:00:00.000Z", _status: "published" } as unknown as Post) as Record<string, any>;
    expect(p["@type"]).toBe("BlogPosting");
    expect(p.url).toBe(`${ORIGIN}/blog#post-post`);
    expect(p.description).toBe("First para.");
  });
  it("isoDate accepts years and timestamps only", () => {
    expect(isoDate("2018-03")).toBe("2018-03");
    expect(isoDate("March 2018")).toBeUndefined();
    expect(isoDate("")).toBeUndefined();
  });
});

const ev = (over: Partial<Event> = {}) =>
  ({
    title: "GITEX",
    slug: "gitex",
    intro: "Exhibition.",
    startsOn: "2026-12-07T00:00:00.000Z",
    endsOn: "2026-12-11T00:00:00.000Z",
    format: "In person",
    venue: "Dubai World Trade Centre",
    _status: "published",
    ...over,
  }) as Event;

describe("event", () => {
  it("handles an in-person range", () => {
    const e = event(ev()) as Record<string, any>;
    expect(e.startDate).toBe("2026-12-07");
    expect(e.endDate).toBe("2026-12-11");
    expect(e.eventAttendanceMode).toBe("https://schema.org/OfflineEventAttendanceMode");
    expect(e.location["@type"]).toBe("Place");
    expect(e.organizer).toEqual({ "@id": orgId() });
  });
  it("omits endDate when missing or not after the start", () => {
    expect(event(ev({ endsOn: null }))).not.toHaveProperty("endDate");
    expect(event(ev({ endsOn: "2026-12-07T00:00:00.000Z" }))).not.toHaveProperty("endDate");
  });
  it("uses a VirtualLocation for online and both for hybrid", () => {
    const online = event(ev({ format: "Online", venue: "Platform to be confirmed" })) as Record<string, any>;
    expect(online.eventAttendanceMode).toBe("https://schema.org/OnlineEventAttendanceMode");
    expect(online.location).toEqual({ "@type": "VirtualLocation", url: `${ORIGIN}/events/gitex` });
    const hybrid = event(ev({ format: "Hybrid" })) as Record<string, any>;
    expect(hybrid.eventAttendanceMode).toBe("https://schema.org/MixedEventAttendanceMode");
    expect(hybrid.location.map((l: any) => l["@type"])).toEqual(["Place", "VirtualLocation"]);
  });
  it("omits an unconfirmed venue rather than printing it", () => {
    expect(event(ev({ venue: "Venue to be confirmed" }))).not.toHaveProperty("location");
  });
  it("needs a start date", () => {
    expect(event(ev({ startsOn: "" }))).toBeUndefined();
  });
});

const job = (over: Partial<Job> = {}) =>
  ({
    title: "Network Engineer",
    slug: "network-engineer",
    type: "Full-time",
    location: "Addis Ababa, Ethiopia",
    purpose: "Run networks <fast>.",
    responsibilities: [{ item: "Design" }],
    required: [{ item: "Degree" }],
    deadline: { status: "pending", value: "" },
    createdAt: "2026-09-01T10:00:00.000Z",
    _status: "published",
    ...over,
  }) as Job;

describe("jobPosting", () => {
  it("maps employment types", () => {
    expect(employmentType("Full-time")).toBe("FULL_TIME");
    expect(employmentType("Part time")).toBe("PART_TIME");
    expect(employmentType("Contract")).toBe("CONTRACTOR");
    expect(employmentType("Internship")).toBe("INTERN");
    expect(employmentType("Whenever")).toBeUndefined();
  });
  it("builds a posting and omits validThrough without a confirmed ISO deadline", () => {
    const j = jobPosting(job(), true, "Edge Comm-Tech") as Record<string, any>;
    expect(j["@type"]).toBe("JobPosting");
    expect(j.employmentType).toBe("FULL_TIME");
    expect(j.datePosted).toBe("2026-09-01");
    expect(j).not.toHaveProperty("validThrough");
    expect(j.directApply).toBe(true);
    expect(j.hiringOrganization.name).toBe("Edge Comm-Tech");
    expect(j.jobLocation.address.addressLocality).toBe("Addis Ababa");
    expect(j.description).toContain("&lt;fast&gt;");
    expect(j.description).toContain("<li>Design</li>");
  });
  it("emits validThrough for a confirmed ISO date, not for free text", () => {
    expect(jobPosting(job({ deadline: { status: "confirmed", value: "2026-11-30" } }), true)).toMatchObject({ validThrough: "2026-11-30" });
    expect(jobPosting(job({ deadline: { status: "confirmed", value: "end of month" } }), true)).not.toHaveProperty("validThrough");
  });
  it("emits nothing for a closed job", () => {
    expect(jobPosting(job(), false)).toBeUndefined();
  });
});

describe("projectWork", () => {
  it("describes the project and names the client only when given", () => {
    const base = { title: "P", slug: "p", summary: "S.", location: "Bahir Dar", year: { status: "confirmed", value: "2024" }, updatedAt: "2026-01-01T00:00:00.000Z", _status: "published" } as const;
    const p = projectWork(base as any, "Bahir Dar University") as Record<string, any>;
    expect(p["@type"]).toBe("CreativeWork");
    expect(p.dateCreated).toBe("2024");
    expect(p.about.name).toBe("Bahir Dar University");
    const q = projectWork({ ...base, year: { status: "pending", value: "" } } as any) as Record<string, any>;
    expect(q).not.toHaveProperty("dateCreated");
    expect(q).not.toHaveProperty("about");
  });
});

describe("every output round-trips through JSON.parse", () => {
  it("survives serialisation unchanged", () => {
    const nodes = [
      organization({ company, contact }),
      website(company),
      breadcrumbs([{ label: "A", href: "/a" }, { label: "B" }]),
      itemList("L", [{ name: "x", href: "/x" }]),
      solutionService({ title: "t", blurb: "b", slug: "s", _status: "published" }),
      newsArticle(news()),
      event(ev()),
      jobPosting(job(), true),
    ];
    const g = graph(...nodes)!;
    expect(roundTrip(g)).toEqual(g);
    expect(JSON.parse(serializeJsonLd(g)!)).toEqual(g);
  });
});

describe("parity tool ignores the JSON-LD script", () => {
  const page = (script: string) =>
    `<html><head><title>x</title></head><body><main><nav>Solutions / Cybersecurity${script}</nav>` +
    `<p>We protect institutions across Ethiopia with practical security.</p></main></body></html>`;
  const ld = `<script type="application/ld+json">${serializeJsonLd(graph(organization({ company, contact })))}</script>`;

  it("copySentences is identical with and without the script", () => {
    expect(ld).toContain("Ethiopia");
    expect(copySentences(page(ld), "solutions")).toEqual(copySentences(page(""), "solutions"));
  });
  it("applyPageWaivers leaves the script for the text step, which strips it", () => {
    const waived = applyPageWaivers(page(ld), "solutions", "port");
    expect(copySentences(waived, "solutions")).toEqual(copySentences(page(""), "solutions"));
  });
});
