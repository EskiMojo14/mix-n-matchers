import { matcherHint, printReceived } from "jest-matcher-utils";
import type { MatcherFunction } from "../utils/types";

type Predicate = (value: unknown) => boolean;

export const makeSatisfySequenceMatcher = (
  matcherName: string,
  asymmetric: boolean,
): MatcherFunction<[predicate: Predicate, ...predicates: Array<Predicate>]> =>
  function (received, ...predicates) {
    if (predicates.length === 0) {
      throw new Error("toSatisfySequence requires at least one predicate");
    }
    const prefix =
      matcherHint(matcherName, undefined, undefined, {
        isNot: this.isNot,
        promise: this.promise,
        isDirectExpectCall: asymmetric,
      }) + "\n\n";
    if (!Array.isArray(received)) {
      return {
        pass: false,
        message: () =>
          prefix + `Expected ${printReceived(received)} to be an array`,
      };
    }
    if (predicates.length > received.length) {
      return {
        pass: false,
        message: () =>
          prefix +
          `Expected ${printReceived(received)} to have at least ${predicates.length} items`,
      };
    }
    for (const [index, predicate] of predicates.entries()) {
      if (!predicate(received[index])) {
        return {
          pass: false,
          message: () =>
            prefix +
            `Expected ${printReceived(received[index])} to satisfy predicate at index ${index}`,
        };
      }
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
