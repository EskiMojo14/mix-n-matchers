import type { MatcherFunction } from "../utils/types";
import { assert } from "../utils/assert";
import { makeEqualValue } from "../utils";
import {
  matcherErrorMessage,
  matcherHint,
  printWithType,
  stringify,
  RECEIVED_COLOR,
  EXPECTED_COLOR,
  printDiffOrStringify,
} from "jest-matcher-utils";

/**
 * Ensure the Response object has an ok status (200-299).
 */
export const toBeOK: MatcherFunction = function (received) {
  const hint = (received?: string) =>
    matcherHint("toBeOK", received, "", {
      isNot: this.isNot,
      promise: this.promise,
    });

  assert(globalThis.Response, () =>
    matcherErrorMessage(hint(), "Response is not defined in the global scope."),
  );
  assert(received instanceof Response, () =>
    matcherErrorMessage(hint(), "Received value is not a Response."),
  );

  const pass = received.ok;
  return {
    pass,
    message: () =>
      `${hint("response")}\n\n` +
      `Expected response to be ${pass ? "not " : ""}ok, but it was ${pass ? "ok" : "not ok"}.`,
  };
};

/**
 * Ensure the Response object has a specific status.
 */
export const toHaveStatus: MatcherFunction<[number]> = function (received, expected) {
  const hint = (received?: string) =>
    matcherHint("toHaveStatus", received, String(expected), {
      isNot: this.isNot,
      promise: this.promise,
    });

  assert(globalThis.Response, () =>
    matcherErrorMessage(hint(), "Response is not defined in the global scope."),
  );
  assert(received instanceof Response, () =>
    matcherErrorMessage(hint(), "Received value is not a Response."),
  );
  assert(typeof expected === "number", () =>
    matcherErrorMessage(
      hint("response"),
      "Expected status must be a number.",
      printWithType("expectedStatus", expected, stringify),
    ),
  );

  const pass = received.status === expected;
  return {
    pass,
    message: () =>
      `${hint("response")}\n\n` +
      (pass
        ? `Expected response not to have status ${EXPECTED_COLOR(expected)}, but it did.`
        : `Expected response to have status ${EXPECTED_COLOR(expected)}, but it was ${RECEIVED_COLOR(received.status)}.`),
  };
};

/**
 * Ensure the Response, Request, or Headers object has a specific header, optionally with a specific value.
 * If no expected value is provided, it checks for the existence of the header.
 */
export const toHaveHeader: MatcherFunction<[string, string?]> = function (received, name, value) {
  const hint = (received?: string) =>
    matcherHint("toHaveHeader", received, stringify(name), {
      isNot: this.isNot,
      promise: this.promise,
      secondArgument: value && stringify(value),
    });
  assert(globalThis.Response && globalThis.Request && globalThis.Headers, () =>
    matcherErrorMessage(
      hint(),
      "Response, Request, or Headers is not defined in the global scope.",
    ),
  );
  assert(
    received instanceof Response || received instanceof Request || received instanceof Headers,
    () => matcherErrorMessage(hint(), "Received value is not a Response, Request, or Headers."),
  );
  const receivedName =
    received instanceof Response ? "response" : received instanceof Request ? "request" : "headers";
  assert(typeof name === "string", () =>
    matcherErrorMessage(
      hint(receivedName),
      "Header name must be a string.",
      printWithType("name", name, stringify),
    ),
  );
  assert(value === undefined || typeof value === "string", () =>
    matcherErrorMessage(
      hint(receivedName),
      "Expected value must be a string or undefined.",
      printWithType("value", value, stringify),
    ),
  );

  const hasValue = value !== undefined;
  const actualValue = received instanceof Headers ? received.get(name) : received.headers.get(name);
  const pass = hasValue ? actualValue === value : actualValue !== null;

  return {
    pass,
    message: hasValue
      ? () =>
          `${hint(receivedName)}\n\n` +
          (pass
            ? `Expected ${receivedName} not to have header ${EXPECTED_COLOR(name)} with a value of ${EXPECTED_COLOR(value)}, but it did.`
            : `Expected ${receivedName} to have header ${EXPECTED_COLOR(name)} with a value of ${EXPECTED_COLOR(value)}, but it ${actualValue === null ? "was not found" : `had a value of ${RECEIVED_COLOR(actualValue)}`}.`)
      : () =>
          `${hint(receivedName)}\n\n` +
          (pass
            ? `Expected ${receivedName} not to have header ${EXPECTED_COLOR(name)}, but it did.`
            : `Expected ${receivedName} to have header ${EXPECTED_COLOR(name)}, but it was not found.`),
  };
};

