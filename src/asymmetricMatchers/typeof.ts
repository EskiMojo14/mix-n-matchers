import type { MatcherHintOptions } from "jest-matcher-utils";
import { matcherHint, printExpected, printReceived } from "jest-matcher-utils";
import type { MatcherFunction } from "../utils/types";

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
          matcherHint(matcherName, undefined, undefined, options) +
          "\n\n" +
          `Expected typeof ${printReceived(received)} not to be ${printExpected(expected)}`
      : () =>
          matcherHint(matcherName, undefined, undefined, options) +
          "\n\n" +
          `Expected typeof ${printReceived(received)} to be ${printExpected(expected)}, but got ${printReceived(typeof received)}`,
  };
};

declare module "./index" {
  export interface AsymmetricMixNMatchers {
    typeOf(expected: Type): any;
  }
}
