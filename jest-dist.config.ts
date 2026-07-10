import type { Config } from "jest";
import baseConfig from "./jest.config.ts";

const config = {
  ...baseConfig,
  moduleNameMapper: Object.fromEntries(
    Object.entries(baseConfig.moduleNameMapper ?? {}).filter(
      ([, value]) => !(typeof value === "string" && value.includes("/src/index")),
    ),
  ),
  setupFilesAfterEnv: ["mix-n-matchers/jest-globals", "<rootDir>/jest-setup.ts"],
} satisfies Config;

console.log(baseConfig.moduleNameMapper, config.moduleNameMapper);

export default config;
