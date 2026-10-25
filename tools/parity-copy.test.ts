import { describe, expect, it } from "vitest";
import { copySentences } from "./parity-copy.mjs";

const NOTE =
  "Form shown for layout review. Fields, validation, consent capture, secure upload and routing are built against the CMS at implementation.";
const NEXT = "Applications are acknowledged with a reference number and routed to the mailbox.";

const highlandForm = (next: string) =>
  `<form><button type="button" class="x" disabled>Submit application</button><p>${NOTE}</p></form><p>${next}</p>`;
const liveForm = (next: string) =>
  `<form><button type="submit" class="x disabled:opacity-60">Submit application</button></form><p>${next}</p>`;

describe("copySentences around a form", () => {
  it("compares the same when Highland's removed form note is the only difference", () => {
    expect(copySentences(liveForm(NEXT), "careers-internships")).toEqual(
      copySentences(highlandForm(NEXT), "careers-internships"),
    );
  });

  it("still reports a genuinely changed sentence next to a form", () => {
    const changed = NEXT.replace("acknowledged", "ignored");
    expect(copySentences(liveForm(changed), "x")).not.toEqual(copySentences(highlandForm(NEXT), "x"));
  });

  it("still reports a missing sentence next to a form", () => {
    expect(copySentences(liveForm(""), "x")).not.toEqual(copySentences(highlandForm(NEXT), "x"));
  });
});

describe("contact page Careers waiver", () => {
  const select = (opts: string[]) =>
    `<p>Tell us what you need and we will reply within one business day.</p><select>${opts.map((o) => `<option>${o}</option>`).join("")}</select>`;
  const base = ["Select", "Technical Support", "Training and E-Academy"];

  it("waives the Careers option on the contact page only", () => {
    const withCareers = select([...base, "Careers", "General Inquiry"]);
    const without = select([...base, "General Inquiry"]);
    expect(copySentences(withCareers, "contact")).toEqual(copySentences(without, "contact"));
    expect(copySentences(withCareers, "subscribe")).not.toEqual(copySentences(without, "subscribe"));
  });

  it("does not waive some other dropped option on the contact page", () => {
    const a = select([...base, "Careers", "General Inquiry"]);
    const b = select(["Select", "Training and E-Academy", "Careers", "General Inquiry"]);
    expect(copySentences(a, "contact")).not.toEqual(copySentences(b, "contact"));
  });
});
