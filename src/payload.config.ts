import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { seoPlugin } from "@payloadcms/plugin-seo";
import { formBuilderPlugin } from "@payloadcms/plugin-form-builder";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Solutions } from "./collections/Solutions";
import { Partners } from "./collections/Partners";
import { Sectors } from "./collections/Sectors";
import { Projects } from "./collections/Projects";
import { Courses } from "./collections/Courses";
import { Jobs } from "./collections/Jobs";
import { News } from "./collections/News";
import { HomePage } from "./globals/HomePage";
import { CompanyPage } from "./globals/CompanyPage";
import { SiteSettings } from "./globals/SiteSettings";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: " · Edge COMM-TECH",
    },
  },
  collections: [Solutions, Sectors, Projects, Partners, Courses, Jobs, News, Media, Users],
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
  ],
});
