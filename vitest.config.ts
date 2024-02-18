import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["./src/vitest"],
    include: ["src/**/*.vi.test.ts"],
  },
});
