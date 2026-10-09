/*
 * Edge's content as data. No markup here.
 *
 * SOURCE OF TRUTH: Edge_Comm-Tech_Website_Content_Master_2026.pdf, the
 * client's own approved content master (September 2026 edition, 10 modules).
 * Everything in this file is copy, figures or structure taken from that
 * document. Where the document says a thing is still to be confirmed, it is
 * marked pending here rather than invented.
 *
 * This replaced an earlier model built from Edge's public site plus drafted
 * filler. Four clients in that model (Bonga, Haramaya, Mizan-Tepi, Yekatit 12)
 * do not appear anywhere in Edge's approved client directory and were retired
 * rather than edited.
 *
 * Do not import design-src/content.json. That is the NEXT IT-derived model
 * from before the client's first correction, and none of it is Edge's.
 */

export const COMPANY = {
  legal: "Edge Communication Technologies PLC",
  short: "Edge Comm-Tech",
  domain: "edgecomm-tech.com",
  established: "March 2018",
  positioning:
    "Ethiopia's trusted end-to-end technology solutions and systems-integration partner.",
  mission: "Accelerate Africa's Digital Transformation.",
  missionBody:
    "We help organizations become more connected, secure, resilient, intelligent, efficient, and prepared for the future.",
  vision:
    "Become the most trusted partner for organizations by delivering cutting-edge and scalable technology solutions that empower progress.",
  visionBody:
    "We aim to earn long-term trust through engineering excellence, dependable execution, responsible innovation, and measurable client value.",
};

/* The four approved counters. The 100% figure must never appear without its
   qualifier -- the content master states that as a rule, twice. */
export const IMPACT = [
  { figure: "8+", unit: "years", line: "of technology delivery and trusted execution" },
  { figure: "67+", unit: "projects", line: "executed and delivered across critical sectors" },
  { figure: "40+", unit: "partnerships", line: "with global vendors and original equipment manufacturers" },
  { figure: "100%", unit: "completion", line: "against agreed project scope" },
];

export const IMPACT_SUPPORT =
  "Built in Ethiopia. Aligned with global standards. Ready for Africa.";

/* ------------------------------------------------- seven solution families */

export const SOLUTIONS = [
  {
    n: 1,
    slug: "software-ai-digital",
    title: "Software, AI & Digital Solutions",
    short: "Software, AI & Digital",
    blurb:
      "Enterprise software, automation, analytics, AI knowledge assistants, private RAG, voice automation, industry-specific AI agents, education AI, local-language applications, and custom digital platforms.",
  },
  {
    n: 2,
    slug: "enterprise-network",
    title: "Enterprise Network Solutions",
    short: "Enterprise Network",
    blurb:
      "Secure LAN and WLAN, software-defined networking, network management, collaboration, unified communications, contact centers, structured cabling, and network security.",
  },
  {
    n: 3,
    slug: "system-cloud",
    title: "System & Cloud Solutions",
    short: "System & Cloud",
    blurb:
      "Enterprise compute, storage, engineered systems, virtualization, HCI, backup, disaster recovery, databases, load balancing, hybrid cloud, and end-user computing.",
  },
  {
    n: 4,
    slug: "datacenter-facility-it-infrastructure",
    title: "Datacenter Facility & IT Infrastructure",
    short: "Datacenter & Infrastructure",
    blurb:
      "Tier-aligned datacenter facilities, modular datacenters, cooling, DCIM, environmental monitoring, fire suppression, racks, fiber-optic and copper structured cabling, CCTV, barriers, access control, and related IT infrastructure.",
  },
  {
    n: 5,
    slug: "cybersecurity",
    title: "Cybersecurity Solutions",
    short: "Cybersecurity",
    blurb:
      "Cloud, network, application, endpoint, digital identity, operational, perimeter, and data security; vulnerability management; ADC and next-generation load balancing; Zero Trust Network Access and NAC; SIEM; SOAR; WAF; EDR; IAM; PAM; and DLP.",
  },
  {
    n: 6,
    slug: "power-technology",
    title: "Power Technology Solutions",
    short: "Power Technology",
    blurb:
      "UPS, generators, automatic transfer systems, electrical infrastructure, solar and hybrid power, monitoring, transmission technologies, and EV charging.",
  },
  {
    n: 7,
    slug: "broadcast-satellite",
    title: "Broadcast & Satellite Solutions",
    short: "Broadcast & Satellite",
    blurb:
      "FM and AM, studio systems, television transmission, LED displays, satellite broadcasting, video over IP, and broadband satellite connectivity.",
  },
];

