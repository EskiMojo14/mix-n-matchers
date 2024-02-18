import type {
  MatcherContext as JestMatcherContext,
  MatcherUtils as JestMatcherUtils,
  ExpectationResult,
  Tester as JestTester,
} from "expect";
import type { MatcherState } from "@vitest/expect";

// yuck :(
export type Tester = {
  bivariantHack(
    this: ThisParameterType<JestTester>,
    ...args: Partial<Parameters<JestTester>>
  ): ReturnType<JestTester>;
}["bivariantHack"];

export interface MatcherUtils {
  customTesters?: Array<Tester>;
  equals: (
    a: unknown,
    b: unknown,
    customTesters?: Array<Tester>,
    strictCheck?: boolean,
  ) => boolean;
  utils:
    | Pick<
        JestMatcherUtils["utils"],
        | "RECEIVED_COLOR"
        | "printReceived"
        | "DIM_COLOR"
        | "stringify"
        | "printExpected"
        // Not provided by vitest
        | "printDiffOrStringify"
        | "matcherErrorMessage"
        | "matcherHint"
        | "printWithType"
      >
    | Pick<
        MatcherState["utils"],
        | "RECEIVED_COLOR"
        | "printReceived"
        | "DIM_COLOR"
        | "stringify"
        | "printExpected"
      >;
}

export type MatcherContext = Pick<
  JestMatcherContext,
  "isNot" | "promise" | "expand"
> &
  MatcherUtils;

export type MatcherFunction<Expected extends Array<unknown> = []> = (
  this: MatcherContext,
  value: unknown,
  ...expected: Expected
) => ExpectationResult;
