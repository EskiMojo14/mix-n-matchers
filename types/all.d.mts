import type { AsymmetricMixNMatchers, MixNMatchers } from "mix-n-matchers";

declare global {
  namespace jest {
    interface Matchers<R, T> extends MixNMatchers<R, T> {}

    interface Expect extends AsymmetricMixNMatchers {
      enum: AsymmetricMixNMatchers["ofEnum"];
    }

    interface InverseAsymmetricMatchers extends AsymmetricMixNMatchers {
      enum: AsymmetricMixNMatchers["ofEnum"];
    }
  }
}
