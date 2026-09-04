export type Lesson = {
  slug: string;
  title: string;
  duration: string;
  body: string;
  videoUrl: string;
};

export type Module = {
  slug: string;
  title: string;
  summary: string;
  lessons: Lesson[];
};

export type Course = {
  slug: string;
  title: string;
  audience: string;
  duration: string;
  summary: string;
  relatedJobs: { title: string; href: string }[];
  modules: Module[];
};

export type Domain = {
  slug: string;
  code: string;
  title: string;
  headline: string;
  line: string;
  body: string;
};

export const nextFramework = [
  {
    letter: "N",
    title: "Navigate",
    body: "Understand where you are today and where technology is heading next.",
  },
  {
    letter: "E",
    title: "Enable",
    body: "Build the capabilities your organization needs for today and tomorrow.",
  },
  {
    letter: "X",
    title: "eXceed",
    body: "Move beyond current limitations and toward higher, global standards.",
  },
  {
    letter: "T",
    title: "Transform",
    body: "Turn technology into real business progress and sustainable outcomes.",
  },
];

export const journey = [
  {
    title: "Solve",
    body: "We solve today’s challenges with designs that can be commissioned, not decks that stall at handover.",
  },
  {
    title: "Equip",
    body: "We build the capabilities your organization needs to grow, adapt and scale into tomorrow.",
  },
  {
    title: "Advance",
    body: "We move you toward higher levels of technology maturity and globally recognized standards.",
  },
];

export const domains: Domain[] = [
  {
    slug: "data-center-critical-systems",
    code: "9.1",
    title: "Data Center & Critical Systems",
    headline: "Build the foundation. Enable the future.",
    line: "The physical and critical infrastructure required to operate reliable, secure and resilient IT environments — from power and cooling to racks, cabling and physical security.",
    body: "Edge COMM-TECH designs and builds data-center facilities and IT rooms to named tiers, with industry materials, power, cooling, raised floor, containment, and physical security (CCTV, access control, barriers) treated as part of the same drawing — not a bolt-on after the racks land.",
  },
  {
    slug: "cybersecurity-digital-resilience",
    code: "9.2",
    title: "Cybersecurity & Digital Resilience",
    headline: "Think ahead. Stay protected.",
    line: "Integrated security across users, endpoints, networks, applications, identities and data — so you can prevent, detect, respond to and recover from incidents.",
    body: "A complete portfolio of network and data security, plus the staff who run it. We build carrier-grade NOC and SOC capability: prevent, detect, respond, recover — not a firewall SKU on a quote.",
  },
  {
    slug: "enterprise-network-connectivity",
    code: "9.3",
    title: "Enterprise Network & Connectivity",
    headline: "Connect today. Prepare for what’s next.",
    line: "Secure, reliable, high-performance connectivity — designed, implemented and modernized to connect users, branches, data centers, cloud and digital services.",
    body: "LAN, WLAN, WAN, and unified communications (voice, presence, chat, mobile, data) as one system. Voice, data and internet plans are integrated end to end as fully managed services, with partners including Cisco, Huawei and Juniper.",
  },
  {
    slug: "compute-cloud-data",
    code: "9.4",
    title: "Compute, Cloud & Data Platforms",
    headline: "Think next. Build for tomorrow.",
    line: "Computing and data environments with the performance, scalability and availability modern organizations need — across virtualization, private, hybrid cloud and modern data platforms.",
    body: "Servers, storage, virtualization and cloud operating models (IaaS, PaaS, SaaS) that match how the business actually runs. We implement and support the stack — Dell, Microsoft and others — so compute is not a one-off purchase.",
  },
  {
    slug: "business-applications",
    code: "9.5",
    title: "Business Applications & Transformation",
    headline: "Transform today. Enable tomorrow.",
    line: "Technology creates the most value when it improves how you operate. We align enterprise applications, automation and integration with real business outcomes.",
    body: "Custom solutions for residences, organizations and factories sit next to the infrastructure: the point is how people work after go-live, not a software catalogue. Integration and process come after the room is stable.",
  },
  {
    slug: "professional-services",
    code: "9.6",
    title: "Professional Services",
    headline: "From assessment to knowledge transfer.",
    line: "End-to-end services across the complete technology lifecycle — ensuring investments are aligned, implemented effectively, optimized, and supported for sustainable operation.",
    body: "Certified network and system engineers for design, configuration and troubleshooting. Remote and on-site IT helpdesk for enterprise infrastructure, servers, software and systems. Continuous follow-up and after-sales — the same contract as the build.",
  },
];

