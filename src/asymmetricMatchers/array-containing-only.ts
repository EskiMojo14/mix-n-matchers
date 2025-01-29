import {
  EXPECTED_COLOR,
  matcherErrorMessage,
  matcherHint,
  printExpected,
  printReceived,
  printWithType,
  stringify,
} from "jest-matcher-utils";
import { makeEqualValue } from "../utils";
import { assert } from "../utils/assert";
import type { MatcherFunction } from "../utils/types";

/**
 * Matches any array that contains only the expected values.
 * The array may contain as many of each expected value as it likes (or none), but no other values.
 *
 * @example
 * expect([1, 2, 2, 3]).toEqual(expect.arrayContainingOnly([1, 2, 3])); // pass
 * expect([1, 2, 2, 3]).toEqual(expect.arrayContainingOnly([1, 2])); // fail
 *
 * // whereas
 * expect([1, 2, 2, 3]).toEqual(expect.arrayContaining([1, 2])); // pass
 */
export const arrayContainingOnly: MatcherFunction<[expected: Array<unknown>]> =
  function (received, expected) {
    assert(Array.isArray(expected), () =>
      matcherErrorMessage(
        matcherHint("arrayContainingOnly", undefined, expected as never, {
          isNot: this.isNot,
          promise: this.promise,
          isDirectExpectCall: true,
        }),
        `${EXPECTED_COLOR("Expected")} value must be an array`,
        printWithType("Expected", expected, stringify),
      ),
    );
    const equalValue = makeEqualValue(this);
    const pass =
      Array.isArray(received) &&
      received.every((item) =>
        expected.some((expectedItem) => equalValue(item, expectedItem)),
      );
    return {
      pass,
      message: () =>
        pass
          ? `expected ${printReceived(received)} not to be an array containing only elements from ${printExpected(expected)}`
          : `expected ${printReceived(received)} to to be an array containing only elements from ${printExpected(expected)}`,
    };
  };

declare module "mix-n-matchers" {
  export interface AsymmetricMixNMatchers {
    /**
     * Use `arrayContainingOnly` to expect an array to contain only the expected values.
     * The array may contain as many of each expected value as it likes (or none), but no other values.
     *
     * Optionally, you can provide a type for the elements using a generic.
     * @example
     * expect([1, 2, 2, 3]).toEqual(expect.arrayContainingOnly([1, 2, 3])); // pass
     * expect([1, 2, 2, 3]).toEqual(expect.arrayContainingOnly([1, 2])); // fail
     *
     * // whereas
     * expect([1, 2, 2, 3]).toEqual(expect.arrayContaining([1, 2])); // pass
     */
    arrayContainingOnly<E = any>(expected: Array<E>): any;
  }
}
