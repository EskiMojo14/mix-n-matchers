/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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

describe("toEqualSequence", () => {
  it("works with an array", () => {
    expect([1, 2, 3]).toEqualSequence(1, 2, 3);

    expect([1, 2, 3]).not.toEqualSequence(1, 3, 2);

    expect([1, 2, 3]).toEqualSequence(1, 2);

    expect(() => {
      expect([1, 2, 3]).toEqualSequence(1, 3, 2);
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      expect([1, 2, 3]).not.toEqualSequence(1, 2);
    }).toThrowErrorMatchingSnapshot();
  });

  it("works with other iterables", () => {
    expect(new Set([1, 2, 3])).toEqualSequence(1, 2, 3);

    expect(new Set([1, 2, 3])).not.toEqualSequence(1, 3, 2);

    expect(new Set([1, 2, 3])).toEqualSequence(1, 2);

    expect(() => {
      expect(new Set([1, 2, 3])).toEqualSequence(1, 3, 2);
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      expect(new Set([1, 2, 3])).not.toEqualSequence(1, 2);
    }).toThrowErrorMatchingSnapshot();
  });

  it("fails with a non-iterable", () => {
    expect(() => {
      expect(0).toEqualSequence(0);
    }).toThrowErrorMatchingSnapshot();
    expect(0).not.toEqualSequence(0);
  });
  it("fails if the iterable is too short", () => {
    expect(() => {
      expect([0]).toEqualSequence(0, 1);
    }).toThrowErrorMatchingSnapshot();
    expect(() => {
      expect(new Set([0])).toEqualSequence(0, 1);
    }).toThrowErrorMatchingSnapshot();
  });
});

describe("toStrictEqualSequence", () => {
  it("works with an array", () => {
    expect([{ value: 1 }, { value: 2 }, { value: 3 }]).toStrictEqualSequence(
      { value: 1 },
      { value: 2 },
      { value: 3 },
    );
    expect([
      { value: 1 },
      { value: 2 },
      { value: 3 },
    ]).not.toStrictEqualSequence(
      { value: 1, surplus: undefined },
      { value: 2, surplus: undefined },
      { value: 3, surplus: undefined },
    );

    expect([{ value: 1 }, { value: 2 }, { value: 3 }]).toStrictEqualSequence(
      { value: 1 },
      { value: 2 },
    );

    expect(() => {
      expect([{ value: 1 }, { value: 2 }, { value: 3 }]).toStrictEqualSequence(
        { value: 1 },
        { value: 3 },
        { value: 2 },
      );
    }).toThrowErrorMatchingSnapshot();
  });
  it("works with other iterables", () => {
    expect(
      new Set([{ value: 1 }, { value: 2 }, { value: 3 }]),
    ).toStrictEqualSequence({ value: 1 }, { value: 2 }, { value: 3 });
    expect(
      new Set([{ value: 1 }, { value: 2 }, { value: 3 }]),
    ).not.toStrictEqualSequence(
      { value: 1, surplus: undefined },
      { value: 2, surplus: undefined },
      { value: 3, surplus: undefined },
    );

    expect(
      new Set([{ value: 1 }, { value: 2 }, { value: 3 }]),
    ).toStrictEqualSequence({ value: 1 }, { value: 2 });

    expect(() => {
      expect(
        new Set([{ value: 1 }, { value: 2 }, { value: 3 }]),
      ).toStrictEqualSequence({ value: 1 }, { value: 3 }, { value: 2 });
    }).toThrowErrorMatchingSnapshot();
  });

  it("fails with a non-iterable", () => {
    expect(() => {
      expect(0).toStrictEqualSequence(0);
    }).toThrowErrorMatchingSnapshot();
    expect(0).not.toStrictEqualSequence(0);
  });

  it("fails if the iterable is too short", () => {
    expect(() => {
      expect([{ value: 0 }]).toStrictEqualSequence({ value: 0 }, { value: 1 });
    }).toThrowErrorMatchingSnapshot();
    expect(() => {
      expect(new Set([{ value: 0 }])).toStrictEqualSequence(
        { value: 0 },
        { value: 1 },
      );
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

describe("strictSequenceOf", () => {
  it("works with an array", () => {
    expect({ value: [{ value: 1 }, { value: 2 }, { value: 3 }] }).toEqual({
      value: expect.strictSequenceOf({ value: 1 }, { value: 2 }, { value: 3 }),
    });
    expect({ value: [{ value: 1 }, { value: 2 }, { value: 3 }] }).toEqual({
      value: expect.not.strictSequenceOf(
        { value: 1, surplus: undefined },
        { value: 2, surplus: undefined },
        { value: 3, surplus: undefined },
      ),
    });

    expect({ value: [{ value: 1 }, { value: 2 }, { value: 3 }] }).toEqual({
      value: expect.strictSequenceOf({ value: 1 }, { value: 2 }),
    });

    expect(() => {
      expect({ value: [{ value: 1 }, { value: 2 }, { value: 3 }] }).toEqual({
        value: expect.strictSequenceOf(
          { value: 1 },
          { value: 3 },
          { value: 2 },
        ),
      });
    }).toThrowErrorMatchingSnapshot();
  });

  it("works with other iterables", () => {
    expect({
      value: new Set([{ value: 1 }, { value: 2 }, { value: 3 }]),
    }).toEqual({
      value: expect.strictSequenceOf({ value: 1 }, { value: 2 }, { value: 3 }),
    });
    expect({
      value: new Set([{ value: 1 }, { value: 2 }, { value: 3 }]),
    }).toEqual({
      value: expect.not.strictSequenceOf(
        { value: 1, surplus: undefined },
        { value: 2, surplus: undefined },
        { value: 3, surplus: undefined },
      ),
    });

    expect({
      value: new Set([{ value: 1 }, { value: 2 }, { value: 3 }]),
    }).toEqual({
      value: expect.strictSequenceOf({ value: 1 }, { value: 2 }),
    });

    expect(() => {
      expect({
        value: new Set([{ value: 1 }, { value: 2 }, { value: 3 }]),
      }).toEqual({
        value: expect.strictSequenceOf(
          { value: 1 },
          { value: 3 },
          { value: 2 },
        ),
      });
    }).toThrowErrorMatchingSnapshot();
  });

  it("fails with a non-iterable", () => {
    expect(() => {
      expect({ value: 0 }).toEqual({
        value: expect.strictSequenceOf(0),
      });
    }).toThrowErrorMatchingSnapshot();
    expect({ value: 0 }).toEqual({
      value: expect.not.strictSequenceOf(0),
    });
  });

  it("fails if the iterable is too short", () => {
    expect(() => {
      expect({ value: [{ value: 0 }] }).toEqual({
        value: expect.strictSequenceOf({ value: 0 }, { value: 1 }),
      });
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      expect({ value: new Set([{ value: 0 }]) }).toEqual({
        value: expect.strictSequenceOf({ value: 0 }, { value: 1 }),
      });
    }).toThrowErrorMatchingSnapshot();
  });
});
