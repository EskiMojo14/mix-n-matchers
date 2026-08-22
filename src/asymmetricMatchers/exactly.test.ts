import { describe, it, expect } from "@globals";

describe("exactly", () => {
  it("allows Object.is equality where deep equality would normally be used", () => {
    const ref = {};
    expect(ref).toEqual(expect.exactly(ref));
    expect(() => {
      expect({}).toEqual(expect.exactly(ref));
    }).toThrowErrorMatchingSnapshot();

    expect(ref).toEqual(expect.not.exactly({}));
    expect(() => {
      expect(ref).toEqual(expect.not.exactly(ref));
    }).toThrowErrorMatchingSnapshot();
  });
});
