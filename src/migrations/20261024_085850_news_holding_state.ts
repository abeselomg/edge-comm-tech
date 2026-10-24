import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "news_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "news_pending_fields" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "news_closing_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "_news_v_version_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_news_v_version_pending_fields" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_news_v_version_closing_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "news" ADD COLUMN "held_for_publication" boolean DEFAULT false;
  ALTER TABLE "news" ADD COLUMN "closing_eyebrow" varchar;
  ALTER TABLE "news" ADD COLUMN "closing_title" varchar;
  ALTER TABLE "news" ADD COLUMN "closing_body" varchar;
  ALTER TABLE "_news_v" ADD COLUMN "version_held_for_publication" boolean DEFAULT false;
  ALTER TABLE "_news_v" ADD COLUMN "version_closing_eyebrow" varchar;
  ALTER TABLE "_news_v" ADD COLUMN "version_closing_title" varchar;
  ALTER TABLE "_news_v" ADD COLUMN "version_closing_body" varchar;
  ALTER TABLE "news_sections" ADD CONSTRAINT "news_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_pending_fields" ADD CONSTRAINT "news_pending_fields_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_closing_links" ADD CONSTRAINT "news_closing_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_version_sections" ADD CONSTRAINT "_news_v_version_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_news_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_version_pending_fields" ADD CONSTRAINT "_news_v_version_pending_fields_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_news_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_version_closing_links" ADD CONSTRAINT "_news_v_version_closing_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_news_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "news_sections_order_idx" ON "news_sections" USING btree ("_order");
  CREATE INDEX "news_sections_parent_id_idx" ON "news_sections" USING btree ("_parent_id");
  CREATE INDEX "news_pending_fields_order_idx" ON "news_pending_fields" USING btree ("_order");
  CREATE INDEX "news_pending_fields_parent_id_idx" ON "news_pending_fields" USING btree ("_parent_id");
  CREATE INDEX "news_closing_links_order_idx" ON "news_closing_links" USING btree ("_order");
  CREATE INDEX "news_closing_links_parent_id_idx" ON "news_closing_links" USING btree ("_parent_id");
  CREATE INDEX "_news_v_version_sections_order_idx" ON "_news_v_version_sections" USING btree ("_order");
  CREATE INDEX "_news_v_version_sections_parent_id_idx" ON "_news_v_version_sections" USING btree ("_parent_id");
  CREATE INDEX "_news_v_version_pending_fields_order_idx" ON "_news_v_version_pending_fields" USING btree ("_order");
  CREATE INDEX "_news_v_version_pending_fields_parent_id_idx" ON "_news_v_version_pending_fields" USING btree ("_parent_id");
  CREATE INDEX "_news_v_version_closing_links_order_idx" ON "_news_v_version_closing_links" USING btree ("_order");
  CREATE INDEX "_news_v_version_closing_links_parent_id_idx" ON "_news_v_version_closing_links" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "news_sections" CASCADE;
  DROP TABLE "news_pending_fields" CASCADE;
  DROP TABLE "news_closing_links" CASCADE;
  DROP TABLE "_news_v_version_sections" CASCADE;
  DROP TABLE "_news_v_version_pending_fields" CASCADE;
  DROP TABLE "_news_v_version_closing_links" CASCADE;
  ALTER TABLE "news" DROP COLUMN "held_for_publication";
  ALTER TABLE "news" DROP COLUMN "closing_eyebrow";
  ALTER TABLE "news" DROP COLUMN "closing_title";
  ALTER TABLE "news" DROP COLUMN "closing_body";
  ALTER TABLE "_news_v" DROP COLUMN "version_held_for_publication";
  ALTER TABLE "_news_v" DROP COLUMN "version_closing_eyebrow";
  ALTER TABLE "_news_v" DROP COLUMN "version_closing_title";
  ALTER TABLE "_news_v" DROP COLUMN "version_closing_body";`)
}
