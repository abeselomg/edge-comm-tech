/*
 * Blog, news, events and downloads. Modules 04 and 05 of the content master.
 *
 * One structural instruction from that document shapes this file: the ten
 * launch blog articles are short by design and their Read More goes straight
 * to the matching solution page. The master is explicit -- "do not create thin
 * article-detail pages containing the same short copy solely to insert another
 * click" -- so there are no post detail pages here, and none are generated.
 */

export const BLOG_CATEGORIES = [
  ["artificial-intelligence-digital", "Artificial Intelligence and Digital Solutions"],
  ["enterprise-networks", "Enterprise Networks"],
  ["systems-cloud", "Systems and Cloud"],
  ["datacenter-it-infrastructure", "Datacenter Facilities and IT Infrastructure"],
  ["cybersecurity", "Cybersecurity"],
  ["power-business-continuity", "Power and Business Continuity"],
  ["broadcast-satellite", "Broadcast and Satellite"],
  ["smart-education", "Smart Education"],
  ["financial-services-technology", "Financial Services Technology"],
  ["government-digital-transformation", "Government Digital Transformation"],
];

/*
 * `to` is a solution slug; `anchor` is the fragment the content master
 * specifies. The link checker will not accept a fragment that does not exist
 * on the destination page, so the solution renderer emits these ids.
 */
