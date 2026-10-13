import { create } from "mutative";

import baseConfig from "./jest.config.ts";

export default create(baseConfig, (draftConfig) => {
  draftConfig.setupFilesAfterEnv = ["mix-n-matchers/jest-globals", "<rootDir>/jest-setup.ts"];
  for (const [key, value] of Object.entries(baseConfig.moduleNameMapper)) {
    if (typeof value === "string" && value.includes("/src/index")) {
      delete draftConfig.moduleNameMapper[key];
    }
  }
});
