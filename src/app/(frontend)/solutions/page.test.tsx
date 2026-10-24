import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { POSTS } from "../../../../design-src/highland/editorial.mjs";
import { SOLUTION_DETAIL } from "../../../../design-src/highland/detail.mjs";
import {
  ANCHOR_BAND,
  ANCHOR_CAPABILITY,
  anchorTargets,
  DetailBlocks,
  DeliveredWork,
  OtherFamilies,
  PartnerSidebar,
  projectsFor,
  RelatedSolutions,
} from "./solution-parts";

const html = (el: React.ReactElement | null) => renderToStaticMarkup(<div>{el}</div>);
const NONE = { byTitle: {}, byBand: {} };
const cap = (title: string) => ({ title, body: `${title} body` });
const published = (over: Record<string, unknown> = {}) => ({ _status: "published", ...over });

describe("DetailBlocks — Review Focus #4", () => {
  const blocks = [
    { blockType: "checklist", title: "Weigh it", items: [{ item: "One" }] },
    { blockType: "capabilities", items: [cap("Alpha")] },
  ] as never;

  it("renders sections in the stored order, not a fixed one", () => {
    const out = html(<DetailBlocks blocks={blocks} accent="#111111" anchors={NONE} />);
    expect(out.indexOf("What we weigh")).toBeGreaterThan(-1);
    expect(out.indexOf("What we weigh")).toBeLessThan(out.indexOf("Core capabilities"));
    const reversed = html(
      <DetailBlocks blocks={[...(blocks as unknown[])].reverse() as never} accent="#111111" anchors={NONE} />,
    );
    expect(reversed.indexOf("Core capabilities")).toBeLessThan(reversed.indexOf("What we weigh"));
  });

  it("renders nothing, and does not throw, for any list an editor can leave behind", () => {
    for (const bad of [[], undefined, null, [{ blockType: "invented", items: [cap("x")] }]]) {
      expect(() => html(<DetailBlocks blocks={bad as never} accent="#111111" anchors={NONE} />)).not.toThrow();
      expect(html(<DetailBlocks blocks={bad as never} accent="#111111" anchors={NONE} />)).not.toContain("x body");
    }
  });

  it("omits a block with no items rather than printing an empty heading", () => {
    const out = html(
      <DetailBlocks
        blocks={[{ blockType: "capabilities", items: [] }, { blockType: "layers", title: "T", items: [] }] as never}
        accent="#111111"
        anchors={NONE}
      />,
    );
    expect(out).not.toContain("Core capabilities");
    expect(out).not.toContain("Solution architecture");
  });

  it("numbers architecture layers from the top down, as Highland did", () => {
    const out = html(
      <DetailBlocks
        blocks={[{ blockType: "layers", title: "Stack", items: [cap("Apps"), cap("Data")] }] as never}
        accent="#111111"
        anchors={NONE}
      />,
    );
    expect(out.indexOf("L2")).toBeLessThan(out.indexOf("L1"));
  });

  it("puts a destination id on the capability a blog post points at", () => {
    const out = html(
      <DetailBlocks
        blocks={blocks}
        accent="#111111"
        anchors={{ byTitle: { Alpha: "alpha-anchor" }, byBand: {} }}
      />,
    );
    expect(out).toContain('id="alpha-anchor"');
  });

  it("puts a destination id on a band", () => {
    const out = html(
      <DetailBlocks
        blocks={[{ blockType: "bands", items: [{ label: "L", title: "Band zero", entries: [cap("E")] }] }] as never}
        accent="#111111"
        anchors={{ byTitle: {}, byBand: { 0: "band-anchor" } }}
      />,
    );
    expect(out).toContain('id="band-anchor"');
  });
});

/*
 * The content master requires every blog Read More destination to exist. The
 * anchor tables are page data attached to the destination, so they are checked
 * against the real posts and the real solution content, not against themselves.
 */
describe("blog anchors have destinations", () => {
  const anchored = (POSTS as { slug: string; to: string; anchor?: string }[]).filter((p) => p.anchor);

  it("has at least one anchored post (the check is not vacuous)", () => {
    expect(anchored.length).toBeGreaterThan(5);
  });

  for (const post of anchored) {
    it(`${post.anchor} lands on ${post.to}`, () => {
      const detail = (SOLUTION_DETAIL as Record<string, { capabilities?: { title: string }[]; bands?: unknown[] }>)[post.to];
      const capabilityTitle = ANCHOR_CAPABILITY[post.anchor as string];
      const bandIndex = ANCHOR_BAND[post.anchor as string];
      if (capabilityTitle) {
        expect(detail.capabilities?.map((c) => c.title)).toContain(capabilityTitle);
      } else {
        expect(bandIndex, `no capability or band for ${post.anchor}`).toBeDefined();
        expect(detail.bands?.length ?? 0).toBeGreaterThan(bandIndex);
      }
    });
  }

  it("anchorTargets collects only the anchors of posts aimed at this solution", () => {
    const posts = [
      { anchor: "private-rag", target: published({ slug: "software-ai-digital" }) },
      { anchor: "agentic-ai", target: published({ slug: "software-ai-digital" }) },
      { anchor: "zero-trust-ztna-nac", target: published({ slug: "cybersecurity" }) },
      { anchor: null, target: published({ slug: "software-ai-digital" }) },
    ] as never;
    const t = anchorTargets(posts, "software-ai-digital");
    expect(t.byTitle[ANCHOR_CAPABILITY["private-rag"]]).toBe("private-rag");
    expect(Object.values(t.byTitle)).not.toContain("zero-trust-ztna-nac");
  });
});

describe("published-only relations (Review Focus #1)", () => {
  it("projectsFor lists only published projects that use the solution", () => {
    const projects = [
      published({ slug: "a", solutions: [published({ slug: "cyber" })] }),
      { slug: "b", _status: "draft", solutions: [published({ slug: "cyber" })] },
      published({ slug: "c", solutions: [published({ slug: "other" })] }),
      published({ slug: "d", solutions: [7] }),
    ] as never;
    expect(projectsFor(projects, "cyber").map((p) => p.slug)).toEqual(["a"]);
  });

  it("the partner sidebar leaves out an unpublished partner", () => {
    const out = html(
      <PartnerSidebar
        accent="#111111"
        partners={[published({ name: "Shown", logo: null }), { name: "Hidden", _status: "draft", logo: null }] as never}
      />,
    );
    expect(out).toContain("Shown");
    expect(out).not.toContain("Hidden");
  });

  it("related solutions link only the published ones", () => {
    const out = html(
      <RelatedSolutions
        accent="#111111"
        related={[published({ slug: "ok", short: "Okay" }), { slug: "gone", short: "Gone", _status: "draft" }, 9] as never}
      />,
    );
    expect(out).toContain('href="/solutions/ok"');
    expect(out).not.toContain("gone");
  });

  it("the other families never include the page itself or an unpublished one", () => {
    const out = html(
      <OtherFamilies
        currentSlug="self"
        solutions={[
          published({ slug: "self", short: "SelfName", accent: "#111111" }),
          published({ slug: "peer", short: "PeerName", accent: "#222222" }),
          { slug: "draft", short: "DraftName", accent: "#333333", _status: "draft" },
        ] as never}
      />,
    );
    expect(out).toContain("PeerName");
    expect(out).not.toContain("SelfName");
    expect(out).not.toContain("DraftName");
  });

  it("delivered work shows nothing when no project qualifies", () => {
    expect(html(<DeliveredWork projects={[]} accent="#111111" />)).not.toContain("Delivered work");
  });
});
