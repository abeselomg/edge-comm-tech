# Edge Comm-Tech: SEO plan

Status: proposal for owner approval. Written 26 October 2026. Audience: the owner and the marketing person who will run this. Developer tasks are marked as such.

Scope: English-language site, target market Ethiopia (banks, universities, ministries, public bodies, enterprises). Amharic ranking is out of scope. No production domain exists yet, so everything below is prepared work that goes live when the domain does.

Ground rules for this document:

- Every title, description and post idea below is built from copy that already exists in the content seed (`src/seed/page-copy.ts`, `design-src/highland/content.mjs`, `detail.mjs`, `editorial.mjs`, `people.mjs`). Nothing is invented: no numbers, awards, client names or mottos beyond the ones the site already shows.
- Industry acronyms (ICT, SIEM, EDR, HCI, ZTNA, UPS) stay, because buyers search with them.
- Tier wording stays as the content master has it: "Tier-aligned" only. Never "Tier III certified" unless independent certification has been achieved.

## 1. Goals and audience

### 1.1 What SEO has to achieve

| Goal | Plain meaning | How we know |
|---|---|---|
| Be findable by name | Anyone typing "Edge Comm-Tech" or "Edge Communication Technologies" finds the site first, plus the Google and LinkedIn profiles | Brand queries show position 1 in Search Console |
| Be found by people who do not know us yet | A bank IT director typing "datacenter solutions Ethiopia" sees us on page one | Non-brand impressions and average position in Search Console |
| Support tenders and due diligence | A procurement officer who has our name from a tender can confirm we are real: projects, clients, partners, contact | Visits to /projects, /clients, /partners, /contact from organic |
| Bring inquiries | Organic visits become consultation and quotation requests | Form submissions with an organic source |

### 1.2 Who searches

| Audience | Typical role | What they type | Intent stage |
|---|---|---|---|
| Procurement officer, tender committee | Writes or evaluates a bid | "supply and installation of ICT equipment Addis Ababa", "UPS supplier Ethiopia", "bill of quantities ICT" | Buying (they often already have a vendor shortlist) |
| IT director, head of ICT | Owns a modernisation budget | "hyperconverged infrastructure Ethiopia", "backup and disaster recovery for banks", "SIEM Ethiopia" | Evaluating |
| Ministry or agency ICT lead | Delivers a government program | "datacenter Addis Ababa", "network installation ministry", "ICT training Addis Ababa" | Evaluating and buying |
| Bank CTO / head of IT infrastructure | Resilience and security | "core banking infrastructure Ethiopia", "generator for bank branches", "Zero Trust" | Researching, then shortlisting |
| University ICT or academic leader | Smart campus, AI | "smart classroom Ethiopia", "campus CCTV", "AI for universities" | Researching |
| Jobseeker, graduate | Hiring funnel | "ICT jobs Addis Ababa", "graduate internship Ethiopia" | Jobseeking |
| Vendor or partner | Looking for a local integrator | "<vendor> partner Ethiopia" | Partnering |

Intent stages used in the keyword map: Informational (learning), Research/proof (checking we are credible), Commercial (comparing suppliers), Transactional (ready to contact), Navigational/brand (looking for us by name), Jobseeker.

### 1.3 Brand versus non-brand

- Brand queries ("Edge Comm-Tech", "edgecomm-tech") will rank on their own once the domain is indexed. They are measured but not the goal.
- Non-brand commercial queries are the goal. Pattern: `<solution> Ethiopia`, `<service> Addis Ababa`, `<vendor> + <city or country>`, and tender terms such as "supply and installation", "bill of quantities", "specification", "commissioning".
- Realistic expectation: many institutional buyers in Ethiopia are reached through tenders, referrals and relationships, not search. SEO's job here is to be the credible page they open after hearing the name, and to catch the part of the market that does search. Treat it as a steady, low-volume channel, not a volume channel.

### 1.4 What we know about the market (light research)

