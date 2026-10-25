/*
 * Does the editorial workflow behave on the live server?
 *
 * An HTTP-only probe, run from a developer machine against BASE_URL. It signs two
 * throwaway users in over the REST API (an editor and an admin, created on the
 * server by tools/editorial-live-setup.mjs), creates one disposable News item,
 * and walks it through the whole editorial life:
 *
 *   a  anonymous baseline: the title the probe will create is nowhere public
 *   b  editor saves a DRAFT: its public URL is 404
 *   c  editor PUBLISHES: the URL becomes 200 and shows the title
 *   d  editor AUTOSAVES a new title as a draft: the public page keeps the OLD title
 *      ... and the draft does not leak through the API either: anonymous
 *      ?draft=true reads, the versions endpoints and GraphQL versions
 *   e  /preview: editor session -> 307 + __prerender_bypass; that cookie ALONE
 *      shows the PUBLISHED title and no banner; cookie + editor session shows
 *      the NEW title and the banner; a forged cookie shows neither; no
 *      session -> 401; unsafe paths -> 400; after the editor logs out the old
 *      cookie (still valid for this build) shows the published page again
 *   f  editor publishes the change: the public page shows the NEW title, no redeploy
 *   g  editor UNPUBLISHES: the URL is 404 again
 *   h  role gating: editor POST to contact-details / site-settings -> 403 (a
 *      global updates with POST); /api/access shows contact-details update,
 *      users create and news delete allowed for the admin and refused for the
 *      editor (no live global is written); users, forms, submissions,
 *      applications, delete
 *   i  response headers on the home page (frame-ancestors / X-Frame-Options)
 *   j  a best-effort, NON-FAILING finding: does a published page show the title of
 *      a related document that is only a draft?
 *
 * Everything it creates is removed in a `finally` (by the admin session), even
 * when a check throws. Credentials come from the environment and are never
 * printed: every line of output passes through maskSecrets.
 *
 * Usage (BASE_URL defaults to http://localhost:3000):
 *   # on the server, from the app directory, with the environment loaded:
 *   NODE_ENV=production npx payload run tools/editorial-live-setup.mjs   # prints nothing secret
 *   EDITORIAL_SETUP_MODE=create NODE_ENV=production npx payload run tools/editorial-live-setup.mjs
 *   # copy /root/editorial-probe.env into your shell WITHOUT echoing it, then:
 *   BASE_URL=https://168.119.61.125 NODE_TLS_REJECT_UNAUTHORIZED=0 \
 *     node --import tsx tools/check-editorial-live.mjs
 *   # afterwards, on the server:
 *   EDITORIAL_SETUP_MODE=delete NODE_ENV=production npx payload run tools/editorial-live-setup.mjs
 *
 * Needs EDITOR_EMAIL, EDITOR_PASSWORD, ADMIN_EMAIL, ADMIN_PASSWORD.
 */
import { pathToFileURL } from "node:url";
import { MARKER } from "./forms-live-shared.mjs";

export const SESSION_COOKIE = "payload-token";
export const BYPASS_COOKIE = "__prerender_bypass";
export const BANNER_TEXT = "Preview — unpublished changes are shown";
/** An id no row has; access is evaluated before the lookup, so 403 proves "denied" and 404 "allowed". */
export const ABSENT_ID = 2147483000;
export const UNSAFE_PREVIEW_PATHS = ["//evil.test", "https://evil.test", "/api/users", "/admin", "/\\evil", "/%2Fevil", "/unknown-page"];

/* ------------------------------------------------------------------ cookies */

/** Every Set-Cookie header of a response, as separate strings. */
export function setCookiesOf(headers) {
  if (!headers) return [];
  if (typeof headers.getSetCookie === "function") return headers.getSetCookie();
  const raw = typeof headers.get === "function" ? headers.get("set-cookie") : headers["set-cookie"];
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  // Split on commas that start a new cookie (name=), not the comma inside Expires=Wed, 01 Jan.
  return raw.split(/,(?=\s*[A-Za-z0-9_.-]+=)/).map((s) => s.trim());
}

/** { name, value, attrs } of one Set-Cookie string; attrs keys are lowercased. */
export function parseSetCookie(line) {
  const [pair, ...rest] = String(line).split(";");
  const eq = pair.indexOf("=");
  if (eq < 1) return null;
  const attrs = {};
  for (const part of rest) {
    const i = part.indexOf("=");
    const key = (i === -1 ? part : part.slice(0, i)).trim().toLowerCase();
    if (key) attrs[key] = i === -1 ? true : part.slice(i + 1).trim();
  }
  return { name: pair.slice(0, eq).trim(), value: pair.slice(eq + 1).trim(), attrs };
}

