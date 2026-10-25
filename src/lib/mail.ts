import type { Payload } from "payload";

/*
 * Outgoing mail for form submissions.
 *
 * The guarantee: a submission is stored before any mail is attempted, and
 * nothing in here can throw into the caller. A missing SMTP host, a refused
 * connection or a bad config all end as a recorded `emailStatus` on the stored
 * submission, never as a lost or failed submission.
 */

export type MailConfig = {
  host: string;
  port: number;
  secure: boolean;
  user?: string;
  pass?: string;
  from: string;
  /** Used only when a form has no recipient of its own (FORM_NOTIFY_FALLBACK). */
  to?: string;
};

const clean = (value: string | undefined) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

export function readMailConfig(env: NodeJS.ProcessEnv): MailConfig | null {
  const host = clean(env.SMTP_HOST);
  if (!host) return null;

  const from = clean(env.SMTP_FROM);
  if (!from) {
    throw new Error("SMTP_FROM is required because SMTP_HOST is set. It is the address notifications are sent from.");
  }

  const user = clean(env.SMTP_USER);
  const pass = clean(env.SMTP_PASS);
  if (user && !pass) throw new Error("SMTP_PASS is required because SMTP_USER is set. Set both, or neither for an unauthenticated relay.");
  if (pass && !user) throw new Error("SMTP_USER is required because SMTP_PASS is set. Set both, or neither for an unauthenticated relay.");

  const portText = clean(env.SMTP_PORT);
  const port = portText === undefined ? 587 : Number(portText);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`SMTP_PORT must be a port number between 1 and 65535, got "${portText}".`);
  }

  return { host, port, secure: port === 465, user, pass, from, to: clean(env.FORM_NOTIFY_FALLBACK) };
}

export type SubmissionEntry = {
  label: string;
  value: string;
  /** An upload: only the file name is ever written to the email, never a URL. */
  upload?: boolean;
};

const fileNameOf = (value: string) => {
  const noQuery = value.split(/[?#]/)[0];
  return noQuery.split(/[\\/]/).filter(Boolean).pop() ?? "";
};

export function buildSubmissionBody(input: {
  title: string;
  entries: SubmissionEntry[];
  consent?: { accepted: boolean; wording?: string | null };
}): string {
  const lines = [input.title, ""];
  for (const entry of input.entries) {
    lines.push(`${entry.label}: ${entry.upload ? fileNameOf(entry.value) : entry.value}`);
  }
  if (input.consent) {
    lines.push("", `Consent ${input.consent.accepted ? "given" : "not given"}${input.consent.wording ? `: ${input.consent.wording}` : ""}`);
  }
  return lines.join("\n");
}

export type NotificationResult = "sent" | "failed" | "skipped";

type Notification = { submissionId: number | string; to: string[]; subject: string; text: string };

async function record(
  payload: Payload,
  id: number | string,
  emailStatus: NotificationResult,
  emailError: string | null,
) {
  try {
    await payload.update({
      collection: "form-submissions",
      id,
      data: { emailStatus, emailError },
      overrideAccess: true,
    });
  } catch (err) {
    // The submission itself is already stored; only its mail status is lost.
    payload.logger.error({ err, msg: `Could not record email status "${emailStatus}" on submission ${id}.` });
  }
}

/*
 * The only place a submission notification is sent. Never throws.
 * `env` is injectable so tests need no process state.
 */
export async function sendNotification(
  payload: Payload,
  { submissionId, to, subject, text }: Notification,
  env: NodeJS.ProcessEnv = process.env,
): Promise<NotificationResult> {
  let config: MailConfig | null;
  try {
    config = readMailConfig(env);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    payload.logger.error({ err, msg: `Submission ${submissionId} stored; mail is misconfigured.` });
    await record(payload, submissionId, "failed", message);
    return "failed";
  }

  if (!config) {
    payload.logger.info(`Submission ${submissionId} stored; SMTP_HOST is not set, so no notification was sent.`);
    await record(payload, submissionId, "skipped", "SMTP is not configured.");
    return "skipped";
  }

  const recipients = to.length ? to : config.to ? [config.to] : [];
  if (!recipients.length) {
    payload.logger.warn(`Submission ${submissionId} stored; the form has no recipient and FORM_NOTIFY_FALLBACK is unset.`);
    await record(payload, submissionId, "skipped", "No recipient: the form has none and FORM_NOTIFY_FALLBACK is unset.");
    return "skipped";
  }

  try {
    await payload.sendEmail({ from: config.from, to: recipients, subject, text });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    payload.logger.error({ err, msg: `Submission ${submissionId} stored; the notification email failed.` });
    await record(payload, submissionId, "failed", message);
    return "failed";
  }

  await record(payload, submissionId, "sent", null);
  return "sent";
}
