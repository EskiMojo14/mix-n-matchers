import { alignedAnsiStyleSerializer } from "../utils/tests";

expect.addSnapshotSerializer(alignedAnsiStyleSerializer);

describe("toSatisfySequence", () => {
  it("works with an array", () => {
    const arr = [0, "", false];
    expect(arr).toSatisfySequence(
      (x) => x === 0,
      (x) => x === "",
      (x) => x === false,
    );
    expect(arr).not.toSatisfySequence(
      (x) => x === 0,
      (x) => x === false,
      (x) => x === "",
    );

    expect(arr).toSatisfySequence(
      (x) => x === 0,
      (x) => x === "",
    );

    expect(() => {
      expect(arr).toSatisfySequence(
        (x) => x === 0,
        (x) => x === false,
        (x) => x === "",
      );
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      expect(arr).not.toSatisfySequence(
        (x) => x === 0,
        (x) => x === "",
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
