import { mergeConfig } from "vitest/config";
import defaultConfig from "./vitest.config";

export default mergeConfig(defaultConfig, {
  test: {
    setupFiles: ["mix-n-matchers/vitest", "./vitest-setup.ts"],
  },
  alias: {
    "mix-n-matchers": "./dist/index.mjs",
  },
});
