import * as path from "node:path";

import { defineConfig } from "vite-plus";

export default defineConfig({
  test: {
    setupFiles: ["./src/vitest", "./vitest-setup.ts"],
    resolveSnapshotPath: (testPath, snapshotExtension) => {
      return path.join(
        path.dirname(testPath),
        "__vi_snapshots__",
        path.basename(testPath) + snapshotExtension,
      );
    },
    alias: {
      "@globals": "./src/utils/globals.ts",
      "mix-n-matchers": "./src/index.ts",
    },
  },
  lint: {
    ignorePatterns: ["dist", "website/build"],
    options: {
      typeAware: true,
      typeCheck: true,
      reportUnusedDisableDirectives: "error",
    },
    categories: {
      correctness: "error",
      suspicious: "warn",
    },
    rules: {
      "mix-n-matchers/no-instanceof-promise": "error",
      "eslint/no-shadow": "off",
      "typescript/array-type": ["error", { default: "generic" }],
      "react/react-in-jsx-scope": "off",
      "typescript/no-unsafe-type-assertion": "off",
      "typescript/consistent-type-imports": "error",
      "vite-plus/prefer-vite-plus-imports": "error",
    },
    settings: {
      vitest: {
        typecheck: true,
      },
    },
    jsPlugins: [
      { specifier: "./lint/index.mjs", name: "mix-n-matchers" },
      { name: "vite-plus", specifier: "vite-plus/oxlint-plugin" },
    ],
    env: {
      builtin: true,
    },
    overrides: [
      {
        files: ["**/*.test.ts", "**/*.test.tsx"],
        plugins: ["vitest"],
      },
    ],
  },
  fmt: {
    sortImports: true,
  },
  pack: {
    deps: {
      neverBundle: ["@jest/globals"],
    },
    dts: {
      entry: ["src/index.ts", "src/utilities.ts"],
    },
    entry: [
      "src/index.ts",
      "src/all.ts",
      "src/jest-globals.ts",
      "src/vitest.ts",
      "src/rstest.ts",
      "src/utilities.ts",
    ],
    format: ["esm", "cjs"],
    sourcemap: true,
  },
  staged: {
    "*": "vp fmt --no-error-on-unmatched-pattern",
  },
});
