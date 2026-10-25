import { describe, expect, it } from "vitest";

import type { Form } from "@/payload-types";
import { toBlock } from "../../seed/forms";
import { FORM_DEFINITIONS, type FormKey } from "./definitions";
import { MAX_UPLOAD_BYTES, validateSubmission } from "./validate";

/*
 * Server-side validation, against the form document as the seed stores it
 * (plugin blocks only) joined to FORM_DEFINITIONS by field name.
 */

const formDoc = (key: FormKey): Form => ({
  id: 1,
  title: FORM_DEFINITIONS[key].title,
  fields: FORM_DEFINITIONS[key].fields.map(toBlock) as Form["fields"],
  emails: [],
  updatedAt: "",
  createdAt: "",
});

const contact = formDoc("contact");
const validContact = {
  fullName: "Abebe Kebede",
  organization: "Example Bank",
  email: "abebe@example.test",
  phone: "+251 11 123 4567",
  inquiryType: "Request a Quotation",
  message: "We would like a quotation for a network refresh.",
  consent: "on",
};

const pdf = (size = 1024, name = "cv.pdf") =>
  new File([Buffer.concat([Buffer.from("%PDF-1.7\n"), Buffer.alloc(Math.max(0, size - 9), 0x20)])], name, {
    type: "application/pdf",
  });
const docx = (name = "cv.docx") =>
  new File([Buffer.concat([Buffer.from([0x50, 0x4b, 0x03, 0x04]), Buffer.alloc(200, 0x20)])], name, {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });

const job = formDoc("job-application");
const validJob = {
  fullName: "Abebe Kebede",
  email: "abebe@example.test",
  mobile: "+251911234567",
  residence: "Addis Ababa, Ethiopia",
  currentPosition: "Network engineer",
  fieldOfStudy: "Electrical engineering",
  institution: "Addis Ababa University",
  job: "senior-network-engineer",
  consent: "on",
};

