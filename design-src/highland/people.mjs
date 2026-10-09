/*
 * Careers, open positions, the internship intake and E-Academy.
 * Module 08 of the content master.
 *
 * The two vacancies below are the real ones. Application deadlines are left
 * as "To be confirmed" because the content master instructs that the approved
 * date is entered per record before publication, and inventing one would be
 * the exact failure the document keeps guarding against.
 */

export const CAREER_PATHWAYS = [
  { title: "Engineering and Technology",
    body: "Enterprise networks, cybersecurity, systems, cloud, datacenter facilities, IT infrastructure, power, broadcast and satellite." },
  { title: "Software, AI and Digital",
    body: "Software applications, AI-powered knowledge assistants, private RAG, automation, local-language AI and digital platforms." },
  { title: "Presales and Solution Design",
    body: "Requirement discovery, architecture, technical proposals, demonstrations, bills of materials and solution positioning." },
  { title: "Project and Service Delivery",
    body: "Project planning, coordination, implementation governance, documentation, handover and client support." },
  { title: "Marketing and Business Development",
    body: "Sector engagement, account development, campaigns, events, partnerships and opportunity development." },
  { title: "Corporate and Operational Functions",
    body: "Human resources, administration, finance, supply chain, strategy, performance and business operations." },
];

export const CULTURE = [
  ["Integrity", "We act honestly, protect trust and communicate clearly."],
  ["Reliability", "We take commitments seriously and deliver dependable work."],
  ["Passion", "We bring energy, curiosity and pride to technology and service."],
  ["Accountability", "We own our decisions, deadlines, quality and outcomes."],
  ["Team Unity", "We collaborate across roles and succeed as one team."],
  ["Adaptability", "We learn quickly and respond constructively to change."],
  ["Sustainability", "We consider long-term value, responsible resource use and lasting impact."],
];

export const DEVELOPMENT = [
  "Role onboarding and clear performance expectations.",
  "Coaching from managers, team leaders and experienced specialists.",
  "Project-based learning supported by documentation and review.",
  "Internal workshops, technical sessions and professional-learning opportunities.",
  "Leadership and succession development as employees take on broader responsibility.",
];

export const EXPERIENCE_POINTS = [
  "Meaningful work connected to Ethiopia's and Africa's digital transformation.",
  "Exposure to multiple technology domains, client environments and delivery stages.",
  "Collaboration among engineering, presales, project, commercial and operational teams.",
  "Structured goals and clear accountability from company priorities to individual action plans.",
  "Continuous learning through technical practice, professional development, training and certification pathways.",
];

/* ------------------------------------------------------------ vacancies */

