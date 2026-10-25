import { describe, expect, it, vi } from "vitest";
import config from "../payload.config";
import { buildSubmissionBody, readMailConfig, sendNotification } from "./mail";

const base = { SMTP_HOST: "smtp.example.test", SMTP_FROM: "forms@example.test" } as unknown as NodeJS.ProcessEnv;

describe("readMailConfig", () => {
  it("is null when SMTP_HOST is unset or blank", () => {
    expect(readMailConfig({} as unknown as NodeJS.ProcessEnv)).toBeNull();
    expect(readMailConfig({ SMTP_HOST: "  " } as unknown as NodeJS.ProcessEnv)).toBeNull();
  });

  it("defaults the port to 587 and is not secure", () => {
    expect(readMailConfig(base)).toEqual({
      host: "smtp.example.test",
      port: 587,
      secure: false,
      user: undefined,
      pass: undefined,
      from: "forms@example.test",
      to: undefined,
    });
  });

  it("is secure on port 465", () => {
    expect(readMailConfig({ ...base, SMTP_PORT: "465" })?.secure).toBe(true);
  });

  it("carries credentials and the fallback recipient", () => {
    const c = readMailConfig({ ...base, SMTP_USER: "u", SMTP_PASS: "p", FORM_NOTIFY_FALLBACK: "ops@example.test" });
    expect(c).toMatchObject({ user: "u", pass: "p", to: "ops@example.test" });
  });

  it("throws naming SMTP_FROM when the host has no sender", () => {
    expect(() => readMailConfig({ SMTP_HOST: "h" } as unknown as NodeJS.ProcessEnv)).toThrow(/SMTP_FROM/);
  });

  it("throws when only one of SMTP_USER and SMTP_PASS is set", () => {
    expect(() => readMailConfig({ ...base, SMTP_USER: "u" })).toThrow(/SMTP_PASS/);
    expect(() => readMailConfig({ ...base, SMTP_PASS: "p" })).toThrow(/SMTP_USER/);
  });

  it("rejects a non-numeric port", () => {
    expect(() => readMailConfig({ ...base, SMTP_PORT: "abc" })).toThrow(/SMTP_PORT/);
  });
});

function fakePayload(sendEmail: (m: unknown) => Promise<unknown>) {
  return {
    sendEmail: vi.fn(sendEmail),
    update: vi.fn(async () => ({})),
    logger: { error: vi.fn(), info: vi.fn(), warn: vi.fn() },
  };
}
const message = { submissionId: 7, to: ["careers@example.test"], subject: "New application", text: "body" };

