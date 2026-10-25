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

import { HONEYPOT_FIELD } from "./constants";

export { HONEYPOT_FIELD };

/** A person never sees the field, so any value at all means a bot filled it. */
export function isHoneypotTripped(
  input: Record<string, unknown>,
  files: Record<string, File[]> = {},
): boolean {
  // A multipart part sent with a filename lands in `files`, not `input`.
  if ((files[HONEYPOT_FIELD] ?? []).some((f) => !(f.size === 0 && f.name === ""))) return true;
  const value = input[HONEYPOT_FIELD];
  if (value === undefined || value === null || value === false) return false;
  if (typeof value === "string") return value.trim() !== "";
  if (Array.isArray(value)) return value.some((v) => !(typeof v === "string" && v.trim() === ""));
  return true;
}

export type Limiter = {
  check(key: string): { allowed: boolean; retryAfterSec: number };
  /** Buckets currently held; never more than `maxKeys`. */
  size(): number;
};

/** How far into the least-recently-seen end an eviction looks for a bucket with room. */
const EVICTION_SCAN = 64;

/*
 * Sliding window log: each key keeps the times of its accepted requests in the
 * last `windowMs`. A blocked attempt is not recorded, so hammering does not
 * push recovery further away; the bucket frees up as its oldest hit ages out.
 *
 * Memory is capped at `maxKeys` buckets. The map is kept in least-recently-
 * seen order (every check, allowed or blocked, moves its key to the end), and
 * a new key arriving at the cap evicts one bucket from the stale end:
 *
 *   - the first, among the EVICTION_SCAN least recently seen, that is idle
 *     (no hits left in the window) or still has room (fewer than `max` hits);
 *   - only if all of those are full, the least recently seen bucket itself.
 *
 * Why this order: evicting a bucket that is full is the one eviction that
 * resets a limited client, so it is the last resort. A client that keeps
 * hammering while limited keeps moving to the fresh end and is never near the
 * eviction point. To get a full bucket evicted an attacker has to fill the
 * whole map (`maxKeys` distinct clients, i.e. distinct IPv4 addresses or IPv6
 * /64s, each of them filled to `max`) while the target stays quiet, and a
 * target that stays quiet is not the one doing harm. Each eviction is O(1)
 * bounded by EVICTION_SCAN, so a full map costs no more per request than an
 * empty one. The periodic sweep (every 500 checks) drops idle buckets in bulk.
 */
export function createLimiter({
  max,
  windowMs,
  now = Date.now,
  maxKeys = 50_000,
}: {
  max: number;
  windowMs: number;
  now?: () => number;
  maxKeys?: number;
}): Limiter {
  const hits = new Map<string, number[]>();
  let checks = 0;

  const live = (times: number[], t: number) => times.filter((at) => at > t - windowMs);

  const sweep = (t: number) => {
    for (const [key, times] of hits) {
      if (!times.length || times[times.length - 1] <= t - windowMs) hits.delete(key);
    }
  };

  const evictOne = (t: number) => {
    let scanned = 0;
    for (const [key, times] of hits) {
      if (live(times, t).length < max) {
        hits.delete(key);
        return;
      }
      scanned += 1;
      if (scanned >= EVICTION_SCAN) break;
    }
    const oldest = hits.keys().next();
    if (!oldest.done) hits.delete(oldest.value);
  };

  return {
    check(key) {
      const t = now();
      checks += 1;
      if (checks % 500 === 0) sweep(t);

      const existing = hits.get(key);
      const times = existing ? live(existing, t) : [];
      // Move the key to the recently-seen end.
      hits.delete(key);
      if (!existing) {
        while (hits.size >= maxKeys) evictOne(t);
      }

      if (times.length >= max) {
        hits.set(key, times);
        const retryAfterMs = times[0] + windowMs - t;
        return { allowed: false, retryAfterSec: Math.max(1, Math.ceil(retryAfterMs / 1000)) };
      }
      times.push(t);
      hits.set(key, times);
      return { allowed: true, retryAfterSec: 0 };
    },
    size: () => hits.size,
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
  return candidate ? normaliseAddress(candidate) : "unknown";
}

/*
 * The bucket an address belongs to.
 *
 * IPv4: the address. IPv6: its /64 prefix, because one subscriber is
 * routinely handed a whole /64 and can pick a new address from it per
 * request; keying the full address would hand them 2^64 buckets. An
 * IPv4-mapped IPv6 address (::ffff:203.0.113.7, what a dual-stack socket
 * reports for an IPv4 peer) is the IPv4 client and keys as such.
 */
function normaliseAddress(raw: string): string {
  const address = raw.replace(/%.*$/, ""); // drop an IPv6 zone id
  const family = isIP(address);
  if (family === 4) return address;
  if (family !== 6) return "unknown";

  const mapped = /^(?:0{0,4}:){0,5}:?ffff:(\d{1,3}(?:\.\d{1,3}){3})$/i.exec(address);
  if (mapped && isIP(mapped[1]) === 4) return mapped[1];

  const groups = expandIPv6(address);
  return groups ? `${groups.slice(0, 4).join(":")}::/64` : "unknown";
}

/** The eight 16-bit groups of a valid IPv6 address, lower-case and unpadded. */
function expandIPv6(address: string): string[] | null {
  let text = address.toLowerCase();
  // An embedded IPv4 tail (e.g. 64:ff9b::192.0.2.1) is two groups.
  const v4 = /(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(text);
  if (v4) {
    const [a, b, c, d] = v4.slice(1).map(Number);
    text = `${text.slice(0, v4.index)}${((a << 8) | b).toString(16)}:${((c << 8) | d).toString(16)}`;
  }
  const [head, tail] = text.split("::");
  const left = head ? head.split(":") : [];
  const right = tail !== undefined && tail !== "" ? tail.split(":") : [];
  const fill = tail === undefined ? 0 : 8 - left.length - right.length;
  const groups = [...left, ...Array<string>(Math.max(0, fill)).fill("0"), ...right];
  if (groups.length !== 8) return null;
  return groups.map((g) => parseInt(g, 16).toString(16));
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
