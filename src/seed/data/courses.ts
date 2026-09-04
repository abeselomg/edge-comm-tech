import { h3, p, rich, ul } from "../lexical";

export type CourseSeed = {
  title: string;
  slug: string;
  order: number;
  audience: string;
  duration: string;
  level: "all" | "beginner" | "intermediate" | "advanced";
  summary: string;
  outcomes: string[];
  solutionSlugs: string[];
  modules: {
    title: string;
    summary: string;
    lessons: {
      title: string;
      slug: string;
      duration: string;
      body: ReturnType<typeof rich>;
    }[];
  }[];
};

/**
 * Lesson video URLs are deliberately left empty. Edge records and attaches its
 * own videos in the CMS; the lesson page renders as a reading lesson until then.
 */
export const courseSeeds: CourseSeed[] = [
  {
    title: "Identity and access management fundamentals",
    slug: "iam-fundamentals",
    order: 1,
    audience: "Candidates for network, security, and systems roles",
    duration: "About 1 week",
    level: "beginner",
    summary:
      "How identity is actually enforced in an enterprise: accounts, groups, least privilege, and the joiner-mover-leaver process behind the policy document.",
    outcomes: [
      "Explain what an identity is and why it sits in front of every other control",
      "Describe least privilege in terms a manager will accept, not just a slogan",
      "Walk through joiners, movers, and leavers as an operational process",
      "Recognise why privileged accounts need separate handling from ordinary ones",
      "Read an access review report and say what is wrong with it",
    ],
    solutionSlugs: ["cybersecurity-digital-resilience"],
    modules: [
      {
        title: "Foundations",
        summary: "What identity is, and why it sits in front of every other control.",
        lessons: [
          {
            title: "What identity is in an enterprise",
            slug: "what-identity-is",
            duration: "12 min",
            body: rich(
              p(
                "People, devices, and services all present an identity before they reach anything. This lesson maps that to the vocabulary you will hear on an Edge project: directory, principal, group, role, entitlement, and ticket.",
              ),
              h3("Why the network edge stopped being the boundary"),
              p(
                "When everyone worked in one building on one network, the firewall was the control that mattered. Once staff work from branches, laptops, and phones, the question changes from where is this connection coming from to who is this and what may they reach. That shift is the whole reason IAM exists as a discipline.",
              ),
              h3("The vocabulary"),
              ul([
                "Directory — the authoritative store of accounts and groups, usually Active Directory or an LDAP service",
                "Principal — any actor that can authenticate: a person, a service account, or a device",
                "Group — a collection used to grant access to many principals at once",
                "Role — a job function that maps to a set of entitlements",
                "Entitlement — a specific permission on a specific system",
              ]),
              p(
                "Most organizations grant access by group and never define roles. That works until somebody asks which groups a branch teller should have, and nobody can answer without reading the last teller's account.",
              ),
            ),
          },
          {
            title: "Least privilege without the slogan",
            slug: "least-privilege",
            duration: "14 min",
            body: rich(
              p(
                "Least privilege means a principal holds the access needed for their current work and nothing else. Everyone agrees with it in the abstract and very few organizations implement it, because the path of least resistance is to copy an existing account.",
              ),
              h3("Why permission sprawl happens"),
              ul([
                "New starters are created by copying a colleague, inheriting access nobody reviewed",
                "Access is granted for a project and never removed when the project ends",
                "Movers accumulate: someone who has changed department three times holds three departments of access",
                "Administrative rights are handed out to avoid support tickets",
              ]),
              h3("What a bank or ministry will reject"),
              p(
                "A shared administrator account. Domain administrator rights on a daily-use workstation login. Service accounts with interactive login and a password that has not changed in four years. Each of these turns a single compromised endpoint into a full-estate incident.",
              ),
              h3("What good looks like"),
              p(
                "Separate accounts for administrative work, granted through groups that map to defined roles, reviewed on a schedule, with a documented owner for every group. It is unglamorous and it is the control that limits the damage when something else fails.",
              ),
            ),
          },
        ],
      },
      {
        title: "Operations",
        summary: "Joiners, movers, and leavers — the work behind the policy document.",
        lessons: [
          {
            title: "Joiners, movers, and leavers",
            slug: "joiners-leavers",
            duration: "16 min",
            body: rich(
              p(
                "The identity lifecycle is a process shared between HR and IT, and it is the single most common source of audit findings. This is the material we expect candidates to have watched before a security or systems interview.",
              ),
              h3("Joiner"),
              p(
                "An account is created from a defined role template rather than copied from a colleague. Access is provisioned to the role, the manager approves anything beyond it, and the record of that approval is retained.",
              ),
              h3("Mover"),
              p(
                "The step almost everyone skips. When someone changes department, the new access is added and the old access is supposed to be removed. If only the first half happens, you build the permission sprawl described in the previous lesson.",
              ),
              h3("Leaver"),
              p(
                "Access ends when employment ends — ideally on the same day, triggered by HR rather than by someone remembering. The classic finding is an active account belonging to a person who left months ago, still holding access to a production system.",
              ),
              h3("Why it is hard"),
              p(
                "The process crosses two departments with different priorities and different systems. Making it work is less about technology than about agreeing who triggers what, and then automating that trigger.",
              ),
            ),
          },
          {
            title: "Privileged access and why it is separate",
            slug: "privileged-access",
            duration: "15 min",
            body: rich(
              p(
                "Ordinary accounts can read and change their own work. Privileged accounts can change the system itself — including the logs that would show what they did. That asymmetry is why they are managed differently.",
              ),
              h3("The controls that matter"),
              ul([
                "Separate credentials: administrative work never happens from the daily-use login",
                "Checkout: the credential is requested, approved, and time-bound rather than permanently held",
                "Session recording: what was done during the window is reviewable afterwards",
                "Rotation: the password changes after use, so a captured credential has a short life",
              ]),
              h3("Service accounts"),
              p(
                "The forgotten category. Accounts used by applications often hold broad rights, never expire, and have credentials embedded in configuration files. Treat them as privileged: document the owner, restrict what they can log into, and rotate them on a schedule.",
              ),
            ),
          },
        ],
      },
      {
        title: "Review and evidence",
        summary: "Proving the controls work, which is what an auditor actually asks for.",
        lessons: [
          {
            title: "Access reviews that mean something",
            slug: "access-reviews",
            duration: "13 min",
            body: rich(
              p(
                "An access review asks each system or group owner to confirm that the people who hold access should still hold it. Done properly it removes real access. Done badly it is a spreadsheet that gets approved without being read.",
              ),
              h3("What makes a review useless"),
              ul([
                "Sending a list of a thousand entitlements to one manager with a two-day deadline",
                "Showing raw group names with no description of what access they grant",
                "No mechanism to actually revoke, so removals are noted and never happen",
                "Reviewing only ordinary users and skipping service and administrative accounts",
              ]),
              h3("What to look for in a report"),
              p(
                "Accounts with no recent login. Accounts whose owner has left. Groups with a single member. Groups with no documented owner. Privileged accounts that were not part of the review scope. Each of these is a question worth asking out loud.",
              ),
            ),
          },
        ],
      },
    ],
  },

  {
    title: "Enterprise network fundamentals",
    slug: "enterprise-network-fundamentals",
    order: 2,
    audience: "Junior network engineers and IT support staff moving into infrastructure",
    duration: "About 1 week",
    level: "beginner",
    summary:
      "How a campus network is actually structured — access, distribution, core, segmentation, and the redundancy decisions that determine what happens when something fails.",
    outcomes: [
      "Describe the access, distribution, and core layers and what each is for",
      "Explain why VLAN segmentation follows the security model, not the floor plan",
      "Say what happens to users when a distribution switch fails, and why",
      "Read a simple routing design and identify the failure paths",
      "Explain why wireless needs a survey rather than a guess",
    ],
    solutionSlugs: ["enterprise-network-connectivity"],
    modules: [
      {
        title: "Structure",
        summary: "The layers of a campus network and the job each one does.",
        lessons: [
          {
            title: "Access, distribution, core",
            slug: "access-distribution-core",
            duration: "14 min",
            body: rich(
              p(
                "Campus networks are built in layers because each layer has a different job and a different failure consequence. Understanding which layer you are standing in tells you what a fault will affect.",
              ),
              h3("Access"),
              p(
                "Where devices plug in. High port count, low cost per port, and the place where policy meets the user: port security, 802.1X, VLAN assignment, and power over Ethernet for phones and access points.",
              ),
              h3("Distribution"),
              p(
                "Aggregates access switches and is usually where routing between VLANs happens. This is the layer where redundancy decisions bite: lose a distribution switch with no pair and you lose a floor or a building.",
              ),
              h3("Core"),
              p(
                "High-speed transit between distribution blocks and out to the data center. Kept deliberately simple — the core forwards fast and does as little policy as possible, because complexity here affects everything.",
              ),
            ),
          },
          {
            title: "Segmentation and VLANs",
            slug: "segmentation-vlans",
            duration: "13 min",
            body: rich(
              p(
                "A VLAN is a broadcast domain, but the reason to create one is almost never broadcast traffic. It is containment: keeping systems that should not talk to each other from being able to.",
              ),
              h3("The common mistake"),
              p(
                "Segmenting by geography — one VLAN per floor — because that is how the cabling ran. It produces a network where a compromised reception PC sits in the same segment as a finance workstation, and where firewall policy between them is impossible to write.",
              ),
              h3("Segment by function and trust"),
              ul([
                "Corporate workstations",
                "Servers, split further by tier where the application allows it",
                "Voice, so quality of service policy has something to match on",
                "Building systems: CCTV, access control, HVAC — the devices nobody patches",
                "Guest, with no path to anything internal",
              ]),
              p(
                "Building systems deserve special mention. Cameras and door controllers are rarely updated, often ship with default credentials, and sit on the network for a decade. They belong behind policy, not beside the finance team.",
              ),
            ),
          },
        ],
      },
      {
        title: "Resilience",
        summary: "What happens when a device fails, and how that is designed rather than hoped.",
        lessons: [
          {
            title: "Redundancy and failure behaviour",
            slug: "redundancy-failure-behaviour",
            duration: "15 min",
            body: rich(
              p(
                "Every network fails eventually. The design question is not whether but how visibly, and for how long. Good design makes failure a degraded path; poor design makes it an outage.",
              ),
              h3("Gateway redundancy"),
              p(
                "If clients point at a single default gateway address served by one switch, that switch is a single point of failure for the whole segment. VRRP or HSRP presents one virtual address served by a pair, so a failure is invisible to the client.",
              ),
              h3("Uplink redundancy"),
              p(
                "Two uplinks from access to distribution, in different physical paths where the building allows it. A single fibre run through one riser is not redundancy, however many logical links are configured over it.",
              ),
              h3("Convergence"),
              p(
                "How long the network takes to notice a failure and route around it. Sub-second convergence is achievable and matters for voice; thirty seconds is not acceptable for anything interactive. This is a design decision with configuration consequences, not a property you get for free.",
              ),
            ),
          },
          {
            title: "Wireless is designed, not sprinkled",
            slug: "wireless-design",
            duration: "12 min",
            body: rich(
              p(
                "The most common wireless complaint is that coverage looks fine on a laptop and the network is unusable during a busy period. That is a capacity problem, and it comes from designing for signal strength instead of client density.",
              ),
              h3("Predictive survey"),
              p(
                "Model the real floor plan with real construction materials. Plasterboard, concrete, and glass attenuate very differently, and a survey run on an idealised drawing produces access point placement that does not survive contact with the building.",
              ),
              h3("Density, not bars"),
              p(
                "Design for the number of clients that will actually be in the room and the airtime they consume. A lecture hall with two hundred devices needs a fundamentally different design from a corridor with the same square footage.",
              ),
              h3("Validate after installation"),
              p(
                "Walk the site after the access points are up and measure. The gap between predicted and actual is where the remedial work is, and finding it before handover is much cheaper than finding it after.",
              ),
            ),
          },
        ],
      },
    ],
  },

  {
    title: "Data center facility systems",
    slug: "data-center-facility-systems",
    order: 3,
    audience: "Facilities and IT staff who operate a server room or small data center",
    duration: "About 4 days",
    level: "beginner",
    summary:
      "The physical systems a server room depends on — power, cooling, containment, and physical security — and what to watch so a small problem does not become an outage.",
    outcomes: [
      "Explain what a Tier rating actually commits you to",
      "Describe the power path from utility to rack and where redundancy sits",
      "Explain why airflow containment matters more than setting a lower temperature",
      "Identify what should be monitored in a room and why",
    ],
    solutionSlugs: ["data-center-critical-systems"],
    modules: [
      {
        title: "Power and cooling",
        summary: "The two systems that cause most room outages.",
        lessons: [
          {
            title: "The power path, end to end",
            slug: "power-path",
            duration: "16 min",
            body: rich(
              p(
                "Trace power from the utility connection to the server power supply and you pass through every component that can take the room down. Knowing that path is the first thing to learn about a room you are responsible for.",
              ),
              h3("The chain"),
              ul([
                "Utility supply into the main distribution board",
                "Automatic transfer switch, which decides between utility and generator",
                "Generator, with its own fuel supply and start-up delay",
                "UPS, which covers the gap between utility loss and generator load",
                "Distribution board feeding the room",
                "Rack PDU, feeding individual devices",
                "Dual power supplies in the device itself",
              ]),
              h3("Where N+1 belongs"),
              p(
                "Redundancy is only useful where a single failure would otherwise stop the load. A second UPS module means a module failure is survivable. A second power supply in the server means nothing if both are plugged into the same PDU on the same distribution board — a mistake that is easy to make and easy to spot once you know to look.",
              ),
              h3("Battery autonomy"),
              p(
                "The number that matters is how long the UPS holds the real load, not the rated load. Batteries age, and a room that had twelve minutes of autonomy at commissioning may have four after three years. This is why testing under load is on the maintenance schedule.",
              ),
            ),
          },
          {
            title: "Cooling and airflow",
            slug: "cooling-airflow",
            duration: "14 min",
            body: rich(
              p(
                "Most rooms with a cooling problem do not need more cooling capacity. They need the cold air to reach the equipment inlets instead of mixing with hot exhaust on the way.",
              ),
              h3("Hot and cold aisle"),
              p(
                "Racks are arranged so equipment inlets face each other across a cold aisle and exhausts face each other across a hot aisle. Without containment, the two mix, inlet temperature rises, and the cooling system works harder to achieve less.",
              ),
              h3("Blanking panels"),
              p(
                "An empty rack unit without a blanking panel lets hot exhaust recirculate straight back to the inlet above it. Blanking panels cost almost nothing and are the highest-return fix in most rooms.",
              ),
              h3("Measure at the inlet"),
              p(
                "Vendor temperature specifications apply at the equipment inlet, not at the room thermostat. A room reading 22°C can still have inlets at 35°C at the top of a rack. Instrument at the inlet, in several places, at several heights.",
              ),
            ),
          },
        ],
      },
      {
        title: "Operating the room",
        summary: "Monitoring, access, and the discipline that keeps a room documented.",
        lessons: [
          {
            title: "What to monitor and why",
            slug: "what-to-monitor",
            duration: "12 min",
            body: rich(
              p(
                "A room that is not instrumented is a room where the first sign of a problem is a service failure. These are the measurements that give you warning instead.",
              ),
              ul([
                "Inlet temperature and humidity at multiple points and heights",
                "UPS load, battery health, and time on battery",
                "Per-circuit and per-outlet power draw, so capacity is known before the next install",
                "Generator fuel level and last successful test run",
                "Water detection under raised floor and near cooling units",
                "Door position and access events",
              ]),
              h3("Alarms people act on"),
              p(
                "An alarm that fires constantly is an alarm that gets ignored. Set thresholds against what actually requires action, route them to someone who is on duty, and review the ones that fired but did not matter.",
              ),
            ),
          },
          {
            title: "Documentation and change discipline",
            slug: "documentation-discipline",
            duration: "11 min",
            body: rich(
              p(
                "A room is only as maintainable as its documentation. When an engineer who has never seen the room has to work in it at 3am, the labelling and the drawings are the entire handover.",
              ),
              h3("The minimum set"),
              ul([
                "Rack elevations showing what is where, kept current",
                "Cable schedule with both ends labelled and matching the document",
                "Single-line electrical drawing showing the power path",
                "Commissioning results as a baseline to compare against",
                "Maintenance schedule with who is responsible for each item",
              ]),
              h3("Change discipline"),
              p(
                "Every install, move, and removal updates the documentation the same day. The moment documentation lags reality, people stop trusting it, and once nobody trusts it the room becomes undocumented regardless of how many drawings exist.",
              ),
            ),
          },
        ],
      },
    ],
  },

  {
    title: "Security operations fundamentals",
    slug: "security-operations-fundamentals",
    order: 4,
    audience: "Analysts and IT staff moving into a security operations role",
    duration: "About 1 week",
    level: "intermediate",
    summary:
      "What a security operations centre actually does day to day: what to log, how detection is designed, and how an alert becomes a contained incident.",
    outcomes: [
      "Explain the difference between logging everything and detecting something",
      "Describe how a detection use case is designed and tuned",
      "Walk an alert through triage, investigation, and containment",
      "Explain why response depends on decisions made before the incident",
    ],
    solutionSlugs: ["cybersecurity-digital-resilience"],
    modules: [
      {
        title: "Detection",
        summary: "Turning logs into something an analyst can act on.",
        lessons: [
          {
            title: "Logging is not detection",
            slug: "logging-is-not-detection",
            duration: "13 min",
            body: rich(
              p(
                "Many organizations buy a SIEM, forward everything into it, and conclude a year later that it did not help. Collecting logs is a prerequisite for detection; it is not detection.",
              ),
              h3("Start from the question"),
              p(
                "Detection begins with what you want to catch: an account authenticating from two countries within an hour, a privileged group gaining a member outside a change window, a workstation talking directly to a database it has no reason to reach. Each of those is a use case, and each tells you what to log.",
              ),
              h3("The sources that earn their place"),
              ul([
                "Authentication and directory events — the basis of most useful detections",
                "Endpoint telemetry from EDR, including process creation",
                "Firewall and proxy traffic logs for east-west and egress visibility",
                "DNS, which reveals a great deal about what a host is trying to reach",
                "Application and database audit logs for the systems that matter most",
              ]),
              p(
                "Forwarding everything else costs licence and storage and produces noise. Log with intent.",
              ),
            ),
          },
          {
            title: "Designing and tuning a use case",
            slug: "designing-use-cases",
            duration: "15 min",
            body: rich(
              p(
                "A use case is a written statement of what you are detecting, why it matters, what data it needs, and what the analyst should do when it fires. Rules without that context become alerts nobody knows how to handle.",
              ),
              h3("What a use case document contains"),
              ul([
                "The behaviour being detected, in plain language",
                "Why it matters to this organization specifically",
                "Data sources required",
                "The logic, and its known blind spots",
                "Expected false positive sources",
                "The triage steps an analyst should take",
              ]),
              h3("Tuning is the job"),
              p(
                "A new rule usually fires on legitimate activity — a backup service that authenticates unusually, an administrator who genuinely works at night. Tuning means understanding each false positive and either excluding it precisely or adjusting the logic. Suppressing an alert without understanding it is how real detections get switched off.",
              ),
            ),
          },
        ],
      },
      {
        title: "Response",
        summary: "From alert to contained incident, and the preparation that makes it possible.",
        lessons: [
          {
            title: "Triage, investigation, containment",
            slug: "triage-investigation-containment",
            duration: "16 min",
            body: rich(
              p(
                "An alert arrives. What happens next should be a process, not improvisation, because improvisation at 2am produces mistakes that destroy the evidence you need.",
              ),
              h3("Triage"),
              p(
                "Is this real, and does it matter? Confirm the alert fired on what it claims, establish which asset and identity are involved, and assign a severity based on what that asset does for the business.",
              ),
              h3("Investigation"),
              p(
                "Build the timeline. What happened before the alert, what happened after, what else did this identity or host touch. This is where correlated logging earns its cost — an investigation across three consoles with mismatched clocks takes hours longer.",
              ),
              h3("Containment"),
              p(
                "Isolate the host, disable the account, block the destination. Containment decisions have business consequences, so the authority to make them should be agreed in advance rather than negotiated during the incident.",
              ),
              h3("Preserve before you clean"),
              p(
                "The instinct is to reimage the machine and move on. Capture what you need first — memory, disk image, logs — because once it is wiped you cannot answer how far the intrusion reached.",
              ),
            ),
          },
          {
            title: "Why response depends on preparation",
            slug: "response-depends-on-preparation",
            duration: "12 min",
            body: rich(
              p(
                "Almost every decision that determines how badly an incident goes is made before it starts.",
              ),
              ul([
                "Whether backups are immutable, and whether a restore has been rehearsed",
                "Whether segmentation limits how far an intrusion can move",
                "Whether privileged accounts are separated, so one compromised laptop is not the estate",
                "Whether there is a contact list that works out of hours",
                "Whether anyone has authority to disconnect a production system, and who",
              ]),
              h3("The tabletop exercise"),
              p(
                "Walk through a realistic scenario with the people who would actually be involved, including someone from the business, and find out where the plan does not survive contact. It is a cheap way to discover that the person authorised to approve isolation is unreachable on a weekend.",
              ),
            ),
          },
        ],
      },
    ],
  },
];