/**
 * Ensure the Request object has a specific method.
 */
export const toHaveMethod: MatcherFunction<[string]> = function (received, expected) {
  const hint = (received?: string) =>
    matcherHint("toHaveMethod", received, stringify(expected), {
      isNot: this.isNot,
      promise: this.promise,
    });
  assert(globalThis.Request, () =>
    matcherErrorMessage(hint(), "Request is not defined in the global scope."),
  );
  assert(received instanceof Request, () =>
    matcherErrorMessage(hint(), "Received value is not a Request."),
  );
  assert(typeof expected === "string", () =>
    matcherErrorMessage(
      hint("request"),
      "Expected method must be a string.",
      printWithType("expected", expected, stringify),
    ),
  );

  const actualMethod = received.method;
  const pass = actualMethod.toUpperCase() === expected.toUpperCase();

  return {
    pass,
    message: () =>
      `${hint("request")}\n\n` +
      (pass
        ? `Expected request not to have method ${EXPECTED_COLOR(expected)}, but it did.`
        : `Expected request to have method ${EXPECTED_COLOR(expected)}, but it was ${RECEIVED_COLOR(actualMethod)}.`),
  };
};

/**
 * Ensure the Request object has a specific URL.
 */
export const toHaveURL: MatcherFunction<[string]> = function (received, expected) {
  const hint = (received?: string) =>
    matcherHint("toHaveURL", received, stringify(expected), {
      isNot: this.isNot,
      promise: this.promise,
    });
  assert(globalThis.Request || globalThis.Response, () =>
    matcherErrorMessage(hint(), "Request or Response is not defined in the global scope."),
  );
  assert(received instanceof Request || received instanceof Response, () =>
    matcherErrorMessage(hint(), "Received value is not a Request or Response."),
  );
  const receivedName = received instanceof Request ? "request" : "response";
  assert(typeof expected === "string", () =>
    matcherErrorMessage(
      hint(receivedName),
      "Expected URL must be a string.",
      printWithType("expected", expected, stringify),
    ),
  );

  const actualURL = received.url;
  const pass = actualURL === expected;

  return {
    pass,
    message: () =>
      `${hint(receivedName)}\n\n` +
      (pass
        ? `Expected ${receivedName} not to have URL ${EXPECTED_COLOR(expected)}, but it did.`
        : `Expected ${receivedName} to have URL ${EXPECTED_COLOR(expected)}, but it was ${RECEIVED_COLOR(actualURL)}.`),
  };
};

/**
 * Ensure the Response or Request object has a specific body text.
 * @remarks This matcher is asynchronous and returns a Promise, so it should be awaited.
 */
export const toHaveBodyText: MatcherFunction<[string]> = async function (received, expected) {
  const hint = (received?: string) =>
    matcherHint("toHaveBodyText", received, stringify(expected), {
      isNot: this.isNot,
      promise: this.promise,
    });
  assert(globalThis.Request && globalThis.Response, () =>
    matcherErrorMessage(hint(), "Request or Response is not defined in the global scope."),
  );
  assert(received instanceof Request || received instanceof Response, () =>
    matcherErrorMessage(hint(), "Received value is not a Request or Response."),
  );
  const receivedName = received instanceof Request ? "request" : "response";
  assert(typeof expected === "string", () =>
    matcherErrorMessage(
      hint(receivedName),
      "Expected text must be a string.",
      printWithType("expected", expected, stringify),
    ),
  );
  assert(!received.bodyUsed, () =>
    matcherErrorMessage(
      hint(receivedName),
      "Cannot read body text because it has already been used.",
    ),
  );

  const actualText = await received.clone().text();
  const pass = actualText === expected;

  return {
    pass,
    message: () =>
      `${hint(receivedName)}\n\n` +
      (pass
        ? `Expected ${receivedName} not to have body text ${EXPECTED_COLOR(expected)}, but it did.`
        : `Expected ${receivedName} to have body text ${EXPECTED_COLOR(expected)}, but it was ${RECEIVED_COLOR(actualText)}.`),
  };
};

