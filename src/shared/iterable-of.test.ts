import { describe, it, expect } from "@globals";

describe("toBeIterableOf", () => {
  it("should match an iterable that contains only the expected values", () => {
    expect([1, 2, 3]).toBeIterableOf(expect.any(Number));
    expect(() => {
      expect([1, 2, 3]).not.toBeIterableOf(expect.any(Number));
    }).toThrowErrorMatchingSnapshot();

    expect(new Set([1, 2, 3])).toBeIterableOf(expect.any(Number));
    expect(() => {
      expect(new Set([1, 2, 3])).not.toBeIterableOf(expect.any(Number));
    }).toThrowErrorMatchingSnapshot();
  });

  it("should not match an iterable that contains a different value", () => {
    expect([1, 2, 3]).not.toBeIterableOf(expect.any(String));
    expect(() => {
      expect([1, 2, 3]).toBeIterableOf(expect.any(String));
    }).toThrowErrorMatchingSnapshot();

    expect(new Set([1, 2, 3])).not.toBeIterableOf(expect.any(String));

    expect(() => {
      expect(new Set([1, 2, 3])).toBeIterableOf(expect.any(String));
    }).toThrowErrorMatchingSnapshot();
  });

  it("should not match a non-iterable", () => {
    expect(1).not.toBeIterableOf(1);
    expect(() => {
      expect(1).toBeIterableOf(1);
    }).toThrowErrorMatchingSnapshot();
  });
});

describe("toBeStrictIterableOf", () => {
  it("should match an iterable that contains only the expected values", () => {
    expect([{ a: 1 }, { a: 2 }, { a: 3 }]).toBeStrictIterableOf({
      a: expect.any(Number),
    });
    expect(() => {
      expect([{ a: 1 }, { a: 2 }, { a: 3 }]).not.toBeStrictIterableOf({
        a: expect.any(Number),
      });
    }).toThrowErrorMatchingSnapshot();
    expect(() => {
      expect([{ a: 1 }, { a: 2 }, { a: 3 }]).toBeStrictIterableOf({
        a: expect.any(Number),
        b: undefined,
      });
    }).toThrowErrorMatchingSnapshot();

    expect(new Set([{ a: 1 }, { a: 2 }, { a: 3 }])).toBeStrictIterableOf({
      a: expect.any(Number),
    });
    expect(() => {
      expect(new Set([{ a: 1 }, { a: 2 }, { a: 3 }])).not.toBeStrictIterableOf({
        a: expect.any(Number),
      });
    }).toThrowErrorMatchingSnapshot();
    expect(() => {
      expect(new Set([{ a: 1 }, { a: 2 }, { a: 3 }])).toBeStrictIterableOf({
        a: expect.any(Number),
        b: undefined,
      });
    }).toThrowErrorMatchingSnapshot();
  });

  it("should not match an iterable that contains a different value", () => {
    expect([{ a: 1 }, { a: 2 }, { a: 3 }]).not.toBeStrictIterableOf({
      a: expect.any(String),
    });
    expect(() => {
      expect([{ a: 1 }, { a: 2 }, { a: 3 }]).toBeStrictIterableOf({
        a: expect.any(String),
      });
    }).toThrowErrorMatchingSnapshot();

    expect(new Set([{ a: 1 }, { a: 2 }, { a: 3 }])).not.toBeStrictIterableOf({
      a: expect.any(String),
    });
    expect(() => {
      expect(new Set([{ a: 1 }, { a: 2 }, { a: 3 }])).toBeStrictIterableOf({
        a: expect.any(String),
      });
    }).toThrowErrorMatchingSnapshot();
  });

  it("should not match a non-iterable", () => {
    expect(1).not.toBeStrictIterableOf(1);
    expect(() => {
      expect(1).toBeStrictIterableOf(1);
    }).toThrowErrorMatchingSnapshot();
  });
});

