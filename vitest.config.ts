import { defineConfig } from "vitest/config";

/*
 * Node environment, not jsdom. Everything tested in Phases 0-3 is a pure
 * function — validators, date logic, seed transforms — so there is no DOM to
 * simulate and no Payload instance to boot. Collections and the seed are
 * verified by running them against the real database instead; see
 * src/seed/verify.ts.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
