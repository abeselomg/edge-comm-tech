import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  SAMPLE_CREDIT,
  SAMPLE_REVIEWER,
  SAMPLE_SOURCE,
  sampleAlt,
  sampleFilename,
  seedProjectImages,
  type ImagePayload,
} from "./project-images";

/** A tiny in-memory stand-in for the Local API, enough for the three calls this step makes. */
function fakePayload(projects: Record<string, any>[]) {
  const media: Record<string, any>[] = [];
  const created: Record<string, any>[] = [];
  const updates: Record<string, any>[] = [];
  const payload: ImagePayload = {
    find: async ({ collection, where }) => {
      const [[field, cond]] = Object.entries(where) as [string, { equals: unknown }][];
      const list = collection === "projects" ? projects : media;
      return { docs: list.filter((d) => d[field] === cond.equals) };
    },
    create: async ({ data, file }) => {
      const f = file as { name: string };
      const doc = { id: 100 + media.length, filename: f.name, ...data };
      media.push(doc);
      created.push({ ...data, filename: f.name });
      return { id: doc.id };
    },
    update: async ({ id, data }) => {
      updates.push({ id, ...data });
      Object.assign(projects.find((p) => p.id === id)!, data);
    },
  };
  return { payload, media, created, updates };
}

const dirWith = (slugs: string[]) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "edge-samples-"));
  for (const s of slugs) {
    fs.mkdirSync(path.join(dir, s));
    for (const n of ["cover", "g1", "g2"]) fs.writeFileSync(path.join(dir, s, n + ".jpg"), "jpeg-bytes");
  }
  return dir;
};

describe("seedProjectImages", () => {
  const list = [{ slug: "alpha", title: "Alpha Project" }];

  it("uploads approved, provenance-recorded, clearly labelled samples and attaches them", async () => {
    const dir = dirWith(["alpha"]);
    const { payload, created, updates } = fakePayload([{ id: 1, slug: "alpha", _status: "published" }]);
    const report = await seedProjectImages(payload, list, { dir, today: "2026-10-26" });
    expect(report).toEqual({ uploaded: 3, reused: 0, attached: 1, left: 0 });
    expect(created.map((c) => c.filename)).toEqual(["alpha-cover.jpg", "alpha-g1.jpg", "alpha-g2.jpg"]);
    for (const c of created) {
      expect(c.approved).toBe(true);
      expect(c.provenance).toEqual({
        source: SAMPLE_SOURCE,
        retrievedAt: "2026-10-26T00:00:00.000Z",
        reviewedBy: SAMPLE_REVIEWER,
      });
      expect(c.credit).toBe(SAMPLE_CREDIT);
      expect(c.credit).toMatch(/SAMPLE/);
    }
    expect(created[0].alt).toBe("Illustration: Alpha Project sample image");
    expect(created[1].alt).toBe(sampleAlt("Alpha Project", 1));
    expect(updates).toHaveLength(1);
    expect(updates[0].coverImage).toBe(100);
    expect(updates[0].gallery).toEqual([{ image: 101 }, { image: 102 }]);
    // No captions are seeded, and the publish state is the document's own.
    expect(JSON.stringify(updates[0])).not.toContain("caption");
    expect(updates[0]._status).toBe("published");
  });

  it("is idempotent: a second run uploads and changes nothing", async () => {
    const dir = dirWith(["alpha"]);
    const { payload, created, updates } = fakePayload([{ id: 1, slug: "alpha" }]);
    await seedProjectImages(payload, list, { dir });
    const second = await seedProjectImages(payload, list, { dir });
    expect(second).toEqual({ uploaded: 0, reused: 0, attached: 0, left: 1 });
    expect(created).toHaveLength(3);
    expect(updates).toHaveLength(1);
  });

  it("never replaces an editor's own cover or gallery", async () => {
    const dir = dirWith(["alpha"]);
    const { payload, created, updates } = fakePayload([{ id: 1, slug: "alpha", coverImage: 55 }]);
    const report = await seedProjectImages(payload, list, { dir });
    expect(report.left).toBe(1);
    expect(created).toEqual([]);
    expect(updates).toEqual([]);
    const g = fakePayload([{ id: 1, slug: "alpha", gallery: [{ image: 9 }] }]);
    await seedProjectImages(g.payload, list, { dir });
    expect(g.updates).toEqual([]);
  });

  it("reuses a media file that is already in the library instead of uploading it again", async () => {
    const dir = dirWith(["alpha"]);
    const f = fakePayload([{ id: 1, slug: "alpha" }]);
    f.media.push({ id: 7, filename: sampleFilename("alpha", "cover") });
    const report = await seedProjectImages(f.payload, list, { dir });
    expect(report).toMatchObject({ uploaded: 2, reused: 1, attached: 1 });
    expect(f.updates[0].coverImage).toBe(7);
  });

  it("skips a project with no sample files or no document, and keeps a draft a draft", async () => {
    const empty = dirWith([]);
    const f = fakePayload([{ id: 1, slug: "alpha" }]);
    expect(await seedProjectImages(f.payload, list, { dir: empty })).toEqual({
      uploaded: 0,
      reused: 0,
      attached: 0,
      left: 0,
    });
    const dir = dirWith(["alpha"]);
    const none = fakePayload([]);
    expect((await seedProjectImages(none.payload, list, { dir })).attached).toBe(0);
    const d = fakePayload([{ id: 1, slug: "alpha", _status: "draft" }]);
    await seedProjectImages(d.payload, list, { dir });
    expect(d.updates[0]._status).toBe("draft");
  });

  it("the repository ships samples for every seeded project, each under 150 KB", async () => {
    const { PROJECTS } = await import("../../design-src/highland/content.mjs");
    const root = path.resolve(__dirname, "..", "..", "seed-assets", "projects");
    for (const p of PROJECTS) {
      for (const n of ["cover", "g1", "g2", "g3"]) {
        const file = path.join(root, p.slug, n + ".jpg");
        expect(fs.existsSync(file), file).toBe(true);
        expect(fs.statSync(file).size, file).toBeLessThan(150 * 1024);
      }
    }
  });
});
