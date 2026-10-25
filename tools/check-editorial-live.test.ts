// @ts-nocheck -- exercises plain .mjs tools whose parameter types TypeScript can only infer from their defaults
import { describe, expect, it } from "vitest";
import {
  BANNER_TEXT,
  BYPASS_COOKIE,
  buildRequest,
  classifyAnonDraftList,
  classifyAnonDraftRead,
  classifyAnonGraphqlVersions,
  classifyAnonVersions,
  classifyPublishedView,
  createJar,
  createHttp,
  frameProtection,
  holdsFor,
  login,
  maskSecrets,
  parseSetCookie,
  pollUntil,
  readCreds,
  relatedDraftFinding,
  runProbe,
  sameContent,
  setCookiesOf,
  shows,
  titlesFor,
  writableCopy,
} from "./check-editorial-live.mjs";
import { MARKER } from "./forms-live-shared.mjs";

/* A clock whose sleep advances it, so polling needs no real time. */
function fakeClock() {
  let t = 1_000_000;
  const sleeps: number[] = [];
  return { now: () => t, sleep: async (ms: number) => { sleeps.push(ms); t += ms; }, sleeps };
}

describe("Set-Cookie handling", () => {
  it("reads every cookie from getSetCookie, and splits a joined header without breaking Expires", () => {
    const h = new Headers();
    h.append("set-cookie", "payload-token=abc; Path=/; HttpOnly; SameSite=Lax");
    h.append("set-cookie", "__prerender_bypass=xyz; Path=/; SameSite=None; Secure");
    expect(setCookiesOf(h)).toHaveLength(2);
    const joined = { get: () => "a=1; Expires=Wed, 01 Jan 2031 00:00:00 GMT; Path=/, b=2; Path=/" };
    expect(setCookiesOf(joined)).toEqual(["a=1; Expires=Wed, 01 Jan 2031 00:00:00 GMT; Path=/", "b=2; Path=/"]);
    expect(setCookiesOf(undefined)).toEqual([]);
  });

  it("parses name, value and lowercased attributes", () => {
    expect(parseSetCookie("__prerender_bypass=v=1; Path=/; SameSite=None; Secure")).toEqual({
      name: "__prerender_bypass",
      value: "v=1",
      attrs: { path: "/", samesite: "None", secure: true },
    });
    expect(parseSetCookie("garbage")).toBeNull();
  });

  it("a jar merges later cookies over earlier ones, drops expired ones, and joins a Cookie header", () => {
    const jar = createJar();
    expect(jar.header()).toBeUndefined();
    const first = new Headers();
    first.append("set-cookie", "a=1; Path=/");
    first.append("set-cookie", "b=2; Path=/");
    jar.absorb(first);
    const second = new Headers();
    second.append("set-cookie", "a=3; Path=/");
    second.append("set-cookie", "b=; Max-Age=0; Path=/");
    jar.absorb(second);
    expect(jar.header()).toBe("a=3");
    expect(jar.has("b")).toBe(false);
  });
});

describe("masking", () => {
  it("replaces passwords and tokens, and any session or bypass cookie value", () => {
    const line = "login p@ssw0rd-long Cookie: payload-token=eyJhbGciOi.x.y; __prerender_bypass=abcdef; other=keep";
    const masked = maskSecrets(line, ["p@ssw0rd-long"]);
    expect(masked).not.toContain("p@ssw0rd-long");
    expect(masked).not.toContain("eyJhbGciOi");
    expect(masked).not.toContain("abcdef");
    expect(masked).toContain("other=keep");
  });

  it("ignores empty and too-short secrets instead of mangling the text", () => {
    expect(maskSecrets("hello world", ["", undefined as unknown as string, "o"])).toBe("hello world");
  });
});

