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

const printReceivedSequence = (received: Array<unknown>) =>
  received.map(printReceived).join(", ");
const printExpectedSequence = (expected: Array<unknown>) =>
  expected.map(printReceived).join(", ");

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
            `Full sequence so far: ${printReceivedSequence(sequenceSoFar)}`,
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
            `Full sequence so far: ${printReceivedSequence(sequenceSoFar)}`,
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
        `Expected ${printReceived(received)} not to match sequence ${printExpectedSequence(expected)}`,
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

const makeContainSequenceMatcher = (
  matcherName: string,
  asymmetric: boolean,
  strict: boolean | "reference",
): MatcherFunction<Array<unknown>> =>
  function toContainSequence(received, ...expected) {
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
    let status: "unmatched" | "partial" | "matched" = "unmatched";
    let expectedIdx = 0;
    const sequenceSoFar: Array<unknown> = [];
    for (const receivedItem of received) {
      sequenceSoFar.push(receivedItem);
      const expectedItem = expected[expectedIdx];
      const equal =
        strict === "reference"
          ? receivedItem === expectedItem
          : equalValue(receivedItem, expectedItem, strict);
      if (equal) {
        if (status === "unmatched") {
          status = "partial";
        }
        expectedIdx++;
        if (expectedIdx === expected.length) {
          status = "matched";
          break;
        }
      } else if (status === "partial") {
        status = "unmatched";
        expectedIdx = 0;
      }
    }
    const pass = status === "matched";
    return {
      pass,
      message: () =>
        prefix +
        `Expected ${printReceived(received)} ${pass ? "not " : ""}to contain sequence ${printExpectedSequence(expected)}` +
        "\n\n" +
        `Full sequence: ${printReceivedSequence(sequenceSoFar)}`,
    };
  };

/**
 * Asserts that an iterable contains a sequence of expected items, using reference equality (===).
 * @example
 * expect([0, 1, 2, 3]).toContainSequence(1, 2, 3);
 * expect([1, 2, 3, 4]).toContainSequence(1, 2, 3);
 */
export const toContainSequence = makeContainSequenceMatcher(
  "toContainSequence",
  false,
  "reference",
);

/**
 * Asserts that an iterable contains a sequence of expected items, using deep equality.
 * @example
 * expect([0, 1, 2, 3]).toContainEqualSequence(1, 2, 3);
 * expect([1, 2, 3, 4]).toContainEqualSequence(1, 2, 3);
 */
export const toContainEqualSequence = makeContainSequenceMatcher(
  "toContainEqualSequence",
  false,
  false,
);

/**
 * Asserts that an iterable contains a sequence of expected items, using strict deep equality.
 * @example
 * expect([0, 1, 2, 3]).toContainStrictEqualSequence(1, 2, 3);
 * expect([1, 2, 3, 4]).toContainStrictEqualSequence(1, 2, 3);
 */
export const toContainStrictEqualSequence = makeContainSequenceMatcher(
  "toContainStrictEqualSequence",
  false,
  true,
);

/**
 * Matches an iterable that contains a sequence of expected items, using reference equality (===).
 * @example
 * expect({ value: [1, 2, 3] }).toEqual({
 *   value: expect.containingSequence(1, 2, 3),
 * });
 */
export const containingSequence = makeContainSequenceMatcher(
  "containingSequence",
  true,
  "reference",
);

/**
 * Matches an iterable that contains a sequence of expected items, using deep equality.
 * @example
 * expect({ value: [1, 2, 3] }).toEqual({
 *   value: expect.containingEqualSequence(1, 2, 3),
 * });
 */
export const containingEqualSequence = makeContainSequenceMatcher(
  "containingEqualSequence",
  true,
  false,
);

/**
 * Matches an iterable that contains a sequence of expected items, using strict deep equality.
 * @example
 * expect({ value: [1, 2, 3] }).toEqual({
 *   value: expect.containingStrictEqualSequence(1, 2, 3),
 * });
 */
export const containingStrictEqualSequence = makeContainSequenceMatcher(
  "containingStrictEqualSequence",
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

    /**
     * Asserts that an iterable contains a sequence of expected items, using reference equality (===).
     *
     * Optionally, a type parameter can be used to specify the expected sequence type.
     *
     * @example
     * expect([0, 1, 2, 3]).toContainSequence(1, 2, 3);
     * expect([1, 2, 3, 4]).toContainSequence(1, 2, 3);
     */
    toContainSequence<S extends Array<unknown>>(...expected: S): R;

    /**
     * Asserts that an iterable contains a sequence of expected items, using deep equality.
     *
     * Optionally, a type parameter can be used to specify the expected sequence type.
     *
     * @example
     * expect([0, 1, 2, 3]).toContainEqualSequence(1, 2, 3);
     * expect([1, 2, 3, 4]).toContainEqualSequence(1, 2, 3);
     */
    toContainEqualSequence<S extends Array<unknown>>(...expected: S): R;

    /**
     * Asserts that an iterable contains a sequence of expected items, using strict deep equality.
     *
     * Optionally, a type parameter can be used to specify the expected sequence type.
     *
     * @example
     * expect([0, 1, 2, 3]).toContainStrictEqualSequence(1, 2, 3);
     * expect([1, 2, 3, 4]).toContainStrictEqualSequence(1, 2, 3);
     */
    toContainStrictEqualSequence<S extends Array<unknown>>(...expected: S): R;
  }
  export interface AsymmetricMixNMatchers {
    /**
     * Matches an iterable that satisfies a sequence of predicates.
     * @example
     * expect({ value: [1, 2, 3] }).toEqual({
     *   value: expect.sequence(
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
     *   value: expect.sequenceOf(1, 2, 3),
     * });
     */
    sequenceOf<S extends Array<unknown>>(...expected: S): any;
    /**
     * Matches an iterable of a sequence of expected items, using strict deep equality.
     *
     * @see https://jestjs.io/docs/expect#tostrictequalvalue
     * @example
     * expect({ value: [1, 2, 3] }).toEqual({
     *   value: expect.strictSequenceOf(1, 2, 3),
     * });
     */
    strictSequenceOf<S extends Array<unknown>>(...expected: S): any;

    /**
     * Matches an iterable that contains a sequence of expected items, using reference equality (===).
     * @example
     * expect({ value: [1, 2, 3] }).toEqual({
     *   value: expect.containingSequence(1, 2, 3),
     * });
     */
    containingSequence<S extends Array<unknown>>(...expected: S): any;

    /**
     * Matches an iterable that contains a sequence of expected items, using deep equality.
     * @example
     * expect({ value: [1, 2, 3] }).toEqual({
     *   value: expect.containingEqualSequence(1, 2, 3),
     * });
     */
    containingEqualSequence<S extends Array<unknown>>(...expected: S): any;

    /**
     * Matches an iterable that contains a sequence of expected items, using strict deep equality.
     * @example
     * expect({ value: [1, 2, 3] }).toEqual({
     *   value: expect.containingStrictEqualSequence(1, 2, 3),
     * });
     */
    containingStrictEqualSequence<S extends Array<unknown>>(
      ...expected: S
    ): any;
  }
}