function makeToHaveBodyJSONMatcher(
  matcherName: string,
  strict = false,
): MatcherFunction<[unknown]> {
  return async function (received, expected) {
    const equalValue = makeEqualValue(this);
    const hint = (received?: string) =>
      matcherHint(matcherName, received, stringify(expected), {
        isNot: this.isNot,
        promise: this.promise,
      });
    assert(globalThis.Request && globalThis.Response, () =>
      matcherErrorMessage(hint(), "Request or Response is not defined in the global scope."),
    );
    assert(received instanceof Request || received instanceof Response, () =>
      matcherErrorMessage(hint(), "Received value is not a Request or Response."),
    );
    const receivedName = received instanceof Request ? "request" : "response";
    assert(!received.bodyUsed, () =>
      matcherErrorMessage(
        hint(receivedName),
        "Cannot read body JSON because it has already been used.",
      ),
    );

    const actualJSON = await received.clone().json();
    const pass = equalValue(actualJSON, expected, strict);

    return {
      pass,
      message: () =>
        `${hint(receivedName)}\n\n` +
        (pass
          ? `Expected ${receivedName} not to have body JSON ${EXPECTED_COLOR(expected)}, but it did.`
          : printDiffOrStringify(
              expected,
              actualJSON,
              "Expected",
              "Received",
              this.expand ?? true,
            )),
    };
  };
}

/**
 * Asserts that a Response or Request object has a specific JSON body, using deep equality.
 */
export const toHaveBodyJSON = makeToHaveBodyJSONMatcher("toHaveBodyJSON");

/**
 * Asserts that a Response or Request object has a specific JSON body, using strict deep equality.
 */
export const toHaveBodyJSONStrict = makeToHaveBodyJSONMatcher("toHaveBodyJSONStrict", true);

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
    toHaveStatus(expected: number): R;
    /**
     * Asserts that a Response, Request, or Headers object has a specific header.
     * If no expected value is provided, it checks for the existence of the header.
     * @example
     * expect(response).toHaveHeader("Content-Type", "application/json");
     * expect(request).toHaveHeader("X-Custom-Header");
     * expect(headers).toHaveHeader("Authorization");
     */
    toHaveHeader(name: string, value?: string): R;
    /**
     * Asserts that a Request object has a specific method.
     * @example
     * expect(request).toHaveMethod("POST");
     */
    toHaveMethod(expected: string): R;
    /**
     * Asserts that a Request object has a specific URL.
     * @example
     * expect(request).toHaveURL("https://example.com/api");
     */
    toHaveURL(expected: string): R;
    /**
     * Asserts that a Response or Request object has a specific body text.
     * @example
     * await expect(response).toHaveBodyText("Hello, world!");
     * await expect(request).toHaveBodyText("Hello, world!");
     * @remarks Will clone the object to avoid consuming the body, so it can be read again later. Will throw an error if the body has already been used.
     * @remarks This matcher is asynchronous and returns a Promise, so it should be awaited.
     */
    toHaveBodyText(expected: string): Promise<Awaited<R>>;
    /**
     * Asserts that a Response or Request object has a specific JSON body, using deep equality.
     * @example
     * await expect(response).toHaveBodyJSON({ message: "Hello, world!" });
     * await expect(request).toHaveBodyJSON({ message: "Hello, world!" });
     * @remarks Will clone the object to avoid consuming the body, so it can be read again later. Will throw an error if the body has already been used.
     * @remarks This matcher is asynchronous and returns a Promise, so it should be awaited.
     */
    // oxlint-disable-next-line typescript/no-unnecessary-type-parameters
    toHaveBodyJSON<E>(expected: E): Promise<Awaited<R>>;
    /**
     * Asserts that a Response or Request object has a specific JSON body, using strict deep equality.
     * @example
     * await expect(response).toHaveBodyJSONStrict({ message: "Hello, world!" });
     * await expect(request).toHaveBodyJSONStrict({ message: "Hello, world!" });
     * @remarks Will clone the object to avoid consuming the body, so it can be read again later. Will throw an error if the body has already been used.
     * @remarks This matcher is asynchronous and returns a Promise, so it should be awaited.
     */
    // oxlint-disable-next-line typescript/no-unnecessary-type-parameters
    toHaveBodyJSONStrict<E>(expected: E): Promise<Awaited<R>>;
  }
}
