import { describe, expect, it } from "vitest";
import { applyPageWaivers, copySentences } from "./parity-copy.mjs";

/*
 * The project-picture waiver: the Highland originals have no project pictures
 * and an <img>'s alt text reads as page copy, so each <img> marked
 * data-parity="project-image" is cut from the port side. Only those tags are:
 * any other image, any changed copy and the Highland side are untouched.
 */

const body = "<h1>Smart classrooms</h1><p>Edge Comm-Tech transformed teaching across the university campuses.</p>";
const marked = `<img src="/a.jpg" alt="Illustration: Smart classrooms sample image" data-parity="project-image" loading="lazy">`;
const plain = `<img src="/b.jpg" alt="Some other picture with its own words">`;
const page = (extra: string) => `<html><body><main>${extra}${body}</main></body></html>`;

const text = (html: string, side: "port" | "highland" = "port", name = "project-x") =>
  JSON.stringify(copySentences(applyPageWaivers(html, name, side), name));

describe("project-image waiver", () => {
  it("ignores a marked picture on the port side", () => {
    expect(text(page(marked))).toBe(text(page("")));
  });

  it("still reads the alt text of an unmarked image", () => {
    expect(text(page(plain))).not.toBe(text(page("")));
  });

  it("does not touch the Highland side", () => {
    expect(text(page(marked), "highland")).not.toBe(text(page(""), "highland"));
  });

  it("still reports changed copy next to a marked picture", () => {
    const changed = `<html><body><main>${marked}<h1>Smart classrooms</h1><p>Different words entirely here.</p></main></body></html>`;
    expect(text(changed)).not.toBe(text(page("")));
  });

  it("cuts the picture gallery (its buttons are not form controls Highland lacks) and nothing around it", () => {
    const gallery = `<section aria-label="Pictures of X" data-parity="project-gallery"><ul><li><button type="button" aria-label="Enlarge picture 1">${marked}</button></li></ul><p>Caption words that exist only here.</p></section>`;
    const out = applyPageWaivers(page(gallery), "project-x", "port");
    expect(/<(input|textarea|select|button)\b/i.test(out)).toBe(false);
    expect(text(page(gallery))).toBe(text(page("")));
    // a section that is not the gallery is left alone
    const other = `<section><p>A different section that carries its own words and must still be compared against the original.</p></section>`;
    expect(text(page(other))).not.toBe(text(page("")));
  });
});