describe("request building", () => {
  it("sends JSON with a content type, the cookie, and never a body on GET", () => {
    const post = buildRequest({ method: "POST", cookie: "payload-token=t", json: { a: 1 } });
    expect(post.body).toBe('{"a":1}');
    expect(post.headers["content-type"]).toBe("application/json");
    expect(post.headers.cookie).toBe("payload-token=t");
    const get = buildRequest({ redirect: "manual" });
    expect(get.method).toBe("GET");
    expect(get.body).toBeUndefined();
    expect(get.headers.cookie).toBeUndefined();
    expect(get.redirect).toBe("manual");
  });

  it("login keeps the payload-token cookie, falls back to the token, and never echoes the password", async () => {
    const withCookie = async () =>
      new Response(JSON.stringify({ token: "T", user: { id: 1 } }), { status: 200, headers: { "set-cookie": "payload-token=C; Path=/" } });
    const http1 = createHttp({ base: "http://x", fetchImpl: withCookie as unknown as typeof fetch });
    expect((await login(http1, "e@x", "pw")).jar.header()).toBe("payload-token=C");
    const bare = async () => new Response(JSON.stringify({ token: "T" }), { status: 200 });
    const http2 = createHttp({ base: "http://x", fetchImpl: bare as unknown as typeof fetch });
    expect((await login(http2, "e@x", "pw")).jar.header()).toBe("payload-token=T");
    const denied = async () => new Response("{}", { status: 401 });
    const http3 = createHttp({ base: "http://x", fetchImpl: denied as unknown as typeof fetch });
    await expect(login(http3, "e@x", "hunter2-secret")).rejects.toThrow(/401/);
    await expect(login(http3, "e@x", "hunter2-secret")).rejects.not.toThrow(/hunter2/);
  });
});

describe("polling", () => {
  it("returns as soon as the condition holds, sleeping between attempts", async () => {
    const clock = fakeClock();
    let n = 0;
    const res = await pollUntil(async () => ++n, (v) => v === 3, { timeoutMs: 20000, intervalMs: 1000, ...clock });
    expect(res).toMatchObject({ ok: true, value: 3, attempts: 3 });
    expect(clock.sleeps).toEqual([1000, 1000]);
  });

  it("gives up at the deadline with the last value", async () => {
    const clock = fakeClock();
    const res = await pollUntil(async () => "nope", () => false, { timeoutMs: 5000, intervalMs: 1000, ...clock });
    expect(res.ok).toBe(false);
    expect(res.value).toBe("nope");
    expect(clock.sleeps.reduce((a, b) => a + b, 0)).toBeLessThanOrEqual(5000);
  });

  it("holdsFor passes only when every sample holds, and reports the first that does not", async () => {
    const clock = fakeClock();
    expect((await holdsFor(async () => 1, (v) => v === 1, { forMs: 6000, intervalMs: 2000, ...clock })).ok).toBe(true);
    let n = 0;
    const broken = await holdsFor(async () => ++n, (v) => v < 3, { forMs: 60000, intervalMs: 2000, ...clock });
    expect(broken).toMatchObject({ ok: false, value: 3 });
  });
});

describe("content helpers", () => {
  it("the two titles are marked and neither contains the other", () => {
    const { oldTitle, newTitle } = titlesFor("42");
    expect(oldTitle).toContain(MARKER);
    expect(newTitle).toContain(MARKER);
    expect(newTitle.includes(oldTitle)).toBe(false);
    expect(oldTitle.includes(newTitle)).toBe(false);
  });

  it("shows() sees raw and HTML-escaped titles", () => {
    expect(shows(`<h1>${MARKER} a</h1>`, `${MARKER} a`)).toBe(true);
    expect(shows("<h1>Tom &amp; Jerry</h1>", "Tom & Jerry")).toBe(true);
    expect(shows("<h1>other</h1>", `${MARKER} a`)).toBe(false);
  });

  it("a read global is written back without system fields, and compared ignoring timestamps", () => {
    const read = { id: 1, globalType: "contact-details", createdAt: "a", updatedAt: "b", _status: "published", email: "x", nested: { b: 2, a: 1 } };
    expect(writableCopy(read)).toEqual({ email: "x", nested: { b: 2, a: 1 } });
    expect(sameContent(read, { ...read, updatedAt: "c", nested: { a: 1, b: 2 } })).toBe(true);
    expect(sameContent(read, { ...read, email: "y" })).toBe(false);
  });

  it("reads frame protection from either header, and flags when there is none", () => {
    expect(frameProtection(new Headers()).missing).toBe(true);
    expect(frameProtection(new Headers({ "x-frame-options": "DENY" })).missing).toBe(false);
    const csp = frameProtection(new Headers({ "content-security-policy": "default-src 'self'; frame-ancestors 'none'" }));
    expect(csp.frameAncestors).toBe("frame-ancestors 'none'");
    expect(csp.missing).toBe(false);
  });

  it("names the missing environment variables without values", () => {
    expect(() => readCreds({ EDITOR_EMAIL: "e", EDITOR_PASSWORD: "secretvalue" })).toThrow(/ADMIN_EMAIL, ADMIN_PASSWORD/);
    expect(() => readCreds({ EDITOR_EMAIL: "e", EDITOR_PASSWORD: "secretvalue" })).not.toThrow(/secretvalue/);
    expect(readCreds({ EDITOR_EMAIL: "e", EDITOR_PASSWORD: "p", ADMIN_EMAIL: "a", ADMIN_PASSWORD: "q" })).toMatchObject({ adminEmail: "a" });
  });
});

