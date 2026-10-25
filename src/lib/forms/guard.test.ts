import { describe, expect, it } from "vitest";

import { HONEYPOT_FIELD, clientKey, createDeduper, createLimiter, hashClientKey, isHoneypotTripped } from "./guard";

describe("isHoneypotTripped", () => {
  it("uses the field name website_url", () => {
    expect(HONEYPOT_FIELD).toBe("website_url");
  });

  it("is tripped by any non-empty value", () => {
    expect(isHoneypotTripped({ website_url: "http://spam.test" })).toBe(true);
    expect(isHoneypotTripped({ website_url: ["", "x"] })).toBe(true);
    expect(isHoneypotTripped({ website_url: true })).toBe(true);
  });

  it("is not tripped when absent or empty", () => {
    expect(isHoneypotTripped({})).toBe(false);
    expect(isHoneypotTripped({ website_url: "" })).toBe(false);
    expect(isHoneypotTripped({ website_url: "   " })).toBe(false);
  });
});

describe("createLimiter", () => {
  const clock = (start = 1_000_000) => {
    let t = start;
    return { now: () => t, advance: (ms: number) => (t += ms) };
  };

  it("allows max, blocks max+1 with a positive Retry-After, and recovers after the window", () => {
    const c = clock();
    const limiter = createLimiter({ max: 5, windowMs: 600_000, now: c.now });
    for (let i = 0; i < 5; i += 1) expect(limiter.check("a").allowed).toBe(true);
    const blocked = limiter.check("a");
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSec).toBeGreaterThan(0);
    expect(blocked.retryAfterSec).toBeLessThanOrEqual(600);

    c.advance(600_001);
    expect(limiter.check("a").allowed).toBe(true);
  });

  it("slides: the oldest hit leaving the window frees one slot", () => {
    const c = clock();
    const limiter = createLimiter({ max: 2, windowMs: 10_000, now: c.now });
    limiter.check("a");
    c.advance(5_000);
    limiter.check("a");
    expect(limiter.check("a").allowed).toBe(false);
    c.advance(5_001);
    expect(limiter.check("a").allowed).toBe(true);
    expect(limiter.check("a").allowed).toBe(false);
  });

  it("keeps keys independent", () => {
    const limiter = createLimiter({ max: 1, windowMs: 60_000, now: () => 0 });
    expect(limiter.check("a").allowed).toBe(true);
    expect(limiter.check("a").allowed).toBe(false);
    expect(limiter.check("b").allowed).toBe(true);
  });

  it("does not count blocked attempts against the recovery", () => {
    const c = clock();
    const limiter = createLimiter({ max: 1, windowMs: 1_000, now: c.now });
    limiter.check("a");
    for (let i = 0; i < 10; i += 1) limiter.check("a");
    c.advance(1_001);
    expect(limiter.check("a").allowed).toBe(true);
  });
});

describe("clientKey", () => {
  const h = (init: Record<string, string>) => new Headers(init);

  it("takes the address trustedProxies hops from the right of x-forwarded-for", () => {
    expect(clientKey(h({ "x-forwarded-for": "203.0.113.7" }), 1)).toBe("203.0.113.7");
    expect(clientKey(h({ "x-forwarded-for": "203.0.113.7, 10.0.0.2" }), 2)).toBe("203.0.113.7");
    expect(clientKey(h({ "x-forwarded-for": "203.0.113.7, 10.0.0.2" }), 1)).toBe("10.0.0.2");
  });

  it("ignores entries a client injected at the front", () => {
    // nginx appends the real peer to whatever the client sent.
    const spoofed = h({ "x-forwarded-for": "1.1.1.1, 2.2.2.2, 203.0.113.7" });
    expect(clientKey(spoofed, 1)).toBe("203.0.113.7");
    const other = h({ "x-forwarded-for": "9.9.9.9, 203.0.113.7" });
    expect(clientKey(other, 1)).toBe(clientKey(spoofed, 1));
  });

  it("falls back to a stable unknown key", () => {
    expect(clientKey(h({}), 1)).toBe("unknown");
    expect(clientKey(h({ "x-forwarded-for": "" }), 1)).toBe("unknown");
    expect(clientKey(h({ "x-forwarded-for": "203.0.113.7" }), 2)).toBe("unknown");
    expect(clientKey(h({ "x-forwarded-for": "203.0.113.7" }), 0)).toBe("unknown");
    expect(clientKey(h({ "x-forwarded-for": "not an address" }), 1)).toBe("unknown");
  });
});

describe("hashClientKey", () => {
  it("is salted by the secret, stable, and never the raw address", () => {
    const a = hashClientKey("203.0.113.7", "secret-one");
    expect(a).toBe(hashClientKey("203.0.113.7", "secret-one"));
    expect(a).not.toBe(hashClientKey("203.0.113.7", "secret-two"));
    expect(a).not.toContain("203.0.113.7");
    expect(a).toMatch(/^[0-9a-f]{64}$/);
  });
});

describe("createDeduper", () => {
  it("reports a repeat within the window, forgets after it, and can be told to forget", () => {
    let t = 0;
    const d = createDeduper({ windowMs: 10_000, now: () => t });
    expect(d.seen("k")).toBe(false);
    expect(d.seen("k")).toBe(true);
    t = 10_001;
    expect(d.seen("k")).toBe(false);
    d.forget("k");
    expect(d.seen("k")).toBe(false);
  });
});
