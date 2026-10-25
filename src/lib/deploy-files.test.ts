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
