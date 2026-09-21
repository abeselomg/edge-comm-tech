/*
 * Edge's content as data. No markup here.
 *
 * Everything in this file is verified: it comes from edgecomm-tech.com or
 * from the approved landing page. Drafted content added by later tasks is
 * kept in clearly labelled sections below the verified block.
 *
 * Do not import design-src/content.json. That file is the NEXT IT-derived
 * model from before the client's first correction -- six solutions, four
 * sectors, twenty-six partners -- and none of it is Edge's.
 */

/* ------------------------------------------------------------- verified */

export const SERVICES = [
  { n: 1, slug: "datacenter", title: "Datacenter Facility",
    blurb: "Designed and built to house IT infrastructure with high-quality materials, industry-leading standards and Tier-rated architecture." },
  { n: 2, slug: "networks", title: "Networks (LAN/WLAN)",
    blurb: "Campus and wireless networks delivered with our manufacturing partners — the experience and expertise the design actually needs." },
  { n: 3, slug: "cybersecurity", title: "Cybersecurity",
    blurb: "A complete portfolio of network and data security services, plus the staff of security professionals who operate them." },
  { n: 4, slug: "noc-soc", title: "NOC and SOC services",
    blurb: "Build carrier-grade network operations and security operations centres, and the practice that runs them." },
  { n: 5, slug: "unified-comms", title: "Unified Communications",
    blurb: "Phone services with unified voice, presence, chat, mobile and data integration across the organisation." },
  { n: 6, slug: "voice-data-internet", title: "Voice / Data / Internet",
    blurb: "A wide array of plan options and service alternatives, with all telecom and unified communication elements integrated end to end as a fully managed service." },
  { n: 7, slug: "physical-security", title: "CCTV and Physical security",
    blurb: "Design and installation of CCTV, access control systems, gate barriers, turnstiles and related physical security." },
  { n: 8, slug: "it-support", title: "IT service / Desktop support",
    blurb: "Remote and on-site IT helpdesk for enterprise network infrastructure, servers, software and systems." },
  { n: 9, slug: "professional-services", title: "Professional services",
    blurb: "Expert-level certified network and system engineers specialising in design, configuration and troubleshooting." },
];

/* Areas match the five used by the partners filter on the dark direction,
   so the two reviews agree on who covers what. */
export const AREAS = [
  ["net", "Networking"],
  ["sec", "Security"],
  ["cmp", "Compute and storage"],
  ["pwr", "Power and cooling"],
  ["rck", "Racks and cabling"],
];

export const PARTNERS = [
  { name: "Cisco", logo: "cisco", areas: ["net", "sec"] },
  { name: "Dell", logo: "dell", areas: ["net", "cmp"] },
  { name: "HP", logo: "hp", areas: ["cmp"] },
  { name: "Huawei", logo: "huawei", areas: ["net"] },
  { name: "Palo Alto Networks", logo: "paloalto", areas: ["sec"] },
  { name: "Vertiv", logo: "vertiv", areas: ["pwr"] },
  { name: "Tripp Lite", logo: "tripplite", areas: ["pwr", "rck"] },
  { name: "Canovate Group", logo: "canovate", areas: ["rck"] },
];

export const CLIENTS = [
  "Bonga University",
  "Bahir Dar University",
  "Haramaya University",
  "Mizan-Tepi University",
  "Yekatit 12 Hospital",
];

export const CONTACT = {
  office: ["Addis Ababa, Bole", "Next to Ambassador Hotel", "Lubaba Building, 3rd Floor"],
  phones: ["+251 92 255 5055", "+251 91 153 8809"],
  emails: ["info@edgecomm-tech.com", "sales@edgecomm-tech.com", "support@edgecomm-tech.com"],
};

export const NAV = [
  ["About", "about.html"],
  ["Partners", "partners.html"],
  ["Solutions", "solutions.html"],
  ["Projects", "projects.html"],
  ["Academy", "academy.html"],
  ["Career", "career.html"],
  ["Blog", "blog.html"],
];

