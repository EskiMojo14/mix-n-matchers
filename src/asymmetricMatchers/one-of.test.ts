import { alignedAnsiStyleSerializer } from "../utils/tests";

expect.addSnapshotSerializer(alignedAnsiStyleSerializer);

describe("oneOf", () => {
  it("should pass if value matches one of provided values", () => {
    expect(1).toEqual(expect.oneOf(1, 2, 3));
    expect(2).toEqual(expect.oneOf(1, 2, 3));
    expect(3).toEqual(expect.oneOf(1, 2, 3));
  });
  it("should fail if value does not match any of the provided values", () => {
    expect(() => {
      expect(4).toEqual(expect.oneOf(1, 2, 3));
    }).toThrowErrorMatchingSnapshot();
  });
});
