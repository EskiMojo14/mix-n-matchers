import type { Config } from "jest";
import { pathsToModuleNameMapper } from "ts-jest";
import tsconfig from "./tsconfig.json" with { type: "json" };

const config = {
  preset: "ts-jest/presets/js-with-ts-esm",
  moduleNameMapper:
    pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
      useESM: true,
      prefix: "<rootDir>/",
    }) ?? {},
  setupFilesAfterEnv: ["<rootDir>/src/jest-globals.ts", "<rootDir>/jest-setup.ts"],
} satisfies Config;

export default config;
