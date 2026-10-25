import type { CollectionConfig } from "payload";
import { describe, expect, it } from "vitest";

import { previewUrl } from "@/lib/preview";
import { AcademyTracks } from "./AcademyTracks";
import { Clients } from "./Clients";
import { Downloads } from "./Downloads";
import { Events } from "./Events";
import { Jobs } from "./Jobs";
import { News } from "./News";
import { PartnerCategories } from "./PartnerCategories";
import { Partners } from "./Partners";
import { PostCategories } from "./PostCategories";
import { Posts } from "./Posts";
import { Projects } from "./Projects";
import { Services } from "./Services";
import { Solutions } from "./Solutions";

/*
 * Every content collection shows the admin a Preview button. The URL comes
 * from previewUrl and nowhere else, so the admin can never link somewhere the
 * preview route would refuse.
 */

const withDetailPage = [Solutions, Services, Projects, News, Events, Jobs];
const shownOnAListing = [Posts, PostCategories, AcademyTracks, Downloads, Clients, Partners, PartnerCategories];

const options = {} as Parameters<NonNullable<NonNullable<CollectionConfig["admin"]>["preview"]>>[1];

async function previewOf(collection: CollectionConfig, doc: Record<string, unknown>) {
  const preview = collection.admin?.preview;
  expect(preview, collection.slug).toBeTypeOf("function");
  return preview!(doc, options);
}

describe("admin.preview", () => {
  it.each(withDetailPage.map((c) => [c.slug, c] as const))(
    "%s previews its own page, and offers nothing before it has a slug",
    async (slug, collection) => {
      expect(await previewOf(collection, { slug: "sample" })).toBe(previewUrl(slug, { slug: "sample" }));
      expect(await previewOf(collection, { slug: "sample" })).not.toBeNull();
      expect(await previewOf(collection, {})).toBeNull();
      expect(await previewOf(collection, { slug: null })).toBeNull();
    },
  );

  it.each(shownOnAListing.map((c) => [c.slug, c] as const))(
    "%s previews the listing that shows it",
    async (slug, collection) => {
      const url = await previewOf(collection, { slug: "sample" });
      expect(url).toBe(previewUrl(slug, { slug: "sample" }));
      expect(url).not.toBeNull();
      expect(await previewOf(collection, {})).not.toBeNull();
    },
  );
});
