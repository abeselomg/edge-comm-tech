import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { LanguageToggle } from "./LanguageToggle";

describe("LanguageToggle", () => {
  const html = renderToStaticMarkup(<LanguageToggle />);

  it("is a labelled group with an EN and an አማ button", () => {
    expect(html).toContain('role="group"');
    expect(html).toContain('aria-label="Language"');
    expect(html).toContain('data-parity="lang-toggle"');
    expect(html.match(/<button/g)).toHaveLength(2);
    expect(html).toMatch(/>EN<\/button>/);
    expect(html).toMatch(/>አማ<\/button>/);
  });

  it("starts as English, the language the server renders", () => {
    expect(html).toMatch(/aria-label="English" aria-pressed="true"/);
    expect(html).toMatch(/aria-label="አማርኛ" aria-pressed="false"/);
  });

  it("uses real buttons that cannot submit a form, and declares the script language", () => {
    expect(html.match(/type="button"/g)).toHaveLength(2);
    expect(html).toContain('lang="am"');
  });
});
