import type { MatcherHintOptions } from "jest-matcher-utils";
import { matcherHint, printExpected, printReceived } from "jest-matcher-utils";
import type { EnumLike } from "../utils/enum";
import { getValidEnumValues } from "../utils/enum";
import type { MatcherFunction } from "../utils/types";

/**
 * Use .toBeEnum to check that a value is a valid enum value.
 *
 * Takes a standard Typescript enum, which can be numeric, string based, or a mix of both.
 *
 * @example
 * enum Direction {
 *   Up,
 *   Down,
 *   Left,
 *   Right,
 * }
 *
 * expect(getDirection()).toBeEnum(Direction);
 */
export const toBeEnum: MatcherFunction<[expected: EnumLike]> = function (
  received,
  expected,
) {
  const matcherName = "toBeEnum";
  const options: MatcherHintOptions = {
    isNot: this.isNot,
    promise: this.promise,
  };
  const validValues = getValidEnumValues(expected);
  const pass = validValues.includes(received as any);
  return {
    pass,
    message: () =>
      matcherHint(matcherName, undefined, undefined, options) +
      "\n\n" +
      `Expected ${printReceived(received)} ${pass ? "not " : ""}to be a valid enum value. Valid values are: ${validValues.map(printExpected).join(", ")}.`,
  };
};

declare module "./index" {
  interface MixNMatchers<R> {
    /**
     * Use .toBeEnum to check that a value is a valid enum value.
     *
     * @example
     * enum Direction {
     *   Up,
     *   Down,
     *   Left,
     *   Right,
     * }
     *
     * expect(getDirection()).toBeEnum(Direction);
     */
    toBeEnum: (expected: EnumLike) => R;
  }
}
