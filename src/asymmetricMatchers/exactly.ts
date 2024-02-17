import type { MatcherFunction } from "expect";
import type { MatcherHintOptions } from "jest-matcher-utils";

/**
 * Matches against the provided value using `Object.is`.
 * You can use it inside "deep equal" matchers like `toBeCalledWith` to ensure that only the correct reference will be allowed.
 * @example
 * const fn = jest.fn();
 * const ref = {};
 *
 * fn(ref);
 *
 * expect(fn).toBeCalledWith({})
 * expect(fn).not.toBeCalledWith(expect.exactly({}))
 * expect(fn).toBeCalledWith(expect.exactly(ref))
 */
export const exactly: MatcherFunction<[expected: unknown]> = function (
  received,
  expected,
) {
  const { utils } = this;
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
          utils.matcherHint(matcherName, undefined, undefined, options) +
          "\n\n" +
          `Expected: not ${utils.printExpected(expected)}`
      : () =>
          utils.matcherHint(matcherName, undefined, undefined, options) +
          "\n\n" +
          utils.printDiffOrStringify(
            expected,
            received,
            "Expected",
            "Received",
            this.expand ?? true,
          ),
  };
};

declare module "./index" {
  export interface AsymmetricMixNMatchers {
    /**
     * Matches against the provided value using `Object.is`.
     * You can use it inside "deep equal" matchers like `toBeCalledWith` to ensure that only the correct reference will be allowed.
     * @example
     * const fn = jest.fn();
     * const ref = {};
     *
     * fn(ref);
     *
     * expect(fn).toBeCalledWith({})
     * expect(fn).not.toBeCalledWith(expect.exactly({}))
     * expect(fn).toBeCalledWith(expect.exactly(ref))
     */
    exactly<E>(expected: E): any;
  }
}
