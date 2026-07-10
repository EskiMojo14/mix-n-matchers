import type { MatcherFunction } from "../utils/types";
import { makeEqualValue, isAsymmetricMatcher, assert } from "../utils";
import {
  matcherErrorMessage,
  matcherHint,
  printWithType,
  stringify,
  RECEIVED_COLOR,
  EXPECTED_COLOR,
  printDiffOrStringify,
} from "jest-matcher-utils";
import { caseInsensitiveStringEquality, formDataEquality } from "../utilities";

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
    matcherHint("toHaveStatus", received, stringify(expected), {
      isNot: this.isNot,
      promise: this.promise,
    });

  assert(globalThis.Response, () =>
    matcherErrorMessage(hint(), "Response is not defined in the global scope."),
  );
  assert(received instanceof Response, () =>
    matcherErrorMessage(hint(), "Received value is not a Response."),
  );
  assert(typeof expected === "number" || isAsymmetricMatcher(expected), () =>
    matcherErrorMessage(
      hint("response"),
      "Expected status must be a number.",
      printWithType("expectedStatus", expected, stringify),
    ),
  );

  const equalValue = makeEqualValue(this);
  const pass = equalValue(received.status, expected);
  return {
    pass,
    message: () =>
      `${hint("response")}\n\n` +
      (pass
        ? `Expected response not to have status ${EXPECTED_COLOR(stringify(expected))}, but it did.`
        : `Expected response to have status ${EXPECTED_COLOR(stringify(expected))}, but it was ${RECEIVED_COLOR(stringify(received.status))}.`),
  };
};

const statusGroupsByNum = {
  1: { long: "informational", short: "1xx" },
  2: { long: "successful", short: "2xx" },
  3: { long: "redirection", short: "3xx" },
  4: { long: "client error", short: "4xx" },
  5: { long: "server error", short: "5xx" },
} as const;
// 1-5, 1xx-5xx, informational-server error
export type StatusGroup =
  | keyof typeof statusGroupsByNum
  | (typeof statusGroupsByNum)[keyof typeof statusGroupsByNum]["long" | "short"];
const statusGroups = new Map<StatusGroup, 1 | 2 | 3 | 4 | 5>();
for (const [key, { long, short }] of Object.entries(statusGroupsByNum)) {
  const num = Number(key) as 1 | 2 | 3 | 4 | 5;
  statusGroups.set(num, num);
  statusGroups.set(long, num);
  statusGroups.set(short, num);
}
/**
 * Ensure the Response object has a specific status group (1-5, 1xx-5xx, "informational", "successful", "redirection", "client error", "server error").
 */
