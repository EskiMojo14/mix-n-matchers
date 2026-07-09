import type { MatcherFunction } from "../utils/types";
import { assert } from "../utils/assert";
import {
  matcherHint,
  type MatcherHintOptions,
  RECEIVED_COLOR,
  EXPECTED_COLOR,
} from "jest-matcher-utils";

export const toBeOK: MatcherFunction = function (received) {
  assert(globalThis.Response, "Response is not defined in the global scope.");
  assert(received instanceof Response, "Received value is not a Response.");

  const matcherHintOptions: MatcherHintOptions = {
    isNot: this.isNot,
    promise: this.promise,
  };

  const pass = received.ok;
  return {
    pass,
    message: () =>
      `${matcherHint("toBeOK", "response", "", matcherHintOptions)}\n\n` +
      `Expected response to be ${pass ? "not " : ""}ok, but it was ${pass ? "ok" : "not ok"}.`,
  };
};

export const toHaveStatus: MatcherFunction<[number]> = function (received, expectedStatus) {
  assert(globalThis.Response, "Response is not defined in the global scope.");
  assert(received instanceof Response, "Received value is not a Response.");

  const matcherHintOptions: MatcherHintOptions = {
    isNot: this.isNot,
    promise: this.promise,
  };

  const pass = received.status === expectedStatus;
  return {
    pass,
    message: () =>
      `${matcherHint("toHaveStatus", "response", String(expectedStatus), matcherHintOptions)}\n\n` +
      (pass
        ? `Expected response not to have status ${EXPECTED_COLOR(expectedStatus)}, but it did.`
        : `Expected response to have status ${EXPECTED_COLOR(expectedStatus)}, but it was ${RECEIVED_COLOR(received.status)}.`),
  };
};

declare module "mix-n-matchers" {
  export interface MixNMatchers<R, T = unknown> {
    /**
     * Asserts that a Response object has an ok status (200-299).
     * @example
     * expect(response).toBeOK();
     */
    toBeOK(): R;
    /**
     * Asserts that a Response object has a specific status.
     * @example
     * expect(response).toHaveStatus(200);
     */
    toHaveStatus(expectedStatus: number): R;
  }
}