export const proof = [
  { value: "6", label: "Core solution domains" },
  { value: "Named", label: "Global technology partners" },
  { value: "4", label: "Critical sectors served" },
];

export type PartnerCategory = "data-center" | "cloud" | "network" | "cyber" | "applications";

export const partnerFilters: { id: "all" | PartnerCategory; label: string }[] = [
  { id: "all", label: "All partners" },
  { id: "data-center", label: "Data Center" },
  { id: "cloud", label: "Cloud & Data" },
  { id: "network", label: "Network" },
  { id: "cyber", label: "Cybersecurity" },
  { id: "applications", label: "Applications" },
];

/** ring 0 = inner orbit, 1 = outer */
export const networkPartners: {
  name: string;
  label: string;
  category: PartnerCategory;
  ring: 0 | 1;
}[] = [
  { name: "Cisco", label: "Networking", category: "network", ring: 0 },
  { name: "Hikvision", label: "Surveillance", category: "data-center", ring: 0 },
  { name: "Vertiv", label: "Critical systems", category: "data-center", ring: 0 },
  { name: "Dell Technologies", label: "Compute", category: "cloud", ring: 0 },
  { name: "HPE", label: "Servers", category: "cloud", ring: 0 },
  { name: "Rittal", label: "Racks", category: "data-center", ring: 0 },
  { name: "Huawei", label: "Campus", category: "network", ring: 0 },
  { name: "Microsoft", label: "Cloud", category: "cloud", ring: 0 },
  { name: "Canovate", label: "Cabling", category: "data-center", ring: 0 },
  { name: "ZKTeco", label: "Access control", category: "data-center", ring: 0 },
  { name: "Eaton", label: "Power", category: "data-center", ring: 0 },
  { name: "Schneider", label: "UPS", category: "data-center", ring: 0 },
  { name: "HPE Aruba", label: "Wireless & LAN", category: "network", ring: 1 },
  { name: "Juniper", label: "Routing", category: "network", ring: 1 },
  { name: "Fortinet", label: "Secure net", category: "cyber", ring: 1 },
  { name: "Palo Alto", label: "Firewall", category: "cyber", ring: 1 },
  { name: "CrowdStrike", label: "Endpoint", category: "cyber", ring: 1 },
  { name: "Veeam", label: "Data protection", category: "cloud", ring: 1 },
  { name: "Nutanix", label: "HCI", category: "cloud", ring: 1 },
  { name: "VMware", label: "Virtualization", category: "cloud", ring: 1 },
  { name: "Oracle", label: "Database", category: "applications", ring: 1 },
  { name: "SAP", label: "ERP", category: "applications", ring: 1 },
  { name: "Salesforce", label: "CRM", category: "applications", ring: 1 },
  { name: "ServiceNow", label: "Workflow", category: "applications", ring: 1 },
  { name: "OpenText", label: "Content", category: "applications", ring: 1 },
  { name: "Lenovo", label: "Compute", category: "cloud", ring: 1 },
];

export const sectors = [
  {
    slug: "government-health",
    title: "Government & Health",
    line: "Where uptime is a public duty — ministries, universities, and health systems.",
  },
  {
    slug: "banking-finance",
    title: "Banking & Finance",
    line: "Core rooms, identity, and networks that auditors can walk.",
  },
  {
    slug: "telecommunications",
    title: "Telecommunications",
    line: "Carrier-grade operations with service providers who already run the country.",
  },
  {
    slug: "international",
    title: "International organizations",
    line: "Missions and programs that need global standards on local soil.",
  },
];

