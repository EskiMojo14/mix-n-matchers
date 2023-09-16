import * as miscMatchers from "./dist";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Matchers<R> extends miscMatchers.MiscMatchers<R> {}
  }
}

expect.extend(miscMatchers);
