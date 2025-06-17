import {
  matcherErrorMessage,
  matcherHint,
  printWithType,
  type MatcherHintOptions,
  stringify,
  printExpected,
  printReceived,
  DIM_COLOR,
} from "jest-matcher-utils";
import type { Mock } from "@globals";
import type { EqualValue, Spy } from "../utils";
import { ensureMockOrSpy, makeEqualValue, isSpy } from "../utils";
import { assert } from "../utils/assert";
import { getRightAlignedPrinter } from "../utils/print";
import type { MatcherFunction } from "../utils/types";

const PRINT_LIMIT = 3;

const printCommon = (val: unknown) => DIM_COLOR(stringify(val));

type IndexedContext = [number, unknown];

const printReceivedContext = (
  equalValue: EqualValue,
  received: unknown,
  expected: unknown,
): string =>
  equalValue(received, expected)
    ? printCommon(received)
    : printReceived(received);

const printReceivedContextsNegative = (
  equalValue: EqualValue,
  expected: unknown,
  indexedContexts: Array<IndexedContext>,
  isOnlyCall: boolean,
  iExpectedCall?: number,
) => {
  if (indexedContexts.length === 0) {
    return "";
  }

  const label = "Received:     ";
  if (isOnlyCall) {
    return `${
      label +
      printReceivedContext(equalValue, indexedContexts[0]?.[1], expected)
    }\n`;
  }

  const printAligned = getRightAlignedPrinter(label);

  return `Received\n${indexedContexts.reduce(
    (printed, [i, context]) =>
      `${
        printed +
        printAligned(String(i + 1), i === iExpectedCall) +
        printReceivedContext(equalValue, context, expected)
      }\n`,
    "",
  )}`;
};

const printReceivedContextsPositive = (
  equalValue: EqualValue,
  expected: unknown,
  indexedContexts: Array<IndexedContext>,
  isOnlyCall: boolean,
  iExpectedCall?: number,
) => {
  const expectedLine = `Expected: ${printExpected(expected)}\n`;
  if (indexedContexts.length === 0) return expectedLine;
  const label = "Received: ";
  if (isOnlyCall && (iExpectedCall === 0 || iExpectedCall === undefined)) {
    const received = indexedContexts[0]?.[1];
    return (
      expectedLine +
      label +
      printReceivedContext(equalValue, received, expected)
    );
  }

  const printAligned = getRightAlignedPrinter(label);

  return (
    expectedLine +
    "Received\n" +
    indexedContexts.reduce((printed, [i, received]) => {
      const aligned = printAligned(String(i + 1), i === iExpectedCall);
      return `${
        printed + aligned + printReceivedContext(equalValue, received, expected)
      }\n`;
    }, "")
  );
};

const extractMock = (received: Mock | Spy) => {
  if (isSpy(received)) {
    return {
      receivedName: "spy",
      contexts: received.calls.all().map((x): unknown => x.object),
    };
  }
  return {
    receivedName: received.getMockName(),
    contexts:
      "contexts" in received.mock
        ? received.mock.contexts
        : // legacy
          (received.mock as { instances: Array<unknown> }).instances,
  };
};

const createToHaveBeenCalledWithContextMatcher = (): MatcherFunction<
  [expected: unknown]
> =>
  function toHaveBeenCalledWithContext(received, expected) {
    const equalValue = makeEqualValue(this);
    const options: MatcherHintOptions = {
      isNot: this.isNot,
      promise: this.promise,
    };
    ensureMockOrSpy(
      received,
      "toHaveBeenCalledWithContext",
      undefined,
      options,
    );

    const { receivedName, contexts } = extractMock(received);

    const pass = contexts.some((actual) => equalValue(actual, expected));
    return {
      pass,
      message: pass
        ? () => {
            const indexedContexts: Array<IndexedContext> = [];
            let i = 0;
            while (
              i < contexts.length &&
              indexedContexts.length < PRINT_LIMIT
            ) {
              if (equalValue(expected, contexts[i])) {
                indexedContexts.push([i, contexts[i]]);
              }
              i += 1;
            }
            return (
              matcherHint(
                `toHaveBeenCalledWithContext`,
                receivedName,
                undefined,
                options,
              ) +
              "\n\n" +
              `Expected: not ${printExpected(expected)}\n` +
              printReceivedContextsNegative(
                equalValue,
                expected,
                indexedContexts,
                contexts.length === 1,
              ) +
              `\nNumber of calls: ${printReceived(contexts.length)}`
            );
          }
        : () => {
            const indexedContexts: Array<IndexedContext> = [];
            let i = 0;
            while (
              i < contexts.length &&
              indexedContexts.length < PRINT_LIMIT
            ) {
              indexedContexts.push([i, contexts[i]]);
              i += 1;
            }
            return (
              matcherHint(
                `toHaveBeenCalledWithContext`,
                receivedName,
                undefined,
                options,
              ) +
              "\n\n" +
              printReceivedContextsPositive(
                equalValue,
                expected,
                indexedContexts,
                contexts.length === 1,
              ) +
              `\nNumber of calls: ${printReceived(contexts.length)}`
            );
          },
    };
  };

