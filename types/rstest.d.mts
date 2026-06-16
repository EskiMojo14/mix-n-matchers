import type { AsymmetricMixNMatchers, MixNMatchers } from "mix-n-matchers";

declare module "@rstest/core" {
  interface Assertion<T> extends MixNMatchers<void, T> {}

  interface AsymmetricMatchersContaining extends AsymmetricMixNMatchers {
    enum: AsymmetricMixNMatchers["ofEnum"];
  }
}