export const toHaveStatusGroup: MatcherFunction<[StatusGroup]> = function (received, expected) {
  const hint = (received?: string) =>
    matcherHint("toHaveStatusGroup", received, stringify(expected), {
      isNot: this.isNot,
      promise: this.promise,
    });

  assert(globalThis.Response, () =>
    matcherErrorMessage(hint(), "Response is not defined in the global scope."),
  );
  assert(received instanceof Response, () =>
    matcherErrorMessage(hint(), "Received value is not a Response."),
  );
  assert(statusGroups.has(expected) || isAsymmetricMatcher(expected), () =>
    matcherErrorMessage(
      hint("response"),
      `Expected status group must be one of: ${Array.from(statusGroups.keys())
        .map((k) => stringify(k))
        .join(", ")}`,
      printWithType("expected", expected, stringify),
    ),
  );

  const actualNum = Math.floor(received.status / 100);

  if (isAsymmetricMatcher(expected)) {
    const equalValue = makeEqualValue(this);
    let pass: boolean;
    if (actualNum < 1 || actualNum > 5) {
      pass = false;
    } else {
      const num = actualNum as 1 | 2 | 3 | 4 | 5;
      const { long, short } = statusGroupsByNum[num];
      // Try all three representations so expect.oneOf([2]), expect.oneOf(["2xx"]),
      // and expect.oneOf(["successful"]) all work.
      pass = equalValue(num, expected) || equalValue(short, expected) || equalValue(long, expected);
    }
    return {
      pass,
      message: () =>
        `${hint("response")}\n\n` +
        (pass
          ? `Expected response not to have status group ${EXPECTED_COLOR(stringify(expected))}, but it did (${RECEIVED_COLOR(stringify(received.status))}).`
          : `Expected response to have status group ${EXPECTED_COLOR(stringify(expected))}, but it was ${RECEIVED_COLOR(stringify(received.status))}.`),
    };
  }

  const expectedGroupType =
    typeof expected === "number" ? "number" : expected.includes("xx") ? "short" : "long";
  const expectedNum = statusGroups.get(expected)!;
  let actualGroup: StatusGroup | "non-standard";
  if (actualNum < 1 || actualNum > 5) {
    actualGroup = "non-standard";
  } else if (expectedGroupType === "number") {
    actualGroup = actualNum as StatusGroup;
  } else {
    actualGroup = statusGroupsByNum[actualNum as keyof typeof statusGroupsByNum][expectedGroupType];
  }
  const pass = actualNum === expectedNum;
  return {
    pass,
    message: () =>
      `${hint("response")}\n\n` +
      (pass
        ? `Expected response not to have status group ${EXPECTED_COLOR(stringify(expected))}, but it did (${RECEIVED_COLOR(stringify(received.status))}).`
        : `Expected response to have status group ${EXPECTED_COLOR(stringify(expected))}, but it was ${RECEIVED_COLOR(stringify(actualGroup))} (${RECEIVED_COLOR(stringify(received.status))}).`),
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
      secondArgument: typeof value === "undefined" ? undefined : stringify(value),
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
  assert(value === undefined || typeof value === "string" || isAsymmetricMatcher(value), () =>
    matcherErrorMessage(
      hint(receivedName),
      "Expected value must be a string or undefined.",
      printWithType("value", value, stringify),
    ),
  );

  const equalValue = makeEqualValue(this);
  const hasValue = value !== undefined;
  let actualValue: string | null;
  try {
    actualValue = received instanceof Headers ? received.get(name) : received.headers.get(name);
  } catch (error) {
    throw new Error(matcherErrorMessage(hint(receivedName), "Failed to get the header."), {
      cause: error,
    });
  }
  const pass = hasValue ? equalValue(actualValue, value) : actualValue !== null;

  return {
    pass,
    message: hasValue
      ? () =>
          `${hint(receivedName)}\n\n` +
          (pass
            ? `Expected ${receivedName} not to have header ${EXPECTED_COLOR(stringify(name))} with a value of ${EXPECTED_COLOR(stringify(value))}, but it did.`
            : `Expected ${receivedName} to have header ${EXPECTED_COLOR(stringify(name))} with a value of ${EXPECTED_COLOR(stringify(value))}, but it ${actualValue === null ? "was not found" : `had a value of ${RECEIVED_COLOR(stringify(actualValue))}`}.`)
      : () =>
          `${hint(receivedName)}\n\n` +
          (pass
            ? `Expected ${receivedName} not to have header ${EXPECTED_COLOR(stringify(name))}, but it did.`
            : `Expected ${receivedName} to have header ${EXPECTED_COLOR(stringify(name))}, but it was not found.`),
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
  assert(typeof expected === "string" || isAsymmetricMatcher(expected), () =>
    matcherErrorMessage(
      hint("request"),
      "Expected method must be a string.",
      printWithType("expected", expected, stringify),
    ),
  );

  const equalValue = makeEqualValue(this, [caseInsensitiveStringEquality]);
  const actualMethod = received.method;
  const pass = equalValue(actualMethod, expected);

  return {
    pass,
    message: () =>
      `${hint("request")}\n\n` +
      (pass
        ? `Expected request not to have method ${EXPECTED_COLOR(stringify(expected))}, but it did.`
        : `Expected request to have method ${EXPECTED_COLOR(stringify(expected))}, but it was ${RECEIVED_COLOR(stringify(actualMethod))}.`),
  };
};

/**
 * Ensure the Request or Response object has a specific URL.
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
  assert(typeof expected === "string" || isAsymmetricMatcher(expected), () =>
    matcherErrorMessage(
      hint(receivedName),
      "Expected URL must be a string.",
      printWithType("expected", expected, stringify),
    ),
  );

  const equalValue = makeEqualValue(this);
  const actualURL = received.url;
  const pass = equalValue(actualURL, expected);

  return {
    pass,
    message: () =>
      `${hint(receivedName)}\n\n` +
      (pass
        ? `Expected ${receivedName} not to have URL ${EXPECTED_COLOR(stringify(expected))}, but it did.`
        : `Expected ${receivedName} to have URL ${EXPECTED_COLOR(stringify(expected))}, but it was ${RECEIVED_COLOR(stringify(actualURL))}.`),
  };
};

/**
 * Ensure the Response or Request object has a specific body text.
 * @remarks This matcher is asynchronous and returns a Promise, so it should be awaited.
 */
export const toHaveTextBody: MatcherFunction<[string]> = async function (received, expected) {
  const hint = (received?: string) =>
    matcherHint("toHaveTextBody", received, stringify(expected), {
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
  assert(typeof expected === "string" || isAsymmetricMatcher(expected), () =>
    matcherErrorMessage(
      hint(receivedName),
      "Expected text must be a string.",
      printWithType("expected", expected, stringify),
    ),
  );
  assert(!received.bodyUsed, () =>
    matcherErrorMessage(hint(receivedName), "Cannot read body because it has already been used."),
  );

  let clone: Request | Response;
  try {
    clone = received.clone();
  } catch (error) {
    throw new Error(
      matcherErrorMessage(hint(receivedName), `Failed to clone the ${receivedName}.`),
      {
        cause: error,
      },
    );
  }
  let actualText: string;
  try {
    actualText = await clone.text();
  } catch (error) {
    throw new Error(
      matcherErrorMessage(hint(receivedName), `Failed to read body text from the ${receivedName}.`),
      { cause: error },
    );
  }
  const equalValue = makeEqualValue(this);
  const pass = equalValue(actualText, expected);

  return {
    pass,
    message: () =>
      `${hint(receivedName)}\n\n` +
      (pass
        ? `Expected ${receivedName} not to have body text ${EXPECTED_COLOR(stringify(expected))}, but it did.`
        : `Expected ${receivedName} to have body text ${EXPECTED_COLOR(stringify(expected))}, but it was ${RECEIVED_COLOR(stringify(actualText))}.`),
  };
};

function maketoHaveJSONBodyMatcher(
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
        `Cannot read body from the ${receivedName} because it has already been used.`,
      ),
    );

    let clone: Request | Response;
    try {
      clone = received.clone();
    } catch (error) {
      throw new Error(
        matcherErrorMessage(hint(receivedName), `Failed to clone the ${receivedName}.`),
        {
          cause: error,
        },
      );
    }
    let actualJSON: unknown;
    try {
      actualJSON = await clone.json();
    } catch (error) {
      throw new Error(
        matcherErrorMessage(
          hint(receivedName),
          `Failed to read body JSON from the ${receivedName}.`,
        ),
        { cause: error },
      );
    }
    const pass = equalValue(actualJSON, expected, strict);

    return {
      pass,
      message: () =>
        `${hint(receivedName)}\n\n` +
        (pass
          ? `Expected ${receivedName} not to have body JSON ${EXPECTED_COLOR(stringify(expected))}, but it did.`
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
export const toHaveJSONBody = maketoHaveJSONBodyMatcher("toHaveJSONBody");

/**
 * Asserts that a Response or Request object has a specific JSON body, using strict deep equality.
 */
export const toHaveJSONBodyStrict = maketoHaveJSONBodyMatcher("toHaveJSONBodyStrict", true);

/**
 * Asserts that a Response or Request object has a specific FormData body, using `formDataEquality`.
 */
export const toHaveFormDataBody: MatcherFunction<[FormData]> = async function (received, expected) {
  const hint = (received?: string) =>
    matcherHint("toHaveFormDataBody", received, stringify(expected), {
      isNot: this.isNot,
      promise: this.promise,
    });
  assert(globalThis.Request && globalThis.Response && globalThis.FormData, () =>
    matcherErrorMessage(
      hint(),
      "Request, Response, or FormData is not defined in the global scope.",
    ),
  );
  assert(received instanceof Request || received instanceof Response, () =>
    matcherErrorMessage(hint(), "Received value is not a Request or Response."),
  );
  const receivedName = received instanceof Request ? "request" : "response";
  assert(!received.bodyUsed, () =>
    matcherErrorMessage(
      hint(receivedName),
      `Cannot read body from the ${receivedName} because it has already been used.`,
    ),
  );

  let clone: Request | Response;
  try {
    clone = received.clone();
  } catch (error) {
    throw new Error(
      matcherErrorMessage(hint(receivedName), `Failed to clone the ${receivedName}.`),
      {
        cause: error,
      },
    );
  }
  let actualFormData: FormData;
  try {
    actualFormData = await clone.formData();
  } catch (error) {
    throw new Error(
      matcherErrorMessage(
        hint(receivedName),
        `Failed to read body FormData from the ${receivedName}.`,
      ),
      { cause: error },
    );
  }
  const equalValue = makeEqualValue(this, [formDataEquality]);
  const pass = equalValue(actualFormData, expected);

  return {
    pass,
    message: () =>
      `${hint(receivedName)}\n\n` +
      (pass
        ? `Expected ${receivedName} not to have body FormData ${EXPECTED_COLOR(stringify(expected))}, but it did.`
        : printDiffOrStringify(
            Array.from(expected.entries()),
            Array.from(actualFormData.entries()),
            "Expected",
            "Received",
            this.expand ?? true,
          ).replace("Array", "FormData")),
  };
};

/**
 * Asserts that a Response object has been redirected.
 */
export const toBeRedirected: MatcherFunction = function (received) {
  const hint = (received?: string) =>
    matcherHint("toBeRedirected", received, "", {
      isNot: this.isNot,
      promise: this.promise,
    });

  assert(globalThis.Response, () =>
    matcherErrorMessage(hint(), "Response is not defined in the global scope."),
  );
  assert(received instanceof Response, () =>
    matcherErrorMessage(hint(), "Received value is not a Response."),
  );

  const pass = received.redirected;
  return {
    pass,
    message: () =>
      `${hint("response")}\n\n` +
      `Expected response to ${pass ? "not " : ""}be redirected, but it was ${pass ? "redirected" : "not redirected"}.`,
  };
};

/**
 * Asserts that a Response object has a specific type.
 */
export const toHaveResponseType: MatcherFunction<[typeof Response.prototype.type]> = function (
  received,
  expected,
) {
  const hint = (received?: string) =>
    matcherHint("toHaveResponseType", received, stringify(expected), {
      isNot: this.isNot,
      promise: this.promise,
    });

  assert(globalThis.Response, () =>
    matcherErrorMessage(hint(), "Response is not defined in the global scope."),
  );
  assert(received instanceof Response, () =>
    matcherErrorMessage(hint(), "Received value is not a Response."),
  );
  assert(typeof expected === "string" || isAsymmetricMatcher(expected), () =>
    matcherErrorMessage(
      hint("response"),
      "Expected type must be a string.",
      printWithType("expected", expected, stringify),
    ),
  );

  const equalValue = makeEqualValue(this);
  const actualType = received.type;
  const pass = equalValue(actualType, expected);

  return {
    pass,
    message: () =>
      `${hint("response")}\n\n` +
      (pass
        ? `Expected response not to have type ${EXPECTED_COLOR(stringify(expected))}, but it did.`
        : `Expected response to have type ${EXPECTED_COLOR(stringify(expected))}, but it was ${RECEIVED_COLOR(stringify(actualType))}.`),
  };
};

/**
 * Assert that a URLSearchParams, URL, Response or Request object has a specific query parameter with a specific value.
 * If no expected value is provided, it checks for the existence of the parameter.
 */
export const toHaveSearchParam: MatcherFunction<[string, string?]> = function (
  received,
  name,
  value,
) {
  const hint = (received?: string) =>
    matcherHint("toHaveSearchParam", received, stringify(name), {
      isNot: this.isNot,
      promise: this.promise,
      secondArgument: typeof value === "undefined" ? undefined : stringify(value),
    });
  assert(
    globalThis.URLSearchParams && globalThis.URL && globalThis.Request && globalThis.Response,
    () =>
      matcherErrorMessage(
        hint(),
        "URLSearchParams, URL, Request, or Response is not defined in the global scope.",
      ),
  );
  assert(
    received instanceof URLSearchParams ||
      received instanceof URL ||
      received instanceof Request ||
      received instanceof Response,
    () =>
      matcherErrorMessage(
        hint(),
        "Received value is not a URLSearchParams, URL, Request, or Response.",
      ),
  );
  const receivedName =
    received instanceof URLSearchParams
      ? "params"
      : received instanceof URL
        ? "url"
        : received instanceof Request
          ? "request"
          : "response";
  assert(typeof name === "string", () =>
    matcherErrorMessage(
      hint(receivedName),
      "Query parameter name must be a string.",
      printWithType("name", name, stringify),
    ),
  );
  assert(value === undefined || typeof value === "string" || isAsymmetricMatcher(value), () =>
    matcherErrorMessage(
      hint(receivedName),
      "Expected value must be a string or undefined.",
      printWithType("value", value, stringify),
    ),
  );

  const equalValue = makeEqualValue(this);
  const hasValue = value !== undefined;
  let searchParams: URLSearchParams;
  if (received instanceof URLSearchParams) {
    searchParams = received;
  } else if (received instanceof URL) {
    ({ searchParams } = received);
  } else {
    try {
      ({ searchParams } = new URL(received.url));
    } catch (error) {
      throw new Error(matcherErrorMessage(hint(receivedName), "Failed to parse the URL."), {
        cause: error,
      });
    }
  }
  const actualValue = searchParams.get(name);
  const pass = hasValue ? equalValue(actualValue, value) : actualValue !== null;

  return {
    pass,
    message: hasValue
      ? () =>
          `${hint(receivedName)}\n\n` +
          (pass
            ? `Expected ${receivedName} not to have search parameter ${EXPECTED_COLOR(stringify(name))} with a value of ${EXPECTED_COLOR(stringify(value))}, but it did.`
            : `Expected ${receivedName} to have search parameter ${EXPECTED_COLOR(stringify(name))} with a value of ${EXPECTED_COLOR(stringify(value))}, but it ${actualValue === null ? "was not found" : `had a value of ${RECEIVED_COLOR(stringify(actualValue))}`}.`)
      : () =>
          `${hint(receivedName)}\n\n` +
          (pass
            ? `Expected ${receivedName} not to have search parameter ${EXPECTED_COLOR(stringify(name))}, but it did.`
            : `Expected ${receivedName} to have search parameter ${EXPECTED_COLOR(stringify(name))}, but it was not found.`),
  };
};

/**
 * Assert that an AbortSignal object is aborted, or that a Request object has an aborted signal.
 */
export const toBeAborted: MatcherFunction = function (received) {
  const hint = (received?: string) =>
    matcherHint("toBeAborted", received, "", {
      isNot: this.isNot,
      promise: this.promise,
    });

  assert(globalThis.AbortSignal && globalThis.Request, () =>
    matcherErrorMessage(hint(), "AbortSignal or Request is not defined in the global scope."),
  );
  assert(received instanceof AbortSignal || received instanceof Request, () =>
    matcherErrorMessage(hint(), "Received value is not an AbortSignal or Request."),
  );
  const receivedName = received instanceof AbortSignal ? "signal" : "request";

  const pass = received instanceof AbortSignal ? received.aborted : received.signal.aborted;
  return {
    pass,
    message: () =>
      `${hint(receivedName)}\n\n` +
      `Expected ${receivedName} ${pass ? "not " : ""}to be aborted, but it was${pass ? "" : " not"}.`,
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
    toHaveStatus(expected: number): R;
    /**
     * Asserts that a Response object has a specific status group (1-5, 1xx-5xx, "informational", "successful", "redirection", "client error", "server error").
     * @example
     * expect(response).toHaveStatusGroup(2);
     * expect(response).toHaveStatusGroup("2xx");
     * expect(response).toHaveStatusGroup("successful");
     */
    toHaveStatusGroup(expected: StatusGroup): R;
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
     * await expect(response).toHaveTextBody("Hello, world!");
     * await expect(request).toHaveTextBody("Hello, world!");
     * @remarks Will clone the object to avoid consuming the body, so it can be read again later. Will throw an error if the body has already been used.
     * @remarks This matcher is asynchronous and returns a Promise, so it should be awaited.
     */
    toHaveTextBody(expected: string): Promise<Awaited<R>>;
    /**
     * Asserts that a Response or Request object has a specific JSON body, using deep equality.
     * @example
     * await expect(response).toHaveJSONBody({ message: "Hello, world!" });
     * await expect(request).toHaveJSONBody({ message: "Hello, world!" });
     * @remarks Will clone the object to avoid consuming the body, so it can be read again later. Will throw an error if the body has already been used.
     * @remarks This matcher is asynchronous and returns a Promise, so it should be awaited.
     */
    // oxlint-disable-next-line typescript/no-unnecessary-type-parameters
    toHaveJSONBody<E>(expected: E): Promise<Awaited<R>>;
    /**
     * Asserts that a Response or Request object has a specific JSON body, using strict deep equality.
     * @example
     * await expect(response).toHaveJSONBodyStrict({ message: "Hello, world!" });
     * await expect(request).toHaveJSONBodyStrict({ message: "Hello, world!" });
     * @remarks Will clone the object to avoid consuming the body, so it can be read again later. Will throw an error if the body has already been used.
     * @remarks This matcher is asynchronous and returns a Promise, so it should be awaited.
     */
    // oxlint-disable-next-line typescript/no-unnecessary-type-parameters
    toHaveJSONBodyStrict<E>(expected: E): Promise<Awaited<R>>;
    /**
     * Asserts that a Response or Request object has a specific FormData body, using `formDataEquality`.
     * @example
     * const formData = new FormData();
     * formData.append("foo", "bar");
     * await expect(response).toHaveFormDataBody(formData);
     * await expect(request).toHaveFormDataBody(formData);
     * @remarks Will clone the object to avoid consuming the body, so it can be read again later. Will throw an error if the body has already been used.
     * @remarks This matcher is asynchronous and returns a Promise, so it should be awaited.
     */
    toHaveFormDataBody(expected: FormData): Promise<Awaited<R>>;
    /**
     * Asserts that a Response object has been redirected.
     * @example
     * expect(response).toBeRedirected();
     */
    toBeRedirected(): R;
    /**
     * Asserts that a Response object has a specific type.
     * @example
     * expect(response).toHaveResponseType("basic");
     */
    toHaveResponseType(expected: typeof Response.prototype.type): R;
    /**
     * Asserts that a URLSearchParams, URL, Response or Request object has a specific query parameter with a specific value.
     * If no expected value is provided, it checks for the existence of the parameter.
     * @example
     * expect(params).toHaveSearchParam("foo", "bar");
     * expect(url).toHaveSearchParam("foo", "bar");
     * expect(request).toHaveSearchParam("foo", "bar");
     * expect(response).toHaveSearchParam("foo", "bar");
     */
    toHaveSearchParam(name: string, value?: string): R;
    /**
     * Asserts that an AbortSignal object is aborted, or that a Request object has an aborted signal.
     * @example
     * expect(signal).toBeAborted();
     * expect(request).toBeAborted();
     */
    toBeAborted(): R;
  }
}
