/*
 * The eight completed projects, Module 03 of the content master.
 *
 * Contract values are omitted from every field by instruction, and no device
 * counts, capacities, uptime or coverage figures appear anywhere: the content
 * master permits only quantities supported by signed acceptance records, and
 * none have been supplied. Where a page would normally carry a statistic it
 * carries the completion year and a qualitative outcome instead.
 */

export const PROJECT_DETAIL = {
  "bahir-dar-university-smart-classrooms": {
    headline: "Transforming traditional classrooms into connected learning environments",
    need:
      "Modern teaching increasingly combines physical instruction, multimedia, remote participation, digital content, and on-demand academic resources. Bahir Dar University required a coordinated environment that could help teachers move beyond static boards while remaining practical for daily classroom use across its campuses.",
    scope: [
      "Classroom assessment and solution planning across university campuses.",
      "Interactive classroom displays and digital teaching interfaces.",
      "Audio and video collaboration capabilities for hybrid instruction and invited participation.",
      "Supporting connectivity, cabling, mounting, power, configuration, and classroom integration.",
      "Content presentation, annotation, screen sharing, and lesson-collaboration workflows.",
      "Foundation for AI-powered education resources and approved institutional knowledge access.",
      "Testing, classroom acceptance, administrator and user training, documentation, and handover.",
    ],
    delivered: [
      { title: "Interactive teaching",
        body: "Interactive displays enable instructors to combine handwritten annotation, presentations, documents, video, diagrams, and digital learning material in one teaching surface." },
      { title: "Hybrid participation",
        body: "Integrated collaboration tools support classes, guest lectures, coaching, demonstrations, and academic discussions involving participants outside the room." },
      { title: "Content continuity",
        body: "Teachers can prepare, present, revisit, and share digital material more consistently, helping knowledge move beyond a single lecture and a single physical board." },
      { title: "AI-ready learning resources",
        body: "The environment establishes a pathway for approved AI knowledge assistants and educational resources grounded in university policies, curricula, manuals, course material, and digital libraries, subject to governance and content approval." },
      { title: "Operational readiness",
        body: "Installation, configuration, testing, user orientation, documentation, and support preparation were coordinated so the rooms could become usable institutional assets rather than isolated devices." },
    ],
    outcomes: [
      "Traditional teaching spaces were converted into interactive digital learning environments.",
      "Instructors gained richer ways to explain, visualize, annotate, and share course material.",
      "Classrooms became better prepared for hybrid lectures, expert participation, digital content, and collaborative learning.",
      "The university gained a scalable foundation for future AI-based academic knowledge and learning services.",
      "Training and handover strengthened local capability to operate and support the new environments.",
    ],
    technology:
      "PeopleLink collaboration products, IQBoard interactive technologies and NEARITY collaboration solutions, as approved in the final bill of materials.",
    technologyNote: "Exact product-brand spelling and models are verified against the accepted bill of materials before publication.",
    training:
      "Edge Comm-Tech coordinated local and international training for designated university personnel, with training-completion certificates issued as applicable.",
  },

  "bahir-dar-university-safe-campus": {
    headline: "A connected safe-campus foundation across Bahir Dar University",
    need:
      "A university campus is an open and active environment serving students, academic staff, administrators, visitors, facilities, and valuable assets. Bahir Dar University required an integrated approach that could improve visibility across multiple campuses and help security personnel coordinate their work from purpose-built operational spaces.",
    scope: [
      "Campus security assessment, coverage planning, and surveillance architecture.",
      "IP camera infrastructure, video management, recording, storage, and authorized viewing.",
      "Dedicated security operations and control rooms for campus monitoring and coordination.",
      "Operator displays, workstations, supporting networks, racks, cabling, power, and room infrastructure.",
      "Radio communication across campus security operations to improve field coordination.",
      "System configuration, testing, commissioning, operating procedures, training, and handover.",
    ],
    delivered: [
      { title: "Continuous monitoring platform",
        body: "Authorized operators can monitor priority campus areas through a centralized video-management environment designed for continuous security operations." },
      { title: "Campus security control rooms",
        body: "Each operational room brings video feeds, recording access, operator workstations, communications, and incident coordination into a structured workspace." },
      { title: "Recorded evidence",
        body: "Managed recording and retrieval support authorized review of incidents, investigations, and operational follow-up in line with university policy and retention requirements." },
      { title: "Field communication",
        body: "Radio communication helps control-room staff and field personnel coordinate observations, dispatch, escalation, and response across campus environments." },
      { title: "Integrated infrastructure",
        body: "Cameras, networks, storage, displays, power, cabling, and room systems were delivered as a coordinated operational platform." },
    ],
    outcomes: [
      "Improved situational awareness across monitored campus areas.",
      "More coordinated communication between control-room operators and field security personnel.",
      "A structured process for live monitoring, event review, escalation, and authorized evidence retrieval.",
      "Purpose-built campus security control rooms supporting consistent daily operations.",
      "A scalable safe-campus foundation that can be governed, maintained, and expanded over time.",
    ],
    technology: "Hikvision video-surveillance and management technologies.",
    training:
      "Local and international training was provided to designated personnel, with training-completion certificates issued as applicable.",
    privacy:
      "Surveillance infrastructure supports safety and authorized response. It does not guarantee safety or prevent every incident, and its use is governed by university policy, access control and retention rules.",
  },

  "arba-minch-university-smart-meeting-rooms": {
    headline: "Connecting agricultural researchers with expertise beyond the campus",
    need:
      "Agricultural research benefits from regular exchange among local researchers, international scientists, technical specialists, and academic partners. The university needed meeting environments that could make remote participants feel present, allow complex material to be shared clearly, and support dependable collaboration without requiring every expert to travel.",
    scope: [
      "Room assessment, collaboration design, display and audio planning.",
      "Video conferencing, cameras, microphones, speakers, displays, and content sharing.",
      "Supporting network, cabling, equipment placement, control, power, and configuration.",
      "Hybrid meeting, coaching, research presentation, and expert-participation workflows.",
      "Testing, acceptance, administrator orientation, user training, and handover.",
    ],
    delivered: [
      { title: "High-quality hybrid meetings",
        body: "Integrated video, audio, and display technologies enable on-campus and remote participants to see, hear, present, and discuss research material more effectively." },
      { title: "Research content sharing",
        body: "Participants can present data, field observations, documents, images, and research findings to both local and remote audiences." },
      { title: "Remote coaching and expert access",
        body: "The rooms support direct sessions with researchers and scientists outside Ethiopia, opening more opportunities for mentoring, peer review, and specialist contribution." },
      { title: "Consistent room experience",
        body: "Coordinated components, configuration, and user guidance reduce the friction often caused by disconnected meeting-room devices." },
    ],
    outcomes: [
      "A traditional meeting environment was transformed into a connected research and coaching center.",
      "Remote researchers and scientists can participate directly in presentations, discussions, and advisory sessions.",
      "Agricultural research teams gained better tools for sharing evidence, receiving feedback, and maintaining international collaboration.",
      "Local training improved confidence in scheduling, starting, operating, and supporting hybrid sessions.",
    ],
    technology:
      "Dahua Technology collaboration and audiovisual components, as specified in the accepted project bill of materials.",
    training:
      "Edge Comm-Tech provided local training for designated university users and administrators, with training-completion certificates issued as applicable.",
  },

  "gadaa-bank-computing-infrastructure": {
    headline: "A scalable computing foundation for core banking and enterprise applications",
    need:
      "Core banking, ERP, and major enterprise applications depend on computing platforms that can remain responsive, recover from component failures, scale with business growth, and be managed efficiently. The bank required a modernization path beyond separately managed traditional servers and storage.",
    scope: [
      "Assessment of current workloads, dependencies, capacity, resilience, and growth requirements.",
      "HCI architecture and sizing for core banking, ERP, and main banking applications.",
      "Supply and implementation of HPE compute, storage, networking, virtualization, and management components within the approved design.",
      "Migration planning and coordinated transition from traditional infrastructure.",
      "Cluster configuration, resilience, monitoring, testing, documentation, and acceptance.",
      "Private-cloud readiness and expansion planning.",
      "Administrator training, knowledge transfer, handover, warranty, and support preparation.",
    ],
    delivered: [
      { title: "Hyperconverged platform",
        body: "Compute, storage, virtualization, and management are brought together in a coordinated cluster, reducing infrastructure silos and simplifying routine administration." },
      { title: "Workload resilience",
        body: "Clustered resources and redundancy help critical applications continue operating through supported component-failure scenarios, subject to the accepted architecture and operating procedures." },
      { title: "Responsive operations",
        body: "Modern computing and storage resources provide a stronger platform for core banking, ERP, and enterprise application workloads." },
      { title: "Simplified expansion",
        body: "The architecture can be expanded in planned increments as demand, applications, and data grow." },
      { title: "Private-cloud pathway",
        body: "Centralized virtualization and management establish a foundation that can evolve toward governed self-service, automation, and private-cloud operations." },
    ],
    outcomes: [
      "The bank moved from traditional infrastructure silos to a modern integrated computing platform.",
      "Critical workloads gained a more responsive, resilient, and manageable operating foundation.",
      "Expansion can be planned more predictably as computing and storage needs increase.",
      "The platform provides a technical basis for future private-cloud capabilities and operational automation.",
      "Training strengthened the bank team's ability to operate, monitor, and support the environment.",
    ],
    technology: "HPE enterprise infrastructure.",
    training:
      "Local technical training and knowledge transfer were provided to designated bank personnel, with training-completion certificates issued as applicable.",
  },

  "national-bank-ethiopia-backup-infrastructure": {
    headline: "Strengthening protection and recovery for critical institutional data",
    need:
      "Critical institutional data must be protected against equipment failure, operational error, corruption, and other disruptive events. A backup platform is valuable only when data is captured according to policy, monitored, retained appropriately, and recoverable through tested procedures.",
    scope: [
      "Assessment of backup workloads, retention needs, recovery priorities, dependencies, and capacity.",
      "Backup and recovery architecture using HPE infrastructure.",
      "Supply, installation, configuration, integration, and policy alignment within the approved scope.",
      "Backup-job configuration, monitoring, alerting, retention, and administrative controls.",
      "Recovery workflow preparation and validation based on approved test scenarios.",
      "Documentation, training, handover, warranty, and support readiness.",
    ],
    delivered: [
      { title: "Reliable backup foundation",
        body: "The implemented platform provides dedicated infrastructure for protecting approved workloads and retaining backup data according to defined operational requirements." },
      { title: "Centralized visibility",
        body: "Administrators can monitor backup jobs, identify failures or exceptions, review capacity, and manage routine protection tasks from a coordinated environment." },
      { title: "Recovery readiness",
        body: "Documented procedures and validation activities strengthen the institution's ability to restore protected information when an authorized recovery is required." },
      { title: "Operational efficiency",
        body: "A structured backup environment makes policies, schedules, alerts, administration, and support more consistent than fragmented protection processes." },
    ],
    outcomes: [
      "A more secure, reliable, and efficient platform for backup operations.",
      "Improved visibility into backup status, capacity, exceptions, and administration.",
      "Stronger recovery preparedness for protected critical information.",
      "Clearer operational ownership through documentation, training, and handover.",
      "A scalable foundation for future data-protection requirements.",
    ],
    technology: "HPE backup and infrastructure technologies.",
    technologyNote:
      "Exact product families are published only after the National Bank of Ethiopia approves the wording and the final bill of materials is verified.",
    training:
      "Local training and knowledge transfer were provided to designated personnel, with training-completion certificates issued as applicable.",
    privacy:
      "Backup alone does not guarantee data security, business continuity or recovery. Backup, disaster recovery and wider cyber resilience are distinct disciplines.",
  },

  "ministry-urban-infrastructure-computing": {
    headline: "A resilient computing platform for essential public programs",
    need:
      "Public programs depend on applications and data platforms that can serve users consistently, respond efficiently, and grow as program demand changes. The Ministry required coordinated compute, storage, switching, and application-delivery infrastructure for workloads supporting social safety-net services.",
    scope: [
      "Assessment of workloads, capacity, application dependencies, availability, and growth.",
      "HPE server and storage infrastructure for approved ministry applications and data.",
      "HPE top-of-rack switching for high-speed connectivity within the computing environment.",
      "Array Networks application delivery controllers and load balancing for service distribution, health monitoring, and availability.",
      "Integration, configuration, migration coordination where applicable, and resilience design.",
      "Testing, commissioning, documentation, training, handover, and support preparation.",
    ],
    delivered: [
      { title: "Enterprise compute",
        body: "HPE servers provide a modern processing foundation for approved ministry workloads and future expansion." },
      { title: "Centralized storage",
        body: "Enterprise storage supports application data with coordinated management, performance, protection, and capacity planning." },
      { title: "Top-of-rack switching",
        body: "Data-center switching connects compute and storage resources through a structured high-speed fabric designed around the accepted architecture." },
      { title: "Application delivery and load balancing",
        body: "Array Networks technology distributes approved application traffic, monitors service health, and directs requests to available resources, helping improve responsiveness and reduce single points of failure within the designed service path." },
      { title: "Integrated operations",
        body: "Compute, storage, switching, and delivery controls were implemented as one platform with testing, documentation, and knowledge transfer." },
    ],
    outcomes: [
      "A more efficient, reliable, resilient, and maintainable computing foundation for essential public applications.",
      "Improved application-delivery responsiveness and service distribution within the approved architecture.",
      "Redundancy across key components reduces dependence on individual infrastructure elements.",
      "The platform can be expanded more systematically as application, user, and data requirements grow.",
      "Training and documentation strengthen the Ministry team's ability to administer and support the environment.",
    ],
    technology:
      "HPE compute, storage and switching technologies, with Array Networks application delivery and load-balancing solutions.",
    training:
      "Local technical training and knowledge transfer were provided to designated Ministry personnel, with training-completion certificates issued as applicable.",
  },

  "siinqee-bank-datacenter-power": {
    headline: "Resilient power infrastructure for an availability-focused datacenter",
    need:
      "A bank's datacenter depends on continuous, conditioned power. Grid interruption, voltage instability, equipment faults, or maintenance can affect digital banking services and critical information systems. Siinqee Bank required a stronger power architecture aligned with its wider datacenter availability goals.",
    scope: [
      "Critical-load assessment, capacity planning, autonomy requirements, redundancy, and growth review.",
      "KSTAR uninterruptible power infrastructure for conditioned power and transition support.",
      "Cummins diesel-generator infrastructure for extended backup generation.",
      "Electrical distribution, protection, grounding, transfer, monitoring, and integration within the approved scope.",
      "Installation coordination, configuration, staged testing, commissioning, documentation, and handover.",
      "Operator training, maintenance guidance, warranty, and support preparation.",
    ],
    delivered: [
      { title: "Uninterruptible power layer",
        body: "KSTAR UPS systems condition power and support critical loads through short interruptions and the transition to backup generation, according to the accepted runtime and redundancy design." },
      { title: "Extended backup generation",
        body: "Cummins generator infrastructure provides an alternative power source for longer grid outages, supported by the approved transfer and operating arrangements." },
      { title: "Coordinated power path",
        body: "UPS, generation, distribution, protection, grounding, monitoring, and operating procedures work together as a system rather than as separate equipment purchases." },
      { title: "Maintainability and readiness",
        body: "Testing, documentation, training, and maintenance planning help the bank operate and service the infrastructure with controlled risk." },
      { title: "Tier-aligned direction",
        body: "The delivered power improvements support the bank's wider ambition for an availability-focused Tier III-aligned datacenter." },
    ],
    outcomes: [
      "A more resilient and redundant power foundation for critical datacenter operations.",
      "Reduced exposure to grid interruption and unstable power conditions.",
      "Improved transition from utility power to protected and generated backup power.",
      "Better operational readiness through testing, monitoring, documentation, and training.",
      "A stronger facility foundation for the bank's wider datacenter availability and growth objectives.",
    ],
    technology: "Cummins diesel generators and KSTAR UPS systems.",
    training:
      "Local technical and operational training was provided to designated bank personnel, with training-completion certificates issued as applicable.",
    privacy:
      "Tier III-aligned describes the design direction. Tier III certification is stated separately only if awarded by an authorized independent body.",
  },

  "zemen-bank-generator-solutions": {
    headline: "Backup power supporting banking services across branch locations",
    need:
      "Bank branches rely on power for transaction systems, connectivity, lighting, security, customer service, and essential operational equipment. Because branch conditions and loads can vary, backup generation must be correctly selected, installed, tested, and supported at each location.",
    scope: [
      "Branch power and load assessment within the approved project scope.",
      "Selection and supply of appropriately designed Cummins generator systems.",
      "Site delivery, placement, electrical and transfer integration, protection, grounding, and commissioning as applicable.",
      "Operational testing and handover at completed branch locations.",
      "User orientation, maintenance guidance, documentation, warranty, and support preparation.",
    ],
    delivered: [
      { title: "Branch-aligned generation",
        body: "Generator capacity and deployment arrangements were selected to support defined branch loads and operating requirements." },
      { title: "Backup power availability",
        body: "When utility power is unavailable, the installed generators provide an alternative source for approved branch systems and essential services." },
      { title: "Coordinated installation",
        body: "Electrical interfaces, transfer arrangements, grounding, ventilation, safety, noise, access, and testing were addressed according to the approved site scope." },
      { title: "Operational handover",
        body: "Branch and technical personnel received guidance on safe operation, routine checks, escalation, and maintenance responsibilities." },
    ],
    outcomes: [
      "Reduced risk of power-related interruption at equipped branch locations.",
      "Stronger continuity for branch systems, communications, and customer services during utility outages.",
      "More consistent backup-power capability across the completed deployment locations.",
      "Improved operational readiness through testing, training, documentation, and support arrangements.",
    ],
    technology: "Cummins generator systems.",
    technologyNote:
      "Exact generator models, ratings, branch count and partnership designation are verified before publication.",
    training:
      "Local training and operational orientation were provided to designated personnel, with training-completion certificates issued as applicable.",
  },
};

/* The implementation paragraph is identical across all eight in the content
   master, so it lives here once rather than being repeated eight times. */
export const IMPLEMENTATION =
  "Edge Comm-Tech coordinated the project across requirements validation, detailed design, sourcing, logistics, site preparation, installation, configuration, integration, testing, issue resolution, client acceptance, documentation, training, and handover.";
