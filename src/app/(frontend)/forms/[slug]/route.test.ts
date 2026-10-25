import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Form } from "@/payload-types";
import { toBlock } from "@/seed/forms";
import { FORM_DEFINITIONS, type FormKey } from "@/lib/forms/definitions";

/*
 * The submission endpoint, with getPayload and sendNotification faked. No
 * database: the fake local API records every call so the tests can say
 * exactly what would have been written.
 */

const notify = vi.fn();
vi.mock("@/lib/mail", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/mail")>();
  return { ...actual, sendNotification: (...args: unknown[]) => notify(...args) };
});

let fake: ReturnType<typeof fakePayload>;
vi.mock("payload", () => ({ getPayload: vi.fn(async () => fake) }));
vi.mock("@payload-config", () => ({ default: {} }));

const formDoc = (key: FormKey, id: number): Form => ({
  id,
  title: FORM_DEFINITIONS[key].title,
  fields: FORM_DEFINITIONS[key].fields.map(toBlock) as Form["fields"],
  emails: [{ emailTo: "sales@example.test, ops@example.test", subject: "ignored" }],
  updatedAt: "",
  createdAt: "",
});

type Doc = Record<string, unknown>;
// The fake records whatever the route passes; the assertions say what that must be.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Args = { collection: string; [k: string]: any };

function fakePayload(opts: { events?: Doc[]; jobs?: Doc[] } = {}) {
  const forms = [formDoc("contact", 1), formDoc("job-application", 2), formDoc("event-registration", 3)];
  let nextId = 100;
  return {
    find: vi.fn(async ({ collection, where }: { collection: string; where: Doc }) => {
      const json = JSON.stringify(where);
      if (collection === "forms") {
        return { docs: forms.filter((f) => json.includes(JSON.stringify(f.title))) };
      }
      const pool = collection === "events" ? opts.events ?? [] : collection === "jobs" ? opts.jobs ?? [] : [];
      return {
        docs: pool.filter((d) => json.includes(`"${d.slug}"`) && d._status === "published" && json.includes("published")),
      };
    }),
    create: vi.fn(async ({ collection, data }: Args): Promise<Args> => ({ id: nextId++, collection, ...data })),
    delete: vi.fn(async () => ({})),
    update: vi.fn(async () => ({})),
    logger: { error: vi.fn(), info: vi.fn(), warn: vi.fn() },
  };
}

const contactValues: Record<string, string> = {
  fullName: "Abebe Kebede",
  organization: "Example Bank",
  email: "abebe@example.test",
  phone: "+251 11 123 4567",
  inquiryType: "Request a Quotation",
  message: "We would like a quotation.",
  consent: "on",
};

let ip = 0;
const freshIp = () => `203.0.113.${(ip += 1) % 250}`;

function post(slug: string, body: BodyInit | Record<string, unknown>, opts: { ip?: string; json?: boolean; headers?: Record<string, string> } = {}) {
  const headers: Record<string, string> = {
    "x-forwarded-for": `198.51.100.1, ${opts.ip ?? freshIp()}`,
    "user-agent": "vitest",
    ...opts.headers,
  };
  let payloadBody: BodyInit;
  if (opts.json) {
    headers["content-type"] = "application/json";
    payloadBody = JSON.stringify(body);
  } else if (body instanceof FormData || typeof body === "string") {
    payloadBody = body as BodyInit;
  } else {
    const fd = new FormData();
    for (const [k, v] of Object.entries(body)) fd.append(k, v as string | Blob);
    payloadBody = fd;
  }
  return new Request(`https://edge.test/forms/${slug}`, { method: "POST", headers, body: payloadBody });
}

async function load() {
  vi.resetModules();
  return import("./route");
}
const call = async (req: Request, slug: string) => {
  const { POST } = await load();
  return POST(req, { params: Promise.resolve({ slug }) });
};

const submissionCreates = () => fake.create.mock.calls.filter(([a]) => a.collection === "form-submissions");
const uploadCreates = () => fake.create.mock.calls.filter(([a]) => a.collection === "applications");

beforeEach(() => {
  fake = fakePayload();
  notify.mockReset();
  notify.mockResolvedValue("sent");
  process.env.PAYLOAD_SECRET = "test-secret";
  delete process.env.FORM_RATE_MAX;
  delete process.env.FORM_RATE_WINDOW_SEC;
  delete process.env.TRUSTED_PROXY_HOPS;
});