describe("the anonymous API classifiers", () => {
  const t = { oldTitle: "Old one", newTitle: "New one" };
  const r = (status: number, json: unknown) => ({ status, json, text: JSON.stringify(json) });

  it("a ?draft=true read must return the published title", () => {
    expect(classifyAnonDraftRead(r(200, { id: 7, title: "Old one" }), t)).toBeNull();
    expect(classifyAnonDraftRead(r(200, { id: 7, title: "New one" }), t)).toMatch(/LEAK/);
    expect(classifyAnonDraftRead(r(404, {}), t)).toMatch(/expected 200/);
    expect(classifyAnonDraftRead(r(200, { id: 7, title: "Other" }), t)).toMatch(/published title/);
  });

  it("a draft listing must be empty and must not include the test doc", () => {
    expect(classifyAnonDraftList(r(200, { docs: [], totalDocs: 0 }), { id: 7, newTitle: "New one" })).toBeNull();
    expect(classifyAnonDraftList(r(200, { docs: [{ id: 7 }], totalDocs: 1 }), { id: 7, newTitle: "New one" })).toMatch(/LEAK.*test document/);
    expect(classifyAnonDraftList(r(200, { docs: [{ id: 9 }], totalDocs: 1 }), { id: 7, newTitle: "New one" })).toMatch(/totalDocs 0/);
    expect(classifyAnonDraftList(r(200, { docs: [{ id: 9, title: "New one" }], totalDocs: 1 }), { id: 7, newTitle: "New one" })).toMatch(/LEAK/);
    expect(classifyAnonDraftList(r(500, {}), { id: 7, newTitle: "New one" })).toMatch(/expected 200/);
  });

  it("a versions read must be 401 or 403", () => {
    expect(classifyAnonVersions(r(401, {}))).toBeNull();
    expect(classifyAnonVersions(r(403, {}))).toBeNull();
    expect(classifyAnonVersions(r(200, { docs: [] }))).toMatch(/401\/403/);
    expect(classifyAnonVersions(r(404, {}))).toMatch(/401\/403/);
    expect(classifyAnonVersions(r(403, { m: "New one" }), { newTitle: "New one" })).toMatch(/LEAK/);
  });

  it("GraphQL versions must answer with errors and no data", () => {
    expect(classifyAnonGraphqlVersions(r(200, { errors: [{ message: "no" }], data: { versionsNews: null } }))).toBeNull();
    expect(classifyAnonGraphqlVersions(r(200, { errors: [{ message: "no" }] }))).toBeNull();
    expect(classifyAnonGraphqlVersions(r(200, { data: { versionsNews: { totalDocs: 0 } } }))).toMatch(/LEAK/);
    expect(classifyAnonGraphqlVersions(r(200, { errors: [{ message: "x" }], data: { versionsNews: { totalDocs: 2 } } }))).toMatch(/LEAK/);
    expect(classifyAnonGraphqlVersions(r(404, null))).toMatch(/errors array/);
  });

  it("a published view needs 200, the old title, no draft title and no banner", () => {
    const page = (status: number, text: string) => ({ status, text, json: null });
    expect(classifyPublishedView(page(200, "Old one"), t, "x")).toBeNull();
    expect(classifyPublishedView(page(200, "New one"), t, "x")).toMatch(/draft title/);
    expect(classifyPublishedView(page(200, `Old one ${BANNER_TEXT}`), t, "x")).toMatch(/banner/);
    expect(classifyPublishedView(page(404, ""), t, "x")).toMatch(/expected 200/);
    expect(classifyPublishedView(page(200, "nothing"), t, "x")).toMatch(/published title is missing/);
  });
});

/* --------------------------------------------------- a fake server, end to end */

