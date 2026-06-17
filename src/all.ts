import type { expect } from "@jest/globals";
import * as mixNMatchers from "mix-n-matchers";

const jestExpect = (globalThis as { expect?: typeof expect }).expect;

if (jestExpect !== undefined) {
  jestExpect.extend(mixNMatchers);
  jestExpect.extend({ enum: mixNMatchers.ofEnum });
} else {
  throw new Error(
    "Unable to find Jest's global expect. " +
      "Please check you have added mix-n-matchers correctly to your jest configuration. " +
      "See https://github.com/EskiMojo14/mix-n-matchers#setup for help.",
  );
}