/* --------------------------------------------- six professional services */

export const SERVICES = [
  {
    n: 1,
    slug: "advisory-assessment-design",
    title: "Technology Advisory, Assessment & Solution Design",
    short: "Advisory & Design",
    blurb:
      "Current-state assessment, requirements analysis, architecture, specifications, bills of quantities, roadmaps, budgets, risk planning, and tender support.",
  },
  {
    n: 2,
    slug: "procurement-supply",
    title: "Technology Procurement & Supply",
    short: "Procurement & Supply",
    blurb:
      "OEM and distributor coordination, compliant sourcing, commercial comparison, licensing, logistics, delivery control, documentation, and warranty registration.",
  },
  {
    n: 3,
    slug: "implementation-integration",
    title: "Implementation, Integration & Commissioning",
    short: "Implementation & Integration",
    blurb:
      "Site readiness, installation, configuration, migration, interoperability, testing, commissioning, acceptance, documentation, and handover.",
  },
  {
    n: 4,
    slug: "project-management-deployment",
    title: "Project Management & Deployment",
    short: "Project Management",
    blurb:
      "Governance, schedules, resources, dependencies, stakeholder coordination, quality, risk, changes, reporting, and formal closure.",
  },
  {
    n: 5,
    slug: "managed-support-maintenance",
    title: "Managed Services, Maintenance & Technical Support",
    short: "Managed Support",
    blurb:
      "Monitoring, service desk, preventive and corrective maintenance, incident response, vendor escalation, health checks, updates, reporting, and lifecycle planning.",
  },
  {
    n: 6,
    slug: "training-knowledge-transfer",
    title: "Training & Knowledge Transfer",
    short: "Training",
    blurb:
      "Administrator and user training, operational runbooks, workshops, handover, coaching, and E-Academy programs.",
  },
];

/* Accent per page. Thirteen detail pages need thirteen distinguishable hues
   inside the Highland palette, so a family keeps its identity across the
   overview, the card and the detail page. */
export const ACCENT = {
  "software-ai-digital": "#0888c5",
  "enterprise-network": "#2ba8de",
  "system-cloud": "#056a9a",
  "datacenter-facility-it-infrastructure": "#0b6fa8",
  cybersecurity: "#1c6ea4",
  "power-technology": "#c48a5a",
  "broadcast-satellite": "#3d8fb8",
  "advisory-assessment-design": "#0888c5",
  "procurement-supply": "#c48a5a",
  "implementation-integration": "#2ba8de",
  "project-management-deployment": "#056a9a",
  "managed-support-maintenance": "#0b6fa8",
  "training-knowledge-transfer": "#3d8fb8",
};

/* ------------------------------------------------------ homepage sections */

export const PRIORITIES = [
  {
    title: "Enterprise AI & Automation",
    body: "Secure knowledge assistants, private RAG, intelligent voice services, workflow automation, and governed AI agents built around approved organizational data and human oversight.",
  },
  {
    title: "AI-Ready Infrastructure",
    body: "Scalable compute, storage, networks, datacenters, and data platforms designed to support advanced analytics, automation, and emerging AI workloads.",
  },
  {
    title: "Hybrid Cloud & Modern Platforms",
    body: "Flexible architectures connecting on-premises systems with cloud services while maintaining visibility, performance, governance, and control.",
  },
  {
    title: "Cyber Resilience & Zero-Trust Readiness",
    body: "Layered protection, identity-centered security, monitoring, backup, recovery, and operational resilience for critical digital environments.",
  },
  {
    title: "Data Sovereignty & Business Continuity",
    body: "Secure local infrastructure, disaster recovery, data protection, and resilient architectures that help organizations control critical information and services.",
  },
  {
    title: "Sustainable Digital Infrastructure",
    body: "Energy-conscious datacenter design, efficient cooling, hybrid power, environmental monitoring, and responsible technology lifecycle practices.",
  },
];

