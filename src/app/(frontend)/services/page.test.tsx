import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { OtherServices, RelatedServices, ServiceBody, ServiceChapter } from "./service-parts";

const html = (el: React.ReactElement | null) => renderToStaticMarkup(<div>{el}</div>);
const live = (over: Record<string, unknown> = {}) => ({ _status: "published", ...over });
const service = (over: Record<string, unknown> = {}) =>
  live({
    slug: "s1",
    title: "Service One",
    short: "One",
    accent: "#111111",
    order: 1,
    headline: "Head",
    intro: "Intro",
    capabilities: [{ title: "Cap A", body: "Body A" }],
    checklist: [{ item: "Deliverable X" }],
    checklistTitle: "What you receive",
    models: [{ title: "Model M", body: "Body M" }],
    modelsTitle: "How we engage",
    fit: "Best for X.",
    note: "A qualification.",
    related: [],
    ...over,
  }) as never;

describe("ServiceBody", () => {
  it("renders every section a full record carries, numbered from 01", () => {
    const out = html(<ServiceBody service={service()} />);
    for (const text of ["Cap A", "Body A", "01", "Deliverable X", "What you receive", "Model M", "How we engage", "Best for X.", "A qualification."]) {
      expect(out, text).toContain(text);
    }
  });

  it("omits the sections a record does not carry, with no empty headings", () => {
    const out = html(
      <ServiceBody service={service({ checklist: [], models: null, fit: null, note: "" })} />,
    );
    expect(out).toContain("Cap A");
    for (const gone of ["Deliverables", "Engagement models", "Best suited for"]) {
      expect(out, gone).not.toContain(gone);
    }
  });

  it("does not print a null or undefined where a field is empty", () => {
    const out = html(<ServiceBody service={service({ checklistTitle: null, modelsTitle: null })} />);
    expect(out).not.toContain("undefined");
    expect(out).not.toContain("null");
  });
});

// Review Focus #1: the depth populate keeps an unpublished related document.
describe("RelatedServices", () => {
  it("links only the published related services, through the route map", () => {
    const out = html(
      <RelatedServices
        accent="#111111"
        related={[live({ slug: "ok", short: "Okay", accent: "#222222" }), { slug: "gone", short: "Gone", accent: "#333333", _status: "draft" }, 4] as never}
      />,
    );
    expect(out).toContain('href="/services/ok"');
    expect(out).not.toContain("gone");
    expect(out).not.toContain("Gone");
  });

  it("renders nothing when nothing is left to link", () => {
    expect(html(<RelatedServices accent="#111111" related={[{ slug: "x", _status: "draft" }] as never} />)).not.toContain("Related services");
  });
});

describe("OtherServices", () => {
  it("lists the other published services, never the page itself", () => {
    const out = html(
      <OtherServices
        currentSlug="self"
        services={[service({ slug: "self", short: "SelfName" }), service({ slug: "peer", short: "PeerName" }), service({ slug: "d", short: "DraftName", _status: "draft" })]}
      />,
    );
    expect(out).toContain("PeerName");
    expect(out).not.toContain("SelfName");
    expect(out).not.toContain("DraftName");
  });
});

describe("ServiceChapter", () => {
  it("says what the service includes and points at its own page", () => {
    const out = html(<ServiceChapter service={service()} index={0} />);
    expect(out).toContain("Cap A");
    expect(out).toContain('href="/services/s1"');
    expect(out).toContain("Best for X.");
  });

  it("drops the fit sentence when there is none, and alternates sides", () => {
    expect(html(<ServiceChapter service={service({ fit: null })} index={0} />)).not.toContain("Best for");
    expect(html(<ServiceChapter service={service()} index={1} />)).toContain("lg:order-2");
    expect(html(<ServiceChapter service={service()} index={0} />)).not.toContain("lg:order-2");
  });
});
