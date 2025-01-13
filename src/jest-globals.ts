import { expect } from "@jest/globals";
import * as mixNMatchers from ".";

declare module "@jest/expect" {
  interface Matchers<R, T> extends mixNMatchers.MixNMatchers<R, T> {}
  interface AsymmetricMatchers extends mixNMatchers.AsymmetricMixNMatchers {
    enum: mixNMatchers.AsymmetricMixNMatchers["ofEnum"];
  }
}

expect.extend(mixNMatchers);
expect.extend({ enum: mixNMatchers.ofEnum });
