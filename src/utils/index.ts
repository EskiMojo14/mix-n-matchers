import type { MatcherHintOptions } from "jest-matcher-utils";
import type { MatcherUtils } from "expect";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isMock = (received: any): received is jest.Mock =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  received?._isMockFunction === true;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isSpy = (received: any): received is jasmine.Spy =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  typeof received?.calls?.all === "function" &&
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  typeof received?.calls?.count === "function";

export function ensureMockOrSpy(
  utils: MatcherUtils["utils"],
  received: unknown,
  matcherName: string,
  expectedArgument?: string,
  options?: MatcherHintOptions,
): asserts received is jest.Mock | jasmine.Spy {
  if (!isMock(received) && !isSpy(received)) {
    throw new Error(
      utils.matcherErrorMessage(
        utils.matcherHint(matcherName, undefined, expectedArgument, options),
        `${utils.RECEIVED_COLOR(
          "received",
        )} value must be a mock or spy function`,
        utils.printWithType("Received", received, utils.printReceived),
      ),
    );
  }
}
