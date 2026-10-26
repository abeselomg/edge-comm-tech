import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { GalleryLightbox } from "./gallery-lightbox";
import { ProjectCover, ProjectGallery } from "./project-images";
import { FeaturedProject, ProjectRow } from "./project-parts";

const html = (el: React.ReactElement | null) => renderToStaticMarkup(<div>{el}</div>);
const pic = (n: number, over: Record<string, unknown> = {}) => ({
  id: n,
  url: `/api/media/file/p${n}.jpg`,
  alt: `Illustration: Pic ${n}`,
  approved: true,
  ...over,
});
const project = (over: Record<string, unknown> = {}) =>
  ({
    _status: "published",
    slug: "p1",
    title: "Smart classrooms",
    client: { _status: "published", name: "Bahir Dar University" },
    sector: "education",
    sectorFull: "Universities and Education",
    location: "Bahir Dar",
    year: { status: "confirmed", value: "2024/2025" },
    primary: "Smart classrooms",
    summary: "A summary.",
    solutions: [],
    tech: [],
    ...over,
  }) as never;

describe("ProjectCover", () => {
  it("renders the approved cover as an image with the media alt text, lazy by default", () => {
    const out = html(<ProjectCover project={project({ coverImage: pic(1) })} sizes="100vw" />);
    expect(out).toContain("<img");
    expect(out).toContain('alt="Illustration: Pic 1"');
    expect(out).toContain("p1.jpg");
    expect(out).toContain('sizes="100vw"');
    expect(out).toContain('loading="lazy"');
    expect(out).toContain("aspect-[16/10]");
  });

  it("shows a tinted, decorative, text-free fallback when there is no cover", () => {
    const out = html(<ProjectCover project={project()} accent="#0888c5" sizes="100vw" />);
    expect(out).not.toContain("<img");
    expect(out).toContain('aria-hidden="true"');
    expect(out.replace(/<[^>]*>/g, "")).toBe("");
  });

  it("renders nothing when told not to fall back and there is no cover", () => {
    expect(html(<ProjectCover project={project()} sizes="100vw" fallback={false} />)).toBe("<div></div>");
  });

  it("treats an unapproved cover as no cover", () => {
    const out = html(<ProjectCover project={project({ coverImage: pic(1, { approved: false }) })} sizes="100vw" />);
    expect(out).not.toContain("<img");
    expect(out).not.toContain("p1.jpg");
  });
});

describe("the index cards", () => {
  it("a row carries the cover image, and its text is unchanged by it", () => {
    const withPic = html(
      <ul>
        <ProjectRow project={project({ coverImage: pic(1) })} />
      </ul>,
    );
    const without = html(
      <ul>
        <ProjectRow project={project()} />
      </ul>,
    );
    expect(withPic).toContain('alt="Illustration: Pic 1"');
    expect(without).not.toContain("<img");
    const text = (s: string) => s.replace(/<[^>]*>/g, "");
    expect(text(withPic)).toBe(text(without));
  });

  it("the featured card shows the cover only when there is one", () => {
    expect(html(<FeaturedProject project={project({ coverImage: pic(2) })} />)).toContain("p2.jpg");
    expect(html(<FeaturedProject project={project()} />)).not.toContain("<img");
  });
});

describe("ProjectGallery", () => {
  it("renders nothing without approved pictures", () => {
    expect(html(<ProjectGallery project={project()} />)).toBe("<div></div>");
    expect(
      html(<ProjectGallery project={project({ gallery: [{ image: pic(1, { approved: false }) }] })} />),
    ).toBe("<div></div>");
  });

  it("lists every approved picture as an enlarge button with its alt, and shows captions only when set", () => {
    const out = html(
      <ProjectGallery
        project={project({
          gallery: [{ image: pic(1), caption: "The server room" }, { image: pic(2) }, { image: pic(3, { approved: false }) }],
        })}
      />,
    );
    expect(out).toContain('aria-label="Enlarge picture 1 of 2: Illustration: Pic 1"');
    expect(out).toContain('aria-label="Enlarge picture 2 of 2: Illustration: Pic 2"');
    expect(out).not.toContain("Pic 3");
    expect(out).toContain("The server room");
    expect(out.match(/<figcaption/g)).toHaveLength(1);
    expect(out).toContain('aria-label="Pictures of Smart classrooms"');
  });

  it("adds no visible heading and no dialog content while closed", () => {
    const out = html(<ProjectGallery project={project({ gallery: [{ image: pic(1) }] })} />);
    expect(out).not.toMatch(/<h[1-6]/);
    expect(out).toContain("<dialog");
    expect(out).not.toContain("Close picture viewer");
    expect(out).not.toContain("Next picture");
  });
});

describe("GalleryLightbox", () => {
  it("is a modal dialog labelled for assistive technology", () => {
    const out = html(<GalleryLightbox items={[{ src: "/a.jpg", alt: "A", caption: null }]} />);
    expect(out).toContain('<dialog aria-label="Project pictures"');
    expect(out).toContain('aria-haspopup="dialog"');
  });
});