/* --------------------------------------------------------------- drafted */
/* Written for this design. Edge has not published an executive roster; the
   names below are placeholders and must be replaced before launch. */

export const METHOD = [
  { title: "Advise",
    body: "We start from what you actually have and what it costs you to run it, then say plainly what should change and in what order." },
  { title: "Implement",
    body: "Certified network and system engineers do the design, the configuration and the commissioning — to international standards, not to whatever fits." },
  { title: "Manage",
    body: "Continuous follow-up and optimised after-sales service. The contract that builds it is the contract that keeps it running." },
];

export const DISCIPLINES = [
  { title: "Network engineers",
    body: "Certified across Cisco, Huawei and Dell for campus, wireless and wide-area design." },
  { title: "Security professionals",
    body: "The staff behind the NOC and SOC portfolio, from perimeter policy through to incident response." },
  { title: "Facilities engineers",
    body: "Power, cooling, containment and structured cabling for Tier-rated rooms." },
  { title: "Support engineers",
    body: "Remote and on-site helpdesk across servers, software and systems." },
];

export const EXECUTIVES = [
  { name: "Name to confirm", role: "Managing Director" },
  { name: "Name to confirm", role: "Technical Director" },
  { name: "Name to confirm", role: "Operations Manager" },
  { name: "Name to confirm", role: "Head of Service Delivery" },
];

/* One worked service page. The other eight are the same template with
   different data, which is what the client approved. */
export const SOLUTION_DETAIL = {
  slug: "datacenter",
  overview:
    "A datacenter is the one part of an estate where a mistake is expensive to undo. Edge designs the room before the racks are ordered: load, cooling, containment, power path and cable routes, sized against what the institution will run in five years rather than what it runs today.",
  scope: [
    "Site survey and load assessment against current and projected IT load",
    "Room design: containment, raised floor or slab, cable routing, clearances",
    "Power path: utility, generator, UPS, distribution, rPDU to the rack",
    "Cooling design and airflow modelling",
    "Rack elevation drawings and structured cabling schedule",
    "Commissioning, load testing and handover documentation",
  ],
  deliverables: [
    "As-built drawings and rack elevations",
    "Power and cooling calculations",
    "Commissioning and load test records",
    "Operations and maintenance manual",
    "Handover training for the site team",
  ],
  capabilities: [
    { acronym: "Tier III", expansion: "Concurrently maintainable topology",
      value: "Any single component can be taken out for service without shutting the room down." },
    { acronym: "N+1", expansion: "One redundant unit per capacity group",
      value: "A failed cooling or UPS unit does not reduce capacity below the design load." },
    { acronym: "HCI", expansion: "Hyper-converged infrastructure",
      value: "Compute, storage and networking in one appliance, so a small team can run it." },
    { acronym: "rPDU", expansion: "Rack power distribution unit",
      value: "Per-outlet metering, so you find the circuit that is about to trip before it does." },
    { acronym: "PUE", expansion: "Power usage effectiveness",
      value: "The ratio that tells you how much of the electricity bill reaches the servers." },
  ],
  partners: ["Vertiv", "Tripp Lite", "Canovate Group", "Dell", "HP"],
  sectors: ["Higher education", "Public health"],
};

/* Edge's five real clients crossed with Edge's real services. Drafted, but
   grounded -- no engagement here belongs to another integrator.
   Yekatit 12 deliberately avoids datacenter and HCI: IE Networks publish
   that exact engagement as theirs. */
export const PROJECTS = [
  { slug: "bonga", client: "Bonga University", sector: "Higher education", year: "2024",
    scope: "Campus LAN and wireless network",
    tech: ["Cisco", "Huawei"] },
  { slug: "bahirdar", client: "Bahir Dar University", sector: "Higher education", year: "2024",
    scope: "Datacenter facility, power and cooling",
    tech: ["Vertiv", "Tripp Lite", "Canovate Group"] },
  { slug: "haramaya", client: "Haramaya University", sector: "Higher education", year: "2023",
    scope: "Structured cabling and rack build-out",
    tech: ["Canovate Group"] },
  { slug: "mizantepi", client: "Mizan-Tepi University", sector: "Higher education", year: "2023",
    scope: "Perimeter security and network access control",
    tech: ["Palo Alto Networks", "Cisco"] },
  { slug: "yekatit", client: "Yekatit 12 Hospital", sector: "Public health", year: "2023",
    scope: "CCTV, access control and IP telephony",
    tech: ["Cisco", "Dell"] },
];

