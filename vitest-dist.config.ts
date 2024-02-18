import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["mix-n-matchers/vitest"],
    include: ["src/**/*.vi.test.ts"],
  },
});
