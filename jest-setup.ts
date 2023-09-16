import type { MiscMatchers } from "./dist";
import { toHaveBeenCalledWithContext } from "./dist";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Matchers<R>
      extends Pick<MiscMatchers<R>, "toBeCalledWithContext"> {}
  }
}

expect.extend({ toHaveBeenCalledWithContext });