describe("validateSubmission", () => {
  it("accepts a valid contact submission and returns labelled entries and consent", async () => {
    const r = await validateSubmission(contact, validContact, {});
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.data.key).toBe("contact");
    expect(r.data.entries).toContainEqual({ field: "fullName", label: "Full name", value: "Abebe Kebede" });
    expect(r.data.consent).toEqual({ accepted: true, wording: FORM_DEFINITIONS.contact.consent });
    // A non-required empty field passes and is not stored.
    expect(r.data.entries.find((e) => e.field === "jobTitle")).toBeUndefined();
  });

  it("keys a missing required field by its name", async () => {
    const { fullName: _omit, ...rest } = validContact;
    const r = await validateSubmission(contact, rest, {});
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(Object.keys(r.errors)).toEqual(["fullName"]);
  });

  it("treats a whitespace-only required value as missing", async () => {
    const r = await validateSubmission(contact, { ...validContact, organization: "   " }, {});
    expect(r.ok ? {} : r.errors).toHaveProperty("organization");
  });

  it.each(["abebe", "abebe@", "abebe@example", "a b@example.test", "abebe@example.test\r\nBcc: x@y.test"])(
    "rejects the email %j",
    async (email) => {
      const r = await validateSubmission(contact, { ...validContact, email }, {});
      expect(r.ok ? {} : r.errors).toHaveProperty("email");
    },
  );

  it.each(["javascript:alert(1)", "ftp://example.test", "example.test", "http//x"])("rejects the url %j", async (profileUrl) => {
    const r = await validateSubmission(job, { ...validJob, profileUrl }, { cv: [pdf()] });
    expect(r.ok ? {} : r.errors).toHaveProperty("profileUrl");
  });

  it("accepts an https url", async () => {
    const r = await validateSubmission(job, { ...validJob, profileUrl: "https://www.linkedin.com/in/example" }, { cv: [pdf()] });
    expect(r.ok).toBe(true);
  });

  it.each(["12345", "phone me", "-2519112345", "+251 91 abc 4567"])("rejects the phone %j", async (phone) => {
    const r = await validateSubmission(contact, { ...validContact, phone }, {});
    expect(r.ok ? {} : r.errors).toHaveProperty("phone");
  });

  it("rejects a select value outside the options", async () => {
    const r = await validateSubmission(contact, { ...validContact, inquiryType: "Careers" }, {});
    expect(r.ok ? {} : r.errors).toHaveProperty("inquiryType");
  });

  it("treats the leading placeholder as not chosen on a required select", async () => {
    const r = await validateSubmission(contact, { ...validContact, inquiryType: "Select" }, {});
    expect(r.ok ? {} : r.errors).toHaveProperty("inquiryType");
  });

  it("accepts the placeholder on an optional select as empty", async () => {
    const r = await validateSubmission(contact, { ...validContact, sector: "Select a sector" }, {});
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.entries.find((e) => e.field === "sector")).toBeUndefined();
  });

  it("rejects an unknown field name", async () => {
    const r = await validateSubmission(contact, { ...validContact, isAdmin: "true" }, {});
    expect(r.ok ? {} : r.errors).toHaveProperty("isAdmin");
  });

  it("rejects a file sent under a field that is not an upload", async () => {
    const r = await validateSubmission(contact, validContact, { message: [pdf()] });
    expect(r.ok ? {} : r.errors).toHaveProperty("message");
  });

  it("rejects a repeated value for a single field", async () => {
    const r = await validateSubmission(contact, { ...validContact, fullName: ["a", "b"] }, {});
    expect(r.ok ? {} : r.errors).toHaveProperty("fullName");
  });

  it("rejects text over its definition's maxLength", async () => {
    const r = await validateSubmission(contact, { ...validContact, fullName: "x".repeat(201) }, {});
    expect(r.ok ? {} : r.errors).toHaveProperty("fullName");
    const ok = await validateSubmission(contact, { ...validContact, fullName: "x".repeat(200) }, {});
    expect(ok.ok).toBe(true);
  });

  it("caps a field with no definition at 500, or 5000 for a textarea", async () => {
    const doc: Form = {
      ...contact,
      fields: [
        ...(contact.fields ?? []),
        { blockType: "text", name: "extraText" },
        { blockType: "textarea", name: "extraArea" },
      ],
    };
    const over = await validateSubmission(doc, { ...validContact, extraText: "x".repeat(501), extraArea: "x".repeat(5001) }, {});
    expect(over.ok ? {} : over.errors).toHaveProperty("extraText");
    expect(over.ok ? {} : over.errors).toHaveProperty("extraArea");
    const ok = await validateSubmission(doc, { ...validContact, extraText: "x".repeat(500), extraArea: "x".repeat(5000) }, {});
    expect(ok.ok).toBe(true);
  });

  it("rejects unchecked consent with the form's consent wording in the message", async () => {
    const { consent: _omit, ...rest } = validContact;
    const r = await validateSubmission(contact, rest, {});
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.errors.consent).toContain(FORM_DEFINITIONS.contact.consent);
    const off = await validateSubmission(contact, { ...validContact, consent: "false" }, {});
    expect(off.ok ? {} : off.errors).toHaveProperty("consent");
  });

  it("accepts a JSON boolean for consent and a checked checkbox", async () => {
    const sub = formDoc("subscribe");
    const r = await validateSubmission(
      sub,
      { fullName: "A", email: "a@example.test", organization: "O", topicNetwork: true, consent: true },
      {},
    );
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.entries).toContainEqual({ field: "topicNetwork", label: "Enterprise Network", value: "Yes" });
  });

  it("rejects an unknown form", async () => {
    const r = await validateSubmission({ ...contact, title: "Someone else's form" }, validContact, {});
    expect(r.ok).toBe(false);
  });
});

