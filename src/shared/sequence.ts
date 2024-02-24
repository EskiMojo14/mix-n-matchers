import { matcherHint, printReceived } from "jest-matcher-utils";
import type { MatcherFunction } from "../utils/types";
import { isIterable } from "../utils";

type Predicate = (value: unknown) => boolean;

export const makeSatisfySequenceMatcher = (
  matcherName: string,
  asymmetric: boolean,
): MatcherFunction<[predicate: Predicate, ...predicates: Array<Predicate>]> =>
  function (received, ...predicates) {
    if (predicates.length === 0) {
      throw new Error(`${matcherName} requires at least one predicate`);
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
    for (const receivedItem of received) {
      if (i >= predicates.length) {
        // we've run out of predicates, so the sequence is satisfied
        break;
      }
      const predicate = predicates[i];
      if (predicate && !predicate(receivedItem)) {
        return {
          pass: false,
          message: () =>
            prefix +
            `Expected ${printReceived(receivedItem)} to satisfy predicate at index ${i}`,
        };
      }
      i++;
    }
    if (i < predicates.length) {
      return {
        pass: false,
        message: () =>
          prefix +
          `Expected ${printReceived(received)} to have at least ${predicates.length} items`,
      };
    }
    return {
      pass: true,
      message: () =>
        prefix + `Expected ${printReceived(received)} not to satisfy sequence`,
    };
  };

export const toSatisfySequence = makeSatisfySequenceMatcher(
  "toSatisfySequence",
  false,
);

export const sequence = makeSatisfySequenceMatcher("sequence", true);

declare module "mix-n-matchers" {
  export interface MixNMatchers<R = any, T = unknown> {
    toSatisfySequence(predicate: Predicate, ...predicates: Array<Predicate>): R;
  }
  export interface AsymmetricMixNMatchers {
    sequence(predicate: Predicate, ...predicates: Array<Predicate>): any;
  }
}
