import * as mixNMatchers from "mix-n-matchers";
import { expect } from "vite-plus/test";

expect.extend(mixNMatchers);
expect.extend({ enum: mixNMatchers.ofEnum });
