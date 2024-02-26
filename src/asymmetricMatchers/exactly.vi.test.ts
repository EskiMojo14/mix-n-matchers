import { expect, it, describe, vi } from "vitest";

describe("exactly", () => {
  it("allows Object.is equality where deep equality would normally be used", () => {
    const ref = {};
    const fn = vi.fn();
    fn(ref);
    expect(fn).toHaveBeenCalledWith(expect.exactly(ref));
    expect(() => {
      expect(fn).toHaveBeenCalledWith(expect.exactly({}));
    }).toThrowErrorMatchingSnapshot();

    expect(fn).toHaveBeenCalledWith(expect.not.exactly({}));
    expect(() => {
      expect(fn).toHaveBeenCalledWith(expect.not.exactly(ref));
    }).toThrowErrorMatchingSnapshot();
  });
});
