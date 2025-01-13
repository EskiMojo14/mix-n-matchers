// to avoid having separate jest and vitest suites, we create common definitions
// then mock during setup with the appropriate globals
import type {
  describe as jestDescribe,
  it as jestIt,
  expect as jestExpect,
  jest,
} from "@jest/globals";
import type {
  describe as vitestDescribe,
  it as vitestIt,
  expect as vitestExpect,
  vi,
  Mock as VitestMock,
} from "vitest";
import type { Satisfies } from "./types.typetest";

interface Each {
  <T extends Array<any> | [any]>(
    cases: ReadonlyArray<T>,
  ): (name: string, fn: (...args: T) => void) => void;
  <T>(cases: ReadonlyArray<T>): (name: string, fn: (value: T) => void) => void;
}
export declare const describe: (typeof vitestDescribe | typeof jestDescribe) & {
  each: Each;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type TestEach = Satisfies<
  typeof jestDescribe.each | typeof vitestDescribe.each,
  Each
>;

export declare const expect: typeof vitestExpect | typeof jestExpect;
export declare const it: typeof vitestIt | typeof jestIt;

type Procedure = (...args: Array<any>) => any;

export type Mock<T extends Procedure = Procedure> =
  | jest.Mock<T>
  | VitestMock<T>;

export declare const fn: <T extends Procedure = Procedure>(fn?: T) => Mock<T>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type TestFn = Satisfies<typeof jest.fn | typeof vi.fn, typeof fn>;

throw new Error("This file should be mocked");
