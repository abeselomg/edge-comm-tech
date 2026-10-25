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

  it("trips on a non-empty file part with the honeypot's name", () => {
    const file = new File(["x"], "a.txt");
    expect(isHoneypotTripped({}, { website_url: [file] })).toBe(true);
    expect(isHoneypotTripped({}, { website_url: [] })).toBe(false);
    expect(isHoneypotTripped({}, { cv: [file] })).toBe(false);
    // An empty unnamed part is what a browser sends for an unchosen file.
    expect(isHoneypotTripped({}, { website_url: [new File([], "")] })).toBe(false);
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

  it("never holds more than maxKeys buckets", () => {
    const limiter = createLimiter({ max: 5, windowMs: 60_000, now: () => 0, maxKeys: 50 });
    for (let i = 0; i < 1_000; i += 1) {
      limiter.check(`k${i}`);
      expect(limiter.size()).toBeLessThanOrEqual(50);
    }
  });

  it("evicts a bucket with room before a limited one, so new keys cannot reset a limited client", () => {
    let t = 0;
    const limiter = createLimiter({ max: 2, windowMs: 60_000, now: () => t, maxKeys: 3 });
    limiter.check("limited");
    limiter.check("limited");
    expect(limiter.check("limited").allowed).toBe(false);
    for (let i = 0; i < 100; i += 1) {
      t += 1;
      limiter.check(`fresh${i}`);
    }
    expect(limiter.size()).toBeLessThanOrEqual(3);
    expect(limiter.check("limited").allowed).toBe(false);
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

  it("keys IPv6 by its /64, so one client cannot rotate addresses inside it", () => {
    const a = clientKey(h({ "x-forwarded-for": "2001:db8:1:2::1" }), 1);
    const b = clientKey(h({ "x-forwarded-for": "2001:0db8:0001:0002:ffff:eeee:dddd:cccc" }), 1);
    const other = clientKey(h({ "x-forwarded-for": "2001:db8:1:3::1" }), 1);
    expect(a).toBe(b);
    expect(a).not.toBe(other);
    expect(a).not.toBe("unknown");
    expect(clientKey(h({ "x-forwarded-for": "::1" }), 1)).toBe(clientKey(h({ "x-forwarded-for": "0:0:0:0::2" }), 1));
  });

  it("keys IPv4-mapped IPv6 as the IPv4 address", () => {
    expect(clientKey(h({ "x-forwarded-for": "::ffff:203.0.113.7" }), 1)).toBe("203.0.113.7");
    expect(clientKey(h({ "x-forwarded-for": "::FFFF:203.0.113.7" }), 1)).toBe("203.0.113.7");
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
