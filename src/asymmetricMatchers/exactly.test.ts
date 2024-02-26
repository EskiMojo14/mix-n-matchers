import { describe, it, expect, fn } from "@globals";

describe("exactly", () => {
  it("allows Object.is equality where deep equality would normally be used", () => {
    const ref = {};
    const mock = fn();
    mock(ref);
    expect(mock).toHaveBeenCalledWith(expect.exactly(ref));
    expect(() => {
      expect(mock).toHaveBeenCalledWith(expect.exactly({}));
    }).toThrowErrorMatchingSnapshot();

    expect(mock).toHaveBeenCalledWith(expect.not.exactly({}));
    expect(() => {
      expect(mock).toHaveBeenCalledWith(expect.not.exactly(ref));
    }).toThrowErrorMatchingSnapshot();
  });
});
