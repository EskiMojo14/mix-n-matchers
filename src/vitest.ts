import { expect } from "vitest";
import * as mixNMatchers from "mix-n-matchers";

expect.extend(mixNMatchers);
expect.extend({ enum: mixNMatchers.ofEnum });
