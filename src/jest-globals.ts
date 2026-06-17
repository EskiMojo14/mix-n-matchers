import { expect } from "@jest/globals";
import * as mixNMatchers from "mix-n-matchers";

expect.extend(mixNMatchers);
expect.extend({ enum: mixNMatchers.ofEnum });
