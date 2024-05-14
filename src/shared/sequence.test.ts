/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { describe, it, expect } from "@globals";

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

describe("toContainSequence", () => {
  it("matches a full sequence", () => {
    expect([1, 2, 3]).toContainSequence(1, 2, 3);
    expect(new Set([1, 2, 3])).toContainSequence(1, 2, 3);
  });
  it("matches a partial sequence", () => {
    expect([1, 2, 3]).toContainSequence(2, 3);
    expect(new Set([1, 2, 3])).toContainSequence(2, 3);
  });
  it("fails if the sequence is not found", () => {
    expect(() => {
      expect([1, 2, 3]).toContainSequence(2, 1);
    }).toThrowErrorMatchingSnapshot();
    expect(() => {
      expect(new Set([1, 2, 3])).toContainSequence(2, 1);
    }).toThrowErrorMatchingSnapshot();
  });
  it("fails if only part of the sequence is found", () => {
    expect(() => {
      expect([1, 2, 3]).toContainSequence(1, 3);
    }).toThrowErrorMatchingSnapshot();
    expect(() => {
      expect(new Set([1, 2, 3])).toContainSequence(1, 3);
    }).toThrowErrorMatchingSnapshot();
  });
  it("succeeds if the sequence is after a part of the sequence", () => {
    expect([2, 1, 2, 3]).toContainSequence(2, 3);
    // not possible with a Set, as values only appear once
  });
});

describe("toContainEqualSequence", () => {
  it("matches a full sequence", () => {
    expect([1, 2, 3]).toContainEqualSequence(1, 2, 3);
    expect(new Set([1, 2, 3])).toContainEqualSequence(1, 2, 3);
  });
  it("matches a partial sequence", () => {
    expect([1, 2, 3]).toContainEqualSequence(2, 3);
    expect(new Set([1, 2, 3])).toContainEqualSequence(2, 3);
  });
  it("fails if the sequence is not found", () => {
    expect(() => {
      expect([1, 2, 3]).toContainEqualSequence(2, 1);
    }).toThrowErrorMatchingSnapshot();
    expect(() => {
      expect(new Set([1, 2, 3])).toContainEqualSequence(2, 1);
    }).toThrowErrorMatchingSnapshot();
  });
  it("fails if only part of the sequence is found", () => {
    expect(() => {
      expect([1, 2, 3]).toContainEqualSequence(1, 3);
    }).toThrowErrorMatchingSnapshot();
    expect(() => {
      expect(new Set([1, 2, 3])).toContainEqualSequence(1, 3);
    }).toThrowErrorMatchingSnapshot();
  });
  it("succeeds if the sequence is after a part of the sequence", () => {
    expect([2, 1, 2, 3]).toContainEqualSequence(2, 3);
    // not possible with a Set, as values only appear once
  });
});

describe("toContainStrictEqualSequence", () => {
  it("matches a full sequence", () => {
    expect([
      { value: 1 },
      { value: 2 },
      { value: 3 },
    ]).toContainStrictEqualSequence({ value: 1 }, { value: 2 }, { value: 3 });
    expect(
      new Set([{ value: 1 }, { value: 2 }, { value: 3 }]),
    ).toContainStrictEqualSequence({ value: 1 }, { value: 2 }, { value: 3 });
  });
  it("matches a partial sequence", () => {
    expect([
      { value: 1 },
      { value: 2 },
      { value: 3 },
    ]).toContainStrictEqualSequence({ value: 2 }, { value: 3 });
    expect(
      new Set([{ value: 1 }, { value: 2 }, { value: 3 }]),
    ).toContainStrictEqualSequence({ value: 2 }, { value: 3 });
  });
  it("fails if the sequence is not found", () => {
    expect(() => {
      expect([
        { value: 1 },
        { value: 2 },
        { value: 3 },
      ]).toContainStrictEqualSequence({ value: 2 }, { value: 1 });
    }).toThrowErrorMatchingSnapshot();
    expect(() => {
      expect(
        new Set([{ value: 1 }, { value: 2 }, { value: 3 }]),
      ).toContainStrictEqualSequence({ value: 2 }, { value: 1 });
    }).toThrowErrorMatchingSnapshot();
  });
  it("fails if only part of the sequence is found", () => {
    expect(() => {
      expect([
        { value: 1 },
        { value: 2 },
        { value: 3 },
      ]).toContainStrictEqualSequence({ value: 1 }, { value: 3 });
    }).toThrowErrorMatchingSnapshot();
    expect(() => {
      expect(
        new Set([{ value: 1 }, { value: 2 }, { value: 3 }]),
      ).toContainStrictEqualSequence({ value: 1 }, { value: 3 });
    }).toThrowErrorMatchingSnapshot();
  });
  it("succeeds if the sequence is after a part of the sequence", () => {
    expect([
      { value: 2 },
      { value: 1 },
      { value: 2 },
      { value: 3 },
    ]).toContainStrictEqualSequence({ value: 2 }, { value: 3 });
    expect(
      new Set([{ value: 2 }, { value: 1 }, { value: 2 }, { value: 3 }]),
    ).toContainStrictEqualSequence({ value: 2 }, { value: 3 });
  });
});

