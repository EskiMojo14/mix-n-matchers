import type {
  MatcherContext as JestMatcherContext,
  ExpectationResult,
  Tester as JestTester,
} from "expect";

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
