import { describe, it, expect } from "@globals";
import { some, every } from "./iterable";

describe("some", () => {
  it("should return the result of the assertion if at least one element satisfies the condition", () => {
    const array = [1, 2, 3];
    const result = some(array, (value) => {
      expect(value).toBeGreaterThan(2);
      return value;
    });
    expect(result).toBe(3);
  });
  it("should throw an error if the array is empty", () => {
    const array: Array<number> = [];
    expect(() => {
      some(array, (value) => {
        expect(value).toBeGreaterThan(2);
        return value;
      });
    }).toThrowErrorMatchingSnapshot();
  });
  it("should throw an AggregateError if no elements satisfy the condition", () => {
    const array = [1, 2, 3];
    expect(() => {
      some(array, (value) => {
        expect(value).toBeGreaterThan(3);
        return value;
      });
    }).toThrowErrorMatchingSnapshot();
  });
  it("should allow asynchronous assertion function that returns a Promise", async () => {
    const array = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)];
    const result = await some(array, async (promise) => {
      const value = await promise;
      expect(value).toBeGreaterThan(2);
      return value;
    });
    expect(result).toBe(3);
  });
  it("should throw an AggregateError with all errors if no elements satisfy the condition with async assertion", async () => {
    const array = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)];
    await expect(
      some(array, async (promise) => {
        const value = await promise;
        expect(value).toBeGreaterThan(3);
        return value;
      }),
    ).rejects.toThrowErrorMatchingSnapshot();
  });
});

describe("every", () => {
  it("should return an array of results if all elements satisfy the condition", () => {
    const array = [1, 2, 3];
    const results = every(array, (value) => {
      expect(value).toBeGreaterThan(0);
      return value * 2;
    });
    expect(results).toEqual([2, 4, 6]);
  });
  it("should throw an error if any element does not satisfy the condition", () => {
    const array = [1, 2, 3];
    expect(() => {
      every(array, (value) => {
        expect(value).toBeGreaterThan(2);
        return value;
      });
    }).toThrowErrorMatchingSnapshot();
  });
  it("should allow asynchronous assertion function that returns a Promise", async () => {
    const array = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)];
    const results = await every(array, async (promise) => {
      const value = await promise;
      expect(value).toBeGreaterThan(0);
      return value * 2;
    });
    expect(results).toEqual([2, 4, 6]);
  });
  it("should throw an error if any element does not satisfy the condition with async assertion", async () => {
    const array = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)];
    await expect(
      every(array, async (promise) => {
        const value = await promise;
        expect(value).toBeGreaterThan(2);
        return value;
      }),
    ).rejects.toThrowErrorMatchingSnapshot();
  });
});
