import { expect, describe, it, vi, beforeAll, afterAll } from "vitest";
import type * as globals from "@globals";
import { alignedAnsiStyleSerializer, errorCauseSerializer } from "./src/utils/tests";

expect.addSnapshotSerializer(alignedAnsiStyleSerializer);
expect.addSnapshotSerializer(errorCauseSerializer);

vi.mock("@globals", (): typeof globals => {
  return { describe, it, expect, fn: vi.fn, beforeAll, afterAll };
});
