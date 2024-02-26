import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    setupFiles: ["./src/vitest", "./vitest-setup.ts"],
    resolveSnapshotPath: (testPath, snapshotExtension) => {
      return path.join(
        path.dirname(testPath),
        "__snapshots__",
        path.basename(testPath).replace(".test", ".vi.test") +
          snapshotExtension,
      );
    },
    alias: {
      "@globals": import.meta.resolve("./src/utils/globals.ts"),
    },
  },
});