describe("toBeRecordOf", () => {
  it("should match a record that contains only the expected values", () => {
    expect({ a: 1, b: 2, c: 3 }).toBeRecordOf(expect.any(Number));
    expect(() => {
      expect({ a: 1, b: 2, c: 3 }).not.toBeRecordOf(expect.any(Number));
    }).toThrowErrorMatchingSnapshot();
  });

  it("should not match a record that contains a different value", () => {
    expect({ a: 1, b: 2, c: 3 }).not.toBeRecordOf(expect.any(String));
    expect(() => {
      expect({ a: 1, b: 2, c: 3 }).toBeRecordOf(expect.any(String));
    }).toThrowErrorMatchingSnapshot();
  });

  it("should not match a non-record", () => {
    expect(1).not.toBeRecordOf(1);
    expect(() => {
      expect(1).toBeRecordOf(1);
    }).toThrowErrorMatchingSnapshot();
  });
});

describe("toBeStrictRecordOf", () => {
  it("should match a record that contains only the expected values", () => {
    expect({ a: { a: 1 }, b: { a: 2 } }).toBeStrictRecordOf({
      a: expect.any(Number),
    });
    expect(() => {
      expect({ a: { a: 1 }, b: { a: 2 } }).not.toBeStrictRecordOf({
        a: expect.any(Number),
      });
    }).toThrowErrorMatchingSnapshot();
    expect(() => {
      expect({ a: { a: 1 }, b: { a: 2 } }).toBeStrictRecordOf({
        a: expect.any(Number),
        b: undefined,
      });
    }).toThrowErrorMatchingSnapshot();
  });

  it("should not match a record that contains a different value", () => {
    expect({ a: { a: 1 }, b: { a: 2 } }).not.toBeStrictRecordOf({
      a: expect.any(String),
    });
    expect(() => {
      expect({ a: { a: 1 }, b: { a: 2 } }).toBeStrictRecordOf({
        a: expect.any(String),
      });
    }).toThrowErrorMatchingSnapshot();
  });

  it("should not match a non-record", () => {
    expect(1).not.toBeStrictRecordOf(1);
    expect(() => {
      expect(1).toBeStrictRecordOf(1);
    }).toThrowErrorMatchingSnapshot();
  });
});

describe("iterableOf", () => {
  it("should match an iterable", () => {
    expect([1, 2, 3]).toEqual(expect.iterableOf(expect.any(Number)));
    expect(() => {
      expect([1, 2, 3]).toEqual(expect.not.iterableOf(expect.any(Number)));
    }).toThrowErrorMatchingSnapshot();

    expect(new Set([1, 2, 3])).toEqual(expect.iterableOf(expect.any(Number)));
    expect(() => {
      expect(new Set([1, 2, 3])).toEqual(
        expect.not.iterableOf(expect.any(Number)),
      );
    }).toThrowErrorMatchingSnapshot();
  });

  it("should not match an iterable that contains a different value", () => {
    expect([1, 2, 3]).toEqual(expect.not.iterableOf(expect.any(String)));
    expect(() => {
      expect([1, 2, 3]).toEqual(expect.iterableOf(expect.any(String)));
    }).toThrowErrorMatchingSnapshot();

    expect(new Set([1, 2, 3])).toEqual(
      expect.not.iterableOf(expect.any(String)),
    );
    expect(() => {
      expect(new Set([1, 2, 3])).toEqual(expect.iterableOf(expect.any(String)));
    }).toThrowErrorMatchingSnapshot();
  });

  it("should not match a non-iterable", () => {
    expect(() => {
      expect(1).toEqual(expect.iterableOf(1));
    }).toThrowErrorMatchingSnapshot();
  });
});

