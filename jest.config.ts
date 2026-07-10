import type { Config } from "jest";
import { pathsToModuleNameMapper } from "ts-jest";
import tsconfig from "./tsconfig.json" with { type: "json" };

const config: Config = {
  preset: "ts-jest/presets/js-with-ts-esm",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  roots: ["<rootDir>"],
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
    useESM: true,
    prefix: "<rootDir>/",
  }),
  setupFilesAfterEnv: ["<rootDir>/src/jest-globals.ts", "<rootDir>/jest-setup.ts"],
};

export default config;
