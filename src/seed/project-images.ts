import fs from "node:fs";
import path from "node:path";

/*
 * Sample pictures for the seeded projects.
 *
 * seed-assets/projects/<slug>/{cover,g1,g2,g3}.jpg are generated illustrations
 * (tools/make-project-samples.mjs), not photographs of any engagement. They are
 * uploaded as approved Media so the pages have something to show, and they say
 * what they are in the credit and provenance fields so an editor knows to
 * replace them.
 *
 * The step is fill-only, whatever the seed mode:
 *   - a media file is looked up by its filename first and only uploaded when
 *     absent, so a re-run never duplicates and never overwrites an upload;
 *   - a project gets its pictures only when it has no cover and no gallery yet,
 *     so an editor's own selection is never replaced, and a project an editor
 *     deliberately emptied of pictures is the one case this cannot tell from a
 *     fresh one (it would be given the samples again -- noted in the README).
 */

export const SAMPLE_NAMES = ["cover", "g1", "g2", "g3"] as const;

export const SAMPLE_SOURCE =
  "Generated sample illustration created for the Edge site (not a photograph of the project)";
export const SAMPLE_REVIEWER = "Sample content";
export const SAMPLE_CREDIT =
  "SAMPLE illustration generated for the Edge site, not a photograph of this project. Replace with real project photography.";

export const sampleFilename = (slug: string, name: string) => `${slug}-${name}.jpg`;

/** Alt text names what the picture is: an illustration, for this project. */
export const sampleAlt = (title: string, index: number) =>
  index === 0 ? `Illustration: ${title} sample image` : `Illustration: ${title} sample image ${index + 1}`;

type Id = number | string;

/** The slice of the Local API this step uses, so it can be exercised without a database. */
export type ImagePayload = {
  find: (a: {
    collection: string;
    where: Record<string, unknown>;
    limit: number;
    depth: number;
  }) => Promise<{ docs: Record<string, any>[] }>;
  create: (a: { collection: string; data: Record<string, unknown>; file: unknown }) => Promise<{ id: Id }>;
  update: (a: { collection: string; id: Id; data: Record<string, unknown> }) => Promise<unknown>;
};

export type ImageReport = { uploaded: number; reused: number; attached: number; left: number };

export async function seedProjectImages(
  payload: ImagePayload,
  projects: { slug: string; title: string }[],
  options: { dir?: string; today?: string } = {},
): Promise<ImageReport> {
  const dir = options.dir ?? path.resolve(process.cwd(), "seed-assets", "projects");
  const today = options.today ?? new Date().toISOString().slice(0, 10);
  const report: ImageReport = { uploaded: 0, reused: 0, attached: 0, left: 0 };

  for (const { slug, title } of projects) {
    const files = SAMPLE_NAMES.map((n, i) => ({ n, i, file: path.join(dir, slug, `${n}.jpg`) })).filter((f) =>
      fs.existsSync(f.file),
    );
    if (!files.length) continue;

    const { docs } = await payload.find({
      collection: "projects",
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    });
    const project = docs[0];
    if (!project) continue;
    if (project.coverImage || (Array.isArray(project.gallery) && project.gallery.length)) {
      report.left += 1;
      continue;
    }

    const ids: Record<string, Id> = {};
    for (const { n, i, file } of files) {
      const filename = sampleFilename(slug, n);
      const found = await payload.find({
        collection: "media",
        where: { filename: { equals: filename } },
        limit: 1,
        depth: 0,
      });
      if (found.docs[0]) {
        ids[n] = found.docs[0].id as Id;
        report.reused += 1;
        continue;
      }
      const data = fs.readFileSync(file);
      const created = await payload.create({
        collection: "media",
        data: {
          alt: sampleAlt(title, i),
          credit: SAMPLE_CREDIT,
          provenance: { source: SAMPLE_SOURCE, retrievedAt: `${today}T00:00:00.000Z`, reviewedBy: SAMPLE_REVIEWER },
          approved: true,
        },
        file: { data, name: filename, mimetype: "image/jpeg", size: data.length },
      });
      ids[n] = created.id;
      report.uploaded += 1;
    }

    await payload.update({
      collection: "projects",
      id: project.id as Id,
      data: {
        ...(ids.cover ? { coverImage: ids.cover } : {}),
        gallery: SAMPLE_NAMES.filter((n) => n !== "cover" && ids[n]).map((n) => ({ image: ids[n] })),
        // Keep the document's own publish state: this step must not publish a draft.
        _status: project._status ?? "published",
      },
    });
    report.attached += 1;
  }
  return report;
}
