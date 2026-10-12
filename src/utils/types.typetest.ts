import { type MatcherState } from "vite-plus/test";
import type { MatcherContext as JestMatcherContext } from "expect";
import type { MatcherContext } from "./types";

export type Satisfies<T extends U, U> = T;

export type JestCompat = Satisfies<JestMatcherContext, MatcherContext>;
export type VitestCompat = Satisfies<MatcherState, MatcherContext>;
