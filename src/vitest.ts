/* eslint-disable @typescript-eslint/no-empty-interface */
import { expect } from "vitest";
import * as mixNMatchers from ".";

declare module "vitest" {
  interface Assertion<T = any> extends mixNMatchers.MixNMatchers<T> {}
  interface AsymmetricMatchersContaining
    extends mixNMatchers.AsymmetricMixNMatchers {
    enum: mixNMatchers.AsymmetricMixNMatchers["ofEnum"];
  }
}

expect.extend(mixNMatchers);
expect.extend({ enum: mixNMatchers.ofEnum });