const creds = { editorEmail: "editor-probe@example.invalid", editorPassword: "editor-password-0123456789", adminEmail: "admin-probe@example.invalid", adminPassword: "admin-password-0123456789" };

/*
 * The fake site follows the fixed rule: a draft is shown only for the bypass
 * cookie AND a live staff session. `bypassAloneShowsDraft` restores the old,
 * wrong behaviour (cookie alone is enough) so the probe can be seen to catch it;
 * `leakApi` makes the anonymous API hand out the draft.
 */
function fakeServer(opts: { failPublish?: boolean; bypassAloneShowsDraft?: boolean; leakApi?: boolean } = {}) {
  const state = { exists: false, published: false, title: "", draftTitle: "", deleted: false, requests: [] as string[], contact: { id: 1, email: "x@y.z", updatedAt: "t0" }, revoked: new Set<string>(), logins: 0 };
  const BYP = "BYPASSVALUE123";
  const json = (status: number, body: unknown, headers: Record<string, string> = {}) => new Response(JSON.stringify(body), { status, headers });
  const tokenOf = (c: string) => /payload-token=([^;\s]+)/.exec(c)?.[1] ?? null;
  const role = (c: string) => {
    const t = tokenOf(c);
    if (!t || state.revoked.has(t)) return null;
    return t.startsWith("tok-admin") ? "admin" : t.startsWith("tok-editor") ? "editor" : null;
  };
  const fetchImpl = async (url: string, init: RequestInit & { headers: Record<string, string> }) => {
    const u = new URL(url);
    const p = u.pathname;
    const method = init.method ?? "GET";
    const cookie = init.headers.cookie ?? "";
    const who = role(cookie);
    const body = init.body ? JSON.parse(init.body as string) : {};
    state.requests.push(`${method} ${p}${u.search} ${who ?? "anon"}`);
    if (p === "/api/users/login") {
      const admin = body.email === creds.adminEmail;
      state.logins += 1;
      const tok = `${admin ? "tok-admin" : "tok-editor"}-${state.logins}`;
      return json(200, { token: tok, user: { id: admin ? 1 : 2, name: admin ? "A" : "E", role: admin ? "admin" : "editor" } }, { "set-cookie": `payload-token=${tok}; Path=/; HttpOnly` });
    }
    if (p === "/api/users/logout" && method === "POST") {
      const t = tokenOf(cookie);
      if (t) state.revoked.add(t);
      return json(200, { message: "ok" }, { "set-cookie": "payload-token=; Path=/; Max-Age=0" });
    }
    if (p === "/") return new Response("<html>home</html>", { status: 200 });
    if (p === "/news") return new Response(state.published ? state.title : "list", { status: 200 });
    if (p === "/blog") return new Response("blog", { status: 200 });
    if (p.startsWith("/news/automated")) {
      const draft = cookie.includes(`${BYPASS_COOKIE}=${BYP}`) && (opts.bypassAloneShowsDraft || who !== null);
      if (draft) return new Response(`${state.draftTitle || state.title} ${BANNER_TEXT}`, { status: 200 });
      return state.published ? new Response(state.title, { status: 200 }) : new Response("nf", { status: 404 });
    }
    if (p === "/api/news/7" && method === "GET") return json(200, { id: 7, title: opts.leakApi ? state.draftTitle : state.title });
    if (p === "/api/news" && method === "GET") return json(200, opts.leakApi ? { docs: [{ id: 7, title: state.draftTitle }], totalDocs: 1 } : { docs: [], totalDocs: 0 });
    if (p === "/api/news/versions" || p === "/api/globals/contact-details/versions") return who ? json(200, { docs: [] }) : json(opts.leakApi ? 200 : 403, { docs: [] });
    if (p === "/api/graphql") return json(200, opts.leakApi ? { data: { versionsNews: { totalDocs: 3 } } } : { errors: [{ message: "You are not allowed to perform this action." }], data: { versionsNews: null } });
    if (p === "/preview") {
      if (who !== "editor" && who !== "admin") return new Response("no", { status: 401 });
      const path = u.searchParams.get("path") ?? "";
      if (!path.startsWith("/news/")) return new Response("bad", { status: 400 });
      return new Response(null, { status: 307, headers: { location: path, "set-cookie": `${BYPASS_COOKIE}=${BYP}; Path=/; SameSite=None; Secure` } });
    }
    if (p === "/api/news" && method === "POST") { state.exists = true; state.title = body.title; return json(201, { doc: { id: 7 } }); }
    if (p === "/api/news/7" && method === "PATCH") {
      if (u.searchParams.get("autosave")) { state.draftTitle = body.title; return json(200, { doc: { id: 7 } }); }
      if (body._status === "published") { if (opts.failPublish) throw new Error("socket hang up"); state.published = true; state.title = body.title ?? state.title; }
      if (body._status === "draft") state.published = false;
      return json(200, { doc: { id: 7 } });
    }
    if (p === "/api/news/7" && method === "DELETE") {
      if (who !== "admin") return json(403, {});
      state.deleted = true;
      return json(200, { doc: { id: 7 } });
    }
    if (p === "/api/globals/contact-details") {
      if (who !== "admin") return json(403, {});
      if (method === "PATCH") state.contact.updatedAt = "t1";
      return json(200, state.contact);
    }
    if (p === "/api/globals/site-settings") return who === "admin" ? json(200, {}) : json(403, {});
    if (p === "/api/users" && method === "POST") return json(403, {});
    if (p === "/api/users" && method === "GET") return json(403, {});
    if (p === "/api/users/1") return json(404, {});
    if (p === "/api/users/2") return json(200, { doc: { id: 2, role: "editor" } });
    if (p === "/api/users/me") return json(200, { user: { id: 2, role: "editor" } });
    if (p === "/api/forms" && method === "GET") return json(200, { docs: [{ id: 3 }] });
    if (p === "/api/forms/3") return json(403, {});
    if (p === "/api/form-submissions" || p === "/api/applications") return json(200, { docs: [] });
    if (p.startsWith("/api/form-submissions/") || p.startsWith("/api/applications/")) return json(403, {});
    if (p === "/api/solutions") return json(200, { docs: [] });
    return json(500, { unexpected: `${method} ${p}` });
  };
  return { fetchImpl: fetchImpl as unknown as typeof fetch, state };
}