/** A cookie jar: later Set-Cookie headers replace earlier cookies of the same name; expired ones remove. */
export function createJar() {
  const cookies = new Map();
  return {
    absorb(headers) {
      for (const line of setCookiesOf(headers)) {
        const c = parseSetCookie(line);
        if (!c) continue;
        const expired = c.value === "" || c.attrs["max-age"] === "0" || Number(c.attrs["max-age"]) < 0;
        if (expired) cookies.delete(c.name);
        else cookies.set(c.name, c.value);
      }
    },
    set(name, value) {
      cookies.set(name, value);
    },
    get: (name) => cookies.get(name),
    has: (name) => cookies.has(name),
    /** The Cookie request header, or undefined when empty. */
    header() {
      return cookies.size ? [...cookies].map(([k, v]) => `${k}=${v}`).join("; ") : undefined;
    },
    values: () => [...cookies.values()],
  };
}

/* ------------------------------------------------------------------ masking */

/** Replace every secret (and anything that looks like a session cookie value) with ***. */
export function maskSecrets(text, secrets = []) {
  let out = String(text);
  for (const s of secrets) {
    if (typeof s === "string" && s.length >= 4) out = out.split(s).join("***");
  }
  return out.replace(/(payload-token|__prerender_bypass|__next_preview_data)=[^;\s,]+/g, "$1=***");
}

/* ----------------------------------------------------------------- requests */

/**
 * The fetch init for one call. `cookie` is the Cookie header (or undefined),
 * `json` an object to send as the body. Nothing here ever carries a credential
 * in a URL.
 */
export function buildRequest({ method = "GET", cookie, json, redirect, headers = {} }) {
  const h = { "cache-control": "no-cache", ...headers };
  if (cookie) h.cookie = cookie;
  const init = { method, headers: h };
  if (json !== undefined) {
    h["content-type"] = "application/json";
    init.body = JSON.stringify(json);
  }
  if (redirect) init.redirect = redirect;
  return init;
}

/** A thin client: http(method, path, opts) -> { status, headers, text, json, setCookies }. Never throws on HTTP status. */
export function createHttp({ base, fetchImpl }) {
  return async function http(method, path, opts = {}) {
    const res = await fetchImpl(`${base}${path}`, buildRequest({ method, ...opts }));
    const text = await res.text();
    let json = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      // not JSON: judged on status and text
    }
    return { status: res.status, headers: res.headers, text, json, setCookies: setCookiesOf(res.headers) };
  };
}

/** Log in; returns { jar, user } or throws a message that never contains the password. */
export async function login(http, email, password) {
  const res = await http("POST", "/api/users/login", { json: { email, password } });
  if (res.status !== 200) throw new Error(`login as ${email} answered ${res.status}`);
  const jar = createJar();
  jar.absorb(res.headers);
  if (!jar.has(SESSION_COOKIE)) {
    if (typeof res.json?.token !== "string") throw new Error(`login as ${email} set no ${SESSION_COOKIE} cookie and returned no token`);
    jar.set(SESSION_COOKIE, res.json.token);
  }
  return { jar, user: res.json?.user ?? null };
}

/* ------------------------------------------------------------------- polling */

/**
 * Poll `fn` until `ok(value)` or the time is up. Clock and sleep are injected so
 * tests need no real time. Returns { ok, value, attempts }.
 */
export async function pollUntil(fn, ok, { timeoutMs = 20000, intervalMs = 1000, now = Date.now, sleep } = {}) {
  const wait = sleep ?? ((ms) => new Promise((r) => setTimeout(r, ms)));
  const deadline = now() + timeoutMs;
  let attempts = 0;
  let value;
  for (;;) {
    attempts += 1;
    value = await fn();
    if (ok(value)) return { ok: true, value, attempts };
    if (now() + intervalMs > deadline) return { ok: false, value, attempts };
    await wait(intervalMs);
  }
}

/** True while `ok(value)` holds on every sample across `forMs`; returns the first failing value otherwise. */
export async function holdsFor(fn, ok, { forMs = 6000, intervalMs = 2000, now = Date.now, sleep } = {}) {
  const wait = sleep ?? ((ms) => new Promise((r) => setTimeout(r, ms)));
  const end = now() + forMs;
  let samples = 0;
  for (;;) {
    const value = await fn();
    samples += 1;
    if (!ok(value)) return { ok: false, value, samples };
    if (now() + intervalMs > end) return { ok: true, value, samples };
    await wait(intervalMs);
  }
}

/* ---------------------------------------------------------------- the content */