export const INDUSTRIES = [
  {
    slug: "financial-services",
    title: "Financial Services",
    body: "Secure banking infrastructure, resilient datacenters, enterprise compute and storage, databases, digital platforms, AI-enabled service automation, cybersecurity, business continuity, and payment solutions.",
  },
  {
    slug: "education",
    title: "Education",
    body: "Smart classrooms, AI learning resources, campus networks, VDI, interactive displays, collaboration, computing infrastructure, surveillance, and smart meeting facilities.",
  },
  {
    slug: "government",
    title: "Government & Public Sector",
    body: "Secure digital infrastructure, modernization platforms, institutional knowledge assistants, datacenters, enterprise systems, connectivity, cybersecurity, collaboration, and citizen-service technologies.",
  },
  {
    slug: "enterprise",
    title: "Enterprise & Industry",
    body: "Business applications, cloud modernization, networks, cybersecurity, intelligent automation, agentic AI, power continuity, collaboration, and data-driven operational tools.",
  },
];

export const DIFFERENTIATORS = [
  {
    title: "End-to-End Capability",
    body: "One accountable partner from consultation and design through sourcing, implementation, integration, training, support, and lifecycle improvement.",
  },
  {
    title: "Engineering-Led Approach",
    body: "Solutions shaped by experienced technical professionals who understand performance, interoperability, security, and operational realities.",
  },
  {
    title: "Trusted Global Partnerships",
    body: "Access to proven platforms, specialist expertise, and vendor-aligned implementation through respected technology manufacturers and distributors.",
  },
  {
    title: "Mission-Critical Experience",
    body: "Practical understanding of the reliability, security, documentation, and continuity needs of banks, government institutions, universities, and major enterprises.",
  },
  {
    title: "Flexible Scalable Architecture",
    body: "Designs that address current requirements while creating a practical path for expansion, integration, modernization, and future technologies.",
  },
  {
    title: "Commitment Beyond Handover",
    body: "Training, knowledge transfer, maintenance, and responsive support that help clients protect their investments.",
  },
];

export const DELIVERY = [
  {
    n: 1,
    title: "Discover",
    body: "Assess business priorities, existing environments, risks, technical requirements, and expected outcomes.",
  },
  {
    n: 2,
    title: "Design",
    body: "Develop an integrated, scalable, secure, and standards-aligned solution architecture.",
  },
  {
    n: 3,
    title: "Deliver",
    body: "Manage sourcing, logistics, installation, configuration, integration, testing, documentation, and stakeholder coordination.",
  },
  {
    n: 4,
    title: "Enable",
    body: "Provide training, knowledge transfer, handover documentation, and operational guidance.",
  },
  {
    n: 5,
    title: "Support & Optimize",
    body: "Maintain availability, strengthen performance, manage change, and prepare the environment for future growth.",
  },
];

/* ------------------------------------------------------- About: the story */

export const JOURNEY = [
  { when: "March 2018", what: "Company established in Addis Ababa, Ethiopia." },
  { when: "June 2018", what: "Delivered the first major technology project and entered the cybersecurity-solutions market." },
  { when: "December 2018", what: "Completed the first university-sector project." },
  { when: "January 2019", what: "Entered financial services through the first banking technology project." },
  { when: "February 2019", what: "Delivered the first smart-classroom project." },
  { when: "January 2020", what: "Entered datacenter solutions, expanding across facilities, computing, storage, power continuity, and environmental systems." },
  { when: "May 2021", what: "Introduced power and generator solutions for operational continuity and mission-critical systems." },
  { when: "June 2024", what: "Expanded into broadcast and satellite solutions." },
  { when: "May 2025", what: "Expanded into enterprise software, automation, digital platforms, analytics, AI knowledge assistants, private RAG, intelligent voice automation, education AI, local-language AI, and industry-specific agentic AI." },
  { when: "Today", what: "Operates as an end-to-end systems-integration partner spanning the network edge, core, cloud, intelligent digital platforms, physical infrastructure, and power." },
];

export const VALUES = [
  { title: "Integrity", body: "We act with honesty, transparency, and ethical conviction in every client, partner, and team relationship." },
  { title: "Reliability", body: "We provide dependable solutions and follow through on our responsibilities from commitment to completion." },
  { title: "Passion", body: "We approach every challenge with energy, curiosity, innovation, and a determination to achieve excellence." },
  { title: "Accountability", body: "We take ownership of decisions and outcomes, celebrate achievements, and learn continuously from experience." },
  { title: "Team Unity", body: "We collaborate across professions, departments, organizations, and borders to achieve stronger results." },
  { title: "Adaptability", body: "We respond to change with agility and transform emerging challenges into opportunities for improvement." },
  { title: "Sustainability", body: "We pursue solutions that create lasting value for organizations, communities, people, and the environment." },
];

