import { h2, p, rich, ul } from "../lexical";

export type SolutionSeed = {
  title: string;
  slug: string;
  order: number;
  headline: string;
  summary: string;
  overview: ReturnType<typeof rich>;
  capabilities: { name: string; acronym?: string; valueLine: string }[];
  scopeOfWork: string[];
  deliverables: string[];
  partnerNames: string[];
};

export const solutionSeeds: SolutionSeed[] = [
  {
    title: "Data Center & Critical Systems",
    slug: "data-center-critical-systems",
    order: 1,
    headline: "Build the foundation. Commission it properly.",
    summary:
      "The physical and critical infrastructure an IT environment actually runs on — power, cooling, containment, cabling, and physical security — designed to a named tier and handed over commissioned, not just installed.",
    overview: rich(
      p(
        "Most outages in Ethiopian data rooms are not application failures. They are power events, cooling failures, and cabling that nobody documented. Edge COMM-TECH designs and builds the facility layer so the equipment inside it has somewhere reliable to live.",
      ),
      p(
        "We design to a stated availability target rather than a vague promise. A **Tier III** room is concurrently maintainable: any capacity component or distribution path can be taken out of service for planned work without bringing down the IT load. That is a design commitment with consequences for how you buy power, cooling, and floor space — so we agree it on paper before anything is ordered.",
      ),
      h2("Power is the part that bites"),
      p(
        "Utility supply is not something to design around optimistically. We size **UPS** capacity and battery autonomy against measured load rather than nameplate ratings, specify generator and **ATS** transfer behaviour, and build distribution to an **N+1** standard so a single failure or a maintenance window is not an outage.",
      ),
      p(
        "At the rack, metered and switched **rPDU** units give per-outlet visibility and remote power cycling. That sounds minor until a device hangs at 2am and the alternative is sending someone across the city.",
      ),
      h2("Cooling, containment and efficiency"),
      p(
        "Cooling is designed with the airflow, not against it. Hot and cold aisle containment, correct blanking, and precision cooling sized to the real heat load keep inlet temperatures inside vendor specification and stop you paying to cool the ceiling. We instrument **PUE** so efficiency is a number you can watch rather than a claim in a brochure.",
      ),
      h2("What gets documented"),
      p(
        "Every room we build is handed over with as-built drawings, a labelled and tested cabling schedule, commissioning results, and a maintenance schedule. If a room cannot be handed to a new engineer with the drawings alone, it is not finished.",
      ),
      ul([
        "Structured cabling to Cat6A copper and OM4 fibre, tested and certified per link",
        "Containment, tray, and pathway designed before the first cable is pulled",
        "DCIM instrumentation so capacity and environment are visible, not guessed",
        "Earthing, bonding, and lightning protection treated as part of the electrical design",
      ]),
    ),
    capabilities: [
      {
        name: "Tier-rated facility design",
        acronym: "Tier III",
        valueLine:
          "Concurrent maintainability: any capacity component or distribution path can be serviced without stopping the IT load. Agreed as a design target up front, so nobody discovers the limit during an audit.",
      },
      {
        name: "Uninterruptible power supply",
        acronym: "UPS",
        valueLine:
          "Sized against measured load with defined battery autonomy, so the runtime you were sold is the runtime you get on the day the utility drops.",
      },
      {
        name: "Redundant power distribution",
        acronym: "N+1",
        valueLine:
          "One failure or one planned maintenance window is not an outage. Dual-path distribution from source to rack, verified by test rather than assumed.",
      },
      {
        name: "Rack power distribution units",
        acronym: "rPDU",
        valueLine:
          "Metered and switched at outlet level: per-device consumption, remote power cycling, and capacity data you can plan the next rack against.",
      },
      {
        name: "Precision cooling and containment",
        acronym: "CRAC",
        valueLine:
          "In-row or perimeter cooling with hot and cold aisle containment, keeping inlet temperatures inside vendor specification so warranties stay intact.",
      },
      {
        name: "Power usage effectiveness monitoring",
        acronym: "PUE",
        valueLine:
          "Efficiency measured continuously rather than claimed once, which turns power spend into something you can actually reduce.",
      },
      {
        name: "Data center infrastructure management",
        acronym: "DCIM",
        valueLine:
          "Live capacity, environment, and asset data in one place, so growth decisions come from measurements instead of a spreadsheet nobody trusts.",
      },
      {
        name: "Structured cabling systems",
        acronym: "Cat6A / OM4",
        valueLine:
          "Certified, labelled, and documented per link — the difference between a fault found in ten minutes and a fault found in a day.",
      },
      {
        name: "Physical access control and surveillance",
        acronym: "CCTV",
        valueLine:
          "Door control, video, and audit trails designed into the room rather than added after an auditor asks who entered it.",
      },
      {
        name: "Early smoke detection and suppression",
        acronym: "VESDA",
        valueLine:
          "Aspirating detection catches an event before flame, and clean-agent suppression protects equipment instead of destroying it.",
      },
      {
        name: "Generator and automatic transfer",
        acronym: "ATS",
        valueLine:
          "Standby generation with tested transfer timing, so the gap between utility loss and generator load is covered by the UPS exactly as designed.",
      },
    ],
    scopeOfWork: [
      "Site survey, load assessment, and availability-tier workshop with the client",
      "Electrical, mechanical, and structural design with drawings issued for review",
      "Bill of materials with named makes and models, not generic categories",
      "Supply, installation, and containment of power, cooling, racks, and cabling",
      "Physical security: access control, CCTV, detection, and suppression",
      "Commissioning: load bank testing, transfer testing, thermal survey, cable certification",
      "As-built documentation, labelling schedule, and handover training",
    ],
    deliverables: [
      "As-built drawings (electrical, mechanical, rack elevations)",
      "Cable schedule with certification results per link",
      "Commissioning and load-test report",
      "DCIM baseline and capacity register",
      "Preventive maintenance schedule",
      "Operations handover and training session",
    ],
    partnerNames: ["Vertiv", "Schneider", "Eaton", "Rittal", "Canovate", "Hikvision", "ZKTeco"],
  },

  {
    title: "Cybersecurity & Digital Resilience",
    slug: "cybersecurity-digital-resilience",
    order: 2,
    headline: "Prevent, detect, respond, recover.",
    summary:
      "Security across identity, endpoint, network, application, and data — with the operations capability to run it. A firewall on a quote is a product; a defended organization is an operating discipline.",
    overview: rich(
      p(
        "Buying security products is easy. Operating them is where organizations fail. Edge COMM-TECH builds the controls and the operations capability together, because a **SIEM** with nobody watching it is an expensive log archive.",
      ),
      h2("Identity is the real perimeter"),
      p(
        "Once staff work from branches, laptops, and phones, the network edge stops being the boundary. **IAM** establishes who someone is and what they may reach; **PAM** puts the accounts that can change everything behind checkout, session recording, and approval. **MFA** on privileged and remote access closes the most commonly exploited gap we find.",
      ),
      h2("Detection you can staff"),
      p(
        "A **SOC** is people, process, and tooling in that order. We design the use cases first — what actually matters to this organization — then implement **SIEM** correlation and **SOAR** playbooks against them, and agree escalation paths with named owners. **EDR/XDR** gives the analyst something to act on at the endpoint instead of a packet capture and a guess.",
      ),
      h2("Segmentation and access"),
      p(
        "**NAC** with 802.1X means an unknown device on a wall port lands nowhere useful. Combined with segmentation and **NGFW** policy between zones, a compromised workstation stops being a route to the core.",
      ),
      h2("Resilience is the part people skip"),
      p(
        "Prevention fails eventually. What separates an incident from a catastrophe is whether backups are immutable, whether the restore has been tested this quarter, and whether **RTO** and **RPO** are numbers the business has actually agreed to rather than defaults inherited from the backup software.",
      ),
      ul([
        "For banks and financial institutions, an HSM keeps key material out of software entirely",
        "DLP and email security cover the exfiltration paths that firewalls never see",
        "Vulnerability management runs on a cycle, not in the week before an audit",
        "Controls are mapped to ISO 27001 and PCI DSS so audit evidence is a by-product, not a project",
      ]),
    ),
    capabilities: [
      {
        name: "Security operations center",
        acronym: "SOC",
        valueLine:
          "Monitoring with named analysts, defined shifts, and agreed escalation — built around the use cases that matter to your organization rather than a vendor's default rule pack.",
      },
      {
        name: "Security information and event management",
        acronym: "SIEM",
        valueLine:
          "Correlated logging across network, endpoint, and identity, so an incident is reconstructable afterwards. That reconstruction is what regulators and insurers ask for.",
      },
      {
        name: "Security orchestration and automated response",
        acronym: "SOAR",
        valueLine:
          "Playbooks that isolate a host or disable an account in seconds, so analyst time goes to judgement rather than repetitive containment steps.",
      },
      {
        name: "Endpoint and extended detection and response",
        acronym: "EDR / XDR",
        valueLine:
          "Behavioural detection and remote containment on the device itself, including laptops that are not on your network today.",
      },
      {
        name: "Network access control",
        acronym: "NAC",
        valueLine:
          "802.1X posture and identity checks at the port, so an unmanaged device plugged into a meeting room reaches nothing it should not.",
      },
      {
        name: "Next-generation firewall",
        acronym: "NGFW",
        valueLine:
          "Application-aware policy between segments and at the edge, with inspection that still works when the traffic is encrypted.",
      },
      {
        name: "Identity and access management",
        acronym: "IAM",
        valueLine:
          "Joiners, movers, and leavers handled as a process, so access ends when employment does — the finding that appears in almost every first audit.",
      },
      {
        name: "Privileged access management",
        acronym: "PAM",
        valueLine:
          "Administrative credentials checked out, time-bound, and session-recorded, so the accounts that can change everything are the accounts you can prove nobody misused.",
      },
      {
        name: "Multi-factor authentication",
        acronym: "MFA",
        valueLine:
          "The single highest-return control available on remote and privileged access, deployed without making daily work unusable.",
      },
      {
        name: "Hardware security module",
        acronym: "HSM",
        valueLine:
          "Cryptographic keys generated and held in tamper-resistant hardware, never in application memory — a requirement for core banking, PKI, and payment workloads.",
      },
      {
        name: "Data loss prevention",
        acronym: "DLP",
        valueLine:
          "Policy on where regulated data may travel, covering the email and upload paths that perimeter controls never inspect.",
      },
      {
        name: "Web application firewall",
        acronym: "WAF",
        valueLine:
          "Protection for the public services you cannot patch on demand, including the ones a third party built and no longer supports.",
      },
      {
        name: "Zero trust network access",
        acronym: "ZTNA",
        valueLine:
          "Access granted per application and per identity rather than per network location, which is what makes branch and remote work defensible.",
      },
      {
        name: "Backup immutability and disaster recovery",
        acronym: "RTO / RPO",
        valueLine:
          "Immutable copies plus a restore that has actually been rehearsed, against recovery targets the business has signed rather than inherited from a default setting.",
      },
      {
        name: "Vulnerability management and testing",
        acronym: "VA / PT",
        valueLine:
          "Scanning and penetration testing on a cycle, with remediation tracked to closure instead of filed as a report.",
      },
    ],
    scopeOfWork: [
      "Current-state assessment against a named framework (ISO 27001, PCI DSS, or NIST CSF)",
      "Risk and gap analysis with findings ranked by exploitability, not by tool severity",
      "Architecture: segmentation model, identity model, and logging design",
      "Implementation of controls with change windows agreed against business hours",
      "SOC build: use cases, correlation rules, playbooks, escalation matrix",
      "Tabletop exercise and a tested restore before sign-off",
      "Ongoing monitoring, tuning, and periodic re-testing",
    ],
    deliverables: [
      "Assessment report with ranked, costed remediation",
      "Segmentation and identity architecture documents",
      "SIEM use-case catalogue and SOAR playbooks",
      "Incident response plan with named owners",
      "Tested restore evidence against agreed RTO/RPO",
      "Audit evidence pack mapped to your framework",
    ],
    partnerNames: ["Fortinet", "Palo Alto", "CrowdStrike", "Cisco", "Veeam", "Microsoft"],
  },

  {
    title: "Enterprise Network & Connectivity",
    slug: "enterprise-network-connectivity",
    order: 3,
    headline: "Connect the organization. Keep it converged.",
    summary:
      "Campus, branch, wireless, and wide-area connectivity designed as one system — including the voice and collaboration traffic that shares it — and instrumented so problems are found rather than reported.",
    overview: rich(
      p(
        "A network is judged on its worst day. Edge COMM-TECH designs campus, wireless, and wide-area connectivity as a single system with deliberate failure behaviour, so a link loss or a switch failure degrades predictably instead of taking a branch offline.",
      ),
      h2("Campus and branch"),
      p(
        "Resilient switching with **VRRP** or stacking at the distribution layer, **VLAN** and **VXLAN** segmentation aligned to the security model rather than to history, and **OSPF** or **BGP** routing designed for the paths you actually have. Where the branch estate is large, **SD-WAN** turns two ordinary circuits into a managed, application-aware path with measurable failover.",
      ),
      h2("Wireless that survives density"),
      p(
        "**Wi-Fi 6/6E** is designed, not sprinkled. We run a predictive survey against the real floor plan and construction, then validate on site after installation — because a plasterboard assumption and a concrete wall produce very different coverage. High-density areas such as halls, branches, and lecture rooms are designed for client count and airtime, not for signal bars.",
      ),
      h2("Voice and collaboration on the same fabric"),
      p(
        "**UC** and **SIP** traffic share the network with everything else, so quality of service is designed in from the start. Voice, presence, chat, and conferencing are delivered as one platform rather than three tools that do not know about each other.",
      ),
      h2("Instrumented, or it is guesswork"),
      p(
        "Monitoring, **NetFlow**, and configuration backup are part of the build. When a user says the network is slow, the answer should come from data within minutes.",
      ),
    ),
    capabilities: [
      {
        name: "Campus and data center switching",
        acronym: "LAN",
        valueLine:
          "Access, distribution, and core designed with deliberate redundancy, so a single switch failure is a degraded path rather than a dark floor.",
      },
      {
        name: "High-density wireless",
        acronym: "Wi-Fi 6 / 6E",
        valueLine:
          "Predictive survey against the real building, then post-install validation. Designed for client density and airtime, not for coverage bars on one laptop.",
      },
      {
        name: "Software-defined wide area network",
        acronym: "SD-WAN",
        valueLine:
          "Application-aware path selection across ordinary circuits, with failover measured in seconds and branch policy managed centrally.",
      },
      {
        name: "Dynamic routing",
        acronym: "BGP / OSPF",
        valueLine:
          "Routing designed for the paths you actually have, including multi-homed internet, so convergence behaviour is known before an outage tests it.",
      },
      {
        name: "Gateway redundancy",
        acronym: "VRRP / HSRP",
        valueLine:
          "No single default gateway to lose. Users keep working through a device failure without raising a support call.",
      },
      {
        name: "Network segmentation",
        acronym: "VLAN / VXLAN",
        valueLine:
          "Segments that follow the security model rather than the order things were installed, which is what makes containment possible later.",
      },
      {
        name: "Unified communications",
        acronym: "UC / SIP",
        valueLine:
          "Voice, presence, chat, and conferencing on one platform, with quality of service designed in rather than diagnosed after complaints.",
      },
      {
        name: "Application delivery and load balancing",
        acronym: "ADC",
        valueLine:
          "Published services stay available through a node failure or a maintenance window, and TLS terminates somewhere you control.",
      },
      {
        name: "Carrier interconnect",
        acronym: "MPLS",
        valueLine:
          "Provider circuits integrated and managed end to end, so a branch fault has one owner instead of a conversation between vendors.",
      },
      {
        name: "Traffic visibility and monitoring",
        acronym: "NetFlow",
        valueLine:
          "Who is using what, and when. Turns 'the network is slow' from an argument into a measurement.",
      },
    ],
    scopeOfWork: [
      "Discovery of the existing estate, including the parts that are undocumented",
      "Predictive wireless survey and capacity modelling against the real floor plan",
      "High-level and low-level design issued for client review",
      "Staged migration plan with rollback defined for every cutover",
      "Installation, configuration, and cutover inside agreed change windows",
      "Post-install wireless validation survey and performance baseline",
      "Monitoring, configuration backup, and knowledge transfer",
    ],
    deliverables: [
      "HLD and LLD documents with addressing and VLAN plan",
      "Predictive and post-install wireless survey reports",
      "Configuration backups and a device inventory",
      "Performance baseline and monitoring dashboards",
      "Cutover runbook and rollback procedure",
      "Operations handover and training",
    ],
    partnerNames: ["Cisco", "HPE Aruba", "Juniper", "Huawei", "Fortinet"],
  },

  {
    title: "Compute, Cloud & Data Platforms",
    slug: "compute-cloud-data",
    order: 4,
    headline: "Run the workload. Plan the growth.",
    summary:
      "Servers, storage, virtualization, and hybrid cloud sized for how the business actually runs — with backup and recovery treated as part of the platform rather than an afterthought.",
    overview: rich(
      p(
        "Compute is bought once and lived with for five years. Edge COMM-TECH sizes platforms against measured workload rather than a vendor configurator, and designs the growth path before the first node is racked.",
      ),
      h2("Converged, hyperconverged, or traditional"),
      p(
        "**HCI** collapses compute, storage, and virtualization into one scalable unit and suits organizations that want to grow in predictable increments with a small team. **dHCI** keeps compute and storage independently scalable, which matters when your database grows faster than your CPU need — or the reverse. Traditional three-tier with a dedicated **SAN** still wins for some workloads. We recommend against a measured I/O profile, not against fashion.",
      ),
      h2("Cloud where it earns its place"),
      p(
        "Hybrid is the realistic answer for most enterprises here: latency, bandwidth cost, and data residency all argue for keeping some workloads local. We design the split deliberately — which systems go to **IaaS** or **SaaS**, which stay on-premises, and how identity and networking bridge the two — rather than lifting and shifting and discovering the bill later.",
      ),
      h2("Backup is part of the platform"),
      p(
        "Replication, immutable backup copies, and a documented recovery runbook are designed alongside the compute, against **RTO** and **RPO** targets the business has agreed. A backup job that has never been restored is a hypothesis.",
      ),
      ul([
        "Virtualization sized on measured CPU ready time and memory pressure, not on core count",
        "All-flash and hybrid storage tiers matched to real I/O profiles",
        "Container platforms where the application team is ready for them, not before",
        "Capacity reporting so the next purchase is planned rather than urgent",
      ]),
    ),
    capabilities: [
      {
        name: "Hyperconverged infrastructure",
        acronym: "HCI",
        valueLine:
          "Compute, storage, and virtualization in one scalable unit — predictable growth increments and one support relationship instead of three.",
      },
      {
        name: "Disaggregated hyperconverged infrastructure",
        acronym: "dHCI",
        valueLine:
          "Scale compute and storage independently, so a database that outgrows its capacity does not force you to buy CPU you do not need.",
      },
      {
        name: "Enterprise storage",
        acronym: "SAN / NAS",
        valueLine:
          "All-flash and hybrid tiers sized against measured I/O, with replication designed in rather than added when the second site appears.",
      },
      {
        name: "Server virtualization",
        acronym: "Hypervisor",
        valueLine:
          "Consolidation sized on real CPU ready time and memory pressure, which is what keeps performance predictable at high utilisation.",
      },
      {
        name: "Private and hybrid cloud",
        acronym: "IaaS / PaaS",
        valueLine:
          "A deliberate split between local and cloud workloads, with identity and networking bridged — designed before migration rather than discovered on the first invoice.",
      },
      {
        name: "Container platforms",
        acronym: "Kubernetes",
        valueLine:
          "Orchestration introduced when the application team can operate it, with registry, ingress, and persistent storage solved rather than assumed.",
      },
      {
        name: "Backup, replication and recovery",
        acronym: "RTO / RPO",
        valueLine:
          "Immutable copies, offsite replication, and a rehearsed restore measured against targets the business has actually signed.",
      },
      {
        name: "Database platforms",
        acronym: "RDBMS",
        valueLine:
          "Licensing, high availability, and performance designed together, because the cheapest database licence is often the most expensive infrastructure.",
      },
      {
        name: "Business intelligence and reporting",
        acronym: "BI",
        valueLine:
          "A reporting layer that reads from a modelled warehouse rather than from production, so analysts stop slowing down the system they are measuring.",
      },
    ],
    scopeOfWork: [
      "Workload assessment: measured CPU, memory, I/O, and growth trend",
      "Platform selection with a written rationale for HCI, dHCI, or three-tier",
      "Sizing, licensing model, and five-year growth path",
      "Migration design with rollback and an agreed maintenance window",
      "Implementation, migration, and performance validation",
      "Backup and disaster recovery build, plus a proven restore",
      "Capacity reporting and operational handover",
    ],
    deliverables: [
      "Workload assessment and sizing report",
      "Platform architecture and licensing model",
      "Migration runbook with rollback steps",
      "Backup and DR design with tested restore evidence",
      "Performance baseline after migration",
      "Capacity dashboard and growth plan",
    ],
    partnerNames: [
      "Dell Technologies",
      "HPE",
      "Nutanix",
      "VMware",
      "Microsoft",
      "Veeam",
      "Lenovo",
      "Oracle",
    ],
  },

  {
    title: "Business Applications & Transformation",
    slug: "business-applications",
    order: 5,
    headline: "Change how the work is done, not just what runs it.",
    summary:
      "Enterprise applications, integration, and process automation aligned to how people actually work — measured by what happens after go-live rather than by the size of the software catalogue.",
    overview: rich(
      p(
        "Infrastructure projects fail loudly. Application projects fail quietly: the system goes live, and eighteen months later half the organization is still working around it in spreadsheets. Edge COMM-TECH treats adoption as part of the deliverable.",
      ),
      h2("Integration is where the value is"),
      p(
        "Most organizations do not need another application; they need the ones they have to talk to each other. **API** integration and an **ESB** pattern connect **ERP**, **CRM**, core banking, and document systems so a record is entered once and trusted everywhere.",
      ),
      h2("Automate the process, then buy the tool"),
      p(
        "**BPM** and workflow automation start with mapping what actually happens — including the undocumented steps people invented to make the current system work. Automating a broken process makes it faster and worse.",
      ),
      h2("Content and records"),
      p(
        "**ECM** and **DMS** put documents under version control, retention policy, and audit trail. For government, health, and financial clients this is usually a compliance requirement long before it is a convenience.",
      ),
      h2("After go-live"),
      p(
        "Training, floorwalking, and a support path that knows the deployment. The measure of success is the proportion of the process still running in the system ninety days later.",
      ),
    ),
    capabilities: [
      {
        name: "Enterprise resource planning",
        acronym: "ERP",
        valueLine:
          "Finance, procurement, inventory, and HR on one record, implemented against your chart of accounts and approval rules rather than a demo dataset.",
      },
      {
        name: "Customer relationship management",
        acronym: "CRM",
        valueLine:
          "A pipeline the sales team actually updates, because it reflects how they sell instead of how the software assumed they would.",
      },
      {
        name: "Enterprise content and document management",
        acronym: "ECM / DMS",
        valueLine:
          "Version control, retention policy, and audit trail on documents — usually a regulatory requirement before it is a convenience.",
      },
      {
        name: "Business process management",
        acronym: "BPM",
        valueLine:
          "Processes mapped as they actually run, including the workarounds, then automated. Automating a broken process only makes it faster.",
      },
      {
        name: "Systems integration",
        acronym: "API / ESB",
        valueLine:
          "Data entered once and trusted everywhere — the difference between owning several systems and running one organization.",
      },
      {
        name: "Core banking integration",
        acronym: "ISO 8583 / ISO 20022",
        valueLine:
          "Channel, switch, and core interfaces built to the message standards your regulator and partners already use.",
      },
      {
        name: "Custom application development",
        acronym: "SDLC",
        valueLine:
          "Built where nothing off the shelf fits, with source, documentation, and handover, so you are not locked to the people who wrote it.",
      },
      {
        name: "Adoption and change management",
        acronym: "OCM",
        valueLine:
          "Training, floorwalking, and a defined support path after go-live, measured by how much of the process is still in the system after ninety days.",
      },
    ],
    scopeOfWork: [
      "Process discovery workshops with the people who do the work",
      "Requirements and fit-gap analysis against candidate platforms",
      "Solution and integration architecture",
      "Configuration, development, and data migration",
      "User acceptance testing with real transactions",
      "Training, go-live support, and floorwalking",
      "Post-go-live review at thirty and ninety days",
    ],
    deliverables: [
      "Process maps, current and target state",
      "Fit-gap analysis and platform recommendation",
      "Integration architecture and API documentation",
      "Migrated and reconciled data with sign-off",
      "Training materials and administrator documentation",
      "Ninety-day adoption review",
    ],
    partnerNames: ["Microsoft", "SAP", "Oracle", "Salesforce", "ServiceNow", "OpenText"],
  },

  {
    title: "Professional Services",
    slug: "professional-services",
    order: 6,
    headline: "From assessment to knowledge transfer.",
    summary:
      "Certified engineers across the full lifecycle — assessment, design, implementation, managed operations, and support — so an investment stays aligned long after the installation team leaves.",
    overview: rich(
      p(
        "Technology projects are not finished at handover. Edge COMM-TECH provides engineering capability across the whole lifecycle, including the unglamorous parts that determine whether the investment holds its value.",
      ),
      h2("Assessment and design"),
      p(
        "Independent assessment of what you have, what it costs to run, and where the risk sits. Design is issued as **HLD** and **LLD** documents you can take to any integrator — because a design you cannot review is a design you cannot hold anyone to.",
      ),
      h2("Implementation and commissioning"),
      p(
        "Certified network, systems, and security engineers doing the installation, configuration, and cutover, inside change windows agreed against your business hours rather than ours.",
      ),
      h2("Managed operations"),
      p(
        "**NOC** and helpdesk services, remote and on site, under an **SLA** with defined response and restoration targets. Monitoring, patching, backup verification, and vendor case management handled as a service.",
      ),
      h2("Knowledge transfer"),
      p(
        "Every engagement ends with documentation and a handover session. Where a client wants to build internal capability, our E-Academy material and structured mentoring are part of the contract rather than an upsell.",
      ),
    ),
    capabilities: [
      {
        name: "Infrastructure assessment and audit",
        acronym: "Assessment",
        valueLine:
          "An independent view of what you have, what it costs to run, and where risk concentrates — written to be readable by finance as well as by IT.",
      },
      {
        name: "Architecture and detailed design",
        acronym: "HLD / LLD",
        valueLine:
          "Designs issued as reviewable documents you could hand to any integrator, which is what makes a build auditable later.",
      },
      {
        name: "Implementation and commissioning",
        acronym: "SoW",
        valueLine:
          "Certified engineers, agreed change windows, and a commissioning test that proves the system meets the design before sign-off.",
      },
      {
        name: "Network and security operations",
        acronym: "NOC / SOC",
        valueLine:
          "Monitoring, patching, backup verification, and vendor case management run as a service, so your team is not the alerting system.",
      },
      {
        name: "Service level agreements",
        acronym: "SLA",
        valueLine:
          "Response and restoration targets in writing, with reporting against them — the difference between support and best effort.",
      },
      {
        name: "Managed IT helpdesk",
        acronym: "ITSM",
        valueLine:
          "Ticketed first- and second-line support, remote and on site, with the history to spot the recurring fault nobody had time to trace.",
      },
      {
        name: "Staff augmentation and mentoring",
        acronym: "Resourcing",
        valueLine:
          "Certified engineers embedded with your team, transferring capability rather than protecting it.",
      },
      {
        name: "Lifecycle and warranty management",
        acronym: "EoL / EoS",
        valueLine:
          "Tracked end-of-life and support dates, so refresh is a budgeted plan instead of an emergency after a failure.",
      },
    ],
    scopeOfWork: [
      "Discovery and independent assessment of the current estate",
      "Design documentation issued for client review and sign-off",
      "Implementation, migration, and commissioning",
      "Monitoring onboarding and runbook development",
      "Managed service transition with agreed SLA targets",
      "Periodic service review and capacity reporting",
      "Documentation, handover, and structured knowledge transfer",
    ],
    deliverables: [
      "Assessment report with prioritised, costed findings",
      "HLD and LLD design documents",
      "Commissioning and acceptance test results",
      "Operational runbooks and escalation matrix",
      "SLA performance reporting",
      "Lifecycle register with refresh planning",
    ],
    partnerNames: ["Cisco", "Dell Technologies", "HPE", "Microsoft", "Fortinet", "Veeam"],
  },
];
