import * as path from "node:path";
import { defineConfig } from "@rstest/core";

export default defineConfig({
  setupFiles: ["./src/rstest", "./rstest-setup.ts"],
  resolve: {
    alias: {
      "@globals": import.meta.resolve("./src/utils/globals"),
    },
  },
  resolveSnapshotPath: (testPath, snapshotExtension) => {
    return path.join(
      path.dirname(testPath),
      "__rs_snapshots__",
      path.basename(testPath) + snapshotExtension,
    );
  },
});
