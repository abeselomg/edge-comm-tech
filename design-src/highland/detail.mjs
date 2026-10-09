/*
 * The deep content for seven solution families and six professional services,
 * from Module 02 of the content master.
 *
 * Every entry has `headline`, `intro`, `capabilities` and `partners`. Beyond
 * that the shape varies on purpose: the content master gives each page a
 * different supporting structure, and flattening them into one template would
 * produce thirteen pages that read identically. The renderer draws whichever
 * optional blocks an entry carries.
 *
 *   outcomes   bulleted business outcomes
 *   bands      two named capability groups instead of one flat list
 *   layers     a stacked architecture
 *   steps      a numbered approach, lifecycle or delivery sequence
 *   sectors    sector-specific relevance
 *   checklist  a titled list of considerations, controls or principles
 *   models     named engagement or support models
 *   experience the approved related-experience paragraph
 */

export const SOLUTION_DETAIL = {
  /* ------------------------------------------------ software, AI & digital */
  "software-ai-digital": {
    headline: "Turn trusted knowledge into intelligent action",
    intro:
      "Edge Comm-Tech helps organizations digitize processes, connect data, automate services, and use artificial intelligence responsibly. Our solutions are designed around each organization's approved information, workflows, security requirements, language needs, and human decision-making responsibilities.",
    lead:
      "Organizations often hold valuable knowledge across policies, manuals, systems, files, emails, and experienced employees. They also manage repetitive service requests, manual approvals, disconnected workflows, and growing expectations for faster responses. We help convert these challenges into secure digital services through enterprise applications, workflow automation, analytics, trusted knowledge assistants, voice automation, and governed AI agents integrated with existing systems.",
    capabilities: [
      { title: "AI Knowledge Assistants & Intelligent Websites",
        body: "Create intelligent websites and service portals that answer questions using approved policies, manuals, procedures, service information, and internal documents. Responses can include source references, guided navigation, feedback, access controls, and human escalation." },
      { title: "AI Voice & Customer-Service Automation",
        body: "Automate inbound calls and routine interactions, capture required information, create service requests, provide approved updates, categorize cases, and route complex or sensitive matters to human teams." },
      { title: "Private Enterprise AI & RAG",
        body: "Connect AI assistants to controlled internal knowledge through secure ingestion, retrieval, role-based access, source traceability, audit logs, and deployment options aligned with organizational policy." },
      { title: "Industry-Specific Agentic AI",
        body: "Develop governed agents that support multi-step workflows, prepare outputs, interact with approved systems, request authorization, and escalate decisions under clearly defined permissions and human oversight." },
      { title: "AI for Education",
        body: "Support students, faculty, and administrators through curriculum assistants, policy assistants, research discovery, digital-library navigation, student services, learning resources, and analytics." },
      { title: "Local-Language AI",
        body: "Develop text and voice interactions supporting local languages where suitable models, data, quality evaluation, and operational conditions are available." },
      { title: "Enterprise Software & ERP",
        body: "Implement ERP, digital-office platforms, finance and operations systems, core banking and insurance platforms, IT service management, and knowledge-management solutions." },
      { title: "Business Process Automation",
        body: "Digitize forms, approvals, notifications, case management, service requests, document workflows, and cross-department processes." },
      { title: "Data Analytics & Dashboards",
        body: "Connect operational data to role-based dashboards, performance indicators, alerts, reports, and decision-support tools." },
      { title: "Custom Applications & Integrations",
        body: "Develop portals, mobile and web applications, APIs, system integrations, and specialized digital platforms." },
    ],
    layersTitle: "Flexible deployment based on risk and requirements",
    layers: [
      { title: "Experience", body: "Website, portal, mobile application, collaboration channel, voice interface, or contact-center experience." },
      { title: "AI and orchestration", body: "Models, prompts, agents, tools, workflow logic, safeguards, monitoring, and human escalation." },
      { title: "Knowledge and data", body: "Approved documents, databases, content repositories, business systems, APIs, vector search, metadata, and access controls." },
      { title: "Infrastructure", body: "On-premises, private cloud, approved public cloud, or hybrid infrastructure based on security, performance, sovereignty, and commercial requirements." },
      { title: "Governance", body: "Identity, permissions, encryption, logging, retention, testing, risk management, and operational ownership across all layers." },
    ],
    stepsTitle: "From use case to governed production service",
    steps: [
      { title: "Discover and prioritize", body: "Identify users, problems, workflows, data sources, value, risk, and measurable success criteria." },
      { title: "Assess data and readiness", body: "Review document quality, permissions, integration points, language requirements, infrastructure, and governance needs." },
      { title: "Prototype and validate", body: "Build a limited proof of concept and test answer quality, retrieval, workflow behavior, voice performance, security, and user experience." },
      { title: "Integrate and govern", body: "Connect approved systems, implement access controls, monitoring, auditability, escalation, and operating procedures." },
      { title: "Deploy and enable", body: "Release to defined users, train administrators and operational teams, document responsibilities, and manage adoption." },
      { title: "Monitor and improve", body: "Evaluate accuracy, usage, failures, cost, security, feedback, and business outcomes; update knowledge and controls continuously." },
    ],
    checklistTitle: "Trust, security and human oversight by design",
    checklistNote:
      "Enterprise AI must be useful, secure, traceable, and aligned with organizational policy. Sensitive financial, legal, employment, academic, healthcare, and government decisions remain subject to authorized human review and applicable policies.",
    checklist: [
      "Approved and traceable knowledge sources",
      "Security and privacy by design",
      "Role-based access and least privilege",
      "Human review for sensitive decisions",
      "Data classification and retention controls",
      "Audit logs and usage monitoring",
      "Model and response quality testing",
      "Clear escalation and fallback procedures",
      "Integration controls for connected systems",
      "Continuous evaluation and improvement",
    ],
    sectors: [
      { title: "Banking & Finance", body: "Customer-service assistants, policy search, onboarding support, service-request routing, internal knowledge, document classification, compliance workflow support, and analytics." },
      { title: "Insurance", body: "Customer and agent assistance, claims intake, policy knowledge, document capture, case routing, workflow automation, and reporting." },
      { title: "Education", body: "Curriculum support, student services, faculty knowledge, institutional policies, research discovery, learning resources, and local-language access." },
      { title: "Government", body: "Citizen information, institutional knowledge, service navigation, document workflows, request intake, multilingual access, and human escalation." },
      { title: "Manufacturing", body: "Maintenance knowledge, production support, quality documentation, inventory and procurement workflows, service requests, and operational analytics." },
      { title: "Enterprise", body: "Employee self-service, HR and finance workflows, IT support, knowledge management, customer service, dashboards, and process automation." },
    ],
    measuresTitle: "Measure business value, not only model performance",
    measures: [
      "Reduced response and handling time",
      "Higher self-service resolution rate",
      "Improved access to approved knowledge",
      "Reduced repetitive workload",
      "Faster service-request creation and routing",
      "Improved employee or customer experience",
      "Answer accuracy and source-grounding rate",
      "Human-escalation quality",
      "Adoption, satisfaction, and accessibility",
      "Security, privacy, reliability, and cost performance",
    ],
    partners: ["Oracle", "Microsoft", "BPC", "PeopleLink", "IQBoard", "NEARITY", "Evoltsoft"],
    links: ["system-cloud", "cybersecurity", "enterprise-network", "datacenter-facility-it-infrastructure"],
  },

  /* ----------------------------------------------------- enterprise network */
  "enterprise-network": {
    headline: "Connect every user, device, application and location",
    intro:
      "Edge Comm-Tech designs and implements secure, scalable, and manageable networks for campuses, branches, datacenters, offices, and distributed operations. Our approach combines connectivity, performance, visibility, collaboration, and security within one architecture.",
    outcomesTitle: "Networks designed for availability, experience and growth",
    outcomes: [
      "Reliable connectivity across users, locations, and services",
      "Improved application and collaboration performance",
      "Secure access for employees, guests, devices, and workloads",
      "Centralized visibility, policy, monitoring, and troubleshooting",
      "Scalable architecture for branch, campus, cloud, and datacenter growth",
      "Simplified operations through automation and software-defined control",
    ],
    capabilities: [
      { title: "Campus LAN & Switching", body: "Core, distribution, and access architectures; segmentation; high availability; quality of service; and lifecycle modernization." },
      { title: "Enterprise WLAN", body: "Coverage and capacity design, secure access, guest services, mobility, controller or cloud management, and performance optimization." },
      { title: "Software-Defined Networking", body: "Policy-based control, automation, segmentation, assurance, and simplified management across campus and datacenter environments." },
      { title: "Network Management & Observability", body: "Centralized monitoring, configuration, alerts, performance analytics, inventory, topology, and operational reporting." },
      { title: "Unified Communications", body: "Call control, IP telephony, voice gateways, messaging, presence, conferencing, and integration with organizational workflows." },
      { title: "Video Collaboration", body: "Meeting-room systems, video endpoints, multipoint services, web conferencing, recording, and hybrid collaboration environments." },
      { title: "Contact Center Infrastructure", body: "Voice routing, interactive voice response, recording, reporting, workforce tools, CRM integration, and customer-service workflows." },
      { title: "Structured Cabling", body: "Copper and fiber horizontal and backbone cabling, pathways, racks, labeling, testing, documentation, and standards-aligned installation." },
      { title: "Network Access & Segmentation", body: "Identity-aware access, device profiling, network admission controls, guest access, micro-segmentation readiness, and policy enforcement." },
      { title: "Network Security", body: "Secure gateways, segmentation, encrypted connectivity, remote access, intrusion prevention, and integration with wider security monitoring." },
    ],
    stepsTitle: "From site survey to operational support",
    steps: [
      { title: "Assessment", body: "Inventory, traffic, coverage, configuration, dependencies, risks, performance, and future capacity." },
      { title: "Architecture & design", body: "High-level and low-level design, addressing, routing, segmentation, resilience, wireless planning, and bill of materials." },
      { title: "Implementation", body: "Staging, installation, migration, configuration, integration, testing, documentation, and acceptance." },
      { title: "Optimization", body: "Coverage tuning, performance improvement, policy refinement, software updates, and capacity planning." },
      { title: "Support", body: "Incident response, monitoring, configuration assistance, maintenance, and lifecycle planning." },
    ],
    sectors: [
      { title: "Banking", body: "Secure branch and head-office connectivity, datacenter networking, collaboration, segmentation, visibility, and continuity." },
      { title: "Education", body: "Campus LAN and WLAN, student and staff access, smart classrooms, collaboration, surveillance connectivity, and network management." },
      { title: "Government", body: "Secure campus and branch connectivity, collaboration, centralized management, remote access, and service availability." },
      { title: "Enterprise", body: "Office, branch, warehouse, meeting, contact-center, guest, and cloud connectivity." },
    ],
    experience:
      "Relevant experience includes smart classrooms, smart meeting rooms, enterprise computing environments, campus surveillance connectivity, and multidisciplinary infrastructure projects for universities, banks, and government institutions.",
    partners: ["HPE Aruba Networking", "Arista Networks", "Mitel", "Logitech", "Fortinet"],
    links: ["cybersecurity", "system-cloud", "datacenter-facility-it-infrastructure"],
  },

  /* ---------------------------------------------------------- system & cloud */
  "system-cloud": {
    headline: "Build the digital foundation for critical workloads",
    intro:
      "Edge Comm-Tech helps organizations design, modernize, and operate computing platforms that support business applications, databases, analytics, virtualization, digital services, and emerging AI workloads.",
    outcomesTitle: "Performance, resilience and control",
    outcomes: [
      "Right-sized compute and storage for current and future workloads",
      "Higher availability and improved recovery readiness",
      "Consolidated infrastructure and simplified management",
      "Secure hybrid architectures aligned with data and regulatory requirements",
      "Improved utilization through virtualization and HCI",
      "A practical platform for analytics, automation, and AI readiness",
    ],
    capabilities: [
      { title: "Enterprise Compute", body: "Rack, tower, blade, and mission-critical server platforms sized for applications, databases, virtualization, and specialized workloads." },
      { title: "Engineered Systems", body: "Integrated platforms such as database, recovery, and high-performance engineered systems where workload requirements justify purpose-built architecture." },
      { title: "Enterprise Storage", body: "SAN, NAS, all-flash and hybrid storage, tape libraries, cartridges, replication, tiering, and capacity planning." },
      { title: "Virtualization", body: "Server, desktop, application, and storage virtualization with high availability, resource management, and migration planning." },
      { title: "Hyperconverged Infrastructure", body: "Integrated compute, storage, virtualization, and management for scalable private-cloud and datacenter modernization." },
      { title: "Backup & Recovery", body: "Policy-based backup, immutable or protected recovery options where supported, tape, replication, retention, testing, and restoration procedures." },
      { title: "Disaster Recovery", body: "Business-impact assessment, recovery objectives, replication, secondary-site architecture, orchestration, testing, and runbooks." },
      { title: "Databases & Data Platforms", body: "Database platforms, availability, migration, performance, security integration, lifecycle management, and supporting infrastructure." },
      { title: "Load Balancing & Application Delivery", body: "Traffic distribution, availability, acceleration, health monitoring, and secure delivery for applications and services." },
      { title: "Hybrid Cloud & Automation", body: "Workload placement, private and public cloud integration, provisioning, monitoring, governance, automation, and cost visibility." },
      { title: "Operating Systems & Firmware", body: "Deployment, hardening support, patch and firmware planning, compatibility, and lifecycle coordination." },
      { title: "End-User Computing", body: "Laptops, desktops, workstations, tablets, VDI endpoints, printers, scanners, and managed workplace technologies." },
    ],
    checklistTitle: "Architecture based on business and technical requirements",
    checklist: [
      "Application criticality and availability requirements",
      "Performance, capacity, and growth forecasts",
      "Recovery point and recovery time objectives",
      "Data classification, residency, privacy, and security",
      "Integration with network, identity, monitoring, and backup",
      "Support model, skills, licensing, lifecycle, and total cost",
      "Energy, cooling, rack, and facility requirements",
      "AI and analytics workload readiness where applicable",
    ],
    experience:
      "Relevant projects include Gadaa Bank servers, SAN switching, storage and tape library; National Bank of Ethiopia backup tape libraries and licensing; Ministry of Urban and Infrastructure servers, storage, backup, load balancing, rack infrastructure and UPS; and Ethiopian Securities Exchange database software.",
    partners: ["HPE", "HP", "Nutanix", "Veeam", "Oracle", "Broadcom", "Sangfor"],
    links: ["datacenter-facility-it-infrastructure", "cybersecurity", "enterprise-network", "software-ai-digital"],
  },

  /* ---------------------------------------- datacenter facility & IT infra */
  "datacenter-facility-it-infrastructure": {
    headline: "Modern facilities and connected infrastructure for critical operations",
    intro:
      "Edge Comm-Tech designs and delivers Tier-aligned datacenter facilities and integrated IT infrastructure that keep critical systems available, protected, monitored, maintainable, and ready for growth. We coordinate architectural, electrical, mechanical, connectivity, surveillance, access, safety, and operational requirements as one system.",
    outcomesTitle: "Reliable facilities and controlled technology environments",
    outcomes: [
      "Datacenter availability designed around defined business and workload requirements",
      "Coordinated power, cooling, space, fire protection, racks, pathways, and connectivity",
      "Integrated surveillance, access control, barriers, and visitor-management infrastructure",
      "Scalable fiber-optic and copper cabling for datacenters, campuses, offices, and facilities",
      "Centralized visibility through DCIM, environmental monitoring, video management, and access systems",
      "Reduced operational risk through testing, labeling, documentation, training, and lifecycle planning",
    ],
    /* Two bands rather than one list. This page covers two distinct domains
       and the content master asks for them to be visually separated. */
    bands: [
      {
        label: "Datacenter facility",
        title: "Tier-aligned modern datacenter facilities",
        items: [
          { title: "Datacenter Consulting & Tier-Aligned Design", body: "Requirements analysis, site assessment, capacity planning, availability objectives, topology, space planning, resilience, maintainability, phased growth, and documentation." },
          { title: "Greenfield & Brownfield Delivery", body: "New datacenter construction, existing-site modernization, room conversion, migration coordination, expansion, remediation, and live-environment planning." },
          { title: "Modular Datacenters & Containment", body: "Prefabricated and modular environments, micro and edge datacenters, hot-aisle and cold-aisle containment, scalable deployment, and integrated facility systems." },
          { title: "Precision Cooling", body: "Cooling-load assessment, close-control cooling, airflow management, containment, redundancy, monitoring, and efficiency improvement." },
          { title: "Critical Power Infrastructure", body: "UPS, batteries, distribution, generators, ATS, grounding, protection, redundancy, monitoring, and coordination with facility electrical systems." },
          { title: "DCIM & Environmental Monitoring", body: "Temperature, humidity, water, smoke, power, capacity, alarms, asset visibility, dashboards, and operational reporting." },
          { title: "Fire Detection & Suppression", body: "Early detection, alarming, suitable suppression architectures, safety coordination, testing, and documentation." },
          { title: "Racks, Raised Floors & Civil Works", body: "Racks and cabinets, flooring, room preparation, partitions, ceilings, pathways, finishing, structural support, and coordinated civil works." },
          { title: "Commissioning & Operational Readiness", body: "Integrated testing, failover scenarios, alarms, performance verification, as-built records, operating procedures, training, maintenance planning, and handover." },
        ],
      },
      {
        label: "IT infrastructure",
        title: "Connected, secure and manageable physical infrastructure",
        items: [
          { title: "Fiber-Optic Structured Cabling", body: "Campus, building, backbone, datacenter, and inter-building fiber; pathways; splicing; termination; testing; labeling; certification records; and as-built documentation." },
          { title: "Copper Structured Cabling", body: "Horizontal and backbone copper cabling, outlets, patch panels, racks, pathways, labeling, testing, and standards-aligned installation." },
          { title: "IP Security Camera Systems", body: "IP cameras, video management platforms, recording, storage, control rooms, analytics-ready architecture, monitoring, retention planning, and network integration." },
          { title: "Access Control Systems", body: "Card, biometric, mobile, and credential-based access; controllers; readers; locks; visitor workflows; attendance integration where required; monitoring; and audit trails." },
          { title: "Gate Barriers & Entrance Control", body: "Vehicle barriers, bollards, turnstiles, speed gates, intercoms, loop detectors, credential integration, safety controls, and centralized management." },
          { title: "Visitor & Parking Management", body: "Visitor registration, authorization, badges, parking access, vehicle identification, reporting, and integration with access and surveillance systems." },
          { title: "Command Center & Control Room Infrastructure", body: "Video walls, operator consoles, KVM, control-room displays, incident visibility, communications integration, and supporting network and power infrastructure." },
          { title: "Smart Meeting & Display Environments", body: "Smart conference rooms, interactive displays, LED screens, podium systems, collaboration technology, and supporting infrastructure." },
          { title: "Tower & External Infrastructure", body: "Communication towers, external pathways, grounding, cabinets, outdoor connectivity, and related infrastructure where required." },
        ],
      },
    ],
    capabilities: [],
    stepsTitle: "Design, coordinate, build, test and hand over",
    steps: [
      { title: "Assess", body: "Site, capacity, workloads, availability objectives, power, cooling, risks, constraints, and growth." },
      { title: "Design", body: "Integrated architectural, electrical, mechanical, network, security, monitoring, and operational design." },
      { title: "Coordinate", body: "OEMs, contractors, client teams, consultants, logistics, civil works, and technology installation." },
      { title: "Commission", body: "Testing, failover scenarios, alarms, environmental performance, documentation, and acceptance." },
      { title: "Enable", body: "Operating procedures, as-built records, training, maintenance planning, and support." },
    ],
    experience:
      "Relevant experience includes Siinqee Bank datacenter and power-related solutions, Ministry of Urban and Infrastructure compute and UPS infrastructure, Bahir Dar University CCTV and multidisciplinary smart-classroom projects, Arba Minch University smart meeting rooms, and display and facility-infrastructure projects for public institutions.",
    note:
      "Tier claims and certification status are stated only when independently verified. CCTV, access control, gate barriers and visitor management are IT infrastructure here, not cybersecurity.",
    partners: ["Vertiv", "Canovate", "KSTAR", "Hikvision", "Dahua Technology", "Canon"],
    links: ["system-cloud", "power-technology", "cybersecurity", "enterprise-network"],
  },

  /* ------------------------------------------------------------ cybersecurity */
  cybersecurity: {
    headline: "Protect digital services, identities, applications and data",
    intro:
      "Edge Comm-Tech helps organizations reduce cyber risk through integrated controls spanning cloud environments, networks, applications, endpoints, digital identities, security operations, digital perimeters, data, vulnerabilities, access, response, and recovery.",
    lead:
      "Modern organizations operate across branches, cloud services, remote users, mobile devices, applications, APIs, and connected systems. Security must therefore verify access, protect data, monitor activity, support response, and strengthen recovery across the environment. No single product provides complete protection; effective security depends on integrated technology, process, people, and continuous improvement.",
    capabilities: [
      { title: "Cloud Security", body: "Cloud-security posture, workload protection, identity and entitlement controls, secure configuration, logging, segmentation, data safeguards, and monitoring across approved cloud environments." },
      { title: "Network Security", body: "Next-generation firewalls, intrusion prevention, secure segmentation, encrypted connectivity, remote access, network detection, policy management, and integration with security operations." },
      { title: "Application & API Security", body: "Web application firewall, API discovery and protection, bot management, authentication and authorization controls, application testing, code and dependency visibility, and secure delivery practices." },
      { title: "Endpoint Security", body: "Endpoint protection, EDR and XDR-aligned capabilities, behavioral detection, device control, investigation, containment, response, and integration with wider monitoring." },
      { title: "Digital Identity Security", body: "IAM, single sign-on, multifactor authentication, identity governance, privileged access management, credential protection, lifecycle controls, and access review." },
      { title: "Security Operations", body: "SIEM, SOAR, security analytics, threat intelligence, detection engineering, playbooks, case management, investigation, incident response, reporting, and continuous improvement." },
      { title: "Digital Perimeter Security", body: "Secure internet and branch access, next-generation firewalls, secure web gateways, email and collaboration protection, DNS security, anti-DDoS, remote-access controls, and threat prevention." },
      { title: "Data Security", body: "Data discovery and classification support, encryption, key-management integration, DLP, database activity monitoring, access monitoring, retention controls, and protection against unauthorized exposure." },
      { title: "Vulnerability Management Stack", body: "Asset discovery, vulnerability scanning, prioritization, exposure assessment, configuration review, remediation workflow, verification, dashboards, and risk-based reporting." },
      { title: "ADC & Next-Generation Load Balancing", body: "Application delivery controllers, load balancing, health monitoring, SSL or TLS offload, acceleration, availability, traffic management, WAF integration, API protection, and secure application delivery." },
      { title: "Zero Trust Network Access & NAC", body: "Identity- and device-aware access, posture assessment, least-privilege application access, network admission control, guest and contractor access, segmentation, policy enforcement, and continuous verification." },
      { title: "Security Assessment & Audit Support", body: "Architecture review, configuration assessment, gap analysis, security testing coordination, recommendations, remediation planning, and evidence support for authorized audits." },
    ],
    stepsTitle: "Prepare, prevent, detect, respond and recover",
    steps: [
      { title: "Govern", body: "Define priorities, responsibilities, policies, risk ownership, architecture, and measurable outcomes." },
      { title: "Identify", body: "Understand digital assets, identities, data, applications, cloud services, dependencies, vulnerabilities, exposures, and business impact." },
      { title: "Protect", body: "Apply layered preventive controls, secure configuration, access control, encryption, training, segmentation, and resilience." },
      { title: "Detect", body: "Monitor endpoints, networks, applications, identities, databases, cloud services, access events, and security telemetry." },
      { title: "Respond", body: "Triage, investigate, contain, communicate, coordinate, preserve evidence, and restore controlled operations." },
      { title: "Recover", body: "Validate backups, prioritize services, restore safely, learn from incidents, and improve controls." },
    ],
    sectors: [
      { title: "Financial Services", body: "Digital identity, privileged access, transaction and application protection, ADC, monitoring, data security, vulnerability management, resilience, and audit-supporting visibility." },
      { title: "Government", body: "Zero-trust access, cloud and network security, application and API protection, security operations, data safeguards, endpoint security, continuity, and citizen-service resilience." },
      { title: "Education", body: "Campus segmentation, NAC, identity, endpoint protection, email security, application protection, vulnerability management, awareness, and backup integration." },
      { title: "Enterprise", body: "Risk-based controls for users, devices, applications, data, remote access, cloud services, digital perimeters, security operations, and business continuity." },
    ],
    note:
      "Controls reduce risk; they do not guarantee prevention of every incident. Security cameras, gate barriers, entrance control and physical access control are handled as IT infrastructure, not cybersecurity.",
    partners: ["Fortinet", "Sophos", "Broadcom", "Sangfor", "Microsoft", "Arrays Networks"],
    links: ["enterprise-network", "system-cloud", "software-ai-digital", "datacenter-facility-it-infrastructure"],
  },

  /* -------------------------------------------------------- power technology */
  "power-technology": {
    headline: "Reliable power for continuous operations",
    intro:
      "Edge Comm-Tech delivers power technologies that protect critical facilities, digital infrastructure, institutional services, and business operations against interruption, instability, and capacity constraints.",
    outcomesTitle: "Continuity, safety, efficiency and growth",
    outcomes: [
      "Reduced service disruption and equipment risk",
      "Coordinated primary, backup, and alternative power",
      "Right-sized capacity for current load and future expansion",
      "Improved visibility through monitoring and alarms",
      "Safer integration through electrical assessment, protection, and documentation",
      "A practical path toward solar, hybrid, and electric-mobility technologies",
    ],
    capabilities: [
      { title: "Uninterruptible Power Systems", body: "Online and modular UPS architectures, batteries, redundancy, runtime assessment, distribution, monitoring, testing, and maintenance planning." },
      { title: "Diesel Generator Systems", body: "Generator sizing, synchronization or redundancy where required, acoustic and environmental considerations, fuel systems, installation coordination, testing, and support." },
      { title: "Automatic Transfer Systems", body: "Automatic transfer switches, changeover logic, coordination, protection, testing, and integration with generators and facility systems." },
      { title: "Electrical Infrastructure", body: "Panels, distribution, cabling, grounding, protection, monitoring, power quality, and coordinated electrical works." },
      { title: "Solar & Hybrid Energy", body: "Solar generation, inverters, storage, hybrid architectures, load assessment, monitoring, and integration with grid and backup power." },
      { title: "Power Monitoring", body: "Meters, alarms, dashboards, battery and UPS monitoring, energy visibility, event records, and maintenance support." },
      { title: "Transmission Technologies", body: "Relevant electrical transmission and distribution components, engineering coordination, and project support based on scope." },
      { title: "EV Charging", body: "AC and DC charging options, OCPP-ready architectures, site power assessment, connectivity, charging management, payment integration, monitoring, and deployment planning." },
    ],
    checklistTitle: "Power architecture based on the actual load",
    checklist: [
      "Critical and non-critical load classification",
      "Current demand, starting current, power factor, and growth",
      "Required autonomy and acceptable recovery time",
      "Redundancy and maintenance requirements",
      "Fuel, solar resource, batteries, grid conditions, and operating profile",
      "Cooling, ventilation, noise, safety, grounding, and protection",
      "Remote monitoring, connectivity, alarms, and maintenance capability",
      "Lifecycle cost, efficiency, spares, service, and replacement planning",
    ],
    experience:
      "Relevant experience includes Siinqee Bank UPS and datacenter-related power solutions, Zemen Bank generator projects, Federal Supreme Court generators, Ministry of Urban and Infrastructure UPS systems, and power components integrated into wider datacenter and smart-facility projects.",
    partners: ["Cummins", "KSTAR", "Perkins", "Vertiv", "Teltonika Energy", "Evoltsoft"],
    links: ["datacenter-facility-it-infrastructure", "system-cloud"],
  },

  /* ----------------------------------------------------- broadcast & satellite */
  "broadcast-satellite": {
    headline: "Connect content, audiences and locations",
    intro:
      "Edge Comm-Tech supports broadcasters, institutions, government organizations, enterprises, and connectivity providers with integrated broadcast, display, and satellite technologies.",
    outcomesTitle: "Reliable distribution across terrestrial, IP and satellite channels",
    outcomes: [
      "Expanded audience and service reach",
      "Integrated production, contribution, transmission, and distribution workflows",
      "Reliable delivery across terrestrial, IP, and satellite environments",
      "Improved monitoring, manageability, and operational continuity",
      "Scalable architecture for channels, locations, bandwidth, and future services",
      "Local project coordination supported by global technology relationships",
    ],
    capabilities: [
      { title: "FM & AM Broadcast Systems", body: "Transmission architecture, studio-to-transmitter links, antennas, supporting systems, monitoring, installation coordination, and commissioning." },
      { title: "Studio Solutions", body: "Audio and video production environments, routing, mixing, recording, editing, intercom, contribution, storage, and workflow integration." },
      { title: "Television Transmission", body: "Headend and transmission components, encoding, multiplexing, distribution, monitoring, and supporting infrastructure." },
      { title: "Satellite Broadcasting", body: "DTH and HDTV service components, contribution and distribution, capacity planning, uplink and teleport-related coordination, monitoring, and service integration." },
      { title: "Video over IP", body: "IP contribution and distribution, encoding and decoding, transport, monitoring, network integration, and workflow modernization." },
      { title: "Satellite Broadband", body: "Broadband and IP-over-satellite services for institutions, enterprises, remote sites, and specialized connectivity requirements." },
      { title: "Virtual Network Operator Enablement", body: "Service models supporting managed satellite capacity, customer provisioning, monitoring, and commercial service delivery where applicable." },
      { title: "LED Display Systems", body: "Indoor and outdoor LED displays, controllers, supporting structures, power, signal distribution, installation, and content-display integration." },
      { title: "Monitoring & Support", body: "Performance monitoring, alarms, preventive maintenance, technical support, documentation, training, and lifecycle planning." },
    ],
    stepsTitle: "Coordinate spectrum, content, network, facility and operations",
    steps: [
      { title: "Requirements", body: "Audience, coverage, content, capacity, quality, availability, locations, regulations, and operations." },
      { title: "Architecture", body: "Studio, transport, transmission, satellite, IP, display, network, power, monitoring, and redundancy." },
      { title: "Partner coordination", body: "OEMs, satellite operators, distributors, consultants, regulators, logistics, and client technical teams." },
      { title: "Implementation", body: "Site preparation, installation, configuration, integration, testing, commissioning, documentation, and training." },
      { title: "Operations", body: "Monitoring, support, capacity and service management, maintenance, and future expansion." },
    ],
    experience:
      "Edge Comm-Tech entered broadcast and satellite solutions in June 2024. Current capabilities build on experience with LED display systems, enterprise networking, power, datacenter infrastructure, video collaboration, and cooperation with satellite-sector partners including Azercosmos.",
    note:
      "Satellite service development covers DTH, HDTV, video over IP, channel distribution, broadband, virtual-network-operator models and IP over satellite, subject to commercial, regulatory, technical and capacity arrangements.",
    partners: ["Azercosmos"],
    links: ["enterprise-network", "power-technology", "datacenter-facility-it-infrastructure"],
  },
};

