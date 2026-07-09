import { expect, describe, it, vi } from "vitest";
import type * as globals from "@globals";
import { alignedAnsiStyleSerializer, errorSerializer } from "./src/utils/tests";

expect.addSnapshotSerializer(alignedAnsiStyleSerializer);
expect.addSnapshotSerializer(errorSerializer);

vi.mock("@globals", (): typeof globals => {
  return { describe, it, expect, fn: vi.fn };
});
