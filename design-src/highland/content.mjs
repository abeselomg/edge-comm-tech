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
  { name: "Cisco", areas: ["net", "sec"] },
  { name: "Dell", areas: ["net", "cmp"] },
  { name: "HP", areas: ["cmp"] },
  { name: "Huawei", areas: ["net"] },
  { name: "Palo Alto Networks", areas: ["sec"] },
  { name: "Vertiv", areas: ["pwr"] },
  { name: "Tripp Lite", areas: ["pwr", "rck"] },
  { name: "Canovate Group", areas: ["rck"] },
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
