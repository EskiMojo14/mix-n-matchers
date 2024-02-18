import { expect, it, describe } from "vitest";

import { alignedAnsiStyleSerializer } from "../utils/tests";

expect.addSnapshotSerializer(alignedAnsiStyleSerializer);

describe("typeOf", () => {
  it("matches against the provided value using `typeof`", () => {
    expect(1).toEqual(expect.typeOf("number"));

    expect({ value: 1 }).toEqual({ value: expect.typeOf("number") });
  });
  it("throws if value mismatches", () => {
    expect(() => {
      expect(1).toEqual(expect.typeOf("string"));
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      expect({ value: 1 }).toEqual({ value: expect.typeOf("string") });
    }).toThrowErrorMatchingSnapshot();
  });
});
