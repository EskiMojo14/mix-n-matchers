/* eslint-disable @typescript-eslint/no-empty-interface */
import * as mixNMatchers from "./index";

// @ts-expect-error expect isn't typed to be on global
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const jestExpect: jest.Expect | undefined = globalThis.expect;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> extends mixNMatchers.MixNMatchers<R> {}

    interface Expect extends mixNMatchers.AsymmetricMixNMatchers {}

    interface InverseAsymmetricMatchers
      extends mixNMatchers.AsymmetricMixNMatchers {}
  }
}

if (jestExpect !== undefined) {
  jestExpect.extend(mixNMatchers);
} else {
  throw new Error(
    "Unable to find Jest's global expect. " +
      "Please check you have added mix-n-matchers correctly to your jest configuration. " +
      "See https://github.com/EskiMojo14/mix-n-matchers#setup for help.",
  );
}
