/* eslint-disable @typescript-eslint/no-empty-interface */
import * as mixNMatchers from "./src";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> extends mixNMatchers.MixNMatchers<R> {}

    interface Expect extends mixNMatchers.AsymmetricMixNMatchers {}

    interface InverseAsymmetricMatchers
      extends mixNMatchers.AsymmetricMixNMatchers {}
  }
}

expect.extend(mixNMatchers);
