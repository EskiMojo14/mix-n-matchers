import type { MatcherFunction } from "expect";
import type { MatcherHintOptions } from "jest-matcher-utils";

const possibleTypes = typeof 1;

type Type = typeof possibleTypes;

/**
 * Matches against the provided value using `typeof`.
 * @example
 * expect(1).toEqual(expect.typeOf("number"))
 *
 * expect({ value: 1 }).toEqual({ value: expect.typeOf("number") })
 */
export const typeOf: MatcherFunction<[expected: Type]> = function (
  received,
  expected,
) {
  const { utils } = this;
  const matcherName = "typeOf";
  const options: MatcherHintOptions = {
    comment: "typeof equality",
    isNot: this.isNot,
    promise: this.promise,
    isDirectExpectCall: true,
  };

  const pass = typeof received === expected;
  return {
    pass,
    message: pass
      ? () =>
          utils.matcherHint(matcherName, undefined, undefined, options) +
          "\n\n" +
          `Expected typeof ${utils.printReceived(received)} not to be ${utils.printExpected(expected)}`
      : () =>
          utils.matcherHint(matcherName, undefined, undefined, options) +
          "\n\n" +
          `Expected typeof ${utils.printReceived(received)} to be ${utils.printExpected(expected)}, but got ${utils.printReceived(typeof received)}`,
  };
};

declare module "./index" {
  export interface AsymmetricMixNMatchers {
    typeOf(expected: Type): any;
  }
}
