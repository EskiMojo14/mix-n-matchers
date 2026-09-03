import type { AsymmetricMixNMatchers, MixNMatchers } from "mix-n-matchers";

declare module "vitest" {
  interface Assertion<R, T> extends MixNMatchers<R, T> {}

  interface AsymmetricMatchersContaining extends AsymmetricMixNMatchers {
    enum: AsymmetricMixNMatchers["ofEnum"];
  }
}
