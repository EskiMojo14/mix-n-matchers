import type { AsymmetricMixNMatchers } from "../asymmetricMatchers";
import type { MixNMatchers } from "../matchers";

export type MaybePromise<T> = T | Promise<T>;

export type MaybePromiseLike<T> = T | PromiseLike<T>;

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
  equals: EqualsFunction;
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

/**
 * Extracts the asymmetric matcher types from an object of matcher functions.
 */
export type AsymmetricMixNMatchersFrom<
  Matchers extends Record<string, MatcherFunction<Array<any>>>,
> = Pick<AsymmetricMixNMatchers, keyof Matchers & keyof AsymmetricMixNMatchers>;

/**
 * Extracts the matcher types from an object of matcher functions.
 */
export type MixNMatchersFrom<
  Matchers extends Record<string, MatcherFunction<Array<any>>>,
  R = any,
  T = unknown,
> = Pick<MixNMatchers<R, T>, keyof Matchers & keyof MixNMatchers<R, T>>;

export namespace Autocomplete {
  export type String<T extends string> = T | (string & {});
  export type PropertyKey<T extends string> = String<T> | number | symbol;
  export type Unknown<T> = T | {} | null | undefined;
}

export type Falsy = false | 0 | "" | null | undefined;
export type Truthy<T> = T extends Falsy ? never : T;
