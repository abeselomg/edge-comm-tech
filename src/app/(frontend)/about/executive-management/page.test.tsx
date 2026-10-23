import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { executiveCard, initials, rosterHolder } from "./exec-parts";

const html = (el: React.ReactElement) => renderToStaticMarkup(el);

describe("executiveCard", () => {
  /*
   * Review Focus #1, at its most direct. The content master publishes five
   * role titles and no names, biographies or portraits, so every card on this
   * page shows a marker today. That is the page working, not a gap to fill
   * with something plausible — a page is worse for inventing a leadership
   * team than for saying it is waiting on one.
   */
  it("names the role and marks the holder as pending", () => {
    const out = html(
      executiveCard(
        {
          title: "Chief Technology Officer",
          holder: { value: null, status: "pending", pendingLabel: "Name and biography pending" },
        },
        1,
      ),
    );
    expect(out).toContain("Chief Technology Officer");
    expect(out).toContain("Name and biography pending");
    expect(out).not.toContain("undefined");
    expect(out).not.toContain("null");
  });

  it("numbers the roles from 01", () => {
    const role = { title: "Chief Executive Officer", holder: { status: "pending" as const } };
    expect(html(executiveCard(role, 0))).toContain("Role 01");
    expect(html(executiveCard(role, 9))).toContain("Role 10");
  });

  it("shows the name once Edge confirms one", () => {
    const out = html(
      executiveCard(
        { title: "Chief Executive Officer", holder: { value: "A. Name", status: "confirmed" } },
        0,
      ),
    );
    expect(out).toContain("A. Name");
    expect(out).not.toContain("pending");
  });
});

describe("initials", () => {
  it("takes the capitalised words, up to three", () => {
    expect(initials("Chief Technology Officer")).toBe("CTO");
    expect(initials("Chief Executive Officer")).toBe("CEO");
  });

  it("ignores lowercase joining words", () => {
    // "Head of Delivery" is HD, not HoD: the monogram frame is a visual
    // placeholder, and Highland's rule was capitalised words only.
    expect(initials("Head of Delivery")).toBe("HD");
  });

  it("stops at three so the frame cannot overflow", () => {
    expect(initials("Chief Information Security Officer Deputy")).toHaveLength(3);
  });
});

describe("rosterHolder", () => {
  // /about summarises the roster; confirming a name must reach it as well.
  it("keeps Highland's wording while the holder is unconfirmed", () => {
    expect(rosterHolder({ status: "pending", value: null })).toBe("Name to be confirmed");
    expect(rosterHolder(undefined)).toBe("Name to be confirmed");
  });
  it("shows the name once Edge confirms one", () => {
    expect(rosterHolder({ status: "confirmed", value: "A. Name" })).toBe("A. Name");
  });
  it("does not treat a confirmed-but-empty holder as confirmed", () => {
    expect(rosterHolder({ status: "confirmed", value: "" })).toBe("Name to be confirmed");
  });
});