describe("strictIterableOf", () => {
  it("should match an iterable", () => {
    expect([{ a: 1 }, { a: 2 }, { a: 3 }]).toEqual(
      expect.strictIterableOf({ a: expect.any(Number) }),
    );
    expect(() => {
      expect([{ a: 1 }, { a: 2 }, { a: 3 }]).toEqual(
        expect.not.strictIterableOf({ a: expect.any(Number) }),
      );
    }).toThrowErrorMatchingSnapshot();
    expect(() => {
      expect([{ a: 1 }, { a: 2 }, { a: 3 }]).toEqual(
        expect.strictIterableOf({ a: expect.any(Number), b: undefined }),
      );
    }).toThrowErrorMatchingSnapshot();

    expect(new Set([{ a: 1 }, { a: 2 }, { a: 3 }])).toEqual(
      expect.strictIterableOf({ a: expect.any(Number) }),
    );
    expect(() => {
      expect(new Set([{ a: 1 }, { a: 2 }, { a: 3 }])).toEqual(
        expect.not.strictIterableOf({ a: expect.any(Number) }),
      );
    }).toThrowErrorMatchingSnapshot();
    expect(() => {
      expect(new Set([{ a: 1 }, { a: 2 }, { a: 3 }])).toEqual(
        expect.strictIterableOf({ a: expect.any(Number), b: undefined }),
      );
    }).toThrowErrorMatchingSnapshot();
  });

  it("should not match an iterable that contains a different value", () => {
    expect([{ a: 1 }, { a: 2 }, { a: 3 }]).not.toEqual(
      expect.strictIterableOf({ a: expect.any(String) }),
    );
    expect(() => {
      expect([{ a: 1 }, { a: 2 }, { a: 3 }]).toEqual(
        expect.strictIterableOf({ a: expect.any(String) }),
      );
    }).toThrowErrorMatchingSnapshot();

    expect(new Set([{ a: 1 }, { a: 2 }, { a: 3 }])).toEqual(
      expect.not.strictIterableOf({ a: expect.any(String) }),
    );
    expect(() => {
      expect(new Set([{ a: 1 }, { a: 2 }, { a: 3 }])).toEqual(
        expect.strictIterableOf({ a: expect.any(String) }),
      );
    }).toThrowErrorMatchingSnapshot();
  });

  it("should not match a non-iterable", () => {
    expect(() => {
      expect(1).toEqual(expect.strictIterableOf(1));
    }).toThrowErrorMatchingSnapshot();
  });
});

describe("recordOf", () => {
  it("should match a record", () => {
    expect({ a: 1, b: 2, c: 3 }).toEqual(expect.recordOf(expect.any(Number)));
    expect(() => {
      expect({ a: 1, b: 2, c: 3 }).toEqual(
        expect.not.recordOf(expect.any(Number)),
      );
    }).toThrowErrorMatchingSnapshot();
  });

  it("should not match a record that contains a different value", () => {
    expect({ a: 1, b: 2, c: 3 }).toEqual(
      expect.not.recordOf(expect.any(String)),
    );
    expect(() => {
      expect({ a: 1, b: 2, c: 3 }).toEqual(expect.recordOf(expect.any(String)));
    }).toThrowErrorMatchingSnapshot();
  });

  it("should not match a non-record", () => {
    expect(() => {
      expect(1).toEqual(expect.recordOf(1));
    }).toThrowErrorMatchingSnapshot();
  });
});

describe("strictRecordOf", () => {
  it("should match a record", () => {
    expect({ a: { a: 1 }, b: { a: 2 } }).toEqual(
      expect.strictRecordOf({ a: expect.any(Number) }),
    );
    expect(() => {
      expect({ a: { a: 1 }, b: { a: 2 } }).toEqual(
        expect.not.strictRecordOf({ a: expect.any(Number) }),
      );
    }).toThrowErrorMatchingSnapshot();
    expect(() => {
      expect({ a: { a: 1 }, b: { a: 2 } }).toEqual(
        expect.strictRecordOf({ a: expect.any(Number), b: undefined }),
      );
    }).toThrowErrorMatchingSnapshot();
  });

  it("should not match a record that contains a different value", () => {
    expect({ a: { a: 1 }, b: { a: 2 } }).toEqual(
      expect.not.strictRecordOf({ a: expect.any(String) }),
    );
    expect(() => {
      expect({ a: { a: 1 }, b: { a: 2 } }).toEqual(
        expect.strictRecordOf({ a: expect.any(String) }),
      );
    }).toThrowErrorMatchingSnapshot();
  });

  it("should not match a non-record", () => {
    expect(() => {
      expect(1).toEqual(expect.strictRecordOf(1));
    }).toThrowErrorMatchingSnapshot();
  });
});
