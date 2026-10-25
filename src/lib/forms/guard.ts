import { createHash, createHmac } from "node:crypto";
import { isIP } from "node:net";

/*
 * Spam guards for the submission route: a honeypot field, a sliding-window
 * rate limiter, a short double-submit window, and the client key they share.
 *
 * IN-MEMORY, PER PROCESS. The limiter and the double-submit memory live in
 * this Node process only. With one instance behind nginx (the current
 * deployment) that is exactly right. Run two instances, or a serverless host
 * that starts many, and each holds its own buckets, so the effective limit is
 * multiplied by the instance count and a restart forgets every bucket. Moving
 * the state to a shared store is a Phase 8 follow-up if hosting changes; see
 * deploy/README.md.
 */

/** The honeypot. Rendered hidden, off-screen, tabindex=-1, autocomplete=off. */
export const HONEYPOT_FIELD = "website_url";

/** A person never sees the field, so any value at all means a bot filled it. */
export function isHoneypotTripped(input: Record<string, unknown>): boolean {
  const value = input[HONEYPOT_FIELD];
  if (value === undefined || value === null || value === false) return false;
  if (typeof value === "string") return value.trim() !== "";
  if (Array.isArray(value)) return value.some((v) => !(typeof v === "string" && v.trim() === ""));
  return true;
}

export type Limiter = { check(key: string): { allowed: boolean; retryAfterSec: number } };

/*
 * Sliding window log: each key keeps the times of its accepted requests in the
 * last `windowMs`. A blocked attempt is not recorded, so hammering does not
 * push recovery further away; the bucket frees up as its oldest hit ages out.
 */
export function createLimiter({
  max,
  windowMs,
  now = Date.now,
}: {
  max: number;
  windowMs: number;
  now?: () => number;
}): Limiter {
  const hits = new Map<string, number[]>();
  let checks = 0;

  const sweep = (t: number) => {
    for (const [key, times] of hits) {
      if (!times.length || times[times.length - 1] <= t - windowMs) hits.delete(key);
    }
  };

  return {
    check(key) {
      const t = now();
      // Bound memory: drop idle buckets every so often.
      checks += 1;
      if (checks % 500 === 0 || hits.size > 10_000) sweep(t);

      const times = (hits.get(key) ?? []).filter((at) => at > t - windowMs);
      if (times.length >= max) {
        hits.set(key, times);
        const retryAfterMs = times[0] + windowMs - t;
        return { allowed: false, retryAfterSec: Math.max(1, Math.ceil(retryAfterMs / 1000)) };
      }
      times.push(t);
      hits.set(key, times);
      return { allowed: true, retryAfterSec: 0 };
    },
  };
}

/*
 * The client's address as the trusted proxies saw it.
 *
 * nginx appends the peer it actually talked to on the right of
 * X-Forwarded-For ($proxy_add_x_forwarded_for), after whatever the client
 * sent. So the entry `trustedProxies` places from the right is the one our
 * outermost proxy wrote, and everything to its left is client-supplied and
 * worthless. Taking the leftmost entry, as many examples do, would let a bot
 * mint a fresh rate-limit bucket per request.
 *
 * Anything unexpected (no header, fewer entries than proxies, a value that is
 * not an IP address, or zero trusted proxies, where the header is entirely
 * client-controlled) falls back to one shared "unknown" key. That is stricter,
 * not looser: unidentifiable traffic shares a single bucket.
 */
export function clientKey(headers: Headers, trustedProxies: number): string {
  if (!Number.isInteger(trustedProxies) || trustedProxies < 1) return "unknown";
  const entries = (headers.get("x-forwarded-for") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const candidate = entries[entries.length - trustedProxies];
  return candidate && isIP(candidate) ? candidate : "unknown";
}

/*
 * What is stored instead of the address: an HMAC keyed by a value derived
 * from PAYLOAD_SECRET. Enough to see that two submissions came from one
 * client, useless for recovering the address without the secret.
 */
export function hashClientKey(key: string, secret: string): string {
  const salt = createHash("sha256").update(`edge-form-client-key:${secret}`).digest();
  return createHmac("sha256", salt).update(key).digest("hex");
}

export type Deduper = { seen(key: string): boolean; forget(key: string): void };

/** Remembers keys for `windowMs`; used to drop a double-clicked resubmission. */
export function createDeduper({ windowMs, now = Date.now }: { windowMs: number; now?: () => number }): Deduper {
  const until = new Map<string, number>();
  return {
    seen(key) {
      const t = now();
      if (until.size > 10_000) {
        for (const [k, exp] of until) if (exp <= t) until.delete(k);
      }
      const exp = until.get(key);
      if (exp !== undefined && exp > t) return true;
      until.set(key, t + windowMs);
      return false;
    },
    forget(key) {
      until.delete(key);
    },
  };
}
