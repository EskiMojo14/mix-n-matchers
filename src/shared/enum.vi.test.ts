import { describe, expect, it } from "vitest";
import { alignedAnsiStyleSerializer } from "../utils/tests";

expect.addSnapshotSerializer(alignedAnsiStyleSerializer);

enum NumericEnum {
  Zero,
  One,
  Two,
}

enum StringEnum {
  Zero = "Zero",
  One = "One",
  Two = "Two",
}

enum MixedEnum {
  Zero,
  One = "One",
  Two = 2,
}

const ConstObject = {
  Zero: 0,
  One: 1,
  Two: 2,
} as const;

describe("toBeEnum", () => {
  it("works when called with a numeric enum", () => {
    expect(NumericEnum.Zero).toBeEnum(NumericEnum);
    expect(NumericEnum.One).toBeEnum(NumericEnum);
    expect(() => {
      expect(3).toBeEnum(NumericEnum);
    }).toThrowErrorMatchingSnapshot();

    expect(3).not.toBeEnum(NumericEnum);
    expect(() => {
      expect(NumericEnum.Zero).not.toBeEnum(NumericEnum);
    }).toThrowErrorMatchingSnapshot();
  });

  it("works when called with a string enum", () => {
    expect(StringEnum.Zero).toBeEnum(StringEnum);
    expect(StringEnum.One).toBeEnum(StringEnum);
    expect(() => {
      expect("Three").toBeEnum(StringEnum);
    }).toThrowErrorMatchingSnapshot();

    expect("Three").not.toBeEnum(StringEnum);
    expect(() => {
      expect(StringEnum.Zero).not.toBeEnum(StringEnum);
    }).toThrowErrorMatchingSnapshot();
  });

  it("works when called with a mixed enum", () => {
    expect(MixedEnum.Zero).toBeEnum(MixedEnum);
    expect(MixedEnum.One).toBeEnum(MixedEnum);
    expect(MixedEnum.Two).toBeEnum(MixedEnum);
    expect(() => {
      expect("Three").toBeEnum(MixedEnum);
    }).toThrowErrorMatchingSnapshot();

    expect("Three").not.toBeEnum(MixedEnum);
    expect(() => {
      expect(MixedEnum.Zero).not.toBeEnum(MixedEnum);
    }).toThrowErrorMatchingSnapshot();
  });

  it("works when called with a const object", () => {
    expect(ConstObject.Zero).toBeEnum(ConstObject);
    expect(ConstObject.One).toBeEnum(ConstObject);
    expect(() => {
      expect(3).toBeEnum(ConstObject);
    }).toThrowErrorMatchingSnapshot();

    expect(3).not.toBeEnum(ConstObject);
    expect(() => {
      expect(ConstObject.Zero).not.toBeEnum(ConstObject);
    }).toThrowErrorMatchingSnapshot();
  });
});

describe("expect.ofEnum", () => {
  it("works when called with a numeric enum", () => {
    expect(NumericEnum.Zero).toEqual(expect.ofEnum(NumericEnum));
    expect(NumericEnum.One).toEqual(expect.ofEnum(NumericEnum));
    expect(() => {
      expect(3).toEqual(expect.ofEnum(NumericEnum));
    }).toThrowErrorMatchingSnapshot();

    expect(3).not.toEqual(expect.ofEnum(NumericEnum));
    expect(() => {
      expect(NumericEnum.Zero).toEqual(expect.not.ofEnum(NumericEnum));
    }).toThrowErrorMatchingSnapshot();
  });

  it("works when called with a string enum", () => {
    expect(StringEnum.Zero).toEqual(expect.ofEnum(StringEnum));
    expect(StringEnum.One).toEqual(expect.ofEnum(StringEnum));
    expect(() => {
      expect("Three").toEqual(expect.ofEnum(StringEnum));
    }).toThrowErrorMatchingSnapshot();

    expect("Three").not.toEqual(expect.ofEnum(StringEnum));
    expect(() => {
      expect(StringEnum.Zero).toEqual(expect.not.ofEnum(StringEnum));
    }).toThrowErrorMatchingSnapshot();
  });

  it("works when called with a mixed enum", () => {
    expect(MixedEnum.Zero).toEqual(expect.ofEnum(MixedEnum));
    expect(MixedEnum.One).toEqual(expect.ofEnum(MixedEnum));
    expect(MixedEnum.Two).toEqual(expect.ofEnum(MixedEnum));
    expect(() => {
      expect("Three").toEqual(expect.ofEnum(MixedEnum));
    }).toThrowErrorMatchingSnapshot();

    expect("Three").not.toEqual(expect.ofEnum(MixedEnum));
    expect(() => {
      expect(MixedEnum.Zero).toEqual(expect.not.ofEnum(MixedEnum));
    }).toThrowErrorMatchingSnapshot();
  });

  it("works when called with a const object", () => {
    expect(ConstObject.Zero).toEqual(expect.ofEnum(ConstObject));
    expect(ConstObject.One).toEqual(expect.ofEnum(ConstObject));
    expect(() => {
      expect(3).toEqual(expect.ofEnum(ConstObject));
    }).toThrowErrorMatchingSnapshot();

    expect(3).not.toEqual(expect.ofEnum(ConstObject));
    expect(() => {
      expect(ConstObject.Zero).toEqual(expect.not.ofEnum(ConstObject));
    }).toThrowErrorMatchingSnapshot();
  });

  it("can be aliased to expect.enum", () => {
    expect(NumericEnum.Zero).toEqual(expect.enum(NumericEnum));

    expect(() => {
      expect("Three").toEqual(expect.enum(NumericEnum));
    }).toThrowErrorMatchingSnapshot();
  });
});
