import type { Config } from "jest";
import baseConfig from "./jest.config.ts";

const config: Config = {
  ...baseConfig,
  setupFilesAfterEnv: ["mix-n-matchers/jest-globals", "<rootDir>/jest-setup.ts"],
};

export default config;
