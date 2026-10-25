import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { FORM_DEFINITIONS } from "@/lib/forms/definitions";
import { renderFields } from "@/lib/forms/read";
import { formDoc } from "@/lib/forms/testing";
import { FormView } from "./LiveForm";
import { createSubmitter, sendForm, validateClient, type FormState } from "./submit-client";

const view = (key: Parameters<typeof formDoc>[0], state: FormState = { phase: "idle" }, extra = {}) =>
  renderToStaticMarkup(
    <FormView
      form={formDoc(key)}
      action={`/forms/${key}`}
      submitLabel="Send it"
      email="sales@example.com"
      state={state}
      onSubmit={() => {}}
      {...extra}
    />,
  );

/** The opening tag of the element with this name, whatever order React wrote its attributes in. */
const tag = (html: string, name: string) => html.match(new RegExp(`<(?:input|select|textarea)[^>]*name="${name}"[^>]*>`))?.[0] ?? "";

const json = (status: number, body: unknown, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", ...headers } });

describe("FormView markup", () => {
  const out = view("contact");

  it("renders every stored field with its label, in order", () => {
    let last = -1;
    for (const f of FORM_DEFINITIONS.contact.fields) {
      const at = out.indexOf(`name="${f.name}"`);
      expect(at, f.name).toBeGreaterThan(last);
      last = at;
      expect(out).toContain(f.label.replace("&", "&amp;"));
    }
  });

  it("marks required fields with an asterisk and sets the required attribute", () => {
    expect(out).toMatch(/Full name<span[^>]*> \*<\/span>/);
    expect(out).not.toMatch(/Job title<span/);
    expect(tag(out, "fullName")).toContain('required=""');
    expect(tag(out, "jobTitle")).not.toContain("required");
    expect(tag(out, "message")).toContain('maxLength="4000"');
  });

  it("renders select options in order, the placeholder as an empty value", () => {
    const sel = out.slice(out.indexOf('name="inquiryType"'));
    expect(sel).toContain('<option value="" selected="">Select</option>');
    expect(sel.indexOf("Request a Consultation")).toBeLessThan(sel.indexOf("General Inquiry"));
  });

  it("carries the hint, the consent wording and the submit label", () => {
    expect(out).toContain("Include country code");
    expect(out).toContain(FORM_DEFINITIONS.contact.consent);
    expect(tag(out, "consent")).toContain('type="checkbox"');
    expect(out).toContain(">Send it</button>");
  });

  it("has a hidden, aria-hidden honeypot that cannot take focus", () => {
    expect(out).toMatch(/<div aria-hidden="true"[^>]*><input[^>]*name="website_url"/);
    const honeypot = tag(out, "website_url");
    expect(honeypot).toContain('tabindex="-1"');
    expect(honeypot).toContain('autoComplete="off"');
  });

  it("does not use native validation bubbles", () => {
    expect(out).toContain("noValidate");
  });

  it("has nothing disabled on first render", () => {
    expect(out).not.toMatch(/\sdisabled=/);
    expect(out).not.toContain("layout review");
    expect(out).not.toContain("not accepting submissions");
  });

  it("renders Subscribe's checkbox groups, each box a field of its own", () => {
    const sub = view("subscribe");
    expect(sub).toContain("<legend");
    expect(sub).toContain("Topics of interest");
    expect(sub).toContain("What to send");
    expect(tag(sub, "topicCybersecurity")).toContain('type="checkbox"');
    expect(tag(sub, "sendInsights")).toContain('type="checkbox"');
    expect(sub).toContain("New articles as they are published.");
    // the Country select has no placeholder, so it has no empty option
    expect(sub.slice(sub.indexOf('name="country"'), sub.indexOf('name="topicSoftwareAi"'))).not.toContain('value=""');
  });

  it("adds hidden context fields it was given", () => {
    expect(view("event-registration", { phase: "idle" }, { hidden: { event: "agentic-ai" } })).toMatch(
      /<input type="hidden" name="event" value="agentic-ai"/,
    );
  });

  it("uses the accent for the button when given", () => {
    expect(view("contact", { phase: "idle" }, { accent: "#056a9a" })).toMatch(/<button[^>]*background:#056a9a/);
  });
});

describe("FormView states", () => {
  it("disables the button, and only the button, while the request is pending", () => {
    const out = view("contact", { phase: "pending" });
    expect(out).toMatch(/<button[^>]*disabled=""[^>]*>/);
    expect(out.match(/\sdisabled=""/g)).toHaveLength(1);
    expect(out).toContain('aria-busy="true"');
  });

  it("shows each field error beside its field as an alert and flags the field", () => {
    const out = view("contact", { phase: "invalid", errors: { fullName: "Full name is required.", consent: "Please confirm: x" } });
    expect(out).toMatch(/<p[^>]*role="alert"[^>]*>Full name is required\.<\/p>/);
    expect(tag(out, "fullName")).toContain('aria-invalid="true"');
    expect(out).toContain("Please confirm: x");
    expect(tag(out, "email")).not.toContain("aria-invalid");
  });

  it("shows an error for a field the form does not draw (event, _form) at the foot", () => {
    const out = view("event-registration", { phase: "invalid", errors: { event: "Registration for this event has closed." } });
    expect(out).toMatch(/role="alert"[^>]*>Registration for this event has closed\./);
  });

  it("names the wait and the mailbox on a 429, built as one sentence", () => {
    const out = view("contact", { phase: "limited", retryAfterSec: 600 });
    expect(out).toContain("Too many attempts — please wait 10 minutes or email ");
    expect(out).toContain('href="mailto:sales@example.com"');
    expect(view("contact", { phase: "limited", retryAfterSec: 20 })).toContain("please wait 1 minute or email");
  });

  it("does not invent a mailbox when there is none", () => {
    const out = view("contact", { phase: "limited", retryAfterSec: 120 }, { email: undefined });
    expect(out).toContain("Too many attempts — please wait 2 minutes and try again.");
    expect(out).not.toContain("mailto:");
  });

  it("replaces the form with the confirmation, as a status", () => {
    const out = view("contact", { phase: "success", message: "Thank you. All good." });
    expect(out).toMatch(/role="status"[^>]*>[\s\S]*Thank you\. All good\./);
    expect(out).not.toContain("<form");
  });
});

describe("validateClient", () => {
  const fields = renderFields(formDoc("contact"));
  const consent = FORM_DEFINITIONS.contact.consent;
  const data = (entries: Record<string, string>) => {
    const fd = new FormData();
    for (const [k, v] of Object.entries(entries)) fd.set(k, v);
    return fd;
  };
  const good = {
    fullName: "A B",
    organization: "Org",
    email: "a@b.co",
    phone: "+251 91 111 1111",
    inquiryType: "General Inquiry",
    message: "Hello",
    consent: "on",
  };

  it("accepts a complete submission", () => {
    expect(validateClient(fields, consent, data(good))).toEqual({});
  });

  it("flags each empty required field and an unticked consent", () => {
    const errors = validateClient(fields, consent, data({}));
    expect(Object.keys(errors)).toEqual(["fullName", "organization", "email", "phone", "inquiryType", "message", "consent"]);
    expect(errors.fullName).toBe("Full name is required.");
    expect(errors.consent).toBe(`Please confirm: ${consent}`);
  });

  it("treats an untouched required select (empty value) as not chosen", () => {
    expect(validateClient(fields, consent, data({ ...good, inquiryType: "" })).inquiryType).toBe("Inquiry type is required.");
  });

  it("treats whitespace as empty and checks the email shape", () => {
    expect(validateClient(fields, consent, data({ ...good, fullName: "   " })).fullName).toBeDefined();
    expect(validateClient(fields, consent, data({ ...good, email: "nope" })).email).toBe("Email address: enter a valid email address.");
  });

  it("enforces a required checkbox", () => {
    const f = [{ name: "x", label: "Agree", type: "checkbox", required: true, wide: false }] as never;
    expect(validateClient(f, "", data({ consent: "on" }))).toEqual({ x: "Agree is required." });
  });
});

describe("sendForm", () => {
  const body = new FormData();

  it("posts the FormData to the action and reports success with the server's message", async () => {
    const fetchImpl = vi.fn(async () => json(200, { ok: true, message: "Thanks." }));
    const out = await sendForm("/forms/contact", body, fetchImpl as never);
    expect(out).toEqual({ kind: "success", message: "Thanks." });
    expect(fetchImpl).toHaveBeenCalledWith("/forms/contact", { method: "POST", body });
  });

  it("reports the per-field errors of a 422", async () => {
    const fetchImpl = async () => json(422, { errors: { email: "Email address: enter a valid email address." } });
    expect(await sendForm("/forms/contact", body, fetchImpl as never)).toEqual({
      kind: "invalid",
      errors: { email: "Email address: enter a valid email address." },
    });
  });

  it("reads Retry-After on a 429", async () => {
    const fetchImpl = async () => json(429, { errors: { _form: "Too many" } }, { "retry-after": "540" });
    expect(await sendForm("/forms/contact", body, fetchImpl as never)).toEqual({ kind: "limited", retryAfterSec: 540 });
  });

  it("falls back to a minute when Retry-After is missing", async () => {
    const fetchImpl = async () => json(429, {});
    expect(await sendForm("/forms/contact", body, fetchImpl as never)).toEqual({ kind: "limited", retryAfterSec: 60 });
  });

  it("reports a server error, a network failure and an unreadable body as failed", async () => {
    expect((await sendForm("/x", body, (async () => json(500, { errors: { _form: "Could not save." } })) as never)).kind).toBe("failed");
    const offline = async () => {
      throw new TypeError("offline");
    };
    expect(await sendForm("/x", body, offline as never)).toMatchObject({ kind: "failed" });
    expect(await sendForm("/x", body, (async () => new Response("<html>", { status: 502 })) as never)).toMatchObject({ kind: "failed" });
  });
});

describe("createSubmitter", () => {
  it("goes pending, then settles, and calls the server once for a double click", async () => {
    let release!: (o: { kind: "success"; message: string }) => void;
    const run = vi.fn(() => new Promise<{ kind: "success"; message: string }>((r) => (release = r)));
    const phases: string[] = [];
    const submit = createSubmitter(run, (s) => phases.push(s.phase));
    const first = submit(new FormData());
    const second = submit(new FormData());
    expect(phases).toEqual(["pending"]);
    release({ kind: "success", message: "ok" });
    await Promise.all([first, second]);
    expect(run).toHaveBeenCalledTimes(1);
    expect(phases).toEqual(["pending", "success"]);
  });

  it("lets a retry through once the first request has settled", async () => {
    const run = vi.fn(async () => ({ kind: "invalid" as const, errors: { a: "b" } }));
    const submit = createSubmitter(run, () => {});
    await submit(new FormData());
    await submit(new FormData());
    expect(run).toHaveBeenCalledTimes(2);
  });
});
