import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  FeaturedProject,
  heroProject,
  ProjectBody,
  ProjectFacts,
  ProjectRow,
  siblingProjects,
} from "./project-parts";

const html = (el: React.ReactElement | null) => renderToStaticMarkup(<div>{el}</div>);
const live = (over: Record<string, unknown> = {}) => ({ _status: "published", ...over });
const year = (value: string | null, status: "confirmed" | "pending" = "confirmed") => ({
  status,
  value,
  pendingLabel: "Year to confirm",
});
const project = (over: Record<string, unknown> = {}) =>
  live({
    slug: "p1",
    title: "Smart classrooms",
    client: live({ name: "Bahir Dar University" }),
    sector: "education",
    sectorFull: "Universities and Education",
    location: "Bahir Dar",
    year: year("2024/2025"),
    primary: "Smart classrooms",
    summary: "A summary.",
    solutions: [live({ slug: "software-ai-digital", short: "Software", accent: "#222222" })],
    tech: [{ item: "Veeam" }],
    need: "The need.",
    scope: [{ item: "Scope one" }],
    delivered: [{ title: "Delivered A", body: "Delivered body" }],
    outcomes: [{ item: "Outcome one" }],
    technology: "Tech paragraph.",
    technologyNote: "A tech note.",
    training: "Training paragraph.",
    privacy: "A privacy note.",
    order: 1,
    featured: false,
    ...over,
  }) as never;

describe("ProjectFacts", () => {
  it("shows the facts the content master approves, and no contract figures", () => {
    const out = html(<ProjectFacts project={project()} />);
    for (const t of ["Bahir Dar University", "Universities and Education", "Bahir Dar", "2024/2025", "Completed", "Veeam"]) {
      expect(out, t).toContain(t);
    }
    // No contract value, quantity or capacity has been supplied as a verified figure.
    for (const label of ["Contract value", "Quantity", "Capacity", "Value"]) {
      expect(out, label).not.toContain(label);
    }
  });

  // Review Focus #3/#4: an unconfirmed year renders its marker, never a blank.
  it("shows the unconfirmed year as a marker", () => {
    const out = html(<ProjectFacts project={project({ year: year(null, "pending") })} />);
    expect(out).toContain("Year to confirm");
    expect(out).not.toContain("undefined");
    expect(out).not.toContain(">null<");
  });

  it("copes with a client that arrived as a bare id", () => {
    expect(() => html(<ProjectFacts project={project({ client: 3 })} />)).not.toThrow();
  });
});

describe("siblingProjects", () => {
  const a = project({ slug: "a" });
  it("keeps to the same sector, excludes itself and drafts, and caps at three", () => {
    const others = [
      project({ slug: "b" }), project({ slug: "c" }), project({ slug: "d" }), project({ slug: "e" }),
      project({ slug: "x", sector: "banking" }),
      project({ slug: "dr", _status: "draft" }),
    ];
    const out = siblingProjects([a, ...others] as never, a);
    expect(out.map((p) => p.slug)).toEqual(["b", "c", "d"]);
  });
  it("is empty when the project is alone in its sector", () => {
    expect(siblingProjects([a, project({ slug: "x", sector: "banking" })] as never, a)).toEqual([]);
  });
});

describe("heroProject", () => {
  it("is the first featured project in order, else the first project", () => {
    const list = [project({ slug: "a" }), project({ slug: "b", featured: true }), project({ slug: "c", featured: true })];
    expect(heroProject(list as never)?.slug).toBe("b");
    expect(heroProject([project({ slug: "z" })] as never)?.slug).toBe("z");
  });
  it("is null for an empty list, so the page can omit the section", () => {
    expect(heroProject([])).toBeNull();
    expect(html(<FeaturedProject project={null} />)).not.toContain("Featured engagement");
  });
});

describe("ProjectRow", () => {
  it("drops a solution chip whose solution was unpublished (Review Focus #1)", () => {
    const row = html(
      <ul>
        <ProjectRow
          project={project({
            solutions: [live({ slug: "ok", short: "Okay", accent: "#111111" }), { slug: "gone", short: "Gone", accent: "#222222", _status: "draft" }],
          })}
        />
      </ul>,
    );
    expect(row).toContain("Okay");
    expect(row).not.toContain("Gone");
    expect(row).toContain('href="/projects/p1"');
  });
});

describe("ProjectBody", () => {
  it("tells the story in order: need, scope, delivered, implementation, outcomes", () => {
    const out = html(<ProjectBody project={project()} siblings={[]} implementationNote="Impl note." />);
    const order = ["The need", "What Edge Comm-Tech delivered", "An integrated operational solution", "From assessment to operational handover", "The result"];
    const positions = order.map((t) => out.indexOf(t));
    expect(positions.every((p) => p >= 0)).toBe(true);
    expect([...positions].sort((x, y) => x - y)).toEqual(positions);
    expect(out).toContain("Impl note.");
  });

  it("omits the privacy note when there is none, and lists no solution it cannot link", () => {
    const out = html(<ProjectBody project={project({ privacy: null, solutions: [{ slug: "g", short: "Gone", accent: "#1", _status: "draft" }] })} siblings={[]} implementationNote="" />);
    expect(out).not.toContain("A privacy note.");
    expect(out).not.toContain("Gone");
  });

  it("says security control room, never SOC, in what it renders from a record that does", () => {
    const out = html(<ProjectBody project={project({ technology: "A security control room." })} siblings={[]} implementationNote="" />);
    expect(out).toContain("security control room");
    expect(out).not.toMatch(/\bSOC\b/);
  });
});
