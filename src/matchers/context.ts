import type { EqualsFunction } from "@jest/expect-utils";
import type { MatcherFunction, Tester, MatcherUtils } from "expect";
import type { MatcherHintOptions } from "jest-matcher-utils";
import { ensureMockOrSpy, isSpy } from "../utils";
import { getRightAlignedPrinter } from "../utils/print";

const PRINT_LIMIT = 3;

const printCommon = (utils: MatcherUtils["utils"], val: unknown) =>
  utils.DIM_COLOR(utils.stringify(val));

type IndexedContext = [number, unknown];

const printReceivedContext = (
  utils: MatcherUtils["utils"],
  equals: EqualsFunction,
  customTesters: Array<Tester>,
  received: unknown,
  expected: unknown,
): string =>
  equals(received, expected, customTesters)
    ? printCommon(utils, received)
    : utils.printReceived(received);

const printReceivedContextsNegative = (
  utils: MatcherUtils["utils"],
  equals: EqualsFunction,
  customTesters: Array<Tester>,
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
      printReceivedContext(
        utils,
        equals,
        customTesters,
        indexedContexts[0]?.[1],
        expected,
      )
    }\n`;
  }

  const printAligned = getRightAlignedPrinter(label);

  return `Received\n${indexedContexts.reduce(
    (printed, [i, context]) =>
      `${
        printed +
        printAligned(String(i + 1), i === iExpectedCall) +
        printReceivedContext(utils, equals, customTesters, context, expected)
      }\n`,
    "",
  )}`;
};

const printReceivedContextsPositive = (
  utils: MatcherUtils["utils"],
  equals: EqualsFunction,
  customTesters: Array<Tester>,
  expected: unknown,
  indexedContexts: Array<IndexedContext>,
  isOnlyCall: boolean,
  iExpectedCall?: number,
) => {
  const expectedLine = `Expected: ${utils.printExpected(expected)}\n`;
  if (indexedContexts.length === 0) return expectedLine;
  const label = "Received: ";
  // TODO: diff?
  if (isOnlyCall && (iExpectedCall === 0 || iExpectedCall === undefined)) {
    const received = indexedContexts[0]?.[1];
    return `${
      expectedLine +
      label +
      printReceivedContext(utils, equals, customTesters, received, expected)
    }`;
  }

  const printAligned = getRightAlignedPrinter(label);

  return (
    expectedLine +
    "Received\n" +
    indexedContexts.reduce((printed, [i, received]) => {
      const aligned = printAligned(String(i + 1), i === iExpectedCall);
      return `${
        printed +
        aligned +
        printReceivedContext(utils, equals, customTesters, received, expected)
      }\n`;
    }, "")
  );
};

const createToHaveBeenCalledWithContextMatcher = (
  matcherName: string,
): MatcherFunction<[expected: unknown]> =>
  function (received, expected) {
    const { utils } = this;
    const options: MatcherHintOptions = {
      isNot: this.isNot,
      promise: this.promise,
    };
    ensureMockOrSpy(utils, received, matcherName, undefined, options);

    const receivedIsSpy = isSpy(received);
    const receivedName = receivedIsSpy ? "spy" : received.getMockName();

    const contexts: Array<unknown> = receivedIsSpy
      ? received.calls.all().map((x): unknown => x.object)
      : received.mock.contexts;

    const pass = contexts.some((actual) =>
      this.equals(actual, expected, this.customTesters),
    );
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
              if (this.equals(expected, contexts[i], this.customTesters)) {
                indexedContexts.push([i, contexts[i]]);
              }
              i += 1;
            }
            return (
              utils.matcherHint(
                `.${matcherName}`,
                receivedName,
                undefined,
                options,
              ) +
              "\n\n" +
              `Expected: not ${utils.printExpected(expected)}\n` +
              printReceivedContextsNegative(
                utils,
                this.equals,
                this.customTesters,
                expected,
                indexedContexts,
                contexts.length === 1,
              ) +
              `\nNumber of calls: ${utils.printReceived(contexts.length)}`
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
              utils.matcherHint(
                `.${matcherName}`,
                receivedName,
                undefined,
                options,
              ) +
              "\n\n" +
              printReceivedContextsPositive(
                utils,
                this.equals,
                this.customTesters,
                expected,
                indexedContexts,
                contexts.length === 1,
              ) +
              `\nNumber of calls: ${utils.printReceived(contexts.length)}`
            );
          },
    };
  };

export const toBeCalledWithContext = createToHaveBeenCalledWithContextMatcher(
  "toBeCalledWithContext",
);

export const toHaveBeenCalledWithContext =
  createToHaveBeenCalledWithContextMatcher("toHaveBeenCalledWithContext");

declare module "./index" {
  export interface MiscMatchers<R> {
    toBeCalledWithContext<T>(expected: T): R;
    toHaveBeenCalledWithContext<T>(expected: T): R;
  }
}
