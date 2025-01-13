import type { MatcherHintOptions } from "jest-matcher-utils";
import { matcherHint, printReceived } from "jest-matcher-utils";
import { makeEqualValue } from "../utils";
import type { MatcherFunction } from "../utils/types";

/**
 * Checks if value matches one of provided values.
 * Uses deep equality comparison.
 *
 * Optionally, you can provide an expected type via the generic.
 *
 * @example
 * expect(1).toEqual(expect.oneOf([1, 2, 3])); // pass
 * expect(2).toEqual(expect.oneOf([1, 2, 3]));
 * expect(3).toEqual(expect.oneOf([1, 2, 3]));
 * expect(4).toEqual(expect.oneOf([1, 2, 3])); // fails
 */
export const oneOf: MatcherFunction<[Array<unknown>]> = function (
  value,
  expected,
) {
  const matcherName = "oneOf";
  const options: MatcherHintOptions = {
    isNot: this.isNot,
    promise: this.promise,
    isDirectExpectCall: true,
  };

  const equalValue = makeEqualValue(this);

  const pass = expected.some((expectedItem) => equalValue(value, expectedItem));

  return {
    pass,
    message: () =>
      matcherHint(matcherName, undefined, undefined, options) +
      "\n\n" +
      `Expected ${printReceived(value)} to be one of ${expected.map(printReceived).join(", ")}`,
  };
};

declare module "mix-n-matchers" {
  export interface AsymmetricMixNMatchers {
    /**
     * Checks if value matches one of provided values.
     * Uses deep equality comparison.
     *
     * Optionally, you can provide an expected type via the generic.
     *
     * @example
     * expect(1).toEqual(expect.oneOf([1, 2, 3])); // pass
     * expect(2).toEqual(expect.oneOf([1, 2, 3]));
     * expect(3).toEqual(expect.oneOf([1, 2, 3]));
     * expect(4).toEqual(expect.oneOf([1, 2, 3])); // fails
     */
    oneOf<E>(expected: ReadonlyArray<E>): any;
  }
}
