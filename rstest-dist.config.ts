import { mergeRstestConfig } from "@rstest/core";
import defaultConfig from "./rstest.config";

export default mergeRstestConfig(defaultConfig, {
  setupFiles: ["mix-n-matchers/rstest", "./rstest-setup.ts"],
});
