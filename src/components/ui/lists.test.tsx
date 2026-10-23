import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CapCard, CheckList, NumberedSteps } from "./lists";

const html = (el: React.ReactElement) => renderToStaticMarkup(el);

describe("CheckList", () => {
  it("renders one item per entry", () => {
    const out = html(<CheckList items={["Redundant power", "Environmental control"]} />);
    expect(out).toContain("Redundant power");
    expect(out).toContain("Environmental control");
    expect(out.match(/<li/g)).toHaveLength(2);
  });

  it("renders nothing at all when empty, not an empty list", () => {
    // Review Focus #3 in miniature: an empty <ul> is a gap in the layout with
    // no explanation. A section with nothing to say should not open.
    expect(html(<CheckList items={[]} />)).toBe("");
  });

  it("colours the tick with the family accent", () => {
    expect(html(<CheckList items={["x"]} accent="#c48a5a" />)).toContain("#c48a5a");
  });
});

describe("NumberedSteps", () => {
  it("numbers each step from 01", () => {
    const out = html(
      <NumberedSteps
        steps={[
          { title: "Discover", body: "Understand priorities." },
          { title: "Design", body: "Develop architectures." },
        ]}
      />,
    );
    expect(out).toContain("01");
    expect(out).toContain("02");
    expect(out).toContain("Discover");
    expect(out).toContain("Develop architectures.");
  });

  it("renders nothing when there are no steps", () => {
    expect(html(<NumberedSteps steps={[]} />)).toBe("");
  });
});

describe("CapCard", () => {
  it("renders the title as a heading with the body beneath", () => {
    const out = html(<CapCard title="Secure by design" body="Identity-centered controls." />);
    expect(out).toMatch(/<h3[^>]*>Secure by design<\/h3>/);
    expect(out).toContain("Identity-centered controls.");
  });
});
