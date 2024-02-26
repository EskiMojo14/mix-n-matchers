import { describe, it, expect } from "@jest/globals";

describe("objectContainingOnly", () => {
  it("should check if object contains only the expected properties", () => {
    expect({ a: 1 }).toEqual(expect.objectContainingOnly({ a: 1, b: 2 }));

    expect(() => {
      expect({ a: 1, b: 2 }).toEqual(expect.objectContainingOnly({ a: 1 }));
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      expect({ a: 1, b: 2 }).toEqual(
        expect.objectContainingOnly({ a: 1, b: 3 }),
      );
    }).toThrowErrorMatchingSnapshot();

    expect({ a: 1, b: 2 }).toEqual(expect.not.objectContainingOnly({ a: 1 }));

    expect(() => {
      expect({ a: 1, b: 2 }).toEqual(
        expect.not.objectContainingOnly({ a: 1, b: 2 }),
      );
    }).toThrowErrorMatchingSnapshot();
  });
  it("should throw an error if expected value is not an object", () => {
    expect(() => {
      expect({}).toEqual(expect.objectContainingOnly(1));
    }).toThrowErrorMatchingSnapshot();
  });
  it("should throw an error if received value is not an object", () => {
    expect(() => {
      expect(1).toEqual(expect.objectContainingOnly({}));
    }).toThrowErrorMatchingSnapshot();
  });
});
