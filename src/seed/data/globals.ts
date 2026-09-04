import { h2, p, rich } from "../lexical";

/**
 * Brand-layer copy.
 *
 * Everything here is Edge's own material or a neutral, factual placeholder —
 * nothing is carried over from another company's site. Anything that asserts a
 * fact Edge has not confirmed (headcount, years operating, phone numbers) is
 * seeded with `verified: false` so the public site does not render it.
 */

export const homePageSeed = {
  tagline: "Designed, commissioned, supported.",
  heroStatement:
    "Edge COMM-TECH is an integrated technology and systems integration partner, building the infrastructure Ethiopian enterprises depend on and staying with it afterwards.",
  primaryCta: { label: "Explore solutions", href: "/solutions" },
  secondaryCta: { label: "Talk to an expert", href: "/contact" },
  proofStats: [
    { value: "—", label: "Years operating", verified: false },
    { value: "—", label: "Engineers on staff", verified: false },
    { value: "—", label: "Projects delivered", verified: false },
  ],
  methodTitle: "How we work",
  method: [
    {
      title: "Assess",
      body: "We start by measuring what you have — load, traffic, utilisation, and risk — because a design built on assumptions is a design that fails commissioning.",
    },
    {
      title: "Design",
      body: "Documented high-level and low-level designs, issued for your review before anything is ordered. If you cannot review the design, you cannot hold anyone to it.",
    },
    {
      title: "Deliver",
      body: "Certified engineers, agreed change windows, and a commissioning test that proves the build matches the design before we ask for sign-off.",
    },
    {
      title: "Support",
      body: "Monitoring, maintenance, and knowledge transfer under a written SLA. The contract that builds it is the contract that keeps it running.",
    },
  ],
  solutionsIntro: "Six integrated technology domains",
  sectorsIntro: "Built for sectors where downtime is not an option",
};

export const companyPageSeed = {
  heading: "The company",
  intro:
    "Edge Communication Technologies is an integrated technology solutions and systems integration partner based in Addis Ababa. We design, build, and support the infrastructure that enterprises, financial institutions, and public bodies run on.",
  commitment:
    "We work across the full lifecycle rather than at a single point in it: assessing what an organization has, designing what it needs, commissioning the result, and supporting it afterwards. That continuity is deliberate — most of the failures we are called in to fix originate in a handover where nobody owned what came next.",
  body: rich(
    p(
      "Technology work in Ethiopia has a particular shape. Power is not guaranteed, connectivity varies by site, procurement is scrutinised, and skilled engineers are in short supply and high demand. A design imported unchanged from elsewhere tends to meet at least one of those realities badly.",
    ),
    h2("What we do differently"),
    p(
      "We commission rather than install. An installation is finished when the equipment is racked and powered; a commissioning is finished when the system has been tested against the design and the results are written down. The second one is what you can hold a supplier to two years later.",
    ),
    p(
      "We document as a deliverable, not as a favour. Every engagement ends with as-built drawings, configuration backups, tested evidence, and a handover session — because the engineer who inherits the system is rarely the one who was in the room.",
    ),
    h2("Building capability, not dependency"),
    p(
      "Our E-Academy is free and open, with no account required. Some of it exists to prepare candidates who want to work here. Most of it exists because clients who understand their own infrastructure are better clients, and because the shortage of trained engineers in this market is a problem worth chipping away at.",
    ),
  ),
  values: [
    {
      title: "Commission, do not just install",
      body: "A system is delivered when it has been tested against its design and the results are documented — not when the equipment is racked and the invoice is raised.",
    },
    {
      title: "Write it down",
      body: "As-built drawings, cable schedules, configuration backups, and runbooks are part of the deliverable. A system that only one person can operate is a liability we refuse to hand over.",
    },
    {
      title: "One team from design to support",
      body: "The people who designed a system stay reachable once it is running. Continuity removes the handover gap where most long-running faults are born.",
    },
    {
      title: "Transfer the knowledge",
      body: "We would rather a client could operate what we built without us. Training and documentation are contractual, not an upsell.",
    },
  ],
  outcomes: [
    "Infrastructure that meets a stated availability target rather than an informal promise",
    "Documentation complete enough for a new engineer to operate the system",
    "Security controls that produce audit evidence as a by-product",
    "A recovery capability that has actually been tested",
    "A named support path with response targets in writing",
  ],
  founded: { year: "", detail: "", verified: false },
};

