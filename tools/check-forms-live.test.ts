import { describe, expect, it } from "vitest";
import { FORM_DEFINITIONS, type FormKey } from "../src/lib/forms/definitions";
import {
  buildRequest,
  compareCounts,
  expectedStored,
  judge,
  runForm,
  tinyDocx,
  tinyPdf,
  validFields,
} from "./check-forms-live.mjs";
import { isMarkedSubmission, MARKER, uploadIdsOf } from "./forms-live-shared.mjs";

const KEYS = Object.keys(FORM_DEFINITIONS) as FormKey[];
const ctx = { eventSlug: "some-event", jobSlug: "some-job" };

describe("valid sample entries", () => {
  it.each(KEYS)("%s: every required non-upload field has a value, consent is given", (key) => {
    const fields = Object.fromEntries(validFields(key, ctx));
    for (const f of FORM_DEFINITIONS[key].fields) {
      if (f.required && f.type !== "upload") expect(fields[f.name], f.name).toBeTruthy();
    }
    expect(fields.consent).toBe("on");
  });

  it.each(KEYS)("%s: free text is marked, selects are never the placeholder, caps hold", (key) => {
    const fields = Object.fromEntries(validFields(key, ctx));
    expect(Object.values(fields).some((v) => String(v).includes(MARKER))).toBe(true);
    for (const f of FORM_DEFINITIONS[key].fields) {
      const v = fields[f.name];
      if (v === undefined) continue;
      if (f.type === "select") expect(v).not.toMatch(/^select\b/i);
      if (f.maxLength) expect(v.length).toBeLessThanOrEqual(f.maxLength);
    }
  });

  it("carries the page context the server requires", () => {
    expect(Object.fromEntries(validFields("event-registration", ctx)).event).toBe("some-event");
    expect(Object.fromEntries(validFields("job-application", ctx)).job).toBe("some-job");
    expect(Object.fromEntries(validFields("contact", ctx)).event).toBeUndefined();
  });
});

describe("request bodies", () => {
  it("a missing-field request drops exactly one required field", () => {
    const { removed, form } = buildRequest("contact", "missing", ctx);
    expect(FORM_DEFINITIONS.contact.fields.find((f) => f.name === removed)?.required).toBe(true);
    expect(form.has(removed!)).toBe(false);
    expect(form.get("consent")).toBe("on");
  });

  it("a honeypot request fills website_url", () => {
    expect(buildRequest("subscribe", "honeypot", ctx).form.get("website_url")).toBeTruthy();
  });

  it("the application forms attach the CV under `cv`; the others attach nothing", () => {
    const pdf = buildRequest("job-application", "cv-pdf", ctx).form.get("cv") as File;
    expect(pdf.name).toMatch(/\.pdf$/);
    expect(pdf.name).toContain("automated-test-ignore");
    const docx = buildRequest("internship-application", "cv-docx", ctx).form.get("cv") as File;
    expect(docx.name).toMatch(/\.docx$/);
    expect(buildRequest("contact", "valid", ctx).form.has("cv")).toBe(false);
  });

  it("the generated files carry the signatures the server sniffs", () => {
    expect(Buffer.from(tinyPdf()).subarray(0, 5).toString("latin1")).toBe("%PDF-");
    const z = Buffer.from(tinyDocx());
    expect([...z.subarray(0, 4)]).toEqual([0x50, 0x4b, 0x03, 0x04]);
    expect(z.includes(Buffer.from("word/document.xml"))).toBe(true);
    expect(z.includes(Buffer.from([0x50, 0x4b, 0x05, 0x06]))).toBe(true);
  });
});

describe("judging responses", () => {
  const res = (status: number, body: unknown = {}, headers: Record<string, string> = {}) => ({ status, body, headers });
  it("accepts the expected answers", () => {
    expect(judge("valid", res(200, { ok: true }))).toBeNull();
    expect(judge("missing", res(422, { errors: { fullName: "x" } }), "fullName")).toBeNull();
    expect(judge("honeypot", res(200, { ok: true }))).toBeNull();
    expect(judge("limit", res(429, {}, { "retry-after": "420" }))).toBeNull();
  });
  it("rejects deviations", () => {
    expect(judge("valid", res(422, { errors: { a: "b" } }))).toMatch(/422/);
    expect(judge("missing", res(200, { ok: true }), "fullName")).toMatch(/200/);
    expect(judge("missing", res(422, { errors: { other: "x" } }), "fullName")).toMatch(/fullName/);
    expect(judge("honeypot", res(500))).toMatch(/500/);
    expect(judge("limit", res(429))).toMatch(/Retry-After/);
    expect(judge("limit", res(429, {}, { "retry-after": "0" }))).toMatch(/Retry-After/);
  });
  it("explains a bucket that was already full", () => {
    expect(judge("valid", res(429, {}, { "retry-after": "300" }))).toMatch(/already rate limited/);
  });
});