export const SUSTAINABILITY = [
  { title: "Solar and Hybrid Energy", body: "Supporting cleaner and more flexible power options for technology environments and institutional operations." },
  { title: "Energy-Efficient Datacenters", body: "Promoting efficient power, cooling, containment, monitoring, and infrastructure-management practices." },
  { title: "Electronic-Waste Management", body: "Encouraging responsible handling, reuse, recycling, and disposal of end-of-life equipment." },
  { title: "Environmentally Responsible Procurement", body: "Considering product efficiency, durability, maintainability, packaging, transportation, and lifecycle impact." },
  { title: "Community and Educational Initiatives", body: "Supporting skills development, internships, technology exposure, and learning opportunities for Ethiopia's future technology workforce." },
];

/* The five executives are named in the content master, but their biographies
   and portraits are listed as Pending. Roles only, until Edge supplies them. */
export const EXECUTIVE_ROLES = [
  "Founder and Chief Executive Officer",
  "Chief Strategy Officer",
  "Chief Technology Officer",
  "Chief Operating Officer",
  "Chief Financial Officer",
];

/* ------------------------------------------------- technology ecosystem */

export const PARTNER_CATEGORIES = [
  ["software-ai", "Software, AI and Digital", "Enterprise software, databases, AI, productivity, payments, digital platforms and EV-charging software."],
  ["network", "Enterprise Network and Collaboration", "Campus, branch and datacenter networking, wireless access, communications and meeting-room collaboration."],
  ["system-cloud", "System, Computing and Cloud", "Compute, storage, hyperconverged infrastructure, virtualization, cloud platforms, backup and recovery."],
  ["datacenter", "Datacenter Facility and IT Infrastructure", "Racks, cooling, structured infrastructure, video security, access control and datacenter facility systems."],
  ["security", "Cybersecurity and Application Delivery", "Network, endpoint, cloud, application and data security; digital identity; zero trust; ADC and traffic management."],
  ["power", "Power Technology", "Generators, UPS systems and resilient power for branches, datacenters and other critical operations."],
  ["education", "Smart Education and Collaboration", "Interactive displays, smart classrooms, audiovisual systems and hybrid teaching or meeting environments."],
  ["broadcast", "Broadcast and Satellite", "Satellite connectivity, contribution and distribution, broadcast workflows and remote communications."],
  ["ev", "EV Charging and Energy", "EV charging hardware, charger management software and connected energy services."],
  ["distribution", "Distributors and Supply Partners", "Regional technology distribution, sourcing and supply-chain support."],
];

/*
 * `logo` is the filename in design-files/highland/logos/, or null.
 *
 * Only three of the thirty-two brands below have artwork on file. The content
 * master is explicit that only approved assets with a recorded source,
 * retrieval date and internal reviewer may be published, so the rest render
 * as their name set in the same frame the mark will occupy. Dropping a file
 * in and setting `logo` is the whole swap -- no layout change.
 *
 * `solution` links a brand card to the Edge page, never to the brand's own
 * site: the content master requires that as the primary action. It also
 * forbids publishing partnership type, authorization level or certification
 * tier anywhere public, which is why no such field exists here.
 */
