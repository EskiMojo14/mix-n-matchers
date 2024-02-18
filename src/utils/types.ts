type MaybePromise<T> = T | Promise<T>;

interface ExpectationResult {
  pass: boolean;
  message(): string;
}

type EqualsFunction = (
  a: unknown,
  b: unknown,
  customTesters?: Array<Tester>,
  strictCheck?: boolean,
) => boolean;

export type Tester = (
  this: { equals: EqualsFunction },
  a: unknown,
  b: unknown,
  customTesters: Array<Tester>,
) => boolean | undefined;

export interface MatcherUtils {
  customTesters?: Array<Tester>;
  equals: (
    a: unknown,
    b: unknown,
    customTesters?: Array<Tester>,
    strictCheck?: boolean,
  ) => boolean;
}

export interface MatcherContext extends MatcherUtils {
  isNot?: boolean;
  promise?: string;
  expand?: boolean;
}

export type MatcherFunction<Expected extends Array<unknown> = []> = (
  this: MatcherContext,
  value: unknown,
  ...expected: Expected
) => MaybePromise<ExpectationResult>;