/** A server double with a per-form, per-client limit, like the real one. */
function fakeServer({ max = 5 } = {}) {
  const counts = new Map<string, number>();
  return async (url: string, init: { body: FormData; headers: Record<string, string> }) => {
    const slug = new URL(url).pathname.split("/").pop()!;
    const k = `${slug}|${init.headers["x-forwarded-for"]}`;
    const n = (counts.get(k) ?? 0) + 1;
    counts.set(k, n);
    const out = (status: number, body: unknown, headers: Record<string, string> = {}) => ({
      status,
      headers: { get: (h: string) => headers[h.toLowerCase()] ?? null },
      json: async () => body,
    });
    if (n > max) return out(429, { errors: { _form: "slow" } }, { "retry-after": "590" });
    const form = init.body;
    if (form.get("website_url")) return out(200, { ok: true });
    const missing = FORM_DEFINITIONS[slug as FormKey].fields.find((f) => f.required && !form.has(f.name));
    if (missing) return out(422, { errors: { [missing.name]: "required" } });
    return out(200, { ok: true });
  };
}

const opts = { base: "http://x", ip: "203.0.113.9", ctx, rateMax: 5 };

describe("running one form against a server double", () => {
  it.each(KEYS)("%s: all checks pass and the burst reaches a 429", async (key) => {
    const results = await runForm(key, { ...opts, fetchImpl: fakeServer() });
    expect(results.filter((r) => !r.ok)).toEqual([]);
    expect(results.map((r) => r.check)).toContain("burst-429");
  });

  it("uses the pdf and docx probes only on the application forms", async () => {
    const run = async (k: FormKey) => (await runForm(k, { ...opts, fetchImpl: fakeServer() })).map((r) => r.check);
    expect(await run("job-application")).toEqual(expect.arrayContaining(["valid-cv-pdf", "valid-cv-docx"]));
    expect(await run("contact")).not.toContain("valid-cv-pdf");
  });

  it("fails when the server never limits", async () => {
    const results = await runForm("contact", { ...opts, fetchImpl: fakeServer({ max: 1000 }) });
    expect(results.find((r) => r.check === "burst-429")?.ok).toBe(false);
  });

  it("fails honestly when the server is unreachable", async () => {
    const results = await runForm("contact", {
      ...opts,
      fetchImpl: async () => {
        throw new Error("ECONNREFUSED");
      },
    });
    expect(results.every((r) => !r.ok)).toBe(true);
    expect(results[0].detail).toMatch(/ECONNREFUSED/);
  });
});

describe("stored-count comparison", () => {
  it("expects one stored submission per accepted valid post", () => {
    expect(expectedStored(KEYS)).toBe(8); // 6 forms + a second CV type on the 2 application forms
  });
  it("passes when only valid posts were stored", () => {
    expect(compareCounts({ total: 10 }, { total: 18 }, 8)).toBeNull();
  });
  it("catches a honeypot or rejected request that was stored, or a valid one that was not", () => {
    expect(compareCounts({ total: 10 }, { total: 19 }, 8)).toMatch(/9.*8/);
    expect(compareCounts({ total: 10 }, { total: 17 }, 8)).toMatch(/7.*8/);
  });
  it("rejects a count file that is not a count", () => {
    expect(compareCounts({}, { total: 1 }, 8)).toMatch(/total/);
  });
});

describe("the cleanup's recognition of probe entries", () => {
  it("finds the marker in any stored value", () => {
    expect(isMarkedSubmission({ submissionData: [{ field: "fullName", value: `Jo ${MARKER}` }] })).toBe(true);
    expect(isMarkedSubmission({ submissionData: [{ field: "fullName", value: "Jo Real" }] })).toBe(false);
    expect(isMarkedSubmission({})).toBe(false);
  });
  it("reads CV ids at depth 0 and depth 1", () => {
    expect(
      uploadIdsOf({
        submissionUploads: [
          { field: "cv", value: [{ relationTo: "applications", value: 7 }, { relationTo: "applications", value: { id: 8 } }] },
        ],
      }),
    ).toEqual([7, 8]);
    expect(uploadIdsOf({})).toEqual([]);
  });
});