export const PARTNERS = [
  { name: "HPE", logo: null, cats: ["system-cloud"], featured: true,
    cap: "Enterprise compute, storage, hyperconverged infrastructure and scalable technology foundations for critical workloads.",
    solution: "system-cloud",
    projects: ["gadaa-bank-computing-infrastructure", "national-bank-ethiopia-backup-infrastructure", "ministry-urban-infrastructure-computing"] },
  { name: "Oracle", logo: null, cats: ["software-ai", "system-cloud"], featured: true,
    cap: "Database platforms, enterprise software and data-security capabilities for dependable digital services.",
    solution: "software-ai-digital", projects: [] },
  { name: "Microsoft", logo: null, cats: ["software-ai", "system-cloud", "security"], featured: true,
    cap: "Cloud, productivity, identity, data and AI services that support secure modernization and collaboration.",
    solution: "software-ai-digital", projects: [] },
  { name: "HPE Aruba Networking", logo: null, cats: ["network"], featured: true,
    cap: "Wired and wireless access, centralized network management and security-first connectivity from edge to cloud.",
    solution: "enterprise-network", projects: [] },
  { name: "Fortinet", logo: null, cats: ["security"], featured: true,
    cap: "Integrated capabilities for network, cloud and endpoint security, secure access and zero-trust programs.",
    solution: "cybersecurity", projects: [] },
  { name: "Hikvision", logo: null, cats: ["datacenter"], featured: true,
    cap: "IP video, monitoring and access-control technologies used within integrated safe-campus and facility-security environments.",
    solution: "datacenter-facility-it-infrastructure", projects: ["bahir-dar-university-safe-campus"] },
  { name: "Cummins", logo: null, cats: ["power"], featured: true,
    cap: "Generator technology for resilient backup power supporting branches, datacenters and other critical facilities.",
    solution: "power-technology", projects: ["siinqee-bank-datacenter-power", "zemen-bank-generator-solutions"] },
  { name: "KSTAR", logo: null, cats: ["power", "datacenter"], featured: true,
    cap: "UPS and critical-power systems that help maintain continuity for datacenter and enterprise technology environments.",
    solution: "power-technology", projects: ["siinqee-bank-datacenter-power"] },
  { name: "PeopleLink", logo: null, cats: ["education"], featured: true,
    cap: "Video collaboration, classroom and meeting-room technologies for connected learning and hybrid participation.",
    solution: "software-ai-digital", projects: ["bahir-dar-university-smart-classrooms"] },
  { name: "Veeam", logo: null, cats: ["system-cloud"], featured: true,
    cap: "Backup, recovery and data-resilience capabilities for virtual, physical and cloud workloads.",
    solution: "system-cloud", projects: [] },
  { name: "Azercosmos", logo: null, cats: ["broadcast"], featured: true,
    cap: "Satellite connectivity and broadcasting capabilities for media, enterprise, government and remote-service requirements.",
    solution: "broadcast-satellite", projects: [] },
  { name: "BPC", logo: null, cats: ["software-ai"], featured: true,
    cap: "Digital banking and payment technology supporting modern financial-service experiences and transaction ecosystems.",
    solution: "software-ai-digital", projects: [] },

  { name: "Arista Networks", logo: null, cats: ["network"],
    cap: "Cloud and datacenter networking", solution: "enterprise-network", projects: [] },
  { name: "Logitech", logo: null, cats: ["network", "education"],
    cap: "Video collaboration and room peripherals", solution: "enterprise-network", projects: [] },
  { name: "Mitel", logo: null, cats: ["network"],
    cap: "Business communications and unified communications", solution: "enterprise-network", projects: [] },
  { name: "Sophos", logo: null, cats: ["security"],
    cap: "Endpoint, network, cloud and managed security", solution: "cybersecurity", projects: [] },
  { name: "Broadcom", logo: null, cats: ["security", "system-cloud"],
    cap: "Infrastructure software and security technologies", solution: "cybersecurity", projects: [] },
  { name: "Sangfor", logo: null, cats: ["security", "system-cloud"],
    cap: "Security, cloud and infrastructure platforms", solution: "cybersecurity", projects: [] },
  { name: "HP", logo: "hp", cats: ["system-cloud"],
    cap: "Business computing, printing and workplace technology", solution: "system-cloud", projects: [] },
  { name: "Nutanix", logo: null, cats: ["system-cloud"],
    cap: "Hyperconverged infrastructure and hybrid multicloud", solution: "system-cloud", projects: [] },
  { name: "Canovate", logo: "canovate", cats: ["datacenter"],
    cap: "Datacenter, rack, cooling and fiber infrastructure", solution: "datacenter-facility-it-infrastructure", projects: [] },
  { name: "Dahua Technology", logo: null, cats: ["datacenter", "education"],
    cap: "Video, display and collaboration technologies", solution: "datacenter-facility-it-infrastructure",
    projects: ["arba-minch-university-smart-meeting-rooms"] },
  { name: "Vertiv", logo: "vertiv", cats: ["datacenter", "power"],
    cap: "Critical digital infrastructure, cooling and power", solution: "datacenter-facility-it-infrastructure", projects: [] },
  { name: "Perkins", logo: null, cats: ["power"],
    cap: "Industrial engine technology for generator applications", solution: "power-technology", projects: [] },
  { name: "IQBoard", logo: null, cats: ["education"],
    cap: "Interactive displays and digital classroom technology", solution: "software-ai-digital",
    projects: ["bahir-dar-university-smart-classrooms"] },
  { name: "NEARITY", logo: null, cats: ["education"],
    cap: "Audio, video and hybrid-collaboration technology", solution: "software-ai-digital",
    projects: ["bahir-dar-university-smart-classrooms"] },
  { name: "Arrays Networks", logo: null, cats: ["security"],
    cap: "Application delivery controllers and secure access", solution: "cybersecurity",
    projects: ["ministry-urban-infrastructure-computing"] },
  { name: "Teltonika Energy", logo: null, cats: ["ev"],
    cap: "Connected EV charging technology", solution: "power-technology", projects: [] },
  { name: "Evoltsoft", logo: null, cats: ["ev", "software-ai"],
    cap: "EV-charging management software", solution: "power-technology", projects: [] },
  { name: "Canon", logo: null, cats: ["education", "datacenter"],
    cap: "Imaging, display, capture and printing technology", solution: "datacenter-facility-it-infrastructure", projects: [] },
  { name: "Mitsumi Distribution", logo: null, cats: ["distribution"],
    cap: "Regional technology distribution and supply support", solution: "system-cloud", projects: [] },
  { name: "Hiperdist", logo: null, cats: ["distribution"],
    cap: "Technology distribution across the Middle East and Africa", solution: "system-cloud", projects: [] },
];