export const PROJECT_DETAIL = {
  slug: "bonga",
  before:
    "Teaching buildings were on separate, independently managed switches with no common addressing, so a fault in one block took a working day to locate and there was no way to see the campus as one network.",
  built:
    "One routed core with distribution to each block, campus-wide wireless on a single controller, and a management VLAN that reaches every switch. Cabling was re-terminated and labelled to a documented schedule.",
  changed:
    "Faults are located from the network operations view rather than by walking buildings, and the university adds a new block by extending a documented design rather than by improvising.",
};

/* Courses map onto Edge's own service lines -- Edge teaches what it builds. */
export const COURSES = [
  { slug: "soc", title: "Security Operations Centre fundamentals", service: "NOC and SOC services",
    duration: "1 week", level: "Intermediate", lessons: 10 },
  { slug: "firewall", title: "Firewall administration and perimeter security", service: "Cybersecurity",
    duration: "1 week", level: "Intermediate", lessons: 8 },
  { slug: "wireless", title: "Enterprise wireless design and management", service: "Networks (LAN/WLAN)",
    duration: "5 days", level: "Intermediate", lessons: 7 },
  { slug: "datacenter-ops", title: "Datacenter facility systems", service: "Datacenter Facility",
    duration: "4 days", level: "Beginner", lessons: 6 },
  { slug: "backup", title: "Backup, disaster recovery and business continuity", service: "Professional services",
    duration: "1 week", level: "Intermediate", lessons: 9 },
  { slug: "itsupport", title: "IT support and system administration essentials", service: "IT service / Desktop support",
    duration: "2 weeks", level: "Beginner", lessons: 12 },
];

export const COURSE_DETAIL = {
  slug: "soc",
  summary:
    "How a security operations centre is staffed, tooled and run day to day — written for engineers who will be on the rota, not for managers buying one.",
  outcomes: [
    "Describe the tiers of a SOC and what each is accountable for",
    "Triage an alert from first sight to disposition, with the reasoning written down",
    "Build a detection from a log source, and explain why it will not flood the queue",
    "Run an incident to handover, including the record the next shift needs",
  ],
  modules: [
    { title: "What a SOC is for",
      lessons: ["Tiers, rotas and escalation", "What the SOC does not do", "Measuring a SOC honestly"] },
    { title: "Sources and signal",
      lessons: ["Log sources worth having", "Normalisation and why it breaks", "Writing a detection that survives contact"] },
    { title: "Working an incident",
      lessons: ["Triage and disposition", "Containment decisions", "Handover and the written record"] },
  ],
};

export const JOBS = [
  { slug: "network-engineer", title: "Network Engineer", team: "Networks",
    type: "Full time", positions: 2, deadline: "Rolling" },
  { slug: "security-analyst", title: "Security Analyst (SOC)", team: "Cybersecurity",
    type: "Full time", positions: 2, deadline: "Rolling" },
  { slug: "facilities-engineer", title: "Datacenter Facilities Engineer", team: "Datacenter",
    type: "Full time", positions: 1, deadline: "Rolling" },
  { slug: "support-engineer", title: "IT Support Engineer", team: "Support",
    type: "Full time", positions: 3, deadline: "Rolling" },
];

