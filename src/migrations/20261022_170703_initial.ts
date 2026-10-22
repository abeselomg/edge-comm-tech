import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_solutions_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__solutions_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_services_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__services_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_clients_sector" AS ENUM('education', 'banking', 'government');
  CREATE TYPE "public"."enum_clients_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__clients_v_version_sector" AS ENUM('education', 'banking', 'government');
  CREATE TYPE "public"."enum__clients_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_projects_sector" AS ENUM('education', 'banking', 'government');
  CREATE TYPE "public"."enum_projects_year_status" AS ENUM('confirmed', 'pending');
  CREATE TYPE "public"."enum_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_version_sector" AS ENUM('education', 'banking', 'government');
  CREATE TYPE "public"."enum__projects_v_version_year_status" AS ENUM('confirmed', 'pending');
  CREATE TYPE "public"."enum__projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_events_format" AS ENUM('Online', 'In person', 'Hybrid');
  CREATE TYPE "public"."enum_events_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__events_v_version_format" AS ENUM('Online', 'In person', 'Hybrid');
  CREATE TYPE "public"."enum__events_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_post_categories_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__post_categories_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_news_date_status" AS ENUM('confirmed', 'pending');
  CREATE TYPE "public"."enum_news_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__news_v_version_date_status" AS ENUM('confirmed', 'pending');
  CREATE TYPE "public"."enum__news_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_downloads_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__downloads_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_partner_categories_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__partner_categories_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_partners_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__partners_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_jobs_level" AS ENUM('Executive', 'Manager', 'Senior', 'Mid-level', 'Junior');
  CREATE TYPE "public"."enum_jobs_deadline_status" AS ENUM('confirmed', 'pending');
  CREATE TYPE "public"."enum_jobs_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__jobs_v_version_level" AS ENUM('Executive', 'Manager', 'Senior', 'Mid-level', 'Junior');
  CREATE TYPE "public"."enum__jobs_v_version_deadline_status" AS ENUM('confirmed', 'pending');
  CREATE TYPE "public"."enum__jobs_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_academy_tracks_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__academy_tracks_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_forms_confirmation_type" AS ENUM('message', 'redirect');
  CREATE TYPE "public"."enum_company_executive_roles_holder_status" AS ENUM('confirmed', 'pending');
  CREATE TYPE "public"."enum__company_v_version_executive_roles_holder_status" AS ENUM('confirmed', 'pending');
  CREATE TYPE "public"."enum_careers_content_internship_schedule_status" AS ENUM('confirmed', 'pending');
  CREATE TYPE "public"."enum_careers_content_internship_deadline_status" AS ENUM('confirmed', 'pending');
  CREATE TYPE "public"."enum__careers_content_v_version_internship_schedule_status" AS ENUM('confirmed', 'pending');
  CREATE TYPE "public"."enum__careers_content_v_version_internship_deadline_status" AS ENUM('confirmed', 'pending');
  CREATE TABLE "solutions_blocks_capabilities_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "solutions_blocks_capabilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "solutions_blocks_bands_items_entries" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "solutions_blocks_bands_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"title" varchar
  );
  
  CREATE TABLE "solutions_blocks_bands" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "solutions_blocks_layers_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "solutions_blocks_layers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "solutions_blocks_sectors_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "solutions_blocks_sectors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "solutions_blocks_measures_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "solutions_blocks_measures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "solutions_blocks_steps_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "solutions_blocks_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "solutions_blocks_checklist_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "solutions_blocks_checklist" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"note" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "solutions_blocks_models_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "solutions_blocks_models" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "solutions_outcomes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "solutions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"order" numeric DEFAULT 99,
  	"short" varchar,
  	"blurb" varchar,
  	"accent" varchar DEFAULT '#0888c5',
  	"headline" varchar,
  	"intro" varchar,
  	"lead" varchar,
  	"outcomes_title" varchar,
  	"note" varchar,
  	"experience" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_solutions_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "solutions_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"partners_id" integer,
  	"solutions_id" integer
  );
  
  CREATE TABLE "_solutions_v_blocks_capabilities_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_capabilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_bands_items_entries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_bands_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"title" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_bands" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_layers_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_layers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_sectors_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_sectors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_measures_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_measures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_steps_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_checklist_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_checklist" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"note" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_models_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_models" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_solutions_v_version_outcomes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_order" numeric DEFAULT 99,
  	"version_short" varchar,
  	"version_blurb" varchar,
  	"version_accent" varchar DEFAULT '#0888c5',
  	"version_headline" varchar,
  	"version_intro" varchar,
  	"version_lead" varchar,
  	"version_outcomes_title" varchar,
  	"version_note" varchar,
  	"version_experience" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__solutions_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_solutions_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"partners_id" integer,
  	"solutions_id" integer
  );
  
  CREATE TABLE "services_capabilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "services_checklist" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "services_models" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"order" numeric DEFAULT 99,
  	"short" varchar,
  	"blurb" varchar,
  	"accent" varchar DEFAULT '#056a9a',
  	"headline" varchar,
  	"intro" varchar,
  	"checklist_title" varchar,
  	"models_title" varchar,
  	"fit" varchar,
  	"note" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_services_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "services_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer
  );
  
  CREATE TABLE "_services_v_version_capabilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_checklist" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_models" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_order" numeric DEFAULT 99,
  	"version_short" varchar,
  	"version_blurb" varchar,
  	"version_accent" varchar DEFAULT '#056a9a',
  	"version_headline" varchar,
  	"version_intro" varchar,
  	"version_checklist_title" varchar,
  	"version_models_title" varchar,
  	"version_fit" varchar,
  	"version_note" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__services_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_services_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer
  );
  
  CREATE TABLE "clients" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"order" numeric DEFAULT 99,
  	"sector" "enum_clients_sector",
  	"logo_id" integer,
  	"summary" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_clients_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "clients_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"projects_id" integer,
  	"solutions_id" integer
  );
  
  CREATE TABLE "_clients_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_order" numeric DEFAULT 99,
  	"version_sector" "enum__clients_v_version_sector",
  	"version_logo_id" integer,
  	"version_summary" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__clients_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_clients_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"projects_id" integer,
  	"solutions_id" integer
  );
  
  CREATE TABLE "projects_tech" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "projects_scope" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "projects_delivered" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "projects_outcomes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"client_id" integer,
  	"featured" boolean DEFAULT false,
  	"sector" "enum_projects_sector",
  	"sector_full" varchar,
  	"location" varchar,
  	"year_value" varchar,
  	"year_status" "enum_projects_year_status" DEFAULT 'pending',
  	"year_pending_label" varchar DEFAULT 'Year to confirm',
  	"primary" varchar,
  	"headline" varchar,
  	"summary" varchar,
  	"need" varchar,
  	"technology" varchar,
  	"technology_note" varchar,
  	"training" varchar,
  	"privacy" varchar,
  	"order" numeric DEFAULT 99,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_projects_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "projects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"solutions_id" integer
  );
  
  CREATE TABLE "_projects_v_version_tech" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_scope" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_delivered" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_outcomes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_client_id" integer,
  	"version_featured" boolean DEFAULT false,
  	"version_sector" "enum__projects_v_version_sector",
  	"version_sector_full" varchar,
  	"version_location" varchar,
  	"version_year_value" varchar,
  	"version_year_status" "enum__projects_v_version_year_status" DEFAULT 'pending',
  	"version_year_pending_label" varchar DEFAULT 'Year to confirm',
  	"version_primary" varchar,
  	"version_headline" varchar,
  	"version_summary" varchar,
  	"version_need" varchar,
  	"version_technology" varchar,
  	"version_technology_note" varchar,
  	"version_training" varchar,
  	"version_privacy" varchar,
  	"version_order" numeric DEFAULT 99,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__projects_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_projects_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"solutions_id" integer
  );
  
  CREATE TABLE "events_program" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"starts_on" timestamp(3) with time zone,
  	"ends_on" timestamp(3) with time zone,
  	"display_date" varchar,
  	"category" varchar,
  	"format" "enum_events_format",
  	"venue" varchar,
  	"headline" varchar,
  	"intro" varchar,
  	"audience" varchar,
  	"action" varchar DEFAULT 'Register',
  	"pending_note" varchar,
  	"order" numeric DEFAULT 99,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_events_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_events_v_version_program" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_events_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_starts_on" timestamp(3) with time zone,
  	"version_ends_on" timestamp(3) with time zone,
  	"version_display_date" varchar,
  	"version_category" varchar,
  	"version_format" "enum__events_v_version_format",
  	"version_venue" varchar,
  	"version_headline" varchar,
  	"version_intro" varchar,
  	"version_audience" varchar,
  	"version_action" varchar DEFAULT 'Register',
  	"version_pending_note" varchar,
  	"version_order" numeric DEFAULT 99,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__events_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "post_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"label" varchar,
  	"order" numeric DEFAULT 99,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_post_categories_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_post_categories_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_key" varchar,
  	"version_label" varchar,
  	"version_order" numeric DEFAULT 99,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__post_categories_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"order" numeric DEFAULT 99,
  	"category_id" integer,
  	"body" jsonb,
  	"target_id" integer,
  	"anchor" varchar,
  	"read_more_label" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_order" numeric DEFAULT 99,
  	"version_category_id" integer,
  	"version_body" jsonb,
  	"version_target_id" integer,
  	"version_anchor" varchar,
  	"version_read_more_label" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "news" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"kind" varchar,
  	"date_value" varchar,
  	"date_status" "enum_news_date_status" DEFAULT 'pending',
  	"date_pending_label" varchar DEFAULT 'Date to confirm',
  	"archive" boolean DEFAULT false,
  	"standfirst" varchar,
  	"body" jsonb,
  	"order" numeric DEFAULT 99,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_news_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_news_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_kind" varchar,
  	"version_date_value" varchar,
  	"version_date_status" "enum__news_v_version_date_status" DEFAULT 'pending',
  	"version_date_pending_label" varchar DEFAULT 'Date to confirm',
  	"version_archive" boolean DEFAULT false,
  	"version_standfirst" varchar,
  	"version_body" jsonb,
  	"version_order" numeric DEFAULT 99,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__news_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "downloads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"order" numeric DEFAULT 99,
  	"category" varchar,
  	"owner" varchar,
  	"meta" varchar,
  	"note" varchar,
  	"file_id" integer,
  	"approved" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_downloads_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_downloads_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_order" numeric DEFAULT 99,
  	"version_category" varchar,
  	"version_owner" varchar,
  	"version_meta" varchar,
  	"version_note" varchar,
  	"version_file_id" integer,
  	"version_approved" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__downloads_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "partner_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"label" varchar,
  	"ring_label" varchar,
  	"description" varchar,
  	"order" numeric DEFAULT 99,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_partner_categories_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_partner_categories_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_key" varchar,
  	"version_label" varchar,
  	"version_ring_label" varchar,
  	"version_description" varchar,
  	"version_order" numeric DEFAULT 99,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__partner_categories_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "partners" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"order" numeric DEFAULT 99,
  	"logo_id" integer,
  	"featured" boolean DEFAULT false,
  	"capability" varchar,
  	"solution_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_partners_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "partners_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"partner_categories_id" integer,
  	"projects_id" integer
  );
  
  CREATE TABLE "_partners_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_order" numeric DEFAULT 99,
  	"version_logo_id" integer,
  	"version_featured" boolean DEFAULT false,
  	"version_capability" varchar,
  	"version_solution_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__partners_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_partners_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"partner_categories_id" integer,
  	"projects_id" integer
  );
  
  CREATE TABLE "jobs_responsibilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "jobs_required" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "jobs_preferred" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"department" varchar,
  	"level" "enum_jobs_level",
  	"reports" varchar,
  	"type" varchar,
  	"status" varchar DEFAULT 'Open',
  	"location" varchar,
  	"deadline_value" varchar,
  	"deadline_status" "enum_jobs_deadline_status" DEFAULT 'pending',
  	"deadline_pending_label" varchar DEFAULT 'Deadline to be confirmed',
  	"purpose_title" varchar,
  	"purpose" varchar,
  	"scope" varchar,
  	"success" varchar,
  	"order" numeric DEFAULT 99,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_jobs_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_jobs_v_version_responsibilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_jobs_v_version_required" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_jobs_v_version_preferred" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_jobs_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_department" varchar,
  	"version_level" "enum__jobs_v_version_level",
  	"version_reports" varchar,
  	"version_type" varchar,
  	"version_status" varchar DEFAULT 'Open',
  	"version_location" varchar,
  	"version_deadline_value" varchar,
  	"version_deadline_status" "enum__jobs_v_version_deadline_status" DEFAULT 'pending',
  	"version_deadline_pending_label" varchar DEFAULT 'Deadline to be confirmed',
  	"version_purpose_title" varchar,
  	"version_purpose" varchar,
  	"version_scope" varchar,
  	"version_success" varchar,
  	"version_order" numeric DEFAULT 99,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__jobs_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "academy_tracks" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"order" numeric DEFAULT 99,
  	"body" varchar,
  	"solution_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_academy_tracks_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_academy_tracks_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_order" numeric DEFAULT 99,
  	"version_body" varchar,
  	"version_solution_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__academy_tracks_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"credit" varchar,
  	"provenance_source" varchar,
  	"provenance_retrieved_at" timestamp(3) with time zone,
  	"provenance_reviewed_by" varchar,
  	"approved" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_wide_url" varchar,
  	"sizes_wide_width" numeric,
  	"sizes_wide_height" numeric,
  	"sizes_wide_mime_type" varchar,
  	"sizes_wide_filesize" numeric,
  	"sizes_wide_filename" varchar
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "forms_blocks_checkbox" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"default_value" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_country" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_email" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_message" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"message" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_number" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_select_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"placeholder" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_state" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_textarea" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_emails" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email_to" varchar,
  	"cc" varchar,
  	"bcc" varchar,
  	"reply_to" varchar,
  	"email_from" varchar,
  	"subject" varchar DEFAULT 'You''ve received a new message.' NOT NULL,
  	"message" jsonb
  );
  
  CREATE TABLE "forms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"submit_button_label" varchar,
  	"confirmation_type" "enum_forms_confirmation_type" DEFAULT 'message',
  	"confirmation_message" jsonb,
  	"redirect_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "form_submissions_submission_data" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "form_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"solutions_id" integer,
  	"services_id" integer,
  	"clients_id" integer,
  	"projects_id" integer,
  	"events_id" integer,
  	"post_categories_id" integer,
  	"posts_id" integer,
  	"news_id" integer,
  	"downloads_id" integer,
  	"partner_categories_id" integer,
  	"partners_id" integer,
  	"jobs_id" integer,
  	"academy_tracks_id" integer,
  	"media_id" integer,
  	"users_id" integer,
  	"forms_id" integer,
  	"form_submissions_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_nav" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_impact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"figure" varchar NOT NULL,
  	"unit" varchar NOT NULL,
  	"line" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"header_cta_label" varchar DEFAULT 'Contact us' NOT NULL,
  	"header_cta_href" varchar DEFAULT '/contact' NOT NULL,
  	"contact_phone" varchar,
  	"contact_secondary_phone" varchar,
  	"contact_email" varchar,
  	"contact_address" varchar,
  	"contact_map_url" varchar,
  	"contact_verified" boolean DEFAULT false,
  	"footer_note" varchar,
  	"impact_support" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "company_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "company_journey" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"when" varchar NOT NULL,
  	"what" varchar NOT NULL
  );
  
  CREATE TABLE "company_differentiators" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "company_delivery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "company_industries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "company_sustainability" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "company_executive_roles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"holder_value" varchar,
  	"holder_status" "enum_company_executive_roles_holder_status" DEFAULT 'pending' NOT NULL,
  	"holder_pending_label" varchar DEFAULT 'Name and biography pending'
  );
  
  CREATE TABLE "company" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"legal_name" varchar NOT NULL,
  	"short_name" varchar NOT NULL,
  	"domain" varchar NOT NULL,
  	"established" varchar NOT NULL,
  	"positioning" varchar NOT NULL,
  	"mission" varchar NOT NULL,
  	"mission_body" varchar NOT NULL,
  	"vision" varchar NOT NULL,
  	"vision_body" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_company_v_version_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_company_v_version_journey" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"when" varchar NOT NULL,
  	"what" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_company_v_version_differentiators" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_company_v_version_delivery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_company_v_version_industries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_company_v_version_sustainability" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_company_v_version_executive_roles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"holder_value" varchar,
  	"holder_status" "enum__company_v_version_executive_roles_holder_status" DEFAULT 'pending' NOT NULL,
  	"holder_pending_label" varchar DEFAULT 'Name and biography pending',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_company_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_legal_name" varchar NOT NULL,
  	"version_short_name" varchar NOT NULL,
  	"version_domain" varchar NOT NULL,
  	"version_established" varchar NOT NULL,
  	"version_positioning" varchar NOT NULL,
  	"version_mission" varchar NOT NULL,
  	"version_mission_body" varchar NOT NULL,
  	"version_vision" varchar NOT NULL,
  	"version_vision_body" varchar NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "contact_details_office" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"line" varchar NOT NULL
  );
  
  CREATE TABLE "contact_details_phones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL,
  	"tel" varchar NOT NULL
  );
  
  CREATE TABLE "contact_details_emails" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "contact_details_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"days" varchar NOT NULL,
  	"hours" varchar NOT NULL
  );
  
  CREATE TABLE "contact_details_inquiry_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"prompt" varchar NOT NULL,
  	"route" varchar NOT NULL
  );
  
  CREATE TABLE "contact_details" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"map_url" varchar,
  	"whatsapp" varchar,
  	"emergency" varchar,
  	"response" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_contact_details_v_version_office" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"line" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_contact_details_v_version_phones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL,
  	"tel" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_contact_details_v_version_emails" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_contact_details_v_version_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"days" varchar NOT NULL,
  	"hours" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_contact_details_v_version_inquiry_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"prompt" varchar NOT NULL,
  	"route" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_contact_details_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_map_url" varchar,
  	"version_whatsapp" varchar,
  	"version_emergency" varchar,
  	"version_response" varchar NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "careers_content_pathways" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "careers_content_culture" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "careers_content_development" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL
  );
  
  CREATE TABLE "careers_content_experience_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL
  );
  
  CREATE TABLE "careers_content_application_docs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL
  );
  
  CREATE TABLE "careers_content_internship_tracks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "careers_content_internship_eligibility" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL
  );
  
  CREATE TABLE "careers_content_internship_documents" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL
  );
  
  CREATE TABLE "careers_content_internship_structure" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "careers_content_internship_selection" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"n" numeric NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "careers_content_academy_audiences" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"action" varchar NOT NULL
  );
  
  CREATE TABLE "careers_content_academy_levels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL
  );
  
  CREATE TABLE "careers_content_academy_delivery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL
  );
  
  CREATE TABLE "careers_content_course_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "careers_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"internship_title" varchar NOT NULL,
  	"internship_type" varchar NOT NULL,
  	"internship_location" varchar NOT NULL,
  	"internship_schedule_value" varchar,
  	"internship_schedule_status" "enum_careers_content_internship_schedule_status" DEFAULT 'pending' NOT NULL,
  	"internship_schedule_pending_label" varchar DEFAULT 'Dates to be confirmed',
  	"internship_deadline_value" varchar,
  	"internship_deadline_status" "enum_careers_content_internship_deadline_status" DEFAULT 'pending' NOT NULL,
  	"internship_deadline_pending_label" varchar DEFAULT 'Deadline to be confirmed',
  	"internship_intro" varchar NOT NULL,
  	"internship_caveat" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_careers_content_v_version_pathways" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_careers_content_v_version_culture" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_careers_content_v_version_development" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_careers_content_v_version_experience_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_careers_content_v_version_application_docs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_careers_content_v_version_internship_tracks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_careers_content_v_version_internship_eligibility" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_careers_content_v_version_internship_documents" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_careers_content_v_version_internship_structure" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_careers_content_v_version_internship_selection" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"n" numeric NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_careers_content_v_version_academy_audiences" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"action" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_careers_content_v_version_academy_levels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_careers_content_v_version_academy_delivery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_careers_content_v_version_course_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_careers_content_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_internship_title" varchar NOT NULL,
  	"version_internship_type" varchar NOT NULL,
  	"version_internship_location" varchar NOT NULL,
  	"version_internship_schedule_value" varchar,
  	"version_internship_schedule_status" "enum__careers_content_v_version_internship_schedule_status" DEFAULT 'pending' NOT NULL,
  	"version_internship_schedule_pending_label" varchar DEFAULT 'Dates to be confirmed',
  	"version_internship_deadline_value" varchar,
  	"version_internship_deadline_status" "enum__careers_content_v_version_internship_deadline_status" DEFAULT 'pending' NOT NULL,
  	"version_internship_deadline_pending_label" varchar DEFAULT 'Deadline to be confirmed',
  	"version_internship_intro" varchar NOT NULL,
  	"version_internship_caveat" varchar NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "page_copy_home_priorities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "page_copy_solutions_priorities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "page_copy_solutions_framework" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "page_copy_resource_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "page_copy" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"home_hero_eyebrow" varchar NOT NULL,
  	"home_hero_title" varchar NOT NULL,
  	"home_hero_intro" varchar NOT NULL,
  	"home_hero_intro_secondary" varchar NOT NULL,
  	"solutions_hero_eyebrow" varchar NOT NULL,
  	"solutions_hero_title" varchar NOT NULL,
  	"solutions_hero_intro" varchar NOT NULL,
  	"about_hero_eyebrow" varchar NOT NULL,
  	"about_hero_title" varchar NOT NULL,
  	"about_hero_intro" varchar NOT NULL,
  	"services_hero_eyebrow" varchar NOT NULL,
  	"services_hero_title" varchar NOT NULL,
  	"services_hero_intro" varchar NOT NULL,
  	"clients_hero_eyebrow" varchar NOT NULL,
  	"clients_hero_title" varchar NOT NULL,
  	"clients_hero_intro" varchar NOT NULL,
  	"partners_hero_eyebrow" varchar NOT NULL,
  	"partners_hero_title" varchar NOT NULL,
  	"partners_hero_intro" varchar NOT NULL,
  	"resources_hero_eyebrow" varchar NOT NULL,
  	"resources_hero_title" varchar NOT NULL,
  	"resources_hero_intro" varchar NOT NULL,
  	"project_implementation_note" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_page_copy_v_version_home_priorities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_page_copy_v_version_solutions_priorities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_page_copy_v_version_solutions_framework" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_page_copy_v_version_resource_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_page_copy_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_home_hero_eyebrow" varchar NOT NULL,
  	"version_home_hero_title" varchar NOT NULL,
  	"version_home_hero_intro" varchar NOT NULL,
  	"version_home_hero_intro_secondary" varchar NOT NULL,
  	"version_solutions_hero_eyebrow" varchar NOT NULL,
  	"version_solutions_hero_title" varchar NOT NULL,
  	"version_solutions_hero_intro" varchar NOT NULL,
  	"version_about_hero_eyebrow" varchar NOT NULL,
  	"version_about_hero_title" varchar NOT NULL,
  	"version_about_hero_intro" varchar NOT NULL,
  	"version_services_hero_eyebrow" varchar NOT NULL,
  	"version_services_hero_title" varchar NOT NULL,
  	"version_services_hero_intro" varchar NOT NULL,
  	"version_clients_hero_eyebrow" varchar NOT NULL,
  	"version_clients_hero_title" varchar NOT NULL,
  	"version_clients_hero_intro" varchar NOT NULL,
  	"version_partners_hero_eyebrow" varchar NOT NULL,
  	"version_partners_hero_title" varchar NOT NULL,
  	"version_partners_hero_intro" varchar NOT NULL,
  	"version_resources_hero_eyebrow" varchar NOT NULL,
  	"version_resources_hero_title" varchar NOT NULL,
  	"version_resources_hero_intro" varchar NOT NULL,
  	"version_project_implementation_note" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "solutions_blocks_capabilities_items" ADD CONSTRAINT "solutions_blocks_capabilities_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_capabilities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_capabilities" ADD CONSTRAINT "solutions_blocks_capabilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_bands_items_entries" ADD CONSTRAINT "solutions_blocks_bands_items_entries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_bands_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_bands_items" ADD CONSTRAINT "solutions_blocks_bands_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_bands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_bands" ADD CONSTRAINT "solutions_blocks_bands_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_layers_items" ADD CONSTRAINT "solutions_blocks_layers_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_layers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_layers" ADD CONSTRAINT "solutions_blocks_layers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_sectors_items" ADD CONSTRAINT "solutions_blocks_sectors_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_sectors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_sectors" ADD CONSTRAINT "solutions_blocks_sectors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_measures_items" ADD CONSTRAINT "solutions_blocks_measures_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_measures"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_measures" ADD CONSTRAINT "solutions_blocks_measures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_steps_items" ADD CONSTRAINT "solutions_blocks_steps_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_steps" ADD CONSTRAINT "solutions_blocks_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_checklist_items" ADD CONSTRAINT "solutions_blocks_checklist_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_checklist"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_checklist" ADD CONSTRAINT "solutions_blocks_checklist_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_models_items" ADD CONSTRAINT "solutions_blocks_models_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_models"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_models" ADD CONSTRAINT "solutions_blocks_models_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_outcomes" ADD CONSTRAINT "solutions_outcomes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions" ADD CONSTRAINT "solutions_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solutions_rels" ADD CONSTRAINT "solutions_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_rels" ADD CONSTRAINT "solutions_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_rels" ADD CONSTRAINT "solutions_rels_solutions_fk" FOREIGN KEY ("solutions_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_capabilities_items" ADD CONSTRAINT "_solutions_v_blocks_capabilities_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_capabilities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_capabilities" ADD CONSTRAINT "_solutions_v_blocks_capabilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_bands_items_entries" ADD CONSTRAINT "_solutions_v_blocks_bands_items_entries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_bands_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_bands_items" ADD CONSTRAINT "_solutions_v_blocks_bands_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_bands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_bands" ADD CONSTRAINT "_solutions_v_blocks_bands_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_layers_items" ADD CONSTRAINT "_solutions_v_blocks_layers_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_layers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_layers" ADD CONSTRAINT "_solutions_v_blocks_layers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_sectors_items" ADD CONSTRAINT "_solutions_v_blocks_sectors_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_sectors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_sectors" ADD CONSTRAINT "_solutions_v_blocks_sectors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_measures_items" ADD CONSTRAINT "_solutions_v_blocks_measures_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_measures"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_measures" ADD CONSTRAINT "_solutions_v_blocks_measures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_steps_items" ADD CONSTRAINT "_solutions_v_blocks_steps_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_steps" ADD CONSTRAINT "_solutions_v_blocks_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_checklist_items" ADD CONSTRAINT "_solutions_v_blocks_checklist_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_checklist"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_checklist" ADD CONSTRAINT "_solutions_v_blocks_checklist_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_models_items" ADD CONSTRAINT "_solutions_v_blocks_models_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_models"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_models" ADD CONSTRAINT "_solutions_v_blocks_models_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_version_outcomes" ADD CONSTRAINT "_solutions_v_version_outcomes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v" ADD CONSTRAINT "_solutions_v_parent_id_solutions_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."solutions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solutions_v" ADD CONSTRAINT "_solutions_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solutions_v_rels" ADD CONSTRAINT "_solutions_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_rels" ADD CONSTRAINT "_solutions_v_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_rels" ADD CONSTRAINT "_solutions_v_rels_solutions_fk" FOREIGN KEY ("solutions_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_capabilities" ADD CONSTRAINT "services_capabilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_checklist" ADD CONSTRAINT "services_checklist_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_models" ADD CONSTRAINT "services_models_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_capabilities" ADD CONSTRAINT "_services_v_version_capabilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_checklist" ADD CONSTRAINT "_services_v_version_checklist_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_models" ADD CONSTRAINT "_services_v_version_models_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_parent_id_services_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v_rels" ADD CONSTRAINT "_services_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_rels" ADD CONSTRAINT "_services_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clients" ADD CONSTRAINT "clients_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "clients_rels" ADD CONSTRAINT "clients_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clients_rels" ADD CONSTRAINT "clients_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clients_rels" ADD CONSTRAINT "clients_rels_solutions_fk" FOREIGN KEY ("solutions_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_clients_v" ADD CONSTRAINT "_clients_v_parent_id_clients_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_clients_v" ADD CONSTRAINT "_clients_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_clients_v_rels" ADD CONSTRAINT "_clients_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_clients_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_clients_v_rels" ADD CONSTRAINT "_clients_v_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_clients_v_rels" ADD CONSTRAINT "_clients_v_rels_solutions_fk" FOREIGN KEY ("solutions_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_tech" ADD CONSTRAINT "projects_tech_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_scope" ADD CONSTRAINT "projects_scope_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_delivered" ADD CONSTRAINT "projects_delivered_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_outcomes" ADD CONSTRAINT "projects_outcomes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_solutions_fk" FOREIGN KEY ("solutions_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_tech" ADD CONSTRAINT "_projects_v_version_tech_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_scope" ADD CONSTRAINT "_projects_v_version_scope_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_delivered" ADD CONSTRAINT "_projects_v_version_delivered_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_outcomes" ADD CONSTRAINT "_projects_v_version_outcomes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_parent_id_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_client_id_clients_id_fk" FOREIGN KEY ("version_client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_solutions_fk" FOREIGN KEY ("solutions_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_program" ADD CONSTRAINT "events_program_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v_version_program" ADD CONSTRAINT "_events_v_version_program_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_parent_id_events_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_post_categories_v" ADD CONSTRAINT "_post_categories_v_parent_id_post_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."post_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_post_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."post_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_target_id_solutions_id_fk" FOREIGN KEY ("target_id") REFERENCES "public"."solutions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_category_id_post_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."post_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_target_id_solutions_id_fk" FOREIGN KEY ("version_target_id") REFERENCES "public"."solutions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_parent_id_news_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."news"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "downloads" ADD CONSTRAINT "downloads_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_downloads_v" ADD CONSTRAINT "_downloads_v_parent_id_downloads_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."downloads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_downloads_v" ADD CONSTRAINT "_downloads_v_version_file_id_media_id_fk" FOREIGN KEY ("version_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_partner_categories_v" ADD CONSTRAINT "_partner_categories_v_parent_id_partner_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."partner_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners" ADD CONSTRAINT "partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners" ADD CONSTRAINT "partners_solution_id_solutions_id_fk" FOREIGN KEY ("solution_id") REFERENCES "public"."solutions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners_rels" ADD CONSTRAINT "partners_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_rels" ADD CONSTRAINT "partners_rels_partner_categories_fk" FOREIGN KEY ("partner_categories_id") REFERENCES "public"."partner_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_rels" ADD CONSTRAINT "partners_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_partners_v" ADD CONSTRAINT "_partners_v_parent_id_partners_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."partners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_partners_v" ADD CONSTRAINT "_partners_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_partners_v" ADD CONSTRAINT "_partners_v_version_solution_id_solutions_id_fk" FOREIGN KEY ("version_solution_id") REFERENCES "public"."solutions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_partners_v_rels" ADD CONSTRAINT "_partners_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_partners_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_partners_v_rels" ADD CONSTRAINT "_partners_v_rels_partner_categories_fk" FOREIGN KEY ("partner_categories_id") REFERENCES "public"."partner_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_partners_v_rels" ADD CONSTRAINT "_partners_v_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_responsibilities" ADD CONSTRAINT "jobs_responsibilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_required" ADD CONSTRAINT "jobs_required_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_preferred" ADD CONSTRAINT "jobs_preferred_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs" ADD CONSTRAINT "jobs_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_jobs_v_version_responsibilities" ADD CONSTRAINT "_jobs_v_version_responsibilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_jobs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_jobs_v_version_required" ADD CONSTRAINT "_jobs_v_version_required_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_jobs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_jobs_v_version_preferred" ADD CONSTRAINT "_jobs_v_version_preferred_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_jobs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_jobs_v" ADD CONSTRAINT "_jobs_v_parent_id_jobs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."jobs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_jobs_v" ADD CONSTRAINT "_jobs_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "academy_tracks" ADD CONSTRAINT "academy_tracks_solution_id_solutions_id_fk" FOREIGN KEY ("solution_id") REFERENCES "public"."solutions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_academy_tracks_v" ADD CONSTRAINT "_academy_tracks_v_parent_id_academy_tracks_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."academy_tracks"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_academy_tracks_v" ADD CONSTRAINT "_academy_tracks_v_version_solution_id_solutions_id_fk" FOREIGN KEY ("version_solution_id") REFERENCES "public"."solutions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox" ADD CONSTRAINT "forms_blocks_checkbox_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_country" ADD CONSTRAINT "forms_blocks_country_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_email" ADD CONSTRAINT "forms_blocks_email_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_message" ADD CONSTRAINT "forms_blocks_message_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_number" ADD CONSTRAINT "forms_blocks_number_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_options" ADD CONSTRAINT "forms_blocks_select_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select" ADD CONSTRAINT "forms_blocks_select_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_state" ADD CONSTRAINT "forms_blocks_state_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_text" ADD CONSTRAINT "forms_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_textarea" ADD CONSTRAINT "forms_blocks_textarea_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_emails" ADD CONSTRAINT "forms_emails_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions_submission_data" ADD CONSTRAINT "form_submissions_submission_data_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_solutions_fk" FOREIGN KEY ("solutions_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_clients_fk" FOREIGN KEY ("clients_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_post_categories_fk" FOREIGN KEY ("post_categories_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_downloads_fk" FOREIGN KEY ("downloads_id") REFERENCES "public"."downloads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partner_categories_fk" FOREIGN KEY ("partner_categories_id") REFERENCES "public"."partner_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_jobs_fk" FOREIGN KEY ("jobs_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_academy_tracks_fk" FOREIGN KEY ("academy_tracks_id") REFERENCES "public"."academy_tracks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forms_fk" FOREIGN KEY ("forms_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_nav" ADD CONSTRAINT "site_settings_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_social" ADD CONSTRAINT "site_settings_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_impact" ADD CONSTRAINT "site_settings_impact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "company_values" ADD CONSTRAINT "company_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "company_journey" ADD CONSTRAINT "company_journey_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "company_differentiators" ADD CONSTRAINT "company_differentiators_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "company_delivery" ADD CONSTRAINT "company_delivery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "company_industries" ADD CONSTRAINT "company_industries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "company_sustainability" ADD CONSTRAINT "company_sustainability_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "company_executive_roles" ADD CONSTRAINT "company_executive_roles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_company_v_version_values" ADD CONSTRAINT "_company_v_version_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_company_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_company_v_version_journey" ADD CONSTRAINT "_company_v_version_journey_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_company_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_company_v_version_differentiators" ADD CONSTRAINT "_company_v_version_differentiators_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_company_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_company_v_version_delivery" ADD CONSTRAINT "_company_v_version_delivery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_company_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_company_v_version_industries" ADD CONSTRAINT "_company_v_version_industries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_company_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_company_v_version_sustainability" ADD CONSTRAINT "_company_v_version_sustainability_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_company_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_company_v_version_executive_roles" ADD CONSTRAINT "_company_v_version_executive_roles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_company_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_details_office" ADD CONSTRAINT "contact_details_office_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_details"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_details_phones" ADD CONSTRAINT "contact_details_phones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_details"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_details_emails" ADD CONSTRAINT "contact_details_emails_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_details"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_details_hours" ADD CONSTRAINT "contact_details_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_details"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_details_inquiry_categories" ADD CONSTRAINT "contact_details_inquiry_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_details"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contact_details_v_version_office" ADD CONSTRAINT "_contact_details_v_version_office_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contact_details_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contact_details_v_version_phones" ADD CONSTRAINT "_contact_details_v_version_phones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contact_details_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contact_details_v_version_emails" ADD CONSTRAINT "_contact_details_v_version_emails_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contact_details_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contact_details_v_version_hours" ADD CONSTRAINT "_contact_details_v_version_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contact_details_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contact_details_v_version_inquiry_categories" ADD CONSTRAINT "_contact_details_v_version_inquiry_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contact_details_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "careers_content_pathways" ADD CONSTRAINT "careers_content_pathways_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."careers_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "careers_content_culture" ADD CONSTRAINT "careers_content_culture_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."careers_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "careers_content_development" ADD CONSTRAINT "careers_content_development_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."careers_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "careers_content_experience_points" ADD CONSTRAINT "careers_content_experience_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."careers_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "careers_content_application_docs" ADD CONSTRAINT "careers_content_application_docs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."careers_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "careers_content_internship_tracks" ADD CONSTRAINT "careers_content_internship_tracks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."careers_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "careers_content_internship_eligibility" ADD CONSTRAINT "careers_content_internship_eligibility_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."careers_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "careers_content_internship_documents" ADD CONSTRAINT "careers_content_internship_documents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."careers_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "careers_content_internship_structure" ADD CONSTRAINT "careers_content_internship_structure_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."careers_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "careers_content_internship_selection" ADD CONSTRAINT "careers_content_internship_selection_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."careers_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "careers_content_academy_audiences" ADD CONSTRAINT "careers_content_academy_audiences_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."careers_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "careers_content_academy_levels" ADD CONSTRAINT "careers_content_academy_levels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."careers_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "careers_content_academy_delivery" ADD CONSTRAINT "careers_content_academy_delivery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."careers_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "careers_content_course_sections" ADD CONSTRAINT "careers_content_course_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."careers_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_careers_content_v_version_pathways" ADD CONSTRAINT "_careers_content_v_version_pathways_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_careers_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_careers_content_v_version_culture" ADD CONSTRAINT "_careers_content_v_version_culture_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_careers_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_careers_content_v_version_development" ADD CONSTRAINT "_careers_content_v_version_development_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_careers_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_careers_content_v_version_experience_points" ADD CONSTRAINT "_careers_content_v_version_experience_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_careers_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_careers_content_v_version_application_docs" ADD CONSTRAINT "_careers_content_v_version_application_docs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_careers_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_careers_content_v_version_internship_tracks" ADD CONSTRAINT "_careers_content_v_version_internship_tracks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_careers_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_careers_content_v_version_internship_eligibility" ADD CONSTRAINT "_careers_content_v_version_internship_eligibility_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_careers_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_careers_content_v_version_internship_documents" ADD CONSTRAINT "_careers_content_v_version_internship_documents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_careers_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_careers_content_v_version_internship_structure" ADD CONSTRAINT "_careers_content_v_version_internship_structure_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_careers_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_careers_content_v_version_internship_selection" ADD CONSTRAINT "_careers_content_v_version_internship_selection_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_careers_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_careers_content_v_version_academy_audiences" ADD CONSTRAINT "_careers_content_v_version_academy_audiences_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_careers_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_careers_content_v_version_academy_levels" ADD CONSTRAINT "_careers_content_v_version_academy_levels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_careers_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_careers_content_v_version_academy_delivery" ADD CONSTRAINT "_careers_content_v_version_academy_delivery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_careers_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_careers_content_v_version_course_sections" ADD CONSTRAINT "_careers_content_v_version_course_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_careers_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_copy_home_priorities" ADD CONSTRAINT "page_copy_home_priorities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_copy"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_copy_solutions_priorities" ADD CONSTRAINT "page_copy_solutions_priorities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_copy"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_copy_solutions_framework" ADD CONSTRAINT "page_copy_solutions_framework_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_copy"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_copy_resource_sections" ADD CONSTRAINT "page_copy_resource_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_copy"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_copy_v_version_home_priorities" ADD CONSTRAINT "_page_copy_v_version_home_priorities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_copy_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_copy_v_version_solutions_priorities" ADD CONSTRAINT "_page_copy_v_version_solutions_priorities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_copy_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_copy_v_version_solutions_framework" ADD CONSTRAINT "_page_copy_v_version_solutions_framework_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_copy_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_copy_v_version_resource_sections" ADD CONSTRAINT "_page_copy_v_version_resource_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_copy_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "solutions_blocks_capabilities_items_order_idx" ON "solutions_blocks_capabilities_items" USING btree ("_order");
  CREATE INDEX "solutions_blocks_capabilities_items_parent_id_idx" ON "solutions_blocks_capabilities_items" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_capabilities_order_idx" ON "solutions_blocks_capabilities" USING btree ("_order");
  CREATE INDEX "solutions_blocks_capabilities_parent_id_idx" ON "solutions_blocks_capabilities" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_capabilities_path_idx" ON "solutions_blocks_capabilities" USING btree ("_path");
  CREATE INDEX "solutions_blocks_bands_items_entries_order_idx" ON "solutions_blocks_bands_items_entries" USING btree ("_order");
  CREATE INDEX "solutions_blocks_bands_items_entries_parent_id_idx" ON "solutions_blocks_bands_items_entries" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_bands_items_order_idx" ON "solutions_blocks_bands_items" USING btree ("_order");
  CREATE INDEX "solutions_blocks_bands_items_parent_id_idx" ON "solutions_blocks_bands_items" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_bands_order_idx" ON "solutions_blocks_bands" USING btree ("_order");
  CREATE INDEX "solutions_blocks_bands_parent_id_idx" ON "solutions_blocks_bands" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_bands_path_idx" ON "solutions_blocks_bands" USING btree ("_path");
  CREATE INDEX "solutions_blocks_layers_items_order_idx" ON "solutions_blocks_layers_items" USING btree ("_order");
  CREATE INDEX "solutions_blocks_layers_items_parent_id_idx" ON "solutions_blocks_layers_items" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_layers_order_idx" ON "solutions_blocks_layers" USING btree ("_order");
  CREATE INDEX "solutions_blocks_layers_parent_id_idx" ON "solutions_blocks_layers" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_layers_path_idx" ON "solutions_blocks_layers" USING btree ("_path");
  CREATE INDEX "solutions_blocks_sectors_items_order_idx" ON "solutions_blocks_sectors_items" USING btree ("_order");
  CREATE INDEX "solutions_blocks_sectors_items_parent_id_idx" ON "solutions_blocks_sectors_items" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_sectors_order_idx" ON "solutions_blocks_sectors" USING btree ("_order");
  CREATE INDEX "solutions_blocks_sectors_parent_id_idx" ON "solutions_blocks_sectors" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_sectors_path_idx" ON "solutions_blocks_sectors" USING btree ("_path");
  CREATE INDEX "solutions_blocks_measures_items_order_idx" ON "solutions_blocks_measures_items" USING btree ("_order");
  CREATE INDEX "solutions_blocks_measures_items_parent_id_idx" ON "solutions_blocks_measures_items" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_measures_order_idx" ON "solutions_blocks_measures" USING btree ("_order");
  CREATE INDEX "solutions_blocks_measures_parent_id_idx" ON "solutions_blocks_measures" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_measures_path_idx" ON "solutions_blocks_measures" USING btree ("_path");
  CREATE INDEX "solutions_blocks_steps_items_order_idx" ON "solutions_blocks_steps_items" USING btree ("_order");
  CREATE INDEX "solutions_blocks_steps_items_parent_id_idx" ON "solutions_blocks_steps_items" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_steps_order_idx" ON "solutions_blocks_steps" USING btree ("_order");
  CREATE INDEX "solutions_blocks_steps_parent_id_idx" ON "solutions_blocks_steps" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_steps_path_idx" ON "solutions_blocks_steps" USING btree ("_path");
  CREATE INDEX "solutions_blocks_checklist_items_order_idx" ON "solutions_blocks_checklist_items" USING btree ("_order");
  CREATE INDEX "solutions_blocks_checklist_items_parent_id_idx" ON "solutions_blocks_checklist_items" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_checklist_order_idx" ON "solutions_blocks_checklist" USING btree ("_order");
  CREATE INDEX "solutions_blocks_checklist_parent_id_idx" ON "solutions_blocks_checklist" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_checklist_path_idx" ON "solutions_blocks_checklist" USING btree ("_path");
  CREATE INDEX "solutions_blocks_models_items_order_idx" ON "solutions_blocks_models_items" USING btree ("_order");
  CREATE INDEX "solutions_blocks_models_items_parent_id_idx" ON "solutions_blocks_models_items" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_models_order_idx" ON "solutions_blocks_models" USING btree ("_order");
  CREATE INDEX "solutions_blocks_models_parent_id_idx" ON "solutions_blocks_models" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_models_path_idx" ON "solutions_blocks_models" USING btree ("_path");
  CREATE INDEX "solutions_outcomes_order_idx" ON "solutions_outcomes" USING btree ("_order");
  CREATE INDEX "solutions_outcomes_parent_id_idx" ON "solutions_outcomes" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solutions_slug_idx" ON "solutions" USING btree ("slug");
  CREATE INDEX "solutions_meta_meta_image_idx" ON "solutions" USING btree ("meta_image_id");
  CREATE INDEX "solutions_updated_at_idx" ON "solutions" USING btree ("updated_at");
  CREATE INDEX "solutions_created_at_idx" ON "solutions" USING btree ("created_at");
  CREATE INDEX "solutions__status_idx" ON "solutions" USING btree ("_status");
  CREATE INDEX "solutions_rels_order_idx" ON "solutions_rels" USING btree ("order");
  CREATE INDEX "solutions_rels_parent_idx" ON "solutions_rels" USING btree ("parent_id");
  CREATE INDEX "solutions_rels_path_idx" ON "solutions_rels" USING btree ("path");
  CREATE INDEX "solutions_rels_partners_id_idx" ON "solutions_rels" USING btree ("partners_id");
  CREATE INDEX "solutions_rels_solutions_id_idx" ON "solutions_rels" USING btree ("solutions_id");
  CREATE INDEX "_solutions_v_blocks_capabilities_items_order_idx" ON "_solutions_v_blocks_capabilities_items" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_capabilities_items_parent_id_idx" ON "_solutions_v_blocks_capabilities_items" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_capabilities_order_idx" ON "_solutions_v_blocks_capabilities" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_capabilities_parent_id_idx" ON "_solutions_v_blocks_capabilities" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_capabilities_path_idx" ON "_solutions_v_blocks_capabilities" USING btree ("_path");
  CREATE INDEX "_solutions_v_blocks_bands_items_entries_order_idx" ON "_solutions_v_blocks_bands_items_entries" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_bands_items_entries_parent_id_idx" ON "_solutions_v_blocks_bands_items_entries" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_bands_items_order_idx" ON "_solutions_v_blocks_bands_items" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_bands_items_parent_id_idx" ON "_solutions_v_blocks_bands_items" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_bands_order_idx" ON "_solutions_v_blocks_bands" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_bands_parent_id_idx" ON "_solutions_v_blocks_bands" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_bands_path_idx" ON "_solutions_v_blocks_bands" USING btree ("_path");
  CREATE INDEX "_solutions_v_blocks_layers_items_order_idx" ON "_solutions_v_blocks_layers_items" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_layers_items_parent_id_idx" ON "_solutions_v_blocks_layers_items" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_layers_order_idx" ON "_solutions_v_blocks_layers" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_layers_parent_id_idx" ON "_solutions_v_blocks_layers" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_layers_path_idx" ON "_solutions_v_blocks_layers" USING btree ("_path");
  CREATE INDEX "_solutions_v_blocks_sectors_items_order_idx" ON "_solutions_v_blocks_sectors_items" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_sectors_items_parent_id_idx" ON "_solutions_v_blocks_sectors_items" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_sectors_order_idx" ON "_solutions_v_blocks_sectors" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_sectors_parent_id_idx" ON "_solutions_v_blocks_sectors" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_sectors_path_idx" ON "_solutions_v_blocks_sectors" USING btree ("_path");
  CREATE INDEX "_solutions_v_blocks_measures_items_order_idx" ON "_solutions_v_blocks_measures_items" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_measures_items_parent_id_idx" ON "_solutions_v_blocks_measures_items" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_measures_order_idx" ON "_solutions_v_blocks_measures" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_measures_parent_id_idx" ON "_solutions_v_blocks_measures" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_measures_path_idx" ON "_solutions_v_blocks_measures" USING btree ("_path");
  CREATE INDEX "_solutions_v_blocks_steps_items_order_idx" ON "_solutions_v_blocks_steps_items" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_steps_items_parent_id_idx" ON "_solutions_v_blocks_steps_items" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_steps_order_idx" ON "_solutions_v_blocks_steps" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_steps_parent_id_idx" ON "_solutions_v_blocks_steps" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_steps_path_idx" ON "_solutions_v_blocks_steps" USING btree ("_path");
  CREATE INDEX "_solutions_v_blocks_checklist_items_order_idx" ON "_solutions_v_blocks_checklist_items" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_checklist_items_parent_id_idx" ON "_solutions_v_blocks_checklist_items" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_checklist_order_idx" ON "_solutions_v_blocks_checklist" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_checklist_parent_id_idx" ON "_solutions_v_blocks_checklist" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_checklist_path_idx" ON "_solutions_v_blocks_checklist" USING btree ("_path");
  CREATE INDEX "_solutions_v_blocks_models_items_order_idx" ON "_solutions_v_blocks_models_items" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_models_items_parent_id_idx" ON "_solutions_v_blocks_models_items" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_models_order_idx" ON "_solutions_v_blocks_models" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_models_parent_id_idx" ON "_solutions_v_blocks_models" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_models_path_idx" ON "_solutions_v_blocks_models" USING btree ("_path");
  CREATE INDEX "_solutions_v_version_outcomes_order_idx" ON "_solutions_v_version_outcomes" USING btree ("_order");
  CREATE INDEX "_solutions_v_version_outcomes_parent_id_idx" ON "_solutions_v_version_outcomes" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_parent_idx" ON "_solutions_v" USING btree ("parent_id");
  CREATE INDEX "_solutions_v_version_version_slug_idx" ON "_solutions_v" USING btree ("version_slug");
  CREATE INDEX "_solutions_v_version_meta_version_meta_image_idx" ON "_solutions_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_solutions_v_version_version_updated_at_idx" ON "_solutions_v" USING btree ("version_updated_at");
  CREATE INDEX "_solutions_v_version_version_created_at_idx" ON "_solutions_v" USING btree ("version_created_at");
  CREATE INDEX "_solutions_v_version_version__status_idx" ON "_solutions_v" USING btree ("version__status");
  CREATE INDEX "_solutions_v_created_at_idx" ON "_solutions_v" USING btree ("created_at");
  CREATE INDEX "_solutions_v_updated_at_idx" ON "_solutions_v" USING btree ("updated_at");
  CREATE INDEX "_solutions_v_latest_idx" ON "_solutions_v" USING btree ("latest");
  CREATE INDEX "_solutions_v_autosave_idx" ON "_solutions_v" USING btree ("autosave");
  CREATE INDEX "_solutions_v_rels_order_idx" ON "_solutions_v_rels" USING btree ("order");
  CREATE INDEX "_solutions_v_rels_parent_idx" ON "_solutions_v_rels" USING btree ("parent_id");
  CREATE INDEX "_solutions_v_rels_path_idx" ON "_solutions_v_rels" USING btree ("path");
  CREATE INDEX "_solutions_v_rels_partners_id_idx" ON "_solutions_v_rels" USING btree ("partners_id");
  CREATE INDEX "_solutions_v_rels_solutions_id_idx" ON "_solutions_v_rels" USING btree ("solutions_id");
  CREATE INDEX "services_capabilities_order_idx" ON "services_capabilities" USING btree ("_order");
  CREATE INDEX "services_capabilities_parent_id_idx" ON "services_capabilities" USING btree ("_parent_id");
  CREATE INDEX "services_checklist_order_idx" ON "services_checklist" USING btree ("_order");
  CREATE INDEX "services_checklist_parent_id_idx" ON "services_checklist" USING btree ("_parent_id");
  CREATE INDEX "services_models_order_idx" ON "services_models" USING btree ("_order");
  CREATE INDEX "services_models_parent_id_idx" ON "services_models" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");
  CREATE INDEX "services_meta_meta_image_idx" ON "services" USING btree ("meta_image_id");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "services__status_idx" ON "services" USING btree ("_status");
  CREATE INDEX "services_rels_order_idx" ON "services_rels" USING btree ("order");
  CREATE INDEX "services_rels_parent_idx" ON "services_rels" USING btree ("parent_id");
  CREATE INDEX "services_rels_path_idx" ON "services_rels" USING btree ("path");
  CREATE INDEX "services_rels_services_id_idx" ON "services_rels" USING btree ("services_id");
  CREATE INDEX "_services_v_version_capabilities_order_idx" ON "_services_v_version_capabilities" USING btree ("_order");
  CREATE INDEX "_services_v_version_capabilities_parent_id_idx" ON "_services_v_version_capabilities" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_checklist_order_idx" ON "_services_v_version_checklist" USING btree ("_order");
  CREATE INDEX "_services_v_version_checklist_parent_id_idx" ON "_services_v_version_checklist" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_models_order_idx" ON "_services_v_version_models" USING btree ("_order");
  CREATE INDEX "_services_v_version_models_parent_id_idx" ON "_services_v_version_models" USING btree ("_parent_id");
  CREATE INDEX "_services_v_parent_idx" ON "_services_v" USING btree ("parent_id");
  CREATE INDEX "_services_v_version_version_slug_idx" ON "_services_v" USING btree ("version_slug");
  CREATE INDEX "_services_v_version_meta_version_meta_image_idx" ON "_services_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_services_v_version_version_updated_at_idx" ON "_services_v" USING btree ("version_updated_at");
  CREATE INDEX "_services_v_version_version_created_at_idx" ON "_services_v" USING btree ("version_created_at");
  CREATE INDEX "_services_v_version_version__status_idx" ON "_services_v" USING btree ("version__status");
  CREATE INDEX "_services_v_created_at_idx" ON "_services_v" USING btree ("created_at");
  CREATE INDEX "_services_v_updated_at_idx" ON "_services_v" USING btree ("updated_at");
  CREATE INDEX "_services_v_latest_idx" ON "_services_v" USING btree ("latest");
  CREATE INDEX "_services_v_autosave_idx" ON "_services_v" USING btree ("autosave");
  CREATE INDEX "_services_v_rels_order_idx" ON "_services_v_rels" USING btree ("order");
  CREATE INDEX "_services_v_rels_parent_idx" ON "_services_v_rels" USING btree ("parent_id");
  CREATE INDEX "_services_v_rels_path_idx" ON "_services_v_rels" USING btree ("path");
  CREATE INDEX "_services_v_rels_services_id_idx" ON "_services_v_rels" USING btree ("services_id");
  CREATE INDEX "clients_logo_idx" ON "clients" USING btree ("logo_id");
  CREATE INDEX "clients_updated_at_idx" ON "clients" USING btree ("updated_at");
  CREATE INDEX "clients_created_at_idx" ON "clients" USING btree ("created_at");
  CREATE INDEX "clients__status_idx" ON "clients" USING btree ("_status");
  CREATE INDEX "clients_rels_order_idx" ON "clients_rels" USING btree ("order");
  CREATE INDEX "clients_rels_parent_idx" ON "clients_rels" USING btree ("parent_id");
  CREATE INDEX "clients_rels_path_idx" ON "clients_rels" USING btree ("path");
  CREATE INDEX "clients_rels_projects_id_idx" ON "clients_rels" USING btree ("projects_id");
  CREATE INDEX "clients_rels_solutions_id_idx" ON "clients_rels" USING btree ("solutions_id");
  CREATE INDEX "_clients_v_parent_idx" ON "_clients_v" USING btree ("parent_id");
  CREATE INDEX "_clients_v_version_version_logo_idx" ON "_clients_v" USING btree ("version_logo_id");
  CREATE INDEX "_clients_v_version_version_updated_at_idx" ON "_clients_v" USING btree ("version_updated_at");
  CREATE INDEX "_clients_v_version_version_created_at_idx" ON "_clients_v" USING btree ("version_created_at");
  CREATE INDEX "_clients_v_version_version__status_idx" ON "_clients_v" USING btree ("version__status");
  CREATE INDEX "_clients_v_created_at_idx" ON "_clients_v" USING btree ("created_at");
  CREATE INDEX "_clients_v_updated_at_idx" ON "_clients_v" USING btree ("updated_at");
  CREATE INDEX "_clients_v_latest_idx" ON "_clients_v" USING btree ("latest");
  CREATE INDEX "_clients_v_autosave_idx" ON "_clients_v" USING btree ("autosave");
  CREATE INDEX "_clients_v_rels_order_idx" ON "_clients_v_rels" USING btree ("order");
  CREATE INDEX "_clients_v_rels_parent_idx" ON "_clients_v_rels" USING btree ("parent_id");
  CREATE INDEX "_clients_v_rels_path_idx" ON "_clients_v_rels" USING btree ("path");
  CREATE INDEX "_clients_v_rels_projects_id_idx" ON "_clients_v_rels" USING btree ("projects_id");
  CREATE INDEX "_clients_v_rels_solutions_id_idx" ON "_clients_v_rels" USING btree ("solutions_id");
  CREATE INDEX "projects_tech_order_idx" ON "projects_tech" USING btree ("_order");
  CREATE INDEX "projects_tech_parent_id_idx" ON "projects_tech" USING btree ("_parent_id");
  CREATE INDEX "projects_scope_order_idx" ON "projects_scope" USING btree ("_order");
  CREATE INDEX "projects_scope_parent_id_idx" ON "projects_scope" USING btree ("_parent_id");
  CREATE INDEX "projects_delivered_order_idx" ON "projects_delivered" USING btree ("_order");
  CREATE INDEX "projects_delivered_parent_id_idx" ON "projects_delivered" USING btree ("_parent_id");
  CREATE INDEX "projects_outcomes_order_idx" ON "projects_outcomes" USING btree ("_order");
  CREATE INDEX "projects_outcomes_parent_id_idx" ON "projects_outcomes" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_client_idx" ON "projects" USING btree ("client_id");
  CREATE INDEX "projects_meta_meta_image_idx" ON "projects" USING btree ("meta_image_id");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "projects__status_idx" ON "projects" USING btree ("_status");
  CREATE INDEX "projects_rels_order_idx" ON "projects_rels" USING btree ("order");
  CREATE INDEX "projects_rels_parent_idx" ON "projects_rels" USING btree ("parent_id");
  CREATE INDEX "projects_rels_path_idx" ON "projects_rels" USING btree ("path");
  CREATE INDEX "projects_rels_solutions_id_idx" ON "projects_rels" USING btree ("solutions_id");
  CREATE INDEX "_projects_v_version_tech_order_idx" ON "_projects_v_version_tech" USING btree ("_order");
  CREATE INDEX "_projects_v_version_tech_parent_id_idx" ON "_projects_v_version_tech" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_scope_order_idx" ON "_projects_v_version_scope" USING btree ("_order");
  CREATE INDEX "_projects_v_version_scope_parent_id_idx" ON "_projects_v_version_scope" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_delivered_order_idx" ON "_projects_v_version_delivered" USING btree ("_order");
  CREATE INDEX "_projects_v_version_delivered_parent_id_idx" ON "_projects_v_version_delivered" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_outcomes_order_idx" ON "_projects_v_version_outcomes" USING btree ("_order");
  CREATE INDEX "_projects_v_version_outcomes_parent_id_idx" ON "_projects_v_version_outcomes" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_parent_idx" ON "_projects_v" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_version_slug_idx" ON "_projects_v" USING btree ("version_slug");
  CREATE INDEX "_projects_v_version_version_client_idx" ON "_projects_v" USING btree ("version_client_id");
  CREATE INDEX "_projects_v_version_meta_version_meta_image_idx" ON "_projects_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_projects_v_version_version_updated_at_idx" ON "_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_projects_v_version_version_created_at_idx" ON "_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_projects_v_version_version__status_idx" ON "_projects_v" USING btree ("version__status");
  CREATE INDEX "_projects_v_created_at_idx" ON "_projects_v" USING btree ("created_at");
  CREATE INDEX "_projects_v_updated_at_idx" ON "_projects_v" USING btree ("updated_at");
  CREATE INDEX "_projects_v_latest_idx" ON "_projects_v" USING btree ("latest");
  CREATE INDEX "_projects_v_autosave_idx" ON "_projects_v" USING btree ("autosave");
  CREATE INDEX "_projects_v_rels_order_idx" ON "_projects_v_rels" USING btree ("order");
  CREATE INDEX "_projects_v_rels_parent_idx" ON "_projects_v_rels" USING btree ("parent_id");
  CREATE INDEX "_projects_v_rels_path_idx" ON "_projects_v_rels" USING btree ("path");
  CREATE INDEX "_projects_v_rels_solutions_id_idx" ON "_projects_v_rels" USING btree ("solutions_id");
  CREATE INDEX "events_program_order_idx" ON "events_program" USING btree ("_order");
  CREATE INDEX "events_program_parent_id_idx" ON "events_program" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "events_slug_idx" ON "events" USING btree ("slug");
  CREATE INDEX "events_meta_meta_image_idx" ON "events" USING btree ("meta_image_id");
  CREATE INDEX "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE INDEX "events__status_idx" ON "events" USING btree ("_status");
  CREATE INDEX "_events_v_version_program_order_idx" ON "_events_v_version_program" USING btree ("_order");
  CREATE INDEX "_events_v_version_program_parent_id_idx" ON "_events_v_version_program" USING btree ("_parent_id");
  CREATE INDEX "_events_v_parent_idx" ON "_events_v" USING btree ("parent_id");
  CREATE INDEX "_events_v_version_version_slug_idx" ON "_events_v" USING btree ("version_slug");
  CREATE INDEX "_events_v_version_meta_version_meta_image_idx" ON "_events_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_events_v_version_version_updated_at_idx" ON "_events_v" USING btree ("version_updated_at");
  CREATE INDEX "_events_v_version_version_created_at_idx" ON "_events_v" USING btree ("version_created_at");
  CREATE INDEX "_events_v_version_version__status_idx" ON "_events_v" USING btree ("version__status");
  CREATE INDEX "_events_v_created_at_idx" ON "_events_v" USING btree ("created_at");
  CREATE INDEX "_events_v_updated_at_idx" ON "_events_v" USING btree ("updated_at");
  CREATE INDEX "_events_v_latest_idx" ON "_events_v" USING btree ("latest");
  CREATE INDEX "_events_v_autosave_idx" ON "_events_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "post_categories_key_idx" ON "post_categories" USING btree ("key");
  CREATE INDEX "post_categories_updated_at_idx" ON "post_categories" USING btree ("updated_at");
  CREATE INDEX "post_categories_created_at_idx" ON "post_categories" USING btree ("created_at");
  CREATE INDEX "post_categories__status_idx" ON "post_categories" USING btree ("_status");
  CREATE INDEX "_post_categories_v_parent_idx" ON "_post_categories_v" USING btree ("parent_id");
  CREATE INDEX "_post_categories_v_version_version_key_idx" ON "_post_categories_v" USING btree ("version_key");
  CREATE INDEX "_post_categories_v_version_version_updated_at_idx" ON "_post_categories_v" USING btree ("version_updated_at");
  CREATE INDEX "_post_categories_v_version_version_created_at_idx" ON "_post_categories_v" USING btree ("version_created_at");
  CREATE INDEX "_post_categories_v_version_version__status_idx" ON "_post_categories_v" USING btree ("version__status");
  CREATE INDEX "_post_categories_v_created_at_idx" ON "_post_categories_v" USING btree ("created_at");
  CREATE INDEX "_post_categories_v_updated_at_idx" ON "_post_categories_v" USING btree ("updated_at");
  CREATE INDEX "_post_categories_v_latest_idx" ON "_post_categories_v" USING btree ("latest");
  CREATE INDEX "_post_categories_v_autosave_idx" ON "_post_categories_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_category_idx" ON "posts" USING btree ("category_id");
  CREATE INDEX "posts_target_idx" ON "posts" USING btree ("target_id");
  CREATE INDEX "posts_meta_meta_image_idx" ON "posts" USING btree ("meta_image_id");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_category_idx" ON "_posts_v" USING btree ("version_category_id");
  CREATE INDEX "_posts_v_version_version_target_idx" ON "_posts_v" USING btree ("version_target_id");
  CREATE INDEX "_posts_v_version_meta_version_meta_image_idx" ON "_posts_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_autosave_idx" ON "_posts_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "news_slug_idx" ON "news" USING btree ("slug");
  CREATE INDEX "news_meta_meta_image_idx" ON "news" USING btree ("meta_image_id");
  CREATE INDEX "news_updated_at_idx" ON "news" USING btree ("updated_at");
  CREATE INDEX "news_created_at_idx" ON "news" USING btree ("created_at");
  CREATE INDEX "news__status_idx" ON "news" USING btree ("_status");
  CREATE INDEX "_news_v_parent_idx" ON "_news_v" USING btree ("parent_id");
  CREATE INDEX "_news_v_version_version_slug_idx" ON "_news_v" USING btree ("version_slug");
  CREATE INDEX "_news_v_version_meta_version_meta_image_idx" ON "_news_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_news_v_version_version_updated_at_idx" ON "_news_v" USING btree ("version_updated_at");
  CREATE INDEX "_news_v_version_version_created_at_idx" ON "_news_v" USING btree ("version_created_at");
  CREATE INDEX "_news_v_version_version__status_idx" ON "_news_v" USING btree ("version__status");
  CREATE INDEX "_news_v_created_at_idx" ON "_news_v" USING btree ("created_at");
  CREATE INDEX "_news_v_updated_at_idx" ON "_news_v" USING btree ("updated_at");
  CREATE INDEX "_news_v_latest_idx" ON "_news_v" USING btree ("latest");
  CREATE INDEX "_news_v_autosave_idx" ON "_news_v" USING btree ("autosave");
  CREATE INDEX "downloads_file_idx" ON "downloads" USING btree ("file_id");
  CREATE INDEX "downloads_updated_at_idx" ON "downloads" USING btree ("updated_at");
  CREATE INDEX "downloads_created_at_idx" ON "downloads" USING btree ("created_at");
  CREATE INDEX "downloads__status_idx" ON "downloads" USING btree ("_status");
  CREATE INDEX "_downloads_v_parent_idx" ON "_downloads_v" USING btree ("parent_id");
  CREATE INDEX "_downloads_v_version_version_file_idx" ON "_downloads_v" USING btree ("version_file_id");
  CREATE INDEX "_downloads_v_version_version_updated_at_idx" ON "_downloads_v" USING btree ("version_updated_at");
  CREATE INDEX "_downloads_v_version_version_created_at_idx" ON "_downloads_v" USING btree ("version_created_at");
  CREATE INDEX "_downloads_v_version_version__status_idx" ON "_downloads_v" USING btree ("version__status");
  CREATE INDEX "_downloads_v_created_at_idx" ON "_downloads_v" USING btree ("created_at");
  CREATE INDEX "_downloads_v_updated_at_idx" ON "_downloads_v" USING btree ("updated_at");
  CREATE INDEX "_downloads_v_latest_idx" ON "_downloads_v" USING btree ("latest");
  CREATE INDEX "_downloads_v_autosave_idx" ON "_downloads_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "partner_categories_key_idx" ON "partner_categories" USING btree ("key");
  CREATE INDEX "partner_categories_updated_at_idx" ON "partner_categories" USING btree ("updated_at");
  CREATE INDEX "partner_categories_created_at_idx" ON "partner_categories" USING btree ("created_at");
  CREATE INDEX "partner_categories__status_idx" ON "partner_categories" USING btree ("_status");
  CREATE INDEX "_partner_categories_v_parent_idx" ON "_partner_categories_v" USING btree ("parent_id");
  CREATE INDEX "_partner_categories_v_version_version_key_idx" ON "_partner_categories_v" USING btree ("version_key");
  CREATE INDEX "_partner_categories_v_version_version_updated_at_idx" ON "_partner_categories_v" USING btree ("version_updated_at");
  CREATE INDEX "_partner_categories_v_version_version_created_at_idx" ON "_partner_categories_v" USING btree ("version_created_at");
  CREATE INDEX "_partner_categories_v_version_version__status_idx" ON "_partner_categories_v" USING btree ("version__status");
  CREATE INDEX "_partner_categories_v_created_at_idx" ON "_partner_categories_v" USING btree ("created_at");
  CREATE INDEX "_partner_categories_v_updated_at_idx" ON "_partner_categories_v" USING btree ("updated_at");
  CREATE INDEX "_partner_categories_v_latest_idx" ON "_partner_categories_v" USING btree ("latest");
  CREATE INDEX "_partner_categories_v_autosave_idx" ON "_partner_categories_v" USING btree ("autosave");
  CREATE INDEX "partners_logo_idx" ON "partners" USING btree ("logo_id");
  CREATE INDEX "partners_solution_idx" ON "partners" USING btree ("solution_id");
  CREATE INDEX "partners_updated_at_idx" ON "partners" USING btree ("updated_at");
  CREATE INDEX "partners_created_at_idx" ON "partners" USING btree ("created_at");
  CREATE INDEX "partners__status_idx" ON "partners" USING btree ("_status");
  CREATE INDEX "partners_rels_order_idx" ON "partners_rels" USING btree ("order");
  CREATE INDEX "partners_rels_parent_idx" ON "partners_rels" USING btree ("parent_id");
  CREATE INDEX "partners_rels_path_idx" ON "partners_rels" USING btree ("path");
  CREATE INDEX "partners_rels_partner_categories_id_idx" ON "partners_rels" USING btree ("partner_categories_id");
  CREATE INDEX "partners_rels_projects_id_idx" ON "partners_rels" USING btree ("projects_id");
  CREATE INDEX "_partners_v_parent_idx" ON "_partners_v" USING btree ("parent_id");
  CREATE INDEX "_partners_v_version_version_logo_idx" ON "_partners_v" USING btree ("version_logo_id");
  CREATE INDEX "_partners_v_version_version_solution_idx" ON "_partners_v" USING btree ("version_solution_id");
  CREATE INDEX "_partners_v_version_version_updated_at_idx" ON "_partners_v" USING btree ("version_updated_at");
  CREATE INDEX "_partners_v_version_version_created_at_idx" ON "_partners_v" USING btree ("version_created_at");
  CREATE INDEX "_partners_v_version_version__status_idx" ON "_partners_v" USING btree ("version__status");
  CREATE INDEX "_partners_v_created_at_idx" ON "_partners_v" USING btree ("created_at");
  CREATE INDEX "_partners_v_updated_at_idx" ON "_partners_v" USING btree ("updated_at");
  CREATE INDEX "_partners_v_latest_idx" ON "_partners_v" USING btree ("latest");
  CREATE INDEX "_partners_v_autosave_idx" ON "_partners_v" USING btree ("autosave");
  CREATE INDEX "_partners_v_rels_order_idx" ON "_partners_v_rels" USING btree ("order");
  CREATE INDEX "_partners_v_rels_parent_idx" ON "_partners_v_rels" USING btree ("parent_id");
  CREATE INDEX "_partners_v_rels_path_idx" ON "_partners_v_rels" USING btree ("path");
  CREATE INDEX "_partners_v_rels_partner_categories_id_idx" ON "_partners_v_rels" USING btree ("partner_categories_id");
  CREATE INDEX "_partners_v_rels_projects_id_idx" ON "_partners_v_rels" USING btree ("projects_id");
  CREATE INDEX "jobs_responsibilities_order_idx" ON "jobs_responsibilities" USING btree ("_order");
  CREATE INDEX "jobs_responsibilities_parent_id_idx" ON "jobs_responsibilities" USING btree ("_parent_id");
  CREATE INDEX "jobs_required_order_idx" ON "jobs_required" USING btree ("_order");
  CREATE INDEX "jobs_required_parent_id_idx" ON "jobs_required" USING btree ("_parent_id");
  CREATE INDEX "jobs_preferred_order_idx" ON "jobs_preferred" USING btree ("_order");
  CREATE INDEX "jobs_preferred_parent_id_idx" ON "jobs_preferred" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "jobs_slug_idx" ON "jobs" USING btree ("slug");
  CREATE INDEX "jobs_meta_meta_image_idx" ON "jobs" USING btree ("meta_image_id");
  CREATE INDEX "jobs_updated_at_idx" ON "jobs" USING btree ("updated_at");
  CREATE INDEX "jobs_created_at_idx" ON "jobs" USING btree ("created_at");
  CREATE INDEX "jobs__status_idx" ON "jobs" USING btree ("_status");
  CREATE INDEX "_jobs_v_version_responsibilities_order_idx" ON "_jobs_v_version_responsibilities" USING btree ("_order");
  CREATE INDEX "_jobs_v_version_responsibilities_parent_id_idx" ON "_jobs_v_version_responsibilities" USING btree ("_parent_id");
  CREATE INDEX "_jobs_v_version_required_order_idx" ON "_jobs_v_version_required" USING btree ("_order");
  CREATE INDEX "_jobs_v_version_required_parent_id_idx" ON "_jobs_v_version_required" USING btree ("_parent_id");
  CREATE INDEX "_jobs_v_version_preferred_order_idx" ON "_jobs_v_version_preferred" USING btree ("_order");
  CREATE INDEX "_jobs_v_version_preferred_parent_id_idx" ON "_jobs_v_version_preferred" USING btree ("_parent_id");
  CREATE INDEX "_jobs_v_parent_idx" ON "_jobs_v" USING btree ("parent_id");
  CREATE INDEX "_jobs_v_version_version_slug_idx" ON "_jobs_v" USING btree ("version_slug");
  CREATE INDEX "_jobs_v_version_meta_version_meta_image_idx" ON "_jobs_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_jobs_v_version_version_updated_at_idx" ON "_jobs_v" USING btree ("version_updated_at");
  CREATE INDEX "_jobs_v_version_version_created_at_idx" ON "_jobs_v" USING btree ("version_created_at");
  CREATE INDEX "_jobs_v_version_version__status_idx" ON "_jobs_v" USING btree ("version__status");
  CREATE INDEX "_jobs_v_created_at_idx" ON "_jobs_v" USING btree ("created_at");
  CREATE INDEX "_jobs_v_updated_at_idx" ON "_jobs_v" USING btree ("updated_at");
  CREATE INDEX "_jobs_v_latest_idx" ON "_jobs_v" USING btree ("latest");
  CREATE INDEX "_jobs_v_autosave_idx" ON "_jobs_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "academy_tracks_slug_idx" ON "academy_tracks" USING btree ("slug");
  CREATE INDEX "academy_tracks_solution_idx" ON "academy_tracks" USING btree ("solution_id");
  CREATE INDEX "academy_tracks_updated_at_idx" ON "academy_tracks" USING btree ("updated_at");
  CREATE INDEX "academy_tracks_created_at_idx" ON "academy_tracks" USING btree ("created_at");
  CREATE INDEX "academy_tracks__status_idx" ON "academy_tracks" USING btree ("_status");
  CREATE INDEX "_academy_tracks_v_parent_idx" ON "_academy_tracks_v" USING btree ("parent_id");
  CREATE INDEX "_academy_tracks_v_version_version_slug_idx" ON "_academy_tracks_v" USING btree ("version_slug");
  CREATE INDEX "_academy_tracks_v_version_version_solution_idx" ON "_academy_tracks_v" USING btree ("version_solution_id");
  CREATE INDEX "_academy_tracks_v_version_version_updated_at_idx" ON "_academy_tracks_v" USING btree ("version_updated_at");
  CREATE INDEX "_academy_tracks_v_version_version_created_at_idx" ON "_academy_tracks_v" USING btree ("version_created_at");
  CREATE INDEX "_academy_tracks_v_version_version__status_idx" ON "_academy_tracks_v" USING btree ("version__status");
  CREATE INDEX "_academy_tracks_v_created_at_idx" ON "_academy_tracks_v" USING btree ("created_at");
  CREATE INDEX "_academy_tracks_v_updated_at_idx" ON "_academy_tracks_v" USING btree ("updated_at");
  CREATE INDEX "_academy_tracks_v_latest_idx" ON "_academy_tracks_v" USING btree ("latest");
  CREATE INDEX "_academy_tracks_v_autosave_idx" ON "_academy_tracks_v" USING btree ("autosave");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_wide_sizes_wide_filename_idx" ON "media" USING btree ("sizes_wide_filename");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "forms_blocks_checkbox_order_idx" ON "forms_blocks_checkbox" USING btree ("_order");
  CREATE INDEX "forms_blocks_checkbox_parent_id_idx" ON "forms_blocks_checkbox" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_checkbox_path_idx" ON "forms_blocks_checkbox" USING btree ("_path");
  CREATE INDEX "forms_blocks_country_order_idx" ON "forms_blocks_country" USING btree ("_order");
  CREATE INDEX "forms_blocks_country_parent_id_idx" ON "forms_blocks_country" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_country_path_idx" ON "forms_blocks_country" USING btree ("_path");
  CREATE INDEX "forms_blocks_email_order_idx" ON "forms_blocks_email" USING btree ("_order");
  CREATE INDEX "forms_blocks_email_parent_id_idx" ON "forms_blocks_email" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_email_path_idx" ON "forms_blocks_email" USING btree ("_path");
  CREATE INDEX "forms_blocks_message_order_idx" ON "forms_blocks_message" USING btree ("_order");
  CREATE INDEX "forms_blocks_message_parent_id_idx" ON "forms_blocks_message" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_message_path_idx" ON "forms_blocks_message" USING btree ("_path");
  CREATE INDEX "forms_blocks_number_order_idx" ON "forms_blocks_number" USING btree ("_order");
  CREATE INDEX "forms_blocks_number_parent_id_idx" ON "forms_blocks_number" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_number_path_idx" ON "forms_blocks_number" USING btree ("_path");
  CREATE INDEX "forms_blocks_select_options_order_idx" ON "forms_blocks_select_options" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_options_parent_id_idx" ON "forms_blocks_select_options" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_select_order_idx" ON "forms_blocks_select" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_parent_id_idx" ON "forms_blocks_select" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_select_path_idx" ON "forms_blocks_select" USING btree ("_path");
  CREATE INDEX "forms_blocks_state_order_idx" ON "forms_blocks_state" USING btree ("_order");
  CREATE INDEX "forms_blocks_state_parent_id_idx" ON "forms_blocks_state" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_state_path_idx" ON "forms_blocks_state" USING btree ("_path");
  CREATE INDEX "forms_blocks_text_order_idx" ON "forms_blocks_text" USING btree ("_order");
  CREATE INDEX "forms_blocks_text_parent_id_idx" ON "forms_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_text_path_idx" ON "forms_blocks_text" USING btree ("_path");
  CREATE INDEX "forms_blocks_textarea_order_idx" ON "forms_blocks_textarea" USING btree ("_order");
  CREATE INDEX "forms_blocks_textarea_parent_id_idx" ON "forms_blocks_textarea" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_textarea_path_idx" ON "forms_blocks_textarea" USING btree ("_path");
  CREATE INDEX "forms_emails_order_idx" ON "forms_emails" USING btree ("_order");
  CREATE INDEX "forms_emails_parent_id_idx" ON "forms_emails" USING btree ("_parent_id");
  CREATE INDEX "forms_updated_at_idx" ON "forms" USING btree ("updated_at");
  CREATE INDEX "forms_created_at_idx" ON "forms" USING btree ("created_at");
  CREATE INDEX "form_submissions_submission_data_order_idx" ON "form_submissions_submission_data" USING btree ("_order");
  CREATE INDEX "form_submissions_submission_data_parent_id_idx" ON "form_submissions_submission_data" USING btree ("_parent_id");
  CREATE INDEX "form_submissions_form_idx" ON "form_submissions" USING btree ("form_id");
  CREATE INDEX "form_submissions_updated_at_idx" ON "form_submissions" USING btree ("updated_at");
  CREATE INDEX "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_solutions_id_idx" ON "payload_locked_documents_rels" USING btree ("solutions_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_clients_id_idx" ON "payload_locked_documents_rels" USING btree ("clients_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_post_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("post_categories_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_news_id_idx" ON "payload_locked_documents_rels" USING btree ("news_id");
  CREATE INDEX "payload_locked_documents_rels_downloads_id_idx" ON "payload_locked_documents_rels" USING btree ("downloads_id");
  CREATE INDEX "payload_locked_documents_rels_partner_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("partner_categories_id");
  CREATE INDEX "payload_locked_documents_rels_partners_id_idx" ON "payload_locked_documents_rels" USING btree ("partners_id");
  CREATE INDEX "payload_locked_documents_rels_jobs_id_idx" ON "payload_locked_documents_rels" USING btree ("jobs_id");
  CREATE INDEX "payload_locked_documents_rels_academy_tracks_id_idx" ON "payload_locked_documents_rels" USING btree ("academy_tracks_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_forms_id_idx" ON "payload_locked_documents_rels" USING btree ("forms_id");
  CREATE INDEX "payload_locked_documents_rels_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("form_submissions_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_nav_order_idx" ON "site_settings_nav" USING btree ("_order");
  CREATE INDEX "site_settings_nav_parent_id_idx" ON "site_settings_nav" USING btree ("_parent_id");
  CREATE INDEX "site_settings_social_order_idx" ON "site_settings_social" USING btree ("_order");
  CREATE INDEX "site_settings_social_parent_id_idx" ON "site_settings_social" USING btree ("_parent_id");
  CREATE INDEX "site_settings_impact_order_idx" ON "site_settings_impact" USING btree ("_order");
  CREATE INDEX "site_settings_impact_parent_id_idx" ON "site_settings_impact" USING btree ("_parent_id");
  CREATE INDEX "company_values_order_idx" ON "company_values" USING btree ("_order");
  CREATE INDEX "company_values_parent_id_idx" ON "company_values" USING btree ("_parent_id");
  CREATE INDEX "company_journey_order_idx" ON "company_journey" USING btree ("_order");
  CREATE INDEX "company_journey_parent_id_idx" ON "company_journey" USING btree ("_parent_id");
  CREATE INDEX "company_differentiators_order_idx" ON "company_differentiators" USING btree ("_order");
  CREATE INDEX "company_differentiators_parent_id_idx" ON "company_differentiators" USING btree ("_parent_id");
  CREATE INDEX "company_delivery_order_idx" ON "company_delivery" USING btree ("_order");
  CREATE INDEX "company_delivery_parent_id_idx" ON "company_delivery" USING btree ("_parent_id");
  CREATE INDEX "company_industries_order_idx" ON "company_industries" USING btree ("_order");
  CREATE INDEX "company_industries_parent_id_idx" ON "company_industries" USING btree ("_parent_id");
  CREATE INDEX "company_sustainability_order_idx" ON "company_sustainability" USING btree ("_order");
  CREATE INDEX "company_sustainability_parent_id_idx" ON "company_sustainability" USING btree ("_parent_id");
  CREATE INDEX "company_executive_roles_order_idx" ON "company_executive_roles" USING btree ("_order");
  CREATE INDEX "company_executive_roles_parent_id_idx" ON "company_executive_roles" USING btree ("_parent_id");
  CREATE INDEX "_company_v_version_values_order_idx" ON "_company_v_version_values" USING btree ("_order");
  CREATE INDEX "_company_v_version_values_parent_id_idx" ON "_company_v_version_values" USING btree ("_parent_id");
  CREATE INDEX "_company_v_version_journey_order_idx" ON "_company_v_version_journey" USING btree ("_order");
  CREATE INDEX "_company_v_version_journey_parent_id_idx" ON "_company_v_version_journey" USING btree ("_parent_id");
  CREATE INDEX "_company_v_version_differentiators_order_idx" ON "_company_v_version_differentiators" USING btree ("_order");
  CREATE INDEX "_company_v_version_differentiators_parent_id_idx" ON "_company_v_version_differentiators" USING btree ("_parent_id");
  CREATE INDEX "_company_v_version_delivery_order_idx" ON "_company_v_version_delivery" USING btree ("_order");
  CREATE INDEX "_company_v_version_delivery_parent_id_idx" ON "_company_v_version_delivery" USING btree ("_parent_id");
  CREATE INDEX "_company_v_version_industries_order_idx" ON "_company_v_version_industries" USING btree ("_order");
  CREATE INDEX "_company_v_version_industries_parent_id_idx" ON "_company_v_version_industries" USING btree ("_parent_id");
  CREATE INDEX "_company_v_version_sustainability_order_idx" ON "_company_v_version_sustainability" USING btree ("_order");
  CREATE INDEX "_company_v_version_sustainability_parent_id_idx" ON "_company_v_version_sustainability" USING btree ("_parent_id");
  CREATE INDEX "_company_v_version_executive_roles_order_idx" ON "_company_v_version_executive_roles" USING btree ("_order");
  CREATE INDEX "_company_v_version_executive_roles_parent_id_idx" ON "_company_v_version_executive_roles" USING btree ("_parent_id");
  CREATE INDEX "_company_v_created_at_idx" ON "_company_v" USING btree ("created_at");
  CREATE INDEX "_company_v_updated_at_idx" ON "_company_v" USING btree ("updated_at");
  CREATE INDEX "contact_details_office_order_idx" ON "contact_details_office" USING btree ("_order");
  CREATE INDEX "contact_details_office_parent_id_idx" ON "contact_details_office" USING btree ("_parent_id");
  CREATE INDEX "contact_details_phones_order_idx" ON "contact_details_phones" USING btree ("_order");
  CREATE INDEX "contact_details_phones_parent_id_idx" ON "contact_details_phones" USING btree ("_parent_id");
  CREATE INDEX "contact_details_emails_order_idx" ON "contact_details_emails" USING btree ("_order");
  CREATE INDEX "contact_details_emails_parent_id_idx" ON "contact_details_emails" USING btree ("_parent_id");
  CREATE INDEX "contact_details_hours_order_idx" ON "contact_details_hours" USING btree ("_order");
  CREATE INDEX "contact_details_hours_parent_id_idx" ON "contact_details_hours" USING btree ("_parent_id");
  CREATE INDEX "contact_details_inquiry_categories_order_idx" ON "contact_details_inquiry_categories" USING btree ("_order");
  CREATE INDEX "contact_details_inquiry_categories_parent_id_idx" ON "contact_details_inquiry_categories" USING btree ("_parent_id");
  CREATE INDEX "_contact_details_v_version_office_order_idx" ON "_contact_details_v_version_office" USING btree ("_order");
  CREATE INDEX "_contact_details_v_version_office_parent_id_idx" ON "_contact_details_v_version_office" USING btree ("_parent_id");
  CREATE INDEX "_contact_details_v_version_phones_order_idx" ON "_contact_details_v_version_phones" USING btree ("_order");
  CREATE INDEX "_contact_details_v_version_phones_parent_id_idx" ON "_contact_details_v_version_phones" USING btree ("_parent_id");
  CREATE INDEX "_contact_details_v_version_emails_order_idx" ON "_contact_details_v_version_emails" USING btree ("_order");
  CREATE INDEX "_contact_details_v_version_emails_parent_id_idx" ON "_contact_details_v_version_emails" USING btree ("_parent_id");
  CREATE INDEX "_contact_details_v_version_hours_order_idx" ON "_contact_details_v_version_hours" USING btree ("_order");
  CREATE INDEX "_contact_details_v_version_hours_parent_id_idx" ON "_contact_details_v_version_hours" USING btree ("_parent_id");
  CREATE INDEX "_contact_details_v_version_inquiry_categories_order_idx" ON "_contact_details_v_version_inquiry_categories" USING btree ("_order");
  CREATE INDEX "_contact_details_v_version_inquiry_categories_parent_id_idx" ON "_contact_details_v_version_inquiry_categories" USING btree ("_parent_id");
  CREATE INDEX "_contact_details_v_created_at_idx" ON "_contact_details_v" USING btree ("created_at");
  CREATE INDEX "_contact_details_v_updated_at_idx" ON "_contact_details_v" USING btree ("updated_at");
  CREATE INDEX "careers_content_pathways_order_idx" ON "careers_content_pathways" USING btree ("_order");
  CREATE INDEX "careers_content_pathways_parent_id_idx" ON "careers_content_pathways" USING btree ("_parent_id");
  CREATE INDEX "careers_content_culture_order_idx" ON "careers_content_culture" USING btree ("_order");
  CREATE INDEX "careers_content_culture_parent_id_idx" ON "careers_content_culture" USING btree ("_parent_id");
  CREATE INDEX "careers_content_development_order_idx" ON "careers_content_development" USING btree ("_order");
  CREATE INDEX "careers_content_development_parent_id_idx" ON "careers_content_development" USING btree ("_parent_id");
  CREATE INDEX "careers_content_experience_points_order_idx" ON "careers_content_experience_points" USING btree ("_order");
  CREATE INDEX "careers_content_experience_points_parent_id_idx" ON "careers_content_experience_points" USING btree ("_parent_id");
  CREATE INDEX "careers_content_application_docs_order_idx" ON "careers_content_application_docs" USING btree ("_order");
  CREATE INDEX "careers_content_application_docs_parent_id_idx" ON "careers_content_application_docs" USING btree ("_parent_id");
  CREATE INDEX "careers_content_internship_tracks_order_idx" ON "careers_content_internship_tracks" USING btree ("_order");
  CREATE INDEX "careers_content_internship_tracks_parent_id_idx" ON "careers_content_internship_tracks" USING btree ("_parent_id");
  CREATE INDEX "careers_content_internship_eligibility_order_idx" ON "careers_content_internship_eligibility" USING btree ("_order");
  CREATE INDEX "careers_content_internship_eligibility_parent_id_idx" ON "careers_content_internship_eligibility" USING btree ("_parent_id");
  CREATE INDEX "careers_content_internship_documents_order_idx" ON "careers_content_internship_documents" USING btree ("_order");
  CREATE INDEX "careers_content_internship_documents_parent_id_idx" ON "careers_content_internship_documents" USING btree ("_parent_id");
  CREATE INDEX "careers_content_internship_structure_order_idx" ON "careers_content_internship_structure" USING btree ("_order");
  CREATE INDEX "careers_content_internship_structure_parent_id_idx" ON "careers_content_internship_structure" USING btree ("_parent_id");
  CREATE INDEX "careers_content_internship_selection_order_idx" ON "careers_content_internship_selection" USING btree ("_order");
  CREATE INDEX "careers_content_internship_selection_parent_id_idx" ON "careers_content_internship_selection" USING btree ("_parent_id");
  CREATE INDEX "careers_content_academy_audiences_order_idx" ON "careers_content_academy_audiences" USING btree ("_order");
  CREATE INDEX "careers_content_academy_audiences_parent_id_idx" ON "careers_content_academy_audiences" USING btree ("_parent_id");
  CREATE INDEX "careers_content_academy_levels_order_idx" ON "careers_content_academy_levels" USING btree ("_order");
  CREATE INDEX "careers_content_academy_levels_parent_id_idx" ON "careers_content_academy_levels" USING btree ("_parent_id");
  CREATE INDEX "careers_content_academy_delivery_order_idx" ON "careers_content_academy_delivery" USING btree ("_order");
  CREATE INDEX "careers_content_academy_delivery_parent_id_idx" ON "careers_content_academy_delivery" USING btree ("_parent_id");
  CREATE INDEX "careers_content_course_sections_order_idx" ON "careers_content_course_sections" USING btree ("_order");
  CREATE INDEX "careers_content_course_sections_parent_id_idx" ON "careers_content_course_sections" USING btree ("_parent_id");
  CREATE INDEX "_careers_content_v_version_pathways_order_idx" ON "_careers_content_v_version_pathways" USING btree ("_order");
  CREATE INDEX "_careers_content_v_version_pathways_parent_id_idx" ON "_careers_content_v_version_pathways" USING btree ("_parent_id");
  CREATE INDEX "_careers_content_v_version_culture_order_idx" ON "_careers_content_v_version_culture" USING btree ("_order");
  CREATE INDEX "_careers_content_v_version_culture_parent_id_idx" ON "_careers_content_v_version_culture" USING btree ("_parent_id");
  CREATE INDEX "_careers_content_v_version_development_order_idx" ON "_careers_content_v_version_development" USING btree ("_order");
  CREATE INDEX "_careers_content_v_version_development_parent_id_idx" ON "_careers_content_v_version_development" USING btree ("_parent_id");
  CREATE INDEX "_careers_content_v_version_experience_points_order_idx" ON "_careers_content_v_version_experience_points" USING btree ("_order");
  CREATE INDEX "_careers_content_v_version_experience_points_parent_id_idx" ON "_careers_content_v_version_experience_points" USING btree ("_parent_id");
  CREATE INDEX "_careers_content_v_version_application_docs_order_idx" ON "_careers_content_v_version_application_docs" USING btree ("_order");
  CREATE INDEX "_careers_content_v_version_application_docs_parent_id_idx" ON "_careers_content_v_version_application_docs" USING btree ("_parent_id");
  CREATE INDEX "_careers_content_v_version_internship_tracks_order_idx" ON "_careers_content_v_version_internship_tracks" USING btree ("_order");
  CREATE INDEX "_careers_content_v_version_internship_tracks_parent_id_idx" ON "_careers_content_v_version_internship_tracks" USING btree ("_parent_id");
  CREATE INDEX "_careers_content_v_version_internship_eligibility_order_idx" ON "_careers_content_v_version_internship_eligibility" USING btree ("_order");
  CREATE INDEX "_careers_content_v_version_internship_eligibility_parent_id_idx" ON "_careers_content_v_version_internship_eligibility" USING btree ("_parent_id");
  CREATE INDEX "_careers_content_v_version_internship_documents_order_idx" ON "_careers_content_v_version_internship_documents" USING btree ("_order");
  CREATE INDEX "_careers_content_v_version_internship_documents_parent_id_idx" ON "_careers_content_v_version_internship_documents" USING btree ("_parent_id");
  CREATE INDEX "_careers_content_v_version_internship_structure_order_idx" ON "_careers_content_v_version_internship_structure" USING btree ("_order");
  CREATE INDEX "_careers_content_v_version_internship_structure_parent_id_idx" ON "_careers_content_v_version_internship_structure" USING btree ("_parent_id");
  CREATE INDEX "_careers_content_v_version_internship_selection_order_idx" ON "_careers_content_v_version_internship_selection" USING btree ("_order");
  CREATE INDEX "_careers_content_v_version_internship_selection_parent_id_idx" ON "_careers_content_v_version_internship_selection" USING btree ("_parent_id");
  CREATE INDEX "_careers_content_v_version_academy_audiences_order_idx" ON "_careers_content_v_version_academy_audiences" USING btree ("_order");
  CREATE INDEX "_careers_content_v_version_academy_audiences_parent_id_idx" ON "_careers_content_v_version_academy_audiences" USING btree ("_parent_id");
  CREATE INDEX "_careers_content_v_version_academy_levels_order_idx" ON "_careers_content_v_version_academy_levels" USING btree ("_order");
  CREATE INDEX "_careers_content_v_version_academy_levels_parent_id_idx" ON "_careers_content_v_version_academy_levels" USING btree ("_parent_id");
  CREATE INDEX "_careers_content_v_version_academy_delivery_order_idx" ON "_careers_content_v_version_academy_delivery" USING btree ("_order");
  CREATE INDEX "_careers_content_v_version_academy_delivery_parent_id_idx" ON "_careers_content_v_version_academy_delivery" USING btree ("_parent_id");
  CREATE INDEX "_careers_content_v_version_course_sections_order_idx" ON "_careers_content_v_version_course_sections" USING btree ("_order");
  CREATE INDEX "_careers_content_v_version_course_sections_parent_id_idx" ON "_careers_content_v_version_course_sections" USING btree ("_parent_id");
  CREATE INDEX "_careers_content_v_created_at_idx" ON "_careers_content_v" USING btree ("created_at");
  CREATE INDEX "_careers_content_v_updated_at_idx" ON "_careers_content_v" USING btree ("updated_at");
  CREATE INDEX "page_copy_home_priorities_order_idx" ON "page_copy_home_priorities" USING btree ("_order");
  CREATE INDEX "page_copy_home_priorities_parent_id_idx" ON "page_copy_home_priorities" USING btree ("_parent_id");
  CREATE INDEX "page_copy_solutions_priorities_order_idx" ON "page_copy_solutions_priorities" USING btree ("_order");
  CREATE INDEX "page_copy_solutions_priorities_parent_id_idx" ON "page_copy_solutions_priorities" USING btree ("_parent_id");
  CREATE INDEX "page_copy_solutions_framework_order_idx" ON "page_copy_solutions_framework" USING btree ("_order");
  CREATE INDEX "page_copy_solutions_framework_parent_id_idx" ON "page_copy_solutions_framework" USING btree ("_parent_id");
  CREATE INDEX "page_copy_resource_sections_order_idx" ON "page_copy_resource_sections" USING btree ("_order");
  CREATE INDEX "page_copy_resource_sections_parent_id_idx" ON "page_copy_resource_sections" USING btree ("_parent_id");
  CREATE INDEX "_page_copy_v_version_home_priorities_order_idx" ON "_page_copy_v_version_home_priorities" USING btree ("_order");
  CREATE INDEX "_page_copy_v_version_home_priorities_parent_id_idx" ON "_page_copy_v_version_home_priorities" USING btree ("_parent_id");
  CREATE INDEX "_page_copy_v_version_solutions_priorities_order_idx" ON "_page_copy_v_version_solutions_priorities" USING btree ("_order");
  CREATE INDEX "_page_copy_v_version_solutions_priorities_parent_id_idx" ON "_page_copy_v_version_solutions_priorities" USING btree ("_parent_id");
  CREATE INDEX "_page_copy_v_version_solutions_framework_order_idx" ON "_page_copy_v_version_solutions_framework" USING btree ("_order");
  CREATE INDEX "_page_copy_v_version_solutions_framework_parent_id_idx" ON "_page_copy_v_version_solutions_framework" USING btree ("_parent_id");
  CREATE INDEX "_page_copy_v_version_resource_sections_order_idx" ON "_page_copy_v_version_resource_sections" USING btree ("_order");
  CREATE INDEX "_page_copy_v_version_resource_sections_parent_id_idx" ON "_page_copy_v_version_resource_sections" USING btree ("_parent_id");
  CREATE INDEX "_page_copy_v_created_at_idx" ON "_page_copy_v" USING btree ("created_at");
  CREATE INDEX "_page_copy_v_updated_at_idx" ON "_page_copy_v" USING btree ("updated_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "solutions_blocks_capabilities_items" CASCADE;
  DROP TABLE "solutions_blocks_capabilities" CASCADE;
  DROP TABLE "solutions_blocks_bands_items_entries" CASCADE;
  DROP TABLE "solutions_blocks_bands_items" CASCADE;
  DROP TABLE "solutions_blocks_bands" CASCADE;
  DROP TABLE "solutions_blocks_layers_items" CASCADE;
  DROP TABLE "solutions_blocks_layers" CASCADE;
  DROP TABLE "solutions_blocks_sectors_items" CASCADE;
  DROP TABLE "solutions_blocks_sectors" CASCADE;
  DROP TABLE "solutions_blocks_measures_items" CASCADE;
  DROP TABLE "solutions_blocks_measures" CASCADE;
  DROP TABLE "solutions_blocks_steps_items" CASCADE;
  DROP TABLE "solutions_blocks_steps" CASCADE;
  DROP TABLE "solutions_blocks_checklist_items" CASCADE;
  DROP TABLE "solutions_blocks_checklist" CASCADE;
  DROP TABLE "solutions_blocks_models_items" CASCADE;
  DROP TABLE "solutions_blocks_models" CASCADE;
  DROP TABLE "solutions_outcomes" CASCADE;
  DROP TABLE "solutions" CASCADE;
  DROP TABLE "solutions_rels" CASCADE;
  DROP TABLE "_solutions_v_blocks_capabilities_items" CASCADE;
  DROP TABLE "_solutions_v_blocks_capabilities" CASCADE;
  DROP TABLE "_solutions_v_blocks_bands_items_entries" CASCADE;
  DROP TABLE "_solutions_v_blocks_bands_items" CASCADE;
  DROP TABLE "_solutions_v_blocks_bands" CASCADE;
  DROP TABLE "_solutions_v_blocks_layers_items" CASCADE;
  DROP TABLE "_solutions_v_blocks_layers" CASCADE;
  DROP TABLE "_solutions_v_blocks_sectors_items" CASCADE;
  DROP TABLE "_solutions_v_blocks_sectors" CASCADE;
  DROP TABLE "_solutions_v_blocks_measures_items" CASCADE;
  DROP TABLE "_solutions_v_blocks_measures" CASCADE;
  DROP TABLE "_solutions_v_blocks_steps_items" CASCADE;
  DROP TABLE "_solutions_v_blocks_steps" CASCADE;
  DROP TABLE "_solutions_v_blocks_checklist_items" CASCADE;
  DROP TABLE "_solutions_v_blocks_checklist" CASCADE;
  DROP TABLE "_solutions_v_blocks_models_items" CASCADE;
  DROP TABLE "_solutions_v_blocks_models" CASCADE;
  DROP TABLE "_solutions_v_version_outcomes" CASCADE;
  DROP TABLE "_solutions_v" CASCADE;
  DROP TABLE "_solutions_v_rels" CASCADE;
  DROP TABLE "services_capabilities" CASCADE;
  DROP TABLE "services_checklist" CASCADE;
  DROP TABLE "services_models" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "services_rels" CASCADE;
  DROP TABLE "_services_v_version_capabilities" CASCADE;
  DROP TABLE "_services_v_version_checklist" CASCADE;
  DROP TABLE "_services_v_version_models" CASCADE;
  DROP TABLE "_services_v" CASCADE;
  DROP TABLE "_services_v_rels" CASCADE;
  DROP TABLE "clients" CASCADE;
  DROP TABLE "clients_rels" CASCADE;
  DROP TABLE "_clients_v" CASCADE;
  DROP TABLE "_clients_v_rels" CASCADE;
  DROP TABLE "projects_tech" CASCADE;
  DROP TABLE "projects_scope" CASCADE;
  DROP TABLE "projects_delivered" CASCADE;
  DROP TABLE "projects_outcomes" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "projects_rels" CASCADE;
  DROP TABLE "_projects_v_version_tech" CASCADE;
  DROP TABLE "_projects_v_version_scope" CASCADE;
  DROP TABLE "_projects_v_version_delivered" CASCADE;
  DROP TABLE "_projects_v_version_outcomes" CASCADE;
  DROP TABLE "_projects_v" CASCADE;
  DROP TABLE "_projects_v_rels" CASCADE;
  DROP TABLE "events_program" CASCADE;
  DROP TABLE "events" CASCADE;
  DROP TABLE "_events_v_version_program" CASCADE;
  DROP TABLE "_events_v" CASCADE;
  DROP TABLE "post_categories" CASCADE;
  DROP TABLE "_post_categories_v" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "news" CASCADE;
  DROP TABLE "_news_v" CASCADE;
  DROP TABLE "downloads" CASCADE;
  DROP TABLE "_downloads_v" CASCADE;
  DROP TABLE "partner_categories" CASCADE;
  DROP TABLE "_partner_categories_v" CASCADE;
  DROP TABLE "partners" CASCADE;
  DROP TABLE "partners_rels" CASCADE;
  DROP TABLE "_partners_v" CASCADE;
  DROP TABLE "_partners_v_rels" CASCADE;
  DROP TABLE "jobs_responsibilities" CASCADE;
  DROP TABLE "jobs_required" CASCADE;
  DROP TABLE "jobs_preferred" CASCADE;
  DROP TABLE "jobs" CASCADE;
  DROP TABLE "_jobs_v_version_responsibilities" CASCADE;
  DROP TABLE "_jobs_v_version_required" CASCADE;
  DROP TABLE "_jobs_v_version_preferred" CASCADE;
  DROP TABLE "_jobs_v" CASCADE;
  DROP TABLE "academy_tracks" CASCADE;
  DROP TABLE "_academy_tracks_v" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "forms_blocks_checkbox" CASCADE;
  DROP TABLE "forms_blocks_country" CASCADE;
  DROP TABLE "forms_blocks_email" CASCADE;
  DROP TABLE "forms_blocks_message" CASCADE;
  DROP TABLE "forms_blocks_number" CASCADE;
  DROP TABLE "forms_blocks_select_options" CASCADE;
  DROP TABLE "forms_blocks_select" CASCADE;
  DROP TABLE "forms_blocks_state" CASCADE;
  DROP TABLE "forms_blocks_text" CASCADE;
  DROP TABLE "forms_blocks_textarea" CASCADE;
  DROP TABLE "forms_emails" CASCADE;
  DROP TABLE "forms" CASCADE;
  DROP TABLE "form_submissions_submission_data" CASCADE;
  DROP TABLE "form_submissions" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_nav" CASCADE;
  DROP TABLE "site_settings_social" CASCADE;
  DROP TABLE "site_settings_impact" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "company_values" CASCADE;
  DROP TABLE "company_journey" CASCADE;
  DROP TABLE "company_differentiators" CASCADE;
  DROP TABLE "company_delivery" CASCADE;
  DROP TABLE "company_industries" CASCADE;
  DROP TABLE "company_sustainability" CASCADE;
  DROP TABLE "company_executive_roles" CASCADE;
  DROP TABLE "company" CASCADE;
  DROP TABLE "_company_v_version_values" CASCADE;
  DROP TABLE "_company_v_version_journey" CASCADE;
  DROP TABLE "_company_v_version_differentiators" CASCADE;
  DROP TABLE "_company_v_version_delivery" CASCADE;
  DROP TABLE "_company_v_version_industries" CASCADE;
  DROP TABLE "_company_v_version_sustainability" CASCADE;
  DROP TABLE "_company_v_version_executive_roles" CASCADE;
  DROP TABLE "_company_v" CASCADE;
  DROP TABLE "contact_details_office" CASCADE;
  DROP TABLE "contact_details_phones" CASCADE;
  DROP TABLE "contact_details_emails" CASCADE;
  DROP TABLE "contact_details_hours" CASCADE;
  DROP TABLE "contact_details_inquiry_categories" CASCADE;
  DROP TABLE "contact_details" CASCADE;
  DROP TABLE "_contact_details_v_version_office" CASCADE;
  DROP TABLE "_contact_details_v_version_phones" CASCADE;
  DROP TABLE "_contact_details_v_version_emails" CASCADE;
  DROP TABLE "_contact_details_v_version_hours" CASCADE;
  DROP TABLE "_contact_details_v_version_inquiry_categories" CASCADE;
  DROP TABLE "_contact_details_v" CASCADE;
  DROP TABLE "careers_content_pathways" CASCADE;
  DROP TABLE "careers_content_culture" CASCADE;
  DROP TABLE "careers_content_development" CASCADE;
  DROP TABLE "careers_content_experience_points" CASCADE;
  DROP TABLE "careers_content_application_docs" CASCADE;
  DROP TABLE "careers_content_internship_tracks" CASCADE;
  DROP TABLE "careers_content_internship_eligibility" CASCADE;
  DROP TABLE "careers_content_internship_documents" CASCADE;
  DROP TABLE "careers_content_internship_structure" CASCADE;
  DROP TABLE "careers_content_internship_selection" CASCADE;
  DROP TABLE "careers_content_academy_audiences" CASCADE;
  DROP TABLE "careers_content_academy_levels" CASCADE;
  DROP TABLE "careers_content_academy_delivery" CASCADE;
  DROP TABLE "careers_content_course_sections" CASCADE;
  DROP TABLE "careers_content" CASCADE;
  DROP TABLE "_careers_content_v_version_pathways" CASCADE;
  DROP TABLE "_careers_content_v_version_culture" CASCADE;
  DROP TABLE "_careers_content_v_version_development" CASCADE;
  DROP TABLE "_careers_content_v_version_experience_points" CASCADE;
  DROP TABLE "_careers_content_v_version_application_docs" CASCADE;
  DROP TABLE "_careers_content_v_version_internship_tracks" CASCADE;
  DROP TABLE "_careers_content_v_version_internship_eligibility" CASCADE;
  DROP TABLE "_careers_content_v_version_internship_documents" CASCADE;
  DROP TABLE "_careers_content_v_version_internship_structure" CASCADE;
  DROP TABLE "_careers_content_v_version_internship_selection" CASCADE;
  DROP TABLE "_careers_content_v_version_academy_audiences" CASCADE;
  DROP TABLE "_careers_content_v_version_academy_levels" CASCADE;
  DROP TABLE "_careers_content_v_version_academy_delivery" CASCADE;
  DROP TABLE "_careers_content_v_version_course_sections" CASCADE;
  DROP TABLE "_careers_content_v" CASCADE;
  DROP TABLE "page_copy_home_priorities" CASCADE;
  DROP TABLE "page_copy_solutions_priorities" CASCADE;
  DROP TABLE "page_copy_solutions_framework" CASCADE;
  DROP TABLE "page_copy_resource_sections" CASCADE;
  DROP TABLE "page_copy" CASCADE;
  DROP TABLE "_page_copy_v_version_home_priorities" CASCADE;
  DROP TABLE "_page_copy_v_version_solutions_priorities" CASCADE;
  DROP TABLE "_page_copy_v_version_solutions_framework" CASCADE;
  DROP TABLE "_page_copy_v_version_resource_sections" CASCADE;
  DROP TABLE "_page_copy_v" CASCADE;
  DROP TYPE "public"."enum_solutions_status";
  DROP TYPE "public"."enum__solutions_v_version_status";
  DROP TYPE "public"."enum_services_status";
  DROP TYPE "public"."enum__services_v_version_status";
  DROP TYPE "public"."enum_clients_sector";
  DROP TYPE "public"."enum_clients_status";
  DROP TYPE "public"."enum__clients_v_version_sector";
  DROP TYPE "public"."enum__clients_v_version_status";
  DROP TYPE "public"."enum_projects_sector";
  DROP TYPE "public"."enum_projects_year_status";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum__projects_v_version_sector";
  DROP TYPE "public"."enum__projects_v_version_year_status";
  DROP TYPE "public"."enum__projects_v_version_status";
  DROP TYPE "public"."enum_events_format";
  DROP TYPE "public"."enum_events_status";
  DROP TYPE "public"."enum__events_v_version_format";
  DROP TYPE "public"."enum__events_v_version_status";
  DROP TYPE "public"."enum_post_categories_status";
  DROP TYPE "public"."enum__post_categories_v_version_status";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum_news_date_status";
  DROP TYPE "public"."enum_news_status";
  DROP TYPE "public"."enum__news_v_version_date_status";
  DROP TYPE "public"."enum__news_v_version_status";
  DROP TYPE "public"."enum_downloads_status";
  DROP TYPE "public"."enum__downloads_v_version_status";
  DROP TYPE "public"."enum_partner_categories_status";
  DROP TYPE "public"."enum__partner_categories_v_version_status";
  DROP TYPE "public"."enum_partners_status";
  DROP TYPE "public"."enum__partners_v_version_status";
  DROP TYPE "public"."enum_jobs_level";
  DROP TYPE "public"."enum_jobs_deadline_status";
  DROP TYPE "public"."enum_jobs_status";
  DROP TYPE "public"."enum__jobs_v_version_level";
  DROP TYPE "public"."enum__jobs_v_version_deadline_status";
  DROP TYPE "public"."enum__jobs_v_version_status";
  DROP TYPE "public"."enum_academy_tracks_status";
  DROP TYPE "public"."enum__academy_tracks_v_version_status";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_forms_confirmation_type";
  DROP TYPE "public"."enum_company_executive_roles_holder_status";
  DROP TYPE "public"."enum__company_v_version_executive_roles_holder_status";
  DROP TYPE "public"."enum_careers_content_internship_schedule_status";
  DROP TYPE "public"."enum_careers_content_internship_deadline_status";
  DROP TYPE "public"."enum__careers_content_v_version_internship_schedule_status";
  DROP TYPE "public"."enum__careers_content_v_version_internship_deadline_status";`)
}