const createToHaveBeenLastCalledWithContextMatcher = (): MatcherFunction<
  [expected: unknown]
> =>
  function toHaveBeenLastCalledWithContext(received, expected) {
    const equalValue = makeEqualValue(this);
    const options: MatcherHintOptions = {
      isNot: this.isNot,
      promise: this.promise,
    };
    ensureMockOrSpy(
      received,
      "toHaveBeenLastCalledWithContext",
      undefined,
      options,
    );

    const { receivedName, contexts } = extractMock(received);
    const iLast = contexts.length - 1;

    const pass = iLast >= 0 && equalValue(expected, contexts[iLast]);
    return {
      pass,
      message: pass
        ? () => {
            const indexedContexts: Array<IndexedContext> = [];
            if (iLast > 0) {
              // Display preceding call as context.
              indexedContexts.push([iLast - 1, contexts[iLast - 1]]);
            }
            indexedContexts.push([iLast, contexts[iLast]]);

            return (
              matcherHint(
                "toHaveBeenLastCalledWithContext",
                receivedName,
                undefined,
                options,
              ) +
              "\n\n" +
              `Expected: not ${printExpected(expected)}\n` +
              (contexts.length === 1 &&
              stringify(contexts[0]) === stringify(expected)
                ? ""
                : printReceivedContextsNegative(
                    equalValue,
                    expected,
                    indexedContexts,
                    contexts.length === 1,
                    iLast,
                  )) +
              `\nNumber of calls: ${printReceived(contexts.length)}`
            );
          }
        : () => {
            const indexedContexts: Array<IndexedContext> = [];
            if (iLast >= 0) {
              if (iLast > 0) {
                let i = iLast - 1;
                // Is there a preceding call that is equal to expected contexts?
                while (i >= 0 && !equalValue(expected, contexts[i])) {
                  i -= 1;
                }
                if (i < 0) {
                  i = iLast - 1; // otherwise, preceding call
                }

                indexedContexts.push([i, contexts[i]]);
              }

              indexedContexts.push([iLast, contexts[iLast]]);
            }

            return (
              matcherHint(
                "toHaveBeenLastCalledWithContext",
                receivedName,
                undefined,
                options,
              ) +
              "\n\n" +
              printReceivedContextsPositive(
                equalValue,
                expected,
                indexedContexts,
                contexts.length === 1,
                iLast,
              ) +
              `\nNumber of calls: ${printReceived(contexts.length)}`
            );
          },
    };
  };

const createToHaveBeenNthCalledWithContextMatcher = (): MatcherFunction<
  [n: number, expected: unknown]