/* ------------------------------------------------------------- clients */

export const CLIENT_SECTORS = [
  ["education", "Universities and Education"],
  ["banking", "Banking and Financial Markets"],
  ["government", "Government and Public Institutions"],
];

export const CLIENTS = [
  { name: "Bahir Dar University", logo: "bahirdar", sector: "education",
    summary: "Digital learning and campus infrastructure delivered across the university's campuses, combining modern classroom environments with integrated monitoring and communications infrastructure.",
    engagements: ["bahir-dar-university-smart-classrooms", "bahir-dar-university-safe-campus"],
    solutions: ["software-ai-digital", "datacenter-facility-it-infrastructure"] },
  { name: "Arba Minch University", logo: null, sector: "education",
    summary: "Smart meeting-room infrastructure designed to improve research collaboration, remote participation and knowledge exchange at the university's Secha Campus.",
    engagements: ["arba-minch-university-smart-meeting-rooms"],
    solutions: ["software-ai-digital", "enterprise-network"] },
  { name: "Ministry of Education", logo: null, sector: "education",
    summary: "Indoor LED display infrastructure supporting institutional communication, presentations and visual information delivery.",
    engagements: [], pending: "Indoor LED Display",
    solutions: ["datacenter-facility-it-infrastructure", "broadcast-satellite"] },
  { name: "Gadaa Bank", logo: null, sector: "banking",
    summary: "Computing infrastructure modernization using hyperconverged architecture to support critical banking applications and provide a scalable foundation for future private-cloud capabilities.",
    engagements: ["gadaa-bank-computing-infrastructure"],
    solutions: ["system-cloud"] },
  { name: "National Bank of Ethiopia", logo: null, sector: "banking",
    summary: "Backup infrastructure designed to strengthen the secure retention, recoverability and operational protection of critical institutional information.",
    engagements: ["national-bank-ethiopia-backup-infrastructure"],
    solutions: ["system-cloud", "cybersecurity"] },
  { name: "Siinqee Bank", logo: null, sector: "banking",
    summary: "Datacenter facility and resilient power infrastructure supporting the availability and continuity requirements of the bank's critical technology environment.",
    engagements: ["siinqee-bank-datacenter-power"],
    solutions: ["datacenter-facility-it-infrastructure", "power-technology"] },
  { name: "Zemen Bank", logo: null, sector: "banking",
    summary: "Generator solutions deployed for branches across Ethiopia to provide dependable backup power and support continuous banking services.",
    engagements: ["zemen-bank-generator-solutions"],
    solutions: ["power-technology"] },
  { name: "Ethiopian Securities Exchange", logo: null, sector: "banking",
    summary: "Oracle database software and database-security capabilities supporting the exchange's core data environment and controlled access to critical information.",
    engagements: [], pending: "Oracle Database Software and Database Security",
    solutions: ["software-ai-digital", "system-cloud", "cybersecurity"] },
  { name: "Ministry of Urban and Infrastructure", logo: null, sector: "government",
    summary: "Computing, switching, storage and application-delivery infrastructure supporting resilient operation of important ministry applications and data services.",
    engagements: ["ministry-urban-infrastructure-computing"],
    solutions: ["enterprise-network", "system-cloud"] },
  { name: "Ministry of Health", logo: null, sector: "government",
    summary: "Power infrastructure solutions supporting dependable operation of technology and electrical systems at the West Treatment Plant.",
    engagements: [], pending: "West Treatment Plant Power Infrastructure",
    solutions: ["power-technology"] },
];

