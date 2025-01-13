import { expect, describe, it, jest } from "@jest/globals";
import type * as globals from "@globals";
import { alignedAnsiStyleSerializer } from "./src/utils/tests";

expect.addSnapshotSerializer(alignedAnsiStyleSerializer);

jest.unstable_mockModule("@globals", (): typeof globals => {
  return { describe, it, expect, fn: jest.fn };
});
