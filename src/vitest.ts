import { expect } from "vite-plus/test";
import * as mixNMatchers from "mix-n-matchers";

expect.extend(mixNMatchers);
expect.extend({ enum: mixNMatchers.ofEnum });
