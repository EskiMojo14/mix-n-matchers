import type { MatcherFunction } from "../utils/types";
import { assert } from "../utils/assert";
import {
  matcherHint,
  type MatcherHintOptions,
  RECEIVED_COLOR,
  EXPECTED_COLOR,
} from "jest-matcher-utils";

/**
 * Ensure the Response object has an ok status (200-299).
 */
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

/**
 * Ensure the Response object has a specific status.
 */
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

/**
 * Ensure the Response or Request object has a specific header, optionally with a specific value.
 * If no expected value is provided, it checks for the existence of the header.
 */
export const toHaveHeader: MatcherFunction<[string, string?]> = function (
  received,
  headerName,
  expectedValue,
) {
  assert(
    globalThis.Response && globalThis.Request,
    "Response or Request is not defined in the global scope.",
  );
  assert(
    received instanceof Response || received instanceof Request,
    "Received value is not a Response or Request.",
  );
  assert(typeof headerName === "string", "Header name must be a string.");

  const matcherHintOptions: MatcherHintOptions = {
    isNot: this.isNot,
    promise: this.promise,
    secondArgument: expectedValue && `"${expectedValue}"`,
  };

  const hasExpected = expectedValue !== undefined;
  const actualValue = received.headers.get(headerName);
  const pass = hasExpected ? actualValue === expectedValue : actualValue !== null;
  const receivedName = received instanceof Response ? "response" : "request";

  return {
    pass,
    message: hasExpected
      ? () =>
          `${matcherHint("toHaveHeader", receivedName, `"${headerName}"`, matcherHintOptions)}\n\n` +
          (pass
            ? `Expected ${receivedName} not to have header ${EXPECTED_COLOR(headerName)} with a value of ${EXPECTED_COLOR(expectedValue)}, but it did.`
            : `Expected ${receivedName} to have header ${EXPECTED_COLOR(headerName)} with a value of ${EXPECTED_COLOR(expectedValue)}, but it ${actualValue === null ? "was not found" : `had a value of ${RECEIVED_COLOR(actualValue)}`}.`)
      : () =>
          `${matcherHint("toHaveHeader", receivedName, `"${headerName}"`, matcherHintOptions)}\n\n` +
          (pass
            ? `Expected ${receivedName} not to have header ${EXPECTED_COLOR(headerName)}, but it did.`
            : `Expected ${receivedName} to have header ${EXPECTED_COLOR(headerName)}, but it was not found.`),
  };
};

/**
 * Ensure the Request object has a specific method.
 */
export const toHaveMethod: MatcherFunction<[string]> = function (received, expectedMethod) {
  assert(globalThis.Request, "Request is not defined in the global scope.");
  assert(received instanceof Request, "Received value is not a Request.");
  assert(typeof expectedMethod === "string", "Expected method must be a string.");

  const matcherHintOptions: MatcherHintOptions = {
    isNot: this.isNot,
    promise: this.promise,
  };

  const actualMethod = received.method;
  const pass = actualMethod.toUpperCase() === expectedMethod.toUpperCase();

  return {
    pass,
    message: () =>
      `${matcherHint("toHaveMethod", "request", `"${expectedMethod}"`, matcherHintOptions)}\n\n` +
      (pass
        ? `Expected request not to have method ${EXPECTED_COLOR(expectedMethod)}, but it did.`
        : `Expected request to have method ${EXPECTED_COLOR(expectedMethod)}, but it was ${RECEIVED_COLOR(actualMethod)}.`),
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
    /**
     * Asserts that a Response or Request object has a specific header.
     * If no expected value is provided, it checks for the existence of the header.
     * @example
     * expect(response).toHaveHeader("Content-Type", "application/json");
     * expect(request).toHaveHeader("X-Custom-Header");
     */
    toHaveHeader(headerName: string, expectedValue?: string): R;
    /**
     * Asserts that a Request object has a specific method.
     * @example
     * expect(request).toHaveMethod("POST");
     */
    toHaveMethod(expectedMethod: string): R;
  }
}
