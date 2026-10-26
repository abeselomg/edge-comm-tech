import type { GlobalConfig } from "payload";
import { contentStaff } from "../access";
import { forbidsPhrases } from "../fields/validators";
import { revalidateGlobal } from "../hooks/revalidate";

const titledBody = [
  { name: "title", type: "text", required: true, validate: forbidsPhrases() },
  {
    name: "body",
    type: "textarea",
    required: true,
    validate: forbidsPhrases(),
  },
] as const;

const hero = (label: string) => ({
  name: "hero",
  type: "group" as const,
  label,
  fields: [
    {
      name: "eyebrow",
      type: "text" as const,
      required: true,
      validate: forbidsPhrases(),
    },
    {
      name: "title",
      type: "text" as const,
      required: true,
      validate: forbidsPhrases(),
    },
    {
      name: "intro",
      type: "textarea" as const,
      required: true,
      validate: forbidsPhrases(),
    },
  ],
});

const HOME_HERO = hero("Home hero");

/*
 * Page-level copy that is not a collection document: the heroes and section
 * intros for the pages assembled from several collections.
 *
 * The home page's technology priorities and the solutions overview's are
 * DIFFERENT LISTS in the master -- six and five, with different wording. They
 * are stored separately here on purpose. Collapsing them to one list would put
 * the wrong wording on one of the two pages, which is the kind of tidying that
 * looks like a refactor and is a content error.
 */
export const PageCopy: GlobalConfig = {
  slug: "page-copy",
  label: "Page copy",
  admin: {
    group: "Site",
    description:
      "Headings and intros for the pages built from several collections.",
  },
  access: { read: () => true, update: contentStaff },
  versions: { drafts: false },
  hooks: {
    afterChange: [
      revalidateGlobal([
        "/",
        "/about",
        "/solutions",
        "/services",
        "/resources",
        "/clients",
        "/partners",
      ], false, ["/projects/[slug]", "/resources/media/[slug]"]),
    ],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Home",
          fields: [
            {
              /*
               * The home hero carries two paragraphs, not one: the template
               * renders the first at text-lg and the second a size down, as
               * two distinct slots. One textarea holding both would either
               * lose the second or set it at the wrong size, so the second
               * gets its own field.
               */
              ...HOME_HERO,
              name: "homeHero",
              fields: [
                ...HOME_HERO.fields,
                {
                  name: "introSecondary",
                  type: "textarea",
                  required: true,
                  admin: {
                    description:
                      "The smaller paragraph under the intro. The home hero shows both.",
                  },
                  validate: forbidsPhrases(),
                },
              ],
            },
            {
              name: "homePriorities",
              type: "array",
              labels: {
                singular: "Priority",
                plural: "Technology priorities (home)",
              },
              admin: {
                description:
                  "The home page's own list. The solutions overview has a separate, differently worded list — do not merge them.",
              },
              fields: [...titledBody],
            },
          ],
        },
        {
          label: "Solutions overview",
          fields: [
            { ...hero("Solutions hero"), name: "solutionsHero" },
            {
              name: "solutionsPriorities",
              type: "array",
              labels: {
                singular: "Priority",
                plural: "Technology priorities (solutions)",
              },
              admin: {
                description:
                  "The solutions overview's own list. Not the home page's.",
              },
              fields: [...titledBody],
            },
            {
              name: "solutionsFramework",
              type: "array",
              labels: { singular: "Stage", plural: "Delivery framework" },
              admin: {
                description:
                  "The six-step framework on this page. The Company global's five-stage delivery list is a different thing.",
              },
              fields: [...titledBody],
            },
          ],
        },
        {
          label: "Other pages",
          fields: [
            { ...hero("About hero"), name: "aboutHero" },
            { ...hero("Services hero"), name: "servicesHero" },
            { ...hero("Clients hero"), name: "clientsHero" },
            { ...hero("Partners hero"), name: "partnersHero" },
            { ...hero("Resources hero"), name: "resourcesHero" },
          ],
        },
        {
          label: "Shared copy",
          fields: [
            {
              name: "projectImplementationNote",
              type: "textarea",
              admin: {
                description:
                  "The paragraph describing how Edge coordinates delivery, shown on every project page. One copy here rather than repeated on all eight records, so correcting it is one edit.",
              },
              validate: forbidsPhrases(),
            },
          ],
        },
        {
          label: "Resource sections",
          fields: [
            {
              name: "resourceSections",
              type: "array",
              minRows: 1,
              labels: { singular: "Section", plural: "Resource sections" },
              admin: {
                description:
                  "The six sections of the resource centre, in order.",
              },
              fields: [
                {
                  name: "key",
                  type: "text",
                  required: true,
                  validate: forbidsPhrases(),
                },
                {
                  name: "title",
                  type: "text",
                  required: true,
                  validate: forbidsPhrases(),
                },
                {
                  name: "href",
                  type: "text",
                  required: true,
                  admin: {
                    description:
                      "Route, e.g. /news or /resources/media/documentaries.",
                  },
                  validate: forbidsPhrases(),
                },
                {
                  name: "body",
                  type: "textarea",
                  required: true,
                  validate: forbidsPhrases(),
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