describe("POST /forms/[slug]", () => {
  it("creates exactly one submission with consent, notifies once and returns 200", async () => {
    const res = await call(post("contact", contactValues, { ip: "203.0.113.200" }), "contact");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, message: FORM_DEFINITIONS.contact.confirmationMessage });

    expect(submissionCreates()).toHaveLength(1);
    const [{ data, overrideAccess }] = submissionCreates()[0];
    expect(overrideAccess).toBe(true);
    expect(data.form).toBe(1);
    expect(data.consent.accepted).toBe(true);
    expect(new Date(data.consent.acceptedAt).getTime()).not.toBeNaN();
    expect(data.consent.wording).toBe(FORM_DEFINITIONS.contact.consent);
    expect(data.submissionData).toContainEqual({ field: "fullName", value: "Abebe Kebede" });
    expect(data.submissionData.find((e: Doc) => e.field === "consent")).toBeUndefined();

    // Only a salted hash of the client key; the address itself is nowhere.
    expect(data.meta.ipHash).toMatch(/^[0-9a-f]{64}$/);
    expect(JSON.stringify(data)).not.toContain("203.0.113.200");
    expect(data.meta.userAgent).toBe("vitest");

    expect(notify).toHaveBeenCalledTimes(1);
    const [, n] = notify.mock.calls[0];
    expect(n.submissionId).toBe(100);
    expect(n.to).toEqual(["sales@example.test", "ops@example.test"]);
    expect(n.subject).toContain("Contact");
    expect(n.text).toContain("Full name: Abebe Kebede");
  });

  it("builds the subject from the form title only, never from submitted values", async () => {
    await call(post("contact", { ...contactValues, fullName: "Evil\r\nBcc: victim@example.test" }), "contact");
    // The CR/LF name is rejected anyway; send a clean one with a hostile message.
    await call(post("contact", { ...contactValues, message: "Subject: hijack\r\nBcc: x@y.test" }), "contact");
    expect(notify).toHaveBeenCalledTimes(1);
    const [, n] = notify.mock.calls[0];
    expect(n.subject).not.toMatch(/[\r\n]/);
    expect(n.subject).not.toContain("hijack");
  });

  it("returns 404 for an unknown slug and for a form that is not in the database", async () => {
    expect((await call(post("nope", contactValues), "nope")).status).toBe(404);
    expect((await call(post("subscribe", contactValues), "subscribe")).status).toBe(404);
    expect(fake.create).not.toHaveBeenCalled();
  });

  it("answers a filled honeypot with the normal 200 and stores and sends nothing", async () => {
    const good = await call(post("contact", contactValues), "contact");
    fake.create.mockClear();
    notify.mockClear();
    const res = await call(post("contact", { ...contactValues, website_url: "http://spam.test" }), "contact");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(await good.json());
    expect(fake.create).not.toHaveBeenCalled();
    expect(notify).not.toHaveBeenCalled();
  });

  it("treats a file part named like the honeypot as a tripped honeypot", async () => {
    const good = await call(post("contact", contactValues), "contact");
    fake.create.mockClear();
    notify.mockClear();
    const trap = new File(["bot"], "x.txt", { type: "text/plain" });
    const res = await call(post("contact", { ...contactValues, website_url: trap }), "contact");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(await good.json());
    expect(fake.create).not.toHaveBeenCalled();
    expect(notify).not.toHaveBeenCalled();
  });

  it("returns 422 with per-field errors and stores nothing when invalid", async () => {
    const { consent: _c, ...noConsent } = contactValues;
    const res = await call(post("contact", { ...noConsent, inquiryType: "Select", extra: "x" }), "contact");
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(Object.keys(body.errors).sort()).toEqual(["consent", "extra", "inquiryType"]);
    expect(fake.create).not.toHaveBeenCalled();
    expect(notify).not.toHaveBeenCalled();
  });

  it("returns 429 with Retry-After on the sixth request from one client", async () => {
    const { POST } = await load();
    const send = (i: number) =>
      POST(post("contact", { ...contactValues, message: `message ${i}` }, { ip: "203.0.113.9" }), { params: Promise.resolve({ slug: "contact" }) });
    for (let i = 0; i < 5; i += 1) expect((await send(i)).status).toBe(200);
    const sixth = await send(6);
    expect(sixth.status).toBe(429);
    expect(Number(sixth.headers.get("retry-after"))).toBeGreaterThan(0);
    expect(submissionCreates()).toHaveLength(5);
  });

  it("cannot mint fresh buckets by spoofing x-forwarded-for", async () => {
    const { POST } = await load();
    const send = (i: number) =>
      POST(
        post("contact", { ...contactValues, message: `m ${i}` }, { headers: { "x-forwarded-for": `10.${i}.0.1, 203.0.113.77` } }),
        { params: Promise.resolve({ slug: "contact" }) },
      );
    for (let i = 0; i < 5; i += 1) expect((await send(i)).status).toBe(200);
    expect((await send(6)).status).toBe(429);
  });

  it("honours FORM_RATE_MAX", async () => {
    process.env.FORM_RATE_MAX = "1";
    const { POST } = await load();
    const ctx = { params: Promise.resolve({ slug: "contact" }) };
    expect((await POST(post("contact", contactValues, { ip: "203.0.113.5" }), ctx)).status).toBe(200);
    expect((await POST(post("contact", { ...contactValues, message: "again" }, { ip: "203.0.113.5" }), ctx)).status).toBe(429);
  });

  it("stores an identical payload sent twice within 10 s once, and answers 200 both times", async () => {
    const { POST } = await load();
    const ctx = { params: Promise.resolve({ slug: "contact" }) };
    const a = await POST(post("contact", contactValues, { ip: "203.0.113.6" }), ctx);
    const b = await POST(post("contact", contactValues, { ip: "203.0.113.6" }), ctx);
    expect(a.status).toBe(200);
    expect(b.status).toBe(200);
    expect(await b.json()).toEqual({ ok: true, message: FORM_DEFINITIONS.contact.confirmationMessage });
    expect(submissionCreates()).toHaveLength(1);
    expect(notify).toHaveBeenCalledTimes(1);
  });

  it("still returns 200 when the notification fails or throws", async () => {
    notify.mockResolvedValueOnce("failed");
    expect((await call(post("contact", contactValues), "contact")).status).toBe(200);
    notify.mockRejectedValueOnce(new Error("smtp exploded"));
    const res = await call(post("contact", { ...contactValues, message: "second" }), "contact");
    expect(res.status).toBe(200);
    expect(submissionCreates()).toHaveLength(2);
    // The throw is recorded on the submission, truncated.
    expect(fake.update).toHaveBeenCalledWith(
      expect.objectContaining({ collection: "form-submissions", data: expect.objectContaining({ emailStatus: "failed" }) }),
    );
  });

  it("returns 500 with a generic message and no stack when the create throws", async () => {
    fake.create.mockRejectedValueOnce(new Error("relation \"form_submissions\" does not exist\n    at Object.<anonymous> (/srv/x.js:1:1)"));
    const res = await call(post("contact", contactValues), "contact");
    expect(res.status).toBe(500);
    const text = await res.text();
    expect(text).not.toMatch(/relation|form_submissions|at Object|\.js/);
    expect(JSON.parse(text).errors).toBeDefined();
    expect(notify).not.toHaveBeenCalled();
  });

  it("does not log submitted values when the database error carries them", async () => {
    const leaky = new Error(
      'Failed query: insert into "form_submissions" params: Abebe Kebede,leak@example.test,+251 11 999 0000,We would like a quotation.',
    );
    leaky.name = "DrizzleQueryError";
    fake.create.mockRejectedValueOnce(leaky);
    const res = await call(post("contact", contactValues), "contact");
    expect(res.status).toBe(500);
    const logged = JSON.stringify(fake.logger.error.mock.calls, (_k, v) => (v instanceof Error ? { name: v.name, message: v.message, stack: v.stack } : v));
    expect(fake.logger.error).toHaveBeenCalled();
    expect(logged).not.toMatch(/leak@example\.test|251 11 999|Abebe|quotation/);
    expect(logged).toContain("DrizzleQueryError");
  });

  it("refuses a body that is neither multipart nor JSON with 415", async () => {
    const res = await call(post("contact", "a=b", { headers: { "content-type": "text/plain" } }), "contact");
    expect(res.status).toBe(415);
  });

  it("accepts JSON on a form without an upload field", async () => {
    const res = await call(post("contact", { ...contactValues, consent: true }, { json: true }), "contact");
    expect(res.status).toBe(200);
    expect(submissionCreates()).toHaveLength(1);
  });

  it("refuses JSON on a form with an upload field with 415", async () => {
    fake = fakePayload({ jobs: [openJob] });
    const res = await call(post("job-application", { ...jobValues, consent: true }, { json: true }), "job-application");
    expect(res.status).toBe(415);
  });

  it("refuses an oversized body with 413", async () => {
    const res = await call(post("contact", { ...contactValues, message: "x".repeat(200_000) }), "contact");
    expect(res.status).toBe(413);
    expect(fake.create).not.toHaveBeenCalled();
  });

  it("refuses an oversized body even without a Content-Length", async () => {
    const big = new TextEncoder().encode(JSON.stringify({ ...contactValues, message: "x".repeat(200_000) }));
    const stream = new ReadableStream({
      start(c) {
        c.enqueue(big);
        c.close();
      },
    });
    const req = new Request("https://edge.test/forms/contact", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": freshIp() },
      body: stream,
      // @ts-expect-error -- Node's fetch needs this for a streamed body.
      duplex: "half",
    });
    expect((await call(req, "contact")).status).toBe(413);
  });
});

