import {
  matcherErrorMessage,
  matcherHint,
  printReceived,
  printWithType,
  stringify,
} from "jest-matcher-utils";
import { isIterable, makeEqualValue } from "../utils";
import { assert } from "../utils/assert";
import type { MatcherFunction } from "../utils/types";

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
    const hint = matcherHint(matcherName, undefined, undefined, {
      isNot: this.isNot,
      promise: this.promise,
      isDirectExpectCall: asymmetric,
    });
    assert(predicates.length > 0, () =>
      matcherErrorMessage(hint, "At least one predicate must be provided"),
    );
    const prefix = hint + "\n\n";
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
          hint,
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
  strict: boolean | "reference",
): MatcherFunction<[value: unknown, ...sequence: Array<unknown>]> =>
  function toEqualSequence(received, ...expected) {
    const hint = matcherHint(matcherName, undefined, undefined, {
      isNot: this.isNot,
      promise: this.promise,
      isDirectExpectCall: asymmetric,
    });
    assert(expected.length > 0, () =>
      matcherErrorMessage(hint, "At least one expected item must be provided"),
    );

    const prefix = hint + "\n\n";
    if (!isIterable(received)) {
      return {
        pass: false,
        message: () =>
          prefix +
          `Expected ${printReceived(received)} to be an iterable, but it was not`,
      };
    }
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
      const equal =
        strict === "reference"
          ? receivedItem === expectedItem
          : equalValue(receivedItem, expectedItem, strict);
      if (!equal) {
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
 * Asserts that an iterable matches a sequence of expected items, using reference equality (===).
 * @example
 * expect([1, 2, 3]).toBeSequence(1, 2, 3);
 */
export const toBeSequence = makeEqualSequenceMatcher(
  "toBeSequence",
  false,
  "reference",
);

/**
 * Asserts that an iterable matches a sequence of expected items, using deep equality.
 * @example
 * expect([1, 2, 3]).toEqualSequence(1, 2, 3);
 */
export const toEqualSequence = makeEqualSequenceMatcher(
  "toEqualSequence",
  false,
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
 * Matches an iterable of a sequence of expected items, using reference equality (===).
 *
 * @example
 * expect({ value: [1, 2, 3] }).toEqual({
 *  value: expect.sequenceMatching(1, 2, 3),
 * });
 */
export const sequenceMatching = makeEqualSequenceMatcher(
  "sequenceMatching",
  true,
  "reference",
);

/**
 * Matches an iterable of a sequence of expected items, using deep equality.
 *
 * @example
 * expect({ value: [1, 2, 3] }).toEqual({
 *   value: expect.sequenceOf(1, 2, 3),
 * });
 */
export const sequenceOf = makeEqualSequenceMatcher("sequenceOf", true, false);

/**
 * Matches an iterable of a sequence of expected items, using strict deep equality.
 *
 * @see https://jestjs.io/docs/expect#tostrictequalvalue
 * @example
 * expect({ value: [1, 2, 3] }).toEqual({
 *  value: expect.strictSequenceOf(1, 2, 3),
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
): MatcherFunction<[value: unknown, ...sequence: Array<unknown>]> =>
  function toContainSequence(received, ...expected) {
    const hint = matcherHint(matcherName, undefined, undefined, {
      isNot: this.isNot,
      promise: this.promise,
      isDirectExpectCall: asymmetric,
    });
    const prefix = hint + "\n\n";

    assert(expected.length > 0, () =>
      matcherErrorMessage(hint, "At least one expected item must be provided"),
    );

    if (!isIterable(received)) {
      return {
        pass: false,
        message: () =>
          prefix +
          `Expected ${printReceived(received)} to be an iterable, but it was not`,
      };
    }

    const equalValue = makeEqualValue(this);
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
        expectedIdx++;
        if (expectedIdx === expected.length) {
          break;
        }
      } else if (expectedIdx > 0) {
        const equalsFirst =
          strict === "reference"
            ? receivedItem === expected[0]
            : equalValue(receivedItem, expected[0], strict);
        expectedIdx = equalsFirst ? 1 : 0;
      }
    }
    const pass = expectedIdx === expected.length;
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

export const makeContainSatisfySequenceMatcher = (
  matcherName: string,
  asymmetric: boolean,
): MatcherFunction<[predicate: Predicate, ...predicates: Array<Predicate>]> =>
  function toContainSequenceSatisfying(received, ...predicates) {
    const hint = matcherHint(matcherName, undefined, undefined, {
      isNot: this.isNot,
      promise: this.promise,
      isDirectExpectCall: asymmetric,
    });
    assert(predicates.length > 0, () =>
      matcherErrorMessage(hint, "At least one predicate must be provided"),
    );
    const prefix = hint + "\n\n";
    if (!isIterable(received)) {
      return {
        pass: false,
        message: () =>
          prefix + `Expected ${printReceived(received)} to be an iterable`,
      };
    }
    let expectedIdx = 0;
    const sequenceSoFar: Array<unknown> = [];
    for (const receivedItem of received) {
      sequenceSoFar.push(receivedItem);
      const predicate = predicates[expectedIdx];
      assert(typeof predicate === "function", () =>
        matcherErrorMessage(
          hint,
          "All predicates must be functions",
          printWithType(
            `Predicate at index ${expectedIdx}`,
            predicate,
            stringify,
          ),
        ),
      );
      if (predicate(receivedItem)) {
        expectedIdx++;
        if (expectedIdx === predicates.length) {
          break;
        }
      } else if (expectedIdx > 0) {
        const satisfiesFirst = predicates[0](receivedItem);
        expectedIdx = satisfiesFirst ? 1 : 0;
      }
    }
    const pass = expectedIdx === predicates.length;
    return {
      pass,
      message: () =>
        prefix +
        `Expected ${printReceived(received)} ${pass ? "not " : ""}to contain sequence satisfying predicates` +
        "\n\n" +
        `Full sequence: ${printReceivedSequence(sequenceSoFar)}`,
    };
  };

/**
 * Asserts that an iterable contains a sequence satisfying a sequence of predicates.
 *
 * @example
 * expect([1, 2, 3]).toContainSequenceSatisfying(
 *   (x) => x === 2,
 *   (x) => x === 3,
 * );
 */
export const toContainSequenceSatisfying = makeContainSatisfySequenceMatcher(
  "toContainSequenceSatisfying",
  false,
);

/**
 * Matches an iterable that contains a sequence satisfying a sequence of predicates.
 *
 * @example
 * expect({ value: [1, 2, 3] }).toEqual({
 *   value: expect.containingSequenceSatisfying(
 *     (x) => x === 2,
 *     (x) => x === 3,
 *   ),
 * });
 */
export const containingSequenceSatisfying = makeContainSatisfySequenceMatcher(
  "containingSequenceSatisfying",
  true,
);

declare module "mix-n-matchers" {
  export interface MixNMatchers<R = any, T = unknown> {
    /* eslint-disable @typescript-eslint/no-unnecessary-type-parameters */
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
    toSatisfySequence(predicate: Predicate, ...predicates: Array<Predicate>): R;
    /**
     * Asserts that an iterable matches a sequence of expected items, using reference equality (===).
     *
     * Optionally, a type parameter can be used to specify the expected sequence type.
     *
     * @example
     * expect([1, 2, 3]).toBeSequence(1, 2, 3);
     */
    toBeSequence<S extends [unknown, ...Array<unknown>]>(...expected: S): R;
    /**
     * Asserts that an iterable matches a sequence of expected items, using deep equality.
     *
     * Optionally, a type parameter can be used to specify the expected sequence type.
     *
     * @example
     * expect([1, 2, 3]).toEqualSequence(1, 2, 3);
     */
    toEqualSequence<S extends [unknown, ...Array<unknown>]>(...expected: S): R;
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
    toStrictEqualSequence<S extends [unknown, ...Array<unknown>]>(
      ...expected: S
    ): R;

    /**
     * Asserts that an iterable contains a sequence of expected items, using reference equality (===).
     *
     * Optionally, a type parameter can be used to specify the expected sequence type.
     *
     * @example
     * expect([0, 1, 2, 3]).toContainSequence(1, 2, 3);
     * expect([1, 2, 3, 4]).toContainSequence(1, 2, 3);
     */
    toContainSequence<S extends [unknown, ...Array<unknown>]>(
      ...expected: S
    ): R;

    /**
     * Asserts that an iterable contains a sequence of expected items, using deep equality.
     *
     * Optionally, a type parameter can be used to specify the expected sequence type.
     *
     * @example
     * expect([0, 1, 2, 3]).toContainEqualSequence(1, 2, 3);
     * expect([1, 2, 3, 4]).toContainEqualSequence(1, 2, 3);
     */
    toContainEqualSequence<S extends [unknown, ...Array<unknown>]>(
      ...expected: S
    ): R;

    /**
     * Asserts that an iterable contains a sequence of expected items, using strict deep equality.
     *
     * Optionally, a type parameter can be used to specify the expected sequence type.
     *
     * @example
     * expect([0, 1, 2, 3]).toContainStrictEqualSequence(1, 2, 3);
     * expect([1, 2, 3, 4]).toContainStrictEqualSequence(1, 2, 3);
     */
    toContainStrictEqualSequence<S extends [unknown, ...Array<unknown>]>(
      ...expected: S
    ): R;

    /**
     * Asserts that an iterable contains a sequence satisfying a sequence of predicates.
     *
     * @example
     * expect([1, 2, 3]).toContainSequenceSatisfying(
     *   (x) => x === 2,
     *   (x) => x === 3,
     * );
     */
    toContainSequenceSatisfying(
      predicate: Predicate,
      ...predicates: Array<Predicate>
    ): R;
  }
  export interface AsymmetricMixNMatchers {
    /**
     * Matches an iterable that satisfies a sequence of predicates.
     *
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
     * Matches an iterable that matches a sequence of expected items, using reference equality (===).
     *
     * @example
     * expect({ value: [1, 2, 3] }).toEqual({
     *   value: expect.sequenceMatching(1, 2, 3),
     * });
     */
    sequenceMatching<S extends [unknown, ...Array<unknown>]>(
      ...expected: S
    ): any;
    /**
     * Matches an iterable of a sequence of expected items, using deep equality.
     *
     * @example
     * expect({ value: [1, 2, 3] }).toEqual({
     *   value: expect.sequenceOf(1, 2, 3),
     * });
     */
    sequenceOf<S extends [unknown, ...Array<unknown>]>(...expected: S): any;
    /**
     * Matches an iterable of a sequence of expected items, using strict deep equality.
     *
     * @see https://jestjs.io/docs/expect#tostrictequalvalue
     *
     * @example
     * expect({ value: [1, 2, 3] }).toEqual({
     *   value: expect.strictSequenceOf(1, 2, 3),
     * });
     */
    strictSequenceOf<S extends [unknown, ...Array<unknown>]>(
      ...expected: S
    ): any;

    /**
     * Matches an iterable that contains a sequence of expected items, using reference equality (===).
     *
     * @example
     * expect({ value: [1, 2, 3] }).toEqual({
     *   value: expect.containingSequence(1, 2, 3),
     * });
     */
    containingSequence<S extends [unknown, ...Array<unknown>]>(
      ...expected: S
    ): any;

    /**
     * Matches an iterable that contains a sequence of expected items, using deep equality.
     *
     * @example
     * expect({ value: [1, 2, 3] }).toEqual({
     *   value: expect.containingEqualSequence(1, 2, 3),
     * });
     */
    containingEqualSequence<S extends [unknown, ...Array<unknown>]>(
      ...expected: S
    ): any;

    /**
     * Matches an iterable that contains a sequence of expected items, using strict deep equality.
     *
     * @example
     * expect({ value: [1, 2, 3] }).toEqual({
     *   value: expect.containingStrictEqualSequence(1, 2, 3),
     * });
     */
    containingStrictEqualSequence<S extends [unknown, ...Array<unknown>]>(
      ...expected: S
    ): any;

    /**
     * Matches an iterable that contains a sequence satisfying a sequence of predicates.
     *
     * @example
     * expect({ value: [1, 2, 3] }).toEqual({
     *   value: expect.containingSequenceSatisfying(
     *     (x) => x === 2,
     *     (x) => x === 3,
     *   ),
     * });
     */
    containingSequenceSatisfying(
      predicate: Predicate,
      ...predicates: Array<Predicate>
    ): any;
    /* eslint-enable @typescript-eslint/no-unnecessary-type-parameters */
  }
}
