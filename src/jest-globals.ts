/* eslint-disable @typescript-eslint/no-empty-interface */
import { expect } from "@jest/globals";
import * as mixNMatchers from ".";

declare module "@jest/expect" {
  interface Matchers<R> extends mixNMatchers.MixNMatchers<R> {}
  interface AsymmetricMatchers extends mixNMatchers.AsymmetricMixNMatchers {
    enum: mixNMatchers.AsymmetricMixNMatchers["ofEnum"];
  }
}

expect.extend(mixNMatchers);
expect.extend({ enum: mixNMatchers.ofEnum });