export const JOB_DETAIL = {
  slug: "network-engineer",
  location: "Addis Ababa, Bole — on site, with travel to client sites nationwide",
  summary:
    "Design, configure and commission campus and wide-area networks for universities, hospitals and enterprises. You will be in the room when a build is commissioned, not only on the drawing.",
  responsibilities: [
    "Survey sites and produce network designs against a written requirement",
    "Configure and commission switching, routing and wireless",
    "Hand over documented, labelled and tested installations",
    "Support the estate you built, through the after-sales contract",
  ],
  qualifications: [
    "Degree in computer engineering, electrical engineering or a related field",
    "CCNA or equivalent; CCNP an advantage",
    "Two years or more of hands-on campus network delivery",
    "Willingness to travel to client sites outside Addis Ababa",
  ],
};

export const POSTS = [
  { slug: "tier-ratings", title: "What a Tier rating actually buys you",
    standfirst: "Tier III is quoted in every datacenter tender in Addis and understood in almost none of them. What the rating covers, what it does not, and when paying for it is wrong.",
    category: "Datacenter", date: "2026-08-14", tags: ["Tier III", "Power", "Cooling"] },
  { slug: "nac-rollout", title: "Network access control without stopping the campus",
    standfirst: "How to phase a NAC rollout across a university so that the day it goes enforcing is uneventful.",
    category: "Security", date: "2026-07-02", tags: ["NAC", "Campus"] },
  { slug: "wifi-density", title: "Designing wireless for lecture-theatre density",
    standfirst: "Coverage surveys answer the wrong question when four hundred devices associate in ninety seconds.",
    category: "Networks", date: "2026-05-21", tags: ["WLAN", "Higher education"] },
  { slug: "soc-staffing", title: "The smallest SOC that is worth running",
    standfirst: "Below a certain staffing level a security operations centre generates alerts nobody acts on. Where that line sits.",
    category: "Security", date: "2026-04-09", tags: ["SOC", "Operations"] },
];

export const POST_DETAIL = {
  slug: "tier-ratings",
  author: "Edge engineering",
  pull: "A Tier rating describes the topology, not the operator. A Tier III room run without change control fails like a Tier I room.",
  paras: [
    "Tier III appears in almost every datacenter specification written in Addis Ababa, usually without a definition attached. It is worth being precise, because the rating is a claim about one specific property and buyers routinely read it as a claim about several.",
    "The property is concurrent maintainability. A Tier III topology lets any single capacity component or distribution path be removed from service — for maintenance, replacement or repair — without taking the IT load down. That is it. It is a statement about the power and cooling paths, and about nothing else.",
    "What it does not cover is instructive. It says nothing about the building's physical security, nothing about the network above the floor, and nothing at all about how the room is operated. A Tier III room run without change control fails like a Tier I room, on a Tuesday, because two people worked on the same distribution board.",
    "It is also possible to over-specify. An institution running a single teaching application with a documented four-hour recovery target is buying redundancy it will never draw on. The honest recommendation is often a well-built Tier II room and a tested restore procedure, and an integrator who never says that is selling, not advising.",
  ],
};

/* Mission, vision and values. Written from how Edge already describes itself
   on its own site and in the approved homepage copy -- "advise, implement and
   manage", "built to international standards", "an engineer replies, not a
   sales queue". Nothing here asserts a fact Edge has not already published. */
export const PURPOSE = {
  mission:
    "To design, build and keep running the communication and IT infrastructure that Ethiopia's universities, hospitals and enterprises depend on — to international standards, and with the same team from the first assessment to the after-sales contract.",
  vision:
    "That an institution in Ethiopia should never have to choose between infrastructure it can trust and infrastructure it can support locally.",
};

export const VALUES = [
  { title: "Advise before we sell",
    body: "The right recommendation is sometimes a smaller one, or a platform we do not carry. We say so, because the alternative is a system nobody can afford to run." },
  { title: "One team, end to end",
    body: "The engineers who assess the estate design the build, commission it, and are still reachable afterwards. Most failures we are called to fix happen at the seam between two suppliers." },
  { title: "Built to standards, not to fit",
    body: "Tier-rated rooms, documented addressing, labelled cabling, tested restores. The parts nobody sees are the parts that decide whether it lasts." },
  { title: "Answerable after handover",
    body: "An engineer replies, not a sales queue. The contract that builds a system is the contract that keeps it running." },
];
