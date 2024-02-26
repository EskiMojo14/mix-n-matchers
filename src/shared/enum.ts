import type { MatcherHintOptions } from "jest-matcher-utils";
import { matcherHint, printExpected, printReceived } from "jest-matcher-utils";
import type { EnumLike } from "../utils/enum";
import { getValidEnumValues } from "../utils/enum";
import type { MatcherFunction } from "../utils/types";

const createEnumMatcher = (
  matcherName: string,
  asymmetric: boolean,
): MatcherFunction<[EnumLike]> =>
  function toBeEnum(received, expected) {
    const options: MatcherHintOptions = {
      isNot: this.isNot,
      promise: this.promise,
      isDirectExpectCall: asymmetric,
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

/**
 * Asserts that a value is a valid enum value.
 *
 * Takes a standard Typescript enum, which can be numeric, string based, or a mix of both - or a "const object" style enum.
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
export const toBeEnum = createEnumMatcher("toBeEnum", false);

/**
 * Matches a valid enum value.
 *
 * Takes a standard Typescript enum, which can be numeric, string based, or a mix of both - or a "const object" style enum.
 *
 * @example
 * enum Direction {
 *   Up,
 *   Down,
 *   Left,
 *   Right,
 * }
 */
export const ofEnum = createEnumMatcher("ofEnum", true);

declare module "mix-n-matchers" {
  export interface MixNMatchers<R, T = unknown> {
    /**
     * Asserts that a value is a valid enum value.
     *
     * Works with standard Typescript enums, or "const object" style enums.
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
    toBeEnum(expected: EnumLike): R;
  }
  interface AsymmetricMixNMatchers {
    /**
     * Matches a valid enum value.
     *
     * Works with standard Typescript enums, or "const object" style enums.
     *
     * @example
     * enum Direction {
     *   Up,
     *   Down,
     *   Left,
     *   Right,
     * }
     *
     * expect(getDirection()).toEqual(expect.ofEnum(Direction));
     */
    ofEnum(expected: EnumLike): any;
  }
}
