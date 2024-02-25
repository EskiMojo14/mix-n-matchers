/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { i } from "vitest/dist/reporters-QGe8gs4b.js";
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
  it("works with other iterables", () => {
    expect(new Set([1, 2, 3])).toSatisfySequence(
      (x) => x === 1,
      (x) => x === 2,
      (x) => x === 3,
    );
    expect(new Set([1, 2, 3])).not.toSatisfySequence(
      (x) => x === 1,
      (x) => x === 3,
      (x) => x === 2,
    );

    expect(new Set([1, 2, 3])).toSatisfySequence(
      (x) => x === 1,
      (x) => x === 2,
    );

    expect(() => {
      expect(new Set([1, 2, 3])).toSatisfySequence(
        (x) => x === 1,
        (x) => x === 3,
        (x) => x === 2,
      );
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      expect(new Set([1, 2, 3])).not.toSatisfySequence(
        (x) => x === 1,
        (x) => x === 2,
      );
    }).toThrowErrorMatchingSnapshot();
  });
  it("fails with a non-iterable", () => {
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
  it("fails if the iterable is too short", () => {
    expect(() => {
      expect([0]).toSatisfySequence(
        (x) => x === 0,
        (x) => x === 1,
      );
    }).toThrowErrorMatchingSnapshot();
    expect(() => {
      expect(new Set([0])).toSatisfySequence(
        (x) => x === 0,
        (x) => x === 1,
      );
    }).toThrowErrorMatchingSnapshot();
  });
  it("throws if one of the predicates is not a function", () => {
    expect(() => {
      expect([0, 1]).toSatisfySequence(
        (x) => x === 0,
        // @ts-expect-error testing invalid usage
        1,
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
  it("works with other iterables", () => {
    expect({ array: new Set([1, 2, 3]) }).toEqual({
      array: expect.sequence(
        (x) => x === 1,
        (x) => x === 2,
        (x) => x === 3,
      ),
    });
    expect({ array: new Set([1, 2, 3]) }).toEqual({
      array: expect.not.sequence(
        (x) => x === 1,
        (x) => x === 3,
        (x) => x === 2,
      ),
    });

    expect({ array: new Set([1, 2, 3]) }).toEqual({
      array: expect.sequence(
        (x) => x === 1,
        (x) => x === 2,
      ),
    });

    expect(() => {
      expect({ array: new Set([1, 2, 3]) }).toEqual({
        array: expect.sequence(
          (x) => x === 1,
          (x) => x === 3,
          (x) => x === 2,
        ),
      });
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      expect({ array: new Set([1, 2, 3]) }).toEqual({
        array: expect.not.sequence(
          (x) => x === 1,
          (x) => x === 2,
        ),
      });
    }).toThrowErrorMatchingSnapshot();
  });
  it("fails with a non-iterable", () => {
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
  it("fails if the iterable is too short", () => {
    expect(() => {
      expect({ array: [0] }).toEqual({
        array: expect.sequence(
          (x) => x === 0,
          (x) => x === 1,
        ),
      });
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      expect({ array: new Set([0]) }).toEqual({
        array: expect.sequence(
          (x) => x === 0,
          (x) => x === 1,
        ),
      });
    }).toThrowErrorMatchingSnapshot();
  });
  it("throws if one of the predicates is not a function", () => {
    expect(() => {
      expect({ array: [0, 1] }).toEqual({
        array: expect.sequence(
          (x) => x === 0,
          // @ts-expect-error testing invalid usage
          1,
        ),
      });
    }).toThrowErrorMatchingSnapshot();
  });
});

describe("toMatchSequence", () => {
  it("works with an array", () => {
    expect([1, 2, 3]).toMatchSequence(1, 2, 3);

    expect([1, 2, 3]).not.toMatchSequence(1, 3, 2);

    expect([1, 2, 3]).toMatchSequence(1, 2);

    expect(() => {
      expect([1, 2, 3]).toMatchSequence(1, 3, 2);
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      expect([1, 2, 3]).not.toMatchSequence(1, 2);
    }).toThrowErrorMatchingSnapshot();
  });

  it("works with other iterables", () => {
    expect(new Set([1, 2, 3])).toMatchSequence(1, 2, 3);

    expect(new Set([1, 2, 3])).not.toMatchSequence(1, 3, 2);

    expect(new Set([1, 2, 3])).toMatchSequence(1, 2);

    expect(() => {
      expect(new Set([1, 2, 3])).toMatchSequence(1, 3, 2);
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      expect(new Set([1, 2, 3])).not.toMatchSequence(1, 2);
    }).toThrowErrorMatchingSnapshot();
  });

  it("fails with a non-iterable", () => {
    expect(() => {
      expect(0).toMatchSequence(0);
    }).toThrowErrorMatchingSnapshot();
    expect(0).not.toMatchSequence(0);
  });
  it("fails if the iterable is too short", () => {
    expect(() => {
      expect([0]).toMatchSequence(0, 1);
    }).toThrowErrorMatchingSnapshot();
    expect(() => {
      expect(new Set([0])).toMatchSequence(0, 1);
    }).toThrowErrorMatchingSnapshot();
  });
});

describe("sequenceOf", () => {
  it("works with an array", () => {
    expect({ value: [1, 2, 3] }).toEqual({
      value: expect.sequenceOf(1, 2, 3),
    });
    expect({ value: [1, 2, 3] }).toEqual({
      value: expect.not.sequenceOf(1, 3, 2),
    });

    expect({ value: [1, 2, 3] }).toEqual({
      value: expect.sequenceOf(1, 2),
    });

    expect(() => {
      expect({ value: [1, 2, 3] }).toEqual({
        value: expect.sequenceOf(1, 3, 2),
      });
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      expect({ value: [1, 2, 3] }).toEqual({
        value: expect.not.sequenceOf(1, 2),
      });
    }).toThrowErrorMatchingSnapshot();
  });

  it("works with other iterables", () => {
    expect({ value: new Set([1, 2, 3]) }).toEqual({
      value: expect.sequenceOf(1, 2, 3),
    });
    expect({ value: new Set([1, 2, 3]) }).toEqual({
      value: expect.not.sequenceOf(1, 3, 2),
    });

    expect({ value: new Set([1, 2, 3]) }).toEqual({
      value: expect.sequenceOf(1, 2),
    });

    expect(() => {
      expect({ value: new Set([1, 2, 3]) }).toEqual({
        value: expect.sequenceOf(1, 3, 2),
      });
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      expect({ value: new Set([1, 2, 3]) }).toEqual({
        value: expect.not.sequenceOf(1, 2),
      });
    }).toThrowErrorMatchingSnapshot();
  });

  it("fails with a non-iterable", () => {
    expect(() => {
      expect({ value: 0 }).toEqual({
        value: expect.sequenceOf(0),
      });
    }).toThrowErrorMatchingSnapshot();
    expect({ value: 0 }).toEqual({
      value: expect.not.sequenceOf(0),
    });
  });
  it("fails if the iterable is too short", () => {
    expect(() => {
      expect({ value: [0] }).toEqual({
        value: expect.sequenceOf(0, 1),
      });
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      expect({ value: new Set([0]) }).toEqual({
        value: expect.sequenceOf(0, 1),
      });
    }).toThrowErrorMatchingSnapshot();
  });
});
