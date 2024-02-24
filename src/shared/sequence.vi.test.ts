/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { describe, expect, it } from "vitest";
import { alignedAnsiStyleSerializer } from "../utils/tests";

expect.addSnapshotSerializer(alignedAnsiStyleSerializer);

describe("toSatisfySequence", () => {
  it("works with an array", () => {
    expect([1, 2, 3]).toSatisfySequence(
      (x) => x === 1,
      (x) => x === 2,
      (x) => x === 3,
    );
    expect([1, 2, 3]).not.toSatisfySequence(
      (x) => x === 1,
      (x) => x === 3,
      (x) => x === 2,
    );

    expect([1, 2, 3]).toSatisfySequence(
      (x) => x === 1,
      (x) => x === 2,
    );

    expect(() => {
      expect([1, 2, 3]).toSatisfySequence(
        (x) => x === 1,
        (x) => x === 3,
        (x) => x === 2,
      );
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      expect([1, 2, 3]).not.toSatisfySequence(
        (x) => x === 1,
        (x) => x === 2,
      );
    }).toThrowErrorMatchingSnapshot();
  });
  it("fails with a non-array", () => {
    expect(() => {
      expect(0).toSatisfySequence((x) => x === 0);
    }).toThrowErrorMatchingSnapshot();
    expect(0).not.toSatisfySequence((x) => x === 0);
  });
  it("fails if not passed any predicates", () => {
    expect(() => {
      // @ts-expect-error testing invalid usage
      expect([]).toSatisfySequence();
    }).toThrowErrorMatchingSnapshot();
  });
  it("fails if the array is too short", () => {
    expect(() => {
      expect([0]).toSatisfySequence(
        (x) => x === 0,
        (x) => x === 1,
      );
    }).toThrowErrorMatchingSnapshot();
  });
});

describe("sequence", () => {
  it("works with an array", () => {
    expect({ array: [1, 2, 3] }).toEqual({
      array: expect.sequence(
        (x) => x === 1,
        (x) => x === 2,
        (x) => x === 3,
      ),
    });
    expect({ array: [1, 2, 3] }).toEqual({
      array: expect.not.sequence(
        (x) => x === 1,
        (x) => x === 3,
        (x) => x === 2,
      ),
    });

    expect({ array: [1, 2, 3] }).toEqual({
      array: expect.sequence(
        (x) => x === 1,
        (x) => x === 2,
      ),
    });

    expect(() => {
      expect({ array: [1, 2, 3] }).toEqual({
        array: expect.sequence(
          (x) => x === 1,
          (x) => x === 3,
          (x) => x === 2,
        ),
      });
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      expect({ array: [1, 2, 3] }).toEqual({
        array: expect.not.sequence(
          (x) => x === 1,
          (x) => x === 2,
        ),
      });
    }).toThrowErrorMatchingSnapshot();
  });
  it("fails with a non-array", () => {
    expect(() => {
      expect({ array: 0 }).toEqual({
        array: expect.sequence((x) => x === 0),
      });
    }).toThrowErrorMatchingSnapshot();
    expect({ array: 0 }).toEqual({
      array: expect.not.sequence((x) => x === 0),
    });
  });
  it("fails if not passed any predicates", () => {
    expect(() => {
      // @ts-expect-error testing invalid usage
      expect({ array: [] }).toEqual({ array: expect.sequence() });
    }).toThrowErrorMatchingSnapshot();
  });
  it("fails if the array is too short", () => {
    expect(() => {
      expect({ array: [0] }).toEqual({
        array: expect.sequence(
          (x) => x === 0,
          (x) => x === 1,
        ),
      });
    }).toThrowErrorMatchingSnapshot();
  });
});
