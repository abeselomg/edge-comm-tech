import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Confirmable, Mark, Pending } from "./markers";

const html = (el: React.ReactElement) => renderToStaticMarkup(el);

describe("Pending marks a fact Edge has not supplied", () => {
  /*
   * Review Focus #1. Five executive biographies, 29 of 32 partner marks and
   * 9 of 10 client marks are absent by design. The content master's rule is
   * that an absence is shown, because the alternative is a plausible-looking
   * invention.
   */
  it("renders the text inside a visible marker", () => {
    const out = html(<Pending>Year to confirm</Pending>);
    expect(out).toContain("Year to confirm");
    expect(out).toContain("text-lamp");
  });
});

describe("Confirmable renders a fact or says it is unconfirmed", () => {
  it("renders the value when Edge has confirmed it", () => {
    expect(html(<Confirmable value={{ value: "2024", status: "confirmed" }} />)).toContain("2024");
  });

  it("renders the pending label, not the empty value", () => {
    // Review Focus #4: one project's year is unconfirmed today, and
    // pendingLabel exists so the page says so rather than showing a blank.
    const out = html(
      <Confirmable value={{ value: null, status: "pending", pendingLabel: "Year to confirm" }} />,
    );
    expect(out).toContain("Year to confirm");
    expect(out).not.toContain("null");
    expect(out).not.toContain("undefined");
  });

  it("falls back to a dash when confirmed but empty, never to a blank", () => {
    // A confirmed-but-empty field is an editor mistake, and an em dash is a
    // visible one. Rendering nothing hides it in a layout that looks fine.
    expect(html(<Confirmable value={{ value: null, status: "confirmed" }} />)).toContain("—");
  });

  it("renders nothing readable for a missing value object", () => {
    const out = html(<Confirmable value={undefined} />);
    expect(out).not.toContain("undefined");
    expect(out).not.toContain("null");
  });
});

describe("Mark shows approved artwork or the name in its place", () => {
  it("renders an approved logo", () => {
    const out = html(
      <Mark item={{ name: "Gadaa Bank", logo: { id: 1, url: "/m/g.png", approved: true } }} />,
    );
    expect(out).toContain("/_next/image?url=%2Fm%2Fg.png&amp;w=");
    expect(out).toContain("Gadaa Bank"); // the alt text
  });

  it("refuses artwork whose approval was withdrawn", () => {
    /*
     * The second half of the media gate. filterOptions stops an unapproved
     * asset being SELECTED; it does nothing about one un-approved after
     * selection, which is the case that matters, because approval is
     * withdrawn precisely when someone finds an asset should not be public.
     */
    const out = html(
      <Mark item={{ name: "Gadaa Bank", logo: { id: 1, url: "/m/g.png", approved: false } }} />,
    );
    expect(out).not.toContain("g.png");
    expect(out).toContain("Gadaa Bank");
  });

  it("sets the name when there is no logo at all", () => {
    const out = html(<Mark item={{ name: "Gadaa Bank", logo: null }} />);
    expect(out).not.toContain("<img");
    expect(out).toContain("Gadaa Bank");
  });

  it("treats an unpopulated relationship as no logo", () => {
    // depth 0 gives a bare id, which carries no approval state to trust.
    expect(html(<Mark item={{ name: "Gadaa Bank", logo: 7 }} />)).not.toContain("<img");
  });

  it("keeps its default classes when no override is given", () => {
    const logo = { id: 1, url: "/m/g.png", approved: true };
    expect(html(<Mark item={{ name: "G", logo }} h="h-9" />)).toContain(
      'class="h-9 w-auto max-w-full object-contain"',
    );
    expect(html(<Mark item={{ name: "G", logo: null }} />)).toContain(
      'class="px-2 text-center font-display text-[13px] leading-tight text-ink/70"',
    );
  });

  it("lets the frame size the logo and the name, without bypassing the gate", () => {
    const logo = { id: 1, url: "/m/g.png", approved: true };
    const img = html(<Mark item={{ name: "G", logo }} imgClass="small" nameClass="tiny" />);
    expect(img).toContain('class="small"');
    const name = html(
      <Mark item={{ name: "G", logo: { ...logo, approved: false } }} imgClass="small" nameClass="tiny" />,
    );
    expect(name).not.toContain("<img");
    expect(name).toContain('class="tiny"');
  });

  it("escapes a name that contains markup", () => {
    // React escapes by default; Highland needed esc() and this asserts the
    // port did not reintroduce dangerouslySetInnerHTML to replace it.
    const out = html(<Mark item={{ name: "A & B <script>", logo: null }} />);
    expect(out).toContain("&amp;");
    expect(out).not.toContain("<script>");
  });
});

describe("Mark serves a resized logo through next/image", () => {
  const logo = {
    id: 1,
    url: "/api/media/file/arba-minch-university-logo.png",
    approved: true,
    width: 800,
    height: 800,
  };
  const render = (props: Partial<React.ComponentProps<typeof Mark>> = {}) =>
    html(<Mark item={{ name: "Arba Minch University", logo }} {...props} />);

  it("is lazy, async-decoded, sized, and never preloaded", () => {
    const out = render();
    expect(out).toContain('loading="lazy"');
    expect(out).toContain('decoding="async"');
    expect(out).toContain('width="800"');
    expect(out).toContain('height="800"');
    expect(out).toContain('sizes="160px"');
    expect(out.toLowerCase()).not.toContain("fetchpriority");
    expect(out).not.toContain("<link");
  });

  it("requests the optimizer, not the original upload", () => {
    const out = render();
    expect(out).toContain("/_next/image?url=%2Fapi%2Fmedia%2Ffile%2Farba-minch-university-logo.png");
    expect(out).toContain("srcSet=");
    expect(out).toContain("w=384");
  });

  it("keeps the alt text exactly as the name", () => {
    expect(render()).toContain('alt="Arba Minch University"');
  });

  it("takes a sizes override and an eager opt-out", () => {
    const out = render({ sizes: "128px", lazy: false });
    expect(out).toContain('sizes="128px"');
    expect(out).toContain('loading="eager"');
  });

  it("falls back to a default aspect when the media has no dimensions", () => {
    const out = html(
      <Mark item={{ name: "G", logo: { id: 2, url: "/api/media/file/g.png", approved: true } }} />,
    );
    expect(out).toContain('width="240"');
    expect(out).toContain('height="160"');
  });

  it("serves an SVG untouched", () => {
    const out = html(
      <Mark item={{ name: "S", logo: { id: 3, url: "/api/media/file/s.svg", approved: true } }} />,
    );
    expect(out).toContain('src="/api/media/file/s.svg"');
    expect(out).not.toContain("/_next/image");
  });

  it("keeps the partner ring classes and name fallback", () => {
    const img = render({ imgClass: "eg-ring-logo", nameClass: "eg-ring-name", sizes: "128px", lazy: true });
    expect(img).toContain('class="eg-ring-logo"');
    expect(img).toContain('loading="lazy"');
    const name = html(
      <Mark item={{ name: "No Logo Ltd", logo: null }} imgClass="eg-ring-logo" nameClass="eg-ring-name" lazy />,
    );
    expect(name).not.toContain("<img");
    expect(name).toContain('class="eg-ring-name"');
    expect(name).toContain("No Logo Ltd");
  });
});
