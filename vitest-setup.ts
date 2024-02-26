import { expect, describe, it, vi } from "vitest";
import { alignedAnsiStyleSerializer } from "./src/utils/tests";
import type * as globals from "@globals";

expect.addSnapshotSerializer(alignedAnsiStyleSerializer);

vi.mock("@globals", (): typeof globals => {
  return { describe, it, expect, fn: vi.fn };
});