describe("containingSequence", () => {
  it("matches a full sequence", () => {
    expect({ array: [1, 2, 3] }).toEqual({
      array: expect.containingSequence(1, 2, 3),
    });
    expect({ array: new Set([1, 2, 3]) }).toEqual({
      array: expect.containingSequence(1, 2, 3),
    });
  });
  it("matches a partial sequence", () => {
    expect({ array: [1, 2, 3] }).toEqual({
      array: expect.containingSequence(2, 3),
    });
    expect({ array: new Set([1, 2, 3]) }).toEqual({
      array: expect.containingSequence(2, 3),
    });
  });
  it("fails if the sequence is not found", () => {
    expect(() => {
      expect({ array: [1, 2, 3] }).toEqual({
        array: expect.containingSequence(2, 1),
      });
    }).toThrowErrorMatchingSnapshot();
    expect(() => {
      expect({ array: new Set([1, 2, 3]) }).toEqual({
        array: expect.containingSequence(2, 1),
      });
    }).toThrowErrorMatchingSnapshot();
  });
  it("fails if only part of the sequence is found", () => {
    expect(() => {
      expect({ array: [1, 2, 3] }).toEqual({
        array: expect.containingSequence(1, 3),
      });
    }).toThrowErrorMatchingSnapshot();
    expect(() => {
      expect({ array: new Set([1, 2, 3]) }).toEqual({
        array: expect.containingSequence(1, 3),
      });
    }).toThrowErrorMatchingSnapshot();
  });
  it("succeeds if the sequence is after a part of the sequence", () => {
    expect({ array: [2, 1, 2, 3] }).toEqual({
      array: expect.containingSequence(2, 3),
    });
    // not possible with a Set, as values only appear once
  });
});

describe("containingEqualSequence", () => {
  it("matches a full sequence", () => {
    expect({ array: [1, 2, 3] }).toEqual({
      array: expect.containingEqualSequence(1, 2, 3),
    });
    expect({ array: new Set([1, 2, 3]) }).toEqual({
      array: expect.containingEqualSequence(1, 2, 3),
    });
  });
  it("matches a partial sequence", () => {
    expect({ array: [1, 2, 3] }).toEqual({
      array: expect.containingEqualSequence(2, 3),
    });
    expect({ array: new Set([1, 2, 3]) }).toEqual({
      array: expect.containingEqualSequence(2, 3),
    });
  });
  it("fails if the sequence is not found", () => {
    expect(() => {
      expect({ array: [1, 2, 3] }).toEqual({
        array: expect.containingEqualSequence(2, 1),
      });
    }).toThrowErrorMatchingSnapshot();
    expect(() => {
      expect({ array: new Set([1, 2, 3]) }).toEqual({
        array: expect.containingEqualSequence(2, 1),
      });
    }).toThrowErrorMatchingSnapshot();
  });
  it("fails if only part of the sequence is found", () => {
    expect(() => {
      expect({ array: [1, 2, 3] }).toEqual({
        array: expect.containingEqualSequence(1, 3),
      });
    }).toThrowErrorMatchingSnapshot();
    expect(() => {
      expect({ array: new Set([1, 2, 3]) }).toEqual({
        array: expect.containingEqualSequence(1, 3),
      });
    }).toThrowErrorMatchingSnapshot();
  });
  it("succeeds if the sequence is after a part of the sequence", () => {
    expect({ array: [2, 1, 2, 3] }).toEqual({
      array: expect.containingEqualSequence(2, 3),
    });
    // not possible with a Set, as values only appear once
  });
});