describe("runProbe against a fake server", () => {
  it("passes every check, removes the test document, and never prints a secret", async () => {
    const clock = fakeClock();
    const lines: string[] = [];
    const { fetchImpl, state } = fakeServer();
    const res = await runProbe({ base: "http://x", creds, fetchImpl, log: (l: string) => lines.push(l), run: "99", ...clock });
    const failed = res.results.filter((r: { ok: boolean }) => !r.ok);
    expect(failed).toEqual([]);
    expect(state.deleted).toBe(true);
    expect(res.leftover).toEqual([]);
    expect(res.removed).toContain("news:7");
    const all = lines.join("\n");
    for (const secret of [creds.editorPassword, creds.adminPassword, "tok-editor", "tok-admin", "BYPASSVALUE123"]) expect(all).not.toContain(secret);
    expect(all).toMatch(/WARN i-frame-protection/);
    expect(all).toMatch(/skipped: no published solution/);
    // the destructive role probes use an id no row has
    expect(state.requests.some((r) => r.startsWith("DELETE /api/form-submissions/2147483000"))).toBe(true);
  });

  it("cleans up with the admin session when a check blows up half way", async () => {
    const clock = fakeClock();
    const { fetchImpl, state } = fakeServer({ failPublish: true });
    const res = await runProbe({ base: "http://x", creds, fetchImpl, log: () => {}, run: "99", pollMs: 3000, holdMs: 2000, ...clock });
    expect(res.results.some((r: { ok: boolean; name: string }) => !r.ok && r.name === "c-editor-publishes")).toBe(true);
    expect(state.deleted).toBe(true);
    expect(state.requests.filter((r) => r === "DELETE /api/news/7 admin").length).toBeGreaterThanOrEqual(1);
    expect(res.leftover).toEqual([]);
  });

  it("checks the preview cookie alone, with the session, and after logout, then signs the editor back in", async () => {
    const clock = fakeClock();
    const lines: string[] = [];
    const { fetchImpl, state } = fakeServer();
    const res = await runProbe({ base: "http://x", creds, fetchImpl, log: (l: string) => lines.push(l), run: "99", ...clock });
    const names = res.results.map((r: { name: string }) => r.name);
    for (const n of ["e-bypass-cookie-alone-shows-published", "e-bypass-plus-session-shows-draft", "e-forged-bypass-shows-published", "e-logout-ends-preview", "e-editor-signs-back-in", "e-old-bypass-with-new-session-shows-draft"]) expect(names).toContain(n);
    expect(names).not.toContain("e-bypass-cookie-alone-shows-draft");
    expect(state.requests.some((r) => r === "POST /api/users/logout editor")).toBe(true);
    // the steps after the logout still ran as the editor, on the new session
    expect(state.requests.some((r) => r.startsWith("PATCH /api/news/7") && r.endsWith("editor"))).toBe(true);
    expect(res.results.filter((r: { ok: boolean }) => !r.ok)).toEqual([]);
    expect(lines.join("\n")).toMatch(/old session token after logout: rejected/);
  });

  it("FAILS when the bypass cookie alone shows the draft (the stale-cookie leak)", async () => {
    const clock = fakeClock();
    const { fetchImpl } = fakeServer({ bypassAloneShowsDraft: true });
    const res = await runProbe({ base: "http://x", creds, fetchImpl, log: () => {}, run: "99", ...clock });
    const failed = res.results.filter((r: { ok: boolean }) => !r.ok).map((r: { name: string }) => r.name);
    expect(failed).toEqual(["e-bypass-cookie-alone-shows-published", "e-logout-ends-preview"]);
    expect(res.leftover).toEqual([]);
  });

  it("FAILS each anonymous API check when the API hands out the draft", async () => {
    const clock = fakeClock();
    const { fetchImpl } = fakeServer({ leakApi: true });
    const res = await runProbe({ base: "http://x", creds, fetchImpl, log: () => {}, run: "99", ...clock });
    const failed = res.results.filter((r: { ok: boolean }) => !r.ok).map((r: { name: string }) => r.name);
    expect(failed).toEqual([
      "d-anon-api-draft-read-shows-published",
      "d-anon-api-draft-list-empty",
      "d-anon-news-versions-refused",
      "d-anon-contact-details-versions-refused",
      "d-anon-graphql-versions-refused",
    ]);
  });

  it("probes the extra unsafe preview paths", async () => {
    const clock = fakeClock();
    const { fetchImpl, state } = fakeServer();
    await runProbe({ base: "http://x", creds, fetchImpl, log: () => {}, run: "99", ...clock });
    for (const bad of ["/\\evil", "/%2Fevil", "/unknown-page"]) {
      expect(state.requests).toContain(`GET /preview?path=${encodeURIComponent(bad)} editor`);
    }
  });

  it("stops with one failed login check when the password is wrong, and deletes nothing", async () => {
    const lines: string[] = [];
    const denied = (async () => new Response("{}", { status: 401 })) as unknown as typeof fetch;
    const res = await runProbe({ base: "http://x", creds, fetchImpl: denied, log: (l: string) => lines.push(l), run: "1" });
    expect(res.results).toHaveLength(1);
    expect(res.results[0].ok).toBe(false);
    expect(lines.join("\n")).not.toContain(creds.editorPassword);
  });
});

