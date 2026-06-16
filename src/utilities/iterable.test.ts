import { describe, it, expect } from "@globals";
import { wait } from "../utils/tests";
import { some, someAsync, every, everyAsync } from "./iterable";

const nums = [1, 2, 3];
const numsPromises = nums.map((n) => Promise.resolve(n));
const emptyArray: Array<number> = [];
async function* asyncNums() {
  for (let i = 1; i <= 3; i++) {
    await wait(100); // Simulate async operation
    yield i;
  }
}
async function* asyncEmpty() {
  // No items yielded
}

describe("some", () => {
  it("should return the result of the assertion if at least one element satisfies the condition", () => {
    expect(
      some(nums, (value) => {
        expect(value).toBeGreaterThan(2);
        return value;
      }),
    ).toBe(3);
  });
  it("should throw an error if the array is empty", () => {
    expect(() => {
      some(emptyArray, (value) => {
        expect(value).toBeGreaterThan(2);
      });
    }).toThrowErrorMatchingSnapshot();
  });
  it("should throw an AggregateError if no elements satisfy the condition", () => {
    expect(() => {
      some(nums, (value) => {
        expect(value).toBeGreaterThan(3);
      });
    }).toThrowErrorMatchingSnapshot();
  });
  it("should allow asynchronous assertion function that returns a Promise", async () => {
    const result = await some(numsPromises, async (promise) => {
      const value = await promise;
      expect(value).toBeGreaterThan(2);
      return value;
    });
    expect(result).toBe(3);
  });
  it("should throw an AggregateError with all errors if no elements satisfy the condition with async assertion", async () => {
    await expect(
      some(numsPromises, async (promise) => {
        const value = await promise;
        expect(value).toBeGreaterThan(3);
      }),
    ).rejects.toThrowErrorMatchingSnapshot();
  });
});

describe("someAsync", () => {
  it("should return the result of the assertion if at least one element satisfies the condition", async () => {
    await expect(
      someAsync(asyncNums(), (value) => {
        expect(value).toBeGreaterThan(2);
        return value;
      }),
    ).resolves.toBe(3);
  });
  it("should throw an error if the async iterable is empty", async () => {
    await expect(
      someAsync(asyncEmpty(), (value) => {
        expect(value).toBeGreaterThan(2);
      }),
    ).rejects.toThrowErrorMatchingSnapshot();
  });
  it("should throw an AggregateError if no elements satisfy the condition", async () => {
    await expect(
      someAsync(asyncNums(), (value) => {
        expect(value).toBeGreaterThan(3);
      }),
    ).rejects.toThrowErrorMatchingSnapshot();
  });
});

describe("every", () => {
  it("should return an array of results if all elements satisfy the condition", () => {
    expect(
      every(nums, (value) => {
        expect(value).toBeGreaterThan(0);
        return value * 2;
      }),
    ).toEqual([2, 4, 6]);
  });
  it("should throw an error if any element does not satisfy the condition", () => {
    expect(() => {
      every(nums, (value) => {
        expect(value).toBeGreaterThan(2);
      });
    }).toThrowErrorMatchingSnapshot();
  });
  it("should allow asynchronous assertion function that returns a Promise", async () => {
    await expect(
      every(numsPromises, async (promise) => {
        const value = await promise;
        expect(value).toBeGreaterThan(0);
        return value * 2;
      }),
    ).resolves.toEqual([2, 4, 6]);
  });
  it("should throw an error if any element does not satisfy the condition with async assertion", async () => {
    await expect(
      every(numsPromises, async (promise) => {
        const value = await promise;
        expect(value).toBeGreaterThan(2);
      }),
    ).rejects.toThrowErrorMatchingSnapshot();
  });
});

describe("everyAsync", () => {
  it("should return an array of results if all elements satisfy the condition", async () => {
    await expect(
      everyAsync(asyncNums(), (value) => {
        expect(value).toBeGreaterThan(0);
        return value * 2;
      }),
    ).resolves.toEqual([2, 4, 6]);
  });
  it("should throw an error if any element does not satisfy the condition", async () => {
    await expect(
      everyAsync(asyncNums(), (value) => {
        expect(value).toBeGreaterThan(2);
      }),
    ).rejects.toThrowErrorMatchingSnapshot();
  });
});