export const POSTS = [
  {
    slug: "private-rag-secure-enterprise-ai",
    title: "Private RAG and secure enterprise AI",
    cat: "artificial-intelligence-digital",
    to: "software-ai-digital",
    anchor: "private-rag",
    label: "Read more about Private RAG and secure enterprise AI solutions",
    paras: [
      "Organizations want the speed and convenience of generative AI without losing control of confidential policies, manuals, procedures, and operational data. Private Retrieval-Augmented Generation, or private RAG, connects an AI assistant to approved internal knowledge so users can receive relevant answers grounded in information the organization controls.",
      "A dependable enterprise design should include role-based access, source references, document governance, auditability, security controls, quality evaluation, and human escalation. Edge Comm-Tech helps organizations plan and implement private knowledge assistants that align with existing systems, workflows, data policies, and deployment requirements.",
    ],
  },
  {
    slug: "agentic-ai-for-universities",
    title: "Agentic AI for universities",
    cat: "smart-education",
    to: "software-ai-digital",
    anchor: "agentic-ai",
    label: "Read more about Agentic AI and AI solutions for universities",
    paras: [
      "Agentic AI can help universities move beyond simple question-and-answer tools by supporting controlled multi-step activities across student services, research, academic administration, institutional knowledge, and digital learning. An AI agent can gather approved information, prepare outputs, initiate permitted workflows, and request human authorization when a decision is required.",
      "Universities should begin with clearly defined use cases and strong governance for privacy, academic integrity, identity, access, evaluation, and human oversight. Edge Comm-Tech develops education-focused AI solutions, private RAG environments, AI learning resources, and local-language capabilities designed around institutional policies and priorities.",
    ],
  },
  {
    slug: "hci-foundation-private-cloud",
    title: "HCI as a foundation for private cloud",
    cat: "systems-cloud",
    to: "system-cloud",
    anchor: "hci-private-cloud",
    label: "Read more about HCI and private cloud solutions",
    paras: [
      "Hyperconverged infrastructure combines computing, storage, virtualization, and centralized management in a coordinated platform. By reducing separate infrastructure silos, HCI can simplify operations, strengthen resilience, and make expansion more predictable for growing application and data workloads.",
      "HCI can also provide a practical technical foundation for private cloud, but the transition requires more than hardware. Governance, automation, identity, security, backup, monitoring, service management, capacity planning, and operational skills must develop together. Edge Comm-Tech supports clients from assessment and architecture through implementation, migration, training, and lifecycle support.",
    ],
  },
  {
    slug: "backup-versus-disaster-recovery",
    title: "Backup versus disaster recovery",
    cat: "systems-cloud",
    to: "system-cloud",
    anchor: "backup-disaster-recovery",
    label: "Read more about backup and disaster recovery solutions",
    paras: [
      "Backup creates recoverable copies of data, while disaster recovery coordinates how applications, infrastructure, data, people, and procedures restore critical services after a serious disruption. A backup may protect information, but it does not by itself guarantee that an organization can recover complete business services within the required time.",
      "An effective strategy defines recovery priorities, recovery time objectives, recovery point objectives, dependencies, retention, off-site or isolated copies, testing, responsibilities, and communication. Edge Comm-Tech helps organizations design integrated backup and disaster-recovery solutions that match workload criticality, risk, operating capacity, and business-continuity requirements.",
    ],
  },
  {
    slug: "tier-aligned-modern-datacenter",
    title: "Building a Tier-aligned modern datacenter",
    cat: "datacenter-it-infrastructure",
    to: "datacenter-facility-it-infrastructure",
    anchor: "datacenter-facility",
    label: "Read more about Tier-aligned datacenter facility solutions",
    paras: [
      "A modern datacenter is an integrated facility where power, cooling, space, fire protection, connectivity, monitoring, security, and operating procedures support the required availability of critical systems. Tier-aligned design applies recognized availability and maintainability principles to the client's actual workloads, site constraints, budget, and growth plan.",
      "Successful delivery depends on coordinated architecture, electrical and mechanical engineering, installation, commissioning, documentation, training, and maintenance readiness. Edge Comm-Tech designs and implements Tier-aligned datacenter facilities and related IT infrastructure, while using certified terminology only when independent certification has been formally achieved.",
    ],
  },
  {
    slug: "zero-trust-ztna-nac",
    title: "Zero Trust, ZTNA and network access control",
    cat: "cybersecurity",
    to: "cybersecurity",
    anchor: "zero-trust-ztna-nac",
    label: "Read more about Zero Trust, ZTNA and network access control",
    paras: [
      "Zero Trust is a security approach that does not grant broad access simply because a user or device is inside a network. Access decisions consider identity, device condition, requested resource, context, risk, and policy, then apply least privilege and continued verification.",
      "Zero Trust Network Access provides controlled access to approved applications, while Network Access Control governs how devices and users enter and move within network environments. Edge Comm-Tech integrates identity, multifactor authentication, device posture, segmentation, ZTNA, NAC, monitoring, and policy enforcement to help organizations reduce unnecessary exposure without obstructing legitimate work.",
    ],
  },
  {
    slug: "smart-classrooms-ai-education",
    title: "Smart classrooms and AI-powered education",
    cat: "smart-education",
    to: "software-ai-digital",
    anchor: "ai-education",
    label: "Read more about smart classrooms and AI-powered education solutions",
    paras: [
      "Smart classrooms combine interactive displays, collaboration technology, digital content, audio and video, connectivity, and intuitive control to create more engaging learning environments. They help instructors present, annotate, demonstrate, connect remote participants, and share learning material beyond a single physical board.",
      "AI-powered education resources can extend this environment with assistants grounded in approved curricula, policies, manuals, libraries, and institutional knowledge. Edge Comm-Tech brings classroom infrastructure and responsible AI together through assessment, design, implementation, integration, training, and support for universities and education departments.",
    ],
  },
  {
    slug: "reliable-power-critical-technology",
    title: "Designing reliable power for critical technology",
    cat: "power-business-continuity",
    to: "power-technology",
    anchor: null,
    label: "Read more about reliable power technology solutions",
    paras: [
      "Critical technology depends on power that is available, stable, protected, and maintainable. A reliable design begins with actual load, criticality, runtime, redundancy, growth, grid conditions, power quality, transfer requirements, safety, monitoring, and maintenance capability rather than selecting equipment by rating alone.",
      "UPS systems, batteries, generators, automatic transfer, distribution, grounding, protection, and solar or hybrid sources must operate as one coordinated power path. Edge Comm-Tech assesses, designs, supplies, integrates, tests, and supports power infrastructure for datacenters, banks, branches, public institutions, campuses, and other continuity-sensitive environments.",
    ],
  },
  {
    slug: "local-language-ai",
    title: "Local-language AI for Ethiopian organizations",
    cat: "artificial-intelligence-digital",
    to: "software-ai-digital",
    anchor: "local-language-ai",
    label: "Read more about local-language AI solutions",
    paras: [
      "Local-language AI can make digital services easier to access for employees, customers, students, and citizens who prefer to read, write, or speak in Ethiopian languages. Potential applications include knowledge assistants, voice services, education resources, institutional information, service navigation, and routine customer-support interactions.",
      "Quality varies by language, domain, model, data, speech conditions, and use case, so every solution requires careful evaluation and human review. Edge Comm-Tech can develop text- and voice-based applications using approved organizational knowledge, secure integration, clear escalation, and language testing appropriate to the intended audience.",
    ],
  },
  {
    slug: "safe-connected-university-campus",
    title: "Building a safe and connected university campus",
    cat: "datacenter-it-infrastructure",
    to: "datacenter-facility-it-infrastructure",
    anchor: "safe-campus",
    label: "Read more about safe and connected campus infrastructure",
    paras: [
      "A safe and connected campus brings surveillance, communications, networks, structured cabling, access infrastructure, control rooms, power, policies, and trained personnel into one coordinated operating environment. The goal is stronger visibility, communication, incident awareness, and authorized response across teaching, research, administrative, residential, and public spaces.",
      "Technology should support safety operations without creating unsupported guarantees or ignoring privacy and governance. Edge Comm-Tech delivers integrated campus IT infrastructure, including IP video, monitoring and recording, control rooms, radio communication, access control, barriers, connectivity, training, documentation, and lifecycle support.",
    ],
  },
];

