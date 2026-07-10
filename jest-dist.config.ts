import baseConfig from "./jest.config.ts";
import { create } from "mutative";

export default create(baseConfig, (draftConfig) => {
  draftConfig.setupFilesAfterEnv = ["mix-n-matchers/jest-globals", "<rootDir>/jest-setup.ts"];
  for (const [key, value] of Object.entries(baseConfig.moduleNameMapper)) {
    if (typeof value === "string" && value.includes("/src/index")) {
      delete draftConfig.moduleNameMapper[key];
    }
  }
});
