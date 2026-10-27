import path from "path";
import { fileURLToPath } from "url";
import { buildConfig, type Field } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { seoPlugin } from "@payloadcms/plugin-seo";
import { formBuilderPlugin } from "@payloadcms/plugin-form-builder";
import { s3Storage } from "@payloadcms/storage-s3";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import sharp from "sharp";

import { readMailConfig } from "./lib/mail";
import { guardSeoMetaFields } from "./fields/seo";
import { trimDescription } from "./lib/seo/text";
import { submissionExtraFields } from "./fields/submission";
import { signedInField, adminOnly, submissionsRead } from "./access";
import { hiddenInAdmin } from "./access/matrix";
import { revalidateAfterChange, revalidateAfterDelete } from "./hooks/revalidate";
import { FORM_PATHS, FORM_PATTERNS } from "./lib/forms/pages";
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
import { Applications } from "./collections/Applications";
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
      // CVs share the bucket under their own prefix; they are still served
      // through Payload (access control is not disabled), never by public URL.
      collections: { media: true, applications: { prefix: "applications" } },
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

/*
 * Outgoing mail. With SMTP_HOST unset there is no adapter and Payload's
 * default logs instead of sending, so development needs no mail server. The
 * transport is not verified at boot (skipVerify): an unreachable relay must
 * not stop the site starting, and each send's failure is recorded on the
 * submission by sendNotification.
 */
const mail = readMailConfig(process.env);
const emailAdapter = mail
  ? nodemailerAdapter({
      defaultFromAddress: mail.from,
      defaultFromName: "Edge Comm-Tech",
      skipVerify: true,
      transportOptions: {
        host: mail.host,
        port: mail.port,
        secure: mail.secure,
        ...(mail.user && mail.pass ? { auth: { user: mail.user, pass: mail.pass } } : {}),
      },
    })
  : undefined;

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
  // Each section is hidden from the admin sidebar for roles that do not work in it (ADMIN_NAV in access/matrix.ts).
  collections: [Solutions, Services, Clients, Projects, Events, PostCategories, Posts, News, Downloads, PartnerCategories, Partners, Jobs, AcademyTracks, Media, Applications, Users].map(
    (c) => ({ ...c, admin: { ...c.admin, hidden: hiddenInAdmin(c.slug) } }),
  ),
  globals: [SiteSettings, Company, ContactDetails, Careers, PageCopy].map((g) => ({
    ...g,
    admin: { ...g.admin, hidden: hiddenInAdmin(g.slug) },
  })),
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
  ...(emailAdapter ? { email: emailAdapter } : {}),
  sharp,
  plugins: [
    seoPlugin({
      collections: ["solutions", "services", "projects", "news", "events", "jobs", "posts"],
      uploadsCollection: "media",
      /*
       * What the "Auto-generate" buttons fill in. The title is the page's own
       * title WITHOUT the site name: the frontend adds " | Edge Comm-Tech"
       * after it (src/lib/seo/metadata.ts), and a name typed here as well
       * would print twice. The frontend also strips a trailing brand from
       * older values, so a title saved with one is still shown once.
       * "Edge Comm-Tech" is the approved short name; the upper-case form
       * appears nowhere in the content master.
       */
      generateTitle: ({ doc }) => doc?.title ?? "",
      // Trimmed to what a search result shows, so the generated text passes the
      // 160-character cap in guardSeoMetaFields rather than failing the save.
      generateDescription: ({ doc }) =>
        trimDescription(
          doc?.blurb ?? doc?.summary ?? doc?.standfirst ?? doc?.intro ?? doc?.purpose ?? doc?.excerpt ?? "",
        ),
      // The plugin creates its own meta.title and meta.description, which the
      // validators in the collection files cannot reach. See src/fields/seo.ts.
      fields: guardSeoMetaFields,
    }),
    formBuilderPlugin({
      fields: { payment: false, upload: true },
      uploadCollections: ["applications"],
      /*
       * One notification per submission, sent by sendNotification (src/lib/mail.ts)
       * so a failure is recorded on the submission. The plugin has its own
       * sender that mails each form's `emails` on create; returning no emails
       * here stops it, leaving ours the only one. The `emails` array stays as
       * the recipient list we read.
       */
      beforeEmail: () => [],
      /*
       * Form definitions are read by the public pages, so `read` stays open;
       * only admins may change them (a reshaped form breaks its route).
       */
      formOverrides: {
        admin: { group: "Site", hidden: hiddenInAdmin("forms") },
        access: { read: () => true, create: adminOnly, update: adminOnly, delete: adminOnly },
        // Recipients, cc/bcc and templates are staff-only over REST/GraphQL.
        // Local-API readers (the pages, the submission route) override access.
        fields: ({ defaultFields }) =>
          defaultFields.map((f) =>
            "name" in f && f.name === "emails"
              ? ({ ...f, access: { ...("access" in f ? f.access : {}), read: signedInField } } as Field)
              : f,
          ),
        // The six pages are prerendered from these documents.
        hooks: {
          afterChange: [revalidateAfterChange(() => FORM_PATHS, { patterns: FORM_PATTERNS })],
          afterDelete: [revalidateAfterDelete(() => FORM_PATHS, { patterns: FORM_PATTERNS })],
        },
      },
      /*
       * The plugin's default is `create: () => true`, which would let a bot
       * POST /api/form-submissions and skip the honeypot and rate limiter in
       * the submission route. Public visitors never write here directly; the
       * route does, through the local API. Reads are staff-only (admins and
       * editors read all; HR only the careers forms), and editing or deleting a record is for admins.
       */
      formSubmissionOverrides: {
        admin: { group: "Site", hidden: hiddenInAdmin("form-submissions") },
        access: { create: adminOnly, read: submissionsRead, update: adminOnly, delete: adminOnly },
        fields: ({ defaultFields }) => [...defaultFields, ...submissionExtraFields],
      },
    }),
    ...storagePlugins,
  ],
});
