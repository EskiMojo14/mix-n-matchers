import * as mixNMatchers from "./src";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Matchers<R> extends mixNMatchers.MixNMatchers<R> {}
  }
}

expect.extend(mixNMatchers);
