import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (name: string) => readFileSync(new URL(`../../deploy/${name}`, import.meta.url), "utf8");

describe("deploy/edge-comm-tech.service", () => {
  const unit = read("edge-comm-tech.service");

  it("lets the service write to the applications directory Payload uploads CVs to", () => {
    // `-` keeps systemd starting when the directory has not been created yet.
    expect(unit).toMatch(/^ReadWritePaths=-?\/srv\/edge-comm-tech\/app\/applications\s*$/m);
  });

  it("still writes only the cache and the upload directories", () => {
    const paths = [...unit.matchAll(/^ReadWritePaths=-?(\S+)$/gm)].map((m) => m[1]);
    expect(paths.sort()).toEqual([
      "/srv/edge-comm-tech/app/.next",
      "/srv/edge-comm-tech/app/applications",
      "/srv/edge-comm-tech/app/media",
    ]);
  });
});

describe("deploy/redeploy.sh", () => {
  const script = read("redeploy.sh");

  it("seeds missing forms (fill mode) between migrations and the build", () => {
    const migrate = script.indexOf("payload migrate");
    const seed = script.indexOf("SEED_MODE=fill npm run seed <");
    const build = script.indexOf("next build");
    expect(migrate).toBeGreaterThan(-1);
    expect(seed).toBeGreaterThan(migrate);
    expect(build).toBeGreaterThan(seed);
    expect(script).not.toMatch(/seed:(force|fresh)|SEED_MODE=(force|fresh)/);
  });
});

describe("deploy/nginx-edge-comm-tech.conf", () => {
  /*
   * The preview cookie is SameSite=None, so a page on another site that frames
   * this one would load it as the signed-in staff member. Both headers forbid
   * framing by anyone but this origin (Payload's admin frames only itself).
   * `always` so 4xx/5xx carry them too. nginx drops inherited add_header lines
   * in any location that sets its own, so the server block that proxies the app
   * must have no location with an add_header of its own.
   */
  // Comments dropped first: they mention locations and add_header in prose.
  const conf = read("nginx-edge-comm-tech.conf").replace(/#.*$/gm, "");
  const servers = conf.split(/^server \{/m).slice(1);
  const tls = servers.find((s) => /listen 443 ssl/.test(s)) ?? "";
  const serverLevel = tls.replace(/location [^{]*\{[^}]*\}/g, "");

  it("sends X-Frame-Options SAMEORIGIN and CSP frame-ancestors 'self' from the TLS server block", () => {
    expect(tls).toMatch(/proxy_pass http:\/\/edge_cms;/);
    expect(serverLevel).toMatch(/^\s*add_header X-Frame-Options "SAMEORIGIN" always;\r?$/m);
    expect(serverLevel).toMatch(/^\s*add_header Content-Security-Policy "frame-ancestors 'self'" always;\r?$/m);
  });

  it("has no location that would shadow those headers with its own add_header", () => {
    for (const loc of tls.match(/location [^{]*\{[^}]*\}/g) ?? []) expect(loc).not.toMatch(/add_header/);
  });

  it("every server block that proxies the app sets both headers", () => {
    for (const s of servers.filter((b) => /proxy_pass/.test(b))) {
      expect(s).toMatch(/add_header X-Frame-Options "SAMEORIGIN" always;/);
      expect(s).toMatch(/add_header Content-Security-Policy "frame-ancestors 'self'" always;/);
    }
  });
});