export function lexicalBody(text) {
  return {
    root: {
      type: "root",
      version: 1,
      direction: "ltr",
      format: "",
      indent: 0,
      children: [
        {
          type: "paragraph",
          version: 1,
          direction: "ltr",
          format: "",
          indent: 0,
          children: [{ type: "text", version: 1, text, format: 0, detail: 0, mode: "normal", style: "" }],
        },
      ],
    },
  };
}

/** Titles never contain one another, so "the old title is gone" cannot be a substring accident. */
export function titlesFor(run) {
  return { oldTitle: `${MARKER} alpha ${run}`, newTitle: `${MARKER} bravo ${run}` };
}

export function newsBody({ title, slug }) {
  return {
    title,
    slug,
    kind: MARKER,
    standfirst: `${MARKER} This item is created and removed by the editorial probe.`,
    archive: false,
    order: 999,
  };
}

const escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
/** Does the page text show this title (raw or HTML-escaped)? */
export function shows(text, title) {
  return typeof text === "string" && (text.includes(title) || text.includes(escapeHtml(title)));
}

/*
 * GET /api/access answers, for the signed-in user, what each collection and
 * global allows. This Payload version uses both shapes -- a bare boolean for
 * some operations and { permission: boolean, where? } for others -- so read
 * either. Asking it is how the probe checks the admin's write permission on a
 * live global without writing to it.
 */
export function allowed(entry) {
  if (entry === true) return true;
  return Boolean(entry) && typeof entry === "object" && entry.permission === true;
}

/** The admin-only operations the probe checks in /api/access, for both roles. */
export const ACCESS_CHECKS = [
  { label: "globals.contact-details.update", get: (a) => a?.globals?.["contact-details"]?.update },
  { label: "collections.users.create", get: (a) => a?.collections?.users?.create },
  { label: "collections.news.delete", get: (a) => a?.collections?.news?.delete },
];

/** null when every ACCESS_CHECKS entry is allowed (admin) or refused (editor) as expected. */
export function accessProblems(access, expectAllowed) {
  if (!access || typeof access !== "object") return "no access document in the /api/access response";
  const wrong = ACCESS_CHECKS.filter((c) => allowed(c.get(access)) !== expectAllowed).map((c) => c.label);
  if (!wrong.length) return null;
  return `${expectAllowed ? "expected allowed" : "expected refused"}: ${wrong.join(", ")}`;
}

/* ---------------------------------------------------------------- the verdicts */

/** Describe the frame-embedding protection of a response, and whether there is none. */
export function frameProtection(headers) {
  const get = (n) => (typeof headers?.get === "function" ? headers.get(n) : headers?.[n]) ?? null;
  const xfo = get("x-frame-options");
  const csp = get("content-security-policy");
  const fa = csp ? (/frame-ancestors[^;]*/i.exec(csp)?.[0] ?? null) : null;
  return { xfo, frameAncestors: fa, missing: !xfo && !fa };
}

const refused = (s) => s === 403 || s === 401;

/*
 * The anonymous API must not hand out a draft either. Each classifier takes the
 * probe's response object ({ status, text, json }) and returns null when all is
 * well or a problem string; they are pure so they are unit-tested directly.
 */

/** Anonymous GET /api/news/<id>?draft=true while a draft is pending: the published title, never the draft's. */
export function classifyAnonDraftRead(res, { oldTitle, newTitle }) {
  if (shows(res.text, newTitle)) return "LEAK: the anonymous ?draft=true read returned the draft title";
  if (res.status !== 200) return `expected 200 with the published title, got ${res.status}`;
  return res.json?.title === oldTitle ? null : `expected the published title, got "${String(res.json?.title ?? "")}"`;
}

/** Anonymous GET /api/news?draft=true&where[_status][equals]=draft: nothing at all, and certainly not the test doc. */
export function classifyAnonDraftList(res, { id, newTitle }) {
  if (shows(res.text, newTitle)) return "LEAK: the anonymous draft listing returned the draft title";
  const docs = Array.isArray(res.json?.docs) ? res.json.docs : [];
  if (docs.some((d) => d?.id === id)) return "LEAK: the anonymous draft listing includes the test document";
  if (res.status !== 200) return `expected 200 with no documents, got ${res.status}`;
  return res.json?.totalDocs === 0 ? null : `expected totalDocs 0, got ${String(res.json?.totalDocs)}`;
}

/** A versions endpoint read anonymously: refused outright. */
export function classifyAnonVersions(res, { newTitle } = {}) {
  if (newTitle && shows(res.text, newTitle)) return "LEAK: the anonymous versions read returned the draft title";
  return refused(res.status) ? null : `expected 401/403, got ${res.status}`;
}

