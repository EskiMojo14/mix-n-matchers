import { expect, describe, it, vi } from "vitest";
import type * as globals from "@globals";
import { alignedAnsiStyleSerializer } from "./src/utils/tests";

expect.addSnapshotSerializer(alignedAnsiStyleSerializer);

vi.mock("@globals", (): typeof globals => {
  return { describe, it, expect, fn: vi.fn };
});