export const siteSettingsSeed = {
  nav: [
    { label: "Solutions", href: "/solutions" },
    { label: "Sectors", href: "/clients" },
    { label: "Projects", href: "/projects" },
    { label: "Partners", href: "/partners" },
    { label: "E-Academy", href: "/academy" },
    { label: "Company", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  headerCta: { label: "Book a consultation", href: "/contact" },
  contact: {
    phone: "",
    secondaryPhone: "",
    email: "",
    address: "",
    mapUrl: "",
    verified: false,
  },
  social: [],
  footerNote:
    "Integrated technology solutions and systems integration — data center, cybersecurity, network, cloud, and professional services.",
};

export const jobSeeds = [
  {
    title: "Network engineer",
    slug: "network-engineer",
    team: "Infrastructure",
    location: "Addis Ababa, Ethiopia",
    type: "full-time" as const,
    summary:
      "Design, configure, and commission campus, wireless, and wide-area networks for enterprise and public-sector clients.",
    description: rich(
      p(
        "You will work on network designs from survey through to commissioning: campus switching, high-density wireless, routing, and branch connectivity. Expect to spend time on client sites, in change windows, and writing the documentation that goes with the build.",
      ),
      h2("What the role involves"),
      p(
        "Discovery and survey work, high-level and low-level design, configuration and cutover, post-installation validation, and handover. You will be supported by senior engineers but expected to own your own deliverables.",
      ),
    ),
    requirements: [
      "Working knowledge of switching, VLANs, and inter-VLAN routing",
      "Familiarity with at least one of OSPF or BGP in a production context",
      "Comfortable configuring enterprise wireless, or willing to learn it properly",
      "Able to write a design document someone else can follow",
      "Willing to work planned change windows outside business hours",
    ],
    relatedCourseSlugs: ["enterprise-network-fundamentals", "iam-fundamentals"],
  },
  {
    title: "Security analyst",
    slug: "security-analyst",
    team: "Cybersecurity",
    location: "Addis Ababa, Ethiopia",
    type: "full-time" as const,
    summary:
      "Monitor, triage, and investigate security events for clients, and help build the detection use cases behind them.",
    description: rich(
      p(
        "You will work in a security operations context: triaging alerts, investigating what actually happened, and recommending containment. You will also help design and tune the detections themselves, which is where the role gets interesting.",
      ),
      h2("What the role involves"),
      p(
        "Alert triage and investigation, timeline reconstruction, use-case development, tuning, and clear written reporting to clients who are not security specialists.",
      ),
    ),
    requirements: [
      "Understanding of authentication, directory services, and common attack paths",
      "Able to read logs across endpoint, network, and identity sources",
      "Clear written English — investigation reports are a client deliverable",
      "Methodical under pressure; able to preserve evidence before remediating",
      "Willing to participate in an on-call rotation",
    ],
    relatedCourseSlugs: ["security-operations-fundamentals", "iam-fundamentals"],
  },
  {
    title: "Data center engineer",
    slug: "data-center-engineer",
    team: "Critical systems",
    location: "Addis Ababa, Ethiopia",
    type: "full-time" as const,
    summary:
      "Build and commission the power, cooling, containment, and cabling systems that data rooms depend on.",
    description: rich(
      p(
        "You will work on the physical layer: power distribution, UPS and generator integration, precision cooling, containment, structured cabling, and physical security systems — from survey through commissioning and handover.",
      ),
      h2("What the role involves"),
      p(
        "Site surveys and load assessment, installation supervision, commissioning tests including load bank and thermal survey, cable certification, and as-built documentation.",
      ),
    ),
    requirements: [
      "Background in electrical, mechanical, or ICT infrastructure work",
      "Understanding of single-line electrical drawings",
      "Careful and methodical about labelling, testing, and documentation",
      "Comfortable coordinating subcontractors on an active site",
      "Willing to travel to client sites outside Addis Ababa",
    ],
    relatedCourseSlugs: ["data-center-facility-systems"],
  },
];