/** Anonymous GraphQL { versionsNews { totalDocs } }: an errors array and no data. */
export function classifyAnonGraphqlVersions(res, { newTitle } = {}) {
  if (newTitle && shows(res.text, newTitle)) return "LEAK: the anonymous GraphQL versions query returned the draft title";
  const data = res.json?.data?.versionsNews;
  if (data !== null && data !== undefined) return `LEAK: anonymous GraphQL returned versionsNews data (totalDocs ${String(data.totalDocs)})`;
  const errors = res.json?.errors;
  return Array.isArray(errors) && errors.length > 0 ? null : `expected a GraphQL errors array, got HTTP ${res.status} without one`;
}

/** A public page that must show the published state: 200, the old title, not the new one, no banner. */
export function classifyPublishedView(res, { oldTitle, newTitle }, what) {
  if (res.status !== 200) return `${what}: expected 200, got ${res.status}`;
  if (shows(res.text, newTitle)) return `${what} shows the draft title`;
  if (res.text.includes(BANNER_TEXT)) return `${what} shows the preview banner`;
  return shows(res.text, oldTitle) ? null : `${what}: the published title is missing`;
}

/* ------------------------------------------------------------------ the probe */

/**
 * Run the whole probe. Never throws for a failed check; returns
 * { results, created, removed, leftover }. The cleanup runs in a `finally`.
 */
