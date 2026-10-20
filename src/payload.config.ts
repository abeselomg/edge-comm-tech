import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { seoPlugin } from "@payloadcms/plugin-seo";
import { formBuilderPlugin } from "@payloadcms/plugin-form-builder";
import { s3Storage } from "@payloadcms/storage-s3";
import sharp from "sharp";

import { guardSeoMetaFields } from "./fields/seo";
import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Solutions } from "./collections/Solutions";
import { Services } from "./collections/Services";
import { PartnerCategories } from "./collections/PartnerCategories";
import { Events } from "./collections/Events";
import { Partners } from "./collections/Partners";
import { Clients } from "./collections/Clients";
import { Projects } from "./collections/Projects";
import { Jobs } from "./collections/Jobs";
import { AcademyTracks } from "./collections/AcademyTracks";
import { News } from "./collections/News";
import { PostCategories } from "./collections/PostCategories";
import { Posts } from "./collections/Posts";
import { Downloads } from "./collections/Downloads";
import { SiteSettings } from "./globals/SiteSettings";
import { Company } from "./globals/Company";
import { ContactDetails } from "./globals/ContactDetails";
import { Careers } from "./globals/Careers";
import { PageCopy } from "./globals/PageCopy";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

/*
 * Hosting is deliberately undecided, so media goes behind an adapter rather
 * than onto a disk. With no S3_BUCKET set we fall through to Payload's local
 * disk handling, which is right for development and wrong for serverless.
 * Setting the five S3_* variables switches to any S3-compatible bucket.
 */
function buildStoragePlugins() {
  const bucket = process.env.S3_BUCKET || undefined;
  if (!bucket) return [];

  const region = process.env.S3_REGION || undefined;
  const endpoint = process.env.S3_ENDPOINT || undefined;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID || undefined;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY || undefined;

  if (!region) {
    throw new Error(
      "S3_REGION is required because S3_BUCKET is set. Every S3-compatible backend needs a region (Cloudflare R2 uses the literal value 'auto').",
    );
  }
  if (accessKeyId && !secretAccessKey) {
    throw new Error(
      "S3_SECRET_ACCESS_KEY is required because S3_BUCKET and S3_ACCESS_KEY_ID are set. Set both keys, or neither to use the SDK's default credential chain.",
    );
  }
  if (secretAccessKey && !accessKeyId) {
    throw new Error(
      "S3_ACCESS_KEY_ID is required because S3_BUCKET and S3_SECRET_ACCESS_KEY are set. Set both keys, or neither to use the SDK's default credential chain.",
    );
  }

  /*
   * With neither key set we omit `credentials` entirely rather than passing
   * empty strings. Any credentials object, even a blank one, blocks the AWS
   * SDK's default chain (IAM role, AWS_* environment), which is the correct
   * and more secure setup on AWS. Do not "simplify" this into `?? ""`.
   */
  const credentials =
    accessKeyId && secretAccessKey ? { accessKeyId, secretAccessKey } : undefined;

  return [
    s3Storage({
      collections: { media: true },
      bucket,
      config: {
        region,
        endpoint,
        // A custom endpoint stands in for "not AWS"; R2, B2 and MinIO all need path-style.
        forcePathStyle: Boolean(endpoint),
        ...(credentials ? { credentials } : {}),
      },
    }),
  ];
}

const storagePlugins = buildStoragePlugins();

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      // "Edge Comm-Tech" is the approved short name: it appears 83 times in
      // the content master and the upper-case form appears nowhere.
      titleSuffix: " — Edge Comm-Tech",
    },
  },
  collections: [Solutions, Services, Clients, Projects, Events, PostCategories, Posts, News, Downloads, PartnerCategories, Partners, Jobs, AcademyTracks, Media, Users],
  globals: [SiteSettings, Company, ContactDetails, Careers, PageCopy],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || "" },
    /*
     * Sync the schema from the collection definitions on boot, in development.
     *
     * Nothing else in this project creates tables: there is no migrations
     * directory and no migrate script, and `payload_migrations` holds a single
     * `dev` row with batch -1, which is the marker Payload writes when the
     * schema came from a push rather than a migration. So push is how this
     * database was built, and it has to stay switched on for the local
     * development database to track the model.
     *
     * Explicit rather than relying on the default, because the default is
     * environment-dependent and a production build silently does not push --
     * which is how four tasks of collection work landed with none of their
     * tables created.
     *
     * Production deployment needs real migrations (`payload migrate:create`,
     * then `payload migrate` on deploy). That is a deployment decision, not a
     * local one, and it is out of this plan's scope.
     */
    push: process.env.NODE_ENV !== "production",
  }),
  sharp,
  plugins: [
    seoPlugin({
      collections: ["solutions", "services", "projects", "news", "events", "jobs", "posts"],
      uploadsCollection: "media",
      /*
       * This writes the <title> of every public page the plugin covers, so the
       * brand name here reaches the live site and search results. "Edge
       * Comm-Tech" is the approved short name; the upper-case form appears
       * nowhere in the content master. The separator matches the frontend
       * layout's title template so the two cannot drift apart.
       */
      generateTitle: ({ doc }) =>
        doc?.title ? `${doc.title} — Edge Comm-Tech` : "Edge Comm-Tech",
      generateDescription: ({ doc }) =>
        doc?.blurb ?? doc?.summary ?? doc?.excerpt ?? "",
      // The plugin creates its own meta.title and meta.description, which the
      // validators in the collection files cannot reach. See src/fields/seo.ts.
      fields: guardSeoMetaFields,
    }),
    formBuilderPlugin({
      fields: { payment: false },
      formOverrides: {
        admin: { group: "Site" },
      },
      formSubmissionOverrides: {
        admin: { group: "Site" },
      },
    }),
    ...storagePlugins,
  ],
});