/* ====================================================== professional services */

export const SERVICE_DETAIL = {
  "advisory-assessment-design": {
    headline: "Make technology decisions with greater clarity",
    intro:
      "Edge Comm-Tech helps organizations translate business priorities into practical technology requirements, architectures, investment plans, and implementation roadmaps. Recommendations consider existing assets, users, data, risk, capacity, interoperability, operations, budget, and future growth.",
    capabilities: [
      { title: "Current-State Assessment", body: "Review infrastructure, applications, facilities, security controls, operations, contracts, skills, risks, constraints, and performance." },
      { title: "Requirements Discovery", body: "Engage business, technical, operational, procurement, finance, and leadership stakeholders to define measurable requirements and priorities." },
      { title: "Architecture & Solution Design", body: "Prepare high-level and low-level designs, integration requirements, capacity models, resilience patterns, security considerations, and operating assumptions." },
      { title: "Roadmaps & Investment Planning", body: "Sequence immediate improvements, modernization initiatives, dependencies, budgets, risks, and future expansion into an achievable roadmap." },
      { title: "Specifications & Bills of Quantities", body: "Develop technically clear, vendor-aware or vendor-neutral requirements, bills of quantities, compliance criteria, and acceptance requirements as agreed." },
      { title: "Tender & Evaluation Support", body: "Support clarifications, technical evaluation frameworks, compliance review, demonstrations, proofs of concept, and recommendation reports while respecting procurement governance." },
      { title: "Design Review & Assurance", body: "Review proposed designs, bills of materials, implementation methods, test plans, documentation, and readiness before deployment." },
    ],
    checklistTitle: "Evidence that supports approval and execution",
    checklist: [
      "Assessment and gap-analysis report",
      "Requirements and stakeholder matrix",
      "High-level and low-level architecture",
      "Capacity and availability recommendations",
      "Security and continuity considerations",
      "Specifications and bill of quantities",
      "Implementation roadmap and preliminary budget",
      "Risk, dependency and assumption register",
      "Evaluation and acceptance framework",
    ],
    fit: "This service supports new facilities, modernization programs, capacity expansion, technology refresh, cloud or AI readiness, cybersecurity improvement, network transformation, software selection, and multidisciplinary projects requiring coordinated design.",
    note:
      "Where Edge Comm-Tech also supplies or implements the solution, roles and any conflicts are defined transparently rather than described as independent audit.",
    links: ["implementation-integration", "procurement-supply", "project-management-deployment"],
  },

  "procurement-supply": {
    headline: "Source the right technology with controlled delivery",
    intro:
      "Edge Comm-Tech coordinates technology procurement from approved requirements through commercial sourcing, logistics, delivery, documentation, and warranty registration. Our goal is to protect specification compliance, interoperability, authenticity, delivery visibility, and lifecycle support.",
    capabilities: [
      { title: "Specification & Compliance Review", body: "Validate requested configurations, quantities, compatibility, licensing, accessories, power, space, environmental needs, support, and delivery conditions." },
      { title: "OEM, Distributor & Partner Coordination", body: "Engage relevant manufacturers, authorized distributors, and technology partners based on product, territory, availability, commercial terms, and support requirements." },
      { title: "Commercial Comparison & Optimization", body: "Compare technically compliant options, lifecycle implications, lead times, warranties, subscriptions, support, and total cost within approved procurement rules." },
      { title: "Licensing & Subscription Coordination", body: "Coordinate license metrics, terms, entitlements, renewals, support coverage, registration, and handover documentation." },
      { title: "Import Logistics & Delivery Control", body: "Coordinate shipping, documentation, customs-related processes, receiving, inspection, storage, transport, and site delivery based on contractual responsibility." },
      { title: "Asset Documentation & Warranty", body: "Maintain serial numbers, packing lists, delivery records, warranty information, subscriptions, support contacts, and client handover records." },
      { title: "Staging & Preconfiguration", body: "Where appropriate, inspect, inventory, assemble, label, update, configure, and test equipment before site deployment." },
    ],
    checklistTitle: "Reduce avoidable commercial and technical risk",
    checklist: [
      "Approved bill of quantities and change control",
      "Traceable OEM or distributor quotations",
      "Compatibility and dependency validation",
      "Lead-time and end-of-sale review",
      "License and subscription clarity",
      "Inspection and delivery evidence",
      "Warranty and support registration",
      "Secure handling of configurations and credentials",
    ],
    fit: "Edge Comm-Tech works across more than 40 vendor and OEM relationships. Procurement is part of a controlled technology lifecycle, not product resale.",
    note:
      "Stock availability, lead time, authorization status and price are not published; they are confirmed per engagement.",
    links: ["implementation-integration", "managed-support-maintenance", "advisory-assessment-design"],
  },

  "implementation-integration": {
    headline: "Turn approved designs into stable working systems",
    intro:
      "Edge Comm-Tech implements and integrates technologies across software, networks, systems, cloud, datacenters, IT infrastructure, cybersecurity, power, broadcast, and satellite environments. Work is controlled through approved designs, method statements, testing, documentation, and acceptance.",
    capabilities: [
      { title: "Site Readiness & Method Planning", body: "Confirm access, civil and electrical readiness, space, cooling, cabling, connectivity, dependencies, safety, downtime, resources, and implementation methods." },
      { title: "Installation & Configuration", body: "Install, assemble, label, configure, update, harden, and connect equipment and software in accordance with approved designs and vendor guidance." },
      { title: "Migration & Cutover", body: "Prepare inventories, backups, test migrations, rollback plans, communications, change windows, validation, and controlled production transition." },
      { title: "Systems Integration", body: "Connect platforms, applications, APIs, identity, monitoring, networks, data, power, facilities, security controls, and management tools as required." },
      { title: "Testing & Quality Assurance", body: "Perform inspection, functional testing, performance and resilience checks, security validation within scope, defect tracking, remediation, and retesting." },
      { title: "Commissioning & Acceptance", body: "Execute approved test scripts, demonstrate requirements, record results, resolve punch-list items, and support formal acceptance." },
      { title: "Documentation & Handover", body: "Provide configurations, diagrams, inventories, licenses, warranties, test results, as-built records, operating guidance, credentials handover, and training as applicable." },
    ],
    checklistTitle: "Interoperable, secure, documented and supportable",
    checklist: [
      "Use approved architecture and controlled changes",
      "Protect production data and maintain rollback options",
      "Coordinate dependencies across vendors and contractors",
      "Apply secure configuration and least privilege",
      "Test normal, failure and recovery conditions where authorized",
      "Maintain accurate as-built documentation",
      "Transfer operational knowledge before closure",
    ],
    fit: "Edge Comm-Tech has executed and delivered more than 67 projects, including computing, backup, smart classroom, smart meeting, CCTV, datacenter-related, power, generator, database and LED display assignments for financial institutions, universities and public organizations.",
    links: ["project-management-deployment", "training-knowledge-transfer", "managed-support-maintenance"],
  },

  "project-management-deployment": {
    headline: "Coordinate complex technology delivery with clear accountability",
    intro:
      "Edge Comm-Tech provides project governance and delivery coordination for technology programs involving multiple sites, disciplines, vendors, stakeholders, dependencies, and acceptance requirements. Our PMO approach connects commercial commitments with technical execution and client decisions.",
    capabilities: [
      { title: "Mobilization & Governance", body: "Confirm scope, contract requirements, stakeholders, roles, communication, approvals, reporting, escalation, and decision rights." },
      { title: "Planning & Scheduling", body: "Develop work breakdown structures, milestones, resources, procurement and logistics dependencies, site sequences, test activities, and acceptance dates." },
      { title: "Risk, Issue & Dependency Management", body: "Identify, assign, monitor, escalate, and close technical, commercial, site, logistics, stakeholder, quality, and schedule risks and issues." },
      { title: "Stakeholder & Vendor Coordination", body: "Coordinate clients, consultants, OEMs, distributors, subcontractors, regulators, logistics providers, and internal technical teams." },
      { title: "Quality & Documentation Control", body: "Manage submissions, designs, approvals, method statements, inspection records, test results, changes, as-built documents, training records, and handover packages." },
      { title: "Progress & Financial Coordination", body: "Track physical progress, deliverables, invoices, variations, payment dependencies, forecasts, and management reporting while maintaining appropriate role separation." },
      { title: "Acceptance & Closure", body: "Manage punch lists, final tests, client acceptance, handover, warranty transition, lessons learned, and formal closure." },
    ],
    checklistTitle: "Make progress visible and decisions timely",
    checklist: [
      "Approved baseline scope, schedule and responsibilities",
      "Milestone and dependency tracking",
      "Regular progress and decision reporting",
      "Documented change and variation control",
      "Quality inspection and acceptance evidence",
      "Issue ownership and escalation timelines",
      "Handover, warranty and support transition",
    ],
    fit: "Project management can be included within Edge Comm-Tech delivery or provided as a separately defined service. Responsibilities, authority, deliverables and independence are agreed before mobilization.",
    links: ["implementation-integration", "procurement-supply", "managed-support-maintenance"],
  },

  "managed-support-maintenance": {
    headline: "Keep critical technology available, secure and supportable",
    intro:
      "Edge Comm-Tech supports installed technology through structured service management, monitoring, preventive maintenance, incident response, vendor coordination, health checks, reporting, and lifecycle planning. The service model is tailored to the supported technologies, locations, coverage hours, criticality, skills, and approved service levels.",
    capabilities: [
      { title: "Service Desk & Request Management", body: "Receive, classify, prioritize, route, communicate, track, and close incidents and service requests through agreed channels and workflows." },
      { title: "Monitoring & Event Management", body: "Monitor availability, capacity, performance, alarms, logs, environmental conditions, power, connectivity, and supported service indicators where tools and access permit." },
      { title: "Preventive Maintenance", body: "Perform scheduled inspection, cleaning where appropriate, health checks, backups of configurations, testing, firmware or software review, and maintenance reporting." },
      { title: "Incident Diagnosis & Restoration", body: "Investigate faults, isolate causes, apply approved workarounds or repairs, restore service, validate operation, communicate status, and document resolution." },
      { title: "Vendor & Warranty Escalation", body: "Coordinate support cases, logs, replacement processes, licensing, subscriptions, technical escalation, and warranty claims with relevant partners." },
      { title: "Patch, Upgrade & Change Support", body: "Assess, plan, test, approve, deploy, verify, document, and where necessary roll back authorized updates and changes." },
      { title: "Capacity, Performance & Lifecycle Review", body: "Analyze trends, risks, utilization, component age, support status, recurring incidents, and improvement priorities." },
    ],
    modelsTitle: "Select the right level of operational responsibility",
    models: [
      { title: "Warranty Support", body: "Coordinate covered product issues and OEM processes during the applicable warranty period." },
      { title: "Annual Maintenance Agreement", body: "Provide scheduled maintenance and agreed corrective support for defined assets and sites." },
      { title: "Resident or Dedicated Support", body: "Assign approved technical resources to defined locations, shifts, responsibilities, and governance." },
      { title: "Remote Managed Service", body: "Provide authorized remote monitoring, administration, reporting, and operational support for defined systems." },
      { title: "On-Demand Professional Support", body: "Deliver scoped troubleshooting, health checks, upgrades, recovery, or specialist assistance." },
    ],
    note:
      "Coverage hours, response targets, restoration objectives, onsite attendance, spare parts, monitoring scope, exclusions, dependencies, escalation and reporting are defined per agreement. No universal response or uptime guarantee is published.",
    links: ["training-knowledge-transfer", "implementation-integration", "project-management-deployment"],
  },

  "training-knowledge-transfer": {
    headline: "Build the capability to operate technology with confidence",
    intro:
      "Edge Comm-Tech helps administrators, engineers, operators, users, and decision-makers understand and use implemented technology. Training and knowledge transfer are designed around roles, actual environments, approved procedures, and the responsibilities retained by the client team.",
    capabilities: [
      { title: "Administrator & Engineer Training", body: "Configuration, monitoring, routine operations, access control, backup, troubleshooting, escalation, maintenance, and change procedures for supported technologies." },
      { title: "End-User Enablement", body: "Role-based instruction for software, collaboration, smart classroom, meeting, service portal, display, and approved digital solutions." },
      { title: "Operational Handover Workshops", body: "Walk through architecture, as-built documents, inventories, licenses, warranties, credentials, runbooks, monitoring, support contacts, and open actions." },
      { title: "Customized Technical Workshops", body: "Develop focused sessions for technologies, use cases, operational challenges, security practices, modernization priorities, or planned projects." },
      { title: "On-the-Job Knowledge Transfer", body: "Coach client teams during installation, configuration, testing, commissioning, troubleshooting, and early operations." },
      { title: "E-Academy Programs", body: "Provide structured online or blended learning, recorded materials, assessments, progress tracking, and scheduled expert sessions where offered." },
      { title: "Management & Awareness Sessions", body: "Explain technology value, responsibilities, cyber risk, continuity, service governance, and adoption priorities for leaders and nontechnical stakeholders." },
    ],
    checklistTitle: "Define outcomes, audience, method and evidence",
    checklist: [
      "Role and baseline knowledge assessment",
      "Learning objectives and practical exercises",
      "Environment-specific materials and runbooks",
      "Delivery method, language, location and accessibility",
      "Attendance, assessment and completion evidence",
      "Post-training reference materials",
      "Feedback, follow-up and refresher options",
    ],
    note:
      "Edge Comm-Tech delivers product, solution, operational and awareness training. Official vendor certification, examination or accredited status is stated only where the relevant authorization and program conditions are verified.",
    links: ["managed-support-maintenance", "implementation-integration"],
  },
};