export async function runProbe({ base, creds, fetchImpl, now = Date.now, sleep, log = (_line) => {}, pollMs = 20000, holdMs = 6000, run = String(now()) }) {
  const secrets = [creds.editorPassword, creds.adminPassword];
  const out = (line) => log(maskSecrets(line, secrets));
  const http = createHttp({ base, fetchImpl });
  const results = [];
  const created = [];
  const removed = [];
  const timing = { now, sleep };
  const pub = (path) => http("GET", path);
  const record = (name, problem, note) => {
    const ok = !problem;
    results.push({ name, ok, detail: problem ?? note ?? "ok" });
    out(ok ? `ok   ${name}${note ? `: ${note}` : ""}` : `FAIL ${name}: ${problem}`);
    return ok;
  };
  /** Run one check; a throw is a FAIL, never a crash. */
  const step = async (name, fn) => {
    try {
      const problem = await fn();
      return record(name, problem || null, undefined);
    } catch (error) {
      return record(name, `request failed: ${error.message}`);
    }
  };
  const expectStatus = (res, want, what) => {
    const wants = Array.isArray(want) ? want : [want];
    return wants.includes(res.status) ? null : `${what}: expected ${wants.join("/")}, got ${res.status}`;
  };

  const { oldTitle, newTitle } = titlesFor(run);
  const slug = `automated-test-ignore-${run}`;
  const path = `/news/${slug}`;
  let editor = null;
  let admin = null;
  let newsId = null;

  try {
    // ---- sessions
    try {
      editor = await login(http, creds.editorEmail, creds.editorPassword);
      admin = await login(http, creds.adminEmail, creds.adminPassword);
      secrets.push(editor.jar.get(SESSION_COOKIE), admin.jar.get(SESSION_COOKIE));
      record("login-editor-and-admin", null, "both sessions open");
    } catch (error) {
      record("login-editor-and-admin", error.message);
      return { results, created, removed, leftover: created.filter((c) => !removed.includes(c.key)) };
    }
    const ec = () => editor.jar.header();
    const ac = () => admin.jar.header();
    const api = (who, method, p, json) => http(method, p, { cookie: who === "editor" ? ec() : ac(), json });

    // ---- a: anonymous baseline
    await step("a-anonymous-baseline", async () => {
      const list = await pub("/news");
      if (shows(list.text, oldTitle)) return "the title is already on /news before it exists";
      const detail = await pub(path);
      return expectStatus(detail, 404, `GET ${path} before creation`);
    });

    // ---- b: draft
    const made = await step("b-editor-creates-draft", async () => {
      const res = await api("editor", "POST", "/api/news?draft=true", { ...newsBody({ title: oldTitle, slug }), _status: "draft" });
      const bad = expectStatus(res, [200, 201], "POST /api/news?draft=true");
      if (bad) return bad;
      newsId = res.json?.doc?.id;
      if (newsId === undefined || newsId === null) return "no id in the create response";
      created.push({ key: `news:${newsId}`, collection: "news", id: newsId });
      return null;
    });
    if (made) {
      await step("b-draft-is-404-anonymously", async () => expectStatus(await pub(path), 404, `GET ${path} (draft)`));

      // ---- c: publish
      await step("c-editor-publishes", async () => {
        const res = await api("editor", "PATCH", `/api/news/${newsId}`, { _status: "published" });
        const bad = expectStatus(res, 200, "PATCH _status=published");
        if (bad) return bad;
        const seen = await pollUntil(() => pub(path), (r) => r.status === 200 && shows(r.text, oldTitle), { timeoutMs: pollMs, ...timing });
        return seen.ok ? null : `public page not 200 with the title after ${pollMs / 1000}s (last ${seen.value.status})`;
      });

      // ---- d: autosave leaves the live page alone
      const autosaved = await step("d-autosave-keeps-live-page", async () => {
        const res = await api("editor", "PATCH", `/api/news/${newsId}?draft=true&autosave=true`, { title: newTitle, _status: "draft" });
        const bad = expectStatus(res, 200, "autosave PATCH");
        if (bad) return bad;
        const held = await holdsFor(() => pub(path), (r) => r.status === 200 && shows(r.text, oldTitle) && !shows(r.text, newTitle), { forMs: holdMs, ...timing });
        return held.ok ? null : "the public page changed after an autosave (draft leaked or revalidated)";
      });

      // ---- d: the pending draft does not leak through the anonymous API
      await step("d-anon-api-draft-read-shows-published", async () => {
        if (!autosaved) return "the autosave check failed, so the draft is not established";
        return classifyAnonDraftRead(await pub(`/api/news/${newsId}?draft=true&depth=0`), { oldTitle, newTitle });
      });
      await step("d-anon-api-draft-list-empty", async () => {
        if (!autosaved) return "the autosave check failed, so the draft is not established";
        return classifyAnonDraftList(await pub("/api/news?draft=true&depth=0&where[_status][equals]=draft"), { id: newsId, newTitle });
      });
      await step("d-anon-news-versions-refused", async () => classifyAnonVersions(await pub(`/api/news/versions?depth=0&where[parent][equals]=${newsId}`), { newTitle }));
      await step("d-anon-contact-details-versions-refused", async () => classifyAnonVersions(await pub("/api/globals/contact-details/versions?depth=0")));
      await step("d-anon-graphql-versions-refused", async () =>
        classifyAnonGraphqlVersions(await http("POST", "/api/graphql", { json: { query: "{ versionsNews { totalDocs } }" } }), { newTitle }),
      );

      // ---- e: preview
      const previewUrl = `/preview?path=${encodeURIComponent(path)}`;
      let bypass = null;
      await step("e-preview-sets-draft-cookie", async () => {
        const res = await http("GET", previewUrl, { cookie: ec(), redirect: "manual" });
        if (res.status !== 307) return `expected 307, got ${res.status}`;
        const location = res.headers.get("location");
        if (location !== path) return `Location should be the relative path ${path}, got "${location}"`;
        const jar = createJar();
        jar.absorb(res.headers);
        bypass = jar.get(BYPASS_COOKIE) ?? null;
        if (!bypass) return `no ${BYPASS_COOKIE} cookie in Set-Cookie`;
        secrets.push(bypass);
        const flags = res.setCookies.map(parseSetCookie).find((c) => c?.name === BYPASS_COOKIE);
        out(`     draft cookie attributes: ${Object.keys(flags?.attrs ?? {}).join(", ") || "none"}`);
        return null;
      });
      // The bypass cookie is one value per build and outlives a logout, so on
      // its own it must show nothing: a draft needs it AND a live staff session.
      await step("e-bypass-cookie-alone-shows-published", async () => {
        if (!bypass) return "no bypass cookie from the previous check";
        return classifyPublishedView(await http("GET", path, { cookie: `${BYPASS_COOKIE}=${bypass}` }), { oldTitle, newTitle }, "the bypass cookie alone");
      });
      const draftView = async (cookie) => {
        const res = await http("GET", path, { cookie });
        if (res.status !== 200) return `expected 200, got ${res.status}`;
        if (!autosaved) return "the autosave check failed, so the draft title is not established";
        if (!shows(res.text, newTitle)) return "the draft title is not shown";
        return res.text.includes(BANNER_TEXT) ? null : "the preview banner is missing";
      };
      await step("e-bypass-plus-session-shows-draft", async () => {
        if (!bypass) return "no bypass cookie from the previous check";
        return draftView(`${ec()}; ${BYPASS_COOKIE}=${bypass}`);
      });
      await step("e-forged-bypass-shows-published", async () =>
        classifyPublishedView(await http("GET", path, { cookie: `${ec()}; ${BYPASS_COOKIE}=forged` }), { oldTitle, newTitle }, "a forged cookie with the editor session"),
      );
      await step("e-preview-without-session-401", async () => {
        const res = await http("GET", previewUrl, { redirect: "manual" });
        if (res.status !== 401) return `expected 401, got ${res.status}`;
        return setCookiesOf(res.headers).length ? "a refused preview still set a cookie" : null;
      });
      for (const bad of UNSAFE_PREVIEW_PATHS) {
        await step(`e-unsafe-path-400 ${bad}`, async () => {
          const res = await http("GET", `/preview?path=${encodeURIComponent(bad)}`, { cookie: ec(), redirect: "manual" });
          return expectStatus(res, 400, "unsafe preview path");
        });
      }

      // The stale-cookie case: the editor logs out, the browser keeps the
      // bypass cookie (a session cookie that Payload's logout does not clear).
      await step("e-logout-ends-preview", async () => {
        if (!bypass) return "no bypass cookie from the earlier check";
        const res = await http("POST", "/api/users/logout", { cookie: ec() });
        const bad = expectStatus(res, 200, "POST /api/users/logout");
        if (bad) return bad;
        return classifyPublishedView(await http("GET", path, { cookie: `${BYPASS_COOKIE}=${bypass}` }), { oldTitle, newTitle }, "the old bypass cookie after logout");
      });
      // Sign the editor back in for the rest of the run. With a fresh session the
      // SAME old cookie previews again: the logout ended the session, and the
      // session is what preview now depends on.
      const relogged = await step("e-editor-signs-back-in", async () => {
        const stale = editor.jar.get(SESSION_COOKIE);
        editor = await login(http, creds.editorEmail, creds.editorPassword);
        secrets.push(editor.jar.get(SESSION_COOKIE));
        // Informational only: did the logout also revoke the old token on the server?
        if (bypass && stale) {
          const old = await http("GET", path, { cookie: `${SESSION_COOKIE}=${stale}; ${BYPASS_COOKIE}=${bypass}` });
          out(`     old session token after logout: ${shows(old.text, newTitle) ? "still accepted (the token lives until it expires)" : "rejected"}`);
        }
        return null;
      });
      if (relogged) {
        await step("e-old-bypass-with-new-session-shows-draft", async () => {
          if (!bypass) return "no bypass cookie from the earlier check";
          return draftView(`${ec()}; ${BYPASS_COOKIE}=${bypass}`);
        });
      }

      // ---- f: publish the change, no redeploy
      await step("f-publish-change-without-redeploy", async () => {
        const res = await api("editor", "PATCH", `/api/news/${newsId}`, { title: newTitle, _status: "published" });
        const bad = expectStatus(res, 200, "PATCH published with new title");
        if (bad) return bad;
        const seen = await pollUntil(() => pub(path), (r) => r.status === 200 && shows(r.text, newTitle), { timeoutMs: pollMs, ...timing });
        return seen.ok ? null : `public page does not show the new title after ${pollMs / 1000}s`;
      });

      // ---- g: unpublish
      await step("g-unpublish-is-404", async () => {
        const res = await api("editor", "PATCH", `/api/news/${newsId}`, { _status: "draft" });
        const bad = expectStatus(res, 200, "PATCH _status=draft");
        if (bad) return bad;
        const seen = await pollUntil(() => pub(path), (r) => r.status === 404, { timeoutMs: pollMs, ...timing });
        return seen.ok ? null : `public page still ${seen.value.status} after ${pollMs / 1000}s`;
      });
    }

    // ---- h: role gating
    // Payload updates a global with POST (PATCH on a global is a 404). Body {}:
    // access is checked before anything is written, so a 403 changes nothing.
    await step("h-editor-cannot-post-contact-details", async () => expectStatus(await api("editor", "POST", "/api/globals/contact-details", {}), 403, "editor POST contact-details"));
    await step("h-editor-cannot-post-site-settings", async () => expectStatus(await api("editor", "POST", "/api/globals/site-settings", {}), 403, "editor POST site-settings"));
    // The admin's side is read from /api/access, never by writing the live global.
    await step("h-access-admin-allowed", async () => {
      const res = await api("admin", "GET", "/api/access");
      return expectStatus(res, 200, "admin GET /api/access") ?? accessProblems(res.json, true);
    });
    await step("h-access-editor-refused", async () => {
      const res = await api("editor", "GET", "/api/access");
      return expectStatus(res, 200, "editor GET /api/access") ?? accessProblems(res.json, false);
    });
    await step("h-editor-cannot-create-user", async () => {
      const res = await api("editor", "POST", "/api/users", { email: `probe-extra-${run}@example.invalid`, password: `Pw-${run}-${run}-aA1!`, name: MARKER, role: "editor" });
      if (res.status === 200 || res.status === 201) {
        const id = res.json?.doc?.id;
        if (id !== undefined) created.push({ key: `users:${id}`, collection: "users", id });
      }
      return expectStatus(res, 403, "editor POST /api/users");
    });
    await step("h-editor-cannot-patch-admin-user", async () => {
      const id = admin.user?.id;
      if (id === undefined || id === null) return "the admin's id is unknown";
      return expectStatus(await api("editor", "PATCH", `/api/users/${id}`, { name: admin.user.name ?? "" }), [403, 404], "editor PATCH admin user");
    });
    await step("h-editor-cannot-promote-self", async () => {
      const id = editor.user?.id;
      if (id === undefined || id === null) return "the editor's id is unknown";
      await api("editor", "PATCH", `/api/users/${id}`, { role: "admin" });
      const me = await api("editor", "GET", "/api/users/me");
      const role = me.json?.user?.role;
      if (role === "admin") {
        await api("admin", "PATCH", `/api/users/${id}`, { role: "editor" });
        return "the editor became an admin by patching their own role (restored)";
      }
      return role === "editor" ? null : `unexpected role after the attempt: ${role}`;
    });
    if (made) {
      await step("h-editor-cannot-delete-news", async () => expectStatus(await api("editor", "DELETE", `/api/news/${newsId}`), 403, "editor DELETE news"));
    }
    await step("h-editor-cannot-patch-form", async () => {
      const list = await api("editor", "GET", "/api/forms?limit=1&depth=0");
      const id = list.json?.docs?.[0]?.id ?? ABSENT_ID;
      return expectStatus(await api("editor", "PATCH", `/api/forms/${id}`, {}), 403, "editor PATCH form");
    });
    await step("h-editor-reads-form-submissions", async () => expectStatus(await api("editor", "GET", "/api/form-submissions?limit=1&depth=0"), 200, "editor GET form-submissions"));
    // Mutations use an id no row has: access runs before the lookup, so 403 = denied and 404 = access wrongly open, and no real submission is ever at risk.
    await step("h-editor-cannot-change-form-submission", async () => {
      const del = await api("editor", "DELETE", `/api/form-submissions/${ABSENT_ID}`);
      const upd = await api("editor", "PATCH", `/api/form-submissions/${ABSENT_ID}`, {});
      return expectStatus(del, 403, "editor DELETE form-submission") ?? expectStatus(upd, 403, "editor PATCH form-submission");
    });
    await step("h-editor-reads-applications", async () => expectStatus(await api("editor", "GET", "/api/applications?limit=1&depth=0"), 200, "editor GET applications"));
    await step("h-editor-cannot-delete-application", async () => expectStatus(await api("editor", "DELETE", `/api/applications/${ABSENT_ID}`), 403, "editor DELETE application"));
    await step("h-anonymous-cannot-list-users", async () => {
      const res = await http("GET", "/api/users");
      return refused(res.status) ? null : `expected 401/403, got ${res.status}`;
    });
    if (made) {
      await step("h-admin-deletes-test-document", async () => {
        const res = await api("admin", "DELETE", `/api/news/${newsId}`);
        const bad = expectStatus(res, 200, "admin DELETE news");
        if (!bad) {
          removed.push(`news:${newsId}`);
        }
        return bad;
      });
    }

    // ---- i: headers
    try {
      const home = await http("GET", "/");
      const f = frameProtection(home.headers);
      out(`     X-Frame-Options: ${f.xfo ?? "(not set)"}`);
      out(`     Content-Security-Policy ${f.frameAncestors ?? "frame-ancestors: (not set)"}`);
      if (f.missing) out("WARN i-frame-protection: neither X-Frame-Options nor CSP frame-ancestors is set; the SameSite=None draft cookie means a cross-site page could frame the site as a signed-in staff member");
      results.push({ name: "i-frame-protection", ok: true, detail: f.missing ? "WARN: none set" : "set" });
    } catch (error) {
      out(`WARN i-frame-protection: could not read the home page (${error.message})`);
      results.push({ name: "i-frame-protection", ok: true, detail: "WARN: unreadable" });
    }

    // ---- j: the related-draft finding (never fails the probe)
    try {
      out(await relatedDraftFinding({ api, pub, created, removed, run, pollMs, timing }));
    } catch (error) {
      out(`FINDING j-related-draft: inconclusive (${error.message})`);
    }
  } finally {
    // The admin session removes whatever is left, newest first.
    for (const item of [...created].reverse()) {
      if (removed.includes(item.key)) continue;
      try {
        const res = admin ? await http("DELETE", `/api/${item.collection}/${item.id}`, { cookie: admin.jar.header() }) : { status: 0 };
        if (res.status === 200 || res.status === 404) removed.push(item.key);
        else out(`CLEANUP FAILED ${item.collection} ${item.id}: HTTP ${res.status}`);
      } catch (error) {
        out(`CLEANUP FAILED ${item.collection} ${item.id}: ${error.message}`);
      }
    }
    const leftover = created.filter((c) => !removed.includes(c.key));
    out(`created: ${created.map((c) => c.key).join(", ") || "nothing"}`);
    out(`removed: ${removed.join(", ") || "nothing"}`);
    if (leftover.length) out(`LEFT BEHIND (delete by hand in /admin): ${leftover.map((c) => c.key).join(", ")}`);
  }
  const leftover = created.filter((c) => !removed.includes(c.key));
  return { results, created, removed, leftover };
}

