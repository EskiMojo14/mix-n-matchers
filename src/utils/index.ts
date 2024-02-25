import {
  matcherErrorMessage,
  matcherHint,
  printWithType,
  type MatcherHintOptions,
  RECEIVED_COLOR,
  printReceived,
} from "jest-matcher-utils";
import type { MatcherUtils } from "./types";
import type { Mock } from "vitest";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isMock = (received: any): received is jest.Mock | Mock =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  received?._isMockFunction === true;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isSpy = (received: any): received is jasmine.Spy =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  typeof received?.calls?.all === "function" &&
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  typeof received?.calls?.count === "function";

export function ensureMockOrSpy(
  received: unknown,
  matcherName: string,
  expectedArgument?: string,
  options?: MatcherHintOptions,
): asserts received is jest.Mock | jasmine.Spy | Mock {
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

export const makeEqualValue =
  (utils: MatcherUtils): EqualValue =>
  (a, b, strictCheck) =>
    utils.equals(a, b, utils.customTesters, strictCheck);

export const isIterable = (received: unknown): received is Iterable<unknown> =>
  received != null &&
  typeof (received as Iterable<unknown>)[Symbol.iterator] === "function";
