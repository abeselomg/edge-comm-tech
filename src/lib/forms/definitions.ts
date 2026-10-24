/*
 * The six public forms as data.
 *
 * Labels, options, required flags, hints and consent wording are ported
 * verbatim from the Highland page modules (design-src/highland/pages/
 * contact, subscribe, event, careers-e-academy, job, careers-internships).
 * Those field lists are private constants inside the page modules, so they
 * are written out here once; definitions.test.ts re-reads Highland and fails
 * if the two ever disagree. The seed turns these into `forms` documents and
 * the server validates a submission against the stored document, so nothing
 * else needs to know the field list.
 *
 * Deliberate difference from Highland: the contact form's "Inquiry type"
 * drops the Careers category. The master requires applications to use the
 * official Careers process, so that category routes there instead of here.
 *
 * The selects keep Highland's leading placeholder option ("Select ...")
 * because the parity rule is verbatim; none is an empty string.
 */

export type FormKey =
  | "contact"
  | "subscribe"
  | "event-registration"
  | "academy-enquiry"
  | "job-application"
  | "internship-application";

export type FormFieldType =
  | "text"
  | "email"
  | "tel"
  | "url"
  | "textarea"
  | "select"
  | "checkbox"
  | "upload";

export type FormFieldDef = {
  name: string;
  label: string;
  type: FormFieldType;
  required?: boolean;
  hint?: string;
  options?: string[];
  wide?: boolean;
  maxLength?: number;
  group?: string;
};

export type FormDefinition = {
  title: string;
  confirmationMessage: string;
  consent: string;
  fields: FormFieldDef[];
};

const SECTORS = ["Select a sector", "Banking and finance", "Education", "Government and public", "Enterprise", "Other"];

const SHORT = 200;
const LONG = 4000;