export const JOBS = [
  {
    slug: "hr-manager",
    title: "HR Manager",
    department: "HR and Administration",
    level: "Manager",
    reports: "Chief Strategy Officer",
    type: "Full time",
    location: "Edge Comm-Tech Headquarters, Addis Ababa, with work at other approved locations when required",
    deadline: "To be confirmed",
    status: "Open",
    purposeTitle: "Build the people systems that support delivery",
    purpose:
      "The HR Manager will lead the human-resources and administrative practices that help Edge Comm-Tech attract capable people, build accountable teams and maintain a professional working environment. The role connects workforce planning, recruitment, onboarding, performance management, employee relations, learning, records and policy implementation with the company's strategic and operational priorities.",
    responsibilities: [
      "Translate company and departmental workforce plans into structured recruitment, selection and onboarding activities.",
      "Manage the full recruitment process, including vacancy preparation, candidate screening, interview coordination, reference checks, offers and onboarding documentation.",
      "Coordinate the company performance-management cycle and support the cascade of company, executive, departmental, team and individual objectives and key results.",
      "Maintain accurate employee files, contracts, attendance, leave, training, performance and disciplinary records with appropriate confidentiality and access control.",
      "Implement HR policies and procedures consistently and keep them aligned with applicable Ethiopian employment requirements and approved company decisions.",
      "Guide managers on workforce planning, role clarity, employee relations, performance improvement, recognition and professional development.",
      "Plan orientation, coaching, training and succession-development activities in coordination with department managers and executive leadership.",
      "Prepare reliable HR reports and workforce indicators for management review without exposing personal information unnecessarily.",
      "Coordinate administrative services that support a safe, organized and productive office environment.",
      "Promote Edge Comm-Tech's values of Integrity, Reliability, Passion, Accountability, Team Unity, Adaptability and Sustainability.",
    ],
    required: [
      "Bachelor's degree in Human Resource Management, Management, Business Administration or a closely related field.",
      "More than five years of progressive human-resources experience, including responsibility for recruitment, employee records, performance management and policy implementation.",
      "Practical knowledge of Ethiopian employment practices and the ability to apply approved policies fairly and consistently.",
      "Experience coordinating multiple vacancies, onboarding activities and performance-review cycles across different departments.",
      "Strong judgment, confidentiality, organization, documentation, communication and conflict-resolution skills.",
      "Ability to work with managers, technical professionals and executive leaders in a deadline-driven project environment.",
      "Working proficiency with office productivity tools; ability to use an HR information or applicant-tracking system.",
    ],
    preferred: [
      "Postgraduate qualification or recognized professional certification in human resources, management or organizational development.",
      "Experience in a technology, engineering, systems-integration or project-based organization.",
      "Practical knowledge of OKR-based planning, performance discussions, coaching and structured reporting.",
    ],
    success:
      "Success will be demonstrated through disciplined recruitment and onboarding, accurate and confidential records, timely performance cycles, consistent policy application, useful management reporting and stronger coordination between people requirements and business delivery.",
  },
  {
    slug: "chief-technology-officer",
    title: "Chief Technology Officer",
    department: "Executive Management and Technology Leadership",
    level: "Executive",
    reports: "Founder and Chief Executive Officer",
    type: "Full time",
    location: "Edge Comm-Tech Headquarters, Addis Ababa, with client and project-site engagement when required",
    deadline: "To be confirmed",
    status: "Open",
    purposeTitle: "Lead technology strategy, engineering quality and innovation",
    purpose:
      "The Chief Technology Officer will define and govern Edge Comm-Tech's technology direction while strengthening the engineering capability required to design and deliver reliable end-to-end solutions. The CTO will connect business strategy, market requirements, solution architecture, presales, project execution, vendor technologies, professional development and innovation across the company's portfolio.",
    scope:
      "The CTO will provide executive leadership across Enterprise Network and Cybersecurity, System and Cloud, Power and Infrastructure, and Software and Applications. The role works closely with the CEO, CSO, COO and CFO and provides technical direction to Engineering Operations, Presales Operations, Project Operations and relevant solution teams.",
    responsibilities: [
      "Develop and execute a technology strategy aligned with Edge Comm-Tech's mission, growth priorities, target sectors and solution portfolio.",
      "Establish architecture, engineering, testing, documentation, cybersecurity, quality and handover standards for presales and project delivery.",
      "Provide executive technical governance for complex solutions spanning networks, cybersecurity, systems, cloud, datacenters, IT infrastructure, power, broadcast, satellite, software and AI.",
      "Review major solution designs, technical proposals, bills of materials, implementation approaches and delivery risks before approval.",
      "Strengthen collaboration between engineering, presales, project management, supply chain, business development and finance throughout the opportunity and delivery lifecycle.",
      "Build technical leadership capacity, certification plans, mentoring systems, succession pathways and performance expectations across engineering disciplines.",
      "Manage strategic technical engagement with vendors and OEMs and convert partner capabilities into relevant, supportable solutions for clients.",
      "Guide innovation in private cloud, AI, secure digital platforms, local-language solutions, automation and other technologies relevant to Ethiopia and Africa.",
      "Represent Edge Comm-Tech in executive client discussions, technical workshops, partner meetings and critical project reviews.",
      "Monitor technology risks, capability gaps, delivery quality, lessons learned and improvement actions, and report them clearly to executive management.",
    ],
    required: [
      "Bachelor's degree in Computer Engineering, Computer Science, Information Technology, Electrical or Communication Engineering, Software Engineering or a closely related field.",
      "Substantial progressive experience in enterprise technology, systems integration or engineering delivery, including senior leadership responsibility for multidisciplinary technical teams.",
      "Demonstrated ability to lead solution architecture, technical presales, implementation governance and executive client engagement for complex projects.",
      "Strong working knowledge across several of the following domains: enterprise networks, cybersecurity, compute and storage, virtualization and cloud, datacenter facilities, critical power, software, data and AI.",
      "Experience developing technical standards, reviewing solution risks, managing vendor relationships and building professional capability through coaching and certification.",
      "Commercial awareness and the ability to balance technical quality, client requirements, delivery feasibility, lifecycle support and business value.",
      "Excellent leadership, analytical, decision-making, presentation, negotiation and written communication skills.",
    ],
    preferred: [
      "Postgraduate qualification in technology, engineering, business leadership or a related discipline.",
      "Current professional or vendor certifications relevant to Edge Comm-Tech's solution portfolio.",
      "Experience serving banking and finance, universities, government institutions or other organizations with critical technology environments.",
      "Experience introducing scalable software, cloud, cybersecurity, AI or managed-service capabilities into an established systems-integration business.",
    ],
    success:
      "Success will be demonstrated through stronger technical governance, higher solution and delivery quality, disciplined risk management, capable and certified teams, relevant innovation, effective vendor collaboration and technology decisions that support sustainable business growth.",
  },
];