describe("containingStrictEqualSequence", () => {
  it("matches a full sequence", () => {
    expect({ array: [{ value: 1 }, { value: 2 }, { value: 3 }] }).toEqual({
      array: expect.containingStrictEqualSequence(
        { value: 1 },
        { value: 2 },
        { value: 3 },
      ),
    });
    expect({
      array: new Set([{ value: 1 }, { value: 2 }, { value: 3 }]),
    }).toEqual({
      array: expect.containingStrictEqualSequence(
        { value: 1 },
        { value: 2 },
        { value: 3 },
      ),
    });
  });
  it("matches a partial sequence", () => {
    expect({ array: [{ value: 1 }, { value: 2 }, { value: 3 }] }).toEqual({
      array: expect.containingStrictEqualSequence({ value: 2 }, { value: 3 }),
    });
    expect({
      array: new Set([{ value: 1 }, { value: 2 }, { value: 3 }]),
    }).toEqual({
      array: expect.containingStrictEqualSequence({ value: 2 }, { value: 3 }),
    });
  });
  it("fails if the sequence is not found", () => {
    expect(() => {
      expect({ array: [{ value: 1 }, { value: 2 }, { value: 3 }] }).toEqual({
        array: expect.containingStrictEqualSequence({ value: 2 }, { value: 1 }),
      });
    }).toThrowErrorMatchingSnapshot();
    expect(() => {
      expect({
        array: new Set([{ value: 1 }, { value: 2 }, { value: 3 }]),
      }).toEqual({
        array: expect.containingStrictEqualSequence({ value: 2 }, { value: 1 }),
      });
    }).toThrowErrorMatchingSnapshot();
  });
  it("fails if only part of the sequence is found", () => {
    expect(() => {
      expect({ array: [{ value: 1 }, { value: 2 }, { value: 3 }] }).toEqual({
        array: expect.containingStrictEqualSequence({ value: 1 }, { value: 3 }),
      });
    }).toThrowErrorMatchingSnapshot();
    expect(() => {
      expect({
        array: new Set([{ value: 1 }, { value: 2 }, { value: 3 }]),
      }).toEqual({
        array: expect.containingStrictEqualSequence({ value: 1 }, { value: 3 }),
      });
    }).toThrowErrorMatchingSnapshot();
  });
  it("succeeds if the sequence is after a part of the sequence", () => {
    expect({
      array: [{ value: 2 }, { value: 1 }, { value: 2 }, { value: 3 }],
    }).toEqual({
      array: expect.containingStrictEqualSequence({ value: 2 }, { value: 3 }),
    });
    expect({
      array: new Set([{ value: 2 }, { value: 1 }, { value: 2 }, { value: 3 }]),
    }).toEqual({
      array: expect.containingStrictEqualSequence({ value: 2 }, { value: 3 }),
    });
  });
});

