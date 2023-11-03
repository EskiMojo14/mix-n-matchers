/* eslint-disable @typescript-eslint/no-empty-interface */
import { expect } from "@jest/globals";
import * as mixNMatchers from "./index";

declare module "@jest/expect" {
  interface Matchers<R> extends mixNMatchers.MixNMatchers<R> {}
  interface AsymmetricMatchers extends mixNMatchers.AsymmetricMixNMatchers {}
}

expect.extend(mixNMatchers);
