import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const src = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "src");

/*
 * Node environment, not jsdom. Everything tested in Phases 0-3 is a pure
 * function — validators, date logic, seed transforms — so there is no DOM to
 * simulate and no Payload instance to boot. Collections and the seed are
 * verified by running them against the real database instead; see
 * src/seed/verify.ts.
 *
 * Phase 4's ported components are still tested without a DOM:
 * renderToStaticMarkup produces a string, which is what the assertions are
 * about. The environment stays node.
 */
export default defineConfig({
  /*
   * The automatic JSX runtime. tsconfig.json sets "jsx": "preserve" because
   * Next does its own transform, and esbuild falls back to the classic runtime
   * when it sees that — which fails with "React is not defined" in every file
   * that does not import React by hand.
   */
  esbuild: { jsx: "automatic" },
  /*
   * The same "@/" that tsconfig.json gives Next. Through Phase 3 nothing
   * under test imported that way, so there was no alias and the rule was
   * "tests use relative imports". Phase 4's components are production code
   * that tests import, and they sit beside files already using "@/" — so the
   * alias belongs here rather than those components being the only ones in
   * src/ written differently.
   */
  resolve: { alias: { "@": src } },
  test: {
    environment: "node",
    // .tsx as well as .ts, because the components are tested through JSX. A
    // glob that misses those files collects nothing and reports nothing,
    // which is worse than a failure.
    include: ["src/**/*.test.{ts,tsx}", "tools/**/*.test.{ts,tsx}"],
  },
});
