/* eslint-disable @typescript-eslint/no-empty-interface */
import { expect } from "@jest/globals";
import * as mixNMatchers from "./index";

declare module "@jest/expect" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Matchers<R> extends mixNMatchers.MixNMatchers<R> {}
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface AsymmetricMatchers extends mixNMatchers.AsymmetricMixNMatchers {}
}

expect.extend(mixNMatchers);
