import { expect, describe, it } from "@globals";
import { getValidEnumValues } from "./enum";

describe("enum utils", () => {
  describe("getValidEnumValues", () => {
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
    it("should return valid enum values for numeric enums", () => {
      expect(Object.keys(NumericEnum)).toEqual([
        "0",
        "1",
        "2",
        "Zero",
        "One",
        "Two",
      ]);
      expect(Object.values(NumericEnum)).toEqual([
        "Zero",
        "One",
        "Two",
        0,
        1,
        2,
      ]);

      const result = getValidEnumValues(NumericEnum);
      expect(result).toEqual([0, 1, 2]);
    });
    it("should return valid enum values for string enums", () => {
      expect(Object.keys(StringEnum)).toEqual(["Zero", "One", "Two"]);
      expect(Object.values(StringEnum)).toEqual(["Zero", "One", "Two"]);
      const result = getValidEnumValues(StringEnum);
      expect(result).toEqual(["Zero", "One", "Two"]);
    });
    it("should return valid enum values for mixed enums", () => {
      expect(Object.keys(MixedEnum)).toEqual(["0", "2", "Zero", "One", "Two"]);
      expect(Object.values(MixedEnum)).toEqual(["Zero", "Two", 0, "One", 2]);
      const result = getValidEnumValues(MixedEnum);
      expect(result).toEqual([0, "One", 2]);
    });
  });
});