describe("the related-draft finding", () => {
  const timing = { now: fakeClock().now, sleep: async () => {} };
  const ok = (doc: unknown) => ({ status: 200, json: { doc, docs: [{ id: 5 }] }, text: "" });

  it("reports LEAK when the draft topic's label is on the published page, and tracks both documents for cleanup", async () => {
    const created: { key: string }[] = [];
    const api = async () => ok({ id: 11 });
    const pub = async () => ({ status: 200, text: `${MARKER} insight 1 ${MARKER} topic 1` });
    const line = await relatedDraftFinding({ api, pub, created, removed: [], run: "1", pollMs: 1000, timing } as never);
    expect(line).toMatch(/LEAK/);
    expect(line).not.toMatch(/NO LEAK/);
    expect(created.map((c) => c.key)).toEqual(["postCategories:11", "posts:11"]);
  });

  it("reports NO LEAK when only the insight shows, and skips when there is no solution", async () => {
    const api = async () => ok({ id: 11 });
    const pub = async () => ({ status: 200, text: `${MARKER} insight 1` });
    expect(await relatedDraftFinding({ api, pub, created: [], removed: [], run: "1", pollMs: 1000, timing } as never)).toMatch(/NO LEAK/);
    const none = async () => ({ status: 200, json: { docs: [] }, text: "" });
    expect(await relatedDraftFinding({ api: none, pub, created: [], removed: [], run: "1", pollMs: 1000, timing } as never)).toMatch(/skipped/);
  });
});
