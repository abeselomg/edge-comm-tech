import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { downloadLink, DownloadList } from "./download-parts";

const media = (approved: boolean | undefined) => ({ id: 1, url: "/media/profile.pdf", approved });
const doc = (over: Record<string, unknown> = {}) =>
  ({
    title: "Company profile",
    category: "Company profile",
    meta: "PDF · English",
    note: "Check against the current taxonomy.",
    owner: "Edge Comm-Tech",
    approved: false,
    ...over,
  }) as never;

const html = (el: React.ReactElement) => renderToStaticMarkup(el);

describe("downloadLink — the approval gate on the read side", () => {
  it("serves the file only when the document and its file are both approved", () => {
    expect(downloadLink(doc({ approved: true, file: media(true) }))).toBe("/media/profile.pdf");
  });

  it("withholds the file from a document not yet approved, even when one is attached", () => {
    expect(downloadLink(doc({ approved: false, file: media(true) }))).toBeNull();
  });

  it("fails closed when approval is absent, not merely false", () => {
    expect(downloadLink(doc({ approved: undefined, file: media(true) }))).toBeNull();
  });

  /*
   * The file relationship is gated at selection time only. An asset un-approved
   * after it was attached must stop being served, which is the same case
   * approvedLogo covers for client and partner marks.
   */
  it("withholds a file whose media approval was withdrawn after it was attached", () => {
    expect(downloadLink(doc({ approved: true, file: media(false) }))).toBeNull();
    expect(downloadLink(doc({ approved: true, file: media(undefined) }))).toBeNull();
  });

  it("withholds when approved is ticked but there is no file", () => {
    expect(downloadLink(doc({ approved: true, file: null }))).toBeNull();
  });
});

describe("DownloadList", () => {
  it("lists an unapproved document with its status and a request route, not a link to a file", () => {
    const out = html(<DownloadList docs={[doc()]} />);
    expect(out).toContain("Company profile");
    expect(out).toContain("Approval pending");
    expect(out).toContain("Request it");
    expect(out).not.toContain(".pdf");
  });

  it("offers an approved document for download and drops the pending marker", () => {
    const out = html(<DownloadList docs={[doc({ approved: true, file: media(true) })]} />);
    expect(out).toContain('href="/media/profile.pdf"');
    expect(out).not.toContain("Approval pending");
  });

  // Review Focus #3: an empty library says so; it is not a blank grid.
  it("says there is nothing to download when there are no documents", () => {
    const out = html(<DownloadList docs={[]} />);
    expect(out).toMatch(/no documents|nothing to download/i);
    expect(out).not.toContain("<ul");
  });
});
