import { expect, it, describe } from "vitest";
import { alignedAnsiStyleSerializer } from "../utils/tests";

expect.addSnapshotSerializer(alignedAnsiStyleSerializer);

describe("arrayContainingOnly", () => {
  it("should expect an array to contain only the expected values", () => {
    expect([1, 2, 2, 3]).toEqual(expect.arrayContainingOnly([1, 2, 3]));
    expect(() => {
      expect([1, 2, 2, 3]).toEqual(expect.arrayContainingOnly([1, 2]));
    }).toThrowErrorMatchingSnapshot();
  });
  it("should throw an error if the expected value is not an array", () => {
    expect(() => {
      // @ts-expect-error testing invalid input
      expect([]).toEqual(expect.arrayContainingOnly(1));
    }).toThrowErrorMatchingSnapshot();
  });
  it("should throw an error if the received value is not an array", () => {
    expect(() => {
      expect(1).toEqual(expect.arrayContainingOnly([]));
    }).toThrowErrorMatchingSnapshot();
  });
});
