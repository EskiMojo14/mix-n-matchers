import { describe, expect, it } from "vitest";
import { alignedAnsiStyleSerializer } from "../utils/tests";

expect.addSnapshotSerializer(alignedAnsiStyleSerializer);

describe("toBeEnum", () => {
  enum NumericEnum {
    Zero,
    One,
    Two,
  }
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

  enum StringEnum {
    Zero = "Zero",
    One = "One",
    Two = "Two",
  }
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

  enum MixedEnum {
    Zero,
    One = "One",
    Two = 2,
  }
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

  const ConstObject = {
    Zero: 0,
    One: 1,
    Two: 2,
  } as const;
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