export const APPLICATION_DOCS = [
  "CV",
  "Cover letter",
  "Education documents",
  "Experience documents",
  "Relevant certifications",
];

/* ----------------------------------------------------------- internship */

export const INTERNSHIP = {
  title: "Graduate Technology Internship",
  type: "Periodic supervised internship",
  location: "Addis Ababa, with approved laboratory, client-site or project-site exposure when required",
  schedule: "Dates and working schedule to be confirmed",
  deadline: "To be confirmed",
  intro:
    "The Edge Comm-Tech Internship Program gives selected learners and early-career candidates supervised exposure to real professional environments. Periodic intakes are announced according to departmental capacity, project requirements and available mentors.",
  caveat:
    "Each intake publishes its available tracks, eligibility criteria, location, schedule, required documents and application deadline. Submitting an application does not guarantee placement, and the internship does not guarantee permanent employment.",
  tracks: [
    { title: "Network Engineer",
      body: "Planning, installation, testing, documentation and support activities used in enterprise network environments. Learning exposure may include LAN and WAN concepts, routing and switching, wireless networks, fiber and copper connectivity, network diagrams, configuration records, monitoring, troubleshooting methods and foundational network-security practices. All activities are supervised and limited by approved access permissions." },
    { title: "System Engineer",
      body: "Enterprise computing and data-resilience environments. Learning exposure may include servers, storage, virtualization, hyperconverged infrastructure, operating systems, backup and recovery, monitoring, cloud foundations, installation checklists, asset records and technical documentation. All activities are supervised and performed only within approved laboratory, office or project environments." },
  ],
  eligibility: [
    "Recent graduates with a bachelor's degree in Computer Engineering, Computer Science, Information Technology, Electrical or Communication Engineering, Software Engineering or a closely related field.",
    "Applicants with sound foundational knowledge relevant to the selected Network Engineer or System Engineer track.",
    "Graduates who can learn responsibly, follow technical and safety instructions, protect confidential information and document their work carefully.",
    "Applicants with clear communication, teamwork, problem-solving, time-management and professional conduct.",
    "Candidates available for the published internship schedule and any approved field or project-site learning activities.",
  ],
  documents: [
    "Current CV",
    "Degree certificate, temporary graduation certificate or official completion evidence",
    "Academic transcript",
    "Short motivation statement identifying the preferred track and learning objectives",
    "Relevant training or certification evidence, when available",
  ],
  structure: [
    { title: "Orientation", body: "Introduction to Edge Comm-Tech, workplace expectations, safety, information protection and the assigned department." },
    { title: "Learning plan", body: "Clear objectives, supervised activities and expected outputs for the selected track." },
    { title: "Practical exposure", body: "Observation and guided contribution appropriate to the participant's level and access permissions." },
    { title: "Professional habits", body: "Planning, communication, documentation, teamwork, accountability and feedback." },
    { title: "Progress review", body: "Regular mentor or supervisor feedback against the intake's learning objectives." },
    { title: "Completion review", body: "A final assessment of participation, learning and completed assignments; any certificate or recognition follows the published intake rules." },
  ],
  selection: [
    { n: 1, title: "Application", body: "Submit the intake-specific form and required documents before the deadline." },
    { n: 2, title: "Eligibility review", body: "HR verifies the published minimum requirements and completeness of the application." },
    { n: 3, title: "Department review", body: "The receiving department evaluates track relevance and available supervision capacity." },
    { n: 4, title: "Assessment", body: "Shortlisted candidates may complete an interview, assignment or technical assessment stated in the intake." },
    { n: 5, title: "Selection", body: "Selected candidates receive written placement information, schedule and onboarding requirements." },
    { n: 6, title: "Onboarding", body: "Participants complete the required orientation and acknowledgements before receiving assignments." },
  ],
};