export const about = {
  intro:
    "Edge COMM-TECH is an integrated technology solutions and systems integration partner. We solve today’s challenges, equip organizations for tomorrow, and advance them toward globally recognized standards.",
  commitment:
    "We understand where clients are today, identify the challenges they face, anticipate what’s coming, and deliver solutions that continuously improve their technology capabilities. Organizations shouldn’t simply react to change — they should be prepared, equipped, and positioned to benefit from it.",
  nextMeans: [
    "What comes next in technology — anticipating emerging tech, evolving risks and changing requirements.",
    "What comes next for our clients — preparing environments for the next stage of growth.",
    "The next level of capability — modernizing for performance, resilience and scalability.",
    "The next stage of transformation — integrating infrastructure, cloud, security and software.",
  ],
  outcomes: [
    "Advanced technology and stronger security",
    "Greater capability and improved efficiency",
    "Higher technology maturity",
    "A clearer path forward",
    "Continuously growing business outcomes",
  ],
};

export const courses: Course[] = [
  {
    slug: "iam-fundamentals",
    title: "Identity and access management fundamentals",
    audience: "Candidates for network, security, and systems roles",
    duration: "About 1 week of watching",
    summary:
      "How identity is actually enforced in an enterprise: accounts, groups, least privilege, and why a job posting that says “IAM” is not a helpdesk ticket.",
    relatedJobs: [
      { title: "Network engineer", href: "/careers/jobs/network-engineer" },
      { title: "Security analyst", href: "/careers/jobs/security-analyst" },
    ],
    modules: [
      {
        slug: "foundations",
        title: "Foundations",
        summary: "What identity is, and why it sits in front of every other control.",
        lessons: [
          {
            slug: "what-identity-is",
            title: "What identity is in an enterprise",
            duration: "12 min",
            body: "People, devices, and services all present an identity. This lesson maps that to the language you will hear on an Edge project: directory, group, role, and ticket.",
            videoUrl: "https://www.youtube.com/watch?v=Y7tQVx80wOU",
          },
          {
            slug: "least-privilege",
            title: "Least privilege without the slogan",
            duration: "14 min",
            body: "A practical walk through why “admin for everyone” shows up in SMEs, and how a bank or ministry will reject it. No quiz — watch, then read the notes.",
            videoUrl: "https://www.youtube.com/watch?v=Y7tQVx80wOU",
          },
        ],
      },
      {
        slug: "operations",
        title: "Operations",
        summary: "Joiners, movers, leavers — the work behind the policy PDF.",
        lessons: [
          {
            slug: "joiners-leavers",
            title: "Joiners, movers, and leavers",
            duration: "16 min",
            body: "The lifecycle that HR and IT share. This is the material we expect candidates to have watched before a security or systems interview.",
            videoUrl: "https://www.youtube.com/watch?v=Y7tQVx80wOU",
          },
        ],
      },
    ],
  },
];

export function getCourse(slug: string) {
  return courses.find((c) => c.slug === slug);
}

export function getDomain(slug: string) {
  return domains.find((d) => d.slug === slug);
}

export function flattenLessons(course: Course) {
  return course.modules.flatMap((mod) =>
    mod.lessons.map((lesson) => ({ ...lesson, moduleSlug: mod.slug, moduleTitle: mod.title })),
  );
}

export function youtubeId(url: string) {
  const m = url.match(/(?:v=|youtu\.be\/)([\w-]{11})/);
  return m?.[1] ?? "";
}

export const nav = [
  { href: "/solutions", label: "Solutions" },
  { href: "/partners", label: "Partners" },
  { href: "/clients", label: "Sectors" },
  { href: "/academy", label: "E-Academy" },
  { href: "/about", label: "Company" },
  { href: "/contact", label: "Contact" },
];
