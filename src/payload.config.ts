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
import { Sectors } from "./collections/Sectors";
import { Clients } from "./collections/Clients";
import { Projects } from "./collections/Projects";
import { Courses } from "./collections/Courses";
import { Jobs } from "./collections/Jobs";
import { News } from "./collections/News";
import { PostCategories } from "./collections/PostCategories";
import { Posts } from "./collections/Posts";
import { Downloads } from "./collections/Downloads";
import { HomePage } from "./globals/HomePage";
import { CompanyPage } from "./globals/CompanyPage";
import { SiteSettings } from "./globals/SiteSettings";

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
      titleSuffix: " · Edge COMM-TECH",
    },
  },
  collections: [Solutions, Services, Sectors, Clients, Projects, Events, PostCategories, Posts, News, Downloads, PartnerCategories, Partners, Courses, Jobs, Media, Users],
  globals: [HomePage, CompanyPage, SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || "" },
  }),
  sharp,
  plugins: [
    seoPlugin({
      collections: ["solutions", "sectors", "projects", "courses", "jobs", "news"],
      uploadsCollection: "media",
      generateTitle: ({ doc }) => `${doc?.title ?? "Edge COMM-TECH"} · Edge COMM-TECH`,
      generateDescription: ({ doc }) => doc?.summary ?? doc?.line ?? doc?.excerpt ?? "",
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
