import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";

/*
 * A source file the repository silently ignores passes every local test and then
 * is missing from the deploy. That happened in Phase 5: the pattern `media` in
 * .gitignore, meant for the uploads folder, also matched the route directory
 * src/app/(frontend)/resources/media/, and the three media pages were absent from
 * the first bundle that reached the server while the local suite stayed green.
 */
describe("the repository", () => {
  it("ignores nothing under src, tools, deploy or docs", () => {
    const ignored = execFileSync(
      "git",
      ["ls-files", "--others", "--ignored", "--exclude-standard", "--", "src", "tools", "deploy", "docs"],
      { encoding: "utf8" },
    )
      .split("\n")
      .filter(Boolean);
    expect(ignored).toEqual([]);
  });
});
