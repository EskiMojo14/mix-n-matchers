import {
  matcherErrorMessage,
  matcherHint,
  printReceived,
  printWithType,
  stringify,
} from "jest-matcher-utils";
import type { MatcherFunction } from "../utils/types";
import { isIterable, makeEqualValue } from "../utils";
import { assert } from "../utils/assert";

type Predicate = (value: unknown) => boolean;

const makeSatisfySequenceMatcher = (
  matcherName: string,
  asymmetric: boolean,
): MatcherFunction<[predicate: Predicate, ...predicates: Array<Predicate>]> =>
  function toSatisfySequence(received, ...predicates) {
    if (predicates.length === 0) {
      throw new Error(
        matcherErrorMessage(
          matcherHint(matcherName, undefined, undefined, {
            isNot: this.isNot,
            promise: this.promise,
            isDirectExpectCall: asymmetric,
          }),
          "At least one predicate must be provided",
        ),
      );
    }
    const prefix =
      matcherHint(matcherName, undefined, undefined, {
        isNot: this.isNot,
        promise: this.promise,
        isDirectExpectCall: asymmetric,
      }) + "\n\n";
    if (!isIterable(received)) {
      return {
        pass: false,
        message: () =>
          prefix + `Expected ${printReceived(received)} to be an iterable`,
      };
    }
    let i = 0;
    const sequenceSoFar: Array<unknown> = [];
    for (const receivedItem of received) {
      if (i >= predicates.length) {
        // we've run out of predicates, so the sequence is satisfied
        // this also guards against infinite iterables
        break;
      }
      sequenceSoFar.push(receivedItem);
      const predicate = predicates[i];
      assert(typeof predicate === "function", () =>
        matcherErrorMessage(
          matcherHint(matcherName, undefined, undefined, {
            isNot: this.isNot,
            promise: this.promise,
            isDirectExpectCall: asymmetric,
          }),
          "All predicates must be functions",
          printWithType("Predicate at index " + i, predicate, stringify),
        ),
      );
      if (!predicate(receivedItem)) {
        return {
          pass: false,
          message: () =>
            prefix +
            `Expected ${printReceived(receivedItem)} to satisfy predicate at index ${i}.` +
            "\n\n" +
            `Full sequence so far: ${sequenceSoFar.map(printReceived).join(", ")}`,
        };
      }
      i++;
    }
    if (i < predicates.length) {
      return {
        pass: false,
        message: () =>
          prefix +
          `Expected ${printReceived(received)} to have at least ${predicates.length} items, but it only had ${i}.`,
      };
    }
    return {
      pass: true,
      message: () =>
        prefix + `Expected ${printReceived(received)} not to satisfy sequence`,
    };
  };

/**
 * Asserts that an iterable satisfies a sequence of predicates.
 *
 * @example
 * expect([1, 2, 3]).toSatisfySequence(
 *   (x) => x === 1,
 *   (x) => x === 2,
 *   (x) => x === 3,
 * );
 */
export const toSatisfySequence = makeSatisfySequenceMatcher(
  "toSatisfySequence",
  false,
);

/**
 * Matches an iterable that satisfies a sequence of predicates.
 *
 * @example
 * expect({ value: [1, 2, 3] }).toEqual({
 *  value: sequence(
 *    (x) => x === 1,
 *    (x) => x === 2,
 *    (x) => x === 3,
 *  ),
 * });
 */
export const sequence = makeSatisfySequenceMatcher("sequence", true);