export const FORM_DEFINITIONS: Record<FormKey, FormDefinition> = {
  contact: {
    title: "Contact",
    confirmationMessage:
      "Thank you. Your message has reached Edge Comm-Tech and the team will reply within one business day.",
    consent:
      "I accept the privacy notice and consent to Edge Comm-Tech using these details to respond to my inquiry.",
    fields: [
      { name: "fullName", label: "Full name", type: "text", required: true, maxLength: SHORT },
      { name: "organization", label: "Organization", type: "text", required: true, maxLength: SHORT },
      { name: "jobTitle", label: "Job title", type: "text", maxLength: SHORT },
      { name: "email", label: "Email address", type: "email", required: true, maxLength: SHORT },
      {
        name: "phone",
        label: "Phone or WhatsApp",
        type: "tel",
        required: true,
        hint: "Include country code",
        maxLength: 50,
      },
      { name: "sector", label: "Sector", type: "select", options: SECTORS },
      {
        name: "inquiryType",
        label: "Inquiry type",
        type: "select",
        required: true,
        options: [
          "Select",
          "Request a Consultation",
          "Request a Quotation",
          "Technical Support",
          "Partnership Inquiry",
          "Training and E-Academy",
          "General Inquiry",
        ],
      },
      {
        name: "solutionArea",
        label: "Solution area",
        type: "select",
        options: [
          "Select if relevant",
          "Software, AI & Digital",
          "Enterprise Network",
          "System & Cloud",
          "Datacenter & Infrastructure",
          "Cybersecurity",
          "Power Technology",
          "Broadcast & Satellite",
          "Not sure yet",
        ],
      },
      {
        name: "message",
        label: "How can we help?",
        type: "textarea",
        required: true,
        wide: true,
        hint: "The more specific, the more useful our first reply will be",
        maxLength: LONG,
      },
    ],
  },

  subscribe: {
    title: "Subscribe",
    confirmationMessage:
      "Thank you. You are on the list for the updates you selected, and you can unsubscribe at any time.",
    consent:
      "I consent to Edge Comm-Tech using these details to send the updates I have selected. I understand I can unsubscribe at any time using the link in any message, or by emailing the team.",
    fields: [
      { name: "fullName", label: "Full name", type: "text", required: true, maxLength: SHORT },
      { name: "email", label: "Email address", type: "email", required: true, maxLength: SHORT },
      { name: "organization", label: "Organization", type: "text", required: true, maxLength: SHORT },
      { name: "jobTitle", label: "Job title", type: "text", maxLength: SHORT },
      { name: "sector", label: "Sector", type: "select", options: SECTORS },
      { name: "country", label: "Country", type: "select", options: ["Ethiopia", "Other"] },
      ...[
        ["topicSoftwareAi", "Software, AI & Digital"],
        ["topicNetwork", "Enterprise Network"],
        ["topicSystemCloud", "System & Cloud"],
        ["topicDatacenter", "Datacenter & Infrastructure"],
        ["topicCybersecurity", "Cybersecurity"],
        ["topicPower", "Power Technology"],
        ["topicBroadcast", "Broadcast & Satellite"],
      ].map(
        ([name, label]): FormFieldDef => ({
          name,
          label,
          type: "checkbox",
          group: "Topics of interest",
        }),
      ),
      {
        name: "sendInsights",
        label: "Insights",
        type: "checkbox",
        hint: "New articles as they are published.",
        group: "What to send",
      },
      {
        name: "sendEvents",
        label: "Events",
        type: "checkbox",
        hint: "Invitations to webinars and briefings.",
        group: "What to send",
      },
      {
        name: "sendCompanyNews",
        label: "Company news",
        type: "checkbox",
        hint: "Milestones and announcements.",
        group: "What to send",
      },
    ],
  },

  "event-registration": {
    title: "Event registration",
    confirmationMessage:
      "Thank you. We have received your registration and will send an acknowledgement. Any confirmed seat, joining link or meeting time is sent separately after review.",
    consent: "I accept the event communication and privacy notice.",
    fields: [
      { name: "fullName", label: "Full name", type: "text", required: true, maxLength: SHORT },
      { name: "jobTitle", label: "Job title", type: "text", required: true, maxLength: SHORT },
      { name: "organization", label: "Organization", type: "text", required: true, maxLength: SHORT },
      {
        name: "sector",
        label: "Sector",
        type: "select",
        required: true,
        options: ["Select a sector", "Banking and finance", "Education", "Government", "Enterprise", "Other"],
      },
      { name: "email", label: "Email address", type: "email", required: true, maxLength: SHORT },
      {
        name: "whatsapp",
        label: "WhatsApp number",
        type: "tel",
        required: true,
        hint: "Include country code",
        maxLength: 50,
      },
      { name: "preferredUpdates", label: "Preferred updates", type: "select", options: ["Email", "WhatsApp", "Both"] },
      {
        name: "attendanceMode",
        label: "Attendance mode",
        type: "select",
        options: ["Online", "In person", "Meeting request"],
      },
      { name: "objective", label: "Question or objective", type: "textarea", wide: true, maxLength: LONG },
    ],
  },

  "academy-enquiry": {
    title: "E-Academy enquiry",
    confirmationMessage:
      "Thank you. Your training enquiry has reached Edge E-Academy and we will come back with a proposed track, level and format.",
    consent: "I accept the privacy notice and consent to being contacted about this training enquiry.",
    fields: [
      { name: "fullName", label: "Full name", type: "text", required: true, maxLength: SHORT },
      { name: "email", label: "Email address", type: "email", required: true, maxLength: SHORT },
      { name: "mobile", label: "Mobile number", type: "tel", required: true, maxLength: 50 },
      { name: "organization", label: "Organization", type: "text", maxLength: SHORT },
      {
        name: "enquiringAs",
        label: "I am enquiring as",
        type: "select",
        required: true,
        options: ["Select", "Individual learners", "Client organizations", "Other organizations", "Edge Comm-Tech teams"],
      },
      {
        name: "track",
        label: "Track of interest",
        type: "select",
        required: true,
        options: [
          "Select a track",
          "AI, Software and Digital Skills",
          "Enterprise Network and Cybersecurity",
          "System, Cloud and Data Resilience",
          "Datacenter Facility and IT Infrastructure",
          "Smart Education and Collaboration",
          "Power, Broadcast and Satellite",
        ],
      },
      {
        name: "level",
        label: "Level",
        type: "select",
        options: ["Select", "Awareness", "Foundation", "Intermediate", "Advanced", "Administrator", "User Enablement"],
      },
      {
        name: "delivery",
        label: "Preferred delivery",
        type: "select",
        options: ["Select", "In person", "Live online", "Hybrid"],
      },
      {
        name: "participants",
        label: "Estimated participants",
        type: "select",
        options: ["Select", "Just me", "2–5", "6–15", "16–40", "More than 40"],
      },
      { name: "timing", label: "Preferred timing", type: "text", maxLength: SHORT },
      { name: "objectives", label: "Objectives for the training", type: "textarea", wide: true, maxLength: LONG },
    ],
  },

  "job-application": {
    title: "Job application",
    confirmationMessage:
      "Thank you. We have received your application and will acknowledge it by email.",
    consent:
      "I confirm the information provided is accurate and accept the privacy notice and consent to recruitment processing.",
    fields: [
      { name: "fullName", label: "Full legal name", type: "text", required: true, maxLength: SHORT },
      { name: "email", label: "Email address", type: "email", required: true, maxLength: SHORT },
      { name: "mobile", label: "Mobile number", type: "tel", required: true, maxLength: 50 },
      { name: "residence", label: "City and country of residence", type: "text", required: true, maxLength: SHORT },
      { name: "currentPosition", label: "Current or most recent position", type: "text", required: true, maxLength: SHORT },
      {
        name: "experience",
        label: "Years of relevant experience",
        type: "select",
        options: ["Select", "0–2", "3–5", "6–10", "More than 10"],
      },
      {
        name: "education",
        label: "Highest education",
        type: "select",
        options: ["Select", "Diploma", "Bachelor's degree", "Postgraduate"],
      },
      { name: "fieldOfStudy", label: "Field of study", type: "text", required: true, maxLength: SHORT },
      { name: "institution", label: "University or institution", type: "text", required: true, maxLength: SHORT },
      { name: "profileUrl", label: "LinkedIn or portfolio URL", type: "url", maxLength: 500 },
      { name: "cv", label: "CV upload", type: "upload", required: true, wide: true, hint: "PDF or DOCX" },
    ],
  },

  "internship-application": {
    title: "Internship application",
    confirmationMessage:
      "Thank you. We have received your application and will acknowledge it by email with a reference number.",
    consent:
      "I confirm the information provided is accurate, I have read the note above, and I accept the privacy notice and consent to recruitment processing.",
    fields: [
      { name: "fullName", label: "Full legal name", type: "text", required: true, maxLength: SHORT },
      { name: "email", label: "Email address", type: "email", required: true, maxLength: SHORT },
      { name: "mobile", label: "Mobile number", type: "tel", required: true, maxLength: 50 },
      { name: "residence", label: "City and country of residence", type: "text", required: true, maxLength: SHORT },
      {
        name: "track",
        label: "Preferred track",
        type: "select",
        required: true,
        options: ["Select a track", "Network Engineer", "System Engineer"],
      },
      { name: "institution", label: "University or institution", type: "text", required: true, maxLength: SHORT },
      { name: "fieldOfStudy", label: "Field of study", type: "text", required: true, maxLength: SHORT },
      {
        name: "currentStatus",
        label: "Current status",
        type: "select",
        options: ["Select", "Final-year student", "Recent graduate", "Technical and vocational graduate", "Other"],
      },
      { name: "graduationYear", label: "Expected or actual graduation year", type: "text", maxLength: 20 },
      { name: "cv", label: "CV upload", type: "upload", required: true, hint: "PDF or DOCX" },
      { name: "whyTrack", label: "Why this track", type: "textarea", wide: true, hint: "A short paragraph is enough", maxLength: LONG },
    ],
  },
};