describe("sendNotification", () => {
  it("sends once from SMTP_FROM and records sent", async () => {
    const p = fakePayload(async () => ({}));
    const r = await sendNotification(p as never, message, base);
    expect(r).toBe("sent");
    expect(p.sendEmail).toHaveBeenCalledTimes(1);
    expect(p.sendEmail).toHaveBeenCalledWith({
      from: "forms@example.test",
      to: ["careers@example.test"],
      subject: "New application",
      text: "body",
    });
    expect(p.update).toHaveBeenCalledWith(
      expect.objectContaining({ collection: "form-submissions", id: 7, data: { emailStatus: "sent", emailError: null } }),
    );
  });

  it("returns failed, records the message and does not throw when the transport rejects", async () => {
    const p = fakePayload(async () => {
      throw new Error("connection refused");
    });
    const r = await sendNotification(p as never, message, base);
    expect(r).toBe("failed");
    expect(p.update).toHaveBeenCalledWith(
      expect.objectContaining({ id: 7, data: { emailStatus: "failed", emailError: "connection refused" } }),
    );
  });

  it("does not throw even if recording the status also fails", async () => {
    const p = fakePayload(async () => {
      throw new Error("down");
    });
    p.update.mockRejectedValue(new Error("db down"));
    await expect(sendNotification(p as never, message, base)).resolves.toBe("failed");
  });

  it("returns skipped without sending when SMTP is not configured", async () => {
    const p = fakePayload(async () => ({}));
    const r = await sendNotification(p as never, message, {} as unknown as NodeJS.ProcessEnv);
    expect(r).toBe("skipped");
    expect(p.sendEmail).not.toHaveBeenCalled();
    expect(p.update).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ emailStatus: "skipped" }) }));
  });

  it("returns failed, not a throw, when the mail environment is misconfigured", async () => {
    const p = fakePayload(async () => ({}));
    const r = await sendNotification(p as never, message, { SMTP_HOST: "h" } as unknown as NodeJS.ProcessEnv);
    expect(r).toBe("failed");
    expect(p.update).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ emailStatus: "failed", emailError: expect.stringContaining("SMTP_FROM") }) }));
  });

  it("uses FORM_NOTIFY_FALLBACK only when the form has no recipient", async () => {
    const env = { ...base, FORM_NOTIFY_FALLBACK: "ops@example.test" };
    const p = fakePayload(async () => ({}));
    await sendNotification(p as never, { ...message, to: [] }, env);
    expect(p.sendEmail).toHaveBeenCalledWith(expect.objectContaining({ to: ["ops@example.test"] }));

    const q = fakePayload(async () => ({}));
    await sendNotification(q as never, message, env);
    expect(q.sendEmail).toHaveBeenCalledWith(expect.objectContaining({ to: ["careers@example.test"] }));
  });

  it("skips with a reason when there is no recipient at all", async () => {
    const p = fakePayload(async () => ({}));
    const r = await sendNotification(p as never, { ...message, to: [] }, base);
    expect(r).toBe("skipped");
    expect(p.sendEmail).not.toHaveBeenCalled();
    expect(p.update).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ emailStatus: "skipped", emailError: expect.stringMatching(/recipient/i) }) }));
  });
});

describe("buildSubmissionBody", () => {
  const body = buildSubmissionBody({
    title: "Job application",
    entries: [
      { label: "Full name", value: "Sara Bekele" },
      { label: "Message", value: "Hello\nthere" },
      { label: "CV", value: "https://cdn.example.test/applications/sara-cv.pdf?sig=abc", upload: true },
    ],
    consent: { accepted: true, wording: "I agree to be contacted." },
  });

  it("lists each label and value", () => {
    expect(body).toContain("Full name: Sara Bekele");
    expect(body).toContain("Message: Hello\nthere");
  });

  it("includes the consent wording", () => {
    expect(body).toContain("I agree to be contacted.");
  });

  it("shows only the filename for uploads, never a URL", () => {
    expect(body).toContain("CV: sara-cv.pdf");
    expect(body).not.toMatch(/https?:|cdn\.example|sig=abc/);
  });
});

describe("only sendNotification sends mail", () => {
  it("the form-builder plugin's own sender is neutralised", async () => {
    // The plugin's afterChange hook on form-submissions formats each form's
    // `emails` and mails them. Its beforeEmail option is the supported veto:
    // returning no emails means the plugin sends nothing.
    const resolved = await config;
    const subs = resolved.collections.find((c) => c.slug === "form-submissions")!;
    const hook = subs.hooks.afterChange![0] as (a: unknown) => Promise<void>;
    const sendEmail = vi.fn(async () => ({}));
    const payload = {
      sendEmail,
      email: { defaultFromAddress: "x@y.test" },
      logger: { error: vi.fn(), info: vi.fn() },
      findByID: async () => ({
        emails: [{ emailTo: "a@b.test", emailFrom: "c@d.test", subject: "s", message: null }],
      }),
    };
    await hook({
      operation: "create",
      data: { form: 1, submissionData: [{ field: "a", value: "b" }] },
      doc: { id: 1 },
      req: { payload, locale: "en" },
    });
    expect(sendEmail).not.toHaveBeenCalled();
  });
});
