import { getPayload } from "payload";
import config from "../payload.config";

import { partnerSeeds } from "./data/partners";
import { solutionSeeds } from "./data/solutions";
import { sectorSeeds } from "./data/sectors";
import { courseSeeds } from "./data/courses";
import { companyPageSeed, homePageSeed, jobSeeds, siteSettingsSeed } from "./data/globals";
import { p, rich } from "./lexical";

/**
 * Rebuilds the seeded content. Safe to re-run: seeded collections are cleared
 * first, so this is a reset rather than an append.
 *
 * Editorial rule enforced here: anything asserting a fact Edge has not
 * confirmed is seeded unpublished. Open roles are drafts because we cannot
 * confirm Edge is hiring; proof statistics and contact details carry a
 * `verified: false` flag that the front end checks before rendering.
 */

const COLLECTIONS = ["solutions", "sectors", "projects", "partners", "courses", "jobs", "news"] as const;

async function seed() {
  const payload = await getPayload({ config });

  payload.logger.info("Clearing seeded collections…");
  for (const collection of COLLECTIONS) {
    await payload.delete({ collection, where: { id: { exists: true } } });
  }
  await payload.delete({ collection: "forms", where: { title: { equals: "Contact" } } });

  /* ------------------------------------------------------------- partners */

  payload.logger.info("Seeding partners…");
  const partnerIds = new Map<string, number>();
  for (const partner of partnerSeeds) {
    const doc = await payload.create({
      collection: "partners",
      data: { ...partner, _status: "published" },
    });
    partnerIds.set(partner.name, doc.id);
  }

  /* ------------------------------------------------------------ solutions */

  payload.logger.info("Seeding solution domains…");
  const solutionIds = new Map<string, number>();
  for (const solution of solutionSeeds) {
    const { partnerNames, capabilities, scopeOfWork, deliverables, ...rest } = solution;
    const doc = await payload.create({
      collection: "solutions",
      data: {
        ...rest,
        capabilities,
        scopeOfWork: scopeOfWork.map((item) => ({ item })),
        deliverables: deliverables.map((item) => ({ item })),
        technologies: partnerNames
          .map((name) => partnerIds.get(name))
          .filter((id): id is number => typeof id === "number"),
        _status: "published",
      },
    });
    solutionIds.set(solution.slug, doc.id);
  }

  /* -------------------------------------------------------------- sectors */

  payload.logger.info("Seeding sectors…");
  for (const sector of sectorSeeds) {
    const { solutionSlugs, ...rest } = sector;
    await payload.create({
      collection: "sectors",
      data: {
        ...rest,
        solutions: solutionSlugs
          .map((slug) => solutionIds.get(slug))
          .filter((id): id is number => typeof id === "number"),
        _status: "published",
      },
    });
  }

  /* -------------------------------------------------------------- courses */

  payload.logger.info("Seeding E-Academy courses…");
  const courseIds = new Map<string, number>();
  for (const course of courseSeeds) {
    const { solutionSlugs, outcomes, modules, ...rest } = course;
    const doc = await payload.create({
      collection: "courses",
      data: {
        ...rest,
        outcomes: outcomes.map((item) => ({ item })),
        modules: modules.map((mod) => ({
          title: mod.title,
          summary: mod.summary,
          lessons: mod.lessons.map((lesson) => ({ ...lesson, videoUrl: "" })),
        })),
        relatedSolutions: solutionSlugs
          .map((slug) => solutionIds.get(slug))
          .filter((id): id is number => typeof id === "number"),
        _status: "published",
      },
    });
    courseIds.set(course.slug, doc.id);
  }

  /* ----------------------------------------------------------------- jobs */

  payload.logger.info("Seeding roles as drafts…");
  for (const job of jobSeeds) {
    const { relatedCourseSlugs, requirements, ...rest } = job;
    await payload.create({
      collection: "jobs",
      data: {
        ...rest,
        requirements: requirements.map((item) => ({ item })),
        relatedCourses: relatedCourseSlugs
          .map((slug) => courseIds.get(slug))
          .filter((id): id is number => typeof id === "number"),
        // Draft: we cannot confirm Edge is currently recruiting for these roles.
        _status: "draft",
      },
    });
  }

  /* ---------------------------------------------------------- contact form */

  payload.logger.info("Creating the contact form…");
  await payload.create({
    collection: "forms",
    data: {
      title: "Contact",
      submitButtonLabel: "Send enquiry",
      confirmationType: "message",
      confirmationMessage: rich(
        p("Thank you. Your message has reached us and an engineer will reply within one business day."),
      ),
      fields: [
        { blockType: "text", name: "name", label: "Name", required: true, width: 100 },
        { blockType: "email", name: "email", label: "Email", required: true, width: 100 },
        { blockType: "text", name: "organization", label: "Organization", required: false, width: 100 },
        {
          blockType: "select",
          name: "domain",
          label: "What is this about?",
          required: false,
          width: 100,
          options: solutionSeeds.map((s) => ({ label: s.title, value: s.title })),
        },
        { blockType: "textarea", name: "message", label: "How can we help?", required: true, width: 100 },
      ],
    },
  });

  /* -------------------------------------------------------------- globals */

  payload.logger.info("Seeding globals…");
  await payload.updateGlobal({ slug: "home-page", data: homePageSeed });
  await payload.updateGlobal({
    slug: "company-page",
    data: {
      ...companyPageSeed,
      outcomes: companyPageSeed.outcomes.map((item) => ({ item })),
    },
  });
  await payload.updateGlobal({ slug: "site-settings", data: siteSettingsSeed });

  payload.logger.info("Seed complete.");
  payload.logger.info(
    `Published: ${partnerSeeds.length} partners, ${solutionSeeds.length} solutions, ${sectorSeeds.length} sectors, ${courseSeeds.length} courses.`,
  );
  payload.logger.info(
    `Unpublished on purpose: ${jobSeeds.length} roles (drafts), proof statistics and contact details (verified = false).`,
  );

  process.exit(0);
}

await seed();
