import { beforeEach, describe, expect, it, vi } from "vitest";

const revalidatePath = vi.fn();
vi.mock("next/cache", () => ({ revalidatePath: (...a: unknown[]) => revalidatePath(...a) }));

import { Solutions } from "../collections/Solutions";
import { Services } from "../collections/Services";

beforeEach(() => revalidatePath.mockClear());

const run = (collection: { hooks?: { afterChange?: unknown[]; afterDelete?: unknown[] } }, kind: "afterChange" | "afterDelete") => {
  const hook = collection.hooks?.[kind]?.[0] as (a: unknown) => unknown;
  hook({ doc: { slug: "x" }, previousDoc: { slug: "x" } });
};

/*
 * The site footer lists every published solution, on every page. Unpublishing a
 * solution therefore has to refresh the whole layout, not only the pages that
 * mention it: found on the server, where the solution's own page 404'd and the
 * pages in its revalidation list were clean while /contact, /careers and a dozen
 * others still linked to it from the footer.
 */
describe("a solution change refreshes the layout, because the footer lists solutions", () => {
  for (const kind of ["afterChange", "afterDelete"] as const) {
    it(`Solutions ${kind}`, () => {
      run(Solutions as never, kind);
      expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
    });
  }

  it("a service change does not need to (the footer's services link is static)", () => {
    run(Services as never, "afterChange");
    expect(revalidatePath).not.toHaveBeenCalledWith("/", "layout");
  });
});
