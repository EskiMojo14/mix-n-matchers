import type { MatcherHintOptions } from "jest-matcher-utils";
import { matcherHint, printExpected, printReceived } from "jest-matcher-utils";
import type { EnumLike } from "../utils/enum";
import { getValidEnumValues } from "../utils/enum";
import type { MatcherFunction } from "../utils/types";

const makeEnumMatcher = (
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
export const toBeEnum = makeEnumMatcher("toBeEnum", false);

declare module "../matchers" {
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
    toBeEnum(expected: EnumLike): R;
  }
}

export const ofEnum = makeEnumMatcher("ofEnum", true);

declare module "../asymmetricMatchers" {
  interface AsymmetricMixNMatchers {
    /**
     * Checks that a value is a valid enum value.
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