/* ------------------------------------------------------------- projects */
/* The eight the content master approves for publication, in its stated
   featured order. Contract values are omitted everywhere by instruction. */

export const PROJECTS = [
  { slug: "bahir-dar-university-smart-classrooms", featured: 1,
    client: "Bahir Dar University", sector: "Education", sectorFull: "Higher Education",
    location: "Bahir Dar — university campuses", year: "2024/2025",
    title: "Bahir Dar University Smart Classrooms",
    primary: "Smart learning and collaboration",
    summary: "A university-wide smart-classroom transformation across Bahir Dar University campuses, replacing isolated blackboard- and whiteboard-centered teaching environments with interactive digital infrastructure.",
    solutions: ["datacenter-facility-it-infrastructure", "software-ai-digital", "enterprise-network"],
    tech: ["PeopleLink", "IQBoard", "NEARITY"] },
  { slug: "bahir-dar-university-safe-campus", featured: 2,
    client: "Bahir Dar University", sector: "Education", sectorFull: "Higher Education",
    location: "Bahir Dar — university campuses", year: "Year to confirm",
    title: "Bahir Dar University CCTV and Security Infrastructure",
    primary: "Safe-campus IT infrastructure",
    summary: "Integrated surveillance, campus monitoring, security control-room and radio-communication infrastructure across Bahir Dar University campuses.",
    solutions: ["datacenter-facility-it-infrastructure", "enterprise-network"],
    tech: ["Hikvision"] },
  { slug: "gadaa-bank-computing-infrastructure", featured: 3,
    client: "Gadaa Bank", sector: "Banking", sectorFull: "Banking and Financial Services",
    location: "Gadaa Bank Headquarters", year: "2025",
    title: "Gadaa Bank Computing Infrastructure",
    primary: "HCI and private-cloud readiness",
    summary: "A move from traditional server-and-storage infrastructure to an integrated hyperconverged platform supporting core banking, ERP and enterprise applications.",
    solutions: ["system-cloud", "datacenter-facility-it-infrastructure", "cybersecurity"],
    tech: ["HPE"] },
  { slug: "national-bank-ethiopia-backup-infrastructure", featured: 4,
    client: "National Bank of Ethiopia", sector: "Banking", sectorFull: "Central Banking and Financial Services",
    location: "National Bank of Ethiopia Headquarters", year: "2025/2026",
    title: "National Bank of Ethiopia Backup Infrastructure",
    primary: "Backup and recovery",
    summary: "Backup and recovery infrastructure providing a more reliable and manageable platform for protecting critical institutional information.",
    solutions: ["system-cloud", "cybersecurity"],
    tech: ["HPE"] },
  { slug: "ministry-urban-infrastructure-computing", featured: 5,
    client: "Ministry of Urban and Infrastructure", sector: "Government", sectorFull: "Government and Public Services",
    location: "Ministry Headquarters", year: "2024/2025",
    title: "Ministry of Urban and Infrastructure Computing Solutions",
    primary: "Compute, storage, switching, ADC",
    summary: "A modern computing platform supporting the applications and data services behind essential social safety-net programs.",
    solutions: ["system-cloud", "enterprise-network", "cybersecurity"],
    tech: ["HPE", "Arrays Networks"] },
  { slug: "siinqee-bank-datacenter-power", featured: 6,
    client: "Siinqee Bank", sector: "Banking", sectorFull: "Banking and Financial Services",
    location: "Siinqee Bank Headquarters", year: "2024",
    title: "Siinqee Bank Datacenter Facility and Power Solutions",
    primary: "Datacenter critical power",
    summary: "Coordinated backup-power infrastructure for a critical datacenter facility, supporting the bank's ambition to operate an availability-focused, Tier III-aligned datacenter.",
    solutions: ["datacenter-facility-it-infrastructure", "power-technology"],
    tech: ["Cummins", "KSTAR"] },
  { slug: "arba-minch-university-smart-meeting-rooms", featured: 0,
    client: "Arba Minch University", sector: "Education", sectorFull: "Higher Education and Research",
    location: "Secha Campus, Arba Minch", year: "2024/2025",
    title: "Arba Minch University Smart Meeting Rooms",
    primary: "Research collaboration",
    summary: "Smart meeting-room environments designed for researchers, scientists, coaches and invited experts at the university's Secha Campus.",
    solutions: ["software-ai-digital", "enterprise-network"],
    tech: ["Dahua Technology"] },
  { slug: "zemen-bank-generator-solutions", featured: 0,
    client: "Zemen Bank", sector: "Banking", sectorFull: "Banking and Financial Services",
    location: "Selected branches across Ethiopia", year: "2024/2025",
    title: "Zemen Bank Generator Solutions",
    primary: "Multi-site backup generation",
    summary: "Generator solutions delivered to bank branches across Ethiopia, each designed around branch operating needs and the risk that grid interruption disrupts banking services.",
    solutions: ["power-technology"],
    tech: ["Cummins"] },
];

