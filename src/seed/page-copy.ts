import { COMPANY } from "../../design-src/highland/content.mjs";

/*
 * The page heroes and the solutions overview's two lists.
 *
 * Highland wrote these inline in its page templates -- pageHead({ eyebrow,
 * title, intro }) in design-src/highland/pages/*.mjs, and the home page's own
 * hero markup -- rather than in the content modules the seed imports. They are
 * approved copy all the same, so they have to reach the CMS, and the CMS wants
 * them as data.
 *
 * Every string below was extracted from those templates by script, not
 * retyped: twenty-two strings of client-approved copy is more than enough for
 * a transcription slip, and a slip here is a wrong sentence on a page rather
 * than a crash. HTML entities were decoded, because this layer stores plain
 * text and the renderer escapes. The template's line wrapping was collapsed to
 * single spaces.
 *
 * Where to change one of these: here, then reseed -- or, once the site is
 * live, in the admin under Page copy, which is the point of the global.
 *
 * Provenance, one per hero:
 *   home        pages/home.mjs        (bespoke hero markup, two paragraphs)
 *   solutions   pages/solutions.mjs   pageHead
 *   about       pages/about.mjs       pageHead
 *   services    pages/services.mjs    pageHead
 *   clients     pages/clients.mjs     pageHead
 *   partners    pages/partners.mjs    pageHead
 *   resources   pages/resources.mjs   pageHead
 *   PRIORITIES  pages/solutions.mjs   the five-item list, NOT content.mjs's six
 *   FRAMEWORK   pages/solutions.mjs   the six delivery stages
 */
export const HEROES = {
  home: {
    eyebrow: "Addis Ababa · Serving Ethiopia and beyond",
    title: "Accelerating Africa's digital transformation",
    intro:
      "Edge Comm-Tech designs, delivers, and supports secure, scalable, intelligent, and future-ready technology solutions for financial institutions, government organizations, educational institutions, and enterprises.",
    introSecondary:
      "From enterprise networks and AI-ready infrastructure to cloud, cybersecurity, software, intelligent automation, power, and broadcast technologies, we help organizations modernize with confidence.",
  },
  solutions: {
    eyebrow: "Solutions and services",
    title: "Technology that works together",
    intro:
      "Edge Comm-Tech delivers integrated technology solutions that connect infrastructure, data, applications, security, operations, and people. We help organizations modernize with architectures designed for performance, resilience, security, scalability, and long-term value.",
  },
  about: {
    eyebrow: "About Edge Comm-Tech",
    title: "Engineering technology, enabling progress",
    intro: `${COMPANY.short} is Ethiopia's trusted end-to-end technology solutions and systems-integration partner, delivering secure, scalable, intelligent, and future-ready solutions across Ethiopia and beyond.`,
  },
  services: {
    eyebrow: "Professional services",
    title: "Services that turn technology into operational value",
    intro:
      "Technology delivers value when it is correctly specified, properly sourced, carefully implemented, well managed, reliably supported and genuinely understood by the people who use it. Edge Comm-Tech provides services across that entire lifecycle.",
  },
  clients: {
    eyebrow: "Clients",
    title: "Trusted where reliability is not negotiable",
    intro:
      "Banks, universities, ministries and public institutions choose Edge Comm-Tech because their systems have to work. Our client relationships are built on careful delivery, documentation, training and support that continues after handover.",
  },
  partners: {
    eyebrow: "Partner network",
    title: "Global technology, delivered and supported locally",
    intro:
      "Edge Comm-Tech works with more than 40 global vendors, original equipment manufacturers and distributors. Those relationships give our clients access to proven platforms, vendor-aligned implementation and a clear escalation path — with Edge Comm-Tech accountable for the delivered outcome.",
  },
  resources: {
    eyebrow: "Resource centre",
    title: "News, events, media and documents in one place",
    intro:
      "Company announcements, technology events and webinars, media material and the documents clients and tender committees ask for most.",
  },
};

/*
 * The solutions overview's own five priorities. content.mjs exports a
 * different six-item PRIORITIES for the home page, with different wording.
 * The two are separate in the content master and separate here.
 */
export const SOLUTIONS_PRIORITIES = [
  {
    title: "AI-ready and data-driven",
    body: "Infrastructure and platforms prepared for analytics, automation, enterprise AI, and growing data workloads.",
  },
  {
    title: "Hybrid and interoperable",
    body: "Architectures that connect on-premises, cloud, edge, applications, devices, and existing investments.",
  },
  {
    title: "Secure by design",
    body: "Identity-centered controls, least privilege, monitoring, resilience, recovery, and responsible data handling.",
  },
  {
    title: "Operationally resilient",
    body: "Redundancy, business continuity, backup, disaster recovery, power protection, environmental control, and support.",
  },
  {
    title: "Sustainable by lifecycle",
    body: "Energy efficiency, maintainability, monitoring, responsible sourcing, electronic-waste considerations, and long-term value.",
  },
];

/* The six-stage framework on the solutions overview. */
export const SOLUTIONS_FRAMEWORK = [
  {
    title: "Discover",
    body: "Understand business priorities, users, data, risks, current systems, dependencies, and desired outcomes.",
  },
  {
    title: "Design",
    body: "Develop secure, scalable, interoperable, and commercially practical architectures.",
  },
  {
    title: "Source",
    body: "Coordinate suitable technologies through qualified vendors, OEMs, and distributors.",
  },
  {
    title: "Implement",
    body: "Manage logistics, installation, configuration, integration, testing, documentation, and acceptance.",
  },
  {
    title: "Enable",
    body: "Provide training, knowledge transfer, handover documentation, and operational guidance.",
  },
  {
    title: "Support & optimize",
    body: "Maintain availability, address incidents, improve performance, manage upgrades, and prepare for growth.",
  },
];

/*
 * The partner ring's short category labels. Highland wrote them by hand in
 * pages/partners.mjs (RING) so ten of them fit round a circle without
 * colliding; they are not derivable from the long names, which an earlier seed
 * tried -- see ring-labels.test.ts.
 */
export const RING_LABELS: Record<string, string> = {
  "software-ai": "Software & AI",
  network: "Network",
  "system-cloud": "Compute & Cloud",
  datacenter: "Datacenter",
  security: "Security",
  power: "Power",
  education: "Smart education",
  broadcast: "Broadcast",
  ev: "EV charging",
  distribution: "Distribution",
};

export function ringLabelFor(key: string): string {
  const label = RING_LABELS[key];
  if (!label) {
    throw new Error(
      `No ring label for partner category "${key}". Add it to RING_LABELS in src/seed/page-copy.ts.`,
    );
  }
  return label;
}
