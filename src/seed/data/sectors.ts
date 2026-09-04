import { h2, p, rich, ul } from "../lexical";

export type SectorSeed = {
  title: string;
  slug: string;
  order: number;
  line: string;
  body: ReturnType<typeof rich>;
  pressures: { title: string; detail: string }[];
  solutionSlugs: string[];
};

export const sectorSeeds: SectorSeed[] = [
  {
    title: "Government & Health",
    slug: "government-health",
    order: 1,
    line: "Where uptime is a public duty — ministries, agencies, universities, and health systems.",
    body: rich(
      p(
        "Public institutions carry an obligation that commercial organizations do not: when a system is down, citizens are turned away. Ministries, agencies, universities, and hospitals also operate under procurement rules that reward documented, auditable work and punish improvisation.",
      ),
      h2("What this changes in practice"),
      p(
        "Designs have to survive review by people who were not in the room. That means **HLD** and **LLD** documents written to be read, bills of material with named makes and models rather than categories, and commissioning evidence that can be attached to a completion certificate.",
      ),
      p(
        "In health environments, clinical systems and imaging place a hard floor under network and storage performance, and patient data places one under access control. Identity is where most of the audit findings land: accounts belonging to staff who left, shared logins on ward machines, and no record of who read what.",
      ),
      ul([
        "Availability targets stated as a design tier rather than as a promise",
        "Segmentation between clinical, administrative, and public networks",
        "IAM lifecycle so access ends when the posting does",
        "Documentation packaged for procurement and audit review",
      ]),
    ),
    pressures: [
      {
        title: "Procurement scrutiny",
        detail:
          "Specifications, bills of material, and commissioning evidence have to withstand review by an audit body months after handover. Undocumented work becomes a finding.",
      },
      {
        title: "Continuity of public service",
        detail:
          "A failed system is not an internal inconvenience. Maintenance windows are narrow, and concurrent maintainability stops being a nice-to-have.",
      },
      {
        title: "Patient and citizen data",
        detail:
          "Access control, retention, and audit trail on records — with the ability to answer who accessed a file and when.",
      },
      {
        title: "Skills retention",
        detail:
          "Public institutions lose engineers to the private sector. Systems must be documented and operable by the next person, and knowledge transfer needs to be contractual.",
      },
    ],
    solutionSlugs: [
      "data-center-critical-systems",
      "cybersecurity-digital-resilience",
      "enterprise-network-connectivity",
      "professional-services",
    ],
  },

  {
    title: "Banking & Finance",
    slug: "banking-finance",
    order: 2,
    line: "Core rooms, identity, and networks that auditors can walk through end to end.",
    body: rich(
      p(
        "Financial institutions are the most heavily instrumented clients we work with, and the most consequential to get wrong. Everything here is examined: the room, the key material, the segregation between branches and core, and the record of who could have changed what.",
      ),
      h2("Keys, identity, and separation"),
      p(
        "An **HSM** keeps cryptographic key material in tamper-resistant hardware rather than in application memory — a baseline requirement for card, PKI, and payment workloads. **PAM** puts administrative access behind checkout and session recording, which is the control that turns 'we trust our engineers' into evidence.",
      ),
      p(
        "Branch-to-core segmentation and **NAC** matter more here than anywhere else: a compromised teller workstation must not be a route to the core banking system.",
      ),
      h2("Recovery is regulated, not optional"),
      p(
        "**RTO** and **RPO** are agreed with the regulator and the board, not chosen by whoever installed the backup software. That means a second site, immutable copies, and a restore rehearsed on a schedule with the evidence retained.",
      ),
      h2("Integration"),
      p(
        "Channels, switches, and the core exchange messages to standards — **ISO 8583** for card traffic, **ISO 20022** for payments. Integration built to those standards is integration your partners and regulator already understand.",
      ),
    ),
    pressures: [
      {
        title: "Regulatory examination",
        detail:
          "Controls must produce evidence on demand. Logging, access review, and change records are examined rather than described.",
      },
      {
        title: "Key custody",
        detail:
          "Cryptographic material held in HSMs with documented ceremony and dual control. Software key storage does not pass review.",
      },
      {
        title: "Recovery targets",
        detail:
          "RTO and RPO agreed at board level, with tested restores and retained evidence — not a backup job that reports success.",
      },
      {
        title: "Branch estate",
        detail:
          "Dozens or hundreds of sites on variable connectivity, each needing consistent policy, predictable failover, and central management.",
      },
    ],
    solutionSlugs: [
      "cybersecurity-digital-resilience",
      "data-center-critical-systems",
      "compute-cloud-data",
      "business-applications",
    ],
  },

  {
    title: "Telecommunications",
    slug: "telecommunications",
    order: 3,
    line: "Carrier-grade operations for the providers other organizations depend on.",
    body: rich(
      p(
        "Service providers operate at a scale where manual process stops working and small inefficiencies compound. The engineering bar is higher, the change windows are tighter, and the consequences of a mistake reach every downstream customer.",
      ),
      h2("Scale changes the design"),
      p(
        "**BGP** policy, route reflection, and convergence behaviour are load-bearing decisions rather than configuration details. Capacity planning runs continuously because growth is measured monthly, not annually.",
      ),
      h2("Operations tooling"),
      p(
        "A carrier-grade **NOC** needs correlated alarming rather than a wall of individual alerts, **NetFlow** visibility across the transit estate, and automation for the changes that repeat across hundreds of devices.",
      ),
      ul([
        "Data center facilities designed for high-density, high-availability operation",
        "Segregated management planes with audited privileged access",
        "Monitoring and alarm correlation that reflects service impact, not device state",
        "Change automation and configuration compliance across large estates",
      ]),
    ),
    pressures: [
      {
        title: "Downstream blast radius",
        detail:
          "An outage affects every customer at once, so change control, rollback, and staged deployment are engineering requirements rather than governance overhead.",
      },
      {
        title: "Continuous capacity growth",
        detail:
          "Traffic growth is measured monthly. Platforms are chosen on how they scale, not on what they cost to start.",
      },
      {
        title: "Operational density",
        detail:
          "Thousands of devices make manual configuration untenable. Automation and compliance checking are the only way estates stay consistent.",
      },
      {
        title: "Facility density",
        detail:
          "High power-density racks put real pressure on cooling design, containment, and PUE.",
      },
    ],
    solutionSlugs: [
      "enterprise-network-connectivity",
      "data-center-critical-systems",
      "professional-services",
      "cybersecurity-digital-resilience",
    ],
  },

  {
    title: "International organizations",
    slug: "international",
    order: 4,
    line: "Missions and programmes that need global standards delivered on local ground.",
    body: rich(
      p(
        "International organizations, NGOs, and diplomatic missions arrive with standards set at headquarters and a local reality that has to meet them. The gap between a global IT policy and what is procurable and supportable in-country is where these projects usually stall.",
      ),
      h2("Standards written elsewhere, delivered here"),
      p(
        "Global security baselines, approved vendor lists, and reporting formats are non-negotiable. Our job is to deliver against them with equipment that can actually be supported locally, and to document the result in the format headquarters expects.",
      ),
      h2("Field and connectivity constraints"),
      p(
        "Programme offices are often outside reliable power and connectivity. That pushes design toward resilient links, local caching, and platforms that degrade gracefully rather than assuming a data center is always reachable.",
      ),
      h2("Handover and continuity"),
      p(
        "Programme staff rotate. Systems have to be documented well enough that a new administrator arriving in eighteen months can operate them from the handover pack alone.",
      ),
    ),
    pressures: [
      {
        title: "Headquarters compliance",
        detail:
          "Security baselines and approved vendor lists are set centrally. Local delivery must meet them and evidence it in the required format.",
      },
      {
        title: "Field conditions",
        detail:
          "Unreliable power and connectivity at programme sites, requiring resilient links, local resilience, and graceful degradation.",
      },
      {
        title: "Staff rotation",
        detail:
          "Administrators change every posting cycle, so documentation and handover quality determine whether the system survives.",
      },
      {
        title: "Procurement and audit",
        detail:
          "Donor-funded spend is audited closely. Traceable specification, quotation, and delivery records are part of the deliverable.",
      },
    ],
    solutionSlugs: [
      "enterprise-network-connectivity",
      "cybersecurity-digital-resilience",
      "compute-cloud-data",
      "professional-services",
    ],
  },
];