describe("toContainSequenceSatisfying", () => {
  it("matches a full sequence", () => {
    expect([1, 2, 3]).toContainSequenceSatisfying(
      (x) => x === 1,
      (x) => x === 2,
      (x) => x === 3,
    );
    expect(new Set([1, 2, 3])).toContainSequenceSatisfying(
      (x) => x === 1,
      (x) => x === 2,
      (x) => x === 3,
    );
  });
  it("matches a partial sequence", () => {
    expect([1, 2, 3]).toContainSequenceSatisfying(
      (x) => x === 2,
      (x) => x === 3,
    );
    expect(new Set([1, 2, 3])).toContainSequenceSatisfying(
      (x) => x === 2,
      (x) => x === 3,
    );
  });
  it("fails if the sequence is not found", () => {
    expect(() => {
      expect([1, 2, 3]).toContainSequenceSatisfying(
        (x) => x === 2,
        (x) => x === 1,
      );
    }).toThrowErrorMatchingSnapshot();
    expect(() => {
      expect(new Set([1, 2, 3])).toContainSequenceSatisfying(
        (x) => x === 2,
        (x) => x === 1,
      );
    }).toThrowErrorMatchingSnapshot();
  });
  it("fails if only part of the sequence is found", () => {
    expect(() => {
      expect([1, 2, 3]).toContainSequenceSatisfying(
        (x) => x === 1,
        (x) => x === 3,
      );
    }).toThrowErrorMatchingSnapshot();
    expect(() => {
      expect(new Set([1, 2, 3])).toContainSequenceSatisfying(
        (x) => x === 1,
        (x) => x === 3,
      );
    }).toThrowErrorMatchingSnapshot();
  });
  it("succeeds if the sequence is after a part of the sequence", () => {
    expect([2, 1, 2, 3]).toContainSequenceSatisfying(
      (x) => x === 2,
      (x) => x === 3,
    );
    // not possible with a Set, as values only appear once
  });
  it("fails if one of the predicates is not a function", () => {
    expect(() => {
      expect([0, 1]).toContainSequenceSatisfying(
        (x) => x === 0,
        // @ts-expect-error testing invalid usage
        1,
      );
    }).toThrowErrorMatchingSnapshot();
  });
});

describe("containingSequenceSatisfying", () => {
  it("matches a full sequence", () => {
    expect({ array: [1, 2, 3] }).toEqual({
      array: expect.containingSequenceSatisfying(
        (x) => x === 1,
        (x) => x === 2,
        (x) => x === 3,
      ),
    });
    expect({ array: new Set([1, 2, 3]) }).toEqual({
      array: expect.containingSequenceSatisfying(
        (x) => x === 1,
        (x) => x === 2,
        (x) => x === 3,
      ),
    });
  });
  it("matches a partial sequence", () => {
    expect({ array: [1, 2, 3] }).toEqual({
      array: expect.containingSequenceSatisfying(
        (x) => x === 2,
        (x) => x === 3,
      ),
    });
    expect({ array: new Set([1, 2, 3]) }).toEqual({
      array: expect.containingSequenceSatisfying(
        (x) => x === 2,
        (x) => x === 3,
      ),
    });
  });
  it("fails if the sequence is not found", () => {
    expect(() => {
      expect({ array: [1, 2, 3] }).toEqual({
        array: expect.containingSequenceSatisfying(
          (x) => x === 2,
          (x) => x === 1,
        ),
      });
    }).toThrowErrorMatchingSnapshot();
    expect(() => {
      expect({ array: new Set([1, 2, 3]) }).toEqual({
        array: expect.containingSequenceSatisfying(
          (x) => x === 2,
          (x) => x === 1,
        ),
      });
    }).toThrowErrorMatchingSnapshot();
  });
  it("fails if only part of the sequence is found", () => {
    expect(() => {
      expect({ array: [1, 2, 3] }).toEqual({
        array: expect.containingSequenceSatisfying(
          (x) => x === 1,
          (x) => x === 3,
        ),
      });
    }).toThrowErrorMatchingSnapshot();
    expect(() => {
      expect({ array: new Set([1, 2, 3]) }).toEqual({
        array: expect.containingSequenceSatisfying(
          (x) => x === 1,
          (x) => x === 3,
        ),
      });
    }).toThrowErrorMatchingSnapshot();
  });
  it("succeeds if the sequence is after a part of the sequence", () => {
    expect({ array: [2, 1, 2, 3] }).toEqual({
      array: expect.containingSequenceSatisfying(
        (x) => x === 2,
        (x) => x === 3,
      ),
    });
    // not possible with a Set, as values only appear once
  });
  it("fails if one of the predicates is not a function", () => {
    expect(() => {
      expect({ array: [0, 1] }).toEqual({
        array: expect.containingSequenceSatisfying(
          (x) => x === 0,
          // @ts-expect-error testing invalid usage
          1,
        ),
      });
    }).toThrowErrorMatchingSnapshot();
  });
});
