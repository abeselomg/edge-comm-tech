import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { AM } from "@/lib/i18n/am";
import { Tr } from "./Tr";

describe("Tr", () => {
  it("renders the English as the text and carries the Amharic in data-am", () => {
    const html = renderToStaticMarkup(<Tr>Explore our solutions</Tr>);
    expect(html).toBe(`<span data-am="${AM["Explore our solutions"]}">Explore our solutions</span>`);
    expect(html.replace(/<[^>]+>/g, "")).toBe("Explore our solutions");
  });

  it("translates a string that came from the CMS, by exact match", () => {
    const title: string | undefined = "Accelerating Africa's digital transformation";
    expect(renderToStaticMarkup(<Tr>{title}</Tr>)).toContain("data-am=");
  });

  it("is inert, with no wrapper, when the dictionary has no entry", () => {
    expect(renderToStaticMarkup(<Tr>Something nobody translated</Tr>)).toBe("Something nobody translated");
    // A near miss is a miss: the key is the exact string.
    expect(renderToStaticMarkup(<Tr>{"Explore our solutions "}</Tr>)).not.toContain("data-am");
    expect(renderToStaticMarkup(<Tr>explore our solutions</Tr>)).not.toContain("data-am");
  });

  it("is inert for missing and non-string children, and for names that exist on Object.prototype", () => {
    expect(renderToStaticMarkup(<Tr>{undefined}</Tr>)).toBe("");
    expect(renderToStaticMarkup(<Tr>{null}</Tr>)).toBe("");
    expect(renderToStaticMarkup(<Tr><b>Solutions</b></Tr>)).toBe("<b>Solutions</b>");
    expect(renderToStaticMarkup(<Tr>constructor</Tr>)).toBe("constructor");
    expect(renderToStaticMarkup(<Tr>toString</Tr>)).toBe("toString");
  });
});
