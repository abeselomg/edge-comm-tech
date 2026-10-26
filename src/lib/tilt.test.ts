import { describe, expect, it } from "vitest";
import { tiltFromPointer } from "./tilt";

const rect = { left: 100, top: 100, width: 400, height: 300 };

describe("tiltFromPointer", () => {
  it("is flat with the pointer at the centre", () => {
    expect(tiltFromPointer(300, 250, rect)).toEqual({ rx: 0, ry: 0 });
  });

  it("turns toward the pointer: right gives +ry, below gives -rx", () => {
    const t = tiltFromPointer(500, 400, rect);
    expect(t.ry).toBeGreaterThan(0);
    expect(t.rx).toBeLessThan(0);
    const u = tiltFromPointer(100, 100, rect);
    expect(u.ry).toBeLessThan(0);
    expect(u.rx).toBeGreaterThan(0);
  });

  it("never exceeds the maximum, however far away the pointer is", () => {
    expect(tiltFromPointer(99999, -99999, rect, 7)).toEqual({ rx: 7, ry: 7 });
    expect(tiltFromPointer(-99999, 99999, rect, 4)).toEqual({ rx: -4, ry: -4 });
  });

  it("is flat for a degenerate rect", () => {
    expect(tiltFromPointer(5, 5, { left: 0, top: 0, width: 0, height: 0 })).toEqual({
      rx: 0,
      ry: 0,
    });
  });
});
