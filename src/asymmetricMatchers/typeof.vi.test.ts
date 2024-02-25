/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { expect, it, describe } from "vitest";

describe("typeOf", () => {
  it("matches against the provided value using `typeof`", () => {
    expect(1).toEqual(expect.typeOf("number"));

    expect({ value: 1 }).toEqual({ value: expect.typeOf("number") });

    expect(1).toEqual(expect.not.typeOf("string"));

    expect({ value: 1 }).toEqual({ value: expect.not.typeOf("string") });
  });
  it("throws if value mismatches", () => {
    expect(() => {
      expect(1).toEqual(expect.typeOf("string"));
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      expect({ value: 1 }).toEqual({ value: expect.typeOf("string") });
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      expect(1).toEqual(expect.not.typeOf("number"));
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      expect({ value: 1 }).toEqual({ value: expect.not.typeOf("number") });
    }).toThrowErrorMatchingSnapshot();
  });
});