/* ----------------------------------------------------------- E-Academy */

export const ACADEMY_AUDIENCES = [
  { title: "Individual learners", body: "Scheduled public courses, awareness sessions and professional workshops.", action: "Register for a Course" },
  { title: "Client organizations", body: "Project handover training, administrator or user enablement and solution-specific workshops.", action: "Request Client Training" },
  { title: "Other organizations", body: "Tailored team learning, awareness programs and technology workshops.", action: "Request Organizational Training" },
  { title: "Edge Comm-Tech teams", body: "Internal workshops, knowledge sharing, vendor-aligned learning and development pathways.", action: "Internal Learning Access" },
];

export const ACADEMY_TRACKS = [
  { slug: "ai-software-digital", title: "AI, Software and Digital Skills",
    body: "Private RAG, AI knowledge assistants, agentic AI, automation, software and local-language AI applications.",
    solution: "software-ai-digital" },
  { slug: "network-cybersecurity", title: "Enterprise Network and Cybersecurity",
    body: "Networking, wireless, security fundamentals, zero trust, secure access and operational practices.",
    solution: "cybersecurity" },
  { slug: "system-cloud-resilience", title: "System, Cloud and Data Resilience",
    body: "Compute, storage, HCI, virtualization, backup, recovery and cloud foundations.",
    solution: "system-cloud" },
  { slug: "datacenter-infrastructure", title: "Datacenter Facility and IT Infrastructure",
    body: "Tier-aligned facilities, structured cabling, cooling, power, monitoring and infrastructure operations.",
    solution: "datacenter-facility-it-infrastructure" },
  { slug: "smart-education", title: "Smart Education and Collaboration",
    body: "Interactive learning, collaboration environments, audiovisual systems and effective technology adoption.",
    solution: "software-ai-digital" },
  { slug: "power-broadcast-satellite", title: "Power, Broadcast and Satellite",
    body: "Critical power, generator and UPS fundamentals, broadcast workflows and satellite-enabled services.",
    solution: "power-technology" },
];

export const ACADEMY_LEVELS = [
  "Awareness", "Foundation", "Intermediate", "Advanced", "Administrator", "User Enablement",
];

export const ACADEMY_DELIVERY = ["In person", "Live online", "Hybrid"];

export const COURSE_SECTIONS = [
  { title: "Overview", body: "What the program covers and why it is relevant." },
  { title: "Learning outcomes", body: "What participants should understand or be able to do after completion." },
  { title: "Audience and prerequisites", body: "Who should attend and the knowledge or access required before joining." },
  { title: "Agenda", body: "Modules, sessions, duration and practical activities, with a downloadable outline." },
  { title: "Instructor", body: "Approved instructor name and biography where publication is authorized." },
  { title: "Delivery", body: "Mode, venue or platform, dates, time zone, language and accessibility information." },
  { title: "Recognition", body: "Attendance or completion recognition only as approved. Vendor-authorized certification is identified only when formally confirmed." },
  { title: "Registration", body: "Availability, deadline, fee status where approved, and the registration action." },
];
