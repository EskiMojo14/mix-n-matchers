import type { AsymmetricMixNMatchers, MixNMatchers } from "mix-n-matchers";

declare module "@jest/expect" {
  interface Matchers<R, T> extends MixNMatchers<R, T> {}

  interface AsymmetricMatchers extends AsymmetricMixNMatchers {
    enum: AsymmetricMixNMatchers["ofEnum"];
  }
}