/* ------------------------------------------------------------- contact */

export const CONTACT = {
  office: [
    "Edge Communication Technologies PLC",
    "BMA Plaza, 9th Floor",
    "Gerji Imperial, Bole Sub-City",
    "Addis Ababa, Ethiopia",
  ],
  map: "https://www.google.com/maps/search/?api=1&query=BMA+Plaza+Gerji+Addis+Ababa",
  phones: [
    { label: "Main telephone and WhatsApp", value: "+251 95 569 5565", tel: "+251955695565" },
    { label: "Additional telephone", value: "+251 911 538 809", tel: "+251911538809" },
  ],
  whatsapp: "https://wa.me/251955695565",
  emails: [
    { label: "Sales and general inquiries", value: "sales@edgecomm-tech.com" },
    { label: "Technical support", value: "support@edgecomm-tech.com" },
    { label: "Careers", value: "hr@edgecomm-tech.com" },
  ],
  emergency: "+251 95 569 5565",
  response: "Within one business day",
  hours: [
    ["Monday to Friday", "8:00 AM to 5:30 PM"],
    ["Saturday", "8:00 AM to 12:00 PM"],
    ["Sunday", "Closed"],
  ],
};

export const INQUIRY_CATEGORIES = [
  { slug: "consultation", title: "Request a Consultation",
    prompt: "Tell us the outcome you want to achieve and the technology environment involved.",
    route: "sales@edgecomm-tech.com" },
  { slug: "quotation", title: "Request a Quotation",
    prompt: "Describe the required products, services, quantities, location and required delivery timeline.",
    route: "sales@edgecomm-tech.com" },
  { slug: "support", title: "Technical Support",
    prompt: "Provide the client or project reference, affected service, impact and error details.",
    route: "support@edgecomm-tech.com" },
  { slug: "partnership", title: "Partnership Inquiry",
    prompt: "Introduce your organization, proposed partnership area and intended market or opportunity.",
    route: "sales@edgecomm-tech.com" },
  { slug: "training", title: "Training and E-Academy",
    prompt: "Share the topic, audience, estimated participants, delivery format and preferred dates.",
    route: "sales@edgecomm-tech.com" },
  { slug: "careers", title: "Careers",
    prompt: "Select the relevant vacancy or internship and use the official Careers application process.",
    route: "hr@edgecomm-tech.com" },
  { slug: "general", title: "General Inquiry",
    prompt: "Send a short message and enough contact information for us to direct it correctly.",
    route: "sales@edgecomm-tech.com" },
];

export const NAV = [
  ["Solutions", "solutions.html"],
  ["Projects", "projects.html"],
  ["Clients", "clients.html"],
  ["Partners", "partners.html"],
  ["Resources", "resources.html"],
  ["Blog", "blog.html"],
  ["Careers", "careers.html"],
  ["About", "about.html"],
];
