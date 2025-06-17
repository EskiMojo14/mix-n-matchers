import {
  matcherHint,
  printExpected,
  type MatcherHintOptions,
  printDiffOrStringify,
} from "jest-matcher-utils";
import type { MatcherFunction } from "../utils/types";

/**
 * Matches against the provided value using `Object.is`.
 * You can use it inside "deep equal" matchers like `toHaveBeenCalledWith` to ensure that only the correct reference will be allowed.
 * @example
 * const fn = jest.fn();
 * const ref = {};
 *
 * fn(ref);
 *
 * expect(fn).toHaveBeenCalledWith({})
 * expect(fn).not.toHaveBeenCalledWith(expect.exactly({}))
 * expect(fn).toHaveBeenCalledWith(expect.exactly(ref))
 */
export const exactly: MatcherFunction<[expected: unknown]> = function (
  received,
  expected,
) {
  const matcherName = "exactly";
  const options: MatcherHintOptions = {
    comment: "Object.is equality",
    isNot: this.isNot,
    promise: this.promise,
    isDirectExpectCall: true,
  };

  const pass = Object.is(received, expected);
  return {
    pass,
    message: pass
      ? () =>
          matcherHint(matcherName, undefined, undefined, options) +
          "\n\n" +
          `Expected: not ${printExpected(expected)}`
      : () =>
          matcherHint(matcherName, undefined, undefined, options) +
          "\n\n" +
          printDiffOrStringify(
            expected,
            received,
            "Expected",
            "Received",
            this.expand ?? true,
          ),
  };
};

declare module "mix-n-matchers" {
  export interface AsymmetricMixNMatchers {
    /**
     * Matches against the provided value using `Object.is`.
     * You can use it inside "deep equal" matchers like `toHaveBeenCalledWith` to ensure that only the correct reference will be allowed.
     * @example
     * const fn = jest.fn();
     * const ref = {};
     *
     * fn(ref);
     *
     * expect(fn).toHaveBeenCalledWith({})
     * expect(fn).not.toHaveBeenCalledWith(expect.exactly({}))
     * expect(fn).toHaveBeenCalledWith(expect.exactly(ref))
     */
    exactly<E>(expected: E): any;
  }
}
