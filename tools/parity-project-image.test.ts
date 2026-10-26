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
});