| Fact | Source |
|---|---|
| About 29.5 million people used the internet in Ethiopia at the end of 2025, about 21.7% of the population. The audience online is a minority and mostly mobile. | [DataReportal, Digital 2026: Ethiopia](https://datareportal.com/reports/digital-2026-ethiopia) |
| Google is by far the dominant search engine in Ethiopia; Bing is a small second (Statcounter shows Bing near 10% of desktop search host share in 2025). So Google Search Console is the priority, Bing Webmaster Tools second. | [Statcounter, search engine share in Ethiopia](https://gs.statcounter.com/search-engine-market-share/desktop-mobile/ethiopia) (I could only read search-result snippets of these pages, not the full tables; re-check the live page before quoting a figure) |
| Government and donor-funded ICT purchases are published as tenders on the national e-GP portal and on UNGM and World Bank notices; titles use words such as "supply and installation", "core IP network", "ICT infrastructure security". Our service pages should use the same vocabulary. | Examples seen: [UNGM notice, ICT infrastructure for a UNHCR office in Addis Ababa](https://www.ungm.org/Public/Notice/135348), [Ministry procurement notice, Core IP Network](https://dfp.gov.et/sites/default/files/images/tender/Specific%20Procurement%20Notice%20-%20Core%20IP%20Network.pdf), [bidsfactory listing of an Ethiopia e-GP ICT infrastructure security tender](https://bidsfactory.com/en/tenders/g-ethiopia_egp-fcfa412a-67cd-403a-90e0-0fe23f1facc4) |

Limits of this research: it was a light desk review. I did not interview buyers and could not see how Ethiopian procurement officers actually phrase searches. Section 2.2 says how to find out from real data instead.

## 2. Keyword map

### 2.1 How to read this

All entries are PROPOSALS for the owner to approve. Titles and descriptions are written only from existing copy; the right-hand column quotes the passage each one was built from. If the owner changes the underlying copy, the title and description must be re-derived from the new wording.

- Title rule: at most 60 characters, pattern `<Primary keyword> | Edge Comm-Tech`. Justified variants: the home page and About lead with the brand (people search the name there); project pages lead with the work and drop the client name where it would push past 60 characters; the key client name is still in the H1 and the first paragraph. Google sets no fixed title length and shortens titles to fit the screen, so 60 is a practical safe limit, not a rule ([Google: title links](https://developers.google.com/search/docs/appearance/title-link)).
- Description rule: at most 155 characters, unique per page. Google says meta descriptions do not affect ranking but shape the snippet, and it may rewrite them ([Google: snippets](https://developers.google.com/search/docs/appearance/snippet)). They matter for click-through, not position.
- Character counts are shown in brackets and were machine-checked.
- Wording note: the proposals say "Ethiopia" or "Addis Ababa" because that is the buyer's search pattern and the site's own positioning (home eyebrow "Addis Ababa · Serving Ethiopia and beyond").
- Client names in titles: where a project title names the client the copy already publishes it. Check that each client consents to being named in search results, not only on the page (see section 6.5).

### 2.2 Search volume: what we do and do not know

Search volumes for Ethiopian B2B terms are small. I could not obtain exact monthly numbers: the usual tools (Google Keyword Planner without an active ad spend, Semrush, Ahrefs) are paid or gated, and free sources report Ethiopia-specific volumes for these phrases as too low or too noisy to trust. Do not quote volume numbers to the owner or in any report until they come from a real tool.

How to validate instead (free, and more reliable than estimates):

1. After launch, open Search Console, Performance, and read Queries and Pages. Impressions are the demand we can actually reach.
2. Filter queries by country = Ethiopia and by page. Group them by solution.
3. Promote what shows impressions but position > 10 (page two): improve that page first.
4. Demote the keywords with zero impressions after 90 days; swap in the variants Search Console actually shows.
5. Optional: a one-month Google Ads Keyword Planner check with a small budget, or Google Trends (free, relative interest) for "datacenter Ethiopia" versus "data center Ethiopia" spelling variants. Both are directional, not exact.

Spelling and wording to test in the data: "datacenter" versus "data center"; "cyber security" versus "cybersecurity"; "ICT" versus "IT"; "Addis Ababa" versus "Addis". The site uses "datacenter" and "cybersecurity" throughout, so keep that, and mention the other spelling once naturally on the page only if Search Console shows searches for it.

### 2.3 Keyword map: targets and intent


#### Core pages

| # | Page (URL) | Primary keyword | Secondary keywords | Intent |
|---|---|---|---|---|
| 1 | Home (`/`) | ICT solutions provider Ethiopia | systems integrator Addis Ababa; technology solutions for banks Ethiopia; Edge Comm-Tech (brand) | Commercial + brand |
| 2 | About (`/about`) | systems integration partner Ethiopia | Edge Communication Technologies PLC; technology company Addis Ababa | Informational / brand |
| 3 | Executive management (`/about/executive-management`) | Edge Comm-Tech leadership | Edge Comm-Tech CEO; Edge Comm-Tech management team | Brand navigational (low value) |

#### Solutions

| # | Page (URL) | Primary keyword | Secondary keywords | Intent |
|---|---|---|---|---|
| 4 | Solutions overview (`/solutions`) | technology solutions Ethiopia | enterprise technology solutions; integrated ICT solutions Ethiopia; systems integration Ethiopia | Commercial |
| 5 | Software, AI & Digital (`/solutions/software-ai-digital`) | enterprise AI solutions Ethiopia | private RAG; AI knowledge assistant; ERP implementation Ethiopia; local-language AI | Commercial |
| 6 | Enterprise Network (`/solutions/enterprise-network`) | enterprise network solutions Ethiopia | campus LAN WLAN; software-defined networking; structured cabling Addis Ababa; unified communications | Commercial |
| 7 | System & Cloud (`/solutions/system-cloud`) | servers and storage solutions Ethiopia | hyperconverged infrastructure HCI; backup and disaster recovery; private cloud Ethiopia | Commercial |
| 8 | Datacenter & Infrastructure (`/solutions/datacenter-facility-it-infrastructure`) | datacenter solutions Ethiopia | Tier-aligned datacenter; datacenter cooling and DCIM; CCTV and access control | Commercial |
| 9 | Cybersecurity (`/solutions/cybersecurity`) | cybersecurity solutions Ethiopia | SIEM and SOAR; endpoint security EDR; Zero Trust ZTNA NAC; IAM and PAM | Commercial |
| 10 | Power Technology (`/solutions/power-technology`) | UPS and generator supplier Ethiopia | backup power for banks; solar and hybrid power; EV charging Ethiopia | Commercial |
| 11 | Broadcast & Satellite (`/solutions/broadcast-satellite`) | broadcast and satellite solutions Ethiopia | FM AM transmission; satellite broadband connectivity; video over IP; LED display Ethiopia | Commercial |

#### Professional services

| # | Page (URL) | Primary keyword | Secondary keywords | Intent |
|---|---|---|---|---|
| 12 | Services overview (`/services`) | IT professional services Ethiopia | technology consulting Addis Ababa; IT implementation and support | Commercial |
| 13 | Advisory, Assessment & Design (`/services/advisory-assessment-design`) | IT consulting Addis Ababa | technology assessment; solution design; bill of quantities and tender support | Commercial / tender |
| 14 | Procurement & Supply (`/services/procurement-supply`) | IT equipment supplier Ethiopia | technology procurement; OEM sourcing; licensing and warranty | Commercial / tender |
| 15 | Implementation & Integration (`/services/implementation-integration`) | IT systems integration Ethiopia | installation and commissioning; migration and interoperability; handover documentation | Commercial |
| 16 | Project Management & Deployment (`/services/project-management-deployment`) | IT project management Ethiopia | multi-site technology deployment; technology PMO | Commercial |
| 17 | Managed Support & Maintenance (`/services/managed-support-maintenance`) | IT managed services Ethiopia | IT maintenance and support Addis Ababa; service desk; preventive maintenance | Commercial |
| 18 | Training & Knowledge Transfer (`/services/training-knowledge-transfer`) | IT training Addis Ababa | technology training Ethiopia; administrator training; knowledge transfer | Commercial |

#### Proof: projects, clients, partners

| # | Page (URL) | Primary keyword | Secondary keywords | Intent |
|---|---|---|---|---|
| 19 | Projects index (`/projects`) | technology projects case studies Ethiopia | bank technology projects Ethiopia; university ICT projects Ethiopia | Research / proof |
| 20 | Bahir Dar University Smart Classrooms (`/projects/bahir-dar-university-smart-classrooms`) | smart classroom solution Ethiopia | university smart classrooms; interactive classroom technology | Research / proof |
| 21 | Bahir Dar University CCTV & Security (`/projects/bahir-dar-university-safe-campus`) | campus CCTV security Ethiopia | safe campus infrastructure; university surveillance system | Research / proof |
| 22 | Gadaa Bank Computing Infrastructure (`/projects/gadaa-bank-computing-infrastructure`) | hyperconverged infrastructure bank Ethiopia | bank datacenter modernization; private cloud readiness | Research / proof |
| 23 | National Bank of Ethiopia Backup (`/projects/national-bank-ethiopia-backup-infrastructure`) | backup and recovery infrastructure Ethiopia | bank backup solution; critical data protection | Research / proof |
| 24 | Ministry of Urban and Infrastructure Computing (`/projects/ministry-urban-infrastructure-computing`) | government computing infrastructure Ethiopia | ministry IT infrastructure; application delivery controller | Research / proof |
| 25 | Siinqee Bank Datacenter Power (`/projects/siinqee-bank-datacenter-power`) | datacenter backup power Ethiopia | bank datacenter UPS generator; Tier III-aligned datacenter | Research / proof |
| 26 | Arba Minch University Smart Meeting Rooms (`/projects/arba-minch-university-smart-meeting-rooms`) | smart meeting room solutions Ethiopia | university research collaboration; video conferencing room | Research / proof |
| 27 | Zemen Bank Generator Solutions (`/projects/zemen-bank-generator-solutions`) | generator solutions bank branches Ethiopia | backup generator installation; branch power continuity | Research / proof |
| 28 | Clients (`/clients`) | ICT supplier for banks and universities Ethiopia | technology partner for ministries; Edge Comm-Tech clients | Research / proof |
| 29 | Partners (`/partners`) | technology vendor partners Ethiopia | HPE solutions Ethiopia; Fortinet Ethiopia; Cummins generators Ethiopia | Research / vendor + city |

#### People: careers and training

| # | Page (URL) | Primary keyword | Secondary keywords | Intent |
|---|---|---|---|---|
| 30 | Careers (`/careers`) | ICT jobs Addis Ababa | engineering careers Ethiopia; technology company careers Addis Ababa | Jobseeker |
| 31 | Open positions (`/careers/open-positions`) | IT jobs Addis Ababa | network engineer vacancy Ethiopia; technology vacancies Addis Ababa | Jobseeker |
| 32 | Job: HR Manager (`/careers/open-positions/hr-manager`) | HR manager job Addis Ababa | human resources manager vacancy Ethiopia | Jobseeker |
| 33 | Job: Chief Technology Officer (`/careers/open-positions/chief-technology-officer`) | chief technology officer job Ethiopia | CTO vacancy Addis Ababa | Jobseeker |
| 34 | Graduate internship (`/careers/internships`) | internship ICT Addis Ababa | graduate technology internship Ethiopia; network engineer internship | Jobseeker |
| 35 | Edge E-Academy (`/careers/e-academy`) | IT training courses Addis Ababa | cybersecurity training Ethiopia; network and cloud training | Commercial (training) |

#### Editorial: resources, blog, news, events

| # | Page (URL) | Primary keyword | Secondary keywords | Intent |
|---|---|---|---|---|
| 36 | Resources (`/resources`) | Edge Comm-Tech resources | technology company profile Ethiopia | Brand / navigational |
| 37 | Blog (`/blog`) | enterprise technology insights Ethiopia | private RAG explained; backup vs disaster recovery | Informational |
| 38 | News index (`/news`) | Edge Comm-Tech news | digital transformation Ethiopia news | Brand / informational |
| 39 | News: company established (`/news/edge-comm-tech-established-2018`) | Edge Communication Technologies PLC | Edge Comm-Tech established 2018 | Brand |
| 40 | News: digital transformation foundations (`/news/ethiopia-digital-transformation-foundations`) | digital transformation Ethiopia | digital foundations Ethiopia; practical AI Ethiopia | Informational |
| 41 | News: transformation meeting (DRAFT) (`/news/digital-transformation-meeting`) | n/a until facts confirmed | none | Do not index yet |
| 42 | Events index (`/events`) | technology events Addis Ababa | AI webinar Ethiopia; Edge Comm-Tech events | Informational |
| 43 | Event: Agentic AI Online (`/events/agentic-ai-online-2026`) | agentic AI Ethiopia | agentic AI webinar; governed AI agents | Informational |
| 44 | Event: Agentic AI for Universities (`/events/agentic-ai-universities-2026`) | AI for universities Ethiopia | university AI knowledge assistant; agentic AI higher education | Informational |
| 45 | Event: GITEX GLOBAL 2026 (`/events/gitex-global-2026`) | GITEX GLOBAL 2026 Ethiopia | Edge Comm-Tech GITEX Dubai | Navigational |
| 46 | Downloads (`/downloads`) | Edge Comm-Tech company profile | technology brochure Ethiopia; solution datasheet | Navigational / tender |

#### Contact

| # | Page (URL) | Primary keyword | Secondary keywords | Intent |
|---|---|---|---|---|
| 47 | Contact (`/contact`) | technology company Addis Ababa | Edge Comm-Tech contact; IT company Bole Addis Ababa | Navigational / transactional |

### 2.4 Keyword map: proposed titles, descriptions and the copy they come from

All proposals, for owner approval.


#### Core pages

| # | Proposed title (chars) | Proposed meta description (chars) | Derived from (existing copy) |
|---|---|---|---|
| 1 | Edge Comm-Tech \| Systems Integrator in Addis Ababa (50) | Secure, scalable technology solutions for financial institutions, government, education and enterprises in Ethiopia, from our Addis Ababa office. (145) | Home hero: "secure, scalable, intelligent, and future-ready technology solutions for financial institutions, government organizations, educational institutions, and enterprises" |
| 2 | About Edge Comm-Tech \| Systems Integrator, Ethiopia (51) | Ethiopia's end-to-end technology solutions and systems-integration partner, established in Addis Ababa in March 2018. (117) | About hero: "Ethiopia's trusted end-to-end technology solutions and systems-integration partner"; COMPANY.established "March 2018" |
| 3 | Executive Management \| Edge Comm-Tech (37) | The leadership team of Edge Comm-Tech: Chief Executive, Strategy, Technology, Operations and Financial Officers. (112) | EXECUTIVE_ROLES (five roles; bios and portraits still pending) |

#### Solutions

| # | Proposed title (chars) | Proposed meta description (chars) | Derived from (existing copy) |
|---|---|---|---|
| 4 | Technology Solutions in Ethiopia \| Edge Comm-Tech (49) | Integrated technology solutions that connect infrastructure, data, applications, security, operations and people, from Edge Comm-Tech in Addis Ababa. (149) | Solutions hero: "integrated technology solutions that connect infrastructure, data, applications, security, operations, and people" |
| 5 | AI and Software Solutions Ethiopia \| Edge Comm-Tech (51) | Enterprise software, automation, analytics, AI knowledge assistants, private RAG and voice automation built around your approved data and human oversight. (154) | SOLUTIONS blurb: "Enterprise software, automation, analytics, AI knowledge assistants, private RAG, voice automation..." |
| 6 | Enterprise Network Solutions Ethiopia \| Edge Comm-Tech (54) | Secure, scalable networks for campuses, branches and datacenters: LAN and WLAN, software-defined networking, unified communications and cabling. (144) | Intro: "secure, scalable, and manageable networks for campuses, branches, datacenters, offices, and distributed operations" |
| 7 | Cloud, Server and Storage Solutions \| Edge Comm-Tech (52) | Enterprise compute, storage, HCI, virtualization, backup, disaster recovery, databases and hybrid cloud for business applications and AI workloads. (147) | SOLUTIONS blurb: "Enterprise compute, storage, engineered systems, virtualization, HCI, backup, disaster recovery, databases..." |
| 8 | Datacenter Solutions Ethiopia \| Edge Comm-Tech (46) | Tier-aligned datacenter facilities and integrated IT infrastructure that keep critical systems available, protected, monitored and ready for growth. (148) | Intro: "Tier-aligned datacenter facilities and integrated IT infrastructure that keep critical systems available, protected, monitored, maintainable, and ready for growth" |
| 9 | Cybersecurity Solutions Ethiopia \| Edge Comm-Tech (49) | Integrated security across cloud, network, application, endpoint and identity, with SIEM, SOAR, EDR, IAM, PAM and Zero Trust access. (132) | SOLUTIONS blurb: "...SIEM; SOAR; WAF; EDR; IAM; PAM; and DLP"; intro on "integrated controls" |
| 10 | UPS and Generator Solutions Ethiopia \| Edge Comm-Tech (53) | Power technologies that protect critical facilities from interruption: UPS, generators, automatic transfer, solar and hybrid power and EV charging. (147) | Intro: "power technologies that protect critical facilities, digital infrastructure... against interruption, instability, and capacity constraints" |
| 11 | Broadcast and Satellite Solutions \| Edge Comm-Tech (50) | FM and AM, studio systems, television transmission, LED displays, satellite broadcasting, video over IP and broadband satellite connectivity. (141) | SOLUTIONS blurb: "FM and AM, studio systems, television transmission, LED displays, satellite broadcasting, video over IP..." |

#### Professional services

| # | Proposed title (chars) | Proposed meta description (chars) | Derived from (existing copy) |
|---|---|---|---|
| 12 | IT Professional Services Ethiopia \| Edge Comm-Tech (50) | Services across the whole technology lifecycle: advisory, procurement, implementation, project management, managed support and training. (136) | Services hero: "Edge Comm-Tech provides services across that entire lifecycle" |
| 13 | IT Consulting in Addis Ababa \| Edge Comm-Tech (45) | Current-state assessment, requirements, architecture, specifications, bills of quantities, roadmaps, budgets, risk planning and tender support. (143) | SERVICES blurb: "Current-state assessment, requirements analysis, architecture, specifications, bills of quantities, roadmaps..." |
| 14 | IT Equipment Procurement Ethiopia \| Edge Comm-Tech (50) | Technology procurement from approved requirements through sourcing, logistics, delivery, documentation and warranty registration. (129) | Intro: "from approved requirements through commercial sourcing, logistics, delivery, documentation, and warranty registration" |
| 15 | IT Systems Integration Ethiopia \| Edge Comm-Tech (48) | Site readiness, installation, configuration, migration, testing, commissioning, acceptance, documentation and handover for technology systems. (142) | SERVICES blurb: "Site readiness, installation, configuration, migration, interoperability, testing, commissioning, acceptance..." |
| 16 | IT Project Management Ethiopia \| Edge Comm-Tech (47) | Governance and delivery coordination for multi-site technology programs: schedules, dependencies, quality, risk, reporting and formal closure. (142) | Intro: "project governance and delivery coordination for technology programs involving multiple sites, disciplines, vendors" |
| 17 | IT Managed Services Ethiopia \| Edge Comm-Tech (45) | Monitoring, service desk, preventive and corrective maintenance, incident response, vendor escalation and health checks for installed technology. (145) | SERVICES blurb: "Monitoring, service desk, preventive and corrective maintenance, incident response, vendor escalation, health checks..." |
| 18 | IT Training in Addis Ababa \| Edge Comm-Tech (43) | Administrator and user training, operational runbooks, workshops, handover and coaching, built around your roles and your actual environment. (141) | SERVICES blurb: "Administrator and user training, operational runbooks, workshops, handover, coaching..."; intro: "designed around roles, actual environments" |

#### Proof: projects, clients, partners

| # | Proposed title (chars) | Proposed meta description (chars) | Derived from (existing copy) |
|---|---|---|---|
| 19 | Technology Projects and Case Studies \| Edge Comm-Tech (53) | More than 67 projects delivered for banks, universities, ministries and major enterprises, and how our solutions work in practice. (130) | Projects hero: "executed and delivered more than 67 projects for banks, universities, ministries and major enterprises" |
| 20 | Smart Classrooms, Bahir Dar University \| Edge Comm-Tech (55) | A university-wide smart-classroom transformation replacing blackboard-centered teaching with interactive digital infrastructure across campuses. (144) | Project summary: "A university-wide smart-classroom transformation across Bahir Dar University campuses..." |
| 21 | Campus CCTV and Security, Bahir Dar \| Edge Comm-Tech (52) | Integrated surveillance, campus monitoring, a security control room and radio-communication infrastructure across Bahir Dar University campuses. (144) | Project summary: "Integrated surveillance, campus monitoring, security control-room and radio-communication infrastructure..." |
| 22 | Hyperconverged Infrastructure for a Bank \| Edge Comm-Tech (57) | A move from traditional server-and-storage infrastructure to a hyperconverged platform supporting core banking, ERP and enterprise applications. (144) | Project summary: "A move from traditional server-and-storage infrastructure to an integrated hyperconverged platform..." |
| 23 | Backup and Recovery for a Central Bank \| Edge Comm-Tech (55) | Backup and recovery infrastructure giving a more reliable, manageable platform for protecting critical institutional information. (129) | Project summary: "Backup and recovery infrastructure providing a more reliable and manageable platform..." |
| 24 | Ministry Computing Infrastructure Project \| Edge Comm-Tech (58) | A modern computing platform supporting the applications and data services behind essential social safety-net programs. (118) | Project summary: "A modern computing platform supporting the applications and data services behind essential social safety-net programs" |
| 25 | Datacenter Power for a Bank in Ethiopia \| Edge Comm-Tech (56) | Coordinated backup-power infrastructure for a critical datacenter facility, supporting an availability-focused, Tier III-aligned datacenter. (140) | Project summary: "Coordinated backup-power infrastructure for a critical datacenter facility... Tier III-aligned datacenter" |
| 26 | Smart Meeting Rooms, Arba Minch University \| Edge Comm-Tech (59) | Smart meeting-room environments for researchers, scientists, coaches and invited experts at the university's Secha Campus. (122) | Project summary: "Smart meeting-room environments designed for researchers, scientists, coaches and invited experts..." |
| 27 | Generator Solutions for Bank Branches \| Edge Comm-Tech (54) | Generator solutions delivered to bank branches across Ethiopia, each designed around branch operating needs and the risk of grid interruption. (142) | Project summary: "Generator solutions delivered to bank branches across Ethiopia..." |
| 28 | Technology Clients: Banks and Universities \| Edge Comm-Tech (59) | Banks, universities, ministries and public institutions choose Edge Comm-Tech because their systems have to work. (113) | Clients hero: "Banks, universities, ministries and public institutions choose Edge Comm-Tech because their systems have to work" |
| 29 | Global Technology Partners in Ethiopia \| Edge Comm-Tech (55) | Edge Comm-Tech works with more than 40 global vendors, OEMs and distributors, and stays accountable for the delivered outcome. (126) | Partners hero: "more than 40 global vendors, original equipment manufacturers and distributors... Edge Comm-Tech accountable for the delivered outcome" |

#### People: careers and training

| # | Proposed title (chars) | Proposed meta description (chars) | Derived from (existing copy) |
|---|---|---|---|
| 30 | ICT Careers in Addis Ababa \| Edge Comm-Tech (43) | Our engineers work on the systems Ethiopian banks, universities and ministries depend on. See open roles, internships and E-Academy. (132) | Careers hero: "Edge Comm-Tech engineers work on the systems Ethiopian banks, universities and ministries depend on" |
| 31 | IT Job Vacancies in Addis Ababa \| Edge Comm-Tech (48) | Every vacancy lists responsibilities, required and preferred qualifications, and how performance in the role is judged. (119) | Open-positions hero: "Every vacancy lists its responsibilities, required and preferred qualifications..." |
| 32 | HR Manager Vacancy in Addis Ababa \| Edge Comm-Tech (50) | Lead recruitment, onboarding and performance management at Edge Comm-Tech headquarters in Addis Ababa. Full time, reporting to the Chief Strategy Officer. (154) | JOBS hr-manager: purpose, location, "Full time", reports "Chief Strategy Officer" |
| 33 | CTO Vacancy in Addis Ababa \| Edge Comm-Tech (43) | Lead technology strategy, engineering quality and innovation across Edge Comm-Tech's portfolio. Full time, Addis Ababa headquarters. (132) | JOBS chief-technology-officer: purposeTitle "Lead technology strategy, engineering quality and innovation" |
| 34 | Graduate Technology Internship, Addis Ababa \| Edge Comm-Tech (60) | Supervised exposure to real professional environments for selected learners and early-career candidates, in periodic intakes. (125) | INTERNSHIP.intro: "supervised exposure to real professional environments" |
| 35 | IT Training Courses in Addis Ababa \| Edge Comm-Tech (51) | Training from the engineers who build and support systems for banks, universities and ministries, in six tracks mapped to what we deliver. (138) | E-Academy hero: "The engineers who build and support these systems for banks, universities and ministries are the ones who teach them" |

#### Editorial: resources, blog, news, events

| # | Proposed title (chars) | Proposed meta description (chars) | Derived from (existing copy) |
|---|---|---|---|
| 36 | Resource Centre: News, Events, Downloads \| Edge Comm-Tech (57) | Company announcements, technology events and webinars, media material and the documents clients and tender committees ask for most. (131) | Resources hero intro (verbatim sense) |
| 37 | Technology Insights from Edge Comm-Tech \| Edge Comm-Tech (56) | Practical articles on private RAG, hyperconverged infrastructure, backup and disaster recovery, Zero Trust, datacenters and reliable power. (139) | POSTS titles (ten launch articles) |
| 38 | News and Announcements \| Edge Comm-Tech (39) | Company milestones, strategic updates, partnerships, project announcements and perspectives on Ethiopia's digital transformation. (129) | RESOURCE_SECTIONS news body |
| 39 | Edge Comm-Tech Established in 2018 \| Edge Comm-Tech (51) | Edge Communication Technologies PLC was established in 2018 to help Ethiopian organizations design, implement, integrate and sustain technology. (144) | NEWS standfirst: "established in 2018 with a clear purpose..." |
| 40 | Digital Foundations for Ethiopia \| Edge Comm-Tech (49) | Digital transformation is the coordinated improvement of services, processes, skills, data, connectivity, computing, security, power and capability. (148) | NEWS standfirst: "coordinated improvement of services, processes, skills, data..." |
| 41 | Digital Transformation Meeting \| Edge Comm-Tech (47) | Edge Comm-Tech joined public- and private-sector stakeholders to discuss priorities and approaches for Ethiopia's digital transformation. (137) | NEWS standfirst; six fields still pending (name, date, venue...) |
| 42 | Technology Events and Webinars \| Edge Comm-Tech (47) | Upcoming and past exhibitions, conferences, online sessions, workshops, training programs and university-focused events. (120) | RESOURCE_SECTIONS events body |
| 43 | Agentic AI Online Event \| Edge Comm-Tech (40) | From AI answers to governed AI action: how Agentic AI can support multi-step work with human oversight, security and accountability. (132) | EVENTS headline + intro |
| 44 | Agentic AI for Universities Event \| Edge Comm-Tech (50) | Trusted AI for learning, research, knowledge and university services: an in-person event in Addis Ababa for institutional leaders and ICT teams. (144) | EVENTS headline; venue "Ethiopian Skylight Hotel, Addis Ababa" |
| 45 | Edge Comm-Tech at GITEX GLOBAL 2026 \| Edge Comm-Tech (52) | Meet Edge Comm-Tech at GITEX GLOBAL 2026, Dubai, 7 to 11 December, to discuss AI, cloud, cybersecurity, infrastructure and partnerships. (136) | EVENTS intro (role still to be confirmed; word as "meet" only once confirmed) |
| 46 | Company Profile and Brochures \| Edge Comm-Tech (46) | Current company profiles, brochures, datasheets, solution catalogues and technical guides from Edge Comm-Tech. (110) | RESOURCE_SECTIONS downloads body |

#### Contact

| # | Proposed title (chars) | Proposed meta description (chars) | Derived from (existing copy) |
|---|---|---|---|
| 47 | Contact Edge Comm-Tech in Addis Ababa \| Edge Comm-Tech (54) | Request a consultation or quotation from our office at BMA Plaza, Bole, Addis Ababa. We respond within one business day. (120) | CONTACT.office "BMA Plaza, 9th Floor, Gerji Imperial, Bole Sub-City"; response "Within one business day" |

Notes on specific rows:

- Executive management: the page shows five roles and no biographies yet. Keep it `noindex` until real bios and portraits exist (thin pages hurt more than they help).
- News: transformation meeting is a DRAFT in the content master with six facts still pending (name, organiser, date, venue, attendees, URL). Do not publish or index it until those are confirmed.
- Events: GITEX participation role is still "to be confirmed". Do not describe Edge as exhibitor or speaker until it is.
- The two job pages are the only pages that should get `JobPosting` structured data (section 4). Remove the page once the role closes, or mark it expired.
- The blog has ten launch articles but, per the content master, no article pages: "Read more" goes to the matching solution page. That is sound (no thin duplicates), but it means a blog post cannot rank on its own URL. See section 3.5.
- Pages not in the map: `/subscribe` (utility, `noindex`), `/forms/<slug>` (form pages, `noindex`), `/resources/media/<slug>` (no items seeded yet; use the same title pattern and give each its own description when items exist), `/preview` and `/admin` (never indexed).
- Query ownership rule: one primary keyword belongs to one page. The home page targets the broad company term; solution pages own `<solution> Ethiopia`; the blog supports them with questions and links down to them. Two pages competing for the same keyword splits their strength.

## 3. On-page rules

### 3.1 Headings

| Rule | Detail |
|---|---|
| One H1 per page | The H1 is the page's hero title (for example "Technology that works together" on /solutions). It is rendered once by the template, not typed into body copy. |
| Hierarchy | H1, then H2 for each section, then H3 inside a section. Never skip a level for styling. Style with CSS, not heading level. |
| Keyword in the H1 or first paragraph | Not necessarily both, and not forced. The hero eyebrow (for example "Solutions and services") and the first paragraph already name the topic. Where the proposed primary keyword is missing from the first 100 words, add it in plain wording (see 3.2). |
| Natural language | Write for the procurement officer. One mention of the primary keyword in the first paragraph, then use plain synonyms. |

Note for the developer: several heroes use brand-voice headlines that do not contain the keyword ("Trusted where reliability is not negotiable"). Keep them. Put the keyword in the eyebrow or first paragraph, and in the title tag and description, not in the headline.

### 3.2 Page copy

- First paragraph says what the page is and who it is for, in the page's own words. Example for the cybersecurity page: it already says "Edge Comm-Tech helps organizations reduce cyber risk through integrated controls spanning cloud environments, networks, applications, endpoints, digital identities...". Add "in Ethiopia" only where it reads naturally.
- Name specific products and capabilities (SIEM, EDR, UPS, HCI). Buyers search for those words.
- No keyword stuffing: never repeat a phrase to hit a count. If a sentence reads oddly aloud, rewrite it.
- Contract values, certification tiers and partnership levels are never published (content master rule). Do not "optimise" around them.
- Do not use claims the content master has not approved. The four approved counters (8+ years, 67+ projects, 40+ partnerships, 100% completion against agreed project scope) must keep their qualifier wherever they appear.

### 3.3 Links

| Rule | Good | Bad |
|---|---|---|
| Descriptive link text | "Cybersecurity solutions", "Gadaa Bank computing infrastructure" | "Click here", "Read more", "Learn more" alone |
| Context | The sentence around the link says where it goes | A bare button with no surrounding words |
| Same destination, same text | Link to /solutions/cybersecurity as "cybersecurity solutions" everywhere | Five different phrasings for one page |
| Buttons | A button's visible label should name the destination: "Explore completed projects", "Request a quotation" | "Submit" |

Note: the existing blog "Read more about ..." labels are already descriptive, which is good; keep that pattern.

### 3.4 Images and alt text (for CMS editors)

The Media collection has an `alt` field, and project images use the image's own description as alt text, so the CMS text becomes the alt text. Editors should:

1. Describe what is in the picture, in one plain sentence: "Interactive display and teacher in a Bahir Dar University smart classroom". Do not start with "image of".
2. Include the client or setting only when it is true and visible. Never put keywords in alt text that are not in the picture.
3. Leave alt empty only for pure decoration (backgrounds, ornaments). A logo gets the company name: "Bahir Dar University logo".
4. Name files plainly before upload: `bahir-dar-smart-classroom.jpg`, not `IMG_2043.jpg`.
5. Size: upload at the intended display size (project hero 1600 x 1000 pixels maximum, as the admin hint says), keep each photo under about 250 KB after compression, prefer WebP or AVIF if the tool offers it. Big files hurt Largest Contentful Paint on mobile (section 4).
6. Only use approved images. Do not upload client photographs without written permission.

### 3.5 Internal linking plan

Rule of thumb: every page links to its parent, its siblings that matter, and the page it should lead to. Most of this exists already; the table says what to verify and what to add.

| From | To | Why | Status |
|---|---|---|---|
| Solution page | Projects delivered in that solution | Proof for the page's keyword | Exists ("delivered" projects block); verify each of the 7 shows at least one |
| Solution page | Partners that supply it | Vendor + city terms | Exists via partner links; verify the link text is descriptive |
| Solution page | Related blog posts | Support the keyword | Exists (`posts` loaded on the solution page); verify anchors resolve |
| Solution page | The professional service that delivers it (for example datacenter to Implementation) | Commercial path | Add 1 to 2 contextual links |
| Project page | The solution pages it used, and the client page | Ties proof to the keyword | Exists via `solutions`; verify |
| Project page | The partner vendors used | Vendor + city terms | Exists via `tech`; verify links are live |
| Client page entries | The project and the solution | Proof trail | Exists via `engagements` and `solutions` |
| Partner card | The Edge solution page (never the vendor's own site first) | Content master rule | Exists via `solution` |
| Blog post (new) | The matching solution page (anchor id), one project when relevant, the contact page | Pass authority to money pages | Required in the post template (3.7) |
| Blog / news / events | Each other when related | Keep readers on site | Add "Related" block |
| Home page | All 7 solutions, /projects, /clients, /contact | Authority to money pages | Exists; confirm every solution is reachable in one click |
| Footer | Solutions, services, projects, contact, careers, privacy | Sitewide | Exists; add privacy pages in Phase 8 |
| Breadcrumbs | Home > Solutions > Cybersecurity | Context for users and Google | Developer: add visible breadcrumbs and `BreadcrumbList` JSON-LD (section 4) |

No page should be more than three clicks from the home page. Orphan pages (pages nothing links to) should not exist; check in the crawl (runbook step 11).

### 3.6 URL naming rules

| Rule | Example |
|---|---|
| Lowercase, hyphens, no spaces or underscores | `/solutions/enterprise-network` |
| Short and readable; the existing slugs follow this | `/projects/gadaa-bank-computing-infrastructure` |
| Never change a published slug. If unavoidable, add a 301 redirect from old to new in the same change | `/news/old-slug` to `/news/new-slug` |
| No dates or IDs in URLs | not `/blog/2026/10/post-1` |
| No query strings on indexable pages | filters and preview use query strings and stay non-indexed |
| One canonical form: https, one hostname (decide www or not), no trailing-slash variants | see section 4 |
| New blog posts: keyword in the slug, 3 to 6 words | `/blog/backup-versus-disaster-recovery` |

### 3.7 Writing a post that targets a keyword

Repeatable checklist (marketing person, 60 to 90 minutes per post):

1. Pick one primary keyword from the map (or from Search Console queries with impressions and no click). One post, one keyword, one solution.
2. Write down who is asking and what they want to decide. The post answers that question in the first paragraph.
3. Write 500 to 900 words in plain English. Use only facts the site already states, or facts the owner confirms in writing. No invented numbers, quotes or client names.
4. Structure: H1 (the post title, contains the keyword in plain wording), short intro, 3 to 5 H2 sections, a closing section on what Edge Comm-Tech does, a clear next step.
5. Add links: one to the matching solution page with descriptive text, one to a relevant project (if a client agrees), one to /contact, one to a related post. Use the anchor ids the solution pages already emit.
6. Title tag: `<Keyword> | Edge Comm-Tech`, 60 characters or fewer. Description: 155 or fewer, written to be clicked, no stuffing.
7. Add one real image with alt text (3.4). No stock photos of handshakes.
8. Read it aloud once. Cut anything that is filler.
9. Preview in the CMS, have the owner approve, then publish. Record the date.
10. After publishing: request indexing in Search Console URL Inspection; share on LinkedIn; add the link from the solution page's "related" block.
11. Review at 30 and 90 days: impressions, clicks, average position. Refresh if it sits on page two.

Template:

```
Title tag:       <Primary keyword in plain words> | Edge Comm-Tech        (<= 60)
Meta description: <One sentence answer + who it is for>                 (<= 155)
Slug:            /blog/<3-6 keyword words>
Primary keyword: <one phrase>          Solution page: /solutions/<slug>

H1: <Post title>
Intro (2-3 sentences): the question, who is asking, the short answer.
H2: What it is (plain definition)
H2: Why it matters for <banks | universities | ministries>
H2: What to decide / what to check
H2: How Edge Comm-Tech approaches it   <- links to the solution page
Next step: link to /contact (consultation or quotation)
Related: 1-2 posts or projects
Image: one real image, alt text written
Sources: only the site's own pages or an approved reference
```

Developer note: there is no `/blog/[slug]` route in the app today (only `/blog`), and the content master deliberately avoids thin article pages for the ten launch posts. Longer, keyword-targeted posts (500+ words) are different from those, and they need their own pages. Either add a `/blog/[slug]` route and collection fields (owner decision), or publish long pieces as "Insight" items under `/news/<slug>` (the news template already supports `kind: "Insight"`, as the Digital Foundations for Ethiopia article does). Decide this before the first post.

### 3.8 Cadence and ten post ideas

Cadence: two posts a month, for the first six months. One that supports a solution page (explainer), one built from a project or service (proof or how-to). A consistent 2 a month for six months beats a burst of 10 and silence. If capacity is short, one good post a month is fine; skip a month rather than publish filler.

The ten launch articles already cover private RAG, agentic AI for universities, HCI and private cloud, backup versus DR, Tier-aligned datacenters, Zero Trust, smart classrooms and AI education, reliable power, local-language AI and the safe campus. The ideas below are new angles grounded in the projects and services, so they do not repeat those:

| # | Working title | Primary keyword | Grounded in | Links to |
|---|---|---|---|---|
| 1 | Moving a bank from servers and storage to hyperconverged infrastructure | hyperconverged infrastructure bank Ethiopia | Gadaa Bank project summary (core banking, ERP, private-cloud readiness) | /solutions/system-cloud, the Gadaa project |
| 2 | What a recoverable backup platform needs: lessons from a central bank project | backup and recovery infrastructure Ethiopia | National Bank of Ethiopia project summary | /solutions/system-cloud, NBE project |
| 3 | Planning generators for many bank branches: what to specify | generator for bank branches Ethiopia | Zemen Bank project ("designed around branch operating needs") | /solutions/power-technology, Zemen project |
| 4 | Before you buy interactive displays: a smart-classroom checklist for universities | smart classroom solution Ethiopia | Bahir Dar and Arba Minch projects; post on smart classrooms | /solutions/software-ai-digital, both projects |
| 5 | How to write an ICT specification and bill of quantities for a tender | ICT tender specification Ethiopia | Advisory service copy ("specifications, bills of quantities, tender support") | /services/advisory-assessment-design |
| 6 | Comparing technology bids: licensing, warranty and delivery, not only price | technology procurement Ethiopia | Procurement service copy ("commercial comparison, licensing, warranty registration") | /services/procurement-supply |
| 7 | Handover that works: documentation, acceptance and training | IT handover and training Ethiopia | Implementation and Training service copy; the Enable stage | /services/implementation-integration, /services/training-knowledge-transfer |
| 8 | UPS, generator and solar: one coordinated power path for a datacenter | datacenter backup power Ethiopia | Siinqee Bank project; existing power post | /solutions/power-technology, Siinqee project |
| 9 | What a SIEM does, and what you need to run one | SIEM Ethiopia | Cybersecurity solution copy (SIEM, SOAR, monitoring, incident response); managed support service | /solutions/cybersecurity, /services/managed-support-maintenance |
| 10 | Campus networks: LAN, WLAN and structured cabling planning for a university | campus network design Ethiopia | Enterprise Network copy; Bahir Dar safe-campus project | /solutions/enterprise-network, safe-campus project |

Rules for all ten: no statistics unless the owner supplies a source; client projects are mentioned only as the project page already states them; the closing section always says what Edge Comm-Tech does, quoting the existing solution copy.

## 4. Technical checklist: status

"Parallel" means the development team is building it now (per the owner's brief); I have not seen that work, so confirm it when it lands. "Exists" was verified in the code at the `features-batch` branch.

| Item | Status | Detail and owner |
|---|---|---|
| Page language | Exists | `<html lang="en">` in the frontend layout |
| Title and description per page | Partly exists, parallel | Dynamic routes (solution, service, project, news, event, job) already set `title` and `description`; the global template is `"%s — Edge Comm-Tech"` with an em dash. The proposed pattern uses a pipe. Developer: align the template once the owner approves section 2. |
| Open Graph / social cards | Parallel | Each page needs `og:title`, `og:description`, `og:image` (1200 x 630). Need a default brand image. |
| Canonical URLs | Parallel | Self-referencing canonical on every indexable page, absolute, https, chosen hostname. |
| `robots.txt` | Parallel | Production: allow all, disallow `/admin`, `/preview`, `/forms/`, `/api/`, and list the sitemap URL. Review server: `Disallow: /`. |
| `sitemap.xml` | Parallel | Lists only indexable pages with absolute URLs and real `lastmod`. Excludes drafts, `noindex` pages, forms. |
| Structured data (JSON-LD) | Parallel | See table below. Must match visible content. |
| `noindex` on the review server | Parallel | Both the `X-Robots-Tag: noindex` header and `<meta name="robots">`, driven by `SITE_INDEXABLE`. Never rely on robots.txt alone to hide a page. |
| Production domain | Remaining (owner) | The content master names `edgecomm-tech.com`. Confirm it is registered to Edge, then decide www or non-www. |
| `SITE_URL` and `SITE_INDEXABLE` environment variables | Remaining (developer) | On production: `SITE_URL=https://<final host>`, `SITE_INDEXABLE=true`. Everywhere else: indexable false. Check the variable names against what the parallel work adopts. |
| HTTPS certificate | Remaining (developer) | Valid certificate, auto-renew, HSTS after a week of stability. |
| www and non-www redirect | Remaining (developer) | One 301 to the chosen host, plus http to https. One hop only. |
| Redirect map | Remaining (developer) | If any old URL exists (the previous site), 301 each to its new page. Not known; ask the owner whether an older Edge site is live. |
| 404 page | Check | Friendly page with links, returns a real 404 status (not 200). |
| Performance budget | Remaining (developer) | Targets: LCP 2.5 s or less, INP 200 ms or less, CLS 0.1 or less, at the 75th percentile on mobile ([web.dev, Core Web Vitals](https://web.dev/articles/vitals)). Budget: key page under about 1 MB transferred on first load, hero image under about 200 KB. |
| Page-load overlay and LCP | Remaining (separate audit) | The site has a page-load gate and a font gate (`FontGate`; fonts use `display: "block"`). Anything that hides content until it finishes can delay Largest Contentful Paint and, if the overlay is the largest element, can be measured as the LCP itself. A separate audit is measuring this; this plan makes no claim about the result. Acceptance: with the overlay, LCP stays within target on a mid-range phone on a 4G connection. |
| Image weights | Remaining (developer + editors) | `public/` is about 680 KB in total, so there is no known problem in static files; uploaded CMS media is the risk. Enforce size limits on upload (section 3.4). |
| Heading structure | Check | One H1 on every page; verify with the crawl in the runbook. |
| Mobile friendliness | Check | Most Ethiopian traffic is mobile (DataReportal). Test every key page at phone width. |
| Accessibility | Exists in part | Skip link present, Atkinson Hyperlegible body font; keep contrast and alt text correct (search engines read the same markup). |
| Privacy pages | Remaining (Phase 8) | Privacy notice and cookie notice; link from the footer. Needed before analytics goes live. |

### Structured data: what to add (developer)

| Type | Where | Properties from existing copy | Rule |
|---|---|---|---|
| `Organization` (or `LocalBusiness` subtype) | Home and About | name "Edge Communication Technologies PLC", alternateName "Edge Comm-Tech", url, logo (`/edge-logo.png`, at least 112 x 112 px), address (BMA Plaza, 9th Floor, Gerji Imperial, Bole Sub-City, Addis Ababa), telephone, email, `sameAs` (LinkedIn page, once it exists) | Google asks for the same name as the site name and recommends the most specific subtype ([Google: Organization](https://developers.google.com/search/docs/appearance/structured-data/organization)) |
| `WebSite` | Home | name, url | Helps the site name in results |
| `BreadcrumbList` | All inner pages | Real breadcrumbs shown on page | Must match the visible breadcrumb |
| `JobPosting` | The two job pages | title, description, hiring organization, jobLocation (Addis Ababa), employmentType Full time, datePosted, `validThrough` only when a real deadline exists (currently "To be confirmed", so omit it) | Remove or expire when closed |
| `Event` | The two upcoming events | name, startDate, location (venue), eventAttendanceMode (online or offline), description | Use real dates only; GITEX venue is public, role still pending |
| `Article` | News and blog posts with a real date | headline, datePublished, author = organization | Skip for undated items ("Evergreen", "Date to confirm") |
| `FAQPage` | Do not add | | Google now shows FAQ rich results only for a few authoritative sites; not worth the effort |

Do not mark up anything not visible on the page (no invented ratings, reviews, prices, awards, opening hours that differ from the contact page). Validate with Google's Rich Results Test and URL Inspection after launch.

## 5. Launch and measurement runbook

Do these in order when the production domain is live and `SITE_INDEXABLE=true` is set. Owner and marketing person together, about half a day plus waiting for DNS.

### 5.1 Before launch (developer, 1 hour)

1. Confirm the production build has `SITE_INDEXABLE=true` and the final `SITE_URL`; confirm staging and the review server still serve `noindex`.
2. Fetch `https://<domain>/robots.txt` and `/sitemap.xml` in a browser. The sitemap must list the pages in section 2 and nothing else. Open five random URLs from it: each returns 200.
3. View source on the home page and one solution page: check `<title>`, description, canonical, OG tags, JSON-LD, a single `<h1>`.
4. Test `http://`, `www.` and non-`www.` forms: each lands on the one canonical https URL with a single redirect.

### 5.2 Verify the site (marketing person, 30 minutes plus DNS wait)

5. Create a Google account for the company (shared mailbox, not a personal address) and open [Search Console](https://search.google.com/search-console).
6. Add a Domain property for `edgecomm-tech.com`. Choose "Domain name provider", pick TXT, copy the string. In the DNS settings of the domain registrar add a TXT record, host `@` (or blank), value the string. Click Verify. DNS can take up to two or three days; keep the record in place afterward or verification is lost ([Google: verify with DNS](https://support.google.com/webmasters/answer/9008080)). A Domain property covers http, https and all subdomains, which is why DNS is the right choice.
7. Add owners: the owner and one backup person, by email, with their consent.
8. Open [Bing Webmaster Tools](https://www.bing.com/webmasters), sign in, and either import the site from Search Console (fastest) or verify by DNS. Bing is about a tenth of search in Ethiopia, but the work takes ten minutes.

### 5.3 Submit and inspect

9. Search Console, Sitemaps, submit `sitemap.xml`. A sitemap helps discovery and does not guarantee indexing ([Google: sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)). Do the same in Bing.
10. URL Inspection: paste the home page, the 7 solution pages, /contact and one project page. Each should say "URL is on Google" or, if new, click "Request indexing". Limit requests to the key 10 to 15 pages; the sitemap covers the rest.
11. Run a crawl with a free tool (Screaming Frog free tier covers 500 URLs) and fix: missing or duplicate titles, missing H1, 404s, redirect chains, orphan pages.
12. Rich Results Test on the home page, a job page and an event page; fix any errors.

### 5.4 After one week, one month

13. Search Console, Indexing, Pages: expect most pages in the sitemap to be "Indexed". For each "Discovered, currently not indexed" or "Crawled, currently not indexed" page: improve content and internal links, then re-request. Expected "Not indexed" reasons that are fine: noindex pages (forms, subscribe, draft), redirected duplicates.
14. Core Web Vitals report (needs enough real-user data; for a low-traffic site it can stay empty for weeks, so also run PageSpeed Insights on the 5 key pages monthly).
15. Check Performance for the first impressions; set a baseline sheet (section 5.6).

### 5.5 Analytics: recommendation

| Option | Pros | Cons | Fit |
|---|---|---|---|
| Plausible, Umami (self-hosted) or Cloudflare Web Analytics | No cookies, no personal data, no consent banner needed in most regimes, light script (little effect on performance), simple dashboards; self-hosted Umami keeps data in Edge's control | Fewer features; no cross-device user journeys; Plausible is paid (or self-hosted); Cloudflare's needs the domain on Cloudflare | Best fit |
| Google Analytics 4 | Free, deep reporting, native link to Search Console and Google Ads | Cookies and personal-data processing need a consent notice; data goes to Google's servers outside Ethiopia; heavier script; reporting is more complicated than this site needs | Only if the team wants Ads or advanced funnels later |

Recommendation: start with a privacy-respecting, cookieless tool (Umami self-hosted, or Plausible, or Cloudflare Web Analytics if the domain is already on Cloudflare). Reasons: institutional buyers (banks, ministries) are sensitive about trackers and data leaving the country; no cookies means no banner on a site whose own message is data protection; it is faster; and Search Console already supplies the SEO data. Track these events: form submitted (consultation, quotation, general), click on phone number, click on WhatsApp link, click on email link, download of the company profile.

Privacy: whichever tool is used, say so in the privacy notice (Phase 8). Ethiopia has been developing personal-data-protection law; I did not verify the current legal text, so have counsel confirm whether a cookieless tool needs any notice or registration and what applies if forms store personal data. Do not install GA4 or any advertising pixel before the privacy and cookie pages are live.

### 5.6 Weekly and monthly routine (marketing person)

Weekly (20 minutes):

- Search Console, Performance, last 7 days: new queries, any page with impressions but 0 clicks, any sudden drop.
- Indexing, Pages: new "not indexed" reasons.
- Check the contact form notifications reached the sales inbox (sales@edgecomm-tech.com) and note the source.

Monthly (60 minutes), record in a sheet:

| KPI | Where | Target direction |
|---|---|---|
| Indexed pages vs pages in the sitemap | Search Console, Pages | Match (all indexable pages indexed) |
| Impressions, non-brand | Performance, exclude queries containing the brand | Up month on month |
| Clicks, non-brand | Same | Up |
| Average position for each of the 47 map rows' primary keywords | Performance, filter by page | Moving toward the top 10; page-one is a 6-to-12-month goal |
| Brand query clicks | Performance | Stable high (brand is found) |
| Core Web Vitals status | Search Console + PageSpeed Insights | Good on mobile for key pages |
| Form submissions from organic | Analytics, event "form submitted", source organic | Up; even 1 to 3 per month is meaningful for this market |
| Referring domains | Search Console, Links | Slow steady growth |
| Posts published vs plan | Content calendar | 2 per month |

Monthly actions: refresh the 2 pages closest to page one; publish 2 posts; fix issues from the Pages report; add one new internal link to each new post.

## 6. Off-site

### 6.1 Name, address, phone (NAP): one source of truth

Use exactly this text in every profile and directory. It is taken from the site's contact data (`CONTACT` in `content.mjs`). Pick the single phone number the company wants public and always write it the same way.

| Field | Value to use everywhere |
|---|---|
| Legal name | Edge Communication Technologies PLC |
| Brand name | Edge Comm-Tech |
| Address | BMA Plaza, 9th Floor, Gerji Imperial, Bole Sub-City, Addis Ababa, Ethiopia |
| Main phone (also WhatsApp) | +251 95 569 5565 |
| Additional phone | +251 911 538 809 |
| Sales email | sales@edgecomm-tech.com |
| Support email | support@edgecomm-tech.com |
| Careers email | hr@edgecomm-tech.com |
| Hours | Monday to Friday 8:00 AM to 5:30 PM; Saturday 8:00 AM to 12:00 PM; Sunday closed |
| Website | https://<final domain> |
| Founded | March 2018 |

Decision for the owner: which of the two phone numbers is the primary public number. Write it the same way on the site, Google, LinkedIn and every directory; the site now shows both, which is fine, but listings need one primary.

### 6.2 Google Business Profile

1. Search Google Maps for "Edge Comm-Tech Addis Ababa". If a profile exists, claim it; if not, create one at business.google.com.
2. Category: choose the closest from Google's list (for example "Information technology consultant" or "Computer network provider"; pick the one Google shows for IT services, and up to a few secondary categories). Check what competitors in Addis Ababa use.
3. Fill in the NAP table exactly, add the hours, add the website, add real photos of the office and team (approved), and write a description from the site's About copy.
4. Verify. Google offers phone, text, email, video call or postcard, depending on the business, and review takes up to five business days; postcards can take up to 14 days and codes expire after 30 days ([Google: verify your business](https://support.google.com/business/answer/7107242)). Postal delivery in Addis Ababa may be unreliable, so choose phone or video if offered; if only postcard is offered, ask the office to watch for it and expect delay. If the website is already verified in Search Console, verification can be instant for some profiles.
5. After verification: add the services, post an update monthly (a news item or event), and answer any review politely and truthfully. Do not ask staff or friends for fake reviews.

### 6.3 Bing Places, LinkedIn, social

- Bing Places for Business: import from the Google profile once verified. Same NAP.
- LinkedIn company page "Edge Comm-Tech": same description, website, address and founding date (March 2018); link to the website; post news and events; encourage staff to list Edge Comm-Tech as employer with the same spelling. LinkedIn is where Ethiopian B2B buyers and recruiters check a vendor.
- Same name spelling everywhere: "Edge Comm-Tech" (never "Edge COMM-TECH").

### 6.4 Vendor and partner directories

Edge works with more than 40 vendors. Some publish a "find a partner" locator that lists integrators by country; being listed there is a high-quality link and a lead source. What I verified by browsing:

| Vendor | Public locator | What I found |
|---|---|---|
| Fortinet | Yes, verified | [partnerportal.fortinet.com/directory](https://partnerportal.fortinet.com/directory/) is a public directory searchable by country, partner type and program level; it showed partners in Ethiopia |
| Nutanix | Yes, verified | [nutanix.com/partners/find-a-partner](https://www.nutanix.com/partners/find-a-partner) filters by country, partner level and expertise |
| HPE, HPE Aruba, Microsoft, Veeam, Sophos, Oracle, Vertiv, Cummins and others | Not verified | My attempts to open their locators returned errors (404, 403, timeout, or a JavaScript-only page), so I cannot say whether Edge is listed. Check whether each has a public partner locator and whether Edge appears. |

Do-not and caution: the content master forbids publishing partnership type, authorization level or certification tier on Edge's own site. A vendor's own directory may display those; that is the vendor's page, but the owner should decide before Edge asks to be listed, and should not repeat the tier on Edge's pages.

Action for the marketing person: for each of the 40-plus vendors, ask the vendor's channel manager "is there a public partner locator, and how do we update our listing?" Make sure the company name, address, phone and website match the NAP table. Track in a sheet: vendor, locator URL, listed (yes/no), correct (yes/no), date checked.

### 6.5 Directories, chambers, press and client links

| Source | Notes |
|---|---|
| Ethiopian business directories and chambers (check whether: Addis Ababa Chamber of Commerce and Sectoral Associations; Ethiopian ICT industry associations; ICT Park / Ministry of Innovation and Technology supplier listings) | Not verified. Ask the owner which memberships Edge already holds and use them. Only list in directories that are real, active and free of paid-link schemes. |
| Tender and supplier registrations (national e-GP portal, UNGM, World Bank vendor lists) | Registering is a procurement step, not SEO, but these profiles can link to the website and strengthen trust. |
| Client case-study links | With each client's written permission, ask them to link to the matching project page from their own site or news page ("Technology partner: Edge Comm-Tech"). Do not name or link to a client without consent. The content master already limits what may be published (no contract values). |
| University and event partners | The Agentic AI for Universities event on 23 October 2026 has organisers, venues and attendees who may link to the event page. |
| Press | Press releases and approved coverage belong under `/resources`. Send each release to Ethiopian technology and business media with a link to the page. |
| Vendor co-marketing | Vendors sometimes publish partner case studies. Offer an approved project (with client consent). |

Quality over quantity: ten relevant links from real institutions are worth more than hundreds of directory entries.

## 7. Risks and do-nots

| Do not | Why | What to do instead |
|---|---|---|
| Keyword stuffing | Reads badly; Google treats repeated phrases as spammy ([Google: title links](https://developers.google.com/search/docs/appearance/title-link)) | Say it once clearly, then use plain words |
| Hidden text, tiny text, white-on-white keywords | Violates Google's spam policies; risk of removal from results | Put real content where people can read it |
| Buying links, link exchanges, "SEO packages" selling backlinks | Spam policy violation; manual action risk | Earn links from clients, vendors, events, press |
| Copying vendor text onto our pages | Duplicate content; no value | Write our own, from Edge's own delivery experience |
| Duplicate content between English and a future Amharic site | Search engines may pick the wrong version | When Amharic pages are added later, give each language its own URL and add `hreflang` links between versions; do not machine-translate and paste. Out of scope now. |
| Indexing staging, the review server, `/preview`, `/admin`, form pages, `?preview` URLs | Duplicate and confidential content; draft pages leaking | `noindex` + `robots.txt` Disallow; verify `X-Robots-Tag`; keep review and staging behind `SITE_INDEXABLE=false` |
| Structured data that does not match the page | Google can apply a manual action and ignore all markup on the site | Mark up only what is visible and true; no review or rating markup without real reviews |
| Claiming certification, awards, "Tier III certified", partnership tiers | Not in the approved content; legal and trust risk | Use "Tier-aligned"; publish only approved facts |
| Publishing the 100% completion counter without its qualifier | The content master requires "against agreed project scope" | Keep the qualifier next to the figure |
| Naming clients in titles without consent | Relationship and legal risk | Get written permission for each named client |
| Auto-generated thin pages or doorway pages for every keyword and city | Search engines devalue them | One strong page per topic |
| Changing URLs after launch without redirects | Loses rankings | 301 old to new, same day |
| Installing analytics or ad pixels before privacy pages | Compliance risk | Phase 8 first |
| Promising rankings or page-one results | Nobody can guarantee them | Report impressions, clicks and position honestly |

## 8. Roadmap: 30 / 60 / 90 days

"Day 0" is the day the production domain is live. Items before launch are marked Pre-launch.

| When | Task | Owner | Effort |
|---|---|---|---|
| Pre-launch | Approve (or edit) the keyword map titles and descriptions in section 2 | Owner | 1 to 2 hours |
| Pre-launch | Confirm production domain, www or not, who owns the registrar account | Owner | 30 min |
| Pre-launch | Apply approved titles and descriptions in the CMS/page metadata; change the title template to the pipe pattern | Developer | 0.5 to 1 day |
| Pre-launch | Finish canonical, OG, robots, sitemap, JSON-LD, noindex on review (parallel work); set `SITE_URL` and `SITE_INDEXABLE` for production | Developer | Parallel; 0.5 day to verify |
| Pre-launch | HTTPS certificate, www/non-www and http redirects | Developer | 0.5 day |
| Pre-launch | Decide blog route (`/blog/[slug]` or posts under `/news`) | Owner + developer | 1 hour decision, 1 to 2 days to build |
| Pre-launch | Privacy and cookie notice live (Phase 8); choose analytics tool | Developer + owner | Per Phase 8 |
| Day 0 to 7 | Verify Search Console (DNS TXT) and Bing; submit sitemaps; URL Inspection on 10 to 15 key pages | Marketing | 2 hours plus DNS wait |
| Day 0 to 7 | Install analytics and events (form, phone, WhatsApp, download) | Developer | 0.5 day |
| Day 0 to 7 | Crawl the live site, fix title, H1, 404 and redirect issues | Developer | 0.5 day |
| Day 0 to 14 | Claim and verify Google Business Profile; create Bing Places; finish LinkedIn page; apply the NAP table | Marketing | 3 to 4 hours plus verification wait |
| Day 0 to 30 | Measure Core Web Vitals and the page-load overlay effect on LCP; fix the biggest image and script costs | Developer | 1 to 2 days |
| Day 30 | First monthly review: indexed pages, first non-brand queries, position baseline | Marketing | 1 hour |
| Day 30 to 60 | Publish posts 1 and 2 (HCI for a bank; backup for a central bank), clients consenting | Marketing + owner approval | 2 x 1.5 hours |
| Day 30 to 60 | Ask the vendors for locator listings (Fortinet and Nutanix first, then the rest) | Marketing | 2 to 3 hours |
| Day 30 to 60 | Ask 3 clients (with permission) for a link to their project page | Owner | 1 hour |
| Day 30 to 60 | Add breadcrumbs and `BreadcrumbList`; add `JobPosting` and `Event` schema | Developer | 1 day |
| Day 60 | Second review. Rewrite titles and descriptions for pages that have impressions but few clicks | Marketing | 2 hours |
| Day 60 to 90 | Posts 3 to 6 (two a month); add internal links from solution pages to each post | Marketing | 6 hours total |
| Day 60 to 90 | Executive management bios and portraits (so the page can be indexed) | Owner | As available |
| Day 60 to 90 | Check Ethiopian directories and chambers; list in those Edge already belongs to | Marketing | 3 hours |
| Day 90 | Quarter review: which keywords have impressions, which pages are on page two, which map keywords to replace; plan next quarter | Owner + marketing | 2 hours |

## 9. Things not verified

- Search volumes for any keyword (no paid tool access); section 2.2 says how to validate.
- Current Statcounter figures for Ethiopian mobile search share (only desktop snippets were visible).
- Whether HPE, Aruba, Microsoft, Veeam, Sophos, Oracle, Vertiv, Cummins and the other partners have a public locator listing Edge (only Fortinet and Nutanix pages were reachable and confirmed as public locators).
- The behaviour of the metadata, sitemap, robots, JSON-LD and noindex work being built in parallel; I reviewed only the code on `features-batch`.
- The actual effect of the page-load overlay on LCP (separate audit).
- Ethiopia's current data-protection legal requirements for analytics and forms.
- Whether an older Edge website exists that needs redirects; whether `edgecomm-tech.com` is registered and where the DNS is managed.
- Ethiopian directories and chambers to join (named as "check whether").
- The Bing Webmaster Guidelines page could not be read through the fetch tool; the Bing steps come from general product knowledge and should be checked in the Bing console on the day.

## 10. Sources used

- Google Search Central: [title links](https://developers.google.com/search/docs/appearance/title-link), [snippets and meta descriptions](https://developers.google.com/search/docs/appearance/snippet), [Organization structured data](https://developers.google.com/search/docs/appearance/structured-data/organization), [sitemaps overview](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)
- Google Search Console Help: [verify with a DNS TXT record](https://support.google.com/webmasters/answer/9008080)
- Google Business Profile Help: [verify your business](https://support.google.com/business/answer/7107242)
- web.dev: [Core Web Vitals](https://web.dev/articles/vitals)
- [DataReportal, Digital 2026: Ethiopia](https://datareportal.com/reports/digital-2026-ethiopia); [Statcounter, search engine market share, Ethiopia](https://gs.statcounter.com/search-engine-market-share/desktop-mobile/ethiopia)
- Procurement vocabulary examples: [UNGM notice](https://www.ungm.org/Public/Notice/135348), [Core IP Network notice](https://dfp.gov.et/sites/default/files/images/tender/Specific%20Procurement%20Notice%20-%20Core%20IP%20Network.pdf), [bidsfactory e-GP listing](https://bidsfactory.com/en/tenders/g-ethiopia_egp-fcfa412a-67cd-403a-90e0-0fe23f1facc4)
- Vendor locators: [Fortinet partner directory](https://partnerportal.fortinet.com/directory/), [Nutanix find a partner](https://www.nutanix.com/partners/find-a-partner)