/* ---------------------------------------------------------------- resources */

export const RESOURCE_SECTIONS = [
  { slug: "news", title: "News and Announcements", file: "news.html",
    body: "Company milestones, strategic updates, partnerships, project announcements, participation in national technology initiatives, and perspectives on Ethiopia's digital transformation." },
  { slug: "documentaries", title: "Documentary Videos", file: "media-documentaries.html",
    body: "Project documentaries, solution explainers, interviews, event highlights, training stories, and visual evidence of technology in use." },
  { slug: "press-releases", title: "Press Releases", file: "media-press-releases.html",
    body: "Official Edge Comm-Tech statements prepared for clients, partners, journalists, institutions, and the public." },
  { slug: "coverage", title: "Media Coverage", file: "media-coverage.html",
    body: "Approved external articles, interviews, broadcasts, and reports featuring Edge Comm-Tech, its people, projects, or partnerships." },
  { slug: "events", title: "Events and Webinars", file: "events.html",
    body: "Upcoming and past exhibitions, conferences, online sessions, workshops, training programs, and university-focused events." },
  { slug: "downloads", title: "Downloads", file: "downloads.html",
    body: "Current company profiles, brochures, datasheets, solution catalogues, technical guides, and approved vendor materials." },
];

/* Status is computed against the content master's own dates rather than
   hard-coded: the 28 September session has already run. */
export const EVENTS = [
  {
    slug: "agentic-ai-online-2026",
    title: "Agentic AI Online Event",
    date: "28 September 2026",
    iso: "2026-09-28",
    category: "Webinar and online event",
    format: "Online",
    venue: "Platform to be confirmed",
    status: "past",
    action: "Register Online",
    headline: "From AI answers to governed AI action",
    intro:
      "An online discussion on how Agentic AI can support multi-step organizational work while maintaining approved data access, human oversight, security, accountability, and measurable business value.",
    audience: "Business leaders, technology leaders, digital teams, institutions, and professionals",
    program: [
      "What Agentic AI is and where it differs from general chat assistants",
      "High-value use cases in banking, insurance, government, education, manufacturing, and enterprise operations",
      "Private RAG and trusted organizational knowledge",
      "Human approval, identity, access, auditability, and responsible AI",
      "Starting with a controlled pilot and defining success",
      "Questions and answers",
    ],
  },
  {
    slug: "agentic-ai-universities-2026",
    title: "Agentic AI for Universities",
    date: "23 October 2026",
    iso: "2026-10-23",
    category: "University and education event",
    format: "In person",
    venue: "Ethiopian Skylight Hotel, Addis Ababa — final room to be confirmed",
    status: "upcoming",
    action: "Request an Invitation",
    headline: "Trusted AI for learning, research, knowledge and university services",
    intro:
      "A focused university event bringing together institutional leaders, academic departments, researchers, instructors, ICT teams, and technology specialists to explore responsible Agentic AI and knowledge solutions for higher education.",
    audience: "University leaders, faculty, researchers, ICT teams, librarians, and education stakeholders",
    program: [
      "AI knowledge assistants grounded in institutional policies, curricula, manuals, and approved resources",
      "Private RAG for secure university knowledge access",
      "Agentic workflows for student, faculty, research, and administrative services",
      "AI-supported smart classrooms and digital learning resources",
      "Local-language and voice interaction opportunities",
      "Governance, academic integrity, privacy, security, evaluation, and human oversight",
      "Demonstration, discussion, and next-step workshops",
    ],
  },
  {
    slug: "gitex-global-2026",
    title: "GITEX GLOBAL 2026",
    date: "7–11 December 2026",
    iso: "2026-12-07",
    category: "Exhibition and conference",
    format: "In person",
    venue: "Dubai Exhibition Centre, Expo City Dubai, United Arab Emirates",
    status: "upcoming",
    action: "Request a Meeting",
    headline: "Connect with Edge Comm-Tech at GITEX GLOBAL 2026",
    intro:
      "Edge Comm-Tech plans to engage technology partners, clients, innovators, and industry leaders during GITEX GLOBAL 2026 in Dubai. Visitors can register their interest in a meeting to discuss AI, cloud, cybersecurity, datacenter infrastructure, enterprise systems, networks, power, education technology, and partnership opportunities.",
    audience: "Technology partners, clients, innovators and industry leaders",
    program: [
      "Meet existing and potential technology partners",
      "Explore current AI, cloud, cybersecurity, infrastructure, energy, and digital-service developments",
      "Discuss Ethiopia and regional market opportunities",
      "Arrange client, vendor, OEM, distributor, and strategic partner meetings",
      "Capture approved insights and follow-up actions for Edge Comm-Tech teams",
    ],
    pending: "Participation role is Planned: visitor, delegate, exhibitor, speaker or partner is still to be confirmed.",
  },
];

