import type { MatcherFunction } from "../utils/types";
import { matcherHint, printExpected, printReceived } from "jest-matcher-utils";
import { isIterable, makeEqualValue } from "../utils";

const makeIterableOfMatcher = (
  matcherName: string,
  asymmetric: boolean,
  strict = false,
): MatcherFunction<[expected: unknown]> =>
  function toBeIterableOf(received, expected) {
    if (!isIterable(received)) {
      return {
        pass: false,
        message: () => `Expected ${printReceived(received)} to be an iterable`,
      };
    }
    const prefix =
      matcherHint(matcherName, undefined, undefined, {
        isNot: this.isNot,
        promise: this.promise,
        isDirectExpectCall: asymmetric,
      }) + "\n\n";
    const equalValue = makeEqualValue(this);

    let i = 0;
    for (const value of received) {
      if (!equalValue(value, expected, strict)) {
        return {
          pass: false,
          message: () =>
            prefix +
            `Expected ${printReceived(received)} to contain only ${printExpected(expected)} values, but item at index ${i} was ${printReceived(value)}`,
        };
      }
      i++;
    }
    return {
      pass: true,
      message: () =>
        prefix +
        `Expected ${printReceived(received)} not to contain only ${printExpected(expected)} values`,
    };
  };

export const toBeIterableOf = makeIterableOfMatcher("toBeIterableOf", false);

export const iterableOf = makeIterableOfMatcher("iterableOf", true);

export const toBeStrictIterableOf = makeIterableOfMatcher(
  "toBeStrictIterableOf",
  false,
  true,
);

export const strictIterableOf = makeIterableOfMatcher(
  "strictIterableOf",
  true,
  true,
);

const makeRecordOfMatcher = (
  matcherName: string,
  asymmetric: boolean,
  strict = false,
): MatcherFunction<[expected: unknown]> =>
  function toBeRecordOf(received, expected) {
    if (typeof received !== "object" || received === null) {
      return {
        pass: false,
        message: () =>
          `Expected ${printReceived(received)} to be an object, but it was ${printReceived(typeof received)}`,
      };
    }
    const prefix =
      matcherHint(matcherName, undefined, undefined, {
        isNot: this.isNot,
        promise: this.promise,
        isDirectExpectCall: asymmetric,
      }) + "\n\n";
    const equalValue = makeEqualValue(this);

    for (const key of Object.keys(received)) {
      if (!equalValue((received as any)[key], expected, strict)) {
        return {
          pass: false,
          message: () =>
            prefix +
            `Expected ${printReceived(received)} to contain only ${printExpected(expected)} values, but item at key ${key} was ${printReceived((received as any)[key])}`,
        };
      }
    }
    return {
      pass: true,
      message: () =>
        prefix +
        `Expected ${printReceived(received)} not to contain only ${printExpected(expected)} values`,
    };
  };

export const toBeRecordOf = makeRecordOfMatcher("toBeRecordOf", false);

export const recordOf = makeRecordOfMatcher("recordOf", true);

export const toBeStrictRecordOf = makeRecordOfMatcher(
  "toBeStrictRecordOf",
  false,
  true,
);

export const strictRecordOf = makeRecordOfMatcher("strictRecordOf", true, true);

declare module "mix-n-matchers" {
  export interface MixNMatchers<R = any, T = unknown> {
    toBeIterableOf<E>(expected: E): R;
    toBeStrictIterableOf<E>(expected: E): R;
    toBeRecordOf<E>(expected: E): R;
    toBeStrictRecordOf<E>(expected: E): R;
  }
  export interface AsymmetricMixNMatchers {
    iterableOf<E>(expected: E): any;
    strictIterableOf<E>(expected: E): any;
    recordOf<E>(expected: E): any;
    strictRecordOf<E>(expected: E): any;
  }
}