/**
 * Pre-existing gap, reported not gated: a PUBLISHED insight (posts) points at a
 * topic (postCategories) that is only a draft. Does /blog print the topic's
 * label? Both documents are marked and removed by runProbe's cleanup.
 */
export async function relatedDraftFinding({ api, pub, created, removed, run, pollMs, timing }) {
  const solutions = await api("admin", "GET", "/api/solutions?limit=1&depth=0&where[_status][equals]=published");
  const targetId = solutions.json?.docs?.[0]?.id;
  if (targetId === undefined) return "FINDING j-related-draft: skipped: no published solution to point the test insight at";
  const label = `${MARKER} topic ${run}`;
  const title = `${MARKER} insight ${run}`;
  const cat = await api("admin", "POST", "/api/postCategories?draft=true", { key: `automated-test-ignore-${run}`, label, order: 999, _status: "draft" });
  if (cat.status !== 200 && cat.status !== 201) return `FINDING j-related-draft: skipped: could not create the draft topic (HTTP ${cat.status})`;
  const catId = cat.json?.doc?.id;
  created.push({ key: `postCategories:${catId}`, collection: "postCategories", id: catId });
  const post = await api("admin", "POST", "/api/posts", {
    title,
    slug: `automated-test-ignore-${run}`,
    order: 999,
    category: catId,
    body: lexicalBody(MARKER),
    target: targetId,
    readMoreLabel: MARKER,
    _status: "published",
  });
  if (post.status !== 200 && post.status !== 201) return `FINDING j-related-draft: skipped: could not publish the test insight (HTTP ${post.status}: ${String(post.json?.errors?.[0]?.message ?? "").slice(0, 120)})`;
  created.push({ key: `posts:${post.json?.doc?.id}`, collection: "posts", id: post.json?.doc?.id });
  const seen = await pollUntil(() => pub("/blog"), (r) => r.status === 200 && shows(r.text, title), { timeoutMs: pollMs, ...timing });
  if (!seen.ok) return "FINDING j-related-draft: NO LEAK (the published insight with a draft-only topic is not rendered on /blog at all)";
  return shows(seen.value.text, label)
    ? `FINDING j-related-draft: LEAK, /blog prints the label of a topic that is only a draft ("${label}")`
    : "FINDING j-related-draft: NO LEAK (the insight shows, the draft topic's label does not)";
}