const makeEqualSequenceMatcher = (
  matcherName: string,
  asymmetric: boolean,
  strict = false,
): MatcherFunction<Array<unknown>> =>
  function toEqualSequence(received, ...expected) {
    if (!isIterable(received)) {
      return {
        pass: false,
        message: () =>
          `Expected ${printReceived(received)} to be an iterable, but it was not`,
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
    const sequenceSoFar: Array<unknown> = [];
    for (const receivedItem of received) {
      if (i >= expected.length) {
        // we've run out of expected items, so the sequence is matched
        // this also guards against infinite iterables
        break;
      }
      sequenceSoFar.push(receivedItem);
      const expectedItem = expected[i];
      if (!equalValue(receivedItem, expectedItem, strict)) {
        return {
          pass: false,
          message: () =>
            prefix +
            `Expected ${printReceived(receivedItem)} to match ${printReceived(expectedItem)} at index ${i}` +
            "\n\n" +
            `Full sequence so far: ${sequenceSoFar.map(printReceived).join(", ")}`,
        };
      }
      i++;
    }
    if (i < expected.length) {
      return {
        pass: false,
        message: () =>
          prefix +
          `Expected ${printReceived(received)} to have at least ${expected.length} items, but it only had ${i}.`,
      };
    }
    return {
      pass: true,
      message: () =>
        prefix +
        `Expected ${printReceived(received)} not to match sequence ${expected.map(printReceived).join(", ")}`,
    };
  };

/**
 * Asserts that an iterable matches a sequence of expected items, using deep equality.
 * @example
 * expect([1, 2, 3]).toEqualSequence(1, 2, 3);
 */
export const toEqualSequence = makeEqualSequenceMatcher(
  "toEqualSequence",
  false,
);

/**
 * Asserts that an iterable matches a sequence of expected items, using strict deep equality.
 *
 * @see https://jestjs.io/docs/expect#tostrictequalvalue
 * @example
 * expect([1, 2, 3]).toStrictEqualSequence(1, 2, 3);
 */
export const toStrictEqualSequence = makeEqualSequenceMatcher(
  "toStrictEqualSequence",
  false,
  true,
);

/**
 * Matches an iterable of a sequence of expected items, using deep equality.
 *
 * @example
 * expect({ value: [1, 2, 3] }).toEqual({
 *   value: sequenceOf(1, 2, 3),
 * });
 */
export const sequenceOf = makeEqualSequenceMatcher("sequenceOf", true);

/**
 * Matches an iterable of a sequence of expected items, using strict deep equality.
 *
 * @see https://jestjs.io/docs/expect#tostrictequalvalue
 * @example
 * expect({ value: [1, 2, 3] }).toEqual({
 *  value: strictSequenceOf(1, 2, 3),
 * });
 */
export const strictSequenceOf = makeEqualSequenceMatcher(
  "strictSequenceOf",
  true,
  true,
);

declare module "mix-n-matchers" {
  export interface MixNMatchers<R = any, T = unknown> {
    /**
     * Asserts that an iterable satisfies a sequence of predicates.
     * @example
     * expect([1, 2, 3]).toSatisfySequence(
     *   (x) => x === 1,
     *   (x) => x === 2,
     *   (x) => x === 3,
     * );
     */
    toSatisfySequence(predicate: Predicate, ...predicates: Array<Predicate>): R;
    /**
     * Asserts that an iterable matches a sequence of expected items, using deep equality.
     *
     * Optionally, a type parameter can be used to specify the expected sequence type.
     *
     * @example
     * expect([1, 2, 3]).toEqualSequence(1, 2, 3);
     */
    toEqualSequence<S extends Array<unknown>>(...expected: S): R;
    /**
     * Asserts that an iterable matches a sequence of expected items, using strict deep equality.
     *
     * Optionally, a type parameter can be used to specify the expected sequence type.
     *
     *
     * @see https://jestjs.io/docs/expect#tostrictequalvalue
     * @example
     * expect([1, 2, 3]).toStrictEqualSequence(1, 2, 3);
     */
    toStrictEqualSequence<S extends Array<unknown>>(...expected: S): R;
  }
  export interface AsymmetricMixNMatchers {
    /**
     * Matches an iterable that satisfies a sequence of predicates.
     * @example
     * expect({ value: [1, 2, 3] }).toEqual({
     *   value: sequence(
     *     (x) => x === 1,
     *     (x) => x === 2,
     *     (x) => x === 3,
     *   ),
     * });
     */
    sequence(predicate: Predicate, ...predicates: Array<Predicate>): any;
    /**
     * Matches an iterable of a sequence of expected items, using deep equality.
     * @example
     * expect({ value: [1, 2, 3] }).toEqual({
     *   value: sequenceOf(1, 2, 3),
     * });
     */
    sequenceOf<S extends Array<unknown>>(...expected: S): any;
    /**
     * Matches an iterable of a sequence of expected items, using strict deep equality.
     *
     * @see https://jestjs.io/docs/expect#tostrictequalvalue
     * @example
     * expect({ value: [1, 2, 3] }).toEqual({
     *   value: strictSequenceOf(1, 2, 3),
     * });
     */
    strictSequenceOf<S extends Array<unknown>>(...expected: S): any;
  }
}
