import { mergeConfig } from "vite-plus";
import defaultConfig from "./vite.config";

export default mergeConfig(defaultConfig, {
  test: {
    setupFiles: ["mix-n-matchers/vitest", "./vitest-setup.ts"],
    alias: {
      "mix-n-matchers": "./dist/index.mjs",
    },
  },
});
