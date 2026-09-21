/*
 * The long-form content behind each of the nine service pages.
 *
 * Split out of content.mjs because nine services at this depth would have
 * buried everything else in that file. Keyed by the slug in SERVICES, so a
 * missing entry is a build error rather than a silently empty page.
 *
 * Every acronym carries an expansion and a value line. Enterprise buyers
 * search and shortlist on these terms, and an unexplained "HCI" helps nobody.
 */

export const SERVICE_DETAIL = {
  datacenter: {
    overview:
      "A datacenter is the one part of an estate where a mistake is expensive to undo. Edge designs the room before the racks are ordered: load, cooling, containment, power path and cable routes, sized against what the institution will run in five years rather than what it runs today.",
    scope: [
      "Site survey and load assessment against current and projected IT load",
      "Room design: containment, raised floor or slab, cable routing, clearances",
      "Power path: utility, generator, UPS, distribution, rPDU to the rack",
      "Cooling design and airflow modelling",
      "Rack elevation drawings and a structured cabling schedule",
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
      { a: "Tier III", x: "Concurrently maintainable topology", v: "Any single component can be taken out for service without shutting the room down." },
      { a: "N+1", x: "One redundant unit per capacity group", v: "A failed cooling or UPS unit does not drop capacity below the design load." },
      { a: "HCI", x: "Hyper-converged infrastructure", v: "Compute, storage and networking in one appliance, so a small team can run it." },
      { a: "rPDU", x: "Rack power distribution unit", v: "Per-outlet metering, so you find the circuit about to trip before it does." },
      { a: "PUE", x: "Power usage effectiveness", v: "The ratio telling you how much of the electricity bill actually reaches the servers." },
    ],
    partners: ["Vertiv", "Tripp Lite", "Canovate Group", "Dell", "HP"],
  },

  networks: {
    overview:
      "A campus network is judged on the week everybody returns, not on the day it is commissioned. Edge designs for the peak: lecture theatres that fill in ninety seconds, halls of residence that never go quiet, and a core that keeps routing while a distribution switch is being replaced.",
    scope: [
      "Site survey, including a predictive and an on-site wireless survey",
      "Core, distribution and access design with documented addressing",
      "Wireless design for device density, not coverage alone",
      "Switch and controller configuration, staged and tested before installation",
      "Structured cabling to the outlet, labelled to a schedule",
      "Commissioning, throughput testing and handover documentation",
    ],
    deliverables: [
      "Logical and physical topology drawings",
      "IP addressing and VLAN plan",
      "Wireless heat maps, predicted and verified",
      "Configuration backups for every device",
      "Handover training for the network team",
    ],
    capabilities: [
      { a: "LAN", x: "Local area network", v: "The wired campus: core, distribution, access, and the cabling beneath it." },
      { a: "WLAN", x: "Wireless local area network", v: "Designed around how many devices associate at once, not how many bars show." },
      { a: "VLAN", x: "Virtual local area network", v: "Keeps student, staff and management traffic apart on one physical network." },
      { a: "PoE", x: "Power over Ethernet", v: "One cable powers the access point or camera, so no electrician is needed at height." },
      { a: "SD-WAN", x: "Software-defined wide area network", v: "Links remote campuses over whatever circuits exist, and fails between them." },
    ],
    partners: ["Cisco", "Huawei", "Dell"],
  },

  cybersecurity: {
    overview:
      "Security work that starts at the firewall has already skipped the hard part. Edge begins with what the institution actually holds, who needs to reach it, and which of those paths nobody has examined in years, then builds the controls that follow from the answers.",
    scope: [
      "Assessment of the current estate, its exposure and its blind spots",
      "Perimeter design: segmentation, policy and inspection",
      "Identity and access controls across staff, student and supplier accounts",
      "Endpoint protection and patch discipline",
      "Backup and recovery proven by restoring, not by reporting",
      "Policy documentation and staff briefing",
    ],
    deliverables: [
      "Assessment report with prioritised findings",
      "Firewall and segmentation policy",
      "Access control matrix",
      "A restore procedure that has been tested",
      "Incident response runbook",
    ],
    capabilities: [
      { a: "NAC", x: "Network access control", v: "A device is checked before it reaches the network, not after it misbehaves." },
      { a: "IAM", x: "Identity and access management", v: "One record of who someone is, so leavers actually lose access." },
      { a: "MFA", x: "Multi-factor authentication", v: "A stolen password stops being enough, which removes most of the risk." },
      { a: "SIEM", x: "Security information and event management", v: "Logs from everywhere in one place, so a pattern is visible rather than buried." },
      { a: "DLP", x: "Data loss prevention", v: "Catches records leaving by email or USB before they have gone." },
    ],
    partners: ["Palo Alto Networks", "Cisco"],
  },

  "noc-soc": {
    overview:
      "An operations centre is a rota and a set of decisions before it is a wall of screens. Edge builds both: the room and the tooling, and the shift patterns, escalation paths and written handovers that decide whether anyone acts on what the screens say.",
    scope: [
      "Operating model: tiers, rota, escalation and on-call",
      "Tooling: monitoring, alerting, ticketing and correlation",
      "Physical build of the operations room, including displays and acoustics",
      "Detection engineering and alert tuning against real traffic",
      "Runbooks for the incidents that actually recur",
      "Staff training and shadow running before go-live",
    ],
    deliverables: [
      "Operating model document",
      "Monitoring and alerting configuration",
      "Runbook set",
      "Escalation matrix",
      "Shift handover template",
    ],
    capabilities: [
      { a: "NOC", x: "Network operations centre", v: "Watches availability and performance, and owns an outage until it is closed." },
      { a: "SOC", x: "Security operations centre", v: "Watches for intrusion, and decides what is worth waking someone for." },
      { a: "MTTR", x: "Mean time to resolve", v: "The number telling you whether the centre is working or merely staffed." },
      { a: "SLA", x: "Service level agreement", v: "What response time is promised, and what follows when it is missed." },
      { a: "SIEM", x: "Security information and event management", v: "The correlation layer a SOC is built on, and the thing most often mistuned." },
    ],
    partners: ["Cisco", "Palo Alto Networks"],
  },

  "unified-comms": {
    overview:
      "Telephony stopped being a separate system some years ago. Edge integrates voice with presence, chat, mobile and the directory, so a call reaches the person rather than the desk they are not sitting at.",
    scope: [
      "Numbering plan and dial plan design",
      "Call server and gateway deployment",
      "Handset, softphone and mobile client rollout",
      "Directory and presence integration",
      "Contact centre queues and routing where required",
      "Migration from the existing PBX without a silent day",
    ],
    deliverables: [
      "Numbering and dial plan",
      "Call flow diagrams",
      "Handset deployment schedule",
      "Administrator handover pack",
      "User quick-reference guides",
    ],
    capabilities: [
      { a: "VoIP", x: "Voice over Internet Protocol", v: "Calls travel on the data network, so one cabling plant serves both." },
      { a: "SIP", x: "Session Initiation Protocol", v: "The standard letting handsets, carriers and software agree how to set up a call." },
      { a: "PBX", x: "Private branch exchange", v: "The switchboard, now software, routing internal and external calls." },
      { a: "QoS", x: "Quality of service", v: "Prioritises voice over bulk traffic, which is why calls survive a busy network." },
      { a: "UC", x: "Unified communications", v: "Voice, chat, presence and video as one system with one directory." },
    ],
    partners: ["Cisco", "Huawei"],
  },

  "voice-data-internet": {
    overview:
      "Most institutions buy connectivity in pieces and discover the seams during an incident. Edge takes the whole chain as one managed service: the circuits, the equipment terminating them, and the single number to ring when any part of it stops.",
    scope: [
      "Requirements and capacity planning across sites",
      "Carrier selection and circuit procurement",
      "Edge equipment, routing and failover design",
      "Installation, commissioning and acceptance testing",
      "Ongoing monitoring and carrier liaison",
      "Periodic review against actual usage",
    ],
    deliverables: [
      "Connectivity design across all sites",
      "Circuit inventory and contract summary",
      "Failover test records",
      "Monitoring dashboard",
      "A single escalation path",
    ],
    capabilities: [
      { a: "SLA", x: "Service level agreement", v: "What the carrier has actually committed to, as opposed to advertised." },
      { a: "BGP", x: "Border Gateway Protocol", v: "How traffic moves between providers, and how you fail over without renumbering." },
      { a: "MPLS", x: "Multiprotocol label switching", v: "Private paths between sites with predictable behaviour under load." },
      { a: "QoS", x: "Quality of service", v: "Decides what suffers first when a circuit fills, rather than leaving it to chance." },
      { a: "CPE", x: "Customer premises equipment", v: "The router at your end. Whose it is decides who can fix it at 2am." },
    ],
    partners: ["Cisco", "Huawei"],
  },

  "physical-security": {
    overview:
      "Cameras nobody reviews and doors everybody props open are not security. Edge designs physical security as a system with the network it runs on: sightlines and lighting first, retention and access policy alongside, cabling and power to match.",
    scope: [
      "Site survey: sightlines, lighting, and the incidents actually being guarded against",
      "Camera selection, placement and field-of-view drawings",
      "Access control: readers, controllers, door hardware and egress",
      "Barriers, turnstiles and gate automation where required",
      "Recording, retention and review workstation design",
      "Commissioning, and training for whoever will review footage",
    ],
    deliverables: [
      "Camera placement and field-of-view drawings",
      "Access control schedule, door by door",
      "Retention policy",
      "Commissioning records",
      "Operator training",
    ],
    capabilities: [
      { a: "CCTV", x: "Closed-circuit television", v: "Useful only where placement, lighting and retention were designed together." },
      { a: "IP camera", x: "Network-attached camera", v: "Runs on the structured cabling, so one plant serves data and surveillance." },
      { a: "NVR", x: "Network video recorder", v: "Where footage lives. Its sizing sets how far back you can actually look." },
      { a: "PoE", x: "Power over Ethernet", v: "Powers the camera down the same cable, so no mains run is needed at height." },
      { a: "ACS", x: "Access control system", v: "Who may open which door when, and the record of who actually did." },
    ],
    partners: ["Cisco", "Dell"],
  },

  "it-support": {
    overview:
      "Support is where an estate is judged day to day. Edge runs a helpdesk that resolves rather than logs: remote first, on site when it has to be, and with the engineers who built the estate reachable behind the first line.",
    scope: [
      "Service desk setup: intake channels, triage and ticketing",
      "Remote support tooling and asset inventory",
      "On-site attendance for what cannot be fixed remotely",
      "Server, endpoint and software administration",
      "Patch and update discipline with a tested rollback",
      "Monthly reporting against agreed response times",
    ],
    deliverables: [
      "Service desk process document",
      "Asset register",
      "Response time reporting",
      "Knowledge base for recurring issues",
      "An escalation path into engineering",
    ],
    capabilities: [
      { a: "SLA", x: "Service level agreement", v: "Response and resolution times you can hold us to, in writing." },
      { a: "RMM", x: "Remote monitoring and management", v: "Most faults are seen and fixed before anyone raises a ticket." },
      { a: "AD", x: "Active Directory", v: "The account and policy backbone. Most access problems start and end here." },
      { a: "MDM", x: "Mobile device management", v: "Institutional data on personal phones, wiped when someone leaves." },
      { a: "RPO/RTO", x: "Recovery point and time objectives", v: "How much work you can lose, and how long you can be down. Decide before, not after." },
    ],
    partners: ["Dell", "HP"],
  },

  "professional-services": {
    overview:
      "Sometimes what is needed is not a build but a pair of certified engineers for a defined piece of work: a design reviewed, a migration planned, a misbehaving estate diagnosed. Edge sells that time directly, scoped and bounded.",
    scope: [
      "Design review against the requirement and against standards",
      "Migration and cutover planning, including the rollback",
      "Fault diagnosis on estates we did not build",
      "Configuration audit and remediation",
      "Documentation of undocumented estates",
      "Knowledge transfer to the in-house team",
    ],
    deliverables: [
      "Written findings with prioritised recommendations",
      "Method statement for any cutover",
      "Rollback plan",
      "Updated as-built documentation",
      "A handover session with the in-house team",
    ],
    capabilities: [
      { a: "HLD", x: "High-level design", v: "What is being built and why, in language a budget holder can approve." },
      { a: "LLD", x: "Low-level design", v: "The detail an engineer configures from, down to port and address." },
      { a: "MOP", x: "Method of procedure", v: "The step-by-step for a change window, including how to back out of it." },
      { a: "RCA", x: "Root cause analysis", v: "Why it broke, not merely what was restarted to make it stop." },
      { a: "BoM", x: "Bill of materials", v: "Exactly what is being bought, so a tender can be compared like for like." },
    ],
    partners: ["Cisco", "Dell", "HP", "Huawei", "Palo Alto Networks"],
  },
};