describe("hidden context fields", () => {
  it("requires and accepts `job` on the job application only", async () => {
    const { job: _omit, ...noJob } = validJob;
    const missing = await validateSubmission(job, noJob, { cv: [pdf()] });
    expect(missing.ok ? {} : missing.errors).toHaveProperty("job");

    const ok = await validateSubmission(job, validJob, { cv: [pdf()] });
    expect(ok.ok).toBe(true);
    if (ok.ok) expect(ok.data.context).toEqual({ job: "senior-network-engineer" });

    const stray = await validateSubmission(contact, { ...validContact, job: "x" }, {});
    expect(stray.ok ? {} : stray.errors).toHaveProperty("job");
  });

  it("rejects a malformed slug", async () => {
    const r = await validateSubmission(job, { ...validJob, job: "../../etc" }, { cv: [pdf()] });
    expect(r.ok ? {} : r.errors).toHaveProperty("job");
  });

  it("requires `event` on the event registration", async () => {
    const ev = formDoc("event-registration");
    const base = {
      fullName: "A",
      jobTitle: "B",
      organization: "C",
      sector: "Education",
      email: "a@example.test",
      whatsapp: "+251911234567",
      consent: "on",
    };
    const missing = await validateSubmission(ev, base, {});
    expect(missing.ok ? {} : missing.errors).toHaveProperty("event");
    const ok = await validateSubmission(ev, { ...base, event: "gitex-2026" }, {});
    expect(ok.ok).toBe(true);
    if (ok.ok) expect(ok.data.context).toEqual({ event: "gitex-2026" });
  });
});

describe("uploads", () => {
  it("rejects a missing required file", async () => {
    const r = await validateSubmission(job, validJob, {});
    expect(r.ok ? {} : r.errors).toHaveProperty("cv");
    // A browser sends an empty, unnamed part when no file is chosen.
    const empty = await validateSubmission(job, validJob, { cv: [new File([], "")] });
    expect(empty.ok ? {} : empty.errors).toHaveProperty("cv");
  });

  it("rejects an .exe renamed .pdf", async () => {
    const exe = new File([Buffer.concat([Buffer.from("MZ"), Buffer.alloc(500)])], "cv.pdf", { type: "application/pdf" });
    const r = await validateSubmission(job, validJob, { cv: [exe] });
    expect(r.ok ? {} : r.errors).toHaveProperty("cv");
  });

  it("rejects a PDF named .docx and a file with another extension", async () => {
    const a = await validateSubmission(job, validJob, { cv: [pdf(1024, "cv.docx")] });
    expect(a.ok ? {} : a.errors).toHaveProperty("cv");
    const b = await validateSubmission(job, validJob, { cv: [pdf(1024, "cv.exe")] });
    expect(b.ok ? {} : b.errors).toHaveProperty("cv");
  });

  it("rejects a file over 5 MB and accepts one at exactly 5 MB", async () => {
    expect(MAX_UPLOAD_BYTES).toBe(5 * 1024 * 1024);
    const over = await validateSubmission(job, validJob, { cv: [pdf(MAX_UPLOAD_BYTES + 1)] });
    expect(over.ok ? {} : over.errors).toHaveProperty("cv");
    const at = await validateSubmission(job, validJob, { cv: [pdf(MAX_UPLOAD_BYTES)] });
    expect(at.ok).toBe(true);
  });

  it("rejects a named 0-byte file", async () => {
    const r = await validateSubmission(job, validJob, { cv: [new File([], "cv.pdf", { type: "application/pdf" })] });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.cv).toMatch(/empty/i);
  });

  it("rejects two files on a single upload field", async () => {
    const r = await validateSubmission(job, validJob, { cv: [pdf(), pdf()] });
    expect(r.ok ? {} : r.errors).toHaveProperty("cv");
  });

  it("accepts a valid PDF, with the type taken from its content", async () => {
    const r = await validateSubmission(job, validJob, { cv: [new File([await pdf().arrayBuffer()], "My CV.pdf", { type: "application/x-anything" })] });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.data.uploads).toHaveLength(1);
    const [file] = r.data.uploads[0].files;
    expect(file.mimeType).toBe("application/pdf");
    expect(file.name).toMatch(/\.pdf$/);
    expect(file.size).toBe(1024);
  });

  it("accepts a valid DOCX", async () => {
    const r = await validateSubmission(job, validJob, { cv: [docx()] });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.uploads[0].files[0].mimeType).toBe("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
  });

  it("makes the stored file name safe", async () => {
    const r = await validateSubmission(job, validJob, { cv: [pdf(1024, "../../<script>evil.pdf")] });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.uploads[0].files[0].name).toMatch(/^[A-Za-z0-9._-]+\.pdf$/);
  });
});
