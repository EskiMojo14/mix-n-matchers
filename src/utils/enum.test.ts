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
      const result = getValidEnumValues(NumericEnum);
      expect(result).toEqual([0, 1, 2]);
    });
    it("should return valid enum values for string enums", () => {
      const result = getValidEnumValues(StringEnum);
      expect(result).toEqual(["Zero", "One", "Two"]);
    });
    it("should return valid enum values for mixed enums", () => {
      const result = getValidEnumValues(MixedEnum);
      expect(result).toEqual([0, "One", 2]);
    });
  });
});