/* ------------------------------------------------- uploads and context */

const pdfFile = (name = "cv.pdf") =>
  new File([Buffer.concat([Buffer.from("%PDF-1.7\n"), Buffer.alloc(2000, 0x20)])], name, { type: "application/pdf" });

const openJob = { id: 7, slug: "network-engineer", title: "Network Engineer", _status: "published", deadline: { status: "pending", value: null } };
const jobValues: Record<string, string> = {
  fullName: "Abebe Kebede",
  email: "abebe@example.test",
  mobile: "+251911234567",
  residence: "Addis Ababa, Ethiopia",
  currentPosition: "Engineer",
  fieldOfStudy: "Electrical engineering",
  institution: "Addis Ababa University",
  job: "network-engineer",
  consent: "on",
};

describe("job application uploads", () => {
  it("stores the CV privately first, then references it from the one submission", async () => {
    fake = fakePayload({ jobs: [openJob] });
    const res = await call(post("job-application", { ...jobValues, cv: pdfFile() }), "job-application");
    expect(res.status).toBe(200);

    expect(uploadCreates()).toHaveLength(1);
    const [up] = uploadCreates()[0];
    expect(up.overrideAccess).toBe(true);
    expect(up.file.mimetype).toBe("application/pdf");
    expect(up.file.size).toBe(2009);

    expect(submissionCreates()).toHaveLength(1);
    const [{ data }] = submissionCreates()[0];
    // The plugin's beforeChange hook turns this id into submissionUploads.
    expect(data.submissionData).toContainEqual({ field: "cv", value: "100" });
    expect(data.submissionData).toContainEqual({ field: "job", value: "Network Engineer (network-engineer)" });

    const order = fake.create.mock.invocationCallOrder;
    expect(order[0]).toBeLessThan(order[1]);
    const [, n] = notify.mock.calls[0];
    expect(n.text).toContain("CV upload: cv.pdf");
  });

  it("accepts a browser-built multipart body with a mixed-case boundary", async () => {
    // Chrome and Safari send boundaries like ----WebKitFormBoundaryAbC...; the
    // boundary is case-sensitive, so the header must reach the parser unchanged.
    fake = fakePayload({ jobs: [openJob] });
    const boundary = "----WebKitFormBoundaryAbCdEfGh12XyZ";
    const parts: Buffer[] = [];
    for (const [k, v] of Object.entries(jobValues)) {
      parts.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="${k}"\r\n\r\n${v}\r\n`));
    }
    parts.push(
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="cv"; filename="My CV.pdf"\r\nContent-Type: application/pdf\r\n\r\n`),
      Buffer.from("%PDF-1.7\n" + " ".repeat(500)),
      Buffer.from(`\r\n--${boundary}--\r\n`),
    );
    const req = new Request("https://edge.test/forms/job-application", {
      method: "POST",
      headers: { "content-type": `multipart/form-data; boundary=${boundary}`, "x-forwarded-for": freshIp() },
      body: Buffer.concat(parts),
    });
    const res = await call(req, "job-application");
    expect(res.status).toBe(200);
    expect(uploadCreates()).toHaveLength(1);
    expect(submissionCreates()).toHaveLength(1);
  });

  it("leaves no submission and no upload when the file is rejected", async () => {
    fake = fakePayload({ jobs: [openJob] });
    const exe = new File([Buffer.concat([Buffer.from("MZ"), Buffer.alloc(500)])], "cv.pdf", { type: "application/pdf" });
    const res = await call(post("job-application", { ...jobValues, cv: exe }), "job-application");
    expect(res.status).toBe(422);
    expect(fake.create).not.toHaveBeenCalled();
  });

  it("answers 422, not 500, when Payload rejects the stored file type, and cleans up", async () => {
    fake = fakePayload({ jobs: [openJob] });
    // A zip renamed .docx starts with PK, so our check passes it; Payload's own check sees application/zip.
    const rejection = Object.assign(new Error("The following field is invalid: file"), {
      name: "ValidationError",
      data: { errors: [{ message: "File type 'application/zip' not allowed", path: "file" }] },
    });
    fake.create.mockRejectedValueOnce(rejection);
    const zipped = new File([Buffer.concat([Buffer.from([0x50, 0x4b, 3, 4]), Buffer.alloc(500)])], "cv.docx");
    const res = await call(post("job-application", { ...jobValues, cv: zipped }), "job-application");
    expect(res.status).toBe(422);
    expect((await res.json()).errors.cv).toMatch(/upload a PDF or DOCX file/);
    expect(submissionCreates()).toHaveLength(0);
  });

  it("deletes the uploaded CV when the submission create fails", async () => {
    fake = fakePayload({ jobs: [openJob] });
    fake.create.mockImplementation(async ({ collection }: Args) => {
      if (collection === "form-submissions") throw new Error("db down");
      return { id: 55, collection };
    });
    const res = await call(post("job-application", { ...jobValues, cv: pdfFile() }), "job-application");
    expect(res.status).toBe(500);
    expect(fake.delete).toHaveBeenCalledWith(expect.objectContaining({ collection: "applications", id: 55, overrideAccess: true }));
  });

  it("refuses a job that is unpublished, unknown or past its deadline", async () => {
    const closed = { ...openJob, slug: "closed-role", deadline: { status: "confirmed", value: "1 January 2020" } };
    const draft = { ...openJob, slug: "draft-role", _status: "draft" };
    for (const slug of ["closed-role", "draft-role", "no-such-role"]) {
      fake = fakePayload({ jobs: [closed, draft] });
      const res = await call(post("job-application", { ...jobValues, job: slug, cv: pdfFile() }), "job-application");
      expect(res.status, slug).toBe(422);
      expect((await res.json()).errors, slug).toHaveProperty("job");
      expect(fake.create, slug).not.toHaveBeenCalled();
    }
  });

  it("keeps an open-ended or future deadline open", async () => {
    const future = { ...openJob, slug: "future-role", deadline: { status: "confirmed", value: "31 December 2099" } };
    fake = fakePayload({ jobs: [future] });
    const res = await call(post("job-application", { ...jobValues, job: "future-role", cv: pdfFile() }), "job-application");
    expect(res.status).toBe(200);
  });
});

describe("event registration", () => {
  const values = {
    fullName: "A",
    jobTitle: "B",
    organization: "C",
    sector: "Education",
    email: "a@example.test",
    whatsapp: "+251911234567",
    consent: "on",
  };
  const upcoming = { id: 1, slug: "gitex-2099", title: "GITEX", _status: "published", startsOn: "2099-12-07", endsOn: "2099-12-11" };
  const past = { id: 2, slug: "old-webinar", title: "Old", _status: "published", startsOn: "2020-01-01" };

  it("accepts an upcoming published event", async () => {
    fake = fakePayload({ events: [upcoming, past] });
    const res = await call(post("event-registration", { ...values, event: "gitex-2099" }), "event-registration");
    expect(res.status).toBe(200);
  });

  it("refuses a past or unknown event", async () => {
    for (const slug of ["old-webinar", "nope"]) {
      fake = fakePayload({ events: [upcoming, past] });
      const res = await call(post("event-registration", { ...values, event: slug }), "event-registration");
      expect(res.status, slug).toBe(422);
      expect(fake.create).not.toHaveBeenCalled();
    }
  });
});