/* ----------------------------------------------------------------------- CLI */

export function readCreds(env) {
  const names = ["EDITOR_EMAIL", "EDITOR_PASSWORD", "ADMIN_EMAIL", "ADMIN_PASSWORD"];
  const missing = names.filter((n) => !env[n]);
  if (missing.length) throw new Error(`missing environment variable(s): ${missing.join(", ")} (names only; values are never printed). See the usage at the top of this file.`);
  return { editorEmail: env.EDITOR_EMAIL, editorPassword: env.EDITOR_PASSWORD, adminEmail: env.ADMIN_EMAIL, adminPassword: env.ADMIN_PASSWORD };
}

async function main() {
  const creds = readCreds(process.env);
  const base = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const { results, leftover } = await runProbe({ base, creds, fetchImpl: fetch, log: (l) => console.log(l) });
  const failed = results.filter((r) => !r.ok);
  if (failed.length || leftover.length) {
    console.error(`FAIL — ${failed.length} of ${results.length} checks failed${leftover.length ? `, ${leftover.length} test document(s) left behind` : ""} (${base})`);
    process.exit(1);
  }
  console.log(`PASS — ${results.length} checks (${base}). Now delete the throwaway users: EDITORIAL_SETUP_MODE=delete NODE_ENV=production npx payload run tools/editorial-live-setup.mjs`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(`FAIL — ${maskSecrets(error.message, [process.env.EDITOR_PASSWORD, process.env.ADMIN_PASSWORD])}`);
    process.exit(1);
  });
}
