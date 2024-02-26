import type { Config } from "jest";
import { pathsToModuleNameMapper } from "ts-jest";
import { compilerOptions } from "./tsconfig.json";

const config: Config = {
  preset: "ts-jest/presets/js-with-ts-esm",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  roots: ["<rootDir>"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    useESM: true,
    prefix: "<rootDir>/",
  }),
};

export default config;
