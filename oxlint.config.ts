import { defineConfig } from "oxlint";

export default defineConfig({
  ignorePatterns: ["dist", "website/build"],
  options: {
    typeAware: true,
    reportUnusedDisableDirectives: "error",
  },
  categories: {
    correctness: "error",
    suspicious: "warn",
  },
  rules: {
    "eslint/no-shadow": "off",
    "typescript/array-type": ["error", { default: "generic" }],
    "react/react-in-jsx-scope": "off",
    "typescript/no-unsafe-type-assertion": "off",
    "typescript/consistent-type-imports": "error",
  },
  settings: {
    vitest: {
      typecheck: true,
    },
  },
  env: {
    builtin: true,
  },
  overrides: [
    {
      files: ["**/*.test.ts", "**/*.test.tsx"],
      plugins: ["vitest"],
    },
  ],
});
