import type { AsymmetricMixNMatchers, MixNMatchers } from "mix-n-matchers";

declare module "vitest" {
  interface Assertion<T> extends MixNMatchers<void, T> {}

  interface AsymmetricMatchersContaining extends AsymmetricMixNMatchers {
    enum: AsymmetricMixNMatchers["ofEnum"];
  }
}
