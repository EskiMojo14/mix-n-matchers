import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["mix-n-matchers/vitest", "./vitest-setup.ts"],
    include: ["src/**/*.vi.test.ts"],
  },
});
