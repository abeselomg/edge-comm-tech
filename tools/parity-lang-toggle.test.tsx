import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { LanguageToggle } from "../src/components/i18n/LanguageToggle";
import { Tr } from "../src/components/i18n/Tr";
import { applyPageWaivers, copySentences } from "./parity-copy.mjs";

/*
 * The language-toggle waiver: the header's "EN" / "አማ" switch has no Highland
 * counterpart, so it is cut from the port side on every page, by its
 * data-parity="lang-toggle" root. Proved on fixtures, like the partners waiver.
 * Translated text lives in data-am attributes, so the English page text is
 * unchanged and needs no waiver at all.
 */

const toggle = renderToStaticMarkup(<LanguageToggle />);

const page = (header: string, tail = "") =>
  `<html><body><header><a href="/">Home</a>${header}</header><main><h1>Accelerating Africa's digital transformation</h1>` +
  `<p>Edge Comm-Tech designs, delivers, and supports secure technology solutions for institutions.</p>${tail}</main></body></html>`;

const highland = page("");
const port = page(toggle);

const same = (p: string, h = highland, name = "index") =>
  JSON.stringify(copySentences(applyPageWaivers(p, name, "port"), name)) ===
  JSON.stringify(copySentences(applyPageWaivers(h, name, "highland"), name));

describe("the language-toggle parity waiver", () => {
  it("has a toggle to waive (so the tests below are not vacuous)", () => {
    expect(toggle).toContain("EN");
    expect(toggle).toContain("አማ");
    // Without the waiver the toggle's text would be reader-visible copy on the port.
    expect(copySentences(port, "about").join(" ") + port).toContain("EN");
  });

  it("removes the toggle from the port side, on any page, and nothing else", () => {
    for (const name of ["about", "partners", "contact"]) {
      const out = applyPageWaivers(port, name, "port");
      expect(out).not.toContain("lang-toggle");
      expect(out).not.toContain("አማ");
      expect(out).toContain("Accelerating Africa's digital transformation");
      expect(out).toContain('<a href="/">Home</a>');
    }
  });

  it("makes a port that differs only by the toggle match Highland", () => {
    expect(same(port, highland, "about")).toBe(true);
  });

  it("is applied to the port side only", () => {
    expect(applyPageWaivers(port, "about", "highland")).toBe(port);
  });

  it("still fails when other copy differs next to the toggle", () => {
    const edited = port.replace("secure technology solutions", "secure and cheap technology solutions");
    expect(same(edited, highland, "about")).toBe(false);
    const extra = page(toggle, "<p>Everything here is now also available in Amharic for you.</p>");
    expect(same(extra, highland, "about")).toBe(false);
  });

  it("does not mask a second toggle, or text beside the toggle", () => {
    expect(same(page(toggle + toggle), highland, "about")).toBe(false);
    const sibling = page(`${toggle}<p>Language: this page is also offered in another language.</p>`);
    expect(same(sibling, highland, "about")).toBe(false);
  });

  it("does not hide translated copy: Tr text stays visible English, Amharic stays in an attribute", () => {
    const withTr = page(toggle, `<p>${renderToStaticMarkup(<Tr>View our projects</Tr>)} and more things to read.</p>`);
    const plain = page("", "<p>View our projects and more things to read.</p>");
    expect(same(withTr, plain, "about")).toBe(true);
    // A mistranslation in the English text is still caught.
    expect(same(withTr.replace(">View our projects<", ">See our projects<"), plain, "about")).toBe(false);
  });
});
