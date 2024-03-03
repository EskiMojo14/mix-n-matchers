import {
  matcherErrorMessage,
  matcherHint,
  printWithType,
  type MatcherHintOptions,
  RECEIVED_COLOR,
  printReceived,
} from "jest-matcher-utils";
import type { MatcherUtils, Tester } from "./types";
import type { Mock } from "vitest";
import type { jest } from "@jest/globals";
import {
  arrayBufferEquality,
  iterableEquality,
  sparseArrayEquality,
  typeEquality,
} from "@jest/expect-utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isMock = (received: any): received is jest.Mock | Mock =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  received?._isMockFunction === true;

export interface CallInfo {
  /**
   * The context (the this) for the call
   */
  object: any;
  /**
   * All arguments passed to the call
   */
  args: Array<any>;
  /**
   * The return value of the call
   */
  returnValue: any;
}

export interface Spy {
  calls: {
    all(): Array<CallInfo>;
    count(): number;
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isSpy = (received: any): received is Spy =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  typeof received?.calls?.all === "function" &&
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  typeof received?.calls?.count === "function";

export function ensureMockOrSpy(
  received: unknown,
  matcherName: string,
  expectedArgument?: string,
  options?: MatcherHintOptions,
): asserts received is jest.Mock | Spy | Mock {
  if (!isMock(received) && !isSpy(received)) {
    throw new Error(
      matcherErrorMessage(
        matcherHint(matcherName, undefined, expectedArgument, options),
        `${RECEIVED_COLOR("received")} value must be a mock or spy function`,
        printWithType("Received", received, printReceived),
      ),
    );
  }
}

export type EqualValue = (
  a: unknown,
  b: unknown,
  strictCheck?: boolean,
) => boolean;

export const toStrictEqualTesters: Array<Tester> = [
  iterableEquality,
  typeEquality,
  sparseArrayEquality,
  arrayBufferEquality,
];

export const makeEqualValue =
  (utils: MatcherUtils): EqualValue =>
  (a, b, strictCheck) =>
    utils.equals(
      a,
      b,
      strictCheck
        ? [...(utils.customTesters ?? []), ...toStrictEqualTesters]
        : utils.customTesters,
      strictCheck,
    );

export const isIterable = (received: unknown): received is Iterable<unknown> =>
  received != null &&
  typeof (received as Iterable<unknown>)[Symbol.iterator] === "function";
