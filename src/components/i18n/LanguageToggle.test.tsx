import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { LanguageToggle } from "./LanguageToggle";

describe("LanguageToggle", () => {
  const html = renderToStaticMarkup(<LanguageToggle />);

  it("is a labelled group with an EN and an አማ button", () => {
    expect(html).toContain('role="group"');
    expect(html).toContain('aria-label="Language"');
    expect(html).toContain('data-parity="lang-toggle"');
    expect(html.match(/<button/g)).toHaveLength(3); // two languages plus the arrow tab
    expect(html).toMatch(/>EN<\/button>/);
    expect(html).toMatch(/>አማ<\/button>/);
  });

  it("starts as English, the language the server renders", () => {
    expect(html).toMatch(/aria-label="English" aria-pressed="true"/);
    expect(html).toMatch(/aria-label="አማርኛ" aria-pressed="false"/);
  });

  it("starts collapsed: the arrow tab is a closed disclosure button for the language group", () => {
    expect(html).toContain('data-open="false"');
    const id = html.match(/<div id="([^"]+)" role="group"/)?.[1];
    expect(id).toBeTruthy();
    expect(html).toMatch(new RegExp('<button type="button" aria-label="Language" aria-expanded="false" aria-controls="' + id + '"'));
    // The arrow is a decorative SVG with no text of its own.
    expect(html).toMatch(/<svg[^>]*aria-hidden="true"/);
  });

  it("uses real buttons that cannot submit a form, and declares the script language", () => {
    expect(html.match(/type="button"/g)).toHaveLength(3);
    expect(html).toContain('lang="am"');
  });
});