export const NEWS = [
  {
    slug: "edge-comm-tech-established-2018",
    title: "Edge Communication Technologies PLC established to deliver integrated technology solutions",
    kind: "Company milestone",
    date: "2018",
    archive: true,
    standfirst:
      "Edge Communication Technologies PLC was established in 2018 with a clear purpose: to help Ethiopian organizations design, implement, integrate, and sustain the technologies required for reliable operations and long-term digital progress.",
    paras: [
      "Edge Comm-Tech began by bringing together engineering knowledge, project execution, technology sourcing, and client support. From its earliest engagements, the company focused on solving operational needs rather than supplying isolated products.",
      "That approach has grown into an integrated portfolio spanning enterprise networks, systems and cloud, datacenter facilities and IT infrastructure, cybersecurity, power technology, broadcast and satellite systems, and software, AI, and digital solutions.",
      "Since establishment, Edge Comm-Tech has executed and delivered more than 67 projects and developed relationships with more than 40 vendors and OEMs. Its work has supported banks, universities, government institutions, and enterprises in modernizing infrastructure, protecting information, improving continuity, and enabling new digital services.",
    ],
  },
  {
    slug: "ethiopia-digital-transformation-foundations",
    title: "Building the foundations of Ethiopia's digital transformation",
    kind: "Insight",
    date: "Evergreen",
    standfirst:
      "Digital transformation is not a single application or infrastructure purchase. It is the coordinated improvement of services, processes, skills, data, connectivity, computing, security, power, and institutional capability.",
    sections: [
      { title: "Reliable digital foundations",
        body: "Organizations need resilient networks, computing, storage, cloud platforms, datacenter facilities, backup, recovery, and critical power before digital services can perform consistently. Architecture must reflect actual workloads, operating conditions, growth, security, and maintainability." },
      { title: "Trusted data and cybersecurity",
        body: "Transformation increases the value and movement of data. Identity, application security, network controls, endpoint protection, monitoring, privacy, backup, recovery, and responsible governance must therefore be designed into every program." },
      { title: "Practical artificial intelligence",
        body: "AI can make institutional knowledge easier to access, automate routine service interactions, support education, and improve decision-making. Useful enterprise AI should be grounded in approved information, protected by access controls, monitored, evaluated, and supported by human oversight." },
      { title: "Skills and operational ownership",
        body: "Projects create lasting value when client teams can operate, support, evaluate, and improve the delivered environment. Training, documentation, knowledge transfer, local support, and professional development are therefore central to sustainable transformation." },
    ],
  },
  {
    slug: "digital-transformation-meeting",
    title: "Edge Comm-Tech participates in Ethiopian digital transformation meeting",
    kind: "Company news",
    date: "Date to confirm",
    draft: true,
    standfirst:
      "Edge Comm-Tech representatives joined public- and private-sector stakeholders to discuss the priorities, partnerships, capabilities, and implementation approaches needed to advance Ethiopia's digital transformation.",
    paras: [
      "The discussion emphasized the need to connect policy ambitions with reliable infrastructure, secure digital platforms, trusted data, capable institutions, skilled professionals, sustainable investment, and measurable public and business outcomes.",
      "Edge Comm-Tech welcomed the shared goals discussed at the meeting and reaffirmed its commitment to supporting organizations with end-to-end assessment, design, sourcing, implementation, integration, training, and support.",
    ],
    pendingFields: [
      "Official meeting name",
      "Organizer and partners",
      "Date and venue",
      "Edge Comm-Tech attendees",
      "Approved event photographs",
      "Organizer or official program URL",
    ],
  },
];

export const DOWNLOADS = [
  { title: "Edge Comm-Tech Company Profile 2026", category: "Company profile",
    owner: "Edge Comm-Tech", meta: "PDF · English · Version 13",
    note: "Review against the updated website taxonomy before offering it as the current download." },
  { title: "Edge Comm-Tech Solutions Overview", category: "Solution brochure",
    owner: "Edge Comm-Tech", meta: "PDF · English",
    note: "To be created from the approved Solutions and Services content." },
  { title: "Solution datasheet", category: "Datasheet",
    owner: "To confirm", meta: "Source pending",
    note: "The supplied reference is named either HOE or HPE. Not published until the exact source is confirmed." },
  { title: "HPE vendor catalogues", category: "Vendor catalogue",
    owner: "HPE", meta: "PDF · English",
    note: "Use current documents supplied or approved by HPE or an authorized distributor." },
];
