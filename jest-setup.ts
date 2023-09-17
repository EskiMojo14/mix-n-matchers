import * as mixNMatchers from "./src";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Matchers<R> extends mixNMatchers.MixNMatchers<R> {}

    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Expect extends mixNMatchers.AsymmetricMixNMatchers {}

    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface InverseAsymmetricMatchers
      extends mixNMatchers.InverseAsymmetricMixNMatchers {}
  }
}

expect.extend(mixNMatchers);