> =>
  function toHaveBeenNthCalledWithContext(received, nth, expected) {
    const equalValue = makeEqualValue(this);
    const expectedArgument = "n";
    const options: MatcherHintOptions = {
      expectedColor: (arg) => arg,
      isNot: this.isNot,
      promise: this.promise,
      secondArgument: "expected",
    };
    ensureMockOrSpy(
      received,
      "toHaveBeenNthCalledWithContext",
      expectedArgument,
      options,
    );

    assert(Number.isSafeInteger(nth) && nth > 0, () =>
      matcherErrorMessage(
        matcherHint(
          "toHaveBeenNthCalledWithContext",
          undefined,
          expectedArgument,
          options,
        ),
        `${expectedArgument} must be a positive integer`,
        printWithType(expectedArgument, nth, stringify),
      ),
    );

    const { receivedName, contexts } = extractMock(received);

    const { length } = contexts;
    const iNth = nth - 1;

    const pass = iNth < length && equalValue(expected, contexts[iNth]);

    return {
      pass,
      message: pass
        ? () => {
            // Display preceding and following calls,
            // in case assertions fails because index is off by one.
            const indexedContexts: Array<IndexedContext> = [];
            if (iNth - 1 >= 0) {
              indexedContexts.push([iNth - 1, contexts[iNth - 1]]);
            }
            indexedContexts.push([iNth, contexts[iNth]]);
            if (iNth + 1 < length) {
              indexedContexts.push([iNth + 1, contexts[iNth + 1]]);
            }

            return (
              matcherHint(
                `toHaveBeenNthCalledWithContext`,
                receivedName,
                expectedArgument,
                options,
              ) +
              "\n\n" +
              `n: ${nth}\n` +
              `Expected: not ${printExpected(expected)}\n` +
              (contexts.length === 1 &&
              stringify(contexts[0]) === stringify(expected)
                ? ""
                : printReceivedContextsNegative(
                    equalValue,
                    expected,
                    indexedContexts,
                    contexts.length === 1,
                    iNth,
                  )) +
              `\nNumber of calls: ${printReceived(contexts.length)}`
            );
          }
        : () => {
            // Display preceding and following calls:
            // * nearest call that is equal to expected contexts
            // * otherwise, adjacent call
            // in case assertions fails because of index, especially off by one.
            const indexedContexts: Array<IndexedContext> = [];
            if (iNth < length) {
              if (iNth - 1 >= 0) {
                let i = iNth - 1;
                // Is there a preceding call that is equal to expected contexts?
                while (i >= 0 && !equalValue(expected, contexts[i])) {
                  i -= 1;
                }
                if (i < 0) {
                  i = iNth - 1; // otherwise, adjacent call
                }

                indexedContexts.push([i, contexts[i]]);
              }
              indexedContexts.push([iNth, contexts[iNth]]);
              if (iNth + 1 < length) {
                let i = iNth + 1;
                // Is there a following call that is equal to expected contexts?
                while (i < length && !equalValue(expected, contexts[i])) {
                  i += 1;
                }
                if (i >= length) {
                  i = iNth + 1; // otherwise, adjacent call
                }

                indexedContexts.push([i, contexts[i]]);
              }
            } else if (length > 0) {
              // The number of received calls is fewer than the expected number.
              let i = length - 1;
              // Is there a call that is equal to expected contexts?
              while (i >= 0 && !equalValue(expected, contexts[i])) {
                i -= 1;
              }
              if (i < 0) {
                i = length - 1; // otherwise, last call
              }

              indexedContexts.push([i, contexts[i]]);
            }

            return (
              matcherHint(
                `toHaveBeenNthCalledWithContext`,
                receivedName,
                expectedArgument,
                options,
              ) +
              "\n\n" +
              `n: ${nth}\n` +
              printReceivedContextsPositive(
                equalValue,
                expected,
                indexedContexts,
                contexts.length === 1,
                iNth,
              ) +
              `\nNumber of calls: ${printReceived(contexts.length)}`
            );
          },
    };
  };

/**
 * Ensure a mock function is called with a specific context (`this`)
 *
 * Optionally you can provide a type for the expected context via a generic.
 */
export const toHaveBeenCalledWithContext =
  createToHaveBeenCalledWithContextMatcher();

/**
 * Ensure the last call to a mock function was provided a specific context (`this`)
 *
 * Optionally you can provide a type for the expected context via a generic.
 */
export const toHaveBeenLastCalledWithContext =
  createToHaveBeenLastCalledWithContextMatcher();

/**
 * Ensure that a mock function was called with a specific context on an Nth call.
 *
 * Optionally you can provide a type for the expected context via a generic.
 */
export const toHaveBeenNthCalledWithContext =
  createToHaveBeenNthCalledWithContextMatcher();

declare module "mix-n-matchers" {
  export interface MixNMatchers<R, T = unknown> {
    /* eslint-disable @typescript-eslint/no-unnecessary-type-parameters */
    /**
     * Ensure a mock function is called with a specific context (`this`)
     *
     * Optionally you can provide a type for the expected context via a generic.
     */
    toHaveBeenCalledWithContext<E>(expected: E): R;

    /**
     * Ensure the last call to a mock function was provided a specific context (`this`)
     *
     * Optionally you can provide a type for the expected context via a generic.
     */
    toHaveBeenLastCalledWithContext<E>(expected: E): R;

    /**
     * Ensure that a mock function was called with a specific context on an Nth call.
     *
     * Optionally you can provide a type for the expected context via a generic.
     */
    toHaveBeenNthCalledWithContext<E>(n: number, expected: E): R;
    /* eslint-enable @typescript-eslint/no-unnecessary-type-parameters */
  }
}
