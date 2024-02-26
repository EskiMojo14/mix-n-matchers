import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["./src/vitest", "./vitest-setup.ts"],
    include: ["src/**/*.vi.test.ts"],
  },
});
