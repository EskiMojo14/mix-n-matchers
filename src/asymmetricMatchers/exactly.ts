import type { MatcherFunction } from "expect";
import type { MatcherHintOptions } from "jest-matcher-utils";
import type { AsymmetricMatcher } from "../utils/types";

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
    exactly<E>(expected: E): AsymmetricMatcher;
  }
}
